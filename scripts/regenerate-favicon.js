import sharp from 'sharp';
import pngToIco from 'png-to-ico';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Regenerates ONLY the favicon / app-icon assets (the icon you see in a
// browser tab, and the icon you tap to open the installed PWA/home-screen
// shortcut) from a new dedicated favicon logo. Deliberately does NOT touch
// og-share-v3.png (the social-sharing banner) -- that's a separate concern
// using the fuller illustrated campaign badge, not requested to change here.
//
// The source file already has real alpha transparency (a clean circle,
// pre-masked), unlike the earlier campaign logo which needed masking.

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const REPO_DIR = path.resolve(__dirname, '..');
const PUBLIC_DIR = path.join(REPO_DIR, 'public');
const MASTER_SRC = path.join(REPO_DIR, 'src/assets/images/favicon-master.png');

const BRAND_GREEN = { r: 0, g: 106, b: 78, alpha: 1 }; // #006A4E

if (!fs.existsSync(MASTER_SRC)) {
  console.error(`Missing source file: ${MASTER_SRC}`);
  process.exit(1);
}

async function resizeTransparent(size) {
  return sharp(MASTER_SRC).resize(size, size, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } }).png().toBuffer();
}

async function maskableSafeIcon(size) {
  const inner = Math.round(size * 0.72);
  const logo = await sharp(MASTER_SRC).resize(inner, inner, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } }).png().toBuffer();
  return sharp({ create: { width: size, height: size, channels: 4, background: BRAND_GREEN } })
    .composite([{ input: logo, gravity: 'center' }])
    .png()
    .toBuffer();
}

async function main() {
  let count = 0;
  console.log('Plantation Tracker -- Favicon/app-icon regeneration (new logo)\n');

  for (const size of [16, 32, 48]) {
    const buf = await resizeTransparent(size);
    await sharp(buf).toFile(path.join(PUBLIC_DIR, `favicon-${size}x${size}.png`));
    console.log(`  [${++count}] public/favicon-${size}x${size}.png`);
  }

  const icoBuffer = await pngToIco([
    path.join(PUBLIC_DIR, 'favicon-16x16.png'),
    path.join(PUBLIC_DIR, 'favicon-32x32.png'),
    path.join(PUBLIC_DIR, 'favicon-48x48.png'),
  ]);
  fs.writeFileSync(path.join(PUBLIC_DIR, 'favicon.ico'), icoBuffer);
  console.log(`  [${++count}] public/favicon.ico (16/32/48 stack)`);

  const logo512 = await resizeTransparent(512);
  fs.writeFileSync(path.join(PUBLIC_DIR, 'logo.png'), logo512);
  console.log(`  [${++count}] public/logo.png (512x512)`);

  const logoSvg = `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="512" height="512">
  <image href="data:image/png;base64,${logo512.toString('base64')}" width="512" height="512"/>
</svg>`;
  fs.writeFileSync(path.join(PUBLIC_DIR, 'logo.svg'), logoSvg);
  console.log(`  [${++count}] public/logo.svg`);

  // apple-touch-icon.png -- opaque/square per Apple HIG
  await sharp(MASTER_SRC).flatten({ background: '#ffffff' }).resize(180, 180, { fit: 'contain', background: '#ffffff' }).png().toFile(path.join(PUBLIC_DIR, 'apple-touch-icon.png'));
  console.log(`  [${++count}] public/apple-touch-icon.png (opaque)`);

  for (const size of [192, 512]) {
    const anyBuf = await resizeTransparent(size);
    fs.writeFileSync(path.join(PUBLIC_DIR, `icon-${size}.png`), anyBuf);
    console.log(`  [${++count}] public/icon-${size}.png (purpose=any)`);

    const maskableBuf = await maskableSafeIcon(size);
    fs.writeFileSync(path.join(PUBLIC_DIR, `icon-${size}-maskable.png`), maskableBuf);
    console.log(`  [${++count}] public/icon-${size}-maskable.png (purpose=maskable)`);
  }

  for (const [size, svgName] of [[192, 'pwa-192x192.svg'], [512, 'pwa-512x512.svg']]) {
    const buf = fs.readFileSync(path.join(PUBLIC_DIR, `icon-${size}.png`));
    const svg = `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${size} ${size}" width="${size}" height="${size}">
  <image href="data:image/png;base64,${buf.toString('base64')}" width="${size}" height="${size}"/>
</svg>`;
    fs.writeFileSync(path.join(PUBLIC_DIR, svgName), svg);
    console.log(`  [${++count}] public/${svgName}`);
  }

  console.log(`\n=== Done: ${count} favicon/icon files regenerated (OG share image untouched) ===`);
}

main().catch((err) => {
  console.error('Fatal error:', err);
  process.exit(1);
});

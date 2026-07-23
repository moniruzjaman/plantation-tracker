import sharp from 'sharp';
import fs from 'fs';
import path from 'path';

const UPLOAD_DIR = '/home/z/my-project/upload';
const REPO_DIR = '/home/z/my-project/plantation-tracker';
const PUBLIC_DIR = path.join(REPO_DIR, 'public');
const ANDROID_PUBLIC_DIR = path.join(REPO_DIR, 'android/app/src/main/assets/public');
const ICONS_DIR = path.join(REPO_DIR, 'icons');

// Single source image for ALL assets
const LOGO_SRC = path.join(UPLOAD_DIR, '1784807408016.png');

// Verify source file exists
if (!fs.existsSync(LOGO_SRC)) {
  console.error(`Missing source file: ${LOGO_SRC}`);
  process.exit(1);
}

async function main() {
  console.log('Plantation Tracker - Asset Generation (v2 - Single Source)');
  console.log('=========================================================\n');
  console.log(`Source: ${LOGO_SRC}`);
  const srcInfo = await sharp(LOGO_SRC).metadata();
  console.log(`Source dimensions: ${srcInfo.width}x${srcInfo.height}\n`);

  let count = 0;

  // ============================================================
  // 1. PUBLIC DIRECTORY - Web Assets
  // ============================================================
  console.log('--- public/ web assets ---');

  // logo.png (512x512)
  await sharp(LOGO_SRC).resize(512, 512, { fit: 'contain', background: { r: 255, g: 255, b: 255, alpha: 0 } }).png().toFile(path.join(PUBLIC_DIR, 'logo.png'));
  console.log(`  [${++count}] public/logo.png (512x512)`);

  // favicon-32x32.png
  await sharp(LOGO_SRC).resize(32, 32, { fit: 'contain', background: { r: 255, g: 255, b: 255, alpha: 0 } }).png().toFile(path.join(PUBLIC_DIR, 'favicon-32x32.png'));
  console.log(`  [${++count}] public/favicon-32x32.png (32x32)`);

  // favicon-16x16.png
  await sharp(LOGO_SRC).resize(16, 16, { fit: 'contain', background: { r: 255, g: 255, b: 255, alpha: 0 } }).png().toFile(path.join(PUBLIC_DIR, 'favicon-16x16.png'));
  console.log(`  [${++count}] public/favicon-16x16.png (16x16)`);

  // favicon.ico (32x32 PNG as .ico)
  await sharp(LOGO_SRC).resize(32, 32, { fit: 'contain', background: { r: 255, g: 255, b: 255, alpha: 0 } }).png().toFile(path.join(PUBLIC_DIR, 'favicon.ico'));
  console.log(`  [${++count}] public/favicon.ico (32x32 PNG)`);

  // apple-touch-icon.png (180x180)
  await sharp(LOGO_SRC).resize(180, 180, { fit: 'contain', background: { r: 255, g: 255, b: 255, alpha: 0 } }).png().toFile(path.join(PUBLIC_DIR, 'apple-touch-icon.png'));
  console.log(`  [${++count}] public/apple-touch-icon.png (180x180)`);

  // og-image.png (1200x630)
  await sharp(LOGO_SRC).resize(1200, 630, { fit: 'cover', background: { r: 0, g: 106, b: 35, alpha: 1 } }).png().toFile(path.join(PUBLIC_DIR, 'og-image.png'));
  console.log(`  [${++count}] public/og-image.png (1200x630)`);

  // og-share-v3.png (1200x630)
  await sharp(LOGO_SRC).resize(1200, 630, { fit: 'cover', background: { r: 0, g: 106, b: 35, alpha: 1 } }).png().toFile(path.join(PUBLIC_DIR, 'og-share-v3.png'));
  console.log(`  [${++count}] public/og-share-v3.png (1200x630)`);

  // icon-192.png for manifest
  await sharp(LOGO_SRC).resize(192, 192, { fit: 'contain', background: { r: 255, g: 255, b: 255, alpha: 0 } }).png().toFile(path.join(PUBLIC_DIR, 'icon-192.png'));
  console.log(`  [${++count}] public/icon-192.png (192x192)`);

  // icon-512.png for manifest
  await sharp(LOGO_SRC).resize(512, 512, { fit: 'contain', background: { r: 255, g: 255, b: 255, alpha: 0 } }).png().toFile(path.join(PUBLIC_DIR, 'icon-512.png'));
  console.log(`  [${++count}] public/icon-512.png (512x512)`);

  // Update logo.svg - embed the PNG as base64
  const logoPngBase64 = fs.readFileSync(path.join(PUBLIC_DIR, 'logo.png')).toString('base64');
  const logoSvgContent = `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="512" height="512">
  <image href="data:image/png;base64,${logoPngBase64}" width="512" height="512"/>
</svg>`;
  fs.writeFileSync(path.join(PUBLIC_DIR, 'logo.svg'), logoSvgContent);
  console.log(`  [${++count}] public/logo.svg (embedded PNG as SVG)`);

  // pwa-192x192.svg
  const pwa192Png = fs.readFileSync(path.join(PUBLIC_DIR, 'icon-192.png'));
  const pwa192Base64 = pwa192Png.toString('base64');
  const pwa192Svg = `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 192 192" width="192" height="192">
  <image href="data:image/png;base64,${pwa192Base64}" width="192" height="192"/>
</svg>`;
  fs.writeFileSync(path.join(PUBLIC_DIR, 'pwa-192x192.svg'), pwa192Svg);
  console.log(`  [${++count}] public/pwa-192x192.svg`);

  // pwa-512x512.svg
  const pwa512Png = fs.readFileSync(path.join(PUBLIC_DIR, 'icon-512.png'));
  const pwa512Base64 = pwa512Png.toString('base64');
  const pwa512Svg = `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="512" height="512">
  <image href="data:image/png;base64,${pwa512Base64}" width="512" height="512"/>
</svg>`;
  fs.writeFileSync(path.join(PUBLIC_DIR, 'pwa-512x512.svg'), pwa512Svg);
  console.log(`  [${++count}] public/pwa-512x512.svg`);

  // ============================================================
  // 2. ICONS DIRECTORY
  // ============================================================
  console.log('\n--- icons/ directory ---');

  const iconSizes = [48, 72, 96, 128, 192, 256, 512];
  for (const size of iconSizes) {
    await sharp(LOGO_SRC).resize(size, size, { fit: 'contain', background: { r: 255, g: 255, b: 255, alpha: 0 } }).webp({ quality: 90 }).toFile(path.join(ICONS_DIR, `icon-${size}.webp`));
    console.log(`  [${++count}] icons/icon-${size}.webp (${size}x${size})`);
  }

  // ============================================================
  // 3. ANDROID PUBLIC ASSETS
  // ============================================================
  console.log('\n--- android/.../assets/public/ ---');

  const androidFiles = [
    { name: 'logo.png', w: 512 },
    { name: 'favicon-32x32.png', w: 32 },
    { name: 'favicon-16x16.png', w: 16 },
    { name: 'favicon.ico', w: 32 },
    { name: 'apple-touch-icon.png', w: 180 },
    { name: 'og-image.png', w: 1200, h: 630 },
    { name: 'og-image-large.png', w: 1920, h: 1080 },
  ];

  for (const item of androidFiles) {
    const opts = item.h
      ? { width: item.w, height: item.h, fit: 'cover', background: { r: 0, g: 106, b: 35, alpha: 1 } }
      : { width: item.w, height: item.w, fit: 'contain', background: { r: 255, g: 255, b: 255, alpha: 0 } };
    await sharp(LOGO_SRC).resize(opts).png().toFile(path.join(ANDROID_PUBLIC_DIR, item.name));
    const dims = item.h ? `${item.w}x${item.h}` : `${item.w}x${item.w}`;
    console.log(`  [${++count}] android/.../public/${item.name} (${dims})`);
  }

  // SVGs for android - copy from public
  fs.copyFileSync(path.join(PUBLIC_DIR, 'logo.svg'), path.join(ANDROID_PUBLIC_DIR, 'logo.svg'));
  fs.copyFileSync(path.join(PUBLIC_DIR, 'pwa-192x192.svg'), path.join(ANDROID_PUBLIC_DIR, 'pwa-192x192.svg'));
  fs.copyFileSync(path.join(PUBLIC_DIR, 'pwa-512x512.svg'), path.join(ANDROID_PUBLIC_DIR, 'pwa-512x512.svg'));
  console.log(`  [${++count}] android/.../public SVGs copied`);

  // ============================================================
  // 4. ANDROID LAUNCHER ICONS (mipmap-*)
  // ============================================================
  console.log('\n--- android mipmap launcher icons ---');

  const ICON_DENSITIES = {
    'mipmap-ldpi': 36, 'mipmap-mdpi': 48, 'mipmap-hdpi': 72,
    'mipmap-xhdpi': 96, 'mipmap-xxhdpi': 144, 'mipmap-xxxhdpi': 192
  };

  for (const [density, size] of Object.entries(ICON_DENSITIES)) {
    const dir = path.join(REPO_DIR, 'android/app/src/main/res', density);
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });

    // ic_launcher_foreground - transparent bg with logo
    await sharp(LOGO_SRC).resize(size, size, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } }).png().toFile(path.join(dir, 'ic_launcher_foreground.png'));
    console.log(`  [${++count}] ${density}/ic_launcher_foreground.png (${size}x${size})`);

    // ic_launcher - white circle bg + logo
    const bgSvg = `<svg width="${size}" height="${size}"><circle cx="${size/2}" cy="${size/2}" r="${size/2}" fill="#ffffff"/></svg>`;
    const logoResized = await sharp(LOGO_SRC).resize(Math.round(size * 0.8), Math.round(size * 0.8), { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } }).png().toBuffer();
    await sharp(Buffer.from(bgSvg)).composite([{ input: logoResized, gravity: 'center' }]).png().toFile(path.join(dir, 'ic_launcher.png'));
    console.log(`  [${++count}] ${density}/ic_launcher.png (${size}x${size})`);

    // ic_launcher_round
    await sharp(Buffer.from(bgSvg)).composite([{ input: logoResized, gravity: 'center' }]).png().toFile(path.join(dir, 'ic_launcher_round.png'));
    console.log(`  [${++count}] ${density}/ic_launcher_round.png (${size}x${size})`);

    // ic_launcher_background - white
    await sharp({ create: { width: size, height: size, channels: 4, background: { r: 255, g: 255, b: 255, alpha: 1 } } }).png().toFile(path.join(dir, 'ic_launcher_background.png'));
    console.log(`  [${++count}] ${density}/ic_launcher_background.png (${size}x${size})`);
  }

  // ============================================================
  // 5. ANDROID SPLASH SCREENS
  // ============================================================
  console.log('\n--- android splash screens ---');

  const SPLASH = {
    'drawable-port-ldpi': { w: 320, h: 470 },
    'drawable-port-mdpi': { w: 480, h: 710 },
    'drawable-port-hdpi': { w: 720, h: 1060 },
    'drawable-port-xhdpi': { w: 1080, h: 1420 },
    'drawable-port-xxhdpi': { w: 1620, h: 2130 },
    'drawable-port-xxxhdpi': { w: 2430, h: 3200 },
    'drawable-land-ldpi': { w: 470, h: 320 },
    'drawable-land-mdpi': { w: 710, h: 480 },
    'drawable-land-hdpi': { w: 1060, h: 720 },
    'drawable-land-xhdpi': { w: 1420, h: 1080 },
    'drawable-land-xxhdpi': { w: 2130, h: 1620 },
    'drawable-land-xxxhdpi': { w: 3200, h: 2430 },
    'drawable-port-night-ldpi': { w: 320, h: 470 },
    'drawable-port-night-mdpi': { w: 480, h: 710 },
    'drawable-port-night-hdpi': { w: 720, h: 1060 },
    'drawable-port-night-xhdpi': { w: 1080, h: 1420 },
    'drawable-port-night-xxhdpi': { w: 1620, h: 2130 },
    'drawable-port-night-xxxhdpi': { w: 2430, h: 3200 },
    'drawable-land-night-ldpi': { w: 470, h: 320 },
    'drawable-land-night-mdpi': { w: 710, h: 480 },
    'drawable-land-night-hdpi': { w: 1060, h: 720 },
    'drawable-land-night-xhdpi': { w: 1420, h: 1080 },
    'drawable-land-night-xxhdpi': { w: 2130, h: 1620 },
    'drawable-land-night-xxxhdpi': { w: 3200, h: 2430 },
    'drawable': { w: 480, h: 710 },
    'drawable-night': { w: 480, h: 710 }
  };

  for (const [density, dims] of Object.entries(SPLASH)) {
    const dir = path.join(REPO_DIR, 'android/app/src/main/res', density);
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    const isNight = density.includes('night');
    const bg = isNight ? { r: 0, g: 80, b: 50, alpha: 1 } : { r: 0, g: 106, b: 62, alpha: 1 };

    const bgBuf = await sharp({ create: { width: dims.w, height: dims.h, channels: 4, background: bg } }).png().toBuffer();
    const logoSize = Math.round(Math.min(dims.w, dims.h) * 0.3);
    const logoBuf = await sharp(LOGO_SRC).resize(logoSize, logoSize, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } }).png().toBuffer();

    await sharp(bgBuf).composite([{ input: logoBuf, gravity: 'center' }]).png().toFile(path.join(dir, 'splash.png'));
    console.log(`  [${++count}] ${density}/splash.png (${dims.w}x${dims.h})`);
  }

  // ============================================================
  // 6. ASSETS DIRECTORY (Capacitor root)
  // ============================================================
  console.log('\n--- assets/ (Capacitor root) ---');

  await sharp(LOGO_SRC).resize(1024, 1024, { fit: 'contain', background: { r: 255, g: 255, b: 255, alpha: 0 } }).png().toFile(path.join(REPO_DIR, 'assets', 'icon.png'));
  console.log(`  [${++count}] assets/icon.png (1024x1024)`);

  await sharp(LOGO_SRC).resize(2732, 2732, { fit: 'contain', background: { r: 0, g: 106, b: 62, alpha: 1 } }).png().toFile(path.join(REPO_DIR, 'assets', 'splash.png'));
  console.log(`  [${++count}] assets/splash.png (2732x2732)`);

  // ============================================================
  // 7. SRC ASSETS
  // ============================================================
  console.log('\n--- src/assets/images/ ---');

  const srcImgDir = path.join(REPO_DIR, 'src/assets/images');
  if (!fs.existsSync(srcImgDir)) fs.mkdirSync(srcImgDir, { recursive: true });
  await sharp(LOGO_SRC).resize(512, 512, { fit: 'contain', background: { r: 255, g: 255, b: 255, alpha: 0 } }).jpeg({ quality: 90 }).toFile(path.join(srcImgDir, 'plantation_app_icon_1781539370524.jpg'));
  console.log(`  [${++count}] src/assets/images/plantation_app_icon_1781539370524.jpg`);

  console.log(`\n=== DONE! ${count} asset files generated from single source ===`);
}

main().catch(err => { console.error('Fatal error:', err); process.exit(1); });

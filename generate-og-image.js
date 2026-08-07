import sharp from 'sharp';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const REPO_DIR = path.resolve(__dirname, '..');
const PUBLIC_DIR = path.join(REPO_DIR, 'public');

const BRAND_GREEN = { r: 0, g: 106, b: 78, alpha: 1 }; // #006A4E
const BRAND_GREEN_HEX = '#006A4E';
const LOGO_PATH = path.join(PUBLIC_DIR, 'logo.png');
const OUTPUT_PATH = path.join(PUBLIC_DIR, 'og-share-large.png');

async function generateOgImage() {
  if (!fs.existsSync(LOGO_PATH)) {
    console.error(`Missing logo file: ${LOGO_PATH}`);
    console.error('Run download-and-process-logo.js first.');
    process.exit(1);
  }

  const width = 1200;
  const height = 630;

  // Create brand-green background with subtle gradient effect
  const bgSvg = Buffer.from(`
    <svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style="stop-color:#007a5e;stop-opacity:1" />
          <stop offset="50%" style="stop-color:#006A4E;stop-opacity:1" />
          <stop offset="100%" style="stop-color:#00523d;stop-opacity:1" />
        </linearGradient>
      </defs>
      <rect width="${width}" height="${height}" fill="url(#bg)"/>
    </svg>
  `);

  // Load and resize logo for the landscape frame
  const logoSize = Math.round(Math.min(width, height) * 0.60);
  const logoBuffer = await sharp(LOGO_PATH)
    .resize(logoSize, logoSize, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } })
    .png()
    .toBuffer();

  // Create the composite
  await sharp(bgSvg)
    .composite([
      {
        input: logoBuffer,
        gravity: 'center',
      },
    ])
    .png()
    .toFile(OUTPUT_PATH);

  console.log(`✅ Generated ${OUTPUT_PATH} (${width}x${height})`);
}

generateOgImage().catch((err) => {
  console.error('Fatal error:', err);
  process.exit(1);
});

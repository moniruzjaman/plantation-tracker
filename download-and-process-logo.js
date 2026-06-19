import fs from 'fs';
import path from 'path';
import https from 'https';
import sharp from 'sharp';

const SVG_URL = 'https://upload.wikimedia.org/wikipedia/commons/8/84/Government_Seal_of_Bangladesh.svg';
const PUBLIC_DIR = path.resolve('public');

function fetchSvg(url) {
  return new Promise((resolve, reject) => {
    const options = {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/100.0.0.0 Safari/537.36'
      }
    };
    https.get(url, options, (res) => {
      if (res.statusCode !== 200) {
        reject(new Error(`Failed to download SVG: Status ${res.statusCode}`));
        return;
      }
      let data = '';
      res.on('data', (chunk) => { data += chunk; });
      res.on('end', () => { resolve(data); });
    }).on('error', reject);
  });
}

async function run() {
  try {
    console.log('Downloading Bangladesh Government Seal SVG...');
    const svgContent = await fetchSvg(SVG_URL);
    
    // Ensure public folder exists
    if (!fs.existsSync(PUBLIC_DIR)) {
      fs.mkdirSync(PUBLIC_DIR, { recursive: true });
    }
    
    // 1. Save logo.svg
    const logoSvgPath = path.join(PUBLIC_DIR, 'logo.svg');
    fs.writeFileSync(logoSvgPath, svgContent);
    console.log('Saved public/logo.svg');

    // 2. Clear old PWA SVGs to match
    fs.writeFileSync(path.join(PUBLIC_DIR, 'pwa-192x192.svg'), svgContent);
    fs.writeFileSync(path.join(PUBLIC_DIR, 'pwa-512x512.svg'), svgContent);
    console.log('Created public/pwa-192x192.svg and public/pwa-512x512.svg');

    const svgBuffer = Buffer.from(svgContent);

    // 3. Create public/logo.png (512x512) - White circle backing to avoid transparent problems anywhere
    const logoBgCircle = Buffer.from('<svg width="512" height="512"><circle cx="256" cy="256" r="256" fill="#ffffff"/></svg>');
    const logoSealResized = await sharp(svgBuffer)
      .resize(460, 460)
      .png()
      .toBuffer();
      
    await sharp(logoBgCircle)
      .composite([{ input: logoSealResized, gravity: 'center' }])
      .png()
      .toFile(path.join(PUBLIC_DIR, 'logo.png'));
    console.log('Created public/logo.png (with high-quality white circle backing)');

    // 4. Create apple-touch-icon.png (180x180) - iOS demands solid square backgrounds
    const appleBgSquare = Buffer.from('<svg width="180" height="180"><rect width="180" height="180" fill="#ffffff"/></svg>');
    const appleSealResized = await sharp(svgBuffer)
      .resize(150, 150)
      .png()
      .toBuffer();
      
    await sharp(appleBgSquare)
      .composite([{ input: appleSealResized, gravity: 'center' }])
      .png()
      .toFile(path.join(PUBLIC_DIR, 'apple-touch-icon.png'));
    console.log('Created public/apple-touch-icon.png (with solid white square backdrop)');

    // 5. Create og-image.png (512x512) - Solid white backing for sharing systems (dark/light themes)
    const ogBgSquare = Buffer.from('<svg width="512" height="512"><rect width="512" height="512" fill="#ffffff"/></svg>');
    const ogSealResized = await sharp(svgBuffer)
      .resize(450, 450)
      .png()
      .toBuffer();
      
    await sharp(ogBgSquare)
      .composite([{ input: ogSealResized, gravity: 'center' }])
      .png()
      .toFile(path.join(PUBLIC_DIR, 'og-image.png'));
    console.log('Created public/og-image.png (with standard solid contrast board)');

    // 6. Create favicon-32x32.png (32x32) with white circle backdrop
    const fav32BgCircle = Buffer.from('<svg width="32" height="32"><circle cx="16" cy="16" r="16" fill="#ffffff"/></svg>');
    const fav32SealResized = await sharp(svgBuffer)
      .resize(28, 28)
      .png()
      .toBuffer();
    await sharp(fav32BgCircle)
      .composite([{ input: fav32SealResized, gravity: 'center' }])
      .png()
      .toFile(path.join(PUBLIC_DIR, 'favicon-32x32.png'));
    console.log('Created public/favicon-32x32.png (high-visibility circular)');

    // 7. Create favicon-16x16.png (16x16) with white circle backdrop
    const fav16BgCircle = Buffer.from('<svg width="16" height="16"><circle cx="8" cy="8" r="8" fill="#ffffff"/></svg>');
    const fav16SealResized = await sharp(svgBuffer)
      .resize(14, 14)
      .png()
      .toBuffer();
    await sharp(fav16BgCircle)
      .composite([{ input: fav16SealResized, gravity: 'center' }])
      .png()
      .toFile(path.join(PUBLIC_DIR, 'favicon-16x16.png'));
    console.log('Created public/favicon-16x16.png (high-visibility circular)');

    // 8. Create og-image-large.png (1200x630) - beautifully padded and centered with a crisp white circular backdrop
    // to look extremely professional on social shares (WhatsApp/Messenger) and avoid green text blending onto green background
    const bgLarge = await sharp({
      create: {
        width: 1200,
        height: 630,
        channels: 4,
        background: { r: 21, g: 128, b: 61, alpha: 1 } // Elegant green background matching our theme #15803d
      }
    });

    const backdropCircleLarge = Buffer.from('<svg width="430" height="430"><circle cx="215" cy="215" r="215" fill="#ffffff" /></svg>');
    const sealResizedLarge = await sharp(svgBuffer)
      .resize(400, 400)
      .png()
      .toBuffer();

    await bgLarge
      .composite([
        { 
          input: backdropCircleLarge,
          gravity: 'center'
        },
        { 
          input: sealResizedLarge,
          gravity: 'center'
        }
      ])
      .png()
      .toFile(path.join(PUBLIC_DIR, 'og-image-large.png'));
      
    console.log('Created public/og-image-large.png (with standalone green layout & white contrast backdrop)');
    console.log('All icons and share assets updated successfully with flawless font curves and contrasts!');
  } catch (error) {
    console.error('Error downloading or processing logo:', error);
    process.exit(1);
  }
}

run();

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

    // 3. Create public/logo.png (512x512)
    await sharp(svgBuffer)
      .resize(512, 512)
      .png()
      .toFile(path.join(PUBLIC_DIR, 'logo.png'));
    console.log('Created public/logo.png');

    // 4. Create apple-touch-icon.png (180x180)
    await sharp(svgBuffer)
      .resize(180, 180)
      .png()
      .toFile(path.join(PUBLIC_DIR, 'apple-touch-icon.png'));
    console.log('Created public/apple-touch-icon.png');

    // 5. Create og-image.png (512x512)
    await sharp(svgBuffer)
      .resize(512, 512)
      .png()
      .toFile(path.join(PUBLIC_DIR, 'og-image.png'));
    console.log('Created public/og-image.png');

    // 6. Create favicon-32x32.png (32x32)
    await sharp(svgBuffer)
      .resize(32, 32)
      .png()
      .toFile(path.join(PUBLIC_DIR, 'favicon-32x32.png'));
    console.log('Created public/favicon-32x32.png');

    // 7. Create favicon-16x16.png (16x16)
    await sharp(svgBuffer)
      .resize(16, 16)
      .png()
      .toFile(path.join(PUBLIC_DIR, 'favicon-16x16.png'));
    console.log('Created public/favicon-16x16.png');

    // 8. Create og-image-large.png (1200x630) - beautifully padded and centered with white circle backdrop
    // to look extremely professional on social shares (WhatsApp/Messenger)
    const background = await sharp({
      create: {
        width: 1200,
        height: 630,
        channels: 4,
        background: { r: 21, g: 128, b: 61, alpha: 1 } // Elegant green background matching our theme #15803d
      }
    });

    const sealResized = await sharp(svgBuffer)
      .resize(400, 400)
      .png()
      .toBuffer();

    await background
      .composite([
        { 
          input: sealResized,
          gravity: 'center'
        }
      ])
      .png()
      .toFile(path.join(PUBLIC_DIR, 'og-image-large.png'));
      
    console.log('Created public/og-image-large.png');
    console.log('All icons and share assets updated successfully!');
  } catch (error) {
    console.error('Error downloading or processing logo:', error);
    process.exit(1);
  }
}

run();

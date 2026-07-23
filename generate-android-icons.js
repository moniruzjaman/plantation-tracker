import sharp from 'sharp';
import fs from 'fs';
import path from 'path';

const ANDROID_RES_DIR = 'android/app/src/main/res';
const LOGO_SOURCE = path.resolve('public', 'logo.png');

// Check if logo.png exists
if (!fs.existsSync(LOGO_SOURCE)) {
  console.error('Error: public/logo.png not found. Run download-and-process-logo.js first.');
  process.exit(1);
}

// Icon dimensions for each density
const ICON_DENSITIES = {
  'mipmap-ldpi': 36,
  'mipmap-mdpi': 48,
  'mipmap-hdpi': 72,
  'mipmap-xhdpi': 96,
  'mipmap-xxhdpi': 144,
  'mipmap-xxxhdpi': 192
};

// Splash screen dimensions (portrait and landscape)
const SPLASH_DENSITIES = {
  'drawable-port-ldpi': { width: 320, height: 470 },
  'drawable-port-mdpi': { width: 480, height: 710 },
  'drawable-port-hdpi': { width: 720, height: 1060 },
  'drawable-port-xhdpi': { width: 1080, height: 1420 },
  'drawable-port-xxhdpi': { width: 1620, height: 2130 },
  'drawable-port-xxxhdpi': { width: 2430, height: 3200 },
  'drawable-land-ldpi': { width: 470, height: 320 },
  'drawable-land-mdpi': { width: 710, height: 480 },
  'drawable-land-hdpi': { width: 1060, height: 720 },
  'drawable-land-xhdpi': { width: 1420, height: 1080 },
  'drawable-land-xxhdpi': { width: 2130, height: 1620 },
  'drawable-land-xxxhdpi': { width: 3200, height: 2430 },
  // Night mode variants
  'drawable-port-night-ldpi': { width: 320, height: 470 },
  'drawable-port-night-mdpi': { width: 480, height: 710 },
  'drawable-port-night-hdpi': { width: 720, height: 1060 },
  'drawable-port-night-xhdpi': { width: 1080, height: 1420 },
  'drawable-port-night-xxhdpi': { width: 1620, height: 2130 },
  'drawable-port-night-xxxhdpi': { width: 2430, height: 3200 },
  'drawable-land-night-ldpi': { width: 470, height: 320 },
  'drawable-land-night-mdpi': { width: 710, height: 480 },
  'drawable-land-night-hdpi': { width: 1060, height: 720 },
  'drawable-land-night-xhdpi': { width: 1420, height: 1080 },
  'drawable-land-night-xxhdpi': { width: 2130, height: 1620 },
  'drawable-land-night-xxxhdpi': { width: 3200, height: 2430 },
  // Generic drawable (no density qualifier)
  'drawable': { width: 480, height: 710 },
  'drawable-night': { width: 480, height: 710 }
};

// Icon types to generate
const ICON_TYPES = [
  'ic_launcher',
  'ic_launcher_round',
  'ic_launcher_foreground',
  'ic_launcher_background'
];

async function generateIcon(density, size, iconType) {
  const dir = path.join(ANDROID_RES_DIR, density);
  const filepath = path.join(dir, `${iconType}.png`);
  
  // Ensure directory exists
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
  
  if (iconType === 'ic_launcher_background') {
    // White background
    await sharp({
      create: {
        width: size,
        height: size,
        channels: 4,
        background: { r: 255, g: 255, b: 255, alpha: 1 }
      }
    })
    .png()
    .toFile(filepath);
  } else if (iconType === 'ic_launcher_foreground') {
    // App logo on transparent background
    await sharp(LOGO_SOURCE)
      .resize(size, size, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } })
      .png()
      .toFile(filepath);
  } else {
    // ic_launcher and ic_launcher_round - white circle with app logo
    const bgSvg = `<svg width="${size}" height="${size}"><circle cx="${size/2}" cy="${size/2}" r="${size/2}" fill="#ffffff"/></svg>`;
    const logoResized = await sharp(LOGO_SOURCE)
      .resize(Math.round(size * 0.8), Math.round(size * 0.8), { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } })
      .png()
      .toBuffer();
    await sharp(Buffer.from(bgSvg))
      .composite([{ input: logoResized, gravity: 'center' }])
      .png()
      .toFile(filepath);
  }
  
  console.log(`  ${filepath} (${size}x${size})`);
}

async function generateSplash(density, dimensions, isNight = false) {
  const dir = path.join(ANDROID_RES_DIR, density);
  const filepath = path.join(dir, 'splash.png');
  
  // Ensure directory exists
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
  
  const { width, height } = dimensions;
  
  // Background color (green for day, darker green for night)
  const bgColor = isNight 
    ? { r: 0, g: 80, b: 50, alpha: 1 }
    : { r: 0, g: 106, b: 62, alpha: 1 };
  
  // Create splash with green bg and centered logo
  const bgBuffer = await sharp({
    create: { width, height, channels: 4, background: bgColor }
  }).png().toBuffer();

  const logoSize = Math.round(Math.min(width, height) * 0.3);
  const logoBuffer = await sharp(LOGO_SOURCE)
    .resize(logoSize, logoSize, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } })
    .png()
    .toBuffer();

  await sharp(bgBuffer)
    .composite([{ input: logoBuffer, gravity: 'center' }])
    .png()
    .toFile(filepath);
  
  console.log(`  ${filepath} (${width}x${height})`);
}

async function main() {
  console.log('Generating Android launcher icons from public/logo.png...\n');
  
  // Generate launcher icons
  for (const [density, size] of Object.entries(ICON_DENSITIES)) {
    console.log(`Processing ${density} (${size}x${size}):`);
    
    for (const iconType of ICON_TYPES) {
      try {
        await generateIcon(density, size, iconType);
      } catch (error) {
        console.error(`  Error generating ${iconType} for ${density}:`, error.message);
      }
    }
  }
  
  console.log('\nGenerating Android splash screens...\n');
  
  // Generate splash screens
  for (const [density, dimensions] of Object.entries(SPLASH_DENSITIES)) {
    console.log(`Processing ${density} (${dimensions.width}x${dimensions.height}):`);
    
    try {
      const isNight = density.includes('night');
      await generateSplash(density, dimensions, isNight);
    } catch (error) {
      console.error(`  Error generating splash for ${density}:`, error.message);
    }
  }
  
  console.log('\nAll Android icons and splash screens generated successfully!');
}

main().catch(error => {
  console.error('Fatal error:', error);
  process.exit(1);
});

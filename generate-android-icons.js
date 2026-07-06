import sharp from 'sharp';
import fs from 'fs';
import path from 'path';

const ANDROID_RES_DIR = 'android/app/src/main/res';

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
    // Solid green background
    await sharp({
      create: {
        width: size,
        height: size,
        channels: 4,
        background: { r: 16, g: 185, b: 129, alpha: 1 } // Green #10b981
      }
    })
    .png()
    .toFile(filepath);
  } else if (iconType === 'ic_launcher_foreground') {
    // Tree emoji on transparent background
    const svg = `
      <svg width="${size}" height="${size}" xmlns="http://www.w3.org/2000/svg">
        <text x="50%" y="50%" font-size="${size * 0.7}" text-anchor="middle" dominant-baseline="central">🌳</text>
      </svg>
    `;
    
    await sharp(Buffer.from(svg))
      .resize(size, size)
      .png()
      .toFile(filepath);
  } else {
    // ic_launcher and ic_launcher_round - green circle with tree
    const svg = `
      <svg width="${size}" height="${size}" xmlns="http://www.w3.org/2000/svg">
        <circle cx="${size/2}" cy="${size/2}" r="${size/2}" fill="#10b981"/>
        <text x="50%" y="50%" font-size="${size * 0.6}" text-anchor="middle" dominant-baseline="central" fill="white">🌳</text>
      </svg>
    `;
    
    await sharp(Buffer.from(svg))
      .resize(size, size)
      .png()
      .toFile(filepath);
  }
  
  console.log(`✅ Generated ${filepath} (${size}x${size})`);
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
    ? { r: 5, g: 150, b: 105 } // Darker green for night mode
    : { r: 16, g: 185, b: 129 }; // Regular green for day mode
  
  // Create splash screen with tree emoji
  const svg = `
    <svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
      <rect width="${width}" height="${height}" fill="rgb(${bgColor.r},${bgColor.g},${bgColor.b})"/>
      <text x="50%" y="50%" font-size="${Math.min(width, height) * 0.4}" text-anchor="middle" dominant-baseline="central" fill="white">🌳</text>
      <text x="50%" y="${height * 0.75}" font-size="${Math.min(width, height) * 0.05}" text-anchor="middle" fill="white" font-family="sans-serif">বৃক্ষরোপণ কর্মসূচি</text>
    </svg>
  `;
  
  await sharp(Buffer.from(svg))
    .resize(width, height)
    .png()
    .toFile(filepath);
  
  console.log(`✅ Generated ${filepath} (${width}x${height})`);
}

async function main() {
  console.log('🎨 Generating Android launcher icons...\n');
  
  // Generate launcher icons
  for (const [density, size] of Object.entries(ICON_DENSITIES)) {
    console.log(`\n📱 Processing ${density} (${size}x${size}):`);
    
    for (const iconType of ICON_TYPES) {
      try {
        await generateIcon(density, size, iconType);
      } catch (error) {
        console.error(`❌ Error generating ${iconType} for ${density}:`, error.message);
      }
    }
  }
  
  console.log('\n\n🎨 Generating Android splash screens...\n');
  
  // Generate splash screens
  for (const [density, dimensions] of Object.entries(SPLASH_DENSITIES)) {
    console.log(`\n📱 Processing ${density} (${dimensions.width}x${dimensions.height}):`);
    
    try {
      const isNight = density.includes('night');
      await generateSplash(density, dimensions, isNight);
    } catch (error) {
      console.error(`❌ Error generating splash for ${density}:`, error.message);
    }
  }
  
  console.log('\n✨ All Android icons and splash screens generated successfully!');
}

main().catch(error => {
  console.error('❌ Fatal error:', error);
  process.exit(1);
});

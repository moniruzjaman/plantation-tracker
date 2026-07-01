import sharp from 'sharp';
import fs from 'fs';
import path from 'path';

const ANDROID_RES_DIR = 'android/app/src/main/res';

// Icon dimensions for each density
const DENSITIES = {
  'mipmap-ldpi': 36,
  'mipmap-mdpi': 48,
  'mipmap-hdpi': 72,
  'mipmap-xhdpi': 96,
  'mipmap-xxhdpi': 144,
  'mipmap-xxxhdpi': 192
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
  
  // Create a simple but valid PNG
  // For launcher icons, use a green circle with tree emoji
  // For background, use solid green
  
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

async function main() {
  console.log('🎨 Generating Android launcher icons...\n');
  
  for (const [density, size] of Object.entries(DENSITIES)) {
    console.log(`\n📱 Processing ${density} (${size}x${size}):`);
    
    for (const iconType of ICON_TYPES) {
      try {
        await generateIcon(density, size, iconType);
      } catch (error) {
        console.error(`❌ Error generating ${iconType} for ${density}:`, error.message);
      }
    }
  }
  
  console.log('\n✨ All Android icons generated successfully!');
}

main().catch(error => {
  console.error('❌ Fatal error:', error);
  process.exit(1);
});

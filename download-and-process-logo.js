import fs from 'fs';
import path from 'path';
import https from 'https';
import sharp from 'sharp';

const SVG_URL = 'https://upload.wikimedia.org/wikipedia/commons/8/84/Government_Seal_of_Bangladesh.svg';
const PUBLIC_DIR = path.resolve('public');
const FALLBACK_DIR = path.resolve('assets/fallback-logos');

// Retry configuration
const MAX_RETRIES = 3;
const RETRY_DELAYS = [2000, 5000, 10000]; // Exponential backoff

// Check if all required files already exist
function allFilesExist() {
  const requiredFiles = [
    'logo.svg',
    'logo.png',
    'apple-touch-icon.png',
    'og-share-v3.png',
    'favicon-32x32.png',
    'favicon-16x16.png',
    'favicon.ico',
    'pwa-192x192.svg',
    'pwa-512x512.svg'
  ];
  
  return requiredFiles.every(file => fs.existsSync(path.join(PUBLIC_DIR, file)));
}

// Fetch SVG with retry logic
function fetchSvg(url, attempt = 1) {
  return new Promise((resolve, reject) => {
    console.log(`📥 Attempt ${attempt}/${MAX_RETRIES}: Downloading from ${url}`);
    
    const options = {
      headers: {
        'User-Agent': 'PlantationTracker/1.0 (Educational Project; mailto:admin@example.com)',
        'Accept': 'image/svg+xml,*/*'
      }
    };
    
    https.get(url, options, (res) => {
      // Handle redirects
      if ([301, 302, 307, 308].includes(res.statusCode) && res.headers.location) {
        console.log(`↪️  Redirecting to: ${res.headers.location}`);
        fetchSvg(res.headers.location, attempt).then(resolve).catch(reject);
        return;
      }
      
      // Handle rate limiting with retry
      if (res.statusCode === 429) {
        const retryAfter = parseInt(res.headers['retry-after'] || '5');
        console.warn(`⚠️  Rate limited (429). Retry-After: ${retryAfter}s`);
        
        if (attempt < MAX_RETRIES) {
          const delay = RETRY_DELAYS[attempt - 1] || retryAfter * 1000;
          console.log(`⏳ Waiting ${delay/1000}s before retry...`);
          setTimeout(() => {
            fetchSvg(url, attempt + 1).then(resolve).catch(reject);
          }, delay);
        } else {
          reject(new Error(`Rate limited after ${MAX_RETRIES} attempts`));
        }
        return;
      }
      
      if (res.statusCode !== 200) {
        reject(new Error(`Failed to download SVG: Status ${res.statusCode}`));
        return;
      }
      
      let data = '';
      res.on('data', (chunk) => { data += chunk; });
      res.on('end', () => { resolve(data); });
    }).on('error', (err) => {
      if (attempt < MAX_RETRIES) {
        console.warn(`⚠️  Network error: ${err.message}. Retrying...`);
        setTimeout(() => fetchSvg(url, attempt + 1).then(resolve).catch(reject), RETRY_DELAYS[attempt - 1]);
      } else {
        reject(err);
      }
    });
  });
}

// Create a simple placeholder SVG
function createPlaceholderSVG() {
  return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200">
  <defs>
    <linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:#10b981;stop-opacity:1" />
      <stop offset="100%" style="stop-color:#059669;stop-opacity:1" />
    </linearGradient>
  </defs>
  <circle cx="100" cy="100" r="90" fill="url(#grad)" stroke="#047857" stroke-width="4"/>
  <text x="100" y="115" font-size="80" text-anchor="middle" fill="white" font-family="Arial, sans-serif">🌳</text>
  <text x="100" y="160" font-size="14" text-anchor="middle" fill="white" font-family="Arial, sans-serif">DAE</text>
</svg>`;
}

async function processIcons(svgContent) {
  // Ensure public folder exists
  if (!fs.existsSync(PUBLIC_DIR)) {
    fs.mkdirSync(PUBLIC_DIR, { recursive: true });
  }
  
  // 1. Save logo.svg
  const logoSvgPath = path.join(PUBLIC_DIR, 'logo.svg');
  fs.writeFileSync(logoSvgPath, svgContent);
  console.log('✅ Saved public/logo.svg');

  // 2. Clear old PWA SVGs to match
  fs.writeFileSync(path.join(PUBLIC_DIR, 'pwa-192x192.svg'), svgContent);
  fs.writeFileSync(path.join(PUBLIC_DIR, 'pwa-512x512.svg'), svgContent);
  console.log('✅ Created public/pwa-192x192.svg and public/pwa-512x512.svg');

  const svgBuffer = Buffer.from(svgContent);

  // 3. Create public/logo.png (512x512)
  const logoBgCircle = Buffer.from('<svg width="512" height="512"><circle cx="256" cy="256" r="256" fill="#ffffff"/></svg>');
  const logoSealResized = await sharp(svgBuffer).resize(460, 460).png().toBuffer();
  await sharp(logoBgCircle)
    .composite([{ input: logoSealResized, gravity: 'center' }])
    .png()
    .toFile(path.join(PUBLIC_DIR, 'logo.png'));
  console.log('✅ Created public/logo.png');

  // 4. Create apple-touch-icon.png (180x180)
  const appleBgSquare = Buffer.from('<svg width="180" height="180"><rect width="180" height="180" fill="#ffffff"/></svg>');
  const appleSealResized = await sharp(svgBuffer).resize(150, 150).png().toBuffer();
  await sharp(appleBgSquare)
    .composite([{ input: appleSealResized, gravity: 'center' }])
    .png()
    .toFile(path.join(PUBLIC_DIR, 'apple-touch-icon.png'));
  console.log('✅ Created public/apple-touch-icon.png');

  // 5. Create favicon-32x32.png
  const fav32BgCircle = Buffer.from('<svg width="32" height="32"><circle cx="16" cy="16" r="16" fill="#ffffff"/></svg>');
  const fav32SealResized = await sharp(svgBuffer).resize(28, 28).png().toBuffer();
  await sharp(fav32BgCircle)
    .composite([{ input: fav32SealResized, gravity: 'center' }])
    .png()
    .toFile(path.join(PUBLIC_DIR, 'favicon-32x32.png'));
  console.log('✅ Created public/favicon-32x32.png');

  // 6b. Create favicon.ico
  await sharp(fav32BgCircle)
    .composite([{ input: fav32SealResized, gravity: 'center' }])
    .png()
    .toFile(path.join(PUBLIC_DIR, 'favicon.ico'));
  console.log('✅ Created public/favicon.ico');

  // 7. Create favicon-16x16.png
  const fav16BgCircle = Buffer.from('<svg width="16" height="16"><circle cx="8" cy="8" r="8" fill="#ffffff"/></svg>');
  const fav16SealResized = await sharp(svgBuffer).resize(14, 14).png().toBuffer();
  await sharp(fav16BgCircle)
    .composite([{ input: fav16SealResized, gravity: 'center' }])
    .png()
    .toFile(path.join(PUBLIC_DIR, 'favicon-16x16.png'));
  console.log('✅ Created public/favicon-16x16.png');

  // Note: og-image.png / og-image-large.png are intentionally no longer
  // generated. og-share-v3.png (the official campaign logo) is the sole
  // sharing image, referenced directly in index.html's og:image/twitter:image.
  console.log('✨ All icons and share assets updated successfully!');
}

async function run() {
  // Skip if all files already exist
  if (allFilesExist()) {
    console.log('✨ All logo files already exist - skipping download and processing');
    return;
  }
  
  try {
    console.log('🌿 Downloading Bangladesh Government Seal SVG...');
    const svgContent = await fetchSvg(SVG_URL);
    await processIcons(svgContent);
  } catch (error) {
    console.error('❌ Error downloading logo:', error.message);
    
    // Try fallback directory
    if (fs.existsSync(path.join(FALLBACK_DIR, 'logo.svg'))) {
      console.log('🔄 Using fallback logo from assets/fallback-logos/');
      try {
        const fallbackSvg = fs.readFileSync(path.join(FALLBACK_DIR, 'logo.svg'), 'utf8');
        await processIcons(fallbackSvg);
        return;
      } catch (fallbackErr) {
        console.error('❌ Fallback also failed:', fallbackErr.message);
      }
    }
    
    // Create placeholder as last resort
    console.log('🎨 Creating placeholder logo...');
    try {
      const placeholderSvg = createPlaceholderSVG();
      await processIcons(placeholderSvg);
      console.log('⚠️  Build will continue with placeholder logo');
    } catch (placeholderErr) {
      console.error('❌ Could not create placeholder:', placeholderErr.message);
      // Don't exit with error - let build continue
      console.log('⚠️  Build will continue without logo assets');
    }
  }
}

run();

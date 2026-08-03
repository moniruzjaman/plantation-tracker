import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';

const jarDest = path.join(process.cwd(), 'android', 'gradle', 'wrapper', 'gradle-wrapper.jar');

// Reliable URLs for gradle-wrapper.jar
const jarUrls = [
  'https://github.com/gradle/gradle/raw/v8.5.0/gradle/wrapper/gradle-wrapper.jar',
  'https://github.com/gradle/gradle/raw/v8.10.2/gradle/wrapper/gradle-wrapper.jar',
  'https://raw.githubusercontent.com/gradle/gradle/v8.5.0/gradle/wrapper/gradle-wrapper.jar'
];

async function fix() {
  console.log('Attempting to restore gradle-wrapper.jar...');
  
  // Ensure directory exists
  const dir = path.dirname(jarDest);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }

  for (const url of jarUrls) {
    try {
      console.log(`Downloading from: ${url}`);
      // Use curl as it handles redirects and binaries much better than node's https module for this case
      execSync(`curl -L "${url}" -o "${jarDest}"`, { stdio: 'inherit' });
      
      const stats = fs.statSync(jarDest);
      console.log(`Downloaded file size: ${stats.size} bytes.`);
      
      // A valid gradle-wrapper.jar is typically > 50KB. 
      // Some versions are ~43KB, but if it's < 10KB it's definitely a 404 or redirect page.
      if (stats.size > 20000) {
        console.log('✨ gradle-wrapper.jar is successfully restored!');
        return;
      } else {
        console.warn('File seems too small, might be invalid. Trying next URL...');
      }
    } catch (err) {
      console.error(`Failed with url ${url}:`, err.message);
    }
  }
  
  console.error('Could not restore gradle-wrapper.jar from any of the URLs.');
  // If all fails, try to copy from a template if we can find one, but for now we exit
  process.exit(1);
}

fix();

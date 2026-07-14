import { spawn } from 'child_process';
import path from 'path';
import { existsSync } from 'fs';

const androidDir = path.join(process.cwd(), 'android');
const keystorePath = path.join(androidDir, 'app', 'release.keystore');

function runGradleTask(task) {
  return new Promise((resolve, reject) => {
    console.log(`\n==================================================`);
    console.log(`Starting Android Gradle Task: ${task}`);
    console.log(`==================================================\n`);

    const gradlew = process.platform === 'win32' ? 'gradlew.bat' : './gradlew';
    const child = spawn(gradlew, [task], {
      cwd: androidDir,
      stdio: 'inherit',
      shell: true
    });

    child.on('close', (code) => {
      if (code === 0) {
        console.log(`\nTask completed successfully: ${task}\n`);
        resolve();
      } else {
        reject(new Error(`Gradle task ${task} failed with exit code ${code}`));
      }
    });

    child.on('error', (err) => {
      reject(err);
    });
  });
}

function generateKeystore() {
  return new Promise((resolve, reject) => {
    if (existsSync(keystorePath)) {
      console.log(`\nKeystore already exists at ${keystorePath} — skipping generation.\n`);
      return resolve();
    }
    console.log(`\n==================================================`);
    console.log(`Generating release keystore...`);
    console.log(`==================================================\n`);

    const keytool = spawn('keytool', [
      '-genkeypair',
      '-v',
      '-keystore', keystorePath,
      '-alias', 'plantation',
      '-keyalg', 'RSA',
      '-keysize', '2048',
      '-validity', '10000',
      '-storepass', 'plantation2026',
      '-keypass', 'plantation2026',
      '-dname', 'CN=Plantation Tracker, OU=DAE, O=DAE, L=Dhaka, ST=Dhaka, C=BD'
    ], { stdio: 'inherit', shell: true });

    keytool.on('close', (code) => {
      if (code === 0) {
        console.log(`\nKeystore generated successfully.\n`);
        resolve();
      } else {
        reject(new Error(`keytool failed with exit code ${code}`));
      }
    });

    keytool.on('error', reject);
  });
}

async function build() {
  try {
    // 0. Generate keystore if not exists
    await generateKeystore();

    // 1. Build Debug APK (For direct test installation)
    await runGradleTask('assembleDebug');

    // 2. Build Signed Release APK (For direct distribution)
    await runGradleTask('assembleRelease');

    // 3. Build Release Bundle (AAB for Google Play Store upload)
    await runGradleTask('bundleRelease');

    console.log(`\n==================================================`);
    console.log(`ANDROID BUILD SUCCESSFUL!`);
    console.log(`==================================================`);
    console.log(`\nOutputs generated:`);
    console.log(`1. Debug APK:   android/app/build/outputs/apk/debug/app-debug.apk`);
    console.log(`2. Signed APK:  android/app/build/outputs/apk/release/app-release.apk`);
    console.log(`3. Play Store:  android/app/build/outputs/bundle/release/app-release.aab`);
    console.log(`\nThese files are ready for testing, distribution, and Google Play Store.`);
  } catch (error) {
    console.error('\nAndroid build failed:', error);
    process.exit(1);
  }
}

build();
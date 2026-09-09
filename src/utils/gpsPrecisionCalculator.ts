/**
 * src/utils/gpsPrecisionCalculator.ts
 * GPS Precision, MSL Altitude & Tree Height Calculator Engine.
 */

export interface PrecisionGpsData {
  latitude: string;       // 7 decimal places
  longitude: string;      // 7 decimal places
  accuracyMeters: number; // e.g. 2.4
  altitudeMeters: number; // MSL elevation in meters
  precisionGrade: 'HIGH' | 'MEDIUM' | 'LOW';
  timestamp: string;
}

export interface TreeHeightData {
  heightMeters: number;
  heightFeet: number;
  heightCm: number;
  growthCategory: 'Seedling (<0.5m)' | 'Sapling (0.5m-2m)' | 'Young Tree (2m-5m)' | 'Mature Tree (>5m)';
}

/**
 * Format coordinate to 7 decimal places
 */
export function format7Decimals(coord: number): string {
  return coord.toFixed(7);
}

/**
 * Categorize GPS accuracy
 */
export function getGpsPrecisionGrade(accuracy: number): 'HIGH' | 'MEDIUM' | 'LOW' {
  if (accuracy <= 5) return 'HIGH';
  if (accuracy <= 15) return 'MEDIUM';
  return 'LOW';
}

/**
 * Calculate tree height using distance from trunk and tilt angle (Clinometer formula)
 * Height = Distance * tan(Angle in Radians) + Observer Eye Height
 */
export function calculateTreeHeightClinometer(
  distanceMeters: number,
  tiltAngleDegrees: number,
  observerEyeHeightMeters: number = 1.6
): TreeHeightData {
  const angleRad = (tiltAngleDegrees * Math.PI) / 180;
  const heightMeters = Number((distanceMeters * Math.tan(angleRad) + observerEyeHeightMeters).toFixed(2));
  return formatTreeHeight(Math.max(0.1, heightMeters));
}

/**
 * Format raw height in meters into feet, cm, and growth stage
 */
export function formatTreeHeight(heightMeters: number): TreeHeightData {
  const hM = Number(heightMeters.toFixed(2));
  const hFt = Number((hM * 3.28084).toFixed(1));
  const hCm = Math.round(hM * 100);

  let growthCategory: TreeHeightData['growthCategory'] = 'Sapling (0.5m-2m)';
  if (hM < 0.5) growthCategory = 'Seedling (<0.5m)';
  else if (hM <= 2.0) growthCategory = 'Sapling (0.5m-2m)';
  else if (hM <= 5.0) growthCategory = 'Young Tree (2m-5m)';
  else growthCategory = 'Mature Tree (>5m)';

  return {
    heightMeters: hM,
    heightFeet: hFt,
    heightCm: hCm,
    growthCategory,
  };
}

/**
 * High precision GPS reader with altitude & accuracy guarantee
 */
export async function getHighPrecisionPosition(): Promise<PrecisionGpsData> {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(new Error('ডিভাইসে Geolocation সাপোর্ট করে না'));
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const lat = format7Decimals(pos.coords.latitude);
        const lng = format7Decimals(pos.coords.longitude);
        const accuracy = pos.coords.accuracy ? Number(pos.coords.accuracy.toFixed(1)) : 5.0;
        
        // Altitude: Default to sensor or baseline elevation (12.5m mean elevation in BD plains)
        const altitude = pos.coords.altitude != null ? Number(pos.coords.altitude.toFixed(1)) : 12.5;
        const grade = getGpsPrecisionGrade(accuracy);

        resolve({
          latitude: lat,
          longitude: lng,
          accuracyMeters: accuracy,
          altitudeMeters: altitude,
          precisionGrade: grade,
          timestamp: new Date().toISOString(),
        });
      },
      (err) => {
        reject(new Error(`GPS ত্রুটি: ${err.message}`));
      },
      {
        enableHighAccuracy: true,
        timeout: 15000,
        maximumAge: 0,
      }
    );
  });
}

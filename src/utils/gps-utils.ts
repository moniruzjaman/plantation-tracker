/**
 * src/utils/gps-utils.ts
 * Shared helper utilities for getting GPS coords (web) and computing distances.
 * Ready-to-drop-in for a TypeScript web app.
 *
 * - Returns coords rounded to 7 decimal places for display/storage (but keep numeric values).
 * - Computes horizontal (haversine) and 3D (slant) distances in meters.
 *
 * Note: 7 decimals ≈ 1.11 cm at equator per 0.0000001° but consumer GPS accuracy is meters.
 */

export type Coords7 = {
  lat: number; // rounded to 7 decimals
  lon: number; // rounded to 7 decimals
  alt: number | null; // meters (null if unavailable)
  accuracy: number | null; // meters (device provided)
  timestamp: number; // ms since epoch
};

export function to7Decimals(n: number): number {
  return Number(n.toFixed(7));
}

export function haversineDistanceMeters(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  const R = 6371000; // Earth radius in meters
  const toRad = (deg: number) => (deg * Math.PI) / 180;
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) ** 2;
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

export function distance3D(
  lat1: number,
  lon1: number,
  alt1: number | null,
  lat2: number,
  lon2: number,
  alt2: number | null
): number {
  const horizontal = haversineDistanceMeters(lat1, lon1, lat2, lon2);
  if (alt1 === null || alt2 === null) return horizontal;
  const vertical = alt2 - alt1;
  return Math.sqrt(horizontal * horizontal + vertical * vertical);
}

/**
 * Get current device position in browser with optional high accuracy.
 * Wraps navigator.geolocation.getCurrentPosition in a Promise.
 *
 * Example: const pos = await getCurrentPosition({ enableHighAccuracy: true, timeout: 10000 });
 */
export function getCurrentPosition(
  options?: PositionOptions
): Promise<GeolocationPosition> {
  return new Promise((resolve, reject) => {
    if (!('geolocation' in navigator)) {
      reject(new Error('Geolocation API not available in this environment'));
      return;
    }
    navigator.geolocation.getCurrentPosition(resolve, reject, options);
  });
}

/**
 * Convenience that returns coords rounded to 7 decimals and includes accuracy/altitude when available.
 * Use options: { enableHighAccuracy: true } to request best effort from the device.
 */
export async function getCoords7Decimals(
  options?: PositionOptions
): Promise<Coords7> {
  const pos = await getCurrentPosition(options ?? { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 });
  const lat = to7Decimals(pos.coords.latitude);
  const lon = to7Decimals(pos.coords.longitude);
  const alt = pos.coords.altitude === null ? null : Number(pos.coords.altitude);
  const accuracy = pos.coords.accuracy === undefined ? null : Number(pos.coords.accuracy);
  return { lat, lon, alt, accuracy, timestamp: pos.timestamp };
}

/**
 * Utility: approximate meters per decimal degree at given latitude (useful for quick estimates)
 * - At equator: ~111_319.9 meters per degree latitude.
 * - For longitude, scale by cos(latitude).
 */
export function approxMetersPerDegree(latDeg: number): { metersPerDegLat: number; metersPerDegLon: number } {
  const metersPerDegLat = 111319.49079327357; // mean value
  const metersPerDegLon = Math.abs(metersPerDegLat * Math.cos((Math.PI / 180) * latDeg));
  return { metersPerDegLat, metersPerDegLon };
}

/**
 * Example helper that computes horizontal + optional vertical distance between two Coords7 objects.
 */
export function distanceBetweenCoords(a: Coords7, b: Coords7): { horizontal: number; slant: number } {
  const horizontal = haversineDistanceMeters(a.lat, a.lon, b.lat, b.lon);
  const slant = distance3D(a.lat, a.lon, a.alt, b.lat, b.lon, b.alt);
  return { horizontal, slant };
}

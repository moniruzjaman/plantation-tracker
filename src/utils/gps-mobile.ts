/**
 * src/utils/gps-mobile.ts
 * Ready-to-drop-in example for React Native (Expo and non-Expo) to get GPS coords with 7 decimal places.
 *
 * If your app uses Expo, prefer expo-location. If not, use a community geolocation library with proper permissions.
 */

// Example for Expo (uncomment if using Expo):
// import * as Location from 'expo-location';
//
// export async function requestAndGetCoordsExpo() {
//   const { status } = await Location.requestForegroundPermissionsAsync();
//   if (status !== 'granted') throw new Error('Location permission not granted');
//   const pos = await Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.Highest, timeInterval: 10000 });
//   return {
//     lat: Number(pos.coords.latitude.toFixed(7)),
//     lon: Number(pos.coords.longitude.toFixed(7)),
//     alt: pos.coords.altitude ?? null,
//     accuracy: pos.coords.accuracy ?? null,
//     timestamp: pos.timestamp
//   } as const;
// }

// Example for plain React Native using navigator.geolocation or react-native-geolocation-service:
// Avoid importing 'react-native' in web builds; detect web vs native at runtime
const isWeb = typeof navigator !== 'undefined' && navigator.product !== 'ReactNative';

export type MobileCoords7 = {
  lat: number;
  lon: number;
  alt: number | null;
  accuracy: number | null;
  timestamp: number;
};

export function to7DecimalsMobile(n: number): number {
  return Number(n.toFixed(7));
}

export function getCurrentPositionMobile(options?: PositionOptions): Promise<GeolocationPosition> {
  return new Promise((resolve, reject) => {
    if (isWeb) {
      if (!('geolocation' in navigator)) return reject(new Error('Geolocation not available'));
      navigator.geolocation.getCurrentPosition(resolve, reject, options);
      return;
    }
    // On native, many apps include react-native-geolocation-service or rely on navigator.geolocation shim.
    if (!('geolocation' in navigator)) return reject(new Error('Geolocation not available on this platform'));
    navigator.geolocation.getCurrentPosition(resolve, reject, options);
  });
}

export async function getCoords7DecimalsMobile(options?: PositionOptions): Promise<MobileCoords7> {
  const pos = await getCurrentPositionMobile(options ?? { enableHighAccuracy: true, timeout: 20000, maximumAge: 0 });
  return {
    lat: to7DecimalsMobile(pos.coords.latitude),
    lon: to7DecimalsMobile(pos.coords.longitude),
    alt: pos.coords.altitude === null ? null : Number(pos.coords.altitude),
    accuracy: pos.coords.accuracy === undefined ? null : Number(pos.coords.accuracy),
    timestamp: pos.timestamp
  };
}

// Usage note: On Android you must request ACCESS_FINE_LOCATION (and maybe background) and ensure GPS is enabled.
// On iOS add NSLocationWhenInUseUsageDescription / NSLocationAlwaysAndWhenInUseUsageDescription to Info.plist.

# GPS utilities — web + mobile (ready-to-drop-in)

This folder provides ready-to-drop-in helpers for getting coordinates with 7 decimal places and computing distances both for web and mobile apps.

Contents
- src/utils/gps-utils.ts — Web/Node-compatible TypeScript helpers (Geolocation API, haversine, 3D distance).
- src/utils/gps-mobile.ts — React Native / Expo-ready examples for requesting permissions and getting coords.

Why 7 decimals?
- 7 decimal places in latitude/longitude corresponds to ~1.11 cm per 0.0000001° at the equator.
- Consumer smartphone GPS is typically accurate to 3–10 meters under normal conditions. Rounding to 7 decimals is fine for display and consistent storage, but it does not give true centimetre accuracy.
- For true centimetre-level positioning you must use GNSS receivers with RTK/PPK and correction services.

Key functions
- getCoords7Decimals(options?) — returns { lat, lon, alt, accuracy, timestamp } where lat/lon are rounded to 7 decimals.
- haversineDistanceMeters(lat1, lon1, lat2, lon2) — horizontal distance in meters.
- distance3D(lat1, lon1, alt1, lat2, lon2, alt2) — slant distance including altitude when available.

Database/storage recommendations
- Store numeric coords, not only formatted strings.
- SQL example: latitude DECIMAL(9,7), longitude DECIMAL(10,7). These store 7 decimals explicitly.
- Alternatively store DOUBLE/FLOAT but remember floats can display differently. Store raw device accuracy and timestamp too.

Practical guidance
- Always capture and store `accuracy` (in meters) returned by the device — use it to decide whether to accept a reading.
- For workflows that need sub-meter accuracy, use differential or RTK-capable hardware and services.
- If you need distance "from above" for drones — combine drone GPS position (and altitude) with ground point using distance3D.
- For aerial images: use the image GSD (ground sampling distance) and camera metadata to convert pixels into meters.

Usage examples

Web (in a React component)

```ts
import { getCoords7Decimals, distanceBetweenCoords } from '../utils/gps-utils';

async function capture() {
  try {
    const current = await getCoords7Decimals({ enableHighAccuracy: true });
    // save current.lat/current.lon to DB, show to user
    console.log(current);
  } catch (err) {
    console.error('Could not get location', err);
  }
}
```

Mobile (Expo)

```ts
// see src/utils/gps-mobile.ts for full example using expo-location (uncomment in that file)
```

If you want, I can:
- Open a pull request that adds these files in a branch and a short demo page (web) that captures a point and shows distance to the previously saved point, or
- Modify the examples to match your project's framework (Vanilla TS, React, Next.js, React Native, Expo). Please tell me which you prefer.

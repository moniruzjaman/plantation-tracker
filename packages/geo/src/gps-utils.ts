export interface Coords7 {
  lat: number;
  lon: number;
  alt?: number;
  accuracy?: number;
  timestamp?: number;
}

export function to7Decimals(n: number): number {
  return Math.round(n * 1e7) / 1e7;
}

export function getCurrentPosition(options?: PositionOptions): Promise<Coords7> {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(new Error('Geolocation not supported'));
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        resolve({
          lat: to7Decimals(pos.coords.latitude),
          lon: to7Decimals(pos.coords.longitude),
          alt: pos.coords.altitude ? to7Decimals(pos.coords.altitude) : undefined,
          accuracy: pos.coords.accuracy,
          timestamp: pos.timestamp
        });
      },
      (err) => reject(err),
      { enableHighAccuracy: true, timeout: 15000, maximumAge: 0, ...options }
    );
  });
}

export function getCoords7Decimals(options?: PositionOptions): Promise<Coords7> {
  return getCurrentPosition(options);
}

export function haversineDistanceMeters(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371000;
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = Math.sin(dLat / 2) ** 2 + Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * Math.sin(dLon / 2) ** 2;
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

export function distance3D(
  lat1: number, lon1: number, alt1: number,
  lat2: number, lon2: number, alt2: number
): number {
  const h = haversineDistanceMeters(lat1, lon1, lat2, lon2);
  const v = Math.abs((alt1 || 0) - (alt2 || 0));
  return Math.sqrt(h * h + v * v);
}

export function distanceBetweenCoords(a: Coords7, b: Coords7): number {
  if (a.alt !== undefined && b.alt !== undefined) {
    return distance3D(a.lat, a.lon, a.alt, b.lat, b.lon, b.alt);
  }
  return haversineDistanceMeters(a.lat, a.lon, b.lat, b.lon);
}

export function approxMetersPerDegree(latDeg: number): number {
  const latRad = latDeg * Math.PI / 180;
  return 111320 * Math.cos(latRad);
}

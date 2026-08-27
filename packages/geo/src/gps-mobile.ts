export interface MobileCoords7 {
  lat: number;
  lon: number;
  alt?: number;
  accuracy?: number;
  timestamp: number;
}

export function to7DecimalsMobile(n: number): number {
  return Math.round(n * 1e7) / 1e7;
}

export async function getCurrentPositionMobile(options?: PositionOptions): Promise<MobileCoords7> {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(new Error('Geolocation not supported'));
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        resolve({
          lat: to7DecimalsMobile(pos.coords.latitude),
          lon: to7DecimalsMobile(pos.coords.longitude),
          alt: pos.coords.altitude ? to7DecimalsMobile(pos.coords.altitude) : undefined,
          accuracy: pos.coords.accuracy,
          timestamp: pos.timestamp
        });
      },
      (err) => reject(err),
      { enableHighAccuracy: true, timeout: 15000, maximumAge: 0, ...options }
    );
  });
}

export async function getCoords7DecimalsMobile(options?: PositionOptions): Promise<MobileCoords7> {
  return getCurrentPositionMobile(options);
}

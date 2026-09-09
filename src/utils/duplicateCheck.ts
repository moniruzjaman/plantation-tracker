/**
 * Duplicate-submission proximity detection.
 *
 * Real-data-only validation (no simulation): flags submissions whose GPS point
 * lies suspiciously close to another submission's GPS point — a classic sign
 * of the same site being reported twice (by two officers, or re-entered).
 *
 * Distances use the Haversine formula (metres), accurate enough at the
 * sub-100 m scale we care about here.
 */

export interface GeoPoint {
  /** Stable identifier of the submission (e.g. "local-123", "nat-45"). */
  key: string;
  lat: number;
  lng: number;
}

export interface DuplicateInfo {
  /** How many *other* submissions fall within the threshold. */
  nearbyCount: number;
  /** Distance in metres to the closest other submission. */
  minDistanceM: number;
  /** Keys of the other submissions involved. */
  nearbyKeys: string[];
}

/** Default threshold: two distinct plantings closer than this are suspicious. */
export const DUPLICATE_THRESHOLD_M = 50;

/**
 * Haversine great-circle distance between two coordinates, in metres.
 */
export function haversineM(lat1: number, lng1: number, lat2: number, lng2: number): number {
  const R = 6371000; // Earth mean radius, metres
  const toRad = (d: number) => (d * Math.PI) / 180;
  const dLat = toRad(lat2 - lat1);
  const dLng = toRad(lng2 - lng1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLng / 2) * Math.sin(dLng / 2);
  return 2 * R * Math.asin(Math.sqrt(a));
}

/**
 * Detects near-duplicate submissions among the given points.
 *
 * Returns a map from each flagged point's key to its DuplicateInfo. Points
 * with no nearby neighbour are simply absent from the result. Points with
 * identical coordinates (exact duplicates) are flagged with distance 0.
 *
 * O(n²) pairwise comparison — fine for the scale of a dashboard's viewport
 * dataset (hundreds of points); switch to a grid index only if this ever
 * grows to tens of thousands.
 */
export function detectDuplicateSites(
  points: GeoPoint[],
  thresholdM: number = DUPLICATE_THRESHOLD_M
): Map<string, DuplicateInfo> {
  const result = new Map<string, DuplicateInfo>();
  for (let i = 0; i < points.length; i++) {
    const a = points[i];
    const nearbyKeys: string[] = [];
    let min = Infinity;
    for (let j = 0; j < points.length; j++) {
      if (i === j) continue;
      const b = points[j];
      const d = haversineM(a.lat, a.lng, b.lat, b.lng);
      if (d <= thresholdM) {
        nearbyKeys.push(b.key);
        if (d < min) min = d;
      }
    }
    if (nearbyKeys.length > 0) {
      result.set(a.key, {
        nearbyCount: nearbyKeys.length,
        minDistanceM: Math.round(min * 10) / 10,
        nearbyKeys,
      });
    }
  }
  return result;
}

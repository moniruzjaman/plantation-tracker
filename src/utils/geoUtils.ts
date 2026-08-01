/**
 * Geo utilities extracted from legacy Plantation Tracker code.
 * Pure functions — no side-effects, no framework coupling.
 */

// ---------------------------------------------------------------------------
// Haversine distance
// ---------------------------------------------------------------------------

const R = 6_371_000; // Earth's mean radius in metres

/**
 * Returns the great-circle distance between two WGS-84 points in **metres**.
 */
export function haversineMeters(
  lat1: number,
  lng1: number,
  lat2: number,
  lng2: number,
): number {
  const toRad = (deg: number) => (deg * Math.PI) / 180;

  const dLat = toRad(lat2 - lat1);
  const dLng = toRad(lng2 - lng1);

  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLng / 2) ** 2;

  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

// ---------------------------------------------------------------------------
// Polygon area (equirectangular shoelace)
// ---------------------------------------------------------------------------

/**
 * Approximate polygon area in **square metres** using the shoelace formula
 * on an equirectangular projection. Good enough for small-to-medium polygons
 * at a single latitude band.
 */
export function polygonAreaSqm(points: { lat: number; lng: number }[]): number {
  if (points.length < 3) return 0;

  // Use the average latitude as the reference for the projection
  const avgLat =
    points.reduce((s, p) => s + p.lat, 0) / points.length;
  const toRad = (deg: number) => (deg * Math.PI) / 180;
  const cosLat = Math.cos(toRad(avgLat));

  // Shoelace sum on equirectangular x/y (metres from origin)
  let sum = 0;
  const n = points.length;

  for (let i = 0; i < n; i++) {
    const j = (i + 1) % n;
    const xi = points[i].lng * cosLat;
    const yi = points[i].lat;
    const xj = points[j].lng * cosLat;
    const yj = points[j].lat;
    sum += xi * yj - xj * yi;
  }

  // 1 degree ≈ 111 320 m; area in sqm = |sum|/2 * (m-per-deg)^2
  const mPerDeg = 111_320;
  return (Math.abs(sum) / 2) * mPerDeg * mPerDeg;
}

// ---------------------------------------------------------------------------
// Bangladesh boundary check
// ---------------------------------------------------------------------------

const BD_BOUNDS = {
  minLat: 20,
  maxLat: 27.5,
  minLng: 87.5,
  maxLng: 93.5,
} as const;

/**
 * Returns `true` when `(lat, lng)` falls inside the approximate bounding box
 * of Bangladesh.
 */
export function isValidBdCoord(lat: number, lng: number): boolean {
  return (
    lat >= BD_BOUNDS.minLat &&
    lat <= BD_BOUNDS.maxLat &&
    lng >= BD_BOUNDS.minLng &&
    lng <= BD_BOUNDS.maxLng
  );
}

// ---------------------------------------------------------------------------
// Deterministic upazila colour
// ---------------------------------------------------------------------------

/** A 12-colour palette that is reasonably distinguishable. */
const PALETTE = [
  '#e6194b', '#3cb44b', '#4363d8', '#f58231', '#911eb4', '#42d4f4',
  '#f032e6', '#bfef45', '#fabed4', '#469990', '#dcbeff', '#9A6324',
];

/**
 * Returns a deterministic hex colour for the given upazila name.
 * The same name always maps to the same colour.
 */
export function upazilaColor(upazila: string): string {
  let hash = 0;
  for (let i = 0; i < upazila.length; i++) {
    // eslint-disable-next-line no-bitwise
    hash = upazila.charCodeAt(i) + ((hash << 5) - hash);
  }
  // eslint-disable-next-line no-bitwise
  return PALETTE[Math.abs(hash) % PALETTE.length];
}

// ---------------------------------------------------------------------------
// Bengali numerals
// ---------------------------------------------------------------------------

const BN_DIGITS = ['০', '১', '২', '৩', '৪', '৫', '৬', '৭', '৮', '৯'] as const;

/**
 * Converts a JavaScript number to a string using Bengali (Bangla) numerals.
 * Negative sign and decimal point are preserved as-is.
 */
export function toBnNum(num: number): string {
  return String(num)
    .split('')
    .map((ch) => {
      const d = parseInt(ch, 10);
      return Number.isNaN(d) ? ch : BN_DIGITS[d];
    })
    .join('');
}

import type { UpazilaGeometry, Ring } from './districtPolygonTypes';

/** Ray-casting point-in-polygon test for a single ring. Standard
 *  even-odd algorithm; [lng, lat] order to match GeoJSON. */
function pointInRing(lng: number, lat: number, ring: Ring): boolean {
  let inside = false;
  for (let i = 0, j = ring.length - 1; i < ring.length; j = i++) {
    const [xi, yi] = ring[i];
    const [xj, yj] = ring[j];
    const intersects = yi > lat !== yj > lat && lng < ((xj - xi) * (lat - yi)) / (yj - yi) + xi;
    if (intersects) inside = !inside;
  }
  return inside;
}

/** A Polygon's first ring is the outer boundary, any further rings are
 *  holes to subtract. */
function pointInPolygon(lng: number, lat: number, geom: UpazilaGeometry): boolean {
  if (geom.type === 'Polygon') {
    const [outer, ...holes] = geom.coordinates;
    if (!pointInRing(lng, lat, outer)) return false;
    return !holes.some((hole) => pointInRing(lng, lat, hole));
  }
  return geom.coordinates.some(([outer, ...holes]) => {
    if (!pointInRing(lng, lat, outer)) return false;
    return !holes.some((hole) => pointInRing(lng, lat, hole));
  });
}

/**
 * True if (lat, lng) falls inside the named upazila's real polygon
 * boundary, searching only the districts currently loaded into
 * `registry` (see districtPolygonLoader.ts's getMergedLoadedPolygons()).
 * Returns true (i.e. "don't flag") if the upazila name isn't present in
 * the registry -- either because it's genuinely unrecognized (a separate
 * data-quality issue, not a geofence one) or because that district
 * simply hasn't been loaded yet. Never produces a false "mismatch" from
 * missing data.
 */
export function isWithinUpazilaPolygon(registry: Record<string, UpazilaGeometry>, lat: number, lng: number, upazila: string): boolean {
  const geom = registry[upazila];
  if (!geom) return true;
  return pointInPolygon(lng, lat, geom);
}

/** Which (if any) upazila among the currently-loaded districts actually
 *  contains this point -- used for the "GPS looks like X but form says
 *  Y" mismatch message. */
export function findContainingUpazila(registry: Record<string, UpazilaGeometry>, lat: number, lng: number): string | null {
  for (const name of Object.keys(registry)) {
    if (pointInPolygon(lng, lat, registry[name])) return name;
  }
  return null;
}

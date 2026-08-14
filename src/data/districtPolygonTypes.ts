/** Shared types for per-district upazila polygon data (src/data/districts/*.ts).
 *  Kept in its own file so each district chunk only imports types, never
 *  pulls in the loader/registry code itself into its bundle. */

export type Ring = [number, number][]; // [lng, lat] pairs, GeoJSON order
export type PolygonGeometry = { type: 'Polygon'; coordinates: Ring[] };
export type MultiPolygonGeometry = { type: 'MultiPolygon'; coordinates: Ring[][] };
export type UpazilaGeometry = PolygonGeometry | MultiPolygonGeometry;

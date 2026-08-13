/**
 * Unified data access layer for the admin hierarchy.
 *
 * Provides:
 *   - In-memory lookups (instant, from adminHierarchy.ts static data)
 *   - Dropdown options for forms (district → upazila → union cascading)
 *   - Tree traversal utilities
 *   - DB-to-static-data bridging helpers
 *
 * This layer is designed to work both client-side (with static imports)
 * and server-side (with Prisma when DB is available). The static data
 * is always available as a fallback, so the app never breaks even if
 * the DB is unreachable.
 */
import type { Division, District, Upazila, Union } from './adminHierarchy';
import {
  DIVISIONS, DISTRICTS, UPAZILAS, UNIONS,
  DIVISION_BY_ID, DISTRICT_BY_ID, DISTRICT_BY_BN, UPAZILA_BY_ID, UPAZILA_BY_BN,
  DISTRICT_TO_DIVISION,
  UPAZILAS_BY_DISTRICT, UNIONS_BY_UPAZILA,
  getUpazilasForDistrict,
  getUnionsForUpazila,
  getDivisionForDistrict,
} from './adminHierarchy';
import type { SelectOption } from './db-types';

// ─── Dropdown Options for Forms ────────────────────────

/** All divisions as dropdown options. */
export function getDivisionOptions(): SelectOption[] {
  return DIVISIONS.map(d => ({ value: String(d.id), label: d.nameBn, labelEn: d.nameEn }));
}

/** Districts belonging to a division. */
export function getDistrictOptionsForDivision(divisionId: number | string): SelectOption[] {
  const id = typeof divisionId === 'string' ? parseInt(divisionId, 10) : divisionId;
  return DISTRICTS
    .filter(d => d.divisionId === id)
    .map(d => ({ value: d.nameBn, label: d.nameBn, labelEn: d.nameEn }));
}

/** All districts as dropdown options. */
export function getDistrictOptions(): SelectOption[] {
  return DISTRICTS.map(d => ({ value: d.nameBn, label: d.nameBn, labelEn: d.nameEn }));
}

/** Upazilas belonging to a district (by Bengali name). */
export function getUpazilaOptionsForDistrict(districtNameBn: string): SelectOption[] {
  const names = getUpazilasForDistrict(districtNameBn);
  return names.map(name => {
    const u = UPAZILA_BY_BN[name];
    return { value: name, label: name, labelEn: u?.nameEn || '' };
  });
}

/** Unions belonging to an upazila (by Bengali name). */
export function getUnionOptionsForUpazila(upazilaNameBn: string): SelectOption[] {
  const names = getUnionsForUpazila(upazilaNameBn);
  return names.map(name => ({ value: name, label: name }));
}

/** All upazilas as dropdown options (flat list). */
export function getUpazilaOptions(): SelectOption[] {
  return UPAZILAS.map(u => ({ value: u.nameBn, label: u.nameBn, labelEn: u.nameEn }));
}

/** All unions as dropdown options (flat list). */
export function getUnionOptions(): SelectOption[] {
  return UNIONS.map(u => ({ value: u.nameBn, label: u.nameBn }));
}

// ─── Validation Utilities ────────────────────────────

/** Check if a district name exists in the registry. */
export function isValidDistrict(nameBn: string): boolean {
  return nameBn in DISTRICT_BY_BN;
}

/** Check if an upazila exists in the registry. */
export function isValidUpazila(nameBn: string): boolean {
  return nameBn in UPAZILA_BY_BN;
}

/** Check if an upazila belongs to a given district. */
export function isUpazilaInDistrict(upazilaNameBn: string, districtNameBn: string): boolean {
  const upazilas = getUpazilasForDistrict(districtNameBn);
  return upazilas.includes(upazilaNameBn);
}

/** Check if a union belongs to a given upazila. */
export function isUnionInUpazila(unionNameBn: string, upazilaNameBn: string): boolean {
  const unions = getUnionsForUpazila(upazilaNameBn);
  return unions.includes(unionNameBn);
}

// ─── ID Resolution ─────────────────────────────────

/** Resolve a district Bengali name to its CSV/DB id. */
export function getDistrictId(nameBn: string): number | undefined {
  const d = DISTRICT_BY_BN[nameBn];
  return d?.id;
}

/** Resolve an upazila Bengali name to its CSV/DB id. */
export function getUpazilaId(nameBn: string): number | undefined {
  const u = UPAZILA_BY_BN[nameBn];
  return u?.id;
}

/** Get division id for a district name. */
export function getDivisionIdForDistrict(districtNameBn: string): number | undefined {
  const div = getDivisionForDistrict(districtNameBn);
  return div?.id;
}

// ─── Statistics ────────────────────────────────────

/** Count of upazilas per district. */
export function getUpazilaCountByDistrict(): Record<string, number> {
  const counts: Record<string, number> = {};
  for (const d of DISTRICTS) {
    counts[d.nameBn] = (UPAZILAS_BY_DISTRICT[d.id] || []).length;
  }
  return counts;
}

/** Count of unions per upazila. */
export function getUnionCountByUpazila(): Record<string, number> {
  const counts: Record<string, number> = {};
  for (const u of UPAZILAS) {
    counts[u.nameBn] = (UNIONS_BY_UPAZILA[u.id] || []).length;
  }
  return counts;
}

/** Total seedlings and submissions per district (for dashboard).
 *  This is a client-side aggregation helper — for real data,
 *  query the submissions table via API.
 */
export interface DistrictStats {
  districtNameBn: string;
  divisionNameBn: string;
  upazilaCount: number;
  unionCount: number;
}

/** Get admin stats for all districts. */
export function getDistrictStats(): DistrictStats[] {
  return DISTRICTS.map(d => {
    const div = getDivisionForDistrict(d.nameBn);
    const upazilas = UPAZILAS_BY_DISTRICT[d.id] || [];
    const unionCount = upazilas.reduce(
      (sum, u) => sum + (UNIONS_BY_UPAZILA[u.id] || []).length,
      0,
    );
    return {
      districtNameBn: d.nameBn,
      divisionNameBn: div?.nameBn || '',
      upazilaCount: upazilas.length,
      unionCount,
    };
  });
}

/**
 * Bridge: convert a submission's Bengali district name to
 * a division name. Useful for grouping/summarizing data
 * that only has district-level granularity.
 */
export function resolveDivisionFromDistrict(districtNameBn: string): string | undefined {
  return getDivisionForDistrict(districtNameBn)?.nameBn;
}

// ─── JSON serialization (for IndexedDB / localStorage cache) ─

export function serializeHierarchy(): string {
  return JSON.stringify({
    divisions: DIVISIONS,
    districts: DISTRICTS,
    upazilas: UPAZILAS,
    unions: UNIONS,
  });
}

/** Parse a previously-cached hierarchy JSON string. */
export function parseHierarchy(json: string) {
  return JSON.parse(json);
}

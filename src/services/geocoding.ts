/**
 * Reverse-geocoding service built on OpenStreetMap Nominatim.
 * Provides fuzzy matching against Bangladesh admin boundaries so
 * autoSelectAdminFromGeo can return division / region / district / upazila.
 */

import { BD_UPAZILA, BD, BD_DIVISIONS } from '../data/adminData';

// ------------------------------------------------------------------
// Public types
// ------------------------------------------------------------------

export interface NominatimAddress {
  village?: string;
  suburb?: string;
  neighbourhood?: string;
  hamlet?: string;
  road?: string;
  county?: string;
  subdistrict?: string;
  state_district?: string;
  district?: string;
  city?: string;
  state?: string;
  postcode?: string;
}

export interface NominatimResult {
  display_name: string;
  address: NominatimAddress;
}

export interface AdminMatch {
  division?: string;
  region?: string;
  district?: string;
  upazila?: string;
}

// ------------------------------------------------------------------
// Normalisation helper (exported for reuse)
// ------------------------------------------------------------------

/** Suffixes that Nominatim / native scripts may append to place names. */
const SUFFIXES = [
  'district',
  'zila',
  'জেলা',
  'উপজেলা',
  'বিভাগ',
  'upazila',
  'subdistrict',
  'city',
  'municipality',
  'পৌরসভা',
  'town',
];

/**
 * Normalise a place-name string for fuzzy comparison.
 *
 * 1. Trim whitespace.
 * 2. Lowercase (handles ASCII; Bangla chars are case-less).
 * 3. Strip known admin suffixes (English & Bangla).
 * 4. Collapse internal whitespace.
 */
export function _norm(s: string): string {
  return s
    .trim()
    .toLowerCase()
    .replace(/\s+/g, ' ');
}

/** Strip trailing Bangla / English admin suffixes, then normalise. */
function _normGeo(s: string): string {
  let n = _norm(s);
  for (const sfx of SUFFIXES) {
    const normSfx = sfx.toLowerCase();
    // Try to strip " <suffix>" at end of string
    if (n.endsWith(' ' + normSfx)) {
      n = n.slice(0, -(normSfx.length + 1));
    }
    // Also try the suffix itself (no leading space, e.g. Bangla suffixes)
    if (n.endsWith(normSfx)) {
      n = n.slice(0, -normSfx.length).trim();
    }
  }
  return n;
}

// ------------------------------------------------------------------
// reverseGeocode
// ------------------------------------------------------------------

/**
 * Reverse-geocode a lat/lng pair using the Nominatim API.
 *
 * Returns the parsed Nominatim result or null on any failure.
 */
export async function reverseGeocode(
  lat: string | number,
  lng: string | number,
): Promise<NominatimResult | null> {
  try {
    const params = new URLSearchParams({
      lat: String(lat),
      lon: String(lng),
      format: 'json',
      addressdetails: '1',
      'accept-language': 'bn,en',
    });

    const url = `https://nominatim.openstreetmap.org/reverse?${params.toString()}`;
    const res = await fetch(url, {
      headers: {
        'User-Agent': 'PlantationTracker/1.0',
      },
    });

    if (!res.ok) {
      console.warn(`[geocoding] Nominatim HTTP ${res.status}`);
      return null;
    }

    const data = await res.json();
    if (!data || !data.address) {
      return null;
    }

    return data as NominatimResult;
  } catch (err) {
    console.warn('[geocoding] reverseGeocode failed:', err);
    return null;
  }
}

// ------------------------------------------------------------------
// Fuzzy matching helpers
// ------------------------------------------------------------------

/** Check if `needle` (already normalised) matches any key in `map`. */
function _matchMapKey(
  needle: string,
  map: Record<string, unknown[]>,
): string | undefined {
  // 1. Exact match after suffix stripping
  for (const key of Object.keys(map)) {
    if (_normGeo(key) === needle) return key;
  }
  // 2. Substring fallback — either the candidate contains the needle
  //    or the needle contains the candidate
  for (const key of Object.keys(map)) {
    const nk = _normGeo(key);
    if (nk.includes(needle) || needle.includes(nk)) return key;
  }
  return undefined;
}

/** Check if `needle` (already normalised) matches any value in an array. */
function _matchArrayValue(
  needle: string,
  arr: string[],
): string | undefined {
  // 1. Exact match after suffix stripping
  for (const val of arr) {
    if (_normGeo(val) === needle) return val;
  }
  // 2. Substring fallback
  for (const val of arr) {
    const nv = _normGeo(val);
    if (nv.includes(needle) || needle.includes(nv)) return val;
  }
  return undefined;
}

// ------------------------------------------------------------------
// autoSelectAdminFromGeo
// ------------------------------------------------------------------

/**
 * Given a Nominatim `address` object, try to infer Bangladesh
 * administrative boundaries:
 *   - division  (বিভাগ)
 *   - region    (same as division in BD hierarchy, used by the app)
 *   - district  (জেলা)
 *   - upazila   (উপজেলা)
 *
 * Matching strategy:
 *   1. Collect candidate strings from the Nominatim address fields.
 *   2. For each candidate, strip suffixes & compare against
 *      BD_UPAZILA / BD / BD_DIVISIONS using exact-match then
 *      substring fallback.
 */
export function autoSelectAdminFromGeo(addr: any): AdminMatch {
  const result: AdminMatch = {};

  if (!addr || typeof addr !== 'object') return result;

  // Collect all address field values in order of decreasing specificity
  const fields: string[] = [
    addr.subdistrict,
    addr.county,
    addr.state_district,
    addr.district,
    addr.city,
    addr.state,
    addr.village,
    addr.suburb,
    addr.neighbourhood,
    addr.hamlet,
    addr.road,
  ].filter((v): v is string => typeof v === 'string' && v.trim().length > 0);

  // Normalise all candidate strings once
  const norms = fields.map(_normGeo);

  // --- Division / Region ---
  // BD_DIVISIONS is a flat array; BD keys are the regions/divisions.
  for (let i = 0; i < norms.length; i++) {
    const match =
      _matchArrayValue(norms[i], BD_DIVISIONS) ||
      _matchMapKey(norms[i], BD);
    if (match) {
      result.division = match;
      result.region = match;
      break;
    }
  }

  // --- District ---
  // Districts are values inside BD[division].
  for (let i = 0; i < norms.length; i++) {
    // Iterate every district array across all division keys
    for (const districts of Object.values(BD)) {
      const d = _matchArrayValue(norms[i], districts);
      if (d) {
        result.district = d;
        break;
      }
    }
    if (result.district) break;
  }

  // --- Upazila ---
  // Upazilas are values inside BD_UPAZILA[district].
  for (let i = 0; i < norms.length; i++) {
    for (const upazilas of Object.values(BD_UPAZILA)) {
      const u = _matchArrayValue(norms[i], upazilas);
      if (u) {
        result.upazila = u;
        break;
      }
    }
    if (result.upazila) break;
  }

  return result;
}

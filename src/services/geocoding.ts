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
  /** Best-effort passthrough from Nominatim; free text, no fixed list to match against. */
  union?: string;
  /** Best-effort passthrough from Nominatim; free text, no fixed list to match against. */
  village?: string;
}

// ------------------------------------------------------------------
// English-name fallback tables
// ------------------------------------------------------------------
// Nominatim is requested with accept-language: bn,en, but OSM's Bangla
// (name:bn) coverage for Bangladesh admin boundaries is inconsistent —
// many areas only resolve in English regardless of the request. Since
// BD_DIVISIONS / BD / BD_UPAZILA are Bangla-only, an English response
// (e.g. "Rangpur Division") would never match without this fallback.
// Keyed by normalised (lowercase, suffix-stripped) English name.

const EN_TO_BN_REGION: Record<string, string> = {
  dhaka: 'ঢাকা',
  chittagong: 'চট্টগ্রাম',
  chattogram: 'চট্টগ্রাম',
  rajshahi: 'রাজশাহী',
  khulna: 'খুলনা',
  barisal: 'বরিশাল',
  barishal: 'বরিশাল',
  sylhet: 'সিলেট',
  rangpur: 'রংপুর',
  mymensingh: 'ময়মনসিংহ',
  comilla: 'কুমিল্লা',
  cumilla: 'কুমিল্লা',
  rangamati: 'রাঙ্গামাটি',
  bogra: 'বগুড়া',
  bogura: 'বগুড়া',
  dinajpur: 'দিনাজপুর',
  jessore: 'যশোর',
  jashore: 'যশোর',
  faridpur: 'ফরিদপুর',
};

const EN_TO_BN_DISTRICT: Record<string, string> = {
  dhaka: 'ঢাকা',
  narayanganj: 'নারায়ণগঞ্জ',
  gazipur: 'গাজীপুর',
  narsingdi: 'নরসিংদী',
  munshiganj: 'মুন্সীগঞ্জ',
  manikganj: 'মানিকগঞ্জ',
  tangail: 'টাঙ্গাইল',
  kishoreganj: 'কিশোরগঞ্জ',
  mymensingh: 'ময়মনসিংহ',
  jamalpur: 'জামালপুর',
  sherpur: 'শেরপুর',
  netrokona: 'নেত্রকোণা',
  netrakona: 'নেত্রকোণা',
  comilla: 'কুমিল্লা',
  cumilla: 'কুমিল্লা',
  chandpur: 'চাঁদপুর',
  brahmanbaria: 'ব্রাহ্মণবাড়িয়া',
  moulvibazar: 'মৌলভীবাজার',
  maulvibazar: 'মৌলভীবাজার',
  sylhet: 'সিলেট',
  sunamganj: 'সুনামগঞ্জ',
  habiganj: 'হবিগঞ্জ',
  chittagong: 'চট্টগ্রাম',
  chattogram: 'চট্টগ্রাম',
  "cox's bazar": 'কক্সবাজার',
  coxsbazar: 'কক্সবাজার',
  noakhali: 'নোয়াখালী',
  feni: 'ফেনী',
  lakshmipur: 'লক্ষীপুর',
  rangamati: 'রাঙ্গামাটি',
  khagrachhari: 'খাগড়াছড়ি',
  khagrachari: 'খাগড়াছড়ি',
  bandarban: 'বান্দরবান',
  rangpur: 'রংপুর',
  gaibandha: 'গাইবান্ধা',
  kurigram: 'কুড়িগ্রাম',
  lalmonirhat: 'লালমনিরহাট',
  nilphamari: 'নীলফামারী',
  rajshahi: 'রাজশাহী',
  naogaon: 'নওগাঁ',
  natore: 'নাটোর',
  'chapai nawabganj': 'চাঁপাইনবাবগঞ্জ',
  nawabganj: 'চাঁপাইনবাবগঞ্জ',
  bogra: 'বগুড়া',
  bogura: 'বগুড়া',
  joypurhat: 'জয়ুপুরহাট',
  pabna: 'পাবনা',
  sirajganj: 'সিরাজগঞ্জ',
  dinajpur: 'দিনাজপুর',
  thakurgaon: 'ঠাকুরগাঁও',
  panchagarh: 'পঞ্চগড়',
  khulna: 'খুলনা',
  bagerhat: 'বাগেরহাট',
  satkhira: 'সাতক্ষীরা',
  narail: 'নড়াইল',
  jessore: 'যশোর',
  jashore: 'যশোর',
  jhenaidah: 'ঝিনাইদহ',
  magura: 'মাগুরা',
  kushtia: 'কুষ্টিয়া',
  chuadanga: 'চুয়াডাঙ্গা',
  meherpur: 'মেহেরপুর',
  faridpur: 'ফরিদপুর',
  madaripur: 'মাদারীপুর',
  shariatpur: 'শরীয়তপুর',
  rajbari: 'রাজবাড়ী',
  gopalganj: 'গোপালগঞ্জ',
  barisal: 'বরিশাল',
  barishal: 'বরিশাল',
  jhalokati: 'ঝালকাঠি',
  jhalokathi: 'ঝালকাঠি',
  pirojpur: 'পিরোজপুর',
  patuakhali: 'পটুয়াখালী',
  barguna: 'বরগুনা',
  bhola: 'ভোলা',
};

// ------------------------------------------------------------------
// Normalisation helper (exported for reuse)
// ------------------------------------------------------------------

/** Suffixes that Nominatim / native scripts may append to place names. */
const SUFFIXES = [
  'district',
  'division',
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
// Best-effort Bangla→Latin transliteration (for upazila fallback)
// ------------------------------------------------------------------
// There are ~495 upazilas — too many to safely hand-map English aliases
// for (unlike the 8 divisions / 64 districts above). Instead, when an
// English Nominatim response fails to match BD_UPAZILA directly, we
// approximate-transliterate each Bangla candidate to Latin and compare
// with a bigram-similarity score. This is intentionally approximate —
// it catches close spellings (e.g. "Bogra"/"Bogura") but isn't exact.
const BN_TO_LATIN: Record<string, string> = {
  অ: 'a', আ: 'a', ই: 'i', ঈ: 'i', উ: 'u', ঊ: 'u', ঋ: 'ri', এ: 'e', ঐ: 'oi', ও: 'o', ঔ: 'ou',
  ক: 'k', খ: 'kh', গ: 'g', ঘ: 'gh', ঙ: 'ng',
  চ: 'ch', ছ: 'chh', জ: 'j', ঝ: 'jh', ঞ: 'n',
  ট: 't', ঠ: 'th', ড: 'd', ঢ: 'dh', ণ: 'n',
  ত: 't', থ: 'th', দ: 'd', ধ: 'dh', ন: 'n',
  প: 'p', ফ: 'ph', ব: 'b', ভ: 'bh', ম: 'm',
  য: 'y', র: 'r', ল: 'l', শ: 'sh', ষ: 'sh', স: 's', হ: 'h',
  ড়: 'r', ঢ়: 'rh', য়: 'y',
  া: 'a', ি: 'i', ী: 'i', ু: 'u', ূ: 'u', ৃ: 'ri', ে: 'e', ৈ: 'oi', ো: 'o', ৌ: 'ou',
  '্': '', 'ৎ': 't', 'ং': 'ng', 'ঁ': '', 'ঃ': 'h',
};

function _transliterate(s: string): string {
  return Array.from(s).map((ch) => BN_TO_LATIN[ch] ?? ch).join('');
}

/** Bigram (2-gram) Dice similarity between two normalised strings, 0..1. */
function _similarity(a: string, b: string): number {
  if (!a || !b) return 0;
  if (a === b) return 1;
  const bigrams = (s: string): string[] => {
    const out: string[] = [];
    for (let i = 0; i < s.length - 1; i++) out.push(s.slice(i, i + 2));
    return out;
  };
  const ba = bigrams(a);
  const bb = bigrams(b);
  if (ba.length === 0 || bb.length === 0) return 0;
  const bbCopy = [...bb];
  let matches = 0;
  for (const g of ba) {
    const idx = bbCopy.indexOf(g);
    if (idx !== -1) {
      matches++;
      bbCopy.splice(idx, 1);
    }
  }
  return (2 * matches) / (ba.length + bb.length);
}

/**
 * Fallback for when a candidate didn't match BD_UPAZILA directly (e.g. the
 * Nominatim response came back in English). Transliterates every upazila
 * name once and picks the closest match above a similarity threshold.
 */
function _matchUpazilaFuzzy(needle: string, upazilas: string[]): string | undefined {
  let best: string | undefined;
  let bestScore = 0;
  for (const val of upazilas) {
    const translit = _transliterate(_normGeo(val)).toLowerCase();
    const score = _similarity(translit, needle);
    if (score > bestScore) {
      bestScore = score;
      best = val;
    }
  }
  // 0.55 is a deliberately conservative threshold — false positives are
  // worse than leaving the field blank for the user to fill in manually.
  return bestScore >= 0.55 ? best : undefined;
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
  // Bangla match first; fall back to the English name tables when
  // Nominatim returned the address in English (common — OSM's Bangla
  // coverage for BD admin boundaries is inconsistent).
  for (let i = 0; i < norms.length; i++) {
    const match =
      _matchArrayValue(norms[i], BD_DIVISIONS) ||
      _matchMapKey(norms[i], BD) ||
      EN_TO_BN_REGION[norms[i]];
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
    // English fallback, restricted to district names that actually exist
    // in BD_UPAZILA (i.e. valid districts), avoiding false positives.
    const enMatch = EN_TO_BN_DISTRICT[norms[i]];
    if (enMatch && BD_UPAZILA[enMatch]) {
      result.district = enMatch;
      break;
    }
  }

  // --- Upazila ---
  // Upazilas are values inside BD_UPAZILA[district]. Prefer matching
  // within the already-detected district (cheaper, less ambiguous);
  // fall back to searching every district, then to fuzzy transliteration
  // matching when nothing lines up directly (English-only response).
  const upazilaPools = result.district && BD_UPAZILA[result.district]
    ? [BD_UPAZILA[result.district]]
    : Object.values(BD_UPAZILA);
  for (let i = 0; i < norms.length; i++) {
    for (const upazilas of upazilaPools) {
      const u = _matchArrayValue(norms[i], upazilas);
      if (u) {
        result.upazila = u;
        break;
      }
    }
    if (result.upazila) break;
  }
  if (!result.upazila) {
    for (let i = 0; i < norms.length; i++) {
      for (const upazilas of upazilaPools) {
        const u = _matchUpazilaFuzzy(norms[i], upazilas);
        if (u) {
          result.upazila = u;
          break;
        }
      }
      if (result.upazila) break;
    }
  }

  // --- Union / Village (best-effort passthrough) ---
  // Bangladesh's Union Parishad structure isn't consistently modelled in
  // OSM, so unlike division/district/upazila there's no fixed list to
  // match against — this is a best-effort passthrough of whatever
  // Nominatim returned, left for the user to correct if needed (same as
  // legacy, which never auto-filled these either).
  if (typeof addr.village === 'string' && addr.village.trim()) {
    result.village = addr.village.trim();
  } else if (typeof addr.hamlet === 'string' && addr.hamlet.trim()) {
    result.village = addr.hamlet.trim();
  }
  if (typeof addr.suburb === 'string' && addr.suburb.trim()) {
    result.union = addr.suburb.trim();
  }

  return result;
}

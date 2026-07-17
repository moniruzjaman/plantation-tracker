/** Local device submission, matching legacy-nursery.html's localStorage shape (LS_KEY = "nursery_submissions"). */
export interface LocalSubmission {
  id?: string;
  submissionId?: string;
  coordinates?: string; // "lat,lng"
  geoLocation?: string; // "lat,lng" (alternate field name used in some records)
  village?: string;
  region?: string;
  district?: string;
  upazila?: string;
  block?: string;
  species?: string;
  quantity?: number | string;
  seedlings?: { category?: string; quantity?: number | string }[];
  fruitSeedlings?: { count?: number | string; graftingCount?: number | string }[];
  forestSeedlings?: { count?: number | string; graftingCount?: number | string }[];
  medicinalSeedlings?: { count?: number | string; graftingCount?: number | string }[];
  submittedAt?: string;
  [key: string]: unknown;
}

/** AppScript (Google Sheet, App_Entry) national entry, as returned by /api/gas-sync?list=1. */
export interface NationalEntry {
  id?: string;
  submissionId?: string;
  geoLocation?: string; // "lat, lng"
  coordinates?: string;
  farmerName?: string;
  nurseryName?: string;
  village?: string;
  region?: string;
  division?: string;
  district?: string;
  upazila?: string;
  _source?: 'appscript';
  [key: string]: unknown;
}

export interface SeedlingCounts {
  fruit: number;
  forest: number;
  medicinal: number;
}

/** Mirrors legacy-nursery.html's countSeedlings() so popups show consistent numbers. */
export function countSeedlings(s: LocalSubmission): SeedlingCounts {
  const r: SeedlingCounts = { fruit: 0, forest: 0, medicinal: 0 };
  if (Array.isArray(s.seedlings)) {
    s.seedlings.forEach((e) => {
      const qty = parseInt(String(e.quantity), 10) || 0;
      const cat = (e.category || '').trim();
      if (cat.indexOf('ফল') === 0 || cat === 'fruit') r.fruit += qty;
      else if (cat.indexOf('বন') === 0 || cat === 'forest') r.forest += qty;
      else if (cat.indexOf('ঔষ') === 0 || cat === 'medicinal') r.medicinal += qty;
      else r.fruit += qty;
    });
    return r;
  }
  (['fruitSeedlings', 'forestSeedlings', 'medicinalSeedlings'] as const).forEach((k, i) => {
    const key: keyof SeedlingCounts = (['fruit', 'forest', 'medicinal'] as const)[i];
    (s[k] || []).forEach((e) => {
      r[key] += (parseInt(String(e.count), 10) || 0) + (parseInt(String(e.graftingCount), 10) || 0);
    });
  });
  return r;
}

/**
 * Government report builders — 17-column and Ministry (9-column) formats.
 *
 * Typed TypeScript port of the legacy iframe exporter in public/part6.txt
 * (normalizeEntryForReport_ / build17ColRows_ / buildMinistryRows_) so the
 * native React dashboard produces identical report rows to the legacy
 * plantation.html surface. Both formats are the official DAE/MoA weekly
 * plantation proformas submitted to admonitoring@dae.gov.bd /
 * ddimplement@dae.gov.bd and the Ministry of Agriculture addresses.
 */

/** Minimal report input — a superset of both the live form schema and the
 *  legacy nursery-form shape (fruitSeedlings/... with name/count/graftingCount). */
export interface ReportEntry {
  geoLocation?: string;
  latitude?: string | number;
  longitude?: string | number;
  plantingDate?: string;
  submittedAt?: string;
  district?: string;
  upazila?: string;
  union?: string;
  village?: string;
  block?: string;
  farmerName?: string;
  farmerMobile?: string;
  nurseryName?: string;
  mobile?: string;
  saaoName?: string;
  saaoMobile?: string;
  officerName?: string;
  officerMobile?: string;
  caretakerName?: string;
  caretakerMobile?: string;
  remarks?: string;
  seedlings?: { speciesName?: string; quantity?: number | string }[];
  fruitSeedlings?: { name?: string; count?: number | string; graftingCount?: number | string }[];
  forestSeedlings?: { name?: string; count?: number | string; graftingCount?: number | string }[];
  medicinalSeedlings?: { name?: string; count?: number | string; graftingCount?: number | string }[];
}

const CATEGORIES = ['fruitSeedlings', 'forestSeedlings', 'medicinalSeedlings'] as const;

const MISSING = 'উল্লেখ নেই';

interface NormalizedEntry {
  district: string;
  upazila: string;
  union: string;
  village: string;
  block: string;
  geoLocation: string;
  plantingDate: string;
  farmerName: string;
  farmerMobile: string;
  saaoName: string;
  saaoMobile: string;
  officerName: string;
  officerMobile: string;
  remarks: string;
  rows: { speciesName: string; quantity: number }[];
}

/** One report row per seedling species; entries with no seedlings yield one
 *  zero-quantity row so the serial numbering stays aligned with the sheet. */
export function normalizeEntryForReport(s: ReportEntry): NormalizedEntry {
  const geoLocation =
    s.geoLocation || (s.latitude && s.longitude ? `${s.latitude}, ${s.longitude}` : '') || '';
  const plantingDate = s.plantingDate || (s.submittedAt ? String(s.submittedAt).slice(0, 10) : '');
  const rows: { speciesName: string; quantity: number }[] = [];
  if (s.seedlings && s.seedlings.length) {
    s.seedlings.forEach((e) => {
      rows.push({ speciesName: e.speciesName || '', quantity: parseInt(String(e.quantity), 10) || 0 });
    });
  } else {
    CATEGORIES.forEach((cat) => {
      (s[cat] || []).forEach((e) => {
        rows.push({
          speciesName: e.name || '',
          quantity: (parseInt(String(e.count), 10) || 0) + (parseInt(String(e.graftingCount), 10) || 0),
        });
      });
    });
  }
  if (!rows.length) rows.push({ speciesName: '', quantity: 0 });
  return {
    district: s.district || '',
    upazila: s.upazila || '',
    union: s.union || '',
    village: s.village || '',
    block: s.block || '',
    geoLocation,
    plantingDate,
    farmerName: s.farmerName || s.nurseryName || '',
    farmerMobile: s.farmerMobile || s.mobile || '',
    saaoName: s.saaoName || '',
    saaoMobile: s.saaoMobile || '',
    officerName: s.officerName || s.caretakerName || '',
    officerMobile: s.officerMobile || s.caretakerMobile || '',
    remarks: s.remarks || '',
    rows,
  };
}

function nameAndPhone(name: string, phone: string): string {
  if (!name && !phone) return '';
  return name + (phone ? ' ' + phone : '');
}

function joinedLocation(n: NormalizedEntry): string {
  const parts: string[] = [];
  if (n.village) parts.push('গ্রামঃ ' + n.village);
  if (n.union) parts.push('ইউনিয়নঃ ' + n.union);
  if (n.upazila) parts.push('উপজেলাঃ ' + n.upazila);
  if (n.district) parts.push('জেলাঃ ' + n.district);
  return parts.join(', ') + (parts.length ? '।' : '');
}

/** 17-column headers â€” matches the "17 column report" sheet exactly. */
export const COL17_HEADERS = [
  'à¦•à§à¦°. à¦¨à¦‚', 'à¦¬à§ƒà¦•à§à¦·à¦°à§‹à¦ªà¦£à§‡à¦° à¦—à§à¦°à¦¾à¦®à§‡à¦° à¦¨à¦¾à¦®', 'à¦¬à§à¦²à¦•', 'à¦‡à¦‰à¦¨à¦¿à¦¯à¦¼à¦¨', 'à¦‰à¦ªà¦œà§‡à¦²à¦¾', 'à¦œà§‡à¦²à¦¾',
  'à¦°à§‹à¦ªà¦£à¦•à§ƒà¦¤ à¦¬à§ƒà¦•à§à¦·à§‡à¦° à¦ªà§à¦°à¦œà¦¾à¦¤à¦¿à¦° à¦¨à¦¾à¦®', 'à¦°à§‹à¦ªà¦£à¦•à§ƒà¦¤ à¦¬à§ƒà¦•à§à¦·à§‡à¦° à¦šà¦¾à¦°à¦¾à¦° à¦ªà§à¦°à¦œà¦¾à¦¤à¦¿à¦­à¦¿à¦¤à§à¦¤à¦¿à¦• à¦¸à¦‚à¦–à§à¦¯à¦¾',
  'à¦¬à§ƒà¦•à§à¦·à¦°à§‹à¦ªà¦£à§‡à¦° à¦¤à¦¾à¦°à¦¿à¦–', 'à¦¬à§ƒà¦•à§à¦·à¦°à§‹à¦ªà¦£à§‡à¦° à¦¸à§à¦¨à¦¿à¦°à§à¦¦à¦¿à¦·à§à¦Ÿ à¦à¦²à¦¾à¦•à¦¾ à¦œà¦¿à¦“à¦—à§à¦°à¦¾à¦«à¦¿à¦•à§à¦¯à¦¾à¦² à¦•à§‹-à¦…à¦°à§à¦¡à¦¿à¦¨à§‡à¦Ÿ (à¦…à¦•à§à¦·à¦¾à¦‚à¦¶ à¦“ à¦¦à§à¦°à¦¾à¦˜à¦¿à¦®à¦¾à¦‚à¦¶)',
  'à¦ªà¦°à¦¿à¦šà¦°à§à¦¯à¦¾à¦•à¦¾à¦°à§€à¦° à¦¨à¦¾à¦®', 'à¦ªà¦°à¦¿à¦šà¦°à§à¦¯à¦¾à¦•à¦¾à¦°à§€à¦° à¦®à§‹à¦¬à¦¾à¦‡à¦² à¦¨à¦¾à¦®à§à¦¬à¦°', 'à¦¸à¦‚à¦¶à§à¦²à¦¿à¦·à§à¦Ÿ à¦à¦¸à¦à¦à¦“ à¦à¦° à¦¨à¦¾à¦®',
  'à¦¸à¦‚à¦¶à§à¦²à¦¿à¦·à§à¦Ÿ à¦à¦¸à¦à¦à¦“ à¦®à§‹à¦¬à¦¾à¦‡à¦² à¦¨à¦¾à¦®à§à¦¬à¦°', 'à¦®à¦¨à¦¿à¦Ÿà¦°à¦¿à¦‚ à¦…à¦«à¦¿à¦¸à¦¾à¦°à§‡à¦° à¦¨à¦¾à¦®', 'à¦®à¦¨à¦¿à¦Ÿà¦°à¦¿à¦‚ à¦…à¦«à¦¿à¦¸à¦¾à¦°à§‡à¦° à¦®à§‹à¦¬à¦¾à¦‡à¦² à¦¨à¦¾à¦®à§à¦¬à¦°', 'à¦®à¦¨à§à¦¤à¦¬à§à¦¯',
] as const;

/** Ministry 9-column headers â€” matches the "ministry report" sheet exactly. */
export const MINISTRY_HEADERS = [
  'à¦•à§à¦°à¦ƒ à¦¨à¦‚', 'à¦¬à§ƒà¦•à§à¦·à¦°à§‹à¦ªà¦£à§‡à¦° à¦œà§‡à¦²à¦¾, à¦‰à¦ªà¦œà§‡à¦²à¦¾, à¦‡à¦‰à¦¨à¦¿à¦¯à¦¼à¦¨ à¦“ à¦—à§à¦°à¦¾à¦®à§‡à¦° à¦¨à¦¾à¦®',
  'à¦°à§‹à¦ªà¦£à¦•à§ƒà¦¤ à¦¬à§ƒà¦•à§à¦·à§‡à¦° à¦ªà§à¦°à¦œà¦¾à¦¤à¦¿à¦° à¦¨à¦¾à¦®', 'à¦°à§‹à¦ªà¦£à¦•à§ƒà¦¤ à¦¬à§ƒà¦•à§à¦·à§‡à¦° à¦¸à¦‚à¦–à§à¦¯à¦¾',
  'à¦¬à§ƒà¦•à§à¦·à¦°à§‹à¦ªà¦£à§‡à¦° à¦¸à§à¦¨à¦¿à¦°à§à¦¦à¦¿à¦·à§à¦Ÿ à¦à¦²à¦¾à¦•à¦¾ (à¦œà¦¿à¦“à¦—à§à¦°à¦¾à¦«à¦¿à¦•à§à¦¯à¦¾à¦² à¦•à§‹à¦…à¦°à§à¦¡à¦¿à¦¨à§‡à¦Ÿà¦¸à¦¹)',
  'à¦ªà¦°à¦¿à¦šà¦°à§à¦¯à¦¾à¦•à¦¾à¦°à§€ à¦•à§ƒà¦·à¦•à§‡à¦° à¦¨à¦¾à¦® à¦“ à¦«à§‹à¦¨ à¦¨à¦®à§à¦¬à¦°', 'à¦¸à¦‚à¦¶à§à¦²à¦¿à¦·à§à¦Ÿ à¦à¦¸à¦à¦à¦“-à¦à¦° à¦¨à¦¾à¦® à¦“ à¦«à§‹à¦¨ à¦¨à¦®à§à¦¬à¦°',
  'à¦®à¦¨à¦¿à¦Ÿà¦°à¦¿à¦‚ à¦…à¦«à¦¿à¦¸à¦¾à¦°à§‡à¦° à¦¨à¦¾à¦® à¦“ à¦«à§‹à¦¨ à¦¨à¦®à§à¦¬à¦°', 'à¦®à¦¨à§à¦¤à¦¬à§à¦¯',
] as const;

export function build17ColRows(subs: ReportEntry[]): (string | number)[][] {
  const data: (string | number)[][] = [];
  let idx = 1;
  subs.forEach((s) => {
    const n = normalizeEntryForReport(s);
    n.rows.forEach((r) => {
      data.push([
        idx++, n.village, n.block, n.union, n.upazila, n.district,
        r.speciesName || MISSING, r.quantity, n.plantingDate, n.geoLocation,
        n.farmerName, n.farmerMobile, n.saaoName, n.saaoMobile,
        n.officerName, n.officerMobile, n.remarks,
      ]);
    });
  });
  return data;
}

export function buildMinistryRows(subs: ReportEntry[]): (string | number)[][] {
  const data: (string | number)[][] = [];
  let idx = 1;
  subs.forEach((s) => {
    const n = normalizeEntryForReport(s);
    n.rows.forEach((r) => {
      data.push([
        idx++, joinedLocation(n), r.speciesName || MISSING, r.quantity,
        n.geoLocation || MISSING,
        nameAndPhone(n.farmerName, n.farmerMobile),
        nameAndPhone(n.saaoName, n.saaoMobile),
        nameAndPhone(n.officerName, n.officerMobile),
        n.remarks,
      ]);
    });
  });
  return data;
}

/** Escapes a value for RFC-4180 CSV (quote-wrapped when needed). */
function csvCell(v: string | number): string {
  const s = String(v);
  return /[",\n\r]/.test(s) ? '"' + s.replace(/"/g, '""') + '"' : s;
}

/** Builds a UTF-8-BOM CSV (opens correctly in Excel with Bengali text). */
export function buildGovCsv(headers: readonly string[], rows: (string | number)[][]): string {
  const lines = [headers, ...rows].map((r) => r.map(csvCell).join(','));
  return '\uFEFF' + lines.join('\r\n');
}

/** Browser-only: downloads the CSV as a file named with today's date. */
export function downloadGovCsv(headers: readonly string[], rows: (string | number)[][], fileTag: string): void {
  const csv = buildGovCsv(headers, rows);
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `${fileTag}_${new Date().toISOString().slice(0, 10)}.csv`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}


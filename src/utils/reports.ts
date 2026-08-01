/**
 * Report generation utilities for Plantation Tracker.
 * Provides Ministry 9-col, 17-col government reports, Excel/Print exports.
 */

import type { Submission } from '../components/OfflinePlantationDashboard';
import { countSeedlings } from '../types/plantation';
import { toBnNum } from './geoUtils';
import { BD } from '../data/adminData';

// ------------------------------------------------------------------
// Types
// ------------------------------------------------------------------

export interface NormalisedRow {
  id: string;
  source: 'local' | 'national';
  region: string;
  division: string;
  district: string;
  upazila: string;
  union: string;
  village: string;
  farmerName: string;
  farmerMobile: string;
  officerName: string;
  officerMobile: string;
  saaoName: string;
  saaoMobile: string;
  species: string;
  fruit: number;
  forest: number;
  medicinal: number;
  total: number;
  date: string;
  geoLocation: string;
  address: string;
  remarks: string;
  sourceType: string;
  locationType: string;
  block: string;
}

// ------------------------------------------------------------------
// Normalisation
// ------------------------------------------------------------------

function getSeedlingCounts(s: any): { fruit: number; forest: number; medicinal: number; total: number; species: string } {
  let fruit = 0, forest = 0, medicinal = 0;
  let speciesList: string[] = [];

  if (Array.isArray(s.seedlings) && s.seedlings.length > 0) {
    s.seedlings.forEach((item: any) => {
      const qty = parseInt(String(item.quantity), 10) || 0;
      const cat = (item.category || '').trim();
      const name = (item.speciesName || item.name || '').trim();
      if (name) speciesList.push(name);
      if (cat.indexOf('ফল') === 0 || cat === 'fruit') fruit += qty;
      else if (cat.indexOf('বন') === 0 || cat === 'forest') forest += qty;
      else if (cat.indexOf('ঔষ') === 0 || cat === 'medicinal') medicinal += qty;
      else fruit += qty;
    });
  } else {
    try {
      const counts = countSeedlings(s);
      fruit = counts.fruit; forest = counts.forest; medicinal = counts.medicinal;
    } catch { /* fall through */ }
  }

  const species = speciesList.length > 0 ? speciesList.join(', ') : (s.species || s.speciesName || '');
  return { fruit, forest, medicinal, total: fruit + forest + medicinal, species };
}

function findDivision(district: string): string {
  if (!district) return '';
  for (const [div, districts] of Object.entries(BD as Record<string, string[]>)) {
    if (districts.includes(district)) return div;
  }
  return '';
}

export function normaliseEntries(submissions: Submission[], nationalEntries: any[] = []): NormalisedRow[] {
  const rows: NormalisedRow[] = [];

  submissions.forEach((s) => {
    const c = getSeedlingCounts(s);
    rows.push({
      id: s.id,
      source: 'local',
      region: s.region || '',
      division: s.division || findDivision(s.district) || '',
      district: s.district || '',
      upazila: s.upazila || '',
      union: s.union || '',
      village: s.village || '',
      farmerName: s.farmerName || s.nurseryName || '',
      farmerMobile: s.farmerMobile || s.mobile || '',
      officerName: s.officerName || s.caretakerName || '',
      officerMobile: s.officerMobile || s.caretakerMobile || '',
      saaoName: s.saaoName || '',
      saaoMobile: s.saaoMobile || '',
      species: c.species,
      fruit: c.fruit, forest: c.forest, medicinal: c.medicinal, total: c.total,
      date: s.submittedAt || s.plantingDate || '',
      geoLocation: s.geoLocation || (s.latitude && s.longitude ? `${s.latitude}, ${s.longitude}` : ''),
      address: s.address || '',
      remarks: s.remarks || '',
      sourceType: (s as any).sourceType || '',
      locationType: s.locationType || '',
      block: (s as any).block || '',
    });
  });

  nationalEntries.forEach((n: any) => {
    const c = getSeedlingCounts(n);
    rows.push({
      id: n.id || n.submissionId || '',
      source: 'national',
      region: n.region || '',
      division: n.division || findDivision(n.district) || '',
      district: n.district || '',
      upazila: n.upazila || '',
      union: n.union || '',
      village: n.village || '',
      farmerName: n.farmerName || n.nurseryName || '',
      farmerMobile: n.farmerMobile || n.mobile || '',
      officerName: n.officerName || n.saaoName || '',
      officerMobile: n.officerMobile || n.saaoMobile || '',
      saaoName: n.saaoName || '',
      saaoMobile: n.saaoMobile || '',
      species: c.species,
      fruit: c.fruit, forest: c.forest, medicinal: c.medicinal, total: c.total,
      date: n.submittedAt || n.plantingDate || '',
      geoLocation: n.geoLocation || n.coordinates || '',
      address: n.address || '',
      remarks: n.remarks || '',
      sourceType: n.sourceType || '',
      locationType: n.locationType || '',
      block: n.block || '',
    });
  });

  return rows;
}

// ------------------------------------------------------------------
// TSV/XLS helper (matching legacy approach)
// ------------------------------------------------------------------

function tsvCell(v: string | number): string {
  const s = String(v ?? '');
  return s.includes('\t') ? `"${s.replace(/"/g, '""')}"` : s;
}

function downloadBlob(content: string, filename: string, mimeType: string) {
  const bom = '\uFEFF';
  const blob = new Blob([bom + content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

function formatDateBn(iso?: string): string {
  if (!iso) return '';
  try { return new Date(iso).toLocaleDateString('bn-BD'); } catch { return iso; }
}

// ------------------------------------------------------------------
// #38: Government Ministry 9-col report (Excel/TSV)
// ------------------------------------------------------------------

export function exportMinistry9ColExcel(entries: NormalisedRow[]) {
  const header = ['ক্র.নং', 'জেলা/উপজেলা/গ্রাম', 'প্রজাতি', 'সংখ্যা', 'তারিখ', 'জিও কোঅর্ডিনেট', 'রোপণকারী/কৃষক', 'মোবাইল', 'মন্তব্য'];
  const rows = entries.map((e, i) => [
    i + 1,
    [e.district, e.upazila, e.village].filter(Boolean).join('/'),
    e.species,
    e.total,
    formatDateBn(e.date),
    e.geoLocation,
    e.farmerName,
    e.farmerMobile,
    e.remarks,
  ]);
  const tsv = [header, ...rows].map((r) => r.map(tsvCell).join('\t')).join('\n');
  downloadBlob(tsv, `ministry_9col_${new Date().toISOString().slice(0, 10)}.xls`, 'application/vnd.ms-excel;charset=utf-8;');
}

// ------------------------------------------------------------------
// #39: Government Ministry 9-col report (Print)
// ------------------------------------------------------------------

export function exportMinistry9ColPrint(entries: NormalisedRow[]) {
  const header = ['ক্র.নং', 'জেলা/উপজেলা/গ্রাম', 'প্রজাতি', 'সংখ্যা', 'তারিখ', 'জিও কোঅর্ডিনেট', 'রোপণকারী/কৃষক', 'মোবাইল', 'মন্তব্য'];
  const rows = entries.map((e, i) =>
    `<tr><td>${i + 1}</td><td>${[e.district, e.upazila, e.village].filter(Boolean).join('/')}</td><td>${e.species}</td><td>${toBnNum(e.total)}</td><td>${formatDateBn(e.date)}</td><td>${e.geoLocation}</td><td>${e.farmerName}</td><td>${e.farmerMobile}</td><td>${e.remarks}</td></tr>`
  ).join('');

  const html = `<!DOCTYPE html><html><head><meta charset="utf-8"><title>মন্ত্রণালয় রিপোর্ট</title><style>body{font-family:sans-serif;font-size:12px;padding:20px}table{width:100%;border-collapse:collapse}th,td{border:1px solid #333;padding:6px;text-align:left}th{background:#f0f0f0;font-weight:bold}.header{text-align:center;margin-bottom:20px}</style></head><body>
  <div class="header"><h1>বৃক্ষরোপণ তথ্য — মন্ত্রণালয় রিপোর্ট</h1><p>${new Date().toLocaleDateString('bn-BD')}</p></div>
  <table><thead><tr>${header.map((h) => `<th>${h}</th>`).join('')}</tr></thead><tbody>${rows}</tbody></table>
  <script>window.onload=()=>window.print();</script></body></html>`;

  const w = window.open('', '_blank');
  if (w) { w.document.write(html); w.document.close(); }
}

// ------------------------------------------------------------------
// #40: 17-Column government report (Excel/TSV)
// ------------------------------------------------------------------

export function export17ColExcel(entries: NormalisedRow[]) {
  const header = [
    'ক্র.নং', 'অঞ্চল/বিভাগ', 'জেলা', 'উপজেলা', 'ইউনিয়ন', 'গ্রাম',
    'রোপণকারী/কৃষক', 'মোবাইল', 'SAAO নাম', 'SAAO মোবাইল',
    'মনিটরিং অফিসার', 'অফিসার মোবাইল',
    'ফলদ', 'বনজ', 'ঔষধি', 'মোট',
    'রোপণের তারিখ', 'জিও কোঅর্ডিনেট', 'ঠিকানা', 'স্থানের ধরন', 'উৎস', 'ব্লক', 'মন্তব্য',
  ];
  const rows = entries.map((e, i) => [
    i + 1, e.region, e.district, e.upazila, e.union, e.village,
    e.farmerName, e.farmerMobile, e.saaoName, e.saaoMobile,
    e.officerName, e.officerMobile,
    e.fruit, e.forest, e.medicinal, e.total,
    formatDateBn(e.date), e.geoLocation, e.address, e.locationType, e.sourceType, e.block, e.remarks,
  ]);
  const tsv = [header, ...rows].map((r) => r.map(tsvCell).join('\t')).join('\n');
  downloadBlob(tsv, `govt_17col_${new Date().toISOString().slice(0, 10)}.xls`, 'application/vnd.ms-excel;charset=utf-8;');
}

// ------------------------------------------------------------------
// #41: 17-Column government report (Print)
// ------------------------------------------------------------------

export function export17ColPrint(entries: NormalisedRow[]) {
  const header = [
    'ক্র.নং', 'অঞ্চল/বিভাগ', 'জেলা', 'উপজেলা', 'ইউনিয়ন', 'গ্রাম',
    'রোপণকারী/কৃষক', 'মোবাইল', 'SAAO নাম', 'SAAO মোবাইল',
    'মনিটরিং অফিসার', 'অফিসার মোবাইল',
    'ফলদ', 'বনজ', 'ঔষধি', 'মোট',
    'রোপণের তারিখ', 'জিও কোঅর্ডিনেট', 'ঠিকানা', 'স্থানের ধরন', 'উৎস', 'ব্লক', 'মন্তব্য',
  ];
  const rows = entries.map((e, i) =>
    `<tr><td>${i + 1}</td><td>${e.region}</td><td>${e.district}</td><td>${e.upazila}</td><td>${e.union}</td><td>${e.village}</td><td>${e.farmerName}</td><td>${e.farmerMobile}</td><td>${e.saaoName}</td><td>${e.saaoMobile}</td><td>${e.officerName}</td><td>${e.officerMobile}</td><td>${e.fruit}</td><td>${e.forest}</td><td>${e.medicinal}</td><td>${e.total}</td><td>${formatDateBn(e.date)}</td><td>${e.geoLocation}</td><td>${e.address}</td><td>${e.locationType}</td><td>${e.sourceType}</td><td>${e.block}</td><td>${e.remarks}</td></tr>`
  ).join('');

  const html = `<!DOCTYPE html><html><head><meta charset="utf-8"><title>১৭-কলাম সরকারি রিপোর্ট</title><style>body{font-family:sans-serif;font-size:10px;padding:10px}table{width:100%;border-collapse:collapse}th,td{border:1px solid #333;padding:4px;text-align:left;font-size:10px}th{background:#f0f0f0;font-weight:bold}.header{text-align:center;margin-bottom:15px}</style></head><body>
  <div class="header"><h1>বৃক্ষরোপণ তথ্য — ১৭-কলাম সরকারি রিপোর্ট</h1><p>${new Date().toLocaleDateString('bn-BD')}</p></div>
  <table><thead><tr>${header.map((h) => `<th>${h}</th>`).join('')}</tr></thead><tbody>${rows}</tbody></table>
  <script>window.onload=()=>window.print();</script></body></html>`;

  const w = window.open('', '_blank');
  if (w) { w.document.write(html); w.document.close(); }
}

// ------------------------------------------------------------------
// #42: General CSV export
// ------------------------------------------------------------------

export function exportGeneralCSV(entries: NormalisedRow[]) {
  const header = ['ক্রম', 'অঞ্চল', 'জেলা', 'উপজেলা', 'রোপণকারী', 'মোবাইল', 'ফলদ', 'বনজ', 'ঔষধি', 'মোট', 'তারিখ'];
  const rows = entries.map((e, i) => [
    i + 1, e.region, e.district, e.upazila, e.farmerName, e.farmerMobile,
    e.fruit, e.forest, e.medicinal, e.total,
    formatDateBn(e.date),
  ]);
  const csv = [header, ...rows].map((r) => r.map((c) => {
    const s = String(c ?? '').replace(/"/g, '""');
    return s.includes(',') || s.includes('\n') || s.includes('"') ? `"${s}"` : s;
  }).join(',')).join('\n');
  downloadBlob(csv, `plantation_general_${new Date().toISOString().slice(0, 10)}.csv`, 'text/csv;charset=utf-8;');
}

// ------------------------------------------------------------------
// General print
// ------------------------------------------------------------------

export function exportGeneralPrint(entries: NormalisedRow[]) {
  const header = ['ক্রম', 'অঞ্চল', 'জেলা', 'উপজেলা', 'রোপণকারী', 'মোবাইল', 'ফলদ', 'বনজ', 'ঔষধি', 'মোট', 'তারিখ'];
  const rows = entries.map((e, i) =>
    `<tr><td>${i + 1}</td><td>${e.region}</td><td>${e.district}</td><td>${e.upazila}</td><td>${e.farmerName}</td><td>${e.farmerMobile}</td><td>${e.fruit}</td><td>${e.forest}</td><td>${e.medicinal}</td><td>${e.total}</td><td>${formatDateBn(e.date)}</td></tr>`
  ).join('');

  const html = `<!DOCTYPE html><html><head><meta charset="utf-8"><title>সাধারণ রিপোর্ট</title><style>body{font-family:sans-serif;font-size:12px;padding:20px}table{width:100%;border-collapse:collapse}th,td{border:1px solid #333;padding:6px;text-align:left}th{background:#f0f0f0;font-weight:bold}.header{text-align:center;margin-bottom:20px}</style></head><body>
  <div class="header"><h1>বৃক্ষরোপণ তথ্য — সাধারণ রিপোর্ট</h1><p>${new Date().toLocaleDateString('bn-BD')}</p></div>
  <table><thead><tr>${header.map((h) => `<th>${h}</th>`).join('')}</tr></thead><tbody>${rows}</tbody></table>
  <script>window.onload=()=>window.print();</script></body></html>`;

  const w = window.open('', '_blank');
  if (w) { w.document.write(html); w.document.close(); }
}

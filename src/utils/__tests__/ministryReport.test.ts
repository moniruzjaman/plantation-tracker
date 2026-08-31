import { describe, it, expect } from 'vitest';
import {
  normalizeEntryForReport,
  build17ColRows,
  buildMinistryRows,
  buildGovCsv,
  COL17_HEADERS,
  MINISTRY_HEADERS,
  type ReportEntry,
} from '../ministryReport';

const fullEntry: ReportEntry = {
  village: 'চর রাজিবপুর',
  block: 'ব্লক-১',
  union: 'চর রাজিবপুর ইউনিয়ন',
  upazila: 'রাজিবপুর',
  district: 'কুড়িগ্রাম',
  geoLocation: '25.8, 89.6',
  plantingDate: '2026-07-15',
  farmerName: 'আব্দুল করিম',
  farmerMobile: '01700000000',
  saaoName: 'এসএএও নাম',
  saaoMobile: '01800000000',
  officerName: 'মনিটরিং অফিসার',
  officerMobile: '01900000000',
  remarks: 'ভালো অগ্রগতি',
  seedlings: [
    { speciesName: 'আম', quantity: 25 },
    { speciesName: 'মহোগনি', quantity: 40 },
  ],
};

describe('normalizeEntryForReport', () => {
  it('expands one row per seedling species', () => {
    const n = normalizeEntryForReport(fullEntry);
    expect(n.rows).toHaveLength(2);
    expect(n.rows[0]).toEqual({ speciesName: 'আম', quantity: 25 });
  });

  it('falls back to legacy category shape when seedlings[] is absent', () => {
    const n = normalizeEntryForReport({
      fruitSeedlings: [{ name: 'আম', count: 10, graftingCount: 5 }],
      forestSeedlings: [{ name: 'শাল', count: 7, graftingCount: 0 }],
    });
    expect(n.rows).toHaveLength(2);
    expect(n.rows[0]).toEqual({ speciesName: 'আম', quantity: 15 });
    expect(n.rows[1]).toEqual({ speciesName: 'শাল', quantity: 7 });
  });

  it('yields one zero row when there are no seedlings at all', () => {
    const n = normalizeEntryForReport({ district: 'কুড়িগ্রাম' });
    expect(n.rows).toEqual([{ speciesName: '', quantity: 0 }]);
  });

  it('derives geoLocation from lat/lng and date from submittedAt as fallbacks', () => {
    const n = normalizeEntryForReport({ latitude: '25.8', longitude: '89.6', submittedAt: '2026-08-11T02:00:00Z' });
    expect(n.geoLocation).toBe('25.8, 89.6');
    expect(n.plantingDate).toBe('2026-08-11');
  });

  it('falls back to legacy name fields', () => {
    const n = normalizeEntryForReport({ nurseryName: 'নার্সারি', mobile: '01711', caretakerName: 'যত্নশীল' });
    expect(n.farmerName).toBe('নার্সারি');
    expect(n.farmerMobile).toBe('01711');
    expect(n.officerName).toBe('যত্নশীল');
  });
});

describe('build17ColRows / buildMinistryRows', () => {
  it('numbers rows serially across entries and species', () => {
    const rows = build17ColRows([fullEntry, fullEntry]);
    expect(rows).toHaveLength(4); // 2 species x 2 entries
    expect(rows.map((r) => r[0])).toEqual([1, 2, 3, 4]);
  });

  it('17-col row matches the official column order', () => {
    const [row] = build17ColRows([fullEntry]);
    expect(row).toEqual([
      1, 'চর রাজিবপুর', 'ব্লক-১', 'চর রাজিবপুর ইউনিয়ন', 'রাজিবপুর', 'কুড়িগ্রাম',
      'আম', 25, '2026-07-15', '25.8, 89.6',
      'আব্দুল করিম', '01700000000', 'এসএএও নাম', '01800000000',
      'মনিটরিং অফিসার', '01900000000', 'ভালো অগ্রগতি',
    ]);
  });

  it('ministry row joins the location sentence and name+phone pairs', () => {
    const [row] = buildMinistryRows([fullEntry]);
    expect(row[0]).toBe(1);
    expect(row[1]).toContain('গ্রামঃ চর রাজিবপুর');
    expect(row[1]).toContain('জেলাঃ কুড়িগ্রাম');
    expect(row[5]).toBe('আব্দুল করিম 01700000000');
    expect(row[6]).toBe('এসএএও নাম 01800000000');
    expect(row[7]).toBe('মনিটরিং অফিসার 01900000000');
  });

  it('labels missing species with উল্লেখ নেই', () => {
    const [row] = build17ColRows([{ village: 'x', geoLocation: '1, 2' }]);
    expect(row[6]).toBe('উল্লেখ নেই');
  });
});

describe('buildGovCsv', () => {
  it('prefixes a UTF-8 BOM so Excel renders Bengali', () => {
    const csv = buildGovCsv(COL17_HEADERS, build17ColRows([fullEntry]));
    expect(csv.charCodeAt(0)).toBe(0xfeff);
  });

  it('quotes cells containing commas/quotes/newlines', () => {
    const csv = buildGovCsv(['a', 'b'], [[1, 'ভালো, "খুব"']]);
    expect(csv).toContain('1,"ভালো, ""খুব"""');
  });

  it('exposes both header sets at 17 and 9 columns', () => {
    expect(COL17_HEADERS).toHaveLength(17);
    expect(MINISTRY_HEADERS).toHaveLength(9);
  });
});

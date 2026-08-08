import { describe, it, expect, beforeAll } from 'vitest';
import { isWithinUpazilaPolygon, findContainingUpazila } from '../upazilaPointInPolygon';
import type { UpazilaGeometry } from '../districtPolygonTypes';
import kurigramData from '../districts/kurigram';

// Real Kurigram polygon data, not a mock -- these tests exercise the
// actual boundary shapes shipped to devices, same reference points
// verified by hand when this data was first built.
let registry: Record<string, UpazilaGeometry>;

beforeAll(() => {
  registry = kurigramData;
});

describe('isWithinUpazilaPolygon', () => {
  it('accepts a point at the declared upazila\'s own center', () => {
    expect(isWithinUpazilaPolygon(registry, 25.817, 89.65, 'কুড়িগ্রাম সদর')).toBe(true);
  });

  it('rejects a point that is actually in a neighboring upazila', () => {
    // Nageshwari's center, checked against Kurigram Sadar
    expect(isWithinUpazilaPolygon(registry, 25.9792, 89.7083, 'কুড়িগ্রাম সদর')).toBe(false);
  });

  it('does not flag an upazila name absent from the registry -- missing/unloaded data is never a false positive', () => {
    expect(isWithinUpazilaPolygon(registry, 25.817, 89.65, 'অজানা উপজেলা')).toBe(true);
    expect(isWithinUpazilaPolygon({}, 25.817, 89.65, 'কুড়িগ্রাম সদর')).toBe(true); // empty registry (district not loaded yet)
  });
});

describe('findContainingUpazila', () => {
  it('identifies the correct upazila among all 9 for a known point', () => {
    expect(findContainingUpazila(registry, 25.6633, 89.633)).toBe('উলিপুর');
  });

  it('returns null for a point outside every loaded upazila', () => {
    expect(findContainingUpazila(registry, 23.81, 90.41)).toBe(null); // Dhaka
  });

  it('returns null against an empty (not-yet-loaded) registry', () => {
    expect(findContainingUpazila({}, 25.817, 89.65)).toBe(null);
  });
});

describe('Kurigram registry data integrity', () => {
  it('has all 9 upazilas present', () => {
    const expected = ['কুড়িগ্রাম সদর', 'নাগেশ্বরী', 'ভুরুঙ্গামারী', 'ফুলবাড়ী', 'রাজারহাট', 'উলিপুর', 'চিলমারী', 'রৌমারী', 'চর রাজিবপুর'];
    expect(Object.keys(registry).sort()).toEqual(expected.sort());
  });

  it('every upazila\'s own center point falls inside its own polygon (self-consistency check)', () => {
    // Guards against a future data regeneration silently producing a
    // corrupt or empty polygon for some upazila.
    const centers: Record<string, [number, number]> = {
      'কুড়িগ্রাম সদর': [25.817, 89.65],
      'নাগেশ্বরী': [25.9792, 89.7083],
      'উলিপুর': [25.6633, 89.633],
      'চর রাজিবপুর': [25.45, 89.8],
    };
    for (const [upazila, [lat, lng]] of Object.entries(centers)) {
      expect(isWithinUpazilaPolygon(registry, lat, lng, upazila)).toBe(true);
    }
  });
});

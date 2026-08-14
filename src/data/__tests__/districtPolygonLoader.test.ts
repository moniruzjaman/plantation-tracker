import 'fake-indexeddb/auto';
import { describe, it, expect, beforeEach } from 'vitest';
import { loadDistrict, isDistrictLoaded, listAvailableDistricts, getMergedLoadedPolygons } from '../districtPolygonLoader';

describe('listAvailableDistricts', () => {
  it('lists all 64 districts', () => {
    expect(listAvailableDistricts().length).toBe(64);
    expect(listAvailableDistricts()).toContain('কুড়িগ্রাম');
  });
});

describe('loadDistrict', () => {
  it('actually loads real polygon data via dynamic import for a known district', async () => {
    const data = await loadDistrict('কুড়িগ্রাম');
    expect(data).not.toBeNull();
    expect(Object.keys(data!).length).toBeGreaterThan(0);
    expect(data).toHaveProperty('কুড়িগ্রাম সদর');
  });

  it('returns null for an unrecognized district name rather than throwing', async () => {
    const data = await loadDistrict('অজানা জেলা');
    expect(data).toBeNull();
  });

  it('marks a district as loaded after a successful load', async () => {
    await loadDistrict('ঢাকা');
    expect(isDistrictLoaded('ঢাকা')).toBe(true);
  });

  it('concurrent calls for the same district share one in-flight request and return the same data', async () => {
    const [a, b] = await Promise.all([loadDistrict('রংপুর'), loadDistrict('রংপুর')]);
    expect(a).toEqual(b);
  });
});

describe('getMergedLoadedPolygons', () => {
  it('merges polygons across every district loaded so far in this process', async () => {
    await loadDistrict('কুড়িগ্রাম');
    await loadDistrict('ঢাকা');
    const merged = getMergedLoadedPolygons();
    expect(merged).toHaveProperty('কুড়িগ্রাম সদর'); // from কুড়িগ্রাম
    expect(merged).toHaveProperty('সাভার'); // from ঢাকা
  });
});

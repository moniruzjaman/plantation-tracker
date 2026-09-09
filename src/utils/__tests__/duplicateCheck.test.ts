import { describe, it, expect } from 'vitest';
import {
  haversineM,
  detectDuplicateSites,
  DUPLICATE_THRESHOLD_M,
  type GeoPoint,
} from '../duplicateCheck';

describe('haversineM', () => {
  it('returns 0 for identical coordinates', () => {
    expect(haversineM(25.8, 89.6, 25.8, 89.6)).toBe(0);
  });

  it('measures a known short distance accurately', () => {
    // ~111 m per 0.001° of latitude near Bangladesh's latitude.
    const d = haversineM(25.8, 89.6, 25.801, 89.6);
    expect(d).toBeGreaterThan(100);
    expect(d).toBeLessThan(120);
  });

  it('is symmetric', () => {
    expect(haversineM(25.8, 89.6, 24.0, 90.4)).toBeCloseTo(haversineM(24.0, 90.4, 25.8, 89.6), 6);
  });
});

describe('detectDuplicateSites', () => {
  it('returns an empty map when there are no points or no duplicates', () => {
    expect(detectDuplicateSites([]).size).toBe(0);
    const far: GeoPoint[] = [
      { key: 'a', lat: 25.8, lng: 89.6 },
      { key: 'b', lat: 24.0, lng: 90.4 },
    ];
    expect(detectDuplicateSites(far).size).toBe(0);
  });

  it('flags two points within the threshold', () => {
    // ~11 m apart — clearly a duplicate.
    const pts: GeoPoint[] = [
      { key: 'a', lat: 25.8000, lng: 89.6000 },
      { key: 'b', lat: 25.8001, lng: 89.6000 },
    ];
    const dup = detectDuplicateSites(pts);
    expect(dup.size).toBe(2);
    expect(dup.get('a')?.nearbyCount).toBe(1);
    expect(dup.get('a')?.nearbyKeys).toEqual(['b']);
    expect(dup.get('a')?.minDistanceM).toBeLessThan(DUPLICATE_THRESHOLD_M);
    expect(dup.get('b')?.nearbyKeys).toEqual(['a']);
  });

  it('flags exact coordinate duplicates with distance 0', () => {
    const pts: GeoPoint[] = [
      { key: 'a', lat: 25.8, lng: 89.6 },
      { key: 'b', lat: 25.8, lng: 89.6 },
    ];
    const dup = detectDuplicateSites(pts);
    expect(dup.get('a')?.minDistanceM).toBe(0);
  });

  it('does not flag a point against itself and reports correct counts for clusters', () => {
    // Three-way cluster within ~20 m.
    const pts: GeoPoint[] = [
      { key: 'a', lat: 25.80000, lng: 89.60000 },
      { key: 'b', lat: 25.80010, lng: 89.60000 },
      { key: 'c', lat: 25.80015, lng: 89.60000 },
    ];
    const dup = detectDuplicateSites(pts);
    expect(dup.get('a')?.nearbyCount).toBe(2);
    expect(dup.get('b')?.nearbyCount).toBe(2);
    expect(dup.get('c')?.nearbyCount).toBe(2);
    // c is closest to b.
    expect(dup.get('c')?.nearbyKeys).toContain('b');
  });

  it('honours a custom threshold', () => {
    const pts: GeoPoint[] = [
      { key: 'a', lat: 25.8, lng: 89.6 },
      { key: 'b', lat: 25.801, lng: 89.6 }, // ~111 m
    ];
    expect(detectDuplicateSites(pts).size).toBe(0);
    expect(detectDuplicateSites(pts, 200).size).toBe(2);
  });
});

import { describe, it, expect } from 'vitest';
import { to7Decimals, haversineDistanceMeters } from './gps-utils';

describe('gps-utils', () => {
  it('rounds to 7 decimals', () => {
    expect(to7Decimals(23.6850123456789)).toBe(23.6850123);
  });

  it('calculates haversine distance', () => {
    const dist = haversineDistanceMeters(23.6850, 90.3563, 23.8103, 90.4125);
    expect(dist).toBeGreaterThan(10000);
    expect(dist).toBeLessThan(20000);
  });
});

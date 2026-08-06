/**
 * Tests for geoUtils — haversine distance, polygon area, BD coordinate validation, etc.
 */
import { describe, it, expect } from 'vitest';
import {
  haversineMeters,
  polygonAreaSqm,
  isValidBdCoord,
  upazilaColor,
  toBnNum,
} from '../utils/geoUtils';

describe('haversineMeters', () => {
  it('calculates distance between Dhaka and Chittagong', () => {
    // Dhaka: 23.8103, 90.4125; Chittagong: 22.3564, 91.7832
    const dist = haversineMeters(23.8103, 90.4125, 22.3564, 91.7832);
    // Approximate distance is ~250 km = ~250,000 m
    expect(dist).toBeGreaterThan(200000);
    expect(dist).toBeLessThan(300000);
  });

  it('returns 0 for same coordinates', () => {
    expect(haversineMeters(23.8103, 90.4125, 23.8103, 90.4125)).toBe(0);
  });

  it('calculates distance for short distances accurately', () => {
    // ~100m apart at the equator
    const dist = haversineMeters(0, 0, 0, 0.001);
    expect(dist).toBeGreaterThan(90);
    expect(dist).toBeLessThan(120);
  });
});

describe('polygonAreaSqm', () => {
  it('calculates area of a simple square (100m × 100m)', () => {
    const points = [
      { lat: 0, lng: 0 },
      { lat: 0, lng: 0.001 },    // ~100m east
      { lat: 0.001, lng: 0.001 }, // ~100m northeast
      { lat: 0.001, lng: 0 },    // ~100m north
    ];
    const area = polygonAreaSqm(points);
    // Expected ~10,000 sqm (100m × 100m), with tolerance for geodetic approximation
    expect(area).toBeGreaterThan(8000);
    expect(area).toBeLessThan(15000);
  });

  it('returns 0 for less than 3 points', () => {
    expect(polygonAreaSqm([])).toBe(0);
    expect(polygonAreaSqm([{ lat: 0, lng: 0 }])).toBe(0);
    expect(polygonAreaSqm([{ lat: 0, lng: 0 }, { lat: 1, lng: 1 }])).toBe(0);
  });

  it('calculates area for a triangle', () => {
    const points = [
      { lat: 0, lng: 0 },
      { lat: 0, lng: 0.001 },
      { lat: 0.001, lng: 0 },
    ];
    const area = polygonAreaSqm(points);
    expect(area).toBeGreaterThan(0);
  });
});

describe('isValidBdCoord', () => {
  it('accepts valid Dhaka coordinates', () => {
    expect(isValidBdCoord(23.8103, 90.4125)).toBe(true);
  });

  it('accepts valid Chittagong coordinates', () => {
    expect(isValidBdCoord(22.3564, 91.7832)).toBe(true);
  });

  it('rejects coordinates outside Bangladesh (India)', () => {
    expect(isValidBdCoord(28.6139, 77.2090)).toBe(false); // New Delhi
  });

  it('rejects coordinates outside Bangladesh (Myanmar)', () => {
    expect(isValidBdCoord(16.8661, 96.1951)).toBe(false); // Yangon
  });

  it('rejects null island coordinates', () => {
    expect(isValidBdCoord(0, 0)).toBe(false);
  });

  it('rejects negative coordinates', () => {
    expect(isValidBdCoord(-1, -1)).toBe(false);
  });
});

describe('upazilaColor', () => {
  it('returns a valid color string', () => {
    const color = upazilaColor('ঢাকা');
    expect(color).toMatch(/^#[0-9a-f]{6}$/i);
  });

  it('returns consistent color for same input', () => {
    expect(upazilaColor('ঢাকা')).toBe(upazilaColor('ঢাকা'));
  });

  it('returns different colors for different inputs', () => {
    expect(upazilaColor('ঢাকা')).not.toBe(upazilaColor('চট্টগ্রাম'));
  });
});

describe('toBnNum', () => {
  it('converts 0 to Bangla zero', () => {
    expect(toBnNum(0)).toBe('০');
  });

  it('converts 123 to Bangla', () => {
    expect(toBnNum(123)).toContain('১২৩');
  });

  it('converts 1000000 to Bangla', () => {
    expect(toBnNum(1000000)).toContain('১০০০০০০');
  });

  it('handles negative numbers', () => {
    expect(toBnNum(-5)).toContain('৫');
  });
});

import { describe, it, expect } from 'vitest';
import { isValidBdCoord } from '../../utils/mapHelper';

describe('isValidBdCoord', () => {
  it('accepts a point well inside Bangladesh', () => {
    expect(isValidBdCoord(25.817, 89.65)).toBe(true);
  });

  it('rejects a point well outside Bangladesh', () => {
    expect(isValidBdCoord(29.5, 89.7)).toBe(false); // well into India
  });

  it('rejects the (0, 0) null-island sentinel some GPS failures produce', () => {
    expect(isValidBdCoord(0, 0)).toBe(false);
  });

  it('rejects NaN coordinates rather than throwing', () => {
    expect(isValidBdCoord(NaN, NaN)).toBe(false);
  });
});

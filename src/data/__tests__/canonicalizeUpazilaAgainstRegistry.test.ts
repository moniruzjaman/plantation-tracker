import { describe, it, expect } from 'vitest';
import { canonicalizeUpazilaAgainstRegistry } from '../canonicalizeUpazilaAgainstRegistry';

const registry = ['কুড়িগ্রাম সদর', 'নাগেশ্বরী', 'ভুরুঙ্গামারী', 'ফুলবাড়ী', 'উলিপুর'];

describe('canonicalizeUpazilaAgainstRegistry', () => {
  it('leaves an already-canonical value unchanged', () => {
    expect(canonicalizeUpazilaAgainstRegistry('ফুলবাড়ী', registry)).toBe('ফুলবাড়ী');
  });

  it('resolves a Unicode NFD-form variant to the registry\'s NFC form', () => {
    const nfd = 'ভুরুঙ্গামারী'.normalize('NFD');
    expect(canonicalizeUpazilaAgainstRegistry(nfd, registry)).toBe('ভুরুঙ্গামারী');
  });

  it('resolves a vowel-sign spelling variant (ী vs ি)', () => {
    expect(canonicalizeUpazilaAgainstRegistry('নাগেশ্বরি', registry)).toBe('নাগেশ্বরী');
  });

  it('resolves a value with extra trailing text via containment', () => {
    expect(canonicalizeUpazilaAgainstRegistry('কুড়িগ্রাম সদর উপজেলা', registry)).toBe('কুড়িগ্রাম সদর');
  });

  it('returns an unrelated value unchanged rather than guessing wrong', () => {
    expect(canonicalizeUpazilaAgainstRegistry('ঢাকা', registry)).toBe('ঢাকা');
  });

  it('works against an empty registry (district not loaded yet) without throwing', () => {
    expect(canonicalizeUpazilaAgainstRegistry('ফুলবাড়ী', [])).toBe('ফুলবাড়ী');
  });

  it('handles empty, null, and undefined without throwing', () => {
    expect(canonicalizeUpazilaAgainstRegistry('', registry)).toBe('');
    expect(canonicalizeUpazilaAgainstRegistry(null, registry)).toBe('');
    expect(canonicalizeUpazilaAgainstRegistry(undefined, registry)).toBe('');
  });
});

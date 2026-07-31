/**
 * Tests for API service — sendToGAS, fetchNationalEntries, lookupMobile.
 */
import { describe, it, expect, vi, beforeEach } from 'vitest';
import {
  sendToGAS,
  fetchNationalEntries,
  lookupMobile,
} from '../services/api';
import { GAS_SYNC_ENDPOINT } from '../data/adminData';

// We'll test the actual functions but mock fetch
global.fetch = vi.fn();

describe('sendToGAS', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('sends POST to GAS endpoint with payload', async () => {
    const mockResponse = { ok: true, results: [] };
    (global.fetch as ReturnType<typeof vi.fn>).mockResolvedValue({
      ok: true,
      json: () => Promise.resolve(mockResponse),
    });

    const result = await sendToGAS([{ id: 'PT-1', farmerName: 'Test' }]);
    expect(global.fetch).toHaveBeenCalledWith(
      GAS_SYNC_ENDPOINT,
      expect.objectContaining({
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      }),
    );
    expect(result).toEqual(mockResponse);
  });

  it('handles single row (wraps in array)', async () => {
    (global.fetch as ReturnType<typeof vi.fn>).mockResolvedValue({
      ok: true,
      json: () => Promise.resolve({ ok: true }),
    });

    await sendToGAS({ id: 'PT-1' });
    const body = JSON.parse((global.fetch as ReturnType<typeof vi.fn>).mock.calls[0][1].body);
    expect(body).toEqual([{ id: 'PT-1' }]);
  });

  it('returns error response on HTTP failure', async () => {
    (global.fetch as ReturnType<typeof vi.fn>).mockResolvedValue({
      ok: false,
      status: 500,
      statusText: 'Internal Server Error',
      text: () => Promise.resolve('Server Error'),
    });

    const result = await sendToGAS([{ id: 'PT-1' }]);
    expect(result.ok).toBe(false);
    expect(result.error).toContain('500');
  });

  it('returns error response on network failure', async () => {
    (global.fetch as ReturnType<typeof vi.fn>).mockRejectedValue(
      new TypeError('Failed to fetch'),
    );

    const result = await sendToGAS([{ id: 'PT-1' }]);
    expect(result.ok).toBe(false);
    expect(result.error).toBeDefined();
  });
});

describe('fetchNationalEntries', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('fetches with list=1 parameter', async () => {
    (global.fetch as ReturnType<typeof vi.fn>).mockResolvedValue({
      ok: true,
      json: () => Promise.resolve([{ id: 'NAT-1', district: 'ঢাকা' }]),
    });

    const result = await fetchNationalEntries();
    expect(global.fetch).toHaveBeenCalled();
    const calledUrl = (global.fetch as ReturnType<typeof vi.fn>).mock.calls[0][0] as string;
    expect(calledUrl).toContain('list=1');
    expect(result).toEqual([{ id: 'NAT-1', district: 'ঢাকা' }]);
  });

  it('passes district filter', async () => {
    (global.fetch as ReturnType<typeof vi.fn>).mockResolvedValue({
      ok: true,
      json: () => Promise.resolve([]),
    });

    await fetchNationalEntries('ঢাকা');
    expect(global.fetch).toHaveBeenCalled();
    const calledUrl = (global.fetch as ReturnType<typeof vi.fn>).mock.calls[0][0] as string;
    expect(calledUrl).toContain('district=');
    expect(calledUrl).toContain('%E0%A6%A2%E0%A6%BE%E0%A6%95%E0%A6%BE');
  });

  it('returns empty array on error', async () => {
    (global.fetch as ReturnType<typeof vi.fn>).mockResolvedValue({
      ok: false,
      status: 500,
    });

    const result = await fetchNationalEntries();
    expect(result).toEqual([]);
  });
});

describe('lookupMobile', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('looks up by mobile number', async () => {
    (global.fetch as ReturnType<typeof vi.fn>).mockResolvedValue({
      ok: true,
      json: () => Promise.resolve({ name: 'Test User', mobile: '01700000000' }),
    });

    const result = await lookupMobile('01700000000');
    expect(global.fetch).toHaveBeenCalled();
    const calledUrl = (global.fetch as ReturnType<typeof vi.fn>).mock.calls[0][0] as string;
    expect(calledUrl).toContain('mobile=01700000000');
    expect(result).toEqual({ name: 'Test User', mobile: '01700000000' });
  });

  it('returns null on error', async () => {
    (global.fetch as ReturnType<typeof vi.fn>).mockRejectedValue(new Error('fail'));

    const result = await lookupMobile('01700000000');
    expect(result).toBeNull();
  });
});

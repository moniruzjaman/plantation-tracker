/**
 * Google Apps Script proxy service.
 * The GAS proxy signs each record server-side, so the client just sends
 * the raw payload.
 */

import { GAS_SYNC_ENDPOINT } from '../data/adminData';
import type { Submission } from '../components/OfflinePlantationDashboard';
import type { FlatSeedling } from '../components/OfflinePlantationDashboard';

// ------------------------------------------------------------------
// Types
// ------------------------------------------------------------------

export interface GASRowResult {
  submissionId: string;
  speciesName: string;
  ok: boolean;
  status: number;
  error: string | null;
}

export interface GASSendResponse {
  ok: boolean;
  error?: string;
  results?: GASRowResult[];
}

// ------------------------------------------------------------------
// Helpers
// ------------------------------------------------------------------

/** Wrap a fetch call so network errors never throw — they return a safe
 *  error-shaped response instead. */
async function safeFetch(
  url: string,
  init?: RequestInit,
): Promise<Response> {
  try {
    const res = await fetch(url, init);
    return res;
  } catch (err) {
    // Build a synthetic 503-ish response that callers can still .json() etc.
    return new Response(
      JSON.stringify({
        ok: false,
        error: err instanceof Error ? err.message : 'Network error',
      }),
      { status: 0, headers: { 'Content-Type': 'application/json' } },
    );
  }
}

// ------------------------------------------------------------------
// sendToGAS
// ------------------------------------------------------------------

/**
 * POST an array of row objects to the GAS proxy endpoint.
 *
 * The proxy handles signing (HMAC / token) on the server side, so the
 * client only needs to send the raw payload.
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function sendToGAS(
  rows: any[] | any,
): Promise<GASSendResponse> {
  const payload = Array.isArray(rows) ? rows : [rows];
  try {
    const res = await safeFetch(GAS_SYNC_ENDPOINT, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    // status === 0 means the synthetic error response from safeFetch
    if (res.status === 0) {
      const body = await res.json();
      return body as GASSendResponse;
    }

    if (!res.ok) {
      let detail = '';
      try { detail = await res.text(); } catch { /* ignore */ }
      return {
        ok: false,
        error: `HTTP ${res.status}: ${detail || res.statusText}`,
      };
    }

    return (await res.json()) as GASSendResponse;
  } catch (err) {
    return {
      ok: false,
      error: err instanceof Error ? err.message : 'Unknown error',
    };
  }
}

// ------------------------------------------------------------------
// fetchNationalEntries
// ------------------------------------------------------------------

/**
 * GET a list of national entries from the GAS proxy.
 *
 * Query params:
 *   list=1        — signals "list mode"
 *   district=..   — optional district filter
 *   region=..     — optional region filter
 */
export async function fetchNationalEntries(
  district?: string,
  region?: string,
): Promise<any[]> {
  try {
    const params = new URLSearchParams({ list: '1' });
    if (district) params.set('district', district);
    if (region) params.set('region', region);

    const url = `${GAS_SYNC_ENDPOINT}?${params.toString()}`;
    const res = await safeFetch(url);

    if (res.status === 0) {
      console.warn('[api] fetchNationalEntries: network error');
      return [];
    }

    if (!res.ok) {
      console.warn(`[api] fetchNationalEntries: HTTP ${res.status}`);
      return [];
    }

    const data = await res.json();
    return Array.isArray(data) ? data : [];
  } catch (err) {
    console.warn('[api] fetchNationalEntries failed:', err);
    return [];
  }
}

// ------------------------------------------------------------------
// lookupMobile
// ------------------------------------------------------------------

/**
 * Look up a single mobile number via the GAS proxy.
 *
 * Query param:
 *   mobile=.. — the mobile number to search
 *
 * Returns the parsed JSON body (shape varies by GAS implementation)
 * or null on failure.
 */
export async function lookupMobile(mobile: string): Promise<any> {
  try {
    const params = new URLSearchParams({ mobile });
    const url = `${GAS_SYNC_ENDPOINT}?${params.toString()}`;
    const res = await safeFetch(url);

    if (res.status === 0) {
      console.warn('[api] lookupMobile: network error');
      return null;
    }

    if (!res.ok) {
      console.warn(`[api] lookupMobile: HTTP ${res.status}`);
      return null;
    }

    return await res.json();
  } catch (err) {
    console.warn('[api] lookupMobile failed:', err);
    return null;
  }
}

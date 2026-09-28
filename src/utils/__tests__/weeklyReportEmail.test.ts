import { describe, it, expect, vi, beforeEach } from 'vitest';
import {
  parseRecipients,
  summarizeRecipients,
  sendWeeklyReportEmail,
  DEFAULT_RECIPIENT,
} from '../weeklyReportEmail';

// weeklyReportEmail.ts imports GAS_SYNC_ENDPOINT from ./apiBase, which
// calls `Capacitor.isNativePlatform()` at module-eval time. In tests
// (no Capacitor runtime) it falls through to '/api/gas-sync', which is
// fine because we mock fetch below and never actually issue a network
// request.

describe('parseRecipients', () => {
  it('returns empty for empty input', () => {
    const r = parseRecipients('');
    expect(r.emails).toEqual([]);
    expect(r.invalid).toEqual([]);
  });

  it('parses a single valid email', () => {
    const r = parseRecipients('monir@example.com');
    expect(r.emails).toEqual(['monir@example.com']);
    expect(r.invalid).toEqual([]);
  });

  it('parses comma-separated emails', () => {
    const r = parseRecipients('a@x.com, b@y.com, c@z.com');
    expect(r.emails).toEqual(['a@x.com', 'b@y.com', 'c@z.com']);
    expect(r.invalid).toEqual([]);
  });

  it('parses whitespace- and semicolon-separated emails', () => {
    const r = parseRecipients('a@x.com b@y.com; c@z.com');
    expect(r.emails).toEqual(['a@x.com', 'b@y.com', 'c@z.com']);
  });

  it('trims whitespace around addresses', () => {
    const r = parseRecipients('  a@x.com ,  b@y.com  ');
    expect(r.emails).toEqual(['a@x.com', 'b@y.com']);
  });

  it('flags obviously invalid tokens but keeps the good ones', () => {
    const r = parseRecipients('a@x.com, not-an-email, b@y.com');
    expect(r.emails).toEqual(['a@x.com', 'b@y.com']);
    expect(r.invalid).toEqual(['not-an-email']);
  });

  it('de-duplicates case-insensitively while preserving order', () => {
    const r = parseRecipients('A@x.com, a@x.com, B@x.com, b@x.com');
    // We accept either the original casing or normalized lower; the test
    // here only cares about the dedup contract (no duplicates).
    expect(r.emails.length).toBe(2);
    expect(new Set(r.emails.map((s) => s.toLowerCase()))).toEqual(
      new Set(['a@x.com', 'b@x.com'])
    );
  });

  it('rejects tokens without an @ or without a TLD', () => {
    const r = parseRecipients('plainaddress, @no-local.com, missing@tld');
    expect(r.emails).toEqual([]);
    expect(r.invalid.length).toBe(3);
  });
});

describe('summarizeRecipients', () => {
  it('describes valid recipients in Bengali', () => {
    const s = summarizeRecipients(parseRecipients('a@x.com, b@y.com'));
    // summarizeRecipients emits `${count} টি প্রাপক:` with the raw JS count,
    // not a localized Bengali numeral, so the ASCII "2" should appear.
    expect(s).toContain('2 টি প্রাপক');
    expect(s).toContain('a@x.com');
    expect(s).toContain('b@y.com');
    expect(s).not.toContain('অগ্রহণযোগ্য');
  });

  it('includes invalid tokens as a warning', () => {
    const s = summarizeRecipients(parseRecipients('a@x.com, ???'));
    expect(s).toContain('⚠️');
    expect(s).toContain('অগ্রহণযোগ্য');
  });

  it('handles empty input', () => {
    const s = summarizeRecipients(parseRecipients(''));
    expect(s).toBe('');
  });
});

describe('sendWeeklyReportEmail', () => {
  const okJson = (body: unknown) =>
    Promise.resolve({
      ok: true,
      status: 200,
      json: () => Promise.resolve(body),
    } as Response);

  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it('returns ok=true with recipients when server responds ok', async () => {
    const fetchMock = vi.fn().mockReturnValue(okJson({ ok: true, message: 'sent' }));
    const r = await sendWeeklyReportEmail(['a@x.com', 'b@y.com'], fetchMock as unknown as typeof fetch);
    expect(r.ok).toBe(true);
    expect(r.recipients).toEqual(['a@x.com', 'b@y.com']);
    expect(r.message).toBe('sent');

    // URL should encode the comma-separated recipients and the sendWeeklyReport flag.
    const calledUrl = fetchMock.mock.calls[0][0] as string;
    expect(calledUrl).toContain('sendWeeklyReport=1');
    expect(calledUrl).toContain('email=');
    // encodeURIComponent escapes '@' and ',' so decode before checking.
    expect(decodeURIComponent(calledUrl)).toContain('a@x.com');
    expect(decodeURIComponent(calledUrl)).toContain('b@y.com');
  });

  it('omits email= when recipients is empty (server falls back to default)', async () => {
    const fetchMock = vi.fn().mockReturnValue(okJson({ ok: true }));
    const r = await sendWeeklyReportEmail([], fetchMock as unknown as typeof fetch);
    expect(r.ok).toBe(true);
    const calledUrl = fetchMock.mock.calls[0][0] as string;
    expect(calledUrl).toContain('sendWeeklyReport=1');
    expect(calledUrl).not.toContain('email=');
  });

  it('surfaces server error payload without throwing', async () => {
    const fetchMock = vi.fn().mockReturnValue(
      okJson({ ok: false, error: 'quota exceeded' })
    );
    const r = await sendWeeklyReportEmail(['a@x.com'], fetchMock as unknown as typeof fetch);
    expect(r.ok).toBe(false);
    expect(r.error).toBe('quota exceeded');
  });

  it('handles non-JSON server response', async () => {
    const fetchMock = vi.fn().mockReturnValue(
      Promise.resolve({
        ok: false,
        status: 500,
        json: () => Promise.reject(new Error('not json')),
      } as unknown as Response)
    );
    const r = await sendWeeklyReportEmail(['a@x.com'], fetchMock as unknown as typeof fetch);
    expect(r.ok).toBe(false);
    expect(r.error).toContain('HTTP 500');
  });

  it('handles network failure without throwing', async () => {
    const fetchMock = vi.fn().mockRejectedValue(new Error('offline'));
    const r = await sendWeeklyReportEmail(['a@x.com'], fetchMock as unknown as typeof fetch);
    expect(r.ok).toBe(false);
    expect(r.error).toBe('offline');
  });

  it('exposes a sensible default recipient constant', () => {
    expect(DEFAULT_RECIPIENT).toMatch(/@/);
  });
});

// Weekly report email helper
// ──────────────────────────────────────────────────────────────────────────
// Mirrors the behavior of the legacy `triggerWeeklyReportEmail()` in
// public/legacy/plantation.html so the React dashboard can offer the
// same "send the official weekly report to any email address" workflow
// without touching the existing CSV/JSON export buttons or the legacy UI.
//
// Flow: parse + validate the comma-separated recipient list -> call the
// existing /api/gas-sync?sendWeeklyReport=1&email=... Vercel proxy, which
// forwards to Google Apps Script's sendWeeklyReport() (see gas/AppsScript.gs).
// The proxy already accepts ?email= (or ?emailId= or ?to=) and the Apps
// Script side already splits on commas, so we just need to:
//   1. Normalize the raw input into a clean array of email strings.
//   2. Reject obviously bad addresses before bothering the server.
//   3. Surface a structured result to the caller (UI shows a Bengali alert).
//
// Kept framework-agnostic (no React, no DOM access) so it is trivially
// unit-testable from vitest.

import { GAS_SYNC_ENDPOINT } from './apiBase';

export const DEFAULT_RECIPIENT = 'moniruzjamanlearner@gmail.com';

// Pragmatic email regex: not RFC-perfect, but matches the same shape the
// legacy prompt() accepted and is good enough for client-side validation
// before hitting the server. The Apps Script MailApp.sendEmail call will
// hard-fail on anything genuinely malformed, so this is just a UX guard.
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export interface ParsedRecipients {
  emails: string[];
  invalid: string[];
}

/**
 * Parse a raw comma (or whitespace, or mixed) separated recipient string
 * into a list of clean email addresses. Anything that does not look like
 * a valid email is returned in `invalid` so the UI can highlight it.
 *
 * Empty / whitespace-only tokens are dropped silently — typing "a@x.com, "
 * should just send to a@x.com without complaint.
 */
export function parseRecipients(raw: string): ParsedRecipients {
  if (!raw) return { emails: [], invalid: [] };
  // Split on commas, semicolons, or whitespace (Bengali users sometimes
  // paste Outlook-style ';' lists); de-dupe while preserving order.
  const tokens = raw.split(/[\s,;]+/).map((s) => s.trim()).filter(Boolean);
  const seen = new Set<string>();
  const emails: string[] = [];
  const invalid: string[] = [];
  for (const token of tokens) {
    const lower = token.toLowerCase();
    if (seen.has(lower)) continue;
    seen.add(lower);
    if (EMAIL_RE.test(token)) {
      emails.push(token);
    } else {
      invalid.push(token);
    }
  }
  return { emails, invalid };
}

export interface SendWeeklyReportResult {
  ok: boolean;
  message?: string;
  error?: string;
  recipients: string[];
}

/**
 * Trigger the official weekly report email by calling the
 * /api/gas-sync?sendWeeklyReport=1&email=... Vercel serverless proxy,
 * which forwards to Google Apps Script's sendWeeklyReport() in
 * gas/AppsScript.gs (see sendWeeklyReport(optionalRecipients)).
 *
 * The proxy/server will:
 *   - if `email` is omitted, fall back to the GAS REPORT_RECIPIENTS
 *     property (the Wednesday scheduled-trigger default list);
 *   - if `email` is provided, split on commas and override the default
 *     recipients entirely.
 *
 * So passing `recipients` here is a deliberate override — make sure the
 * caller has already confirmed with the user (see the confirm() dialog
 * in the legacy `triggerWeeklyReportEmail` for the matching UX).
 *
 * Returns a structured result; never throws — network failures land in
 * `error` so the caller can render a stable "⚠️" message instead of an
 * unhandled promise rejection.
 */
export async function sendWeeklyReportEmail(
  recipients: string[],
  fetchImpl: typeof fetch = fetch
): Promise<SendWeeklyReportResult> {
  // Empty list = "use server default" — that is the same behavior as the
  // Wednesday trigger, so we still call the endpoint with no ?email=...
  // parameter. Apps Script's sendWeeklyReport(null) reads REPORT_RECIPIENTS.
  const emailParam = recipients.length > 0 ? recipients.join(',') : '';
  const qs = emailParam
    ? `sendWeeklyReport=1&email=${encodeURIComponent(emailParam)}`
    : 'sendWeeklyReport=1';

  try {
    const res = await fetchImpl(`${GAS_SYNC_ENDPOINT}?${qs}`, { method: 'GET' });
    let data: { ok?: boolean; message?: string; error?: string } | null = null;
    try {
      data = await res.json();
    } catch {
      data = null;
    }
    if (data && data.ok) {
      return {
        ok: true,
        recipients,
        message: data.message,
      };
    }
    return {
      ok: false,
      recipients,
      error: (data && data.error) || `HTTP ${res.status}`,
    };
  } catch (err) {
    return {
      ok: false,
      recipients,
      error: err instanceof Error ? err.message : String(err),
    };
  }
}

/**
 * Convenience: build a human-readable Bengali summary for a parse result,
 * used by the UI to show "৩ টি ইমেইল পাঠানো হবে" before the user confirms.
 */
export function summarizeRecipients(parsed: ParsedRecipients): string {
  const { emails, invalid } = parsed;
  const parts: string[] = [];
  if (emails.length > 0) {
    parts.push(`${emails.length} টি প্রাপক: ${emails.join(', ')}`);
  }
  if (invalid.length > 0) {
    parts.push(`⚠️ অগ্রহণযোগ্য: ${invalid.join(', ')}`);
  }
  return parts.join(' | ');
}

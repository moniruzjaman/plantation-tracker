// Vercel Serverless Function — Google Apps Script proxy
//
// Why this exists:
//   Google Apps Script web apps do NOT return CORS headers for POST requests.
//   A browser-side fetch() with `Content-Type: application/json` triggers a
//   CORS preflight that GAS silently ignores, so the POST never lands.
//   This serverless proxy runs server-side (no CORS enforcement), forwards
//   the payload to the GAS /exec URL, and returns the GAS response to the
//   client with proper CORS headers (already configured in vercel.json for /api/*).
//
// Responsibilities:
//   1. Receive JSON body from the app (single record OR array of records).
//   2. Compute an HMAC-SHA256 authenticity hash for each record (so the
//      signing secret never ships in the client bundle).
//   3. Forward each record to GAS, collect the results.
//   4. Return { ok, results } to the client.
//
// Env vars (set on Vercel → Settings → Environment Variables):
//   GAS_WEBHOOK_URL  — your /exec URL from Apps Script Deploy > Web app
//   AUTH_SECRET      — random 32+ char string used to sign each row

export const config = { runtime: 'nodejs' };

import crypto from 'node:crypto';

export default async function handler(req, res) {
  // CORS preflight
  if (req.method === 'OPTIONS') {
    return res.status(204).end();
  }
  if (req.method !== 'POST') {
    return res.status(405).json({ ok: false, error: 'Method not allowed' });
  }

  const GAS_URL = process.env.GAS_WEBHOOK_URL;
  const AUTH_SECRET = process.env.AUTH_SECRET || '';
  if (!GAS_URL) {
    return res.status(500).json({ ok: false, error: 'GAS_WEBHOOK_URL not set on server' });
  }

  // Normalize to array of records. Each record is one seedling row that
  // will become one row in the App_Entry sheet.
  const incoming = Array.isArray(req.body) ? req.body : [req.body];
  if (!incoming.length) {
    return res.status(400).json({ ok: false, error: 'Empty payload' });
  }

  // Sign + forward each record sequentially. (GAS appendRow is not safe
  // under concurrent calls from the same script — sequential is correct.)
  const results = [];
  for (const raw of incoming) {
    try {
      // Compute authenticity hash over the immutable identity fields.
      // The photo's SHA-256 is included so a swapped photo invalidates the signature.
      const photoHash = raw.photoBase64
        ? crypto.createHash('sha256').update(raw.photoBase64).digest('hex').slice(0, 16)
        : '';
      const message = [
        raw.submissionId || '',
        raw.farmerMobile || '',
        raw.plantingDate || '',
        raw.latitude || '',
        raw.longitude || '',
        raw.speciesName || '',
        raw.quantity || '',
        photoHash
      ].join('|');
      const authHash = AUTH_SECRET
        ? crypto.createHmac('sha256', AUTH_SECRET).update(message).digest('hex').slice(0, 32)
        : '';

      const row = Object.assign({}, raw, {
        authHash,
        photoSha256: photoHash
      });

      const r = await fetch(GAS_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(row)
      });
      let parsed = null;
      try { parsed = await r.json(); } catch (_) { /* GAS may return non-JSON on redirect */ }
      results.push({
        submissionId: raw.submissionId || '',
        speciesName: raw.speciesName || '',
        ok: parsed ? parsed.ok : r.ok,
        status: r.status,
        error: parsed && parsed.error ? parsed.error : null
      });
    } catch (e) {
      results.push({
        submissionId: raw.submissionId || '',
        speciesName: raw.speciesName || '',
        ok: false,
        error: e.message
      });
    }
  }

  const allOk = results.every(r => r.ok);
  return res.status(200).json({ ok: allOk, results });
}

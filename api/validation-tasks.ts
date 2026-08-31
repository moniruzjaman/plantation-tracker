// Vercel Serverless Function — POST /api/validation-tasks
//
// Receives a validation decision from the tracker dashboard and:
//   1. Validates the payload (task_id, submission_id, decision).
//   2. Forwards the update to Google Sheets via the GAS webhook
//      (same GAS /exec endpoint that /api/gas-sync proxies).
//
// NOTE: This function is intentionally stateless. The app's validation
// tasks, audit log, etc. live in the *client's* IndexedDB
// (src/utils/auditDb.ts) — a serverless function cannot (and should not)
// touch a browser's IndexedDB. The client is responsible for:
//   - sending the full updated task record here, and
//   - writing the record + audit log entry into IndexedDB after this
//     endpoint responds ok (see src/utils/validationApi.ts).

import type { VercelRequest, VercelResponse } from '@vercel/node';
import type { ValidationTaskRecord, ValidationDecision } from '../src/utils/auditTypes';

export const config = { runtime: 'nodejs' };

const VALID_DECISIONS: ValidationDecision[] = ['pending', 'approved', 'rejected'];

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // CORS preflight (Vercel sends permissive /api/* headers via vercel.json,
  // but answer OPTIONS explicitly so native WebViews never stall).
  if (req.method === 'OPTIONS') {
    return res.status(204).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ ok: false, error: 'Method not allowed' });
  }

  const body = (req.body || {}) as Partial<ValidationTaskRecord> & {
    user_id?: string;
    user_name?: string;
  };
  const { task_id, submission_id, site_id, decision, remarks } = body;

  if (!task_id || !submission_id || !decision) {
    return res.status(400).json({
      ok: false,
      error: 'task_id, submission_id, and decision are required',
    });
  }

  if (!VALID_DECISIONS.includes(decision)) {
    return res.status(400).json({
      ok: false,
      error: `decision must be one of: ${VALID_DECISIONS.join(', ')}`,
    });
  }

  const updated: ValidationTaskRecord = {
    task_id,
    submission_id,
    site_id: site_id || '',
    assigned_date: body.assigned_date || new Date().toISOString(),
    due_date: body.due_date,
    decision,
    remarks: remarks || body.remarks,
    decided_at: body.decided_at || new Date().toISOString(),
    saao_id: body.saao_id,
    saao_name: body.saao_name,
  };

  // Forward to GAS for the sheet update.
  const GAS_URL = process.env.GAS_WEBHOOK_URL;
  if (!GAS_URL) {
    return res
      .status(500)
      .json({ ok: false, error: 'GAS_WEBHOOK_URL not set on server' });
  }

  try {
    const r = await fetch(GAS_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        entryType: 'validation_task',
        taskId: updated.task_id,
        submissionId: updated.submission_id,
        siteId: updated.site_id,
        decision: updated.decision,
        remarks: updated.remarks,
        decidedAt: updated.decided_at,
        saaoId: updated.saao_id,
        saaoName: updated.saao_name,
        userId: body.user_id,
        userName: body.user_name,
      }),
    });

    let parsed: { ok?: boolean; error?: string } | null = null;
    try {
      parsed = await r.json();
    } catch {
      /* GAS may return non-JSON on redirect */
    }

    if (!r.ok || (parsed && parsed.ok === false)) {
      return res.status(502).json({
        ok: false,
        error: parsed?.error || `GAS webhook responded with status ${r.status}`,
      });
    }

    return res.status(200).json({ ok: true, task: updated });
  } catch (err: any) {
    console.error('Validation task sync failed:', err);
    return res.status(502).json({ ok: false, error: err.message });
  }
}

/**
 * Client-side helper for the /api/validation-tasks serverless endpoint.
 *
 * Flow for a validation decision:
 *   1. POST the full updated task record to the endpoint (which forwards it
 *      to Google Sheets via the GAS webhook).
 *   2. On success, persist the updated task in the local IndexedDB
 *      validation_tasks store (upsert by task_id).
 *   3. Append a matching audit log entry locally.
 */

import { VALIDATION_TASKS_ENDPOINT } from './apiBase';
import { addAuditLog, addValidationTask } from './auditDb';
import type { AuditLogEntry, ValidationTaskRecord, ValidationDecision } from './auditTypes';

export interface SubmitValidationResult {
  ok: boolean;
  task?: ValidationTaskRecord;
  error?: string;
}

export async function submitValidationDecision(
  task: ValidationTaskRecord,
  opts: {
    decision: ValidationDecision;
    remarks?: string;
    user_id?: string;
    user_name?: string;
    gps?: { latitude: number; longitude: number } | null;
  }
): Promise<SubmitValidationResult> {
  const updated: ValidationTaskRecord = {
    ...task,
    decision: opts.decision,
    remarks: opts.remarks || task.remarks,
    decided_at: new Date().toISOString(),
  };

  let response: Response;
  try {
    response = await fetch(VALIDATION_TASKS_ENDPOINT, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        ...updated,
        user_id: opts.user_id,
        user_name: opts.user_name,
      }),
    });
  } catch (e: any) {
    return { ok: false, error: e.message };
  }

  let payload: SubmitValidationResult | null = null;
  try {
    payload = await response.json();
  } catch {
    /* non-JSON response */
  }

  if (!response.ok || !payload?.ok) {
    return { ok: false, error: payload?.error || `Endpoint responded with status ${response.status}` };
  }

  // Server accepted the decision — persist locally (IndexedDB).
  try {
    await addValidationTask(updated);

    const auditEntry: Omit<AuditLogEntry, 'log_id'> = {
      entity: 'submission',
      entity_id: updated.submission_id,
      action: opts.decision === 'approved' ? 'APPROVE' : opts.decision === 'rejected' ? 'REJECT' : 'UPDATE',
      user_id: opts.user_id || 'unknown',
      user_name: opts.user_name || 'অজানা',
      device: navigator.userAgent || 'browser',
      gps: opts.gps ?? null,
      old_value: JSON.stringify({ decision: task.decision }),
      new_value: JSON.stringify({ decision: updated.decision, remarks: updated.remarks }),
      timestamp: new Date().toISOString(),
    };
    await addAuditLog(auditEntry);
  } catch (e: any) {
    // IndexedDB failure shouldn't fail the whole operation — the sheet is
    // already updated; log for diagnostics.
    console.error('Local IndexedDB update after validation failed:', e);
  }

  return { ok: true, task: updated };
}

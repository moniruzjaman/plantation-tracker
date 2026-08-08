// Vercel Serverless Function — POST /api/validation-tasks
//
// Receives a validation decision from the tracker dashboard and:
//   1. Updates the local IndexedDB validation_tasks store
//   2. Appends an audit log entry
//   3. Forwards the update to Google Sheets via /api/gas-sync

import { addAuditLog, addValidationTask, getValidationTasksBySubmission } from '../src/utils/auditDb';
import type { AuditLogEntry, ValidationTaskRecord } from '../src/utils/auditTypes';

export const config = { runtime: 'nodejs' };

export default async function handler(req: any, res: any) {
  if (req.method === 'OPTIONS') {
    return res.status(204).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { task_id, submission_id, site_id, decision, remarks, user_id, user_name } = req.body;

    if (!task_id || !submission_id || !decision) {
      return res.status(400).json({ error: 'task_id, submission_id, and decision are required' });
    }

    // Fetch existing task from IndexedDB
    const existing = await getValidationTasksBySubmission(submission_id);
    const task = existing.find((t) => t.task_id === task_id);

    if (!task) {
      return res.status(404).json({ error: 'Validation task not found' });
    }

    const updated: ValidationTaskRecord = {
      ...task,
      decision,
      remarks: remarks || task.remarks,
      decided_at: new Date().toISOString(),
    };

    await addValidationTask(updated);

    const auditEntry: Omit<AuditLogEntry, 'log_id'> = {
      entity: 'submission',
      entity_id: submission_id,
      action: decision === 'approved' ? 'APPROVE' : 'REJECT',
      user_id: user_id || 'unknown',
      user_name: user_name || 'অজানা',
      device: req.headers['user-agent'] || 'server',
      gps: null,
      old_value: JSON.stringify({ decision: task.decision }),
      new_value: JSON.stringify({ decision, remarks: updated.remarks }),
      timestamp: new Date().toISOString(),
    };

    await addAuditLog(auditEntry);

    // Forward to GAS for sheet update
    const GAS_URL = process.env.GAS_WEBHOOK_URL;
    if (GAS_URL) {
      try {
        await fetch(GAS_URL, {
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
          }),
        });
      } catch (e) {
        console.error('GAS validation task sync failed:', e);
      }
    }

    return res.status(200).json({ ok: true, task: updated });
  } catch (err: any) {
    console.error('Validation task update failed:', err);
    return res.status(500).json({ error: err.message });
  }
}

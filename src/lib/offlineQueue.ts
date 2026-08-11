/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { idbPut, idbGet, idbGetAll, idbDelete, idbClear, idbCount, idbGetAllByIndex, idbClose } from './idb';

export type SyncStatus = 'pending' | 'syncing' | 'synced' | 'failed';

export interface QueuedSubmission {
  submissionId: string;
  syncStatus: SyncStatus;
  syncAttempts: number;
  lastSyncError?: string;
  lastSyncAt?: string;
  submittedAt: string;
  [key: string]: unknown;
}

const DB_NAME = 'plantation-tracker-db';
const DB_VERSION = 1;
const STORE_SUBMISSIONS = 'submissions';

const DB_OPTS = {
  name: DB_NAME,
  version: DB_VERSION,
  stores: [
    {
      name: STORE_SUBMISSIONS,
      keyPath: 'submissionId',
      indexes: [
        { name: 'syncStatus', keyPath: 'syncStatus' },
        { name: 'submittedAt', keyPath: 'submittedAt' },
        { name: 'syncAttempts', keyPath: 'syncAttempts' },
      ],
    },
  ],
};

function ensureId(): string {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 8);
}

/**
 * Migrate localStorage submissions to IndexedDB.
 * Only runs if IDB is empty and localStorage has data.
 */
export async function migrateLocalStorageToIDB(): Promise<number> {
  try {
    const existingCount = await idbCount(DB_OPTS, STORE_SUBMISSIONS);
    if (existingCount > 0) return 0;

    const raw = localStorage.getItem('nursery_submissions');
    if (!raw) return 0;

    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return 0;

    const migrated = parsed.map((s: Record<string, unknown>) => ({
      ...s,
      submissionId: (s.submissionId as string) || (s.id as string) || ensureId(),
      syncStatus: (s.synced ? 'synced' : 'pending') as SyncStatus,
      syncAttempts: (s.synced ? 1 : 0) as number,
      lastSyncAt: (s.syncedAt as string) || undefined,
      lastSyncError: undefined,
    }));

    for (const item of migrated) {
      await idbPut(DB_OPTS, STORE_SUBMISSIONS, item);
    }

    return migrated.length;
  } catch (e) {
    console.warn('[OfflineQueue] Migration failed:', e);
    return 0;
  }
}

/**
 * Ensure a submission has queue metadata.
 */
function withQueueMeta(sub: Record<string, unknown>): QueuedSubmission {
  const existing = sub as Partial<QueuedSubmission>;
  const submissionId = typeof existing.submissionId === 'string' ? existing.submissionId : (typeof existing.id === 'string' ? existing.id : ensureId());
  const syncStatus = (existing.syncStatus as SyncStatus | undefined) || (existing.synced ? 'synced' : 'pending');
  const syncAttempts = existing.syncAttempts ?? (existing.synced ? 1 : 0);
  const lastSyncAt = typeof existing.lastSyncAt === 'string' ? existing.lastSyncAt : (typeof existing.syncedAt === 'string' ? existing.syncedAt : undefined);
  return {
    ...sub,
    submissionId,
    syncStatus,
    syncAttempts,
    lastSyncAt,
    lastSyncError: existing.lastSyncError as string | undefined,
    submittedAt: typeof existing.submittedAt === 'string' ? existing.submittedAt : new Date().toISOString(),
  };
}

export async function enqueueSubmission(sub: Record<string, unknown>): Promise<QueuedSubmission> {
  const queued = withQueueMeta(sub);
  queued.syncStatus = 'pending';
  queued.syncAttempts = 0;
  queued.lastSyncAt = undefined;
  queued.lastSyncError = undefined;
  await idbPut(DB_OPTS, STORE_SUBMISSIONS, queued);
  return queued;
}

export async function updateSubmissionStatus(
  submissionId: string,
  patch: Partial<QueuedSubmission>,
): Promise<void> {
  const existing = await idbGet<QueuedSubmission>(DB_OPTS, STORE_SUBMISSIONS, submissionId);
  if (!existing) return;
  const updated = { ...existing, ...patch, submissionId };
  await idbPut(DB_OPTS, STORE_SUBMISSIONS, updated);
}

export async function getSubmission(submissionId: string): Promise<QueuedSubmission | undefined> {
  return idbGet(DB_OPTS, STORE_SUBMISSIONS, submissionId);
}

export async function getAllSubmissions(): Promise<QueuedSubmission[]> {
  return idbGetAll(DB_OPTS, STORE_SUBMISSIONS);
}

export async function getSubmissionsByStatus(status: SyncStatus): Promise<QueuedSubmission[]> {
  return idbGetAllByIndex(DB_OPTS, STORE_SUBMISSIONS, 'syncStatus', status);
}

export async function getPendingSubmissions(): Promise<QueuedSubmission[]> {
  return getSubmissionsByStatus('pending');
}

export async function getFailedSubmissions(): Promise<QueuedSubmission[]> {
  return getSubmissionsByStatus('failed');
}

export async function getSyncingSubmissions(): Promise<QueuedSubmission[]> {
  return getSubmissionsByStatus('syncing');
}

export async function markSyncing(submissionId: string): Promise<void> {
  await updateSubmissionStatus(submissionId, { syncStatus: 'syncing' });
}

export async function markSynced(submissionId: string): Promise<void> {
  await updateSubmissionStatus(submissionId, {
    syncStatus: 'synced',
    syncAttempts: 0,
    lastSyncAt: new Date().toISOString(),
    lastSyncError: undefined,
  });
}

export async function markFailed(submissionId: string, error: string): Promise<void> {
  const existing = await idbGet<QueuedSubmission>(DB_OPTS, STORE_SUBMISSIONS, submissionId);
  const attempts = (existing?.syncAttempts || 0) + 1;
  await updateSubmissionStatus(submissionId, {
    syncStatus: 'failed',
    syncAttempts: attempts,
    lastSyncError: error,
  });
}

export async function deleteQueuedSubmission(submissionId: string): Promise<void> {
  await idbDelete(DB_OPTS, STORE_SUBMISSIONS, submissionId);
}

export async function clearAllSubmissions(): Promise<void> {
  await idbClear(DB_OPTS, STORE_SUBMISSIONS);
}

export async function getQueueStats(): Promise<{
  total: number;
  pending: number;
  syncing: number;
  synced: number;
  failed: number;
}> {
  const [total, pending, syncing, synced, failed] = await Promise.all([
    idbCount(DB_OPTS, STORE_SUBMISSIONS),
    idbCountByStatus('pending'),
    idbCountByStatus('syncing'),
    idbCountByStatus('synced'),
    idbCountByStatus('failed'),
  ]);
  return { total, pending, syncing, synced, failed };
}

async function idbCountByStatus(status: SyncStatus): Promise<number> {
  const items = await idbGetAllByIndex<QueuedSubmission>(DB_OPTS, STORE_SUBMISSIONS, 'syncStatus', status);
  return items.length;
}

/**
 * Initialize the queue: migrate from localStorage if needed,
 * then expose API on window for iframe access.
 */
export async function initOfflineQueue(): Promise<{ migrated: number }> {
  const migrated = await migrateLocalStorageToIDB();

  if (typeof window !== 'undefined') {
    (window as unknown as Record<string, unknown>).offlineQueueAPI = {
      getAllSubmissions,
      getSubmission,
      getPendingSubmissions,
      getFailedSubmissions,
      getSyncingSubmissions,
      getQueueStats,
      enqueueSubmission,
      updateSubmissionStatus,
      markSyncing,
      markSynced,
      markFailed,
      deleteQueuedSubmission,
      clearAllSubmissions,
    };
  }

  return { migrated };
}

export function destroyOfflineQueue(): void {
  idbClose();
  if (typeof window !== 'undefined') {
    delete (window as unknown as Record<string, unknown>).offlineQueueAPI;
  }
}

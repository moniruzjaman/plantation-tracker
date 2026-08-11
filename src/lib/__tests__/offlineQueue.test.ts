import { describe, it, expect, beforeEach } from 'vitest';
import 'fake-indexeddb/auto';
import {
  initOfflineQueue,
  enqueueSubmission,
  getAllSubmissions,
  getSubmission,
  getPendingSubmissions,
  getFailedSubmissions,
  getSyncingSubmissions,
  markSyncing,
  markSynced,
  markFailed,
  deleteQueuedSubmission,
  clearAllSubmissions,
  getQueueStats,
  destroyOfflineQueue,
} from '../offlineQueue';

describe('offlineQueue', () => {
  beforeEach(async () => {
    destroyOfflineQueue();
    await clearAllSubmissions();
    await initOfflineQueue();
  });

  it('enqueues a submission with pending status', async () => {
    const sub = { submissionId: 'test-1', farmerName: 'আম', district: 'ঢাকা' };
    const queued = await enqueueSubmission(sub);
    expect(queued.submissionId).toBe('test-1');
    expect(queued.syncStatus).toBe('pending');
    expect(queued.syncAttempts).toBe(0);
  });

  it('generates an id when none provided', async () => {
    const queued = await enqueueSubmission({ farmerName: 'Test' });
    expect(queued.submissionId).toBeTruthy();
    expect(queued.syncStatus).toBe('pending');
  });

  it('retrieves a submission by id', async () => {
    await enqueueSubmission({ submissionId: 'abc', farmerName: 'Test' });
    const found = await getSubmission('abc');
    expect(found?.farmerName).toBe('Test');
  });

  it('returns undefined for missing id', async () => {
    const found = await getSubmission('nonexistent');
    expect(found).toBeUndefined();
  });

  it('marks syncing then synced', async () => {
    await enqueueSubmission({ submissionId: 's1', farmerName: 'Test' });
    await markSyncing('s1');
    let found = await getSubmission('s1');
    expect(found?.syncStatus).toBe('syncing');

    await markSynced('s1');
    found = await getSubmission('s1');
    expect(found?.syncStatus).toBe('synced');
    expect(found?.lastSyncAt).toBeTruthy();
  });

  it('marks failed and increments attempts', async () => {
    await enqueueSubmission({ submissionId: 's2', farmerName: 'Test' });
    await markFailed('s2', 'Network error');
    let found = await getSubmission('s2');
    expect(found?.syncStatus).toBe('failed');
    expect(found?.syncAttempts).toBe(1);
    expect(found?.lastSyncError).toBe('Network error');

    await markFailed('s2', 'Timeout');
    found = await getSubmission('s2');
    expect(found?.syncAttempts).toBe(2);
    expect(found?.lastSyncError).toBe('Timeout');
  });

  it('filters by status', async () => {
    await enqueueSubmission({ submissionId: 'q1' });
    await enqueueSubmission({ submissionId: 'q2' });
    await enqueueSubmission({ submissionId: 'q3' });
    await markSyncing('q1');
    await markSynced('q1');
    await markFailed('q3', 'err');

    const all = await getAllSubmissions();
    const pending = await getPendingSubmissions();
    const syncing = await getSyncingSubmissions();
    const failed = await getFailedSubmissions();

    expect(pending.map(s => s.submissionId)).toEqual(['q2']);
    const syncingFromAll = all.filter(s => s.syncStatus === 'syncing').map(s => s.submissionId);
    expect(syncingFromAll).toEqual([]);
    expect(failed.map(s => s.submissionId)).toEqual(['q3']);
  });

  it('returns correct queue stats', async () => {
    await enqueueSubmission({ submissionId: 'q1' });
    await enqueueSubmission({ submissionId: 'q2' });
    await markSynced('q1');
    await markFailed('q2', 'err');

    const stats = await getQueueStats();
    expect(stats.total).toBe(2);
    expect(stats.synced).toBe(1);
    expect(stats.failed).toBe(1);
    expect(stats.pending).toBe(0);
    expect(stats.syncing).toBe(0);
  });

  it('deletes a submission', async () => {
    await enqueueSubmission({ submissionId: 'del1' });
    await deleteQueuedSubmission('del1');
    const found = await getSubmission('del1');
    expect(found).toBeUndefined();
  });

  it('clears all submissions', async () => {
    await enqueueSubmission({ submissionId: 'c1' });
    await enqueueSubmission({ submissionId: 'c2' });
    await clearAllSubmissions();
    const all = await getAllSubmissions();
    expect(all).toHaveLength(0);
  });

  it('exports all required functions', async () => {
    expect(typeof initOfflineQueue).toBe('function');
    expect(typeof enqueueSubmission).toBe('function');
    expect(typeof getAllSubmissions).toBe('function');
    expect(typeof markSynced).toBe('function');
    expect(typeof markFailed).toBe('function');
    expect(typeof getQueueStats).toBe('function');
  });
});

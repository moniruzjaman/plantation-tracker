import { SyncQueueItem, SyncState, SyncResult } from './types';

export class SyncQueue {
  private items: Map<string, SyncQueueItem> = new Map();

  enqueue(item: Omit<SyncQueueItem, 'id' | 'timestamp' | 'retries' | 'status'>): SyncQueueItem {
    const queueItem: SyncQueueItem = {
      ...item,
      id: `${item.entity}:${item.entityId}:${Date.now()}`,
      timestamp: Date.now(),
      retries: 0,
      status: 'pending'
    };
    this.items.set(queueItem.id, queueItem);
    return queueItem;
  }

  getPending(): SyncQueueItem[] {
    return Array.from(this.items.values()).filter(item => item.status === 'pending');
  }

  getItem(id: string): SyncQueueItem | undefined {
    return this.items.get(id);
  }

  updateStatus(id: string, status: SyncQueueItem['status'], error?: string): SyncQueueItem | undefined {
    const item = this.items.get(id);
    if (!item) return undefined;

    item.status = status;
    if (error) item.error = error;
    if (status === 'syncing') item.retries += 1;

    this.items.set(id, item);
    return item;
  }

  remove(id: string): boolean {
    return this.items.delete(id);
  }

  getState(): SyncState {
    const pending = this.getPending();
    return {
      lastSync: null,
      pendingItems: pending.length,
      isOnline: navigator.onLine,
      isSyncing: pending.some(item => item.status === 'syncing')
    };
  }

  clear(): void {
    this.items.clear();
  }
}

export async function processQueue(
  queue: SyncQueue,
  syncFn: (item: SyncQueueItem) => Promise<boolean>
): Promise<SyncResult> {
  const pending = queue.getPending();
  const result: SyncResult = {
    success: true,
    synced: 0,
    failed: 0,
    conflicts: []
  };

  for (const item of pending) {
    queue.updateStatus(item.id, 'syncing');
    try {
      const ok = await syncFn(item);
      if (ok) {
        queue.updateStatus(item.id, 'completed');
        result.synced++;
      } else {
        queue.updateStatus(item.id, 'failed', 'Sync failed');
        result.failed++;
        result.success = false;
      }
    } catch (err) {
      queue.updateStatus(item.id, 'failed', err instanceof Error ? err.message : 'Unknown error');
      result.failed++;
      result.success = false;
    }
  }

  return result;
}
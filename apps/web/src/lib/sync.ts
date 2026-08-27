import { offlineDb, queueSync, getPendingSyncItems, updateSyncItemStatus, removeSyncItem } from './db';

export type SyncStatus = 'idle' | 'syncing' | 'error' | 'success';

export class OfflineSyncManager {
  private status: SyncStatus = 'idle';
  private listeners: Set<(status: SyncStatus) => void> = new Set();

  constructor(private apiBase: string = '/api') {}

  getStatus() {
    return this.status;
  }

  subscribe(listener: (status: SyncStatus) => void) {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  private setStatus(status: SyncStatus) {
    this.status = status;
    this.listeners.forEach(l => l(status));
  }

  async enqueue(entity: string, entityId: string, action: 'create' | 'update' | 'delete', payload: Record<string, unknown>) {
    await queueSync({ entity, entityId, action, payload });
    this.notifyPending();
  }

  private async notifyPending() {
    const pending = await getPendingSyncItems();
    if (pending.length > 0 && navigator.onLine) {
      this.sync();
    }
  }

  async sync() {
    if (this.status === 'syncing') return;
    this.setStatus('syncing');

    try {
      const pending = await getPendingSyncItems();
      
      for (const item of pending) {
        await updateSyncItemStatus(item.id!, 'syncing');
        
        try {
          const endpoint = `${this.apiBase}/${item.entity}`;
          const response = await fetch(endpoint, {
            method: item.action === 'create' ? 'POST' : item.action === 'update' ? 'PUT' : 'DELETE',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(item.payload)
          });

          if (response.ok) {
            await removeSyncItem(item.id!);
          } else {
            await updateSyncItemStatus(item.id!, 'failed', `HTTP ${response.status}`);
          }
        } catch (err) {
          await updateSyncItemStatus(item.id!, 'failed', err instanceof Error ? err.message : 'Network error');
        }
      }

      this.setStatus('success');
    } catch {
      this.setStatus('error');
    }
  }

  async getPendingCount(): Promise<number> {
    const pending = await getPendingSyncItems();
    return pending.filter(i => i.status === 'pending').length;
  }
}

export const syncManager = new OfflineSyncManager();

export type SyncAction = 'create' | 'update' | 'delete';
export type SyncStatus = 'pending' | 'syncing' | 'completed' | 'failed';

export interface SyncQueueItem {
  id: string;
  entity: string;
  entityId: string;
  action: SyncAction;
  payload: Record<string, unknown>;
  timestamp: number;
  retries: number;
  status: SyncStatus;
  error?: string;
}

export interface SyncState {
  lastSync: string | null;
  pendingItems: number;
  isOnline: boolean;
  isSyncing: boolean;
}

export interface ConflictResolution {
  strategy: 'server_wins' | 'client_wins' | 'merge';
  winner: Record<string, unknown>;
  loser: Record<string, unknown>;
  resolvedAt: string;
}

export interface SyncResult {
  success: boolean;
  synced: number;
  failed: number;
  conflicts: ConflictResolution[];
}
export interface SyncQueueItem {
  id: string;
  entity: string;
  action: 'create' | 'update' | 'delete';
  payload: Record<string, unknown>;
  timestamp: number;
  retries: number;
  status: 'pending' | 'syncing' | 'completed' | 'failed';
  error?: string;
}

export interface ConflictResolution {
  strategy: 'server_wins' | 'client_wins' | 'merge';
  winner: Record<string, unknown>;
  loser: Record<string, unknown>;
  resolvedAt: string;
}

export interface SyncState {
  lastSync: string | null;
  pendingItems: number;
  isOnline: boolean;
  isSyncing: boolean;
}

import Dexie, { type EntityTable } from 'dexie';

export interface OfflineFarmer {
  id?: string;
  name: string;
  mobile: string;
  division: string;
  district: string;
  upazila: string;
  union: string;
  village: string;
  latitude: number | null;
  longitude: number | null;
  documents: string[];
  officerId: string;
  _status?: 'synced' | 'pending' | 'failed';
  _version?: number;
}

export interface OfflinePlantation {
  id?: string;
  farmerId: string;
  speciesId: string;
  variety: string;
  latitude: number | null;
  longitude: number | null;
  polygon?: [number, number][];
  area: number | null;
  status: 'planned' | 'active' | 'dormant' | 'harvested';
  plantedAt: string | null;
  officerId: string;
  _status?: 'synced' | 'pending' | 'failed';
  _version?: number;
}

export interface OfflineMonitoringVisit {
  id?: string;
  plantationId: string;
  officerId: string;
  latitude: number | null;
  longitude: number | null;
  healthScore: number | null;
  survivalRate: number | null;
  notes: string;
  photos: string[];
  measurements: Array<{
    id?: string;
    type: 'height' | 'dbh' | 'canopy' | 'ndvi';
    value: number;
    unit: string;
    notes: string;
  }>;
  _status?: 'synced' | 'pending' | 'failed';
  _version?: number;
}

export interface OfflineTask {
  id?: string;
  title: string;
  description: string;
  assignedTo: string;
  assignedBy: string;
  status: 'pending' | 'in_progress' | 'completed';
  priority: 'low' | 'medium' | 'high';
  dueDate: string | null;
  _status?: 'synced' | 'pending' | 'failed';
  _version?: number;
}

export interface OfflineNotification {
  id?: string;
  userId: string;
  title: string;
  message: string;
  type: 'info' | 'warning' | 'success' | 'error';
  read: boolean;
  _status?: 'synced' | 'pending' | 'failed';
  _version?: number;
}

export interface SyncQueueItemLocal {
  id?: string;
  entity: string;
  entityId: string;
  action: 'create' | 'update' | 'delete';
  payload: Record<string, unknown>;
  timestamp: number;
  retries: number;
  status: 'pending' | 'syncing' | 'completed' | 'failed';
  error?: string;
}

class OfflineDB extends Dexie {
  farmers!: Dexie.Table<OfflineFarmer, string>;
  plantations!: Dexie.Table<OfflinePlantation, string>;
  monitoringVisits!: Dexie.Table<OfflineMonitoringVisit, string>;
  tasks!: Dexie.Table<OfflineTask, string>;
  notifications!: Dexie.Table<OfflineNotification, string>;
  syncQueue!: Dexie.Table<SyncQueueItemLocal, string>;

  constructor() {
    super('pmis-v2-offline');
    this.version(1).stores({
      farmers: 'id, mobile, district, upazila, officerId, _status',
      plantations: 'id, farmerId, speciesId, officerId, status, _status',
      monitoringVisits: 'id, plantationId, officerId, _status',
      tasks: 'id, assignedTo, assignedBy, status, _status',
      notifications: 'id, userId, read, _status',
      syncQueue: 'id, entity, entityId, status, timestamp'
    });
  }
}

export const offlineDb = new OfflineDB();

export async function queueSync(item: Omit<SyncQueueItemLocal, 'id' | 'timestamp' | 'retries' | 'status'>) {
  const queueItem: SyncQueueItemLocal = {
    ...item,
    id: `${item.entity}:${item.entityId}:${Date.now()}`,
    timestamp: Date.now(),
    retries: 0,
    status: 'pending'
  };
  await offlineDb.syncQueue.add(queueItem);
  return queueItem;
}

export async function getPendingSyncItems() {
  return offlineDb.syncQueue.where('status').equals('pending').toArray();
}

export async function updateSyncItemStatus(id: string, status: SyncQueueItemLocal['status'], error?: string) {
  const item = await offlineDb.syncQueue.get(id);
  if (!item) return;
  item.status = status;
  item.error = error;
  if (status === 'syncing') item.retries += 1;
  await offlineDb.syncQueue.put(item);
}

export async function removeSyncItem(id: string) {
  await offlineDb.syncQueue.delete(id);
}

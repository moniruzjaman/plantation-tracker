/**
 * Plantation Tracker — Audit & Validation persistent storage layer.
 *
 * Mirrors the pattern in growthDb.ts (raw IndexedDB, same DB name) so
 * both the dashboard and the submission wizard share a common storage
 * foundation without introducing a second backend.
 */

import type { AuditLogEntry, ValidationTaskRecord, CarbonHistoryEntry, NotificationRecord } from './auditTypes';

const DB_NAME = 'plantation_growth_db';
const DB_VERSION = 2;
const STORE_AUDIT_LOG = 'audit_log';
const STORE_VALIDATION_TASKS = 'validation_tasks';
const STORE_CARBON_HISTORY = 'carbon_history';
const STORE_NOTIFICATIONS = 'notifications';

let dbPromise: Promise<IDBDatabase> | null = null;

function openDb(): Promise<IDBDatabase> {
  if (dbPromise) return dbPromise;
  dbPromise = new Promise((resolve, reject) => {
    if (typeof indexedDB === 'undefined') {
      reject(new Error('IndexedDB not available in this environment'));
      return;
    }
    const req = indexedDB.open(DB_NAME, DB_VERSION);

    req.onupgradeneeded = () => {
      const db = req.result;

      if (!db.objectStoreNames.contains(STORE_AUDIT_LOG)) {
        const audit = db.createObjectStore(STORE_AUDIT_LOG, { keyPath: 'log_id' });
        audit.createIndex('by_entity_id', 'entity_id', { unique: false });
      }

      if (!db.objectStoreNames.contains(STORE_VALIDATION_TASKS)) {
        const tasks = db.createObjectStore(STORE_VALIDATION_TASKS, { keyPath: 'task_id' });
        tasks.createIndex('by_saao_id', 'saao_id', { unique: false });
        tasks.createIndex('by_submission_id', 'submission_id', { unique: false });
      }

      if (!db.objectStoreNames.contains(STORE_CARBON_HISTORY)) {
        const carbon = db.createObjectStore(STORE_CARBON_HISTORY, { keyPath: 'history_id' });
        carbon.createIndex('by_site_id', 'site_id', { unique: false });
      }

      if (!db.objectStoreNames.contains(STORE_NOTIFICATIONS)) {
        const notifs = db.createObjectStore(STORE_NOTIFICATIONS, { keyPath: 'notification_id' });
        notifs.createIndex('by_recipient_id', 'recipient_id', { unique: false });
      }
    };

    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error);
  });
  return dbPromise;
}

function tx<T>(storeName: string, mode: IDBTransactionMode, fn: (store: IDBObjectStore) => IDBRequest<T>): Promise<T> {
  return openDb().then(
    (db) =>
      new Promise<T>((resolve, reject) => {
        const t = db.transaction(storeName, mode);
        const store = t.objectStore(storeName);
        const req = fn(store);
        req.onsuccess = () => resolve(req.result);
        req.onerror = () => reject(req.error);
      })
  );
}

// ---------- Audit Log CRUD ----------

export async function addAuditLog(entry: Omit<AuditLogEntry, 'log_id'>): Promise<string> {
  const log_id = crypto.randomUUID();
  const full: AuditLogEntry = { ...entry, log_id };
  await tx<string>(STORE_AUDIT_LOG, 'readwrite', (store) => store.put(full) as IDBRequest<string>);
  return log_id;
}

export async function getAuditLogsByEntity(entityId: string): Promise<AuditLogEntry[]> {
  const db = await openDb();
  return new Promise((resolve, reject) => {
    const t = db.transaction(STORE_AUDIT_LOG, 'readonly');
    const idx = t.objectStore(STORE_AUDIT_LOG).index('by_entity_id');
    const range = IDBKeyRange.only(entityId);
    const results: AuditLogEntry[] = [];
    const req = idx.openCursor(range);
    req.onsuccess = () => {
      const cursor = req.result;
      if (cursor) {
        results.push(cursor.value as AuditLogEntry);
        cursor.continue();
      } else {
        resolve(results);
      }
    };
    req.onerror = () => reject(req.error);
  });
}

// ---------- Validation Tasks CRUD ----------

export async function addValidationTask(record: Omit<ValidationTaskRecord, 'task_id'>): Promise<string> {
  const task_id = crypto.randomUUID();
  const full: ValidationTaskRecord = { ...record, task_id };
  await tx<string>(STORE_VALIDATION_TASKS, 'readwrite', (store) => store.put(full) as IDBRequest<string>);
  return task_id;
}

export async function getValidationTasksBySaao(saaoId: string): Promise<ValidationTaskRecord[]> {
  const db = await openDb();
  return new Promise((resolve, reject) => {
    const t = db.transaction(STORE_VALIDATION_TASKS, 'readonly');
    const idx = t.objectStore(STORE_VALIDATION_TASKS).index('by_saao_id');
    const range = IDBKeyRange.only(saaoId);
    const results: ValidationTaskRecord[] = [];
    const req = idx.openCursor(range);
    req.onsuccess = () => {
      const cursor = req.result;
      if (cursor) {
        results.push(cursor.value as ValidationTaskRecord);
        cursor.continue();
      } else {
        resolve(results);
      }
    };
    req.onerror = () => reject(req.error);
  });
}

export async function getValidationTasksBySubmission(submissionId: string): Promise<ValidationTaskRecord[]> {
  const db = await openDb();
  return new Promise((resolve, reject) => {
    const t = db.transaction(STORE_VALIDATION_TASKS, 'readonly');
    const idx = t.objectStore(STORE_VALIDATION_TASKS).index('by_submission_id');
    const range = IDBKeyRange.only(submissionId);
    const results: ValidationTaskRecord[] = [];
    const req = idx.openCursor(range);
    req.onsuccess = () => {
      const cursor = req.result;
      if (cursor) {
        results.push(cursor.value as ValidationTaskRecord);
        cursor.continue();
      } else {
        resolve(results);
      }
    };
    req.onerror = () => reject(req.error);
  });
}

// ---------- Carbon History CRUD ----------

export async function addCarbonHistory(entry: Omit<CarbonHistoryEntry, 'history_id'>): Promise<string> {
  const history_id = crypto.randomUUID();
  const full: CarbonHistoryEntry = { ...entry, history_id };
  await tx<string>(STORE_CARBON_HISTORY, 'readwrite', (store) => store.put(full) as IDBRequest<string>);
  return history_id;
}

export async function getCarbonHistoryBySite(siteId: string): Promise<CarbonHistoryEntry[]> {
  const db = await openDb();
  return new Promise((resolve, reject) => {
    const t = db.transaction(STORE_CARBON_HISTORY, 'readonly');
    const idx = t.objectStore(STORE_CARBON_HISTORY).index('by_site_id');
    const range = IDBKeyRange.only(siteId);
    const results: CarbonHistoryEntry[] = [];
    const req = idx.openCursor(range);
    req.onsuccess = () => {
      const cursor = req.result;
      if (cursor) {
        results.push(cursor.value as CarbonHistoryEntry);
        cursor.continue();
      } else {
        resolve(results);
      }
    };
    req.onerror = () => reject(req.error);
  });
}

// ---------- Notifications CRUD ----------

export async function addNotification(record: Omit<NotificationRecord, 'notification_id'>): Promise<string> {
  const notification_id = crypto.randomUUID();
  const full: NotificationRecord = { ...record, notification_id };
  await tx<string>(STORE_NOTIFICATIONS, 'readwrite', (store) => store.put(full) as IDBRequest<string>);
  return notification_id;
}

export async function getNotificationsByRecipient(recipientId: string): Promise<NotificationRecord[]> {
  const db = await openDb();
  return new Promise((resolve, reject) => {
    const t = db.transaction(STORE_NOTIFICATIONS, 'readonly');
    const idx = t.objectStore(STORE_NOTIFICATIONS).index('by_recipient_id');
    const range = IDBKeyRange.only(recipientId);
    const results: NotificationRecord[] = [];
    const req = idx.openCursor(range);
    req.onsuccess = () => {
      const cursor = req.result;
      if (cursor) {
        results.push(cursor.value as NotificationRecord);
        cursor.continue();
      } else {
        resolve(results);
      }
    };
    req.onerror = () => reject(req.error);
  });
}

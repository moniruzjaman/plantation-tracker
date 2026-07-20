/**
 * Plant Growth Tracker — persistent storage layer.
 *
 * Uses IndexedDB rather than a SQL database (Postgres/Supabase/etc.) to stay
 * consistent with this repo's established architecture: Google Apps Script
 * + localStorage as the canonical backend, offline-first by design (see
 * repo history — Neon/Prisma was deliberately removed in favor of this).
 * IndexedDB gives us the same "tables + indexes" primitives requested,
 * natively, in the browser, with zero new infrastructure or cost:
 *
 *   Object store  ≈ SQL table
 *   createIndex() ≈ SQL CREATE INDEX
 *
 * ── Schema ──
 *
 * growth_readings (object store, keyPath: 'id', autoIncrement)
 *   Columns: id, entryId, readingDate, ndvi, heightCm, healthStatus,
 *            note, recordedBy, createdAt
 *   Indexes:
 *     - by_entryId               (entryId)                — all readings for one plant
 *     - by_readingDate           (readingDate)             — date-range / recency queries
 *     - by_entry_date (compound) ([entryId, readingDate])  — a plant's history, sorted,
 *                                                             without an in-memory filter+sort
 *
 * plantations (object store, keyPath: 'entryId')
 *   A lightweight offline cache of plantation identity, so growth readings
 *   remain meaningful even if the source submission scrolls out of the
 *   in-memory list. Columns: entryId, village, upazila, district,
 *   speciesName, plantedDate, lastSyncedAt.
 *   Indexes:
 *     - by_district (district) — for future district-level growth rollups
 */

const DB_NAME = 'plantation_growth_db';
const DB_VERSION = 1;
const STORE_READINGS = 'growth_readings';
const STORE_PLANTATIONS = 'plantations';

export type HealthStatus = 'healthy' | 'stressed' | 'diseased' | 'dead';

export interface GrowthReading {
  id?: number;
  entryId: string;
  readingDate: string; // ISO date (yyyy-mm-dd)
  ndvi: number | null;
  heightCm: number | null;
  healthStatus: HealthStatus;
  note: string;
  recordedBy: string;
  createdAt: string; // ISO datetime
}

export interface PlantationRecord {
  entryId: string;
  village: string;
  upazila: string;
  district: string;
  speciesName: string;
  plantedDate: string;
  lastSyncedAt: string;
}

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

      if (!db.objectStoreNames.contains(STORE_READINGS)) {
        const readings = db.createObjectStore(STORE_READINGS, { keyPath: 'id', autoIncrement: true });
        readings.createIndex('by_entryId', 'entryId', { unique: false });
        readings.createIndex('by_readingDate', 'readingDate', { unique: false });
        readings.createIndex('by_entry_date', ['entryId', 'readingDate'], { unique: false });
      }

      if (!db.objectStoreNames.contains(STORE_PLANTATIONS)) {
        const plantations = db.createObjectStore(STORE_PLANTATIONS, { keyPath: 'entryId' });
        plantations.createIndex('by_district', 'district', { unique: false });
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

// ── growth_readings CRUD ──

export async function addGrowthReading(reading: Omit<GrowthReading, 'id' | 'createdAt'>): Promise<number> {
  const full: GrowthReading = { ...reading, createdAt: new Date().toISOString() };
  return tx<number>(STORE_READINGS, 'readwrite', (store) => store.add(full) as IDBRequest<number>);
}

export async function deleteGrowthReading(id: number): Promise<void> {
  await tx<undefined>(STORE_READINGS, 'readwrite', (store) => store.delete(id) as IDBRequest<undefined>);
}

/** Uses the by_entry_date compound index — returns a plant's full history, already sorted by date. */
export async function getReadingsForEntry(entryId: string): Promise<GrowthReading[]> {
  const db = await openDb();
  return new Promise((resolve, reject) => {
    const t = db.transaction(STORE_READINGS, 'readonly');
    const idx = t.objectStore(STORE_READINGS).index('by_entry_date');
    const range = IDBKeyRange.bound([entryId, ''], [entryId, '\uffff']);
    const results: GrowthReading[] = [];
    const req = idx.openCursor(range);
    req.onsuccess = () => {
      const cursor = req.result;
      if (cursor) {
        results.push(cursor.value as GrowthReading);
        cursor.continue();
      } else {
        resolve(results);
      }
    };
    req.onerror = () => reject(req.error);
  });
}

/** Uses the by_readingDate index — e.g. "all readings logged in the last 30 days" across every plant. */
export async function getReadingsSince(isoDate: string): Promise<GrowthReading[]> {
  const db = await openDb();
  return new Promise((resolve, reject) => {
    const t = db.transaction(STORE_READINGS, 'readonly');
    const idx = t.objectStore(STORE_READINGS).index('by_readingDate');
    const range = IDBKeyRange.lowerBound(isoDate);
    const results: GrowthReading[] = [];
    const req = idx.openCursor(range);
    req.onsuccess = () => {
      const cursor = req.result;
      if (cursor) {
        results.push(cursor.value as GrowthReading);
        cursor.continue();
      } else {
        resolve(results);
      }
    };
    req.onerror = () => reject(req.error);
  });
}

// ── plantations cache CRUD ──

export async function upsertPlantation(p: PlantationRecord): Promise<void> {
  await tx<IDBValidKey>(STORE_PLANTATIONS, 'readwrite', (store) => store.put(p));
}

export async function getPlantation(entryId: string): Promise<PlantationRecord | undefined> {
  return tx<PlantationRecord | undefined>(STORE_PLANTATIONS, 'readonly', (store) => store.get(entryId));
}

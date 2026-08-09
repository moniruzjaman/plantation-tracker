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
const DB_VERSION = 3;
const STORE_READINGS = 'growth_readings';
const STORE_PLANTATIONS = 'plantations';
const STORE_LIFECYCLE = 'lifecycle_events';

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

export interface LifecycleEvent {
  eventId: string;
  formId: string;
  plantId: string;
  eventType: 'planting' | 'maintenance' | 'survival_check' | 'caretaker_handoff';
  eventDate: string;       // ISO date (yyyy-mm-dd)
  capturedAt: string;      // ISO datetime
  capturedBy: string;
  deviceId?: string;
  payload: {
    alive?: boolean;
    healthStatus?: 'healthy' | 'stressed' | 'diseased' | 'dead';
    heightCm?: number;
    ndvi?: number;
    note?: string;
    fromCaretaker?: string;
    toCaretaker?: string;
    photoBase64?: string;
    speciesName?: string;
    quantity?: number;
  };
  synced?: boolean;
  syncedAt?: string;
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

      if (!db.objectStoreNames.contains(STORE_LIFECYCLE)) {
        const lifecycle = db.createObjectStore(STORE_LIFECYCLE, { keyPath: 'eventId' });
        lifecycle.createIndex('by_formId', 'formId', { unique: false });
        lifecycle.createIndex('by_plantId', 'plantId', { unique: false });
        lifecycle.createIndex('by_eventType', 'eventType', { unique: false });
        lifecycle.createIndex('by_eventDate', 'eventDate', { unique: false });
        lifecycle.createIndex('by_form_plant', ['formId', 'plantId'], { unique: false });
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

const GAS_SYNC_ENDPOINT = '/api/gas-sync';

/**
 * Best-effort sync of a growth reading to the Growth_Log sheet. Reads the
 * same 'dae_device_id' / 'dae_user_profile' localStorage keys
 * plantation.html already writes -- both surfaces share the same
 * origin, so no separate device-identity scheme is needed here. A failed
 * sync never blocks the local save; the reading already exists in
 * IndexedDB regardless (matches this app's offline-first pattern
 * everywhere else).
 */
function syncGrowthReadingToSheet_(reading: GrowthReading): void {
  try {
    const deviceId = localStorage.getItem('dae_device_id') || '';
    const profileRaw = localStorage.getItem('dae_user_profile');
    const profile = profileRaw ? JSON.parse(profileRaw) : {};
    fetch(GAS_SYNC_ENDPOINT, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        entryType: 'growth_reading',
        entryId: reading.entryId,
        readingDate: reading.readingDate,
        ndvi: reading.ndvi,
        heightCm: reading.heightCm,
        healthStatus: reading.healthStatus,
        note: reading.note,
        recordedBy: reading.recordedBy || profile.name || '',
        deviceId,
      }),
    }).catch((err) => console.warn('Growth reading sync failed (kept locally):', err));
  } catch (err) {
    console.warn('Growth reading sync skipped:', err);
  }
}

export async function addGrowthReading(reading: Omit<GrowthReading, 'id' | 'createdAt'>): Promise<number> {
  const full: GrowthReading = { ...reading, createdAt: new Date().toISOString() };
  const id = await tx<number>(STORE_READINGS, 'readwrite', (store) => store.add(full) as IDBRequest<number>);
  syncGrowthReadingToSheet_(full);
  return id;
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

// ── Phase-2: Lifecycle Events CRUD ──

function syncLifecycleEventToSheet_(event: LifecycleEvent): void {
  try {
    const deviceId = localStorage.getItem('dae_device_id') || '';
    const profileRaw = localStorage.getItem('dae_user_profile');
    const profile = profileRaw ? JSON.parse(profileRaw) : {};
    fetch(GAS_SYNC_ENDPOINT, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        entryType: 'lifecycle_event',
        eventId: event.eventId,
        formId: event.formId,
        plantId: event.plantId,
        eventType: event.eventType,
        eventDate: event.eventDate,
        capturedAt: event.capturedAt,
        capturedBy: event.capturedBy || profile.name || '',
        deviceId,
        payload: event.payload,
      }),
    }).catch((err) => console.warn('Lifecycle event sync failed (kept locally):', err));
  } catch (err) {
    console.warn('Lifecycle event sync skipped:', err);
  }
}

export async function addLifecycleEvent(event: Omit<LifecycleEvent, 'capturedAt'>): Promise<string> {
  const full: LifecycleEvent = { ...event, capturedAt: new Date().toISOString() };
  const eventId = full.eventId;
  await tx<IDBValidKey>(STORE_LIFECYCLE, 'readwrite', (store) => store.put(full) as IDBRequest<IDBValidKey>);
  syncLifecycleEventToSheet_(full);
  return eventId;
}

export async function getLifecycleEventsForPlant(formId: string, plantId: string): Promise<LifecycleEvent[]> {
  const db = await openDb();
  return new Promise((resolve, reject) => {
    const t = db.transaction(STORE_LIFECYCLE, 'readonly');
    const idx = t.objectStore(STORE_LIFECYCLE).index('by_form_plant');
    const range = IDBKeyRange.bound([formId, plantId], [formId, plantId]);
    const results: LifecycleEvent[] = [];
    const req = idx.openCursor(range);
    req.onsuccess = () => {
      const cursor = req.result;
      if (cursor) {
        results.push(cursor.value as LifecycleEvent);
        cursor.continue();
      } else {
        resolve(results);
      }
    };
    req.onerror = () => reject(req.error);
  });
}

export async function getLifecycleEventsForForm(formId: string): Promise<LifecycleEvent[]> {
  const db = await openDb();
  return new Promise((resolve, reject) => {
    const t = db.transaction(STORE_LIFECYCLE, 'readonly');
    const idx = t.objectStore(STORE_LIFECYCLE).index('by_formId');
    const req = idx.getAll(formId);
    req.onsuccess = () => resolve(req.result as LifecycleEvent[]);
    req.onerror = () => reject(req.error);
  });
}

export async function getAllLifecycleEvents(): Promise<LifecycleEvent[]> {
  const db = await openDb();
  return new Promise((resolve, reject) => {
    const t = db.transaction(STORE_LIFECYCLE, 'readonly');
    const req = t.objectStore(STORE_LIFECYCLE).getAll();
    req.onsuccess = () => resolve(req.result as LifecycleEvent[]);
    req.onerror = () => reject(req.error);
  });
}

export async function deleteLifecycleEvent(eventId: string): Promise<void> {
  await tx<undefined>(STORE_LIFECYCLE, 'readwrite', (store) => store.delete(eventId) as IDBRequest<undefined>);
}

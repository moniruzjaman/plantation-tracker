/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

/**
 * Lightweight IndexedDB helper with promise-based API.
 * Designed for offline-first field apps where large binary payloads
 * (photos) and high write volume are expected.
 */

const IDB_ERROR_PREFIX = '[IDB]';

export type IDBOpenOptions = {
  name: string;
  version: number;
  stores: {
    name: string;
    keyPath: string;
    indexes?: { name: string; keyPath: string; options?: IDBIndexParameters }[];
  }[];
};

let _db: IDBDatabase | null = null;
let _currentDbName = '';

function openDB(opts: IDBOpenOptions): Promise<IDBDatabase> {
  if (_db && _currentDbName === opts.name) {
    return Promise.resolve(_db);
  }
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(opts.name, opts.version);
    request.onerror = () => reject(new Error(`${IDB_ERROR_PREFIX} open failed: ${request.error?.message}`));
    request.onsuccess = () => {
      _db = request.result;
      _currentDbName = opts.name;
      resolve(_db);
    };
    request.onupgradeneeded = (event) => {
      const db = (event.target as IDBOpenDBRequest).result;
      opts.stores.forEach((store) => {
        if (!db.objectStoreNames.contains(store.name)) {
          const objectStore = db.createObjectStore(store.name, { keyPath: store.keyPath });
          if (store.indexes) {
            store.indexes.forEach((idx) => {
              objectStore.createIndex(idx.name, idx.keyPath, idx.options);
            });
          }
        }
      });
    };
  });
}

function tx(
  db: IDBDatabase,
  storeName: string,
  mode: IDBTransactionMode,
): IDBObjectStore {
  const transaction = db.transaction(storeName, mode);
  return transaction.objectStore(storeName);
}

function idbRequest<T>(request: IDBRequest<T>): Promise<T> {
  return new Promise((resolve, reject) => {
    request.onsuccess = () => resolve(request.result as T);
    request.onerror = () => reject(new Error(`${IDB_ERROR_PREFIX} request failed: ${request.error?.message}`));
  });
}

export async function idbPut<T extends object>(opts: IDBOpenOptions, storeName: string, value: T): Promise<void> {
  const db = await openDB(opts);
  const store = tx(db, storeName, 'readwrite');
  await idbRequest(store.put(value));
}

export async function idbGet<T>(opts: IDBOpenOptions, storeName: string, key: string | number): Promise<T | undefined> {
  const db = await openDB(opts);
  const store = tx(db, storeName, 'readonly');
  return idbRequest(store.get(key));
}

export async function idbGetAll<T>(opts: IDBOpenOptions, storeName: string): Promise<T[]> {
  const db = await openDB(opts);
  const store = tx(db, storeName, 'readonly');
  return idbRequest(store.getAll());
}

export async function idbDelete(opts: IDBOpenOptions, storeName: string, key: string | number): Promise<void> {
  const db = await openDB(opts);
  const store = tx(db, storeName, 'readwrite');
  await idbRequest(store.delete(key));
}

export async function idbClear(opts: IDBOpenOptions, storeName: string): Promise<void> {
  const db = await openDB(opts);
  const store = tx(db, storeName, 'readwrite');
  await idbRequest(store.clear());
}

export async function idbCount(opts: IDBOpenOptions, storeName: string): Promise<number> {
  const db = await openDB(opts);
  const store = tx(db, storeName, 'readonly');
  return idbRequest(store.count());
}

export async function idbGetAllByIndex<T>(
  opts: IDBOpenOptions,
  storeName: string,
  indexName: string,
  value: string | number,
): Promise<T[]> {
  const db = await openDB(opts);
  const store = tx(db, storeName, 'readonly');
  const index = store.index(indexName);
  return idbRequest(index.getAll(value));
}

export function idbClose(): void {
  if (_db) {
    _db.close();
    _db = null;
    _currentDbName = '';
  }
}

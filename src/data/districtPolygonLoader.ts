/**
 * On-demand loader for per-district upazila polygon data.
 *
 * Rather than bundling all 64 districts' boundaries (~1.8MB) into every
 * device's initial download, each district lives in its own file
 * (src/data/districts/*.ts) and is only fetched via dynamic import() the
 * first time it's actually needed -- see DISTRICT_LOADERS in
 * districtRegistry.ts. Once fetched, it's cached both in memory (for the
 * current session) and in IndexedDB (so it's available offline on every
 * later visit, without a repeat network fetch).
 *
 * Two things trigger a district being loaded, both driven from MapTab:
 *   1. Automatically, for the signed-in officer's own posting district
 *      (read from the same 'dae_user_profile' localStorage key
 *      plantation.html already writes -- see useOwnDistrictAutoLoad()).
 *   2. Manually, via the district selector UI, for a DD/reviewer who
 *      wants to check entries in other districts.
 */

import { DISTRICT_LOADERS, ALL_DISTRICT_NAMES } from './districtRegistry';
import type { UpazilaGeometry } from './districtPolygonTypes';

const DB_NAME = 'district_polygon_cache_db';
const DB_VERSION = 1;
const STORE = 'cached_districts';

let dbPromise: Promise<IDBDatabase> | null = null;

function openDb(): Promise<IDBDatabase> {
  if (dbPromise) return dbPromise;
  dbPromise = new Promise((resolve, reject) => {
    if (typeof indexedDB === 'undefined') {
      reject(new Error('IndexedDB not available'));
      return;
    }
    const req = indexedDB.open(DB_NAME, DB_VERSION);
    req.onupgradeneeded = () => {
      const db = req.result;
      if (!db.objectStoreNames.contains(STORE)) {
        db.createObjectStore(STORE, { keyPath: 'districtName' });
      }
    };
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error);
  });
  return dbPromise;
}

async function readFromIndexedDb(districtName: string): Promise<Record<string, UpazilaGeometry> | null> {
  try {
    const db = await openDb();
    return await new Promise((resolve) => {
      const t = db.transaction(STORE, 'readonly');
      const req = t.objectStore(STORE).get(districtName);
      req.onsuccess = () => resolve(req.result ? req.result.data : null);
      req.onerror = () => resolve(null); // cache miss is not fatal, just re-fetch
    });
  } catch {
    return null; // IndexedDB unavailable (private browsing, old WebView, etc.) -- fall through to network
  }
}

function writeToIndexedDb(districtName: string, data: Record<string, UpazilaGeometry>): void {
  openDb()
    .then((db) => {
      const t = db.transaction(STORE, 'readwrite');
      t.objectStore(STORE).put({ districtName, data, cachedAt: new Date().toISOString() });
    })
    .catch(() => {
      /* best-effort cache write; a failure here just means we re-fetch next time */
    });
}

const memoryCache = new Map<string, Record<string, UpazilaGeometry>>();
const inFlight = new Map<string, Promise<Record<string, UpazilaGeometry> | null>>();

/** All district names known to have polygon data (Bengali, matches the
 *  profile form's district dropdown values exactly). */
export function listAvailableDistricts(): string[] {
  return ALL_DISTRICT_NAMES;
}

export function isDistrictLoaded(districtName: string): boolean {
  return memoryCache.has(districtName);
}

export function getLoadedDistrictNames(): string[] {
  return Array.from(memoryCache.keys());
}

/**
 * Loads one district's upazila polygons: memory cache -> IndexedDB cache
 * -> network (dynamic import chunk). Safe to call repeatedly for the same
 * district; concurrent calls share one in-flight request.
 */
export async function loadDistrict(districtName: string): Promise<Record<string, UpazilaGeometry> | null> {
  if (memoryCache.has(districtName)) return memoryCache.get(districtName)!;
  if (inFlight.has(districtName)) return inFlight.get(districtName)!;

  const promise = (async () => {
    const cached = await readFromIndexedDb(districtName);
    if (cached) {
      memoryCache.set(districtName, cached);
      return cached;
    }
    const loader = DISTRICT_LOADERS[districtName];
    if (!loader) return null; // unknown district name -- nothing to load
    try {
      const data = await loader();
      memoryCache.set(districtName, data);
      writeToIndexedDb(districtName, data);
      return data;
    } catch {
      return null; // offline with no cache yet -- caller just won't have this district's data
    }
  })();

  inFlight.set(districtName, promise);
  try {
    return await promise;
  } finally {
    inFlight.delete(districtName);
  }
}

/** Merged view across every district loaded so far (own posting +
 *  anything added via the manual selector). This is what MapTab's
 *  boundary checks actually search against. */
export function getMergedLoadedPolygons(): Record<string, UpazilaGeometry> {
  const merged: Record<string, UpazilaGeometry> = {};
  for (const districtData of memoryCache.values()) {
    Object.assign(merged, districtData);
  }
  return merged;
}

/**
 * Reads the officer's own posting district from the same
 * 'dae_user_profile' localStorage key plantation.html and growthDb.ts
 * already use, and loads it. Call once on map mount; safe no-op if no
 * profile is set yet (guest/browsing mode) or the district name isn't
 * recognized.
 */
export async function loadOwnPostingDistrict(): Promise<string | null> {
  try {
    const raw = localStorage.getItem('dae_user_profile');
    if (!raw) return null;
    const profile = JSON.parse(raw);
    const district: string = profile?.district || '';
    if (!district || !DISTRICT_LOADERS[district]) return null;
    await loadDistrict(district);
    return district;
  } catch {
    return null;
  }
}

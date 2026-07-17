import { useEffect, useState, useCallback, useRef } from 'react';
import type { LocalSubmission, NationalEntry } from '../types/plantation';

const LS_KEY = 'nursery_submissions'; // same key legacy-nursery.html writes to
const GAS_SYNC_ENDPOINT = '/api/gas-sync';
const NATIONAL_CACHE_KEY = 'national_entries_cache_v1'; // shared cache key with legacy-nursery.html
const NATIONAL_CACHE_MAX_AGE_MS = 30 * 60 * 1000; // 30 minutes

function loadLocalSubmissions(): LocalSubmission[] {
  try {
    const raw = localStorage.getItem(LS_KEY);
    const parsed = raw ? JSON.parse(raw) : [];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

interface CachedNational {
  entries: NationalEntry[];
  cachedAt: string;
}

function loadCachedNational(): CachedNational | null {
  try {
    const raw = localStorage.getItem(NATIONAL_CACHE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    return parsed && Array.isArray(parsed.entries) ? parsed : null;
  } catch {
    return null;
  }
}

function saveCachedNational(entries: NationalEntry[]) {
  try {
    localStorage.setItem(NATIONAL_CACHE_KEY, JSON.stringify({ entries, cachedAt: new Date().toISOString() }));
  } catch {
    /* storage full/unavailable — best effort only */
  }
}

export interface MapDataState {
  localSubmissions: LocalSubmission[];
  nationalEntries: NationalEntry[];
  syncStatus: string;
  refresh: () => void;
}

/**
 * Supplies the native MapTab with this device's local submissions plus the
 * AppScript (Google Sheet) national entries, reusing the exact same
 * localStorage keys/cache as legacy-nursery.html so both surfaces of the app
 * agree on the same data without a second network round-trip on every load.
 */
export function useMapData(): MapDataState {
  const [localSubmissions, setLocalSubmissions] = useState<LocalSubmission[]>(() => loadLocalSubmissions());
  const [nationalEntries, setNationalEntries] = useState<NationalEntry[]>(() => loadCachedNational()?.entries || []);
  const [syncStatus, setSyncStatus] = useState('');
  const loadingRef = useRef(false);

  const fetchNational = useCallback(async (force = false) => {
    if (loadingRef.current) return;
    const cached = loadCachedNational();
    const ageMs = cached ? Date.now() - new Date(cached.cachedAt).getTime() : Infinity;
    if (cached && !force) {
      setNationalEntries(cached.entries);
      setSyncStatus(`📦 ক্যাশ থেকে ${cached.entries.length} টি এন্ট্রি (${new Date(cached.cachedAt).toLocaleTimeString('bn-BD')})`);
      if (ageMs < NATIONAL_CACHE_MAX_AGE_MS) return; // cache still fresh enough, skip network
    }
    loadingRef.current = true;
    setSyncStatus('📡 AppScript থেকে তথ্য লোড হচ্ছে...');
    try {
      const res = await fetch(`${GAS_SYNC_ENDPOINT}?list=1`);
      const data = await res.json();
      const rows: NationalEntry[] = data && data.ok && Array.isArray(data.entries) ? data.entries : [];
      const withSource = rows.map((r) => ({ ...r, _source: 'appscript' as const }));
      setNationalEntries(withSource);
      saveCachedNational(withSource);
      setSyncStatus(`✅ AppScript থেকে ${withSource.length} টি এন্ট্রি সিঙ্ক হয়েছে (${new Date().toLocaleTimeString('bn-BD')})`);
    } catch (err) {
      console.error('AppScript national entries fetch failed:', err);
      if (!cached) setSyncStatus('⚠️ AppScript থেকে তথ্য আনা যায়নি।');
      else setSyncStatus('⚠️ নতুন তথ্য আনা যায়নি — ক্যাশ দেখানো হচ্ছে।');
    } finally {
      loadingRef.current = false;
    }
  }, []);

  useEffect(() => {
    fetchNational(false);
  }, [fetchNational]);

  const refresh = useCallback(() => {
    setLocalSubmissions(loadLocalSubmissions());
    fetchNational(true);
  }, [fetchNational]);

  return { localSubmissions, nationalEntries, syncStatus, refresh };
}

import { useState, useCallback, useEffect, useRef } from 'react';
import type { Submission, FlatSeedling } from '../components/OfflinePlantationDashboard';
import { getSubmissions, saveSubmissions } from '../services/storage';
import { sendToGAS, fetchNationalEntries } from '../services/api';
import { NATIONAL_ENTRIES_CACHE_KEY } from '../services/storage';

/** Generate a unique submission ID: PT-<timestamp><4-digit-random> */
function generateId(): string {
  const ts = Date.now();
  const rand = Math.floor(Math.random() * 10000)
    .toString()
    .padStart(4, '0');
  return `PT-${ts}${rand}`;
}

export function useSubmissions() {
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [nationalEntries, setNationalEntries] = useState<Submission[]>([]);
  const initRef = useRef(false);

  // ── Hydrate from localStorage on mount ──────────────────────────────────
  useEffect(() => {
    if (initRef.current) return;
    initRef.current = true;
    setSubmissions(getSubmissions());
  }, []);

  // ── Persist whenever submissions change ─────────────────────────────────
  useEffect(() => {
    if (!initRef.current) return; // skip the initial empty-state write
    saveSubmissions(submissions);
  }, [submissions]);

  // ── Add a new submission ────────────────────────────────────────────────
  const addSubmission = useCallback(async (entry: Omit<Submission, 'id'>) => {
    const newSubmission: Submission = {
      ...entry,
      id: generateId(),
    };

    setSubmissions((prev) => [newSubmission, ...prev]);

    // Best-effort sync to GAS
    try {
      const rows = (newSubmission.seedlings || []).map((s: any) => ({
        ...newSubmission,
        speciesName: s.speciesName || '',
        category: s.category || '',
        quantity: s.quantity || 0,
      }));
      const result = await sendToGAS(rows.length > 0 ? rows : [newSubmission]);
      if (result.ok) {
        const now = new Date().toISOString();
        setSubmissions((prev) =>
          prev.map((s) =>
            s.id === newSubmission.id
              ? { ...s, synced: true, syncedAt: now }
              : s,
          ),
        );
      } else {
        // Sync failed — show error but keep synced: false
        console.warn('[useSubmissions] addSubmission sync failed:', result.error);
        // Dispatch a custom event so the UI can show the error
        window.dispatchEvent(new CustomEvent('sync-error', {
          detail: 'সিঙ্ক ব্যর্থ — তথ্য অফলাইনে সংরক্ষিত আছে',
        }));
      }
    } catch {
      // Submission is safely stored locally; sync can be retried later
      window.dispatchEvent(new CustomEvent('sync-error', {
        detail: 'সিঙ্ক ব্যর্থ — তথ্য অফলাইনে সংরক্ষিত আছে',
      }));
    }

    return newSubmission;
  }, []);

  // ── Update an existing submission by id ─────────────────────────────────
  const updateSubmission = useCallback(
    async (id: string, patch: Partial<Submission>) => {
      let updated: Submission | undefined;

      setSubmissions((prev) =>
        prev.map((s) => {
          if (s.id !== id) return s;
          updated = { ...s, ...patch };
          return updated;
        }),
      );

      // Best-effort re-sync
      if (updated) {
        try {
          const rows = (updated.seedlings || []).map((s: any) => ({
            ...updated,
            speciesName: s.speciesName || '',
            category: s.category || '',
            quantity: s.quantity || 0,
          }));
          const result = await sendToGAS(rows.length > 0 ? rows : [updated]);
          if (result.ok) {
            const now = new Date().toISOString();
            setSubmissions((prev) =>
              prev.map((s) =>
                s.id === id
                  ? { ...s, synced: true, syncedAt: now }
                  : s,
              ),
            );
          } else {
            console.warn('[useSubmissions] updateSubmission sync failed:', result.error);
          }
        } catch {
          // ignore – local state is already persisted
        }
      }
    },
    [],
  );

  // ── Delete a submission by id ───────────────────────────────────────────
  const deleteSubmission = useCallback((id: string) => {
    setSubmissions((prev) => prev.filter((s) => s.id !== id));
  }, []);

  // ── Sync every local submission to GAS ──────────────────────────────────
  const syncAll = useCallback(async () => {
    // Read latest from React state (not storage) for accurate sync flags
    let current: Submission[] = [];
    setSubmissions((prev) => {
      current = prev;
      return prev;
    });

    const unsynced = current.filter((s) => !s.synced);
    let successCount = 0;
    let failedCount = 0;

    const updateFlags: { id: string; synced: boolean; syncedAt: string }[] = [];

    const results = await Promise.allSettled(
      unsynced.map((s) => {
        const rows = (s.seedlings || []).map((sl: any) => ({
          ...s,
          speciesName: sl.speciesName || '',
          category: sl.category || '',
          quantity: sl.quantity || 0,
        }));
        return sendToGAS(rows.length > 0 ? rows : [s]).then((result) => {
          if (result.ok) {
            successCount++;
            updateFlags.push({ id: s.id, synced: true, syncedAt: new Date().toISOString() });
          } else {
            failedCount++;
          }
        });
      }),
    );

    // Also count any Promise.rejected results
    results.forEach((r) => {
      if (r.status === 'rejected') failedCount++;
    });

    // Update React state with synced flags
    if (updateFlags.length > 0) {
      setSubmissions((prev) =>
        prev.map((s) => {
          const flag = updateFlags.find((f) => f.id === s.id);
          if (flag) return { ...s, synced: true, syncedAt: flag.syncedAt };
          return s;
        }),
      );
    }

    return { total: unsynced.length, failedCount, successCount };
  }, []);

  // ── Fetch national entries and merge (dedup by submissionId) ────────────
  const loadNationalEntries = useCallback(async () => {
    try {
      const remote = await fetchNationalEntries();
      const local = getSubmissions();
      const localIds = new Set(local.map((s) => s.id));

      // Dedup national entries by id/submissionId
      const seenRemoteIds = new Set<string>();
      const dedupedRemote = remote.filter((r) => {
        const rid = r.id || r.submissionId || '';
        if (!rid || seenRemoteIds.has(rid)) return false;
        seenRemoteIds.add(rid);
        return true;
      });

      // Merge: keep all local + remote entries not already present locally
      const merged = [
        ...local,
        ...dedupedRemote.filter((r) => !localIds.has(r.id || r.submissionId || '')),
      ];

      setNationalEntries(merged);
      return merged;
    } catch {
      return nationalEntries;
    }
  }, [nationalEntries]);

  // ── Re-read from localStorage (e.g. after an external write) ─────────────
  const refreshFromStorage = useCallback(() => {
    setSubmissions(getSubmissions());
  }, []);

  return {
    submissions,
    nationalEntries,
    addSubmission,
    updateSubmission,
    deleteSubmission,
    syncAll,
    loadNationalEntries,
    refreshFromStorage,
  };
}
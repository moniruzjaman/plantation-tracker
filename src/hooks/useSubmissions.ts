import { useState, useCallback, useEffect, useRef } from 'react';
import type { Submission, FlatSeedling } from '../components/OfflinePlantationDashboard';
import { getSubmissions, saveSubmissions } from '../services/storage';
import { sendToGAS, fetchNationalEntries } from '../services/api';

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
      await sendToGAS(rows.length > 0 ? rows : [newSubmission]);
    } catch {
      // Submission is safely stored locally; sync can be retried later
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
          await sendToGAS(rows.length > 0 ? rows : [updated]);
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
    const current = getSubmissions(); // read latest from storage
    const results = await Promise.allSettled(
      current.map((s) => {
        const rows = (s.seedlings || []).map((sl: any) => ({
          ...s,
          speciesName: sl.speciesName || '',
          category: sl.category || '',
          quantity: sl.quantity || 0,
        }));
        return sendToGAS(rows.length > 0 ? rows : [s]);
      }),
    );
    const failedCount = results.filter((r) => r.status === 'rejected').length;
    return { total: current.length, failedCount };
  }, []);

  // ── Fetch national entries and merge (dedup by submissionId) ────────────
  const loadNationalEntries = useCallback(async () => {
    try {
      const remote = await fetchNationalEntries();
      const local = getSubmissions();
      const localIds = new Set(local.map((s) => s.id));

      // Merge: keep all local + remote entries not already present locally
      const merged = [
        ...local,
        ...remote.filter((r) => !localIds.has(r.id)),
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

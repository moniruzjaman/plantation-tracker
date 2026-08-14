import { useCallback, useEffect, useMemo, useState } from 'react';
import { loadDistrict, loadOwnPostingDistrict, listAvailableDistricts } from './districtPolygonLoader';
import type { UpazilaGeometry } from './districtPolygonTypes';

interface UseDistrictPolygonsResult {
  /** Merged polygon set across every currently-active district -- pass
   *  this straight into isWithinUpazilaPolygon() / findContainingUpazila(). */
  mergedPolygons: Record<string, UpazilaGeometry>;
  /** District names currently contributing to mergedPolygons. */
  activeDistricts: string[];
  /** The officer's own posting district, once auto-load resolves (null
   *  while loading, or if no profile/unrecognized district is set). */
  ownDistrict: string | null;
  /** All 64 district names, for populating the manual selector dropdown. */
  availableDistricts: string[];
  addDistrict: (name: string) => Promise<void>;
  removeDistrict: (name: string) => void;
  loading: boolean;
}

/**
 * Auto-loads the signed-in officer's own posting district on mount (read
 * from the same 'dae_user_profile' localStorage key plantation.html
 * writes), and exposes addDistrict/removeDistrict for a manual selector
 * so a DD/reviewer can bring in other districts' boundary data on demand.
 * Nothing beyond the officer's own district is ever fetched automatically.
 */
export function useDistrictPolygons(): UseDistrictPolygonsResult {
  const [polygonsByDistrict, setPolygonsByDistrict] = useState<Record<string, Record<string, UpazilaGeometry>>>({});
  const [ownDistrict, setOwnDistrict] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const district = await loadOwnPostingDistrict();
      if (cancelled) return;
      if (district) {
        const data = await loadDistrict(district);
        if (cancelled) return;
        if (data) {
          setPolygonsByDistrict((prev) => ({ ...prev, [district]: data }));
          setOwnDistrict(district);
        }
      }
      setLoading(false);
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const addDistrict = useCallback(async (name: string) => {
    const data = await loadDistrict(name);
    if (data) {
      setPolygonsByDistrict((prev) => ({ ...prev, [name]: data }));
    }
  }, []);

  const removeDistrict = useCallback((name: string) => {
    setPolygonsByDistrict((prev) => {
      if (!(name in prev)) return prev;
      const next = { ...prev };
      delete next[name];
      return next;
    });
  }, []);

  const mergedPolygons = useMemo(() => {
    const merged: Record<string, UpazilaGeometry> = {};
    for (const data of Object.values(polygonsByDistrict)) Object.assign(merged, data);
    return merged;
  }, [polygonsByDistrict]);

  const activeDistricts = useMemo(() => Object.keys(polygonsByDistrict), [polygonsByDistrict]);

  return {
    mergedPolygons,
    activeDistricts,
    ownDistrict,
    availableDistricts: listAvailableDistricts(),
    addDistrict,
    removeDistrict,
    loading,
  };
}

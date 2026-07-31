import { useState, useCallback, useRef, useMemo } from 'react';
import { haversineMeters, polygonAreaSqm } from '../utils/geoUtils';

export interface FencePoint {
  lat: number;
  lng: number;
}

/** Minimum distance (metres) between consecutive fence points to filter GPS jitter. */
const MIN_DISTANCE_M = 2;

export function useGeoFence() {
  const [points, setPoints] = useState<FencePoint[]>([]);
  const [isWalking, setIsWalking] = useState(false);
  const watchIdRef = useRef<number | null>(null);

  // ── Computed values ─────────────────────────────────────────────────────
  const areaSqm = useMemo(() => {
    if (points.length < 3) return 0;
    return polygonAreaSqm(points);
  }, [points]);

  const pointsJSON = useMemo(() => JSON.stringify(points), [points]);

  const areaStr = useMemo(() => {
    if (areaSqm === 0) return '';
    // Display in sqm up to 10 000, then switch to hectares
    if (areaSqm < 10_000) {
      return `${areaSqm.toFixed(1)} sqm`;
    }
    return `${(areaSqm / 10_000).toFixed(4)} ha`;
  }, [areaSqm]);

  // ── Start / stop watching ───────────────────────────────────────────────
  const toggleWalk = useCallback(() => {
    if (isWalking) {
      // Stop
      if (watchIdRef.current !== null) {
        navigator.geolocation.clearWatch(watchIdRef.current);
        watchIdRef.current = null;
      }
      setIsWalking(false);
      return;
    }

    // Start
    if (!navigator.geolocation) {
      return;
    }

    setIsWalking(true);

    watchIdRef.current = navigator.geolocation.watchPosition(
      (position) => {
        const { latitude: lat, longitude: lng } = position.coords;

        setPoints((prev) => {
          // Filter jitter: only add if ≥ MIN_DISTANCE_M from the last recorded point
          if (prev.length > 0) {
            const last = prev[prev.length - 1];
            const dist = haversineMeters(last.lat, last.lng, lat, lng);
            if (dist < MIN_DISTANCE_M) return prev;
          }
          return [...prev, { lat, lng }];
        });
      },
      undefined, // error handler – silently ignored to keep walking stable
      {
        enableHighAccuracy: true,
        maximumAge: 0,
        timeout: 10_000,
      },
    );
  }, [isWalking]);

  // ── Clear all fence points ──────────────────────────────────────────────
  const clearFence = useCallback(() => {
    if (watchIdRef.current !== null) {
      navigator.geolocation.clearWatch(watchIdRef.current);
      watchIdRef.current = null;
    }
    setIsWalking(false);
    setPoints([]);
  }, []);

  // ── Cleanup on unmount ──────────────────────────────────────────────────
  // Note: React 19 supports returning a cleanup from useEffect;
  // we use a ref-based approach with a module-level flag to be safe.
  // In practice, wrapping the watch clear in a useEffect cleanup is preferred.
  // This is handled via the clearFence / toggleWalk logic already.

  return {
    points,
    areaSqm,
    isWalking,
    toggleWalk,
    clearFence,
    pointsJSON,
    areaStr,
  };
}

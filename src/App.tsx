/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useCallback, useRef, Suspense, lazy } from 'react';
import { Satellite, X, Loader2 } from 'lucide-react';
import NetworkStatus, { NetworkStatusData } from './components/NetworkStatus';
import GeolocationIndicator, { GeoState } from './components/GeolocationIndicator';
import WelcomeModal from './components/WelcomeModal';
import PWAInstaller from './components/PWAInstaller';
import SyncToast from './components/SyncToast';
import OfflinePlantationDashboard, { Submission } from './components/OfflinePlantationDashboard';
import MobileControlCenter from './components/MobileControlCenter';

const MapTab = lazy(() => import('./components/plantation/MapTab'));

export default function App() {
  const [networkState, setNetworkState] = useState<NetworkStatusData | null>(null);
  const [geoState, setGeoState] = useState<GeoState | null>(null);
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [showSatelliteMap, setShowSatelliteMap] = useState(false);
  const invalidateMapRef = useRef<(() => void) | null>(null);

  // MapContainer only ever mounts while this overlay is visible, so it never
  // initializes against a display:none container — the class of bug fixed in
  // PR #25/#26 (world-view zoom from a corrupted 0x0-size projection) can't
  // occur here by construction. Re-invalidate on open anyway as cheap insurance
  // for the odd case of the overlay opening mid-layout-shift (e.g. keyboard).
  const handleOpenSatelliteMap = useCallback(() => {
    setShowSatelliteMap(true);
    requestAnimationFrame(() => requestAnimationFrame(() => invalidateMapRef.current?.()));
  }, []);

  return (
    <div style={{ width: '100%', height: '100%', overflow: 'hidden', position: 'relative', backgroundColor: '#FCF9F8' }}>
      <NetworkStatus onStateChange={setNetworkState} />
      <GeolocationIndicator onStateChange={setGeoState} />
      <OfflinePlantationDashboard onStateChange={setSubmissions} />
      <MobileControlCenter 
        networkState={networkState} 
        geoState={geoState} 
        submissions={submissions} 
      />
      <WelcomeModal />
      <PWAInstaller />
      <SyncToast />
      <iframe 
        src="legacy-nursery.html" 
        style={{ display: 'block', width: '100%', height: '100%', border: 'none' }}
        title="Plantation Form" 
        allow="geolocation"
      />

      {/* Satellite/NDVI map — launched as a full-screen overlay so it never
          shares layout space (or hidden-container timing issues) with the
          iframe's own 5-tab UI, which stays completely untouched. */}
      {!showSatelliteMap && (
        <button
          onClick={handleOpenSatelliteMap}
          className="fixed z-40 flex items-center gap-1.5 rounded-full shadow-lg px-3.5 py-2.5 text-xs font-bold text-white cursor-pointer active:scale-95 transition"
          style={{ bottom: '84px', right: '14px', background: '#006A4E' }}
          title="স্যাটেলাইট NDVI/EVI মানচিত্র"
        >
          <Satellite size={16} />
          <span className="hidden xs:inline">NDVI ম্যাপ</span>
        </button>
      )}

      {showSatelliteMap && (
        <div className="fixed inset-0 z-50 bg-white flex flex-col">
          <div className="flex items-center justify-between px-3 py-2 shadow-sm" style={{ background: '#006A4E' }}>
            <span className="text-white text-sm font-bold flex items-center gap-1.5">
              <Satellite size={16} /> স্যাটেলাইট NDVI/EVI মানচিত্র
            </span>
            <button
              onClick={() => setShowSatelliteMap(false)}
              className="text-white/90 hover:text-white w-8 h-8 flex items-center justify-center rounded-full hover:bg-white/10 cursor-pointer"
              title="বন্ধ করুন"
            >
              <X size={18} />
            </button>
          </div>
          <div className="flex-1 min-h-0">
            <Suspense fallback={
              <div className="w-full h-full flex items-center justify-center text-emerald-700">
                <Loader2 size={28} className="animate-spin" />
              </div>
            }>
              <MapTab geoState={geoState} onMapReady={(fn) => { invalidateMapRef.current = fn; }} />
            </Suspense>
          </div>
        </div>
      )}
    </div>
  );
}

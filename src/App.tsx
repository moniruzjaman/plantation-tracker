/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useCallback, Suspense, lazy, useRef, useEffect } from 'react';
import { Satellite, X, Loader2 } from 'lucide-react';
import NetworkStatus, { NetworkStatusData } from './components/NetworkStatus';
import GeolocationIndicator, { GeoState } from './components/GeolocationIndicator';
import WelcomeModal from './components/WelcomeModal';
import PWAInstaller from './components/PWAInstaller';
import SyncToast from './components/SyncToast';
import OfflinePlantationDashboard, { Submission } from './components/OfflinePlantationDashboard';
import MobileControlCenter from './components/MobileControlCenter';
import AppHeader from './components/plantation/AppHeader';
import AppFooter from './components/plantation/AppFooter';
import AppTabs from './components/plantation/AppTabs';
import WelcomeGuide from './components/plantation/WelcomeGuide';
import SubmissionForm from './components/plantation/submission/SubmissionForm';
import Dashboard from './components/plantation/dashboard/Dashboard';
import LegacyMap from './components/plantation/map/LegacyMap';
import MyData from './components/plantation/profile/MyData';
import ProfilePanel from './components/plantation/profile/ProfilePanel';
import AdminPanel from './components/plantation/profile/AdminPanel';
import { useSubmissions } from './hooks/useSubmissions';
import { useGeoLocation } from './hooks/useGeoLocation';
import { useGeoFence } from './hooks/useGeoFence';
import { useProfile } from './hooks/useProfile';
import type { Profile } from './hooks/useProfile';
import type { FlatSeedling } from './components/OfflinePlantationDashboard';

const MapTab = lazy(() => import('./components/plantation/MapTab'));

export default function App() {
  // ── Iframe detection (migrated from legacy checkIframeAndPrompt) ──
  useEffect(() => {
    try {
      if (window.self !== window.top) {
        const banner = document.createElement('div');
        banner.id = 'pwaIframeBanner';
        banner.style.cssText = 'position:fixed;top:0;left:0;right:0;z-index:9999;background:#dc2626;color:#fff;text-align:center;padding:8px 12px;font-size:13px;font-family:sans-serif;cursor:pointer;';
        banner.textContent = '⚠️ পূর্ণ অভিজ্ঞতার জন্য নতুন ট্যাবে খুলুন (Open in new tab for full experience)';
        banner.onclick = () => { window.open(window.location.href, '_blank'); };
        document.body.prepend(banner);
        return () => { banner.remove(); };
      }
    } catch { /* cross-origin, ignore */ }
  }, []);

  // ── Background services state (fed to MobileControlCenter) ──────────
  const [networkState, setNetworkState] = useState<NetworkStatusData | null>(null);
  const [geoState, setGeoState] = useState<GeoState | null>(null);
  const [bgSubmissions, setBgSubmissions] = useState<Submission[]>([]);

  // ── Hooks ────────────────────────────────────────────────────────────
  const {
    submissions,
    nationalEntries,
    addSubmission,
    updateSubmission,
    deleteSubmission,
    syncAll,
    loadNationalEntries,
  } = useSubmissions();

  const geo = useGeoLocation();
  const fence = useGeoFence();
  const { profile, save: saveProfile, requireProfileOrPrompt } = useProfile();

  // ── Tab & UI state ──────────────────────────────────────────────────
  const [activeTab, setActiveTab] = useState('form');
  const [showSatelliteMap, setShowSatelliteMap] = useState(false);
  const [showWelcomeGuide, setShowWelcomeGuide] = useState(() => {
    try {
      return !localStorage.getItem('guide_dismissed');
    } catch {
      return true;
    }
  });
  const [showGeoManualPanel, setShowGeoManualPanel] = useState(false);
  const [editSubmission, setEditSubmission] = useState<Submission | null>(null);
  const [showAdmin, setShowAdmin] = useState(false);
  const [formPhotoBase64, setFormPhotoBase64] = useState<string>('');

  // Ref for satellite map invalidate
  const invalidateMapRef = useRef<(() => void) | null>(null);

  // ── Load national entries on first mount ─────────────────────────────
  useEffect(() => {
    loadNationalEntries();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // ── Derived: unsynced count for tab badge ────────────────────────────
  const unsyncedCount = submissions.filter((s) => !s.synced).length;

  // ── Derived: geo status label for AppHeader ─────────────────────────
  const geoStatusLabel = (() => {
    if (!geoState) return 'searching';
    if (geoState.loading) return 'searching';
    if (geoState.error) return 'error';
    if (geoState.coords) return 'active';
    return 'searching';
  })();

  // ── Derived: isOnline for AppHeader ──────────────────────────────────
  const isOnline = networkState?.isOnline ?? true;

  // #45: Auto-sync on reconnect
  useEffect(() => {
    const handleNetworkOnline = () => {
      if (unsyncedCount > 0) {
        syncAll();
      }
    };
    window.addEventListener('network-online', handleNetworkOnline);
    return () => window.removeEventListener('network-online', handleNetworkOnline);
  }, [unsyncedCount, syncAll]);

  // ── Tab change handler ──────────────────────────────────────────────
  const handleTabChange = useCallback((tab: string) => {
    setActiveTab(tab);
    // If switching away from form in edit mode, clear edit
    if (tab !== 'form') {
      setEditSubmission(null);
    }
    // Invalidate satellite map when switching to its tab
    if (tab === 'map' || tab === 'satellite') {
      requestAnimationFrame(() => requestAnimationFrame(() => invalidateMapRef.current?.()));
    }
  }, []);

  // ── Satellite map open/close ────────────────────────────────────────
  const handleOpenSatelliteMap = useCallback(() => {
    setShowSatelliteMap(true);
    requestAnimationFrame(() => requestAnimationFrame(() => invalidateMapRef.current?.()));
  }, []);

  // ── Form submit handler ─────────────────────────────────────────────
  const handleFormSubmit = useCallback(
    async (data: Record<string, unknown>) => {
      // 1. Build base submission object from form data + profile
      const now = new Date().toISOString();

      const seedlings: FlatSeedling[] = (data.seedlings as FlatSeedling[] | undefined) ?? [];

      // Build geoLocation string from form lat/lng or from hook
      const lat = (data.latitude as string) || (geo.latitude != null ? String(geo.latitude) : '');
      const lng = (data.longitude as string) || (geo.longitude != null ? String(geo.longitude) : '');
      const geoLocation = lat && lng ? `${lat}, ${lng}` : geo.geoString || undefined;

      const base: Omit<Submission, 'id'> = {
        region: (data.region as string) || profile.region || '',
        district: (data.district as string) || '',
        upazila: (data.upazila as string) || '',
        division: (data.division as string) || undefined,
        union: (data.union as string) || undefined,
        village: (data.village as string) || undefined,
        locationType: (data.locationType as string) || undefined,
        plantingDate: (data.plantingDate as string) || undefined,
        submittedAt: now,
        address: (data.address as string) || undefined,
        geoLocation,
        latitude: lat || undefined,
        longitude: lng || undefined,
        farmerName: (data.farmerName as string) || '',
        farmerMobile: (data.farmerMobile as string) || '',
        saaoName: (data.saaoName as string) || undefined,
        saaoMobile: (data.saaoMobile as string) || undefined,
        officerName: (data.officerName as string) || profile.officerName || undefined,
        officerMobile: (data.officerMobile as string) || profile.officerMobile || undefined,
        seedlings: seedlings.filter((s) => s.speciesName.trim() !== ''),
        ndvi: (data.ndvi as string) || undefined,
        photoBase64: (data.photoBase64 as string) || undefined,
        remarks: (data.remarks as string) || undefined,
        synced: false,
      };

      // 2. Add or update
      if (editSubmission) {
        // Update mode
        await updateSubmission(editSubmission.id, base);
      } else {
        // Add mode
        await addSubmission(base);
      }

      // 3. Reset form and edit state
      setEditSubmission(null);
      setFormPhotoBase64('');
    },
    [editSubmission, geo, profile, addSubmission, updateSubmission],
  );

  // ── Edit handler (from MyData / LegacyMap) ──────────────────────────
  const handleEdit = useCallback((submissionOrId: Submission | string) => {
    if (typeof submissionOrId === 'string') {
      const found = submissions.find((s) => s.id === submissionOrId);
      if (found) {
        setEditSubmission(found);
        setActiveTab('form');
      }
    } else {
      setEditSubmission(submissionOrId);
      setActiveTab('form');
    }
  }, [submissions]);

  // ── Delete handler (from MyData) ─────────────────────────────────────
  const handleDelete = useCallback(
    (id: string) => {
      deleteSubmission(id);
    },
    [deleteSubmission],
  );

  // ── Sync handlers (from MyData) ─────────────────────────────────────
  const handleSyncOne = useCallback(
    async (_submission: Submission) => {
      // Individual sync is handled by syncAll; this is a no-op placeholder
      // since the useSubmissions hook auto-syncs on addSubmission.
    },
    [],
  );

  const handleSyncAll = useCallback(async () => {
    await syncAll();
  }, [syncAll]);

  // ── Form reset handler ──────────────────────────────────────────────
  const handleFormReset = useCallback(() => {
    setEditSubmission(null);
    setFormPhotoBase64('');
  }, []);

  // ── Photo change from SubmissionForm ────────────────────────────────
  const handlePhotoChange = useCallback((base64: string) => {
    setFormPhotoBase64(base64);
  }, []);

  // ── Profile save handler ────────────────────────────────────────────
  const handleProfileSave = useCallback(
    (updated: Profile) => {
      saveProfile(updated);
    },
    [saveProfile],
  );

  // ── Welcome guide close ─────────────────────────────────────────────
  const handleGuideClose = useCallback(() => {
    setShowWelcomeGuide(false);
  }, []);

  // ── Determine which tab content to render ────────────────────────────
  const renderTabContent = () => {
    switch (activeTab) {
      case 'form':
        return (
          <SubmissionForm
            editData={editSubmission}
            initialGeoString={geo.geoString || undefined}
            geoString={geo.geoString}
            address={geo.address}
            adminMatch={{
              region: geo.adminMatch.region,
              district: geo.adminMatch.district,
              upazila: geo.adminMatch.upazila,
            }}
            loading={geo.loading}
            geoFencePoints={fence.points}
            geoFenceAreaSqm={fence.areaSqm}
            isGeoFenceWalking={fence.isWalking}
            ndviValue={undefined}
            profile={profile}
            onSubmit={handleFormSubmit}
            onFetchGPS={() => geo.fetchGPS()}
            onToggleMap={() => setShowGeoManualPanel((v) => !v)}
            onToggleGeoFenceWalk={fence.toggleWalk}
            onClearGeoFence={fence.clearFence}
            onReset={handleFormReset}
            onPhotoChange={handlePhotoChange}
          />
        );

      case 'dashboard':
        return (
          <Dashboard
            submissions={submissions}
            nationalEntries={nationalEntries}
            onRefreshNational={loadNationalEntries}
          />
        );

      case 'map':
        return (
          <LegacyMap
            submissions={submissions}
            nationalEntries={nationalEntries}
            onEdit={(id) => handleEdit(id)}
            onRefreshNational={loadNationalEntries}
            userMobile={profile.mobile}
          />
        );

      case 'myData':
        return (
          <MyData
            submissions={submissions}
            onEdit={(s) => handleEdit(s)}
            onDelete={handleDelete}
            onSync={handleSyncOne}
            onSyncAll={handleSyncAll}
            profile={profile}
          />
        );

      case 'profile':
        return showAdmin ? (
          <AdminPanel
            submissions={submissions}
            nationalEntries={nationalEntries}
          />
        ) : (
          <div className="flex flex-col gap-4">
            <div className="flex justify-end">
              <button
                type="button"
                onClick={() => setShowAdmin(true)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-gray-100 text-gray-600 hover:bg-gray-200 active:scale-95 transition-all cursor-pointer"
              >
                🔒 অ্যাডমিন প্যানেল
              </button>
            </div>
            <ProfilePanel profile={profile} onSave={handleProfileSave} />
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-[#FCF9F8]">
      {/* ── Background service components ──────────────────────────── */}
      <NetworkStatus onStateChange={setNetworkState} />
      <GeolocationIndicator onStateChange={setGeoState} />
      <OfflinePlantationDashboard onStateChange={setBgSubmissions} />
      <MobileControlCenter
        networkState={networkState}
        geoState={geoState}
        submissions={bgSubmissions}
      />
      <WelcomeModal />
      <PWAInstaller />
      <SyncToast />

      {/* ── Welcome Guide (first-launch overlay) ───────────────────── */}
      {showWelcomeGuide && <WelcomeGuide open={showWelcomeGuide} onClose={handleGuideClose} />}

      {/* ── App Header ─────────────────────────────────────────────── */}
      <AppHeader isOnline={isOnline} geoStatus={geoStatusLabel} />

      {/* ── Main content area (scrollable, padded for tab bar) ────── */}
      <main className="flex-1 overflow-y-auto pb-20 md:pb-4">
        <div className="max-w-4xl mx-auto px-3 sm:px-4 py-3 sm:py-4">
          {renderTabContent()}
        </div>
      </main>

      {/* ── Tab Navigation ─────────────────────────────────────────── */}
      <AppTabs
        activeTab={activeTab}
        onTabChange={handleTabChange}
        unsyncedCount={unsyncedCount}
      />

      {/* ── App Footer (desktop only, above tabs on md+) ──────────── */}
      <div className="hidden md:block">
        <AppFooter />
      </div>

      {/* ── Satellite/NDVI map overlay button ──────────────────────── */}
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

      {/* ── Satellite/NDVI Map full-screen overlay ─────────────────── */}
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
            <Suspense
              fallback={
                <div className="w-full h-full flex items-center justify-center text-emerald-700">
                  <Loader2 size={28} className="animate-spin" />
                </div>
              }
            >
              <MapTab geoState={geoState} onMapReady={(fn) => { invalidateMapRef.current = fn; }} />
            </Suspense>
          </div>
        </div>
      )}
    </div>
  );
}

import { useState, useMemo, useEffect, useRef } from 'react';
import { MapContainer, TileLayer, Marker, Popup, LayersControl, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { Filter, TreePine, Edit, RefreshCw, Crosshair } from 'lucide-react';
import { countSeedlings } from '../../../types/plantation';
import { toBnNum, isValidBdCoord, upazilaColor } from '../../../utils/geoUtils';
import { BD, BD_UPAZILA } from '../../../data/adminData';
import { getLayerTiles, BD_CENTER } from '../../../utils/mapHelper';
import type { Submission } from '../../OfflinePlantationDashboard';

// ---------------------------------------------------------------------------
// Fix Leaflet default marker icon (broken by Vite bundling)
// ---------------------------------------------------------------------------
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface LegacyMapProps {
  submissions: Submission[];
  nationalEntries?: any[];
  onEdit?: (id: string) => void;
  onRefreshNational?: () => void;
  userMobile?: string;
}

interface ParsedEntry {
  id: string;
  lat: number;
  lng: number;
  farmerName?: string;
  farmerMobile?: string;
  officerName?: string;
  officerMobile?: string;
  district?: string;
  upazila?: string;
  village?: string;
  region?: string;
  submittedAt?: string;
  seedlingCounts: { fruit: number; forest: number; medicinal: number };
  totalSeedlings: number;
  isOwn?: boolean;
  isLocal?: boolean;
  synced?: boolean;
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function parseCoords(raw?: string): [number, number] | null {
  if (!raw) return null;
  const str = raw.toString().trim();
  if (!str.includes(',')) return null;
  const [latStr, lngStr] = str.split(',').map((v) => parseFloat(v));
  if (!isValidBdCoord(latStr, lngStr)) return null;
  return [latStr, lngStr];
}

function makeDivIcon(color: string): L.DivIcon {
  return L.divIcon({
    html: `<div style="background:${color};width:28px;height:28px;border-radius:50%;border:2.5px solid #fff;display:flex;align-items:center;justify-content:center;font-size:14px;box-shadow:0 2px 8px rgba(0,0,0,.35);cursor:pointer">🌳</div>`,
    className: '',
    iconSize: [28, 28],
    iconAnchor: [14, 14],
    popupAnchor: [0, -16],
  });
}

function makePulseIcon(): L.DivIcon {
  return L.divIcon({
    html: `<div style="position:relative;width:24px;height:24px"><div style="position:absolute;inset:0;background:#15803d;border-radius:50%;opacity:0.3;animation:pulse-ring 1.5s ease-out infinite"></div><div style="position:absolute;inset:6px;background:#15803d;border-radius:50%;border:2px solid #fff;box-shadow:0 2px 6px rgba(0,0,0,.3)"></div></div><style>@keyframes pulse-ring{0%{transform:scale(0.8);opacity:0.5}100%{transform:scale(2.2);opacity:0}}</style>`,
    className: '',
    iconSize: [24, 24],
    iconAnchor: [12, 12],
    popupAnchor: [0, -14],
  });
}

const DISTRICTS = Object.keys(BD_UPAZILA);

// ---------------------------------------------------------------------------
// Sub-component: fitBounds when markers change
// ---------------------------------------------------------------------------

function FitBounds({ entries }: { entries: ParsedEntry[] }) {
  const map = useMap();
  useEffect(() => {
    if (entries.length === 0) return;
    const bounds = L.latLngBounds(entries.map((e) => [e.lat, e.lng] as L.LatLngTuple));
    map.fitBounds(bounds, { padding: [40, 40], maxZoom: 14 });
  }, [entries, map]);
  return null;
}

// ---------------------------------------------------------------------------
// Sub-component: zoom to my location
// ---------------------------------------------------------------------------

function ZoomToMe({ userMobile }: { userMobile?: string }) {
  const map = useMap();
  const [myPos, setMyPos] = useState<L.LatLngTuple | null>(null);
  const [locating, setLocating] = useState(false);

  const handleZoom = () => {
    setLocating(true);
    navigator.geolocation?.getCurrentPosition(
      (pos) => {
        const coord: L.LatLngTuple = [pos.coords.latitude, pos.coords.longitude];
        setMyPos(coord);
        map.flyTo(coord, 16, { duration: 1.5 });
        setLocating(false);
      },
      () => setLocating(false),
      { enableHighAccuracy: true, timeout: 10000 },
    );
  };

  return (
    <>
      <button
        onClick={handleZoom}
        disabled={locating}
        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium shadow-lg bg-white/95 backdrop-blur text-gray-700 hover:bg-gray-100 transition-colors cursor-pointer disabled:opacity-50"
        title="আমার লোকেশনে যান"
      >
        <Crosshair size={14} className={locating ? 'animate-pulse' : ''} />
        আমার অবস্থান
      </button>
      {myPos && (
        <Marker position={myPos} icon={makePulseIcon()}>
          <Popup>
            <div className="text-xs text-center">
              <p className="font-semibold text-green-700">📍 আপনার অবস্থান</p>
              <p className="text-[10px] text-gray-500 mt-1">{myPos[0].toFixed(5)}, {myPos[1].toFixed(5)}</p>
            </div>
          </Popup>
        </Marker>
      )}
    </>
  );
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export default function LegacyMap({ submissions, nationalEntries = [], onEdit, onRefreshNational, userMobile }: LegacyMapProps) {
  // --- Filter state ---
  const [region, setRegion] = useState('');
  const [district, setDistrict] = useState('');
  const [upazila, setUpazila] = useState('');
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');
  const [showFilters, setShowFilters] = useState(false);

  // Derived upazila options
  const upazilaOptions = useMemo(() => {
    if (!district || !BD_UPAZILA[district]) return [];
    return BD_UPAZILA[district];
  }, [district]);

  // --- Parse local submissions ---
  const localEntries: ParsedEntry[] = useMemo(() => {
    return submissions
      .map((s) => {
        const coords = parseCoords(s.geoLocation || (s.latitude && s.longitude ? `${s.latitude},${s.longitude}` : undefined));
        if (!coords) return null;
        const counts = countSeedlings(s as any);
        const total = counts.fruit + counts.forest + counts.medicinal;
        return {
          id: s.id,
          lat: coords[0],
          lng: coords[1],
          farmerName: s.farmerName || s.nurseryName || undefined,
          farmerMobile: s.farmerMobile || s.mobile || undefined,
          officerName: s.officerName || s.caretakerName || undefined,
          officerMobile: s.officerMobile || s.caretakerMobile || undefined,
          district: s.district,
          upazila: s.upazila,
          village: s.village,
          region: s.region,
          submittedAt: s.submittedAt,
          seedlingCounts: counts,
          totalSeedlings: total,
          isOwn: userMobile ? (s.farmerMobile === userMobile || s.mobile === userMobile) : false,
          isLocal: true,
          synced: !!s.synced,
        };
      })
      .filter((e) => e !== null) as ParsedEntry[];
  }, [submissions, userMobile]);

  // --- Parse national entries (dedup by id/submissionId) ---
  const natEntries: ParsedEntry[] = useMemo(() => {
    const seenIds = new Set<string>();
    return (nationalEntries || [])
      .filter((s) => {
        const rid = s.id || s.submissionId || '';
        if (!rid || seenIds.has(rid)) return false;
        seenIds.add(rid);
        return true;
      })
      .map((s) => {
        const coords = parseCoords(s.geoLocation || s.coordinates);
        if (!coords) return null;
        return {
          id: s.id || s.submissionId || `nat-${coords[0]}-${coords[1]}`,
          lat: coords[0],
          lng: coords[1],
          farmerName: s.farmerName || s.nurseryName || undefined,
          farmerMobile: s.farmerMobile || s.mobile || undefined,
          officerName: s.officerName || s.saaoName || undefined,
          officerMobile: s.officerMobile || s.saaoMobile || undefined,
          district: s.district,
          upazila: s.upazila,
          village: s.village,
          region: s.region || s.division,
          submittedAt: s.submittedAt,
          seedlingCounts: { fruit: 0, forest: 0, medicinal: 0 },
          totalSeedlings: 0,
          isOwn: false,
          isLocal: false,
          synced: true, // national entries are assumed synced
        };
      })
      .filter((e) => e !== null) as ParsedEntry[];
  }, [nationalEntries]);

  // --- Apply filters ---
  const filtered = useMemo(() => {
    return [...localEntries, ...natEntries].filter((e) => {
      if (district && e.district !== district) return false;
      if (upazila && e.upazila !== upazila) return false;
      if (region && e.region !== region) return false;
      if (dateFrom && e.submittedAt && e.submittedAt < dateFrom) return false;
      if (dateTo && e.submittedAt && e.submittedAt > dateTo) return false;
      return true;
    });
  }, [localEntries, natEntries, district, upazila, region, dateFrom, dateTo]);

  // --- Stats ---
  const totalTrees = useMemo(
    () => filtered.reduce((sum, e) => sum + e.totalSeedlings, 0),
    [filtered],
  );

  // --- Upazila color legend ---
  const upazilaLegend = useMemo(() => {
    const seen = new Map<string, string>();
    filtered.forEach((e) => {
      if (e.upazila && !seen.has(e.upazila)) {
        seen.set(e.upazila, upazilaColor(e.upazila));
      }
    });
    return Array.from(seen.entries()).sort((a, b) => a[0].localeCompare(b[0], 'bn'));
  }, [filtered]);

  // --- Tile layers ---
  const osmTiles = getLayerTiles('osm');
  const satTiles = getLayerTiles('satellite');

  // --- Icon cache ---
  const iconCache = useRef(new Map<string, L.DivIcon>());
  const getIcon = (name: string) => {
    if (!iconCache.current.has(name)) {
      iconCache.current.set(name, makeDivIcon(upazilaColor(name)));
    }
    return iconCache.current.get(name)!;
  };

  const grayIcon = useMemo(() => makeDivIcon('#9ca3af'), []);
  const ownIcon = useMemo(() => makeDivIcon('#a855f7'), []);

  // #13: EVI tile URL (NASA GIBS MODIS EVI)
  const eviTiles = useMemo(() => ({
    url: 'https://gibs.earthdata.nasa.gov/wmts/epsg3857/best/MODIS_Combined_EVI_8Day/default/{time}/{TileMatrixSet}/{z}/{y}/{x}.jpg',
    attribution: 'NASA GIBS MODIS EVI',
    maxZoom: 9,
  }), []);

  // Compute EVI time string (most recent 8-day period)
  const eviTime = useMemo(() => {
    const now = new Date();
    const dayOfYear = Math.floor((now.getTime() - new Date(now.getFullYear(), 0, 0).getTime()) / 86400000);
    const period = Math.floor(dayOfYear / 8) * 8;
    const jan1 = new Date(now.getFullYear(), 0, 0);
    const eviDate = new Date(jan1.getTime() + period * 86400000);
    return eviDate.toISOString().slice(0, 10).replace(/-/g, '');
  }, []);

  return (
    <div className="relative w-full h-full">
      {/* ---------- Filter bar ---------- */}
      <div className="absolute top-2 left-2 right-2 sm:left-3 sm:right-3 z-[1000]">
        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={() => setShowFilters((v) => !v)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium shadow-lg transition-colors cursor-pointer ${showFilters ? 'bg-emerald-700 text-white' : 'bg-white/95 backdrop-blur text-gray-700 hover:bg-gray-100'}`}
          >
            <Filter size={14} />
            ফিল্টার
          </button>

          {/* #14: Refresh national data button */}
          {onRefreshNational && (
            <button
              onClick={onRefreshNational}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium shadow-lg bg-white/95 backdrop-blur text-gray-700 hover:bg-blue-50 transition-colors cursor-pointer"
            >
              <RefreshCw size={14} />
              জাতীয় ডাটা রিফ্রেশ
            </button>
          )}

          <div className="bg-white/95 backdrop-blur rounded-lg shadow-lg px-3 py-1.5 text-xs text-gray-700">
            <TreePine size={14} className="inline-block mr-1 text-emerald-700" />
            {toBnNum(filtered.length)} টি পয়েন্ট
            {totalTrees > 0 && (
              <span className="text-gray-400 ml-1">({toBnNum(totalTrees)} চারা)</span>
            )}
          </div>
        </div>

        {showFilters && (
          <div className="mt-2 bg-white/95 backdrop-blur rounded-xl shadow-lg p-3 space-y-2">
            <div className="grid grid-cols-2 gap-2">
              {/* District */}
              <select
                value={district}
                onChange={(e) => { setDistrict(e.target.value); setUpazila(''); }}
                className="w-full px-2 py-1.5 border border-gray-200 rounded-lg text-xs bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              >
                <option value="">সকল জেলা</option>
                {DISTRICTS.map((d) => (
                  <option key={d} value={d}>{d}</option>
                ))}
              </select>

              {/* Upazila */}
              <select
                value={upazila}
                onChange={(e) => setUpazila(e.target.value)}
                className="w-full px-2 py-1.5 border border-gray-200 rounded-lg text-xs bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              >
                <option value="">সকল উপজেলা</option>
                {upazilaOptions.map((u) => (
                  <option key={u} value={u}>{u}</option>
                ))}
              </select>

              {/* Region */}
              <select
                value={region}
                onChange={(e) => setRegion(e.target.value)}
                className="w-full px-2 py-1.5 border border-gray-200 rounded-lg text-xs bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              >
                <option value="">সকল অঞ্চল</option>
                {Array.from(new Set(localEntries.map((e) => e.region).filter(Boolean))).map((r) => (
                  <option key={r} value={r}>{r}</option>
                ))}
              </select>

              {/* Date range */}
              <div className="flex items-center gap-1">
                <input
                  type="date"
                  value={dateFrom}
                  onChange={(e) => setDateFrom(e.target.value)}
                  className="flex-1 px-2 py-1.5 border border-gray-200 rounded-lg text-xs bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  placeholder="থেকে"
                />
                <input
                  type="date"
                  value={dateTo}
                  onChange={(e) => setDateTo(e.target.value)}
                  className="flex-1 px-2 py-1.5 border border-gray-200 rounded-lg text-xs bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  placeholder="পর্যন্ত"
                />
              </div>
            </div>

            <button
              onClick={() => { setDistrict(''); setUpazila(''); setRegion(''); setDateFrom(''); setDateTo(''); }}
              className="w-full py-1.5 text-xs text-emerald-700 font-medium hover:bg-emerald-50 rounded-lg transition-colors cursor-pointer"
            >
              ফিল্টার মুছুন
            </button>
          </div>
        )}
      </div>

      {/* ---------- Upazila color legend ---------- */}
      {upazilaLegend.length > 0 && upazilaLegend.length <= 12 && (
        <div className="absolute bottom-3 left-2 sm:left-3 z-[1000] bg-white/95 backdrop-blur rounded-xl shadow-lg p-2.5 max-w-44">
          <h4 className="text-[10px] font-bold text-gray-600 mb-1.5">উপজেলা রঙ</h4>
          <div className="space-y-1">
            {upazilaLegend.map(([name, color]) => (
              <div key={name} className="flex items-center gap-1.5 text-[10px]">
                <span className="w-3 h-3 rounded-full shrink-0 border border-white shadow-sm" style={{ background: color }} />
                <span className="text-gray-700 truncate">{name}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ---------- Map ---------- */}
      <MapContainer
        center={BD_CENTER}
        zoom={7}
        className="w-full h-full"
        zoomControl={false}
        style={{ background: '#e5e7eb' }}
      >
        <LayersControl position="topright">
          <LayersControl.BaseLayer checked name="🗺️ OSM">
            <TileLayer url={osmTiles.url} attribution={osmTiles.attribution} maxZoom={osmTiles.maxZoom} />
          </LayersControl.BaseLayer>
          <LayersControl.BaseLayer name="🛰️ স্যাটেলাইট">
            <TileLayer url={satTiles.url} attribution={satTiles.attribution} maxZoom={satTiles.maxZoom} />
          </LayersControl.BaseLayer>
          {/* #21: EVI tile layer */}
          <LayersControl.BaseLayer name="🌿 EVI (NASA)">
            <TileLayer
              url={eviTiles.url.replace('{time}', eviTime)}
              attribution={eviTiles.attribution}
              maxZoom={eviTiles.maxZoom}
            />
          </LayersControl.BaseLayer>
        </LayersControl>

        {/* #13: Zoom to my location */}
        <ZoomToMe userMobile={userMobile} />

        {filtered.map((entry) => {
          // #15: Gray marker for local/unsynced
          // #16: Purple marker for own entries
          let icon: L.DivIcon;
          if (entry.isOwn) {
            icon = ownIcon;
          } else if (entry.isLocal && !entry.synced) {
            icon = grayIcon;
          } else {
            icon = getIcon(entry.upazila || 'unknown');
          }

          // #20: Sync status text
          const syncStatusText = entry.isLocal
            ? (entry.synced ? '✅ App_Entry' : '📡 App_Entry')
            : null;

          return (
            <Marker
              key={entry.id}
              position={[entry.lat, entry.lng]}
              icon={icon}
            >
              <Popup>
                <div className="text-xs min-w-[200px] space-y-1.5">
                  <div className="font-bold text-emerald-800 flex items-center gap-1">
                    <TreePine size={13} />
                    {entry.farmerName || entry.village || entry.upazila || 'অজানা'}
                  </div>

                  {entry.isOwn && (
                    <span className="inline-block bg-blue-100 text-blue-700 text-[9px] font-medium px-1.5 py-0.5 rounded-full">আমার</span>
                  )}

                  <div className="text-[11px] text-gray-600 space-y-0.5">
                    {entry.district && <div><b>জেলা:</b> {entry.district}</div>}
                    {entry.upazila && <div><b>উপজেলা:</b> {entry.upazila}</div>}
                    {entry.village && <div><b>গ্রাম:</b> {entry.village}</div>}
                  </div>

                  {entry.totalSeedlings > 0 && (
                    <div className="text-[11px] text-gray-700">
                      <b>ফলদ:</b> {toBnNum(entry.seedlingCounts.fruit)} ·
                      <b className="ml-1">বনজ:</b> {toBnNum(entry.seedlingCounts.forest)} ·
                      <b className="ml-1">ঔষধি:</b> {toBnNum(entry.seedlingCounts.medicinal)}
                      <div className="mt-0.5 text-gray-500">মোট: {toBnNum(entry.totalSeedlings)} চারা</div>
                    </div>
                  )}

                  {/* #18: Monitoring officer info */}
                  {(entry.officerName || entry.officerMobile) && (
                    <div className="text-[11px] text-gray-600 border-t border-gray-100 pt-1 mt-1">
                      <div><b>মনিটরিং অফিসার:</b> {entry.officerName || '—'}</div>
                      {entry.officerMobile && (
                        <div>
                          <b>মোবাইল:</b>{' '}
                          <a href={`tel:${entry.officerMobile}`} className="text-blue-600 underline hover:text-blue-800">
                            {entry.officerMobile}
                          </a>
                        </div>
                      )}
                    </div>
                  )}

                  {/* #17: Clickable tel: links for mobile numbers */}
                  {entry.farmerMobile && (
                    <div className="text-[11px] text-gray-600">
                      <b>কৃষক:</b>{' '}
                      <a href={`tel:${entry.farmerMobile}`} className="text-blue-600 underline hover:text-blue-800">
                        {entry.farmerMobile}
                      </a>
                    </div>
                  )}

                  {/* #20: Sync status text */}
                  {syncStatusText && (
                    <div className="text-[10px] text-gray-400 mt-1">{syncStatusText}</div>
                  )}

                  {entry.submittedAt && (
                    <div className="text-[10px] text-gray-400">
                      📅 {new Date(entry.submittedAt).toLocaleDateString('bn-BD')}
                    </div>
                  )}

                  {onEdit && entry.isLocal && (
                    <button
                      onClick={() => onEdit(entry.id)}
                      className="mt-1.5 w-full flex items-center justify-center gap-1 bg-emerald-600 hover:bg-emerald-700 text-white text-[10px] font-semibold py-1.5 rounded-lg transition-colors cursor-pointer"
                    >
                      <Edit size={12} />
                      সম্পাদনা করুন
                    </button>
                  )}
                </div>
              </Popup>
            </Marker>
          );
        })}

        <FitBounds entries={filtered} />
      </MapContainer>
    </div>
  );
}

import { useState, useMemo, useEffect, useRef } from 'react';
import { MapContainer, TileLayer, Marker, Popup, LayersControl, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { Filter, TreePine, Edit } from 'lucide-react';
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
  userMobile?: string;
}

interface ParsedEntry {
  id: string;
  lat: number;
  lng: number;
  farmerName?: string;
  district?: string;
  upazila?: string;
  village?: string;
  region?: string;
  submittedAt?: string;
  seedlingCounts: { fruit: number; forest: number; medicinal: number };
  totalSeedlings: number;
  isOwn?: boolean;
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
// Component
// ---------------------------------------------------------------------------

export default function LegacyMap({ submissions, nationalEntries = [], onEdit, userMobile }: LegacyMapProps) {
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
          district: s.district,
          upazila: s.upazila,
          village: s.village,
          region: s.region,
          submittedAt: s.submittedAt,
          seedlingCounts: counts,
          totalSeedlings: total,
          isOwn: userMobile ? (s.farmerMobile === userMobile || s.mobile === userMobile) : false,
        };
      })
      .filter((e) => e !== null) as ParsedEntry[];
  }, [submissions, userMobile]);

  // --- Parse national entries ---
  const natEntries: ParsedEntry[] = useMemo(() => {
    return nationalEntries
      .map((s) => {
        const coords = parseCoords(s.geoLocation || s.coordinates);
        if (!coords) return null;
        return {
          id: s.id || s.submissionId || `nat-${coords[0]}-${coords[1]}`,
          lat: coords[0],
          lng: coords[1],
          farmerName: s.farmerName || s.nurseryName || undefined,
          district: s.district,
          upazila: s.upazila,
          village: s.village,
          region: s.region || s.division,
          submittedAt: s.submittedAt,
          seedlingCounts: { fruit: 0, forest: 0, medicinal: 0 },
          totalSeedlings: 0,
          isOwn: false,
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

  return (
    <div className="relative w-full h-full">
      {/* ---------- Filter bar ---------- */}
      <div className="absolute top-2 left-2 right-2 sm:left-3 sm:right-3 z-[1000]">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowFilters((v) => !v)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium shadow-lg transition-colors cursor-pointer ${showFilters ? 'bg-emerald-700 text-white' : 'bg-white/95 backdrop-blur text-gray-700 hover:bg-gray-100'}`}
          >
            <Filter size={14} />
            ফিল্টার
          </button>

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
                {/* Unique regions from BD_UPAZILA keys or submissions */}
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
        </LayersControl>

        {filtered.map((entry) => (
          <Marker
            key={entry.id}
            position={[entry.lat, entry.lng]}
            icon={getIcon(entry.upazila || 'unknown')}
          >
            <Popup>
              <div className="text-xs min-w-[180px] space-y-1.5">
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

                {entry.submittedAt && (
                  <div className="text-[10px] text-gray-400">
                    📅 {new Date(entry.submittedAt).toLocaleDateString('bn-BD')}
                  </div>
                )}

                {onEdit && (
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
        ))}

        <FitBounds entries={filtered} />
      </MapContainer>
    </div>
  );
}

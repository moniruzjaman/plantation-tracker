import { useState, useCallback, useEffect, useRef, type RefObject } from 'react';
import { MapContainer, TileLayer, CircleMarker, Marker, Popup, Tooltip, useMapEvents } from 'react-leaflet';
import L from 'leaflet';
import type { LatLngBounds, LatLngTuple, Map as LeafletMap } from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { Plus, Minus, Loader2, AlertTriangle, BarChart3, RefreshCw, Trees, Cloud, CheckCircle2 } from 'lucide-react';
import type { JSX } from 'react';
import type { GeoState } from '../GeolocationIndicator';
import { type LayerId, getLayerTiles, NDVI_BANDS, isValidBdCoord, BD_CENTER, BD_ZOOM, toBnNum } from '../../utils/mapHelper';
import { useMapData } from '../../utils/useMapData';
import { countSeedlings } from '../../types/plantation';

// Leaflet default marker icon paths break with Vite bundling — point at the CDN instead.
delete (L.Icon.Default.prototype as unknown as { _getIconUrl?: unknown })._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

const appscriptIcon = L.divIcon({
  html: '<div style="background:#2563eb;width:22px;height:22px;border-radius:50%;border:2px solid #fff;display:flex;align-items:center;justify-content:center;color:#fff;font-size:11px;box-shadow:0 2px 6px rgba(0,0,0,.3)">🌳</div>',
  className: 'appscript-tree-icon',
  iconSize: [22, 22],
  iconAnchor: [11, 11],
});

const LAYER_LABELS: Record<LayerId, string> = {
  osm: '🗺️ মানচিত্র',
  satellite: '🛰️ স্যাটেলাইট',
  ndvi: '🌿 NDVI',
  evi: '🍃 EVI',
};

function LayerSwitcher({ active, onChange }: { active: LayerId; onChange: (l: LayerId) => void }) {
  return (
    <div className="absolute top-2 left-2 sm:top-3 sm:left-3 z-[1000] flex gap-1 sm:gap-1.5 bg-white/95 backdrop-blur rounded-full p-1 shadow-lg">
      {(Object.keys(LAYER_LABELS) as LayerId[]).map((id) => (
        <button
          key={id}
          onClick={() => onChange(id)}
          className={`px-2 sm:px-3 py-1 sm:py-1.5 rounded-full text-[10px] sm:text-xs font-medium transition-colors whitespace-nowrap cursor-pointer ${
            active === id ? 'bg-emerald-700 text-white border border-emerald-800' : 'text-gray-600 hover:bg-gray-100'
          }`}
        >
          {LAYER_LABELS[id]}
        </button>
      ))}
    </div>
  );
}

function NDVILegend({ visible }: { visible: boolean }) {
  const [open, setOpen] = useState(true);
  if (!visible) return null;
  return (
    <div className="absolute bottom-14 left-2 sm:left-3 z-[1000]">
      {open ? (
        <div className="bg-white/95 backdrop-blur rounded-lg shadow-lg p-2 sm:p-2.5 w-36 sm:w-40">
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-[9px] sm:text-[10px] font-bold text-gray-600">NDVI মান</span>
            <button onClick={() => setOpen(false)} className="text-gray-400 text-[10px] cursor-pointer">✕</button>
          </div>
          {NDVI_BANDS.map((b) => (
            <div key={b.label} className="flex items-center gap-1.5 text-[9px] sm:text-[10px] py-0.5">
              <span className="w-2.5 h-2.5 rounded-sm shrink-0" style={{ background: b.color }} />
              <span className="text-gray-600 flex-1">{b.label}</span>
              <span className="text-gray-400">{b.range}</span>
            </div>
          ))}
        </div>
      ) : (
        <button onClick={() => setOpen(true)} className="w-8 h-8 sm:w-9 sm:h-9 bg-white/95 rounded-full shadow-lg flex items-center justify-center cursor-pointer">
          <BarChart3 size={14} className="text-gray-600 sm:w-4 sm:h-4" />
        </button>
      )}
    </div>
  );
}

function CustomZoomControl({ mapRef }: { mapRef: RefObject<LeafletMap | null> }) {
  return (
    <div className="absolute top-2 right-2 sm:top-3 sm:right-3 z-[1000] flex flex-col gap-1">
      <button
        onClick={() => mapRef.current?.zoomIn()}
        className="w-8 h-8 sm:w-9 sm:h-9 bg-white/95 backdrop-blur rounded-lg shadow-lg flex items-center justify-center text-gray-700 hover:bg-gray-100 transition active:scale-95 cursor-pointer"
        title="জুম ইন"
      >
        <Plus size={16} />
      </button>
      <button
        onClick={() => mapRef.current?.zoomOut()}
        className="w-8 h-8 sm:w-9 sm:h-9 bg-white/95 backdrop-blur rounded-lg shadow-lg flex items-center justify-center text-gray-700 hover:bg-gray-100 transition active:scale-95 cursor-pointer"
        title="জুম আউট"
      >
        <Minus size={16} />
      </button>
    </div>
  );
}

type PipelineState = 'idle' | 'running' | 'success' | 'error';

interface PipelineResult {
  ndvi_mean: number;
  evi_mean?: number;
  healthy_pct: number;
  stress_pct: number;
  bare_pct: number;
  area_ha: number;
  source?: string;
  ai_analysis?: string;
}

function CloudPipelineButton({ state, onRun }: { state: PipelineState; onRun: () => void }) {
  const config: Record<PipelineState, { icon: JSX.Element; ring: string; bg: string }> = {
    idle: { icon: <Cloud size={18} />, ring: '', bg: 'bg-slate-600' },
    running: { icon: <RefreshCw size={18} className="animate-spin" />, ring: 'ring-4 ring-amber-300/60 animate-pulse', bg: 'bg-amber-500' },
    success: { icon: <CheckCircle2 size={18} />, ring: '', bg: 'bg-emerald-600' },
    error: { icon: <AlertTriangle size={18} />, ring: '', bg: 'bg-red-500' },
  };
  const c = config[state];
  return (
    <button
      onClick={onRun}
      disabled={state === 'running'}
      className={`w-10 h-10 sm:w-11 sm:h-11 rounded-full text-white flex items-center justify-center shadow-lg transition-all cursor-pointer ${c.bg} ${c.ring}`}
      title="স্যাটেলাইট বিশ্লেষণ চালান"
    >
      {c.icon}
    </button>
  );
}

function ResultOverlay({ result, onClose }: { result: PipelineResult; onClose: () => void }) {
  const isDemo = !result.source || result.source === 'demo_estimate';
  const colorFor = (v: number, goodHigh = true) => {
    const good = goodHigh ? v >= 60 : v <= 15;
    const warn = goodHigh ? v >= 35 : v <= 30;
    return good ? 'text-emerald-600' : warn ? 'text-amber-600' : 'text-red-600';
  };
  return (
    <div className="absolute top-10 sm:top-12 right-2 sm:right-3 z-[1000] w-48 sm:w-56 bg-white/95 backdrop-blur rounded-xl shadow-xl p-2.5 sm:p-3 space-y-1.5">
      <div className="flex items-center justify-between">
        <h4 className="text-[10px] sm:text-xs font-bold text-gray-700">বিশ্লেষণ ফলাফল</h4>
        <button onClick={onClose} className="text-gray-400 text-xs cursor-pointer">✕</button>
      </div>
      {isDemo && (
        <p className="text-[9px] sm:text-[10px] bg-amber-50 text-amber-700 rounded px-1.5 py-1">
          ⚠️ ডেমো ডেটা — প্রকৃত স্যাটেলাইট বিশ্লেষণ নয়। বাস্তব তথ্যের জন্য একটি ফ্রি Copernicus Data Space বা Earth Engine অ্যাকাউন্ট লাগবে।
        </p>
      )}
      <div className="text-[10px] sm:text-xs space-y-1">
        <div className="flex justify-between"><span className="text-gray-500">গড় NDVI</span><span className="font-semibold">{result.ndvi_mean.toFixed(2)}</span></div>
        <div className="flex justify-between"><span className="text-gray-500">সুস্থ%</span><span className={`font-semibold ${colorFor(result.healthy_pct, true)}`}>{result.healthy_pct}%</span></div>
        <div className="flex justify-between"><span className="text-gray-500">চাপগ্রস্ত%</span><span className={`font-semibold ${colorFor(result.stress_pct, false)}`}>{result.stress_pct}%</span></div>
        <div className="flex justify-between"><span className="text-gray-500">নগ্ন%</span><span className="font-semibold text-gray-700">{result.bare_pct}%</span></div>
        <div className="flex justify-between"><span className="text-gray-500">মোট হেক্টর</span><span className="font-semibold">{result.area_ha} ha</span></div>
      </div>
    </div>
  );
}

function BoundsTracker({ onBoundsChange }: { onBoundsChange: (b: LatLngBounds) => void }) {
  const map = useMapEvents({ moveend: () => onBoundsChange(map.getBounds()) });
  return null;
}

function TileStatusIndicator({ loading, error }: { loading: boolean; error: boolean }) {
  if (!loading && !error) return null;
  return (
    <div className="absolute bottom-14 right-2 sm:right-3 z-[1000]">
      {loading && (
        <div className="flex items-center gap-1.5 bg-white/95 backdrop-blur rounded-full shadow-lg px-3 py-1.5 text-[10px] text-gray-600">
          <Loader2 size={12} className="animate-spin" /> টাইল লোড হচ্ছে...
        </div>
      )}
      {error && (
        <div className="flex items-center gap-1.5 bg-red-50/95 backdrop-blur rounded-full shadow-lg px-3 py-1.5 text-[10px] text-red-700">
          <AlertTriangle size={12} /> টাইল লোড ব্যর্থ
        </div>
      )}
    </div>
  );
}

function useTileStatus(mapRef: RefObject<LeafletMap | null>) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const clearTimeoutRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;
    const onLoading = () => { if (clearTimeoutRef.current) clearTimeout(clearTimeoutRef.current); setError(false); setLoading(true); };
    const onLoad = () => { setLoading(false); setError(false); };
    const onTileError = () => { setLoading(false); setError(true); clearTimeoutRef.current = setTimeout(() => setError(false), 5000); };
    map.on('tileloadstart', onLoading);
    map.on('tileload', onLoad);
    map.on('load', onLoad);
    map.on('tileerror', onTileError);
    return () => {
      map.off('tileloadstart', onLoading);
      map.off('tileload', onLoad);
      map.off('load', onLoad);
      map.off('tileerror', onTileError);
      if (clearTimeoutRef.current) clearTimeout(clearTimeoutRef.current);
    };
  }, [mapRef]);

  return { loading, error };
}

/** Re-applies the correct view once real bounds are known. See PR #25/#26:
 *  invalidateSize() alone does not fix a projection that was cached while the
 *  container was hidden/zero-sized — the view must be explicitly re-applied. */
function FitBoundsOnData({ points }: { points: LatLngTuple[] }) {
  const map = useMapEvents({});
  const appliedRef = useRef(false);
  useEffect(() => {
    if (points.length === 0) return;
    map.invalidateSize({ animate: false });
    if (points.length === 1) {
      map.setView(points[0], 14);
    } else {
      map.fitBounds(L.latLngBounds(points), { padding: [30, 30], maxZoom: 16 });
    }
    appliedRef.current = true;
  }, [points, map]);
  return null;
}

interface MapTabProps {
  geoState: GeoState | null;
  onMapReady?: (invalidate: () => void) => void;
}

export default function MapTab({ geoState, onMapReady }: MapTabProps) {
  // NDVI is the default active layer per MAP_TAB_CHANGES.md — field officers land
  // straight on vegetation-index view instead of a plain road map.
  const [activeLayer, setActiveLayer] = useState<LayerId>('ndvi');
  const mapRef = useRef<LeafletMap | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const { localSubmissions, nationalEntries, syncStatus, refresh } = useMapData();
  const [refreshing, setRefreshing] = useState(false);
  const [bounds, setBounds] = useState<LatLngBounds | null>(null);
  const [pipelineState, setPipelineState] = useState<PipelineState>('idle');
  const [result, setResult] = useState<PipelineResult | null>(null);

  const tiles = getLayerTiles(activeLayer);
  const satelliteTiles = getLayerTiles('satellite');
  const showSatelliteUnderlay = activeLayer === 'ndvi' || activeLayer === 'evi';
  const showLegend = activeLayer === 'ndvi' || activeLayer === 'evi';

  const { loading: tileLoading, error: tileError } = useTileStatus(mapRef);

  const handleMapReady = useCallback((map: LeafletMap) => {
    mapRef.current = map;
  }, []);

  // Register invalidateSize callback with parent App (called on tab switch)
  useEffect(() => {
    if (onMapReady) {
      onMapReady(() => mapRef.current?.invalidateSize({ animate: false }));
    }
  }, [onMapReady]);

  // Backup: auto-invalidate whenever the container's own size changes
  // (covers orientation change, and the case where the tab became visible
  // without the parent's rAF invalidate firing in time).
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const observer = new ResizeObserver(() => {
      if (mapRef.current && el.offsetParent !== null) {
        mapRef.current.invalidateSize({ animate: false });
      }
    });
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  // Cloud pipeline: hits VITE_GEE_PIPELINE_URL (a Google Earth Engine / Copernicus
  // Data Space / Sentinel Hub function) when configured. No such backend ships
  // with this repo, so — matching MAP_TAB_CHANGES.md's own documented design —
  // it falls back to a clearly-labeled demo estimate. This keeps the button
  // fully functional today; dropping a real free-tier endpoint URL into env
  // vars later (no code change needed) switches it to live satellite data.

  // Build the validated marker point list once per data change.
  const localPoints: { pos: LatLngTuple; sub: (typeof localSubmissions)[number] }[] = [];
  localSubmissions.forEach((s) => {
    const raw = (s.coordinates || s.geoLocation || '').toString();
    if (!raw.includes(',')) return;
    const [lat, lng] = raw.split(',').map((v) => parseFloat(v));
    if (!isValidBdCoord(lat, lng)) return;
    localPoints.push({ pos: [lat, lng], sub: s });
  });

  const nationalPoints: { pos: LatLngTuple; entry: (typeof nationalEntries)[number] }[] = [];
  nationalEntries.forEach((s) => {
    const raw = (s.geoLocation || s.coordinates || '').toString().trim();
    if (!raw.includes(',')) return;
    const [lat, lng] = raw.split(',').map((v) => parseFloat(v));
    if (!isValidBdCoord(lat, lng)) return;
    nationalPoints.push({ pos: [lat, lng], entry: s });
  });

  const allPoints: LatLngTuple[] = [...localPoints.map((p) => p.pos), ...nationalPoints.map((p) => p.pos)];

  const runPipeline = useCallback(async () => {
    setPipelineState('running');
    const timeout = setTimeout(() => setPipelineState((s) => (s === 'running' ? 'error' : s)), 8000);
    const pipelineUrl = import.meta.env.VITE_GEE_PIPELINE_URL as string | undefined;
    try {
      if (pipelineUrl) {
        const boundsPayload = bounds
          ? [[bounds.getSouth(), bounds.getWest()], [bounds.getNorth(), bounds.getEast()]]
          : null;
        const res = await fetch(pipelineUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            bounds: boundsPayload,
            date_from: new Date(Date.now() - 30 * 24 * 3600 * 1000).toISOString().split('T')[0],
            date_to: new Date().toISOString().split('T')[0],
            indices: ['NDVI', 'EVI', 'LSWI'],
          }),
        });
        if (!res.ok) throw new Error('Pipeline request failed');
        const data = (await res.json()) as PipelineResult;
        setResult(data);
      } else {
        // Demo mode: derive a plausible estimate from marker density within the
        // current viewport so the number isn't a static placeholder, while
        // staying clearly labeled as non-real via `source: 'demo_estimate'`.
        await new Promise((r) => setTimeout(r, 1500));
        const inView = bounds ? allPoints.filter(([lat, lng]) => bounds.contains([lat, lng])).length : allPoints.length;
        const density = Math.min(1, inView / 25);
        const ndvi_mean = 0.35 + density * 0.35;
        const healthy = Math.round(Math.max(0, (ndvi_mean - 0.3) / 0.4 * 100) * 10) / 10;
        const stress = Math.round(Math.max(0, Math.min(30, (0.3 - ndvi_mean) / 0.3 * 100)) * 10) / 10;
        const areaHa = bounds
          ? Math.round(bounds.getNorth() - bounds.getSouth()) * Math.round(bounds.getEast() - bounds.getWest()) * 11100 * 11100 / 10000
          : 0;
        setResult({
          ndvi_mean: Math.round(ndvi_mean * 1000) / 1000,
          healthy_pct: healthy,
          stress_pct: stress,
          bare_pct: Math.max(0, Math.round((100 - healthy - stress) * 10) / 10),
          area_ha: Math.round(Math.max(areaHa, 1)),
          source: 'demo_estimate',
        });
      }
      setPipelineState('success');
    } catch {
      setPipelineState('error');
    } finally {
      clearTimeout(timeout);
      setTimeout(() => setPipelineState('idle'), 8000);
    }
  }, [bounds, allPoints]);

  const handleRefresh = useCallback(() => {
    setRefreshing(true);
    refresh();
    setTimeout(() => setRefreshing(false), 1200);
  }, [refresh]);

  return (
    <div ref={containerRef} className="relative w-full h-full" style={{ minHeight: 0 }}>
      <MapContainer
        center={BD_CENTER}
        zoom={BD_ZOOM}
        className="w-full h-full"
        zoomControl={false}
        ref={handleMapReady}
        style={{ background: '#e5e7eb' }}
      >
        {showSatelliteUnderlay && (
          <TileLayer key="satellite-underlay" url={satelliteTiles.url} attribution={satelliteTiles.attribution} opacity={0.4} />
        )}
        <TileLayer key={activeLayer} url={tiles.url} attribution={tiles.attribution} maxZoom={tiles.maxZoom} />

        {/* This device's local submissions */}
        {localPoints.map(({ pos, sub }, i) => {
          const counts = countSeedlings(sub);
          const total = counts.fruit + counts.forest + counts.medicinal;
          return (
            <CircleMarker
              key={`local-${sub.id || sub.submissionId || i}`}
              center={pos}
              radius={6}
              pathOptions={{ color: '#047857', fillColor: '#10b981', fillOpacity: 0.8, weight: 2 }}
            >
              <Tooltip direction="top" offset={[0, -6]} opacity={1}>
                <div className="text-[10px] leading-tight">
                  <div className="font-bold">{sub.village || sub.upazila || 'স্থানীয় এন্ট্রি'}</div>
                  <div className="text-slate-600">{toBnNum(total)} টি চারা</div>
                </div>
              </Tooltip>
              <Popup>
                <div className="text-xs min-w-[180px]">
                  <div className="font-bold text-emerald-800 mb-1 flex items-center gap-1"><Trees size={12} /> {sub.village || 'স্থানীয় এন্ট্রি'}</div>
                  <div className="space-y-0.5 text-[11px] text-slate-700">
                    <div><b>উপজেলা/জেলা:</b> {sub.upazila}, {sub.district}</div>
                    <div><b>ফলদ:</b> {toBnNum(counts.fruit)} · <b>বনজ:</b> {toBnNum(counts.forest)} · <b>ঔষধি:</b> {toBnNum(counts.medicinal)}</div>
                  </div>
                </div>
              </Popup>
            </CircleMarker>
          );
        })}

        {/* AppScript (Google Sheet) national entries */}
        {nationalPoints.map(({ pos, entry }, i) => (
          <Marker key={`nat-${entry.id || entry.submissionId || i}`} position={pos} icon={appscriptIcon}>
            <Popup>
              <div className="text-xs min-w-[160px]">
                <div className="font-bold text-blue-700 mb-1">{entry.farmerName || entry.nurseryName || entry.village || 'অজানা'}</div>
                <div className="text-[11px] text-slate-700"><b>উপজেলা/জেলা:</b> {entry.upazila}, {entry.district}</div>
                <div className="text-[10px] text-blue-600 mt-1">📡 AppScript তথ্য</div>
              </div>
            </Popup>
          </Marker>
        ))}

        <FitBoundsOnData points={allPoints} />
        <BoundsTracker onBoundsChange={setBounds} />
      </MapContainer>

      <LayerSwitcher active={activeLayer} onChange={setActiveLayer} />
      <NDVILegend visible={showLegend} />
      <CustomZoomControl mapRef={mapRef} />
      <TileStatusIndicator loading={tileLoading} error={tileError} />

      {syncStatus && (
        <div className="absolute top-2 sm:top-3 left-1/2 -translate-x-1/2 z-[1000] max-w-[85%]">
          <div className="bg-white/95 backdrop-blur rounded-full shadow px-3 py-1 text-[9px] sm:text-[10px] text-gray-600 whitespace-nowrap overflow-hidden text-ellipsis">
            {syncStatus}
          </div>
        </div>
      )}

      {/* Satellite analysis (cloud pipeline) — bottom-left, next to the NDVI legend toggle */}
      <div className="absolute bottom-3 left-2 sm:bottom-4 sm:left-3 z-[1000]">
        <CloudPipelineButton state={pipelineState} onRun={runPipeline} />
      </div>

      {result && pipelineState !== 'running' && (
        <ResultOverlay result={result} onClose={() => setResult(null)} />
      )}

      <div className="absolute bottom-3 right-2 sm:bottom-4 sm:right-3 z-[1000]">
        <button
          onClick={handleRefresh}
          disabled={refreshing}
          className="w-10 h-10 sm:w-11 sm:h-11 rounded-full text-white flex items-center justify-center shadow-lg bg-emerald-700 hover:bg-emerald-800 transition disabled:opacity-70 cursor-pointer"
          title="রিফ্রেশ করুন"
        >
          <RefreshCw size={18} className={refreshing ? 'animate-spin' : ''} />
        </button>
      </div>
    </div>
  );
}

import { useState, useEffect, useCallback, useMemo } from 'react';
import { X, Plus, Trash2, TrendingUp, Loader2 } from 'lucide-react';
import {
  type GrowthReading,
  type HealthStatus,
  addGrowthReading,
  deleteGrowthReading,
  getReadingsForEntry,
} from '../../utils/growthDb';

const HEALTH_LABELS: Record<HealthStatus, { label: string; color: string }> = {
  healthy: { label: 'সুস্থ', color: '#16a34a' },
  stressed: { label: 'চাপগ্রস্ত', color: '#f59e0b' },
  diseased: { label: 'রোগাক্রান্ত', color: '#ea580c' },
  dead: { label: 'মৃত', color: '#dc2626' },
};

function Sparkline({ readings }: { readings: GrowthReading[] }) {
  const points = readings.filter((r) => r.ndvi != null);
  if (points.length < 2) return null;
  const w = 220;
  const h = 44;
  const values = points.map((p) => p.ndvi as number);
  const min = Math.min(...values, 0);
  const max = Math.max(...values, 1);
  const range = max - min || 1;
  const step = w / (points.length - 1);
  const coords = points.map((p, i) => {
    const x = i * step;
    const y = h - ((p.ndvi as number) - min) / range * h;
    return `${x.toFixed(1)},${y.toFixed(1)}`;
  });
  return (
    <svg width={w} height={h} className="mt-1">
      <polyline points={coords.join(' ')} fill="none" stroke="#16a34a" strokeWidth={2} />
      {points.map((p, i) => {
        const [x, y] = coords[i].split(',');
        return <circle key={i} cx={x} cy={y} r={2.5} fill="#16a34a" />;
      })}
    </svg>
  );
}

interface GrowthTrackerProps {
  entryId: string;
  entryLabel: string;
  officerName?: string;
  onClose: () => void;
}

export default function GrowthTracker({ entryId, entryLabel, officerName, onClose }: GrowthTrackerProps) {
  const [readings, setReadings] = useState<GrowthReading[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [ndvi, setNdvi] = useState('');
  const [heightCm, setHeightCm] = useState('');
  const [health, setHealth] = useState<HealthStatus>('healthy');
  const [note, setNote] = useState('');
  const [saving, setSaving] = useState(false);

  const load = useCallback(() => {
    setLoading(true);
    getReadingsForEntry(entryId)
      .then(setReadings)
      .finally(() => setLoading(false));
  }, [entryId]);

  useEffect(() => { load(); }, [load]);

  const latest = readings[readings.length - 1];

  const handleAdd = useCallback(async () => {
    setSaving(true);
    try {
      await addGrowthReading({
        entryId,
        readingDate: new Date().toISOString().slice(0, 10),
        ndvi: ndvi ? parseFloat(ndvi) : null,
        heightCm: heightCm ? parseFloat(heightCm) : null,
        healthStatus: health,
        note,
        recordedBy: officerName || '',
      });
      setNdvi(''); setHeightCm(''); setNote(''); setHealth('healthy');
      setShowForm(false);
      load();
    } finally {
      setSaving(false);
    }
  }, [entryId, ndvi, heightCm, health, note, officerName, load]);

  const handleDelete = useCallback(async (id?: number) => {
    if (id == null) return;
    await deleteGrowthReading(id);
    load();
  }, [load]);

  const heightTrend = useMemo(() => {
    const withHeight = readings.filter((r) => r.heightCm != null);
    if (withHeight.length < 2) return null;
    const first = withHeight[0].heightCm as number;
    const last = withHeight[withHeight.length - 1].heightCm as number;
    return last - first;
  }, [readings]);

  return (
    <div className="absolute inset-0 z-[1100] bg-black/40 flex items-end sm:items-center justify-center" onClick={onClose}>
      <div
        className="bg-white rounded-t-2xl sm:rounded-2xl shadow-2xl w-full sm:w-96 max-h-[85vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="sticky top-0 bg-white border-b px-4 py-3 flex items-center justify-between">
          <div>
            <h3 className="font-bold text-sm text-emerald-800 flex items-center gap-1.5">
              <TrendingUp size={16} /> বৃদ্ধি ট্র্যাকার
            </h3>
            <p className="text-[10px] text-gray-500 truncate max-w-[220px]">{entryLabel}</p>
          </div>
          <button onClick={onClose} className="w-7 h-7 flex items-center justify-center rounded-full hover:bg-gray-100 cursor-pointer">
            <X size={16} />
          </button>
        </div>

        <div className="p-4 space-y-3">
          {loading ? (
            <div className="flex justify-center py-6"><Loader2 className="animate-spin text-emerald-600" size={22} /></div>
          ) : readings.length === 0 ? (
            <p className="text-xs text-gray-500 text-center py-4">এখনো কোনো পর্যবেক্ষণ যোগ করা হয়নি।</p>
          ) : (
            <>
              {latest && (
                <div className="grid grid-cols-3 gap-2">
                  <div className="bg-emerald-50 rounded-lg p-2 text-center border border-emerald-100">
                    <div className="text-[9px] text-gray-500">সর্বশেষ NDVI</div>
                    <div className="text-sm font-bold text-emerald-700">{latest.ndvi ?? '—'}</div>
                  </div>
                  <div className="bg-blue-50 rounded-lg p-2 text-center border border-blue-100">
                    <div className="text-[9px] text-gray-500">উচ্চতা</div>
                    <div className="text-sm font-bold text-blue-700">{latest.heightCm ?? '—'} cm</div>
                    {heightTrend != null && (
                      <div className={`text-[8px] ${heightTrend >= 0 ? 'text-emerald-600' : 'text-red-500'}`}>
                        {heightTrend >= 0 ? '+' : ''}{heightTrend.toFixed(1)} cm
                      </div>
                    )}
                  </div>
                  <div className="rounded-lg p-2 text-center border" style={{ background: HEALTH_LABELS[latest.healthStatus].color + '15', borderColor: HEALTH_LABELS[latest.healthStatus].color + '40' }}>
                    <div className="text-[9px] text-gray-500">অবস্থা</div>
                    <div className="text-xs font-bold" style={{ color: HEALTH_LABELS[latest.healthStatus].color }}>
                      {HEALTH_LABELS[latest.healthStatus].label}
                    </div>
                  </div>
                </div>
              )}
              <Sparkline readings={readings} />

              <div className="space-y-1.5 max-h-40 overflow-y-auto">
                {[...readings].reverse().map((r) => (
                  <div key={r.id} className="flex items-center justify-between bg-gray-50 rounded-lg px-2.5 py-1.5 text-[10px]">
                    <div>
                      <span className="font-semibold">{r.readingDate}</span>
                      {r.ndvi != null && <span className="text-emerald-700 ml-1.5">NDVI {r.ndvi}</span>}
                      {r.heightCm != null && <span className="text-blue-700 ml-1.5">{r.heightCm}cm</span>}
                      <span className="ml-1.5" style={{ color: HEALTH_LABELS[r.healthStatus].color }}>{HEALTH_LABELS[r.healthStatus].label}</span>
                      {r.note && <div className="text-gray-500 mt-0.5">{r.note}</div>}
                    </div>
                    <button onClick={() => handleDelete(r.id)} className="text-gray-400 hover:text-red-500 cursor-pointer shrink-0 ml-2">
                      <Trash2 size={12} />
                    </button>
                  </div>
                ))}
              </div>
            </>
          )}

          {!showForm ? (
            <button
              onClick={() => setShowForm(true)}
              className="w-full flex items-center justify-center gap-1.5 bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-semibold py-2.5 rounded-lg cursor-pointer"
            >
              <Plus size={14} /> নতুন পর্যবেক্ষণ যোগ করুন
            </button>
          ) : (
            <div className="border rounded-lg p-3 space-y-2 bg-gray-50">
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-[9px] text-gray-500 font-semibold">NDVI (০-১)</label>
                  <input type="number" step="0.01" min="0" max="1" value={ndvi} onChange={(e) => setNdvi(e.target.value)}
                    className="w-full border rounded px-2 py-1.5 text-xs" placeholder="যেমন ০.৪৫" />
                </div>
                <div>
                  <label className="text-[9px] text-gray-500 font-semibold">উচ্চতা (cm)</label>
                  <input type="number" step="1" value={heightCm} onChange={(e) => setHeightCm(e.target.value)}
                    className="w-full border rounded px-2 py-1.5 text-xs" placeholder="যেমন ৮৫" />
                </div>
              </div>
              <div>
                <label className="text-[9px] text-gray-500 font-semibold">অবস্থা</label>
                <div className="flex gap-1.5 mt-1">
                  {(Object.keys(HEALTH_LABELS) as HealthStatus[]).map((k) => (
                    <button
                      key={k}
                      onClick={() => setHealth(k)}
                      className="flex-1 text-[9px] py-1.5 rounded-lg font-semibold border cursor-pointer"
                      style={health === k
                        ? { background: HEALTH_LABELS[k].color, borderColor: HEALTH_LABELS[k].color, color: 'white' }
                        : { borderColor: '#e5e7eb', color: '#6b7280' }}
                    >
                      {HEALTH_LABELS[k].label}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label className="text-[9px] text-gray-500 font-semibold">মন্তব্য (ঐচ্ছিক)</label>
                <input type="text" value={note} onChange={(e) => setNote(e.target.value)}
                  className="w-full border rounded px-2 py-1.5 text-xs" placeholder="পর্যবেক্ষণ..." />
              </div>
              <div className="flex gap-2">
                <button onClick={() => setShowForm(false)} className="flex-1 text-xs py-2 rounded-lg border border-gray-300 text-gray-600 cursor-pointer">বাতিল</button>
                <button
                  onClick={handleAdd}
                  disabled={saving || (!ndvi && !heightCm)}
                  className="flex-1 text-xs py-2 rounded-lg bg-emerald-700 text-white font-semibold disabled:opacity-50 cursor-pointer"
                >
                  {saving ? 'সংরক্ষণ হচ্ছে...' : 'সংরক্ষণ করুন'}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

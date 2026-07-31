import { useState, useMemo, useCallback } from 'react';
import {
  Search,
  Edit,
  Trash2,
  RefreshCw,
  Check,
  Clock,
  User,
  MapPin,
  CalendarDays,
  Database,
} from 'lucide-react';
import type { Submission } from '../../OfflinePlantationDashboard';
import { countSeedlings } from '../../../types/plantation';
import { toBnNum } from '../../../utils/geoUtils';

/* ------------------------------------------------------------------ */
/*  Props                                                              */
/* ------------------------------------------------------------------ */

interface MyDataProps {
  submissions: Submission[];
  onEdit: (submission: Submission) => void;
  onDelete: (id: string) => void;
  onSync: (submission: Submission) => void;
  onSyncAll: () => void;
}

/* ------------------------------------------------------------------ */
/*  Helpers                                                            */
/* ------------------------------------------------------------------ */

function formatDate(iso?: string): string {
  if (!iso) return '—';
  try {
    return new Date(iso).toLocaleDateString('bn-BD', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  } catch {
    return iso;
  }
}

function locationChain(s: Submission): string {
  const parts = [s.region, s.district, s.upazila].filter(Boolean);
  return parts.length ? parts.join(' > ') : 'অজানা স্থান';
}

function farmerLabel(s: Submission): string {
  return s.farmerName || s.nurseryName || 'নাম নেই';
}

/* ------------------------------------------------------------------ */
/*  Component                                                          */
/* ------------------------------------------------------------------ */

export default function MyData({
  submissions,
  onEdit,
  onDelete,
  onSync,
  onSyncAll,
}: MyDataProps) {
  const [mobileQuery, setMobileQuery] = useState('');

  /* ---- derived state ---- */
  const filtered = useMemo(() => {
    const q = mobileQuery.trim();
    if (!q) return submissions;
    return submissions.filter(
      (s) =>
        (s.farmerMobile || s.mobile || '')
          .replace(/\D/g, '')
          .includes(q.replace(/\D/g, '')),
    );
  }, [submissions, mobileQuery]);

  const unsyncedCount = useMemo(
    () => submissions.filter((s) => !s.synced).length,
    [submissions],
  );

  const handleSearch = useCallback(() => {
    // Trigger is just setting state; filtering is reactive via useMemo
  }, []);

  /* ---- render ---- */
  return (
    <div className="flex flex-col gap-4">
      {/* ── Header ─────────────────────────────────────── */}
      <div className="flex items-center justify-between">
        <h2 className="text-base font-bold text-gray-800 flex items-center gap-1.5">
          <Database className="w-5 h-5 text-[#15803d]" />
          আমার ডাটা
          <span className="text-xs font-medium text-gray-400">
            ({toBnNum(submissions.length)} টি এন্ট্রি)
          </span>
        </h2>

        {unsyncedCount > 0 && (
          <button
            type="button"
            onClick={onSyncAll}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-[#15803d] text-white hover:bg-green-800 active:scale-95 transition-all shadow-sm cursor-pointer"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            সিঙ্ক করুন
            <span className="bg-white/20 rounded-full px-1.5 py-0.5 text-[10px]">
              {toBnNum(unsyncedCount)}
            </span>
          </button>
        )}
      </div>

      {/* ── Mobile Lookup ──────────────────────────────── */}
      <div className="flex gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="tel"
            inputMode="numeric"
            placeholder="মোবাইল নম্বর দিন..."
            value={mobileQuery}
            onChange={(e) => setMobileQuery(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
            className="w-full pl-9 pr-3 py-2.5 rounded-lg border border-gray-200 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-[#15803d]/30 focus:border-[#15803d] transition"
          />
        </div>
        <button
          type="button"
          onClick={handleSearch}
          className="flex items-center gap-1.5 px-4 py-2.5 rounded-lg text-sm font-semibold bg-[#15803d] text-white hover:bg-green-800 active:scale-95 transition-all shadow-sm cursor-pointer whitespace-nowrap"
        >
          🔍 খুঁজুন
        </button>
      </div>

      {/* ── Submission Cards ───────────────────────────── */}
      {filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 text-gray-400 gap-3">
          <Database className="w-12 h-12 opacity-30" />
          <p className="text-sm text-center leading-relaxed">
            এই মোবাইল নম্বরে কোনো তথ্য পাওয়া যায়নি
          </p>
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {filtered.map((s) => {
            const counts = countSeedlings(s as any);
            const total = counts.fruit + counts.forest + counts.medicinal;
            const isSynced = !!s.synced;

            return (
              <div
                key={s.id}
                className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 flex flex-col gap-3 hover:shadow-md transition-shadow"
              >
                {/* Card header: farmer + sync badge */}
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-2 min-w-0">
                    <div className="w-8 h-8 rounded-full bg-[#15803d]/10 flex items-center justify-center shrink-0">
                      <User className="w-4 h-4 text-[#15803d]" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-semibold text-gray-800 truncate">
                        {farmerLabel(s)}
                      </p>
                      <p className="text-xs text-gray-400 truncate">
                        {s.farmerMobile || s.mobile || '—'}
                      </p>
                    </div>
                  </div>

                  {/* Sync status badge */}
                  <span
                    className={`inline-flex items-center gap-1 text-[10px] font-medium px-2 py-0.5 rounded-full shrink-0 ${
                      isSynced
                        ? 'bg-green-50 text-green-700 border border-green-200'
                        : 'bg-amber-50 text-amber-700 border border-amber-200'
                    }`}
                  >
                    {isSynced ? (
                      <>
                        <Check className="w-3 h-3" />
                        সিঙ্ক হয়েছে
                      </>
                    ) : (
                      <>
                        <Clock className="w-3 h-3" />
                        পেন্ডিং
                      </>
                    )}
                  </span>
                </div>

                {/* Location + Date */}
                <div className="flex flex-col gap-1 text-xs text-gray-500">
                  <span className="flex items-center gap-1 truncate">
                    <MapPin className="w-3.5 h-3.5 shrink-0 text-[#15803d]" />
                    {locationChain(s)}
                  </span>
                  <span className="flex items-center gap-1">
                    <CalendarDays className="w-3.5 h-3.5 shrink-0 text-gray-400" />
                    {formatDate(s.submittedAt || s.plantingDate)}
                  </span>
                </div>

                {/* Seedling count boxes */}
                <div className="grid grid-cols-3 gap-2">
                  {/* ফলদ */}
                  <div className="rounded-lg bg-orange-50 border border-orange-100 px-2.5 py-2 text-center">
                    <p className="text-[10px] font-medium text-orange-600 leading-tight">
                      ফলদ
                    </p>
                    <p className="text-sm font-bold text-orange-700">
                      {toBnNum(counts.fruit)}
                    </p>
                  </div>
                  {/* বনজ */}
                  <div className="rounded-lg bg-green-50 border border-green-100 px-2.5 py-2 text-center">
                    <p className="text-[10px] font-medium text-green-600 leading-tight">
                      বনজ
                    </p>
                    <p className="text-sm font-bold text-green-700">
                      {toBnNum(counts.forest)}
                    </p>
                  </div>
                  {/* ঔষধি */}
                  <div className="rounded-lg bg-blue-50 border border-blue-100 px-2.5 py-2 text-center">
                    <p className="text-[10px] font-medium text-blue-600 leading-tight">
                      ঔষধি
                    </p>
                    <p className="text-sm font-bold text-blue-700">
                      {toBnNum(counts.medicinal)}
                    </p>
                  </div>
                </div>

                {/* Total + Actions */}
                <div className="flex items-center justify-between pt-1 border-t border-gray-50">
                  <span className="text-xs text-gray-500">
                    মোট:{' '}
                    <span className="font-bold text-gray-700">
                      {toBnNum(total)} টি চারা
                    </span>
                  </span>

                  <div className="flex items-center gap-1.5">
                    {/* Per-card sync */}
                    {!isSynced && (
                      <button
                        type="button"
                        onClick={() => onSync(s)}
                        className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-medium bg-[#15803d]/10 text-[#15803d] hover:bg-[#15803d]/20 active:scale-95 transition-all cursor-pointer"
                      >
                        <RefreshCw className="w-3 h-3" />
                        সিঙ্ক
                      </button>
                    )}

                    {/* Edit */}
                    <button
                      type="button"
                      onClick={() => onEdit(s)}
                      className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-medium bg-gray-100 text-gray-600 hover:bg-gray-200 active:scale-95 transition-all cursor-pointer"
                    >
                      ✏️ সম্পাদনা
                    </button>

                    {/* Delete */}
                    <button
                      type="button"
                      onClick={() => {
                        if (window.confirm('এই এন্ট্রি মুছে ফেলতে চান?')) {
                          onDelete(s.id);
                        }
                      }}
                      className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-medium bg-red-50 text-red-600 hover:bg-red-100 active:scale-95 transition-all cursor-pointer"
                    >
                      🗑️ মুছুন
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

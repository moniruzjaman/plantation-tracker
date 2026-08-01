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
  Download,
  Printer,
  FileText,
  Filter,
  TrendingUp,
  TreePine,
  Leaf,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';
import type { Submission } from '../../OfflinePlantationDashboard';
import { countSeedlings } from '../../../types/plantation';
import { toBnNum } from '../../../utils/geoUtils';
import { normaliseEntries, exportMinistry9ColExcel, exportMinistry9ColPrint, export17ColExcel, export17ColPrint, exportGeneralCSV } from '../../../utils/reports';
import { BD } from '../../../data/adminData';
import type { Profile } from '../../../hooks/useProfile';

/* ------------------------------------------------------------------ */
/*  Props                                                              */
/* ------------------------------------------------------------------ */

interface MyDataProps {
  submissions: Submission[];
  onEdit: (submission: Submission) => void;
  onDelete: (id: string) => void;
  onSync: (submission: Submission) => void;
  onSyncAll: () => void;
  profile?: Profile | null;
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
/*  Probable Output Calculation (migrated from legacy)                 */
/* ------------------------------------------------------------------ */

function computeProbableOutput(submissions: Submission[]) {
  let totalSeedlings = 0;
  let fruitBearing = 0;
  let totalCO2Kg = 0;
  submissions.forEach((s) => {
    const counts = countSeedlings(s as any);
    const total = counts.fruit + counts.forest + counts.medicinal;
    totalSeedlings += total;
    // 80% survival rate
    const surviving = Math.round(total * 0.8);
    // ~30% of surviving are fruit-bearing (legacy estimate)
    fruitBearing += Math.round(surviving * 0.3);
    // Each surviving tree absorbs ~20kg CO2/year (legacy estimate)
    totalCO2Kg += surviving * 20;
  });
  return {
    totalSeedlings,
    surviving: Math.round(totalSeedlings * 0.8),
    fruitBearing,
    totalCO2Kg,
    // CO2 in metric tonnes
    totalCO2Tonnes: (totalCO2Kg / 1000).toFixed(2),
  };
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
  const [showFilters, setShowFilters] = useState(false);
  const [showProbableOutput, setShowProbableOutput] = useState(false);

  // Filter state
  const [filterDateFrom, setFilterDateFrom] = useState('');
  const [filterDateTo, setFilterDateTo] = useState('');
  const [filterDistrict, setFilterDistrict] = useState('');
  const [filterUpazila, setFilterUpazila] = useState('');

  /* ---- derived state ---- */
  const filtered = useMemo(() => {
    let list = submissions;

    // Mobile search
    const q = mobileQuery.trim();
    if (q) {
      list = list.filter(
        (s) =>
          (s.farmerMobile || s.mobile || '')
            .replace(/\D/g, '')
            .includes(q.replace(/\D/g, '')),
      );
    }

    // Date range filter
    if (filterDateFrom) {
      const from = new Date(filterDateFrom).getTime();
      list = list.filter((s) => {
        const d = new Date(s.submittedAt || s.plantingDate || '').getTime();
        return d >= from;
      });
    }
    if (filterDateTo) {
      const to = new Date(filterDateTo).getTime() + 86400000; // include end date
      list = list.filter((s) => {
        const d = new Date(s.submittedAt || s.plantingDate || '').getTime();
        return d <= to;
      });
    }

    // District filter
    if (filterDistrict) {
      list = list.filter((s) => s.district === filterDistrict);
    }

    // Upazila filter
    if (filterUpazila) {
      list = list.filter((s) => s.upazila === filterUpazila);
    }

    return list;
  }, [submissions, mobileQuery, filterDateFrom, filterDateTo, filterDistrict, filterUpazila]);

  const unsyncedCount = useMemo(
    () => submissions.filter((s) => !s.synced).length,
    [submissions],
  );

  // Available districts for filter dropdown (from actual submissions)
  const availableDistricts = useMemo(() => {
    const set = new Set<string>();
    submissions.forEach((s) => { if (s.district) set.add(s.district); });
    return Array.from(set).sort();
  }, [submissions]);

  // Available upazilas for filtered district
  const availableUpazilas = useMemo(() => {
    if (!filterDistrict) {
      const set = new Set<string>();
      submissions.forEach((s) => { if (s.upazila) set.add(s.upazila); });
      return Array.from(set).sort();
    }
    const set = new Set<string>();
    submissions.forEach((s) => {
      if (s.district === filterDistrict && s.upazila) set.add(s.upazila);
    });
    return Array.from(set).sort();
  }, [submissions, filterDistrict]);

  const handleSearch = useCallback(() => {
    // Trigger is just setting state; filtering is reactive via useMemo
  }, []);

  // Probable output for filtered data
  const probableOutput = useMemo(
    () => computeProbableOutput(filtered),
    [filtered],
  );

  // Report exports for my data
  const getReportRows = useCallback(() => {
    return normaliseEntries(submissions, []);
  }, [submissions]);

  const handleMinistryExcel = useCallback(() => exportMinistry9ColExcel(getReportRows()), [getReportRows]);
  const handleMinistryPrint = useCallback(() => exportMinistry9ColPrint(getReportRows()), [getReportRows]);
  const handle17ColExcel = useCallback(() => export17ColExcel(getReportRows()), [getReportRows]);
  const handle17ColPrint = useCallback(() => export17ColPrint(getReportRows()), [getReportRows]);
  const handleExportCSV = useCallback(() => exportGeneralCSV(getReportRows()), [getReportRows]);

  const clearFilters = useCallback(() => {
    setFilterDateFrom('');
    setFilterDateTo('');
    setFilterDistrict('');
    setFilterUpazila('');
  }, []);

  const hasActiveFilters = !!(filterDateFrom || filterDateTo || filterDistrict || filterUpazila);

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

        <div className="flex items-center gap-1.5">
          {/* Filter toggle */}
          <button
            type="button"
            onClick={() => setShowFilters((v) => !v)}
            className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
              showFilters || hasActiveFilters
                ? 'bg-[#15803d]/10 text-[#15803d] border border-[#15803d]/30'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            <Filter className="w-3.5 h-3.5" />
            ফিল্টার
          </button>

          {/* Probable output toggle */}
          <button
            type="button"
            onClick={() => setShowProbableOutput((v) => !v)}
            className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
              showProbableOutput
                ? 'bg-blue-50 text-blue-600 border border-blue-200'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            <TrendingUp className="w-3.5 h-3.5" />
            সম্ভাব্য ফলাফল
          </button>

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
      </div>

      {/* ── Filters Panel ──────────────────────────────── */}
      {showFilters && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-3 flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <p className="text-[10px] font-semibold text-gray-500 uppercase tracking-wide flex items-center gap-1">
              <Filter className="w-3 h-3" />
              ফিল্টার সেটিংস
            </p>
            {hasActiveFilters && (
              <button type="button" onClick={clearFilters} className="text-[10px] text-[#15803d] font-medium hover:underline cursor-pointer">
                ফিল্টার মুছুন
              </button>
            )}
          </div>
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="text-[10px] text-gray-500 block mb-0.5">তারিখ থেকে</label>
              <input
                type="date"
                value={filterDateFrom}
                onChange={(e) => setFilterDateFrom(e.target.value)}
                className="w-full px-2.5 py-1.5 rounded-lg border border-gray-200 text-xs bg-white focus:outline-none focus:ring-2 focus:ring-[#15803d]/30 focus:border-[#15803d] transition"
              />
            </div>
            <div>
              <label className="text-[10px] text-gray-500 block mb-0.5">তারিখ পর্যন্ত</label>
              <input
                type="date"
                value={filterDateTo}
                onChange={(e) => setFilterDateTo(e.target.value)}
                className="w-full px-2.5 py-1.5 rounded-lg border border-gray-200 text-xs bg-white focus:outline-none focus:ring-2 focus:ring-[#15803d]/30 focus:border-[#15803d] transition"
              />
            </div>
            <div>
              <label className="text-[10px] text-gray-500 block mb-0.5">জেলা</label>
              <select
                value={filterDistrict}
                onChange={(e) => { setFilterDistrict(e.target.value); setFilterUpazila(''); }}
                className="w-full px-2.5 py-1.5 rounded-lg border border-gray-200 text-xs bg-white focus:outline-none focus:ring-2 focus:ring-[#15803d]/30 focus:border-[#15803d] transition appearance-none cursor-pointer"
              >
                <option value="">সব জেলা</option>
                {availableDistricts.map((d) => <option key={d} value={d}>{d}</option>)}
              </select>
            </div>
            <div>
              <label className="text-[10px] text-gray-500 block mb-0.5">উপজেলা</label>
              <select
                value={filterUpazila}
                onChange={(e) => setFilterUpazila(e.target.value)}
                className="w-full px-2.5 py-1.5 rounded-lg border border-gray-200 text-xs bg-white focus:outline-none focus:ring-2 focus:ring-[#15803d]/30 focus:border-[#15803d] transition appearance-none cursor-pointer"
              >
                <option value="">সব উপজেলা</option>
                {availableUpazilas.map((u) => <option key={u} value={u}>{u}</option>)}
              </select>
            </div>
          </div>
        </div>
      )}

      {/* ── Probable Output Panel ──────────────────────── */}
      {showProbableOutput && (
        <div className="bg-gradient-to-br from-emerald-50 to-green-50 rounded-xl shadow-sm border border-emerald-200 p-4">
          <div className="flex items-center justify-between mb-3">
            <p className="text-xs font-bold text-emerald-800 flex items-center gap-1.5">
              <TrendingUp className="w-4 h-4" />
              সম্ভাব্য ফলাফল (প্রজেকশন)
            </p>
            <button type="button" onClick={() => setShowProbableOutput(false)} className="text-emerald-600 hover:text-emerald-800 cursor-pointer">
              <ChevronUp className="w-4 h-4" />
            </button>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="bg-white/70 rounded-lg p-3 text-center">
              <TreePine className="w-5 h-5 text-emerald-600 mx-auto mb-1" />
              <p className="text-[10px] text-emerald-600">মোট চারা</p>
              <p className="text-lg font-extrabold text-emerald-800">{toBnNum(probableOutput.totalSeedlings)}</p>
            </div>
            <div className="bg-white/70 rounded-lg p-3 text-center">
              <Leaf className="w-5 h-5 text-green-600 mx-auto mb-1" />
              <p className="text-[10px] text-green-600">বেঁচে থাকবে (৮০%)</p>
              <p className="text-lg font-extrabold text-green-800">{toBnNum(probableOutput.surviving)}</p>
            </div>
            <div className="bg-white/70 rounded-lg p-3 text-center">
              <Leaf className="w-5 h-5 text-orange-600 mx-auto mb-1" />
              <p className="text-[10px] text-orange-600">ফলদারী গাছ</p>
              <p className="text-lg font-extrabold text-orange-800">{toBnNum(probableOutput.fruitBearing)}</p>
            </div>
            <div className="bg-white/70 rounded-lg p-3 text-center">
              <Leaf className="w-5 h-5 text-blue-600 mx-auto mb-1" />
              <p className="text-[10px] text-blue-600">CO₂ শোষণ (টন/বছর)</p>
              <p className="text-lg font-extrabold text-blue-800">{toBnNum(Number(probableOutput.totalCO2Tonnes))}</p>
            </div>
          </div>
          <p className="text-[9px] text-emerald-500 mt-2 text-center">
            * অনুমানিক: ৮০% বেঁচে থাকার হার, ৩০% ফলদারী, প্রতি গাছে ২০ কেজি CO₂/বছর
          </p>
        </div>
      )}

      {/* ── Export Buttons ──────────────────────────────── */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
        <button type="button" onClick={handleMinistryExcel} className="flex items-center justify-center gap-1.5 px-2 py-2 rounded-lg text-[11px] font-semibold bg-[#15803d] text-white hover:bg-green-800 active:scale-95 transition-all shadow-sm cursor-pointer">
          <Download className="w-3 h-3" /> মন্ত্রণালয় Excel
        </button>
        <button type="button" onClick={handle17ColExcel} className="flex items-center justify-center gap-1.5 px-2 py-2 rounded-lg text-[11px] font-semibold bg-blue-600 text-white hover:bg-blue-700 active:scale-95 transition-all shadow-sm cursor-pointer">
          <Download className="w-3 h-3" /> ১৭-কলাম Excel
        </button>
        <button type="button" onClick={handleMinistryPrint} className="flex items-center justify-center gap-1.5 px-2 py-2 rounded-lg text-[11px] font-semibold bg-orange-500 text-white hover:bg-orange-600 active:scale-95 transition-all shadow-sm cursor-pointer">
          <Printer className="w-3 h-3" /> মন্ত্রণালয় প্রিন্ট
        </button>
        <button type="button" onClick={handle17ColPrint} className="flex items-center justify-center gap-1.5 px-2 py-2 rounded-lg text-[11px] font-semibold bg-purple-500 text-white hover:bg-purple-600 active:scale-95 transition-all shadow-sm cursor-pointer">
          <Printer className="w-3 h-3" /> ১৭-কলাম প্রিন্ট
        </button>
        <button type="button" onClick={handleExportCSV} className="flex items-center justify-center gap-1.5 px-2 py-2 rounded-lg text-[11px] font-semibold bg-white text-gray-700 hover:bg-gray-100 active:scale-95 transition-all shadow-sm cursor-pointer border border-gray-200">
          <FileText className="w-3 h-3" /> CSV
        </button>
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

      {/* ── Filter summary ─────────────────────────────── */}
      {hasActiveFilters && (
        <div className="flex items-center gap-2 text-xs text-gray-500">
          <span>ফিল্টার প্রয়োগিত:</span>
          {filterDateFrom && <span className="bg-gray-100 px-2 py-0.5 rounded-full">থেকে: {filterDateFrom}</span>}
          {filterDateTo && <span className="bg-gray-100 px-2 py-0.5 rounded-full">পর্যন্ত: {filterDateTo}</span>}
          {filterDistrict && <span className="bg-gray-100 px-2 py-0.5 rounded-full">জেলা: {filterDistrict}</span>}
          {filterUpazila && <span className="bg-gray-100 px-2 py-0.5 rounded-full">উপজেলা: {filterUpazila}</span>}
          <span className="font-semibold text-gray-700">{toBnNum(filtered.length)} টি ফলাফল</span>
        </div>
      )}

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

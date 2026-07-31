import { useState, useMemo, useCallback } from 'react';
import {
  Shield,
  Lock,
  Download,
  Trash2,
  Database,
  BarChart3,
  MapPin,
  Leaf,
  AlertTriangle,
  ChevronDown,
  ChevronUp,
  X,
  Printer,
  FileText,
} from 'lucide-react';
import { normaliseEntries, exportMinistry9ColExcel, exportMinistry9ColPrint, export17ColExcel, export17ColPrint, exportGeneralCSV, exportGeneralPrint } from '../../../utils/reports';
import type { ComponentType } from 'react';
import type { Submission } from '../../OfflinePlantationDashboard';
import { countSeedlings } from '../../../types/plantation';
import { BD, BD_DIVISIONS } from '../../../data/adminData';
import { toBnNum } from '../../../utils/geoUtils';

interface AdminPanelProps {
  submissions: Submission[];
  nationalEntries?: any[];
}

const ADMIN_LS_KEY = 'admin_password';
const DEFAULT_PASS = 'admin123';

function StatBox({ label, value, color, icon }: { label: string; value: string; color: 'green' | 'orange' | 'blue' | 'purple'; icon: ComponentType<any> }) {
  const colorMap: Record<string, { bg: string; text: string }> = {
    green:  { bg: 'bg-green-50 border-green-100',  text: 'text-green-600' },
    orange: { bg: 'bg-orange-50 border-orange-100', text: 'text-orange-600' },
    blue:   { bg: 'bg-blue-50 border-blue-100',   text: 'text-blue-600' },
    purple: { bg: 'bg-purple-50 border-purple-100', text: 'text-purple-600' },
  };
  const c = colorMap[color] ?? colorMap.green;

  return (
    <div className={`rounded-xl p-3 flex flex-col items-center justify-center text-center border ${c.bg}`}>
      <icon className={`w-5 h-5 mb-1 ${c.text}`} />
      <span className="text-[10px] font-medium text-gray-500 uppercase tracking-wide">{label}</span>
      <span className={`text-lg font-extrabold mt-0.5 ${c.text}`}>{value}</span>
    </div>
  );
}

export default function AdminPanel({ submissions, nationalEntries = [] }: AdminPanelProps) {
  const [authenticated, setAuthenticated] = useState(false);
  const [passInput, setPassInput] = useState('');
  const [authError, setAuthError] = useState('');
  const [filterRegion, setFilterRegion] = useState('');
  const [filterDistrict, setFilterDistrict] = useState('');
  const [expandedRow, setExpandedRow] = useState<string | null>(null);
  const [confirmDeleteAll, setConfirmDeleteAll] = useState(false);
  const [showChangePassword, setShowChangePassword] = useState(false);
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordMsg, setPasswordMsg] = useState('');

  const allEntries = useMemo(() => {
    const local = submissions.map((s) => ({
      _source: 'local' as const,
      id: s.id,
      farmerName: s.farmerName || s.nurseryName || '',
      farmerMobile: s.farmerMobile || s.mobile || '',
      region: s.region || '',
      district: s.district || '',
      upazila: s.upazila || '',
      submittedAt: s.submittedAt || '',
      _raw: s,
    }));
    const national = (nationalEntries ?? []).map((n: any) => ({
      _source: 'national' as const,
      id: n.id || n.submissionId || '',
      farmerName: n.farmerName || n.nurseryName || '',
      farmerMobile: '',
      region: n.region || n.division || '',
      district: n.district || '',
      upazila: n.upazila || '',
      submittedAt: '',
      _raw: n,
    }));
    return [...local, ...national];
  }, [submissions, nationalEntries]);

  const filtered = useMemo(() => {
    let list = allEntries;
    if (filterRegion) list = list.filter((e) => e.region === filterRegion);
    if (filterDistrict) list = list.filter((e) => e.district === filterDistrict);
    return list;
  }, [allEntries, filterRegion, filterDistrict]);

  const stats = useMemo(() => {
    let fruit = 0;
    let forest = 0;
    let medicinal = 0;
    submissions.forEach((s) => {
      const c = countSeedlings(s as any);
      fruit += c.fruit;
      forest += c.forest;
      medicinal += c.medicinal;
    });
    return {
      totalEntries: allEntries.length,
      localEntries: submissions.length,
      nationalCount: (nationalEntries ?? []).length,
      totalSeedlings: fruit + forest + medicinal,
      fruit,
      forest,
      medicinal,
    };
  }, [submissions, nationalEntries, allEntries.length]);

  const filterDistricts = useMemo(
    () => (filterRegion ? BD[filterRegion] ?? [] : []),
    [filterRegion],
  );

  const handleLogin = useCallback(() => {
    try {
      const stored = localStorage.getItem(ADMIN_LS_KEY) || DEFAULT_PASS;
      if (passInput === stored) {
        setAuthenticated(true);
        setAuthError('');
      } else {
        setAuthError('পাসওয়ার্ড ভুল হয়েছে!');
      }
    } catch {
      if (passInput === DEFAULT_PASS) {
        setAuthenticated(true);
        setAuthError('');
      } else {
        setAuthError('পাসওয়ার্ড ভুল হয়েছে!');
      }
    }
  }, [passInput]);

  const handleLogout = useCallback(() => {
    setAuthenticated(false);
    setPassInput('');
    setAuthError('');
    setFilterRegion('');
    setFilterDistrict('');
    setConfirmDeleteAll(false);
  }, []);

  // #38-43: Report exports
  const getReportRows = useCallback(() => {
    return normaliseEntries(submissions, nationalEntries);
  }, [submissions, nationalEntries]);

  const handleMinistryExcel = useCallback(() => {
    exportMinistry9ColExcel(getReportRows());
  }, [getReportRows]);

  const handleMinistryPrint = useCallback(() => {
    exportMinistry9ColPrint(getReportRows());
  }, [getReportRows]);

  const handle17ColExcel = useCallback(() => {
    export17ColExcel(getReportRows());
  }, [getReportRows]);

  const handle17ColPrint = useCallback(() => {
    export17ColPrint(getReportRows());
  }, [getReportRows]);

  const handleGeneralExcel = useCallback(() => {
    const rows = getReportRows();
    const header = ['ক্রম', 'অঞ্চল', 'জেলা', 'উপজেলা', 'রোপণকারী', 'মোবাইল', 'ফলদ', 'বনজ', 'ঔষধি', 'মোট', 'তারিখ'];
    const tsvRows = rows.map((e, i) => [i + 1, e.region, e.district, e.upazila, e.farmerName, e.farmerMobile, e.fruit, e.forest, e.medicinal, e.total, e.date].join('\t'));
    const tsv = [header.join('\t'), ...tsvRows].join('\n');
    const bom = '\uFEFF';
    const blob = new Blob([bom + tsv], { type: 'application/vnd.ms-excel;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url; a.download = `admin_data_${new Date().toISOString().slice(0, 10)}.xls`; a.click(); URL.revokeObjectURL(url);
  }, [getReportRows]);

  const handleExportCSV = useCallback(() => {
    exportGeneralCSV(getReportRows());
  }, [getReportRows]);

  const handlePrint = useCallback(() => {
    exportGeneralPrint(getReportRows());
  }, [getReportRows]);

  const handleDeleteAll = useCallback(() => {
    if (!confirmDeleteAll) { setConfirmDeleteAll(true); return; }
    try { localStorage.removeItem('nursery_submissions'); } catch { /* ignore */ }
    setConfirmDeleteAll(false);
    window.location.reload();
  }, [confirmDeleteAll]);

  const handleChangePassword = useCallback(() => {
    setPasswordMsg('');
    if (!newPassword.trim()) {
      setPasswordMsg('পাসওয়ার্ড দিন');
      return;
    }
    if (newPassword.length < 4) {
      setPasswordMsg('পাসওয়ার্ড কমপক্ষে ৪ অক্ষরের হতে হবে');
      return;
    }
    if (newPassword !== confirmPassword) {
      setPasswordMsg('পাসওয়ার্ড মিলছে না');
      return;
    }
    try {
      localStorage.setItem(ADMIN_LS_KEY, newPassword);
      setPasswordMsg('পাসওয়ার্ড সফলভাবে পরিবর্তন হয়েছে!');
      setNewPassword('');
      setConfirmPassword('');
      setShowChangePassword(false);
    } catch {
      setPasswordMsg('পাসওয়ার্ড সংরক্ষণ করতে সমস্যা হয়েছে');
    }
  }, [newPassword, confirmPassword]);

  if (!authenticated) {
    return (
      <div className="flex flex-col items-center justify-center py-16 gap-5">
        <div className="w-16 h-16 rounded-full bg-[#15803d]/10 flex items-center justify-center">
          <Shield className="w-8 h-8 text-[#15803d]" />
        </div>
        <h2 className="text-base font-bold text-gray-800">অ্যাডমিন প্যানেল</h2>
        <p className="text-xs text-gray-400 text-center max-w-xs">এই প্যানেলে প্রবেশ করতে পাসওয়ার্ড দিন</p>
        <div className="w-full max-w-xs flex flex-col gap-3">
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="password"
              value={passInput}
              onChange={(e) => { setPassInput(e.target.value); setAuthError(''); }}
              onKeyDown={(e) => e.key === 'Enter' && handleLogin()}
              placeholder="পাসওয়ার্ড"
              className="w-full pl-10 pr-3 py-2.5 rounded-lg border border-gray-200 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-[#15803d]/30 focus:border-[#15803d] transition"
            />
          </div>
          {authError && (
            <p className="text-xs text-red-500 text-center flex items-center justify-center gap-1">
              <AlertTriangle className="w-3.5 h-3.5" />
              {authError}
            </p>
          )}
          <button
            type="button"
            onClick={handleLogin}
            className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-sm font-bold bg-[#15803d] text-white hover:bg-green-800 active:scale-[0.98] transition-all shadow-md cursor-pointer"
          >
            🔐 প্রবেশ
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between flex-wrap gap-2">
        <h2 className="text-base font-bold text-gray-800 flex items-center gap-1.5">
          <Shield className="w-5 h-5 text-[#15803d]" />
          অ্যাডমিন প্যানেল
        </h2>
        <button type="button" onClick={handleLogout} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-gray-100 text-gray-600 hover:bg-gray-200 active:scale-95 transition-all cursor-pointer">
          <Lock className="w-3.5 h-3.5" />
          🔒 লগআউট
        </button>
      </div>

      {/* ── Change Password Section ──────────────────── */}
      {showChangePassword ? (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-3 flex flex-col gap-2">
          <p className="text-xs font-semibold text-gray-600 flex items-center gap-1">
            <Lock className="w-3.5 h-3.5 text-[#15803d]" />
            পাসওয়ার্ড পরিবর্তন
          </p>
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="text-[10px] text-gray-500 block mb-0.5">নতুন পাসওয়ার্ড</label>
              <input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="নতুন পাসওয়ার্ড"
                className="w-full px-2.5 py-2 rounded-lg border border-gray-200 text-xs bg-white focus:outline-none focus:ring-2 focus:ring-[#15803d]/30 focus:border-[#15803d] transition"
              />
            </div>
            <div>
              <label className="text-[10px] text-gray-500 block mb-0.5">নিশ্চিত করুন</label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="আবার লিখুন"
                className="w-full px-2.5 py-2 rounded-lg border border-gray-200 text-xs bg-white focus:outline-none focus:ring-2 focus:ring-[#15803d]/30 focus:border-[#15803d] transition"
              />
            </div>
          </div>
          {passwordMsg && (
            <p className={`text-[10px] ${passwordMsg.includes('সফল') ? 'text-green-600' : 'text-red-500'}`}>
              {passwordMsg}
            </p>
          )}
          <div className="flex gap-2">
            <button type="button" onClick={handleChangePassword} className="flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-[#15803d] text-white hover:bg-green-800 active:scale-95 transition-all shadow-sm cursor-pointer">
              ✓ পরিবর্তন করুন
            </button>
            <button type="button" onClick={() => { setShowChangePassword(false); setPasswordMsg(''); setNewPassword(''); setConfirmPassword(''); }} className="flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-gray-100 text-gray-600 hover:bg-gray-200 active:scale-95 transition-all cursor-pointer">
              বাতিল
            </button>
          </div>
        </div>
      ) : (
        <button type="button" onClick={() => setShowChangePassword(true)} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-gray-50 text-gray-500 hover:bg-gray-100 border border-gray-200 active:scale-95 transition-all cursor-pointer self-start">
          🔑 পাসওয়ার্ড পরিবর্তন
        </button>
      )}

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
        <StatBox label="মোট এন্ট্রি" value={toBnNum(stats.totalEntries)} color="green" icon={Database} />
        <StatBox label="স্থানীয়" value={toBnNum(stats.localEntries)} color="orange" icon={Leaf} />
        <StatBox label="জাতীয়" value={toBnNum(stats.nationalCount)} color="blue" icon={BarChart3} />
        <StatBox label="মোট চারা" value={toBnNum(stats.totalSeedlings)} color="purple" icon={Leaf} />
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-3 flex flex-col gap-2">
        <p className="text-[10px] font-semibold text-gray-500 uppercase tracking-wide flex items-center gap-1">
          <BarChart3 className="w-3 h-3" />
          চারার বিবরণ
        </p>
        <div className="grid grid-cols-3 gap-2 text-center">
          <div className="rounded-lg bg-orange-50 border border-orange-100 px-2 py-1.5">
            <p className="text-[10px] text-orange-600">ফলদ</p>
            <p className="text-sm font-bold text-orange-700">{toBnNum(stats.fruit)}</p>
          </div>
          <div className="rounded-lg bg-green-50 border border-green-100 px-2 py-1.5">
            <p className="text-[10px] text-green-600">বনজ</p>
            <p className="text-sm font-bold text-green-700">{toBnNum(stats.forest)}</p>
          </div>
          <div className="rounded-lg bg-blue-50 border border-blue-100 px-2 py-1.5">
            <p className="text-[10px] text-blue-600">ঔষধি</p>
            <p className="text-sm font-bold text-blue-700">{toBnNum(stats.medicinal)}</p>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-3 flex flex-col gap-3">
        <div className="flex flex-wrap gap-2">
          <select value={filterRegion} onChange={(e) => { setFilterRegion(e.target.value); setFilterDistrict(''); }} className="flex-1 min-w-[120px] px-3 py-2 rounded-lg border border-gray-200 text-xs bg-white focus:outline-none focus:ring-2 focus:ring-[#15803d]/30 focus:border-[#15803d] transition appearance-none cursor-pointer">
            <option value="">সব অঞ্চল</option>
            {BD_DIVISIONS.map((d) => (<option key={d} value={d}>{d}</option>))}
          </select>
          <select value={filterDistrict} onChange={(e) => setFilterDistrict(e.target.value)} disabled={!filterRegion || filterDistricts.length === 0} className="flex-1 min-w-[120px] px-3 py-2 rounded-lg border border-gray-200 text-xs bg-white focus:outline-none focus:ring-2 focus:ring-[#15803d]/30 focus:border-[#15803d] transition appearance-none cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed">
            <option value="">সব জেলা</option>
            {filterDistricts.map((d) => (<option key={d} value={d}>{d}</option>))}
          </select>
        </div>
        {/* #43: Export buttons */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
          <button type="button" onClick={handleMinistryExcel} className="flex items-center justify-center gap-1.5 px-2 py-2 rounded-lg text-[11px] font-semibold bg-[#15803d] text-white hover:bg-green-800 active:scale-95 transition-all shadow-sm cursor-pointer">
            <Download className="w-3 h-3" /> মন্ত্রণালয় Excel
          </button>
          <button type="button" onClick={handle17ColExcel} className="flex items-center justify-center gap-1.5 px-2 py-2 rounded-lg text-[11px] font-semibold bg-blue-600 text-white hover:bg-blue-700 active:scale-95 transition-all shadow-sm cursor-pointer">
            <Download className="w-3 h-3" /> ১৭-কলাম Excel
          </button>
          <button type="button" onClick={handleGeneralExcel} className="flex items-center justify-center gap-1.5 px-2 py-2 rounded-lg text-[11px] font-semibold bg-gray-700 text-white hover:bg-gray-800 active:scale-95 transition-all shadow-sm cursor-pointer">
            <Download className="w-3 h-3" /> সাধারণ Excel
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
          <button type="button" onClick={handleDeleteAll} className={`col-span-2 sm:col-span-3 flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg text-xs font-semibold transition-all shadow-sm cursor-pointer ${confirmDeleteAll ? 'bg-red-600 text-white hover:bg-red-700 animate-pulse' : 'bg-red-50 text-red-600 hover:bg-red-100 border border-red-200'}`}>
            <Trash2 className="w-3.5 h-3.5" />
            {confirmDeleteAll ? 'আবার ক্লিক করুন!' : '🗑️ সব ডাটা মুছুন'}
          </button>
        </div>
        {confirmDeleteAll && (
          <div className="flex items-center justify-between bg-red-50 border border-red-200 rounded-lg px-3 py-2">
            <p className="text-[10px] text-red-600 flex items-center gap-1">
              <AlertTriangle className="w-3 h-3" />
              সতর্কতা: এই কাজ পূর্বাবস্থায় ফেরত আনা যাবে না!
            </p>
            <button type="button" onClick={() => setConfirmDeleteAll(false)} className="p-1 rounded hover:bg-red-100 transition cursor-pointer">
              <X className="w-3.5 h-3.5 text-red-500" />
            </button>
          </div>
        )}
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="px-4 py-3 border-b border-gray-100 flex items-center justify-between">
          <p className="text-xs font-semibold text-gray-600 flex items-center gap-1">
            <Database className="w-3.5 h-3.5 text-[#15803d]" />
            সকল এন্ট্রি
            <span className="text-gray-400 font-normal">({toBnNum(filtered.length)} টি)</span>
          </p>
        </div>
        {filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-gray-400 gap-2">
            <Database className="w-10 h-10 opacity-30" />
            <p className="text-xs">কোনো ডাটা পাওয়া যায়নি</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-xs">
              <thead>
                <tr className="bg-gray-50 text-gray-500">
                  <th className="text-left px-3 py-2.5 font-medium whitespace-nowrap">কৃষক</th>
                  <th className="text-left px-3 py-2.5 font-medium whitespace-nowrap hidden sm:table-cell">স্থান</th>
                  <th className="text-center px-3 py-2.5 font-medium whitespace-nowrap">চারা</th>
                  <th className="text-center px-3 py-2.5 font-medium whitespace-nowrap hidden sm:table-cell">উৎস</th>
                  <th className="text-center px-3 py-2.5 font-medium whitespace-nowrap"><span className="sr-only">বিস্তারিত</span></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {filtered.map((entry) => {
                  const counts = entry._source === 'local' ? countSeedlings(entry._raw as any) : { fruit: 0, forest: 0, medicinal: 0 };
                  const total = counts.fruit + counts.forest + counts.medicinal;
                  const rowKey = entry.id + entry._source;
                  const isExpanded = expandedRow === rowKey;
                  return (
                    <>
                      <tr key={rowKey} className="hover:bg-gray-50/50 transition-colors">
                        <td className="px-3 py-2.5">
                          <p className="font-medium text-gray-800 truncate max-w-[140px]">{entry.farmerName || '—'}</p>
                          <p className="text-[10px] text-gray-400 truncate">{entry.farmerMobile}</p>
                        </td>
                        <td className="px-3 py-2.5 hidden sm:table-cell">
                          <span className="flex items-center gap-1 text-gray-500 truncate max-w-[160px]">
                            <MapPin className="w-3 h-3 shrink-0 text-[#15803d]" />
                            {[entry.district, entry.upazila].filter(Boolean).join(', ') || '—'}
                          </span>
                        </td>
                        <td className="px-3 py-2.5 text-center">
                          <span className="font-bold text-gray-700">{toBnNum(total)}</span>
                        </td>
                        <td className="px-3 py-2.5 text-center hidden sm:table-cell">
                          <span className={`inline-block px-2 py-0.5 rounded-full text-[10px] font-medium ${entry._source === 'local' ? 'bg-orange-50 text-orange-600 border border-orange-200' : 'bg-blue-50 text-blue-600 border border-blue-200'}`}>
                            {entry._source === 'local' ? 'স্থানীয়' : 'জাতীয়'}
                          </span>
                        </td>
                        <td className="px-3 py-2.5 text-center">
                          <button type="button" onClick={() => setExpandedRow(isExpanded ? null : rowKey)} className="p-1 rounded hover:bg-gray-100 transition cursor-pointer">
                            {isExpanded ? <ChevronUp className="w-4 h-4 text-gray-400" /> : <ChevronDown className="w-4 h-4 text-gray-400" />}
                          </button>
                        </td>
                      </tr>
                      {isExpanded && (
                        <tr key={`${entry.id}-detail`}>
                          <td colSpan={5} className="px-4 py-3 bg-gray-50/70 border-b border-gray-100">
                            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-[11px]">
                              <div><span className="text-gray-400 block">অঞ্চল</span><span className="font-medium text-gray-700">{entry.region || '—'}</span></div>
                              <div><span className="text-gray-400 block">জেলা</span><span className="font-medium text-gray-700">{entry.district || '—'}</span></div>
                              <div><span className="text-gray-400 block">উপজেলা</span><span className="font-medium text-gray-700">{entry.upazila || '—'}</span></div>
                              <div><span className="text-gray-400 block">তারিখ</span><span className="font-medium text-gray-700">{entry.submittedAt ? new Date(entry.submittedAt).toLocaleDateString('bn-BD') : '—'}</span></div>
                              {entry._source === 'local' && (
                                <>
                                  <div className="rounded-lg bg-orange-50 border border-orange-100 px-2 py-1.5 text-center col-span-1"><span className="text-[10px] text-orange-500 block">ফলদ</span><span className="font-bold text-orange-700">{toBnNum(counts.fruit)}</span></div>
                                  <div className="rounded-lg bg-green-50 border border-green-100 px-2 py-1.5 text-center col-span-1"><span className="text-[10px] text-green-500 block">বনজ</span><span className="font-bold text-green-700">{toBnNum(counts.forest)}</span></div>
                                  <div className="rounded-lg bg-blue-50 border border-blue-100 px-2 py-1.5 text-center col-span-1"><span className="text-[10px] text-blue-500 block">ঔষধি</span><span className="font-bold text-blue-700">{toBnNum(counts.medicinal)}</span></div>
                                  <div className="flex items-center justify-center"><span className="text-gray-400">মোট: <span className="font-bold text-gray-700">{toBnNum(total)}</span></span></div>
                                </>
                              )}
                            </div>
                          </td>
                        </tr>
                      )}
                    </>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

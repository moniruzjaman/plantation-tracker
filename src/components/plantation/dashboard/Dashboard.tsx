import { useState, useMemo, useCallback, type ReactNode } from 'react';
import {    Database,    Leaf,    TreePine,    Users,    Sprout,    Globe,    MapPin,    BarChart3,    TrendingUp,    Filter,    RotateCcw,    FileSpreadsheet,    FileText,    Printer,    ChevronDown,    Building2,} from 'lucide-react';
import type { Submission } from '../../OfflinePlantationDashboard';
import { countSeedlings } from '../../../types/plantation';
import { BD, BD_UPAZILA } from '../../../data/adminData';
import { toBnNum } from '../../../utils/geoUtils';

/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */

interface Profile {
  name?: string;
  mobile?: string;
  region?: string;
  district?: string;
  upazila?: string;
  designation?: string;
  officerName?: string;
  officerMobile?: string;
}

interface DashboardProps {
  submissions: Submission[];
  nationalEntries?: any[];
  language?: 'bn' | 'en';
}

/** Normalised row used internally for stats & table rendering. */
interface NormalisedEntry {
  id: string;
  source: 'local' | 'national';
  region: string;
  division: string;
  district: string;
  upazila: string;
  village: string;
  farmerName: string;
  farmerMobile: string;
  officerName: string;
  officerMobile: string;
  species: string;
  fruit: number;
  forest: number;
  medicinal: number;
  total: number;
  date: string;
  geoLocation: string;
  remarks: string;
  sourceType: string;
}

/* ------------------------------------------------------------------ */
/*  Helpers                                                            */
/* ------------------------------------------------------------------ */

/** Extract seedling counts from either v2 flat array or v1 legacy arrays. */
function getSeedlingCounts(s: Submission | any): { fruit: number; forest: number; medicinal: number; total: number; species: string } {
  let fruit = 0;
  let forest = 0;
  let medicinal = 0;
  let speciesList: string[] = [];

  // Try v2 flat seedlings array first
  if (Array.isArray(s.seedlings) && s.seedlings.length > 0) {
    s.seedlings.forEach((item: any) => {
      const qty = parseInt(String(item.quantity), 10) || 0;
      const cat = (item.category || '').trim();
      const name = (item.speciesName || item.name || '').trim();
      if (name) speciesList.push(name);
      if (cat.indexOf('ফল') === 0 || cat === 'fruit') fruit += qty;
      else if (cat.indexOf('বন') === 0 || cat === 'forest') forest += qty;
      else if (cat.indexOf('ঔষ') === 0 || cat === 'medicinal') medicinal += qty;
      else fruit += qty;
    });
  } else {
    // v1 legacy — try countSeedlings if the shape matches LocalSubmission
    try {
      const counts = countSeedlings(s as any);
      fruit = counts.fruit;
      forest = counts.forest;
      medicinal = counts.medicinal;
    } catch {
      /* fall through to manual parse */
      const sumArr = (arr: any[]) =>
        (arr || []).reduce((sum: number, e: any) => {
          const c = parseInt(String(e.count ?? e.quantity), 10) || 0;
          const g = parseInt(String(e.graftingCount ?? e.gcount), 10) || 0;
          return sum + c + g;
        }, 0);
      fruit = sumArr(s.fruitSeedlings);
      forest = sumArr(s.forestSeedlings);
      medicinal = sumArr(s.medicinalSeedlings);
    }
    // Species from legacy arrays
    (s.fruitSeedlings || []).forEach((e: any) => { if (e.name) speciesList.push(e.name); });
    (s.forestSeedlings || []).forEach((e: any) => { if (e.name) speciesList.push(e.name); });
    (s.medicinalSeedlings || []).forEach((e: any) => { if (e.name) speciesList.push(e.name); });
  }

  const species = speciesList.length > 0 ? speciesList.join(', ') : (s.species || s.speciesName || '');
  return { fruit, forest, medicinal, total: fruit + forest + medicinal, species };
}

/** Try to find the division for a given district. */
function findDivision(district: string): string {
  if (!district) return '';
  for (const [div, districts] of Object.entries(BD)) {
    if (districts.includes(district)) return div;
  }
  return '';
}

/** Normalise a local Submission into a common shape. */
function normaliseLocal(s: Submission): NormalisedEntry {
  const counts = getSeedlingCounts(s);
  const geo = s.geoLocation || (s.latitude && s.longitude ? `${s.latitude}, ${s.longitude}` : '');
  return {
    id: s.id || s.submissionId || String(Math.random()),
    source: 'local',
    region: s.region || '',
    division: s.division || findDivision(s.district) || '',
    district: s.district || '',
    upazila: s.upazila || '',
    village: s.village || '',
    farmerName: s.farmerName || s.nurseryName || '',
    farmerMobile: s.farmerMobile || s.mobile || '',
    officerName: s.officerName || s.saaoName || s.caretakerName || '',
    officerMobile: s.officerMobile || s.saaoMobile || s.caretakerMobile || '',
    species: counts.species,
    fruit: counts.fruit,
    forest: counts.forest,
    medicinal: counts.medicinal,
    total: counts.total,
    date: s.submittedAt || s.plantingDate || '',
    geoLocation: geo,
    remarks: s.remarks || '',
    sourceType: (s as any).sourceType || '',
  };
}

/** Normalise a national entry into a common shape. */
function normaliseNational(n: any): NormalisedEntry {
  const counts = getSeedlingCounts(n);
  const geo = n.geoLocation || n.coordinates || (n.latitude && n.longitude ? `${n.latitude}, ${n.longitude}` : '');
  return {
    id: n.id || n.submissionId || String(Math.random()),
    source: 'national',
    region: n.region || '',
    division: n.division || findDivision(n.district) || '',
    district: n.district || '',
    upazila: n.upazila || '',
    village: n.village || '',
    farmerName: n.farmerName || n.nurseryName || '',
    farmerMobile: n.farmerMobile || n.mobile || '',
    officerName: n.officerName || n.saaoName || '',
    officerMobile: n.officerMobile || n.saaoMobile || '',
    species: counts.species,
    fruit: counts.fruit,
    forest: counts.forest,
    medicinal: counts.medicinal,
    total: counts.total,
    date: n.submittedAt || n.plantingDate || '',
    geoLocation: geo,
    remarks: n.remarks || '',
    sourceType: n.sourceType || '',
  };
}

/** Escape CSV cell. */
function csvCell(v: string): string {
  const s = String(v ?? '').replace(/"/g, '""');
  return s.includes(',') || s.includes('\n') || s.includes('"') ? `"${s}"` : s;
}

/* ------------------------------------------------------------------ */
/*  Component                                                          */
/* ------------------------------------------------------------------ */

export default function Dashboard({ submissions, nationalEntries = [], language = 'bn' }: DashboardProps) {
  /* ---- Filter State ---- */
  const [filterDivision, setFilterDivision] = useState('');
  const [filterDistrict, setFilterDistrict] = useState('');
  const [filterUpazila, setFilterUpazila] = useState('');
  const [filterDateFrom, setFilterDateFrom] = useState('');
  const [filterDateTo, setFilterDateTo] = useState('');
  const [filterSource, setFilterSource] = useState('');
  const [tableView, setTableView] = useState<'gov' | 'general'>('general');

  /* ---- Derive available cascading options ---- */
  const divisions = useMemo(() => Object.keys(BD), []);
  const districtsForDivision = useMemo(
    () => (filterDivision ? BD[filterDivision] || [] : []),
    [filterDivision],
  );
  const allDistricts = useMemo(
    () => Array.from(new Set(Object.values(BD).flat())).sort(),
    [],
  );
  const upazilasForDistrict = useMemo(
    () => (filterDistrict ? BD_UPAZILA[filterDistrict] || [] : []),
    [filterDistrict],
  );

  /* ---- Normalise all entries ---- */
  const allEntries: NormalisedEntry[] = useMemo(() => {
    const locals = (submissions || []).map(normaliseLocal);
    const nationals = (nationalEntries || []).map(normaliseNational);
    return [...locals, ...nationals];
  }, [submissions, nationalEntries]);

  /* ---- Apply filters ---- */
  const filtered = useMemo(() => {
    return allEntries.filter((e) => {
      if (filterDivision && e.division !== filterDivision) return false;
      if (filterDistrict && e.district !== filterDistrict) return false;
      if (filterUpazila && e.upazila !== filterUpazila) return false;
      if (filterSource) {
        if (filterSource === 'local' && e.source !== 'local') return false;
        if (filterSource === 'national' && e.source !== 'national') return false;
      }
      if (filterDateFrom && e.date) {
        try {
          const d = new Date(e.date).getTime();
          if (d < new Date(filterDateFrom).getTime()) return false;
        } catch { /* ignore parse errors */ }
      }
      if (filterDateTo && e.date) {
        try {
          const d = new Date(e.date).getTime();
          if (d > new Date(filterDateTo).getTime() + 86399999) return false;
        } catch { /* ignore */ }
      }
      return true;
    });
  }, [allEntries, filterDivision, filterDistrict, filterUpazila, filterDateFrom, filterDateTo, filterSource]);

  /* ---- Reset ---- */
  const resetFilters = useCallback(() => {
    setFilterDivision('');
    setFilterDistrict('');
    setFilterUpazila('');
    setFilterDateFrom('');
    setFilterDateTo('');
    setFilterSource('');
  }, []);

  /* ---- Cascade resets ---- */
  const handleDivisionChange = useCallback((v: string) => {
    setFilterDivision(v);
    setFilterDistrict('');
    setFilterUpazila('');
  }, []);
  const handleDistrictChange = useCallback((v: string) => {
    setFilterDistrict(v);
    setFilterUpazila('');
  }, []);

  /* ================================================================== */
  /*  COMPUTED STATISTICS                                                */
  /* ================================================================== */

  const stats = useMemo(() => {
    const localCount = allEntries.filter((e) => e.source === 'local').length;
    const nationalCount = allEntries.filter((e) => e.source === 'national').length;
    const totalCount = allEntries.length;
    const filteredCount = filtered.length;

    const nurseries = new Set<string>();
    const officers = new Set<string>();
    const speciesSet = new Set<string>();
    const districtSet = new Set<string>();
    const upazilaSet = new Set<string>();
    let totalSeedlings = 0;
    let maxEntry = 0;

    filtered.forEach((e) => {
      const name = e.farmerName.trim();
      if (name) nurseries.add(name);
      const off = e.officerName.trim();
      if (off) officers.add(off);
      if (e.species) {
        e.species.split(',').forEach((s) => {
          const t = s.trim();
          if (t) speciesSet.add(t);
        });
      }
      if (e.district) districtSet.add(e.district);
      if (e.upazila) upazilaSet.add(e.upazila);
      totalSeedlings += e.total;
      if (e.total > maxEntry) maxEntry = e.total;
    });

    const avgSeedlings = filteredCount > 0 ? Math.round(totalSeedlings / filteredCount) : 0;
    const coverage = `${districtSet.size}/${upazilaSet.size}`;

    return {
      totalCount,
      localCount,
      nationalCount,
      filteredCount,
      nurseries: nurseries.size,
      officers: officers.size,
      totalSeedlings,
      species: speciesSet.size,
      coverage,
      avgSeedlings,
      maxEntry,
    };
  }, [allEntries, filtered]);

  /* ---- Category totals ---- */
  const categoryTotals = useMemo(() => {
    let fruit = 0;
    let forest = 0;
    let medicinal = 0;
    filtered.forEach((e) => {
      fruit += e.fruit;
      forest += e.forest;
      medicinal += e.medicinal;
    });
    return { fruit, forest, medicinal, total: fruit + forest + medicinal };
  }, [filtered]);

  /* ---- Division stats for bar chart ---- */
  const divisionStats = useMemo(() => {
    const map: Record<string, { entries: number; seedlings: number }> = {};
    filtered.forEach((e) => {
      const div = e.division || e.region || 'অজানা';
      if (!map[div]) map[div] = { entries: 0, seedlings: 0 };
      map[div].entries += 1;
      map[div].seedlings += e.total;
    });
    return Object.entries(map)
      .sort((a, b) => b[1].seedlings - a[1].seedlings)
      .slice(0, 8);
  }, [filtered]);

  /* ---- Top districts by seedlings ---- */
  const topDistricts = useMemo(() => {
    const map: Record<string, number> = {};
    filtered.forEach((e) => {
      if (e.district) map[e.district] = (map[e.district] || 0) + e.total;
    });
    return Object.entries(map)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 12);
  }, [filtered]);

  /* ---- Top 10 species ---- */
  const topSpecies = useMemo(() => {
    const map: Record<string, number> = {};
    filtered.forEach((e) => {
      if (e.species) {
        e.species.split(',').forEach((s) => {
          const t = s.trim();
          if (t) map[t] = (map[t] || 0) + e.total;
        });
      }
    });
    return Object.entries(map)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 10);
  }, [filtered]);

  /* ---- Doughnut data ---- */
  const doughnutData = useMemo(() => {
    const total = categoryTotals.total || 1;
    const fruitPct = (categoryTotals.fruit / total) * 100;
    const forestPct = (categoryTotals.forest / total) * 100;
    const medicinalPct = (categoryTotals.medicinal / total) * 100;
    return { fruitPct, forestPct, medicinalPct };
  }, [categoryTotals]);

  /* ================================================================== */
  /*  EXPORT HANDLERS                                                    */
  /* ================================================================== */

  const exportCSV = useCallback(() => {
    const isGov = tableView === 'gov';
    const header = isGov
      ? ['ক্র.নং', 'জেলা/উপজেলা/গ্রাম', 'প্রজাতি', 'সংখ্যা', 'তারিখ', 'জিও কোঅর্ডিনেট', 'অফিসার', 'মন্তব্য']
      : ['ক্রম', 'অঞ্চল', 'জেলা', 'উপজেলা', 'রোপণকারী', 'মোবাইল', 'ফলদ', 'বনজ', 'ঔষধি', 'মোট', 'তারিখ'];
    const rows = filtered.map((e, i) =>
      isGov
        ? [
            toBnNum(i + 1),
            [e.district, e.upazila, e.village].filter(Boolean).join('/'),
            e.species,
            toBnNum(e.total),
            e.date ? new Date(e.date).toLocaleDateString('bn-BD') : '',
            e.geoLocation,
            e.officerName,
            e.remarks,
          ]
        : [
            toBnNum(i + 1),
            e.region,
            e.district,
            e.upazila,
            e.farmerName,
            e.farmerMobile,
            toBnNum(e.fruit),
            toBnNum(e.forest),
            toBnNum(e.medicinal),
            toBnNum(e.total),
            e.date ? new Date(e.date).toLocaleDateString('bn-BD') : '',
          ],
    );
    const csv = [header, ...rows].map((r) => r.map(csvCell).join(',')).join('\n');
    const bom = '\uFEFF';
    const blob = new Blob([bom + csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `plantation_dashboard_${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  }, [filtered, tableView]);

  const exportExcel = useCallback(() => {
    // Simple TSV-based XLS export (no external library needed)
    const isGov = tableView === 'gov';
    const header = isGov
      ? ['ক্র.নং', 'জেলা/উপজেলা/গ্রাম', 'প্রজাতি', 'সংখ্যা', 'তারিখ', 'জিও কোঅর্ডিনেট', 'অফিসার', 'মন্তব্য']
      : ['ক্রম', 'অঞ্চল', 'জেলা', 'উপজেলা', 'রোপণকারী', 'মোবাইল', 'ফলদ', 'বনজ', 'ঔষধি', 'মোট', 'তারিখ'];
    const rows = filtered.map((e, i) =>
      isGov
        ? [
            toBnNum(i + 1),
            [e.district, e.upazila, e.village].filter(Boolean).join('/'),
            e.species,
            e.total,
            e.date ? new Date(e.date).toLocaleDateString('bn-BD') : '',
            e.geoLocation,
            e.officerName,
            e.remarks,
          ]
        : [
            i + 1,
            e.region,
            e.district,
            e.upazila,
            e.farmerName,
            e.farmerMobile,
            e.fruit,
            e.forest,
            e.medicinal,
            e.total,
            e.date ? new Date(e.date).toLocaleDateString('bn-BD') : '',
          ],
    );
    const tsv = [header, ...rows].map((r) => r.map((c) => String(c).replace(/\t/g, ' ')).join('\t')).join('\n');
    const bom = '\uFEFF';
    const blob = new Blob([bom + tsv], { type: 'application/vnd.ms-excel;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `plantation_dashboard_${new Date().toISOString().slice(0, 10)}.xls`;
    a.click();
    URL.revokeObjectURL(url);
  }, [filtered, tableView]);

  const handlePrint = useCallback(() => {
    window.print();
  }, []);

  /* ================================================================== */
  /*  SELECT STYLES                                                      */
  /* ================================================================== */

  const selectCls =
    'text-xs border border-gray-200 rounded-lg px-2 py-1.5 bg-white text-gray-700 focus:outline-none focus:ring-1 focus:ring-green-400 focus:border-green-400 appearance-none cursor-pointer';
  const selectWrap = 'relative inline-flex items-center';
  const chevronCls = 'pointer-events-none absolute right-1.5 top-1/2 -translate-y-1/2 text-gray-400';
  const inputCls =
    'text-xs border border-gray-200 rounded-lg px-2 py-1.5 bg-white text-gray-700 focus:outline-none focus:ring-1 focus:ring-green-400 focus:border-green-400';

  /* ================================================================== */
  /*  RENDER                                                             */
  /* ================================================================== */

  const bn = language === 'bn';

  return (
    <div className="w-full max-w-7xl mx-auto space-y-4 p-2 sm:p-4 print:p-0">
      {/* ==================== DATA SOURCE NOTE ==================== */}
      <div className="flex items-center justify-between flex-wrap gap-2">
        <div className="text-xs text-gray-500 bg-green-50 border border-green-100 rounded-lg px-3 py-1.5">
          <Database className="w-3.5 h-3.5 inline mr-1 text-green-600" />
          {toBnNum(stats.nationalCount)} {bn ? 'জাতীয়' : 'national'} + {toBnNum(stats.localCount)} {bn ? 'লোকাল' : 'local'} {bn ? 'এন্ট্রি' : 'entries'}
          {filterDivision || filterDistrict || filterUpazila || filterDateFrom || filterDateTo || filterSource ? (
            <span className="text-green-700 font-semibold ml-2">
              — {toBnNum(stats.filteredCount)} {bn ? 'ফিল্টারড' : 'filtered'}
            </span>
          ) : null}
        </div>
        <div className="flex items-center gap-1.5">
          <button onClick={exportExcel} className="inline-flex items-center gap-1 text-[11px] bg-white border border-gray-200 rounded-lg px-2.5 py-1.5 hover:bg-green-50 hover:border-green-300 transition-colors cursor-pointer" title="Excel Export">
            <FileSpreadsheet className="w-3.5 h-3.5 text-green-600" />
            <span className="hidden sm:inline">📊 {bn ? 'এক্সেল এক্সপোর্ট' : 'Excel Export'}</span>
          </button>
          <button onClick={exportCSV} className="inline-flex items-center gap-1 text-[11px] bg-white border border-gray-200 rounded-lg px-2.5 py-1.5 hover:bg-blue-50 hover:border-blue-300 transition-colors cursor-pointer" title="CSV Export">
            <FileText className="w-3.5 h-3.5 text-blue-600" />
            <span className="hidden sm:inline">📄 {bn ? 'সিএসভি এক্সপোর্ট' : 'CSV Export'}</span>
          </button>
          <button onClick={handlePrint} className="inline-flex items-center gap-1 text-[11px] bg-white border border-gray-200 rounded-lg px-2.5 py-1.5 hover:bg-gray-50 hover:border-gray-300 transition-colors cursor-pointer" title="Print">
            <Printer className="w-3.5 h-3.5 text-gray-600" />
            <span className="hidden sm:inline">🖨️ {bn ? 'প্রিন্ট' : 'Print'}</span>
          </button>
        </div>
      </div>

      {/* ==================== STATS CARDS ==================== */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
        <StatCard icon={<Database className="w-4 h-4" />} label={bn ? 'মোট এন্ট্রি' : 'Total Entries'} value={toBnNum(stats.totalCount)} color="text-blue-600" />
        <StatCard icon={<Globe className="w-4 h-4" />} label={bn ? 'এই ডিভাইস:' : 'This Device'} value={toBnNum(stats.localCount)} color="text-cyan-600" />
        <StatCard icon={<TreePine className="w-4 h-4" />} label={bn ? 'নার্সারি সংখ্যা' : 'Nurseries'} value={toBnNum(stats.nurseries)} color="text-emerald-600" />
        <StatCard icon={<Users className="w-4 h-4" />} label={bn ? 'কর্মকর্তা' : 'Officers'} value={toBnNum(stats.officers)} color="text-purple-600" />
        <StatCard icon={<Sprout className="w-4 h-4" />} label={bn ? 'মোট চারা' : 'Total Seedlings'} value={toBnNum(stats.totalSeedlings)} color="text-green-600" />
        <StatCard icon={<Leaf className="w-4 h-4" />} label={bn ? 'প্রজাতি' : 'Species'} value={toBnNum(stats.species)} color="text-lime-600" />
        <StatCard icon={<MapPin className="w-4 h-4" />} label={bn ? 'জেলা/উপজেলা' : 'District/Upazila'} value={stats.coverage} color="text-orange-600" />
        <StatCard icon={<BarChart3 className="w-4 h-4" />} label={bn ? 'গড় চারা' : 'Avg Seedlings'} value={toBnNum(stats.avgSeedlings)} color="text-indigo-600" />
        <StatCard icon={<TrendingUp className="w-4 h-4" />} label={bn ? 'সর্বোচ্চ এন্ট্রি' : 'Max Entry'} value={toBnNum(stats.maxEntry)} color="text-rose-600" />
      </div>

      {/* ==================== FILTER CONTROLS ==================== */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-3">
        <div className="flex items-center gap-2 mb-2.5">
          <Filter className="w-4 h-4 text-green-600" />
          <span className="text-xs font-semibold text-gray-700">{bn ? 'ফিল্টার' : 'Filters'}</span>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2 items-end">
          {/* Division */}
          <div>
            <label className="block text-[10px] text-gray-500 mb-0.5">{bn ? 'বিভাগ' : 'Division'}</label>
            <div className={selectWrap}>
              <select className={selectCls + ' w-full pr-6'} value={filterDivision} onChange={(e) => handleDivisionChange(e.target.value)}>
                <option value="">{bn ? 'সকল বিভাগ' : 'All Divisions'}</option>
                {divisions.map((d) => (
                  <option key={d} value={d}>{d}</option>
                ))}
              </select>
              <ChevronDown className={`w-3.5 h-3.5 ${chevronCls}`} />
            </div>
          </div>
          {/* District */}
          <div>
            <label className="block text-[10px] text-gray-500 mb-0.5">{bn ? 'জেলা' : 'District'}</label>
            <div className={selectWrap}>
              <select className={selectCls + ' w-full pr-6'} value={filterDistrict} onChange={(e) => handleDistrictChange(e.target.value)} disabled={!filterDivision}>
                <option value="">{bn ? 'সকল জেলা' : 'All Districts'}</option>
                {districtsForDivision.map((d) => (
                  <option key={d} value={d}>{d}</option>
                ))}
              </select>
              <ChevronDown className={`w-3.5 h-3.5 ${chevronCls}`} />
            </div>
          </div>
          {/* Upazila */}
          <div>
            <label className="block text-[10px] text-gray-500 mb-0.5">{bn ? 'উপজেলা' : 'Upazila'}</label>
            <div className={selectWrap}>
              <select className={selectCls + ' w-full pr-6'} value={filterUpazila} onChange={(e) => setFilterUpazila(e.target.value)} disabled={!filterDistrict}>
                <option value="">{bn ? 'সকল উপজেলা' : 'All Upazilas'}</option>
                {upazilasForDistrict.map((u) => (
                  <option key={u} value={u}>{u}</option>
                ))}
              </select>
              <ChevronDown className={`w-3.5 h-3.5 ${chevronCls}`} />
            </div>
          </div>
          {/* Date From */}
          <div>
            <label className="block text-[10px] text-gray-500 mb-0.5">{bn ? 'তারিখ থেকে' : 'Date From'}</label>
            <input type="date" className={inputCls + ' w-full'} value={filterDateFrom} onChange={(e) => setFilterDateFrom(e.target.value)} />
          </div>
          {/* Date To */}
          <div>
            <label className="block text-[10px] text-gray-500 mb-0.5">{bn ? 'তারিখ পর্যন্ত' : 'Date To'}</label>
            <input type="date" className={inputCls + ' w-full'} value={filterDateTo} onChange={(e) => setFilterDateTo(e.target.value)} />
          </div>
          {/* Source + Reset */}
          <div className="flex items-end gap-1.5">
            <div className="flex-1">
              <label className="block text-[10px] text-gray-500 mb-0.5">{bn ? 'উৎস' : 'Source'}</label>
              <div className={selectWrap}>
                <select className={selectCls + ' w-full pr-6'} value={filterSource} onChange={(e) => setFilterSource(e.target.value)}>
                  <option value="">{bn ? 'সকল' : 'All'}</option>
                  <option value="local">{bn ? 'লোকাল' : 'Local'}</option>
                  <option value="national">{bn ? 'জাতীয়' : 'National'}</option>
                </select>
                <ChevronDown className={`w-3.5 h-3.5 ${chevronCls}`} />
              </div>
            </div>
            <button
              onClick={resetFilters}
              className="inline-flex items-center gap-1 text-[11px] bg-gray-100 hover:bg-red-50 text-gray-600 hover:text-red-600 border border-gray-200 hover:border-red-200 rounded-lg px-2.5 py-1.5 transition-colors cursor-pointer whitespace-nowrap"
            >
              <RotateCcw className="w-3 h-3" />
              {bn ? 'রিসেট' : 'Reset'}
            </button>
          </div>
        </div>
      </div>

      {/* ==================== CHARTS ROW 1 ==================== */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Division Bar Chart */}
        <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-gray-100 p-4">
          <h3 className="text-xs font-semibold text-gray-700 mb-3 flex items-center gap-1.5">
            <BarChart3 className="w-3.5 h-3.5 text-green-600" />
            {bn ? 'বিভাগভিত্তিক এন্ট্রি ও চারা' : 'Division-wise Entries & Seedlings'}
          </h3>
          <DivisionBarChart data={divisionStats} toBn={toBnNum} bn={bn} />
        </div>
        {/* Category Doughnut */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
          <h3 className="text-xs font-semibold text-gray-700 mb-3 flex items-center gap-1.5">
            <Leaf className="w-3.5 h-3.5 text-green-600" />
            {bn ? 'প্রজাতির বিভাজন' : 'Category Breakdown'}
          </h3>
          <CategoryDoughnut
            data={doughnutData}
            totals={categoryTotals}
            toBn={toBnNum}
            bn={bn}
          />
        </div>
      </div>

      {/* ==================== CHARTS ROW 2 ==================== */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Top Districts Horizontal Bar */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
          <h3 className="text-xs font-semibold text-gray-700 mb-3 flex items-center gap-1.5">
            <MapPin className="w-3.5 h-3.5 text-green-600" />
            {bn ? 'শীর্ষ ১২ জেলা (চারা সংখ্যা)' : 'Top 12 Districts (Seedlings)'}
          </h3>
          <HorizontalBarChart data={topDistricts} toBn={toBnNum} bn={bn} barColor="#15803d" />
        </div>
        {/* Top Species Horizontal Bar */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
          <h3 className="text-xs font-semibold text-gray-700 mb-3 flex items-center gap-1.5">
            <Sprout className="w-3.5 h-3.5 text-green-600" />
            {bn ? 'শীর্ষ ১০ প্রজাতি' : 'Top 10 Species'}
          </h3>
          <HorizontalBarChart data={topSpecies} toBn={toBnNum} bn={bn} barColor="#0284c7" />
        </div>
      </div>

      {/* ==================== DATA TABLE ==================== */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        {/* Table View Toggle */}
        <div className="flex items-center gap-2 p-3 border-b border-gray-100">
          <button
            onClick={() => setTableView('gov')}
            className={`text-xs px-3 py-1.5 rounded-lg font-medium transition-colors cursor-pointer ${tableView === 'gov' ? 'bg-[#0284c7] text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
          >
            🏛️ {bn ? 'সরকারি ছক ভিউ' : 'Government View'}
          </button>
          <button
            onClick={() => setTableView('general')}
            className={`text-xs px-3 py-1.5 rounded-lg font-medium transition-colors cursor-pointer ${tableView === 'general' ? 'bg-[#15803d] text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
          >
            📦 {bn ? 'সাধারণ ভিউ' : 'General View'}
          </button>
          <span className="ml-auto text-[10px] text-gray-400">
            {toBnNum(filtered.length)} {bn ? 'টি এন্ট্রি' : 'entries'}
          </span>
        </div>

        {/* Table Container */}
        <div className="overflow-x-auto max-h-[480px] overflow-y-auto">
          {tableView === 'gov' ? (
            <table className="w-full text-xs">
              <thead className="sticky top-0 z-10">
                <tr className="bg-[#0284c7] text-white">
                  <th className="px-2 py-2 text-left whitespace-nowrap font-medium">{bn ? 'ক্র.নং' : 'SL'}</th>
                  <th className="px-2 py-2 text-left whitespace-nowrap font-medium">{bn ? 'জেলা/উপজেলা/গ্রাম' : 'District/Upazila/Village'}</th>
                  <th className="px-2 py-2 text-left whitespace-nowrap font-medium">{bn ? 'প্রজাতি' : 'Species'}</th>
                  <th className="px-2 py-2 text-right whitespace-nowrap font-medium">{bn ? 'সংখ্যা' : 'Count'}</th>
                  <th className="px-2 py-2 text-left whitespace-nowrap font-medium">{bn ? 'তারিখ' : 'Date'}</th>
                  <th className="px-2 py-2 text-left whitespace-nowrap font-medium">{bn ? 'জিও কোঅর্ডিনেট' : 'Geo Coord'}</th>
                  <th className="px-2 py-2 text-left whitespace-nowrap font-medium">{bn ? 'অফিসার' : 'Officer'}</th>
                  <th className="px-2 py-2 text-left whitespace-nowrap font-medium">{bn ? 'মন্তব্য' : 'Remarks'}</th>
                </tr>
              </thead>
              <tbody>
                {filtered.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="text-center py-8 text-gray-400">
                      {bn ? 'কোনো ডাটা নেই' : 'No data'}
                    </td>
                  </tr>
                ) : (
                  filtered.map((e, i) => (
                    <tr key={e.id + i} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                      <td className="px-2 py-1.5 text-gray-500">{toBnNum(i + 1)}</td>
                      <td className="px-2 py-1.5 text-gray-700 whitespace-nowrap">
                        {[e.district, e.upazila, e.village].filter(Boolean).join(' / ')}
                      </td>
                      <td className="px-2 py-1.5 text-gray-700 max-w-[140px] truncate">{e.species}</td>
                      <td className="px-2 py-1.5 text-right font-semibold text-green-700">{toBnNum(e.total)}</td>
                      <td className="px-2 py-1.5 text-gray-500 whitespace-nowrap">
                        {e.date ? new Date(e.date).toLocaleDateString('bn-BD') : ''}
                      </td>
                      <td className="px-2 py-1.5 text-gray-500 whitespace-nowrap font-mono text-[10px]">{e.geoLocation || '-'}</td>
                      <td className="px-2 py-1.5 text-gray-700 whitespace-nowrap">{e.officerName || '-'}</td>
                      <td className="px-2 py-1.5 text-gray-500 max-w-[100px] truncate">{e.remarks || '-'}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          ) : (
            <table className="w-full text-xs">
              <thead className="sticky top-0 z-10">
                <tr className="bg-[#f0fdf4] text-gray-700">
                  <th className="px-2 py-2 text-left whitespace-nowrap font-medium">{bn ? 'ক্রম' : 'SL'}</th>
                  <th className="px-2 py-2 text-left whitespace-nowrap font-medium">{bn ? 'অঞ্চল' : 'Region'}</th>
                  <th className="px-2 py-2 text-left whitespace-nowrap font-medium">{bn ? 'জেলা' : 'District'}</th>
                  <th className="px-2 py-2 text-left whitespace-nowrap font-medium">{bn ? 'উপজেলা' : 'Upazila'}</th>
                  <th className="px-2 py-2 text-left whitespace-nowrap font-medium">{bn ? 'রোপণকারী' : 'Planter'}</th>
                  <th className="px-2 py-2 text-left whitespace-nowrap font-medium">{bn ? 'মোবাইল' : 'Mobile'}</th>
                  <th className="px-2 py-2 text-right whitespace-nowrap font-medium text-orange-700">{bn ? 'ফলদ' : 'Fruit'}</th>
                  <th className="px-2 py-2 text-right whitespace-nowrap font-medium text-green-700">{bn ? 'বনজ' : 'Forest'}</th>
                  <th className="px-2 py-2 text-right whitespace-nowrap font-medium text-blue-700">{bn ? 'ঔষধি' : 'Medicinal'}</th>
                  <th className="px-2 py-2 text-right whitespace-nowrap font-bold text-gray-800">{bn ? 'মোট' : 'Total'}</th>
                  <th className="px-2 py-2 text-left whitespace-nowrap font-medium">{bn ? 'তারিখ' : 'Date'}</th>
                </tr>
              </thead>
              <tbody>
                {filtered.length === 0 ? (
                  <tr>
                    <td colSpan={11} className="text-center py-8 text-gray-400">
                      {bn ? 'কোনো ডাটা নেই' : 'No data'}
                    </td>
                  </tr>
                ) : (
                  filtered.map((e, i) => (
                    <tr key={e.id + i} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                      <td className="px-2 py-1.5 text-gray-500">{toBnNum(i + 1)}</td>
                      <td className="px-2 py-1.5 text-gray-700 whitespace-nowrap">{e.region || '-'}</td>
                      <td className="px-2 py-1.5 text-gray-700 whitespace-nowrap">{e.district || '-'}</td>
                      <td className="px-2 py-1.5 text-gray-700 whitespace-nowrap">{e.upazila || '-'}</td>
                      <td className="px-2 py-1.5 text-gray-700 whitespace-nowrap">{e.farmerName || '-'}</td>
                      <td className="px-2 py-1.5 text-gray-500 whitespace-nowrap">{e.farmerMobile || '-'}</td>
                      <td className="px-2 py-1.5 text-right font-medium text-orange-700">{toBnNum(e.fruit)}</td>
                      <td className="px-2 py-1.5 text-right font-medium text-green-700">{toBnNum(e.forest)}</td>
                      <td className="px-2 py-1.5 text-right font-medium text-blue-700">{toBnNum(e.medicinal)}</td>
                      <td className="px-2 py-1.5 text-right font-bold text-gray-800">{toBnNum(e.total)}</td>
                      <td className="px-2 py-1.5 text-gray-500 whitespace-nowrap">
                        {e.date ? new Date(e.date).toLocaleDateString('bn-BD') : ''}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}

/* ==================================================================== */
/*  Sub-components                                                       */
/* ==================================================================== */

/* ---------- Stat Card ---------- */
function StatCard({ icon, label, value, color }: { icon: ReactNode; label: string; value: string; color: string }) {
  return (
    <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-4 flex flex-col items-center justify-center text-center gap-1">
      <div className={`${color} mb-0.5`}>{icon}</div>
      <span className="text-[10px] text-gray-500 font-medium leading-tight">{label}</span>
      <span className="text-lg font-bold text-gray-800 leading-tight">{value}</span>
    </div>
  );
}

/* ---------- Division Grouped Bar Chart ---------- */
function DivisionBarChart({
  data,
  toBn,
  bn,
}: {
  data: [string, { entries: number; seedlings: number }][];
  toBn: (n: number) => string;
  bn: boolean;
}) {
  if (data.length === 0) {
    return <div className="text-xs text-gray-400 text-center py-8">{bn ? 'কোনো ডাটা নেই' : 'No data'}</div>;
  }

  const maxEntries = Math.max(...data.map(([, v]) => v.entries), 1);
  const maxSeedlings = Math.max(...data.map(([, v]) => v.seedlings), 1);

  return (
    <div className="space-y-2">
      {data.map(([name, v]) => (
        <div key={name} className="flex items-center gap-2">
          {/* Label */}
          <span className="text-[11px] text-gray-600 w-20 shrink-0 truncate text-right" title={name}>
            {name}
          </span>
          {/* Bars */}
          <div className="flex-1 flex flex-col gap-0.5">
            {/* Entries bar */}
            <div className="flex items-center gap-1">
              <div className="h-3 bg-sky-400 rounded-sm transition-all duration-500" style={{ width: `${(v.entries / maxEntries) * 100}%`, minWidth: v.entries > 0 ? '4px' : '0' }} />
              <span className="text-[9px] text-gray-400 whitespace-nowrap">{toBn(v.entries)}</span>
            </div>
            {/* Seedlings bar */}
            <div className="flex items-center gap-1">
              <div className="h-3 bg-green-500 rounded-sm transition-all duration-500" style={{ width: `${(v.seedlings / maxSeedlings) * 100}%`, minWidth: v.seedlings > 0 ? '4px' : '0' }} />
              <span className="text-[9px] text-gray-400 whitespace-nowrap">{toBn(v.seedlings)}</span>
            </div>
          </div>
        </div>
      ))}
      {/* Legend */}
      <div className="flex items-center gap-4 pt-1 border-t border-gray-50">
        <span className="flex items-center gap-1 text-[10px] text-gray-500">
          <span className="w-3 h-2.5 rounded-sm bg-sky-400 inline-block" />
          {bn ? 'এন্ট্রি' : 'Entries'}
        </span>
        <span className="flex items-center gap-1 text-[10px] text-gray-500">
          <span className="w-3 h-2.5 rounded-sm bg-green-500 inline-block" />
          {bn ? 'চারা' : 'Seedlings'}
        </span>
      </div>
    </div>
  );
}

/* ---------- Category Doughnut (CSS conic-gradient) ---------- */
function CategoryDoughnut({
  data,
  totals,
  toBn,
  bn,
}: {
  data: { fruitPct: number; forestPct: number; medicinalPct: number };
  totals: { fruit: number; forest: number; medicinal: number; total: number };
  toBn: (n: number) => string;
  bn: boolean;
}) {
  const { fruitPct, forestPct, medicinalPct } = data;
  const gradient = `conic-gradient(
    #f97316 0% ${fruitPct}%,
    #15803d ${fruitPct}% ${fruitPct + forestPct}%,
    #2563eb ${fruitPct + forestPct}% ${fruitPct + forestPct + medicinalPct}%,
    #e5e7eb ${fruitPct + forestPct + medicinalPct}% 100%
  )`;

  const items = [
    { label: bn ? 'ফলদ' : 'Fruit', value: totals.fruit, pct: fruitPct, color: '#f97316' },
    { label: bn ? 'বনজ' : 'Forest', value: totals.forest, pct: forestPct, color: '#15803d' },
    { label: bn ? 'ঔষধি' : 'Medicinal', value: totals.medicinal, pct: medicinalPct, color: '#2563eb' },
  ];

  return (
    <div className="flex flex-col items-center gap-3">
      {/* Doughnut ring */}
      <div className="relative w-36 h-36">
        <div
          className="w-full h-full rounded-full"
          style={{ background: gradient }}
        />
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-20 h-20 bg-white rounded-full flex flex-col items-center justify-center shadow-inner">
            <span className="text-[10px] text-gray-400">{bn ? 'মোট' : 'Total'}</span>
            <span className="text-sm font-bold text-gray-800">{toBn(totals.total)}</span>
          </div>
        </div>
      </div>
      {/* Legend */}
      <div className="flex flex-col gap-1.5 w-full">
        {items.map((item) => (
          <div key={item.label} className="flex items-center justify-between text-[11px]">
            <span className="flex items-center gap-1.5 text-gray-600">
              <span className="w-2.5 h-2.5 rounded-full inline-block shrink-0" style={{ backgroundColor: item.color }} />
              {item.label}
            </span>
            <span className="text-gray-800 font-semibold">
              {toBn(item.value)}{' '}
              <span className="text-gray-400 font-normal">({item.pct.toFixed(1)}%)</span>
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ---------- Horizontal Bar Chart ---------- */
function HorizontalBarChart({
  data,
  toBn,
  bn,
  barColor,
}: {
  data: [string, number][];
  toBn: (n: number) => string;
  bn: boolean;
  barColor: string;
}) {
  if (data.length === 0) {
    return <div className="text-xs text-gray-400 text-center py-8">{bn ? 'কোনো ডাটা নেই' : 'No data'}</div>;
  }

  const maxVal = Math.max(...data.map(([, v]) => v), 1);

  return (
    <div className="space-y-1.5">
      {data.map(([label, value], idx) => (
        <div key={label + idx} className="flex items-center gap-2">
          <span className="text-[11px] text-gray-600 w-24 shrink-0 truncate text-right" title={label}>
            {label}
          </span>
          <div className="flex-1 flex items-center gap-1.5">
            <div className="h-4 rounded-sm transition-all duration-500" style={{ width: `${(value / maxVal) * 100}%`, minWidth: value > 0 ? '4px' : '0', backgroundColor: barColor, opacity: 0.85 - idx * 0.04 }} />
            <span className="text-[10px] text-gray-500 whitespace-nowrap font-medium">{toBn(value)}</span>
          </div>
        </div>
      ))}
    </div>
  );
}

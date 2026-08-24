import { useState, useEffect, useMemo } from 'react';
import { useMapData } from '../utils/useMapData';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Database, 
  Leaf, 
  BarChart3, 
  TrendingUp, 
  MapPin, 
  X, 
  Info,
  Clock,
  Globe2,
  Trees,
  Droplet,
  Download,
  Sprout,
  CalendarDays,
  Award
} from 'lucide-react';

export interface Seedling {
  name: string;
  age: string;
  count: string | number;
  graftingCount: string | number;
}

export interface FlatSeedling {
  speciesName: string;
  category: string;
  quantity: number;
}

export interface Submission {
  id: string;
  submissionId?: string;
  division?: string;
  region: string;
  district: string;
  upazila: string;
  union?: string;
  village?: string;
  locationType?: string;
  address?: string;
  geoLocation?: string;
  latitude?: string;
  longitude?: string;
  plantingDate?: string;
  submittedAt?: string;
  farmerName?: string;
  farmerMobile?: string;
  saaoName?: string;
  saaoMobile?: string;
  officerName?: string;
  officerMobile?: string;
  nurseryName?: string;
  mobile?: string;
  caretakerName?: string;
  caretakerMobile?: string;
  ndvi?: string;
  photoBase64?: string;
  remarks?: string;
  seedlings?: FlatSeedling[];
  fruitSeedlings?: Seedling[];
  forestSeedlings?: Seedling[];
  medicinalSeedlings?: Seedling[];
  synced?: boolean;
  syncedAt?: string;
}

interface OfflinePlantationDashboardProps {
  onStateChange?: (submissions: Submission[]) => void;
}

// Circular progress component
function CircularProgress({ 
  value, 
  max, 
  size = 80, 
  strokeWidth = 6, 
  color = '#15803d',
  label,
  sublabel 
}: { 
  value: number; 
  max: number; 
  size?: number; 
  strokeWidth?: number; 
  color?: string;
  label: string;
  sublabel?: string;
}) {
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const percent = max > 0 ? Math.min((value / max) * 100, 100) : 0;
  const strokeDashoffset = circumference - (percent / 100) * circumference;

  return (
    <div className="flex flex-col items-center">
      <svg width={size} height={size} className="-rotate-90">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="#e5e7eb"
          strokeWidth={strokeWidth}
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={color}
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          className="transition-all duration-700 ease-out"
        />
      </svg>
      <div className="absolute flex flex-col items-center justify-center" style={{ width: size, height: size }}>
        <span className="text-sm font-bold" style={{ color }}>{percent.toFixed(1)}%</span>
      </div>
      <span className="text-[10px] font-medium text-gray-600 mt-1 text-center">{label}</span>
      {sublabel && <span className="text-[9px] text-gray-400">{sublabel}</span>}
    </div>
  );
}

// Animated counter component
function AnimatedNumber({ value, duration = 800 }: { value: number; duration?: number }) {
  const [displayValue, setDisplayValue] = useState(0);

  useEffect(() => {
    const startTime = Date.now();
    const startValue = displayValue;
    const diff = value - startValue;

    const animate = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const easeOut = 1 - Math.pow(1 - progress, 3);
      setDisplayValue(Math.round(startValue + diff * easeOut));
      
      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };

    requestAnimationFrame(animate);
  }, [value, duration]);

  return <span>{displayValue.toLocaleString('en-US')}</span>;
}

export default function OfflinePlantationDashboard({ onStateChange }: OfflinePlantationDashboardProps = {}) {
  const { nationalEntries } = useMapData();
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [isExpanded, setIsExpanded] = useState<boolean>(false);
  const [language, setLanguage] = useState<'bn' | 'en'>('bn');
  const [lastUpdated, setLastUpdated] = useState<string>('');
  const [activeTab, setActiveTab] = useState<'overview' | 'activity' | 'impact'>('overview');

  useEffect(() => {
    if (onStateChange) {
      onStateChange(submissions);
    }
  }, [submissions, onStateChange]);

  const fetchSubmissions = () => {
    try {
      const dataStr = localStorage.getItem('plantation_submission');
      if (dataStr) {
        const parsed = JSON.parse(dataStr) as Submission[];
        if (Array.isArray(parsed)) {
          setSubmissions(parsed);
        }
      } else {
        setSubmissions([]);
      }
      setLastUpdated(new Date().toLocaleTimeString(language === 'bn' ? 'bn-BD' : 'en-US'));
    } catch (e) {
      console.error('Error reading submissions from localStorage:', e);
    }
  };

  useEffect(() => {
    fetchSubmissions();
    const interval = setInterval(fetchSubmissions, 1500);

    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'plantation_submission') {
        fetchSubmissions();
      }
    };
    window.addEventListener('storage', handleStorageChange);

    return () => {
      clearInterval(interval);
      window.removeEventListener('storage', handleStorageChange);
    };
  }, [language]);

  // Compute stats
  const totalLogs = submissions.length;
  
  const totalNationalSeedlings = nationalEntries.reduce((sum, entry) => {
    if (!Array.isArray(entry.seedlings)) return sum;
    return sum + entry.seedlings.reduce((entrySum, item) => {
      if (!item || typeof item !== 'object') return entrySum;
      const quantity = Number((item as { quantity?: unknown }).quantity);
      return Number.isFinite(quantity) ? entrySum + quantity : entrySum;
    }, 0);
  }, 0);

  let totalSeedlings = totalNationalSeedlings;
  let fruitCount = 0;
  let forestCount = 0;
  let medicinalCount = 0;
  let otherCount = 0;

  const districtMap: { [key: string]: number } = {};
  const upazilaMap: { [key: string]: number } = {};
  const speciesMap: { [key: string]: number } = {};
  const recentActivity: { date: string; count: number } = { date: '', count: 0 };
  const dailyActivity: { [key: string]: number } = {};

  submissions.forEach(s => {
    let f = 0, fo = 0, m = 0, o = 0;
    if (Array.isArray(s.seedlings) && s.seedlings.length) {
      s.seedlings.forEach(item => {
        const qty = parseInt(String(item.quantity)) || 0;
        const cat = (item.category || '').trim();
        const species = (item.speciesName || '').trim();
        
        if (cat.indexOf('ফল') === 0 || cat === 'fruit') f += qty;
        else if (cat.indexOf('বন') === 0 || cat === 'forest') fo += qty;
        else if (cat.indexOf('ঔষ') === 0 || cat === 'medicinal') m += qty;
        else { o += qty; f += qty; }
        
        if (species) {
          speciesMap[species] = (speciesMap[species] || 0) + qty;
        }
      });
    } else {
      const countCategory = (list?: Seedling[]) => {
        let sum = 0;
        if (list && Array.isArray(list)) {
          list.forEach(item => {
            sum += (parseInt(item.count as string) || 0) + (parseInt(item.graftingCount as string) || 0);
          });
        }
        return sum;
      };
      f = countCategory(s.fruitSeedlings);
      fo = countCategory(s.forestSeedlings);
      m = countCategory(s.medicinalSeedlings);
    }

    fruitCount += f;
    forestCount += fo;
    medicinalCount += m;
    otherCount += o;
    totalSeedlings += (f + fo + m + o);

    if (s.district) {
      districtMap[s.district] = (districtMap[s.district] || 0) + 1;
    }
    if (s.upazila) {
      upazilaMap[s.upazila] = (upazilaMap[s.upazila] || 0) + (f + fo + m + o);
    }

    const dateKey = s.submittedAt ? s.submittedAt.split('T')[0] : s.plantingDate || '';
    if (dateKey) {
      dailyActivity[dateKey] = (dailyActivity[dateKey] || 0) + 1;
    }
  });

  const sortedDistricts = Object.entries(districtMap)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5);

  const sortedUpazilas = Object.entries(upazilaMap)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5);

  const sortedSpecies = Object.entries(speciesMap)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5);

  const nationalGoal = 250000000;
  const nationalProgress = totalNationalSeedlings;
  const localProgress = totalSeedlings - totalNationalSeedlings;

  const estimatedCarbon = Math.round(totalSeedlings * 0.022);
  const waterSaved = Math.round(totalSeedlings * 50);

  const sortedDailyActivity = Object.entries(dailyActivity)
    .sort((a, b) => a[0].localeCompare(b[0]))
    .slice(-7);

  const toBnNum = (num: number): string => {
    if (language === 'en') return num.toLocaleString('en-US');
    const bnDigits = ['০', '১', '২', '৩', '৪', '৫', '৬', '৭', '৮', '৯'];
    return num.toString().replace(/\d/g, d => bnDigits[parseInt(d)]);
  };

  const formatNumber = (num: number): string => {
    if (num >= 10000000) return (num / 10000000).toFixed(1) + (language === 'bn' ? ' কোটি' : 'Cr');
    if (num >= 100000) return (num / 100000).toFixed(1) + (language === 'bn' ? ' লক্ষ' : 'L');
    return toBnNum(num);
  };

  const t = {
    title: language === 'bn' ? 'অফলাইন ট্র্যাকার' : 'Offline Tracker',
    dashboardTitle: language === 'bn' ? 'অফলাইন ডেটা ড্যাশবোর্ড' : 'Offline Data Dashboard',
    totalBatches: language === 'bn' ? 'মোট রেকর্ড' : 'Total Records',
    totalPlanted: language === 'bn' ? 'মোট চারা' : 'Total Seedlings',
    fruit: language === 'bn' ? 'ফলদ' : 'Fruit',
    forest: language === 'bn' ? 'বনজ' : 'Forest',
    medicinal: language === 'bn' ? 'ঔষধি' : 'Medicinal',
    regionalSpread: language === 'bn' ? 'জেলা অনুযায়ী' : 'District Breakdown',
    upazilaSpread: language === 'bn' ? 'উপজেলা অনুযায়ী' : 'Upazila Breakdown',
    speciesBreakdown: language === 'bn' ? 'প্রজাতি অনুযায়ী' : 'Species Breakdown',
    noData: language === 'bn' ? 'কোনো ডাটা পাওয়া যায়নি' : 'No records logged yet',
    syncTip: language === 'bn' ? 'সকল ডাটা আপনার ডিভাইসে নিরাপদে অফলাইনে সংরক্ষিত আছে।' : 'All data is securely saved offline in your browser.',
    btnToggle: language === 'bn' ? 'English' : 'বাংলা',
    lastSync: language === 'bn' ? 'আপডেট:' : 'Updated:',
    targetText: language === 'bn' ? 'জাতীয় লক্ষ্যমাত্রা' : 'National Goal',
    of: language === 'bn' ? 'এর মধ্যে' : 'of',
    overview: language === 'bn' ? 'সারসংক্ষেপ' : 'Overview',
    activity: language === 'bn' ? 'কার্যক্রম' : 'Activity',
    impact: language === 'bn' ? 'প্রভাব' : 'Impact',
    carbonSeq: language === 'bn' ? 'কার্বন সিকোয়েস্ট্রেশন' : 'Carbon Sequestration',
    waterSaved: language === 'bn' ? 'পানি সঞ্চয়' : 'Water Saved',
    nationalContribution: language === 'bn' ? 'জাতীয় অবদান' : 'National Contribution',
    localContribution: language === 'bn' ? 'স্থানীয় অবদান' : 'Local Contribution',
    exportData: language === 'bn' ? 'ডাটা এক্সপোর্ট' : 'Export Data',
    recentActivity: language === 'bn' ? 'সাম্প্রতিক কার্যক্রম' : 'Recent Activity',
    entries: language === 'bn' ? 'এন্ট্রি' : 'entries',
    trees: language === 'bn' ? 'গাছ' : 'trees',
    tons: language === 'bn' ? 'টন' : 'tons',
    liters: language === 'bn' ? 'লিটার' : 'liters',
  };

  const handleExport = () => {
    const dataStr = JSON.stringify(submissions, null, 2);
    const blob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `plantation-data-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="hidden md:block absolute top-4 left-4 z-50 pointer-events-none font-sans" id="offlineDashboardContainer">
      <div className="flex flex-col items-start gap-2 pointer-events-auto">
        
        <motion.button
          id="offlineDashboardToggleBtn"
          layout
          onClick={() => setIsExpanded(!isExpanded)}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-full shadow-lg border backdrop-blur-sm transition-all text-xs font-semibold cursor-pointer ${
            totalLogs > 0 
              ? 'bg-primary-500 border-primary-400 text-white hover:bg-primary-600' 
              : 'bg-container/95 border-gray-200 text-gray-700 hover:bg-surface'
          }`}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <div className="relative flex h-2 w-2">
            <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${totalLogs > 0 ? 'bg-white' : 'bg-primary-300'}`}></span>
            <span className={`relative inline-flex rounded-full h-2 w-2 ${totalLogs > 0 ? 'bg-white' : 'bg-primary-400'}`}></span>
          </div>

          <Database className="w-4 h-4 shrink-0" />
          
          <span>
            {t.title}: <strong className="font-bold">{toBnNum(totalLogs)}</strong> {language === 'bn' ? 'টি' : (totalLogs === 1 ? 'Record' : 'Records')}
          </span>
          
          {totalSeedlings > 0 && (
            <span className="bg-white/20 px-2 py-0.5 rounded-full text-[10px]">
              {formatNumber(totalSeedlings)} {t.trees}
            </span>
          )}
        </motion.button>

        <AnimatePresence>
          {isExpanded && (
            <motion.div
              id="offlineDashboardDetailsPanel"
              initial={{ opacity: 0, y: -8, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -8, scale: 0.95 }}
              transition={{ duration: 0.15 }}
              className="w-96 max-h-[85vh] bg-container border border-gray-150 rounded-2xl shadow-2xl text-gray-800 text-xs flex flex-col overflow-hidden"
            >
              {/* Header */}
              <div className="border-b border-gray-100 px-4 py-3 flex items-center justify-between bg-gradient-to-r from-primary-50 to-lime-50">
                <div className="flex flex-col">
                  <span className="font-bold text-gray-800 text-sm tracking-tight flex items-center gap-1.5">
                    <Database className="w-4 h-4 text-primary-500" />
                    {t.dashboardTitle}
                  </span>
                  <span className="text-[10px] text-gray-400 mt-0.5">
                    {t.lastSync} {lastUpdated}
                  </span>
                </div>
                
                <div className="flex items-center gap-1.5">
                  <button
                    id="dashLangToggle"
                    onClick={() => setLanguage(language === 'bn' ? 'en' : 'bn')}
                    className="px-2 py-1 rounded-lg border border-gray-200 hover:border-gray-300 active:bg-surface text-[10px] bg-container font-semibold text-gray-600 transition-colors flex items-center gap-1"
                  >
                    <Globe2 className="w-3 h-3 text-gray-400" />
                    {t.btnToggle}
                  </button>
                  <button
                    id="dashExportBtn"
                    onClick={handleExport}
                    className="p-1.5 rounded-lg text-gray-400 hover:text-primary-600 hover:bg-primary-50 transition-colors"
                    title={t.exportData}
                  >
                    <Download className="w-4 h-4" />
                  </button>
                  <button
                    id="dashCloseBtn"
                    onClick={() => setIsExpanded(false)}
                    className="p-1.5 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Tab Navigation */}
              <div className="flex border-b border-gray-100 px-2 pt-2 gap-1">
                {(['overview', 'activity', 'impact'] as const).map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`flex-1 py-2 text-[11px] font-semibold rounded-t-lg transition-colors ${
                      activeTab === tab 
                        ? 'bg-primary-50 text-primary-700 border-b-2 border-primary-500' 
                        : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    {tab === 'overview' && '📊 '}
                    {tab === 'activity' && '📈 '}
                    {tab === 'impact' && '🌍 '}
                    {t[tab]}
                  </button>
                ))}
              </div>

              {/* Content */}
              <div className="flex-1 overflow-y-auto p-4">
                <AnimatePresence mode="wait">
                  {activeTab === 'overview' && (
                    <motion.div
                      key="overview"
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 10 }}
                      className="flex flex-col gap-4"
                    >
                      {/* KPI Grid */}
                      <div className="grid grid-cols-2 gap-3">
                        <div className="bg-gradient-to-br from-primary-50 to-primary-100/50 border border-primary-200 rounded-xl p-3 flex flex-col items-center justify-center text-center relative overflow-hidden">
                          <div className="absolute top-0 right-0 w-16 h-16 bg-primary-200/20 rounded-full -translate-y-8 translate-x-8"></div>
                          <Clock className="w-4 h-4 text-primary-600 mb-1" />
                          <span className="text-[9px] font-medium text-primary-700 uppercase tracking-wider">{t.totalBatches}</span>
                          <span className="text-2xl font-extrabold text-primary-700 mt-1">
                            <AnimatedNumber value={totalLogs} />
                          </span>
                        </div>

                        <div className="bg-gradient-to-br from-lime-50 to-lime-100/50 border border-lime-200 rounded-xl p-3 flex flex-col items-center justify-center text-center relative overflow-hidden">
                          <div className="absolute top-0 right-0 w-16 h-16 bg-lime-200/20 rounded-full -translate-y-8 translate-x-8"></div>
                          <Leaf className="w-4 h-4 text-lime-600 mb-1" />
                          <span className="text-[9px] font-medium text-lime-700 uppercase tracking-wider">{t.totalPlanted}</span>
                          <span className="text-2xl font-extrabold text-lime-700 mt-1">
                            <AnimatedNumber value={totalSeedlings} />
                          </span>
                        </div>
                      </div>

                      {/* Seedlings Category Breakdown */}
                      <div className="bg-white rounded-xl border border-gray-100 p-3">
                        <span className="font-semibold text-gray-700 text-[11px] tracking-wide flex items-center gap-1 mb-3">
                          <BarChart3 className="w-3.5 h-3.5 text-gray-400" />
                          {language === 'bn' ? 'চারাগাছের প্রকারভেদ' : 'Seedling Categories'}
                        </span>

                        <div className="space-y-2.5">
                          {[
                            { label: t.fruit, value: fruitCount, color: 'bg-orange-500', bgColor: 'bg-orange-100' },
                            { label: t.forest, value: forestCount, color: 'bg-primary-500', bgColor: 'bg-primary-100' },
                            { label: t.medicinal, value: medicinalCount, color: 'bg-blue-500', bgColor: 'bg-blue-100' },
                          ].map((item) => (
                            <div key={item.label} className="flex flex-col gap-1">
                              <div className="flex items-center justify-between text-[11px]">
                                <span className="text-gray-600 font-medium flex items-center gap-1.5">
                                  <span className={`w-2 h-2 rounded-full ${item.color}`} />
                                  {item.label}
                                </span>
                                <span className="font-semibold text-gray-700">
                                  {toBnNum(item.value)}
                                </span>
                              </div>
                              <div className={`w-full h-2 ${item.bgColor} rounded-full overflow-hidden`}>
                                <motion.div 
                                  className={`${item.color} h-full rounded-full`}
                                  initial={{ width: 0 }}
                                  animate={{ width: `${totalSeedlings > 0 ? (item.value / totalSeedlings) * 100 : 0}%` }}
                                  transition={{ duration: 0.5, ease: 'easeOut' }}
                                />
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Top Districts */}
                      {sortedDistricts.length > 0 && (
                        <div className="bg-white rounded-xl border border-gray-100 p-3">
                          <span className="font-semibold text-gray-700 text-[11px] flex items-center gap-1 mb-2">
                            <MapPin className="w-3.5 h-3.5 text-gray-400" />
                            {t.regionalSpread}
                          </span>
                          <div className="space-y-1.5">
                            {sortedDistricts.map(([districtName, count], idx) => (
                              <div key={districtName} className="flex items-center gap-2">
                                <span className="text-[10px] text-gray-400 w-4">{idx + 1}.</span>
                                <div className="flex-1">
                                  <div className="flex justify-between items-center mb-0.5">
                                    <span className="font-medium text-gray-600 text-[11px]">{districtName}</span>
                                    <span className="font-semibold text-primary-600 text-[10px]">
                                      {toBnNum(count)} {t.entries}
                                    </span>
                                  </div>
                                  <div className="w-full h-1.5 bg-gray-100 rounded-full overflow-hidden">
                                    <motion.div 
                                      className="bg-primary-500 h-full rounded-full"
                                      initial={{ width: 0 }}
                                      animate={{ width: `${(count / totalLogs) * 100}%` }}
                                      transition={{ duration: 0.5, ease: 'easeOut' }}
                                    />
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Top Species */}
                      {sortedSpecies.length > 0 && (
                        <div className="bg-white rounded-xl border border-gray-100 p-3">
                          <span className="font-semibold text-gray-700 text-[11px] flex items-center gap-1 mb-2">
                            <Sprout className="w-3.5 h-3.5 text-gray-400" />
                            {t.speciesBreakdown}
                          </span>
                          <div className="space-y-1.5">
                            {sortedSpecies.map(([species, count], idx) => (
                              <div key={species} className="flex items-center justify-between bg-surface rounded-lg px-2.5 py-1.5">
                                <span className="font-medium text-gray-600 text-[11px] flex items-center gap-1.5">
                                  <span className="text-lime-600">🌿</span>
                                  {species}
                                </span>
                                <span className="font-semibold text-lime-700 text-[10px]">
                                  {toBnNum(count)} {t.trees}
                                </span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </motion.div>
                  )}

                  {activeTab === 'activity' && (
                    <motion.div
                      key="activity"
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 10 }}
                      className="flex flex-col gap-4"
                    >
                      {/* National Goal Progress */}
                      <div className="bg-gradient-to-br from-amber-50 to-amber-100/50 border border-amber-200 rounded-xl p-4">
                        <div className="flex items-center justify-between mb-3">
                          <span className="font-semibold text-amber-800 text-[11px] flex items-center gap-1">
                            <Award className="w-3.5 h-3.5 text-amber-600" />
                            {t.targetText}
                          </span>
                          <span className="font-bold text-amber-800 text-[10px]">
                            ২৫ কোটি / 250M
                          </span>
                        </div>
                        <div className="flex items-center justify-center gap-6">
                          <div className="relative">
                            <CircularProgress 
                              value={nationalProgress} 
                              max={nationalGoal} 
                              size={90} 
                              strokeWidth={8}
                              color="#15803d"
                              label={t.nationalContribution}
                            />
                          </div>
                          <div className="relative">
                            <CircularProgress 
                              value={localProgress} 
                              max={nationalGoal} 
                              size={90} 
                              strokeWidth={8}
                              color="#7c3aed"
                              label={t.localContribution}
                            />
                          </div>
                        </div>
                      </div>

                      {/* Daily Activity Chart */}
                      {sortedDailyActivity.length > 0 && (
                        <div className="bg-white rounded-xl border border-gray-100 p-3">
                          <span className="font-semibold text-gray-700 text-[11px] flex items-center gap-1 mb-3">
                            <CalendarDays className="w-3.5 h-3.5 text-gray-400" />
                            {t.recentActivity}
                          </span>
                          <div className="flex items-end gap-1 h-24">
                            {sortedDailyActivity.map(([date, count]) => {
                              const maxCount = Math.max(...Object.values(dailyActivity));
                              const height = maxCount > 0 ? (count / maxCount) * 100 : 0;
                              return (
                                <div key={date} className="flex-1 flex flex-col items-center gap-1">
                                  <motion.div 
                                    className="w-full bg-primary-500 rounded-t-sm min-h-[4px]"
                                    initial={{ height: 0 }}
                                    animate={{ height: `${height}%` }}
                                    transition={{ duration: 0.5, ease: 'easeOut' }}
                                  />
                                  <span className="text-[8px] text-gray-400 rotate-0">
                                    {date.split('-')[2]}/{date.split('-')[1]}
                                  </span>
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      )}

                      {/* Top Upazilas */}
                      {sortedUpazilas.length > 0 && (
                        <div className="bg-white rounded-xl border border-gray-100 p-3">
                          <span className="font-semibold text-gray-700 text-[11px] flex items-center gap-1 mb-2">
                            <MapPin className="w-3.5 h-3.5 text-gray-400" />
                            {t.upazilaSpread}
                          </span>
                          <div className="space-y-1.5">
                            {sortedUpazilas.map(([upazila, count], idx) => (
                              <div key={upazila} className="flex items-center justify-between bg-surface rounded-lg px-2.5 py-1.5">
                                <span className="font-medium text-gray-600 text-[11px] flex items-center gap-1.5">
                                  <span className="w-4 h-4 rounded-full bg-primary-100 text-primary-700 flex items-center justify-center text-[9px] font-bold">
                                    {idx + 1}
                                  </span>
                                  {upazila}
                                </span>
                                <span className="font-semibold text-primary-600 text-[10px]">
                                  {toBnNum(count)} {t.trees}
                                </span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </motion.div>
                  )}

                  {activeTab === 'impact' && (
                    <motion.div
                      key="impact"
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 10 }}
                      className="flex flex-col gap-4"
                    >
                      {/* Carbon & Water Impact */}
                      <div className="grid grid-cols-2 gap-3">
                        <div className="bg-gradient-to-br from-emerald-50 to-emerald-100/50 border border-emerald-200 rounded-xl p-3 flex flex-col items-center text-center">
                          <Trees className="w-5 h-5 text-emerald-600 mb-1" />
                          <span className="text-[9px] font-medium text-emerald-700 uppercase tracking-wider">{t.carbonSeq}</span>
                          <span className="text-xl font-extrabold text-emerald-700 mt-1">
                            {toBnNum(estimatedCarbon)}
                          </span>
                          <span className="text-[9px] text-emerald-600">{t.tons} CO₂</span>
                        </div>

                        <div className="bg-gradient-to-br from-cyan-50 to-cyan-100/50 border border-cyan-200 rounded-xl p-3 flex flex-col items-center text-center">
                          <Droplet className="w-5 h-5 text-cyan-600 mb-1" />
                          <span className="text-[9px] font-medium text-cyan-700 uppercase tracking-wider">{t.waterSaved}</span>
                          <span className="text-xl font-extrabold text-cyan-700 mt-1">
                            {toBnNum(waterSaved)}
                          </span>
                          <span className="text-[9px] text-cyan-600">{t.liters}</span>
                        </div>
                      </div>

                      {/* Impact Equivalents */}
                      <div className="bg-white rounded-xl border border-gray-100 p-3">
                        <span className="font-semibold text-gray-700 text-[11px] flex items-center gap-1 mb-3">
                          <TrendingUp className="w-3.5 h-3.5 text-gray-400" />
                          {language === 'bn' ? 'পরিবেশ প্রভাব' : 'Environmental Impact'}
                        </span>
                        <div className="space-y-2">
                          <div className="flex items-center gap-2 text-[11px]">
                            <span className="text-lg">🚗</span>
                            <span className="text-gray-600">
                              {language === 'bn' 
                                ? `গাড়ি ${toBnNum(Math.round(estimatedCarbon * 4000))} কিমি চালানোর সমতুল্য CO₂`
                                : `Equivalent to ${toBnNum(Math.round(estimatedCarbon * 4000))} km driven`}
                            </span>
                          </div>
                          <div className="flex items-center gap-2 text-[11px]">
                            <span className="text-lg">🏠</span>
                            <span className="text-gray-600">
                              {language === 'bn' 
                                ? `${toBnNum(Math.round(estimatedCarbon * 0.15))} পরিবারের বার্ষিক বিদ্যুৎ খরচ`
                                : `${toBnNum(Math.round(estimatedCarbon * 0.15))} homes' annual electricity`}
                            </span>
                          </div>
                          <div className="flex items-center gap-2 text-[11px]">
                            <span className="text-lg">🌳</span>
                            <span className="text-gray-600">
                              {language === 'bn' 
                                ? `${toBnNum(totalSeedlings)} গাছ ১০ বছরে ~${toBnNum(Math.round(totalSeedlings * 220))} কেজি CO₂ শোষণ করবে`
                                : `${toBnNum(totalSeedlings)} trees absorb ~${toBnNum(Math.round(totalSeedlings * 220))} kg CO₂ in 10 years`}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* National Goal Progress Bar */}
                      <div className="bg-gradient-to-r from-amber-50 to-amber-100/50 border border-amber-200 rounded-xl p-3">
                        <div className="flex items-center justify-between mb-2">
                          <span className="font-semibold text-amber-800 text-[11px] flex items-center gap-1">
                            <Award className="w-3.5 h-3.5" />
                            {t.targetText}
                          </span>
                          <span className="text-[10px] text-amber-700 font-medium">
                            {((nationalProgress / nationalGoal) * 100).toFixed(3)}%
                          </span>
                        </div>
                        <div className="w-full h-3 bg-amber-200 rounded-full overflow-hidden">
                          <motion.div 
                            className="bg-gradient-to-r from-amber-500 to-amber-600 h-full rounded-full"
                            initial={{ width: 0 }}
                            animate={{ width: `${(nationalProgress / nationalGoal) * 100}%` }}
                            transition={{ duration: 1, ease: 'easeOut' }}
                          />
                        </div>
                        <div className="flex justify-between mt-1 text-[9px] text-amber-600">
                          <span>{formatNumber(nationalProgress)}</span>
                          <span>{formatNumber(nationalGoal)}</span>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Footer */}
              <div className="border-t border-gray-100 px-4 py-2.5 bg-gray-50/50">
                <div className="flex items-center gap-1.5 text-[10px] text-gray-500">
                  <Info className="w-3 h-3 text-primary-500 shrink-0" />
                  <p>{t.syncTip}</p>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

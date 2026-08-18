import React, { useState, Suspense, lazy } from 'react';
import { 
  FileEdit, 
  Map, 
  BarChart3, 
  BookOpen, 
  Satellite, 
  Trees, 
  Wifi, 
  WifiOff, 
  MapPin, 
  Layers, 
  Download,
  HelpCircle,
  Mail,
  ShieldCheck,
  CheckCircle2,
  ExternalLink,
  RefreshCw,
  Share2,
  Server
} from 'lucide-react';
import PlantationForm from './PlantationForm';
import AppsScriptSync from './AppsScriptSync';
import OfflinePlantationDashboard, { Submission } from '../OfflinePlantationDashboard';
import { NetworkStatusData } from '../NetworkStatus';
import { GeoState } from '../GeolocationIndicator';

const MapTab = lazy(() => import('./MapTab'));

interface PlantationAppShellProps {
  networkState: NetworkStatusData | null;
  geoState: GeoState | null;
  submissions: Submission[];
  onRefreshSubmissions?: () => void;
}

export default function PlantationAppShell({
  networkState,
  geoState,
  submissions,
  onRefreshSubmissions
}: PlantationAppShellProps) {
  const [activeTab, setActiveTab] = useState<'form' | 'sync' | 'map' | 'dashboard' | 'guide'>('form');

  const pendingCount = submissions.filter(s => !s.synced).length;
  const totalCount = submissions.length;

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
      {/* Top Application Header with Official Govt & DAE Logo */}
      <header className="bg-gradient-to-r from-emerald-950 via-emerald-900 to-green-950 text-white sticky top-0 z-40 shadow-md border-b border-emerald-800">
        <div className="max-w-6xl mx-auto px-4 py-2.5 flex items-center justify-between gap-3">
          {/* Logo & Title */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white/10 p-1 flex items-center justify-center border border-white/20 shadow-inner">
              <img 
                src="/dae-logo.png" 
                alt="Govt of Bangladesh DAE Logo" 
                className="w-full h-full object-contain"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = '/logo.svg';
                }}
              />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-base sm:text-lg font-bold tracking-tight text-white flex items-center gap-1.5">
                  <span>বৃক্ষরোপণ ট্র্যাকার</span>
                </h1>
                <span className="hidden sm:inline-block px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-700 text-emerald-100 border border-emerald-500/30">
                  DAE BD
                </span>
              </div>
              <p className="text-[11px] text-emerald-200/90 hidden xs:block">
                "০৫ বছরে ২৫ কোটি বৃক্ষরোপণ" মহা-কর্মসূচি
              </p>
            </div>
          </div>

          {/* Top Indicators */}
          <div className="flex items-center gap-2 text-xs">
            {/* Network pill */}
            <div className={`hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold border ${
              networkState?.isOnline
                ? 'bg-emerald-800/80 text-emerald-200 border-emerald-600/40'
                : 'bg-amber-900/80 text-amber-200 border-amber-600/40 animate-pulse'
            }`}>
              {networkState?.isOnline ? (
                <>
                  <Wifi className="w-3.5 h-3.5 text-emerald-400" />
                  <span>অনলাইন</span>
                </>
              ) : (
                <>
                  <WifiOff className="w-3.5 h-3.5 text-amber-400" />
                  <span>অফলাইন মোড</span>
                </>
              )}
            </div>

            {/* Offline queue indicator */}
            <button
              onClick={() => setActiveTab('sync')}
              className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/20 text-amber-200 border border-amber-400/30 hover:bg-amber-500/30 transition cursor-pointer"
            >
              <Server className="w-3.5 h-3.5 text-amber-400" />
              <span className="font-bold">{pendingCount}</span>
              <span className="hidden sm:inline">পেন্ডিং সিঙ্ক</span>
            </button>
          </div>
        </div>

        {/* Navigation Tabs Bar */}
        <div className="bg-emerald-950/95 border-t border-emerald-800/60 px-2 sm:px-4 overflow-x-auto">
          <div className="max-w-6xl mx-auto flex items-center justify-start gap-1 sm:gap-2 whitespace-nowrap">
            <button
              onClick={() => setActiveTab('form')}
              className={`flex items-center gap-1.5 px-3 sm:px-4 py-2.5 text-xs sm:text-sm font-semibold border-b-2 transition cursor-pointer ${
                activeTab === 'form'
                  ? 'border-emerald-400 text-white bg-emerald-800/50'
                  : 'border-transparent text-emerald-300/80 hover:text-white hover:bg-emerald-900/40'
              }`}
            >
              <FileEdit className="w-4 h-4" />
              <span>এন্ট্রি ফর্ম</span>
            </button>

            <button
              onClick={() => setActiveTab('sync')}
              className={`flex items-center gap-1.5 px-3 sm:px-4 py-2.5 text-xs sm:text-sm font-semibold border-b-2 transition cursor-pointer relative ${
                activeTab === 'sync'
                  ? 'border-emerald-400 text-white bg-emerald-800/50'
                  : 'border-transparent text-emerald-300/80 hover:text-white hover:bg-emerald-900/40'
              }`}
            >
              <RefreshCw className="w-4 h-4" />
              <span>AppsScript সিঙ্ক</span>
              {pendingCount > 0 && (
                <span className="px-1.5 py-0.2 rounded-full text-[9px] font-bold bg-amber-400 text-amber-950 ml-1">
                  {pendingCount}
                </span>
              )}
            </button>

            <button
              onClick={() => setActiveTab('map')}
              className={`flex items-center gap-1.5 px-3 sm:px-4 py-2.5 text-xs sm:text-sm font-semibold border-b-2 transition cursor-pointer ${
                activeTab === 'map'
                  ? 'border-emerald-400 text-white bg-emerald-800/50'
                  : 'border-transparent text-emerald-300/80 hover:text-white hover:bg-emerald-900/40'
              }`}
            >
              <Map className="w-4 h-4" />
              <span>মানচিত্র ও স্যাটেলাইট</span>
            </button>

            <button
              onClick={() => setActiveTab('dashboard')}
              className={`flex items-center gap-1.5 px-3 sm:px-4 py-2.5 text-xs sm:text-sm font-semibold border-b-2 transition cursor-pointer ${
                activeTab === 'dashboard'
                  ? 'border-emerald-400 text-white bg-emerald-800/50'
                  : 'border-transparent text-emerald-300/80 hover:text-white hover:bg-emerald-900/40'
              }`}
            >
              <BarChart3 className="w-4 h-4" />
              <span>ড্যাশবোর্ড ({totalCount})</span>
            </button>

            <button
              onClick={() => setActiveTab('guide')}
              className={`flex items-center gap-1.5 px-3 sm:px-4 py-2.5 text-xs sm:text-sm font-semibold border-b-2 transition cursor-pointer ${
                activeTab === 'guide'
                  ? 'border-emerald-400 text-white bg-emerald-800/50'
                  : 'border-transparent text-emerald-300/80 hover:text-white hover:bg-emerald-900/40'
              }`}
            >
              <BookOpen className="w-4 h-4" />
              <span>নির্দেশিকা ও শেয়ার</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Tab Content Display */}
      <main className="flex-1 overflow-y-auto pb-20">
        {activeTab === 'form' && (
          <PlantationForm onSubmissionSuccess={onRefreshSubmissions} />
        )}

        {activeTab === 'sync' && (
          <div className="p-4 sm:p-6 max-w-5xl mx-auto">
            <AppsScriptSync onSyncComplete={onRefreshSubmissions} />
          </div>
        )}

        {activeTab === 'map' && (
          <div className="w-full h-[calc(100vh-120px)] relative">
            <Suspense fallback={
              <div className="w-full h-full flex items-center justify-center text-emerald-700 bg-white">
                <div className="text-center p-4">
                  <div className="w-8 h-8 border-4 border-emerald-600 border-t-transparent rounded-full animate-spin mx-auto mb-2" />
                  <p className="text-xs font-semibold text-gray-600">স্যাটেলাইট ও NDVI মানচিত্র লোড হচ্ছে...</p>
                </div>
              </div>
            }>
              <MapTab geoState={geoState} />
            </Suspense>
          </div>
        )}

        {activeTab === 'dashboard' && (
          <div className="p-4 sm:p-6 max-w-6xl mx-auto">
            <OfflinePlantationDashboard onStateChange={onRefreshSubmissions} />
          </div>
        )}

        {activeTab === 'guide' && (
          <div className="max-w-4xl mx-auto p-4 sm:p-6 space-y-6">
            {/* Guide Header Banner */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-emerald-100 space-y-4">
              <div className="flex items-center gap-3.5 pb-4 border-b border-gray-100">
                <img 
                  src="/logo.png" 
                  alt="Govt Logo" 
                  className="w-12 h-12 object-contain"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = '/logo.svg';
                  }}
                />
                <div>
                  <h2 className="text-lg font-bold text-gray-900">ব্যবহারকারী নির্দেশিকা ও অফিশিয়াল তথ্য</h2>
                  <p className="text-xs text-gray-500">কৃষি সম্প্রসারণ অধিদপ্তর, গণপ্রজাতন্ত্রী বাংলাদেশ সরকার</p>
                </div>
              </div>

              {/* Social Share Preview Card */}
              <div className="rounded-2xl border border-emerald-200 overflow-hidden bg-gradient-to-br from-emerald-50 to-green-50 p-4 flex flex-col sm:flex-row items-center gap-4">
                <img 
                  src="/og-share-large.png" 
                  alt="Social Share Banner" 
                  className="w-full sm:w-48 h-28 object-cover rounded-xl border border-emerald-200 shadow-sm"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = '/og-image.png';
                  }}
                />
                <div className="space-y-1.5 text-center sm:text-left">
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-700 text-white inline-block">
                    অফিসিয়াল শেয়ারিং কার্ড
                  </span>
                  <h3 className="font-bold text-sm text-emerald-950">
                    বৃক্ষ রোপণে সাজাই দেশ, সবার আগে বাংলাদেশ
                  </h3>
                  <p className="text-xs text-emerald-800">
                    সামাজিক মাধ্যমসমূহে অ্যাপ লিঙ্ক শেয়ার করার সময় আকর্ষণীয় ব্যানার ও ব্র্যান্ডিং প্রদর্শিত হবে।
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                <div className="p-4 rounded-xl bg-emerald-50/60 border border-emerald-100 space-y-2">
                  <h3 className="font-bold text-sm text-emerald-900 flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    ১. অফলাইন এন্ট্রি ও AppsScript সিঙ্ক
                  </h3>
                  <p className="text-xs text-gray-700 leading-relaxed">
                    ইন্টারনেট সংযোগ না থাকলেও ব্রাউজারে সম্পূর্ণ নিরবচ্ছিন্নভাবে তথ্য সংরক্ষণ করা যায়। নেটওয়ার্ক পাওয়া মাত্রই "AppsScript সিঙ্ক" ট্যাবে গিয়ে এক ক্লিকে কেন্দ্রীয় শিটে ডাটা জমা দেওয়া যায়।
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-teal-50/60 border border-teal-100 space-y-2">
                  <h3 className="font-bold text-sm text-teal-900 flex items-center gap-1.5">
                    <MapPin className="w-4 h-4 text-teal-600" />
                    ২. জিপিএস ও উপজেলা সীমানা যাচাই
                  </h3>
                  <p className="text-xs text-gray-700 leading-relaxed">
                    প্রতিটি এন্ট্রির প্রকৃত GPS অবস্থান তার ঘোষিত উপজেলার প্রকৃত সীমানা পলিগনের সাথে সরাসরি মেলানো হয়। অমিল থাকলে মানচিত্রে সতর্কতা প্রদর্শন করা হয়।
                  </p>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-gray-50 border border-gray-200 mt-4 flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-800">
                    <Mail className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-bold text-xs text-gray-800">কারিগরি সহায়তা ও ইমেইল সংযোগ</h4>
                    <p className="text-xs text-emerald-700 font-mono">krishiailive@gmail.com</p>
                  </div>
                </div>
                <a
                  href="mailto:krishiailive@gmail.com"
                  className="px-4 py-2 rounded-xl bg-emerald-700 text-white text-xs font-bold hover:bg-emerald-800 transition"
                >
                  ইমেইল পাঠান
                </a>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

import React, { useState, useEffect } from 'react';
import { 
  RefreshCw, 
  Database, 
  Send, 
  Download, 
  CheckCircle2, 
  AlertTriangle, 
  ShieldCheck, 
  Globe, 
  Share2, 
  Copy, 
  ExternalLink,
  Layers,
  Sparkles,
  Server
} from 'lucide-react';
import { useMapData } from '../../utils/useMapData';
import { Submission } from '../OfflinePlantationDashboard';

interface AppsScriptSyncProps {
  onSyncComplete?: () => void;
}

export default function AppsScriptSync({ onSyncComplete }: AppsScriptSyncProps) {
  const { nationalEntries, syncStatus, refresh } = useMapData();
  const [gasUrl, setGasUrl] = useState<string>('/api/gas-sync');
  const [isSyncing, setIsSyncing] = useState<boolean>(false);
  const [syncLogs, setSyncLogs] = useState<string[]>([]);
  const [syncProgress, setSyncProgress] = useState<number>(0);
  const [pendingCount, setPendingCount] = useState<number>(0);
  const [copiedLink, setCopiedLink] = useState<boolean>(false);

  // Check pending submissions count
  useEffect(() => {
    try {
      const raw = localStorage.getItem('plantation_submissions_v2') || '[]';
      const list: Submission[] = JSON.parse(raw);
      const unsynced = list.filter((s) => !s.synced).length;
      setPendingCount(unsynced);
    } catch (e) {
      setPendingCount(0);
    }
  }, []);

  const addLog = (msg: string) => {
    setSyncLogs((prev) => [`[${new Date().toLocaleTimeString('bn-BD')}] ${msg}`, ...prev.slice(0, 49)]);
  };

  // One-click AppsScript Sync function
  const handleSyncToAppsScript = async () => {
    setIsSyncing(true);
    setSyncProgress(0);
    addLog('🚀 AppsScript সার্ভার সিঙ্ক প্রক্রিয়া শুরু করা হচ্ছে...');

    try {
      const rawV2 = localStorage.getItem('plantation_submissions_v2') || '[]';
      const listV2: Submission[] = JSON.parse(rawV2);
      const unsynced = listV2.filter((s) => !s.synced);

      if (unsynced.length === 0) {
        addLog('ℹ️ সিঙ্ক করার জন্য কোনো পেন্ডিং অফলাইন এন্ট্রি নেই।');
        setIsSyncing(false);
        return;
      }

      addLog(`📋 মোট ${unsynced.length} টি পেন্ডিং এন্ট্রি পাওয়া গেছে।`);

      // Flatten items into species rows if needed
      const payload: any[] = [];
      unsynced.forEach((sub) => {
        if (sub.seedlings && sub.seedlings.length > 0) {
          sub.seedlings.forEach((sp) => {
            payload.push({
              submissionId: sub.id || sub.submissionId,
              division: sub.division || sub.region || 'রংপুর',
              region: sub.region || sub.division || 'রংপুর',
              district: sub.district || 'কুড়িগ্রাম',
              upazila: sub.upazila || 'কুড়িগ্রাম সদর',
              union: sub.union || '',
              village: sub.village || '',
              latitude: sub.latitude || '25.8072',
              longitude: sub.longitude || '89.6295',
              plantingDate: sub.plantingDate || new Date().toISOString().split('T')[0],
              farmerName: sub.farmerName || sub.nurseryName || 'স্থানীয় কৃষক',
              farmerMobile: sub.farmerMobile || sub.mobile || '',
              saaoName: sub.saaoName || sub.officerName || '',
              saaoMobile: sub.saaoMobile || sub.officerMobile || '',
              speciesName: sp.speciesName,
              category: sp.category,
              quantity: sp.quantity,
              remarks: sub.remarks || '',
              photoBase64: sub.photoBase64 || '',
            });
          });
        } else {
          payload.push({
            submissionId: sub.id || sub.submissionId,
            division: sub.division || sub.region || 'রংপুর',
            district: sub.district || 'কুড়িগ্রাম',
            upazila: sub.upazila || 'কুড়িগ্রাম সদর',
            farmerName: sub.farmerName || 'স্থানীয় কৃষক',
            farmerMobile: sub.farmerMobile || '',
            speciesName: 'মিশ্র চারা',
            category: 'ফলদ',
            quantity: 1,
            remarks: sub.remarks || '',
          });
        }
      });

      addLog(`⚡ ${payload.length} টি চারা রোপণ রো অ্যাপস স্ক্রিপ্ট প্রক্সিতে পাঠানো হচ্ছে...`);

      const res = await fetch(gasUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const resData = await res.json();

      if (resData && resData.ok) {
        addLog('✅ সফলভাবে AppsScript Google Sheet এ ডাটা সিঙ্ক সম্পন্ন হয়েছে!');
        
        // Mark items as synced in localStorage
        const updatedV2 = listV2.map((s) => ({ ...s, synced: true, syncedAt: new Date().toISOString() }));
        localStorage.setItem('plantation_submissions_v2', JSON.stringify(updatedV2));
        setPendingCount(0);
        setSyncProgress(100);

        if (onSyncComplete) onSyncComplete();
        refresh();
      } else {
        addLog(`⚠️ সিঙ্ক ত্রুটি: ${resData?.error || 'সার্ভার সাড়া দেয়নি'}`);
      }
    } catch (err: any) {
      addLog(`❌ নেটওয়ার্ক ত্রুটি: ${err.message || 'সংযোগ বিচ্ছিন্ন'}`);
    } finally {
      setIsSyncing(false);
    }
  };

  // Copy official link
  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 3000);
  };

  return (
    <div className="space-y-6">
      {/* Official Government & DAE Branding Card */}
      <div className="bg-white rounded-2xl shadow-sm border border-emerald-100 p-5 space-y-4">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 border-b border-gray-100 pb-4">
          <div className="flex items-center gap-3.5">
            <img 
              src="/dae-logo.png" 
              alt="DAE Bangladesh Seal" 
              className="w-14 h-14 object-contain drop-shadow-sm"
              onError={(e) => {
                // Fallback to logo.svg if dae-logo.png has issue
                (e.target as HTMLImageElement).src = '/logo.svg';
              }}
            />
            <div>
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-300">
                  গণপ্রজাতন্ত্রী বাংলাদেশ সরকার
                </span>
              </div>
              <h2 className="text-lg font-bold text-emerald-950 mt-0.5">
                কৃষি সম্প্রসারণ অধিদপ্তর — গুগল অ্যাপস স্ক্রিপ্ট (GAS) সংযোগ
              </h2>
              <p className="text-xs text-gray-500">
                কেন্দ্রীয় ওয়ার্কবুক ও জাতীয় ডাটাবেজ অটোমেশন সাব-সিস্টেম
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold px-3 py-1.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>HMAC-256 সিকিউর সিঙ্ক</span>
            </span>
          </div>
        </div>

        {/* Sync Controls Panel */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
          {/* Action Card 1: Upload Pending Local Entries */}
          <div className="p-4 rounded-xl bg-gradient-to-br from-emerald-50 to-green-50/70 border border-emerald-200 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Send className="w-5 h-5 text-emerald-700" />
                <h3 className="font-bold text-sm text-emerald-950">অফলাইন এন্ট্রি সিঙ্ক করুন</h3>
              </div>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-100 text-amber-900 border border-amber-300">
                {pendingCount} টি পেন্ডিং
              </span>
            </div>

            <p className="text-xs text-emerald-800 leading-relaxed">
              আপনার ডিভাইসে সংরক্ষিত পেন্ডিং অফলাইন তথ্যগুলো এক-ক্লিকে কেন্দ্রীয় গুগল শিটে আপলোড করুন।
            </p>

            <button
              onClick={handleSyncToAppsScript}
              disabled={isSyncing || pendingCount === 0}
              className="w-full py-2.5 px-4 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs shadow transition flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <RefreshCw className={`w-4 h-4 ${isSyncing ? 'animate-spin' : ''}`} />
              <span>{isSyncing ? 'AppsScript এ সিঙ্ক হচ্ছে...' : '⚡ AppsScript এ ডাটা আপলোড করুন'}</span>
            </button>
          </div>

          {/* Action Card 2: Fetch National Dataset */}
          <div className="p-4 rounded-xl bg-gradient-to-br from-teal-50 to-emerald-50/50 border border-teal-200 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Download className="w-5 h-5 text-teal-700" />
                <h3 className="font-bold text-sm text-teal-950">জাতীয় ডাটা ডাউনলোড</h3>
              </div>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-teal-100 text-teal-900 border border-teal-300">
                {nationalEntries.length} টি জাতীয় এন্ট্রি
              </span>
            </div>

            <p className="text-xs text-teal-800 leading-relaxed">
              সারা দেশের সকল জেলা ও উপজেলার সিঙ্ককৃত লাইভ ডাটা ডাউনলোড ও রিফ্রেশ করুন।
            </p>

            <button
              onClick={() => refresh()}
              className="w-full py-2.5 px-4 rounded-xl bg-teal-700 hover:bg-teal-800 text-white font-bold text-xs shadow transition flex items-center justify-center gap-2 cursor-pointer"
            >
              <RefreshCw className="w-4 h-4" />
              <span>📡 জাতীয় ডাটা রিফ্রেশ করুন</span>
            </button>
          </div>
        </div>

        {/* Live Status text */}
        <div className="p-3 rounded-xl bg-gray-50 border border-gray-200 text-xs text-gray-700 flex items-center justify-between">
          <span className="font-medium">{syncStatus || '📡 AppsScript প্রস্তুত'}</span>
          <span className="font-mono text-[10px] text-gray-500">Endpoint: {gasUrl}</span>
        </div>

        {/* Sync Console Logs */}
        {syncLogs.length > 0 && (
          <div className="p-3 rounded-xl bg-slate-950 text-emerald-400 font-mono text-[11px] max-h-40 overflow-y-auto space-y-1">
            <div className="text-[10px] font-bold text-emerald-500 uppercase border-b border-emerald-900 pb-1 mb-1 flex justify-between">
              <span>AppsScript সিঙ্ক কনসোল</span>
              <button onClick={() => setSyncLogs([])} className="hover:underline text-gray-400">মুছুন</button>
            </div>
            {syncLogs.map((log, i) => (
              <div key={i}>{log}</div>
            ))}
          </div>
        )}
      </div>

      {/* Official OpenGraph & Social Media Share Banner Section */}
      <div className="bg-white rounded-2xl shadow-sm border border-emerald-100 p-5 space-y-4">
        <div className="flex items-center gap-2 border-b border-gray-100 pb-3">
          <Share2 className="w-5 h-5 text-emerald-700" />
          <div>
            <h3 className="font-bold text-base text-gray-900">সোশ্যাল মিডিয়া ও অফিসিয়াল ব্র্যান্ডিং প্রিভিউ</h3>
            <p className="text-xs text-gray-500">ফেসবুক, মেসেঞ্জার, হোয়াটসঅ্যাপ শেয়ারিং কার্ড ও সরকারি ব্যানার</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-1">
          {/* OG Share Card Preview 1 */}
          <div className="rounded-xl border border-gray-200 overflow-hidden shadow-sm hover:shadow-md transition bg-gray-50">
            <div className="relative aspect-video bg-emerald-900 overflow-hidden">
              <img 
                src="/og-share-large.png" 
                alt="Plantation Tracker OG Preview" 
                className="w-full h-full object-cover"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = '/og-image.png';
                }}
              />
              <span className="absolute top-2 right-2 px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-900/80 text-white backdrop-blur-sm border border-white/20">
                OG Preview Card
              </span>
            </div>
            <div className="p-3.5 space-y-1 bg-white">
              <span className="text-[10px] font-bold text-emerald-700 uppercase">PLANTATION-TRACKER.VERCEL.APP</span>
              <h4 className="font-bold text-sm text-gray-900">বৃক্ষরোপণ ট্র্যাকার (Plantation Tracker PWA)</h4>
              <p className="text-xs text-gray-600 line-clamp-2">
                গণপ্রজাতন্ত্রী বাংলাদেশ সরকারের কৃষি সম্প্রসারণ অধিদপ্তর কর্তৃক "০৫ বছরে ২৫ কোটি বৃক্ষরোপণ" মহা-কর্মসূচি।
              </p>
            </div>
          </div>

          {/* OG Share Card Preview 2 */}
          <div className="rounded-xl border border-gray-200 overflow-hidden shadow-sm hover:shadow-md transition bg-gray-50">
            <div className="relative aspect-video bg-emerald-950 overflow-hidden">
              <img 
                src="/og-image.png" 
                alt="Plantation Tracker Banner" 
                className="w-full h-full object-cover"
              />
              <span className="absolute top-2 right-2 px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-900/80 text-white backdrop-blur-sm border border-white/20">
                DAE Official Banner
              </span>
            </div>
            <div className="p-3.5 space-y-2 bg-white">
              <h4 className="font-bold text-xs text-gray-800">অফিসিয়াল অ্যাপস লিংক ও শেয়ার অপশন</h4>
              <div className="flex items-center gap-2">
                <button
                  onClick={handleCopyLink}
                  className="flex-1 py-2 px-3 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 text-xs font-bold transition flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <Copy className="w-3.5 h-3.5" />
                  <span>{copiedLink ? '✓ কপি হয়েছে!' : 'অ্যাপ লিংক কপি করুন'}</span>
                </button>
                <a
                  href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent('https://plantation-tracker.vercel.app/')}`}
                  target="_blank"
                  rel="noreferrer"
                  className="py-2 px-3 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold transition flex items-center gap-1 cursor-pointer"
                >
                  <Share2 className="w-3.5 h-3.5" />
                  <span>ফেসবুকে শেয়ার</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

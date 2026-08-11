import { useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { motion } from 'framer-motion';
import { Activity } from 'lucide-react';

import { GeoState } from './GeolocationIndicator';
import { NetworkStatusData } from './NetworkStatus';
import { Submission } from './OfflinePlantationDashboard';
import { getQueueStats, getFailedSubmissions, markSyncing, markSynced, markFailed, QueuedSubmission } from '../lib/offlineQueue';

interface MobileControlCenterProps {
  networkState: NetworkStatusData | null;
  geoState: GeoState | null;
  submissions: Submission[];
  queueReady?: boolean;
}

export default function MobileControlCenter({ networkState, geoState, submissions }: MobileControlCenterProps) {
  const portalContainer = useRef<Element | null>(null);

  useEffect(() => {
    const tryFind = () => {
      const iframe = document.querySelector('iframe') as HTMLIFrameElement | null;
      if (iframe?.contentDocument?.getElementById('header-react-slots')) {
        portalContainer.current = iframe.contentDocument.getElementById('header-react-slots');
      }
      return portalContainer.current !== null;
    };
    if (tryFind()) return;
    const interval = setInterval(() => { if (tryFind()) clearInterval(interval); }, 200);
    return () => clearInterval(interval);
  }, []);

  // Compute stats
  const totalLogs = submissions.length;
  const hasGpsError = !!geoState?.error;
  const isOnline = networkState ? networkState.isOnline : true;

  // Compact header FAB for the slot (green, matches header theme)
  const headerFAB = (
    <motion.button
      id="mobileControlCenterFAB"
      className="flex items-center gap-1.5 px-2.5 py-1 rounded-full border transition-all text-[10px] font-bold cursor-pointer bg-primary-500/30 border-primary-300/40 text-white hover:bg-primary-500/50"
      whileHover={{ scale: 1.03 }}
      whileTap={{ scale: 0.97 }}
      title="সিস্টেম স্ট্যাটাস"
    >
      <span className="flex items-center gap-1">
        {totalLogs > 0 ? (
          <span className="inline-block w-2 h-2 rounded-full bg-orange-400 border border-white animate-pulse" />
        ) : (
          <span className="inline-block w-1.5 h-1.5 rounded-full bg-gray-400" />
        )}
        {isOnline ? (
          <span className="inline-block w-2 h-2 rounded-full bg-primary-300 border border-white" />
        ) : (
          <span className="inline-block w-2 h-2 rounded-full bg-amber-400 border border-white animate-pulse" />
        )}
        {hasGpsError ? (
          <span className="inline-block w-2 h-2 rounded-full bg-red-400 border border-white animate-pulse" />
        ) : geoState?.loading ? (
          <span className="inline-block w-2 h-2 rounded-full bg-cyan-400 border border-white" />
        ) : (
          <span className="inline-block w-2 h-2 rounded-full bg-primary-300 border border-white" />
        )}
      </span>
      <Activity className="w-3 h-3" />
      <span>স্ট্যাটাস <strong className="bg-white/20 px-1 py-0.5 rounded ml-0.5">{totalLogs}</strong></span>
    </motion.button>
  );

  return (
    <>
      {/* Portal into iframe header when slot is found */}
      {portalContainer.current && createPortal(headerFAB, portalContainer.current)}

      {/* Drawer: always rendered as overlay (portal or fallback) */}
      <div className="md:hidden block fixed bottom-3 right-3 z-50 pointer-events-none font-sans">
        <div className="flex flex-col items-end gap-2 pointer-events-auto">
          {/* Fallback FAB when portal not ready */}
          {!portalContainer.current && (
            <motion.button
              id="mobileControlCenterFAB"
              onClick={() => setIsOpen(!isOpen)}
              className={`flex items-center gap-1.5 px-3 py-2.5 rounded-full shadow-2xl border backdrop-blur-md transition-all text-[11px] font-bold cursor-pointer ${
                totalLogs > 0
                  ? 'bg-primary-500 border-primary-400 text-white'
                  : 'bg-slate-900 border-slate-800 text-white'
              }`}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <span className="flex items-center gap-1">
                {totalLogs > 0 ? (
                  <span className="inline-block w-2 h-2 rounded-full bg-orange-400 border border-white animate-pulse" />
                ) : (
                  <span className="inline-block w-1.5 h-1.5 rounded-full bg-gray-400" />
                )}
                {isOnline ? (
                  <span className="inline-block w-2 h-2 rounded-full bg-primary-300 border border-white" />
                ) : (
                  <span className="inline-block w-2 h-2 rounded-full bg-amber-400 border border-white animate-pulse" />
                )}
                {hasGpsError ? (
                  <span className="inline-block w-2 h-2 rounded-full bg-red-400 border border-white animate-pulse" />
                ) : geoState?.loading ? (
                  <span className="inline-block w-2 h-2 rounded-full bg-cyan-400 border border-white" />
                ) : (
                  <span className="inline-block w-2 h-2 rounded-full bg-primary-300 border border-white" />
                )}
              </span>
              <Activity className="w-3.5 h-3.5" />
              <span>
                {language === 'bn' ? 'স্ট্যাটাস' : 'System'}{' '}
                <strong className="bg-white/20 px-1.5 py-0.5 rounded ml-0.5">
                  {toBnNum(totalLogs)}
                </strong>
              </span>
            </motion.button>
          )}

        {/* Dynamic Slide-Up Bottom Drawer sheet popup */}
        <AnimatePresence>
          {isOpen && (
            <>
              {/* Back backdrop to cover view smartly */}
              <div 
                className="fixed inset-0 bg-black/40 backdrop-blur-sm -z-10" 
                onClick={() => setIsOpen(false)}
              />

              <motion.div
                id="mobileControlCenterDrawer"
                initial={{ opacity: 0, y: 15, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 15, scale: 0.95 }}
                transition={{ type: 'spring', damping: 25, stiffness: 280 }}
                className="w-[88vw] max-w-sm bg-container/95 border border-gray-200 shadow-2xl rounded-xl p-4 flex flex-col gap-3 max-h-[80vh] overflow-y-auto"
              >
                {/* Drawer Header Navbar */}
                <div className="flex items-center justify-between border-b border-gray-100 pb-2.5">
                  <div className="flex flex-col">
                    <span className="font-extrabold text-gray-800 text-xs tracking-tight uppercase flex items-center gap-1.5">
                      <Activity className="w-4 h-4 text-primary-500 animate-pulse" />
                      {t.title}
                    </span>
                    <span className="text-[9.5px] text-gray-400 mt-0.5 uppercase tracking-wider">
                      {language === 'bn' ? 'লাইভ সিস্টেম প্যারামিটার' : 'Live System Monitor'}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    {/* Toggle Language */}
                    <button
                      id="mobileCenterLangToggle"
                      onClick={() => setLanguage(language === 'bn' ? 'en' : 'bn')}
                      className="px-2 py-0.5 rounded border border-gray-200 bg-container text-[10px] font-semibold text-gray-600 active:bg-surface flex items-center gap-1"
                    >
                      <Globe className="w-3 h-3 text-gray-400" />
                      {language === 'bn' ? 'English' : 'বাংলা'}
                    </button>
                    {/* Close Drawer button */}
                    <button
                      id="mobileCenterCloseBtn"
                      onClick={() => setIsOpen(false)}
                      className="p-1.5 rounded-full text-gray-400 active:text-gray-800 active:bg-gray-100 transition-colors"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Grid Tabs Selection Row */}
                <div className="grid grid-cols-3 gap-1 bg-surface border border-gray-100 p-1 rounded-xl">
                  {/* Tab 1: DB */}
                  <button
                    onClick={() => setActiveTab('db')}
                    className={`py-1.5 rounded-lg text-[10.5px] font-semibold flex flex-col items-center justify-center gap-1 transition-all ${
                      activeTab === 'db'
                        ? 'bg-primary-500 text-white shadow-sm'
                        : 'text-gray-600 active:bg-gray-100'
                    }`}
                  >
                    <Database className="w-3.5 h-3.5" />
                    {t.db}
                  </button>

                  {/* Tab 2: Connection */}
                  <button
                    onClick={() => setActiveTab('net')}
                    className={`py-1.5 rounded-lg text-[10.5px] font-semibold flex flex-col items-center justify-center gap-1 transition-all ${
                      activeTab === 'net'
                        ? 'bg-primary-500 text-white shadow-sm'
                        : 'text-gray-600 active:bg-gray-100'
                    }`}
                  >
                    {isOnline ? <Wifi className="w-3.5 h-3.5" /> : <WifiOff className="w-3.5 h-3.5 text-amber-500" />}
                    {t.net}
                  </button>

                  {/* Tab 3: GPS */}
                  <button
                    onClick={() => setActiveTab('gps')}
                    className={`py-1.5 rounded-lg text-[10.5px] font-semibold flex flex-col items-center justify-center gap-1 transition-all ${
                      activeTab === 'gps'
                        ? 'bg-primary-500 text-white shadow-sm'
                        : 'text-gray-600 active:bg-gray-100'
                    }`}
                  >
                    <MapPin className="w-3.5 h-3.5" />
                    {t.gps}
                  </button>
                </div>

                {/* Tab Contents Frame */}
                <div className="flex-1 min-h-[160px] max-h-[280px] overflow-y-auto py-1">
                  
                  {/* SECTION 1: DATABASE CODES */}
                  {activeTab === 'db' && (
                    <div className="flex flex-col gap-3 animate-in" id="mobileControlCenterTabDB">

                      {/* Queue Status Bar */}
                      {queueReady && queueStats && (
                        <div className="flex flex-wrap gap-2 items-center">
                          {queueStats.pending > 0 && (
                            <span className="text-[10px] font-bold px-2 py-1 rounded-full bg-amber-100 text-amber-800 border border-amber-200">
                              ⏳ {toBnNum(queueStats.pending)} পেন্ডিং
                            </span>
                          )}
                          {queueStats.syncing > 0 && (
                            <span className="text-[10px] font-bold px-2 py-1 rounded-full bg-blue-100 text-blue-800 border border-blue-200 animate-pulse">
                              🔄 {toBnNum(queueStats.syncing)} সিঙ্কিং
                            </span>
                          )}
                          {queueStats.synced > 0 && (
                            <span className="text-[10px] font-bold px-2 py-1 rounded-full bg-green-100 text-green-800 border border-green-200">
                              ✅ {toBnNum(queueStats.synced)} সিঙ্কড
                            </span>
                          )}
                          {queueStats.failed > 0 && (
                            <button
                              onClick={handleRetryFailed}
                              disabled={retrying}
                              className="text-[10px] font-bold px-2 py-1 rounded-full bg-red-100 text-red-800 border border-red-200 hover:bg-red-200 transition flex items-center gap-1"
                            >
                              <RefreshCw className={`w-3 h-3 ${retrying ? 'animate-spin' : ''}`} />
                              ❌ {toBnNum(queueStats.failed)} ব্যর্থ — রিট্রাই
                            </button>
                          )}
                        </div>
                      )}
                      
                      {/* Grid Metrics */}
                      <div className="grid grid-cols-2 gap-2">
                        {/* Batches count */}
                        <div className="bg-primary-50/50 border border-primary-100 p-2.5 rounded-xl text-center flex flex-col items-center justify-center">
                          <span className="text-[10px] text-primary-700 font-bold uppercase tracking-wider opacity-80">{t.offlineSub}</span>
                          <span className="text-xl font-extrabold text-primary-600 mt-0.5">{toBnNum(totalLogs)}</span>
                        </div>
                        {/* Seedlings count */}
                        <div className="bg-lime-50/50 border border-lime-100 p-2.5 rounded-xl text-center flex flex-col items-center justify-center">
                          <span className="text-[10px] text-lime-800 font-bold uppercase tracking-wider opacity-80">{t.totalPlanted}</span>
                          <span className="text-xl font-extrabold text-lime-700 mt-0.5">{toBnNum(totalSeedlings)}</span>
                        </div>
                      </div>

                      {/* Seedling varieties bar tracker */}
                      <div className="flex flex-col gap-2 bg-surface border border-gray-100 p-3 rounded-xl">
                        
                        {/* Fruit seedlings */}
                        <div className="flex flex-col gap-0.5">
                          <div className="flex justify-between items-center text-[10px] font-bold">
                            <span className="text-orange-600">{t.fruit}</span>
                            <span className="text-gray-700">{toBnNum(fruitCount)}</span>
                          </div>
                          <div className="w-full h-1 bg-gray-200 rounded-full overflow-hidden">
                            <div className="bg-orange-500 h-full rounded" style={{ width: `${totalSeedlings > 0 ? (fruitCount / totalSeedlings) * 100 : 0}%` }} />
                          </div>
                        </div>

                        {/* Forest seedlings */}
                        <div className="flex flex-col gap-0.5">
                          <div className="flex justify-between items-center text-[10px] font-bold">
                            <span className="text-primary-600">{t.forest}</span>
                            <span className="text-gray-700">{toBnNum(forestCount)}</span>
                          </div>
                          <div className="w-full h-1 bg-gray-200 rounded-full overflow-hidden">
                            <div className="bg-primary-500 h-full rounded" style={{ width: `${totalSeedlings > 0 ? (forestCount / totalSeedlings) * 100 : 0}%` }} />
                          </div>
                        </div>

                        {/* Medicinal seedlings */}
                        <div className="flex flex-col gap-0.5">
                          <div className="flex justify-between items-center text-[10px] font-bold">
                            <span className="text-blue-600">{t.medicinal}</span>
                            <span className="text-gray-700">{toBnNum(medicinalCount)}</span>
                          </div>
                          <div className="w-full h-1 bg-gray-200 rounded-full overflow-hidden">
                            <div className="bg-blue-500 h-full rounded" style={{ width: `${totalSeedlings > 0 ? (medicinalCount / totalSeedlings) * 100 : 0}%` }} />
                          </div>
                        </div>

                      </div>

                      {/* Top Districts */}
                      {sortedDistricts.length > 0 && (
                        <div className="flex flex-col gap-1.5 pt-0.5">
                          <span className="text-[10px] text-gray-500 font-black uppercase tracking-wider">{t.districts}</span>
                          <div className="flex flex-col gap-1">
                            {sortedDistricts.map(([name, val]) => (
                              <div key={name} className="flex items-center justify-between px-2.5 py-1.5 bg-surface border border-gray-100 rounded-lg text-[11px]">
                                <span className="font-semibold text-gray-600">{name}</span>
                                <span className="bg-container px-2 py-0.5 rounded border border-gray-200 font-bold text-primary-600 text-[10px]">
                                  {toBnNum(val)} {language === 'bn' ? 'টি এন্ট্রি' : 'entries'}
                                </span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* National Goal Badge panel */}
                      <div className="bg-amber-50/40 border border-amber-100/50 p-2.5 rounded-xl text-[10px] flex gap-2">
                        <Award className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                        <div className="flex flex-col">
                          <strong className="text-amber-800 font-bold">{t.goalTitle}</strong>
                          <span className="text-gray-600 leading-normal mt-0.5">{t.goalProgress}</span>
                        </div>
                      </div>

                    </div>
                  )}

                  {/* SECTION 2: CONNECTION & REGULATION */}
                  {activeTab === 'net' && (
                    <div className="flex flex-col gap-3 animate-in hover:shadow-none" id="mobileControlCenterTabNet">
                      
                      {/* Live items stat list */}
                      <div className="flex flex-col gap-2.5 bg-surface border border-gray-100 p-3 rounded-xl">
                        
                        {/* Online or offline status */}
                        <div className="flex items-center justify-between text-xs">
                          <span className="text-gray-500 font-medium">{t.conStat}</span>
                          <span className={`font-black uppercase tracking-wide flex items-center gap-1.5 ${isOnline ? 'text-primary-500' : 'text-amber-600'}`}>
                            <CircleDot className={`w-3.5 h-3.5 ${isOnline ? 'text-primary-400' : 'text-amber-500 animate-pulse'}`} />
                            {isOnline ? (language === 'bn' ? 'সংযুক্ত' : 'Connected') : (language === 'bn' ? 'সংযোগ বিচ্ছিন্ন' : 'Offline')}
                          </span>
                        </div>

                        {/* Service Worker Sync details */}
                        <div className="flex items-center justify-between text-xs border-t border-gray-200/50 pt-2">
                          <span className="text-gray-500 font-medium">{t.syncEngine}</span>
                          <span className="text-gray-700 font-bold">
                            {networkState?.swState === 'active' 
                              ? t.activeSafe 
                              : networkState?.swState === 'uninstalled' 
                              ? t.localEnv 
                              : t.browserSupport}
                          </span>
                        </div>

                        {/* Storage usage estimate on device disk */}
                        {networkState?.storageEstimate && (
                          <div className="flex flex-col gap-1 border-t border-gray-200/50 pt-2">
                            <div className="flex items-center justify-between text-[11px]">
                              <span className="text-gray-500 font-medium flex items-center gap-1">
                                <HardDrive className="w-3.5 h-3.5 text-gray-400" />
                                {t.diskUsed}
                              </span>
                              <span className="font-bold text-gray-700">
                                {networkState.storageEstimate.used} MB / {networkState.storageEstimate.total} GB
                              </span>
                            </div>
                            <div className="w-full h-1 bg-gray-200 rounded-full overflow-hidden mt-0.5">
                              <div className="bg-primary-500 h-full rounded" style={{ width: `${networkState.storageEstimate.percent}%` }} />
                            </div>
                          </div>
                        )}

                      </div>

                      {/* Visual sync info box depending on mode */}
                      <div className={`p-3 rounded-xl border text-[10px] leading-relaxed flex gap-2 ${
                        isOnline 
                          ? 'bg-primary-50/50 border-primary-100 text-primary-700' 
                          : 'bg-amber-50/50 border-amber-100 text-amber-800'
                      }`}>
                        <Info className="w-4 h-4 shrink-0 mt-0.5 text-current" />
                        <div className="flex flex-col gap-0.5">
                          <strong className="font-black">
                            {isOnline 
                              ? (language === 'bn' ? 'সংযুক্ত নেটওয়ার্ক মোড' : 'Online Sync Active') 
                              : t.warningOffline}
                          </strong>
                          <span>
                            {isOnline 
                              ? (language === 'bn' ? 'আপনার সকল কার্যক্রম ক্লাউড সিকিউর ডাটাবেজের সাথে নিখুঁতভাবে রিয়েল-টাইমে সিঙ্ক করা হচ্ছে।' : 'All system operations are running synced with the secure servers.')
                              : t.secureBg}
                          </span>
                        </div>
                      </div>

                    </div>
                  )}

                  {/* SECTION 3: GEOLOCATION PRECISIONS */}
                  {activeTab === 'gps' && (
                    <div className="flex flex-col gap-3 animate-in" id="mobileControlCenterTabGPS">
                      
                      <div className="flex flex-col gap-2.5 bg-surface border border-gray-100 p-3 rounded-xl">
                        
                        {/* Coords detail */}
                        <div className="flex items-center justify-between text-xs">
                          <span className="text-gray-500 font-medium">{t.coords}</span>
                          {geoState?.coords ? (
                            <div className="flex items-center gap-1.5 font-bold text-gray-800 font-mono">
                              <span>
                                {geoState.coords.latitude.toFixed(5)}, {geoState.coords.longitude.toFixed(5)}
                              </span>
                              <button
                                onClick={handleCopyCoords}
                                className="p-1 rounded bg-container border border-gray-200 active:bg-gray-100 text-gray-500 active:text-gray-800"
                                title="স্থানাঙ্ক কপি করুন"
                              >
                                {copied ? <Check className="w-3 h-3 text-primary-500" /> : <Copy className="w-3 h-3" />}
                              </button>
                            </div>
                          ) : (
                            <span className="text-gray-400 italic font-mono">{t.loading}</span>
                          )}
                        </div>

                        {/* Accuracy accuracy */}
                        <div className="flex items-center justify-between text-xs border-t border-gray-200/50 pt-2">
                          <span className="text-gray-500 font-medium">{t.accuracy}</span>
                          {geoState?.coords ? (
                            <div className="flex items-center gap-1.5">
                              <span className="font-bold text-gray-700">
                                {toBnNum(Math.round(geoState.coords.accuracy))} {language === 'bn' ? 'মিটার' : 'm'}
                              </span>
                              <span className={language === 'bn' 
                                ? getGpsPrecisionBN(geoState.coords.accuracy).color 
                                : getGpsPrecisionEN(geoState.coords.accuracy).color
                              }>
                                {language === 'bn' 
                                  ? getGpsPrecisionBN(geoState.coords.accuracy).label 
                                  : getGpsPrecisionEN(geoState.coords.accuracy).label}
                              </span>
                            </div>
                          ) : (
                            <span className="text-gray-400">-</span>
                          )}
                        </div>

                        {/* Permission permission state */}
                        <div className="flex items-center justify-between text-xs border-t border-gray-200/50 pt-2">
                          <span className="text-gray-500 font-medium">{t.gpsPerm}</span>
                          <span className={`font-bold flex items-center gap-1 text-[11px] ${
                            geoState?.error ? 'text-red-600' : 'text-primary-600'
                          }`}>
                            <CircleDot className="w-3.5 h-3.5" />
                            {geoState?.error ? t.noPerm : t.okPerm}
                          </span>
                        </div>

                      </div>

                      {/* Error panel or tips */}
                      {geoState?.error ? (
                        <div className="p-3 bg-red-50 border border-red-150 text-red-800 text-[10.5px] rounded-xl leading-relaxed">
                          <strong className="font-bold block mb-0.5">গুগল ম্যাপ রিমোট জিপিএস ত্রুটি:</strong>
                          <span>{geoState.error}</span>
                        </div>
                      ) : (
                        <div className="p-2.5 bg-sky-50/50 border border-sky-100 text-sky-800 rounded-xl text-[10px] leading-relaxed flex gap-2">
                          <Info className="w-4 h-4 text-sky-600 shrink-0 mt-0.5" />
                          <span>
                            {language === 'bn' 
                              ? 'আপনার জিপিএস সিগন্যালে অবস্থান নির্ভুলভাবে ট্র্যাকিং করা হচ্ছে। বৃক্ষ রোপণের সঠিক লোকেশন ম্যাপে চিহ্নিত হতে এটি কার্যকর।'
                              : 'Highly accurate real-time coordinates are synced automatically onto the layout maps to pinpoint nurseries.'}
                          </span>
                        </div>
                      )}

                    </div>
                  )}

                </div>

                {/* Subfooter: Core User Guide button (Manual trigger) */}
                <div className="border-t border-gray-100 pt-2.5 flex flex-col gap-2">
                  <div className="flex items-center justify-between bg-primary-50/30 border border-primary-100/40 p-2.5 rounded-xl">
                    <div className="flex flex-col gap-0.5">
                      <span className="font-bold text-gray-800 text-[11px] flex items-center gap-1.5">
                        <HelpCircle className="w-4 h-4 text-primary-500" />
                        {t.guideLaunchText}
                      </span>
                      <span className="text-[10px] text-gray-500 leading-normal">
                        {t.guideDesc}
                      </span>
                    </div>
                    
                    <button
                      id="mobileCenterGuideLauncher"
                      onClick={handleOpenUserGuide}
                      className="px-3 py-1.5 rounded-lg bg-primary-500 hover:bg-primary-600 text-white font-bold text-[10.5px] transition-colors shadow flex items-center gap-0.5 cursor-pointer shrink-0"
                    >
                      {language === 'bn' ? 'টিউটোরিয়াল' : 'Tutorial'}
                      <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

              </motion.div>
            </>
          )}
        </AnimatePresence>
        </div>
      </div>
    </>
  );
}

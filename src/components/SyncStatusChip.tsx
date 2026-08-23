/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Cloud, CheckCircle2, RefreshCw, WifiOff, Info, AlertTriangle } from 'lucide-react';
import { haptics } from '../utils/haptics';
import { Submission } from './OfflinePlantationDashboard';

interface SyncStatusChipProps {
  submissions: Submission[];
  isOnline: boolean;
}

type RetryState = 'idle' | 'retrying' | 'result';

/**
 * A field officer working somewhere with one bar of signal needs to know,
 * at a glance and without reading paragraphs, "do I still have data stuck on
 * this phone?" — and needs a big, obvious button to retry the moment they
 * get better signal. This sits fixed on screen at all times (not tucked into
 * a desktop-only dashboard, and not just colored dots in a header), reflects
 * the actual synced/queued counts from local storage, and can trigger a
 * manual resync pass in the legacy form without opening every record.
 */
export default function SyncStatusChip({ submissions, isOnline }: SyncStatusChipProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [retryState, setRetryState] = useState<RetryState>('idle');
  const [lastResult, setLastResult] = useState<{ synced: number; failed: number } | null>(null);
  const prevQueuedRef = useRef<number | null>(null);

  const totalLogs = submissions.length;
  const queuedCount = submissions.filter((s) => s.synced === false).length;
  const syncedCount = totalLogs - queuedCount;

  // Warn-buzz the moment a submission lands in the offline queue, and
  // success-buzz when the queue drains to zero — both cases the officer
  // needs to notice even if they're not looking at the screen.
  useEffect(() => {
    if (prevQueuedRef.current !== null) {
      if (queuedCount > prevQueuedRef.current) {
        haptics.warning();
      } else if (queuedCount === 0 && prevQueuedRef.current > 0) {
        haptics.success();
      }
    }
    prevQueuedRef.current = queuedCount;
  }, [queuedCount]);

  // Listen for the legacy form's own "queued offline" signal (covers the
  // edit-flow case where the count above may not change) and the retry-pass
  // result posted back from retryAllUnsynced() in plantation.html.
  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      if (!event.data) return;
      if (event.data.type === 'offline-submission-queued') {
        haptics.warning();
      }
      if (event.data.type === 'sync-retry-result') {
        setRetryState('result');
        setLastResult({ synced: event.data.synced || 0, failed: event.data.failed || 0 });
        if (event.data.failed > 0) haptics.error();
        else haptics.success();
        setTimeout(() => setRetryState('idle'), 3500);
      }
    };
    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, []);

  const handleSyncNow = () => {
    if (retryState === 'retrying') return;
    setRetryState('retrying');
    setLastResult(null);
    haptics.light();
    try {
      const iframe = document.querySelector('iframe');
      iframe?.contentWindow?.postMessage({ type: 'trigger-sync' }, '*');
    } catch {
      // ignore — iframe not ready
    }
    // Safety timeout in case the iframe never responds (e.g. still loading).
    setTimeout(() => {
      setRetryState((prev) => (prev === 'retrying' ? 'idle' : prev));
    }, 15000);
  };

  const hasQueue = queuedCount > 0;

  return (
    <div
      className="fixed z-40 font-sans"
      style={{ bottom: '84px', left: '14px' }}
    >
      <div className="flex flex-col items-start gap-2">
        {/* Persistent glanceable chip — always visible, large tap target */}
        <motion.button
          onClick={() => setIsExpanded(!isExpanded)}
          whileTap={{ scale: 0.96 }}
          aria-label={hasQueue ? `${queuedCount}টি তথ্য অফলাইনে জমা আছে, সিঙ্ক করতে চাপুন` : 'সকল তথ্য সিঙ্ক করা হয়েছে'}
          className={`flex items-center gap-2 rounded-full shadow-lg px-3.5 py-2.5 text-xs font-bold cursor-pointer active:scale-95 transition min-h-[44px] ${
            hasQueue
              ? 'text-white'
              : 'text-white'
          }`}
          style={{
            background: hasQueue ? (isOnline ? '#D97706' : '#B91C1C') : '#006A4E',
          }}
        >
          <div className="relative flex items-center justify-center shrink-0">
            {retryState === 'retrying' ? (
              <RefreshCw size={16} className="animate-spin" />
            ) : hasQueue ? (
              <>
                <span className="absolute animate-ping h-full w-full rounded-full bg-white opacity-30" />
                {isOnline ? <Cloud size={16} className="relative" /> : <AlertTriangle size={16} className="relative" />}
              </>
            ) : (
              <CheckCircle2 size={16} />
            )}
          </div>
          <span className="hidden xs:inline">
            {hasQueue ? `${queuedCount}টি অফলাইনে বাকি` : 'সব সিঙ্ক সম্পন্ন'}
          </span>
          {hasQueue && (
            <span className="bg-white/25 rounded-full px-1.5 py-0.5 text-[10px] font-mono">
              {queuedCount}
            </span>
          )}
        </motion.button>

        {/* Detail panel */}
        <AnimatePresence>
          {isExpanded && (
            <motion.div
              initial={{ opacity: 0, y: 8, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 8, scale: 0.95 }}
              transition={{ duration: 0.15 }}
              className="w-72 max-w-[calc(100vw-2rem)] bg-container border border-gray-150 rounded-xl p-4 shadow-xl text-gray-800 text-xs flex flex-col gap-3"
            >
              <div className="flex items-center justify-between border-b border-gray-100 pb-2">
                <span className="font-bold text-sm flex items-center gap-1.5">
                  {hasQueue ? <AlertTriangle size={16} className="text-amber-600" /> : <CheckCircle2 size={16} className="text-primary-500" />}
                  সিঙ্ক স্ট্যাটাস
                </span>
                {!isOnline && (
                  <span className="flex items-center gap-1 text-[10px] text-red-600 font-semibold bg-red-50 border border-red-100 rounded-full px-2 py-0.5">
                    <WifiOff size={11} /> অফলাইন
                  </span>
                )}
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div className="bg-primary-50/50 border border-primary-100 rounded-xl p-2.5 flex flex-col items-center text-center">
                  <span className="text-[10px] font-medium text-primary-700 uppercase tracking-wide">সিঙ্কড</span>
                  <span className="text-lg font-extrabold text-primary-600">{syncedCount}</span>
                </div>
                <div className={`rounded-xl p-2.5 flex flex-col items-center text-center border ${hasQueue ? 'bg-amber-50/60 border-amber-100' : 'bg-gray-50 border-gray-100'}`}>
                  <span className={`text-[10px] font-medium uppercase tracking-wide ${hasQueue ? 'text-amber-700' : 'text-gray-500'}`}>বাকি আছে</span>
                  <span className={`text-lg font-extrabold ${hasQueue ? 'text-amber-600' : 'text-gray-400'}`}>{queuedCount}</span>
                </div>
              </div>

              {retryState === 'result' && lastResult && (
                <div className={`text-[11px] rounded-lg px-2.5 py-2 flex items-start gap-1.5 ${lastResult.failed > 0 ? 'bg-red-50 text-red-700 border border-red-100' : 'bg-primary-50 text-primary-700 border border-primary-100'}`}>
                  <Info size={13} className="shrink-0 mt-0.5" />
                  <span>
                    {lastResult.synced > 0 && `${lastResult.synced}টি সিঙ্ক হয়েছে। `}
                    {lastResult.failed > 0 && `${lastResult.failed}টি এখনও ব্যর্থ — সিগন্যাল উন্নত হলে আবার চেষ্টা করুন।`}
                  </span>
                </div>
              )}

              <button
                onClick={handleSyncNow}
                disabled={retryState === 'retrying' || !hasQueue}
                className="flex items-center justify-center gap-1.5 w-full font-bold py-2.5 rounded-lg text-xs tracking-wide transition cursor-pointer border-none shadow-md disabled:opacity-50 disabled:cursor-not-allowed min-h-[44px]"
                style={{ background: hasQueue ? '#006A4E' : '#9CA3AF', color: 'white' }}
              >
                <RefreshCw size={14} className={retryState === 'retrying' ? 'animate-spin' : ''} />
                {retryState === 'retrying' ? 'সিঙ্ক করা হচ্ছে...' : hasQueue ? 'এখনই সিঙ্ক করুন' : 'সব তথ্য সিঙ্ক আছে'}
              </button>

              <p className="text-[10.5px] text-gray-500 leading-relaxed">
                {hasQueue
                  ? 'ইন্টারনেট সংযোগ ফিরে এলে তথ্য স্বয়ংক্রিয়ভাবে সিঙ্ক হওয়ার চেষ্টা করবে। ম্যানুয়ালি এখনই চেষ্টা করতে উপরের বাটনে চাপুন।'
                  : 'আপনার সকল বৃক্ষরোপণ তথ্য নিরাপদে সার্ভারে সংরক্ষিত হয়েছে।'}
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

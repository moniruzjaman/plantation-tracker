import { useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { motion } from 'framer-motion';
import { Activity } from 'lucide-react';

import { GeoState } from './GeolocationIndicator';
import { NetworkStatusData } from './NetworkStatus';
import { Submission } from './OfflinePlantationDashboard';

interface MobileControlCenterProps {
  networkState: NetworkStatusData | null;
  geoState: GeoState | null;
  submissions: Submission[];
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
    </>
  );
}

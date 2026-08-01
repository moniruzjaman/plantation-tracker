import { useState } from 'react';
import { Wifi, WifiOff, MapPin, Share2 } from 'lucide-react';
import ShareModal from '../ShareModal';

interface AppHeaderProps {
  isOnline?: boolean;
  geoStatus?: string;
}
const geoLabel: Record<string, string> = {
  active: 'GPS সক্রিয়',
  searching: 'GPS অনুসন্ধান',
  error: 'GPS ত্রুটি',
  denied: 'GPS অনুমতি নেই',
};
export default function AppHeader({ isOnline = true, geoStatus = 'searching' }: AppHeaderProps) {
  const geo = geoLabel[geoStatus] ?? geoStatus;
  const geoColor = geoStatus === 'active' ? 'bg-green-500/20 text-green-100' : 'bg-red-500/20 text-red-100';
  const netColor = isOnline ? 'bg-green-500/20 text-green-100' : 'bg-red-500/20 text-red-100';

  const [showShare, setShowShare] = useState(false);

  return (
    <>
      <header className="bg-[#14532d] text-white">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between gap-3">
          {/* Logo + Title */}
          <div className="flex items-center gap-3 min-w-0">
            <img
              src="/dae-logo.webp"
              alt="DAE"
              onError={(e) => {
                (e.target as HTMLImageElement).src = '/dae-logo.png';
              }}
              className="w-11 h-11 rounded-full bg-white/10 object-contain flex-shrink-0"
            />
            <div className="min-w-0">
              <h1 className="text-lg font-bold leading-tight truncate">বৃক্ষরোপণ ট্র্যাকার</h1>
              <p className="text-xs text-green-200/80 leading-tight truncate">০৫ বছরে ২৫ কোটি বৃক্ষরোপণ</p>
            </div>
          </div>

          {/* Status pills + portal slot */}
          <div className="flex items-center gap-2 flex-shrink-0">
            {/* GPS pill */}
            <span className={`inline-flex items-center gap-1 text-[10px] font-medium px-2 py-0.5 rounded-full ${geoColor}`}>
              <MapPin className="w-3 h-3" />
              <span className="hidden sm:inline">{geo}</span>
            </span>

            {/* Network pill */}
            <span className={`inline-flex items-center gap-1 text-[10px] font-medium px-2 py-0.5 rounded-full ${netColor}`}>
              {isOnline ? <Wifi className="w-3 h-3" /> : <WifiOff className="w-3 h-3" />}
              <span className="hidden sm:inline">{isOnline ? 'অনলাইন' : 'অফলাইন'}</span>
            </span>

            {/* #47: Share button */}
            <button
              type="button"
              onClick={() => setShowShare(true)}
              className="inline-flex items-center gap-1 text-[10px] font-medium px-2 py-0.5 rounded-full bg-white/20 text-white/90 hover:bg-white/30 transition cursor-pointer"
              title="শেয়ার করুন"
            >
              <Share2 className="w-3 h-3" />
              <span className="hidden sm:inline">শেয়ার</span>
            </button>

            {/* React portal slot for external indicator (e.g. GeolocationIndicator) */}
            <div id="header-react-slots" />
          </div>
        </div>
      </header>

      {/* Share Modal */}
      <ShareModal open={showShare} onClose={() => setShowShare(false)} />
    </>
  );
}

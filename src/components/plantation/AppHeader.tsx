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
      <header
        className="text-white py-3 px-4 shadow-lg relative overflow-hidden"
        style={{ background: 'linear-gradient(135deg,#0f5132 0%,#166534 45%,#052e16 100%)' }}
      >
        {/* Decorative radial accent, matches legacy */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{ background: 'radial-gradient(circle at 88% -20%, rgba(220,38,38,.38) 0%, rgba(220,38,38,0) 55%)' }}
        />

        <div className="max-w-6xl mx-auto flex items-center gap-3 relative z-10">
          {/* BD government seal */}
          <img
            src="/logo.svg"
            alt="বাংলাদেশ সরকার"
            className="w-11 h-11 sm:w-14 sm:h-14 bg-white rounded-full p-1 shadow flex-shrink-0"
          />

          <div className="text-center sm:text-left min-w-0 flex-1">
            <p className="text-xs sm:text-sm" style={{ color: '#bbf7d0' }}>
              গণপ্রজাতন্ত্রী বাংলাদেশ সরকার
            </p>
            <h1 className="text-xs sm:text-sm md:text-base lg:text-lg font-bold leading-snug truncate">
              "কৃষি সম্প্রসারণ অধিদপ্তর"
            </h1>
            <p className="text-xs sm:text-sm mt-0.5 font-medium" style={{ color: '#dcfce7' }}>
              বৃক্ষ রোপণে সাজাই দেশ, সবার আগে বাংলাদেশ
            </p>
          </div>

          {/* DAE seal */}
          <img
            src="/dae-logo.webp"
            alt="কৃষি সম্প্রসারণ অধিদপ্তর"
            onError={(e) => {
              (e.target as HTMLImageElement).src = '/dae-logo.png';
            }}
            className="w-11 h-11 sm:w-14 sm:h-14 bg-white rounded-full p-1 shadow flex-shrink-0"
          />
        </div>

        {/* Gradient divider, matches legacy */}
        <div
          className="relative z-10 mt-2.5 rounded"
          style={{ height: 3, background: 'linear-gradient(to right,#166534,#dc2626 50%,#166534)', opacity: 0.9 }}
        />

        {/* Status pills + share + portal slot */}
        <div className="max-w-6xl mx-auto flex items-center justify-between relative z-10 mt-1.5">
          <div className="flex items-center gap-2">
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

            {/* React portal slot for external indicator (e.g. GeolocationIndicator) */}
            <div id="header-react-slots" />
          </div>

          {/* Share button */}
          <button
            type="button"
            onClick={() => setShowShare(true)}
            className="inline-flex items-center gap-1 text-[10px] font-semibold px-1 cursor-pointer bg-transparent border-none"
            style={{ color: '#fecaca' }}
            title="অ্যাপ শেয়ার করুন"
          >
            <Share2 className="w-3 h-3" />
            <span>শেয়ার</span>
          </button>
        </div>
      </header>

      {/* Share Modal */}
      <ShareModal open={showShare} onClose={() => setShowShare(false)} />
    </>
  );
}

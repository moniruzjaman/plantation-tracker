import { useState } from 'react';
import {
  X,
  Share2,
  MessageCircle,
  Mail,
  Phone,
  Copy,
  Monitor,
  Check,
} from 'lucide-react';

interface ShareModalProps {
  open: boolean;
  onClose: () => void;
  title?: string;
  text?: string;
  url?: string;
}

const APP_URL = typeof window !== 'undefined' ? window.location.href : 'https://plantation-tracker.app';

const SHARE_CHANNELS = [
  { key: 'whatsapp', label: 'WhatsApp', icon: '💬', color: 'bg-green-500 hover:bg-green-600', shareFn: (text: string) => `https://wa.me/?text=${encodeURIComponent(text)}` },
  { key: 'facebook', label: 'Facebook', icon: '📘', color: 'bg-blue-600 hover:bg-blue-700', shareFn: (text: string) => `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(APP_URL)}&quote=${encodeURIComponent(text)}` },
  { key: 'telegram', label: 'Telegram', icon: '✈️', color: 'bg-sky-500 hover:bg-sky-600', shareFn: (text: string) => `https://t.me/share/url?url=${encodeURIComponent(APP_URL)}&text=${encodeURIComponent(text)}` },
  { key: 'email', label: 'ইমেইল', icon: '📧', color: 'bg-gray-600 hover:bg-gray-700', shareFn: (text: string) => `mailto:?subject=${encodeURIComponent('বৃক্ষরোপণ ট্র্যাকার')}&body=${encodeURIComponent(text)}` },
  { key: 'sms', label: 'SMS', icon: '📱', color: 'bg-amber-500 hover:bg-amber-600', shareFn: (text: string) => `sms:?body=${encodeURIComponent(text)}` },
];

export default function ShareModal({ open, onClose, title, text, url }: ShareModalProps) {
  const [copied, setCopied] = useState(false);

  const shareText = title || text || 'বৃক্ষরোপণ ট্র্যাকার — দেশের বৃক্ষরোপণ তথ্য সংরক্ষণ ও ট্র্যাক করুন!';
  const shareUrl = url || APP_URL;
  const fullText = `${shareText}\n${shareUrl}`;

  const handleNativeShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({ title: shareText, url: shareUrl, text: fullText });
        onClose();
        return;
      } catch { /* user cancelled */ }
    }
    // Fallback: copy link
    handleCopyLink();
  };

  const handleCopyLink = () => {
    navigator.clipboard?.writeText(fullText).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  const handleChannelShare = (channel: typeof SHARE_CHANNELS[number]) => {
    const link = channel.shareFn(fullText);
    window.open(link, '_blank', 'noopener,noreferrer');
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/40 backdrop-blur-sm p-0" onClick={onClose}>
      <div
        className="bg-white rounded-t-2xl sm:rounded-2xl shadow-2xl w-full max-w-md flex flex-col overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100 bg-gradient-to-r from-[#15803d] to-emerald-600">
          <h3 className="text-sm font-bold text-white flex items-center gap-1.5">
            <Share2 className="w-4 h-4" />
            শেয়ার করুন
          </h3>
          <button type="button" onClick={onClose} className="p-1.5 rounded-lg hover:bg-white/10 transition cursor-pointer">
            <X className="w-4 h-4 text-white" />
          </button>
        </div>

        {/* Content */}
        <div className="p-5 space-y-4">
          {/* Preview text */}
          <p className="text-sm text-gray-700 leading-relaxed">{shareText}</p>
          <div className="text-xs text-gray-400 bg-gray-50 rounded-lg px-3 py-2 break-all font-mono">{shareUrl}</div>

          {/* Native share */}
          <button
            onClick={handleNativeShare}
            className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl text-sm font-bold bg-[#15803d] text-white hover:bg-green-800 transition cursor-pointer"
          >
            <Share2 className="w-4 h-4" />
            শেয়ার করুন
          </button>

          {/* Channel buttons */}
          <div className="grid grid-cols-3 gap-2">
            {SHARE_CHANNELS.map((ch) => (
              <button
                key={ch.key}
                type="button"
                onClick={() => handleChannelShare(ch)}
                className={`flex flex-col items-center gap-1.5 p-3 rounded-xl text-center transition-all cursor-pointer ${ch.color} text-white active:scale-95`}
              >
                <span className="text-lg">{ch.icon}</span>
                <span className="text-[10px] font-medium">{ch.label}</span>
              </button>
            ))}
          </div>

          {/* Copy link */}
          <button
            onClick={handleCopyLink}
            className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl text-sm font-medium bg-gray-100 text-gray-700 hover:bg-gray-200 transition cursor-pointer border border-gray-200"
          >
            {copied ? (
              <>
                <Check className="w-4 h-4 text-green-600" />
                কপি হয়েছে!
              </>
            ) : (
              <>
                <Copy className="w-4 h-4" />
                লিংক কপি করুন
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

import { useState, useEffect, useCallback } from 'react';
import { X, MapPin, BarChart3, Plus, User, Wifi } from 'lucide-react';

interface WelcomeGuideProps {
  open?: boolean;
  onClose?: () => void;
}

const GUIDE_KEY = 'guide_dismissed';

const SECTIONS = [
  {
    icon: <MapPin size={18} className="text-emerald-600 shrink-0" />,
    title: '🗺️ মানচিত্র ট্যাব',
    desc: 'বাংলাদেশের সকল বৃক্ষরোপণের অবস্থান মানচিত্রে দেখুন। প্রতিটি মার্কারে ক্লিক করলে কৃষকের তথ্য ও চারার বিবরণ পাবেন। স্যাটেলাইট ভিউ ও NDVI বিশ্লেষণও রয়েছে।',
  },
  {
    icon: <Plus size={18} className="text-blue-600 shrink-0" />,
    title: '📝 জমা ট্যাব',
    desc: 'নতুন বৃক্ষরোপণের তথ্য জমা দিন। কৃষকের নাম, মোবাইল নম্বর, অবস্থান, চারার ধরন ও সংখ্যা সব এখানে যোগ করুন।',
  },
  {
    icon: <BarChart3 size={18} className="text-amber-600 shrink-0" />,
    title: '📊 ড্যাশবোর্ড ট্যাব',
    desc: 'মোট চারার পরিসংখ্যান, জেলাওয়ারী তুলনা, ফলদ/বনজ/ঔষধি চারার ভাগ এবং সাম্প্রতিক জমাগুলো এক নজরে দেখুন।',
  },
  {
    icon: <User size={18} className="text-purple-600 shrink-0" />,
    title: '👤 প্রোফাইল ট্যাব',
    desc: 'আপনার তথ্য আপডেট করুন, পূর্বের জমাগুলো দেখুন ও সম্পাদনা করুন। অ্যাডমিন হলে সকল জমা পর্যালোচনা করতে পারবেন।',
  },
  {
    icon: <Wifi size={18} className="text-rose-600 shrink-0" />,
    title: '🔄 সিঙ্ক ও অফলাইন',
    desc: 'ইন্টারনেট ছাড়াই কাজ করুন — তথ্য লোকালে সংরক্ষিত হবে। সংযোগ পেলে গুগল শিটে স্বয়ংক্রিয়ভাবে সিঙ্ক হয়ে যাবে।',
  },
];

const TIPS = [
  '📍 সর্বোচ্চ নির্ভুল অবস্থানের জন্য জমা দেওয়ার আগে GPS চালু রাখুন।',
  '📲 এই অ্যাপটি PWA হিসেবে ইন্সটল করা যায় — হোম স্ক্রিনে যোগ করলে দ্রুত অ্যাক্সেস পাবেন।',
  '🔄 নতুন জমা দেওয়ার পর সিঙ্ক বাটন চাপুন বা ইন্টারনেট আসলে স্বয়ংক্রিয় সিঙ্ক হবে।',
];

export default function WelcomeGuide({ open: propOpen, onClose }: WelcomeGuideProps) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (propOpen !== undefined) {
      setVisible(propOpen);
    } else {
      const dismissed = localStorage.getItem(GUIDE_KEY);
      setVisible(!dismissed);
    }
  }, [propOpen]);

  const handleDismiss = useCallback(() => {
    localStorage.setItem(GUIDE_KEY, '1');
    setVisible(false);
    onClose?.();
  }, [onClose]);

  if (!visible) return null;

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="relative bg-gradient-to-br from-emerald-600 to-emerald-800 text-white px-6 pt-6 pb-5 rounded-t-2xl">
          <button
            onClick={handleDismiss}
            className="absolute top-3 right-3 w-8 h-8 flex items-center justify-center rounded-full bg-white/20 hover:bg-white/30 transition-colors cursor-pointer"
            aria-label="বন্ধ করুন"
          >
            <X size={16} />
          </button>
          <h2 className="text-xl font-bold leading-tight">
            🤝 বৃক্ষরোপণ ট্র্যাকারে স্বাগতম!
          </h2>
          <p className="text-emerald-100 text-sm mt-1">
            নিচের গাইডটি পড়ে অ্যাপটি ব্যবহার শুরু করুন
          </p>
        </div>

        {/* Guide sections */}
        <div className="px-6 py-4 space-y-4">
          {SECTIONS.map((sec, i) => (
            <div key={i} className="flex gap-3 items-start">
              <span className="flex items-center justify-center w-6 h-6 rounded-full bg-gray-100 text-xs font-bold text-gray-500 shrink-0 mt-0.5">
                {i + 1}
              </span>
              <div className="min-w-0">
                <div className="flex items-center gap-2 mb-0.5">
                  {sec.icon}
                  <h3 className="text-sm font-semibold text-gray-800">{sec.title}</h3>
                </div>
                <p className="text-xs text-gray-600 leading-relaxed">{sec.desc}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Tips box */}
        <div className="mx-6 mb-4 bg-amber-50 border border-amber-200 rounded-xl p-4">
          <h4 className="text-xs font-bold text-amber-800 mb-2">💡 দরকারী পরামর্শ</h4>
          <ul className="space-y-1.5">
            {TIPS.map((tip, i) => (
              <li key={i} className="text-xs text-amber-700 leading-relaxed">{tip}</li>
            ))}
          </ul>
        </div>

        {/* CTA button */}
        <div className="px-6 pb-6">
          <button
            onClick={handleDismiss}
            className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white font-bold text-sm rounded-xl transition-colors cursor-pointer"
          >
            বুঝেছি, শুরু করি
          </button>
        </div>
      </div>
    </div>
  );
}

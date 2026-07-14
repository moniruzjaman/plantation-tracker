import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Sprout, 
  MapPin, 
  Database, 
  HelpCircle, 
  FileSpreadsheet, 
  ArrowRight, 
  Globe, 
  Check, 
  Flame,
  X
} from 'lucide-react';

export default function WelcomeModal() {
  const [isOpen, setIsOpen] = useState(false);
  const [dontShowAgain, setDontShowAgain] = useState(false);

  useEffect(() => {
    const hasSeenWelcome = localStorage.getItem('hasSeenWelcome_v1');
    if (!hasSeenWelcome) {
      setIsOpen(true);
    }
  }, []);

  const handleClose = () => {
    if (dontShowAgain) {
      localStorage.setItem('hasSeenWelcome_v1', 'true');
    }
    setIsOpen(false);
  };

  const handleOpenHelp = () => {
    setIsOpen(true);
  };

  return (
    <>
      {/* Small subtle help button on screen to trigger the welcome screen again if needed */}
      <button
        onClick={handleOpenHelp}
        id="btnShowWelcomeHelp"
        className="hidden md:flex absolute top-[112px] right-4 z-45 items-center gap-1.5 px-3 py-1.5 rounded-full bg-container/95 border border-gray-150 hover:bg-surface shadow-md text-gray-600 font-medium text-xs cursor-pointer transition-all hover:scale-102 pointer-events-auto"
        title="অ্যাপ্লিকেশন নির্দেশিকা"
      >
        <HelpCircle className="w-4 h-4 text-primary-500" />
        <span className="font-sans">নির্দেশিকা</span>
      </button>

      <AnimatePresence>
        {isOpen && (
          <div 
            id="welcomeModalOverlay"
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-md p-4 overflow-y-auto pointer-events-auto"
          >
            <motion.div
              id="welcomeModalContainer"
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              transition={{ type: 'spring', duration: 0.5, bounce: 0.2 }}
              className="relative w-full max-w-2xl bg-container rounded-xl overflow-hidden shadow-2xl border border-primary-100 flex flex-col font-sans text-gray-800"
            >
              {/* Decorative top green-red ribbon matching Bangladesh identity */}
              <div className="h-2 flex" id="nationalRibbon">
                <div className="bg-primary-600 flex-1 h-full" />
                <div className="bg-red-600 w-12 h-full" />
                <div className="bg-primary-600 flex-1 h-full" />
              </div>

              {/* Close Button top-right */}
              <button
                onClick={handleClose}
                className="absolute top-4 right-4 p-1.5 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-400 hover:text-gray-600 transition cursor-pointer"
                title="বন্ধ করুন"
              >
                <X className="w-5 h-5" />
              </button>

              {/* Main Content Area */}
              <div className="p-6 md:p-8 flex flex-col gap-6 md:gap-7 items-center text-center">
                
                {/* Government Seal & DAE Brand Header */}
                <div className="flex flex-col items-center gap-2.5">
                  <div className="w-20 h-20 p-1 rounded-full bg-container shadow-md border border-gray-100 flex items-center justify-center">
                    <img 
                      src="logo.svg" 
                      alt="Government Seal of Bangladesh" 
                      className="w-full h-full object-contain"
                      referrerPolicy="no-referrer"
                    />
                  </div>
                  <div>
                    <h4 className="text-[11px] font-bold text-primary-700 tracking-wider uppercase">
                      কৃষি সম্প্রসারণ অধিদপ্তর
                    </h4>
                    <p className="text-[9.5px] font-medium text-gray-400">
                      গণপ্রজাতন্ত্রী বাংলাদেশ সরকার
                    </p>
                  </div>
                </div>

                {/* Banner Header with Highlight Text */}
                <div className="flex flex-col gap-3 max-w-lg">
                  <div className="inline-flex self-center items-center gap-1.5 px-3 py-1 bg-gradient-to-r from-primary-400/10 to-primary-400/10 rounded-full border border-primary-400/15">
                    <Sprout className="w-3.5 h-3.5 text-primary-500" />
                    <span className="text-[11px] font-bold text-primary-600">জাতীয় মহা-উদ্যোগ</span>
                  </div>
                  <h2 className="text-xl md:text-2xl font-extrabold text-gray-900 leading-snug tracking-tight">
                    "৫ বছরে ২৫ কোটি বৃক্ষ রোপণ"
                  </h2>
                  
                  {/* Provided Main Introduction Block */}
                  <p className="text-sm text-gray-700 font-medium leading-relaxed bg-primary-50/40 p-3.5 rounded-lg border border-primary-400/5 shadow-inner">
                    কর্মসূচির আওতাভুক্ত হওয়ার লক্ষ্যে কৃষি সম্প্রসারণ অধিদপ্তরের মাঠ পর্যায়ে রোপিত বৃক্ষের তথ্য সংগ্রহ সহায়ক।
                  </p>
                </div>

                {/* Features Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5 w-full text-left mt-1">
                  
                  {/* Feature card 1 */}
                  <div className="p-4 bg-surface border border-slate-100/85 rounded-lg flex gap-3 hover:border-primary-100 hover:bg-primary-50/10 transition-colors">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary-400/10 to-primary-400/10 flex items-center justify-center shrink-0 border border-primary-100">
                      <MapPin className="w-5 h-5 text-primary-500" />
                    </div>
                    <div className="flex flex-col gap-0.5">
                      <h4 className="font-bold text-gray-900 text-xs">সহজ ফরম ও অটোমেশন</h4>
                      <p className="text-[11px] text-gray-500 leading-normal">
                        সহজ ফরম, অটোমেটিক Geo location, ঠিকানা সংগ্রহ ও ম্যাপে সচিত্র অবস্থান প্রদর্শন।
                      </p>
                    </div>
                  </div>

                  {/* Feature card 2 */}
                  <div className="p-4 bg-surface border border-slate-100/85 rounded-lg flex gap-3 hover:border-primary-100 hover:bg-primary-50/10 transition-colors">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500/10 to-indigo-500/10 flex items-center justify-center shrink-0 border border-blue-100">
                      <Database className="w-5 h-5 text-blue-600" />
                    </div>
                    <div className="flex flex-col gap-0.5">
                      <h4 className="font-bold text-gray-900 text-xs">অফলাইন ও অনলাইন সুরক্ষা</h4>
                      <p className="text-[11px] text-gray-500 leading-normal">
                        ইন্টারনেট ছাড়াও অফলাইন ডাটা সংগ্রহ, স্বয়ংক্রিয় সিঙ্ক ও গুগল ড্রাইভে তথ্য ব্যাকআপ সংরক্ষণ।
                      </p>
                    </div>
                  </div>

                  {/* Feature card 3 */}
                  <div className="p-4 bg-surface border border-slate-100/85 rounded-lg flex gap-3 hover:border-primary-100 hover:bg-primary-50/10 transition-colors">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500/10 to-fuchsia-500/10 flex items-center justify-center shrink-0 border border-purple-100">
                      <FileSpreadsheet className="w-5 h-5 text-purple-600" />
                    </div>
                    <div className="flex flex-col gap-0.5">
                      <h4 className="font-bold text-gray-900 text-xs">স্মার্ট রিপোর্ট ও বিশ্লেষণ</h4>
                      <p className="text-[11px] text-gray-500 leading-normal">
                        সরাসরি ফরম্যাট করা ফাইল ডাউনলোডসহ ভবিষ্যতে যেকোনো সার্ভারে ডাটা স্থানান্তরের সুবিধা।
                      </p>
                    </div>
                  </div>

                  {/* Feature card 4 */}
                  <div className="p-4 bg-surface border border-slate-100/85 rounded-lg flex gap-3 hover:border-primary-100 hover:bg-primary-50/10 transition-colors">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500/10 to-orange-500/10 flex items-center justify-center shrink-0 border border-amber-100">
                      <Globe className="w-5 h-5 text-amber-600" />
                    </div>
                    <div className="flex flex-col gap-0.5">
                      <h4 className="font-bold text-gray-900 text-xs">নানাবিধ লোকাল সুবিধা</h4>
                      <p className="text-[11px] text-gray-500 leading-normal">
                        মাঠ পর্যায়ের কর্মকর্তাদের জন্য সহজ ও সুরক্ষিত ইন্টারফেস যা মোবাইল এবং ওয়েব ব্রাউজার বান্ধব।
                      </p>
                    </div>
                  </div>

                </div>

                {/* Footer and Call to Action */}
                <div className="w-full flex flex-col gap-4 mt-2">
                  <button
                    onClick={handleClose}
                    className="w-full h-11 bg-primary-500 hover:bg-primary-600 text-white font-bold rounded-xl text-xs flex items-center justify-center gap-2 shadow-lg hover:shadow-xl transition-all hover:scale-[1.01] active:scale-100 cursor-pointer border-none"
                    id="btnWelcomeToDashboard"
                  >
                    <span>তথ্য সংগ্রহ শুরু করুন</span>
                    <ArrowRight className="w-4 h-4 ml-0.5" />
                  </button>

                  <label className="flex items-center justify-center gap-2 cursor-pointer select-none text-gray-500 hover:text-gray-700 group transition-colors">
                    <div className="relative flex items-center justify-center">
                      <input
                        type="checkbox"
                        checked={dontShowAgain}
                        onChange={(e) => setDontShowAgain(e.target.checked)}
                        className="sr-only"
                        id="chkDontShowAgain"
                      />
                      <div className={`w-4 h-4 border rounded-md transition-all flex items-center justify-center ${
                        dontShowAgain 
                          ? 'bg-primary-500 border-primary-500 text-white' 
                          : 'border-gray-300 bg-container group-hover:border-primary-400'
                      }`}>
                        {dontShowAgain && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                      </div>
                    </div>
                    <span className="text-[10.5px] font-medium font-sans">
                      ভবিষ্যতে এটি আর দেখাবেন না
                    </span>
                  </label>
                </div>

              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
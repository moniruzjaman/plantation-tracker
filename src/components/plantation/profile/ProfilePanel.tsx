import { useState, useCallback, useRef, useMemo, useEffect, type ReactNode } from 'react';
import {
  Save,
  User,
  Phone,
  MapPin,
  Briefcase,
  Building2,
  Info,
  X,
  Camera,
  BookOpen,
  Shield,
} from 'lucide-react';
import type { ComponentType } from 'react';
import type { Profile } from '../../../hooks/useProfile';
import { BD, BD_UPAZILA, BD_DIVISIONS } from '../../../data/adminData';

interface ProfilePanelProps {
  profile: Profile | null;
  onSave: (profile: Profile) => void;
}

const inputCls =
  'w-full px-3 py-2.5 rounded-lg border border-gray-200 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-[#15803d]/30 focus:border-[#15803d] transition text-gray-800';

const selectCls =
  inputCls + ' appearance-none cursor-pointer';

const GUIDE_STEPS = [
  {
    title: '১. প্রোফাইল তৈরি করুন',
    body: 'আপনার নাম, পদবি ও মোবাইল নম্বর দিয়ে প্রোফাইল সংরক্ষণ করুন।',
  },
  {
    title: '২. রোপণ তথ্য দিন',
    body: '"নতুন এন্ট্রি" ট্যাবে গিয়ে কৃষকের নাম, চারার ধরন ও পরিমাণ লিখুন।',
  },
  {
    title: '৩. জিপিএস লোকেশন',
    body: 'সাবমিশনের সময় স্বয়ংক্রিয়ভাবে আপনার অবস্থান সংরক্ষিত হবে। লোকেশন অন রাখুন।',
  },
  {
    title: '৪. সিঙ্ক করুন',
    body: 'ইন্টারনেট সংযোগ থাকলে "আমার ডাটা" ট্যাব থেকে সিঙ্ক করুন। অফলাইনেও ডাটা সংরক্ষিত থাকবে।',
  },
  {
    title: '৫. ডাটা দেখুন',
    body: '"আমার ডাটা" ট্যাবে মোবাইল নম্বর দিয়ে আপনার জমা দেওয়া তথ্য খুঁজে দেখুন।',
  },
];

function Field({ label, icon, children }: { label: string; icon: ComponentType<any>; children: ReactNode }) {
  return (
    <div className="flex flex-col gap-1">
      <label className="text-xs font-medium text-gray-600 flex items-center gap-1">
        <icon className="w-3.5 h-3.5 text-[#15803d]" />
        {label}
      </label>
      {children}
    </div>
  );
}

export default function ProfilePanel({ profile, onSave }: ProfilePanelProps) {
  const [form, setForm] = useState<Profile>(profile ?? {});
  const [showGuide, setShowGuide] = useState(false);
  const [photo, setPhoto] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    try {
      const stored = localStorage.getItem('plantation_profile_photo');
      if (stored) setPhoto(stored);
    } catch {
      /* ignore */
    }
  }, []);

  const districts = useMemo(
    () => (form.region ? BD[form.region] ?? [] : []),
    [form.region],
  );

  const upazilas = useMemo(
    () => (form.district ? BD_UPAZILA[form.district] ?? [] : []),
    [form.district],
  );

  const set = useCallback(
    (key: keyof Profile, value: string) => {
      setForm((prev) => {
        const next = { ...prev, [key]: value };
        if (key === 'region') {
          next.district = '';
          next.upazila = '';
        } else if (key === 'district') {
          next.upazila = '';
        }
        return next;
      });
    },
    [],
  );

  const handleSave = useCallback(() => {
    onSave(form);
  }, [form, onSave]);

  const handlePhotoChange = useCallback(
    (e: { target: HTMLInputElement }) => {
      const file = e.target.files?.[0];
      if (!file) return;
      const reader = new FileReader();
      reader.onload = () => {
        const dataUrl = reader.result as string;
        setPhoto(dataUrl);
        try {
          localStorage.setItem('plantation_profile_photo', dataUrl);
        } catch {
          /* storage full */
        }
      };
      reader.readAsDataURL(file);
    },
    [],
  );

  return (
    <div className="flex flex-col gap-5">
      <div className="flex items-center justify-between">
        <h2 className="text-base font-bold text-gray-800 flex items-center gap-1.5">
          <User className="w-5 h-5 text-[#15803d]" />
          প্রোফাইল ও সেটিংস
        </h2>
        <button
          type="button"
          onClick={() => setShowGuide(true)}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-gray-100 text-gray-600 hover:bg-gray-200 active:scale-95 transition-all cursor-pointer"
        >
          <Info className="w-3.5 h-3.5" />
          ব্যবহার নির্দেশিকা
        </button>
      </div>

      <div className="flex flex-col items-center gap-2">
        <div className="relative group">
          <div className="w-20 h-20 rounded-full bg-[#15803d]/10 border-2 border-dashed border-[#15803d]/30 flex items-center justify-center overflow-hidden">
            {photo ? (
              <img src={photo} alt="প্রোফাইল" className="w-full h-full object-cover" />
            ) : (
              <User className="w-8 h-8 text-[#15803d]/40" />
            )}
          </div>
          <button
            type="button"
            onClick={() => fileRef.current?.click()}
            className="absolute inset-0 rounded-full bg-black/30 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
          >
            <Camera className="w-5 h-5 text-white" />
          </button>
        </div>
        <input
          ref={fileRef}
          type="file"
          accept="image/*"
          onChange={handlePhotoChange}
          className="hidden"
        />
        <span className="text-[10px] text-gray-400">ছবি পরিবর্তন করতে ক্লিক করুন</span>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 flex flex-col gap-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Field label="নাম" icon={User}>
            <input type="text" value={form.name ?? ''} onChange={(e) => set('name', e.target.value)} placeholder="আপনার নাম" className={inputCls} />
          </Field>
          <Field label="পদবি" icon={Briefcase}>
            <input type="text" value={form.designation ?? ''} onChange={(e) => set('designation', e.target.value)} placeholder="যেমন: উপ-সহকারী কৃষি কর্মকর্তা" className={inputCls} />
          </Field>
        </div>

        <Field label="মোবাইল" icon={Phone}>
          <input type="tel" inputMode="numeric" value={form.mobile ?? ''} onChange={(e) => set('mobile', e.target.value)} placeholder="০১XXXXXXXXX" className={inputCls} />
        </Field>

        <Field label="অঞ্চল" icon={MapPin}>
          <select value={form.region ?? ''} onChange={(e) => set('region', e.target.value)} className={selectCls}>
            <option value="">-- অঞ্চল নির্বাচন করুন --</option>
            {BD_DIVISIONS.map((d) => (
              <option key={d} value={d}>{d}</option>
            ))}
          </select>
        </Field>

        {districts.length > 0 && (
          <Field label="জেলা" icon={Building2}>
            <select value={form.district ?? ''} onChange={(e) => set('district', e.target.value)} className={selectCls}>
              <option value="">-- জেলা নির্বাচন করুন --</option>
              {districts.map((d) => (
                <option key={d} value={d}>{d}</option>
              ))}
            </select>
          </Field>
        )}

        {upazilas.length > 0 && (
          <Field label="উপজেলা" icon={MapPin}>
            <select value={form.upazila ?? ''} onChange={(e) => set('upazila', e.target.value)} className={selectCls}>
              <option value="">-- উপজেলা নির্বাচন করুন --</option>
              {upazilas.map((u) => (
                <option key={u} value={u}>{u}</option>
              ))}
            </select>
          </Field>
        )}

        <Field label="ব্লক" icon={MapPin}>
          <input type="text" value={form.block ?? ''} onChange={(e) => set('block', e.target.value)} placeholder="ব্লক নম্বর / নাম" className={inputCls} />
        </Field>

        <div className="border-t border-gray-100 pt-4">
          <p className="text-xs font-semibold text-gray-500 mb-3 flex items-center gap-1">
            <Shield className="w-3.5 h-3.5" />
            SAAO তথ্য
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Field label="SAAO নাম" icon={User}>
              <input type="text" value={form.saaoName ?? ''} onChange={(e) => set('saaoName', e.target.value)} placeholder="SAAO এর নাম" className={inputCls} />
            </Field>
            <Field label="SAAO মোবাইল" icon={Phone}>
              <input type="tel" inputMode="numeric" value={form.saaoMobile ?? ''} onChange={(e) => set('saaoMobile', e.target.value)} placeholder="০১XXXXXXXXX" className={inputCls} />
            </Field>
          </div>
        </div>

        <div className="border-t border-gray-100 pt-4">
          <p className="text-xs font-semibold text-gray-500 mb-3 flex items-center gap-1">
            <Shield className="w-3.5 h-3.5" />
            মনিটরিং অফিসারের তথ্য
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Field label="মনিটরিং অফিসারের নাম" icon={User}>
              <input type="text" value={form.officerName ?? ''} onChange={(e) => set('officerName', e.target.value)} placeholder="অফিসারের নাম" className={inputCls} />
            </Field>
            <Field label="মনিটরিং অফিসারের মোবাইল" icon={Phone}>
              <input type="tel" inputMode="numeric" value={form.officerMobile ?? ''} onChange={(e) => set('officerMobile', e.target.value)} placeholder="০১XXXXXXXXX" className={inputCls} />
            </Field>
          </div>
        </div>

        <button
          type="button"
          onClick={handleSave}
          className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl text-sm font-bold bg-[#15803d] text-white hover:bg-green-800 active:scale-[0.98] transition-all shadow-md cursor-pointer mt-2"
        >
          <Save className="w-4 h-4" />
          প্রোফাইল সংরক্ষণ করুন
        </button>
      </div>

      {showGuide && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md max-h-[85vh] flex flex-col overflow-hidden">
            <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
              <h3 className="text-sm font-bold text-gray-800 flex items-center gap-1.5">
                <BookOpen className="w-4 h-4 text-[#15803d]" />
                ব্যবহার নির্দেশিকা
              </h3>
              <button type="button" onClick={() => setShowGuide(false)} className="p-1.5 rounded-lg hover:bg-gray-100 transition cursor-pointer">
                <X className="w-4 h-4 text-gray-500" />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto px-5 py-4 flex flex-col gap-4">
              {GUIDE_STEPS.map((step) => (
                <div key={step.title} className="flex gap-3">
                  <div className="w-6 h-6 rounded-full bg-[#15803d]/10 flex items-center justify-center shrink-0 mt-0.5">
                    <span className="text-[10px] font-bold text-[#15803d]">{step.title.charAt(0)}</span>
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-gray-800">{step.title}</p>
                    <p className="text-xs text-gray-500 leading-relaxed mt-0.5">{step.body}</p>
                  </div>
                </div>
              ))}
            </div>
            <div className="px-5 py-3 border-t border-gray-100">
              <button type="button" onClick={() => setShowGuide(false)} className="w-full py-2.5 rounded-xl text-sm font-semibold bg-[#15803d] text-white hover:bg-green-800 transition cursor-pointer">
                বন্ধ করুন
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

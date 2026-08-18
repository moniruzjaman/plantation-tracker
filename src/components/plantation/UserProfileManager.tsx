import React, { useState, useEffect } from 'react';
import { 
  User, 
  ShieldCheck, 
  Phone, 
  Mail, 
  MapPin, 
  Building2, 
  Save, 
  CheckCircle2, 
  RefreshCw, 
  Award,
  Lock,
  Smartphone,
  Eye,
  FileCheck,
  Zap
} from 'lucide-react';
import { DISTRICT_LOADERS } from '../../data/districtRegistry';

export interface UserProfileData {
  shortRole: 'saao' | 'uao' | 'dd' | 'farmer' | 'validator' | 'monitor';
  roleLabel: string;
  name: string;
  mobile: string;
  email: string;
  deviceId: string;
  division: string;
  district: string;
  upazila: string;
  union: string;
  block: string;
  savedAt?: string;
  syncedToGas?: boolean;
}

const ROLES: { short: UserProfileData['shortRole']; label: string; desc: string; icon: string }[] = [
  { short: 'saao', label: 'উপসহকারী কৃষি কর্মকর্তা (SAAO)', desc: 'মাঠ পর্যায়ে তথ্য সংগ্রহ ও এন্ট্রি', icon: '👨‍🌾' },
  { short: 'uao', label: 'উপজেলা কৃষি কর্মকর্তা (UAO)', desc: 'উপজেলা পর্যায়ের তদারকি ও অনুমোদন', icon: '👨‍💼' },
  { short: 'dd', label: 'উপপরিচালক (DD / জেলা)', desc: 'জেলা ভিত্তিক সামগ্রিক মনিটরিং', icon: '🏛️' },
  { short: 'validator', label: 'সত্যায়ন ও মনিটরিং কর্মকর্তা', desc: 'GPS সীমানা ও তথ্য যাচাইকরণ', icon: '🔍' },
  { short: 'farmer', label: 'কৃষক / নার্সারি মালিক', desc: 'ব্যক্তিগত চারার রোপণ ট্র্যাকিং', icon: '🌱' },
];

const DIVISIONS = ['ঢাকা', 'চট্টগ্রাম', 'রাজশাহী', 'খুলনা', 'বরিশাল', 'সিলেট', 'রংপুর', 'ময়মনসিংহ'];

interface UserProfileManagerProps {
  onProfileUpdated?: (profile: UserProfileData) => void;
}

export default function UserProfileManager({ onProfileUpdated }: UserProfileManagerProps) {
  const [shortRole, setShortRole] = useState<UserProfileData['shortRole']>('saao');
  const [name, setName] = useState<string>('');
  const [mobile, setMobile] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [division, setDivision] = useState<string>('রংপুর');
  const [district, setDistrict] = useState<string>('কুড়িগ্রাম');
  const [upazila, setUpazila] = useState<string>('কুড়িগ্রাম সদর');
  const [union, setUnion] = useState<string>('');
  const [block, setBlock] = useState<string>('');
  const [deviceId, setDeviceId] = useState<string>('');

  const [saveStatus, setSaveStatus] = useState<string | null>(null);
  const [isSyncingGas, setIsSyncingGas] = useState<boolean>(false);

  const districtList = Object.keys(DISTRICT_LOADERS);

  // Load existing profile from localStorage
  useEffect(() => {
    try {
      const stored = localStorage.getItem('user_profile_v2');
      if (stored) {
        const p: UserProfileData = JSON.parse(stored);
        setShortRole(p.shortRole || 'saao');
        setName(p.name || '');
        setMobile(p.mobile || '');
        setEmail(p.email || '');
        setDivision(p.division || 'রংপুর');
        setDistrict(p.district || 'কুড়িগ্রাম');
        setUpazila(p.upazila || 'কুড়িগ্রাম সদর');
        setUnion(p.union || '');
        setBlock(p.block || '');
        setDeviceId(p.deviceId || getOrCreateDeviceId());
      } else {
        setDeviceId(getOrCreateDeviceId());
      }
    } catch (e) {
      setDeviceId(getOrCreateDeviceId());
    }
  }, []);

  const getOrCreateDeviceId = (): string => {
    let devId = localStorage.getItem('device_id_v2');
    if (!devId) {
      devId = `DEV_${Math.random().toString(36).substring(2, 9).toUpperCase()}`;
      localStorage.setItem('device_id_v2', devId);
    }
    return devId;
  };

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();

    const selectedRoleObj = ROLES.find((r) => r.short === shortRole);
    const roleLabel = selectedRoleObj ? selectedRoleObj.label : 'কৃষি কর্মকর্তা';

    const profileData: UserProfileData = {
      shortRole,
      roleLabel,
      name: name.trim(),
      mobile: mobile.trim(),
      email: email.trim(),
      deviceId,
      division,
      district,
      upazila,
      union: union.trim(),
      block: block.trim(),
      savedAt: new Date().toISOString(),
      syncedToGas: false,
    };

    try {
      localStorage.setItem('user_profile_v2', JSON.stringify(profileData));
      setSaveStatus('✓ ইউজার প্রোফাইল সফলভাবে লোকাল ডিভাইসে সংরক্ষিত হয়েছে!');

      if (onProfileUpdated) onProfileUpdated(profileData);

      setTimeout(() => setSaveStatus(null), 3500);
    } catch (err) {
      alert('প্রোফাইল সংরক্ষণে সমস্যা হয়েছে!');
    }
  };

  // Sync profile to AppsScript User_Profile sheet
  const handleSyncProfileToGas = async () => {
    setIsSyncingGas(true);
    try {
      const stored = localStorage.getItem('user_profile_v2');
      if (!stored) {
        alert('প্রথমে প্রোফাইল সংরক্ষণ করুন!');
        setIsSyncingGas(false);
        return;
      }

      const p: UserProfileData = JSON.parse(stored);
      const payload = {
        entryType: 'user_profile',
        submissionId: `PROF_${Date.now()}`,
        shortRole: p.shortRole,
        roleLabel: p.roleLabel,
        name: p.name,
        mobile: p.mobile,
        email: p.email,
        deviceId: p.deviceId,
        division: p.division,
        district: p.district,
        upazila: p.upazila,
        union: p.union,
        block: p.block,
      };

      const res = await fetch('/api/gas-sync', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const resData = await res.json();
      if (resData && resData.ok) {
        p.syncedToGas = true;
        localStorage.setItem('user_profile_v2', JSON.stringify(p));
        setSaveStatus('✅ প্রোফাইল সফলভাবে AppsScript User_Profile শিটে সিঙ্ক হয়েছে!');
      } else {
        alert(`সিঙ্ক ত্রুটি: ${resData?.error || 'সার্ভার সাড়া দেয়নি'}`);
      }
    } catch (err: any) {
      alert(`নেটওয়ার্ক ত্রুটি: ${err.message || 'সংযোগ সম্ভব হয়নি'}`);
    } finally {
      setIsSyncingGas(false);
      setTimeout(() => setSaveStatus(null), 4000);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 text-gray-800">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-emerald-950 via-emerald-900 to-green-950 rounded-2xl p-5 text-white shadow-xl relative overflow-hidden">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 relative z-10">
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-xl bg-white/10 p-1 flex items-center justify-center border border-white/20 text-emerald-300 shadow-inner">
              <User className="w-7 h-7" />
            </div>
            <div>
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-800/80 border border-emerald-500/40 text-emerald-100 mb-1">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                অফিসিয়াল ইউজার প্রোফাইল ও মনিটরিং
              </div>
              <h2 className="text-xl font-bold text-white">
                কর্মকর্তার প্রোফাইল ও কর্মস্থল ব্যবস্থাপনা
              </h2>
              <p className="text-xs text-emerald-200/90 mt-0.5">
                ডাটা জমা, অটো-ফিল, তথ্য সত্যায়ন ও মনিটরিংয়ের জন্য আপনার আইডি সেটআপ করুন
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2 bg-emerald-950/60 px-3 py-2 rounded-xl border border-emerald-600/40 text-xs text-emerald-200">
            <Smartphone className="w-4 h-4 text-amber-400" />
            <span className="font-mono text-[11px]">{deviceId || 'DEV_ID_ACTIVE'}</span>
          </div>
        </div>
      </div>

      {saveStatus && (
        <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-900 flex items-center gap-3 shadow-md animate-bounce text-xs sm:text-sm font-bold">
          <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0" />
          <span>{saveStatus}</span>
        </div>
      )}

      {/* Main Profile Form */}
      <form onSubmit={handleSaveProfile} className="space-y-6">
        
        {/* Section 1: Role Selection */}
        <div className="bg-white rounded-2xl shadow-sm border border-emerald-100 p-5 space-y-4">
          <div className="border-b border-gray-100 pb-3">
            <h3 className="text-base font-bold text-emerald-900 flex items-center gap-2">
              <Award className="w-5 h-5 text-emerald-600" />
              ১. আপনার পদবি ও দায়িত্ব (Officer Role)
            </h3>
            <p className="text-xs text-gray-500 mt-0.5">ডাটা সংগ্রহ, সত্যায়ন বা মনিটরিং রোল নির্বাচন করুন</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
            {ROLES.map((r) => {
              const isSelected = shortRole === r.short;
              return (
                <button
                  key={r.short}
                  type="button"
                  onClick={() => setShortRole(r.short)}
                  className={`p-3.5 rounded-xl border text-left transition cursor-pointer flex flex-col justify-between ${
                    isSelected
                      ? 'bg-emerald-700 text-white border-emerald-800 shadow-md scale-102'
                      : 'bg-white text-gray-800 border-gray-200 hover:border-emerald-300 hover:bg-emerald-50/50'
                  }`}
                >
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xl">{r.icon}</span>
                    <span className="font-bold text-xs">{r.label}</span>
                  </div>
                  <span className={`text-[10px] ${isSelected ? 'text-emerald-100' : 'text-gray-500'}`}>
                    {r.desc}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Section 2: Personal Details */}
        <div className="bg-white rounded-2xl shadow-sm border border-emerald-100 p-5 space-y-4">
          <div className="border-b border-gray-100 pb-3">
            <h3 className="text-base font-bold text-emerald-900 flex items-center gap-2">
              <User className="w-5 h-5 text-emerald-600" />
              ২. ব্যক্তিগত বিবরণ ও যোগাযোগ
            </h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">পূর্ণ নাম</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="যেমন: মোঃ আমিনুল হক"
                className="w-full rounded-xl border border-gray-200 px-3.5 py-2.5 text-sm bg-gray-50/50 focus:bg-white focus:ring-2 focus:ring-emerald-500 outline-none"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">মোবাইল নম্বর</label>
              <input
                type="tel"
                value={mobile}
                onChange={(e) => setMobile(e.target.value)}
                placeholder="017XXXXXXXX"
                className="w-full rounded-xl border border-gray-200 px-3.5 py-2.5 text-sm bg-gray-50/50 focus:bg-white focus:ring-2 focus:ring-emerald-500 outline-none font-mono"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">ইমেইল ঠিকানা (ঐচ্ছিক)</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="officer@dae.gov.bd"
                className="w-full rounded-xl border border-gray-200 px-3.5 py-2.5 text-sm bg-gray-50/50 focus:bg-white focus:ring-2 focus:ring-emerald-500 outline-none"
              />
            </div>
          </div>
        </div>

        {/* Section 3: Official Posting & Jurisdiction */}
        <div className="bg-white rounded-2xl shadow-sm border border-emerald-100 p-5 space-y-4">
          <div className="border-b border-gray-100 pb-3">
            <h3 className="text-base font-bold text-emerald-900 flex items-center gap-2">
              <Building2 className="w-5 h-5 text-emerald-600" />
              ৩. অফিশিয়াল কর্মস্থল ও জুরিসডিকশন
            </h3>
            <p className="text-xs text-gray-500 mt-0.5">আপনার কর্মস্থলের বিভাগ, জেলা, উপজেলা ও ব্লক নির্ধারণ করুন</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">বিভাগ</label>
              <select
                value={division}
                onChange={(e) => setDivision(e.target.value)}
                className="w-full rounded-xl border border-gray-200 px-3.5 py-2.5 text-sm bg-gray-50/50 focus:bg-white focus:ring-2 focus:ring-emerald-500 outline-none"
              >
                {DIVISIONS.map((div) => (
                  <option key={div} value={div}>{div}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">জেলা</label>
              <select
                value={district}
                onChange={(e) => setDistrict(e.target.value)}
                className="w-full rounded-xl border border-gray-200 px-3.5 py-2.5 text-sm bg-gray-50/50 focus:bg-white focus:ring-2 focus:ring-emerald-500 outline-none"
              >
                {districtList.map((dist) => (
                  <option key={dist} value={dist}>{dist}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">উপজেলা</label>
              <input
                type="text"
                value={upazila}
                onChange={(e) => setUpazila(e.target.value)}
                placeholder="যেমন: কুড়িগ্রাম সদর"
                className="w-full rounded-xl border border-gray-200 px-3.5 py-2.5 text-sm bg-gray-50/50 focus:bg-white focus:ring-2 focus:ring-emerald-500 outline-none"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">ইউনিয়ন (ঐচ্ছিক)</label>
              <input
                type="text"
                value={union}
                onChange={(e) => setUnion(e.target.value)}
                placeholder="যেমন: ভোগডাঙা"
                className="w-full rounded-xl border border-gray-200 px-3.5 py-2.5 text-sm bg-gray-50/50 focus:bg-white focus:ring-2 focus:ring-emerald-500 outline-none"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-xs font-semibold text-gray-700 mb-1">কৃষি ব্লক (ঐচ্ছিক)</label>
              <input
                type="text"
                value={block}
                onChange={(e) => setBlock(e.target.value)}
                placeholder="যেমন: ব্লক ৩ / ভোগডাঙা ব্লক"
                className="w-full rounded-xl border border-gray-200 px-3.5 py-2.5 text-sm bg-gray-50/50 focus:bg-white focus:ring-2 focus:ring-emerald-500 outline-none"
              />
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center gap-3">
          <button
            type="submit"
            className="flex-1 w-full py-3.5 px-6 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-sm shadow-md transition flex items-center justify-center gap-2 cursor-pointer"
          >
            <Save className="w-4 h-4" />
            <span>প্রোফাইল সংরক্ষণ করুন</span>
          </button>

          <button
            type="button"
            onClick={handleSyncProfileToGas}
            disabled={isSyncingGas}
            className="w-full sm:w-auto py-3.5 px-6 rounded-xl bg-teal-800 hover:bg-teal-900 text-white font-bold text-sm shadow-md transition flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
          >
            <RefreshCw className={`w-4 h-4 ${isSyncingGas ? 'animate-spin' : ''}`} />
            <span>{isSyncingGas ? 'AppsScript এ সিঙ্ক হচ্ছে...' : '⚡ AppsScript এ প্রোফাইল সিঙ্ক করুন'}</span>
          </button>
        </div>

      </form>
    </div>
  );
}

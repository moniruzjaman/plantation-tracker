import React, { useState, useEffect } from 'react';
import { 
  MapPin, 
  Trees, 
  User, 
  Phone, 
  Camera, 
  CheckCircle2, 
  Plus, 
  Minus, 
  Sparkles, 
  AlertCircle, 
  Save, 
  RefreshCw,
  Award,
  ShieldCheck,
  Zap,
  Ruler,
  Compass,
  Mountain,
  Calendar
} from 'lucide-react';
import { Submission, FlatSeedling } from '../OfflinePlantationDashboard';
import { DISTRICT_LOADERS } from '../../data/districtRegistry';
import { 
  getHighPrecisionPosition, 
  calculateTreeHeightClinometer, 
  formatTreeHeight, 
  PrecisionGpsData 
} from '../../utils/gpsPrecisionCalculator';

const DIVISIONS = [
  'ঢাকা', 'চট্টগ্রাম', 'রাজশাহী', 'খুলনা', 'বরিশাল', 'সিলেট', 'রংপুর', 'ময়মনসিংহ'
];

interface PresetSpecies {
  id: string;
  name: string;
  category: 'ফলদ' | 'বনজ' | 'ঔষধি' | 'অন্যান্য';
  icon: string;
  bgGradient: string;
}

const PRESET_SPECIES: PresetSpecies[] = [
  { id: 'mango', name: 'আম', category: 'ফলদ', icon: '🥭', bgGradient: 'from-amber-500/10 to-orange-500/10 border-orange-200' },
  { id: 'jackfruit', name: 'কাঁঠাল', category: 'ফলদ', icon: '🍈', bgGradient: 'from-yellow-500/10 to-amber-500/10 border-yellow-200' },
  { id: 'guava', name: 'পেয়ারা', category: 'ফলদ', icon: '🍏', bgGradient: 'from-emerald-500/10 to-green-500/10 border-emerald-200' },
  { id: 'coconut', name: 'নারকেল', category: 'ফলদ', icon: '🥥', bgGradient: 'from-emerald-600/10 to-teal-500/10 border-teal-200' },
  { id: 'teak', name: 'সেগুন', category: 'বনজ', icon: '🪵', bgGradient: 'from-stone-500/10 to-amber-700/10 border-stone-300' },
  { id: 'mahogany', name: 'মেহগনি', category: 'বনজ', icon: '🌳', bgGradient: 'from-green-600/10 to-emerald-700/10 border-green-200' },
  { id: 'neem', name: 'নিম', category: 'ঔষধি', icon: '🌿', bgGradient: 'from-teal-500/10 to-emerald-500/10 border-teal-200' },
  { id: 'amla', name: 'আমলকী', category: 'ঔষধি', icon: '🍒', bgGradient: 'from-rose-500/10 to-pink-500/10 border-rose-200' },
];

const SAPLING_AGE_CATEGORIES = [
  { value: '১-৩ মাস', label: '🌱 ১-৩ মাস', desc: 'ক্ষুদ্র চারা' },
  { value: '৩-৬ মাস', label: '🌿 ৩-৬ মাস', desc: 'মাঝারি চারা' },
  { value: '৬-১২ মাস', label: '🪴 ৬-১২ মাস', desc: 'পরিণত চারা' },
  { value: '১-২ বছর', label: '🌳 ১-২ বছর', desc: 'কলম/বড় চারা' },
  { value: '২+ বছর', label: '🌴 ২+ বছর', desc: 'পরিণত বৃক্ষ' },
];

interface PlantationFormProps {
  onSubmissionSuccess?: () => void;
}

export default function PlantationForm({ onSubmissionSuccess }: PlantationFormProps) {
  // Location state
  const [division, setDivision] = useState<string>('রংপুর');
  const [district, setDistrict] = useState<string>('কুড়িগ্রাম');
  const [upazila, setUpazila] = useState<string>('কুড়িগ্রাম সদর');
  const [union, setUnion] = useState<string>('');
  const [village, setVillage] = useState<string>('');
  
  // High Precision GPS State (7 decimals + altitude MSL)
  const [latitude, setLatitude] = useState<string>('25.8072145');
  const [longitude, setLongitude] = useState<string>('89.6295312');
  const [altitudeMeters, setAltitudeMeters] = useState<number>(12.5);
  const [gpsAccuracy, setGpsAccuracy] = useState<number>(2.4);
  const [precisionGrade, setPrecisionGrade] = useState<'HIGH' | 'MEDIUM' | 'LOW'>('HIGH');
  const [isLocating, setIsLocating] = useState<boolean>(false);
  const [gpsStatusMsg, setGpsStatusMsg] = useState<string>('হাই-প্রিসিশন GPS প্রস্তুত');

  // Sapling Age State
  const [defaultSaplingAge, setDefaultSaplingAge] = useState<string>('৩-৬ মাস');

  // Tree Height & Measurement State
  const [treeHeightMeters, setTreeHeightMeters] = useState<number>(1.2);
  const [distanceToTrunkM, setDistanceToTrunkM] = useState<number>(5.0);
  const [tiltAngleDeg, setTiltAngleDeg] = useState<number>(25.0);
  const [showClinometerCalc, setShowClinometerCalc] = useState<boolean>(false);

  // People state
  const [farmerName, setFarmerName] = useState<string>('');
  const [farmerMobile, setFarmerMobile] = useState<string>('');
  const [saaoName, setSaaoName] = useState<string>('');
  const [saaoMobile, setSaaoMobile] = useState<string>('');
  
  // Seedlings state
  const [speciesCounts, setSpeciesCounts] = useState<Record<string, number>>({});
  const [customSpeciesName, setCustomSpeciesName] = useState<string>('');
  const [customSpeciesCat, setCustomSpeciesCat] = useState<'ফলদ' | 'বনজ' | 'ঔষধি' | 'অন্যান্য'>('ফলদ');
  const [customSpeciesQty, setCustomSpeciesQty] = useState<number>(10);
  const [customSpeciesAge, setCustomSpeciesAge] = useState<string>('৩-৬ মাস');
  const [customList, setCustomList] = useState<FlatSeedling[]>([]);

  // Photo state
  const [photoBase64, setPhotoBase64] = useState<string>('');

  // Remarks & UX State
  const [remarks, setRemarks] = useState<string>('');
  const [saveSuccessMsg, setSaveSuccessMsg] = useState<string | null>(null);

  // Available districts list
  const districtList = Object.keys(DISTRICT_LOADERS);

  // Fetch Live High-Precision GPS (7 decimals + altitude MSL)
  const handleFetchLocation = async () => {
    setIsLocating(true);
    setGpsStatusMsg('হাই-প্রিসিশন ৭-দশমিক GPS ও Altitude ট্র্যাকিং হচ্ছে...');

    try {
      const posData: PrecisionGpsData = await getHighPrecisionPosition();
      setLatitude(posData.latitude);
      setLongitude(posData.longitude);
      setAltitudeMeters(posData.altitudeMeters);
      setGpsAccuracy(posData.accuracyMeters);
      setPrecisionGrade(posData.precisionGrade);
      setIsLocating(false);
      setGpsStatusMsg(`✓ ৭-দশমিক GPS ও Altitude (${posData.altitudeMeters}m MSL) সফলভাবে সংগৃহীত (সঠিকতা: ±${posData.accuracyMeters}m)`);
    } catch (err: any) {
      setIsLocating(false);
      setGpsStatusMsg(`⚠️ GPS বার্তা: ${err.message || 'পূর্বনির্ধারিত অবস্থান ব্যবহার করা হচ্ছে'}`);
    }
  };

  // Clinometer Calculation Handler
  const handleCalculateClinometerHeight = () => {
    const calcData = calculateTreeHeightClinometer(distanceToTrunkM, tiltAngleDeg, 1.6);
    setTreeHeightMeters(calcData.heightMeters);
  };

  // Seedling counter handler
  const handleUpdateCount = (speciesName: string, delta: number) => {
    setSpeciesCounts((prev) => {
      const current = prev[speciesName] || 0;
      const updated = Math.max(0, current + delta);
      return { ...prev, [speciesName]: updated };
    });
  };

  // Add custom species
  const handleAddCustomSpecies = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customSpeciesName.trim() || customSpeciesQty <= 0) return;

    setCustomList((prev) => [
      ...prev,
      { 
        speciesName: customSpeciesName.trim(), 
        category: customSpeciesCat, 
        quantity: customSpeciesQty,
        age: customSpeciesAge
      }
    ]);
    setCustomSpeciesName('');
    setCustomSpeciesQty(10);
  };

  // Remove custom species
  const handleRemoveCustom = (index: number) => {
    setCustomList((prev) => prev.filter((_, i) => i !== index));
  };

  // Calculate total seedlings
  const totalPresetSeedlings = Object.values(speciesCounts).reduce((a, b) => a + b, 0);
  const totalCustomSeedlings = customList.reduce((a, b) => a + b.quantity, 0);
  const grandTotalSeedlings = totalPresetSeedlings + totalCustomSeedlings;

  // Image Upload Handler
  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      setPhotoBase64(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  // Height Info
  const heightInfo = formatTreeHeight(treeHeightMeters);

  // Submit Handler
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (grandTotalSeedlings === 0) {
      alert('অনুগ্রহ করে অন্তত ১ টি গাছের চারা নির্বাচন করুন!');
      return;
    }

    // Build FlatSeedling array with sapling age included
    const seedlings: FlatSeedling[] = [];

    PRESET_SPECIES.forEach((sp) => {
      const qty = speciesCounts[sp.name] || 0;
      if (qty > 0) {
        seedlings.push({
          speciesName: sp.name,
          category: sp.category,
          quantity: qty,
          age: defaultSaplingAge,
        });
      }
    });

    customList.forEach((item) => {
      seedlings.push(item);
    });

    const now = new Date();
    const submissionId = `SUB_${now.getTime()}_${Math.random().toString(36).substring(2, 7).toUpperCase()}`;

    const newSubmission: Submission = {
      id: submissionId,
      submissionId: submissionId,
      division,
      region: division,
      district,
      upazila,
      union: union || 'N/A',
      village: village || 'N/A',
      address: `${village ? village + ', ' : ''}${union ? union + ', ' : ''}${upazila}, ${district}`,
      latitude: latitude,
      longitude: longitude,
      altitude: altitudeMeters,
      gpsAccuracy: gpsAccuracy,
      precisionGrade: precisionGrade,
      treeHeightMeters: treeHeightMeters,
      geoLocation: `${latitude}, ${longitude}`,
      plantingDate: now.toISOString().split('T')[0],
      submittedAt: now.toLocaleString('bn-BD'),
      farmerName: farmerName || 'স্থানীয় কৃষক',
      farmerMobile: farmerMobile || 'N/A',
      saaoName: saaoName || 'উপসহকারী কৃষি কর্মকর্তা',
      saaoMobile: saaoMobile || 'N/A',
      officerName: saaoName || 'কৃষি কর্মকর্তা',
      officerMobile: saaoMobile || 'N/A',
      nurseryName: farmerName || 'স্থানীয় নার্সারি',
      mobile: farmerMobile || 'N/A',
      seedlings: seedlings,
      photoBase64: photoBase64,
      remarks: remarks,
      synced: false,
    };

    // Save to localStorage v2
    try {
      const existingStr = localStorage.getItem('plantation_submissions_v2') || '[]';
      const existingList: Submission[] = JSON.parse(existingStr);
      const updatedList = [newSubmission, ...existingList];
      localStorage.setItem('plantation_submissions_v2', JSON.stringify(updatedList));

      setSaveSuccessMsg(`সফলভাবে ${grandTotalSeedlings} টি চারা (বয়স: ${defaultSaplingAge}, GPS Precision: ±${gpsAccuracy}m, Height: ${treeHeightMeters}m) সংরক্ষিত হয়েছে!`);
      
      // Trigger callback
      if (onSubmissionSuccess) {
        onSubmissionSuccess();
      }

      // Scroll top
      window.scrollTo({ top: 0, behavior: 'smooth' });

      // Reset counts after 4s
      setTimeout(() => {
        setSaveSuccessMsg(null);
      }, 4000);

    } catch (err) {
      alert('ডেটা লোকাল স্টোরেজে সংরক্ষণে সমস্যা হয়েছে!');
      console.error(err);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-4 sm:p-6 pb-24 font-sans text-gray-800">
      {/* App Header Banner */}
      <div className="bg-gradient-to-r from-emerald-950 via-emerald-900 to-green-950 rounded-2xl p-5 text-white shadow-xl mb-6 relative overflow-hidden">
        <div className="absolute right-0 top-0 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 relative z-10">
          <div className="flex items-center gap-3.5">
            <div className="w-14 h-14 rounded-2xl bg-white/10 p-1 flex items-center justify-center border border-white/20 shadow-inner flex-shrink-0">
              <img 
                src="/dae-logo.png" 
                alt="DAE Bangladesh Logo" 
                className="w-full h-full object-contain"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = '/logo.svg';
                }}
              />
            </div>
            <div>
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-800/80 border border-emerald-500/40 text-emerald-100 mb-1">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                কৃষি সম্প্রসারণ অধিদপ্তর (DAE), গণপ্রজাতন্ত্রী বাংলাদেশ সরকার
              </div>
              <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-white">
                বৃক্ষরোপণ তথ্য সংগ্রহ ও ট্র্যাকিং
              </h1>
              <p className="text-xs text-emerald-200/90 mt-0.5">
                "০৫ বছরে ২৫ কোটি বৃক্ষরোপণ" মহা-কর্মসূচি
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2 bg-emerald-950/60 px-3 py-2 rounded-xl border border-emerald-600/40 text-xs text-emerald-200">
            <Award className="w-4 h-4 text-amber-400" />
            <span>GPS Precision & Sapling Age Active</span>
          </div>
        </div>
      </div>

      {/* Success Alert Banner */}
      {saveSuccessMsg && (
        <div className="mb-6 p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 flex items-start gap-3 shadow-md animate-bounce">
          <CheckCircle2 className="w-6 h-6 text-emerald-600 flex-shrink-0 mt-0.5" />
          <div>
            <h4 className="font-bold text-emerald-900">এন্ট্রি সফল হয়েছে!</h4>
            <p className="text-sm text-emerald-700">{saveSuccessMsg}</p>
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        
        {/* Section 1: Location & Precision GPS / Altitude */}
        <div className="bg-white rounded-2xl shadow-sm border border-emerald-100/80 p-5 space-y-4">
          <div className="flex items-center justify-between border-b border-gray-100 pb-3">
            <h2 className="text-base font-bold text-emerald-900 flex items-center gap-2">
              <MapPin className="w-5 h-5 text-emerald-600" />
              ১. ভৌগোলিক অবস্থান, ৭-দশমিক GPS ও Altitude
            </h2>
            <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
              ধাপ ১ / ৪
            </span>
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
              <label className="block text-xs font-semibold text-gray-700 mb-1">গ্রাম / রোপণ স্থান (ঐচ্ছিক)</label>
              <input
                type="text"
                value={village}
                onChange={(e) => setVillage(e.target.value)}
                placeholder="যেমন: স্কুল মাঠ / ব্লক ৩"
                className="w-full rounded-xl border border-gray-200 px-3.5 py-2.5 text-sm bg-gray-50/50 focus:bg-white focus:ring-2 focus:ring-emerald-500 outline-none"
              />
            </div>
          </div>

          {/* High-Precision 7-Decimal GPS & MSL Altitude Sensor Lock Card */}
          <div className="p-4 rounded-xl bg-gradient-to-r from-emerald-50/80 via-teal-50/80 to-green-50/80 border border-emerald-200/90 space-y-3 shadow-inner">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
              <div>
                <div className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-emerald-600" />
                  <span className="text-xs font-bold text-emerald-950 uppercase tracking-wide">
                    হাই-প্রিসিশন ৭-দশমিক GPS ও MSL Altitude ট্র্যাকার
                  </span>
                </div>
                <p className="text-xs text-emerald-800 mt-0.5">
                  {gpsStatusMsg}
                </p>
              </div>

              <button
                type="button"
                onClick={handleFetchLocation}
                disabled={isLocating}
                className="w-full sm:w-auto px-4 py-2.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold transition flex items-center justify-center gap-2 shadow-sm cursor-pointer active:scale-95 disabled:opacity-50"
              >
                <Compass className={`w-4 h-4 ${isLocating ? 'animate-spin' : ''}`} />
                <span>{isLocating ? 'GPS নির্ণয় হচ্ছে...' : '📡 ৭-দশমিক GPS & Altitude ট্র্যাকিং'}</span>
              </button>
            </div>

            {/* Precision Grid Output */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 pt-2 border-t border-emerald-200/60 text-xs">
              <div className="bg-white/90 p-2.5 rounded-lg border border-emerald-100">
                <span className="text-gray-500 block text-[10px]">অক্ষাংশ (Latitude 7-Dec)</span>
                <span className="font-mono font-bold text-emerald-900 text-xs">{latitude}</span>
              </div>
              <div className="bg-white/90 p-2.5 rounded-lg border border-emerald-100">
                <span className="text-gray-500 block text-[10px]">দ্রাঘিমাংশ (Longitude 7-Dec)</span>
                <span className="font-mono font-bold text-emerald-900 text-xs">{longitude}</span>
              </div>
              <div className="bg-white/90 p-2.5 rounded-lg border border-emerald-100 flex items-center justify-between">
                <div>
                  <span className="text-gray-500 block text-[10px]">উচ্চতা (MSL Altitude)</span>
                  <span className="font-mono font-bold text-teal-800 text-xs flex items-center gap-1">
                    <Mountain className="w-3 h-3 text-teal-600" />
                    {altitudeMeters} m
                  </span>
                </div>
              </div>
              <div className="bg-white/90 p-2.5 rounded-lg border border-emerald-100 flex items-center justify-between">
                <div>
                  <span className="text-gray-500 block text-[10px]">GPS সিগন্যাল সঠিকতা</span>
                  <span className="font-mono font-bold text-emerald-800 text-xs">±{gpsAccuracy}m</span>
                </div>
                <span className={`px-2 py-0.5 rounded text-[9px] font-bold ${
                  precisionGrade === 'HIGH' ? 'bg-emerald-100 text-emerald-800 border border-emerald-300' : 'bg-amber-100 text-amber-800'
                }`}>
                  {precisionGrade === 'HIGH' ? '🟢 HIGH' : '🟡 MED'}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Section 2: Beneficiary & Officer Info */}
        <div className="bg-white rounded-2xl shadow-sm border border-emerald-100/80 p-5 space-y-4">
          <div className="flex items-center justify-between border-b border-gray-100 pb-3">
            <h2 className="text-base font-bold text-emerald-900 flex items-center gap-2">
              <User className="w-5 h-5 text-emerald-600" />
              ২. উপকারভোগী ও দায়িত্বপ্রাপ্ত কর্মকর্তা
            </h2>
            <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
              ধাপ ২ / ৪
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-3 p-3.5 bg-gray-50/70 rounded-xl border border-gray-100">
              <h3 className="text-xs font-bold text-gray-800 flex items-center gap-1.5">
                <User className="w-3.5 h-3.5 text-emerald-600" />
                উপকারভোগী / কৃষকের বিবরণ
              </h3>
              <div>
                <label className="block text-[11px] font-semibold text-gray-600 mb-1">কৃষক / নার্সারির নাম</label>
                <input
                  type="text"
                  value={farmerName}
                  onChange={(e) => setFarmerName(e.target.value)}
                  placeholder="যেমন: মোঃ রফিকুল ইসলাম"
                  className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm bg-white focus:ring-2 focus:ring-emerald-500 outline-none"
                  required
                />
              </div>
              <div>
                <label className="block text-[11px] font-semibold text-gray-600 mb-1">মোবাইল নম্বর</label>
                <input
                  type="tel"
                  value={farmerMobile}
                  onChange={(e) => setFarmerMobile(e.target.value)}
                  placeholder="017XXXXXXXX"
                  className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm bg-white focus:ring-2 focus:ring-emerald-500 outline-none"
                />
              </div>
            </div>

            <div className="space-y-3 p-3.5 bg-gray-50/70 rounded-xl border border-gray-100">
              <h3 className="text-xs font-bold text-gray-800 flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                কর্মকর্তা (SAAO / পর্যালোচক)
              </h3>
              <div>
                <label className="block text-[11px] font-semibold text-gray-600 mb-1">কর্মকর্তার নাম</label>
                <input
                  type="text"
                  value={saaoName}
                  onChange={(e) => setSaaoName(e.target.value)}
                  placeholder="যেমন: মোঃ আমিনুল হক (SAAO)"
                  className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm bg-white focus:ring-2 focus:ring-emerald-500 outline-none"
                />
              </div>
              <div>
                <label className="block text-[11px] font-semibold text-gray-600 mb-1">মোবাইল নম্বর</label>
                <input
                  type="tel"
                  value={saaoMobile}
                  onChange={(e) => setSaaoMobile(e.target.value)}
                  placeholder="018XXXXXXXX"
                  className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm bg-white focus:ring-2 focus:ring-emerald-500 outline-none"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Section 3: Species, Sapling Age Categories & Tree Height Calculation */}
        <div className="bg-white rounded-2xl shadow-sm border border-emerald-100/80 p-5 space-y-4">
          <div className="flex items-center justify-between border-b border-gray-100 pb-3">
            <div>
              <h2 className="text-base font-bold text-emerald-900 flex items-center gap-2">
                <Trees className="w-5 h-5 text-emerald-600" />
                ৩. চারার প্রজাতি, আনুমানিক বয়স ও গাছের উচ্চতা
              </h2>
              <p className="text-xs text-gray-500 mt-0.5">চারার ক্যাটাগরি, বয়স ও সংখ্যা নির্ধারণ করুন</p>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold px-3 py-1 rounded-full bg-emerald-600 text-white shadow-sm">
                🌱 মোট: {grandTotalSeedlings} টি
              </span>
            </div>
          </div>

          {/* Sapling Age Categories Selector Panel */}
          <div className="p-4 rounded-xl bg-gradient-to-r from-emerald-50 to-green-50 border border-emerald-200 space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-emerald-700" />
                <h3 className="font-bold text-xs text-emerald-950 uppercase tracking-wide">
                  চারার আনুমানিক বয়স ক্যাটাগরি (Sapling Age Category)
                </h3>
              </div>
              <span className="text-[10px] font-bold text-emerald-800 bg-emerald-200/80 px-2 py-0.5 rounded-full">
                বর্তমান নির্বাচন: {defaultSaplingAge}
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 pt-1">
              {SAPLING_AGE_CATEGORIES.map((ageOpt) => {
                const isSelected = defaultSaplingAge === ageOpt.value;
                return (
                  <button
                    key={ageOpt.value}
                    type="button"
                    onClick={() => setDefaultSaplingAge(ageOpt.value)}
                    className={`p-2.5 rounded-xl border text-left transition cursor-pointer flex flex-col justify-between ${
                      isSelected
                        ? 'bg-emerald-700 text-white border-emerald-800 shadow-md scale-102'
                        : 'bg-white text-gray-800 border-gray-200 hover:border-emerald-300 hover:bg-emerald-50/50'
                    }`}
                  >
                    <span className="font-bold text-xs">{ageOpt.label}</span>
                    <span className={`text-[10px] mt-0.5 ${isSelected ? 'text-emerald-100' : 'text-gray-500'}`}>
                      {ageOpt.desc}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Tree Height Calculation Card */}
          <div className="p-4 rounded-xl bg-slate-50 border border-emerald-200/70 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Ruler className="w-4 h-4 text-emerald-700" />
                <h3 className="font-bold text-xs text-emerald-950 uppercase tracking-wide">
                  গাছের গড় উচ্চতা (Tree Height Calculation)
                </h3>
              </div>

              <button
                type="button"
                onClick={() => setShowClinometerCalc(!showClinometerCalc)}
                className="text-[11px] font-bold text-emerald-700 hover:text-emerald-900 underline cursor-pointer"
              >
                {showClinometerCalc ? 'ক্লিনোমিটার গণক বন্ধ করুন' : '📐 ক্লিনোমিটার দিয়ে উচ্চতা হিসাব করুন'}
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 items-center">
              <div>
                <label className="block text-[11px] font-semibold text-gray-600 mb-1">গাছের গড় উচ্চতা (মিটার)</label>
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    step="0.1"
                    value={treeHeightMeters}
                    onChange={(e) => setTreeHeightMeters(Number(e.target.value))}
                    min={0.1}
                    className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm bg-white font-mono font-bold text-emerald-900 focus:ring-2 focus:ring-emerald-500 outline-none"
                  />
                  <span className="text-xs font-bold text-gray-500">m</span>
                </div>
              </div>

              <div className="bg-white p-2.5 rounded-lg border border-gray-200">
                <span className="text-gray-500 block text-[10px]">ফিটে রূপান্তর (Feet)</span>
                <span className="font-mono font-bold text-gray-900 text-xs">{heightInfo.heightFeet} ft ({heightInfo.heightCm} cm)</span>
              </div>

              <div className="bg-white p-2.5 rounded-lg border border-gray-200">
                <span className="text-gray-500 block text-[10px]">বৃক্ষের ধাপ (Growth Category)</span>
                <span className="font-bold text-emerald-800 text-xs">{heightInfo.growthCategory}</span>
              </div>
            </div>

            {/* Clinometer Angle Estimator Helper */}
            {showClinometerCalc && (
              <div className="p-3.5 rounded-lg bg-emerald-100/50 border border-emerald-300 space-y-2 mt-2">
                <h4 className="text-xs font-bold text-emerald-900">📐 ক্লিনোমিটার সূত্র (Distance × tan(Angle) + Height)</h4>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                  <div>
                    <label className="block text-[10px] font-semibold text-gray-600 mb-0.5">গাছ থেকে দূরত্ব (মিটার)</label>
                    <input
                      type="number"
                      step="0.5"
                      value={distanceToTrunkM}
                      onChange={(e) => setDistanceToTrunkM(Number(e.target.value))}
                      className="w-full rounded border px-2 py-1 text-xs bg-white font-mono"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-semibold text-gray-600 mb-0.5">কোণ (Tilt Angle Degrees)</label>
                    <input
                      type="number"
                      step="1"
                      value={tiltAngleDeg}
                      onChange={(e) => setTiltAngleDeg(Number(e.target.value))}
                      className="w-full rounded border px-2 py-1 text-xs bg-white font-mono"
                    />
                  </div>
                  <div className="flex items-end">
                    <button
                      type="button"
                      onClick={handleCalculateClinometerHeight}
                      className="w-full py-1.5 rounded bg-emerald-700 text-white text-xs font-bold hover:bg-emerald-800 transition"
                    >
                      উচ্চতা হিসাব করুন
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Preset Species Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 pt-2">
            {PRESET_SPECIES.map((sp) => {
              const count = speciesCounts[sp.name] || 0;
              return (
                <div
                  key={sp.id}
                  className={`p-3.5 rounded-xl border bg-gradient-to-br ${sp.bgGradient} transition hover:shadow-md flex flex-col justify-between`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <span className="text-2xl">{sp.icon}</span>
                      <div>
                        <h4 className="font-bold text-sm text-gray-900">{sp.name}</h4>
                        <div className="flex items-center gap-1 mt-0.5">
                          <span className="text-[10px] px-1.5 py-0.2 rounded bg-white/80 font-semibold text-gray-600 border border-gray-200">
                            {sp.category}
                          </span>
                          <span className="text-[9px] px-1.5 py-0.2 rounded bg-emerald-100 text-emerald-800 font-bold">
                            {defaultSaplingAge}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Quantity controls */}
                  <div className="flex items-center justify-between mt-2 pt-2 border-t border-gray-200/60 bg-white/60 p-1.5 rounded-lg">
                    <button
                      type="button"
                      onClick={() => handleUpdateCount(sp.name, -5)}
                      className="w-7 h-7 rounded-md bg-gray-200 hover:bg-gray-300 flex items-center justify-center text-xs font-bold active:scale-90"
                    >
                      -5
                    </button>
                    <button
                      type="button"
                      onClick={() => handleUpdateCount(sp.name, -1)}
                      className="w-7 h-7 rounded-md bg-rose-100 text-rose-700 hover:bg-rose-200 flex items-center justify-center font-bold active:scale-90"
                    >
                      <Minus className="w-3.5 h-3.5" />
                    </button>

                    <span className="font-mono font-bold text-base text-emerald-950 px-2">
                      {count}
                    </span>

                    <button
                      type="button"
                      onClick={() => handleUpdateCount(sp.name, 1)}
                      className="w-7 h-7 rounded-md bg-emerald-600 text-white hover:bg-emerald-700 flex items-center justify-center font-bold active:scale-90"
                    >
                      <Plus className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => handleUpdateCount(sp.name, 10)}
                      className="w-7 h-7 rounded-md bg-emerald-100 text-emerald-800 hover:bg-emerald-200 flex items-center justify-center text-xs font-bold active:scale-90"
                    >
                      +10
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Custom Species Adder with Age Category Dropdown */}
          <div className="p-4 rounded-xl bg-gray-50 border border-gray-200 mt-4">
            <h4 className="text-xs font-bold text-gray-800 mb-2 flex items-center gap-1.5">
              <Plus className="w-4 h-4 text-emerald-600" />
              অন্যান্য প্রজাতির গাছ ও চারার বয়স যোগ করুন
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-5 gap-2.5">
              <input
                type="text"
                value={customSpeciesName}
                onChange={(e) => setCustomSpeciesName(e.target.value)}
                placeholder="গাছের নাম (যেমন: মেহগনি)"
                className="sm:col-span-2 rounded-lg border border-gray-300 px-3 py-2 text-sm bg-white focus:ring-2 focus:ring-emerald-500 outline-none"
              />
              <select
                value={customSpeciesCat}
                onChange={(e) => setCustomSpeciesCat(e.target.value as any)}
                className="rounded-lg border border-gray-300 px-3 py-2 text-sm bg-white focus:ring-2 focus:ring-emerald-500 outline-none"
              >
                <option value="ফলদ">ফলদ</option>
                <option value="বনজ">বনজ</option>
                <option value="ঔষধি">ঔষধি</option>
                <option value="অন্যান্য">অন্যান্য</option>
              </select>
              <select
                value={customSpeciesAge}
                onChange={(e) => setCustomSpeciesAge(e.target.value)}
                className="rounded-lg border border-gray-300 px-3 py-2 text-sm bg-white focus:ring-2 focus:ring-emerald-500 outline-none text-xs"
              >
                {SAPLING_AGE_CATEGORIES.map((a) => (
                  <option key={a.value} value={a.value}>{a.label}</option>
                ))}
              </select>
              <div className="flex gap-2">
                <input
                  type="number"
                  value={customSpeciesQty}
                  onChange={(e) => setCustomSpeciesQty(Number(e.target.value))}
                  min={1}
                  className="w-20 rounded-lg border border-gray-300 px-3 py-2 text-sm bg-white focus:ring-2 focus:ring-emerald-500 outline-none font-mono"
                />
                <button
                  type="button"
                  onClick={handleAddCustomSpecies}
                  className="flex-1 px-3 py-2 rounded-lg bg-emerald-700 text-white text-xs font-bold hover:bg-emerald-800 active:scale-95 transition"
                >
                  যোগ করুন
                </button>
              </div>
            </div>

            {/* Custom List Render */}
            {customList.length > 0 && (
              <div className="mt-3 flex flex-wrap gap-2">
                {customList.map((item, idx) => (
                  <span
                    key={idx}
                    className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-white border border-emerald-300 text-emerald-900 shadow-sm"
                  >
                    <span>{item.speciesName} ({item.category}, {item.age}): <strong>{item.quantity}টি</strong></span>
                    <button
                      type="button"
                      onClick={() => handleRemoveCustom(idx)}
                      className="text-rose-500 hover:text-rose-700 font-bold ml-1"
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Section 4: Photo & Remarks */}
        <div className="bg-white rounded-2xl shadow-sm border border-emerald-100/80 p-5 space-y-4">
          <div className="flex items-center justify-between border-b border-gray-100 pb-3">
            <h2 className="text-base font-bold text-emerald-900 flex items-center gap-2">
              <Camera className="w-5 h-5 text-emerald-600" />
              ৪. ছবি ও মন্তব্য
            </h2>
            <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
              ধাপ ৪ / ৪
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                চারার ছবি যুক্ত করুন (ঐচ্ছিক)
              </label>
              <div className="border-2 border-dashed border-gray-300 rounded-xl p-4 text-center bg-gray-50 hover:bg-gray-100 transition cursor-pointer relative">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handlePhotoUpload}
                  className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
                />
                {photoBase64 ? (
                  <div className="relative">
                    <img
                      src={photoBase64}
                      alt="Plantation preview"
                      className="h-32 mx-auto rounded-lg object-cover shadow"
                    />
                    <span className="inline-block mt-2 text-xs text-emerald-700 font-semibold">
                      ✓ ছবি সংযুক্ত হয়েছে (পরিবর্তন করতে চাপুন)
                    </span>
                  </div>
                ) : (
                  <div className="py-2">
                    <Camera className="w-8 h-8 mx-auto text-gray-400 mb-1" />
                    <span className="text-xs text-gray-600 block">ক্যামেরা থেকে ছবি তুলুন বা গ্যালারি নির্বাচন করুন</span>
                  </div>
                )}
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                বিশেষ মন্তব্য / নোট
              </label>
              <textarea
                value={remarks}
                onChange={(e) => setRemarks(e.target.value)}
                rows={4}
                placeholder="যেমন: মাটি প্রস্তুতকৃত, ড্রেনেজ ব্যবস্থা ভাল, প্রাথমিক পানি স্প্রে সম্পন্ন..."
                className="w-full rounded-xl border border-gray-200 p-3 text-sm bg-gray-50/50 focus:bg-white focus:ring-2 focus:ring-emerald-500 outline-none transition"
              />
            </div>
          </div>
        </div>

        {/* Submit Action Bar */}
        <div className="sticky bottom-4 z-30 bg-white/90 backdrop-blur-md p-4 rounded-2xl border border-emerald-200 shadow-xl flex items-center justify-between gap-4">
          <div>
            <span className="text-xs text-gray-500 block">মোট চারা ({defaultSaplingAge}, {treeHeightMeters}m Avg)</span>
            <span className="text-lg font-bold text-emerald-900">{grandTotalSeedlings} টি</span>
          </div>

          <button
            type="submit"
            className="flex-1 max-w-md py-3.5 px-6 rounded-xl bg-gradient-to-r from-emerald-700 to-green-800 hover:from-emerald-800 hover:to-green-900 text-white font-bold text-sm shadow-lg hover:shadow-xl transition active:scale-98 flex items-center justify-center gap-2 cursor-pointer"
          >
            <Save className="w-5 h-5" />
            <span>অফলাইনে তথ্য সংরক্ষণ করুন</span>
          </button>
        </div>

      </form>
    </div>
  );
}

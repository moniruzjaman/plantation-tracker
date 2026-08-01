import React, { useState, useEffect, useRef, useCallback, type ChangeEvent, type FormEvent, type ReactNode } from 'react';
import {
  MapPin,
  Navigation,
  Camera,
  Plus,
  Trash2,
  Map,
  X,
  Loader2,
  CheckCircle,
  AlertCircle,
  Send,
  RotateCcw,
  ImageIcon,
  Footprints,
  Eraser,
  User,
} from 'lucide-react';
import type { Submission, FlatSeedling } from '../../OfflinePlantationDashboard';
import type { Profile } from '../../../hooks/useProfile';
import {
  BD_DIVISIONS,
  BD,
  BD_UPAZILA,
  SPECIES_SUGGESTIONS,
  SEEDLING_CATEGORIES,
  SOURCE_TYPES,
  LOCATION_TYPES,
} from '../../../data/adminData';
import { fetchDirectory, addCustomUpazila, fetchCustomUpazilas } from '../../../services/api';
import { reverseGeocode, autoSelectAdminFromGeo } from '../../../services/geocoding';

/* ------------------------------------------------------------------ */
/*  Props                                                              */
/* ------------------------------------------------------------------ */

interface SubmissionFormProps {
  editData?: Submission | null;
  initialGeoString?: string;
  geoString?: string;
  address?: string;
  adminMatch?: {
    division?: string;
    region?: string;
    district?: string;
    upazila?: string;
  };
  loading?: boolean;
  geoFencePoints?: { lat: number; lng: number }[];
  geoFenceAreaSqm?: number;
  isGeoFenceWalking?: boolean;
  ndviValue?: string;
  profile?: Profile | null;
  onSubmit: (data: Record<string, unknown>) => Promise<void>;
  onFetchGPS: () => void;
  onToggleMap: () => void;
  onToggleGeoFenceWalk: () => void;
  onClearGeoFence: () => void;
  onReset: () => void;
  onPhotoChange: (base64: string) => void;
}

/* ------------------------------------------------------------------ */
/*  Helpers                                                            */
/* ------------------------------------------------------------------ */

const todayISO = (): string => new Date().toISOString().slice(0, 10);

const validateBDMobile = (v: string): boolean => /^01\d{9}$/.test(v.trim());

const emptySeedlingRow = (): FlatSeedling => ({
  speciesName: '',
  category: 'ফলদ',
  quantity: 0,
});

/** Downscale an image dataURL to max 1024px at JPEG 0.7 quality */
function downscaleImage(dataUrl: string, maxDim = 1024, quality = 0.7): Promise<string> {
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => {
      let { width, height } = img;
      if (width <= maxDim && height <= maxDim) {
        resolve(dataUrl);
        return;
      }
      if (width > height) {
        height = (height / width) * maxDim;
        width = maxDim;
      } else {
        width = (width / height) * maxDim;
        height = maxDim;
      }
      const canvas = document.createElement('canvas');
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext('2d');
      if (!ctx) { resolve(dataUrl); return; }
      ctx.drawImage(img, 0, 0, width, height);
      resolve(canvas.toDataURL('image/jpeg', quality));
    };
    img.onerror = () => resolve(dataUrl);
    img.src = dataUrl;
  });
}

/* ------------------------------------------------------------------ */
/*  Section Card (extracted to avoid tsc 5.8 JSX parse issue)         */
/* ------------------------------------------------------------------ */

function SectionCard({
  title,
  icon,
  children,
}: {
  title: string;
  icon: ReactNode;
  children: ReactNode;
}) {
  return (
    <div className="bg-white rounded-xl shadow p-4 space-y-3">
      <div className="flex items-center gap-2 mb-1">
        {icon}
        <h3 className="text-sm font-bold text-gray-800">{title}</h3>
      </div>
      {children}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Component                                                          */
/* ------------------------------------------------------------------ */

export default function SubmissionForm({
  editData,
  initialGeoString,
  geoString,
  address,
  adminMatch,
  loading = false,
  geoFencePoints = [],
  geoFenceAreaSqm,
  isGeoFenceWalking = false,
  ndviValue,
  profile,
  onSubmit,
  onFetchGPS,
  onToggleMap,
  onToggleGeoFenceWalk,
  onClearGeoFence,
  onReset,
  onPhotoChange,
}: SubmissionFormProps) {
  /* ---------- edit mode flag ---------- */
  const isEditMode = Boolean(editData);

  /* ---------- Location ---------- */
  const [division, setDivision] = useState('');
  const [region, setRegion] = useState('');
  const [district, setDistrict] = useState('');
  const [upazila, setUpazila] = useState('');
  const [union, setUnion] = useState('');
  const [village, setVillage] = useState('');
  const [block, setBlock] = useState('');
  const [locationType, setLocationType] = useState('');
  const [sourceType, setSourceType] = useState('');
  const [customSource, setCustomSource] = useState('');
  const [plantingDate, setPlantingDate] = useState(todayISO());
  const [addressText, setAddressText] = useState('');
  const [lat, setLat] = useState('');
  const [lng, setLng] = useState('');

  /* ---------- People ---------- */
  const [nurseryName, setNurseryName] = useState('');
  const [mobile, setMobile] = useState('');
  const [saaoName, setSaaoName] = useState('');
  const [saaoMobile, setSaaoMobile] = useState('');
  const [officerName, setOfficerName] = useState('');
  const [officerMobile, setOfficerMobile] = useState('');

  /* ---------- Seedlings ---------- */
  const [seedlings, setSeedlings] = useState<FlatSeedling[]>([emptySeedlingRow()]);

  /* ---------- Other ---------- */
  const [photoBase64, setPhotoBase64] = useState('');
  const [remarks, setRemarks] = useState('');
  const [ndvi, setNdvi] = useState('');

  /* ---------- UI state ---------- */
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [directoryData, setDirectoryData] = useState<any[]>([]);
  const [customUpazilas, setCustomUpazilas] = useState<string[]>([]);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const reverseGeoTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  /* ---------------------------------------------------------------- */
  /*  Derived: cascading dropdowns                                      */
  /* ---------------------------------------------------------------- */

  // regions available for selected division — BD keys are region names
  const regionsForDivision = division
    ? (BD[division] ?? Object.keys(BD).filter((k) => !BD_DIVISIONS.includes(k)))
    : [];

  // districts for selected region
  const districtsForRegion = region ? (BD[region] ?? []) : [];

  // upazilas for selected district
  const upazilasForDistrict = district ? (BD_UPAZILA[district] ?? []) : [];

  /* ---------------------------------------------------------------- */
  /*  Effects: sync props → state                                       */
  /* ---------------------------------------------------------------- */

  // Pre-fill GPS string
  useEffect(() => {
    const geo = geoString || initialGeoString || '';
    if (geo) {
      const parts = geo.split(',').map((s) => s.trim());
      if (parts.length === 2) {
        setLat(parts[0]);
        setLng(parts[1]);
      }
    }
  }, [geoString, initialGeoString]);

  // Pre-fill address from prop
  useEffect(() => {
    if (address) setAddressText(address);
  }, [address]);

  // Pre-fill admin match from reverse geocoding
  useEffect(() => {
    if (adminMatch) {
      if (adminMatch.division && !division) setDivision(adminMatch.division);
      if (adminMatch.region && !region) setRegion(adminMatch.region);
      if (adminMatch.district && !district) setDistrict(adminMatch.district);
      if (adminMatch.upazila && !upazila) setUpazila(adminMatch.upazila);
      // Best-effort — Nominatim passthrough, not matched against a fixed
      // list (BD's Union Parishad structure isn't consistently in OSM),
      // so double-check these against the map/address before submitting.
      if (adminMatch.union && !union) setUnion(adminMatch.union);
      if (adminMatch.village && !village) setVillage(adminMatch.village);
    }
  }, [adminMatch]); // eslint-disable-line react-hooks/exhaustive-deps

  // NDVI from prop
  useEffect(() => {
    if (ndviValue) setNdvi(ndviValue);
  }, [ndviValue]);

  // Profile auto-fill: pre-fill empty fields from profile
  useEffect(() => {
    if (!profile) return;
    if (profile.name && !saaoName) setSaaoName(profile.name);
    if (profile.mobile && !saaoMobile) setSaaoMobile(profile.mobile);
    if (profile.officerName && !officerName) setOfficerName(profile.officerName);
    if (profile.officerMobile && !officerMobile) setOfficerMobile(profile.officerMobile);
    if (profile.district && !district) setDistrict(profile.district);
    if (profile.upazila && !upazila) setUpazila(profile.upazila);
    if (profile.region && !region) setRegion(profile.region);
    if (profile.block && !block) setBlock(profile.block);
  }, [profile]); // eslint-disable-line react-hooks/exhaustive-deps

  // Fetch directory data for autocomplete
  useEffect(() => {
    fetchDirectory().then(setDirectoryData).catch(() => {});
    // Fetch custom upazilas for the dropdown
    fetchCustomUpazilas().then((list) => {
      if (Array.isArray(list)) {
        setCustomUpazilas(list.map((u: any) => u.name || u.upazila || String(u)).filter(Boolean));
      }
    }).catch(() => {});
  }, []);

  // Edit mode: populate all fields
  useEffect(() => {
    if (!editData) return;
    setDivision(editData.division ?? '');
    setRegion(editData.region ?? '');
    setDistrict(editData.district ?? '');
    setUpazila(editData.upazila ?? '');
    setUnion(editData.union ?? '');
    setVillage(editData.village ?? '');
    setLocationType(editData.locationType ?? '');
    setPlantingDate(editData.plantingDate ?? todayISO());
    setAddressText(editData.address ?? '');
    setLat(editData.latitude ?? '');
    setLng(editData.longitude ?? '');
    setNurseryName(editData.farmerName ?? editData.nurseryName ?? '');
    setMobile(editData.farmerMobile ?? editData.mobile ?? '');
    setSaaoName(editData.saaoName ?? '');
    setSaaoMobile(editData.saaoMobile ?? '');
    setOfficerName(editData.officerName ?? editData.caretakerName ?? '');
    setOfficerMobile(editData.officerMobile ?? editData.caretakerMobile ?? '');
    setRemarks(editData.remarks ?? '');
    setNdvi(editData.ndvi ?? '');
    setPhotoBase64(editData.photoBase64 ?? '');

    // Seedlings — prefer v2 flat array
    if (editData.seedlings && editData.seedlings.length > 0) {
      setSeedlings(editData.seedlings);
    } else {
      setSeedlings([emptySeedlingRow()]);
    }

    // Source type & block stored as top-level fields if present
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const raw = editData as any;
    setSourceType(raw.sourceType ?? '');
    setCustomSource(raw.customSource ?? '');
    setBlock(raw.block ?? '');
  }, [editData]); // eslint-disable-line react-hooks/exhaustive-deps

  /* ---------------------------------------------------------------- */
  /*  Directory-based mobile auto-fill                                  */
  /* ---------------------------------------------------------------- */

  const handleSaaoNameChange = useCallback((val: string) => {
    setSaaoName(val);
    const match = directoryData.find((d: any) => {
      const name = (d.name || d.saaoName || '').trim();
      return name === val.trim();
    });
    if (match) {
      const mob = match.mobile || match.saaoMobile || '';
      if (mob && !saaoMobile) setSaaoMobile(mob);
    }
  }, [directoryData, saaoMobile]);

  const handleOfficerNameChange = useCallback((val: string) => {
    setOfficerName(val);
    const match = directoryData.find((d: any) => {
      const name = (d.name || d.officerName || '').trim();
      return name === val.trim();
    });
    if (match) {
      const mob = match.mobile || match.officerMobile || '';
      if (mob && !officerMobile) setOfficerMobile(mob);
    }
  }, [directoryData, officerMobile]);

  /* ---------------------------------------------------------------- */
  /*  Manual coordinate change → reverse geocode (debounced)          */
  /* ---------------------------------------------------------------- */

  const handleManualCoordChange = useCallback((field: 'lat' | 'lng', value: string) => {
    // Support pasting a combined "23.8103, 90.4125" string (e.g. copied
    // straight from Google Maps) into either box, matching legacy's
    // single-field paste behavior. Only auto-splits if both halves look
    // like plausible BD coordinates.
    const combinedMatch = value.match(/^\s*(-?\d+(?:\.\d+)?)\s*[,\s]\s*(-?\d+(?:\.\d+)?)\s*$/);

    let resolvedLat = field === 'lat' ? value : lat;
    let resolvedLng = field === 'lng' ? value : lng;

    if (combinedMatch) {
      const a = parseFloat(combinedMatch[1]);
      const b = parseFloat(combinedMatch[2]);
      // BD latitude ~20-27, longitude ~88-93 — use that to decide order
      // rather than assuming "lat, lng" was pasted in the box order.
      if (a >= 20 && a <= 27 && b >= 88 && b <= 93) {
        resolvedLat = String(a);
        resolvedLng = String(b);
      } else if (b >= 20 && b <= 27 && a >= 88 && a <= 93) {
        resolvedLat = String(b);
        resolvedLng = String(a);
      }
    }

    setLat(resolvedLat);
    setLng(resolvedLng);

    // Debounced reverse geocode
    if (reverseGeoTimerRef.current) clearTimeout(reverseGeoTimerRef.current);
    reverseGeoTimerRef.current = setTimeout(async () => {
      if (!resolvedLat || !resolvedLng) return;
      const latNum = parseFloat(resolvedLat);
      const lngNum = parseFloat(resolvedLng);
      if (isNaN(latNum) || isNaN(lngNum)) return;
      if (latNum < 20 || latNum > 27 || lngNum < 88 || lngNum > 93) return; // not BD

      try {
        const result = await reverseGeocode(latNum, lngNum);
        if (result) {
          if (!addressText && result.display_name) {
            setAddressText(result.display_name);
          }
          const admin = autoSelectAdminFromGeo(result.address);
          if (admin.division && !division) setDivision(admin.division);
          if (admin.region && !region) setRegion(admin.region);
          if (admin.district && !district) setDistrict(admin.district);
          if (admin.upazila && !upazila) setUpazila(admin.upazila);
          if (admin.union && !union) setUnion(admin.union);
          if (admin.village && !village) setVillage(admin.village);
        }
      } catch {
        // silent
      }
    }, 800);
  }, [lat, lng, addressText, division, region, district, upazila, union, village]);

  /* ---------------------------------------------------------------- */
  /*  Seedling helpers                                                 */
  /* ---------------------------------------------------------------- */

  const clearMessages = useCallback(() => {
    setSuccessMsg('');
    setErrorMsg('');
  }, []);

  const addSeedlingRow = () => {
    clearMessages();
    setSeedlings((prev) => [...prev, emptySeedlingRow()]);
  };

  const removeSeedlingRow = (index: number) => {
    clearMessages();
    setSeedlings((prev) => (prev.length <= 1 ? prev : prev.filter((_, i) => i !== index)));
  };

  const updateSeedling = (index: number, field: keyof FlatSeedling, value: string | number) => {
    clearMessages();
    setSeedlings((prev) =>
      prev.map((s, i) => (i === index ? { ...s, [field]: value } : s)),
    );
  };

  // Photo handler with downscale
  const handlePhotoCapture = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 15 * 1024 * 1024) {
      setErrors((p) => ({ ...p, photo: 'ছবির আকার ১৫ এমবি-এর বেশি হতে পারবে না' }));
      return;
    }
    const reader = new FileReader();
    reader.onload = async () => {
      const b64 = reader.result as string;
      try {
        const downscaled = await downscaleImage(b64);
        setPhotoBase64(downscaled);
        onPhotoChange(downscaled);
      } catch {
        setPhotoBase64(b64);
        onPhotoChange(b64);
      }
      setErrors((p) => {
        const n = { ...p };
        delete n.photo;
        return n;
      });
    };
    reader.readAsDataURL(file);
  };

  /* ---------------------------------------------------------------- */
  /*  Validation                                                        */
  /* ---------------------------------------------------------------- */

  const validate = (): boolean => {
    const e: Record<string, string> = {};

    if (!district.trim()) e.district = 'জেলা নির্বাচন করুন';
    if (!upazila.trim()) e.upazila = 'উপজেলা নির্বাচন করুন';

    if (!nurseryName.trim()) e.nurseryName = 'কৃষক/নার্সারির নাম আবশ্যক';

    if (!mobile.trim()) {
      e.mobile = 'মোবাইল নম্বর আবশ্যক';
    } else if (!validateBDMobile(mobile)) {
      e.mobile = 'সঠিক বাংলাদেশি মোবাইল নম্বর দিন (০১XXXXXXXXX)';
    }

    if (saaoMobile.trim() && !validateBDMobile(saaoMobile)) {
      e.saaoMobile = 'সঠিক বাংলাদেশি মোবাইল নম্বর দিন';
    }
    if (officerMobile.trim() && !validateBDMobile(officerMobile)) {
      e.officerMobile = 'সঠিক বাংলাদেশি মোবাইল নম্বর দিন';
    }

    // At least one seedling with species + quantity
    const hasValid = seedlings.some(
      (s) => s.speciesName.trim() !== '' && s.quantity > 0,
    );
    if (!hasValid) {
      e.seedlings = 'কমপক্ষে একটি চারার নাম ও পরিমাণ দিন';
    }

    setErrors(e);
    return Object.keys(e).length === 0;
  };

  /* ---------------------------------------------------------------- */
  /*  Submit                                                            */
  /* ---------------------------------------------------------------- */

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    clearMessages();

    if (!validate()) return;

    const data: Record<string, unknown> = {
      division: division || undefined,
      region: region || undefined,
      district,
      upazila,
      union: union || undefined,
      village: village || undefined,
      block: block || undefined,
      locationType: locationType || undefined,
      sourceType: (sourceType === 'অন্যান্য' ? `অন্যান্য: ${customSource}` : sourceType) || undefined,
      customSource: sourceType === 'অন্যান্য' ? customSource : undefined,
      plantingDate,
      address: addressText || undefined,
      latitude: lat || undefined,
      longitude: lng || undefined,
      farmerName: nurseryName,
      farmerMobile: mobile,
      saaoName: saaoName || undefined,
      saaoMobile: saaoMobile || undefined,
      officerName: officerName || undefined,
      officerMobile: officerMobile || undefined,
      seedlings: seedlings.filter((s) => s.speciesName.trim() !== ''),
      ndvi: ndvi || undefined,
      photoBase64: photoBase64 || undefined,
      remarks: remarks || undefined,
      geoFencePoints: geoFencePoints.length > 0 ? geoFencePoints : undefined,
      geoFenceAreaSqm: geoFenceAreaSqm ?? undefined,
    };

    // Preserve edit ID
    if (editData) {
      data.id = editData.id;
      data.submissionId = editData.submissionId;
    }

    try {
      await onSubmit(data);
      setSuccessMsg(isEditMode ? 'তথ্য সফলভাবে আপডেট হয়েছে!' : 'তথ্য সফলভাবে জমা হয়েছে!');
      if (!isEditMode) resetForm();
    } catch (err) {
      setErrorMsg(err instanceof Error ? err.message : 'জমা দিতে সমস্যা হয়েছে');
    }
  };

  /* ---------------------------------------------------------------- */
  /*  Reset                                                             */
  /* ---------------------------------------------------------------- */

  const resetForm = () => {
    setDivision('');
    setRegion('');
    setDistrict('');
    setUpazila('');
    setUnion('');
    setVillage('');
    setBlock('');
    setLocationType('');
    setSourceType('');
    setCustomSource('');
    setPlantingDate(todayISO());
    setAddressText('');
    setLat('');
    setLng('');
    setNurseryName('');
    setMobile('');
    setSaaoName('');
    setSaaoMobile('');
    setOfficerName('');
    setOfficerMobile('');
    setSeedlings([emptySeedlingRow()]);
    setPhotoBase64('');
    setRemarks('');
    setNdvi('');
    setErrors({});
    setSuccessMsg('');
    setErrorMsg('');
    if (fileInputRef.current) fileInputRef.current.value = '';
    onReset();
  };

  /* ---------------------------------------------------------------- */
  /*  Geo-fence computed values                                         */
  /* ---------------------------------------------------------------- */

  const fenceSotok = geoFenceAreaSqm ? (geoFenceAreaSqm / 672).toFixed(2) : null;

  /* ---------------------------------------------------------------- */
  /*  Directory datalist options                                       */
  /* ---------------------------------------------------------------- */

  const directoryNames = directoryData
    .map((d: any) => (d.name || d.saaoName || d.officerName || '').trim())
    .filter(Boolean);

  /* ---------------------------------------------------------------- */
  /*  Render helpers                                                    */
  /* ---------------------------------------------------------------- */

  const fieldError = (key: string) => errors[key] || null;

  const inputCls = (hasError = false) =>
    `w-full px-3 py-2 border rounded-lg text-sm outline-none transition-colors focus:ring-2 focus:ring-[#15803d]/30 focus:border-[#15803d] ${
      hasError ? 'border-red-400' : 'border-gray-200'
    }`;

  const labelCls = 'text-xs font-semibold text-gray-600 block mb-1';

  /* ================================================================= */
/*  JSX                                                               */
/* ================================================================= */

  return (
    <form onSubmit={handleSubmit} className="space-y-4" noValidate>
      {/* Title */}
      <div className="text-center">
        <h2 className="text-lg font-bold text-gray-800">
          {isEditMode ? '✏️ তথ্য সম্পাদনা' : '📄 নতুন তথ্য জমা দিন'}
        </h2>
      </div>

      {/* ====== Profile bar (#12) ====== */}
      {profile && profile.name && (
        <div className="bg-[#15803d]/5 border border-[#15803d]/20 rounded-xl px-4 py-2.5 flex items-center gap-3 text-xs">
          <div className="w-8 h-8 rounded-full bg-[#15803d]/10 flex items-center justify-center shrink-0">
            <User className="w-4 h-4 text-[#15803d]" />
          </div>
          <div className="min-w-0 flex-1">
            <p className="font-semibold text-gray-800 truncate">{profile.name}</p>
            <p className="text-gray-500 truncate">
              {[profile.designation, profile.district, profile.upazila].filter(Boolean).join(' · ') || 'প্রোফাইল তথ্য সম্পূর্ণ করুন'}
            </p>
          </div>
        </div>
      )}

      {/* Success / Error banners */}
      {successMsg && (
        <div className="flex items-center gap-2 bg-green-50 border border-green-300 text-green-700 rounded-lg px-4 py-2 text-sm">
          <CheckCircle className="w-4 h-4 shrink-0" />
          <span>{successMsg}</span>
          <button
            type="button"
            onClick={() => setSuccessMsg('')}
            className="ml-auto"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}
      {errorMsg && (
        <div className="flex items-center gap-2 bg-red-50 border border-red-300 text-red-700 rounded-lg px-4 py-2 text-sm">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{errorMsg}</span>
          <button
            type="button"
            onClick={() => setErrorMsg('')}
            className="ml-auto"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* ============================================================ */}
      {/*  1. LOCATION SECTION                                          */}
      {/* ============================================================ */}
      <SectionCard
        title="📍 অবস্থান তথ্য"
        icon={<MapPin className="w-4 h-4 text-[#15803d]" />}
      >
        {/* GPS row */}
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => {
                clearMessages();
                onFetchGPS();
              }}
              className="inline-flex items-center gap-1.5 px-3 py-2 bg-[#15803d] text-white rounded-lg text-sm font-medium hover:bg-[#166534] transition-colors disabled:opacity-50"
              disabled={loading}
            >
              <Navigation className="w-4 h-4" />
              📍 GPS নিন
            </button>
            <button
              type="button"
              onClick={onToggleMap}
              className="inline-flex items-center gap-1.5 px-3 py-2 bg-gray-100 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-200 transition-colors"
            >
              <Map className="w-4 h-4" />
              🗺️ মানচিত্রে দেখুন
            </button>
          </div>

          {/* GPS display */}
          {(lat || lng) && (
            <div className="text-xs text-gray-500 bg-gray-50 rounded-lg px-3 py-1.5 font-mono">
              {lat}, {lng}
            </div>
          )}

          {/* Manual lat/lng (#8: triggers reverse geocode) */}
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className={labelCls}>অক্ষাংশ (Latitude)</label>
              <input
                type="text"
                inputMode="decimal"
                placeholder="২৩.৮১০৩"
                value={lat}
                onChange={(e) => handleManualCoordChange('lat', e.target.value)}
                className={inputCls()}
              />
            </div>
            <div>
              <label className={labelCls}>দ্রাঘিমাংশ (Longitude)</label>
              <input
                type="text"
                inputMode="decimal"
                placeholder="৯০.৪১২৫"
                value={lng}
                onChange={(e) => handleManualCoordChange('lng', e.target.value)}
                className={inputCls()}
              />
            </div>
          </div>
        </div>

        {/* Address */}
        <div>
          <label className={labelCls}>ঠিকানা</label>
          <input
            type="text"
            placeholder="স্বয়ংক্রিয়ভাবে পূরণ হবে"
            value={addressText}
            onChange={(e) => setAddressText(e.target.value)}
            className={inputCls()}
          />
        </div>

        {/* Division */}
        <div>
          <label className={labelCls}>বিভাগ</label>
          <select
            value={division}
            onChange={(e) => {
              clearMessages();
              setDivision(e.target.value);
              setRegion('');
              setDistrict('');
              setUpazila('');
            }}
            className={inputCls()}
          >
            <option value="">-- বিভাগ নির্বাচন করুন --</option>
            {BD_DIVISIONS.map((d) => (
              <option key={d} value={d}>
                {d}
              </option>
            ))}
          </select>
        </div>

        {/* Region */}
        <div>
          <label className={labelCls}>অঞ্চল / রিজিয়ন</label>
          <select
            value={region}
            onChange={(e) => {
              clearMessages();
              setRegion(e.target.value);
              setDistrict('');
              setUpazila('');
            }}
            className={inputCls()}
          >
            <option value="">-- অঞ্চল নির্বাচন করুন --</option>
            {regionsForDivision.map((r) => (
              <option key={r} value={r}>
                {r}
              </option>
            ))}
          </select>
        </div>

        {/* District */}
        <div>
          <label className={labelCls}>
            জেলা <span className="text-red-500">*</span>
          </label>
          <select
            value={district}
            onChange={(e) => {
              clearMessages();
              setDistrict(e.target.value);
              setUpazila('');
            }}
            className={inputCls(!!fieldError('district'))}
          >
            <option value="">-- জেলা নির্বাচন করুন --</option>
            {districtsForRegion.map((d) => (
              <option key={d} value={d}>
                {d}
              </option>
            ))}
          </select>
          {fieldError('district') && (
            <p className="text-xs text-red-600 mt-1">{fieldError('district')}</p>
          )}
        </div>

        {/* Upazila */}
        <div>
          <label className={labelCls}>
            উপজেলা <span className="text-red-500">*</span>
          </label>
          <select
            value={upazila}
            onChange={(e) => {
              clearMessages();
              if (e.target.value === '__add_new__') {
                const name = window.prompt('নতুন উপজেলার নাম লিখুন:');
                if (name && name.trim() && district) {
                  addCustomUpazila(district, name.trim()).then((res) => {
                    if (res.ok) {
                      setCustomUpazilas((prev) => [...prev, name.trim()]);
                      setUpazila(name.trim());
                    } else {
                      window.alert('উপজেলা যোগ করতে সমস্যা হয়েছে: ' + (res.error || ''));
                    }
                  });
                }
                return;
              }
              setUpazila(e.target.value);
            }}
            className={inputCls(!!fieldError('upazila'))}
          >
            <option value="">-- উপজেলা নির্বাচন করুন --</option>
            {upazilasForDistrict.map((u) => (
              <option key={u} value={u}>
                {u}
              </option>
            ))}
            {customUpazilas
              .filter((u) => !upazilasForDistrict.includes(u))
              .map((u) => (
                <option key={`custom-${u}`} value={u}>
                  {u} (কাস্টম)
                </option>
              ))}
            {district && (
              <option value="__add_new__" className="text-[#15803d] font-semibold">
                ➕ তালিকায় নেই — যোগ করুন
              </option>
            )}
          </select>
          {fieldError('upazila') && (
            <p className="text-xs text-red-600 mt-1">{fieldError('upazila')}</p>
          )}
        </div>

        {/* Union / Village / Block */}
        <div className="grid grid-cols-3 gap-2">
          <div>
            <label className={labelCls}>ইউনিয়ন</label>
            <input
              type="text"
              placeholder="ইউনিয়ন"
              value={union}
              onChange={(e) => setUnion(e.target.value)}
              className={inputCls()}
            />
          </div>
          <div>
            <label className={labelCls}>গ্রাম</label>
            <input
              type="text"
              placeholder="গ্রাম"
              value={village}
              onChange={(e) => setVillage(e.target.value)}
              className={inputCls()}
            />
          </div>
          <div>
            <label className={labelCls}>ব্লক <span className="text-[10px] font-normal text-gray-400">সরকারি প্রতিবেদনের জন্য</span></label>
            <input
              type="text"
              placeholder="ব্লক"
              value={block}
              onChange={(e) => setBlock(e.target.value)}
              className={inputCls()}
            />
          </div>
        </div>

        {/* Location Type / Source Type / Planting Date */}
        <div className="grid grid-cols-3 gap-2">
          <div>
            <label className={labelCls}>স্থানের ধরন</label>
            <select
              value={locationType}
              onChange={(e) => setLocationType(e.target.value)}
              className={inputCls()}
            >
              <option value="">-- নির্বাচন --</option>
              {(LOCATION_TYPES || []).map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className={labelCls}>উৎস</label>
            <select
              value={sourceType}
              onChange={(e) => setSourceType(e.target.value)}
              className={inputCls()}
            >
              <option value="">-- নির্বাচন --</option>
              {SOURCE_TYPES.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className={labelCls}>রোপণের তারিখ</label>
            <input
              type="date"
              value={plantingDate}
              onChange={(e) => setPlantingDate(e.target.value)}
              className={inputCls()}
            />
          </div>
        </div>

        {/* #9: Custom source text when sourceType is "অন্যান্য" */}
        {sourceType === 'অন্যান্য' && (
          <div>
            <label className={labelCls}>উৎসের বিবরণ</label>
            <input
              type="text"
              placeholder="উৎসের ধরন লিখুন"
              value={customSource}
              onChange={(e) => setCustomSource(e.target.value)}
              className={inputCls()}
            />
          </div>
        )}
      </SectionCard>

      {/* ============================================================*/}
      {/*  2. PEOPLE SECTION                                           */}
      {/* ============================================================*/}
      <SectionCard
        title="👤 ব্যক্তিগত তথ্য"
        icon={<Navigation className="w-4 h-4 text-[#15803d]" />}
      >
        {/* Farmer / Nursery Name */}
        <div>
          <label className={labelCls}>
            কৃষক / নার্সারির নাম <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            placeholder="নাম লিখুন"
            value={nurseryName}
            onChange={(e) => {
              clearMessages();
              setNurseryName(e.target.value);
            }}
            className={inputCls(!!fieldError('nurseryName'))}
          />
          {fieldError('nurseryName') && (
            <p className="text-xs text-red-600 mt-1">{fieldError('nurseryName')}</p>
          )}
        </div>

        {/* Farmer Mobile */}
        <div>
          <label className={labelCls}>
            কৃষকের মোবাইল <span className="text-red-500">*</span>
          </label>
          <input
            type="tel"
            inputMode="numeric"
            placeholder="০১XXXXXXXXX"
            maxLength={11}
            value={mobile}
            onChange={(e) => {
              clearMessages();
              setMobile(e.target.value.replace(/[^0-9]/g, ''));
            }}
            className={inputCls(!!fieldError('mobile'))}
          />
          {fieldError('mobile') && (
            <p className="text-xs text-red-600 mt-1">{fieldError('mobile')}</p>
          )}
        </div>

        {/* SAAO Name & Mobile (#5: datalist autocomplete) */}
        <div className="grid grid-cols-2 gap-2">
          <div>
            <label className={labelCls}>এসএএও এর নাম</label>
            <input
              type="text"
              placeholder="এসএএও নাম"
              list="saao-directory-list"
              value={saaoName}
              onChange={(e) => handleSaaoNameChange(e.target.value)}
              className={inputCls()}
            />
          </div>
          <div>
            <label className={labelCls}>এসএএও মোবাইল</label>
            <input
              type="tel"
              inputMode="numeric"
              placeholder="০১XXXXXXXXX"
              maxLength={11}
              value={saaoMobile}
              onChange={(e) =>
                setSaaoMobile(e.target.value.replace(/[^0-9]/g, ''))
              }
              className={inputCls(!!fieldError('saaoMobile'))}
            />
            {fieldError('saaoMobile') && (
              <p className="text-xs text-red-600 mt-1">
                {fieldError('saaoMobile')}
              </p>
            )}
          </div>
        </div>

        {/* Datalist for SAAO directory autocomplete */}
        <datalist id="saao-directory-list">
          {directoryNames.map((name, i) => (
            <option key={`saao-${i}`} value={name} />
          ))}
        </datalist>

        {/* Monitoring Officer Name & Mobile (#5: datalist, #6: hint text) */}
        <div className="grid grid-cols-2 gap-2">
          <div>
            <label className={labelCls}>মনিটরিং অফিসারের নাম</label>
            <input
              type="text"
              placeholder="অফিসারের নাম"
              list="officer-directory-list"
              value={officerName}
              onChange={(e) => handleOfficerNameChange(e.target.value)}
              className={inputCls()}
            />
            {/* #6: Officer role hint */}
            <p className="text-[10px] text-amber-600 mt-1">শুধুমাত্র উপজেলা কর্মকর্তা (AEO2/AAO/UAO) — জেলা/অঞ্চল পর্যায়ের কর্মকর্তা নয়</p>
          </div>
          <div>
            <label className={labelCls}>অফিসারের মোবাইল</label>
            <input
              type="tel"
              inputMode="numeric"
              placeholder="০১XXXXXXXXX"
              maxLength={11}
              value={officerMobile}
              onChange={(e) =>
                setOfficerMobile(e.target.value.replace(/[^0-9]/g, ''))
              }
              className={inputCls(!!fieldError('officerMobile'))}
            />
            {fieldError('officerMobile') && (
              <p className="text-xs text-red-600 mt-1">
                {fieldError('officerMobile')}
              </p>
            )}
          </div>
        </div>

        {/* Datalist for officer directory autocomplete */}
        <datalist id="officer-directory-list">
          {directoryNames.map((name, i) => (
            <option key={`officer-${i}`} value={name} />
          ))}
        </datalist>
      </SectionCard>

      {/* ============================================================*/}
      {/*  3. SEEDLINGS SECTION                                        */}
      {/* ============================================================*/}
      <SectionCard
        title="🌱 চারার তথ্য"
        icon={<Plus className="w-4 h-4 text-[#15803d]" />}
      >
        {fieldError('seedlings') && (
          <p className="text-xs text-red-600 mb-1">{fieldError('seedlings')}</p>
        )}

        {/* Seedling rows */}
        <div className="space-y-2">
          {seedlings.map((s, idx) => (
            <div
              key={idx}
              className="flex items-start gap-2 bg-gray-50 rounded-lg p-2"
            >
              <div className="flex-1 grid grid-cols-3 gap-2">
                {/* Species Name */}
                <div className="col-span-1">
                  <input
                    type="text"
                    list="species-list"
                    placeholder="জাতের নাম"
                    value={s.speciesName}
                    onChange={(e) =>
                      updateSeedling(idx, 'speciesName', e.target.value)
                    }
                    className={inputCls()}
                  />
                </div>
                {/* Category */}
                <div className="col-span-1">
                  <select
                    value={s.category}
                    onChange={(e) =>
                      updateSeedling(idx, 'category', e.target.value)
                    }
                    className={inputCls()}
                  >
                    {SEEDLING_CATEGORIES.map((c) => (
                      <option key={c.value} value={c.value}>
                        {c.label}
                      </option>
                    ))}
                  </select>
                </div>
                {/* Quantity */}
                <div className="col-span-1 flex items-center gap-1">
                  <input
                    type="number"
                    inputMode="numeric"
                    min="0"
                    placeholder="পরিমাণ"
                    value={s.quantity || ''}
                    onChange={(e) =>
                      updateSeedling(
                        idx,
                        'quantity',
                        parseInt(e.target.value, 10) || 0,
                      )
                    }
                    className={inputCls()}
                  />
                  {/* Remove button */}
                  <button
                    type="button"
                    onClick={() => removeSeedlingRow(idx)}
                    className="p-1.5 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors shrink-0"
                    title="সরিয়ে দিন"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Datalist for species suggestions */}
        <datalist id="species-list">
          {SPECIES_SUGGESTIONS.map((sp) => (
            <option key={sp} value={sp} />
          ))}
        </datalist>

        {/* Add row button */}
        <button
          type="button"
          onClick={addSeedlingRow}
          className="inline-flex items-center gap-1.5 px-3 py-2 bg-green-50 text-[#15803d] rounded-lg text-sm font-medium hover:bg-green-100 transition-colors border border-green-200"
        >
          <Plus className="w-4 h-4" />
          ➕ চারা যোগ করুন
        </button>

        {/* NDVI */}
        <div>
          <label className={labelCls}>NDVI মান</label>
          <input
            type="text"
            inputMode="decimal"
            placeholder="স্বয়ংক্রিয়ভাবে পূরণ হবে"
            value={ndvi}
            onChange={(e) => setNdvi(e.target.value)}
            className={inputCls()}
          />
        </div>
      </SectionCard>

      {/* ============================================================*/}
      {/*  4. OTHER SECTION                                            */}
      {/* ============================================================*/}

      {/* Photo (#7: downscale) */}
      <SectionCard
        title="📷 ছবি"
        icon={<Camera className="w-4 h-4 text-[#15803d]" />}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          capture="environment"
          onChange={handlePhotoCapture}
          className="hidden"
          id="photo-capture"
        />
        <div className="space-y-2">
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="inline-flex items-center gap-1.5 px-3 py-2 bg-[#15803d] text-white rounded-lg text-sm font-medium hover:bg-[#166534] transition-colors"
          >
            <Camera className="w-4 h-4" />
            📸 ছবি তুলুন / আপলোড করুন
          </button>

          {photoBase64 && (
            <div className="relative inline-block">
              <img
                src={photoBase64}
                alt="প্রিভিউ"
                className="w-32 h-32 object-cover rounded-lg border border-gray-200"
              />
              <button
                type="button"
                onClick={() => {
                  setPhotoBase64('');
                  onPhotoChange('');
                  if (fileInputRef.current) fileInputRef.current.value = '';
                }}
                className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-0.5 hover:bg-red-600 transition-colors"
              >
                <X className="w-3 h-3" />
              </button>
            </div>
          )}

          {!photoBase64 && (
            <div className="w-32 h-32 border-2 border-dashed border-gray-300 rounded-lg flex flex-col items-center justify-center text-gray-400">
              <ImageIcon className="w-8 h-8 mb-1" />
              <span className="text-xs">কোনো ছবি নেই</span>
            </div>
          )}

          {fieldError('photo') && (
            <p className="text-xs text-red-600 mt-1">{fieldError('photo')}</p>
          )}
        </div>
      </SectionCard>

      {/* Geo-fence */}
      <SectionCard
        title="🚧 জিও-ফেন্স"
        icon={<Footprints className="w-4 h-4 text-[#15803d]" />}
      >
        <div className="space-y-2">
          {geoFencePoints.length > 0 && (
            <div className="bg-green-50 border border-green-200 rounded-lg px-3 py-2 text-sm text-green-800 space-y-1">
              <p>
                <span className="font-semibold">পয়েন্ট:</span>{' '}
                {geoFencePoints.length}টি
              </p>
              {geoFenceAreaSqm != null && (
                <p>
                  <span className="font-semibold">এলাকা:</span>{' '}
                  {geoFenceAreaSqm.toFixed(1)} বর্গমিটার{' '}
                  {fenceSotok !== null && (
                    <span className="text-green-600">
                      (~{fenceSotok} শতক)
                    </span>
                  )}
                </p>
              )}
            </div>
          )}

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onToggleGeoFenceWalk}
              className={`inline-flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                isGeoFenceWalking
                  ? 'bg-red-500 text-white hover:bg-red-600'
                  : 'bg-[#15803d] text-white hover:bg-[#166534]'
              }`}
            >
              <Footprints className="w-4 h-4" />
              {isGeoFenceWalking ? '⏹ হাঁটা বন্ধ করুন' : '🚶 হেঁটে এলাকা নির্ধারণ করুন'}
            </button>

            <button
              type="button"
              onClick={onClearGeoFence}
              className="inline-flex items-center gap-1.5 px-3 py-2 bg-gray-100 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-200 transition-colors"
            >
              <Eraser className="w-4 h-4" />
              মুছুন
            </button>
          </div>

          {isGeoFenceWalking && (
            <p className="text-xs text-amber-600 bg-amber-50 border border-amber-200 rounded-lg px-3 py-1.5">
              🚶 এলাকার চারপাশে হাঁটুন... পয়েন্ট সংগ্রহ হচ্ছে
            </p>
          )}
        </div>
      </SectionCard>

      {/* Remarks */}
      <SectionCard
        title="📝 মন্তব্য"
        icon={<span className="text-sm">📝</span>}
      >
        <textarea
          rows={3}
          placeholder="অতিরিক্ত তথ্য বা মন্তব্য লিখুন..."
          value={remarks}
          onChange={(e) => setRemarks(e.target.value)}
          className={`${inputCls()} resize-none`}
        />
      </SectionCard>

      {/* ============================================================*/}
      {/*  5. SUBMIT SECTION                                           */}
      {/* ============================================================*/}
      <div className="flex items-center gap-2 pt-2">
        <button
          type="submit"
          disabled={loading}
          className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-3 bg-[#15803d] text-white rounded-xl text-sm font-bold hover:bg-[#166534] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              জমা হচ্ছে...
            </>
          ) : (
            <>
              <Send className="w-4 h-4" />
              তথ্য জমা দিন
            </>
          )}
        </button>

        {isEditMode && (
          <button
            type="button"
            onClick={onReset}
            className="inline-flex items-center gap-1.5 px-4 py-3 bg-gray-100 text-gray-700 rounded-xl text-sm font-medium hover:bg-gray-200 transition-colors"
          >
            <RotateCcw className="w-4 h-4" />
            বাতিল
          </button>
        )}
      </div>
    </form>
  );
}

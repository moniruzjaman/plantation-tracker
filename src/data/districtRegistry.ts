/**
 * Registry of all 64 Bangladesh districts, keyed by the exact Bengali
 * name plantation.html's own BD_UPAZILA data / profile form uses (see
 * districtPolygonLoader.ts for how this ties to the signed-in officer's
 * saved posting). Each entry is a dynamic import() so Vite code-splits
 * every district into its own chunk -- a device only downloads a
 * district's polygon file the first time it's actually requested,
 * never as part of the main app bundle.
 *
 * COVERAGE: upazila-name matching between this app's own district/upazila
 * naming (plantation.html's BD_UPAZILA) and the source boundary dataset
 * is complete and hand-verified for কুড়িগ্রাম (9/9). Nationwide, automated
 * matching resolved ~61% of upazilas (290/473) -- the rest have known
 * transliteration variants between the two data sources that would need
 * manual review to close. An upazila without a matched polygon is simply
 * not geofence-checked (never a false flag) until that's done.
 */

import type { UpazilaGeometry } from './districtPolygonTypes';

export type DistrictLoader = () => Promise<Record<string, UpazilaGeometry>>;

export const DISTRICT_LOADERS: Record<string, DistrictLoader> = {
  'কক্সবাজার': () => import('./districts/cox-s-bazar').then((m) => m.default), // 0 upazilas
  'কিশোরগঞ্জ': () => import('./districts/kishoreganj').then((m) => m.default), // 9 upazilas
  'কুড়িগ্রাম': () => import('./districts/kurigram').then((m) => m.default), // 9 upazilas
  'কুমিল্লা': () => import('./districts/cumilla').then((m) => m.default), // 9 upazilas
  'কুষ্টিয়া': () => import('./districts/kushtia').then((m) => m.default), // 5 upazilas
  'খাগড়াছড়ি': () => import('./districts/khagrachari').then((m) => m.default), // 5 upazilas
  'খুলনা': () => import('./districts/khulna').then((m) => m.default), // 4 upazilas
  'গাইবান্ধা': () => import('./districts/gaibandha').then((m) => m.default), // 5 upazilas
  'গাজীপুর': () => import('./districts/gazipur').then((m) => m.default), // 3 upazilas
  'গোপালগঞ্জ': () => import('./districts/gopalganj').then((m) => m.default), // 5 upazilas
  'চট্টগ্রাম': () => import('./districts/chattogram').then((m) => m.default), // 9 upazilas
  'চাঁদপুর': () => import('./districts/chandpur').then((m) => m.default), // 6 upazilas
  'চাঁপাইনবাবগঞ্জ': () => import('./districts/nawabganj').then((m) => m.default), // 0 upazilas
  'চুয়াডাঙ্গা': () => import('./districts/chuadanga').then((m) => m.default), // 3 upazilas
  'জয়ুপুরহাট': () => import('./districts/joypurhat').then((m) => m.default), // 0 upazilas
  'জামালপুর': () => import('./districts/jamalpur').then((m) => m.default), // 4 upazilas
  'ঝালকাঠি': () => import('./districts/jhalokati').then((m) => m.default), // 2 upazilas
  'ঝিনাইদহ': () => import('./districts/jhenaidah').then((m) => m.default), // 5 upazilas
  'টাঙ্গাইল': () => import('./districts/tangail').then((m) => m.default), // 8 upazilas
  'ঠাকুরগাঁও': () => import('./districts/thakurgaon').then((m) => m.default), // 3 upazilas
  'ঢাকা': () => import('./districts/dhaka').then((m) => m.default), // 5 upazilas
  'দিনাজপুর': () => import('./districts/dinajpur').then((m) => m.default), // 8 upazilas
  'নওগাঁ': () => import('./districts/naogaon').then((m) => m.default), // 8 upazilas
  'নড়াইল': () => import('./districts/narail').then((m) => m.default), // 2 upazilas
  'নরসিংদী': () => import('./districts/narsingdi').then((m) => m.default), // 4 upazilas
  'নাটোর': () => import('./districts/natore').then((m) => m.default), // 4 upazilas
  'নারায়ণগঞ্জ': () => import('./districts/narayanganj').then((m) => m.default), // 0 upazilas
  'নীলফামারী': () => import('./districts/nilphamari').then((m) => m.default), // 6 upazilas
  'নেত্রকোণা': () => import('./districts/netrokona').then((m) => m.default), // 6 upazilas
  'নোয়াখালী': () => import('./districts/noakhali').then((m) => m.default), // 3 upazilas
  'পঞ্চগড়': () => import('./districts/panchagarh').then((m) => m.default), // 4 upazilas
  'পটুয়াখালী': () => import('./districts/patuakhali').then((m) => m.default), // 5 upazilas
  'পাবনা': () => import('./districts/pabna').then((m) => m.default), // 6 upazilas
  'পিরোজপুর': () => import('./districts/pirojpur').then((m) => m.default), // 2 upazilas
  'ফরিদপুর': () => import('./districts/faridpur').then((m) => m.default), // 7 upazilas
  'ফেনী': () => import('./districts/feni').then((m) => m.default), // 3 upazilas
  'বগুড়া': () => import('./districts/bogura').then((m) => m.default), // 8 upazilas
  'বরগুনা': () => import('./districts/barguna').then((m) => m.default), // 5 upazilas
  'বরিশাল': () => import('./districts/barishal').then((m) => m.default), // 5 upazilas
  'বাগেরহাট': () => import('./districts/bagerhat').then((m) => m.default), // 5 upazilas
  'বান্দরবান': () => import('./districts/bandarban').then((m) => m.default), // 3 upazilas
  'ব্রাহ্মণবাড়িয়া': () => import('./districts/brahmanbaria').then((m) => m.default), // 8 upazilas
  'ভোলা': () => import('./districts/bhola').then((m) => m.default), // 5 upazilas
  'ময়মনসিংহ': () => import('./districts/mymensingh').then((m) => m.default), // 9 upazilas
  'মাগুরা': () => import('./districts/magura').then((m) => m.default), // 2 upazilas
  'মাদারীপুর': () => import('./districts/madaripur').then((m) => m.default), // 3 upazilas
  'মানিকগঞ্জ': () => import('./districts/manikganj').then((m) => m.default), // 4 upazilas
  'মুন্সীগঞ্জ': () => import('./districts/munshiganj').then((m) => m.default), // 0 upazilas
  'মেহেরপুর': () => import('./districts/meherpur').then((m) => m.default), // 3 upazilas
  'মৌলভীবাজার': () => import('./districts/maulvibazar').then((m) => m.default), // 4 upazilas
  'যশোর': () => import('./districts/jashore').then((m) => m.default), // 4 upazilas
  'রংপুর': () => import('./districts/rangpur').then((m) => m.default), // 7 upazilas
  'রাঙ্গামাটি': () => import('./districts/rangamati').then((m) => m.default), // 3 upazilas
  'রাজবাড়ী': () => import('./districts/rajbari').then((m) => m.default), // 0 upazilas
  'রাজশাহী': () => import('./districts/rajshahi').then((m) => m.default), // 6 upazilas
  'লক্ষীপুর': () => import('./districts/lakshmipur').then((m) => m.default), // 0 upazilas
  'লালমনিরহাট': () => import('./districts/lalmonirhat').then((m) => m.default), // 4 upazilas
  'শরীয়তপুর': () => import('./districts/shariatpur').then((m) => m.default), // 3 upazilas
  'শেরপুর': () => import('./districts/sherpur').then((m) => m.default), // 3 upazilas
  'সাতক্ষীরা': () => import('./districts/satkhira').then((m) => m.default), // 4 upazilas
  'সিরাজগঞ্জ': () => import('./districts/sirajgonj').then((m) => m.default), // 6 upazilas
  'সিলেট': () => import('./districts/sylhet').then((m) => m.default), // 7 upazilas
  'সুনামগঞ্জ': () => import('./districts/sunamganj').then((m) => m.default), // 5 upazilas
  'হবিগঞ্জ': () => import('./districts/habiganj').then((m) => m.default), // 7 upazilas
};

export const ALL_DISTRICT_NAMES: string[] = Object.keys(DISTRICT_LOADERS);

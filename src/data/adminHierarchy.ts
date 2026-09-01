/**
 * Complete administrative hierarchy of Bangladesh.
 * Auto-generated from district.csv, upozila.csv, union.csv + division mapping.
 *
 * Structure: Division → District → Upazila → Union
 * Counts:  8 divisions, 64 districts, 496 upazilas, 4564 unions.
 *
 * This file's shape mirrors a normal relational schema (Division,
 * District, Upazila, Union) so it could seed a real database later,
 * though no ORM or DB is wired up today -- it's the sole data source.
 */

// ─── Public Types ───────────────────────────────────────

export interface Division {
  id: number;
  code: string;
  nameBn: string;
  nameEn: string;
}

export interface District {
  id: number;
  divisionId: number;
  code: string;
  nameBn: string;
  nameEn: string;
  lat?: number;
  lng?: number;
}

export interface Upazila {
  id: number;
  districtId: number;
  code: string;
  nameBn: string;
  nameEn: string;
  lat?: number;
  lng?: number;
}

export interface Union {
  id: number;
  upazilaId: number;
  nameBn: string;
  nameEn: string;
}

export interface AdminHierarchy {
  divisions: Division[];
  districts: District[];
  upazilas: Upazila[];
  unions: Union[];
}

// ─── Static Data ────────────────────────────────────────

export const DIVISIONS: Division[] = [
  {
    "id": 1,
    "code": "BD-30",
    "nameBn": "বরিশাল বিভাগ",
    "nameEn": "Barishal Division"
  },
  {
    "id": 2,
    "code": "BD-20",
    "nameBn": "চট্টগ্রাম বিভাগ",
    "nameEn": "Chattogram Division"
  },
  {
    "id": 3,
    "code": "BD-10",
    "nameBn": "ঢাকা বিভাগ",
    "nameEn": "Dhaka Division"
  },
  {
    "id": 4,
    "code": "BD-50",
    "nameBn": "খুলনা বিভাগ",
    "nameEn": "Khulna Division"
  },
  {
    "id": 5,
    "code": "BD-45",
    "nameBn": "ময়মনসিংহ বিভাগ",
    "nameEn": "Mymensingh Division"
  },
  {
    "id": 6,
    "code": "BD-55",
    "nameBn": "রাজশাহী বিভাগ",
    "nameEn": "Rajshahi Division"
  },
  {
    "id": 7,
    "code": "BD-40",
    "nameBn": "রংপুর বিভাগ",
    "nameEn": "Rangpur Division"
  },
  {
    "id": 8,
    "code": "BD-60",
    "nameBn": "সিলেট বিভাগ",
    "nameEn": "Sylhet Division"
  }
] as const;

export const DISTRICTS: District[] = [
  {
    "id": 1,
    "divisionId": 4,
    "code": "BD-01",
    "nameBn": "কুষ্টিয়া",
    "nameEn": "Kushtia"
  },
  {
    "id": 2,
    "divisionId": 4,
    "code": "BD-02",
    "nameBn": "খুলনা",
    "nameEn": "Khulna"
  },
  {
    "id": 3,
    "divisionId": 4,
    "code": "BD-03",
    "nameBn": "চুয়াডাঙ্গা",
    "nameEn": "Chuadanga"
  },
  {
    "id": 4,
    "divisionId": 4,
    "code": "BD-04",
    "nameBn": "ঝিনাইদহ",
    "nameEn": "Jhenaidah"
  },
  {
    "id": 5,
    "divisionId": 4,
    "code": "BD-05",
    "nameBn": "নড়াইল",
    "nameEn": "Narail"
  },
  {
    "id": 6,
    "divisionId": 4,
    "code": "BD-06",
    "nameBn": "বাগেরহাট",
    "nameEn": "Bagerhat"
  },
  {
    "id": 7,
    "divisionId": 4,
    "code": "BD-07",
    "nameBn": "মাগুরা",
    "nameEn": "Magura"
  },
  {
    "id": 8,
    "divisionId": 4,
    "code": "BD-08",
    "nameBn": "মেহেরপুর",
    "nameEn": "Meherpur"
  },
  {
    "id": 9,
    "divisionId": 4,
    "code": "BD-09",
    "nameBn": "যশোর",
    "nameEn": "Jashore"
  },
  {
    "id": 10,
    "divisionId": 4,
    "code": "BD-10",
    "nameBn": "সাতক্ষীরা",
    "nameEn": "Satkhira"
  },
  {
    "id": 11,
    "divisionId": 2,
    "code": "BD-11",
    "nameBn": "চট্টগ্রাম",
    "nameEn": "Chattogram"
  },
  {
    "id": 12,
    "divisionId": 2,
    "code": "BD-12",
    "nameBn": "কক্সবাজার",
    "nameEn": "Cox's Bazar"
  },
  {
    "id": 13,
    "divisionId": 2,
    "code": "BD-13",
    "nameBn": "ব্রাহ্মণবাড়িয়া",
    "nameEn": "Brahmanbaria"
  },
  {
    "id": 14,
    "divisionId": 2,
    "code": "BD-14",
    "nameBn": "বান্দরবান",
    "nameEn": "Bandarban"
  },
  {
    "id": 15,
    "divisionId": 2,
    "code": "BD-15",
    "nameBn": "খাগড়াছড়ি",
    "nameEn": "Khagrachari"
  },
  {
    "id": 16,
    "divisionId": 2,
    "code": "BD-16",
    "nameBn": "রাঙ্গামাটি",
    "nameEn": "Rangamati"
  },
  {
    "id": 17,
    "divisionId": 2,
    "code": "BD-17",
    "nameBn": "নোয়াখালী",
    "nameEn": "Noakhali"
  },
  {
    "id": 18,
    "divisionId": 2,
    "code": "BD-18",
    "nameBn": "লক্ষ্মীপুর",
    "nameEn": "Lakshmipur"
  },
  {
    "id": 19,
    "divisionId": 2,
    "code": "BD-19",
    "nameBn": "ফেনী",
    "nameEn": "Feni"
  },
  {
    "id": 20,
    "divisionId": 2,
    "code": "BD-20",
    "nameBn": "কুমিল্লা",
    "nameEn": "Cumilla"
  },
  {
    "id": 21,
    "divisionId": 2,
    "code": "BD-21",
    "nameBn": "চাঁদপুর",
    "nameEn": "Chandpur"
  },
  {
    "id": 22,
    "divisionId": 3,
    "code": "BD-22",
    "nameBn": "কিশোরগঞ্জ",
    "nameEn": "Kishoreganj"
  },
  {
    "id": 23,
    "divisionId": 3,
    "code": "BD-23",
    "nameBn": "গাজীপুর",
    "nameEn": "Gazipur"
  },
  {
    "id": 24,
    "divisionId": 3,
    "code": "BD-24",
    "nameBn": "গোপালগঞ্জ",
    "nameEn": "Gopalganj"
  },
  {
    "id": 25,
    "divisionId": 3,
    "code": "BD-25",
    "nameBn": "টাঙ্গাইল",
    "nameEn": "Tangail"
  },
  {
    "id": 26,
    "divisionId": 3,
    "code": "BD-26",
    "nameBn": "ঢাকা",
    "nameEn": "Dhaka"
  },
  {
    "id": 27,
    "divisionId": 3,
    "code": "BD-27",
    "nameBn": "নরসিংদী",
    "nameEn": "Narsingdi"
  },
  {
    "id": 28,
    "divisionId": 3,
    "code": "BD-28",
    "nameBn": "নারায়ণগঞ্জ",
    "nameEn": "Narayanganj"
  },
  {
    "id": 29,
    "divisionId": 3,
    "code": "BD-29",
    "nameBn": "ফরিদপুর",
    "nameEn": "Faridpur"
  },
  {
    "id": 30,
    "divisionId": 3,
    "code": "BD-30",
    "nameBn": "মাদারীপুর",
    "nameEn": "Madaripur"
  },
  {
    "id": 31,
    "divisionId": 3,
    "code": "BD-31",
    "nameBn": "মানিকগঞ্জ",
    "nameEn": "Manikganj"
  },
  {
    "id": 32,
    "divisionId": 3,
    "code": "BD-32",
    "nameBn": "মুন্সীগঞ্জ",
    "nameEn": "Munshiganj"
  },
  {
    "id": 33,
    "divisionId": 3,
    "code": "BD-33",
    "nameBn": "রাজবাড়ী",
    "nameEn": "Rajbari"
  },
  {
    "id": 34,
    "divisionId": 3,
    "code": "BD-34",
    "nameBn": "শরীয়তপুর",
    "nameEn": "Shariatpur"
  },
  {
    "id": 35,
    "divisionId": 1,
    "code": "BD-35",
    "nameBn": "বরিশাল",
    "nameEn": "Barishal"
  },
  {
    "id": 36,
    "divisionId": 1,
    "code": "BD-36",
    "nameBn": "ভোলা",
    "nameEn": "Bhola"
  },
  {
    "id": 37,
    "divisionId": 1,
    "code": "BD-37",
    "nameBn": "ঝালকাঠি",
    "nameEn": "Jhalokati"
  },
  {
    "id": 38,
    "divisionId": 1,
    "code": "BD-38",
    "nameBn": "পটুয়াখালী",
    "nameEn": "Patuakhali"
  },
  {
    "id": 39,
    "divisionId": 1,
    "code": "BD-39",
    "nameBn": "পিরোজপুর",
    "nameEn": "Pirojpur"
  },
  {
    "id": 40,
    "divisionId": 1,
    "code": "BD-40",
    "nameBn": "বরগুনা",
    "nameEn": "Barguna"
  },
  {
    "id": 41,
    "divisionId": 5,
    "code": "BD-41",
    "nameBn": "ময়মনসিংহ",
    "nameEn": "Mymensingh"
  },
  {
    "id": 42,
    "divisionId": 5,
    "code": "BD-42",
    "nameBn": "জামালপুর",
    "nameEn": "Jamalpur"
  },
  {
    "id": 43,
    "divisionId": 5,
    "code": "BD-43",
    "nameBn": "নেত্রকোণা",
    "nameEn": "Netrokona"
  },
  {
    "id": 44,
    "divisionId": 5,
    "code": "BD-44",
    "nameBn": "শেরপুর",
    "nameEn": "Sherpur"
  },
  {
    "id": 45,
    "divisionId": 7,
    "code": "BD-45",
    "nameBn": "কুড়িগ্রাম",
    "nameEn": "Kurigram"
  },
  {
    "id": 46,
    "divisionId": 7,
    "code": "BD-46",
    "nameBn": "গাইবান্ধা",
    "nameEn": "Gaibandha"
  },
  {
    "id": 47,
    "divisionId": 7,
    "code": "BD-47",
    "nameBn": "ঠাকুরগাঁও",
    "nameEn": "Thakurgaon"
  },
  {
    "id": 48,
    "divisionId": 7,
    "code": "BD-48",
    "nameBn": "দিনাজপুর",
    "nameEn": "Dinajpur"
  },
  {
    "id": 49,
    "divisionId": 7,
    "code": "BD-49",
    "nameBn": "নীলফামারী",
    "nameEn": "Nilphamari"
  },
  {
    "id": 50,
    "divisionId": 7,
    "code": "BD-50",
    "nameBn": "পঞ্চগড়",
    "nameEn": "Panchagarh"
  },
  {
    "id": 51,
    "divisionId": 7,
    "code": "BD-51",
    "nameBn": "রংপুর",
    "nameEn": "Rangpur"
  },
  {
    "id": 52,
    "divisionId": 7,
    "code": "BD-52",
    "nameBn": "লালমনিরহাট",
    "nameEn": "Lalmonirhat"
  },
  {
    "id": 53,
    "divisionId": 6,
    "code": "BD-53",
    "nameBn": "চাঁপাইনবাবগঞ্জ",
    "nameEn": "Chapainawabganj"
  },
  {
    "id": 54,
    "divisionId": 6,
    "code": "BD-54",
    "nameBn": "জয়পুরহাট",
    "nameEn": "Joypurhat"
  },
  {
    "id": 55,
    "divisionId": 6,
    "code": "BD-55",
    "nameBn": "নওগাঁ",
    "nameEn": "Naogaon"
  },
  {
    "id": 56,
    "divisionId": 6,
    "code": "BD-56",
    "nameBn": "নাটোর",
    "nameEn": "Natore"
  },
  {
    "id": 57,
    "divisionId": 6,
    "code": "BD-57",
    "nameBn": "পাবনা",
    "nameEn": "Pabna"
  },
  {
    "id": 58,
    "divisionId": 6,
    "code": "BD-58",
    "nameBn": "বগুড়া",
    "nameEn": "Bogura"
  },
  {
    "id": 59,
    "divisionId": 6,
    "code": "BD-59",
    "nameBn": "রাজশাহী",
    "nameEn": "Rajshahi"
  },
  {
    "id": 60,
    "divisionId": 6,
    "code": "BD-60",
    "nameBn": "সিরাজগঞ্জ",
    "nameEn": "Sirajganj"
  },
  {
    "id": 61,
    "divisionId": 8,
    "code": "BD-61",
    "nameBn": "মৌলভীবাজার",
    "nameEn": "Maulvibazar"
  },
  {
    "id": 62,
    "divisionId": 8,
    "code": "BD-62",
    "nameBn": "সিলেট",
    "nameEn": "Sylhet"
  },
  {
    "id": 63,
    "divisionId": 8,
    "code": "BD-63",
    "nameBn": "সুনামগঞ্জ",
    "nameEn": "Sunamganj"
  },
  {
    "id": 64,
    "divisionId": 8,
    "code": "BD-64",
    "nameBn": "হবিগঞ্জ",
    "nameEn": "Habiganj"
  }
] as const;

export const UPAZILAS: Upazila[] = [
  {
    "id": 1,
    "districtId": 1,
    "code": "BD-0101",
    "nameBn": "কুমারখালী",
    "nameEn": "KumarKhali"
  },
  {
    "id": 2,
    "districtId": 1,
    "code": "BD-0102",
    "nameBn": "কুষ্টিয়া সদর",
    "nameEn": "Kushtia Sadar"
  },
  {
    "id": 3,
    "districtId": 1,
    "code": "BD-0103",
    "nameBn": "খোকসা",
    "nameEn": "Khoksa"
  },
  {
    "id": 4,
    "districtId": 1,
    "code": "BD-0104",
    "nameBn": "দৌলতপুর",
    "nameEn": "Daulatpur"
  },
  {
    "id": 5,
    "districtId": 1,
    "code": "BD-0105",
    "nameBn": "ভেড়ামারা",
    "nameEn": "Bheramara"
  },
  {
    "id": 6,
    "districtId": 1,
    "code": "BD-0106",
    "nameBn": "মিরপুর",
    "nameEn": "Mirpur"
  },
  {
    "id": 7,
    "districtId": 2,
    "code": "BD-0207",
    "nameBn": "কয়রা",
    "nameEn": "Koyra"
  },
  {
    "id": 8,
    "districtId": 2,
    "code": "BD-0208",
    "nameBn": "ডুমুরিয়া",
    "nameEn": "Dumuria"
  },
  {
    "id": 9,
    "districtId": 2,
    "code": "BD-0209",
    "nameBn": "তেরখাদা",
    "nameEn": "Terokhada"
  },
  {
    "id": 10,
    "districtId": 2,
    "code": "BD-0210",
    "nameBn": "দাকোপ",
    "nameEn": "Dacope"
  },
  {
    "id": 11,
    "districtId": 2,
    "code": "BD-0211",
    "nameBn": "দিঘলিয়া",
    "nameEn": "Dighalia"
  },
  {
    "id": 12,
    "districtId": 2,
    "code": "BD-0212",
    "nameBn": "পাইকগাছা",
    "nameEn": "Paikgacha"
  },
  {
    "id": 13,
    "districtId": 2,
    "code": "BD-0213",
    "nameBn": "ফুলতলা",
    "nameEn": "Fultala"
  },
  {
    "id": 14,
    "districtId": 2,
    "code": "BD-0214",
    "nameBn": "বটিয়াঘাটা",
    "nameEn": "Batiaghata"
  },
  {
    "id": 15,
    "districtId": 2,
    "code": "BD-0215",
    "nameBn": "রূপসা",
    "nameEn": "Rupsa"
  },
  {
    "id": 16,
    "districtId": 3,
    "code": "BD-0316",
    "nameBn": "আলমডাঙ্গা",
    "nameEn": "Alamdanga"
  },
  {
    "id": 17,
    "districtId": 3,
    "code": "BD-0317",
    "nameBn": "চুয়াডাঙ্গা সদর",
    "nameEn": "Chuadanga Sadar"
  },
  {
    "id": 18,
    "districtId": 3,
    "code": "BD-0318",
    "nameBn": "জীবননগর",
    "nameEn": "Jibannagar"
  },
  {
    "id": 19,
    "districtId": 3,
    "code": "BD-0319",
    "nameBn": "দামুড়হুদা",
    "nameEn": "Damurhuda"
  },
  {
    "id": 20,
    "districtId": 4,
    "code": "BD-0420",
    "nameBn": "কালীগঞ্জ",
    "nameEn": "Kaliganj"
  },
  {
    "id": 21,
    "districtId": 4,
    "code": "BD-0421",
    "nameBn": "কোটচাঁদপুর",
    "nameEn": "Kotchandpur"
  },
  {
    "id": 22,
    "districtId": 4,
    "code": "BD-0422",
    "nameBn": "ঝিনাইদহ সদর",
    "nameEn": "Jhenaidah Sadar"
  },
  {
    "id": 23,
    "districtId": 4,
    "code": "BD-0423",
    "nameBn": "মহেশপুর",
    "nameEn": "Maheshpur"
  },
  {
    "id": 24,
    "districtId": 4,
    "code": "BD-0424",
    "nameBn": "শৈলকুপা",
    "nameEn": "Shailkupa"
  },
  {
    "id": 25,
    "districtId": 4,
    "code": "BD-0425",
    "nameBn": "হরিণাকুণ্ডু",
    "nameEn": "Harinakunda"
  },
  {
    "id": 26,
    "districtId": 5,
    "code": "BD-0526",
    "nameBn": "কালিয়া",
    "nameEn": "Kalia"
  },
  {
    "id": 27,
    "districtId": 5,
    "code": "BD-0527",
    "nameBn": "নড়াইল সদর",
    "nameEn": "Narail Sadar"
  },
  {
    "id": 28,
    "districtId": 5,
    "code": "BD-0528",
    "nameBn": "লোহাগড়া",
    "nameEn": "Lohagara"
  },
  {
    "id": 29,
    "districtId": 6,
    "code": "BD-0629",
    "nameBn": "কচুয়া",
    "nameEn": "Kachua"
  },
  {
    "id": 30,
    "districtId": 6,
    "code": "BD-0630",
    "nameBn": "চিতলমারী",
    "nameEn": "Chitalmari"
  },
  {
    "id": 31,
    "districtId": 6,
    "code": "BD-0631",
    "nameBn": "ফকিরহাট",
    "nameEn": "Fakirhat"
  },
  {
    "id": 32,
    "districtId": 6,
    "code": "BD-0632",
    "nameBn": "বাগেরহাট সদর",
    "nameEn": "Bagerhat Sadar"
  },
  {
    "id": 33,
    "districtId": 6,
    "code": "BD-0633",
    "nameBn": "মোংলা",
    "nameEn": "Mongla"
  },
  {
    "id": 34,
    "districtId": 6,
    "code": "BD-0634",
    "nameBn": "মোড়েলগঞ্জ",
    "nameEn": "Mollahat"
  },
  {
    "id": 35,
    "districtId": 6,
    "code": "BD-0635",
    "nameBn": "মোল্লাহাট",
    "nameEn": "Mollahat"
  },
  {
    "id": 36,
    "districtId": 6,
    "code": "BD-0636",
    "nameBn": "রামপাল",
    "nameEn": "Rampal"
  },
  {
    "id": 37,
    "districtId": 6,
    "code": "BD-0637",
    "nameBn": "শরণখোলা",
    "nameEn": "SaranKhola"
  },
  {
    "id": 38,
    "districtId": 7,
    "code": "BD-0738",
    "nameBn": "মাগুরা সদর",
    "nameEn": "Magura Sadar"
  },
  {
    "id": 39,
    "districtId": 7,
    "code": "BD-0739",
    "nameBn": "মহম্মদপুর",
    "nameEn": "Mohammadpur"
  },
  {
    "id": 40,
    "districtId": 7,
    "code": "BD-0740",
    "nameBn": "শালিখা",
    "nameEn": "Shalikha"
  },
  {
    "id": 41,
    "districtId": 7,
    "code": "BD-0741",
    "nameBn": "শ্রীপুর",
    "nameEn": "Sreepur"
  },
  {
    "id": 42,
    "districtId": 8,
    "code": "BD-0842",
    "nameBn": "গাংনী",
    "nameEn": "Gangni"
  },
  {
    "id": 43,
    "districtId": 8,
    "code": "BD-0843",
    "nameBn": "মেহেরপুর সদর",
    "nameEn": "Meherpur Sadar"
  },
  {
    "id": 44,
    "districtId": 8,
    "code": "BD-0844",
    "nameBn": "মুজিবনগর",
    "nameEn": "Mujibnagar"
  },
  {
    "id": 45,
    "districtId": 9,
    "code": "BD-0945",
    "nameBn": "অভয়নগর",
    "nameEn": "Abhaynagar"
  },
  {
    "id": 46,
    "districtId": 9,
    "code": "BD-0946",
    "nameBn": "কেশবপুর",
    "nameEn": "Keshabpur"
  },
  {
    "id": 47,
    "districtId": 9,
    "code": "BD-0947",
    "nameBn": "চৌগাছা",
    "nameEn": "Chaugachha"
  },
  {
    "id": 48,
    "districtId": 9,
    "code": "BD-0948",
    "nameBn": "ঝিকরগাছা",
    "nameEn": "Jhikargachha"
  },
  {
    "id": 49,
    "districtId": 9,
    "code": "BD-0949",
    "nameBn": "বাঘেরপাড়া",
    "nameEn": "Bagherpara"
  },
  {
    "id": 50,
    "districtId": 9,
    "code": "BD-0950",
    "nameBn": "মনিরামপুর",
    "nameEn": "Manirampur"
  },
  {
    "id": 51,
    "districtId": 9,
    "code": "BD-0951",
    "nameBn": "যশোর সদর",
    "nameEn": "Jashore Sadar"
  },
  {
    "id": 52,
    "districtId": 9,
    "code": "BD-0952",
    "nameBn": "শার্শা",
    "nameEn": "Sharsha"
  },
  {
    "id": 53,
    "districtId": 10,
    "code": "BD-1053",
    "nameBn": "সাতক্ষীরা সদর",
    "nameEn": "Satkhira Sadar"
  },
  {
    "id": 54,
    "districtId": 10,
    "code": "BD-1054",
    "nameBn": "আশাশুনি",
    "nameEn": "Ashashuni"
  },
  {
    "id": 55,
    "districtId": 10,
    "code": "BD-1055",
    "nameBn": "কলারোয়া",
    "nameEn": "Kalaroa"
  },
  {
    "id": 20,
    "districtId": 10,
    "code": "BD-1020",
    "nameBn": "কালীগঞ্জ",
    "nameEn": "Kaliganj"
  },
  {
    "id": 56,
    "districtId": 10,
    "code": "BD-1056",
    "nameBn": "তালা",
    "nameEn": "Tala"
  },
  {
    "id": 57,
    "districtId": 10,
    "code": "BD-1057",
    "nameBn": "দেবহাটা",
    "nameEn": "Debhata"
  },
  {
    "id": 58,
    "districtId": 10,
    "code": "BD-1058",
    "nameBn": "শ্যামনগর",
    "nameEn": "Shyamnagar"
  },
  {
    "id": 59,
    "districtId": 11,
    "code": "BD-1159",
    "nameBn": "আনোয়ারা",
    "nameEn": "Anwara"
  },
  {
    "id": 60,
    "districtId": 11,
    "code": "BD-1160",
    "nameBn": "কর্ণফুলী",
    "nameEn": "Karnaphuli"
  },
  {
    "id": 61,
    "districtId": 11,
    "code": "BD-1161",
    "nameBn": "চন্দনাইশ",
    "nameEn": "Chandanaish"
  },
  {
    "id": 62,
    "districtId": 11,
    "code": "BD-1162",
    "nameBn": "পটিয়া",
    "nameEn": "Patiya"
  },
  {
    "id": 63,
    "districtId": 11,
    "code": "BD-1163",
    "nameBn": "ফটিকছড়ি",
    "nameEn": "Fatikchhari"
  },
  {
    "id": 64,
    "districtId": 11,
    "code": "BD-1164",
    "nameBn": "বাঁশখালী",
    "nameEn": "Banshkhali"
  },
  {
    "id": 65,
    "districtId": 11,
    "code": "BD-1165",
    "nameBn": "বোয়ালখালী",
    "nameEn": "Boalkhali"
  },
  {
    "id": 66,
    "districtId": 11,
    "code": "BD-1166",
    "nameBn": "মীরসরাই",
    "nameEn": "Mirsharai"
  },
  {
    "id": 67,
    "districtId": 11,
    "code": "BD-1167",
    "nameBn": "রাউজান",
    "nameEn": "Raozan"
  },
  {
    "id": 68,
    "districtId": 11,
    "code": "BD-1168",
    "nameBn": "রাঙ্গুনিয়া",
    "nameEn": "Rangunia"
  },
  {
    "id": 69,
    "districtId": 11,
    "code": "BD-1169",
    "nameBn": "লোহাগাড়া",
    "nameEn": "Lohagara"
  },
  {
    "id": 70,
    "districtId": 11,
    "code": "BD-1170",
    "nameBn": "সন্দ্বীপ",
    "nameEn": "Sandwip"
  },
  {
    "id": 71,
    "districtId": 11,
    "code": "BD-1171",
    "nameBn": "সাতকানিয়া",
    "nameEn": "Satkania"
  },
  {
    "id": 72,
    "districtId": 11,
    "code": "BD-1172",
    "nameBn": "সীতাকুণ্ড",
    "nameEn": "Sitakunda"
  },
  {
    "id": 73,
    "districtId": 11,
    "code": "BD-1173",
    "nameBn": "হাটহাজারী",
    "nameEn": "Hathazari"
  },
  {
    "id": 74,
    "districtId": 12,
    "code": "BD-1274",
    "nameBn": "উখিয়া",
    "nameEn": "Ukhia"
  },
  {
    "id": 75,
    "districtId": 12,
    "code": "BD-1275",
    "nameBn": "কক্সবাজার সদর",
    "nameEn": "Cox's Bazar Sadar"
  },
  {
    "id": 76,
    "districtId": 12,
    "code": "BD-1276",
    "nameBn": "কুতুবদিয়া",
    "nameEn": "Kutubdia"
  },
  {
    "id": 77,
    "districtId": 12,
    "code": "BD-1277",
    "nameBn": "চকরিয়া",
    "nameEn": "Chakaria"
  },
  {
    "id": 78,
    "districtId": 12,
    "code": "BD-1278",
    "nameBn": "টেকনাফ",
    "nameEn": "Teknaf"
  },
  {
    "id": 79,
    "districtId": 12,
    "code": "BD-1279",
    "nameBn": "পেকুয়া",
    "nameEn": "Pekua"
  },
  {
    "id": 80,
    "districtId": 12,
    "code": "BD-1280",
    "nameBn": "মহেশখালী",
    "nameEn": "Maheshkhali"
  },
  {
    "id": 81,
    "districtId": 12,
    "code": "BD-1281",
    "nameBn": "রামু",
    "nameEn": "Ramu"
  },
  {
    "id": 82,
    "districtId": 12,
    "code": "BD-1282",
    "nameBn": "ঈদগাঁও",
    "nameEn": "Eidgaon"
  },
  {
    "id": 83,
    "districtId": 13,
    "code": "BD-1383",
    "nameBn": "আশুগঞ্জ",
    "nameEn": "Ashuganj"
  },
  {
    "id": 84,
    "districtId": 13,
    "code": "BD-1384",
    "nameBn": "আখাউড়া",
    "nameEn": "Akhaura"
  },
  {
    "id": 85,
    "districtId": 13,
    "code": "BD-1385",
    "nameBn": "কসবা",
    "nameEn": "Kasba"
  },
  {
    "id": 86,
    "districtId": 13,
    "code": "BD-1386",
    "nameBn": "নবীনগর",
    "nameEn": "Nabinagar"
  },
  {
    "id": 87,
    "districtId": 13,
    "code": "BD-1387",
    "nameBn": "নাসিরনগর",
    "nameEn": "Nasirnagar"
  },
  {
    "id": 88,
    "districtId": 13,
    "code": "BD-1388",
    "nameBn": "বাঞ্ছারামপুর",
    "nameEn": "Bancharampur"
  },
  {
    "id": 89,
    "districtId": 13,
    "code": "BD-1389",
    "nameBn": "ব্রাহ্মণবাড়িয়া সদর",
    "nameEn": "Brahmanbaria Sadar"
  },
  {
    "id": 90,
    "districtId": 13,
    "code": "BD-1390",
    "nameBn": "সরাইল",
    "nameEn": "Sarail"
  },
  {
    "id": 91,
    "districtId": 13,
    "code": "BD-1391",
    "nameBn": "বিজয়নগর",
    "nameEn": "Bijoynagar"
  },
  {
    "id": 92,
    "districtId": 14,
    "code": "BD-1492",
    "nameBn": "আলীকদম",
    "nameEn": "Alikadam"
  },
  {
    "id": 93,
    "districtId": 14,
    "code": "BD-1493",
    "nameBn": "থানচি",
    "nameEn": "Thanchi"
  },
  {
    "id": 94,
    "districtId": 14,
    "code": "BD-1494",
    "nameBn": "নাইক্ষ্যংছড়ি",
    "nameEn": "Naikhongchhari"
  },
  {
    "id": 95,
    "districtId": 14,
    "code": "BD-1495",
    "nameBn": "বান্দরবান সদর",
    "nameEn": "Bandarban Sadar"
  },
  {
    "id": 96,
    "districtId": 14,
    "code": "BD-1496",
    "nameBn": "রুমা",
    "nameEn": "Ruma"
  },
  {
    "id": 97,
    "districtId": 14,
    "code": "BD-1497",
    "nameBn": "রোয়াংছড়ি",
    "nameEn": "Rowangchhari"
  },
  {
    "id": 98,
    "districtId": 14,
    "code": "BD-1498",
    "nameBn": "লামা",
    "nameEn": "Lama"
  },
  {
    "id": 99,
    "districtId": 15,
    "code": "BD-1599",
    "nameBn": "খাগড়াছড়ি সদর",
    "nameEn": "Khagrachhari Sadar"
  },
  {
    "id": 100,
    "districtId": 15,
    "code": "BD-1500",
    "nameBn": "গুইমারা",
    "nameEn": "Guimara"
  },
  {
    "id": 101,
    "districtId": 15,
    "code": "BD-1501",
    "nameBn": "দীঘিনালা",
    "nameEn": "Dighinala"
  },
  {
    "id": 102,
    "districtId": 15,
    "code": "BD-1502",
    "nameBn": "পানছড়ি",
    "nameEn": "Panchhari"
  },
  {
    "id": 103,
    "districtId": 15,
    "code": "BD-1503",
    "nameBn": "মহালছড়ি",
    "nameEn": "Mahalchhari"
  },
  {
    "id": 104,
    "districtId": 15,
    "code": "BD-1504",
    "nameBn": "মাটিরাঙ্গা",
    "nameEn": "Matiranga"
  },
  {
    "id": 105,
    "districtId": 15,
    "code": "BD-1505",
    "nameBn": "মানিকছড়ি",
    "nameEn": "Manikchhari"
  },
  {
    "id": 106,
    "districtId": 15,
    "code": "BD-1506",
    "nameBn": "রামগড়",
    "nameEn": "Ramgarh"
  },
  {
    "id": 107,
    "districtId": 15,
    "code": "BD-1507",
    "nameBn": "লক্ষ্মীছড়ি",
    "nameEn": "Lakshmichhari"
  },
  {
    "id": 108,
    "districtId": 16,
    "code": "BD-1608",
    "nameBn": "কাউখালী",
    "nameEn": "Kawkhali"
  },
  {
    "id": 109,
    "districtId": 16,
    "code": "BD-1609",
    "nameBn": "কাপ্তাই",
    "nameEn": "Kaptai"
  },
  {
    "id": 110,
    "districtId": 16,
    "code": "BD-1610",
    "nameBn": "জুরাছড়ি",
    "nameEn": "Jurachhari"
  },
  {
    "id": 111,
    "districtId": 16,
    "code": "BD-1611",
    "nameBn": "নানিয়ারচর",
    "nameEn": "Naniarchar"
  },
  {
    "id": 112,
    "districtId": 16,
    "code": "BD-1612",
    "nameBn": "বরকল",
    "nameEn": "Barkal"
  },
  {
    "id": 113,
    "districtId": 16,
    "code": "BD-1613",
    "nameBn": "বাঘাইছড়ি",
    "nameEn": "Baghaichhari"
  },
  {
    "id": 114,
    "districtId": 16,
    "code": "BD-1614",
    "nameBn": "বিলাইছড়ি",
    "nameEn": "Bilaichhari"
  },
  {
    "id": 115,
    "districtId": 16,
    "code": "BD-1615",
    "nameBn": "রাঙ্গামাটি সদর",
    "nameEn": "Rangamati Sadar"
  },
  {
    "id": 116,
    "districtId": 16,
    "code": "BD-1616",
    "nameBn": "রাজস্থলী",
    "nameEn": "Rajasthali"
  },
  {
    "id": 117,
    "districtId": 16,
    "code": "BD-1617",
    "nameBn": "লংগদু",
    "nameEn": "Langadu"
  },
  {
    "id": 118,
    "districtId": 17,
    "code": "BD-1718",
    "nameBn": "কবিরহাট",
    "nameEn": "Kabirhat"
  },
  {
    "id": 119,
    "districtId": 17,
    "code": "BD-1719",
    "nameBn": "কোম্পানীগঞ্জ",
    "nameEn": "Companiganj"
  },
  {
    "id": 120,
    "districtId": 17,
    "code": "BD-1720",
    "nameBn": "চাটখিল",
    "nameEn": "Chatkhil"
  },
  {
    "id": 121,
    "districtId": 17,
    "code": "BD-1721",
    "nameBn": "নোয়াখালী সদর",
    "nameEn": "Noakhali Sadar"
  },
  {
    "id": 122,
    "districtId": 17,
    "code": "BD-1722",
    "nameBn": "বেগমগঞ্জ",
    "nameEn": "Begumganj"
  },
  {
    "id": 123,
    "districtId": 17,
    "code": "BD-1723",
    "nameBn": "সুবর্ণচর",
    "nameEn": "Subarnachar"
  },
  {
    "id": 124,
    "districtId": 17,
    "code": "BD-1724",
    "nameBn": "সেনবাগ",
    "nameEn": "Senbagh"
  },
  {
    "id": 125,
    "districtId": 17,
    "code": "BD-1725",
    "nameBn": "সোনাইমুড়ি",
    "nameEn": "Sonaimuri"
  },
  {
    "id": 126,
    "districtId": 17,
    "code": "BD-1726",
    "nameBn": "হাতিয়া",
    "nameEn": "Hatiya"
  },
  {
    "id": 127,
    "districtId": 18,
    "code": "BD-1827",
    "nameBn": "কমলনগর",
    "nameEn": "Kamalnagar"
  },
  {
    "id": 128,
    "districtId": 18,
    "code": "BD-1828",
    "nameBn": "রামগঞ্জ",
    "nameEn": "Ramganj"
  },
  {
    "id": 129,
    "districtId": 18,
    "code": "BD-1829",
    "nameBn": "রামগতি",
    "nameEn": "Ramgati"
  },
  {
    "id": 130,
    "districtId": 18,
    "code": "BD-1830",
    "nameBn": "রায়পুর",
    "nameEn": "Raipur"
  },
  {
    "id": 131,
    "districtId": 18,
    "code": "BD-1831",
    "nameBn": "লক্ষ্মীপুর সদর",
    "nameEn": "Lakshmipur Sadar"
  },
  {
    "id": 132,
    "districtId": 19,
    "code": "BD-1932",
    "nameBn": "ফেনী সদর",
    "nameEn": "Feni Sadar"
  },
  {
    "id": 133,
    "districtId": 19,
    "code": "BD-1933",
    "nameBn": "দাগনভূঞা",
    "nameEn": "Daganbhuiyan"
  },
  {
    "id": 134,
    "districtId": 19,
    "code": "BD-1934",
    "nameBn": "সোনাগাজী",
    "nameEn": "Sonagazi"
  },
  {
    "id": 135,
    "districtId": 19,
    "code": "BD-1935",
    "nameBn": "ছাগলনাইয়া",
    "nameEn": "Chhagalnaiya"
  },
  {
    "id": 136,
    "districtId": 19,
    "code": "BD-1936",
    "nameBn": "পরশুরাম",
    "nameEn": "Parshuram"
  },
  {
    "id": 137,
    "districtId": 19,
    "code": "BD-1937",
    "nameBn": "ফুলগাজী",
    "nameEn": "Fulgazi"
  },
  {
    "id": 138,
    "districtId": 20,
    "code": "BD-2038",
    "nameBn": "বরুড়া",
    "nameEn": "Barura"
  },
  {
    "id": 139,
    "districtId": 20,
    "code": "BD-2039",
    "nameBn": "চান্দিনা",
    "nameEn": "Chandina"
  },
  {
    "id": 140,
    "districtId": 20,
    "code": "BD-2040",
    "nameBn": "দাউদকান্দি",
    "nameEn": "Daudkandi"
  },
  {
    "id": 141,
    "districtId": 20,
    "code": "BD-2041",
    "nameBn": "লাকসাম",
    "nameEn": "Laksam"
  },
  {
    "id": 142,
    "districtId": 20,
    "code": "BD-2042",
    "nameBn": "ব্রাহ্মণপাড়া",
    "nameEn": "Brahmanpara"
  },
  {
    "id": 143,
    "districtId": 20,
    "code": "BD-2043",
    "nameBn": "বুড়িচং",
    "nameEn": "Burichang"
  },
  {
    "id": 144,
    "districtId": 20,
    "code": "BD-2044",
    "nameBn": "চৌদ্দগ্রাম",
    "nameEn": "Chouddagram"
  },
  {
    "id": 145,
    "districtId": 20,
    "code": "BD-2045",
    "nameBn": "দেবিদ্বার",
    "nameEn": "Debidwar"
  },
  {
    "id": 146,
    "districtId": 20,
    "code": "BD-2046",
    "nameBn": "হোমনা",
    "nameEn": "Homna"
  },
  {
    "id": 147,
    "districtId": 20,
    "code": "BD-2047",
    "nameBn": "মুরাদনগর",
    "nameEn": "Muradnagar"
  },
  {
    "id": 148,
    "districtId": 20,
    "code": "BD-2048",
    "nameBn": "নাঙ্গলকোট",
    "nameEn": "Nangalkot"
  },
  {
    "id": 149,
    "districtId": 20,
    "code": "BD-2049",
    "nameBn": "মেঘনা",
    "nameEn": "Meghna"
  },
  {
    "id": 150,
    "districtId": 20,
    "code": "BD-2050",
    "nameBn": "তিতাস",
    "nameEn": "Titas"
  },
  {
    "id": 151,
    "districtId": 20,
    "code": "BD-2051",
    "nameBn": "মনোহরগঞ্জ",
    "nameEn": "Monohorgonj"
  },
  {
    "id": 152,
    "districtId": 20,
    "code": "BD-2052",
    "nameBn": "কুমিল্লা আদর্শ সদর",
    "nameEn": "Cumilla Adarsha Sadar"
  },
  {
    "id": 153,
    "districtId": 20,
    "code": "BD-2053",
    "nameBn": "কুমিল্লা সদর দক্ষিণ",
    "nameEn": "Cumilla Sadar Dakshin"
  },
  {
    "id": 154,
    "districtId": 20,
    "code": "BD-2054",
    "nameBn": "লালমাই",
    "nameEn": "Lalmai"
  },
  {
    "id": 29,
    "districtId": 21,
    "code": "BD-2129",
    "nameBn": "কচুয়া",
    "nameEn": "Kachua"
  },
  {
    "id": 155,
    "districtId": 21,
    "code": "BD-2155",
    "nameBn": "চাঁদপুর সদর",
    "nameEn": "Chandpur Sadar"
  },
  {
    "id": 156,
    "districtId": 21,
    "code": "BD-2156",
    "nameBn": "ফরিদগঞ্জ",
    "nameEn": "Faridganj"
  },
  {
    "id": 157,
    "districtId": 21,
    "code": "BD-2157",
    "nameBn": "মতলব উত্তর",
    "nameEn": "Matlab Uttar"
  },
  {
    "id": 158,
    "districtId": 21,
    "code": "BD-2158",
    "nameBn": "মতলব দক্ষিণ",
    "nameEn": "Matlab Dakshin"
  },
  {
    "id": 159,
    "districtId": 21,
    "code": "BD-2159",
    "nameBn": "শাহরাস্তি",
    "nameEn": "Shahrasti"
  },
  {
    "id": 160,
    "districtId": 21,
    "code": "BD-2160",
    "nameBn": "হাইমচর",
    "nameEn": "Haimchar"
  },
  {
    "id": 161,
    "districtId": 21,
    "code": "BD-2161",
    "nameBn": "হাজীগঞ্জ",
    "nameEn": "Hajiganj"
  },
  {
    "id": 162,
    "districtId": 22,
    "code": "BD-2262",
    "nameBn": "কিশোরগঞ্জ সদর",
    "nameEn": "Kishoreganj Sadar"
  },
  {
    "id": 163,
    "districtId": 22,
    "code": "BD-2263",
    "nameBn": "অষ্টগ্রাম",
    "nameEn": "Austagram"
  },
  {
    "id": 164,
    "districtId": 22,
    "code": "BD-2264",
    "nameBn": "ইটনা",
    "nameEn": "Itna"
  },
  {
    "id": 165,
    "districtId": 22,
    "code": "BD-2265",
    "nameBn": "করিমগঞ্জ",
    "nameEn": "Karimganj"
  },
  {
    "id": 166,
    "districtId": 22,
    "code": "BD-2266",
    "nameBn": "কটিয়াদী",
    "nameEn": "Katiadi"
  },
  {
    "id": 167,
    "districtId": 22,
    "code": "BD-2267",
    "nameBn": "কুলিয়ারচর",
    "nameEn": "Kuliarchar"
  },
  {
    "id": 168,
    "districtId": 22,
    "code": "BD-2268",
    "nameBn": "তাড়াইল",
    "nameEn": "Tarail"
  },
  {
    "id": 169,
    "districtId": 22,
    "code": "BD-2269",
    "nameBn": "নিকলী",
    "nameEn": "Nikli"
  },
  {
    "id": 170,
    "districtId": 22,
    "code": "BD-2270",
    "nameBn": "পাকুন্দিয়া",
    "nameEn": "Pakundia"
  },
  {
    "id": 171,
    "districtId": 22,
    "code": "BD-2271",
    "nameBn": "বাজিতপুর",
    "nameEn": "Bajitpur"
  },
  {
    "id": 172,
    "districtId": 22,
    "code": "BD-2272",
    "nameBn": "ভৈরব",
    "nameEn": "Bhairab"
  },
  {
    "id": 173,
    "districtId": 22,
    "code": "BD-2273",
    "nameBn": "মিঠামইন",
    "nameEn": "Mithamain"
  },
  {
    "id": 174,
    "districtId": 22,
    "code": "BD-2274",
    "nameBn": "হোসেনপুর",
    "nameEn": "Hossainpur"
  },
  {
    "id": 175,
    "districtId": 23,
    "code": "BD-2375",
    "nameBn": "কালিয়াকৈর",
    "nameEn": "Kaliakair"
  },
  {
    "id": 20,
    "districtId": 23,
    "code": "BD-2320",
    "nameBn": "কালীগঞ্জ",
    "nameEn": "Kaliganj"
  },
  {
    "id": 176,
    "districtId": 23,
    "code": "BD-2376",
    "nameBn": "কাপাসিয়া",
    "nameEn": "Kapasia"
  },
  {
    "id": 177,
    "districtId": 23,
    "code": "BD-2377",
    "nameBn": "গাজীপুর সদর",
    "nameEn": "Gazipur Sadar"
  },
  {
    "id": 41,
    "districtId": 23,
    "code": "BD-2341",
    "nameBn": "শ্রীপুর",
    "nameEn": "Sreepur"
  },
  {
    "id": 178,
    "districtId": 24,
    "code": "BD-2478",
    "nameBn": "গোপালগঞ্জ সদর",
    "nameEn": "Gopalganj Sadar"
  },
  {
    "id": 179,
    "districtId": 24,
    "code": "BD-2479",
    "nameBn": "মুকসুদপুর",
    "nameEn": "Mukshudpur"
  },
  {
    "id": 180,
    "districtId": 24,
    "code": "BD-2480",
    "nameBn": "কাশিয়ানী",
    "nameEn": "Kashiani"
  },
  {
    "id": 181,
    "districtId": 24,
    "code": "BD-2481",
    "nameBn": "কোটালীপাড়া",
    "nameEn": "Kotalipara"
  },
  {
    "id": 182,
    "districtId": 24,
    "code": "BD-2482",
    "nameBn": "টুঙ্গিপাড়া",
    "nameEn": ""
  },
  {
    "id": 183,
    "districtId": 25,
    "code": "BD-2583",
    "nameBn": "টাঙ্গাইল সদর",
    "nameEn": "Tangail Sadar"
  },
  {
    "id": 184,
    "districtId": 25,
    "code": "BD-2584",
    "nameBn": "কালিহাতী",
    "nameEn": "Kalihati"
  },
  {
    "id": 185,
    "districtId": 25,
    "code": "BD-2585",
    "nameBn": "ঘাটাইল",
    "nameEn": "Ghatail"
  },
  {
    "id": 186,
    "districtId": 25,
    "code": "BD-2586",
    "nameBn": "বাসাইল",
    "nameEn": "Basail"
  },
  {
    "id": 187,
    "districtId": 25,
    "code": "BD-2587",
    "nameBn": "গোপালপুর",
    "nameEn": "Gopalpur"
  },
  {
    "id": 188,
    "districtId": 25,
    "code": "BD-2588",
    "nameBn": "মির্জাপুর",
    "nameEn": "Mirzapur"
  },
  {
    "id": 189,
    "districtId": 25,
    "code": "BD-2589",
    "nameBn": "ভূঞাপুর",
    "nameEn": ""
  },
  {
    "id": 190,
    "districtId": 25,
    "code": "BD-2590",
    "nameBn": "নাগরপুর",
    "nameEn": ""
  },
  {
    "id": 191,
    "districtId": 25,
    "code": "BD-2591",
    "nameBn": "মধুপুর",
    "nameEn": ""
  },
  {
    "id": 192,
    "districtId": 25,
    "code": "BD-2592",
    "nameBn": "সখিপুর",
    "nameEn": ""
  },
  {
    "id": 193,
    "districtId": 25,
    "code": "BD-2593",
    "nameBn": "দেলদুয়ার",
    "nameEn": ""
  },
  {
    "id": 194,
    "districtId": 25,
    "code": "BD-2594",
    "nameBn": "ধনবাড়ী",
    "nameEn": ""
  },
  {
    "id": 195,
    "districtId": 26,
    "code": "BD-2695",
    "nameBn": "তেজগাঁও উন্নয়ন সার্কেল",
    "nameEn": ""
  },
  {
    "id": 196,
    "districtId": 26,
    "code": "BD-2696",
    "nameBn": "দোহার",
    "nameEn": "Dohar"
  },
  {
    "id": 197,
    "districtId": 26,
    "code": "BD-2697",
    "nameBn": "নবাবগঞ্জ",
    "nameEn": "Nawabganj"
  },
  {
    "id": 198,
    "districtId": 26,
    "code": "BD-2698",
    "nameBn": "কেরানীগঞ্জ",
    "nameEn": "Keraniganj"
  },
  {
    "id": 199,
    "districtId": 26,
    "code": "BD-2699",
    "nameBn": "সাভার",
    "nameEn": "Savar"
  },
  {
    "id": 200,
    "districtId": 26,
    "code": "BD-2600",
    "nameBn": "ধামরাই",
    "nameEn": "Dhamrai"
  },
  {
    "id": 201,
    "districtId": 27,
    "code": "BD-2701",
    "nameBn": "নরসিংদী সদর",
    "nameEn": "Narsingdi Sadar"
  },
  {
    "id": 202,
    "districtId": 27,
    "code": "BD-2702",
    "nameBn": "রায়পুরা",
    "nameEn": "Raipura"
  },
  {
    "id": 203,
    "districtId": 27,
    "code": "BD-2703",
    "nameBn": "বেলাবো",
    "nameEn": "Belabo"
  },
  {
    "id": 204,
    "districtId": 27,
    "code": "BD-2704",
    "nameBn": "পলাশ",
    "nameEn": "Palash"
  },
  {
    "id": 205,
    "districtId": 27,
    "code": "BD-2705",
    "nameBn": "মনোহরদী",
    "nameEn": "Monohardi"
  },
  {
    "id": 206,
    "districtId": 27,
    "code": "BD-2706",
    "nameBn": "শিবপুর",
    "nameEn": "Shibpur"
  },
  {
    "id": 207,
    "districtId": 28,
    "code": "BD-2807",
    "nameBn": "নারায়ণগঞ্জ সদর",
    "nameEn": "Narayanganj Sadar"
  },
  {
    "id": 208,
    "districtId": 28,
    "code": "BD-2808",
    "nameBn": "বন্দর",
    "nameEn": "Bandar"
  },
  {
    "id": 209,
    "districtId": 28,
    "code": "BD-2809",
    "nameBn": "আড়াইহাজার",
    "nameEn": "Araihazar"
  },
  {
    "id": 210,
    "districtId": 28,
    "code": "BD-2810",
    "nameBn": "রূপগঞ্জ",
    "nameEn": "Rupganj"
  },
  {
    "id": 211,
    "districtId": 28,
    "code": "BD-2811",
    "nameBn": "সোনারগাঁও",
    "nameEn": "Sonargaon"
  },
  {
    "id": 212,
    "districtId": 29,
    "code": "BD-2912",
    "nameBn": "ফরিদপুর সদর",
    "nameEn": "Faridpur Sadar"
  },
  {
    "id": 213,
    "districtId": 29,
    "code": "BD-2913",
    "nameBn": "বোয়ালমারী",
    "nameEn": "Boalmari"
  },
  {
    "id": 214,
    "districtId": 29,
    "code": "BD-2914",
    "nameBn": "আলফাডাঙা",
    "nameEn": ""
  },
  {
    "id": 215,
    "districtId": 29,
    "code": "BD-2915",
    "nameBn": "মধুখালী",
    "nameEn": "Madhukhali"
  },
  {
    "id": 216,
    "districtId": 29,
    "code": "BD-2916",
    "nameBn": "ভাঙ্গা",
    "nameEn": "Bhanga"
  },
  {
    "id": 217,
    "districtId": 29,
    "code": "BD-2917",
    "nameBn": "নগরকান্দা",
    "nameEn": "Nagarkanda"
  },
  {
    "id": 218,
    "districtId": 29,
    "code": "BD-2918",
    "nameBn": "চরভদ্রাসন",
    "nameEn": "Charbhadrasan"
  },
  {
    "id": 219,
    "districtId": 29,
    "code": "BD-2919",
    "nameBn": "সদরপুর",
    "nameEn": "Sadarpu"
  },
  {
    "id": 220,
    "districtId": 29,
    "code": "BD-2920",
    "nameBn": "সালথা",
    "nameEn": ""
  },
  {
    "id": 221,
    "districtId": 30,
    "code": "BD-3021",
    "nameBn": "মাদারীপুর সদর",
    "nameEn": "Madaripur Sadar"
  },
  {
    "id": 222,
    "districtId": 30,
    "code": "BD-3022",
    "nameBn": "শিবচর",
    "nameEn": "Shibchar"
  },
  {
    "id": 223,
    "districtId": 30,
    "code": "BD-3023",
    "nameBn": "কালকিনি",
    "nameEn": "Kalkini"
  },
  {
    "id": 224,
    "districtId": 30,
    "code": "BD-3024",
    "nameBn": "রাজৈর",
    "nameEn": "Rajoir"
  },
  {
    "id": 225,
    "districtId": 30,
    "code": "BD-3025",
    "nameBn": "ডাসার",
    "nameEn": ""
  },
  {
    "id": 226,
    "districtId": 31,
    "code": "BD-3126",
    "nameBn": "ঘিওর",
    "nameEn": "Ghior"
  },
  {
    "id": 4,
    "districtId": 31,
    "code": "BD-3104",
    "nameBn": "দৌলতপুর",
    "nameEn": "Daulatpur"
  },
  {
    "id": 227,
    "districtId": 31,
    "code": "BD-3127",
    "nameBn": "মানিকগঞ্জ সদর",
    "nameEn": "Manikganj Sadar"
  },
  {
    "id": 228,
    "districtId": 31,
    "code": "BD-3128",
    "nameBn": "শিবালয়",
    "nameEn": ""
  },
  {
    "id": 229,
    "districtId": 31,
    "code": "BD-3129",
    "nameBn": "সাটুরিয়া",
    "nameEn": "Saturia"
  },
  {
    "id": 230,
    "districtId": 31,
    "code": "BD-3130",
    "nameBn": "সিঙ্গাইর",
    "nameEn": ""
  },
  {
    "id": 231,
    "districtId": 31,
    "code": "BD-3131",
    "nameBn": "হরিরামপুর",
    "nameEn": "Harirampur"
  },
  {
    "id": 232,
    "districtId": 32,
    "code": "BD-3232",
    "nameBn": "মুন্সীগঞ্জ সদর",
    "nameEn": "Munshiganj Sadar"
  },
  {
    "id": 233,
    "districtId": 32,
    "code": "BD-3233",
    "nameBn": "টংগিবাড়ী",
    "nameEn": ""
  },
  {
    "id": 234,
    "districtId": 32,
    "code": "BD-3234",
    "nameBn": "শ্রীনগর",
    "nameEn": "Sreenagar"
  },
  {
    "id": 235,
    "districtId": 32,
    "code": "BD-3235",
    "nameBn": "লৌহজং",
    "nameEn": "Lohajang"
  },
  {
    "id": 236,
    "districtId": 32,
    "code": "BD-3236",
    "nameBn": "গজারিয়া",
    "nameEn": "Gazaria"
  },
  {
    "id": 237,
    "districtId": 32,
    "code": "BD-3237",
    "nameBn": "সিরাজদিখান",
    "nameEn": "Sirajdikhan"
  },
  {
    "id": 238,
    "districtId": 33,
    "code": "BD-3338",
    "nameBn": "রাজবাড়ী সদর",
    "nameEn": "Rajbari Sadar"
  },
  {
    "id": 239,
    "districtId": 33,
    "code": "BD-3339",
    "nameBn": "গোয়ালন্দ",
    "nameEn": "Goalanda"
  },
  {
    "id": 240,
    "districtId": 33,
    "code": "BD-3340",
    "nameBn": "পাংশা",
    "nameEn": "Pangsha"
  },
  {
    "id": 241,
    "districtId": 33,
    "code": "BD-3341",
    "nameBn": "বালিয়াকান্দি",
    "nameEn": "Baliakandi"
  },
  {
    "id": 242,
    "districtId": 33,
    "code": "BD-3342",
    "nameBn": "কালুখালী",
    "nameEn": "Kalukhali"
  },
  {
    "id": 243,
    "districtId": 34,
    "code": "BD-3443",
    "nameBn": "জাজিরা",
    "nameEn": "Jajira"
  },
  {
    "id": 244,
    "districtId": 34,
    "code": "BD-3444",
    "nameBn": "শরীয়তপুর সদর",
    "nameEn": "Shariatpur Sadar"
  },
  {
    "id": 245,
    "districtId": 34,
    "code": "BD-3445",
    "nameBn": "গোসাইরহাট",
    "nameEn": "Gosairhat"
  },
  {
    "id": 246,
    "districtId": 34,
    "code": "BD-3446",
    "nameBn": "ডামুড্যা",
    "nameEn": "Damudya"
  },
  {
    "id": 247,
    "districtId": 34,
    "code": "BD-3447",
    "nameBn": "ভেদরগঞ্জ",
    "nameEn": "Bhedarganj"
  },
  {
    "id": 248,
    "districtId": 34,
    "code": "BD-3448",
    "nameBn": "নড়িয়া",
    "nameEn": ""
  },
  {
    "id": 249,
    "districtId": 35,
    "code": "BD-3549",
    "nameBn": "বরিশাল সদর",
    "nameEn": "Barishal Sadar"
  },
  {
    "id": 250,
    "districtId": 35,
    "code": "BD-3550",
    "nameBn": "গৌরনদী",
    "nameEn": "Gournadi"
  },
  {
    "id": 251,
    "districtId": 35,
    "code": "BD-3551",
    "nameBn": "মুলাদী",
    "nameEn": "Muladi"
  },
  {
    "id": 252,
    "districtId": 35,
    "code": "BD-3552",
    "nameBn": "মেহেন্দিগঞ্জ",
    "nameEn": "Mehendiganj"
  },
  {
    "id": 253,
    "districtId": 35,
    "code": "BD-3553",
    "nameBn": "বাবুগঞ্জ",
    "nameEn": "Babuganj"
  },
  {
    "id": 254,
    "districtId": 35,
    "code": "BD-3554",
    "nameBn": "হিজলা",
    "nameEn": "Hizla"
  },
  {
    "id": 255,
    "districtId": 35,
    "code": "BD-3555",
    "nameBn": "উজিরপুর",
    "nameEn": "Uzirpur"
  },
  {
    "id": 256,
    "districtId": 35,
    "code": "BD-3556",
    "nameBn": "বাকেরগঞ্জ",
    "nameEn": "Bakerganj"
  },
  {
    "id": 257,
    "districtId": 35,
    "code": "BD-3557",
    "nameBn": "আগৈলঝাড়া",
    "nameEn": "Agailjhara"
  },
  {
    "id": 258,
    "districtId": 35,
    "code": "BD-3558",
    "nameBn": "বানারীপাড়া",
    "nameEn": ""
  },
  {
    "id": 259,
    "districtId": 36,
    "code": "BD-3659",
    "nameBn": "ভোলা সদর",
    "nameEn": "Bhola Sadar"
  },
  {
    "id": 260,
    "districtId": 36,
    "code": "BD-3660",
    "nameBn": "বোরহানউদ্দিন",
    "nameEn": "Burhanuddin"
  },
  {
    "id": 261,
    "districtId": 36,
    "code": "BD-3661",
    "nameBn": "দৌলতখান",
    "nameEn": "Daulatkhan"
  },
  {
    "id": 262,
    "districtId": 36,
    "code": "BD-3662",
    "nameBn": "লালমোহন",
    "nameEn": "Lalmohan"
  },
  {
    "id": 263,
    "districtId": 36,
    "code": "BD-3663",
    "nameBn": "তজুমদ্দিন",
    "nameEn": "Tazumuddin"
  },
  {
    "id": 264,
    "districtId": 36,
    "code": "BD-3664",
    "nameBn": "চরফ্যাশন",
    "nameEn": ""
  },
  {
    "id": 265,
    "districtId": 36,
    "code": "BD-3665",
    "nameBn": "মনপুরা",
    "nameEn": "Manpura"
  },
  {
    "id": 266,
    "districtId": 37,
    "code": "BD-3766",
    "nameBn": "ঝালকাঠি সদর",
    "nameEn": "Jhalokati Sadar"
  },
  {
    "id": 267,
    "districtId": 37,
    "code": "BD-3767",
    "nameBn": "কাঁঠালিয়া",
    "nameEn": ""
  },
  {
    "id": 268,
    "districtId": 37,
    "code": "BD-3768",
    "nameBn": "নলছিটি",
    "nameEn": "Nalchity"
  },
  {
    "id": 269,
    "districtId": 37,
    "code": "BD-3769",
    "nameBn": "রাজাপুর",
    "nameEn": "Rajapur"
  },
  {
    "id": 270,
    "districtId": 38,
    "code": "BD-3870",
    "nameBn": "পটুয়াখালী সদর",
    "nameEn": "Patuakhali Sadar"
  },
  {
    "id": 271,
    "districtId": 38,
    "code": "BD-3871",
    "nameBn": "দুমকি",
    "nameEn": "Dumki"
  },
  {
    "id": 272,
    "districtId": 38,
    "code": "BD-3872",
    "nameBn": "মির্জাগঞ্জ",
    "nameEn": "Mirzaganj"
  },
  {
    "id": 273,
    "districtId": 38,
    "code": "BD-3873",
    "nameBn": "দশমিনা",
    "nameEn": "Dashmina"
  },
  {
    "id": 274,
    "districtId": 38,
    "code": "BD-3874",
    "nameBn": "বাউফল",
    "nameEn": "Bauphal"
  },
  {
    "id": 275,
    "districtId": 38,
    "code": "BD-3875",
    "nameBn": "কলাপাড়া",
    "nameEn": "Kalapara"
  },
  {
    "id": 276,
    "districtId": 38,
    "code": "BD-3876",
    "nameBn": "গলাচিপা",
    "nameEn": "Galachipa"
  },
  {
    "id": 277,
    "districtId": 38,
    "code": "BD-3877",
    "nameBn": "রাঙ্গাবালী",
    "nameEn": "Rangabali"
  },
  {
    "id": 278,
    "districtId": 39,
    "code": "BD-3978",
    "nameBn": "ভান্ডারিয়া",
    "nameEn": ""
  },
  {
    "id": 108,
    "districtId": 39,
    "code": "BD-3908",
    "nameBn": "কাউখালী",
    "nameEn": "Kawkhali"
  },
  {
    "id": 279,
    "districtId": 39,
    "code": "BD-3979",
    "nameBn": "মঠবাড়িয়া",
    "nameEn": "Mathbaria"
  },
  {
    "id": 280,
    "districtId": 39,
    "code": "BD-3980",
    "nameBn": "নাজিরপুর",
    "nameEn": "Nazirpur"
  },
  {
    "id": 281,
    "districtId": 39,
    "code": "BD-3981",
    "nameBn": "পিরোজপুর সদর",
    "nameEn": "Pirojpur Sadar"
  },
  {
    "id": 282,
    "districtId": 39,
    "code": "BD-3982",
    "nameBn": "নেছারাবাদ",
    "nameEn": "Nesarabad"
  },
  {
    "id": 283,
    "districtId": 39,
    "code": "BD-3983",
    "nameBn": "ইন্দুরকানী",
    "nameEn": ""
  },
  {
    "id": 284,
    "districtId": 40,
    "code": "BD-4084",
    "nameBn": "বরগুনা সদর",
    "nameEn": "Barguna Sadar"
  },
  {
    "id": 285,
    "districtId": 40,
    "code": "BD-4085",
    "nameBn": "আমতলী",
    "nameEn": "Amtali"
  },
  {
    "id": 286,
    "districtId": 40,
    "code": "BD-4086",
    "nameBn": "বেতাগী",
    "nameEn": "Betagani"
  },
  {
    "id": 287,
    "districtId": 40,
    "code": "BD-4087",
    "nameBn": "বামনা",
    "nameEn": "Bamna"
  },
  {
    "id": 288,
    "districtId": 40,
    "code": "BD-4088",
    "nameBn": "পাথরঘাটা",
    "nameEn": "Patharghata"
  },
  {
    "id": 289,
    "districtId": 40,
    "code": "BD-4089",
    "nameBn": "তালতলী",
    "nameEn": ""
  },
  {
    "id": 290,
    "districtId": 41,
    "code": "BD-4190",
    "nameBn": "ত্রিশাল",
    "nameEn": "Trishal"
  },
  {
    "id": 291,
    "districtId": 41,
    "code": "BD-4191",
    "nameBn": "ময়মনসিংহ সদর",
    "nameEn": "Mymensingh Sadar"
  },
  {
    "id": 292,
    "districtId": 41,
    "code": "BD-4192",
    "nameBn": "ঈশ্বরগঞ্জ",
    "nameEn": "Ishwarganj"
  },
  {
    "id": 293,
    "districtId": 41,
    "code": "BD-4193",
    "nameBn": "গফরগাঁও",
    "nameEn": "Gaffargaon"
  },
  {
    "id": 294,
    "districtId": 41,
    "code": "BD-4194",
    "nameBn": "গৌরীপুর",
    "nameEn": "Gauripur"
  },
  {
    "id": 295,
    "districtId": 41,
    "code": "BD-4195",
    "nameBn": "তারাকান্দা",
    "nameEn": "Tarakanda"
  },
  {
    "id": 296,
    "districtId": 41,
    "code": "BD-4196",
    "nameBn": "ধোবাউড়া",
    "nameEn": ""
  },
  {
    "id": 297,
    "districtId": 41,
    "code": "BD-4197",
    "nameBn": "নান্দাইল",
    "nameEn": "Nandail"
  },
  {
    "id": 298,
    "districtId": 41,
    "code": "BD-4198",
    "nameBn": "ফুলপুর",
    "nameEn": "Phulpur"
  },
  {
    "id": 299,
    "districtId": 41,
    "code": "BD-4199",
    "nameBn": "ফুলবাড়িয়া",
    "nameEn": ""
  },
  {
    "id": 300,
    "districtId": 41,
    "code": "BD-4100",
    "nameBn": "ভালুকা",
    "nameEn": "Bhaluka"
  },
  {
    "id": 301,
    "districtId": 41,
    "code": "BD-4101",
    "nameBn": "হালুয়াঘাট",
    "nameEn": "Haluaghat"
  },
  {
    "id": 302,
    "districtId": 41,
    "code": "BD-4102",
    "nameBn": "মুক্তাগাছা",
    "nameEn": "Muktagacha"
  },
  {
    "id": 303,
    "districtId": 42,
    "code": "BD-4203",
    "nameBn": "ইসলামপুর",
    "nameEn": "Islampur"
  },
  {
    "id": 304,
    "districtId": 42,
    "code": "BD-4204",
    "nameBn": "জামালপুর সদর",
    "nameEn": "Jamalpur Sadar"
  },
  {
    "id": 305,
    "districtId": 42,
    "code": "BD-4205",
    "nameBn": "দেওয়ানগঞ্জ",
    "nameEn": "Dewanaganj"
  },
  {
    "id": 306,
    "districtId": 42,
    "code": "BD-4206",
    "nameBn": "বকশীগঞ্জ",
    "nameEn": "Bakshiganj"
  },
  {
    "id": 307,
    "districtId": 42,
    "code": "BD-4207",
    "nameBn": "মাদারগঞ্জ",
    "nameEn": "Madarhganj"
  },
  {
    "id": 308,
    "districtId": 42,
    "code": "BD-4208",
    "nameBn": "মেলান্দহ",
    "nameEn": "Melandaha"
  },
  {
    "id": 309,
    "districtId": 42,
    "code": "BD-4209",
    "nameBn": "সরিষাবাড়ী",
    "nameEn": "Sarishabari"
  },
  {
    "id": 310,
    "districtId": 43,
    "code": "BD-4310",
    "nameBn": "আটপাড়া",
    "nameEn": "Atpara"
  },
  {
    "id": 311,
    "districtId": 43,
    "code": "BD-4311",
    "nameBn": "কলমাকান্দা",
    "nameEn": "Kalmakanda"
  },
  {
    "id": 312,
    "districtId": 43,
    "code": "BD-4312",
    "nameBn": "কেন্দুয়া",
    "nameEn": "Kendua"
  },
  {
    "id": 313,
    "districtId": 43,
    "code": "BD-4313",
    "nameBn": "খালিয়াজুড়ি",
    "nameEn": ""
  },
  {
    "id": 314,
    "districtId": 43,
    "code": "BD-4314",
    "nameBn": "দুর্গাপুর",
    "nameEn": "Durgapur"
  },
  {
    "id": 315,
    "districtId": 43,
    "code": "BD-4315",
    "nameBn": "নেত্রকোণা সদর",
    "nameEn": "Netrokona Sadar"
  },
  {
    "id": 316,
    "districtId": 43,
    "code": "BD-4316",
    "nameBn": "পূর্বধলা",
    "nameEn": ""
  },
  {
    "id": 317,
    "districtId": 43,
    "code": "BD-4317",
    "nameBn": "বারহাট্টা",
    "nameEn": "Barhatta"
  },
  {
    "id": 318,
    "districtId": 43,
    "code": "BD-4318",
    "nameBn": "মদন",
    "nameEn": "Madan"
  },
  {
    "id": 319,
    "districtId": 43,
    "code": "BD-4319",
    "nameBn": "মোহনগঞ্জ",
    "nameEn": ""
  },
  {
    "id": 320,
    "districtId": 44,
    "code": "BD-4420",
    "nameBn": "ঝিনাইগাতী",
    "nameEn": "Jhenaigati"
  },
  {
    "id": 321,
    "districtId": 44,
    "code": "BD-4421",
    "nameBn": "নকলা",
    "nameEn": "Nakla"
  },
  {
    "id": 322,
    "districtId": 44,
    "code": "BD-4422",
    "nameBn": "নালিতাবাড়ী",
    "nameEn": "Nalitabari"
  },
  {
    "id": 323,
    "districtId": 44,
    "code": "BD-4423",
    "nameBn": "শেরপুর সদর",
    "nameEn": "Sherpur Sadar"
  },
  {
    "id": 324,
    "districtId": 44,
    "code": "BD-4424",
    "nameBn": "শ্রীবরদী",
    "nameEn": "Sribardi"
  },
  {
    "id": 325,
    "districtId": 45,
    "code": "BD-4525",
    "nameBn": "উলিপুর",
    "nameEn": "Ulipur"
  },
  {
    "id": 326,
    "districtId": 45,
    "code": "BD-4526",
    "nameBn": "কুড়িগ্রাম সদর",
    "nameEn": "Kurigram Sadar"
  },
  {
    "id": 327,
    "districtId": 45,
    "code": "BD-4527",
    "nameBn": "চর রাজিবপুর",
    "nameEn": "Char Rajibpur"
  },
  {
    "id": 328,
    "districtId": 45,
    "code": "BD-4528",
    "nameBn": "চিলমারী",
    "nameEn": ""
  },
  {
    "id": 329,
    "districtId": 45,
    "code": "BD-4529",
    "nameBn": "নাগেশ্বরী",
    "nameEn": "Nageshwari"
  },
  {
    "id": 330,
    "districtId": 45,
    "code": "BD-4530",
    "nameBn": "ফুলবাড়ী",
    "nameEn": "Fulbari"
  },
  {
    "id": 331,
    "districtId": 45,
    "code": "BD-4531",
    "nameBn": "ভূরুঙ্গামারী",
    "nameEn": ""
  },
  {
    "id": 332,
    "districtId": 45,
    "code": "BD-4532",
    "nameBn": "রাজারহাট",
    "nameEn": ""
  },
  {
    "id": 333,
    "districtId": 45,
    "code": "BD-4533",
    "nameBn": "রৌমারী",
    "nameEn": "Roumari"
  },
  {
    "id": 334,
    "districtId": 46,
    "code": "BD-4634",
    "nameBn": "গাইবান্ধা সদর",
    "nameEn": "Gaibandha Sadar"
  },
  {
    "id": 335,
    "districtId": 46,
    "code": "BD-4635",
    "nameBn": "সাদুল্লাপুর",
    "nameEn": "Sadullapur"
  },
  {
    "id": 336,
    "districtId": 46,
    "code": "BD-4636",
    "nameBn": "ফুলছড়ি",
    "nameEn": "Phulchhari"
  },
  {
    "id": 337,
    "districtId": 46,
    "code": "BD-4637",
    "nameBn": "গোবিন্দগঞ্জ",
    "nameEn": "Gobindaganj"
  },
  {
    "id": 338,
    "districtId": 46,
    "code": "BD-4638",
    "nameBn": "পলাশবাড়ী",
    "nameEn": "Palashbari"
  },
  {
    "id": 339,
    "districtId": 46,
    "code": "BD-4639",
    "nameBn": "সাঘাটা",
    "nameEn": "Saghata"
  },
  {
    "id": 340,
    "districtId": 46,
    "code": "BD-4640",
    "nameBn": "সুন্দরগঞ্জ",
    "nameEn": "Sundarganj"
  },
  {
    "id": 341,
    "districtId": 47,
    "code": "BD-4741",
    "nameBn": "ঠাকুরগাঁও সদর",
    "nameEn": "Thakurgaon Sadar"
  },
  {
    "id": 342,
    "districtId": 47,
    "code": "BD-4742",
    "nameBn": "বালিয়াডাঙ্গী",
    "nameEn": ""
  },
  {
    "id": 343,
    "districtId": 47,
    "code": "BD-4743",
    "nameBn": "পীরগঞ্জ",
    "nameEn": "Pirganj"
  },
  {
    "id": 344,
    "districtId": 47,
    "code": "BD-4744",
    "nameBn": "হরিপুর",
    "nameEn": "Haripur"
  },
  {
    "id": 345,
    "districtId": 47,
    "code": "BD-4745",
    "nameBn": "রাণীশংকৈল",
    "nameEn": "Ranishankail"
  },
  {
    "id": 346,
    "districtId": 48,
    "code": "BD-4846",
    "nameBn": "দিনাজপুর সদর",
    "nameEn": "Dinajpur Sadar"
  },
  {
    "id": 347,
    "districtId": 48,
    "code": "BD-4847",
    "nameBn": "বিরামপুর",
    "nameEn": "Birampur"
  },
  {
    "id": 348,
    "districtId": 48,
    "code": "BD-4848",
    "nameBn": "খানসামা",
    "nameEn": "Khansama"
  },
  {
    "id": 349,
    "districtId": 48,
    "code": "BD-4849",
    "nameBn": "বীরগঞ্জ",
    "nameEn": "Birganj"
  },
  {
    "id": 350,
    "districtId": 48,
    "code": "BD-4850",
    "nameBn": "বোচাগঞ্জ",
    "nameEn": "Bochaganj"
  },
  {
    "id": 330,
    "districtId": 48,
    "code": "BD-4830",
    "nameBn": "ফুলবাড়ী",
    "nameEn": "Fulbari"
  },
  {
    "id": 351,
    "districtId": 48,
    "code": "BD-4851",
    "nameBn": "চিরিরবন্দর",
    "nameEn": "Chirirbandar"
  },
  {
    "id": 352,
    "districtId": 48,
    "code": "BD-4852",
    "nameBn": "ঘোড়াঘাট",
    "nameEn": "Ghoraghat"
  },
  {
    "id": 353,
    "districtId": 48,
    "code": "BD-4853",
    "nameBn": "হাকিমপুর",
    "nameEn": "Hakimpur"
  },
  {
    "id": 354,
    "districtId": 48,
    "code": "BD-4854",
    "nameBn": "কাহারোল",
    "nameEn": "Kaharole"
  },
  {
    "id": 197,
    "districtId": 48,
    "code": "BD-4897",
    "nameBn": "নবাবগঞ্জ",
    "nameEn": "Nawabganj"
  },
  {
    "id": 355,
    "districtId": 48,
    "code": "BD-4855",
    "nameBn": "পার্বতীপুর",
    "nameEn": "Parbatipur"
  },
  {
    "id": 356,
    "districtId": 48,
    "code": "BD-4856",
    "nameBn": "বিরল",
    "nameEn": "Biral"
  },
  {
    "id": 357,
    "districtId": 49,
    "code": "BD-4957",
    "nameBn": "নীলফামারী সদর",
    "nameEn": "Nilphamari Sadar"
  },
  {
    "id": 358,
    "districtId": 49,
    "code": "BD-4958",
    "nameBn": "ডোমার",
    "nameEn": "Domar"
  },
  {
    "id": 359,
    "districtId": 49,
    "code": "BD-4959",
    "nameBn": "ডিমলা",
    "nameEn": "Dimla"
  },
  {
    "id": 360,
    "districtId": 49,
    "code": "BD-4960",
    "nameBn": "জলঢাকা",
    "nameEn": "Jaldhaka"
  },
  {
    "id": 361,
    "districtId": 49,
    "code": "BD-4961",
    "nameBn": "কিশোরগঞ্জ",
    "nameEn": "Kishoreganj"
  },
  {
    "id": 362,
    "districtId": 49,
    "code": "BD-4962",
    "nameBn": "সৈয়দপুর",
    "nameEn": "Saidpur"
  },
  {
    "id": 363,
    "districtId": 50,
    "code": "BD-5063",
    "nameBn": "আটোয়ারী",
    "nameEn": "Atwari"
  },
  {
    "id": 364,
    "districtId": 50,
    "code": "BD-5064",
    "nameBn": "তেতুলিয়া",
    "nameEn": "Tetulia"
  },
  {
    "id": 365,
    "districtId": 50,
    "code": "BD-5065",
    "nameBn": "দেবীগঞ্জ",
    "nameEn": "Debiganj"
  },
  {
    "id": 366,
    "districtId": 50,
    "code": "BD-5066",
    "nameBn": "পঞ্চগড় সদর",
    "nameEn": "Panchagarh Sadar"
  },
  {
    "id": 367,
    "districtId": 50,
    "code": "BD-5067",
    "nameBn": "বোদা",
    "nameEn": "Boda"
  },
  {
    "id": 368,
    "districtId": 51,
    "code": "BD-5168",
    "nameBn": "কাউনিয়া",
    "nameEn": "Kaunia"
  },
  {
    "id": 369,
    "districtId": 51,
    "code": "BD-5169",
    "nameBn": "গংগাচড়া",
    "nameEn": ""
  },
  {
    "id": 370,
    "districtId": 51,
    "code": "BD-5170",
    "nameBn": "তারাগঞ্জ",
    "nameEn": ""
  },
  {
    "id": 343,
    "districtId": 51,
    "code": "BD-5143",
    "nameBn": "পীরগঞ্জ",
    "nameEn": "Pirganj"
  },
  {
    "id": 371,
    "districtId": 51,
    "code": "BD-5171",
    "nameBn": "পীরগাছা",
    "nameEn": "Pirgacha"
  },
  {
    "id": 372,
    "districtId": 51,
    "code": "BD-5172",
    "nameBn": "বদরগঞ্জ",
    "nameEn": "Badarganj"
  },
  {
    "id": 373,
    "districtId": 51,
    "code": "BD-5173",
    "nameBn": "মিঠাপুকুর",
    "nameEn": "Mithapukur"
  },
  {
    "id": 374,
    "districtId": 51,
    "code": "BD-5174",
    "nameBn": "রংপুর সদর",
    "nameEn": "Rangpur Sadar"
  },
  {
    "id": 375,
    "districtId": 52,
    "code": "BD-5275",
    "nameBn": "আদিতমারী",
    "nameEn": "Aditmari"
  },
  {
    "id": 20,
    "districtId": 52,
    "code": "BD-5220",
    "nameBn": "কালীগঞ্জ",
    "nameEn": "Kaliganj"
  },
  {
    "id": 376,
    "districtId": 52,
    "code": "BD-5276",
    "nameBn": "পাটগ্রাম",
    "nameEn": "Patgram"
  },
  {
    "id": 377,
    "districtId": 52,
    "code": "BD-5277",
    "nameBn": "লালমনিরহাট সদর",
    "nameEn": "Lalmonirhat Sadar"
  },
  {
    "id": 378,
    "districtId": 52,
    "code": "BD-5278",
    "nameBn": "হাতীবান্ধা",
    "nameEn": "Hatibandha"
  },
  {
    "id": 379,
    "districtId": 53,
    "code": "BD-5379",
    "nameBn": "চাঁপাইনবাবগঞ্জ সদর",
    "nameEn": ""
  },
  {
    "id": 380,
    "districtId": 53,
    "code": "BD-5380",
    "nameBn": "গোমস্তাপুর",
    "nameEn": ""
  },
  {
    "id": 381,
    "districtId": 53,
    "code": "BD-5381",
    "nameBn": "নাচোল",
    "nameEn": ""
  },
  {
    "id": 382,
    "districtId": 53,
    "code": "BD-5382",
    "nameBn": "ভোলাহাট",
    "nameEn": ""
  },
  {
    "id": 383,
    "districtId": 53,
    "code": "BD-5383",
    "nameBn": "শিবগঞ্জ",
    "nameEn": ""
  },
  {
    "id": 384,
    "districtId": 54,
    "code": "BD-5484",
    "nameBn": "জয়পুরহাট সদর",
    "nameEn": ""
  },
  {
    "id": 385,
    "districtId": 54,
    "code": "BD-5485",
    "nameBn": "আক্কেলপুর",
    "nameEn": ""
  },
  {
    "id": 386,
    "districtId": 54,
    "code": "BD-5486",
    "nameBn": "কালাই",
    "nameEn": ""
  },
  {
    "id": 387,
    "districtId": 54,
    "code": "BD-5487",
    "nameBn": "ক্ষেতলাল",
    "nameEn": ""
  },
  {
    "id": 388,
    "districtId": 54,
    "code": "BD-5488",
    "nameBn": "পাঁচবিবি",
    "nameEn": ""
  },
  {
    "id": 389,
    "districtId": 55,
    "code": "BD-5589",
    "nameBn": "পত্নীতলা",
    "nameEn": ""
  },
  {
    "id": 390,
    "districtId": 55,
    "code": "BD-5590",
    "nameBn": "ধামইরহাট",
    "nameEn": ""
  },
  {
    "id": 391,
    "districtId": 55,
    "code": "BD-5591",
    "nameBn": "মহাদেবপুর",
    "nameEn": ""
  },
  {
    "id": 392,
    "districtId": 55,
    "code": "BD-5592",
    "nameBn": "পোরশা",
    "nameEn": ""
  },
  {
    "id": 393,
    "districtId": 55,
    "code": "BD-5593",
    "nameBn": "সাপাহার",
    "nameEn": ""
  },
  {
    "id": 394,
    "districtId": 55,
    "code": "BD-5594",
    "nameBn": "বদলগাছী",
    "nameEn": ""
  },
  {
    "id": 395,
    "districtId": 55,
    "code": "BD-5595",
    "nameBn": "মান্দা",
    "nameEn": ""
  },
  {
    "id": 396,
    "districtId": 55,
    "code": "BD-5596",
    "nameBn": "নিয়ামতপুর",
    "nameEn": ""
  },
  {
    "id": 397,
    "districtId": 55,
    "code": "BD-5597",
    "nameBn": "আত্রাই",
    "nameEn": ""
  },
  {
    "id": 398,
    "districtId": 55,
    "code": "BD-5598",
    "nameBn": "রাণীনগর",
    "nameEn": ""
  },
  {
    "id": 399,
    "districtId": 55,
    "code": "BD-5599",
    "nameBn": "নওগাঁ সদর",
    "nameEn": ""
  },
  {
    "id": 400,
    "districtId": 56,
    "code": "BD-5600",
    "nameBn": "নাটোর সদর",
    "nameEn": ""
  },
  {
    "id": 401,
    "districtId": 56,
    "code": "BD-5601",
    "nameBn": "বাগাতিপাড়া",
    "nameEn": ""
  },
  {
    "id": 402,
    "districtId": 56,
    "code": "BD-5602",
    "nameBn": "বড়াইগ্রাম",
    "nameEn": ""
  },
  {
    "id": 403,
    "districtId": 56,
    "code": "BD-5603",
    "nameBn": "গুরুদাসপুর",
    "nameEn": ""
  },
  {
    "id": 404,
    "districtId": 56,
    "code": "BD-5604",
    "nameBn": "লালপুর",
    "nameEn": ""
  },
  {
    "id": 405,
    "districtId": 56,
    "code": "BD-5605",
    "nameBn": "সিংড়া",
    "nameEn": ""
  },
  {
    "id": 406,
    "districtId": 56,
    "code": "BD-5606",
    "nameBn": "নলডাঙ্গা",
    "nameEn": ""
  },
  {
    "id": 407,
    "districtId": 57,
    "code": "BD-5707",
    "nameBn": "আটঘরিয়া",
    "nameEn": ""
  },
  {
    "id": 408,
    "districtId": 57,
    "code": "BD-5708",
    "nameBn": "ঈশ্বরদী",
    "nameEn": ""
  },
  {
    "id": 409,
    "districtId": 57,
    "code": "BD-5709",
    "nameBn": "চাটমোহর",
    "nameEn": ""
  },
  {
    "id": 410,
    "districtId": 57,
    "code": "BD-5710",
    "nameBn": "পাবনা সদর",
    "nameEn": ""
  },
  {
    "id": 411,
    "districtId": 57,
    "code": "BD-5711",
    "nameBn": "ফরিদপুর",
    "nameEn": ""
  },
  {
    "id": 412,
    "districtId": 57,
    "code": "BD-5712",
    "nameBn": "বেড়া",
    "nameEn": ""
  },
  {
    "id": 413,
    "districtId": 57,
    "code": "BD-5713",
    "nameBn": "ভাঙ্গুড়া",
    "nameEn": ""
  },
  {
    "id": 414,
    "districtId": 57,
    "code": "BD-5714",
    "nameBn": "সাঁথিয়া",
    "nameEn": ""
  },
  {
    "id": 415,
    "districtId": 57,
    "code": "BD-5715",
    "nameBn": "সুজানগর",
    "nameEn": ""
  },
  {
    "id": 416,
    "districtId": 58,
    "code": "BD-5816",
    "nameBn": "শাজাহানপুর",
    "nameEn": ""
  },
  {
    "id": 417,
    "districtId": 58,
    "code": "BD-5817",
    "nameBn": "আদমদীঘি",
    "nameEn": ""
  },
  {
    "id": 418,
    "districtId": 58,
    "code": "BD-5818",
    "nameBn": "বগুড়া সদর",
    "nameEn": ""
  },
  {
    "id": 419,
    "districtId": 58,
    "code": "BD-5819",
    "nameBn": "ধুনট",
    "nameEn": ""
  },
  {
    "id": 420,
    "districtId": 58,
    "code": "BD-5820",
    "nameBn": "দুপচাঁচিয়া",
    "nameEn": ""
  },
  {
    "id": 421,
    "districtId": 58,
    "code": "BD-5821",
    "nameBn": "গাবতলী",
    "nameEn": ""
  },
  {
    "id": 422,
    "districtId": 58,
    "code": "BD-5822",
    "nameBn": "কাহালু",
    "nameEn": ""
  },
  {
    "id": 423,
    "districtId": 58,
    "code": "BD-5823",
    "nameBn": "নন্দীগ্রাম",
    "nameEn": ""
  },
  {
    "id": 424,
    "districtId": 58,
    "code": "BD-5824",
    "nameBn": "সারিয়াকান্দি",
    "nameEn": ""
  },
  {
    "id": 425,
    "districtId": 58,
    "code": "BD-5825",
    "nameBn": "শেরপুর",
    "nameEn": ""
  },
  {
    "id": 383,
    "districtId": 58,
    "code": "BD-5883",
    "nameBn": "শিবগঞ্জ",
    "nameEn": ""
  },
  {
    "id": 426,
    "districtId": 58,
    "code": "BD-5826",
    "nameBn": "সোনাতলা",
    "nameEn": ""
  },
  {
    "id": 427,
    "districtId": 59,
    "code": "BD-5927",
    "nameBn": "গোদাগাড়ী",
    "nameEn": ""
  },
  {
    "id": 428,
    "districtId": 59,
    "code": "BD-5928",
    "nameBn": "তানোর",
    "nameEn": ""
  },
  {
    "id": 429,
    "districtId": 59,
    "code": "BD-5929",
    "nameBn": "মোহনপুর",
    "nameEn": ""
  },
  {
    "id": 430,
    "districtId": 59,
    "code": "BD-5930",
    "nameBn": "বাগমারা",
    "nameEn": ""
  },
  {
    "id": 314,
    "districtId": 59,
    "code": "BD-5914",
    "nameBn": "দুর্গাপুর",
    "nameEn": "Durgapur"
  },
  {
    "id": 431,
    "districtId": 59,
    "code": "BD-5931",
    "nameBn": "বাঘা",
    "nameEn": ""
  },
  {
    "id": 432,
    "districtId": 59,
    "code": "BD-5932",
    "nameBn": "চারঘাট",
    "nameEn": ""
  },
  {
    "id": 433,
    "districtId": 59,
    "code": "BD-5933",
    "nameBn": "পবা",
    "nameEn": ""
  },
  {
    "id": 434,
    "districtId": 59,
    "code": "BD-5934",
    "nameBn": "পুঠিয়া",
    "nameEn": ""
  },
  {
    "id": 435,
    "districtId": 60,
    "code": "BD-6035",
    "nameBn": "বেলকুচি",
    "nameEn": ""
  },
  {
    "id": 436,
    "districtId": 60,
    "code": "BD-6036",
    "nameBn": "কামারখন্দ",
    "nameEn": ""
  },
  {
    "id": 437,
    "districtId": 60,
    "code": "BD-6037",
    "nameBn": "চৌহালি",
    "nameEn": ""
  },
  {
    "id": 438,
    "districtId": 60,
    "code": "BD-6038",
    "nameBn": "কাজীপুর",
    "nameEn": ""
  },
  {
    "id": 439,
    "districtId": 60,
    "code": "BD-6039",
    "nameBn": "রায়গঞ্জ",
    "nameEn": ""
  },
  {
    "id": 440,
    "districtId": 60,
    "code": "BD-6040",
    "nameBn": "শাহজাদপুর",
    "nameEn": ""
  },
  {
    "id": 441,
    "districtId": 60,
    "code": "BD-6041",
    "nameBn": "সিরাজগঞ্জ সদর",
    "nameEn": ""
  },
  {
    "id": 442,
    "districtId": 60,
    "code": "BD-6042",
    "nameBn": "তাড়াশ",
    "nameEn": ""
  },
  {
    "id": 443,
    "districtId": 60,
    "code": "BD-6043",
    "nameBn": "উল্লাপাড়া",
    "nameEn": ""
  },
  {
    "id": 444,
    "districtId": 61,
    "code": "BD-6144",
    "nameBn": "বড়লেখা",
    "nameEn": ""
  },
  {
    "id": 445,
    "districtId": 61,
    "code": "BD-6145",
    "nameBn": "কুলাউড়া",
    "nameEn": ""
  },
  {
    "id": 446,
    "districtId": 61,
    "code": "BD-6146",
    "nameBn": "রাজনগর",
    "nameEn": "Rajnagar"
  },
  {
    "id": 447,
    "districtId": 61,
    "code": "BD-6147",
    "nameBn": "কমলগঞ্জ",
    "nameEn": "Kamalganj"
  },
  {
    "id": 448,
    "districtId": 61,
    "code": "BD-6148",
    "nameBn": "শ্রীমঙ্গল",
    "nameEn": "Srimangal"
  },
  {
    "id": 449,
    "districtId": 61,
    "code": "BD-6149",
    "nameBn": "মৌলভীবাজার সদর",
    "nameEn": "Maulvibazar Sadar"
  },
  {
    "id": 450,
    "districtId": 61,
    "code": "BD-6150",
    "nameBn": "জুড়ী",
    "nameEn": "Juri"
  },
  {
    "id": 451,
    "districtId": 62,
    "code": "BD-6251",
    "nameBn": "বালাগঞ্জ",
    "nameEn": "Balaganj"
  },
  {
    "id": 452,
    "districtId": 62,
    "code": "BD-6252",
    "nameBn": "বিয়ানীবাজার",
    "nameEn": "Beanibazar"
  },
  {
    "id": 453,
    "districtId": 62,
    "code": "BD-6253",
    "nameBn": "বিশ্বনাথ",
    "nameEn": "Bishwanath"
  },
  {
    "id": 119,
    "districtId": 62,
    "code": "BD-6219",
    "nameBn": "কোম্পানীগঞ্জ",
    "nameEn": "Companiganj"
  },
  {
    "id": 454,
    "districtId": 62,
    "code": "BD-6254",
    "nameBn": "ফেঞ্চুগঞ্জ",
    "nameEn": "Fenchuganj"
  },
  {
    "id": 455,
    "districtId": 62,
    "code": "BD-6255",
    "nameBn": "গোলাপগঞ্জ",
    "nameEn": "Golapganj"
  },
  {
    "id": 456,
    "districtId": 62,
    "code": "BD-6256",
    "nameBn": "গোয়াইনঘাট",
    "nameEn": ""
  },
  {
    "id": 457,
    "districtId": 62,
    "code": "BD-6257",
    "nameBn": "জৈন্তাপুর",
    "nameEn": "Jaintiapur"
  },
  {
    "id": 458,
    "districtId": 62,
    "code": "BD-6258",
    "nameBn": "কানাইঘাট",
    "nameEn": "Kanaighat"
  },
  {
    "id": 459,
    "districtId": 62,
    "code": "BD-6259",
    "nameBn": "সিলেট সদর",
    "nameEn": "Sylhet Sadar"
  },
  {
    "id": 460,
    "districtId": 62,
    "code": "BD-6260",
    "nameBn": "জকিগঞ্জ",
    "nameEn": "Jakiganj"
  },
  {
    "id": 461,
    "districtId": 62,
    "code": "BD-6261",
    "nameBn": "দক্ষিণ সুরমা",
    "nameEn": ""
  },
  {
    "id": 462,
    "districtId": 62,
    "code": "BD-6262",
    "nameBn": "ওসমানীনগর",
    "nameEn": ""
  },
  {
    "id": 463,
    "districtId": 63,
    "code": "BD-6363",
    "nameBn": "ছাতক",
    "nameEn": ""
  },
  {
    "id": 464,
    "districtId": 63,
    "code": "BD-6364",
    "nameBn": "জগন্নাথপুর",
    "nameEn": ""
  },
  {
    "id": 465,
    "districtId": 63,
    "code": "BD-6365",
    "nameBn": "জামালগঞ্জ",
    "nameEn": "Jamalganj"
  },
  {
    "id": 466,
    "districtId": 63,
    "code": "BD-6366",
    "nameBn": "তাহিরপুর",
    "nameEn": "Tahirpur"
  },
  {
    "id": 467,
    "districtId": 63,
    "code": "BD-6367",
    "nameBn": "দক্ষিণ সুনামগঞ্জ",
    "nameEn": ""
  },
  {
    "id": 468,
    "districtId": 63,
    "code": "BD-6368",
    "nameBn": "দিরাই",
    "nameEn": "Dirai"
  },
  {
    "id": 469,
    "districtId": 63,
    "code": "BD-6369",
    "nameBn": "দোয়ারাবাজার",
    "nameEn": "Dowarabazar"
  },
  {
    "id": 470,
    "districtId": 63,
    "code": "BD-6370",
    "nameBn": "ধর্মপাশা",
    "nameEn": "Dharampasha"
  },
  {
    "id": 471,
    "districtId": 63,
    "code": "BD-6371",
    "nameBn": "বিশ্বম্ভরপুর",
    "nameEn": ""
  },
  {
    "id": 472,
    "districtId": 63,
    "code": "BD-6372",
    "nameBn": "শাল্লা",
    "nameEn": "Shalla"
  },
  {
    "id": 473,
    "districtId": 63,
    "code": "BD-6373",
    "nameBn": "সুনামগঞ্জ সদর",
    "nameEn": "Sunamganj Sadar"
  },
  {
    "id": 474,
    "districtId": 63,
    "code": "BD-6374",
    "nameBn": "মধ্যনগর",
    "nameEn": ""
  },
  {
    "id": 475,
    "districtId": 64,
    "code": "BD-6475",
    "nameBn": "আজমিরীগঞ্জ",
    "nameEn": "Ajmiriganj"
  },
  {
    "id": 476,
    "districtId": 64,
    "code": "BD-6476",
    "nameBn": "চুনারুঘাট",
    "nameEn": "Chunarughat"
  },
  {
    "id": 477,
    "districtId": 64,
    "code": "BD-6477",
    "nameBn": "নবীগঞ্জ",
    "nameEn": ""
  },
  {
    "id": 478,
    "districtId": 64,
    "code": "BD-6478",
    "nameBn": "বানিয়াচং",
    "nameEn": ""
  },
  {
    "id": 479,
    "districtId": 64,
    "code": "BD-6479",
    "nameBn": "বাহুবল",
    "nameEn": "Bahubal"
  },
  {
    "id": 480,
    "districtId": 64,
    "code": "BD-6480",
    "nameBn": "মাধবপুর",
    "nameEn": ""
  },
  {
    "id": 481,
    "districtId": 64,
    "code": "BD-6481",
    "nameBn": "লাখাই",
    "nameEn": "Lakhai"
  },
  {
    "id": 482,
    "districtId": 64,
    "code": "BD-6482",
    "nameBn": "শায়েস্তাগঞ্জ",
    "nameEn": ""
  },
  {
    "id": 483,
    "districtId": 64,
    "code": "BD-6483",
    "nameBn": "হবিগঞ্জ সদর",
    "nameEn": "Habiganj Sadar"
  }
] as const;

export const UNIONS: Union[] = [
  {
    "id": 1,
    "upazilaId": 1,
    "nameBn": "কয়া",
    "nameEn": ""
  },
  {
    "id": 2,
    "upazilaId": 1,
    "nameBn": "চরসাদীপুর",
    "nameEn": ""
  },
  {
    "id": 3,
    "upazilaId": 1,
    "nameBn": "চাপড়া",
    "nameEn": ""
  },
  {
    "id": 4,
    "upazilaId": 1,
    "nameBn": "চাঁদপুর",
    "nameEn": ""
  },
  {
    "id": 5,
    "upazilaId": 1,
    "nameBn": "জগন্নাথপুর",
    "nameEn": ""
  },
  {
    "id": 6,
    "upazilaId": 1,
    "nameBn": "নন্দলালপুর",
    "nameEn": ""
  },
  {
    "id": 7,
    "upazilaId": 1,
    "nameBn": "পান্টি",
    "nameEn": ""
  },
  {
    "id": 8,
    "upazilaId": 1,
    "nameBn": "বাগুলাট",
    "nameEn": ""
  },
  {
    "id": 9,
    "upazilaId": 1,
    "nameBn": "যদুবয়রা",
    "nameEn": ""
  },
  {
    "id": 10,
    "upazilaId": 1,
    "nameBn": "শিলাইদহ",
    "nameEn": ""
  },
  {
    "id": 11,
    "upazilaId": 1,
    "nameBn": "সদকী",
    "nameEn": ""
  },
  {
    "id": 12,
    "upazilaId": 2,
    "nameBn": "হাটশ হরিপুর",
    "nameEn": ""
  },
  {
    "id": 13,
    "upazilaId": 2,
    "nameBn": "বারখাদা",
    "nameEn": ""
  },
  {
    "id": 14,
    "upazilaId": 2,
    "nameBn": "মজমপুর",
    "nameEn": ""
  },
  {
    "id": 15,
    "upazilaId": 2,
    "nameBn": "বটতৈল",
    "nameEn": ""
  },
  {
    "id": 16,
    "upazilaId": 2,
    "nameBn": "আলামপুর",
    "nameEn": ""
  },
  {
    "id": 17,
    "upazilaId": 2,
    "nameBn": "জিয়ারখি",
    "nameEn": ""
  },
  {
    "id": 18,
    "upazilaId": 2,
    "nameBn": "আইলচারা",
    "nameEn": ""
  },
  {
    "id": 19,
    "upazilaId": 2,
    "nameBn": "পাটিকাবাড়ী",
    "nameEn": ""
  },
  {
    "id": 20,
    "upazilaId": 2,
    "nameBn": "ঝাউদিয়া",
    "nameEn": ""
  },
  {
    "id": 21,
    "upazilaId": 2,
    "nameBn": "উজানগ্রাম",
    "nameEn": ""
  },
  {
    "id": 22,
    "upazilaId": 2,
    "nameBn": "আব্দালপুর",
    "nameEn": ""
  },
  {
    "id": 23,
    "upazilaId": 2,
    "nameBn": "হরিনারায়ণপুর",
    "nameEn": ""
  },
  {
    "id": 24,
    "upazilaId": 2,
    "nameBn": "মনোহরদিয়া",
    "nameEn": ""
  },
  {
    "id": 25,
    "upazilaId": 2,
    "nameBn": "গোস্বামীদূর্গাপুর",
    "nameEn": ""
  },
  {
    "id": 26,
    "upazilaId": 3,
    "nameBn": "খোকসা",
    "nameEn": ""
  },
  {
    "id": 27,
    "upazilaId": 3,
    "nameBn": "ওসমানপুর",
    "nameEn": ""
  },
  {
    "id": 28,
    "upazilaId": 3,
    "nameBn": "বেতবাড়ীয়া",
    "nameEn": ""
  },
  {
    "id": 29,
    "upazilaId": 3,
    "nameBn": "জানিপুর",
    "nameEn": ""
  },
  {
    "id": 30,
    "upazilaId": 3,
    "nameBn": "শিমুলিয়া",
    "nameEn": ""
  },
  {
    "id": 31,
    "upazilaId": 3,
    "nameBn": "শোমসপুর",
    "nameEn": ""
  },
  {
    "id": 32,
    "upazilaId": 3,
    "nameBn": "গোপগ্রাম",
    "nameEn": ""
  },
  {
    "id": 33,
    "upazilaId": 3,
    "nameBn": "জয়ন্তীহাজরা",
    "nameEn": ""
  },
  {
    "id": 34,
    "upazilaId": 3,
    "nameBn": "আমবাড়ীয়া",
    "nameEn": ""
  },
  {
    "id": 35,
    "upazilaId": 4,
    "nameBn": "দৌলতপুর",
    "nameEn": ""
  },
  {
    "id": 36,
    "upazilaId": 4,
    "nameBn": "রেফাইতপুর",
    "nameEn": ""
  },
  {
    "id": 37,
    "upazilaId": 4,
    "nameBn": "আদাবাড়ীয়া",
    "nameEn": ""
  },
  {
    "id": 38,
    "upazilaId": 4,
    "nameBn": "হোগলবাড়ীয়া",
    "nameEn": ""
  },
  {
    "id": 39,
    "upazilaId": 4,
    "nameBn": "বোয়ালিয়া",
    "nameEn": ""
  },
  {
    "id": 40,
    "upazilaId": 4,
    "nameBn": "ফিলিপনগর",
    "nameEn": ""
  },
  {
    "id": 41,
    "upazilaId": 4,
    "nameBn": "মথুরাপুর",
    "nameEn": ""
  },
  {
    "id": 42,
    "upazilaId": 4,
    "nameBn": "প্রাগপুর",
    "nameEn": ""
  },
  {
    "id": 43,
    "upazilaId": 4,
    "nameBn": "মরিচা",
    "nameEn": ""
  },
  {
    "id": 44,
    "upazilaId": 4,
    "nameBn": "চিলমারী",
    "nameEn": ""
  },
  {
    "id": 45,
    "upazilaId": 4,
    "nameBn": "রামকৃষ্ণপুর",
    "nameEn": ""
  },
  {
    "id": 46,
    "upazilaId": 4,
    "nameBn": "আড়িয়া",
    "nameEn": ""
  },
  {
    "id": 47,
    "upazilaId": 4,
    "nameBn": "খলিষাকুন্ডি",
    "nameEn": ""
  },
  {
    "id": 48,
    "upazilaId": 4,
    "nameBn": "পিয়ারপুর",
    "nameEn": ""
  },
  {
    "id": 49,
    "upazilaId": 5,
    "nameBn": "জুনিয়াদহ",
    "nameEn": ""
  },
  {
    "id": 50,
    "upazilaId": 5,
    "nameBn": "বাহিরচর",
    "nameEn": ""
  },
  {
    "id": 51,
    "upazilaId": 5,
    "nameBn": "ধরমপুর",
    "nameEn": ""
  },
  {
    "id": 52,
    "upazilaId": 5,
    "nameBn": "চাঁদগ্রাম",
    "nameEn": ""
  },
  {
    "id": 53,
    "upazilaId": 5,
    "nameBn": "মোকারিমপুর",
    "nameEn": ""
  },
  {
    "id": 54,
    "upazilaId": 5,
    "nameBn": "বাহাদুরপুর",
    "nameEn": ""
  },
  {
    "id": 55,
    "upazilaId": 6,
    "nameBn": "বহলবাড়ীয়া",
    "nameEn": ""
  },
  {
    "id": 56,
    "upazilaId": 6,
    "nameBn": "চিথলিয়া",
    "nameEn": ""
  },
  {
    "id": 57,
    "upazilaId": 6,
    "nameBn": "তালবাড়ীয়া",
    "nameEn": ""
  },
  {
    "id": 58,
    "upazilaId": 6,
    "nameBn": "বারুইপাড়া",
    "nameEn": ""
  },
  {
    "id": 59,
    "upazilaId": 6,
    "nameBn": "ফুলবাড়ীয়া",
    "nameEn": ""
  },
  {
    "id": 60,
    "upazilaId": 6,
    "nameBn": "আমলা",
    "nameEn": ""
  },
  {
    "id": 61,
    "upazilaId": 6,
    "nameBn": "সদরপুর",
    "nameEn": ""
  },
  {
    "id": 62,
    "upazilaId": 6,
    "nameBn": "ছাতিয়ান",
    "nameEn": ""
  },
  {
    "id": 63,
    "upazilaId": 6,
    "nameBn": "পোড়াদহ",
    "nameEn": ""
  },
  {
    "id": 64,
    "upazilaId": 6,
    "nameBn": "কুর্শা",
    "nameEn": ""
  },
  {
    "id": 65,
    "upazilaId": 6,
    "nameBn": "মালিহাদ",
    "nameEn": ""
  },
  {
    "id": 66,
    "upazilaId": 6,
    "nameBn": "আমবাড়ীয়া",
    "nameEn": ""
  },
  {
    "id": 67,
    "upazilaId": 6,
    "nameBn": "ধুবইল",
    "nameEn": ""
  },
  {
    "id": 68,
    "upazilaId": 7,
    "nameBn": "কয়রা",
    "nameEn": ""
  },
  {
    "id": 69,
    "upazilaId": 7,
    "nameBn": "মহারাজপুর",
    "nameEn": ""
  },
  {
    "id": 70,
    "upazilaId": 7,
    "nameBn": "মহেশ্বরীপুর",
    "nameEn": ""
  },
  {
    "id": 71,
    "upazilaId": 7,
    "nameBn": "উত্তর বেদকাশী",
    "nameEn": ""
  },
  {
    "id": 72,
    "upazilaId": 7,
    "nameBn": "দক্ষিণ বেদকাশী",
    "nameEn": ""
  },
  {
    "id": 73,
    "upazilaId": 7,
    "nameBn": "আমাদি",
    "nameEn": ""
  },
  {
    "id": 74,
    "upazilaId": 7,
    "nameBn": "বাগালী",
    "nameEn": ""
  },
  {
    "id": 75,
    "upazilaId": 8,
    "nameBn": "ডুমুরিয়া",
    "nameEn": ""
  },
  {
    "id": 76,
    "upazilaId": 8,
    "nameBn": "মাগুরাঘোনা",
    "nameEn": ""
  },
  {
    "id": 77,
    "upazilaId": 8,
    "nameBn": "ভান্ডারপাড়া",
    "nameEn": ""
  },
  {
    "id": 78,
    "upazilaId": 8,
    "nameBn": "সাহস",
    "nameEn": ""
  },
  {
    "id": 79,
    "upazilaId": 8,
    "nameBn": "রুদাঘরা",
    "nameEn": ""
  },
  {
    "id": 80,
    "upazilaId": 8,
    "nameBn": "গুটুদিয়া",
    "nameEn": ""
  },
  {
    "id": 81,
    "upazilaId": 8,
    "nameBn": "শোভনা",
    "nameEn": ""
  },
  {
    "id": 82,
    "upazilaId": 8,
    "nameBn": "খর্ণিয়া",
    "nameEn": ""
  },
  {
    "id": 83,
    "upazilaId": 8,
    "nameBn": "আটলিয়া",
    "nameEn": ""
  },
  {
    "id": 84,
    "upazilaId": 8,
    "nameBn": "ধামালিয়া",
    "nameEn": ""
  },
  {
    "id": 85,
    "upazilaId": 8,
    "nameBn": "মাগুরখালী",
    "nameEn": ""
  },
  {
    "id": 86,
    "upazilaId": 8,
    "nameBn": "রঘুনাথপুর",
    "nameEn": ""
  },
  {
    "id": 87,
    "upazilaId": 8,
    "nameBn": "রংপুর",
    "nameEn": ""
  },
  {
    "id": 88,
    "upazilaId": 8,
    "nameBn": "শরাফপুর",
    "nameEn": ""
  },
  {
    "id": 89,
    "upazilaId": 9,
    "nameBn": "তেরখাদা",
    "nameEn": ""
  },
  {
    "id": 90,
    "upazilaId": 9,
    "nameBn": "ছাগলাদহ",
    "nameEn": ""
  },
  {
    "id": 91,
    "upazilaId": 9,
    "nameBn": "বারাসাত",
    "nameEn": ""
  },
  {
    "id": 92,
    "upazilaId": 9,
    "nameBn": "সাচিয়াদাহ",
    "nameEn": ""
  },
  {
    "id": 93,
    "upazilaId": 9,
    "nameBn": "মধুপুর",
    "nameEn": ""
  },
  {
    "id": 94,
    "upazilaId": 9,
    "nameBn": "আজগড়া",
    "nameEn": ""
  },
  {
    "id": 95,
    "upazilaId": 10,
    "nameBn": "বাজুয়া",
    "nameEn": ""
  },
  {
    "id": 96,
    "upazilaId": 10,
    "nameBn": "কামারখোলা",
    "nameEn": ""
  },
  {
    "id": 97,
    "upazilaId": 10,
    "nameBn": "তিলডাঙ্গা",
    "nameEn": ""
  },
  {
    "id": 98,
    "upazilaId": 10,
    "nameBn": "সুতারখালী",
    "nameEn": ""
  },
  {
    "id": 99,
    "upazilaId": 10,
    "nameBn": "লাউডোব",
    "nameEn": ""
  },
  {
    "id": 100,
    "upazilaId": 10,
    "nameBn": "পানখালী",
    "nameEn": ""
  },
  {
    "id": 101,
    "upazilaId": 10,
    "nameBn": "বানিশান্তা",
    "nameEn": ""
  },
  {
    "id": 102,
    "upazilaId": 10,
    "nameBn": "কৈলাশগঞ্জ",
    "nameEn": ""
  },
  {
    "id": 103,
    "upazilaId": 11,
    "nameBn": "গাজীরহাট",
    "nameEn": ""
  },
  {
    "id": 104,
    "upazilaId": 11,
    "nameBn": "বারাকপুর",
    "nameEn": ""
  },
  {
    "id": 105,
    "upazilaId": 11,
    "nameBn": "দিঘলিয়া",
    "nameEn": ""
  },
  {
    "id": 106,
    "upazilaId": 11,
    "nameBn": "সেনহাটি",
    "nameEn": ""
  },
  {
    "id": 107,
    "upazilaId": 11,
    "nameBn": "আড়ংঘাটা",
    "nameEn": ""
  },
  {
    "id": 108,
    "upazilaId": 11,
    "nameBn": "যোগীপোল",
    "nameEn": ""
  },
  {
    "id": 109,
    "upazilaId": 12,
    "nameBn": "হরিঢালী",
    "nameEn": ""
  },
  {
    "id": 110,
    "upazilaId": 12,
    "nameBn": "গড়ইখালী",
    "nameEn": ""
  },
  {
    "id": 111,
    "upazilaId": 12,
    "nameBn": "কপিলমুনি",
    "nameEn": ""
  },
  {
    "id": 112,
    "upazilaId": 12,
    "nameBn": "লতা",
    "nameEn": ""
  },
  {
    "id": 113,
    "upazilaId": 12,
    "nameBn": "দেলুটি",
    "nameEn": ""
  },
  {
    "id": 114,
    "upazilaId": 12,
    "nameBn": "লস্কর",
    "nameEn": ""
  },
  {
    "id": 115,
    "upazilaId": 12,
    "nameBn": "গদাইপুর",
    "nameEn": ""
  },
  {
    "id": 116,
    "upazilaId": 12,
    "nameBn": "রাড়ুলী",
    "nameEn": ""
  },
  {
    "id": 117,
    "upazilaId": 12,
    "nameBn": "চাঁদখালী",
    "nameEn": ""
  },
  {
    "id": 118,
    "upazilaId": 12,
    "nameBn": "সোলাদানা",
    "nameEn": ""
  },
  {
    "id": 119,
    "upazilaId": 13,
    "nameBn": "দামোদর",
    "nameEn": ""
  },
  {
    "id": 120,
    "upazilaId": 13,
    "nameBn": "ফুলতলা",
    "nameEn": ""
  },
  {
    "id": 121,
    "upazilaId": 13,
    "nameBn": "জামিরা",
    "nameEn": ""
  },
  {
    "id": 122,
    "upazilaId": 13,
    "nameBn": "আটরা গিলাতলা",
    "nameEn": ""
  },
  {
    "id": 123,
    "upazilaId": 14,
    "nameBn": "জলমা",
    "nameEn": ""
  },
  {
    "id": 124,
    "upazilaId": 14,
    "nameBn": "বটিয়াঘাটা",
    "nameEn": ""
  },
  {
    "id": 125,
    "upazilaId": 14,
    "nameBn": "গঙ্গারামপুর",
    "nameEn": ""
  },
  {
    "id": 126,
    "upazilaId": 14,
    "nameBn": "সুরখালী",
    "nameEn": ""
  },
  {
    "id": 127,
    "upazilaId": 14,
    "nameBn": "ভান্ডারকোট",
    "nameEn": ""
  },
  {
    "id": 128,
    "upazilaId": 14,
    "nameBn": "বালিয়াডাঙ্গা",
    "nameEn": ""
  },
  {
    "id": 129,
    "upazilaId": 14,
    "nameBn": "আমিরপুর",
    "nameEn": ""
  },
  {
    "id": 130,
    "upazilaId": 15,
    "nameBn": "আইচগাতী",
    "nameEn": ""
  },
  {
    "id": 131,
    "upazilaId": 15,
    "nameBn": "শ্রীফলতলা",
    "nameEn": ""
  },
  {
    "id": 132,
    "upazilaId": 15,
    "nameBn": "নৈহাটি",
    "nameEn": ""
  },
  {
    "id": 133,
    "upazilaId": 15,
    "nameBn": "টিএসবি",
    "nameEn": ""
  },
  {
    "id": 134,
    "upazilaId": 15,
    "nameBn": "ঘাটভোগ",
    "nameEn": ""
  },
  {
    "id": 135,
    "upazilaId": 16,
    "nameBn": "আইলহাঁস",
    "nameEn": ""
  },
  {
    "id": 136,
    "upazilaId": 16,
    "nameBn": "ভাংবাড়িয়া",
    "nameEn": ""
  },
  {
    "id": 137,
    "upazilaId": 16,
    "nameBn": "হারদী",
    "nameEn": ""
  },
  {
    "id": 138,
    "upazilaId": 16,
    "nameBn": "কুমারী",
    "nameEn": ""
  },
  {
    "id": 139,
    "upazilaId": 16,
    "nameBn": "বাড়াদী",
    "nameEn": ""
  },
  {
    "id": 140,
    "upazilaId": 16,
    "nameBn": "গাংনী",
    "nameEn": ""
  },
  {
    "id": 141,
    "upazilaId": 16,
    "nameBn": "খাদিমপুর",
    "nameEn": ""
  },
  {
    "id": 142,
    "upazilaId": 16,
    "nameBn": "জেহালা",
    "nameEn": ""
  },
  {
    "id": 143,
    "upazilaId": 16,
    "nameBn": "বেলগাছি",
    "nameEn": ""
  },
  {
    "id": 144,
    "upazilaId": 16,
    "nameBn": "ডাউকী",
    "nameEn": ""
  },
  {
    "id": 145,
    "upazilaId": 16,
    "nameBn": "জামজামী",
    "nameEn": ""
  },
  {
    "id": 146,
    "upazilaId": 16,
    "nameBn": "নাগদাহ",
    "nameEn": ""
  },
  {
    "id": 147,
    "upazilaId": 16,
    "nameBn": "খাসকররা",
    "nameEn": ""
  },
  {
    "id": 148,
    "upazilaId": 16,
    "nameBn": "কালিদাসপুর",
    "nameEn": ""
  },
  {
    "id": 149,
    "upazilaId": 16,
    "nameBn": "চিৎলা",
    "nameEn": ""
  },
  {
    "id": 150,
    "upazilaId": 17,
    "nameBn": "আলুকদিয়া",
    "nameEn": ""
  },
  {
    "id": 151,
    "upazilaId": 17,
    "nameBn": "মোমিনপুর",
    "nameEn": ""
  },
  {
    "id": 152,
    "upazilaId": 17,
    "nameBn": "তিতুদহ",
    "nameEn": ""
  },
  {
    "id": 153,
    "upazilaId": 17,
    "nameBn": "শংকরচন্দ্র",
    "nameEn": ""
  },
  {
    "id": 154,
    "upazilaId": 17,
    "nameBn": "বেগমপুর",
    "nameEn": ""
  },
  {
    "id": 155,
    "upazilaId": 17,
    "nameBn": "কুতুবপুর",
    "nameEn": ""
  },
  {
    "id": 156,
    "upazilaId": 17,
    "nameBn": "পদ্মবিলা",
    "nameEn": ""
  },
  {
    "id": 157,
    "upazilaId": 17,
    "nameBn": "মাখালডাঙ্গা‌",
    "nameEn": ""
  },
  {
    "id": 158,
    "upazilaId": 17,
    "nameBn": "গড়াইটুপি",
    "nameEn": ""
  },
  {
    "id": 159,
    "upazilaId": 17,
    "nameBn": "নেহালপুর",
    "nameEn": ""
  },
  {
    "id": 160,
    "upazilaId": 18,
    "nameBn": "উথলী",
    "nameEn": ""
  },
  {
    "id": 161,
    "upazilaId": 18,
    "nameBn": "আন্দুলবাড়িয়া",
    "nameEn": ""
  },
  {
    "id": 162,
    "upazilaId": 18,
    "nameBn": "বাঁকা",
    "nameEn": ""
  },
  {
    "id": 163,
    "upazilaId": 18,
    "nameBn": "রায়পুর",
    "nameEn": ""
  },
  {
    "id": 164,
    "upazilaId": 18,
    "nameBn": "সীমান্ত",
    "nameEn": ""
  },
  {
    "id": 165,
    "upazilaId": 18,
    "nameBn": "হাসাদাহ",
    "nameEn": ""
  },
  {
    "id": 166,
    "upazilaId": 18,
    "nameBn": "মনোহরপুর",
    "nameEn": ""
  },
  {
    "id": 167,
    "upazilaId": 18,
    "nameBn": "কেডিকে",
    "nameEn": ""
  },
  {
    "id": 168,
    "upazilaId": 19,
    "nameBn": "দামুড়হুদা",
    "nameEn": ""
  },
  {
    "id": 169,
    "upazilaId": 19,
    "nameBn": "কার্পাসডাঙ্গা",
    "nameEn": ""
  },
  {
    "id": 170,
    "upazilaId": 19,
    "nameBn": "নতিপোতা",
    "nameEn": ""
  },
  {
    "id": 171,
    "upazilaId": 19,
    "nameBn": "হাউলী",
    "nameEn": ""
  },
  {
    "id": 172,
    "upazilaId": 19,
    "nameBn": "কুড়ুলগাছী",
    "nameEn": ""
  },
  {
    "id": 173,
    "upazilaId": 19,
    "nameBn": "পারকৃষ্ণপুর মদনা",
    "nameEn": ""
  },
  {
    "id": 174,
    "upazilaId": 19,
    "nameBn": "জুড়ানপুর এবং নাটুদহ",
    "nameEn": ""
  },
  {
    "id": 175,
    "upazilaId": 20,
    "nameBn": "সুন্দরপুর-দুর্গাপুর",
    "nameEn": ""
  },
  {
    "id": 176,
    "upazilaId": 20,
    "nameBn": "জামাল",
    "nameEn": ""
  },
  {
    "id": 177,
    "upazilaId": 20,
    "nameBn": "কোলা",
    "nameEn": ""
  },
  {
    "id": 178,
    "upazilaId": 20,
    "nameBn": "নিয়ামতপুর",
    "nameEn": ""
  },
  {
    "id": 179,
    "upazilaId": 20,
    "nameBn": "শিমলা-রোকনপুর",
    "nameEn": ""
  },
  {
    "id": 180,
    "upazilaId": 20,
    "nameBn": "ত্রিলোচনপুর",
    "nameEn": ""
  },
  {
    "id": 181,
    "upazilaId": 20,
    "nameBn": "রায়গ্রাম",
    "nameEn": ""
  },
  {
    "id": 182,
    "upazilaId": 20,
    "nameBn": "মালিয়াট",
    "nameEn": ""
  },
  {
    "id": 183,
    "upazilaId": 20,
    "nameBn": "বারবাজার",
    "nameEn": ""
  },
  {
    "id": 184,
    "upazilaId": 20,
    "nameBn": "কাষ্টভাঙ্গা",
    "nameEn": ""
  },
  {
    "id": 185,
    "upazilaId": 20,
    "nameBn": "রাখালগাছি",
    "nameEn": ""
  },
  {
    "id": 186,
    "upazilaId": 21,
    "nameBn": "সাফদারপুর",
    "nameEn": ""
  },
  {
    "id": 187,
    "upazilaId": 21,
    "nameBn": "দোড়া",
    "nameEn": ""
  },
  {
    "id": 188,
    "upazilaId": 21,
    "nameBn": "কুশনা",
    "nameEn": ""
  },
  {
    "id": 189,
    "upazilaId": 21,
    "nameBn": "বলুহর",
    "nameEn": ""
  },
  {
    "id": 190,
    "upazilaId": 21,
    "nameBn": "এলাঙ্গী",
    "nameEn": ""
  },
  {
    "id": 191,
    "upazilaId": 22,
    "nameBn": "সাধুহাটী",
    "nameEn": ""
  },
  {
    "id": 192,
    "upazilaId": 22,
    "nameBn": "মধুহাটী",
    "nameEn": ""
  },
  {
    "id": 193,
    "upazilaId": 22,
    "nameBn": "সাগান্না",
    "nameEn": ""
  },
  {
    "id": 194,
    "upazilaId": 22,
    "nameBn": "হলিধানী",
    "nameEn": ""
  },
  {
    "id": 195,
    "upazilaId": 22,
    "nameBn": "কুমড়াবাড়ীয়া",
    "nameEn": ""
  },
  {
    "id": 196,
    "upazilaId": 22,
    "nameBn": "গান্না",
    "nameEn": ""
  },
  {
    "id": 197,
    "upazilaId": 22,
    "nameBn": "মহারাজপুর",
    "nameEn": ""
  },
  {
    "id": 198,
    "upazilaId": 22,
    "nameBn": "পাগলাকানাই",
    "nameEn": ""
  },
  {
    "id": 199,
    "upazilaId": 22,
    "nameBn": "পোড়াহাটী",
    "nameEn": ""
  },
  {
    "id": 200,
    "upazilaId": 22,
    "nameBn": "হরিশংকরপুর",
    "nameEn": ""
  },
  {
    "id": 201,
    "upazilaId": 22,
    "nameBn": "পদ্মাকর",
    "nameEn": ""
  },
  {
    "id": 202,
    "upazilaId": 22,
    "nameBn": "দোগাছি",
    "nameEn": ""
  },
  {
    "id": 203,
    "upazilaId": 22,
    "nameBn": "ফুরসন্দি",
    "nameEn": ""
  },
  {
    "id": 204,
    "upazilaId": 22,
    "nameBn": "ঘোড়শাল",
    "nameEn": ""
  },
  {
    "id": 205,
    "upazilaId": 22,
    "nameBn": "কালীচরণপুর",
    "nameEn": ""
  },
  {
    "id": 206,
    "upazilaId": 22,
    "nameBn": "সুরাট",
    "nameEn": ""
  },
  {
    "id": 207,
    "upazilaId": 22,
    "nameBn": "নলডাঙ্গা",
    "nameEn": ""
  },
  {
    "id": 208,
    "upazilaId": 23,
    "nameBn": "এসবিকে",
    "nameEn": ""
  },
  {
    "id": 209,
    "upazilaId": 23,
    "nameBn": "ফতেপুর",
    "nameEn": ""
  },
  {
    "id": 210,
    "upazilaId": 23,
    "nameBn": "পান্তাপাড়া",
    "nameEn": ""
  },
  {
    "id": 211,
    "upazilaId": 23,
    "nameBn": "স্বরুপপুর",
    "nameEn": ""
  },
  {
    "id": 212,
    "upazilaId": 23,
    "nameBn": "শ্যামকুড়",
    "nameEn": ""
  },
  {
    "id": 213,
    "upazilaId": 23,
    "nameBn": "নেপা",
    "nameEn": ""
  },
  {
    "id": 214,
    "upazilaId": 23,
    "nameBn": "কাজীরবেড়",
    "nameEn": ""
  },
  {
    "id": 215,
    "upazilaId": 23,
    "nameBn": "বাঁশবাড়ীয়া",
    "nameEn": ""
  },
  {
    "id": 216,
    "upazilaId": 23,
    "nameBn": "যাদবপুর",
    "nameEn": ""
  },
  {
    "id": 217,
    "upazilaId": 23,
    "nameBn": "নাটিমা",
    "nameEn": ""
  },
  {
    "id": 218,
    "upazilaId": 23,
    "nameBn": "মান্দারবাড়িয়া",
    "nameEn": ""
  },
  {
    "id": 219,
    "upazilaId": 23,
    "nameBn": "আজমপুর",
    "nameEn": ""
  },
  {
    "id": 220,
    "upazilaId": 24,
    "nameBn": "ত্রিবেনী",
    "nameEn": ""
  },
  {
    "id": 221,
    "upazilaId": 24,
    "nameBn": "মির্জাপুর",
    "nameEn": ""
  },
  {
    "id": 222,
    "upazilaId": 24,
    "nameBn": "দিগনগর",
    "nameEn": ""
  },
  {
    "id": 223,
    "upazilaId": 24,
    "nameBn": "কাঁচেরকোল",
    "nameEn": ""
  },
  {
    "id": 224,
    "upazilaId": 24,
    "nameBn": "সারুটিয়া",
    "nameEn": ""
  },
  {
    "id": 225,
    "upazilaId": 24,
    "nameBn": "হাকিমপুর",
    "nameEn": ""
  },
  {
    "id": 226,
    "upazilaId": 24,
    "nameBn": "ধলহরাচন্দ্র",
    "nameEn": ""
  },
  {
    "id": 227,
    "upazilaId": 24,
    "nameBn": "মনোহরপুর",
    "nameEn": ""
  },
  {
    "id": 228,
    "upazilaId": 24,
    "nameBn": "বগুড়া",
    "nameEn": ""
  },
  {
    "id": 229,
    "upazilaId": 24,
    "nameBn": "আবাইপুর",
    "nameEn": ""
  },
  {
    "id": 230,
    "upazilaId": 24,
    "nameBn": "নিত্যানন্দপুর",
    "nameEn": ""
  },
  {
    "id": 231,
    "upazilaId": 24,
    "nameBn": "উমেদপুর",
    "nameEn": ""
  },
  {
    "id": 232,
    "upazilaId": 24,
    "nameBn": "দুধসর",
    "nameEn": ""
  },
  {
    "id": 233,
    "upazilaId": 24,
    "nameBn": "ফুলহরি",
    "nameEn": ""
  },
  {
    "id": 234,
    "upazilaId": 25,
    "nameBn": "ভায়না",
    "nameEn": ""
  },
  {
    "id": 235,
    "upazilaId": 25,
    "nameBn": "জোড়াদহ",
    "nameEn": ""
  },
  {
    "id": 236,
    "upazilaId": 25,
    "nameBn": "তাহেরহুদা",
    "nameEn": ""
  },
  {
    "id": 237,
    "upazilaId": 25,
    "nameBn": "দৌলতপুর",
    "nameEn": ""
  },
  {
    "id": 238,
    "upazilaId": 25,
    "nameBn": "কাপাশহাটিয়া",
    "nameEn": ""
  },
  {
    "id": 239,
    "upazilaId": 25,
    "nameBn": "ফলসী",
    "nameEn": ""
  },
  {
    "id": 240,
    "upazilaId": 25,
    "nameBn": "রঘুনাথপুর",
    "nameEn": ""
  },
  {
    "id": 241,
    "upazilaId": 25,
    "nameBn": "চাঁদপুর",
    "nameEn": ""
  },
  {
    "id": 242,
    "upazilaId": 26,
    "nameBn": "বাবরা হাচলা",
    "nameEn": ""
  },
  {
    "id": 243,
    "upazilaId": 26,
    "nameBn": "পুরুলিয়া",
    "nameEn": ""
  },
  {
    "id": 244,
    "upazilaId": 26,
    "nameBn": "হামিদপুর",
    "nameEn": ""
  },
  {
    "id": 245,
    "upazilaId": 26,
    "nameBn": "মাউলী",
    "nameEn": ""
  },
  {
    "id": 246,
    "upazilaId": 26,
    "nameBn": "সালামাবাদ",
    "nameEn": ""
  },
  {
    "id": 247,
    "upazilaId": 26,
    "nameBn": "খাশিয়াল",
    "nameEn": ""
  },
  {
    "id": 248,
    "upazilaId": 26,
    "nameBn": "জয়নগর",
    "nameEn": ""
  },
  {
    "id": 249,
    "upazilaId": 26,
    "nameBn": "কলাবাড়ীয়া",
    "nameEn": ""
  },
  {
    "id": 250,
    "upazilaId": 26,
    "nameBn": "বাঐসোনা",
    "nameEn": ""
  },
  {
    "id": 251,
    "upazilaId": 26,
    "nameBn": "পহরডাঙ্গা",
    "nameEn": ""
  },
  {
    "id": 252,
    "upazilaId": 26,
    "nameBn": "পেড়লী",
    "nameEn": ""
  },
  {
    "id": 253,
    "upazilaId": 26,
    "nameBn": "চাঁচুড়ী",
    "nameEn": ""
  },
  {
    "id": 254,
    "upazilaId": 26,
    "nameBn": "বড়নাল ইলিয়াছাবাদ",
    "nameEn": ""
  },
  {
    "id": 255,
    "upazilaId": 26,
    "nameBn": "পাঁচগ্রাম",
    "nameEn": ""
  },
  {
    "id": 256,
    "upazilaId": 27,
    "nameBn": "মাইজপাড়া",
    "nameEn": ""
  },
  {
    "id": 257,
    "upazilaId": 27,
    "nameBn": "হবখালি",
    "nameEn": ""
  },
  {
    "id": 258,
    "upazilaId": 27,
    "nameBn": "চন্ডিবরপুর",
    "nameEn": ""
  },
  {
    "id": 259,
    "upazilaId": 27,
    "nameBn": "আউড়িয়া",
    "nameEn": ""
  },
  {
    "id": 260,
    "upazilaId": 27,
    "nameBn": "শাহাবাদ",
    "nameEn": ""
  },
  {
    "id": 261,
    "upazilaId": 27,
    "nameBn": "তুলারামপুর",
    "nameEn": ""
  },
  {
    "id": 262,
    "upazilaId": 27,
    "nameBn": "শেখহাটী",
    "nameEn": ""
  },
  {
    "id": 263,
    "upazilaId": 27,
    "nameBn": "কলোড়া",
    "nameEn": ""
  },
  {
    "id": 264,
    "upazilaId": 27,
    "nameBn": "সিঙ্গাশোলপুর",
    "nameEn": ""
  },
  {
    "id": 265,
    "upazilaId": 27,
    "nameBn": "ভদ্রবিলা",
    "nameEn": ""
  },
  {
    "id": 266,
    "upazilaId": 27,
    "nameBn": "বাঁশগ্রাম",
    "nameEn": ""
  },
  {
    "id": 267,
    "upazilaId": 27,
    "nameBn": "বিছালী",
    "nameEn": ""
  },
  {
    "id": 268,
    "upazilaId": 27,
    "nameBn": "মুলিয়া",
    "nameEn": ""
  },
  {
    "id": 269,
    "upazilaId": 28,
    "nameBn": "নলদী",
    "nameEn": ""
  },
  {
    "id": 270,
    "upazilaId": 28,
    "nameBn": "লাহুড়িয়া",
    "nameEn": ""
  },
  {
    "id": 271,
    "upazilaId": 28,
    "nameBn": "শালনগর",
    "nameEn": ""
  },
  {
    "id": 272,
    "upazilaId": 28,
    "nameBn": "নোয়াগ্রাম",
    "nameEn": ""
  },
  {
    "id": 273,
    "upazilaId": 28,
    "nameBn": "লক্ষীপাশা",
    "nameEn": ""
  },
  {
    "id": 274,
    "upazilaId": 28,
    "nameBn": "জয়পুর",
    "nameEn": ""
  },
  {
    "id": 275,
    "upazilaId": 28,
    "nameBn": "লোহাগড়া",
    "nameEn": ""
  },
  {
    "id": 276,
    "upazilaId": 28,
    "nameBn": "দিঘলিয়া",
    "nameEn": ""
  },
  {
    "id": 277,
    "upazilaId": 28,
    "nameBn": "মল্লিকপুর",
    "nameEn": ""
  },
  {
    "id": 278,
    "upazilaId": 28,
    "nameBn": "কোটাকোল",
    "nameEn": ""
  },
  {
    "id": 279,
    "upazilaId": 28,
    "nameBn": "ইতনা",
    "nameEn": ""
  },
  {
    "id": 280,
    "upazilaId": 28,
    "nameBn": "কাশিপুর",
    "nameEn": ""
  },
  {
    "id": 281,
    "upazilaId": 29,
    "nameBn": "বাধাল",
    "nameEn": ""
  },
  {
    "id": 282,
    "upazilaId": 29,
    "nameBn": "গজালিয়া",
    "nameEn": ""
  },
  {
    "id": 283,
    "upazilaId": 29,
    "nameBn": "ধোপাখালী",
    "nameEn": ""
  },
  {
    "id": 284,
    "upazilaId": 29,
    "nameBn": "মঘিয়া",
    "nameEn": ""
  },
  {
    "id": 285,
    "upazilaId": 29,
    "nameBn": "কচুয়া",
    "nameEn": ""
  },
  {
    "id": 286,
    "upazilaId": 29,
    "nameBn": "গোপালপুর",
    "nameEn": ""
  },
  {
    "id": 287,
    "upazilaId": 29,
    "nameBn": "রাড়ীপাড়া",
    "nameEn": ""
  },
  {
    "id": 288,
    "upazilaId": 30,
    "nameBn": "বড়বাড়িয়া",
    "nameEn": ""
  },
  {
    "id": 289,
    "upazilaId": 30,
    "nameBn": "কলাতলা",
    "nameEn": ""
  },
  {
    "id": 290,
    "upazilaId": 30,
    "nameBn": "হিজলা",
    "nameEn": ""
  },
  {
    "id": 291,
    "upazilaId": 30,
    "nameBn": "শিবপুর",
    "nameEn": ""
  },
  {
    "id": 292,
    "upazilaId": 30,
    "nameBn": "চিতলমারী",
    "nameEn": ""
  },
  {
    "id": 293,
    "upazilaId": 30,
    "nameBn": "চরবানিয়ারী",
    "nameEn": ""
  },
  {
    "id": 294,
    "upazilaId": 30,
    "nameBn": "সন্তোষপুর",
    "nameEn": ""
  },
  {
    "id": 295,
    "upazilaId": 31,
    "nameBn": "বেতাগা",
    "nameEn": ""
  },
  {
    "id": 296,
    "upazilaId": 31,
    "nameBn": "লখপুর",
    "nameEn": ""
  },
  {
    "id": 297,
    "upazilaId": 31,
    "nameBn": "পিলজংগ",
    "nameEn": ""
  },
  {
    "id": 298,
    "upazilaId": 31,
    "nameBn": "ফকিরহাট",
    "nameEn": ""
  },
  {
    "id": 299,
    "upazilaId": 31,
    "nameBn": "বাহিরদিয়া মানসা",
    "nameEn": ""
  },
  {
    "id": 300,
    "upazilaId": 31,
    "nameBn": "নলধা মৌভোগ",
    "nameEn": ""
  },
  {
    "id": 301,
    "upazilaId": 31,
    "nameBn": "মূলঘর",
    "nameEn": ""
  },
  {
    "id": 302,
    "upazilaId": 31,
    "nameBn": "শুভদিয়া",
    "nameEn": ""
  },
  {
    "id": 303,
    "upazilaId": 32,
    "nameBn": "কাড়াপাড়া",
    "nameEn": ""
  },
  {
    "id": 304,
    "upazilaId": 32,
    "nameBn": "বেমরতা",
    "nameEn": ""
  },
  {
    "id": 305,
    "upazilaId": 32,
    "nameBn": "গোটাপাড়া",
    "nameEn": ""
  },
  {
    "id": 306,
    "upazilaId": 32,
    "nameBn": "বিষ্ণুপুর",
    "nameEn": ""
  },
  {
    "id": 307,
    "upazilaId": 32,
    "nameBn": "বারুইপাড়া",
    "nameEn": ""
  },
  {
    "id": 308,
    "upazilaId": 32,
    "nameBn": "যাত্রাপুর",
    "nameEn": ""
  },
  {
    "id": 309,
    "upazilaId": 32,
    "nameBn": "ষাটগুম্বজ",
    "nameEn": ""
  },
  {
    "id": 310,
    "upazilaId": 32,
    "nameBn": "খানপুর",
    "nameEn": ""
  },
  {
    "id": 311,
    "upazilaId": 32,
    "nameBn": "রাখালগাছি",
    "nameEn": ""
  },
  {
    "id": 312,
    "upazilaId": 32,
    "nameBn": "ডেমা",
    "nameEn": ""
  },
  {
    "id": 313,
    "upazilaId": 33,
    "nameBn": "চাঁদপাই",
    "nameEn": ""
  },
  {
    "id": 314,
    "upazilaId": 33,
    "nameBn": "বুড়িরডাঙ্গা",
    "nameEn": ""
  },
  {
    "id": 315,
    "upazilaId": 33,
    "nameBn": "মিঠাখালী",
    "nameEn": ""
  },
  {
    "id": 316,
    "upazilaId": 33,
    "nameBn": "সোনাইলতলা",
    "nameEn": ""
  },
  {
    "id": 317,
    "upazilaId": 33,
    "nameBn": "সুন্দরবন",
    "nameEn": ""
  },
  {
    "id": 318,
    "upazilaId": 33,
    "nameBn": "চিলা",
    "nameEn": ""
  },
  {
    "id": 319,
    "upazilaId": 34,
    "nameBn": "তেলিগাতী",
    "nameEn": ""
  },
  {
    "id": 320,
    "upazilaId": 34,
    "nameBn": "পঞ্চকরণ",
    "nameEn": ""
  },
  {
    "id": 321,
    "upazilaId": 34,
    "nameBn": "পুটিখালী",
    "nameEn": ""
  },
  {
    "id": 322,
    "upazilaId": 34,
    "nameBn": "দৈবজ্ঞহাটি",
    "nameEn": ""
  },
  {
    "id": 323,
    "upazilaId": 34,
    "nameBn": "রামচন্দ্রপুর",
    "nameEn": ""
  },
  {
    "id": 324,
    "upazilaId": 34,
    "nameBn": "চিংড়াখালী",
    "nameEn": ""
  },
  {
    "id": 325,
    "upazilaId": 34,
    "nameBn": "হোগলাপাশা",
    "nameEn": ""
  },
  {
    "id": 326,
    "upazilaId": 34,
    "nameBn": "বনগ্রাম",
    "nameEn": ""
  },
  {
    "id": 327,
    "upazilaId": 34,
    "nameBn": "বলইবুনিয়া",
    "nameEn": ""
  },
  {
    "id": 328,
    "upazilaId": 34,
    "nameBn": "হোগলাবুনিয়া",
    "nameEn": ""
  },
  {
    "id": 329,
    "upazilaId": 34,
    "nameBn": "বহরবুনিয়া",
    "nameEn": ""
  },
  {
    "id": 330,
    "upazilaId": 34,
    "nameBn": "জিউধরা",
    "nameEn": ""
  },
  {
    "id": 331,
    "upazilaId": 34,
    "nameBn": "নিশানবাড়িয়া",
    "nameEn": ""
  },
  {
    "id": 332,
    "upazilaId": 34,
    "nameBn": "বারইখালী",
    "nameEn": ""
  },
  {
    "id": 333,
    "upazilaId": 34,
    "nameBn": "মোড়েলগঞ্জ",
    "nameEn": ""
  },
  {
    "id": 334,
    "upazilaId": 34,
    "nameBn": "খাউলিয়া",
    "nameEn": ""
  },
  {
    "id": 335,
    "upazilaId": 35,
    "nameBn": "উদয়পুর",
    "nameEn": ""
  },
  {
    "id": 336,
    "upazilaId": 35,
    "nameBn": "চুনখোলা",
    "nameEn": ""
  },
  {
    "id": 337,
    "upazilaId": 35,
    "nameBn": "গাংনী",
    "nameEn": ""
  },
  {
    "id": 338,
    "upazilaId": 35,
    "nameBn": "কুলিয়া",
    "nameEn": ""
  },
  {
    "id": 339,
    "upazilaId": 35,
    "nameBn": "গাওলা",
    "nameEn": ""
  },
  {
    "id": 340,
    "upazilaId": 35,
    "nameBn": "কোদালিয়া",
    "nameEn": ""
  },
  {
    "id": 341,
    "upazilaId": 35,
    "nameBn": "আটজুড়ী",
    "nameEn": ""
  },
  {
    "id": 342,
    "upazilaId": 36,
    "nameBn": "গৌরম্ভা",
    "nameEn": ""
  },
  {
    "id": 343,
    "upazilaId": 36,
    "nameBn": "উজলকুড়",
    "nameEn": ""
  },
  {
    "id": 344,
    "upazilaId": 36,
    "nameBn": "বাইনতলা",
    "nameEn": ""
  },
  {
    "id": 345,
    "upazilaId": 36,
    "nameBn": "রামপাল",
    "nameEn": ""
  },
  {
    "id": 346,
    "upazilaId": 36,
    "nameBn": "হুড়কা",
    "nameEn": ""
  },
  {
    "id": 347,
    "upazilaId": 36,
    "nameBn": "রাজনগর",
    "nameEn": ""
  },
  {
    "id": 348,
    "upazilaId": 36,
    "nameBn": "পেড়িখালী",
    "nameEn": ""
  },
  {
    "id": 349,
    "upazilaId": 36,
    "nameBn": "ভোজপাতিয়া",
    "nameEn": ""
  },
  {
    "id": 350,
    "upazilaId": 36,
    "nameBn": "মল্লিকেরবেড়",
    "nameEn": ""
  },
  {
    "id": 351,
    "upazilaId": 36,
    "nameBn": "বাঁশতলী",
    "nameEn": ""
  },
  {
    "id": 352,
    "upazilaId": 37,
    "nameBn": "ধানসাগর",
    "nameEn": ""
  },
  {
    "id": 353,
    "upazilaId": 37,
    "nameBn": "খোন্তাকাটা",
    "nameEn": ""
  },
  {
    "id": 354,
    "upazilaId": 37,
    "nameBn": "রায়েন্দা",
    "nameEn": ""
  },
  {
    "id": 355,
    "upazilaId": 37,
    "nameBn": "সাউথখালী",
    "nameEn": ""
  },
  {
    "id": 356,
    "upazilaId": 38,
    "nameBn": "আঠারখাদা",
    "nameEn": ""
  },
  {
    "id": 357,
    "upazilaId": 38,
    "nameBn": "কুচিয়ামোড়া",
    "nameEn": ""
  },
  {
    "id": 358,
    "upazilaId": 38,
    "nameBn": "কছুন্দী",
    "nameEn": ""
  },
  {
    "id": 359,
    "upazilaId": 38,
    "nameBn": "গোপালগ্রাম",
    "nameEn": ""
  },
  {
    "id": 360,
    "upazilaId": 38,
    "nameBn": "চাউলিয়া",
    "nameEn": ""
  },
  {
    "id": 361,
    "upazilaId": 38,
    "nameBn": "জগদল",
    "nameEn": ""
  },
  {
    "id": 362,
    "upazilaId": 38,
    "nameBn": "বগিয়া",
    "nameEn": ""
  },
  {
    "id": 363,
    "upazilaId": 38,
    "nameBn": "বেরইল পলিতা",
    "nameEn": ""
  },
  {
    "id": 364,
    "upazilaId": 38,
    "nameBn": "মঘী",
    "nameEn": ""
  },
  {
    "id": 365,
    "upazilaId": 38,
    "nameBn": "রাঘবদাইড়",
    "nameEn": ""
  },
  {
    "id": 366,
    "upazilaId": 38,
    "nameBn": "শত্রুজিৎপুর",
    "nameEn": ""
  },
  {
    "id": 367,
    "upazilaId": 38,
    "nameBn": "হাজীপুর",
    "nameEn": ""
  },
  {
    "id": 368,
    "upazilaId": 38,
    "nameBn": "হাজরাপুর",
    "nameEn": ""
  },
  {
    "id": 369,
    "upazilaId": 39,
    "nameBn": "বাবুখালী",
    "nameEn": ""
  },
  {
    "id": 370,
    "upazilaId": 39,
    "nameBn": "বিনোদপুর",
    "nameEn": ""
  },
  {
    "id": 371,
    "upazilaId": 39,
    "nameBn": "দীঘা",
    "nameEn": ""
  },
  {
    "id": 372,
    "upazilaId": 39,
    "nameBn": "রাজাপুর",
    "nameEn": ""
  },
  {
    "id": 373,
    "upazilaId": 39,
    "nameBn": "বালিদিয়া",
    "nameEn": ""
  },
  {
    "id": 374,
    "upazilaId": 39,
    "nameBn": "মহম্মদপুর",
    "nameEn": ""
  },
  {
    "id": 375,
    "upazilaId": 39,
    "nameBn": "পলাশবাড়িয়া",
    "nameEn": ""
  },
  {
    "id": 376,
    "upazilaId": 39,
    "nameBn": "নহাটা",
    "nameEn": ""
  },
  {
    "id": 377,
    "upazilaId": 40,
    "nameBn": "শতখালী",
    "nameEn": ""
  },
  {
    "id": 378,
    "upazilaId": 40,
    "nameBn": "শালিখা",
    "nameEn": ""
  },
  {
    "id": 379,
    "upazilaId": 40,
    "nameBn": "আড়পাড়া",
    "nameEn": ""
  },
  {
    "id": 380,
    "upazilaId": 40,
    "nameBn": "ধনেশ্বরগাতী",
    "nameEn": ""
  },
  {
    "id": 381,
    "upazilaId": 40,
    "nameBn": "বুনাগাতী",
    "nameEn": ""
  },
  {
    "id": 382,
    "upazilaId": 40,
    "nameBn": "গঙ্গারামপুর",
    "nameEn": ""
  },
  {
    "id": 383,
    "upazilaId": 40,
    "nameBn": "তালখড়ি",
    "nameEn": ""
  },
  {
    "id": 384,
    "upazilaId": 41,
    "nameBn": "গয়েশপুর",
    "nameEn": ""
  },
  {
    "id": 385,
    "upazilaId": 41,
    "nameBn": "আমলসার",
    "nameEn": ""
  },
  {
    "id": 386,
    "upazilaId": 41,
    "nameBn": "শ্রীকোল",
    "nameEn": ""
  },
  {
    "id": 387,
    "upazilaId": 41,
    "nameBn": "শ্রীপুর",
    "nameEn": ""
  },
  {
    "id": 388,
    "upazilaId": 41,
    "nameBn": "দ্বারিয়াপুর",
    "nameEn": ""
  },
  {
    "id": 389,
    "upazilaId": 41,
    "nameBn": "কাদিরপাড়া",
    "nameEn": ""
  },
  {
    "id": 390,
    "upazilaId": 41,
    "nameBn": "সব্দালপুর",
    "nameEn": ""
  },
  {
    "id": 391,
    "upazilaId": 41,
    "nameBn": "নাকোল",
    "nameEn": ""
  },
  {
    "id": 392,
    "upazilaId": 42,
    "nameBn": "কাথুলী",
    "nameEn": ""
  },
  {
    "id": 393,
    "upazilaId": 42,
    "nameBn": "তেতুঁলবাড়ীয়া",
    "nameEn": ""
  },
  {
    "id": 394,
    "upazilaId": 42,
    "nameBn": "কাজিপুর",
    "nameEn": ""
  },
  {
    "id": 395,
    "upazilaId": 42,
    "nameBn": "বামন্দি",
    "nameEn": ""
  },
  {
    "id": 396,
    "upazilaId": 42,
    "nameBn": "মটমূড়া",
    "nameEn": ""
  },
  {
    "id": 397,
    "upazilaId": 42,
    "nameBn": "ষোলটাকা",
    "nameEn": ""
  },
  {
    "id": 398,
    "upazilaId": 42,
    "nameBn": "সাহারবাটি",
    "nameEn": ""
  },
  {
    "id": 399,
    "upazilaId": 42,
    "nameBn": "ধানখোলা",
    "nameEn": ""
  },
  {
    "id": 400,
    "upazilaId": 42,
    "nameBn": "রায়পুর",
    "nameEn": ""
  },
  {
    "id": 401,
    "upazilaId": 43,
    "nameBn": "কুতুবপুর",
    "nameEn": ""
  },
  {
    "id": 402,
    "upazilaId": 43,
    "nameBn": "বুড়িপোতা",
    "nameEn": ""
  },
  {
    "id": 403,
    "upazilaId": 43,
    "nameBn": "আমঝুপি",
    "nameEn": ""
  },
  {
    "id": 404,
    "upazilaId": 43,
    "nameBn": "আমদহ",
    "nameEn": ""
  },
  {
    "id": 405,
    "upazilaId": 43,
    "nameBn": "পিরোজপুর",
    "nameEn": ""
  },
  {
    "id": 406,
    "upazilaId": 44,
    "nameBn": "দারিয়াপুর",
    "nameEn": ""
  },
  {
    "id": 407,
    "upazilaId": 44,
    "nameBn": "বাগোয়ান",
    "nameEn": ""
  },
  {
    "id": 408,
    "upazilaId": 44,
    "nameBn": "মহাজনপুর",
    "nameEn": ""
  },
  {
    "id": 409,
    "upazilaId": 44,
    "nameBn": "মোনখালী",
    "nameEn": ""
  },
  {
    "id": 410,
    "upazilaId": 45,
    "nameBn": "পায়রা",
    "nameEn": ""
  },
  {
    "id": 411,
    "upazilaId": 45,
    "nameBn": "চলিশিয়া",
    "nameEn": ""
  },
  {
    "id": 412,
    "upazilaId": 45,
    "nameBn": "প্রেমবাগ",
    "nameEn": ""
  },
  {
    "id": 413,
    "upazilaId": 45,
    "nameBn": "বাঘুটিয়া",
    "nameEn": ""
  },
  {
    "id": 414,
    "upazilaId": 45,
    "nameBn": "শুভরাড়া",
    "nameEn": ""
  },
  {
    "id": 415,
    "upazilaId": 45,
    "nameBn": "শ্রীধরপুর",
    "nameEn": ""
  },
  {
    "id": 416,
    "upazilaId": 45,
    "nameBn": "সিদ্ধিপাশা",
    "nameEn": ""
  },
  {
    "id": 417,
    "upazilaId": 45,
    "nameBn": "সুন্দলী",
    "nameEn": ""
  },
  {
    "id": 418,
    "upazilaId": 46,
    "nameBn": "ত্রিমোহিনী",
    "nameEn": ""
  },
  {
    "id": 419,
    "upazilaId": 46,
    "nameBn": "সাগরদাড়ী",
    "nameEn": ""
  },
  {
    "id": 420,
    "upazilaId": 46,
    "nameBn": "মজিদপুর",
    "nameEn": ""
  },
  {
    "id": 421,
    "upazilaId": 46,
    "nameBn": "বিদ্যানন্দকাটি",
    "nameEn": ""
  },
  {
    "id": 422,
    "upazilaId": 46,
    "nameBn": "মঙ্গলকোট",
    "nameEn": ""
  },
  {
    "id": 423,
    "upazilaId": 46,
    "nameBn": "কেশবপুর",
    "nameEn": ""
  },
  {
    "id": 424,
    "upazilaId": 46,
    "nameBn": "পাজিয়া",
    "nameEn": ""
  },
  {
    "id": 425,
    "upazilaId": 46,
    "nameBn": "সুফলাকাটি",
    "nameEn": ""
  },
  {
    "id": 426,
    "upazilaId": 46,
    "nameBn": "গৌরিঘোনা",
    "nameEn": ""
  },
  {
    "id": 427,
    "upazilaId": 46,
    "nameBn": "সাতবাড়িয়া",
    "nameEn": ""
  },
  {
    "id": 428,
    "upazilaId": 46,
    "nameBn": "হাসানপুর",
    "nameEn": ""
  },
  {
    "id": 429,
    "upazilaId": 47,
    "nameBn": "ফুলসারা",
    "nameEn": ""
  },
  {
    "id": 430,
    "upazilaId": 47,
    "nameBn": "পাশাপোল",
    "nameEn": ""
  },
  {
    "id": 431,
    "upazilaId": 47,
    "nameBn": "সিংহঝুলী",
    "nameEn": ""
  },
  {
    "id": 432,
    "upazilaId": 47,
    "nameBn": "ধুলিয়ানী",
    "nameEn": ""
  },
  {
    "id": 433,
    "upazilaId": 47,
    "nameBn": "চৌগাছা",
    "nameEn": ""
  },
  {
    "id": 434,
    "upazilaId": 47,
    "nameBn": "জগদিশপুর",
    "nameEn": ""
  },
  {
    "id": 435,
    "upazilaId": 47,
    "nameBn": "পাতিবিলা",
    "nameEn": ""
  },
  {
    "id": 436,
    "upazilaId": 47,
    "nameBn": "হাকিমপুর",
    "nameEn": ""
  },
  {
    "id": 437,
    "upazilaId": 47,
    "nameBn": "স্বরূপদাহ",
    "nameEn": ""
  },
  {
    "id": 438,
    "upazilaId": 47,
    "nameBn": "নারায়ণপুর",
    "nameEn": ""
  },
  {
    "id": 439,
    "upazilaId": 47,
    "nameBn": "সুখপুকুরিয়া",
    "nameEn": ""
  },
  {
    "id": 440,
    "upazilaId": 48,
    "nameBn": "গঙ্গানন্দপুর",
    "nameEn": ""
  },
  {
    "id": 441,
    "upazilaId": 48,
    "nameBn": "মাগুরা",
    "nameEn": ""
  },
  {
    "id": 442,
    "upazilaId": 48,
    "nameBn": "শিমুলিয়া",
    "nameEn": ""
  },
  {
    "id": 443,
    "upazilaId": 48,
    "nameBn": "গদখালী",
    "nameEn": ""
  },
  {
    "id": 444,
    "upazilaId": 48,
    "nameBn": "পানিসারা",
    "nameEn": ""
  },
  {
    "id": 445,
    "upazilaId": 48,
    "nameBn": "ঝিকরগাছা",
    "nameEn": ""
  },
  {
    "id": 446,
    "upazilaId": 48,
    "nameBn": "নাভারণ",
    "nameEn": ""
  },
  {
    "id": 447,
    "upazilaId": 48,
    "nameBn": "নির্বাসখোলা",
    "nameEn": ""
  },
  {
    "id": 448,
    "upazilaId": 48,
    "nameBn": "হাজিরবাগ",
    "nameEn": ""
  },
  {
    "id": 449,
    "upazilaId": 48,
    "nameBn": "শংকরপুর",
    "nameEn": ""
  },
  {
    "id": 450,
    "upazilaId": 48,
    "nameBn": "বাঁকড়া",
    "nameEn": ""
  },
  {
    "id": 451,
    "upazilaId": 49,
    "nameBn": "জহুরপুর",
    "nameEn": ""
  },
  {
    "id": 452,
    "upazilaId": 49,
    "nameBn": "বন্দবিলা",
    "nameEn": ""
  },
  {
    "id": 453,
    "upazilaId": 49,
    "nameBn": "রায়পুর",
    "nameEn": ""
  },
  {
    "id": 454,
    "upazilaId": 49,
    "nameBn": "নারিকেলবাড়িয়া",
    "nameEn": ""
  },
  {
    "id": 455,
    "upazilaId": 49,
    "nameBn": "ধলগ্রাম",
    "nameEn": ""
  },
  {
    "id": 456,
    "upazilaId": 49,
    "nameBn": "দোহাকুলা",
    "nameEn": ""
  },
  {
    "id": 457,
    "upazilaId": 49,
    "nameBn": "দরাজহাট",
    "nameEn": ""
  },
  {
    "id": 458,
    "upazilaId": 49,
    "nameBn": "বাসুয়াড়ী",
    "nameEn": ""
  },
  {
    "id": 459,
    "upazilaId": 49,
    "nameBn": "জামদিয়া",
    "nameEn": ""
  },
  {
    "id": 460,
    "upazilaId": 50,
    "nameBn": "কাশিমনগর",
    "nameEn": ""
  },
  {
    "id": 461,
    "upazilaId": 50,
    "nameBn": "কুলটিয়া",
    "nameEn": ""
  },
  {
    "id": 462,
    "upazilaId": 50,
    "nameBn": "খানপুর",
    "nameEn": ""
  },
  {
    "id": 463,
    "upazilaId": 50,
    "nameBn": "খেদাপাড়া",
    "nameEn": ""
  },
  {
    "id": 464,
    "upazilaId": 50,
    "nameBn": "চালুয়াহাটি",
    "nameEn": ""
  },
  {
    "id": 465,
    "upazilaId": 50,
    "nameBn": "ঝাঁপা",
    "nameEn": ""
  },
  {
    "id": 466,
    "upazilaId": 50,
    "nameBn": "ঢাকুরিয়া",
    "nameEn": ""
  },
  {
    "id": 467,
    "upazilaId": 50,
    "nameBn": "দুর্বাডাঙ্গা",
    "nameEn": ""
  },
  {
    "id": 468,
    "upazilaId": 50,
    "nameBn": "নেহালপুর",
    "nameEn": ""
  },
  {
    "id": 469,
    "upazilaId": 50,
    "nameBn": "ভোজগাতি",
    "nameEn": ""
  },
  {
    "id": 470,
    "upazilaId": 50,
    "nameBn": "মনিরামপুর",
    "nameEn": ""
  },
  {
    "id": 471,
    "upazilaId": 50,
    "nameBn": "মনোহরপুর",
    "nameEn": ""
  },
  {
    "id": 472,
    "upazilaId": 50,
    "nameBn": "মশ্বিমনগর",
    "nameEn": ""
  },
  {
    "id": 473,
    "upazilaId": 50,
    "nameBn": "রোহিতা",
    "nameEn": ""
  },
  {
    "id": 474,
    "upazilaId": 50,
    "nameBn": "শ্যামকুড়",
    "nameEn": ""
  },
  {
    "id": 475,
    "upazilaId": 50,
    "nameBn": "হরিদাসকাটি",
    "nameEn": ""
  },
  {
    "id": 476,
    "upazilaId": 50,
    "nameBn": "হরিহরনগর",
    "nameEn": ""
  },
  {
    "id": 477,
    "upazilaId": 51,
    "nameBn": "হৈবতপুর",
    "nameEn": ""
  },
  {
    "id": 478,
    "upazilaId": 51,
    "nameBn": "লেবুতলা",
    "nameEn": ""
  },
  {
    "id": 479,
    "upazilaId": 51,
    "nameBn": "ইছালী",
    "nameEn": ""
  },
  {
    "id": 480,
    "upazilaId": 51,
    "nameBn": "আরবপুর",
    "nameEn": ""
  },
  {
    "id": 481,
    "upazilaId": 51,
    "nameBn": "উপশহর",
    "nameEn": ""
  },
  {
    "id": 482,
    "upazilaId": 51,
    "nameBn": "কচুয়া",
    "nameEn": ""
  },
  {
    "id": 483,
    "upazilaId": 51,
    "nameBn": "কাশিমপুর",
    "nameEn": ""
  },
  {
    "id": 484,
    "upazilaId": 51,
    "nameBn": "চুড়ামনকাটি",
    "nameEn": ""
  },
  {
    "id": 485,
    "upazilaId": 51,
    "nameBn": "চাঁচড়া",
    "nameEn": ""
  },
  {
    "id": 486,
    "upazilaId": 51,
    "nameBn": "নরেন্দ্রপুর",
    "nameEn": ""
  },
  {
    "id": 487,
    "upazilaId": 51,
    "nameBn": "নওয়াপাড়া",
    "nameEn": ""
  },
  {
    "id": 488,
    "upazilaId": 51,
    "nameBn": "ফতেপুর",
    "nameEn": ""
  },
  {
    "id": 489,
    "upazilaId": 51,
    "nameBn": "বসুন্দিয়া",
    "nameEn": ""
  },
  {
    "id": 490,
    "upazilaId": 51,
    "nameBn": "রামনগর",
    "nameEn": ""
  },
  {
    "id": 491,
    "upazilaId": 51,
    "nameBn": "দেয়ারা",
    "nameEn": ""
  },
  {
    "id": 492,
    "upazilaId": 52,
    "nameBn": "ডিহি",
    "nameEn": ""
  },
  {
    "id": 493,
    "upazilaId": 52,
    "nameBn": "লক্ষণপুর",
    "nameEn": ""
  },
  {
    "id": 494,
    "upazilaId": 52,
    "nameBn": "বাহাদুরপুর",
    "nameEn": ""
  },
  {
    "id": 495,
    "upazilaId": 52,
    "nameBn": "বেনাপোল",
    "nameEn": ""
  },
  {
    "id": 496,
    "upazilaId": 52,
    "nameBn": "পুটখালী",
    "nameEn": ""
  },
  {
    "id": 497,
    "upazilaId": 52,
    "nameBn": "গোগা",
    "nameEn": ""
  },
  {
    "id": 498,
    "upazilaId": 52,
    "nameBn": "কায়বা",
    "nameEn": ""
  },
  {
    "id": 499,
    "upazilaId": 52,
    "nameBn": "বাগআঁচড়া",
    "nameEn": ""
  },
  {
    "id": 500,
    "upazilaId": 52,
    "nameBn": "উলাশী",
    "nameEn": ""
  },
  {
    "id": 501,
    "upazilaId": 52,
    "nameBn": "শার্শা",
    "nameEn": ""
  },
  {
    "id": 502,
    "upazilaId": 52,
    "nameBn": "নিজামপুর",
    "nameEn": ""
  },
  {
    "id": 503,
    "upazilaId": 53,
    "nameBn": "বাঁশদহ",
    "nameEn": ""
  },
  {
    "id": 504,
    "upazilaId": 53,
    "nameBn": "কুশখালী",
    "nameEn": ""
  },
  {
    "id": 505,
    "upazilaId": 53,
    "nameBn": "বৈকারী",
    "nameEn": ""
  },
  {
    "id": 506,
    "upazilaId": 53,
    "nameBn": "ঘোনা",
    "nameEn": ""
  },
  {
    "id": 507,
    "upazilaId": 53,
    "nameBn": "শিবপুর",
    "nameEn": ""
  },
  {
    "id": 508,
    "upazilaId": 53,
    "nameBn": "ভোমরা",
    "nameEn": ""
  },
  {
    "id": 509,
    "upazilaId": 53,
    "nameBn": "আলীপুর",
    "nameEn": ""
  },
  {
    "id": 510,
    "upazilaId": 53,
    "nameBn": "ধুলিহর",
    "nameEn": ""
  },
  {
    "id": 511,
    "upazilaId": 53,
    "nameBn": "ব্রহ্মরাজপুর",
    "nameEn": ""
  },
  {
    "id": 512,
    "upazilaId": 53,
    "nameBn": "আগরদাঁড়ী",
    "nameEn": ""
  },
  {
    "id": 513,
    "upazilaId": 53,
    "nameBn": "ঝাউডাঙ্গা",
    "nameEn": ""
  },
  {
    "id": 514,
    "upazilaId": 53,
    "nameBn": "বল্লী",
    "nameEn": ""
  },
  {
    "id": 515,
    "upazilaId": 53,
    "nameBn": "লাবসা",
    "nameEn": ""
  },
  {
    "id": 516,
    "upazilaId": 53,
    "nameBn": "ফিংড়ী",
    "nameEn": ""
  },
  {
    "id": 517,
    "upazilaId": 54,
    "nameBn": "শোভনালী",
    "nameEn": ""
  },
  {
    "id": 518,
    "upazilaId": 54,
    "nameBn": "বুধহাটা",
    "nameEn": ""
  },
  {
    "id": 519,
    "upazilaId": 54,
    "nameBn": "কুল্যা",
    "nameEn": ""
  },
  {
    "id": 520,
    "upazilaId": 54,
    "nameBn": "দরগাহপুর",
    "nameEn": ""
  },
  {
    "id": 521,
    "upazilaId": 54,
    "nameBn": "বড়দল",
    "nameEn": ""
  },
  {
    "id": 522,
    "upazilaId": 54,
    "nameBn": "আশাশুনি",
    "nameEn": ""
  },
  {
    "id": 523,
    "upazilaId": 54,
    "nameBn": "শ্রীউলা",
    "nameEn": ""
  },
  {
    "id": 524,
    "upazilaId": 54,
    "nameBn": "খাজরা",
    "nameEn": ""
  },
  {
    "id": 525,
    "upazilaId": 54,
    "nameBn": "আনুলিয়া",
    "nameEn": ""
  },
  {
    "id": 526,
    "upazilaId": 54,
    "nameBn": "প্রতাপনগর",
    "nameEn": ""
  },
  {
    "id": 527,
    "upazilaId": 54,
    "nameBn": "কাদাকাটি",
    "nameEn": ""
  },
  {
    "id": 528,
    "upazilaId": 55,
    "nameBn": "জয়নগর",
    "nameEn": ""
  },
  {
    "id": 529,
    "upazilaId": 55,
    "nameBn": "জালালাবাদ",
    "nameEn": ""
  },
  {
    "id": 530,
    "upazilaId": 55,
    "nameBn": "কয়লা",
    "nameEn": ""
  },
  {
    "id": 531,
    "upazilaId": 55,
    "nameBn": "লাঙ্গলঝাড়া",
    "nameEn": ""
  },
  {
    "id": 532,
    "upazilaId": 55,
    "nameBn": "কেঁড়াগাছি",
    "nameEn": ""
  },
  {
    "id": 533,
    "upazilaId": 55,
    "nameBn": "সোনাবাড়ীয়া",
    "nameEn": ""
  },
  {
    "id": 534,
    "upazilaId": 55,
    "nameBn": "চন্দনপুর",
    "nameEn": ""
  },
  {
    "id": 535,
    "upazilaId": 55,
    "nameBn": "কেরালকাতা",
    "nameEn": ""
  },
  {
    "id": 536,
    "upazilaId": 55,
    "nameBn": "হেলাতলা",
    "nameEn": ""
  },
  {
    "id": 537,
    "upazilaId": 55,
    "nameBn": "কুশোডাঙ্গা",
    "nameEn": ""
  },
  {
    "id": 538,
    "upazilaId": 55,
    "nameBn": "দেয়াড়া",
    "nameEn": ""
  },
  {
    "id": 539,
    "upazilaId": 55,
    "nameBn": "যুগিখালী",
    "nameEn": ""
  },
  {
    "id": 540,
    "upazilaId": 20,
    "nameBn": "কৃষ্ণনগর",
    "nameEn": ""
  },
  {
    "id": 541,
    "upazilaId": 20,
    "nameBn": "বিষ্ণুপুর",
    "nameEn": ""
  },
  {
    "id": 542,
    "upazilaId": 20,
    "nameBn": "চাম্পাফুল",
    "nameEn": ""
  },
  {
    "id": 543,
    "upazilaId": 20,
    "nameBn": "দক্ষিণ শ্রীপুর",
    "nameEn": ""
  },
  {
    "id": 544,
    "upazilaId": 20,
    "nameBn": "কুশুলিয়া",
    "nameEn": ""
  },
  {
    "id": 545,
    "upazilaId": 20,
    "nameBn": "নলতা",
    "nameEn": ""
  },
  {
    "id": 546,
    "upazilaId": 20,
    "nameBn": "তারালী",
    "nameEn": ""
  },
  {
    "id": 547,
    "upazilaId": 20,
    "nameBn": "ভাড়াশিমলা",
    "nameEn": ""
  },
  {
    "id": 548,
    "upazilaId": 20,
    "nameBn": "মথুরেশপুর",
    "nameEn": ""
  },
  {
    "id": 549,
    "upazilaId": 20,
    "nameBn": "ধলবাড়িয়া",
    "nameEn": ""
  },
  {
    "id": 550,
    "upazilaId": 20,
    "nameBn": "রতনপুর",
    "nameEn": ""
  },
  {
    "id": 551,
    "upazilaId": 20,
    "nameBn": "মৌতলা",
    "nameEn": ""
  },
  {
    "id": 552,
    "upazilaId": 56,
    "nameBn": "নগরঘাটা",
    "nameEn": ""
  },
  {
    "id": 553,
    "upazilaId": 56,
    "nameBn": "সরুলিয়া",
    "nameEn": ""
  },
  {
    "id": 554,
    "upazilaId": 56,
    "nameBn": "কুমিরা",
    "nameEn": ""
  },
  {
    "id": 555,
    "upazilaId": 56,
    "nameBn": "ধানদিয়া",
    "nameEn": ""
  },
  {
    "id": 556,
    "upazilaId": 56,
    "nameBn": "ইসলামকাটি",
    "nameEn": ""
  },
  {
    "id": 557,
    "upazilaId": 56,
    "nameBn": "তালা",
    "nameEn": ""
  },
  {
    "id": 558,
    "upazilaId": 56,
    "nameBn": "খলিশখালী",
    "nameEn": ""
  },
  {
    "id": 559,
    "upazilaId": 56,
    "nameBn": "মাগুরা",
    "nameEn": ""
  },
  {
    "id": 560,
    "upazilaId": 56,
    "nameBn": "তেতুলিয়া",
    "nameEn": ""
  },
  {
    "id": 561,
    "upazilaId": 56,
    "nameBn": "খেশরা",
    "nameEn": ""
  },
  {
    "id": 562,
    "upazilaId": 56,
    "nameBn": "জালালপুর",
    "nameEn": ""
  },
  {
    "id": 563,
    "upazilaId": 56,
    "nameBn": "খলিলনগর",
    "nameEn": ""
  },
  {
    "id": 564,
    "upazilaId": 57,
    "nameBn": "কুলিয়া",
    "nameEn": ""
  },
  {
    "id": 565,
    "upazilaId": 57,
    "nameBn": "পারুলিয়া",
    "nameEn": ""
  },
  {
    "id": 566,
    "upazilaId": 57,
    "nameBn": "সখিপুর",
    "nameEn": ""
  },
  {
    "id": 567,
    "upazilaId": 57,
    "nameBn": "নওয়াপাড়া",
    "nameEn": ""
  },
  {
    "id": 568,
    "upazilaId": 57,
    "nameBn": "দেবহাটা",
    "nameEn": ""
  },
  {
    "id": 569,
    "upazilaId": 58,
    "nameBn": "ভুরুলিয়া",
    "nameEn": ""
  },
  {
    "id": 570,
    "upazilaId": 58,
    "nameBn": "কাশিমাড়ী",
    "nameEn": ""
  },
  {
    "id": 571,
    "upazilaId": 58,
    "nameBn": "শ্যামনগর",
    "nameEn": ""
  },
  {
    "id": 572,
    "upazilaId": 58,
    "nameBn": "নূরনগর",
    "nameEn": ""
  },
  {
    "id": 573,
    "upazilaId": 58,
    "nameBn": "কৈখালী",
    "nameEn": ""
  },
  {
    "id": 574,
    "upazilaId": 58,
    "nameBn": "রমজাননগর",
    "nameEn": ""
  },
  {
    "id": 575,
    "upazilaId": 58,
    "nameBn": "মুন্সীগঞ্জ",
    "nameEn": ""
  },
  {
    "id": 576,
    "upazilaId": 58,
    "nameBn": "ঈশ্বরীপুর",
    "nameEn": ""
  },
  {
    "id": 577,
    "upazilaId": 58,
    "nameBn": "বুড়িগোয়ালিনী",
    "nameEn": ""
  },
  {
    "id": 578,
    "upazilaId": 58,
    "nameBn": "আটুলিয়া",
    "nameEn": ""
  },
  {
    "id": 579,
    "upazilaId": 58,
    "nameBn": "পদ্মপুকুর",
    "nameEn": ""
  },
  {
    "id": 580,
    "upazilaId": 58,
    "nameBn": "গাবুরা",
    "nameEn": ""
  },
  {
    "id": 581,
    "upazilaId": 59,
    "nameBn": "বৈরাগ",
    "nameEn": ""
  },
  {
    "id": 582,
    "upazilaId": 59,
    "nameBn": "বারশত",
    "nameEn": ""
  },
  {
    "id": 583,
    "upazilaId": 59,
    "nameBn": "রায়পুর",
    "nameEn": ""
  },
  {
    "id": 584,
    "upazilaId": 59,
    "nameBn": "বটতলী",
    "nameEn": ""
  },
  {
    "id": 585,
    "upazilaId": 59,
    "nameBn": "বরুমছড়া",
    "nameEn": ""
  },
  {
    "id": 586,
    "upazilaId": 59,
    "nameBn": "বারখাইন",
    "nameEn": ""
  },
  {
    "id": 587,
    "upazilaId": 59,
    "nameBn": "আনোয়ারা",
    "nameEn": ""
  },
  {
    "id": 588,
    "upazilaId": 59,
    "nameBn": "চাতরী",
    "nameEn": ""
  },
  {
    "id": 589,
    "upazilaId": 59,
    "nameBn": "পরৈকোড়া",
    "nameEn": ""
  },
  {
    "id": 590,
    "upazilaId": 59,
    "nameBn": "হাইলধর",
    "nameEn": ""
  },
  {
    "id": 591,
    "upazilaId": 59,
    "nameBn": "জুঁইদণ্ডী",
    "nameEn": ""
  },
  {
    "id": 592,
    "upazilaId": 60,
    "nameBn": "চর লক্ষ্যা",
    "nameEn": ""
  },
  {
    "id": 593,
    "upazilaId": 60,
    "nameBn": "জুলধা",
    "nameEn": ""
  },
  {
    "id": 594,
    "upazilaId": 60,
    "nameBn": "চর পাথরঘাটা",
    "nameEn": ""
  },
  {
    "id": 595,
    "upazilaId": 60,
    "nameBn": "বড় উঠান",
    "nameEn": ""
  },
  {
    "id": 596,
    "upazilaId": 60,
    "nameBn": "শিকলবাহা",
    "nameEn": ""
  },
  {
    "id": 597,
    "upazilaId": 61,
    "nameBn": "কাঞ্চনাবাদ",
    "nameEn": ""
  },
  {
    "id": 598,
    "upazilaId": 61,
    "nameBn": "জোয়ারা",
    "nameEn": ""
  },
  {
    "id": 599,
    "upazilaId": 61,
    "nameBn": "হারলা (বিলুপ্ত)",
    "nameEn": ""
  },
  {
    "id": 600,
    "upazilaId": 61,
    "nameBn": "বরকল",
    "nameEn": ""
  },
  {
    "id": 601,
    "upazilaId": 61,
    "nameBn": "চন্দনাইশ",
    "nameEn": ""
  },
  {
    "id": 602,
    "upazilaId": 61,
    "nameBn": "বরমা",
    "nameEn": ""
  },
  {
    "id": 603,
    "upazilaId": 61,
    "nameBn": "বৈলতলী",
    "nameEn": ""
  },
  {
    "id": 604,
    "upazilaId": 61,
    "nameBn": "সাতবাড়িয়া",
    "nameEn": ""
  },
  {
    "id": 605,
    "upazilaId": 61,
    "nameBn": "হাশিমপুর",
    "nameEn": ""
  },
  {
    "id": 606,
    "upazilaId": 61,
    "nameBn": "দোহাজারী (বিলুপ্ত)",
    "nameEn": ""
  },
  {
    "id": 607,
    "upazilaId": 61,
    "nameBn": "ধোপাছড়ি",
    "nameEn": ""
  },
  {
    "id": 608,
    "upazilaId": 62,
    "nameBn": "কোলাগাঁও",
    "nameEn": ""
  },
  {
    "id": 609,
    "upazilaId": 62,
    "nameBn": "হাবিলাসদ্বীপ",
    "nameEn": ""
  },
  {
    "id": 610,
    "upazilaId": 62,
    "nameBn": "কুসুমপুরা",
    "nameEn": ""
  },
  {
    "id": 611,
    "upazilaId": 62,
    "nameBn": "জিরি",
    "nameEn": ""
  },
  {
    "id": 612,
    "upazilaId": 62,
    "nameBn": "কাশিয়াইশ",
    "nameEn": ""
  },
  {
    "id": 613,
    "upazilaId": 62,
    "nameBn": "আশিয়া",
    "nameEn": ""
  },
  {
    "id": 614,
    "upazilaId": 62,
    "nameBn": "জঙ্গলখাইন",
    "nameEn": ""
  },
  {
    "id": 615,
    "upazilaId": 62,
    "nameBn": "বড়লিয়া",
    "nameEn": ""
  },
  {
    "id": 616,
    "upazilaId": 62,
    "nameBn": "ধলঘাট",
    "nameEn": ""
  },
  {
    "id": 617,
    "upazilaId": 62,
    "nameBn": "কেলিশহর",
    "nameEn": ""
  },
  {
    "id": 618,
    "upazilaId": 62,
    "nameBn": "হাইদগাঁও",
    "nameEn": ""
  },
  {
    "id": 619,
    "upazilaId": 62,
    "nameBn": "দক্ষিণ ভূর্ষি",
    "nameEn": ""
  },
  {
    "id": 620,
    "upazilaId": 62,
    "nameBn": "ভাটিখাইন",
    "nameEn": ""
  },
  {
    "id": 621,
    "upazilaId": 62,
    "nameBn": "ছনহরা",
    "nameEn": ""
  },
  {
    "id": 622,
    "upazilaId": 62,
    "nameBn": "কচুয়াই",
    "nameEn": ""
  },
  {
    "id": 623,
    "upazilaId": 62,
    "nameBn": "খরনা",
    "nameEn": ""
  },
  {
    "id": 624,
    "upazilaId": 62,
    "nameBn": "পটিয়া",
    "nameEn": ""
  },
  {
    "id": 625,
    "upazilaId": 62,
    "nameBn": "শোভনদণ্ডী",
    "nameEn": ""
  },
  {
    "id": 626,
    "upazilaId": 63,
    "nameBn": "বাগানবাজার",
    "nameEn": ""
  },
  {
    "id": 627,
    "upazilaId": 63,
    "nameBn": "দাঁতমারা",
    "nameEn": ""
  },
  {
    "id": 628,
    "upazilaId": 63,
    "nameBn": "নারায়ণহাট",
    "nameEn": ""
  },
  {
    "id": 629,
    "upazilaId": 63,
    "nameBn": "ভূজপুর",
    "nameEn": ""
  },
  {
    "id": 630,
    "upazilaId": 63,
    "nameBn": "হারুয়ালছড়ি",
    "nameEn": ""
  },
  {
    "id": 631,
    "upazilaId": 63,
    "nameBn": "পাইন্দং",
    "nameEn": ""
  },
  {
    "id": 632,
    "upazilaId": 63,
    "nameBn": "কাঞ্চননগর",
    "nameEn": ""
  },
  {
    "id": 633,
    "upazilaId": 63,
    "nameBn": "রাঙ্গামাটিয়া (বিলুপ্ত)",
    "nameEn": ""
  },
  {
    "id": 634,
    "upazilaId": 63,
    "nameBn": "ধুরুং (বিলুপ্ত)",
    "nameEn": ""
  },
  {
    "id": 635,
    "upazilaId": 63,
    "nameBn": "সুন্দরপুর",
    "nameEn": ""
  },
  {
    "id": 636,
    "upazilaId": 63,
    "nameBn": "সুয়াবিল",
    "nameEn": ""
  },
  {
    "id": 637,
    "upazilaId": 63,
    "nameBn": "দৌলতপুর (বিলুপ্ত)",
    "nameEn": ""
  },
  {
    "id": 638,
    "upazilaId": 63,
    "nameBn": "লেলাং",
    "nameEn": ""
  },
  {
    "id": 639,
    "upazilaId": 63,
    "nameBn": "নানুপুর",
    "nameEn": ""
  },
  {
    "id": 640,
    "upazilaId": 63,
    "nameBn": "রোসাংগিরী",
    "nameEn": ""
  },
  {
    "id": 641,
    "upazilaId": 63,
    "nameBn": "বখতপুর",
    "nameEn": ""
  },
  {
    "id": 642,
    "upazilaId": 63,
    "nameBn": "জাফতনগর",
    "nameEn": ""
  },
  {
    "id": 643,
    "upazilaId": 63,
    "nameBn": "ধর্মপুর",
    "nameEn": ""
  },
  {
    "id": 644,
    "upazilaId": 63,
    "nameBn": "ফটিকছড়ি",
    "nameEn": ""
  },
  {
    "id": 645,
    "upazilaId": 63,
    "nameBn": "সমিতিরহাট",
    "nameEn": ""
  },
  {
    "id": 646,
    "upazilaId": 63,
    "nameBn": "আব্দুল্লাহপুর",
    "nameEn": ""
  },
  {
    "id": 647,
    "upazilaId": 63,
    "nameBn": "খিরাম",
    "nameEn": ""
  },
  {
    "id": 648,
    "upazilaId": 64,
    "nameBn": "পুকুরিয়া",
    "nameEn": ""
  },
  {
    "id": 649,
    "upazilaId": 64,
    "nameBn": "সাধনপুর",
    "nameEn": ""
  },
  {
    "id": 650,
    "upazilaId": 64,
    "nameBn": "খানখানাবাদ",
    "nameEn": ""
  },
  {
    "id": 651,
    "upazilaId": 64,
    "nameBn": "বাহারছড়া",
    "nameEn": ""
  },
  {
    "id": 652,
    "upazilaId": 64,
    "nameBn": "কালীপুর",
    "nameEn": ""
  },
  {
    "id": 653,
    "upazilaId": 64,
    "nameBn": "বৈলছড়ি",
    "nameEn": ""
  },
  {
    "id": 654,
    "upazilaId": 64,
    "nameBn": "কাথরিয়া",
    "nameEn": ""
  },
  {
    "id": 655,
    "upazilaId": 64,
    "nameBn": "সরল",
    "nameEn": ""
  },
  {
    "id": 656,
    "upazilaId": 64,
    "nameBn": "জলদী (বিলুপ্ত)",
    "nameEn": ""
  },
  {
    "id": 657,
    "upazilaId": 64,
    "nameBn": "গণ্ডামারা",
    "nameEn": ""
  },
  {
    "id": 658,
    "upazilaId": 64,
    "nameBn": "শীলকূপ",
    "nameEn": ""
  },
  {
    "id": 659,
    "upazilaId": 64,
    "nameBn": "চাম্বল",
    "nameEn": ""
  },
  {
    "id": 660,
    "upazilaId": 64,
    "nameBn": "পুঁইছড়ি",
    "nameEn": ""
  },
  {
    "id": 661,
    "upazilaId": 64,
    "nameBn": "ছনুয়া",
    "nameEn": ""
  },
  {
    "id": 662,
    "upazilaId": 64,
    "nameBn": "শেখেরখীল",
    "nameEn": ""
  },
  {
    "id": 663,
    "upazilaId": 65,
    "nameBn": "কধুরখীল",
    "nameEn": ""
  },
  {
    "id": 664,
    "upazilaId": 65,
    "nameBn": "পশ্চিম গোমদণ্ডী",
    "nameEn": ""
  },
  {
    "id": 665,
    "upazilaId": 65,
    "nameBn": "পূর্ব গোমদণ্ডী (বিলুপ্ত)",
    "nameEn": ""
  },
  {
    "id": 666,
    "upazilaId": 65,
    "nameBn": "শাকপুরা",
    "nameEn": ""
  },
  {
    "id": 667,
    "upazilaId": 65,
    "nameBn": "সারোয়াতলী",
    "nameEn": ""
  },
  {
    "id": 668,
    "upazilaId": 65,
    "nameBn": "পোপাদিয়া",
    "nameEn": ""
  },
  {
    "id": 669,
    "upazilaId": 65,
    "nameBn": "চরণদ্বীপ",
    "nameEn": ""
  },
  {
    "id": 670,
    "upazilaId": 65,
    "nameBn": "শ্রীপুর খরণদ্বীপ",
    "nameEn": ""
  },
  {
    "id": 671,
    "upazilaId": 65,
    "nameBn": "আমুচিয়া",
    "nameEn": ""
  },
  {
    "id": 672,
    "upazilaId": 65,
    "nameBn": "আহলা করলডেঙ্গা",
    "nameEn": ""
  },
  {
    "id": 673,
    "upazilaId": 66,
    "nameBn": "করেরহাট",
    "nameEn": ""
  },
  {
    "id": 674,
    "upazilaId": 66,
    "nameBn": "হিঙ্গুলী",
    "nameEn": ""
  },
  {
    "id": 675,
    "upazilaId": 66,
    "nameBn": "জোরারগঞ্জ",
    "nameEn": ""
  },
  {
    "id": 676,
    "upazilaId": 66,
    "nameBn": "ধুম",
    "nameEn": ""
  },
  {
    "id": 677,
    "upazilaId": 66,
    "nameBn": "ওসমানপুর",
    "nameEn": ""
  },
  {
    "id": 678,
    "upazilaId": 66,
    "nameBn": "ইছাখালী",
    "nameEn": ""
  },
  {
    "id": 679,
    "upazilaId": 66,
    "nameBn": "কাটাছড়া",
    "nameEn": ""
  },
  {
    "id": 680,
    "upazilaId": 66,
    "nameBn": "দুর্গাপুর",
    "nameEn": ""
  },
  {
    "id": 681,
    "upazilaId": 66,
    "nameBn": "মীরসরাই",
    "nameEn": ""
  },
  {
    "id": 682,
    "upazilaId": 66,
    "nameBn": "মিঠানালা",
    "nameEn": ""
  },
  {
    "id": 683,
    "upazilaId": 66,
    "nameBn": "মঘাদিয়া",
    "nameEn": ""
  },
  {
    "id": 684,
    "upazilaId": 66,
    "nameBn": "খৈয়াছড়া",
    "nameEn": ""
  },
  {
    "id": 685,
    "upazilaId": 66,
    "nameBn": "মায়ানী",
    "nameEn": ""
  },
  {
    "id": 686,
    "upazilaId": 66,
    "nameBn": "হাইতকান্দি",
    "nameEn": ""
  },
  {
    "id": 687,
    "upazilaId": 66,
    "nameBn": "ওয়াহেদপুর",
    "nameEn": ""
  },
  {
    "id": 688,
    "upazilaId": 66,
    "nameBn": "সাহেরখালী",
    "nameEn": ""
  },
  {
    "id": 689,
    "upazilaId": 67,
    "nameBn": "হলদিয়া",
    "nameEn": ""
  },
  {
    "id": 690,
    "upazilaId": 67,
    "nameBn": "ডাবুয়া",
    "nameEn": ""
  },
  {
    "id": 691,
    "upazilaId": 67,
    "nameBn": "চিকদাইর",
    "nameEn": ""
  },
  {
    "id": 692,
    "upazilaId": 67,
    "nameBn": "গহিরা",
    "nameEn": ""
  },
  {
    "id": 693,
    "upazilaId": 67,
    "nameBn": "সুলতানপুর (বিলুপ্ত)",
    "nameEn": ""
  },
  {
    "id": 694,
    "upazilaId": 67,
    "nameBn": "বিনাজুরী",
    "nameEn": ""
  },
  {
    "id": 695,
    "upazilaId": 67,
    "nameBn": "রাউজান",
    "nameEn": ""
  },
  {
    "id": 696,
    "upazilaId": 67,
    "nameBn": "৮নং কদলপুর",
    "nameEn": ""
  },
  {
    "id": 697,
    "upazilaId": 67,
    "nameBn": "৯নং পাহাড়তলী",
    "nameEn": ""
  },
  {
    "id": 698,
    "upazilaId": 67,
    "nameBn": "পূর্ব গুজরা",
    "nameEn": ""
  },
  {
    "id": 699,
    "upazilaId": 67,
    "nameBn": "পশ্চিম গুজরা",
    "nameEn": ""
  },
  {
    "id": 700,
    "upazilaId": 67,
    "nameBn": "উরকিরচর",
    "nameEn": ""
  },
  {
    "id": 701,
    "upazilaId": 67,
    "nameBn": "নোয়াপাড়া",
    "nameEn": ""
  },
  {
    "id": 702,
    "upazilaId": 67,
    "nameBn": "বাগোয়ান",
    "nameEn": ""
  },
  {
    "id": 703,
    "upazilaId": 67,
    "nameBn": "নওয়াজিশপুর",
    "nameEn": ""
  },
  {
    "id": 704,
    "upazilaId": 68,
    "nameBn": "রাজানগর",
    "nameEn": ""
  },
  {
    "id": 705,
    "upazilaId": 68,
    "nameBn": "হোসনাবাদ",
    "nameEn": ""
  },
  {
    "id": 706,
    "upazilaId": 68,
    "nameBn": "স্বনির্ভর রাঙ্গুনিয়া",
    "nameEn": ""
  },
  {
    "id": 707,
    "upazilaId": 68,
    "nameBn": "মরিয়মনগর",
    "nameEn": ""
  },
  {
    "id": 708,
    "upazilaId": 68,
    "nameBn": "পারুয়া",
    "nameEn": ""
  },
  {
    "id": 709,
    "upazilaId": 68,
    "nameBn": "পোমরা",
    "nameEn": ""
  },
  {
    "id": 710,
    "upazilaId": 68,
    "nameBn": "বেতাগী",
    "nameEn": ""
  },
  {
    "id": 711,
    "upazilaId": 68,
    "nameBn": "চন্দ্রঘোনা কদমতলী",
    "nameEn": ""
  },
  {
    "id": 712,
    "upazilaId": 68,
    "nameBn": "ইসলামপুর",
    "nameEn": ""
  },
  {
    "id": 713,
    "upazilaId": 68,
    "nameBn": "দক্ষিণ রাজানগর",
    "nameEn": ""
  },
  {
    "id": 714,
    "upazilaId": 68,
    "nameBn": "লালানগর",
    "nameEn": ""
  },
  {
    "id": 715,
    "upazilaId": 68,
    "nameBn": "সরফভাটা",
    "nameEn": ""
  },
  {
    "id": 716,
    "upazilaId": 68,
    "nameBn": "শিলক",
    "nameEn": ""
  },
  {
    "id": 717,
    "upazilaId": 68,
    "nameBn": "পদুয়া",
    "nameEn": ""
  },
  {
    "id": 718,
    "upazilaId": 68,
    "nameBn": "কোদালা",
    "nameEn": ""
  },
  {
    "id": 719,
    "upazilaId": 69,
    "nameBn": "বড়হাতিয়া",
    "nameEn": ""
  },
  {
    "id": 720,
    "upazilaId": 69,
    "nameBn": "আমিরাবাদ",
    "nameEn": ""
  },
  {
    "id": 721,
    "upazilaId": 69,
    "nameBn": "পদুয়া",
    "nameEn": ""
  },
  {
    "id": 722,
    "upazilaId": 69,
    "nameBn": "চরম্বা",
    "nameEn": ""
  },
  {
    "id": 723,
    "upazilaId": 69,
    "nameBn": "কলাউজান",
    "nameEn": ""
  },
  {
    "id": 724,
    "upazilaId": 69,
    "nameBn": "লোহাগাড়া",
    "nameEn": ""
  },
  {
    "id": 725,
    "upazilaId": 69,
    "nameBn": "পুটিবিলা",
    "nameEn": ""
  },
  {
    "id": 726,
    "upazilaId": 69,
    "nameBn": "চুনতি",
    "nameEn": ""
  },
  {
    "id": 727,
    "upazilaId": 69,
    "nameBn": "আধুনগর",
    "nameEn": ""
  },
  {
    "id": 728,
    "upazilaId": 70,
    "nameBn": "উড়িরচর",
    "nameEn": ""
  },
  {
    "id": 729,
    "upazilaId": 70,
    "nameBn": "হুদ্রাখালী (বিলুপ্ত)",
    "nameEn": ""
  },
  {
    "id": 730,
    "upazilaId": 70,
    "nameBn": "গাছুয়া",
    "nameEn": ""
  },
  {
    "id": 731,
    "upazilaId": 70,
    "nameBn": "সন্তোষপুর",
    "nameEn": ""
  },
  {
    "id": 732,
    "upazilaId": 70,
    "nameBn": "দীর্ঘাপাড় (বিলুপ্তপ্রায়)",
    "nameEn": ""
  },
  {
    "id": 733,
    "upazilaId": 70,
    "nameBn": "কালাপানিয়া",
    "nameEn": ""
  },
  {
    "id": 734,
    "upazilaId": 70,
    "nameBn": "কাটগড় (বিলুপ্ত)",
    "nameEn": ""
  },
  {
    "id": 735,
    "upazilaId": 70,
    "nameBn": "হরিশপুর",
    "nameEn": ""
  },
  {
    "id": 736,
    "upazilaId": 70,
    "nameBn": "ইজ্জতপুর (বিলুপ্ত)",
    "nameEn": ""
  },
  {
    "id": 737,
    "upazilaId": 70,
    "nameBn": "বাউরিয়া",
    "nameEn": ""
  },
  {
    "id": 738,
    "upazilaId": 70,
    "nameBn": "মুছাপুর",
    "nameEn": ""
  },
  {
    "id": 739,
    "upazilaId": 70,
    "nameBn": "রহমতপুর",
    "nameEn": ""
  },
  {
    "id": 740,
    "upazilaId": 70,
    "nameBn": "আজিমপুর",
    "nameEn": ""
  },
  {
    "id": 741,
    "upazilaId": 70,
    "nameBn": "নয়ামস্তি (বিলুপ্ত)",
    "nameEn": ""
  },
  {
    "id": 742,
    "upazilaId": 70,
    "nameBn": "মাইটভাঙ্গা",
    "nameEn": ""
  },
  {
    "id": 743,
    "upazilaId": 70,
    "nameBn": "সারিকাইত",
    "nameEn": ""
  },
  {
    "id": 744,
    "upazilaId": 70,
    "nameBn": "মগধরা",
    "nameEn": ""
  },
  {
    "id": 745,
    "upazilaId": 70,
    "nameBn": "হারামিয়া",
    "nameEn": ""
  },
  {
    "id": 746,
    "upazilaId": 70,
    "nameBn": "আমানউল্যা",
    "nameEn": ""
  },
  {
    "id": 747,
    "upazilaId": 70,
    "nameBn": "বাটাজোড়া (বিলুপ্ত)",
    "nameEn": ""
  },
  {
    "id": 748,
    "upazilaId": 71,
    "nameBn": "চরতী",
    "nameEn": ""
  },
  {
    "id": 749,
    "upazilaId": 71,
    "nameBn": "খাগরিয়া",
    "nameEn": ""
  },
  {
    "id": 750,
    "upazilaId": 71,
    "nameBn": "নলুয়া",
    "nameEn": ""
  },
  {
    "id": 751,
    "upazilaId": 71,
    "nameBn": "কাঞ্চনা",
    "nameEn": ""
  },
  {
    "id": 752,
    "upazilaId": 71,
    "nameBn": "আমিলাইশ",
    "nameEn": ""
  },
  {
    "id": 753,
    "upazilaId": 71,
    "nameBn": "এওচিয়া",
    "nameEn": ""
  },
  {
    "id": 754,
    "upazilaId": 71,
    "nameBn": "মাদার্শা",
    "nameEn": ""
  },
  {
    "id": 755,
    "upazilaId": 71,
    "nameBn": "ঢেমশা",
    "nameEn": ""
  },
  {
    "id": 756,
    "upazilaId": 71,
    "nameBn": "পশ্চিম ঢেমশা",
    "nameEn": ""
  },
  {
    "id": 757,
    "upazilaId": 71,
    "nameBn": "কেঁওচিয়া",
    "nameEn": ""
  },
  {
    "id": 758,
    "upazilaId": 71,
    "nameBn": "কালিয়াইশ",
    "nameEn": ""
  },
  {
    "id": 759,
    "upazilaId": 71,
    "nameBn": "ধর্মপুর",
    "nameEn": ""
  },
  {
    "id": 760,
    "upazilaId": 71,
    "nameBn": "বাজালিয়া",
    "nameEn": ""
  },
  {
    "id": 761,
    "upazilaId": 71,
    "nameBn": "পুরানগড়",
    "nameEn": ""
  },
  {
    "id": 762,
    "upazilaId": 71,
    "nameBn": "ছদাহা",
    "nameEn": ""
  },
  {
    "id": 763,
    "upazilaId": 71,
    "nameBn": "সাতকানিয়া",
    "nameEn": ""
  },
  {
    "id": 764,
    "upazilaId": 71,
    "nameBn": "সোনাকানিয়া",
    "nameEn": ""
  },
  {
    "id": 765,
    "upazilaId": 72,
    "nameBn": "সৈয়দপুর",
    "nameEn": ""
  },
  {
    "id": 766,
    "upazilaId": 72,
    "nameBn": "বারৈয়াঢালা",
    "nameEn": ""
  },
  {
    "id": 767,
    "upazilaId": 72,
    "nameBn": "সীতাকুণ্ড (বিলুপ্ত)",
    "nameEn": ""
  },
  {
    "id": 768,
    "upazilaId": 72,
    "nameBn": "মুরাদপুর",
    "nameEn": ""
  },
  {
    "id": 769,
    "upazilaId": 72,
    "nameBn": "বাড়বকুণ্ড",
    "nameEn": ""
  },
  {
    "id": 770,
    "upazilaId": 72,
    "nameBn": "বাঁশবাড়িয়া",
    "nameEn": ""
  },
  {
    "id": 771,
    "upazilaId": 72,
    "nameBn": "কুমিরা",
    "nameEn": ""
  },
  {
    "id": 772,
    "upazilaId": 72,
    "nameBn": "সোনাইছড়ি",
    "nameEn": ""
  },
  {
    "id": 773,
    "upazilaId": 72,
    "nameBn": "ভাটিয়ারী",
    "nameEn": ""
  },
  {
    "id": 774,
    "upazilaId": 72,
    "nameBn": "সলিমপুর",
    "nameEn": ""
  },
  {
    "id": 775,
    "upazilaId": 73,
    "nameBn": "ফরহাদাবাদ",
    "nameEn": ""
  },
  {
    "id": 776,
    "upazilaId": 73,
    "nameBn": "ধলই",
    "nameEn": ""
  },
  {
    "id": 777,
    "upazilaId": 73,
    "nameBn": "মির্জাপুর",
    "nameEn": ""
  },
  {
    "id": 778,
    "upazilaId": 73,
    "nameBn": "গুমানমর্দন",
    "nameEn": ""
  },
  {
    "id": 779,
    "upazilaId": 73,
    "nameBn": "নাঙ্গলমোড়া",
    "nameEn": ""
  },
  {
    "id": 780,
    "upazilaId": 73,
    "nameBn": "ছিপাতলী",
    "nameEn": ""
  },
  {
    "id": 781,
    "upazilaId": 73,
    "nameBn": "হাটহাজারী (বিলুপ্ত)",
    "nameEn": ""
  },
  {
    "id": 782,
    "upazilaId": 73,
    "nameBn": "মেখল",
    "nameEn": ""
  },
  {
    "id": 783,
    "upazilaId": 73,
    "nameBn": "গড়দুয়ারা",
    "nameEn": ""
  },
  {
    "id": 784,
    "upazilaId": 73,
    "nameBn": "উত্তর মাদার্শা",
    "nameEn": ""
  },
  {
    "id": 785,
    "upazilaId": 73,
    "nameBn": "ফতেপুর",
    "nameEn": ""
  },
  {
    "id": 786,
    "upazilaId": 73,
    "nameBn": "চিকনদণ্ডী",
    "nameEn": ""
  },
  {
    "id": 787,
    "upazilaId": 73,
    "nameBn": "দক্ষিণ মাদার্শা",
    "nameEn": ""
  },
  {
    "id": 788,
    "upazilaId": 73,
    "nameBn": "শিকারপুর বুড়িশ্চর",
    "nameEn": ""
  },
  {
    "id": 789,
    "upazilaId": 74,
    "nameBn": "জালিয়াপালং",
    "nameEn": ""
  },
  {
    "id": 790,
    "upazilaId": 74,
    "nameBn": "রত্নাপালং",
    "nameEn": ""
  },
  {
    "id": 791,
    "upazilaId": 74,
    "nameBn": "হলদিয়াপালং",
    "nameEn": ""
  },
  {
    "id": 792,
    "upazilaId": 74,
    "nameBn": "রাজাপালং",
    "nameEn": ""
  },
  {
    "id": 793,
    "upazilaId": 74,
    "nameBn": "পালংখালী",
    "nameEn": ""
  },
  {
    "id": 794,
    "upazilaId": 75,
    "nameBn": "চৌফলদণ্ডী",
    "nameEn": ""
  },
  {
    "id": 795,
    "upazilaId": 75,
    "nameBn": "ভারুয়াখালী",
    "nameEn": ""
  },
  {
    "id": 796,
    "upazilaId": 75,
    "nameBn": "পাটালি মাছুয়াখালী",
    "nameEn": ""
  },
  {
    "id": 797,
    "upazilaId": 75,
    "nameBn": "খুরুশকুল",
    "nameEn": ""
  },
  {
    "id": 798,
    "upazilaId": 75,
    "nameBn": "ঝিলংজা",
    "nameEn": ""
  },
  {
    "id": 799,
    "upazilaId": 76,
    "nameBn": "উত্তর ধুরুং",
    "nameEn": ""
  },
  {
    "id": 800,
    "upazilaId": 76,
    "nameBn": "দক্ষিণ ধুরুং",
    "nameEn": ""
  },
  {
    "id": 801,
    "upazilaId": 76,
    "nameBn": "লেমশীখালী",
    "nameEn": ""
  },
  {
    "id": 802,
    "upazilaId": 76,
    "nameBn": "কৈয়ারবিল",
    "nameEn": ""
  },
  {
    "id": 803,
    "upazilaId": 76,
    "nameBn": "বড়ঘোপ",
    "nameEn": ""
  },
  {
    "id": 804,
    "upazilaId": 76,
    "nameBn": "আলী আকবর ডেইল",
    "nameEn": ""
  },
  {
    "id": 805,
    "upazilaId": 77,
    "nameBn": "হারবাং",
    "nameEn": ""
  },
  {
    "id": 806,
    "upazilaId": 77,
    "nameBn": "বড়ইতলী",
    "nameEn": ""
  },
  {
    "id": 807,
    "upazilaId": 77,
    "nameBn": "কৈয়ারবিল",
    "nameEn": ""
  },
  {
    "id": 808,
    "upazilaId": 77,
    "nameBn": "বমু বিলছড়ি",
    "nameEn": ""
  },
  {
    "id": 809,
    "upazilaId": 77,
    "nameBn": "সুরাজপুর মানিকপুর",
    "nameEn": ""
  },
  {
    "id": 810,
    "upazilaId": 77,
    "nameBn": "পূর্ব বড় ভেওলা",
    "nameEn": ""
  },
  {
    "id": 811,
    "upazilaId": 77,
    "nameBn": "কাকারা",
    "nameEn": ""
  },
  {
    "id": 812,
    "upazilaId": 77,
    "nameBn": "ফাঁসিয়াখালী",
    "nameEn": ""
  },
  {
    "id": 813,
    "upazilaId": 77,
    "nameBn": "লক্ষ্যারচর",
    "nameEn": ""
  },
  {
    "id": 814,
    "upazilaId": 77,
    "nameBn": "চিরিঙ্গা",
    "nameEn": ""
  },
  {
    "id": 815,
    "upazilaId": 77,
    "nameBn": "সাহারবিল",
    "nameEn": ""
  },
  {
    "id": 816,
    "upazilaId": 77,
    "nameBn": "ভেওলা মানিকচর",
    "nameEn": ""
  },
  {
    "id": 817,
    "upazilaId": 77,
    "nameBn": "পশ্চিম বড় ভেওলা",
    "nameEn": ""
  },
  {
    "id": 818,
    "upazilaId": 77,
    "nameBn": "বদরখালী",
    "nameEn": ""
  },
  {
    "id": 819,
    "upazilaId": 77,
    "nameBn": "ঢেমুশিয়া",
    "nameEn": ""
  },
  {
    "id": 820,
    "upazilaId": 77,
    "nameBn": "ডুলাহাজারা",
    "nameEn": ""
  },
  {
    "id": 821,
    "upazilaId": 77,
    "nameBn": "খুটাখালী",
    "nameEn": ""
  },
  {
    "id": 822,
    "upazilaId": 77,
    "nameBn": "কোনাখালী",
    "nameEn": ""
  },
  {
    "id": 823,
    "upazilaId": 78,
    "nameBn": "হোয়াইক্যং",
    "nameEn": ""
  },
  {
    "id": 824,
    "upazilaId": 78,
    "nameBn": "হ্নীলা",
    "nameEn": ""
  },
  {
    "id": 825,
    "upazilaId": 78,
    "nameBn": "টেকনাফ সদর",
    "nameEn": ""
  },
  {
    "id": 826,
    "upazilaId": 78,
    "nameBn": "সাবরাং",
    "nameEn": ""
  },
  {
    "id": 827,
    "upazilaId": 78,
    "nameBn": "বাহারছড়া",
    "nameEn": ""
  },
  {
    "id": 828,
    "upazilaId": 78,
    "nameBn": "সেন্টমার্টিন",
    "nameEn": ""
  },
  {
    "id": 829,
    "upazilaId": 79,
    "nameBn": "রাজাখালী",
    "nameEn": ""
  },
  {
    "id": 830,
    "upazilaId": 79,
    "nameBn": "টৈটং",
    "nameEn": ""
  },
  {
    "id": 831,
    "upazilaId": 79,
    "nameBn": "বারবাকিয়া",
    "nameEn": ""
  },
  {
    "id": 832,
    "upazilaId": 79,
    "nameBn": "পেকুয়া",
    "nameEn": ""
  },
  {
    "id": 833,
    "upazilaId": 79,
    "nameBn": "মগনামা",
    "nameEn": ""
  },
  {
    "id": 834,
    "upazilaId": 79,
    "nameBn": "উজানটিয়া",
    "nameEn": ""
  },
  {
    "id": 835,
    "upazilaId": 79,
    "nameBn": "শীলখালী",
    "nameEn": ""
  },
  {
    "id": 836,
    "upazilaId": 80,
    "nameBn": "মাতারবাড়ী",
    "nameEn": ""
  },
  {
    "id": 837,
    "upazilaId": 80,
    "nameBn": "ধলঘাটা",
    "nameEn": ""
  },
  {
    "id": 838,
    "upazilaId": 80,
    "nameBn": "কালারমারছড়া",
    "nameEn": ""
  },
  {
    "id": 839,
    "upazilaId": 80,
    "nameBn": "শাপলাপুর",
    "nameEn": ""
  },
  {
    "id": 840,
    "upazilaId": 80,
    "nameBn": "হোয়ানক",
    "nameEn": ""
  },
  {
    "id": 841,
    "upazilaId": 80,
    "nameBn": "বড় মহেশখালী",
    "nameEn": ""
  },
  {
    "id": 842,
    "upazilaId": 80,
    "nameBn": "কুতুবজোম ছোট মহেশখালী",
    "nameEn": ""
  },
  {
    "id": 843,
    "upazilaId": 81,
    "nameBn": "ঈদগড়",
    "nameEn": ""
  },
  {
    "id": 844,
    "upazilaId": 81,
    "nameBn": "গর্জনিয়া",
    "nameEn": ""
  },
  {
    "id": 845,
    "upazilaId": 81,
    "nameBn": "কচ্ছপিয়া",
    "nameEn": ""
  },
  {
    "id": 846,
    "upazilaId": 81,
    "nameBn": "কাউয়ারখোপ",
    "nameEn": ""
  },
  {
    "id": 847,
    "upazilaId": 81,
    "nameBn": "ফতেখাঁরকূল",
    "nameEn": ""
  },
  {
    "id": 848,
    "upazilaId": 81,
    "nameBn": "জোয়ারিয়ানালা",
    "nameEn": ""
  },
  {
    "id": 849,
    "upazilaId": 81,
    "nameBn": "রাজারকূল",
    "nameEn": ""
  },
  {
    "id": 850,
    "upazilaId": 81,
    "nameBn": "দক্ষিণ মিঠাছড়ি",
    "nameEn": ""
  },
  {
    "id": 851,
    "upazilaId": 81,
    "nameBn": "খুনিয়াপালং",
    "nameEn": ""
  },
  {
    "id": 852,
    "upazilaId": 81,
    "nameBn": "চাকমারকূল রশিদনগর",
    "nameEn": ""
  },
  {
    "id": 853,
    "upazilaId": 82,
    "nameBn": "ইসলামপুর",
    "nameEn": ""
  },
  {
    "id": 854,
    "upazilaId": 82,
    "nameBn": "পোকখালী",
    "nameEn": ""
  },
  {
    "id": 855,
    "upazilaId": 82,
    "nameBn": "ইসলামাবাদ",
    "nameEn": ""
  },
  {
    "id": 856,
    "upazilaId": 82,
    "nameBn": "ঈদগাঁও",
    "nameEn": ""
  },
  {
    "id": 857,
    "upazilaId": 82,
    "nameBn": "জালালাবাদ",
    "nameEn": ""
  },
  {
    "id": 858,
    "upazilaId": 83,
    "nameBn": "আশুগঞ্জ সদর",
    "nameEn": ""
  },
  {
    "id": 859,
    "upazilaId": 83,
    "nameBn": "চর চারতলা",
    "nameEn": ""
  },
  {
    "id": 860,
    "upazilaId": 83,
    "nameBn": "দুর্গাপুর",
    "nameEn": ""
  },
  {
    "id": 861,
    "upazilaId": 83,
    "nameBn": "তালশহর পশ্চিম",
    "nameEn": ""
  },
  {
    "id": 862,
    "upazilaId": 83,
    "nameBn": "আড়াইসিধা",
    "nameEn": ""
  },
  {
    "id": 863,
    "upazilaId": 83,
    "nameBn": "শরীফপুর",
    "nameEn": ""
  },
  {
    "id": 864,
    "upazilaId": 83,
    "nameBn": "লালপুর",
    "nameEn": ""
  },
  {
    "id": 865,
    "upazilaId": 83,
    "nameBn": "তারুয়া",
    "nameEn": ""
  },
  {
    "id": 866,
    "upazilaId": 84,
    "nameBn": "মনিয়ন্দ",
    "nameEn": ""
  },
  {
    "id": 867,
    "upazilaId": 84,
    "nameBn": "ধরখাড়",
    "nameEn": ""
  },
  {
    "id": 868,
    "upazilaId": 84,
    "nameBn": "মোগড়া",
    "nameEn": ""
  },
  {
    "id": 869,
    "upazilaId": 84,
    "nameBn": "আখাউড়া উত্তর",
    "nameEn": ""
  },
  {
    "id": 870,
    "upazilaId": 84,
    "nameBn": "আখাউড়া দক্ষিণ",
    "nameEn": ""
  },
  {
    "id": 871,
    "upazilaId": 85,
    "nameBn": "মূলগ্রাম",
    "nameEn": ""
  },
  {
    "id": 872,
    "upazilaId": 85,
    "nameBn": "মেহারী",
    "nameEn": ""
  },
  {
    "id": 873,
    "upazilaId": 85,
    "nameBn": "বাদৈর",
    "nameEn": ""
  },
  {
    "id": 874,
    "upazilaId": 85,
    "nameBn": "খাড়েরা",
    "nameEn": ""
  },
  {
    "id": 875,
    "upazilaId": 85,
    "nameBn": "বিনাউটি",
    "nameEn": ""
  },
  {
    "id": 876,
    "upazilaId": 85,
    "nameBn": "গোপীনাথপুর",
    "nameEn": ""
  },
  {
    "id": 877,
    "upazilaId": 85,
    "nameBn": "কসবা পশ্চিম",
    "nameEn": ""
  },
  {
    "id": 878,
    "upazilaId": 85,
    "nameBn": "কুটি",
    "nameEn": ""
  },
  {
    "id": 879,
    "upazilaId": 85,
    "nameBn": "কায়েমপুর",
    "nameEn": ""
  },
  {
    "id": 880,
    "upazilaId": 85,
    "nameBn": "বায়েক",
    "nameEn": ""
  },
  {
    "id": 881,
    "upazilaId": 86,
    "nameBn": "বড়াইল",
    "nameEn": ""
  },
  {
    "id": 882,
    "upazilaId": 86,
    "nameBn": "বীরগাঁও",
    "nameEn": ""
  },
  {
    "id": 883,
    "upazilaId": 86,
    "nameBn": "কৃষ্ণনগর",
    "nameEn": ""
  },
  {
    "id": 884,
    "upazilaId": 86,
    "nameBn": "নাটঘর",
    "nameEn": ""
  },
  {
    "id": 885,
    "upazilaId": 86,
    "nameBn": "বিদ্যাকুট",
    "nameEn": ""
  },
  {
    "id": 886,
    "upazilaId": 86,
    "nameBn": "নবীনগর পূর্ব",
    "nameEn": ""
  },
  {
    "id": 887,
    "upazilaId": 86,
    "nameBn": "নবীনগর পশ্চিম",
    "nameEn": ""
  },
  {
    "id": 888,
    "upazilaId": 86,
    "nameBn": "কাইতলা উত্তর",
    "nameEn": ""
  },
  {
    "id": 889,
    "upazilaId": 86,
    "nameBn": "বিটঘর",
    "nameEn": ""
  },
  {
    "id": 890,
    "upazilaId": 86,
    "nameBn": "শিবপুর",
    "nameEn": ""
  },
  {
    "id": 891,
    "upazilaId": 86,
    "nameBn": "ইব্রাহিমপুর",
    "nameEn": ""
  },
  {
    "id": 892,
    "upazilaId": 86,
    "nameBn": "শ্রীরামপুর",
    "nameEn": ""
  },
  {
    "id": 893,
    "upazilaId": 86,
    "nameBn": "লাউর ফতেপুর",
    "nameEn": ""
  },
  {
    "id": 894,
    "upazilaId": 86,
    "nameBn": "জিনোদপুর",
    "nameEn": ""
  },
  {
    "id": 895,
    "upazilaId": 86,
    "nameBn": "রসুল্লাবাদ",
    "nameEn": ""
  },
  {
    "id": 896,
    "upazilaId": 86,
    "nameBn": "সাতমোড়া",
    "nameEn": ""
  },
  {
    "id": 897,
    "upazilaId": 86,
    "nameBn": "শ্যামগ্রাম",
    "nameEn": ""
  },
  {
    "id": 898,
    "upazilaId": 86,
    "nameBn": "ছলিমগঞ্জ",
    "nameEn": ""
  },
  {
    "id": 899,
    "upazilaId": 86,
    "nameBn": "বড়িকান্দি",
    "nameEn": ""
  },
  {
    "id": 900,
    "upazilaId": 86,
    "nameBn": "কাইতলা দক্ষিণ",
    "nameEn": ""
  },
  {
    "id": 901,
    "upazilaId": 86,
    "nameBn": "রতনপুর",
    "nameEn": ""
  },
  {
    "id": 902,
    "upazilaId": 87,
    "nameBn": "চাতলপাড়",
    "nameEn": ""
  },
  {
    "id": 903,
    "upazilaId": 87,
    "nameBn": "ভলাকুট",
    "nameEn": ""
  },
  {
    "id": 904,
    "upazilaId": 87,
    "nameBn": "কুণ্ডা",
    "nameEn": ""
  },
  {
    "id": 905,
    "upazilaId": 87,
    "nameBn": "গোয়ালনগর",
    "nameEn": ""
  },
  {
    "id": 906,
    "upazilaId": 87,
    "nameBn": "নাসিরনগর",
    "nameEn": ""
  },
  {
    "id": 907,
    "upazilaId": 87,
    "nameBn": "বুড়িশ্বর",
    "nameEn": ""
  },
  {
    "id": 908,
    "upazilaId": 87,
    "nameBn": "ফান্দাউক",
    "nameEn": ""
  },
  {
    "id": 909,
    "upazilaId": 87,
    "nameBn": "গুনিয়াউক",
    "nameEn": ""
  },
  {
    "id": 910,
    "upazilaId": 87,
    "nameBn": "চাপৈরতলা",
    "nameEn": ""
  },
  {
    "id": 911,
    "upazilaId": 87,
    "nameBn": "গোকর্ণ",
    "nameEn": ""
  },
  {
    "id": 912,
    "upazilaId": 87,
    "nameBn": "পূর্বভাগ",
    "nameEn": ""
  },
  {
    "id": 913,
    "upazilaId": 87,
    "nameBn": "হরিপুর",
    "nameEn": ""
  },
  {
    "id": 914,
    "upazilaId": 87,
    "nameBn": "ধরমণ্ডল",
    "nameEn": ""
  },
  {
    "id": 915,
    "upazilaId": 88,
    "nameBn": "তেজখালী",
    "nameEn": ""
  },
  {
    "id": 916,
    "upazilaId": 88,
    "nameBn": "পাহাড়িয়াকান্দি",
    "nameEn": ""
  },
  {
    "id": 917,
    "upazilaId": 88,
    "nameBn": "দরিয়াদৌলত",
    "nameEn": ""
  },
  {
    "id": 918,
    "upazilaId": 88,
    "nameBn": "সোনারামপুর",
    "nameEn": ""
  },
  {
    "id": 919,
    "upazilaId": 88,
    "nameBn": "দড়িকান্দি",
    "nameEn": ""
  },
  {
    "id": 920,
    "upazilaId": 88,
    "nameBn": "ছয়ফুল্লাকান্দি",
    "nameEn": ""
  },
  {
    "id": 921,
    "upazilaId": 88,
    "nameBn": "বাঞ্ছারামপুর",
    "nameEn": ""
  },
  {
    "id": 922,
    "upazilaId": 88,
    "nameBn": "আইয়ুবপুর",
    "nameEn": ""
  },
  {
    "id": 923,
    "upazilaId": 88,
    "nameBn": "ফরদাবাদ",
    "nameEn": ""
  },
  {
    "id": 924,
    "upazilaId": 88,
    "nameBn": "রূপসদী",
    "nameEn": ""
  },
  {
    "id": 925,
    "upazilaId": 88,
    "nameBn": "ছলিমাবাদ",
    "nameEn": ""
  },
  {
    "id": 926,
    "upazilaId": 88,
    "nameBn": "উজানচর",
    "nameEn": ""
  },
  {
    "id": 927,
    "upazilaId": 88,
    "nameBn": "মানিকপুর",
    "nameEn": ""
  },
  {
    "id": 928,
    "upazilaId": 89,
    "nameBn": "মজলিশপুর",
    "nameEn": ""
  },
  {
    "id": 929,
    "upazilaId": 89,
    "nameBn": "বুধল",
    "nameEn": ""
  },
  {
    "id": 930,
    "upazilaId": 89,
    "nameBn": "সুহিলপুর",
    "nameEn": ""
  },
  {
    "id": 931,
    "upazilaId": 89,
    "nameBn": "তালশহর পূর্ব",
    "nameEn": ""
  },
  {
    "id": 932,
    "upazilaId": 89,
    "nameBn": "নাটাই উত্তর",
    "nameEn": ""
  },
  {
    "id": 933,
    "upazilaId": 89,
    "nameBn": "নাটাই দক্ষিণ",
    "nameEn": ""
  },
  {
    "id": 934,
    "upazilaId": 89,
    "nameBn": "রামরাইল",
    "nameEn": ""
  },
  {
    "id": 935,
    "upazilaId": 89,
    "nameBn": "সুলতানপুর",
    "nameEn": ""
  },
  {
    "id": 936,
    "upazilaId": 89,
    "nameBn": "বাসুদেব",
    "nameEn": ""
  },
  {
    "id": 937,
    "upazilaId": 89,
    "nameBn": "মাছিহাতা",
    "nameEn": ""
  },
  {
    "id": 938,
    "upazilaId": 89,
    "nameBn": "সাদেকপুর",
    "nameEn": ""
  },
  {
    "id": 939,
    "upazilaId": 90,
    "nameBn": "অরুয়াইল",
    "nameEn": ""
  },
  {
    "id": 940,
    "upazilaId": 90,
    "nameBn": "পাকশিমুল",
    "nameEn": ""
  },
  {
    "id": 941,
    "upazilaId": 90,
    "nameBn": "চুণ্টা",
    "nameEn": ""
  },
  {
    "id": 942,
    "upazilaId": 90,
    "nameBn": "কালিকচ্ছ",
    "nameEn": ""
  },
  {
    "id": 943,
    "upazilaId": 90,
    "nameBn": "পানিশ্বর",
    "nameEn": ""
  },
  {
    "id": 944,
    "upazilaId": 90,
    "nameBn": "সরাইল সদর",
    "nameEn": ""
  },
  {
    "id": 945,
    "upazilaId": 90,
    "nameBn": "নোয়াগাঁও",
    "nameEn": ""
  },
  {
    "id": 946,
    "upazilaId": 90,
    "nameBn": "শাহজাদাপুর",
    "nameEn": ""
  },
  {
    "id": 947,
    "upazilaId": 90,
    "nameBn": "শাহবাজপুর টাউন",
    "nameEn": ""
  },
  {
    "id": 948,
    "upazilaId": 91,
    "nameBn": "বুধন্তি",
    "nameEn": ""
  },
  {
    "id": 949,
    "upazilaId": 91,
    "nameBn": "চান্দুরা",
    "nameEn": ""
  },
  {
    "id": 950,
    "upazilaId": 91,
    "nameBn": "ইছাপুরা",
    "nameEn": ""
  },
  {
    "id": 951,
    "upazilaId": 91,
    "nameBn": "চম্পকনগর",
    "nameEn": ""
  },
  {
    "id": 952,
    "upazilaId": 91,
    "nameBn": "হরষপুর",
    "nameEn": ""
  },
  {
    "id": 953,
    "upazilaId": 91,
    "nameBn": "পত্তন",
    "nameEn": ""
  },
  {
    "id": 954,
    "upazilaId": 91,
    "nameBn": "সিংগারবিল",
    "nameEn": ""
  },
  {
    "id": 955,
    "upazilaId": 91,
    "nameBn": "বিষ্ণুপুর",
    "nameEn": ""
  },
  {
    "id": 956,
    "upazilaId": 91,
    "nameBn": "চর ইসলামপুর",
    "nameEn": ""
  },
  {
    "id": 957,
    "upazilaId": 91,
    "nameBn": "পাহাড়পুর",
    "nameEn": ""
  },
  {
    "id": 958,
    "upazilaId": 92,
    "nameBn": "আলীকদম সদর",
    "nameEn": ""
  },
  {
    "id": 959,
    "upazilaId": 92,
    "nameBn": "চৈক্ষ্যং",
    "nameEn": ""
  },
  {
    "id": 960,
    "upazilaId": 92,
    "nameBn": "নয়াপাড়া",
    "nameEn": ""
  },
  {
    "id": 961,
    "upazilaId": 92,
    "nameBn": "কুরুকপাতা",
    "nameEn": ""
  },
  {
    "id": 962,
    "upazilaId": 93,
    "nameBn": "রেমাক্রী",
    "nameEn": ""
  },
  {
    "id": 963,
    "upazilaId": 93,
    "nameBn": "তিন্দু",
    "nameEn": ""
  },
  {
    "id": 964,
    "upazilaId": 93,
    "nameBn": "থানচি সদর",
    "nameEn": ""
  },
  {
    "id": 965,
    "upazilaId": 93,
    "nameBn": "বলিপাড়া",
    "nameEn": ""
  },
  {
    "id": 966,
    "upazilaId": 94,
    "nameBn": "নাইক্ষ্যংছড়ি সদর",
    "nameEn": ""
  },
  {
    "id": 967,
    "upazilaId": 94,
    "nameBn": "বাইশারী",
    "nameEn": ""
  },
  {
    "id": 968,
    "upazilaId": 94,
    "nameBn": "ঘুমধুম",
    "nameEn": ""
  },
  {
    "id": 969,
    "upazilaId": 94,
    "nameBn": "দোছড়ি,সোনাইছড়ি",
    "nameEn": ""
  },
  {
    "id": 970,
    "upazilaId": 95,
    "nameBn": "রাজবিলা",
    "nameEn": ""
  },
  {
    "id": 971,
    "upazilaId": 95,
    "nameBn": "কুহালং",
    "nameEn": ""
  },
  {
    "id": 972,
    "upazilaId": 95,
    "nameBn": "বান্দরবান সদর",
    "nameEn": ""
  },
  {
    "id": 973,
    "upazilaId": 95,
    "nameBn": "সুয়ালক",
    "nameEn": ""
  },
  {
    "id": 974,
    "upazilaId": 95,
    "nameBn": "টংকাবতী",
    "nameEn": ""
  },
  {
    "id": 975,
    "upazilaId": 96,
    "nameBn": "পাইন্দু",
    "nameEn": ""
  },
  {
    "id": 976,
    "upazilaId": 96,
    "nameBn": "রুমা সদর",
    "nameEn": ""
  },
  {
    "id": 977,
    "upazilaId": 96,
    "nameBn": "রেমাক্রীপ্রাংসা গ্যালেংগ্যা",
    "nameEn": ""
  },
  {
    "id": 978,
    "upazilaId": 97,
    "nameBn": "রোয়াংছড়ি সদর",
    "nameEn": ""
  },
  {
    "id": 979,
    "upazilaId": 97,
    "nameBn": "তারাছা",
    "nameEn": ""
  },
  {
    "id": 980,
    "upazilaId": 97,
    "nameBn": "আলেক্ষ্যং",
    "nameEn": ""
  },
  {
    "id": 981,
    "upazilaId": 97,
    "nameBn": "নোয়াপতং",
    "nameEn": ""
  },
  {
    "id": 982,
    "upazilaId": 98,
    "nameBn": "গজালিয়া",
    "nameEn": ""
  },
  {
    "id": 983,
    "upazilaId": 98,
    "nameBn": "লামা সদর",
    "nameEn": ""
  },
  {
    "id": 984,
    "upazilaId": 98,
    "nameBn": "ফাঁসিয়াখালী",
    "nameEn": ""
  },
  {
    "id": 985,
    "upazilaId": 98,
    "nameBn": "আজিজনগর",
    "nameEn": ""
  },
  {
    "id": 986,
    "upazilaId": 98,
    "nameBn": "সরই",
    "nameEn": ""
  },
  {
    "id": 987,
    "upazilaId": 98,
    "nameBn": "রূপসীপাড়া",
    "nameEn": ""
  },
  {
    "id": 988,
    "upazilaId": 98,
    "nameBn": "ফাইতং",
    "nameEn": ""
  },
  {
    "id": 989,
    "upazilaId": 99,
    "nameBn": "খাগড়াছড়ি সদর",
    "nameEn": ""
  },
  {
    "id": 990,
    "upazilaId": 99,
    "nameBn": "কমলছড়ি",
    "nameEn": ""
  },
  {
    "id": 991,
    "upazilaId": 99,
    "nameBn": "গোলাবাড়ী",
    "nameEn": ""
  },
  {
    "id": 992,
    "upazilaId": 99,
    "nameBn": "পেরাছড়া",
    "nameEn": ""
  },
  {
    "id": 993,
    "upazilaId": 99,
    "nameBn": "ভাইবোনছড়া",
    "nameEn": ""
  },
  {
    "id": 994,
    "upazilaId": 100,
    "nameBn": "গুইমারা",
    "nameEn": ""
  },
  {
    "id": 995,
    "upazilaId": 100,
    "nameBn": "হাফছড়ি সিন্দুকছড়ি",
    "nameEn": ""
  },
  {
    "id": 996,
    "upazilaId": 101,
    "nameBn": "মেরুং",
    "nameEn": ""
  },
  {
    "id": 997,
    "upazilaId": 101,
    "nameBn": "বোয়ালখালী",
    "nameEn": ""
  },
  {
    "id": 998,
    "upazilaId": 101,
    "nameBn": "কবাখালী",
    "nameEn": ""
  },
  {
    "id": 999,
    "upazilaId": 101,
    "nameBn": "দীঘিনালা",
    "nameEn": ""
  },
  {
    "id": 1000,
    "upazilaId": 101,
    "nameBn": "বাবুছড়া",
    "nameEn": ""
  },
  {
    "id": 1001,
    "upazilaId": 102,
    "nameBn": "লোগাং",
    "nameEn": ""
  },
  {
    "id": 1002,
    "upazilaId": 102,
    "nameBn": "চেঙ্গী",
    "nameEn": ""
  },
  {
    "id": 1003,
    "upazilaId": 102,
    "nameBn": "পানছড়ি",
    "nameEn": ""
  },
  {
    "id": 1004,
    "upazilaId": 102,
    "nameBn": "লতিবান উল্টাছড়ি",
    "nameEn": ""
  },
  {
    "id": 1005,
    "upazilaId": 103,
    "nameBn": "মহালছড়ি",
    "nameEn": ""
  },
  {
    "id": 1006,
    "upazilaId": 103,
    "nameBn": "মুবাছড়ি",
    "nameEn": ""
  },
  {
    "id": 1007,
    "upazilaId": 103,
    "nameBn": "ক্যায়াংঘাট মাইসছড়ি",
    "nameEn": ""
  },
  {
    "id": 1008,
    "upazilaId": 104,
    "nameBn": "তাইন্দং",
    "nameEn": ""
  },
  {
    "id": 1009,
    "upazilaId": 104,
    "nameBn": "তবলছড়ি",
    "nameEn": ""
  },
  {
    "id": 1010,
    "upazilaId": 104,
    "nameBn": "বড়নাল",
    "nameEn": ""
  },
  {
    "id": 1011,
    "upazilaId": 104,
    "nameBn": "গোমতি",
    "nameEn": ""
  },
  {
    "id": 1012,
    "upazilaId": 104,
    "nameBn": "বেলছড়ি",
    "nameEn": ""
  },
  {
    "id": 1013,
    "upazilaId": 104,
    "nameBn": "মাটিরাঙ্গা আমতলী",
    "nameEn": ""
  },
  {
    "id": 1014,
    "upazilaId": 104,
    "nameBn": "মাটিরাঙ্গা",
    "nameEn": ""
  },
  {
    "id": 1015,
    "upazilaId": 105,
    "nameBn": "মানিকছড়ি",
    "nameEn": ""
  },
  {
    "id": 1016,
    "upazilaId": 105,
    "nameBn": "বাটনাতলী",
    "nameEn": ""
  },
  {
    "id": 1017,
    "upazilaId": 105,
    "nameBn": "যোগ্যাছোলা তিনটহরী",
    "nameEn": ""
  },
  {
    "id": 1018,
    "upazilaId": 106,
    "nameBn": "রামগড়",
    "nameEn": ""
  },
  {
    "id": 1019,
    "upazilaId": 106,
    "nameBn": "পাতাছড়া",
    "nameEn": ""
  },
  {
    "id": 1020,
    "upazilaId": 107,
    "nameBn": "লক্ষ্মীছড়ি",
    "nameEn": ""
  },
  {
    "id": 1021,
    "upazilaId": 107,
    "nameBn": "দুল্যাতলী বর্মাছড়ি",
    "nameEn": ""
  },
  {
    "id": 1022,
    "upazilaId": 108,
    "nameBn": "বেতবুনিয়া",
    "nameEn": ""
  },
  {
    "id": 1023,
    "upazilaId": 108,
    "nameBn": "ফটিকছড়ি",
    "nameEn": ""
  },
  {
    "id": 1024,
    "upazilaId": 108,
    "nameBn": "ঘাগড়া কলমপতি",
    "nameEn": ""
  },
  {
    "id": 1025,
    "upazilaId": 109,
    "nameBn": "চন্দ্রঘোনা রাইখালী",
    "nameEn": ""
  },
  {
    "id": 1026,
    "upazilaId": 109,
    "nameBn": "চিৎমরম",
    "nameEn": ""
  },
  {
    "id": 1027,
    "upazilaId": 109,
    "nameBn": "কাপ্তাই",
    "nameEn": ""
  },
  {
    "id": 1028,
    "upazilaId": 109,
    "nameBn": "ওয়াজ্ঞা",
    "nameEn": ""
  },
  {
    "id": 1029,
    "upazilaId": 110,
    "nameBn": "জুরাছড়ি",
    "nameEn": ""
  },
  {
    "id": 1030,
    "upazilaId": 110,
    "nameBn": "বনযোগীছড়া",
    "nameEn": ""
  },
  {
    "id": 1031,
    "upazilaId": 110,
    "nameBn": "মৈদং দুমদুম্যা",
    "nameEn": ""
  },
  {
    "id": 1032,
    "upazilaId": 111,
    "nameBn": "সাবেক্ষ্যং",
    "nameEn": ""
  },
  {
    "id": 1033,
    "upazilaId": 111,
    "nameBn": "নানিয়ারচর",
    "nameEn": ""
  },
  {
    "id": 1034,
    "upazilaId": 111,
    "nameBn": "বুড়িঘাট ঘিলাছড়ি",
    "nameEn": ""
  },
  {
    "id": 1035,
    "upazilaId": 112,
    "nameBn": "সুবলং",
    "nameEn": ""
  },
  {
    "id": 1036,
    "upazilaId": 112,
    "nameBn": "বরকল",
    "nameEn": ""
  },
  {
    "id": 1037,
    "upazilaId": 112,
    "nameBn": "আইমাছড়া",
    "nameEn": ""
  },
  {
    "id": 1038,
    "upazilaId": 112,
    "nameBn": "ভূষণছড়া বড় হরিণা",
    "nameEn": ""
  },
  {
    "id": 1039,
    "upazilaId": 113,
    "nameBn": "সারোয়াতলী",
    "nameEn": ""
  },
  {
    "id": 1040,
    "upazilaId": 113,
    "nameBn": "খেদারমারা",
    "nameEn": ""
  },
  {
    "id": 1041,
    "upazilaId": 113,
    "nameBn": "বাঘাইছড়ি",
    "nameEn": ""
  },
  {
    "id": 1042,
    "upazilaId": 113,
    "nameBn": "মারিশ্যা",
    "nameEn": ""
  },
  {
    "id": 1043,
    "upazilaId": 113,
    "nameBn": "রূপকারী",
    "nameEn": ""
  },
  {
    "id": 1044,
    "upazilaId": 113,
    "nameBn": "বঙ্গলতলী আমতলী",
    "nameEn": ""
  },
  {
    "id": 1045,
    "upazilaId": 113,
    "nameBn": "সাজেক",
    "nameEn": ""
  },
  {
    "id": 1046,
    "upazilaId": 114,
    "nameBn": "বিলাইছড়ি",
    "nameEn": ""
  },
  {
    "id": 1047,
    "upazilaId": 114,
    "nameBn": "কেংড়াছড়ি",
    "nameEn": ""
  },
  {
    "id": 1048,
    "upazilaId": 114,
    "nameBn": "ফারুয়া বড়থলি",
    "nameEn": ""
  },
  {
    "id": 1049,
    "upazilaId": 115,
    "nameBn": "জীবতলী",
    "nameEn": ""
  },
  {
    "id": 1050,
    "upazilaId": 115,
    "nameBn": "মগবান",
    "nameEn": ""
  },
  {
    "id": 1051,
    "upazilaId": 115,
    "nameBn": "সাপছড়ি",
    "nameEn": ""
  },
  {
    "id": 1052,
    "upazilaId": 115,
    "nameBn": "কুতুকছড়ি",
    "nameEn": ""
  },
  {
    "id": 1053,
    "upazilaId": 115,
    "nameBn": "বন্দুকভাঙ্গা",
    "nameEn": ""
  },
  {
    "id": 1054,
    "upazilaId": 115,
    "nameBn": "বালুখালী",
    "nameEn": ""
  },
  {
    "id": 1055,
    "upazilaId": 116,
    "nameBn": "ঘিলাছড়ি",
    "nameEn": ""
  },
  {
    "id": 1056,
    "upazilaId": 116,
    "nameBn": "গাইন্দ্যা",
    "nameEn": ""
  },
  {
    "id": 1057,
    "upazilaId": 116,
    "nameBn": "বাঙ্গালহালিয়া",
    "nameEn": ""
  },
  {
    "id": 1058,
    "upazilaId": 117,
    "nameBn": "আটারকছড়া",
    "nameEn": ""
  },
  {
    "id": 1059,
    "upazilaId": 117,
    "nameBn": "কালাপাকুজ্যা",
    "nameEn": ""
  },
  {
    "id": 1060,
    "upazilaId": 117,
    "nameBn": "গুলশাখালী",
    "nameEn": ""
  },
  {
    "id": 1061,
    "upazilaId": 117,
    "nameBn": "বগাচতর",
    "nameEn": ""
  },
  {
    "id": 1062,
    "upazilaId": 117,
    "nameBn": "ভাসান্যাদম",
    "nameEn": ""
  },
  {
    "id": 1063,
    "upazilaId": 117,
    "nameBn": "মাইনীমুখ",
    "nameEn": ""
  },
  {
    "id": 1064,
    "upazilaId": 117,
    "nameBn": "লংগদু",
    "nameEn": ""
  },
  {
    "id": 1065,
    "upazilaId": 118,
    "nameBn": "নরোত্তমপুর",
    "nameEn": ""
  },
  {
    "id": 1066,
    "upazilaId": 118,
    "nameBn": "সুন্দলপুর",
    "nameEn": ""
  },
  {
    "id": 1067,
    "upazilaId": 118,
    "nameBn": "ধানসিঁড়ি",
    "nameEn": ""
  },
  {
    "id": 1068,
    "upazilaId": 118,
    "nameBn": "ঘোষবাগ",
    "nameEn": ""
  },
  {
    "id": 1069,
    "upazilaId": 118,
    "nameBn": "চাপরাশিরহাট",
    "nameEn": ""
  },
  {
    "id": 1070,
    "upazilaId": 118,
    "nameBn": "ধানশালিক বাটইয়া",
    "nameEn": ""
  },
  {
    "id": 1071,
    "upazilaId": 119,
    "nameBn": "সিরাজপুর",
    "nameEn": ""
  },
  {
    "id": 1072,
    "upazilaId": 119,
    "nameBn": "চর পার্বতী",
    "nameEn": ""
  },
  {
    "id": 1073,
    "upazilaId": 119,
    "nameBn": "চর হাজারী",
    "nameEn": ""
  },
  {
    "id": 1074,
    "upazilaId": 119,
    "nameBn": "চর কাঁকড়া",
    "nameEn": ""
  },
  {
    "id": 1075,
    "upazilaId": 119,
    "nameBn": "চর ফকিরা",
    "nameEn": ""
  },
  {
    "id": 1076,
    "upazilaId": 119,
    "nameBn": "রামপুর",
    "nameEn": ""
  },
  {
    "id": 1077,
    "upazilaId": 119,
    "nameBn": "মুছাপুর",
    "nameEn": ""
  },
  {
    "id": 1078,
    "upazilaId": 119,
    "nameBn": "চর এলাহী",
    "nameEn": ""
  },
  {
    "id": 1079,
    "upazilaId": 120,
    "nameBn": "সাহাপুর",
    "nameEn": ""
  },
  {
    "id": 1080,
    "upazilaId": 120,
    "nameBn": "রামনারায়ণপুর",
    "nameEn": ""
  },
  {
    "id": 1081,
    "upazilaId": 120,
    "nameBn": "পরকোট",
    "nameEn": ""
  },
  {
    "id": 1082,
    "upazilaId": 120,
    "nameBn": "বদলকোট",
    "nameEn": ""
  },
  {
    "id": 1083,
    "upazilaId": 120,
    "nameBn": "মোহাম্মদপুর",
    "nameEn": ""
  },
  {
    "id": 1084,
    "upazilaId": 120,
    "nameBn": "পাঁচগাঁও",
    "nameEn": ""
  },
  {
    "id": 1085,
    "upazilaId": 120,
    "nameBn": "হাটপুকুরিয়া ঘাটলাবাগ",
    "nameEn": ""
  },
  {
    "id": 1086,
    "upazilaId": 120,
    "nameBn": "নোয়াখলা খিলপাড়া",
    "nameEn": ""
  },
  {
    "id": 1087,
    "upazilaId": 121,
    "nameBn": "চর মটুয়া",
    "nameEn": ""
  },
  {
    "id": 1088,
    "upazilaId": 121,
    "nameBn": "দাদপু্র",
    "nameEn": ""
  },
  {
    "id": 1089,
    "upazilaId": 121,
    "nameBn": "নোয়ান্নই",
    "nameEn": ""
  },
  {
    "id": 1090,
    "upazilaId": 121,
    "nameBn": "কাদির হানিফ",
    "nameEn": ""
  },
  {
    "id": 1091,
    "upazilaId": 121,
    "nameBn": "বিনোদপুর",
    "nameEn": ""
  },
  {
    "id": 1092,
    "upazilaId": 121,
    "nameBn": "নোয়াখালী",
    "nameEn": ""
  },
  {
    "id": 1093,
    "upazilaId": 121,
    "nameBn": "ধর্মপুর",
    "nameEn": ""
  },
  {
    "id": 1094,
    "upazilaId": 121,
    "nameBn": "এওজবালিয়া",
    "nameEn": ""
  },
  {
    "id": 1095,
    "upazilaId": 121,
    "nameBn": "কালাদরপ",
    "nameEn": ""
  },
  {
    "id": 1096,
    "upazilaId": 121,
    "nameBn": "অশ্বদিয়া",
    "nameEn": ""
  },
  {
    "id": 1097,
    "upazilaId": 121,
    "nameBn": "নিয়াজপুর",
    "nameEn": ""
  },
  {
    "id": 1098,
    "upazilaId": 121,
    "nameBn": "পূর্ব চর মটুয়া আণ্ডারচর",
    "nameEn": ""
  },
  {
    "id": 1099,
    "upazilaId": 122,
    "nameBn": "আমানউল্যাপুর",
    "nameEn": ""
  },
  {
    "id": 1100,
    "upazilaId": 122,
    "nameBn": "গোপালপুর",
    "nameEn": ""
  },
  {
    "id": 1101,
    "upazilaId": 122,
    "nameBn": "জিরতলী",
    "nameEn": ""
  },
  {
    "id": 1102,
    "upazilaId": 122,
    "nameBn": "আলাইয়ারপুর",
    "nameEn": ""
  },
  {
    "id": 1103,
    "upazilaId": 122,
    "nameBn": "ছয়ানী",
    "nameEn": ""
  },
  {
    "id": 1104,
    "upazilaId": 122,
    "nameBn": "রাজগঞ্জ",
    "nameEn": ""
  },
  {
    "id": 1105,
    "upazilaId": 122,
    "nameBn": "একলাশপুর",
    "nameEn": ""
  },
  {
    "id": 1106,
    "upazilaId": 122,
    "nameBn": "বেগমগঞ্জ",
    "nameEn": ""
  },
  {
    "id": 1107,
    "upazilaId": 122,
    "nameBn": "মিরওয়ারিশপুর",
    "nameEn": ""
  },
  {
    "id": 1108,
    "upazilaId": 122,
    "nameBn": "নরোত্তমপুর",
    "nameEn": ""
  },
  {
    "id": 1109,
    "upazilaId": 122,
    "nameBn": "দুর্গাপুর",
    "nameEn": ""
  },
  {
    "id": 1110,
    "upazilaId": 122,
    "nameBn": "কুতুবপুর",
    "nameEn": ""
  },
  {
    "id": 1111,
    "upazilaId": 122,
    "nameBn": "রসুলপুর",
    "nameEn": ""
  },
  {
    "id": 1112,
    "upazilaId": 122,
    "nameBn": "হাজীপুর",
    "nameEn": ""
  },
  {
    "id": 1113,
    "upazilaId": 122,
    "nameBn": "শরীফপুর কাদিরপুর",
    "nameEn": ""
  },
  {
    "id": 1114,
    "upazilaId": 123,
    "nameBn": "চর জব্বর",
    "nameEn": ""
  },
  {
    "id": 1115,
    "upazilaId": 123,
    "nameBn": "চর বাটা",
    "nameEn": ""
  },
  {
    "id": 1116,
    "upazilaId": 123,
    "nameBn": "চর ক্লার্ক",
    "nameEn": ""
  },
  {
    "id": 1117,
    "upazilaId": 123,
    "nameBn": "চর ওয়াপদা",
    "nameEn": ""
  },
  {
    "id": 1118,
    "upazilaId": 123,
    "nameBn": "চর জুবলী",
    "nameEn": ""
  },
  {
    "id": 1119,
    "upazilaId": 123,
    "nameBn": "চর আমানউল্যা",
    "nameEn": ""
  },
  {
    "id": 1120,
    "upazilaId": 123,
    "nameBn": "পূর্ব চর বাটা মোহাম্মদপুর",
    "nameEn": ""
  },
  {
    "id": 1121,
    "upazilaId": 124,
    "nameBn": "ছাতারপাইয়া",
    "nameEn": ""
  },
  {
    "id": 1122,
    "upazilaId": 124,
    "nameBn": "কেশারপাড়",
    "nameEn": ""
  },
  {
    "id": 1123,
    "upazilaId": 124,
    "nameBn": "ডুমুরুয়া",
    "nameEn": ""
  },
  {
    "id": 1124,
    "upazilaId": 124,
    "nameBn": "কাদরা",
    "nameEn": ""
  },
  {
    "id": 1125,
    "upazilaId": 124,
    "nameBn": "অর্জুনতলা",
    "nameEn": ""
  },
  {
    "id": 1126,
    "upazilaId": 124,
    "nameBn": "কাবিলপুর",
    "nameEn": ""
  },
  {
    "id": 1127,
    "upazilaId": 124,
    "nameBn": "মোহাম্মদপুর",
    "nameEn": ""
  },
  {
    "id": 1128,
    "upazilaId": 124,
    "nameBn": "বিজবাগ নবীপুর",
    "nameEn": ""
  },
  {
    "id": 1129,
    "upazilaId": 125,
    "nameBn": "জয়াগ",
    "nameEn": ""
  },
  {
    "id": 1130,
    "upazilaId": 125,
    "nameBn": "নদনা",
    "nameEn": ""
  },
  {
    "id": 1131,
    "upazilaId": 125,
    "nameBn": "চাষীরহাট",
    "nameEn": ""
  },
  {
    "id": 1132,
    "upazilaId": 125,
    "nameBn": "বারগাঁও",
    "nameEn": ""
  },
  {
    "id": 1133,
    "upazilaId": 125,
    "nameBn": "অম্বরনগর",
    "nameEn": ""
  },
  {
    "id": 1134,
    "upazilaId": 125,
    "nameBn": "নাটেশ্বর",
    "nameEn": ""
  },
  {
    "id": 1135,
    "upazilaId": 125,
    "nameBn": "বজরা",
    "nameEn": ""
  },
  {
    "id": 1136,
    "upazilaId": 125,
    "nameBn": "সোনাপুর",
    "nameEn": ""
  },
  {
    "id": 1137,
    "upazilaId": 125,
    "nameBn": "দেওটি আমিশাপাড়া",
    "nameEn": ""
  },
  {
    "id": 1138,
    "upazilaId": 126,
    "nameBn": "হরণী",
    "nameEn": ""
  },
  {
    "id": 1139,
    "upazilaId": 126,
    "nameBn": "চানন্দী",
    "nameEn": ""
  },
  {
    "id": 1140,
    "upazilaId": 126,
    "nameBn": "সুখচর",
    "nameEn": ""
  },
  {
    "id": 1141,
    "upazilaId": 126,
    "nameBn": "নলচিরা",
    "nameEn": ""
  },
  {
    "id": 1142,
    "upazilaId": 126,
    "nameBn": "চর ঈশ্বর",
    "nameEn": ""
  },
  {
    "id": 1143,
    "upazilaId": 126,
    "nameBn": "চর কিং",
    "nameEn": ""
  },
  {
    "id": 1144,
    "upazilaId": 126,
    "nameBn": "তমরদ্দি",
    "nameEn": ""
  },
  {
    "id": 1145,
    "upazilaId": 126,
    "nameBn": "সোনাদিয়া",
    "nameEn": ""
  },
  {
    "id": 1146,
    "upazilaId": 126,
    "nameBn": "বুড়িরচর",
    "nameEn": ""
  },
  {
    "id": 1147,
    "upazilaId": 126,
    "nameBn": "জাহাজমারা নিঝুমদ্বীপ",
    "nameEn": ""
  },
  {
    "id": 1148,
    "upazilaId": 127,
    "nameBn": "চর কালকিনি",
    "nameEn": ""
  },
  {
    "id": 1149,
    "upazilaId": 127,
    "nameBn": "সাহেবেরহাট",
    "nameEn": ""
  },
  {
    "id": 1150,
    "upazilaId": 127,
    "nameBn": "চর লরেন্স",
    "nameEn": ""
  },
  {
    "id": 1151,
    "upazilaId": 127,
    "nameBn": "চর মার্টিন,চর ফলকন",
    "nameEn": ""
  },
  {
    "id": 1152,
    "upazilaId": 127,
    "nameBn": "পাটারীরহাট",
    "nameEn": ""
  },
  {
    "id": 1153,
    "upazilaId": 127,
    "nameBn": "হাজিরহাট",
    "nameEn": ""
  },
  {
    "id": 1154,
    "upazilaId": 127,
    "nameBn": "চর কাদিরা,তোরাবগঞ্জ",
    "nameEn": ""
  },
  {
    "id": 1155,
    "upazilaId": 128,
    "nameBn": "কাঞ্চনপুর",
    "nameEn": ""
  },
  {
    "id": 1156,
    "upazilaId": 128,
    "nameBn": "নোয়াগাঁও",
    "nameEn": ""
  },
  {
    "id": 1157,
    "upazilaId": 128,
    "nameBn": "ভাদুর",
    "nameEn": ""
  },
  {
    "id": 1158,
    "upazilaId": 128,
    "nameBn": "ইছাপুর",
    "nameEn": ""
  },
  {
    "id": 1159,
    "upazilaId": 128,
    "nameBn": "চণ্ডিপুর",
    "nameEn": ""
  },
  {
    "id": 1160,
    "upazilaId": 128,
    "nameBn": "লামচর",
    "nameEn": ""
  },
  {
    "id": 1161,
    "upazilaId": 128,
    "nameBn": "দরবেশপুর",
    "nameEn": ""
  },
  {
    "id": 1162,
    "upazilaId": 128,
    "nameBn": "করপাড়া",
    "nameEn": ""
  },
  {
    "id": 1163,
    "upazilaId": 128,
    "nameBn": "ভোলাকোট",
    "nameEn": ""
  },
  {
    "id": 1164,
    "upazilaId": 128,
    "nameBn": "ভাটরা",
    "nameEn": ""
  },
  {
    "id": 1165,
    "upazilaId": 129,
    "nameBn": "চর বাদাম",
    "nameEn": ""
  },
  {
    "id": 1166,
    "upazilaId": 129,
    "nameBn": "চর পোড়াগাছা",
    "nameEn": ""
  },
  {
    "id": 1167,
    "upazilaId": 129,
    "nameBn": "আলেকজান্ডার",
    "nameEn": ""
  },
  {
    "id": 1168,
    "upazilaId": 129,
    "nameBn": "চর আবদুল্যাহ",
    "nameEn": ""
  },
  {
    "id": 1169,
    "upazilaId": 129,
    "nameBn": "চর আলগী",
    "nameEn": ""
  },
  {
    "id": 1170,
    "upazilaId": 129,
    "nameBn": "চর রমিজ",
    "nameEn": ""
  },
  {
    "id": 1171,
    "upazilaId": 129,
    "nameBn": "বড়খেড়ী",
    "nameEn": ""
  },
  {
    "id": 1172,
    "upazilaId": 129,
    "nameBn": "চর গাজী",
    "nameEn": ""
  },
  {
    "id": 1173,
    "upazilaId": 130,
    "nameBn": "উত্তর চর আবাবিল",
    "nameEn": ""
  },
  {
    "id": 1174,
    "upazilaId": 130,
    "nameBn": "উত্তর চর বংশী",
    "nameEn": ""
  },
  {
    "id": 1175,
    "upazilaId": 130,
    "nameBn": "চর মোহনা",
    "nameEn": ""
  },
  {
    "id": 1176,
    "upazilaId": 130,
    "nameBn": "সোনাপুর",
    "nameEn": ""
  },
  {
    "id": 1177,
    "upazilaId": 130,
    "nameBn": "চর পাতা",
    "nameEn": ""
  },
  {
    "id": 1178,
    "upazilaId": 130,
    "nameBn": "কেরোয়া",
    "nameEn": ""
  },
  {
    "id": 1179,
    "upazilaId": 130,
    "nameBn": "বামনী",
    "nameEn": ""
  },
  {
    "id": 1180,
    "upazilaId": 130,
    "nameBn": "দক্ষিণ চর বংশী",
    "nameEn": ""
  },
  {
    "id": 1181,
    "upazilaId": 130,
    "nameBn": "দক্ষিণ চর আবাবিল",
    "nameEn": ""
  },
  {
    "id": 1182,
    "upazilaId": 130,
    "nameBn": "রায়পুর",
    "nameEn": ""
  },
  {
    "id": 1183,
    "upazilaId": 131,
    "nameBn": "উত্তর হামছাদী",
    "nameEn": ""
  },
  {
    "id": 1184,
    "upazilaId": 131,
    "nameBn": "দক্ষিণ হামছাদী",
    "nameEn": ""
  },
  {
    "id": 1185,
    "upazilaId": 131,
    "nameBn": "দালাল বাজার",
    "nameEn": ""
  },
  {
    "id": 1186,
    "upazilaId": 131,
    "nameBn": "চর রুহিতা",
    "nameEn": ""
  },
  {
    "id": 1187,
    "upazilaId": 131,
    "nameBn": "পার্বতীনগর",
    "nameEn": ""
  },
  {
    "id": 1188,
    "upazilaId": 131,
    "nameBn": "বাঙ্গাখাঁ",
    "nameEn": ""
  },
  {
    "id": 1189,
    "upazilaId": 131,
    "nameBn": "লাহারকান্দি",
    "nameEn": ""
  },
  {
    "id": 1190,
    "upazilaId": 131,
    "nameBn": "শাকচর",
    "nameEn": ""
  },
  {
    "id": 1191,
    "upazilaId": 131,
    "nameBn": "ভবানীগঞ্জ",
    "nameEn": ""
  },
  {
    "id": 1192,
    "upazilaId": 131,
    "nameBn": "তেওয়ারীগঞ্জ",
    "nameEn": ""
  },
  {
    "id": 1193,
    "upazilaId": 131,
    "nameBn": "চর রমণীমোহন",
    "nameEn": ""
  },
  {
    "id": 1194,
    "upazilaId": 131,
    "nameBn": "টুমচর",
    "nameEn": ""
  },
  {
    "id": 1195,
    "upazilaId": 131,
    "nameBn": "বশিকপুর",
    "nameEn": ""
  },
  {
    "id": 1196,
    "upazilaId": 131,
    "nameBn": "দত্তপাড়া",
    "nameEn": ""
  },
  {
    "id": 1197,
    "upazilaId": 131,
    "nameBn": "উত্তর জয়পুর",
    "nameEn": ""
  },
  {
    "id": 1198,
    "upazilaId": 131,
    "nameBn": "চন্দ্রগঞ্জ",
    "nameEn": ""
  },
  {
    "id": 1199,
    "upazilaId": 131,
    "nameBn": "হাজিরপাড়া",
    "nameEn": ""
  },
  {
    "id": 1200,
    "upazilaId": 131,
    "nameBn": "চর শাহী",
    "nameEn": ""
  },
  {
    "id": 1201,
    "upazilaId": 131,
    "nameBn": "দিঘলী",
    "nameEn": ""
  },
  {
    "id": 1202,
    "upazilaId": 131,
    "nameBn": "মান্দারী",
    "nameEn": ""
  },
  {
    "id": 1203,
    "upazilaId": 131,
    "nameBn": "কুশাখালী।",
    "nameEn": ""
  },
  {
    "id": 1204,
    "upazilaId": 132,
    "nameBn": "শর্শদি",
    "nameEn": ""
  },
  {
    "id": 1205,
    "upazilaId": 132,
    "nameBn": "পাঁচগাছিয়া",
    "nameEn": ""
  },
  {
    "id": 1206,
    "upazilaId": 132,
    "nameBn": "বরাহীপুর (বিলুপ্ত)",
    "nameEn": ""
  },
  {
    "id": 1207,
    "upazilaId": 132,
    "nameBn": "ধর্মপুর",
    "nameEn": ""
  },
  {
    "id": 1208,
    "upazilaId": 132,
    "nameBn": "কাজিরবাগ",
    "nameEn": ""
  },
  {
    "id": 1209,
    "upazilaId": 132,
    "nameBn": "কালিদহ",
    "nameEn": ""
  },
  {
    "id": 1210,
    "upazilaId": 132,
    "nameBn": "বালিগাঁও",
    "nameEn": ""
  },
  {
    "id": 1211,
    "upazilaId": 132,
    "nameBn": "ধলিয়া",
    "nameEn": ""
  },
  {
    "id": 1212,
    "upazilaId": 132,
    "nameBn": "লেমুয়া",
    "nameEn": ""
  },
  {
    "id": 1213,
    "upazilaId": 132,
    "nameBn": "ছনুয়া",
    "nameEn": ""
  },
  {
    "id": 1214,
    "upazilaId": 132,
    "nameBn": "মোটবী",
    "nameEn": ""
  },
  {
    "id": 1215,
    "upazilaId": 132,
    "nameBn": "ফাজিলপুর",
    "nameEn": ""
  },
  {
    "id": 1216,
    "upazilaId": 132,
    "nameBn": "ফরহাদনগর",
    "nameEn": ""
  },
  {
    "id": 1217,
    "upazilaId": 133,
    "nameBn": "সিন্দুরপুর",
    "nameEn": ""
  },
  {
    "id": 1218,
    "upazilaId": 133,
    "nameBn": "রাজাপুর",
    "nameEn": ""
  },
  {
    "id": 1219,
    "upazilaId": 133,
    "nameBn": "পূর্ব চন্দ্রপুর",
    "nameEn": ""
  },
  {
    "id": 1220,
    "upazilaId": 133,
    "nameBn": "রামনগর",
    "nameEn": ""
  },
  {
    "id": 1221,
    "upazilaId": 133,
    "nameBn": "ইয়াকুবপুর",
    "nameEn": ""
  },
  {
    "id": 1222,
    "upazilaId": 133,
    "nameBn": "দাগনভূঁইয়া",
    "nameEn": ""
  },
  {
    "id": 1223,
    "upazilaId": 133,
    "nameBn": "মাতুভূঁইয়া",
    "nameEn": ""
  },
  {
    "id": 1224,
    "upazilaId": 133,
    "nameBn": "জায়লস্কর",
    "nameEn": ""
  },
  {
    "id": 1225,
    "upazilaId": 134,
    "nameBn": "চর মজলিশপুর",
    "nameEn": ""
  },
  {
    "id": 1226,
    "upazilaId": 134,
    "nameBn": "বগাদানা",
    "nameEn": ""
  },
  {
    "id": 1227,
    "upazilaId": 134,
    "nameBn": "মঙ্গলকান্দি",
    "nameEn": ""
  },
  {
    "id": 1228,
    "upazilaId": 134,
    "nameBn": "মতিগঞ্জ",
    "nameEn": ""
  },
  {
    "id": 1229,
    "upazilaId": 134,
    "nameBn": "চর দরবেশ",
    "nameEn": ""
  },
  {
    "id": 1230,
    "upazilaId": 134,
    "nameBn": "চর চান্দিয়া",
    "nameEn": ""
  },
  {
    "id": 1231,
    "upazilaId": 134,
    "nameBn": "সোনাগাজী",
    "nameEn": ""
  },
  {
    "id": 1232,
    "upazilaId": 134,
    "nameBn": "আমিরাবাদ",
    "nameEn": ""
  },
  {
    "id": 1233,
    "upazilaId": 134,
    "nameBn": "নবাবপুর",
    "nameEn": ""
  },
  {
    "id": 1234,
    "upazilaId": 135,
    "nameBn": "মহামায়া",
    "nameEn": ""
  },
  {
    "id": 1235,
    "upazilaId": 135,
    "nameBn": "পাঠাননগর",
    "nameEn": ""
  },
  {
    "id": 1236,
    "upazilaId": 135,
    "nameBn": "ছাগলনাইয়া (বিলুপ্ত)",
    "nameEn": ""
  },
  {
    "id": 1237,
    "upazilaId": 135,
    "nameBn": "রাধানগর",
    "nameEn": ""
  },
  {
    "id": 1238,
    "upazilaId": 135,
    "nameBn": "শুভপুর",
    "nameEn": ""
  },
  {
    "id": 1239,
    "upazilaId": 135,
    "nameBn": "ঘোপাল",
    "nameEn": ""
  },
  {
    "id": 1240,
    "upazilaId": 136,
    "nameBn": "মির্জানগর",
    "nameEn": ""
  },
  {
    "id": 1241,
    "upazilaId": 136,
    "nameBn": "পরশুরাম (বিলুপ্ত)",
    "nameEn": ""
  },
  {
    "id": 1242,
    "upazilaId": 136,
    "nameBn": "চিথলিয়া",
    "nameEn": ""
  },
  {
    "id": 1243,
    "upazilaId": 136,
    "nameBn": "বক্স মাহমুদ",
    "nameEn": ""
  },
  {
    "id": 1244,
    "upazilaId": 137,
    "nameBn": "ফুলগাজী",
    "nameEn": ""
  },
  {
    "id": 1245,
    "upazilaId": 137,
    "nameBn": "মুন্সিরহাট",
    "nameEn": ""
  },
  {
    "id": 1246,
    "upazilaId": 137,
    "nameBn": "দরবারপুর",
    "nameEn": ""
  },
  {
    "id": 1247,
    "upazilaId": 137,
    "nameBn": "আনন্দপুর",
    "nameEn": ""
  },
  {
    "id": 1248,
    "upazilaId": 137,
    "nameBn": "আমজাদহাট",
    "nameEn": ""
  },
  {
    "id": 1249,
    "upazilaId": 137,
    "nameBn": "জিএমহাট",
    "nameEn": ""
  },
  {
    "id": 1250,
    "upazilaId": 138,
    "nameBn": "আগানগর",
    "nameEn": ""
  },
  {
    "id": 1251,
    "upazilaId": 138,
    "nameBn": "ভবানীপুর",
    "nameEn": ""
  },
  {
    "id": 1252,
    "upazilaId": 138,
    "nameBn": "খোশবাস উত্তর",
    "nameEn": ""
  },
  {
    "id": 1253,
    "upazilaId": 138,
    "nameBn": "খোশবাস দক্ষিণ",
    "nameEn": ""
  },
  {
    "id": 1254,
    "upazilaId": 138,
    "nameBn": "ঝলম",
    "nameEn": ""
  },
  {
    "id": 1255,
    "upazilaId": 138,
    "nameBn": "চিতড্ডা",
    "nameEn": ""
  },
  {
    "id": 1256,
    "upazilaId": 138,
    "nameBn": "শাকপুর",
    "nameEn": ""
  },
  {
    "id": 1257,
    "upazilaId": 138,
    "nameBn": "ভাউকসার",
    "nameEn": ""
  },
  {
    "id": 1258,
    "upazilaId": 138,
    "nameBn": "শিলমুড়ী দক্ষিণ",
    "nameEn": ""
  },
  {
    "id": 1259,
    "upazilaId": 138,
    "nameBn": "শিলমুড়ী উত্তর",
    "nameEn": ""
  },
  {
    "id": 1260,
    "upazilaId": 138,
    "nameBn": "গালিমপুর",
    "nameEn": ""
  },
  {
    "id": 1261,
    "upazilaId": 138,
    "nameBn": "আড্ডা",
    "nameEn": ""
  },
  {
    "id": 1262,
    "upazilaId": 138,
    "nameBn": "আদ্রা",
    "nameEn": ""
  },
  {
    "id": 1263,
    "upazilaId": 138,
    "nameBn": "লক্ষ্মীপুর",
    "nameEn": ""
  },
  {
    "id": 1264,
    "upazilaId": 138,
    "nameBn": "পয়ালগাছা",
    "nameEn": ""
  },
  {
    "id": 1265,
    "upazilaId": 139,
    "nameBn": "সুহিলপুর",
    "nameEn": ""
  },
  {
    "id": 1266,
    "upazilaId": 139,
    "nameBn": "বাতাঘাসী",
    "nameEn": ""
  },
  {
    "id": 1267,
    "upazilaId": 139,
    "nameBn": "মাধাইয়া",
    "nameEn": ""
  },
  {
    "id": 1268,
    "upazilaId": 139,
    "nameBn": "মহিচাইল",
    "nameEn": ""
  },
  {
    "id": 1269,
    "upazilaId": 139,
    "nameBn": "কেরণখাল",
    "nameEn": ""
  },
  {
    "id": 1270,
    "upazilaId": 139,
    "nameBn": "বাড়েরা",
    "nameEn": ""
  },
  {
    "id": 1271,
    "upazilaId": 139,
    "nameBn": "এতবারপুর",
    "nameEn": ""
  },
  {
    "id": 1272,
    "upazilaId": 139,
    "nameBn": "বরকইট",
    "nameEn": ""
  },
  {
    "id": 1273,
    "upazilaId": 139,
    "nameBn": "মাইজখার",
    "nameEn": ""
  },
  {
    "id": 1274,
    "upazilaId": 139,
    "nameBn": "গল্লাই",
    "nameEn": ""
  },
  {
    "id": 1275,
    "upazilaId": 139,
    "nameBn": "দোল্লাই নবাবপুর",
    "nameEn": ""
  },
  {
    "id": 1276,
    "upazilaId": 139,
    "nameBn": "বরকরই",
    "nameEn": ""
  },
  {
    "id": 1277,
    "upazilaId": 139,
    "nameBn": "জোয়াগ",
    "nameEn": ""
  },
  {
    "id": 1278,
    "upazilaId": 140,
    "nameBn": "দাউদকান্দি উত্তর",
    "nameEn": ""
  },
  {
    "id": 1279,
    "upazilaId": 140,
    "nameBn": "দাউদকান্দি দক্ষিণ (বিলুপ্ত)",
    "nameEn": ""
  },
  {
    "id": 1280,
    "upazilaId": 140,
    "nameBn": "সুন্দলপুর",
    "nameEn": ""
  },
  {
    "id": 1281,
    "upazilaId": 140,
    "nameBn": "বারপাড়া",
    "nameEn": ""
  },
  {
    "id": 1282,
    "upazilaId": 140,
    "nameBn": "গৌরীপুর",
    "nameEn": ""
  },
  {
    "id": 1283,
    "upazilaId": 140,
    "nameBn": "জিংলাতলী",
    "nameEn": ""
  },
  {
    "id": 1284,
    "upazilaId": 140,
    "nameBn": "ইলিয়টগঞ্জ উত্তর",
    "nameEn": ""
  },
  {
    "id": 1285,
    "upazilaId": 140,
    "nameBn": "ইলিয়টগঞ্জ দক্ষিণ",
    "nameEn": ""
  },
  {
    "id": 1286,
    "upazilaId": 140,
    "nameBn": "মালিগাঁও",
    "nameEn": ""
  },
  {
    "id": 1287,
    "upazilaId": 140,
    "nameBn": "মোহাম্মদপুর পশ্চিম",
    "nameEn": ""
  },
  {
    "id": 1288,
    "upazilaId": 140,
    "nameBn": "মারুকা",
    "nameEn": ""
  },
  {
    "id": 1289,
    "upazilaId": 140,
    "nameBn": "বিটেশ্বর",
    "nameEn": ""
  },
  {
    "id": 1290,
    "upazilaId": 140,
    "nameBn": "গোয়ালমারী",
    "nameEn": ""
  },
  {
    "id": 1291,
    "upazilaId": 140,
    "nameBn": "পদুয়া",
    "nameEn": ""
  },
  {
    "id": 1292,
    "upazilaId": 140,
    "nameBn": "পাঁচগাছিয়া পশ্চিম",
    "nameEn": ""
  },
  {
    "id": 1293,
    "upazilaId": 140,
    "nameBn": "দৌলতপুর",
    "nameEn": ""
  },
  {
    "id": 1294,
    "upazilaId": 141,
    "nameBn": "বাকই",
    "nameEn": ""
  },
  {
    "id": 1295,
    "upazilaId": 141,
    "nameBn": "মুদাফফরগঞ্জ",
    "nameEn": ""
  },
  {
    "id": 1296,
    "upazilaId": 141,
    "nameBn": "মুদাফফরগঞ্জ দক্ষিণ",
    "nameEn": ""
  },
  {
    "id": 1297,
    "upazilaId": 141,
    "nameBn": "কান্দিরপাড়",
    "nameEn": ""
  },
  {
    "id": 1298,
    "upazilaId": 141,
    "nameBn": "গোবিন্দপুর",
    "nameEn": ""
  },
  {
    "id": 1299,
    "upazilaId": 141,
    "nameBn": "উত্তরদা",
    "nameEn": ""
  },
  {
    "id": 1300,
    "upazilaId": 141,
    "nameBn": "আজগরা",
    "nameEn": ""
  },
  {
    "id": 1301,
    "upazilaId": 141,
    "nameBn": "লাকসাম পূর্ব",
    "nameEn": ""
  },
  {
    "id": 1302,
    "upazilaId": 142,
    "nameBn": "মাধবপুর",
    "nameEn": ""
  },
  {
    "id": 1303,
    "upazilaId": 142,
    "nameBn": "শিদলাই",
    "nameEn": ""
  },
  {
    "id": 1304,
    "upazilaId": 142,
    "nameBn": "চান্দলা",
    "nameEn": ""
  },
  {
    "id": 1305,
    "upazilaId": 142,
    "nameBn": "শশীদল",
    "nameEn": ""
  },
  {
    "id": 1306,
    "upazilaId": 142,
    "nameBn": "দুলালপুর",
    "nameEn": ""
  },
  {
    "id": 1307,
    "upazilaId": 142,
    "nameBn": "ব্রাহ্মণপাড়া সদর",
    "nameEn": ""
  },
  {
    "id": 1308,
    "upazilaId": 142,
    "nameBn": "সাহেবাবাদ",
    "nameEn": ""
  },
  {
    "id": 1309,
    "upazilaId": 142,
    "nameBn": "মালাপাড়া",
    "nameEn": ""
  },
  {
    "id": 1310,
    "upazilaId": 143,
    "nameBn": "রাজাপুর",
    "nameEn": ""
  },
  {
    "id": 1311,
    "upazilaId": 143,
    "nameBn": "বাকশীমূল",
    "nameEn": ""
  },
  {
    "id": 1312,
    "upazilaId": 143,
    "nameBn": "বুড়িচং সদর",
    "nameEn": ""
  },
  {
    "id": 1313,
    "upazilaId": 143,
    "nameBn": "ষোলনল",
    "nameEn": ""
  },
  {
    "id": 1314,
    "upazilaId": 143,
    "nameBn": "পীরযাত্রাপুর",
    "nameEn": ""
  },
  {
    "id": 1315,
    "upazilaId": 143,
    "nameBn": "ময়নামতি",
    "nameEn": ""
  },
  {
    "id": 1316,
    "upazilaId": 143,
    "nameBn": "মোকাম",
    "nameEn": ""
  },
  {
    "id": 1317,
    "upazilaId": 143,
    "nameBn": "ভারেল্লা",
    "nameEn": ""
  },
  {
    "id": 1318,
    "upazilaId": 143,
    "nameBn": "ভারেল্লা দক্ষিণ",
    "nameEn": ""
  },
  {
    "id": 1319,
    "upazilaId": 144,
    "nameBn": "কাশিনগর",
    "nameEn": ""
  },
  {
    "id": 1320,
    "upazilaId": 144,
    "nameBn": "উজিরপুর",
    "nameEn": ""
  },
  {
    "id": 1321,
    "upazilaId": 144,
    "nameBn": "কালিকাপুর",
    "nameEn": ""
  },
  {
    "id": 1322,
    "upazilaId": 144,
    "nameBn": "শ্রীপুর",
    "nameEn": ""
  },
  {
    "id": 1323,
    "upazilaId": 144,
    "nameBn": "শুভপুর",
    "nameEn": ""
  },
  {
    "id": 1324,
    "upazilaId": 144,
    "nameBn": "ঘোলপাশা",
    "nameEn": ""
  },
  {
    "id": 1325,
    "upazilaId": 144,
    "nameBn": "চৌদ্দগ্রাম (বিলুপ্ত)",
    "nameEn": ""
  },
  {
    "id": 1326,
    "upazilaId": 144,
    "nameBn": "মুন্সিরহাট",
    "nameEn": ""
  },
  {
    "id": 1327,
    "upazilaId": 144,
    "nameBn": "কনকাপৈত",
    "nameEn": ""
  },
  {
    "id": 1328,
    "upazilaId": 144,
    "nameBn": "বাতিসা",
    "nameEn": ""
  },
  {
    "id": 1329,
    "upazilaId": 144,
    "nameBn": "চিওড়া",
    "nameEn": ""
  },
  {
    "id": 1330,
    "upazilaId": 144,
    "nameBn": "গুণবতী",
    "nameEn": ""
  },
  {
    "id": 1331,
    "upazilaId": 144,
    "nameBn": "জগন্নাথদীঘি",
    "nameEn": ""
  },
  {
    "id": 1332,
    "upazilaId": 144,
    "nameBn": "আলকরা",
    "nameEn": ""
  },
  {
    "id": 1333,
    "upazilaId": 145,
    "nameBn": "বড়শালঘর",
    "nameEn": ""
  },
  {
    "id": 1334,
    "upazilaId": 145,
    "nameBn": "ইউসুফপুর",
    "nameEn": ""
  },
  {
    "id": 1335,
    "upazilaId": 145,
    "nameBn": "রসুলপুর",
    "nameEn": ""
  },
  {
    "id": 1336,
    "upazilaId": 145,
    "nameBn": "সুবিল",
    "nameEn": ""
  },
  {
    "id": 1337,
    "upazilaId": 145,
    "nameBn": "৫নং দেবিদ্বার (বিলুপ্ত)",
    "nameEn": ""
  },
  {
    "id": 1338,
    "upazilaId": 145,
    "nameBn": "ফতেহাবাদ",
    "nameEn": ""
  },
  {
    "id": 1339,
    "upazilaId": 145,
    "nameBn": "এলাহাবাদ",
    "nameEn": ""
  },
  {
    "id": 1340,
    "upazilaId": 145,
    "nameBn": "জাফরগঞ্জ",
    "nameEn": ""
  },
  {
    "id": 1341,
    "upazilaId": 145,
    "nameBn": "গুনাইঘর উত্তর",
    "nameEn": ""
  },
  {
    "id": 1342,
    "upazilaId": 145,
    "nameBn": "গুনাইঘর দক্ষিণ",
    "nameEn": ""
  },
  {
    "id": 1343,
    "upazilaId": 145,
    "nameBn": "রাজামেহার",
    "nameEn": ""
  },
  {
    "id": 1344,
    "upazilaId": 145,
    "nameBn": "ভানী",
    "nameEn": ""
  },
  {
    "id": 1345,
    "upazilaId": 145,
    "nameBn": "ধামতী",
    "nameEn": ""
  },
  {
    "id": 1346,
    "upazilaId": 145,
    "nameBn": "সুলতানপুর",
    "nameEn": ""
  },
  {
    "id": 1347,
    "upazilaId": 145,
    "nameBn": "বরকামতা",
    "nameEn": ""
  },
  {
    "id": 1348,
    "upazilaId": 145,
    "nameBn": "মোহনপুর",
    "nameEn": ""
  },
  {
    "id": 1349,
    "upazilaId": 145,
    "nameBn": "দেবিদ্বার",
    "nameEn": ""
  },
  {
    "id": 1350,
    "upazilaId": 146,
    "nameBn": "মাথাভাঙ্গা",
    "nameEn": ""
  },
  {
    "id": 1351,
    "upazilaId": 146,
    "nameBn": "ঘাগুটিয়া",
    "nameEn": ""
  },
  {
    "id": 1352,
    "upazilaId": 146,
    "nameBn": "দুলালপুর",
    "nameEn": ""
  },
  {
    "id": 1353,
    "upazilaId": 146,
    "nameBn": "চান্দেরচর",
    "nameEn": ""
  },
  {
    "id": 1354,
    "upazilaId": 146,
    "nameBn": "আছাদপুর",
    "nameEn": ""
  },
  {
    "id": 1355,
    "upazilaId": 146,
    "nameBn": "নিলখী",
    "nameEn": ""
  },
  {
    "id": 1356,
    "upazilaId": 146,
    "nameBn": "ভাসানিয়া",
    "nameEn": ""
  },
  {
    "id": 1357,
    "upazilaId": 146,
    "nameBn": "ঘারমোড়া",
    "nameEn": ""
  },
  {
    "id": 1358,
    "upazilaId": 146,
    "nameBn": "জয়পুর",
    "nameEn": ""
  },
  {
    "id": 1359,
    "upazilaId": 147,
    "nameBn": "শ্রীকাইল",
    "nameEn": ""
  },
  {
    "id": 1360,
    "upazilaId": 147,
    "nameBn": "আকুবপুর",
    "nameEn": ""
  },
  {
    "id": 1361,
    "upazilaId": 147,
    "nameBn": "আন্দিকোট",
    "nameEn": ""
  },
  {
    "id": 1362,
    "upazilaId": 147,
    "nameBn": "পূর্বধইর পূর্ব",
    "nameEn": ""
  },
  {
    "id": 1363,
    "upazilaId": 147,
    "nameBn": "পূর্বধইর পশ্চিম",
    "nameEn": ""
  },
  {
    "id": 1364,
    "upazilaId": 147,
    "nameBn": "বাঙ্গরা পূর্ব",
    "nameEn": ""
  },
  {
    "id": 1365,
    "upazilaId": 147,
    "nameBn": "বাঙ্গরা পশ্চিম",
    "nameEn": ""
  },
  {
    "id": 1366,
    "upazilaId": 147,
    "nameBn": "চাপিতলা",
    "nameEn": ""
  },
  {
    "id": 1367,
    "upazilaId": 147,
    "nameBn": "কামাল্লা,যাত্রাপুর",
    "nameEn": ""
  },
  {
    "id": 1368,
    "upazilaId": 147,
    "nameBn": "রামচন্দ্রপুর উত্তর",
    "nameEn": ""
  },
  {
    "id": 1369,
    "upazilaId": 147,
    "nameBn": "রামচন্দ্রপুর দক্ষিণ",
    "nameEn": ""
  },
  {
    "id": 1370,
    "upazilaId": 147,
    "nameBn": "মুরাদনগর সদর",
    "nameEn": ""
  },
  {
    "id": 1371,
    "upazilaId": 147,
    "nameBn": "নবীপুর পূর্ব",
    "nameEn": ""
  },
  {
    "id": 1372,
    "upazilaId": 147,
    "nameBn": "নবীপুর পশ্চিম",
    "nameEn": ""
  },
  {
    "id": 1373,
    "upazilaId": 147,
    "nameBn": "ধামঘর,জাহাপুর",
    "nameEn": ""
  },
  {
    "id": 1374,
    "upazilaId": 147,
    "nameBn": "ছালিয়াকান্দি",
    "nameEn": ""
  },
  {
    "id": 1375,
    "upazilaId": 147,
    "nameBn": "দারোরা",
    "nameEn": ""
  },
  {
    "id": 1376,
    "upazilaId": 147,
    "nameBn": "পাহাড়পুর",
    "nameEn": ""
  },
  {
    "id": 1377,
    "upazilaId": 147,
    "nameBn": "বাবুটিপাড়া",
    "nameEn": ""
  },
  {
    "id": 1378,
    "upazilaId": 147,
    "nameBn": "টনকী",
    "nameEn": ""
  },
  {
    "id": 1379,
    "upazilaId": 148,
    "nameBn": "বাঙ্গড্ডা",
    "nameEn": ""
  },
  {
    "id": 1380,
    "upazilaId": 148,
    "nameBn": "পেড়িয়া",
    "nameEn": ""
  },
  {
    "id": 1381,
    "upazilaId": 148,
    "nameBn": "রায়কোট",
    "nameEn": ""
  },
  {
    "id": 1382,
    "upazilaId": 148,
    "nameBn": "মৌকরা",
    "nameEn": ""
  },
  {
    "id": 1383,
    "upazilaId": 148,
    "nameBn": "মক্রবপুর",
    "nameEn": ""
  },
  {
    "id": 1384,
    "upazilaId": 148,
    "nameBn": "আদ্রা দক্ষিণ",
    "nameEn": ""
  },
  {
    "id": 1385,
    "upazilaId": 148,
    "nameBn": "জোড্ডা পশ্চিম",
    "nameEn": ""
  },
  {
    "id": 1386,
    "upazilaId": 148,
    "nameBn": "ঢালুয়া",
    "nameEn": ""
  },
  {
    "id": 1387,
    "upazilaId": 148,
    "nameBn": "দৌলখাঁড়",
    "nameEn": ""
  },
  {
    "id": 1388,
    "upazilaId": 148,
    "nameBn": "বক্সগঞ্জ",
    "nameEn": ""
  },
  {
    "id": 1389,
    "upazilaId": 148,
    "nameBn": "সাতবাড়িয়া",
    "nameEn": ""
  },
  {
    "id": 1390,
    "upazilaId": 148,
    "nameBn": "হেসাখাল",
    "nameEn": ""
  },
  {
    "id": 1391,
    "upazilaId": 148,
    "nameBn": "বটতলী",
    "nameEn": ""
  },
  {
    "id": 1392,
    "upazilaId": 148,
    "nameBn": "জোড্ডা পূর্ব",
    "nameEn": ""
  },
  {
    "id": 1393,
    "upazilaId": 148,
    "nameBn": "রায়কোট দক্ষিণ",
    "nameEn": ""
  },
  {
    "id": 1394,
    "upazilaId": 148,
    "nameBn": "আদ্রা উত্তর",
    "nameEn": ""
  },
  {
    "id": 1395,
    "upazilaId": 149,
    "nameBn": "চন্দনপুর",
    "nameEn": ""
  },
  {
    "id": 1396,
    "upazilaId": 149,
    "nameBn": "চালিভাঙ্গা",
    "nameEn": ""
  },
  {
    "id": 1397,
    "upazilaId": 149,
    "nameBn": "রাধানগর",
    "nameEn": ""
  },
  {
    "id": 1398,
    "upazilaId": 149,
    "nameBn": "মানিকারচর",
    "nameEn": ""
  },
  {
    "id": 1399,
    "upazilaId": 149,
    "nameBn": "বড়কান্দা",
    "nameEn": ""
  },
  {
    "id": 1400,
    "upazilaId": 149,
    "nameBn": "গোবিন্দপুর",
    "nameEn": ""
  },
  {
    "id": 1401,
    "upazilaId": 149,
    "nameBn": "লুটেরচর",
    "nameEn": ""
  },
  {
    "id": 1402,
    "upazilaId": 149,
    "nameBn": "ভাওরখোলা।",
    "nameEn": ""
  },
  {
    "id": 1403,
    "upazilaId": 150,
    "nameBn": "সাতানী",
    "nameEn": ""
  },
  {
    "id": 1404,
    "upazilaId": 150,
    "nameBn": "জগতপুর",
    "nameEn": ""
  },
  {
    "id": 1405,
    "upazilaId": 150,
    "nameBn": "বলরামপুর",
    "nameEn": ""
  },
  {
    "id": 1406,
    "upazilaId": 150,
    "nameBn": "কড়িকান্দি",
    "nameEn": ""
  },
  {
    "id": 1407,
    "upazilaId": 150,
    "nameBn": "কলাকান্দি",
    "nameEn": ""
  },
  {
    "id": 1408,
    "upazilaId": 150,
    "nameBn": "ভিটিকান্দি",
    "nameEn": ""
  },
  {
    "id": 1409,
    "upazilaId": 150,
    "nameBn": "নারান্দিয়া",
    "nameEn": ""
  },
  {
    "id": 1410,
    "upazilaId": 150,
    "nameBn": "জিয়ারকান্দি",
    "nameEn": ""
  },
  {
    "id": 1411,
    "upazilaId": 150,
    "nameBn": "মজিদপুর",
    "nameEn": ""
  },
  {
    "id": 1412,
    "upazilaId": 151,
    "nameBn": "বাইশগাঁও",
    "nameEn": ""
  },
  {
    "id": 1413,
    "upazilaId": 151,
    "nameBn": "সরসপুর",
    "nameEn": ""
  },
  {
    "id": 1414,
    "upazilaId": 151,
    "nameBn": "হাসনাবাদ",
    "nameEn": ""
  },
  {
    "id": 1415,
    "upazilaId": 151,
    "nameBn": "ঝলম উত্তর",
    "nameEn": ""
  },
  {
    "id": 1416,
    "upazilaId": 151,
    "nameBn": "ঝলম দক্ষিণ",
    "nameEn": ""
  },
  {
    "id": 1417,
    "upazilaId": 151,
    "nameBn": "মৈশাতুয়া",
    "nameEn": ""
  },
  {
    "id": 1418,
    "upazilaId": 151,
    "nameBn": "লক্ষণপুর",
    "nameEn": ""
  },
  {
    "id": 1419,
    "upazilaId": 151,
    "nameBn": "খিলা",
    "nameEn": ""
  },
  {
    "id": 1420,
    "upazilaId": 151,
    "nameBn": "উত্তর হাওলা",
    "nameEn": ""
  },
  {
    "id": 1421,
    "upazilaId": 151,
    "nameBn": "নাথেরপেটুয়া",
    "nameEn": ""
  },
  {
    "id": 1422,
    "upazilaId": 151,
    "nameBn": "বিপুলাসার।",
    "nameEn": ""
  },
  {
    "id": 1423,
    "upazilaId": 152,
    "nameBn": "কালিরবাজার",
    "nameEn": ""
  },
  {
    "id": 1424,
    "upazilaId": 152,
    "nameBn": "দুর্গাপুর দক্ষিণ",
    "nameEn": ""
  },
  {
    "id": 1425,
    "upazilaId": 152,
    "nameBn": "দুর্গাপুর উত্তর",
    "nameEn": ""
  },
  {
    "id": 1426,
    "upazilaId": 152,
    "nameBn": "আমড়াতলী",
    "nameEn": ""
  },
  {
    "id": 1427,
    "upazilaId": 152,
    "nameBn": "পাঁচথুবী",
    "nameEn": ""
  },
  {
    "id": 1428,
    "upazilaId": 152,
    "nameBn": "জগন্নাথপুর",
    "nameEn": ""
  },
  {
    "id": 1429,
    "upazilaId": 153,
    "nameBn": "বিজয়পুর",
    "nameEn": ""
  },
  {
    "id": 1430,
    "upazilaId": 153,
    "nameBn": "চৌয়ারা",
    "nameEn": ""
  },
  {
    "id": 1431,
    "upazilaId": 153,
    "nameBn": "গলিয়ারা",
    "nameEn": ""
  },
  {
    "id": 1432,
    "upazilaId": 153,
    "nameBn": "বারপাড়া",
    "nameEn": ""
  },
  {
    "id": 1433,
    "upazilaId": 153,
    "nameBn": "জোড়কানন পশ্চিম",
    "nameEn": ""
  },
  {
    "id": 1434,
    "upazilaId": 153,
    "nameBn": "জোড়কানন পূর্ব",
    "nameEn": ""
  },
  {
    "id": 1435,
    "upazilaId": 154,
    "nameBn": "বাগমারা উত্তর",
    "nameEn": ""
  },
  {
    "id": 1436,
    "upazilaId": 154,
    "nameBn": "বাগমারা দক্ষিণ",
    "nameEn": ""
  },
  {
    "id": 1437,
    "upazilaId": 154,
    "nameBn": "ভুলইন উত্তর",
    "nameEn": ""
  },
  {
    "id": 1438,
    "upazilaId": 154,
    "nameBn": "ভুলইন দক্ষিণ",
    "nameEn": ""
  },
  {
    "id": 1439,
    "upazilaId": 154,
    "nameBn": "পেরুল উত্তর",
    "nameEn": ""
  },
  {
    "id": 1440,
    "upazilaId": 154,
    "nameBn": "পেরুল দক্ষিণ",
    "nameEn": ""
  },
  {
    "id": 1441,
    "upazilaId": 154,
    "nameBn": "বেলঘর উত্তর",
    "nameEn": ""
  },
  {
    "id": 1442,
    "upazilaId": 154,
    "nameBn": "বেলঘর দক্ষিণ",
    "nameEn": ""
  },
  {
    "id": 1443,
    "upazilaId": 154,
    "nameBn": "বাকই উত্তর",
    "nameEn": ""
  },
  {
    "id": 1444,
    "upazilaId": 29,
    "nameBn": "সাচার",
    "nameEn": ""
  },
  {
    "id": 1445,
    "upazilaId": 29,
    "nameBn": "পাথৈর",
    "nameEn": ""
  },
  {
    "id": 1446,
    "upazilaId": 29,
    "nameBn": "বিতারা",
    "nameEn": ""
  },
  {
    "id": 1447,
    "upazilaId": 29,
    "nameBn": "পালাখাল",
    "nameEn": ""
  },
  {
    "id": 1448,
    "upazilaId": 29,
    "nameBn": "সহদেবপুর পশ্চিম",
    "nameEn": ""
  },
  {
    "id": 1449,
    "upazilaId": 29,
    "nameBn": "কচুয়া উত্তর",
    "nameEn": ""
  },
  {
    "id": 1450,
    "upazilaId": 29,
    "nameBn": "কচুয়া দক্ষিণ",
    "nameEn": ""
  },
  {
    "id": 1451,
    "upazilaId": 29,
    "nameBn": "কাদলা",
    "nameEn": ""
  },
  {
    "id": 1452,
    "upazilaId": 29,
    "nameBn": "কড়ইয়া",
    "nameEn": ""
  },
  {
    "id": 1453,
    "upazilaId": 29,
    "nameBn": "গোহট উত্তর",
    "nameEn": ""
  },
  {
    "id": 1454,
    "upazilaId": 29,
    "nameBn": "গোহট দক্ষিণ আশরাফপুর",
    "nameEn": ""
  },
  {
    "id": 1455,
    "upazilaId": 155,
    "nameBn": "বিষ্ণুপুর",
    "nameEn": ""
  },
  {
    "id": 1456,
    "upazilaId": 155,
    "nameBn": "আশিকাটি",
    "nameEn": ""
  },
  {
    "id": 1457,
    "upazilaId": 155,
    "nameBn": "কল্যাণপুর",
    "nameEn": ""
  },
  {
    "id": 1458,
    "upazilaId": 155,
    "nameBn": "শাহ মাহমুদপুর",
    "nameEn": ""
  },
  {
    "id": 1459,
    "upazilaId": 155,
    "nameBn": "রামপুর",
    "nameEn": ""
  },
  {
    "id": 1460,
    "upazilaId": 155,
    "nameBn": "মৈশাদী",
    "nameEn": ""
  },
  {
    "id": 1461,
    "upazilaId": 155,
    "nameBn": "তরপুরচণ্ডী",
    "nameEn": ""
  },
  {
    "id": 1462,
    "upazilaId": 155,
    "nameBn": "বাগাদী",
    "nameEn": ""
  },
  {
    "id": 1463,
    "upazilaId": 155,
    "nameBn": "বালিয়া",
    "nameEn": ""
  },
  {
    "id": 1464,
    "upazilaId": 155,
    "nameBn": "লক্ষ্মীপুর",
    "nameEn": ""
  },
  {
    "id": 1465,
    "upazilaId": 155,
    "nameBn": "ইব্রাহিমপুর",
    "nameEn": ""
  },
  {
    "id": 1466,
    "upazilaId": 155,
    "nameBn": "চান্দ্রা",
    "nameEn": ""
  },
  {
    "id": 1467,
    "upazilaId": 155,
    "nameBn": "হানারচর রাজরাজেশ্বর",
    "nameEn": ""
  },
  {
    "id": 1468,
    "upazilaId": 156,
    "nameBn": "বালিথুবা পশ্চিম",
    "nameEn": ""
  },
  {
    "id": 1469,
    "upazilaId": 156,
    "nameBn": "বালিথুবা পূর্ব",
    "nameEn": ""
  },
  {
    "id": 1470,
    "upazilaId": 156,
    "nameBn": "সুবিদপুর পূর্ব",
    "nameEn": ""
  },
  {
    "id": 1471,
    "upazilaId": 156,
    "nameBn": "সুবিদপুর পশ্চিম",
    "nameEn": ""
  },
  {
    "id": 1472,
    "upazilaId": 156,
    "nameBn": "গুপ্টি পূর্ব",
    "nameEn": ""
  },
  {
    "id": 1473,
    "upazilaId": 156,
    "nameBn": "গুপ্টি পশ্চিম",
    "nameEn": ""
  },
  {
    "id": 1474,
    "upazilaId": 156,
    "nameBn": "পাইকপাড়া উত্তর",
    "nameEn": ""
  },
  {
    "id": 1475,
    "upazilaId": 156,
    "nameBn": "পাইকপাড়া দক্ষিণ",
    "nameEn": ""
  },
  {
    "id": 1476,
    "upazilaId": 156,
    "nameBn": "গোবিন্দপুর উত্তর",
    "nameEn": ""
  },
  {
    "id": 1477,
    "upazilaId": 156,
    "nameBn": "গোবিন্দপুর দক্ষিণ",
    "nameEn": ""
  },
  {
    "id": 1478,
    "upazilaId": 156,
    "nameBn": "চর দুঃখিয়া পূর্ব",
    "nameEn": ""
  },
  {
    "id": 1479,
    "upazilaId": 156,
    "nameBn": "চর দুঃখিয়া পশ্চিম",
    "nameEn": ""
  },
  {
    "id": 1480,
    "upazilaId": 156,
    "nameBn": "ফরিদগঞ্জ দক্ষিণ",
    "nameEn": ""
  },
  {
    "id": 1481,
    "upazilaId": 156,
    "nameBn": "রূপসা উত্তর রূপসা দক্ষিণ",
    "nameEn": ""
  },
  {
    "id": 1482,
    "upazilaId": 157,
    "nameBn": "ষাটনল",
    "nameEn": ""
  },
  {
    "id": 1483,
    "upazilaId": 157,
    "nameBn": "বাগানবাড়ী",
    "nameEn": ""
  },
  {
    "id": 1484,
    "upazilaId": 157,
    "nameBn": "সাদুল্লাপুর",
    "nameEn": ""
  },
  {
    "id": 1485,
    "upazilaId": 157,
    "nameBn": "দুর্গাপুর",
    "nameEn": ""
  },
  {
    "id": 1486,
    "upazilaId": 157,
    "nameBn": "কলাকান্দা",
    "nameEn": ""
  },
  {
    "id": 1487,
    "upazilaId": 157,
    "nameBn": "মোহনপুর",
    "nameEn": ""
  },
  {
    "id": 1488,
    "upazilaId": 157,
    "nameBn": "এখলাছপুর",
    "nameEn": ""
  },
  {
    "id": 1489,
    "upazilaId": 157,
    "nameBn": "জহিরাবাদ",
    "nameEn": ""
  },
  {
    "id": 1490,
    "upazilaId": 157,
    "nameBn": "ফতেপুর পূর্ব",
    "nameEn": ""
  },
  {
    "id": 1491,
    "upazilaId": 157,
    "nameBn": "ফতেপুর পশ্চিম",
    "nameEn": ""
  },
  {
    "id": 1492,
    "upazilaId": 157,
    "nameBn": "ফরাজিকান্দি",
    "nameEn": ""
  },
  {
    "id": 1493,
    "upazilaId": 157,
    "nameBn": "ইসলামাবাদ",
    "nameEn": ""
  },
  {
    "id": 1494,
    "upazilaId": 157,
    "nameBn": "সুলতানাবাদ গজরা",
    "nameEn": ""
  },
  {
    "id": 1495,
    "upazilaId": 158,
    "nameBn": "নায়েরগাঁও উত্তর",
    "nameEn": ""
  },
  {
    "id": 1496,
    "upazilaId": 158,
    "nameBn": "নায়েরগাঁও দক্ষিণ",
    "nameEn": ""
  },
  {
    "id": 1497,
    "upazilaId": 158,
    "nameBn": "খাদেরগাঁও",
    "nameEn": ""
  },
  {
    "id": 1498,
    "upazilaId": 158,
    "nameBn": "নারায়ণপুর",
    "nameEn": ""
  },
  {
    "id": 1499,
    "upazilaId": 158,
    "nameBn": "উপাদী উত্তর উপাদী দক্ষিণ",
    "nameEn": ""
  },
  {
    "id": 1500,
    "upazilaId": 159,
    "nameBn": "টামটা উত্তর",
    "nameEn": ""
  },
  {
    "id": 1501,
    "upazilaId": 159,
    "nameBn": "টামটা দক্ষিণ",
    "nameEn": ""
  },
  {
    "id": 1502,
    "upazilaId": 159,
    "nameBn": "মেহের উত্তর",
    "nameEn": ""
  },
  {
    "id": 1503,
    "upazilaId": 159,
    "nameBn": "মেহের দক্ষিণ",
    "nameEn": ""
  },
  {
    "id": 1504,
    "upazilaId": 159,
    "nameBn": "রায়শ্রী উত্তর",
    "nameEn": ""
  },
  {
    "id": 1505,
    "upazilaId": 159,
    "nameBn": "রায়শ্রী দক্ষিণ",
    "nameEn": ""
  },
  {
    "id": 1506,
    "upazilaId": 159,
    "nameBn": "সূচীপাড়া উত্তর",
    "nameEn": ""
  },
  {
    "id": 1507,
    "upazilaId": 159,
    "nameBn": "সূচীপাড়া দক্ষিণ",
    "nameEn": ""
  },
  {
    "id": 1508,
    "upazilaId": 159,
    "nameBn": "চিতোষী পূর্ব চিতোষী পশ্চিম",
    "nameEn": ""
  },
  {
    "id": 1509,
    "upazilaId": 160,
    "nameBn": "গাজীপুর",
    "nameEn": ""
  },
  {
    "id": 1510,
    "upazilaId": 160,
    "nameBn": "আলগী দুর্গাপুর উত্তর",
    "nameEn": ""
  },
  {
    "id": 1511,
    "upazilaId": 160,
    "nameBn": "আলগী দুর্গাপুর দক্ষিণ",
    "nameEn": ""
  },
  {
    "id": 1512,
    "upazilaId": 160,
    "nameBn": "নীলকমল",
    "nameEn": ""
  },
  {
    "id": 1513,
    "upazilaId": 160,
    "nameBn": "হাইমচর চর ভৈরবী",
    "nameEn": ""
  },
  {
    "id": 1514,
    "upazilaId": 161,
    "nameBn": "রাজারগাঁও উত্তর",
    "nameEn": ""
  },
  {
    "id": 1515,
    "upazilaId": 161,
    "nameBn": "বাকিলা",
    "nameEn": ""
  },
  {
    "id": 1516,
    "upazilaId": 161,
    "nameBn": "কালচোঁ উত্তর",
    "nameEn": ""
  },
  {
    "id": 1517,
    "upazilaId": 161,
    "nameBn": "কালচোঁ দক্ষিণ",
    "nameEn": ""
  },
  {
    "id": 1518,
    "upazilaId": 161,
    "nameBn": "হাজীগঞ্জ সদর",
    "nameEn": ""
  },
  {
    "id": 1519,
    "upazilaId": 161,
    "nameBn": "বড়কুল পূর্ব",
    "nameEn": ""
  },
  {
    "id": 1520,
    "upazilaId": 161,
    "nameBn": "বড়কুল পশ্চিম",
    "nameEn": ""
  },
  {
    "id": 1521,
    "upazilaId": 161,
    "nameBn": "হাটিলা পূর্ব",
    "nameEn": ""
  },
  {
    "id": 1522,
    "upazilaId": 161,
    "nameBn": "গন্ধর্ব্যপুর উত্তর",
    "nameEn": ""
  },
  {
    "id": 1523,
    "upazilaId": 161,
    "nameBn": "গন্ধর্ব্যপুর দক্ষিণ",
    "nameEn": ""
  },
  {
    "id": 1524,
    "upazilaId": 161,
    "nameBn": "হাটিলা পশ্চিম দ্বাদশ গ্রাম",
    "nameEn": ""
  },
  {
    "id": 1525,
    "upazilaId": 162,
    "nameBn": "রশিদাবাদ",
    "nameEn": ""
  },
  {
    "id": 1526,
    "upazilaId": 162,
    "nameBn": "লতিবাবাদ",
    "nameEn": ""
  },
  {
    "id": 1527,
    "upazilaId": 162,
    "nameBn": "মাইজখাপন",
    "nameEn": ""
  },
  {
    "id": 1528,
    "upazilaId": 162,
    "nameBn": "মহিনন্দ",
    "nameEn": ""
  },
  {
    "id": 1529,
    "upazilaId": 162,
    "nameBn": "যশোদল",
    "nameEn": ""
  },
  {
    "id": 1530,
    "upazilaId": 162,
    "nameBn": "বৌলাই",
    "nameEn": ""
  },
  {
    "id": 1531,
    "upazilaId": 162,
    "nameBn": "বিন্নাটি",
    "nameEn": ""
  },
  {
    "id": 1532,
    "upazilaId": 162,
    "nameBn": "মারিয়া",
    "nameEn": ""
  },
  {
    "id": 1533,
    "upazilaId": 162,
    "nameBn": "চৌদ্দশত",
    "nameEn": ""
  },
  {
    "id": 1534,
    "upazilaId": 162,
    "nameBn": "কর্শাকড়িয়াইল",
    "nameEn": ""
  },
  {
    "id": 1535,
    "upazilaId": 162,
    "nameBn": "দানাপাটুলী",
    "nameEn": ""
  },
  {
    "id": 1536,
    "upazilaId": 163,
    "nameBn": "আদমপুর",
    "nameEn": ""
  },
  {
    "id": 1537,
    "upazilaId": 163,
    "nameBn": "অষ্টগ্রাম",
    "nameEn": ""
  },
  {
    "id": 1538,
    "upazilaId": 163,
    "nameBn": "বাংগালপাড়া",
    "nameEn": ""
  },
  {
    "id": 1539,
    "upazilaId": 163,
    "nameBn": "দেওঘর",
    "nameEn": ""
  },
  {
    "id": 1540,
    "upazilaId": 163,
    "nameBn": "কলমা",
    "nameEn": ""
  },
  {
    "id": 1541,
    "upazilaId": 163,
    "nameBn": "কাস্তুল",
    "nameEn": ""
  },
  {
    "id": 1542,
    "upazilaId": 163,
    "nameBn": "খয়েরপুর-আব্দুল্লাপুর",
    "nameEn": ""
  },
  {
    "id": 1543,
    "upazilaId": 163,
    "nameBn": "পূর্ব অষ্টগ্রাম",
    "nameEn": ""
  },
  {
    "id": 1544,
    "upazilaId": 164,
    "nameBn": "রায়টুটি",
    "nameEn": ""
  },
  {
    "id": 1545,
    "upazilaId": 164,
    "nameBn": "ধনপুর",
    "nameEn": ""
  },
  {
    "id": 1546,
    "upazilaId": 164,
    "nameBn": "মৃগা",
    "nameEn": ""
  },
  {
    "id": 1547,
    "upazilaId": 164,
    "nameBn": "ইটনা",
    "nameEn": ""
  },
  {
    "id": 1548,
    "upazilaId": 164,
    "nameBn": "বড়িবাড়ী",
    "nameEn": ""
  },
  {
    "id": 1549,
    "upazilaId": 164,
    "nameBn": "বাদলা",
    "nameEn": ""
  },
  {
    "id": 1550,
    "upazilaId": 164,
    "nameBn": "এলংজুড়ি",
    "nameEn": ""
  },
  {
    "id": 1551,
    "upazilaId": 164,
    "nameBn": "জয়সিদ্ধি",
    "nameEn": ""
  },
  {
    "id": 1552,
    "upazilaId": 164,
    "nameBn": "চৌগাংগা",
    "nameEn": ""
  },
  {
    "id": 1553,
    "upazilaId": 165,
    "nameBn": "কাদিরজঙ্গল",
    "nameEn": ""
  },
  {
    "id": 1554,
    "upazilaId": 165,
    "nameBn": "গুজাদিয়া",
    "nameEn": ""
  },
  {
    "id": 1555,
    "upazilaId": 165,
    "nameBn": "কিরাটন",
    "nameEn": ""
  },
  {
    "id": 1556,
    "upazilaId": 165,
    "nameBn": "বারঘরিয়া",
    "nameEn": ""
  },
  {
    "id": 1557,
    "upazilaId": 165,
    "nameBn": "নিয়ামতপুর",
    "nameEn": ""
  },
  {
    "id": 1558,
    "upazilaId": 165,
    "nameBn": "দেহুন্দা",
    "nameEn": ""
  },
  {
    "id": 1559,
    "upazilaId": 165,
    "nameBn": "সুতারপাড়া",
    "nameEn": ""
  },
  {
    "id": 1560,
    "upazilaId": 165,
    "nameBn": "গুনধর",
    "nameEn": ""
  },
  {
    "id": 1561,
    "upazilaId": 165,
    "nameBn": "জয়কা",
    "nameEn": ""
  },
  {
    "id": 1562,
    "upazilaId": 165,
    "nameBn": "জাফরাবাদ",
    "nameEn": ""
  },
  {
    "id": 1563,
    "upazilaId": 165,
    "nameBn": "নোয়াবাদ",
    "nameEn": ""
  },
  {
    "id": 1564,
    "upazilaId": 166,
    "nameBn": "বনগ্রাম",
    "nameEn": ""
  },
  {
    "id": 1565,
    "upazilaId": 166,
    "nameBn": "সহশ্রাম ধুলদিয়া",
    "nameEn": ""
  },
  {
    "id": 1566,
    "upazilaId": 166,
    "nameBn": "করগাঁও",
    "nameEn": ""
  },
  {
    "id": 1567,
    "upazilaId": 166,
    "nameBn": "চান্দপুর",
    "nameEn": ""
  },
  {
    "id": 1568,
    "upazilaId": 166,
    "nameBn": "মুমুরদিয়া",
    "nameEn": ""
  },
  {
    "id": 1569,
    "upazilaId": 166,
    "nameBn": "আচমিতা",
    "nameEn": ""
  },
  {
    "id": 1570,
    "upazilaId": 166,
    "nameBn": "মসূয়া",
    "nameEn": ""
  },
  {
    "id": 1571,
    "upazilaId": 166,
    "nameBn": "লোহাজুরী",
    "nameEn": ""
  },
  {
    "id": 1572,
    "upazilaId": 166,
    "nameBn": "জালালপুর",
    "nameEn": ""
  },
  {
    "id": 1573,
    "upazilaId": 167,
    "nameBn": "উছমানপুর",
    "nameEn": ""
  },
  {
    "id": 1574,
    "upazilaId": 167,
    "nameBn": "রামদী",
    "nameEn": ""
  },
  {
    "id": 1575,
    "upazilaId": 167,
    "nameBn": "গোবরিয়া আব্দুল্লাহপুর",
    "nameEn": ""
  },
  {
    "id": 1576,
    "upazilaId": 167,
    "nameBn": "সালুয়া",
    "nameEn": ""
  },
  {
    "id": 1577,
    "upazilaId": 167,
    "nameBn": "ছয়সূতি",
    "nameEn": ""
  },
  {
    "id": 1578,
    "upazilaId": 167,
    "nameBn": "ফরিদপুর",
    "nameEn": ""
  },
  {
    "id": 1579,
    "upazilaId": 168,
    "nameBn": "তালজাঙ্গা",
    "nameEn": ""
  },
  {
    "id": 1580,
    "upazilaId": 168,
    "nameBn": "রাউতি",
    "nameEn": ""
  },
  {
    "id": 1581,
    "upazilaId": 168,
    "nameBn": "ধলা",
    "nameEn": ""
  },
  {
    "id": 1582,
    "upazilaId": 168,
    "nameBn": "জাওয়ার",
    "nameEn": ""
  },
  {
    "id": 1583,
    "upazilaId": 168,
    "nameBn": "দামিহা",
    "nameEn": ""
  },
  {
    "id": 1584,
    "upazilaId": 168,
    "nameBn": "দিগদাইড়",
    "nameEn": ""
  },
  {
    "id": 1585,
    "upazilaId": 168,
    "nameBn": "তাড়াইল-সাচাইল",
    "nameEn": ""
  },
  {
    "id": 1586,
    "upazilaId": 169,
    "nameBn": "নিকলী",
    "nameEn": ""
  },
  {
    "id": 1587,
    "upazilaId": 169,
    "nameBn": "দামপাড়া",
    "nameEn": ""
  },
  {
    "id": 1588,
    "upazilaId": 169,
    "nameBn": "কারপাশা",
    "nameEn": ""
  },
  {
    "id": 1589,
    "upazilaId": 169,
    "nameBn": "সিংপুর",
    "nameEn": ""
  },
  {
    "id": 1590,
    "upazilaId": 169,
    "nameBn": "জারইতলা",
    "nameEn": ""
  },
  {
    "id": 1591,
    "upazilaId": 169,
    "nameBn": "গুরুই",
    "nameEn": ""
  },
  {
    "id": 1592,
    "upazilaId": 169,
    "nameBn": "ছাতিরচর",
    "nameEn": ""
  },
  {
    "id": 1593,
    "upazilaId": 170,
    "nameBn": "জাঙ্গালিয়া",
    "nameEn": ""
  },
  {
    "id": 1594,
    "upazilaId": 170,
    "nameBn": "চন্ডিপাশা",
    "nameEn": ""
  },
  {
    "id": 1595,
    "upazilaId": 170,
    "nameBn": "চরফরাদি",
    "nameEn": ""
  },
  {
    "id": 1596,
    "upazilaId": 170,
    "nameBn": "এগারসিন্দুর",
    "nameEn": ""
  },
  {
    "id": 1597,
    "upazilaId": 170,
    "nameBn": "হোসেন্দী",
    "nameEn": ""
  },
  {
    "id": 1598,
    "upazilaId": 170,
    "nameBn": "বুরুদিয়া",
    "nameEn": ""
  },
  {
    "id": 1599,
    "upazilaId": 170,
    "nameBn": "নারান্দী",
    "nameEn": ""
  },
  {
    "id": 1600,
    "upazilaId": 170,
    "nameBn": "পাটুয়াভাঙ্গা",
    "nameEn": ""
  },
  {
    "id": 1601,
    "upazilaId": 170,
    "nameBn": "সুখিয়া",
    "nameEn": ""
  },
  {
    "id": 1602,
    "upazilaId": 171,
    "nameBn": "মাইজচর",
    "nameEn": ""
  },
  {
    "id": 1603,
    "upazilaId": 171,
    "nameBn": "দিলালপুর",
    "nameEn": ""
  },
  {
    "id": 1604,
    "upazilaId": 171,
    "nameBn": "গাজীরচর",
    "nameEn": ""
  },
  {
    "id": 1605,
    "upazilaId": 171,
    "nameBn": "হুমায়ুনপুর",
    "nameEn": ""
  },
  {
    "id": 1606,
    "upazilaId": 171,
    "nameBn": "দিঘীরপাড়",
    "nameEn": ""
  },
  {
    "id": 1607,
    "upazilaId": 171,
    "nameBn": "হালিমপুর",
    "nameEn": ""
  },
  {
    "id": 1608,
    "upazilaId": 171,
    "nameBn": "সরারচর",
    "nameEn": ""
  },
  {
    "id": 1609,
    "upazilaId": 171,
    "nameBn": "বলিয়ার্দী",
    "nameEn": ""
  },
  {
    "id": 1610,
    "upazilaId": 171,
    "nameBn": "হিলচিয়া",
    "nameEn": ""
  },
  {
    "id": 1611,
    "upazilaId": 171,
    "nameBn": "কৈলাগ",
    "nameEn": ""
  },
  {
    "id": 1612,
    "upazilaId": 171,
    "nameBn": "পিরিজপুর",
    "nameEn": ""
  },
  {
    "id": 1613,
    "upazilaId": 172,
    "nameBn": "আগানগর",
    "nameEn": ""
  },
  {
    "id": 1614,
    "upazilaId": 172,
    "nameBn": "কালিকাপ্রাসাদ",
    "nameEn": ""
  },
  {
    "id": 1615,
    "upazilaId": 172,
    "nameBn": "গজারিয়া",
    "nameEn": ""
  },
  {
    "id": 1616,
    "upazilaId": 172,
    "nameBn": "শিবপুর",
    "nameEn": ""
  },
  {
    "id": 1617,
    "upazilaId": 172,
    "nameBn": "শিমুলকান্দি",
    "nameEn": ""
  },
  {
    "id": 1618,
    "upazilaId": 172,
    "nameBn": "শ্রীনগর",
    "nameEn": ""
  },
  {
    "id": 1619,
    "upazilaId": 172,
    "nameBn": "সাদেকপুর",
    "nameEn": ""
  },
  {
    "id": 1620,
    "upazilaId": 173,
    "nameBn": "গোপদিঘী",
    "nameEn": ""
  },
  {
    "id": 1621,
    "upazilaId": 173,
    "nameBn": "মিঠামইন",
    "nameEn": ""
  },
  {
    "id": 1622,
    "upazilaId": 173,
    "nameBn": "ঘাগড়া",
    "nameEn": ""
  },
  {
    "id": 1623,
    "upazilaId": 173,
    "nameBn": "ঢাকী",
    "nameEn": ""
  },
  {
    "id": 1624,
    "upazilaId": 173,
    "nameBn": "কেওয়ারজোর",
    "nameEn": ""
  },
  {
    "id": 1625,
    "upazilaId": 173,
    "nameBn": "কাটখাল",
    "nameEn": ""
  },
  {
    "id": 1626,
    "upazilaId": 173,
    "nameBn": "বৈরাটি",
    "nameEn": ""
  },
  {
    "id": 1627,
    "upazilaId": 174,
    "nameBn": "গোবিন্দপুর",
    "nameEn": ""
  },
  {
    "id": 1628,
    "upazilaId": 174,
    "nameBn": "সিদলা",
    "nameEn": ""
  },
  {
    "id": 1629,
    "upazilaId": 174,
    "nameBn": "জিনারী",
    "nameEn": ""
  },
  {
    "id": 1630,
    "upazilaId": 174,
    "nameBn": "আড়াইবাড়ীয়া",
    "nameEn": ""
  },
  {
    "id": 1631,
    "upazilaId": 174,
    "nameBn": "শাহেদল",
    "nameEn": ""
  },
  {
    "id": 1632,
    "upazilaId": 174,
    "nameBn": "পুমদী",
    "nameEn": ""
  },
  {
    "id": 1633,
    "upazilaId": 175,
    "nameBn": "ফুলবাড়ীয়া",
    "nameEn": ""
  },
  {
    "id": 1634,
    "upazilaId": 175,
    "nameBn": "চাপাইর",
    "nameEn": ""
  },
  {
    "id": 1635,
    "upazilaId": 175,
    "nameBn": "বোয়ালী",
    "nameEn": ""
  },
  {
    "id": 1636,
    "upazilaId": 175,
    "nameBn": "মৌচাক",
    "nameEn": ""
  },
  {
    "id": 1637,
    "upazilaId": 175,
    "nameBn": "শ্রীফলতলী",
    "nameEn": ""
  },
  {
    "id": 1638,
    "upazilaId": 175,
    "nameBn": "সূত্রাপুর",
    "nameEn": ""
  },
  {
    "id": 1639,
    "upazilaId": 175,
    "nameBn": "আটাবহ",
    "nameEn": ""
  },
  {
    "id": 1640,
    "upazilaId": 175,
    "nameBn": "মধ্যপাড়া",
    "nameEn": ""
  },
  {
    "id": 1641,
    "upazilaId": 175,
    "nameBn": "ঢালজোড়া",
    "nameEn": ""
  },
  {
    "id": 1642,
    "upazilaId": 20,
    "nameBn": "তুমুলিয়া",
    "nameEn": ""
  },
  {
    "id": 1643,
    "upazilaId": 20,
    "nameBn": "মোক্তারপুর",
    "nameEn": ""
  },
  {
    "id": 1644,
    "upazilaId": 20,
    "nameBn": "নাগরী",
    "nameEn": ""
  },
  {
    "id": 1645,
    "upazilaId": 20,
    "nameBn": "বক্তারপুর",
    "nameEn": ""
  },
  {
    "id": 1646,
    "upazilaId": 20,
    "nameBn": "জাঙ্গালিয়া",
    "nameEn": ""
  },
  {
    "id": 1647,
    "upazilaId": 20,
    "nameBn": "বাহাদুরশাদী",
    "nameEn": ""
  },
  {
    "id": 1648,
    "upazilaId": 20,
    "nameBn": "জামালপুর",
    "nameEn": ""
  },
  {
    "id": 1649,
    "upazilaId": 176,
    "nameBn": "কাপাসিয়া",
    "nameEn": ""
  },
  {
    "id": 1650,
    "upazilaId": 176,
    "nameBn": "তরগাঁও",
    "nameEn": ""
  },
  {
    "id": 1651,
    "upazilaId": 176,
    "nameBn": "রায়েদ",
    "nameEn": ""
  },
  {
    "id": 1652,
    "upazilaId": 176,
    "nameBn": "সিংহশ্রী",
    "nameEn": ""
  },
  {
    "id": 1653,
    "upazilaId": 176,
    "nameBn": "বারিষাব",
    "nameEn": ""
  },
  {
    "id": 1654,
    "upazilaId": 176,
    "nameBn": "টোক",
    "nameEn": ""
  },
  {
    "id": 1655,
    "upazilaId": 176,
    "nameBn": "কড়িহাতা",
    "nameEn": ""
  },
  {
    "id": 1656,
    "upazilaId": 176,
    "nameBn": "সন্মানিয়া",
    "nameEn": ""
  },
  {
    "id": 1657,
    "upazilaId": 176,
    "nameBn": "ঘাগটিয়া",
    "nameEn": ""
  },
  {
    "id": 1658,
    "upazilaId": 176,
    "nameBn": "দূর্গাপুর",
    "nameEn": ""
  },
  {
    "id": 1659,
    "upazilaId": 176,
    "nameBn": "চাদঁপুর",
    "nameEn": ""
  },
  {
    "id": 1660,
    "upazilaId": 177,
    "nameBn": "মির্জাপুর",
    "nameEn": ""
  },
  {
    "id": 1661,
    "upazilaId": 177,
    "nameBn": "কাউলতিয়া",
    "nameEn": ""
  },
  {
    "id": 1662,
    "upazilaId": 177,
    "nameBn": "ভাওয়াল গড়",
    "nameEn": ""
  },
  {
    "id": 1663,
    "upazilaId": 177,
    "nameBn": "পিরুজালী",
    "nameEn": ""
  },
  {
    "id": 1664,
    "upazilaId": 177,
    "nameBn": "বাড়ীয়া",
    "nameEn": ""
  },
  {
    "id": 1665,
    "upazilaId": 41,
    "nameBn": "মাওনা",
    "nameEn": ""
  },
  {
    "id": 1666,
    "upazilaId": 41,
    "nameBn": "গাজীপুর",
    "nameEn": ""
  },
  {
    "id": 1667,
    "upazilaId": 41,
    "nameBn": "তেলিহাটী",
    "nameEn": ""
  },
  {
    "id": 1668,
    "upazilaId": 41,
    "nameBn": "বরমী",
    "nameEn": ""
  },
  {
    "id": 1669,
    "upazilaId": 41,
    "nameBn": "কাওরাইদ",
    "nameEn": ""
  },
  {
    "id": 1670,
    "upazilaId": 41,
    "nameBn": "গোসিংগা",
    "nameEn": ""
  },
  {
    "id": 1671,
    "upazilaId": 41,
    "nameBn": "রাজাবাড়ী",
    "nameEn": ""
  },
  {
    "id": 1672,
    "upazilaId": 41,
    "nameBn": "প্রহলাদপুর",
    "nameEn": ""
  },
  {
    "id": 1673,
    "upazilaId": 178,
    "nameBn": "জালালাবাদ",
    "nameEn": ""
  },
  {
    "id": 1674,
    "upazilaId": 178,
    "nameBn": "বৌলতলী",
    "nameEn": ""
  },
  {
    "id": 1675,
    "upazilaId": 178,
    "nameBn": "শুকতাইল",
    "nameEn": ""
  },
  {
    "id": 1676,
    "upazilaId": 178,
    "nameBn": "চন্দ্রদিঘলিয়া",
    "nameEn": ""
  },
  {
    "id": 1677,
    "upazilaId": 178,
    "nameBn": "গোপীনাথপুর",
    "nameEn": ""
  },
  {
    "id": 1678,
    "upazilaId": 178,
    "nameBn": "পাইককান্দি",
    "nameEn": ""
  },
  {
    "id": 1679,
    "upazilaId": 178,
    "nameBn": "উরফি",
    "nameEn": ""
  },
  {
    "id": 1680,
    "upazilaId": 178,
    "nameBn": "লতিফপুর",
    "nameEn": ""
  },
  {
    "id": 1681,
    "upazilaId": 178,
    "nameBn": "সাতপাড়",
    "nameEn": ""
  },
  {
    "id": 1682,
    "upazilaId": 178,
    "nameBn": "সাহাপুর",
    "nameEn": ""
  },
  {
    "id": 1683,
    "upazilaId": 178,
    "nameBn": "হরিদাসপুর",
    "nameEn": ""
  },
  {
    "id": 1684,
    "upazilaId": 178,
    "nameBn": "উলপুর",
    "nameEn": ""
  },
  {
    "id": 1685,
    "upazilaId": 178,
    "nameBn": "নিজড়া",
    "nameEn": ""
  },
  {
    "id": 1686,
    "upazilaId": 178,
    "nameBn": "করপাড়া",
    "nameEn": ""
  },
  {
    "id": 1687,
    "upazilaId": 178,
    "nameBn": "দুর্গাপুর",
    "nameEn": ""
  },
  {
    "id": 1688,
    "upazilaId": 178,
    "nameBn": "কাজুলিয়া",
    "nameEn": ""
  },
  {
    "id": 1689,
    "upazilaId": 178,
    "nameBn": "কাঠি",
    "nameEn": ""
  },
  {
    "id": 1690,
    "upazilaId": 178,
    "nameBn": "মাঝিগাতী",
    "nameEn": ""
  },
  {
    "id": 1691,
    "upazilaId": 178,
    "nameBn": "রঘুনাথপুর",
    "nameEn": ""
  },
  {
    "id": 1692,
    "upazilaId": 178,
    "nameBn": "গোবরা",
    "nameEn": ""
  },
  {
    "id": 1693,
    "upazilaId": 178,
    "nameBn": "বোড়াশী",
    "nameEn": ""
  },
  {
    "id": 1694,
    "upazilaId": 179,
    "nameBn": "মুকসুদপুর",
    "nameEn": ""
  },
  {
    "id": 1695,
    "upazilaId": 179,
    "nameBn": "পশারগাতি",
    "nameEn": ""
  },
  {
    "id": 1696,
    "upazilaId": 179,
    "nameBn": "গোবিন্দপুর",
    "nameEn": ""
  },
  {
    "id": 1697,
    "upazilaId": 179,
    "nameBn": "খান্দারপাড়",
    "nameEn": ""
  },
  {
    "id": 1698,
    "upazilaId": 179,
    "nameBn": "বহুগ্রাম",
    "nameEn": ""
  },
  {
    "id": 1699,
    "upazilaId": 179,
    "nameBn": "বাঁশবাড়িয়া",
    "nameEn": ""
  },
  {
    "id": 1700,
    "upazilaId": 179,
    "nameBn": "ভাবড়াশুর",
    "nameEn": ""
  },
  {
    "id": 1701,
    "upazilaId": 179,
    "nameBn": "মহারাজপুর",
    "nameEn": ""
  },
  {
    "id": 1702,
    "upazilaId": 179,
    "nameBn": "বাটিকামারী",
    "nameEn": ""
  },
  {
    "id": 1703,
    "upazilaId": 179,
    "nameBn": "দিগনগর",
    "nameEn": ""
  },
  {
    "id": 1704,
    "upazilaId": 179,
    "nameBn": "রাঘদী",
    "nameEn": ""
  },
  {
    "id": 1705,
    "upazilaId": 179,
    "nameBn": "গোহালা",
    "nameEn": ""
  },
  {
    "id": 1706,
    "upazilaId": 179,
    "nameBn": "মোচনা",
    "nameEn": ""
  },
  {
    "id": 1707,
    "upazilaId": 179,
    "nameBn": "উজানী",
    "nameEn": ""
  },
  {
    "id": 1708,
    "upazilaId": 179,
    "nameBn": "কাশালিয়া",
    "nameEn": ""
  },
  {
    "id": 1709,
    "upazilaId": 179,
    "nameBn": "ননীক্ষীর",
    "nameEn": ""
  },
  {
    "id": 1710,
    "upazilaId": 179,
    "nameBn": "জলিরপাড়",
    "nameEn": ""
  },
  {
    "id": 1711,
    "upazilaId": 180,
    "nameBn": "মহেশপুর",
    "nameEn": ""
  },
  {
    "id": 1712,
    "upazilaId": 180,
    "nameBn": "কাশিয়ানী",
    "nameEn": ""
  },
  {
    "id": 1713,
    "upazilaId": 180,
    "nameBn": "সাজাইল",
    "nameEn": ""
  },
  {
    "id": 1714,
    "upazilaId": 180,
    "nameBn": "পারুলীয়া",
    "nameEn": ""
  },
  {
    "id": 1715,
    "upazilaId": 180,
    "nameBn": "মাহমুদপুর",
    "nameEn": ""
  },
  {
    "id": 1716,
    "upazilaId": 180,
    "nameBn": "রাতইল",
    "nameEn": ""
  },
  {
    "id": 1717,
    "upazilaId": 180,
    "nameBn": "ওড়াকান্দি",
    "nameEn": ""
  },
  {
    "id": 1718,
    "upazilaId": 180,
    "nameBn": "বেথুড়ি",
    "nameEn": ""
  },
  {
    "id": 1719,
    "upazilaId": 180,
    "nameBn": "রাজপাট",
    "nameEn": ""
  },
  {
    "id": 1720,
    "upazilaId": 180,
    "nameBn": "ফুকরা",
    "nameEn": ""
  },
  {
    "id": 1721,
    "upazilaId": 180,
    "nameBn": "পুইশুর",
    "nameEn": ""
  },
  {
    "id": 1722,
    "upazilaId": 180,
    "nameBn": "নিজামকান্দি",
    "nameEn": ""
  },
  {
    "id": 1723,
    "upazilaId": 180,
    "nameBn": "সিংগা",
    "nameEn": ""
  },
  {
    "id": 1724,
    "upazilaId": 180,
    "nameBn": "হাতিয়াড়া",
    "nameEn": ""
  },
  {
    "id": 1725,
    "upazilaId": 181,
    "nameBn": "বান্ধাবাড়ী",
    "nameEn": ""
  },
  {
    "id": 1726,
    "upazilaId": 181,
    "nameBn": "সাদুল্লাপুর",
    "nameEn": ""
  },
  {
    "id": 1727,
    "upazilaId": 181,
    "nameBn": "রাধাগঞ্জ",
    "nameEn": ""
  },
  {
    "id": 1728,
    "upazilaId": 181,
    "nameBn": "কলাবাড়ী",
    "nameEn": ""
  },
  {
    "id": 1729,
    "upazilaId": 181,
    "nameBn": "রামশীল",
    "nameEn": ""
  },
  {
    "id": 1730,
    "upazilaId": 181,
    "nameBn": "আমতলী",
    "nameEn": ""
  },
  {
    "id": 1731,
    "upazilaId": 181,
    "nameBn": "কান্দি",
    "nameEn": ""
  },
  {
    "id": 1732,
    "upazilaId": 181,
    "nameBn": "হিরণ",
    "nameEn": ""
  },
  {
    "id": 1733,
    "upazilaId": 181,
    "nameBn": "পিঞ্জুরী",
    "nameEn": ""
  },
  {
    "id": 1734,
    "upazilaId": 181,
    "nameBn": "শুয়াগ্রাম",
    "nameEn": ""
  },
  {
    "id": 1735,
    "upazilaId": 181,
    "nameBn": "কুশলা",
    "nameEn": ""
  },
  {
    "id": 1736,
    "upazilaId": 182,
    "nameBn": "পাটগাতি",
    "nameEn": ""
  },
  {
    "id": 1737,
    "upazilaId": 182,
    "nameBn": "ডুমুরিয়া",
    "nameEn": ""
  },
  {
    "id": 1738,
    "upazilaId": 182,
    "nameBn": "গোপালপুর",
    "nameEn": ""
  },
  {
    "id": 1739,
    "upazilaId": 182,
    "nameBn": "কুশলী",
    "nameEn": ""
  },
  {
    "id": 1740,
    "upazilaId": 182,
    "nameBn": "বর্ণী",
    "nameEn": ""
  },
  {
    "id": 1741,
    "upazilaId": 183,
    "nameBn": "করটিয়া",
    "nameEn": ""
  },
  {
    "id": 1742,
    "upazilaId": 183,
    "nameBn": "ঘারিন্দা",
    "nameEn": ""
  },
  {
    "id": 1743,
    "upazilaId": 183,
    "nameBn": "গালা",
    "nameEn": ""
  },
  {
    "id": 1744,
    "upazilaId": 183,
    "nameBn": "পোড়াবাড়ী",
    "nameEn": ""
  },
  {
    "id": 1745,
    "upazilaId": 183,
    "nameBn": "ছিলিমপুর",
    "nameEn": ""
  },
  {
    "id": 1746,
    "upazilaId": 183,
    "nameBn": "কাকুয়া",
    "nameEn": ""
  },
  {
    "id": 1747,
    "upazilaId": 183,
    "nameBn": "কাতুলী",
    "nameEn": ""
  },
  {
    "id": 1748,
    "upazilaId": 183,
    "nameBn": "মগড়া",
    "nameEn": ""
  },
  {
    "id": 1749,
    "upazilaId": 183,
    "nameBn": "মাহমুদনগর",
    "nameEn": ""
  },
  {
    "id": 1750,
    "upazilaId": 183,
    "nameBn": "হুগড়া",
    "nameEn": ""
  },
  {
    "id": 1751,
    "upazilaId": 183,
    "nameBn": "দাইন্যা",
    "nameEn": ""
  },
  {
    "id": 1752,
    "upazilaId": 183,
    "nameBn": "বাঘিল",
    "nameEn": ""
  },
  {
    "id": 1753,
    "upazilaId": 184,
    "nameBn": "কোকডহড়া",
    "nameEn": ""
  },
  {
    "id": 1754,
    "upazilaId": 184,
    "nameBn": "গোহালিয়াবাড়ী",
    "nameEn": ""
  },
  {
    "id": 1755,
    "upazilaId": 184,
    "nameBn": "দশকিয়া",
    "nameEn": ""
  },
  {
    "id": 1756,
    "upazilaId": 184,
    "nameBn": "দুর্গাপুর",
    "nameEn": ""
  },
  {
    "id": 1757,
    "upazilaId": 184,
    "nameBn": "নাগবাড়ী",
    "nameEn": ""
  },
  {
    "id": 1758,
    "upazilaId": 184,
    "nameBn": "নারান্দিয়া",
    "nameEn": ""
  },
  {
    "id": 1759,
    "upazilaId": 184,
    "nameBn": "পাইকড়া",
    "nameEn": ""
  },
  {
    "id": 1760,
    "upazilaId": 184,
    "nameBn": "পারখি",
    "nameEn": ""
  },
  {
    "id": 1761,
    "upazilaId": 184,
    "nameBn": "বল্লা",
    "nameEn": ""
  },
  {
    "id": 1762,
    "upazilaId": 184,
    "nameBn": "বাংড়া",
    "nameEn": ""
  },
  {
    "id": 1763,
    "upazilaId": 184,
    "nameBn": "বীরবাসিন্দা",
    "nameEn": ""
  },
  {
    "id": 1764,
    "upazilaId": 184,
    "nameBn": "সল্লা",
    "nameEn": ""
  },
  {
    "id": 1765,
    "upazilaId": 184,
    "nameBn": "সহদেবপুর",
    "nameEn": ""
  },
  {
    "id": 1766,
    "upazilaId": 185,
    "nameBn": "দেউলাবাড়ী",
    "nameEn": ""
  },
  {
    "id": 1767,
    "upazilaId": 185,
    "nameBn": "ঘাটাইল",
    "nameEn": ""
  },
  {
    "id": 1768,
    "upazilaId": 185,
    "nameBn": "জামুরিয়া",
    "nameEn": ""
  },
  {
    "id": 1769,
    "upazilaId": 185,
    "nameBn": "দিগড়",
    "nameEn": ""
  },
  {
    "id": 1770,
    "upazilaId": 185,
    "nameBn": "দিঘলকান্দি",
    "nameEn": ""
  },
  {
    "id": 1771,
    "upazilaId": 185,
    "nameBn": "আনেহলা",
    "nameEn": ""
  },
  {
    "id": 1772,
    "upazilaId": 185,
    "nameBn": "দেওপাড়া",
    "nameEn": ""
  },
  {
    "id": 1773,
    "upazilaId": 185,
    "nameBn": "ধলাপাড়া",
    "nameEn": ""
  },
  {
    "id": 1774,
    "upazilaId": 185,
    "nameBn": "সন্ধানপুর",
    "nameEn": ""
  },
  {
    "id": 1775,
    "upazilaId": 185,
    "nameBn": "লোকেরপাড়া",
    "nameEn": ""
  },
  {
    "id": 1776,
    "upazilaId": 185,
    "nameBn": "রসুলপুর",
    "nameEn": ""
  },
  {
    "id": 1777,
    "upazilaId": 185,
    "nameBn": "সংগ্রামপুর",
    "nameEn": ""
  },
  {
    "id": 1778,
    "upazilaId": 185,
    "nameBn": "লক্ষিন্দর",
    "nameEn": ""
  },
  {
    "id": 1779,
    "upazilaId": 185,
    "nameBn": "সাগরদিঘী",
    "nameEn": ""
  },
  {
    "id": 1780,
    "upazilaId": 186,
    "nameBn": "কাউলজানী",
    "nameEn": ""
  },
  {
    "id": 1781,
    "upazilaId": 186,
    "nameBn": "কাঞ্চনপুর",
    "nameEn": ""
  },
  {
    "id": 1782,
    "upazilaId": 186,
    "nameBn": "কাশিল",
    "nameEn": ""
  },
  {
    "id": 1783,
    "upazilaId": 186,
    "nameBn": "ফুলকী",
    "nameEn": ""
  },
  {
    "id": 1784,
    "upazilaId": 186,
    "nameBn": "বাসাইল",
    "nameEn": ""
  },
  {
    "id": 1785,
    "upazilaId": 186,
    "nameBn": "হাবলা",
    "nameEn": ""
  },
  {
    "id": 1786,
    "upazilaId": 187,
    "nameBn": "হাদিরা",
    "nameEn": ""
  },
  {
    "id": 1787,
    "upazilaId": 187,
    "nameBn": "নগদা শিমলা",
    "nameEn": ""
  },
  {
    "id": 1788,
    "upazilaId": 187,
    "nameBn": "ঝাওয়াইল",
    "nameEn": ""
  },
  {
    "id": 1789,
    "upazilaId": 187,
    "nameBn": "হেমনগর",
    "nameEn": ""
  },
  {
    "id": 1790,
    "upazilaId": 187,
    "nameBn": "আলমনগর",
    "nameEn": ""
  },
  {
    "id": 1791,
    "upazilaId": 187,
    "nameBn": "মির্জাপুর",
    "nameEn": ""
  },
  {
    "id": 1792,
    "upazilaId": 187,
    "nameBn": "ধোপাকান্দি",
    "nameEn": ""
  },
  {
    "id": 1793,
    "upazilaId": 188,
    "nameBn": "মহেড়া",
    "nameEn": ""
  },
  {
    "id": 1794,
    "upazilaId": 188,
    "nameBn": "ফতেপুর",
    "nameEn": ""
  },
  {
    "id": 1795,
    "upazilaId": 188,
    "nameBn": "জামুর্কী",
    "nameEn": ""
  },
  {
    "id": 1796,
    "upazilaId": 188,
    "nameBn": "বানাইল",
    "nameEn": ""
  },
  {
    "id": 1797,
    "upazilaId": 188,
    "nameBn": "আনাইতারা",
    "nameEn": ""
  },
  {
    "id": 1798,
    "upazilaId": 188,
    "nameBn": "ভাতগ্রাম",
    "nameEn": ""
  },
  {
    "id": 1799,
    "upazilaId": 188,
    "nameBn": "ওয়ার্শী",
    "nameEn": ""
  },
  {
    "id": 1800,
    "upazilaId": 188,
    "nameBn": "বহুরিয়া",
    "nameEn": ""
  },
  {
    "id": 1801,
    "upazilaId": 188,
    "nameBn": "গোড়াই",
    "nameEn": ""
  },
  {
    "id": 1802,
    "upazilaId": 188,
    "nameBn": "তরফপুর",
    "nameEn": ""
  },
  {
    "id": 1803,
    "upazilaId": 188,
    "nameBn": "আজগানা",
    "nameEn": ""
  },
  {
    "id": 1804,
    "upazilaId": 188,
    "nameBn": "বাঁশতৈল",
    "nameEn": ""
  },
  {
    "id": 1805,
    "upazilaId": 188,
    "nameBn": "লতিফপুর",
    "nameEn": ""
  },
  {
    "id": 1806,
    "upazilaId": 188,
    "nameBn": "ভাওড়া",
    "nameEn": ""
  },
  {
    "id": 1807,
    "upazilaId": 189,
    "nameBn": "ফলদা",
    "nameEn": ""
  },
  {
    "id": 1808,
    "upazilaId": 189,
    "nameBn": "অর্জুনা",
    "nameEn": ""
  },
  {
    "id": 1809,
    "upazilaId": 189,
    "nameBn": "গাবসারা",
    "nameEn": ""
  },
  {
    "id": 1810,
    "upazilaId": 189,
    "nameBn": "গোবিন্দাসী",
    "nameEn": ""
  },
  {
    "id": 1811,
    "upazilaId": 189,
    "nameBn": "অলোয়া",
    "nameEn": ""
  },
  {
    "id": 1812,
    "upazilaId": 189,
    "nameBn": "নিকরাইল",
    "nameEn": ""
  },
  {
    "id": 1813,
    "upazilaId": 190,
    "nameBn": "নাগরপুর",
    "nameEn": ""
  },
  {
    "id": 1814,
    "upazilaId": 190,
    "nameBn": "ভাররা",
    "nameEn": ""
  },
  {
    "id": 1815,
    "upazilaId": 190,
    "nameBn": "সহবতপুর",
    "nameEn": ""
  },
  {
    "id": 1816,
    "upazilaId": 190,
    "nameBn": "গয়হাটা",
    "nameEn": ""
  },
  {
    "id": 1817,
    "upazilaId": 190,
    "nameBn": "বেকড়া",
    "nameEn": ""
  },
  {
    "id": 1818,
    "upazilaId": 190,
    "nameBn": "সলিমাবাদ",
    "nameEn": ""
  },
  {
    "id": 1819,
    "upazilaId": 190,
    "nameBn": "ধুবরিয়া",
    "nameEn": ""
  },
  {
    "id": 1820,
    "upazilaId": 190,
    "nameBn": "ভাদ্রা",
    "nameEn": ""
  },
  {
    "id": 1821,
    "upazilaId": 190,
    "nameBn": "দপ্তিয়র",
    "nameEn": ""
  },
  {
    "id": 1822,
    "upazilaId": 190,
    "nameBn": "মামুদনগর",
    "nameEn": ""
  },
  {
    "id": 1823,
    "upazilaId": 190,
    "nameBn": "পাকুটিয়া",
    "nameEn": ""
  },
  {
    "id": 1824,
    "upazilaId": 190,
    "nameBn": "মোকনা",
    "nameEn": ""
  },
  {
    "id": 1825,
    "upazilaId": 191,
    "nameBn": "আলোকদিয়া",
    "nameEn": ""
  },
  {
    "id": 1826,
    "upazilaId": 191,
    "nameBn": "অরণখোলা",
    "nameEn": ""
  },
  {
    "id": 1827,
    "upazilaId": 191,
    "nameBn": "আউশনারা",
    "nameEn": ""
  },
  {
    "id": 1828,
    "upazilaId": 191,
    "nameBn": "গোলাবাড়ী",
    "nameEn": ""
  },
  {
    "id": 1829,
    "upazilaId": 191,
    "nameBn": "মির্জাবাড়ী",
    "nameEn": ""
  },
  {
    "id": 1830,
    "upazilaId": 191,
    "nameBn": "শোলাকুড়ী",
    "nameEn": ""
  },
  {
    "id": 1831,
    "upazilaId": 192,
    "nameBn": "কাকড়াজান",
    "nameEn": ""
  },
  {
    "id": 1832,
    "upazilaId": 192,
    "nameBn": "কালমেঘা",
    "nameEn": ""
  },
  {
    "id": 1833,
    "upazilaId": 192,
    "nameBn": "কালিয়া",
    "nameEn": ""
  },
  {
    "id": 1834,
    "upazilaId": 192,
    "nameBn": "গজারিয়া",
    "nameEn": ""
  },
  {
    "id": 1835,
    "upazilaId": 192,
    "nameBn": "দাড়িয়াপুর",
    "nameEn": ""
  },
  {
    "id": 1836,
    "upazilaId": 192,
    "nameBn": "বহেড়াতৈল",
    "nameEn": ""
  },
  {
    "id": 1837,
    "upazilaId": 192,
    "nameBn": "যাদবপুর",
    "nameEn": ""
  },
  {
    "id": 1838,
    "upazilaId": 192,
    "nameBn": "হাতীবান্ধা",
    "nameEn": ""
  },
  {
    "id": 1839,
    "upazilaId": 193,
    "nameBn": "আটিয়া",
    "nameEn": ""
  },
  {
    "id": 1840,
    "upazilaId": 193,
    "nameBn": "ডুবাইল",
    "nameEn": ""
  },
  {
    "id": 1841,
    "upazilaId": 193,
    "nameBn": "ফাজিলহাটি",
    "nameEn": ""
  },
  {
    "id": 1842,
    "upazilaId": 193,
    "nameBn": "পাথরাইল",
    "nameEn": ""
  },
  {
    "id": 1843,
    "upazilaId": 193,
    "nameBn": "লাউহা্টী",
    "nameEn": ""
  },
  {
    "id": 1844,
    "upazilaId": 193,
    "nameBn": "দেলদুয়ার",
    "nameEn": ""
  },
  {
    "id": 1845,
    "upazilaId": 193,
    "nameBn": "দেউলী",
    "nameEn": ""
  },
  {
    "id": 1846,
    "upazilaId": 193,
    "nameBn": "এলাসিন",
    "nameEn": ""
  },
  {
    "id": 1847,
    "upazilaId": 194,
    "nameBn": "বীরতারা",
    "nameEn": ""
  },
  {
    "id": 1848,
    "upazilaId": 194,
    "nameBn": "বানিয়াজান",
    "nameEn": ""
  },
  {
    "id": 1849,
    "upazilaId": 194,
    "nameBn": "পাইস্কা",
    "nameEn": ""
  },
  {
    "id": 1850,
    "upazilaId": 194,
    "nameBn": "ধোপাখালী",
    "nameEn": ""
  },
  {
    "id": 1851,
    "upazilaId": 194,
    "nameBn": "যদুনাথপুর",
    "nameEn": ""
  },
  {
    "id": 1852,
    "upazilaId": 194,
    "nameBn": "মুশুদ্দি",
    "nameEn": ""
  },
  {
    "id": 1853,
    "upazilaId": 194,
    "nameBn": "বলিভদ্র",
    "nameEn": ""
  },
  {
    "id": 1854,
    "upazilaId": 195,
    "nameBn": "শ্যামপুর",
    "nameEn": ""
  },
  {
    "id": 1855,
    "upazilaId": 195,
    "nameBn": "দনিয়া",
    "nameEn": ""
  },
  {
    "id": 1856,
    "upazilaId": 195,
    "nameBn": "মাতুয়াইল",
    "nameEn": ""
  },
  {
    "id": 1857,
    "upazilaId": 195,
    "nameBn": "ডেমরা",
    "nameEn": ""
  },
  {
    "id": 1858,
    "upazilaId": 195,
    "nameBn": "সারুলিয়া",
    "nameEn": ""
  },
  {
    "id": 1859,
    "upazilaId": 195,
    "nameBn": "মান্ডা",
    "nameEn": ""
  },
  {
    "id": 1860,
    "upazilaId": 195,
    "nameBn": "দক্ষিণগাঁও",
    "nameEn": ""
  },
  {
    "id": 1861,
    "upazilaId": 195,
    "nameBn": "নাসিরাবাদ",
    "nameEn": ""
  },
  {
    "id": 1862,
    "upazilaId": 195,
    "nameBn": "বাড্ডা",
    "nameEn": ""
  },
  {
    "id": 1863,
    "upazilaId": 195,
    "nameBn": "ভাটারা",
    "nameEn": ""
  },
  {
    "id": 1864,
    "upazilaId": 195,
    "nameBn": "সাঁতারকুল",
    "nameEn": ""
  },
  {
    "id": 1865,
    "upazilaId": 195,
    "nameBn": "বেড়াইদ",
    "nameEn": ""
  },
  {
    "id": 1866,
    "upazilaId": 195,
    "nameBn": "দক্ষিণখান",
    "nameEn": ""
  },
  {
    "id": 1867,
    "upazilaId": 195,
    "nameBn": "উত্তরখান",
    "nameEn": ""
  },
  {
    "id": 1868,
    "upazilaId": 195,
    "nameBn": "ডুমনী",
    "nameEn": ""
  },
  {
    "id": 1869,
    "upazilaId": 195,
    "nameBn": "হরিরামপুর",
    "nameEn": ""
  },
  {
    "id": 1870,
    "upazilaId": 195,
    "nameBn": "সুলতানগঞ্জ",
    "nameEn": ""
  },
  {
    "id": 1871,
    "upazilaId": 196,
    "nameBn": "কুসুমহাটি",
    "nameEn": ""
  },
  {
    "id": 1872,
    "upazilaId": 196,
    "nameBn": "নয়াবাড়ি",
    "nameEn": ""
  },
  {
    "id": 1873,
    "upazilaId": 196,
    "nameBn": "রাইপাড়া",
    "nameEn": ""
  },
  {
    "id": 1874,
    "upazilaId": 196,
    "nameBn": "মাহমুদপুর",
    "nameEn": ""
  },
  {
    "id": 1875,
    "upazilaId": 196,
    "nameBn": "সুতারপাড়া",
    "nameEn": ""
  },
  {
    "id": 1876,
    "upazilaId": 196,
    "nameBn": "নারিশা",
    "nameEn": ""
  },
  {
    "id": 1877,
    "upazilaId": 196,
    "nameBn": "মুকসুদপুর",
    "nameEn": ""
  },
  {
    "id": 1878,
    "upazilaId": 197,
    "nameBn": "আগলা",
    "nameEn": ""
  },
  {
    "id": 1879,
    "upazilaId": 197,
    "nameBn": "কলাকোপা",
    "nameEn": ""
  },
  {
    "id": 1880,
    "upazilaId": 197,
    "nameBn": "কৈলাইল",
    "nameEn": ""
  },
  {
    "id": 1881,
    "upazilaId": 197,
    "nameBn": "গালিমপুর",
    "nameEn": ""
  },
  {
    "id": 1882,
    "upazilaId": 197,
    "nameBn": "চুড়াইন",
    "nameEn": ""
  },
  {
    "id": 1883,
    "upazilaId": 197,
    "nameBn": "জয়কৃষ্ণপুর",
    "nameEn": ""
  },
  {
    "id": 1884,
    "upazilaId": 197,
    "nameBn": "নয়নশ্রী",
    "nameEn": ""
  },
  {
    "id": 1885,
    "upazilaId": 197,
    "nameBn": "বক্সনগর",
    "nameEn": ""
  },
  {
    "id": 1886,
    "upazilaId": 197,
    "nameBn": "বারুয়াখালী",
    "nameEn": ""
  },
  {
    "id": 1887,
    "upazilaId": 197,
    "nameBn": "বাহ্রা",
    "nameEn": ""
  },
  {
    "id": 1888,
    "upazilaId": 197,
    "nameBn": "বান্দুরা",
    "nameEn": ""
  },
  {
    "id": 1889,
    "upazilaId": 197,
    "nameBn": "যন্ত্রাইল",
    "nameEn": ""
  },
  {
    "id": 1890,
    "upazilaId": 197,
    "nameBn": "শিকারীপাড়া",
    "nameEn": ""
  },
  {
    "id": 1891,
    "upazilaId": 197,
    "nameBn": "শোল্লা",
    "nameEn": ""
  },
  {
    "id": 1892,
    "upazilaId": 198,
    "nameBn": "হযরতপুর",
    "nameEn": ""
  },
  {
    "id": 1893,
    "upazilaId": 198,
    "nameBn": "কলাতিয়া",
    "nameEn": ""
  },
  {
    "id": 1894,
    "upazilaId": 198,
    "nameBn": "তারানগর",
    "nameEn": ""
  },
  {
    "id": 1895,
    "upazilaId": 198,
    "nameBn": "শাক্তা",
    "nameEn": ""
  },
  {
    "id": 1896,
    "upazilaId": 198,
    "nameBn": "জিনজিরা",
    "nameEn": ""
  },
  {
    "id": 1897,
    "upazilaId": 198,
    "nameBn": "রোহিতপুর",
    "nameEn": ""
  },
  {
    "id": 1898,
    "upazilaId": 198,
    "nameBn": "বাস্তা",
    "nameEn": ""
  },
  {
    "id": 1899,
    "upazilaId": 198,
    "nameBn": "কালিন্দী",
    "nameEn": ""
  },
  {
    "id": 1900,
    "upazilaId": 198,
    "nameBn": "শুভাঢ্যা",
    "nameEn": ""
  },
  {
    "id": 1901,
    "upazilaId": 198,
    "nameBn": "তেঘরিয়া",
    "nameEn": ""
  },
  {
    "id": 1902,
    "upazilaId": 198,
    "nameBn": "কোণ্ডা",
    "nameEn": ""
  },
  {
    "id": 1903,
    "upazilaId": 198,
    "nameBn": "আগানগর",
    "nameEn": ""
  },
  {
    "id": 1904,
    "upazilaId": 199,
    "nameBn": "শিমুলিয়া",
    "nameEn": ""
  },
  {
    "id": 1905,
    "upazilaId": 199,
    "nameBn": "ধামসোনা",
    "nameEn": ""
  },
  {
    "id": 1906,
    "upazilaId": 199,
    "nameBn": "পাথালিয়া",
    "nameEn": ""
  },
  {
    "id": 1907,
    "upazilaId": 199,
    "nameBn": "ইয়ারপুর",
    "nameEn": ""
  },
  {
    "id": 1908,
    "upazilaId": 199,
    "nameBn": "আশুলিয়া",
    "nameEn": ""
  },
  {
    "id": 1909,
    "upazilaId": 199,
    "nameBn": "সাভার",
    "nameEn": ""
  },
  {
    "id": 1910,
    "upazilaId": 199,
    "nameBn": "বিরুলিয়া",
    "nameEn": ""
  },
  {
    "id": 1911,
    "upazilaId": 199,
    "nameBn": "বনগাঁও",
    "nameEn": ""
  },
  {
    "id": 1912,
    "upazilaId": 199,
    "nameBn": "তেঁতুলঝোড়া",
    "nameEn": ""
  },
  {
    "id": 1913,
    "upazilaId": 199,
    "nameBn": "ভাকুর্তা",
    "nameEn": ""
  },
  {
    "id": 1914,
    "upazilaId": 199,
    "nameBn": "আমিনবাজার",
    "nameEn": ""
  },
  {
    "id": 1915,
    "upazilaId": 199,
    "nameBn": "কাউন্দিয়া",
    "nameEn": ""
  },
  {
    "id": 1916,
    "upazilaId": 200,
    "nameBn": "আমতা",
    "nameEn": ""
  },
  {
    "id": 1917,
    "upazilaId": 200,
    "nameBn": "কুশুরা",
    "nameEn": ""
  },
  {
    "id": 1918,
    "upazilaId": 200,
    "nameBn": "গাংগুটিয়া",
    "nameEn": ""
  },
  {
    "id": 1919,
    "upazilaId": 200,
    "nameBn": "সূতিপাড়া",
    "nameEn": ""
  },
  {
    "id": 1920,
    "upazilaId": 200,
    "nameBn": "ভাড়ারিয়া",
    "nameEn": ""
  },
  {
    "id": 1921,
    "upazilaId": 200,
    "nameBn": "ধামরাই",
    "nameEn": ""
  },
  {
    "id": 1922,
    "upazilaId": 200,
    "nameBn": "বালিয়া",
    "nameEn": ""
  },
  {
    "id": 1923,
    "upazilaId": 200,
    "nameBn": "নান্নার",
    "nameEn": ""
  },
  {
    "id": 1924,
    "upazilaId": 200,
    "nameBn": "কুল্লা",
    "nameEn": ""
  },
  {
    "id": 1925,
    "upazilaId": 200,
    "nameBn": "যাদবপুর",
    "nameEn": ""
  },
  {
    "id": 1926,
    "upazilaId": 200,
    "nameBn": "সূয়াপুর",
    "nameEn": ""
  },
  {
    "id": 1927,
    "upazilaId": 200,
    "nameBn": "সানোড়া",
    "nameEn": ""
  },
  {
    "id": 1928,
    "upazilaId": 200,
    "nameBn": "চৌহাট",
    "nameEn": ""
  },
  {
    "id": 1929,
    "upazilaId": 200,
    "nameBn": "বাইশাকান্দা",
    "nameEn": ""
  },
  {
    "id": 1930,
    "upazilaId": 200,
    "nameBn": "সোমভাগ",
    "nameEn": ""
  },
  {
    "id": 1931,
    "upazilaId": 200,
    "nameBn": "রোয়াইল",
    "nameEn": ""
  },
  {
    "id": 1932,
    "upazilaId": 201,
    "nameBn": "চিনিশপুর",
    "nameEn": ""
  },
  {
    "id": 1933,
    "upazilaId": 201,
    "nameBn": "হাজীপুর",
    "nameEn": ""
  },
  {
    "id": 1934,
    "upazilaId": 201,
    "nameBn": "শিলমান্দি",
    "nameEn": ""
  },
  {
    "id": 1935,
    "upazilaId": 201,
    "nameBn": "মেহের পাড়া",
    "nameEn": ""
  },
  {
    "id": 1936,
    "upazilaId": 201,
    "nameBn": "পাঁচদোনা",
    "nameEn": ""
  },
  {
    "id": 1937,
    "upazilaId": 201,
    "nameBn": "আমাদিয়া",
    "nameEn": ""
  },
  {
    "id": 1938,
    "upazilaId": 201,
    "nameBn": "নূরালাপুর",
    "nameEn": ""
  },
  {
    "id": 1939,
    "upazilaId": 201,
    "nameBn": "কাঁঠালিয়া",
    "nameEn": ""
  },
  {
    "id": 1940,
    "upazilaId": 201,
    "nameBn": "পাইকারচর",
    "nameEn": ""
  },
  {
    "id": 1941,
    "upazilaId": 201,
    "nameBn": "মহিষাশুরা",
    "nameEn": ""
  },
  {
    "id": 1942,
    "upazilaId": 201,
    "nameBn": "করিমপুর",
    "nameEn": ""
  },
  {
    "id": 1943,
    "upazilaId": 201,
    "nameBn": "নজরপুর",
    "nameEn": ""
  },
  {
    "id": 1944,
    "upazilaId": 201,
    "nameBn": "আলোকবালী",
    "nameEn": ""
  },
  {
    "id": 1945,
    "upazilaId": 201,
    "nameBn": "চরদিঘলদী",
    "nameEn": ""
  },
  {
    "id": 1946,
    "upazilaId": 202,
    "nameBn": "মরজাল",
    "nameEn": ""
  },
  {
    "id": 1947,
    "upazilaId": 202,
    "nameBn": "রায়পুরা",
    "nameEn": ""
  },
  {
    "id": 1948,
    "upazilaId": 202,
    "nameBn": "চান্দেরকান্দি",
    "nameEn": ""
  },
  {
    "id": 1949,
    "upazilaId": 202,
    "nameBn": "অলিপুরা",
    "nameEn": ""
  },
  {
    "id": 1950,
    "upazilaId": 202,
    "nameBn": "উত্তর বাখরনগর",
    "nameEn": ""
  },
  {
    "id": 1951,
    "upazilaId": 202,
    "nameBn": "মির্জাপুর",
    "nameEn": ""
  },
  {
    "id": 1952,
    "upazilaId": 202,
    "nameBn": "রাধানগর",
    "nameEn": ""
  },
  {
    "id": 1953,
    "upazilaId": 202,
    "nameBn": "মুছাপুর",
    "nameEn": ""
  },
  {
    "id": 1954,
    "upazilaId": 202,
    "nameBn": "মহেশপুর",
    "nameEn": ""
  },
  {
    "id": 1955,
    "upazilaId": 202,
    "nameBn": "বাঁশগাড়ি",
    "nameEn": ""
  },
  {
    "id": 1956,
    "upazilaId": 202,
    "nameBn": "চর আড়ালিয়া",
    "nameEn": ""
  },
  {
    "id": 1957,
    "upazilaId": 202,
    "nameBn": "পলাশতলী",
    "nameEn": ""
  },
  {
    "id": 1958,
    "upazilaId": 202,
    "nameBn": "পাড়াতলী",
    "nameEn": ""
  },
  {
    "id": 1959,
    "upazilaId": 202,
    "nameBn": "আমিরগঞ্জ",
    "nameEn": ""
  },
  {
    "id": 1960,
    "upazilaId": 202,
    "nameBn": "আদিয়াবাদ",
    "nameEn": ""
  },
  {
    "id": 1961,
    "upazilaId": 202,
    "nameBn": "চরসুবুদ্ধি",
    "nameEn": ""
  },
  {
    "id": 1962,
    "upazilaId": 202,
    "nameBn": "হাইরমারা",
    "nameEn": ""
  },
  {
    "id": 1963,
    "upazilaId": 202,
    "nameBn": "শ্রীনগর",
    "nameEn": ""
  },
  {
    "id": 1964,
    "upazilaId": 202,
    "nameBn": "ডৌকারচর",
    "nameEn": ""
  },
  {
    "id": 1965,
    "upazilaId": 202,
    "nameBn": "মির্জানগর",
    "nameEn": ""
  },
  {
    "id": 1966,
    "upazilaId": 202,
    "nameBn": "চরমুধুয়া",
    "nameEn": ""
  },
  {
    "id": 1967,
    "upazilaId": 202,
    "nameBn": "নিলক্ষ্যা",
    "nameEn": ""
  },
  {
    "id": 1968,
    "upazilaId": 202,
    "nameBn": "চানপুর",
    "nameEn": ""
  },
  {
    "id": 1969,
    "upazilaId": 202,
    "nameBn": "মির্জারচর",
    "nameEn": ""
  },
  {
    "id": 1970,
    "upazilaId": 203,
    "nameBn": "আমলাব",
    "nameEn": ""
  },
  {
    "id": 1971,
    "upazilaId": 203,
    "nameBn": "চরউজিলাব",
    "nameEn": ""
  },
  {
    "id": 1972,
    "upazilaId": 203,
    "nameBn": "বাজনাব",
    "nameEn": ""
  },
  {
    "id": 1973,
    "upazilaId": 203,
    "nameBn": "বেলাব",
    "nameEn": ""
  },
  {
    "id": 1974,
    "upazilaId": 203,
    "nameBn": "বিন্নাবাইদ",
    "nameEn": ""
  },
  {
    "id": 1975,
    "upazilaId": 203,
    "nameBn": "নারায়ণপুর",
    "nameEn": ""
  },
  {
    "id": 1976,
    "upazilaId": 203,
    "nameBn": "পাটুলী",
    "nameEn": ""
  },
  {
    "id": 1977,
    "upazilaId": 203,
    "nameBn": "সাল্লাবাদ",
    "nameEn": ""
  },
  {
    "id": 1978,
    "upazilaId": 204,
    "nameBn": "চরসিন্দুর",
    "nameEn": ""
  },
  {
    "id": 1979,
    "upazilaId": 204,
    "nameBn": "জিনারদী",
    "nameEn": ""
  },
  {
    "id": 1980,
    "upazilaId": 204,
    "nameBn": "গজারিয়া",
    "nameEn": ""
  },
  {
    "id": 1981,
    "upazilaId": 204,
    "nameBn": "ডাঙ্গা",
    "nameEn": ""
  },
  {
    "id": 1982,
    "upazilaId": 205,
    "nameBn": "চালাকচর",
    "nameEn": ""
  },
  {
    "id": 1983,
    "upazilaId": 205,
    "nameBn": "বড়চাপা",
    "nameEn": ""
  },
  {
    "id": 1984,
    "upazilaId": 205,
    "nameBn": "কৃষ্ণপুর",
    "nameEn": ""
  },
  {
    "id": 1985,
    "upazilaId": 205,
    "nameBn": "খিদিরপুর",
    "nameEn": ""
  },
  {
    "id": 1986,
    "upazilaId": 205,
    "nameBn": "লেবুতলা",
    "nameEn": ""
  },
  {
    "id": 1987,
    "upazilaId": 205,
    "nameBn": "কাচিকাটাঁ",
    "nameEn": ""
  },
  {
    "id": 1988,
    "upazilaId": 205,
    "nameBn": "গোতাশিয়া",
    "nameEn": ""
  },
  {
    "id": 1989,
    "upazilaId": 205,
    "nameBn": "চন্দনবাড়ী",
    "nameEn": ""
  },
  {
    "id": 1990,
    "upazilaId": 205,
    "nameBn": "শুকুন্দি",
    "nameEn": ""
  },
  {
    "id": 1991,
    "upazilaId": 205,
    "nameBn": "একদুরিয়া",
    "nameEn": ""
  },
  {
    "id": 1992,
    "upazilaId": 205,
    "nameBn": "চরমান্দালিয়া",
    "nameEn": ""
  },
  {
    "id": 1993,
    "upazilaId": 205,
    "nameBn": "দৌলতপুর",
    "nameEn": ""
  },
  {
    "id": 1994,
    "upazilaId": 206,
    "nameBn": "জয়নগর",
    "nameEn": ""
  },
  {
    "id": 1995,
    "upazilaId": 206,
    "nameBn": "যোশর",
    "nameEn": ""
  },
  {
    "id": 1996,
    "upazilaId": 206,
    "nameBn": "বাঘাব",
    "nameEn": ""
  },
  {
    "id": 1997,
    "upazilaId": 206,
    "nameBn": "আয়ুবপুর",
    "nameEn": ""
  },
  {
    "id": 1998,
    "upazilaId": 206,
    "nameBn": "চক্রধা",
    "nameEn": ""
  },
  {
    "id": 1999,
    "upazilaId": 206,
    "nameBn": "মাছিমপুর",
    "nameEn": ""
  },
  {
    "id": 2000,
    "upazilaId": 206,
    "nameBn": "পুটিয়া",
    "nameEn": ""
  },
  {
    "id": 2001,
    "upazilaId": 206,
    "nameBn": "সাধারচর",
    "nameEn": ""
  },
  {
    "id": 2002,
    "upazilaId": 206,
    "nameBn": "দুলালপুর",
    "nameEn": ""
  },
  {
    "id": 2003,
    "upazilaId": 207,
    "nameBn": "আলীরটেক",
    "nameEn": ""
  },
  {
    "id": 2004,
    "upazilaId": 207,
    "nameBn": "কুতুবপুর",
    "nameEn": ""
  },
  {
    "id": 2005,
    "upazilaId": 207,
    "nameBn": "বক্তাবলী",
    "nameEn": ""
  },
  {
    "id": 2006,
    "upazilaId": 207,
    "nameBn": "ফতুল্লা",
    "nameEn": ""
  },
  {
    "id": 2007,
    "upazilaId": 207,
    "nameBn": "কাশীপুর",
    "nameEn": ""
  },
  {
    "id": 2008,
    "upazilaId": 207,
    "nameBn": "গোগনগর",
    "nameEn": ""
  },
  {
    "id": 2009,
    "upazilaId": 207,
    "nameBn": "এনায়েতনগর",
    "nameEn": ""
  },
  {
    "id": 2010,
    "upazilaId": 208,
    "nameBn": "কলাগাছিয়া",
    "nameEn": ""
  },
  {
    "id": 2011,
    "upazilaId": 208,
    "nameBn": "বন্দর",
    "nameEn": ""
  },
  {
    "id": 2012,
    "upazilaId": 208,
    "nameBn": "মুছাপুর",
    "nameEn": ""
  },
  {
    "id": 2013,
    "upazilaId": 208,
    "nameBn": "ধামগড়",
    "nameEn": ""
  },
  {
    "id": 2014,
    "upazilaId": 208,
    "nameBn": "মদনপুর",
    "nameEn": ""
  },
  {
    "id": 2015,
    "upazilaId": 209,
    "nameBn": "সাতগ্রাম",
    "nameEn": ""
  },
  {
    "id": 2016,
    "upazilaId": 209,
    "nameBn": "দুপ্তারা",
    "nameEn": ""
  },
  {
    "id": 2017,
    "upazilaId": 209,
    "nameBn": "ব্রাক্ষন্দী",
    "nameEn": ""
  },
  {
    "id": 2018,
    "upazilaId": 209,
    "nameBn": "ফতেপুর",
    "nameEn": ""
  },
  {
    "id": 2019,
    "upazilaId": 209,
    "nameBn": "বিশনন্দী",
    "nameEn": ""
  },
  {
    "id": 2020,
    "upazilaId": 209,
    "nameBn": "মাহমুদপুর",
    "nameEn": ""
  },
  {
    "id": 2021,
    "upazilaId": 209,
    "nameBn": "হাইজাদী",
    "nameEn": ""
  },
  {
    "id": 2022,
    "upazilaId": 209,
    "nameBn": "উচিৎপুরা",
    "nameEn": ""
  },
  {
    "id": 2023,
    "upazilaId": 209,
    "nameBn": "খাদকান্দা",
    "nameEn": ""
  },
  {
    "id": 2024,
    "upazilaId": 209,
    "nameBn": "কালাপাহাড়িয়া",
    "nameEn": ""
  },
  {
    "id": 2025,
    "upazilaId": 210,
    "nameBn": "ভোলাব",
    "nameEn": ""
  },
  {
    "id": 2026,
    "upazilaId": 210,
    "nameBn": "মুড়াপাড়া",
    "nameEn": ""
  },
  {
    "id": 2027,
    "upazilaId": 210,
    "nameBn": "ভুলতা",
    "nameEn": ""
  },
  {
    "id": 2028,
    "upazilaId": 210,
    "nameBn": "গোলাকান্দাইল",
    "nameEn": ""
  },
  {
    "id": 2029,
    "upazilaId": 210,
    "nameBn": "দাউদপুর",
    "nameEn": ""
  },
  {
    "id": 2030,
    "upazilaId": 210,
    "nameBn": "রূপগঞ্জ",
    "nameEn": ""
  },
  {
    "id": 2031,
    "upazilaId": 210,
    "nameBn": "কায়েতপাড়া",
    "nameEn": ""
  },
  {
    "id": 2032,
    "upazilaId": 211,
    "nameBn": "বৈদ্যেরবাজার",
    "nameEn": ""
  },
  {
    "id": 2033,
    "upazilaId": 211,
    "nameBn": "বারদী",
    "nameEn": ""
  },
  {
    "id": 2034,
    "upazilaId": 211,
    "nameBn": "নোয়াগাঁও",
    "nameEn": ""
  },
  {
    "id": 2035,
    "upazilaId": 211,
    "nameBn": "জামপুর",
    "nameEn": ""
  },
  {
    "id": 2036,
    "upazilaId": 211,
    "nameBn": "সাদিপুর",
    "nameEn": ""
  },
  {
    "id": 2037,
    "upazilaId": 211,
    "nameBn": "কাঁচপুর",
    "nameEn": ""
  },
  {
    "id": 2038,
    "upazilaId": 211,
    "nameBn": "সনমান্দি",
    "nameEn": ""
  },
  {
    "id": 2039,
    "upazilaId": 211,
    "nameBn": "মোগরাপাড়া",
    "nameEn": ""
  },
  {
    "id": 2040,
    "upazilaId": 211,
    "nameBn": "পিরোজপুর",
    "nameEn": ""
  },
  {
    "id": 2041,
    "upazilaId": 211,
    "nameBn": "শম্ভুপুরা",
    "nameEn": ""
  },
  {
    "id": 2042,
    "upazilaId": 212,
    "nameBn": "ঈশান গোপালপুর",
    "nameEn": ""
  },
  {
    "id": 2043,
    "upazilaId": 212,
    "nameBn": "চরমাধবদিয়া",
    "nameEn": ""
  },
  {
    "id": 2044,
    "upazilaId": 212,
    "nameBn": "নর্থচ্যানেল",
    "nameEn": ""
  },
  {
    "id": 2045,
    "upazilaId": 212,
    "nameBn": "আলিয়াবাদ",
    "nameEn": ""
  },
  {
    "id": 2046,
    "upazilaId": 212,
    "nameBn": "ডিক্রীরচর",
    "nameEn": ""
  },
  {
    "id": 2047,
    "upazilaId": 212,
    "nameBn": "মাচ্চর",
    "nameEn": ""
  },
  {
    "id": 2048,
    "upazilaId": 212,
    "nameBn": "অম্বিকাপুর",
    "nameEn": ""
  },
  {
    "id": 2049,
    "upazilaId": 212,
    "nameBn": "কৃষ্ণনগর",
    "nameEn": ""
  },
  {
    "id": 2050,
    "upazilaId": 212,
    "nameBn": "কানাইপুর",
    "nameEn": ""
  },
  {
    "id": 2051,
    "upazilaId": 212,
    "nameBn": "কৈজুরী",
    "nameEn": ""
  },
  {
    "id": 2052,
    "upazilaId": 212,
    "nameBn": "গেরদা",
    "nameEn": ""
  },
  {
    "id": 2053,
    "upazilaId": 213,
    "nameBn": "ঘোষপুর",
    "nameEn": ""
  },
  {
    "id": 2054,
    "upazilaId": 213,
    "nameBn": "সাতৈর",
    "nameEn": ""
  },
  {
    "id": 2055,
    "upazilaId": 213,
    "nameBn": "চাঁদপুর",
    "nameEn": ""
  },
  {
    "id": 2056,
    "upazilaId": 213,
    "nameBn": "দাদপুর",
    "nameEn": ""
  },
  {
    "id": 2057,
    "upazilaId": 213,
    "nameBn": "বোয়ালমারী",
    "nameEn": ""
  },
  {
    "id": 2058,
    "upazilaId": 213,
    "nameBn": "চতুল",
    "nameEn": ""
  },
  {
    "id": 2059,
    "upazilaId": 213,
    "nameBn": "পরমেশ্বরদী",
    "nameEn": ""
  },
  {
    "id": 2060,
    "upazilaId": 213,
    "nameBn": "শেখর",
    "nameEn": ""
  },
  {
    "id": 2061,
    "upazilaId": 213,
    "nameBn": "রূপাপাত",
    "nameEn": ""
  },
  {
    "id": 2062,
    "upazilaId": 213,
    "nameBn": "ময়না",
    "nameEn": ""
  },
  {
    "id": 2063,
    "upazilaId": 213,
    "nameBn": "গুনবহা",
    "nameEn": ""
  },
  {
    "id": 2064,
    "upazilaId": 214,
    "nameBn": "আলফাডাঙা",
    "nameEn": ""
  },
  {
    "id": 2065,
    "upazilaId": 214,
    "nameBn": "গোপালপুর",
    "nameEn": ""
  },
  {
    "id": 2066,
    "upazilaId": 214,
    "nameBn": "টগরবন্দ",
    "nameEn": ""
  },
  {
    "id": 2067,
    "upazilaId": 214,
    "nameBn": "পাঁচুরিয়া",
    "nameEn": ""
  },
  {
    "id": 2068,
    "upazilaId": 214,
    "nameBn": "বানা",
    "nameEn": ""
  },
  {
    "id": 2069,
    "upazilaId": 214,
    "nameBn": "বুড়াইচ",
    "nameEn": ""
  },
  {
    "id": 2070,
    "upazilaId": 215,
    "nameBn": "গাজনা",
    "nameEn": ""
  },
  {
    "id": 2071,
    "upazilaId": 215,
    "nameBn": "নওপাড়া",
    "nameEn": ""
  },
  {
    "id": 2072,
    "upazilaId": 215,
    "nameBn": "বাগাট",
    "nameEn": ""
  },
  {
    "id": 2073,
    "upazilaId": 215,
    "nameBn": "মেগচামী",
    "nameEn": ""
  },
  {
    "id": 2074,
    "upazilaId": 215,
    "nameBn": "কামারখালী",
    "nameEn": ""
  },
  {
    "id": 2075,
    "upazilaId": 215,
    "nameBn": "জাহাপুর",
    "nameEn": ""
  },
  {
    "id": 2076,
    "upazilaId": 215,
    "nameBn": "রায়পুর",
    "nameEn": ""
  },
  {
    "id": 2077,
    "upazilaId": 215,
    "nameBn": "ডুমাইন",
    "nameEn": ""
  },
  {
    "id": 2078,
    "upazilaId": 215,
    "nameBn": "আড়পাড়া",
    "nameEn": ""
  },
  {
    "id": 2079,
    "upazilaId": 215,
    "nameBn": "কোরকদি",
    "nameEn": ""
  },
  {
    "id": 2080,
    "upazilaId": 215,
    "nameBn": "কামালদিয়া",
    "nameEn": ""
  },
  {
    "id": 2081,
    "upazilaId": 216,
    "nameBn": "মানিকদহ",
    "nameEn": ""
  },
  {
    "id": 2082,
    "upazilaId": 216,
    "nameBn": "হামিরদী",
    "nameEn": ""
  },
  {
    "id": 2083,
    "upazilaId": 216,
    "nameBn": "নুরুল্যাগঞ্জ",
    "nameEn": ""
  },
  {
    "id": 2084,
    "upazilaId": 216,
    "nameBn": "চান্দ্রা",
    "nameEn": ""
  },
  {
    "id": 2085,
    "upazilaId": 216,
    "nameBn": "ভাঙ্গা",
    "nameEn": ""
  },
  {
    "id": 2086,
    "upazilaId": 216,
    "nameBn": "কালামৃধা",
    "nameEn": ""
  },
  {
    "id": 2087,
    "upazilaId": 216,
    "nameBn": "আজিমনগর",
    "nameEn": ""
  },
  {
    "id": 2088,
    "upazilaId": 216,
    "nameBn": "তুজারপুর",
    "nameEn": ""
  },
  {
    "id": 2089,
    "upazilaId": 216,
    "nameBn": "নাছিরাবাদ",
    "nameEn": ""
  },
  {
    "id": 2090,
    "upazilaId": 216,
    "nameBn": "ঘারুয়া",
    "nameEn": ""
  },
  {
    "id": 2091,
    "upazilaId": 216,
    "nameBn": "কাউলিবেড়া",
    "nameEn": ""
  },
  {
    "id": 2092,
    "upazilaId": 216,
    "nameBn": "চুমুরদী",
    "nameEn": ""
  },
  {
    "id": 2093,
    "upazilaId": 216,
    "nameBn": "আলগী",
    "nameEn": ""
  },
  {
    "id": 2094,
    "upazilaId": 217,
    "nameBn": "চরযশোরদী",
    "nameEn": ""
  },
  {
    "id": 2095,
    "upazilaId": 217,
    "nameBn": "পুরাপাড়া",
    "nameEn": ""
  },
  {
    "id": 2096,
    "upazilaId": 217,
    "nameBn": "কোদালিয়া শহীদনগর",
    "nameEn": ""
  },
  {
    "id": 2097,
    "upazilaId": 217,
    "nameBn": "কাইচাইল",
    "nameEn": ""
  },
  {
    "id": 2098,
    "upazilaId": 217,
    "nameBn": "ফুলসুতি",
    "nameEn": ""
  },
  {
    "id": 2099,
    "upazilaId": 217,
    "nameBn": "তালমা",
    "nameEn": ""
  },
  {
    "id": 2100,
    "upazilaId": 217,
    "nameBn": "রামনগর",
    "nameEn": ""
  },
  {
    "id": 2101,
    "upazilaId": 217,
    "nameBn": "ডাঙ্গী",
    "nameEn": ""
  },
  {
    "id": 2102,
    "upazilaId": 217,
    "nameBn": "লস্করদিয়া",
    "nameEn": ""
  },
  {
    "id": 2103,
    "upazilaId": 218,
    "nameBn": "চরভদ্রাসন",
    "nameEn": ""
  },
  {
    "id": 2104,
    "upazilaId": 218,
    "nameBn": "চরহরিরামপুর",
    "nameEn": ""
  },
  {
    "id": 2105,
    "upazilaId": 218,
    "nameBn": "গাজীরটেক",
    "nameEn": ""
  },
  {
    "id": 2106,
    "upazilaId": 218,
    "nameBn": "চরঝাউকান্দা",
    "nameEn": ""
  },
  {
    "id": 2107,
    "upazilaId": 219,
    "nameBn": "চর বিষ্ণুপুর",
    "nameEn": ""
  },
  {
    "id": 2108,
    "upazilaId": 219,
    "nameBn": "আকটেরচর",
    "nameEn": ""
  },
  {
    "id": 2109,
    "upazilaId": 219,
    "nameBn": "নারিকেলবাড়িয়া",
    "nameEn": ""
  },
  {
    "id": 2110,
    "upazilaId": 219,
    "nameBn": "চর নাছিরপুর",
    "nameEn": ""
  },
  {
    "id": 2111,
    "upazilaId": 219,
    "nameBn": "ভাষাণচর",
    "nameEn": ""
  },
  {
    "id": 2112,
    "upazilaId": 219,
    "nameBn": "কৃষ্ণপুর",
    "nameEn": ""
  },
  {
    "id": 2113,
    "upazilaId": 219,
    "nameBn": "সদরপুর",
    "nameEn": ""
  },
  {
    "id": 2114,
    "upazilaId": 219,
    "nameBn": "চর মানাইর",
    "nameEn": ""
  },
  {
    "id": 2115,
    "upazilaId": 219,
    "nameBn": "ঢেউখালী",
    "nameEn": ""
  },
  {
    "id": 2116,
    "upazilaId": 220,
    "nameBn": "ভাওয়াল",
    "nameEn": ""
  },
  {
    "id": 2117,
    "upazilaId": 220,
    "nameBn": "আটঘর",
    "nameEn": ""
  },
  {
    "id": 2118,
    "upazilaId": 220,
    "nameBn": "মাঝারদিয়া",
    "nameEn": ""
  },
  {
    "id": 2119,
    "upazilaId": 220,
    "nameBn": "বল্লভদী",
    "nameEn": ""
  },
  {
    "id": 2120,
    "upazilaId": 220,
    "nameBn": "গট্টি",
    "nameEn": ""
  },
  {
    "id": 2121,
    "upazilaId": 220,
    "nameBn": "যদুনন্দী",
    "nameEn": ""
  },
  {
    "id": 2122,
    "upazilaId": 220,
    "nameBn": "রামকান্তপুর",
    "nameEn": ""
  },
  {
    "id": 2123,
    "upazilaId": 220,
    "nameBn": "সোনাপুর",
    "nameEn": ""
  },
  {
    "id": 2124,
    "upazilaId": 221,
    "nameBn": "শিরখাড়া",
    "nameEn": ""
  },
  {
    "id": 2125,
    "upazilaId": 221,
    "nameBn": "বাহাদুরপুর",
    "nameEn": ""
  },
  {
    "id": 2126,
    "upazilaId": 221,
    "nameBn": "কুনিয়া",
    "nameEn": ""
  },
  {
    "id": 2127,
    "upazilaId": 221,
    "nameBn": "পেয়ারপুর",
    "nameEn": ""
  },
  {
    "id": 2128,
    "upazilaId": 221,
    "nameBn": "ধুরাইল",
    "nameEn": ""
  },
  {
    "id": 2129,
    "upazilaId": 221,
    "nameBn": "রাস্তি",
    "nameEn": ""
  },
  {
    "id": 2130,
    "upazilaId": 221,
    "nameBn": "পাঁচখোলা",
    "nameEn": ""
  },
  {
    "id": 2131,
    "upazilaId": 221,
    "nameBn": "খোয়াজপুর",
    "nameEn": ""
  },
  {
    "id": 2132,
    "upazilaId": 221,
    "nameBn": "ঝাউদী",
    "nameEn": ""
  },
  {
    "id": 2133,
    "upazilaId": 221,
    "nameBn": "ঘটমাঝি",
    "nameEn": ""
  },
  {
    "id": 2134,
    "upazilaId": 221,
    "nameBn": "কেন্দুয়া",
    "nameEn": ""
  },
  {
    "id": 2135,
    "upazilaId": 221,
    "nameBn": "মস্তফাপুর",
    "nameEn": ""
  },
  {
    "id": 2136,
    "upazilaId": 221,
    "nameBn": "কালিকাপুর",
    "nameEn": ""
  },
  {
    "id": 2137,
    "upazilaId": 221,
    "nameBn": "ছিলারচর",
    "nameEn": ""
  },
  {
    "id": 2138,
    "upazilaId": 221,
    "nameBn": "দুধখালী",
    "nameEn": ""
  },
  {
    "id": 2139,
    "upazilaId": 222,
    "nameBn": "দত্তপাড়া",
    "nameEn": ""
  },
  {
    "id": 2140,
    "upazilaId": 222,
    "nameBn": "দ্বিতীয়খন্ড",
    "nameEn": ""
  },
  {
    "id": 2141,
    "upazilaId": 222,
    "nameBn": "শিবচর",
    "nameEn": ""
  },
  {
    "id": 2142,
    "upazilaId": 222,
    "nameBn": "নিলখী",
    "nameEn": ""
  },
  {
    "id": 2143,
    "upazilaId": 222,
    "nameBn": "বন্দরখোলা",
    "nameEn": ""
  },
  {
    "id": 2144,
    "upazilaId": 222,
    "nameBn": "চরজানাজাত",
    "nameEn": ""
  },
  {
    "id": 2145,
    "upazilaId": 222,
    "nameBn": "মাদবরেরচর",
    "nameEn": ""
  },
  {
    "id": 2146,
    "upazilaId": 222,
    "nameBn": "পাঁচ্চর",
    "nameEn": ""
  },
  {
    "id": 2147,
    "upazilaId": 222,
    "nameBn": "সন্যাসিরচর",
    "nameEn": ""
  },
  {
    "id": 2148,
    "upazilaId": 222,
    "nameBn": "কাঁঠালবাড়ী",
    "nameEn": ""
  },
  {
    "id": 2149,
    "upazilaId": 222,
    "nameBn": "কুতুবপুর",
    "nameEn": ""
  },
  {
    "id": 2150,
    "upazilaId": 222,
    "nameBn": "কাদিরপুর",
    "nameEn": ""
  },
  {
    "id": 2151,
    "upazilaId": 222,
    "nameBn": "ভান্ডারীকান্দি",
    "nameEn": ""
  },
  {
    "id": 2152,
    "upazilaId": 222,
    "nameBn": "বহেরাতলা দক্ষিণ",
    "nameEn": ""
  },
  {
    "id": 2153,
    "upazilaId": 222,
    "nameBn": "বহেরাতলা উত্তর",
    "nameEn": ""
  },
  {
    "id": 2154,
    "upazilaId": 222,
    "nameBn": "বাঁশকান্দি",
    "nameEn": ""
  },
  {
    "id": 2155,
    "upazilaId": 222,
    "nameBn": "উমেদপুর",
    "nameEn": ""
  },
  {
    "id": 2156,
    "upazilaId": 222,
    "nameBn": "ভদ্রাসন",
    "nameEn": ""
  },
  {
    "id": 2157,
    "upazilaId": 222,
    "nameBn": "শিরুয়াইল",
    "nameEn": ""
  },
  {
    "id": 2158,
    "upazilaId": 223,
    "nameBn": "আলীনগর",
    "nameEn": ""
  },
  {
    "id": 2159,
    "upazilaId": 223,
    "nameBn": "এনায়েতনগর",
    "nameEn": ""
  },
  {
    "id": 2160,
    "upazilaId": 223,
    "nameBn": "শিকারমঙ্গল",
    "nameEn": ""
  },
  {
    "id": 2161,
    "upazilaId": 223,
    "nameBn": "সাহেবরামপুর",
    "nameEn": ""
  },
  {
    "id": 2162,
    "upazilaId": 223,
    "nameBn": "রমজানপুর",
    "nameEn": ""
  },
  {
    "id": 2163,
    "upazilaId": 223,
    "nameBn": "কয়ারিয়া",
    "nameEn": ""
  },
  {
    "id": 2164,
    "upazilaId": 223,
    "nameBn": "বাঁশগাড়ী",
    "nameEn": ""
  },
  {
    "id": 2165,
    "upazilaId": 223,
    "nameBn": "লক্ষীপুর",
    "nameEn": ""
  },
  {
    "id": 2166,
    "upazilaId": 223,
    "nameBn": "চরদৌলতখান",
    "nameEn": ""
  },
  {
    "id": 2167,
    "upazilaId": 223,
    "nameBn": "পূর্ব এনায়েতনগর",
    "nameEn": ""
  },
  {
    "id": 2168,
    "upazilaId": 224,
    "nameBn": "আমগ্রাম",
    "nameEn": ""
  },
  {
    "id": 2169,
    "upazilaId": 224,
    "nameBn": "বদরপাশা",
    "nameEn": ""
  },
  {
    "id": 2170,
    "upazilaId": 224,
    "nameBn": "বাজিতপুর",
    "nameEn": ""
  },
  {
    "id": 2171,
    "upazilaId": 224,
    "nameBn": "হরিদাসদী-মহেন্দ্রদী",
    "nameEn": ""
  },
  {
    "id": 2172,
    "upazilaId": 224,
    "nameBn": "হোসেনপুর",
    "nameEn": ""
  },
  {
    "id": 2173,
    "upazilaId": 224,
    "nameBn": "ইশিবপুর",
    "nameEn": ""
  },
  {
    "id": 2174,
    "upazilaId": 224,
    "nameBn": "কবিরাজপুর",
    "nameEn": ""
  },
  {
    "id": 2175,
    "upazilaId": 224,
    "nameBn": "কদমবাড়ী",
    "nameEn": ""
  },
  {
    "id": 2176,
    "upazilaId": 224,
    "nameBn": "খালিয়া",
    "nameEn": ""
  },
  {
    "id": 2177,
    "upazilaId": 224,
    "nameBn": "পাইকপাড়া",
    "nameEn": ""
  },
  {
    "id": 2178,
    "upazilaId": 224,
    "nameBn": "রাজৈর",
    "nameEn": ""
  },
  {
    "id": 2179,
    "upazilaId": 225,
    "nameBn": "গোপালপুর",
    "nameEn": ""
  },
  {
    "id": 2180,
    "upazilaId": 225,
    "nameBn": "কাজীবাকাই",
    "nameEn": ""
  },
  {
    "id": 2181,
    "upazilaId": 225,
    "nameBn": "বালিগ্রাম",
    "nameEn": ""
  },
  {
    "id": 2182,
    "upazilaId": 225,
    "nameBn": "ডাসার",
    "nameEn": ""
  },
  {
    "id": 2183,
    "upazilaId": 225,
    "nameBn": "নবগ্রাম",
    "nameEn": ""
  },
  {
    "id": 2184,
    "upazilaId": 226,
    "nameBn": "ঘিওর",
    "nameEn": ""
  },
  {
    "id": 2185,
    "upazilaId": 226,
    "nameBn": "নালী",
    "nameEn": ""
  },
  {
    "id": 2186,
    "upazilaId": 226,
    "nameBn": "পয়লা",
    "nameEn": ""
  },
  {
    "id": 2187,
    "upazilaId": 226,
    "nameBn": "বড়টিয়া",
    "nameEn": ""
  },
  {
    "id": 2188,
    "upazilaId": 226,
    "nameBn": "বানিয়াজুড়ী",
    "nameEn": ""
  },
  {
    "id": 2189,
    "upazilaId": 226,
    "nameBn": "বালিয়াখোড়া",
    "nameEn": ""
  },
  {
    "id": 2190,
    "upazilaId": 226,
    "nameBn": "সিংজুড়ী",
    "nameEn": ""
  },
  {
    "id": 2191,
    "upazilaId": 4,
    "nameBn": "চকমিরপুর",
    "nameEn": ""
  },
  {
    "id": 2192,
    "upazilaId": 4,
    "nameBn": "কলিয়া",
    "nameEn": ""
  },
  {
    "id": 2193,
    "upazilaId": 4,
    "nameBn": "বাচামারা",
    "nameEn": ""
  },
  {
    "id": 2194,
    "upazilaId": 4,
    "nameBn": "বাঘুটিয়া",
    "nameEn": ""
  },
  {
    "id": 2195,
    "upazilaId": 4,
    "nameBn": "জিয়নপুর",
    "nameEn": ""
  },
  {
    "id": 2196,
    "upazilaId": 4,
    "nameBn": "খলশী",
    "nameEn": ""
  },
  {
    "id": 2197,
    "upazilaId": 4,
    "nameBn": "ধামশ্বর",
    "nameEn": ""
  },
  {
    "id": 2198,
    "upazilaId": 4,
    "nameBn": "চরকাটারী",
    "nameEn": ""
  },
  {
    "id": 2199,
    "upazilaId": 227,
    "nameBn": "আটিগ্রাম",
    "nameEn": ""
  },
  {
    "id": 2200,
    "upazilaId": 227,
    "nameBn": "কৃষ্ণপুর",
    "nameEn": ""
  },
  {
    "id": 2201,
    "upazilaId": 227,
    "nameBn": "গড়পাড়া",
    "nameEn": ""
  },
  {
    "id": 2202,
    "upazilaId": 227,
    "nameBn": "জাগীর",
    "nameEn": ""
  },
  {
    "id": 2203,
    "upazilaId": 227,
    "nameBn": "দিঘী",
    "nameEn": ""
  },
  {
    "id": 2204,
    "upazilaId": 227,
    "nameBn": "নবগ্রাম",
    "nameEn": ""
  },
  {
    "id": 2205,
    "upazilaId": 227,
    "nameBn": "পুটাইল",
    "nameEn": ""
  },
  {
    "id": 2206,
    "upazilaId": 227,
    "nameBn": "বেতিলা মিতরা",
    "nameEn": ""
  },
  {
    "id": 2207,
    "upazilaId": 227,
    "nameBn": "ভাড়ারিয়া",
    "nameEn": ""
  },
  {
    "id": 2208,
    "upazilaId": 227,
    "nameBn": "হাটিপাড়া",
    "nameEn": ""
  },
  {
    "id": 2209,
    "upazilaId": 228,
    "nameBn": "উলাইল",
    "nameEn": ""
  },
  {
    "id": 2210,
    "upazilaId": 228,
    "nameBn": "তেওতা",
    "nameEn": ""
  },
  {
    "id": 2211,
    "upazilaId": 228,
    "nameBn": "শিবালয়",
    "nameEn": ""
  },
  {
    "id": 2212,
    "upazilaId": 228,
    "nameBn": "মহাদেবপুর",
    "nameEn": ""
  },
  {
    "id": 2213,
    "upazilaId": 228,
    "nameBn": "আরুয়া",
    "nameEn": ""
  },
  {
    "id": 2214,
    "upazilaId": 228,
    "nameBn": "উথলী",
    "nameEn": ""
  },
  {
    "id": 2215,
    "upazilaId": 228,
    "nameBn": "শিমুলিয়া",
    "nameEn": ""
  },
  {
    "id": 2216,
    "upazilaId": 229,
    "nameBn": "সাটুরিয়া",
    "nameEn": ""
  },
  {
    "id": 2217,
    "upazilaId": 229,
    "nameBn": "বালিয়াটি",
    "nameEn": ""
  },
  {
    "id": 2218,
    "upazilaId": 229,
    "nameBn": "বরাইদ",
    "nameEn": ""
  },
  {
    "id": 2219,
    "upazilaId": 229,
    "nameBn": "দড়গ্রাম",
    "nameEn": ""
  },
  {
    "id": 2220,
    "upazilaId": 229,
    "nameBn": "দিঘুলিয়া",
    "nameEn": ""
  },
  {
    "id": 2221,
    "upazilaId": 229,
    "nameBn": "ধানকোড়া",
    "nameEn": ""
  },
  {
    "id": 2222,
    "upazilaId": 229,
    "nameBn": "ফুকুরহাটি",
    "nameEn": ""
  },
  {
    "id": 2223,
    "upazilaId": 229,
    "nameBn": "হরগজ",
    "nameEn": ""
  },
  {
    "id": 2224,
    "upazilaId": 229,
    "nameBn": "তিল্লী",
    "nameEn": ""
  },
  {
    "id": 2225,
    "upazilaId": 230,
    "nameBn": "বায়রা",
    "nameEn": ""
  },
  {
    "id": 2226,
    "upazilaId": 230,
    "nameBn": "তালেবপুর",
    "nameEn": ""
  },
  {
    "id": 2227,
    "upazilaId": 230,
    "nameBn": "সিঙ্গাইর",
    "nameEn": ""
  },
  {
    "id": 2228,
    "upazilaId": 230,
    "nameBn": "বলধারা",
    "nameEn": ""
  },
  {
    "id": 2229,
    "upazilaId": 230,
    "nameBn": "জামশা",
    "nameEn": ""
  },
  {
    "id": 2230,
    "upazilaId": 230,
    "nameBn": "চারিগ্রাম",
    "nameEn": ""
  },
  {
    "id": 2231,
    "upazilaId": 230,
    "nameBn": "শায়েস্তা",
    "nameEn": ""
  },
  {
    "id": 2232,
    "upazilaId": 230,
    "nameBn": "জয়মন্টপ",
    "nameEn": ""
  },
  {
    "id": 2233,
    "upazilaId": 230,
    "nameBn": "ধল্লা",
    "nameEn": ""
  },
  {
    "id": 2234,
    "upazilaId": 230,
    "nameBn": "জামির্তা",
    "nameEn": ""
  },
  {
    "id": 2235,
    "upazilaId": 230,
    "nameBn": "চান্দহর",
    "nameEn": ""
  },
  {
    "id": 2236,
    "upazilaId": 231,
    "nameBn": "চালা",
    "nameEn": ""
  },
  {
    "id": 2237,
    "upazilaId": 231,
    "nameBn": "বয়ড়া",
    "nameEn": ""
  },
  {
    "id": 2238,
    "upazilaId": 231,
    "nameBn": "কাঞ্চনপুর",
    "nameEn": ""
  },
  {
    "id": 2239,
    "upazilaId": 231,
    "nameBn": "ধূলশুড়া",
    "nameEn": ""
  },
  {
    "id": 2240,
    "upazilaId": 231,
    "nameBn": "রামকৃষ্ণপুর",
    "nameEn": ""
  },
  {
    "id": 2241,
    "upazilaId": 231,
    "nameBn": "আজিমনগর",
    "nameEn": ""
  },
  {
    "id": 2242,
    "upazilaId": 231,
    "nameBn": "বলড়া",
    "nameEn": ""
  },
  {
    "id": 2243,
    "upazilaId": 231,
    "nameBn": "লেছড়াগঞ্জ",
    "nameEn": ""
  },
  {
    "id": 2244,
    "upazilaId": 231,
    "nameBn": "গোপীনাথপুর",
    "nameEn": ""
  },
  {
    "id": 2245,
    "upazilaId": 231,
    "nameBn": "সুতালড়ী",
    "nameEn": ""
  },
  {
    "id": 2246,
    "upazilaId": 231,
    "nameBn": "গালা",
    "nameEn": ""
  },
  {
    "id": 2247,
    "upazilaId": 231,
    "nameBn": "হারুকান্দি",
    "nameEn": ""
  },
  {
    "id": 2248,
    "upazilaId": 231,
    "nameBn": "বাল্লা",
    "nameEn": ""
  },
  {
    "id": 2249,
    "upazilaId": 232,
    "nameBn": "শিলই",
    "nameEn": ""
  },
  {
    "id": 2250,
    "upazilaId": 232,
    "nameBn": "আধারা",
    "nameEn": ""
  },
  {
    "id": 2251,
    "upazilaId": 232,
    "nameBn": "বাংলাবাজার",
    "nameEn": ""
  },
  {
    "id": 2252,
    "upazilaId": 232,
    "nameBn": "পঞ্চসার",
    "nameEn": ""
  },
  {
    "id": 2253,
    "upazilaId": 232,
    "nameBn": "রামপাল",
    "nameEn": ""
  },
  {
    "id": 2254,
    "upazilaId": 232,
    "nameBn": "বজ্রযোগীনি",
    "nameEn": ""
  },
  {
    "id": 2255,
    "upazilaId": 232,
    "nameBn": "চরকেওয়ার",
    "nameEn": ""
  },
  {
    "id": 2256,
    "upazilaId": 232,
    "nameBn": "মোল্লাকান্দি",
    "nameEn": ""
  },
  {
    "id": 2257,
    "upazilaId": 232,
    "nameBn": "মহাকালি",
    "nameEn": ""
  },
  {
    "id": 2258,
    "upazilaId": 233,
    "nameBn": "ধীপুর",
    "nameEn": ""
  },
  {
    "id": 2259,
    "upazilaId": 233,
    "nameBn": "পাঁচগাও",
    "nameEn": ""
  },
  {
    "id": 2260,
    "upazilaId": 233,
    "nameBn": "কাঠাদিয়া-শিমুলিয়া",
    "nameEn": ""
  },
  {
    "id": 2261,
    "upazilaId": 233,
    "nameBn": "সোনারং-টংগিবাড়ী",
    "nameEn": ""
  },
  {
    "id": 2262,
    "upazilaId": 233,
    "nameBn": "বেতকা",
    "nameEn": ""
  },
  {
    "id": 2263,
    "upazilaId": 233,
    "nameBn": "আব্দুল্লাপুর",
    "nameEn": ""
  },
  {
    "id": 2264,
    "upazilaId": 233,
    "nameBn": "যশলং",
    "nameEn": ""
  },
  {
    "id": 2265,
    "upazilaId": 233,
    "nameBn": "কামারখাড়া",
    "nameEn": ""
  },
  {
    "id": 2266,
    "upazilaId": 233,
    "nameBn": "দিঘিরপাড়",
    "nameEn": ""
  },
  {
    "id": 2267,
    "upazilaId": 233,
    "nameBn": "হাসাইল-বানারী",
    "nameEn": ""
  },
  {
    "id": 2268,
    "upazilaId": 233,
    "nameBn": "আউটশাহী",
    "nameEn": ""
  },
  {
    "id": 2269,
    "upazilaId": 233,
    "nameBn": "আড়িয়ল",
    "nameEn": ""
  },
  {
    "id": 2270,
    "upazilaId": 233,
    "nameBn": "বালিগাঁও",
    "nameEn": ""
  },
  {
    "id": 2271,
    "upazilaId": 234,
    "nameBn": "শ্রীনগর",
    "nameEn": ""
  },
  {
    "id": 2272,
    "upazilaId": 234,
    "nameBn": "শ্যামসিদ্ধি",
    "nameEn": ""
  },
  {
    "id": 2273,
    "upazilaId": 234,
    "nameBn": "ষোলঘর",
    "nameEn": ""
  },
  {
    "id": 2274,
    "upazilaId": 234,
    "nameBn": "কুকুটিয়া",
    "nameEn": ""
  },
  {
    "id": 2275,
    "upazilaId": 234,
    "nameBn": "তন্তর",
    "nameEn": ""
  },
  {
    "id": 2276,
    "upazilaId": 234,
    "nameBn": "আটপাড়া",
    "nameEn": ""
  },
  {
    "id": 2277,
    "upazilaId": 234,
    "nameBn": "রাঢ়ীখাল",
    "nameEn": ""
  },
  {
    "id": 2278,
    "upazilaId": 234,
    "nameBn": "ভাগ্যকুল",
    "nameEn": ""
  },
  {
    "id": 2279,
    "upazilaId": 234,
    "nameBn": "বাঘড়া",
    "nameEn": ""
  },
  {
    "id": 2280,
    "upazilaId": 234,
    "nameBn": "কোলাপাড়া",
    "nameEn": ""
  },
  {
    "id": 2281,
    "upazilaId": 234,
    "nameBn": "পাটাভোগ",
    "nameEn": ""
  },
  {
    "id": 2282,
    "upazilaId": 234,
    "nameBn": "হাসাড়া",
    "nameEn": ""
  },
  {
    "id": 2283,
    "upazilaId": 234,
    "nameBn": "বীরতারা",
    "nameEn": ""
  },
  {
    "id": 2284,
    "upazilaId": 234,
    "nameBn": "বাড়ৈখালী",
    "nameEn": ""
  },
  {
    "id": 2285,
    "upazilaId": 235,
    "nameBn": "মেদিনীমন্ডল",
    "nameEn": ""
  },
  {
    "id": 2286,
    "upazilaId": 235,
    "nameBn": "খিদিরপাড়া",
    "nameEn": ""
  },
  {
    "id": 2287,
    "upazilaId": 235,
    "nameBn": "বৌলতলী",
    "nameEn": ""
  },
  {
    "id": 2288,
    "upazilaId": 235,
    "nameBn": "কলমা",
    "nameEn": ""
  },
  {
    "id": 2289,
    "upazilaId": 235,
    "nameBn": "গাওদিয়া",
    "nameEn": ""
  },
  {
    "id": 2290,
    "upazilaId": 235,
    "nameBn": "বেজগাঁও",
    "nameEn": ""
  },
  {
    "id": 2291,
    "upazilaId": 235,
    "nameBn": "কনকসার",
    "nameEn": ""
  },
  {
    "id": 2292,
    "upazilaId": 235,
    "nameBn": "লৌহজং-তেউটিয়া",
    "nameEn": ""
  },
  {
    "id": 2293,
    "upazilaId": 235,
    "nameBn": "কুমারভোগ",
    "nameEn": ""
  },
  {
    "id": 2294,
    "upazilaId": 235,
    "nameBn": "হলদিয়া",
    "nameEn": ""
  },
  {
    "id": 2295,
    "upazilaId": 236,
    "nameBn": "টেংগারচর",
    "nameEn": ""
  },
  {
    "id": 2296,
    "upazilaId": 236,
    "nameBn": "বালুয়াকান্দি",
    "nameEn": ""
  },
  {
    "id": 2297,
    "upazilaId": 236,
    "nameBn": "ভবেরচর",
    "nameEn": ""
  },
  {
    "id": 2298,
    "upazilaId": 236,
    "nameBn": "বাউশিয়া",
    "nameEn": ""
  },
  {
    "id": 2299,
    "upazilaId": 236,
    "nameBn": "গজারিয়া",
    "nameEn": ""
  },
  {
    "id": 2300,
    "upazilaId": 236,
    "nameBn": "হোসেন্দী",
    "nameEn": ""
  },
  {
    "id": 2301,
    "upazilaId": 236,
    "nameBn": "ইমামপুর",
    "nameEn": ""
  },
  {
    "id": 2302,
    "upazilaId": 236,
    "nameBn": "গুয়াগাছিয়া",
    "nameEn": ""
  },
  {
    "id": 2303,
    "upazilaId": 237,
    "nameBn": "চিত্রকোট",
    "nameEn": ""
  },
  {
    "id": 2304,
    "upazilaId": 237,
    "nameBn": "শেখর নগর",
    "nameEn": ""
  },
  {
    "id": 2305,
    "upazilaId": 237,
    "nameBn": "রাজানগর",
    "nameEn": ""
  },
  {
    "id": 2306,
    "upazilaId": 237,
    "nameBn": "কেয়াইন",
    "nameEn": ""
  },
  {
    "id": 2307,
    "upazilaId": 237,
    "nameBn": "বাসাইল",
    "nameEn": ""
  },
  {
    "id": 2308,
    "upazilaId": 237,
    "nameBn": "রশুনিয়া",
    "nameEn": ""
  },
  {
    "id": 2309,
    "upazilaId": 237,
    "nameBn": "লতব্দী",
    "nameEn": ""
  },
  {
    "id": 2310,
    "upazilaId": 237,
    "nameBn": "বালুচর",
    "nameEn": ""
  },
  {
    "id": 2311,
    "upazilaId": 237,
    "nameBn": "ইছাপুরা",
    "nameEn": ""
  },
  {
    "id": 2312,
    "upazilaId": 237,
    "nameBn": "বয়রাগাদি",
    "nameEn": ""
  },
  {
    "id": 2313,
    "upazilaId": 237,
    "nameBn": "মালখানগর",
    "nameEn": ""
  },
  {
    "id": 2314,
    "upazilaId": 237,
    "nameBn": "মধ্যপাড়া",
    "nameEn": ""
  },
  {
    "id": 2315,
    "upazilaId": 237,
    "nameBn": "জৈনসার",
    "nameEn": ""
  },
  {
    "id": 2316,
    "upazilaId": 237,
    "nameBn": "কোলা",
    "nameEn": ""
  },
  {
    "id": 2317,
    "upazilaId": 238,
    "nameBn": "মিজানপুর",
    "nameEn": ""
  },
  {
    "id": 2318,
    "upazilaId": 238,
    "nameBn": "দাদশী",
    "nameEn": ""
  },
  {
    "id": 2319,
    "upazilaId": 238,
    "nameBn": "শহীদ ওহাবপুর",
    "nameEn": ""
  },
  {
    "id": 2320,
    "upazilaId": 238,
    "nameBn": "বসন্তপুর",
    "nameEn": ""
  },
  {
    "id": 2321,
    "upazilaId": 238,
    "nameBn": "খানখানাপুর",
    "nameEn": ""
  },
  {
    "id": 2322,
    "upazilaId": 238,
    "nameBn": "আলীপুর",
    "nameEn": ""
  },
  {
    "id": 2323,
    "upazilaId": 238,
    "nameBn": "খানগঞ্জ",
    "nameEn": ""
  },
  {
    "id": 2324,
    "upazilaId": 238,
    "nameBn": "চন্দনী",
    "nameEn": ""
  },
  {
    "id": 2325,
    "upazilaId": 238,
    "nameBn": "রামকান্তপুর",
    "nameEn": ""
  },
  {
    "id": 2326,
    "upazilaId": 238,
    "nameBn": "বানীবহ",
    "nameEn": ""
  },
  {
    "id": 2327,
    "upazilaId": 238,
    "nameBn": "মূলঘর",
    "nameEn": ""
  },
  {
    "id": 2328,
    "upazilaId": 238,
    "nameBn": "বরাট",
    "nameEn": ""
  },
  {
    "id": 2329,
    "upazilaId": 238,
    "nameBn": "পাঁচুরিয়া",
    "nameEn": ""
  },
  {
    "id": 2330,
    "upazilaId": 238,
    "nameBn": "সুলতানপুর",
    "nameEn": ""
  },
  {
    "id": 2331,
    "upazilaId": 239,
    "nameBn": "দৌলতদিয়া",
    "nameEn": ""
  },
  {
    "id": 2332,
    "upazilaId": 239,
    "nameBn": "দেবগ্রাম",
    "nameEn": ""
  },
  {
    "id": 2333,
    "upazilaId": 239,
    "nameBn": "ছোটভাকলা",
    "nameEn": ""
  },
  {
    "id": 2334,
    "upazilaId": 239,
    "nameBn": "উজানচর",
    "nameEn": ""
  },
  {
    "id": 2335,
    "upazilaId": 240,
    "nameBn": "হাবাসপুর",
    "nameEn": ""
  },
  {
    "id": 2336,
    "upazilaId": 240,
    "nameBn": "বাহাদুরপুর",
    "nameEn": ""
  },
  {
    "id": 2337,
    "upazilaId": 240,
    "nameBn": "যশাই",
    "nameEn": ""
  },
  {
    "id": 2338,
    "upazilaId": 240,
    "nameBn": "বাবুপাড়া",
    "nameEn": ""
  },
  {
    "id": 2339,
    "upazilaId": 240,
    "nameBn": "মাছপাড়া",
    "nameEn": ""
  },
  {
    "id": 2340,
    "upazilaId": 240,
    "nameBn": "কলিমহর",
    "nameEn": ""
  },
  {
    "id": 2341,
    "upazilaId": 240,
    "nameBn": "সরিষা",
    "nameEn": ""
  },
  {
    "id": 2342,
    "upazilaId": 240,
    "nameBn": "কসবামাজাইল",
    "nameEn": ""
  },
  {
    "id": 2343,
    "upazilaId": 240,
    "nameBn": "মৌরাট",
    "nameEn": ""
  },
  {
    "id": 2344,
    "upazilaId": 240,
    "nameBn": "পাট্টা",
    "nameEn": ""
  },
  {
    "id": 2345,
    "upazilaId": 241,
    "nameBn": "জামালপুর",
    "nameEn": ""
  },
  {
    "id": 2346,
    "upazilaId": 241,
    "nameBn": "বহরপুর",
    "nameEn": ""
  },
  {
    "id": 2347,
    "upazilaId": 241,
    "nameBn": "ইসলামপুর",
    "nameEn": ""
  },
  {
    "id": 2348,
    "upazilaId": 241,
    "nameBn": "নবাবপুর",
    "nameEn": ""
  },
  {
    "id": 2349,
    "upazilaId": 241,
    "nameBn": "জঙ্গল",
    "nameEn": ""
  },
  {
    "id": 2350,
    "upazilaId": 241,
    "nameBn": "নারুয়া",
    "nameEn": ""
  },
  {
    "id": 2351,
    "upazilaId": 241,
    "nameBn": "বালিয়াকান্দি",
    "nameEn": ""
  },
  {
    "id": 2352,
    "upazilaId": 242,
    "nameBn": "রতনদিয়া",
    "nameEn": ""
  },
  {
    "id": 2353,
    "upazilaId": 242,
    "nameBn": "কালিকাপুর",
    "nameEn": ""
  },
  {
    "id": 2354,
    "upazilaId": 242,
    "nameBn": "বোয়ালিয়া",
    "nameEn": ""
  },
  {
    "id": 2355,
    "upazilaId": 242,
    "nameBn": "মাজবাড়ী",
    "nameEn": ""
  },
  {
    "id": 2356,
    "upazilaId": 242,
    "nameBn": "মদাপুর",
    "nameEn": ""
  },
  {
    "id": 2357,
    "upazilaId": 242,
    "nameBn": "মৃগী",
    "nameEn": ""
  },
  {
    "id": 2358,
    "upazilaId": 242,
    "nameBn": "সাওরাইল",
    "nameEn": ""
  },
  {
    "id": 2359,
    "upazilaId": 243,
    "nameBn": "জাজিরা",
    "nameEn": ""
  },
  {
    "id": 2360,
    "upazilaId": 243,
    "nameBn": "বিলাসপুর",
    "nameEn": ""
  },
  {
    "id": 2361,
    "upazilaId": 243,
    "nameBn": "কুন্ডেরচর",
    "nameEn": ""
  },
  {
    "id": 2362,
    "upazilaId": 243,
    "nameBn": "পালেরচর",
    "nameEn": ""
  },
  {
    "id": 2363,
    "upazilaId": 243,
    "nameBn": "বড়কান্দি",
    "nameEn": ""
  },
  {
    "id": 2364,
    "upazilaId": 243,
    "nameBn": "সেনেরচর",
    "nameEn": ""
  },
  {
    "id": 2365,
    "upazilaId": 243,
    "nameBn": "জয়নগর",
    "nameEn": ""
  },
  {
    "id": 2366,
    "upazilaId": 243,
    "nameBn": "বিকেনগর",
    "nameEn": ""
  },
  {
    "id": 2367,
    "upazilaId": 243,
    "nameBn": "বড়গোপালপুর",
    "nameEn": ""
  },
  {
    "id": 2368,
    "upazilaId": 243,
    "nameBn": "নাওডোবা",
    "nameEn": ""
  },
  {
    "id": 2369,
    "upazilaId": 243,
    "nameBn": "পূর্ব নাওডোবা",
    "nameEn": ""
  },
  {
    "id": 2370,
    "upazilaId": 243,
    "nameBn": "মূলনা",
    "nameEn": ""
  },
  {
    "id": 2371,
    "upazilaId": 244,
    "nameBn": "পালং",
    "nameEn": ""
  },
  {
    "id": 2372,
    "upazilaId": 244,
    "nameBn": "তুলাসার",
    "nameEn": ""
  },
  {
    "id": 2373,
    "upazilaId": 244,
    "nameBn": "আংগারিয়া",
    "nameEn": ""
  },
  {
    "id": 2374,
    "upazilaId": 244,
    "nameBn": "রুদ্রকর",
    "nameEn": ""
  },
  {
    "id": 2375,
    "upazilaId": 244,
    "nameBn": "বিনোদপুর",
    "nameEn": ""
  },
  {
    "id": 2376,
    "upazilaId": 244,
    "nameBn": "চন্দ্রপুর",
    "nameEn": ""
  },
  {
    "id": 2377,
    "upazilaId": 244,
    "nameBn": "মাহমুদপুর",
    "nameEn": ""
  },
  {
    "id": 2378,
    "upazilaId": 244,
    "nameBn": "চিকন্দী",
    "nameEn": ""
  },
  {
    "id": 2379,
    "upazilaId": 244,
    "nameBn": "ডোমসার",
    "nameEn": ""
  },
  {
    "id": 2380,
    "upazilaId": 244,
    "nameBn": "শৌলপাড়া",
    "nameEn": ""
  },
  {
    "id": 2381,
    "upazilaId": 244,
    "nameBn": "চিতলীয়া",
    "nameEn": ""
  },
  {
    "id": 2382,
    "upazilaId": 245,
    "nameBn": "সামন্তসার",
    "nameEn": ""
  },
  {
    "id": 2383,
    "upazilaId": 245,
    "nameBn": "নাগেরপাড়া",
    "nameEn": ""
  },
  {
    "id": 2384,
    "upazilaId": 245,
    "nameBn": "ইদিলপুর",
    "nameEn": ""
  },
  {
    "id": 2385,
    "upazilaId": 245,
    "nameBn": "গোসাইরহাট",
    "nameEn": ""
  },
  {
    "id": 2386,
    "upazilaId": 245,
    "nameBn": "কোদালপুর",
    "nameEn": ""
  },
  {
    "id": 2387,
    "upazilaId": 245,
    "nameBn": "নলমুড়ি",
    "nameEn": ""
  },
  {
    "id": 2388,
    "upazilaId": 245,
    "nameBn": "আলাওলপুর",
    "nameEn": ""
  },
  {
    "id": 2389,
    "upazilaId": 245,
    "nameBn": "কুচাইপট্টি",
    "nameEn": ""
  },
  {
    "id": 2390,
    "upazilaId": 246,
    "nameBn": "কনেশ্বর",
    "nameEn": ""
  },
  {
    "id": 2391,
    "upazilaId": 246,
    "nameBn": "ধানকাঠি",
    "nameEn": ""
  },
  {
    "id": 2392,
    "upazilaId": 246,
    "nameBn": "সিড্যা",
    "nameEn": ""
  },
  {
    "id": 2393,
    "upazilaId": 246,
    "nameBn": "দারুল আমান",
    "nameEn": ""
  },
  {
    "id": 2394,
    "upazilaId": 246,
    "nameBn": "ইসলামপুর",
    "nameEn": ""
  },
  {
    "id": 2395,
    "upazilaId": 246,
    "nameBn": "শিধলকুড়া",
    "nameEn": ""
  },
  {
    "id": 2396,
    "upazilaId": 246,
    "nameBn": "পূর্ব ডামুড্যা",
    "nameEn": ""
  },
  {
    "id": 2397,
    "upazilaId": 247,
    "nameBn": "আর্শিনগর",
    "nameEn": ""
  },
  {
    "id": 2398,
    "upazilaId": 247,
    "nameBn": "কচিকাটা",
    "nameEn": ""
  },
  {
    "id": 2399,
    "upazilaId": 247,
    "nameBn": "চরকুমারিয়া",
    "nameEn": ""
  },
  {
    "id": 2400,
    "upazilaId": 247,
    "nameBn": "চরভাগা",
    "nameEn": ""
  },
  {
    "id": 2401,
    "upazilaId": 247,
    "nameBn": "চরসেনসাস",
    "nameEn": ""
  },
  {
    "id": 2402,
    "upazilaId": 247,
    "nameBn": "ছয়গাঁও",
    "nameEn": ""
  },
  {
    "id": 2403,
    "upazilaId": 247,
    "nameBn": "উত্তর তারাবুনিয়া",
    "nameEn": ""
  },
  {
    "id": 2404,
    "upazilaId": 247,
    "nameBn": "দক্ষিণ তারাবুনিয়া",
    "nameEn": ""
  },
  {
    "id": 2405,
    "upazilaId": 247,
    "nameBn": "দিগার মহিষখালী",
    "nameEn": ""
  },
  {
    "id": 2406,
    "upazilaId": 247,
    "nameBn": "নারায়ণপুর",
    "nameEn": ""
  },
  {
    "id": 2407,
    "upazilaId": 247,
    "nameBn": "মহিষার",
    "nameEn": ""
  },
  {
    "id": 2408,
    "upazilaId": 247,
    "nameBn": "রামভদ্রপুর",
    "nameEn": ""
  },
  {
    "id": 2409,
    "upazilaId": 247,
    "nameBn": "সখিপুর",
    "nameEn": ""
  },
  {
    "id": 2410,
    "upazilaId": 248,
    "nameBn": "মোত্তারেরচর",
    "nameEn": ""
  },
  {
    "id": 2411,
    "upazilaId": 248,
    "nameBn": "রাজনগর",
    "nameEn": ""
  },
  {
    "id": 2412,
    "upazilaId": 248,
    "nameBn": "নশাসন",
    "nameEn": ""
  },
  {
    "id": 2413,
    "upazilaId": 248,
    "nameBn": "ভােজেশ্বর",
    "nameEn": ""
  },
  {
    "id": 2414,
    "upazilaId": 248,
    "nameBn": "জপসা",
    "nameEn": ""
  },
  {
    "id": 2415,
    "upazilaId": 248,
    "nameBn": "ফতেজংপুর",
    "nameEn": ""
  },
  {
    "id": 2416,
    "upazilaId": 248,
    "nameBn": "বিঝারি",
    "nameEn": ""
  },
  {
    "id": 2417,
    "upazilaId": 248,
    "nameBn": "ভূমখাড়া",
    "nameEn": ""
  },
  {
    "id": 2418,
    "upazilaId": 248,
    "nameBn": "ডিংগামানিক",
    "nameEn": ""
  },
  {
    "id": 2419,
    "upazilaId": 248,
    "nameBn": "কেদারপুর",
    "nameEn": ""
  },
  {
    "id": 2420,
    "upazilaId": 248,
    "nameBn": "চরআত্রা",
    "nameEn": ""
  },
  {
    "id": 2421,
    "upazilaId": 248,
    "nameBn": "নওপাড়া",
    "nameEn": ""
  },
  {
    "id": 2422,
    "upazilaId": 248,
    "nameBn": "ঘড়িষার",
    "nameEn": ""
  },
  {
    "id": 2423,
    "upazilaId": 248,
    "nameBn": "চামটা",
    "nameEn": ""
  },
  {
    "id": 2424,
    "upazilaId": 249,
    "nameBn": "রায়পাশা কড়াপুর",
    "nameEn": ""
  },
  {
    "id": 2425,
    "upazilaId": 249,
    "nameBn": "কাশীপুর",
    "nameEn": ""
  },
  {
    "id": 2426,
    "upazilaId": 249,
    "nameBn": "চর বাড়িয়া",
    "nameEn": ""
  },
  {
    "id": 2427,
    "upazilaId": 249,
    "nameBn": "সায়েস্তাবাদ",
    "nameEn": ""
  },
  {
    "id": 2428,
    "upazilaId": 249,
    "nameBn": "চর মোনাই",
    "nameEn": ""
  },
  {
    "id": 2429,
    "upazilaId": 249,
    "nameBn": "জাগুয়া",
    "nameEn": ""
  },
  {
    "id": 2430,
    "upazilaId": 249,
    "nameBn": "চরকাউয়া",
    "nameEn": ""
  },
  {
    "id": 2431,
    "upazilaId": 249,
    "nameBn": "চাঁদপুরা",
    "nameEn": ""
  },
  {
    "id": 2432,
    "upazilaId": 249,
    "nameBn": "টুঙ্গীবাড়িয়া",
    "nameEn": ""
  },
  {
    "id": 2433,
    "upazilaId": 249,
    "nameBn": "চন্দ্রমোহন",
    "nameEn": ""
  },
  {
    "id": 2434,
    "upazilaId": 250,
    "nameBn": "খাঞ্জাপুর",
    "nameEn": ""
  },
  {
    "id": 2435,
    "upazilaId": 250,
    "nameBn": "বার্থী",
    "nameEn": ""
  },
  {
    "id": 2436,
    "upazilaId": 250,
    "nameBn": "চাঁদশী",
    "nameEn": ""
  },
  {
    "id": 2437,
    "upazilaId": 250,
    "nameBn": "নলচিড়া",
    "nameEn": ""
  },
  {
    "id": 2438,
    "upazilaId": 250,
    "nameBn": "মাহিলাড়া",
    "nameEn": ""
  },
  {
    "id": 2439,
    "upazilaId": 250,
    "nameBn": "বাটাজোর",
    "nameEn": ""
  },
  {
    "id": 2440,
    "upazilaId": 250,
    "nameBn": "সরিকল",
    "nameEn": ""
  },
  {
    "id": 2441,
    "upazilaId": 251,
    "nameBn": "বাটামারা",
    "nameEn": ""
  },
  {
    "id": 2442,
    "upazilaId": 251,
    "nameBn": "নাজিরপুর",
    "nameEn": ""
  },
  {
    "id": 2443,
    "upazilaId": 251,
    "nameBn": "সফিপুর",
    "nameEn": ""
  },
  {
    "id": 2444,
    "upazilaId": 251,
    "nameBn": "গাছুয়া",
    "nameEn": ""
  },
  {
    "id": 2445,
    "upazilaId": 251,
    "nameBn": "চরকালেখা",
    "nameEn": ""
  },
  {
    "id": 2446,
    "upazilaId": 251,
    "nameBn": "মুলাদী",
    "nameEn": ""
  },
  {
    "id": 2447,
    "upazilaId": 251,
    "nameBn": "কাজিরচর",
    "nameEn": ""
  },
  {
    "id": 2448,
    "upazilaId": 252,
    "nameBn": "আন্ধারমানিক",
    "nameEn": ""
  },
  {
    "id": 2449,
    "upazilaId": 252,
    "nameBn": "লতা",
    "nameEn": ""
  },
  {
    "id": 2450,
    "upazilaId": 252,
    "nameBn": "চরএককরিয়া",
    "nameEn": ""
  },
  {
    "id": 2451,
    "upazilaId": 252,
    "nameBn": "উলানিয়া",
    "nameEn": ""
  },
  {
    "id": 2452,
    "upazilaId": 252,
    "nameBn": "মেহেন্দিগঞ্জ",
    "nameEn": ""
  },
  {
    "id": 2453,
    "upazilaId": 252,
    "nameBn": "বিদ্যানন্দপুর",
    "nameEn": ""
  },
  {
    "id": 2454,
    "upazilaId": 252,
    "nameBn": "ভাষাণচর",
    "nameEn": ""
  },
  {
    "id": 2455,
    "upazilaId": 252,
    "nameBn": "চরগোপালপুর",
    "nameEn": ""
  },
  {
    "id": 2456,
    "upazilaId": 252,
    "nameBn": "জাঙ্গালিয়া",
    "nameEn": ""
  },
  {
    "id": 2457,
    "upazilaId": 252,
    "nameBn": "আলিমাবাদ",
    "nameEn": ""
  },
  {
    "id": 2458,
    "upazilaId": 252,
    "nameBn": "চানপুর",
    "nameEn": ""
  },
  {
    "id": 2459,
    "upazilaId": 252,
    "nameBn": "দড়িরচর খাজুরিয়া",
    "nameEn": ""
  },
  {
    "id": 2460,
    "upazilaId": 252,
    "nameBn": "গোবিন্দপুর",
    "nameEn": ""
  },
  {
    "id": 2461,
    "upazilaId": 252,
    "nameBn": "শ্রীপুর,",
    "nameEn": ""
  },
  {
    "id": 2462,
    "upazilaId": 253,
    "nameBn": "জাহাঙ্গীরনগর",
    "nameEn": ""
  },
  {
    "id": 2463,
    "upazilaId": 253,
    "nameBn": "কেদারপুর",
    "nameEn": ""
  },
  {
    "id": 2464,
    "upazilaId": 253,
    "nameBn": "দেহেরগতি",
    "nameEn": ""
  },
  {
    "id": 2465,
    "upazilaId": 253,
    "nameBn": "চাঁদপাশা",
    "nameEn": ""
  },
  {
    "id": 2466,
    "upazilaId": 253,
    "nameBn": "রহমতপুর",
    "nameEn": ""
  },
  {
    "id": 2467,
    "upazilaId": 253,
    "nameBn": "মাধবপাশা",
    "nameEn": ""
  },
  {
    "id": 2468,
    "upazilaId": 254,
    "nameBn": "বড়জালিয়া",
    "nameEn": ""
  },
  {
    "id": 2469,
    "upazilaId": 254,
    "nameBn": "গুয়াবাড়িয়া",
    "nameEn": ""
  },
  {
    "id": 2470,
    "upazilaId": 254,
    "nameBn": "ধুলখোলা",
    "nameEn": ""
  },
  {
    "id": 2471,
    "upazilaId": 254,
    "nameBn": "হিজলা গৌরাব্দি",
    "nameEn": ""
  },
  {
    "id": 2472,
    "upazilaId": 254,
    "nameBn": "মেমানিয়া",
    "nameEn": ""
  },
  {
    "id": 2473,
    "upazilaId": 254,
    "nameBn": "হরিনাথপুর",
    "nameEn": ""
  },
  {
    "id": 2474,
    "upazilaId": 255,
    "nameBn": "সাতলা",
    "nameEn": ""
  },
  {
    "id": 2475,
    "upazilaId": 255,
    "nameBn": "হারতা",
    "nameEn": ""
  },
  {
    "id": 2476,
    "upazilaId": 255,
    "nameBn": "জল্লা",
    "nameEn": ""
  },
  {
    "id": 2477,
    "upazilaId": 255,
    "nameBn": "ওটরা",
    "nameEn": ""
  },
  {
    "id": 2478,
    "upazilaId": 255,
    "nameBn": "শোলক",
    "nameEn": ""
  },
  {
    "id": 2479,
    "upazilaId": 255,
    "nameBn": "বরাকোঠা",
    "nameEn": ""
  },
  {
    "id": 2480,
    "upazilaId": 255,
    "nameBn": "বামরাইল",
    "nameEn": ""
  },
  {
    "id": 2481,
    "upazilaId": 255,
    "nameBn": "শিকারপুর উজিরপুর",
    "nameEn": ""
  },
  {
    "id": 2482,
    "upazilaId": 255,
    "nameBn": "গুঠিয়া",
    "nameEn": ""
  },
  {
    "id": 2483,
    "upazilaId": 256,
    "nameBn": "চরামদ্দি",
    "nameEn": ""
  },
  {
    "id": 2484,
    "upazilaId": 256,
    "nameBn": "চরাদি",
    "nameEn": ""
  },
  {
    "id": 2485,
    "upazilaId": 256,
    "nameBn": "দাড়িয়াল",
    "nameEn": ""
  },
  {
    "id": 2486,
    "upazilaId": 256,
    "nameBn": "দুধল",
    "nameEn": ""
  },
  {
    "id": 2487,
    "upazilaId": 256,
    "nameBn": "দুর্গাপাশা",
    "nameEn": ""
  },
  {
    "id": 2488,
    "upazilaId": 256,
    "nameBn": "ফরিদপুর",
    "nameEn": ""
  },
  {
    "id": 2489,
    "upazilaId": 256,
    "nameBn": "কবাই",
    "nameEn": ""
  },
  {
    "id": 2490,
    "upazilaId": 256,
    "nameBn": "নলুয়া",
    "nameEn": ""
  },
  {
    "id": 2491,
    "upazilaId": 256,
    "nameBn": "কলসকাঠী",
    "nameEn": ""
  },
  {
    "id": 2492,
    "upazilaId": 256,
    "nameBn": "গারুড়িয়া",
    "nameEn": ""
  },
  {
    "id": 2493,
    "upazilaId": 256,
    "nameBn": "ভরপাশা",
    "nameEn": ""
  },
  {
    "id": 2494,
    "upazilaId": 256,
    "nameBn": "রঙ্গশ্রী",
    "nameEn": ""
  },
  {
    "id": 2495,
    "upazilaId": 256,
    "nameBn": "পাদ্রিশিবপুর",
    "nameEn": ""
  },
  {
    "id": 2496,
    "upazilaId": 256,
    "nameBn": "নিয়ামতি",
    "nameEn": ""
  },
  {
    "id": 2497,
    "upazilaId": 257,
    "nameBn": "রাজিহার",
    "nameEn": ""
  },
  {
    "id": 2498,
    "upazilaId": 257,
    "nameBn": "বাকাল",
    "nameEn": ""
  },
  {
    "id": 2499,
    "upazilaId": 257,
    "nameBn": "বাগধা",
    "nameEn": ""
  },
  {
    "id": 2500,
    "upazilaId": 257,
    "nameBn": "গৈলা",
    "nameEn": ""
  },
  {
    "id": 2501,
    "upazilaId": 257,
    "nameBn": "রত্নপুর",
    "nameEn": ""
  },
  {
    "id": 2502,
    "upazilaId": 258,
    "nameBn": "বিশারকান্দি",
    "nameEn": ""
  },
  {
    "id": 2503,
    "upazilaId": 258,
    "nameBn": "ইলুহার",
    "nameEn": ""
  },
  {
    "id": 2504,
    "upazilaId": 258,
    "nameBn": "সৈয়দকাঠী",
    "nameEn": ""
  },
  {
    "id": 2505,
    "upazilaId": 258,
    "nameBn": "চাখার",
    "nameEn": ""
  },
  {
    "id": 2506,
    "upazilaId": 258,
    "nameBn": "সলিয়াবাকপুর",
    "nameEn": ""
  },
  {
    "id": 2507,
    "upazilaId": 258,
    "nameBn": "বাইশারী",
    "nameEn": ""
  },
  {
    "id": 2508,
    "upazilaId": 258,
    "nameBn": "বানারীপাড়া",
    "nameEn": ""
  },
  {
    "id": 2509,
    "upazilaId": 258,
    "nameBn": "উদয়কাঠী",
    "nameEn": ""
  },
  {
    "id": 2510,
    "upazilaId": 259,
    "nameBn": "রাজাপুর",
    "nameEn": ""
  },
  {
    "id": 2511,
    "upazilaId": 259,
    "nameBn": "ইলিশা",
    "nameEn": ""
  },
  {
    "id": 2512,
    "upazilaId": 259,
    "nameBn": "পশ্চিম ইলিশা",
    "nameEn": ""
  },
  {
    "id": 2513,
    "upazilaId": 259,
    "nameBn": "কাচিয়া",
    "nameEn": ""
  },
  {
    "id": 2514,
    "upazilaId": 259,
    "nameBn": "বাপ্তা",
    "nameEn": ""
  },
  {
    "id": 2515,
    "upazilaId": 259,
    "nameBn": "ধনিয়া",
    "nameEn": ""
  },
  {
    "id": 2516,
    "upazilaId": 259,
    "nameBn": "শিবপুর",
    "nameEn": ""
  },
  {
    "id": 2517,
    "upazilaId": 259,
    "nameBn": "আলীনগর",
    "nameEn": ""
  },
  {
    "id": 2518,
    "upazilaId": 259,
    "nameBn": "চরসামাইয়া",
    "nameEn": ""
  },
  {
    "id": 2519,
    "upazilaId": 259,
    "nameBn": "ভেলুমিয়া",
    "nameEn": ""
  },
  {
    "id": 2520,
    "upazilaId": 259,
    "nameBn": "ভেদুরিয়া",
    "nameEn": ""
  },
  {
    "id": 2521,
    "upazilaId": 259,
    "nameBn": "উত্তর দিঘলদী",
    "nameEn": ""
  },
  {
    "id": 2522,
    "upazilaId": 259,
    "nameBn": "দক্ষিণ দিঘলদী",
    "nameEn": ""
  },
  {
    "id": 2523,
    "upazilaId": 260,
    "nameBn": "গংগাপুর",
    "nameEn": ""
  },
  {
    "id": 2524,
    "upazilaId": 260,
    "nameBn": "সাচড়া",
    "nameEn": ""
  },
  {
    "id": 2525,
    "upazilaId": 260,
    "nameBn": "কাচিয়া",
    "nameEn": ""
  },
  {
    "id": 2526,
    "upazilaId": 260,
    "nameBn": "হাসাননগর",
    "nameEn": ""
  },
  {
    "id": 2527,
    "upazilaId": 260,
    "nameBn": "টবগী",
    "nameEn": ""
  },
  {
    "id": 2528,
    "upazilaId": 260,
    "nameBn": "পক্ষিয়া",
    "nameEn": ""
  },
  {
    "id": 2529,
    "upazilaId": 260,
    "nameBn": "বড় মানিকা",
    "nameEn": ""
  },
  {
    "id": 2530,
    "upazilaId": 260,
    "nameBn": "কুতুবা",
    "nameEn": ""
  },
  {
    "id": 2531,
    "upazilaId": 260,
    "nameBn": "দেউলা",
    "nameEn": ""
  },
  {
    "id": 2532,
    "upazilaId": 261,
    "nameBn": "হাজীপুর",
    "nameEn": ""
  },
  {
    "id": 2533,
    "upazilaId": 261,
    "nameBn": "মদনপুর",
    "nameEn": ""
  },
  {
    "id": 2534,
    "upazilaId": 261,
    "nameBn": "মেদুয়া",
    "nameEn": ""
  },
  {
    "id": 2535,
    "upazilaId": 261,
    "nameBn": "উত্তর জয়নগর",
    "nameEn": ""
  },
  {
    "id": 2536,
    "upazilaId": 261,
    "nameBn": "দক্ষিণ জয়নগর",
    "nameEn": ""
  },
  {
    "id": 2537,
    "upazilaId": 261,
    "nameBn": "চরখলিফা",
    "nameEn": ""
  },
  {
    "id": 2538,
    "upazilaId": 261,
    "nameBn": "সৈয়দপুর",
    "nameEn": ""
  },
  {
    "id": 2539,
    "upazilaId": 261,
    "nameBn": "ভবানীপুর",
    "nameEn": ""
  },
  {
    "id": 2540,
    "upazilaId": 261,
    "nameBn": "চরপাতা",
    "nameEn": ""
  },
  {
    "id": 2541,
    "upazilaId": 262,
    "nameBn": "বদরপুর",
    "nameEn": ""
  },
  {
    "id": 2542,
    "upazilaId": 262,
    "nameBn": "কালমা",
    "nameEn": ""
  },
  {
    "id": 2543,
    "upazilaId": 262,
    "nameBn": "চরভূতা",
    "nameEn": ""
  },
  {
    "id": 2544,
    "upazilaId": 262,
    "nameBn": "লালমোহন",
    "nameEn": ""
  },
  {
    "id": 2545,
    "upazilaId": 262,
    "nameBn": "ফরাজগঞ্জ",
    "nameEn": ""
  },
  {
    "id": 2546,
    "upazilaId": 262,
    "nameBn": "পশ্চিম চরউমেদ",
    "nameEn": ""
  },
  {
    "id": 2547,
    "upazilaId": 262,
    "nameBn": "রমাগঞ্জ",
    "nameEn": ""
  },
  {
    "id": 2548,
    "upazilaId": 262,
    "nameBn": "লর্ড হার্ডিঞ্জ",
    "nameEn": ""
  },
  {
    "id": 2549,
    "upazilaId": 262,
    "nameBn": "ধলী গৌরনগর",
    "nameEn": ""
  },
  {
    "id": 2550,
    "upazilaId": 263,
    "nameBn": "চাঁদপুর",
    "nameEn": ""
  },
  {
    "id": 2551,
    "upazilaId": 263,
    "nameBn": "সোনাপুর",
    "nameEn": ""
  },
  {
    "id": 2552,
    "upazilaId": 263,
    "nameBn": "শম্ভুপুর",
    "nameEn": ""
  },
  {
    "id": 2553,
    "upazilaId": 263,
    "nameBn": "বড় মলংচড়া",
    "nameEn": ""
  },
  {
    "id": 2554,
    "upazilaId": 264,
    "nameBn": "আছলামপুর",
    "nameEn": ""
  },
  {
    "id": 2555,
    "upazilaId": 264,
    "nameBn": "চরমাদ্রাজ",
    "nameEn": ""
  },
  {
    "id": 2556,
    "upazilaId": 264,
    "nameBn": "জিন্নাগড়",
    "nameEn": ""
  },
  {
    "id": 2557,
    "upazilaId": 264,
    "nameBn": "নীলকমল",
    "nameEn": ""
  },
  {
    "id": 2558,
    "upazilaId": 264,
    "nameBn": "নুরাবাদ",
    "nameEn": ""
  },
  {
    "id": 2559,
    "upazilaId": 264,
    "nameBn": "চরকলমী",
    "nameEn": ""
  },
  {
    "id": 2560,
    "upazilaId": 264,
    "nameBn": "চরমানিকা",
    "nameEn": ""
  },
  {
    "id": 2561,
    "upazilaId": 264,
    "nameBn": "হাজারীগঞ্জ",
    "nameEn": ""
  },
  {
    "id": 2562,
    "upazilaId": 264,
    "nameBn": "রসুলপুর",
    "nameEn": ""
  },
  {
    "id": 2563,
    "upazilaId": 264,
    "nameBn": "কুকরী মুকরী",
    "nameEn": ""
  },
  {
    "id": 2564,
    "upazilaId": 264,
    "nameBn": "এওয়াজপুর",
    "nameEn": ""
  },
  {
    "id": 2565,
    "upazilaId": 264,
    "nameBn": "আমিনাবাদ",
    "nameEn": ""
  },
  {
    "id": 2566,
    "upazilaId": 264,
    "nameBn": "জাহানপুর",
    "nameEn": ""
  },
  {
    "id": 2567,
    "upazilaId": 264,
    "nameBn": "আবুবকরপুর",
    "nameEn": ""
  },
  {
    "id": 2568,
    "upazilaId": 264,
    "nameBn": "ওমরপুর",
    "nameEn": ""
  },
  {
    "id": 2569,
    "upazilaId": 264,
    "nameBn": "ওসমানগঞ্জ",
    "nameEn": ""
  },
  {
    "id": 2570,
    "upazilaId": 264,
    "nameBn": "আব্দুল্লাহপুর",
    "nameEn": ""
  },
  {
    "id": 2571,
    "upazilaId": 264,
    "nameBn": "আহম্মদপুর",
    "nameEn": ""
  },
  {
    "id": 2572,
    "upazilaId": 264,
    "nameBn": "নজরুলনগর",
    "nameEn": ""
  },
  {
    "id": 2573,
    "upazilaId": 264,
    "nameBn": "ঢালচর",
    "nameEn": ""
  },
  {
    "id": 2574,
    "upazilaId": 264,
    "nameBn": "মুজিবনগর",
    "nameEn": ""
  },
  {
    "id": 2575,
    "upazilaId": 265,
    "nameBn": "মনপুরা",
    "nameEn": ""
  },
  {
    "id": 2576,
    "upazilaId": 265,
    "nameBn": "হাজিরহাট",
    "nameEn": ""
  },
  {
    "id": 2577,
    "upazilaId": 265,
    "nameBn": "সাকুচিয়া উত্তর",
    "nameEn": ""
  },
  {
    "id": 2578,
    "upazilaId": 265,
    "nameBn": "সাকুচিয়া দক্ষিণ",
    "nameEn": ""
  },
  {
    "id": 2579,
    "upazilaId": 266,
    "nameBn": "গাভা রামচন্দ্রপুর",
    "nameEn": ""
  },
  {
    "id": 2580,
    "upazilaId": 266,
    "nameBn": "বিনয়কাঠি",
    "nameEn": ""
  },
  {
    "id": 2581,
    "upazilaId": 266,
    "nameBn": "নবগ্রাম",
    "nameEn": ""
  },
  {
    "id": 2582,
    "upazilaId": 266,
    "nameBn": "কেওড়া",
    "nameEn": ""
  },
  {
    "id": 2583,
    "upazilaId": 266,
    "nameBn": "কীর্তিপাশা",
    "nameEn": ""
  },
  {
    "id": 2584,
    "upazilaId": 266,
    "nameBn": "বাসণ্ডা",
    "nameEn": ""
  },
  {
    "id": 2585,
    "upazilaId": 266,
    "nameBn": "পোনাবালিয়া",
    "nameEn": ""
  },
  {
    "id": 2586,
    "upazilaId": 266,
    "nameBn": "গাবখান ধানসিঁড়ি",
    "nameEn": ""
  },
  {
    "id": 2587,
    "upazilaId": 266,
    "nameBn": "শেখেরহাট",
    "nameEn": ""
  },
  {
    "id": 2588,
    "upazilaId": 266,
    "nameBn": "নথুল্লাবাদ",
    "nameEn": ""
  },
  {
    "id": 2589,
    "upazilaId": 267,
    "nameBn": "চেঁচরী রামপুর",
    "nameEn": ""
  },
  {
    "id": 2590,
    "upazilaId": 267,
    "nameBn": "পাটিখালঘাটা",
    "nameEn": ""
  },
  {
    "id": 2591,
    "upazilaId": 267,
    "nameBn": "আমুয়া",
    "nameEn": ""
  },
  {
    "id": 2592,
    "upazilaId": 267,
    "nameBn": "কাঁঠালিয়া",
    "nameEn": ""
  },
  {
    "id": 2593,
    "upazilaId": 267,
    "nameBn": "শৌলজালিয়া",
    "nameEn": ""
  },
  {
    "id": 2594,
    "upazilaId": 267,
    "nameBn": "আওরাবুনিয়া",
    "nameEn": ""
  },
  {
    "id": 2595,
    "upazilaId": 268,
    "nameBn": "ভৈরবপাশা",
    "nameEn": ""
  },
  {
    "id": 2596,
    "upazilaId": 268,
    "nameBn": "মগর",
    "nameEn": ""
  },
  {
    "id": 2597,
    "upazilaId": 268,
    "nameBn": "কুলকাঠি",
    "nameEn": ""
  },
  {
    "id": 2598,
    "upazilaId": 268,
    "nameBn": "রানাপাশা",
    "nameEn": ""
  },
  {
    "id": 2599,
    "upazilaId": 268,
    "nameBn": "সুবিদপুর",
    "nameEn": ""
  },
  {
    "id": 2600,
    "upazilaId": 268,
    "nameBn": "কুশঙ্গল",
    "nameEn": ""
  },
  {
    "id": 2601,
    "upazilaId": 268,
    "nameBn": "সিদ্ধকাঠি",
    "nameEn": ""
  },
  {
    "id": 2602,
    "upazilaId": 268,
    "nameBn": "দপদপিয়া",
    "nameEn": ""
  },
  {
    "id": 2603,
    "upazilaId": 268,
    "nameBn": "নাচনমহল",
    "nameEn": ""
  },
  {
    "id": 2604,
    "upazilaId": 268,
    "nameBn": "মোল্লারহাট",
    "nameEn": ""
  },
  {
    "id": 2605,
    "upazilaId": 269,
    "nameBn": "সাতুরিয়া",
    "nameEn": ""
  },
  {
    "id": 2606,
    "upazilaId": 269,
    "nameBn": "শুক্তাগড়",
    "nameEn": ""
  },
  {
    "id": 2607,
    "upazilaId": 269,
    "nameBn": "রাজাপুর",
    "nameEn": ""
  },
  {
    "id": 2608,
    "upazilaId": 269,
    "nameBn": "গালুয়া",
    "nameEn": ""
  },
  {
    "id": 2609,
    "upazilaId": 269,
    "nameBn": "বড়ইয়া",
    "nameEn": ""
  },
  {
    "id": 2610,
    "upazilaId": 269,
    "nameBn": "মঠবাড়ী",
    "nameEn": ""
  },
  {
    "id": 2611,
    "upazilaId": 270,
    "nameBn": "আউলিয়াপুর",
    "nameEn": ""
  },
  {
    "id": 2612,
    "upazilaId": 270,
    "nameBn": "ইটবাড়িয়া",
    "nameEn": ""
  },
  {
    "id": 2613,
    "upazilaId": 270,
    "nameBn": "কমলাপুর",
    "nameEn": ""
  },
  {
    "id": 2614,
    "upazilaId": 270,
    "nameBn": "কালিকাপুর",
    "nameEn": ""
  },
  {
    "id": 2615,
    "upazilaId": 270,
    "nameBn": "ছোট বিঘাই",
    "nameEn": ""
  },
  {
    "id": 2616,
    "upazilaId": 270,
    "nameBn": "জৈনকাঠি",
    "nameEn": ""
  },
  {
    "id": 2617,
    "upazilaId": 270,
    "nameBn": "বদরপুর",
    "nameEn": ""
  },
  {
    "id": 2618,
    "upazilaId": 270,
    "nameBn": "বড় বিঘাই",
    "nameEn": ""
  },
  {
    "id": 2619,
    "upazilaId": 270,
    "nameBn": "মরিচবুনিয়া",
    "nameEn": ""
  },
  {
    "id": 2620,
    "upazilaId": 270,
    "nameBn": "মাদারবুনিয়া",
    "nameEn": ""
  },
  {
    "id": 2621,
    "upazilaId": 270,
    "nameBn": "লাউকাঠি",
    "nameEn": ""
  },
  {
    "id": 2622,
    "upazilaId": 270,
    "nameBn": "লোহালিয়া",
    "nameEn": ""
  },
  {
    "id": 2623,
    "upazilaId": 271,
    "nameBn": "আংগারিয়া",
    "nameEn": ""
  },
  {
    "id": 2624,
    "upazilaId": 271,
    "nameBn": "পাংগাশিয়া",
    "nameEn": ""
  },
  {
    "id": 2625,
    "upazilaId": 271,
    "nameBn": "মুরাদিয়া",
    "nameEn": ""
  },
  {
    "id": 2626,
    "upazilaId": 271,
    "nameBn": "লেবুখালী",
    "nameEn": ""
  },
  {
    "id": 2627,
    "upazilaId": 271,
    "nameBn": "শ্রীরামপুর",
    "nameEn": ""
  },
  {
    "id": 2628,
    "upazilaId": 272,
    "nameBn": "আমড়াগাছিয়া",
    "nameEn": ""
  },
  {
    "id": 2629,
    "upazilaId": 272,
    "nameBn": "কাঁকড়াবুনিয়া",
    "nameEn": ""
  },
  {
    "id": 2630,
    "upazilaId": 272,
    "nameBn": "দেউলী সুবিদখালী",
    "nameEn": ""
  },
  {
    "id": 2631,
    "upazilaId": 272,
    "nameBn": "মজিদবাড়িয়া",
    "nameEn": ""
  },
  {
    "id": 2632,
    "upazilaId": 272,
    "nameBn": "মাধবখালী",
    "nameEn": ""
  },
  {
    "id": 2633,
    "upazilaId": 272,
    "nameBn": "মির্জাগঞ্জ",
    "nameEn": ""
  },
  {
    "id": 2634,
    "upazilaId": 273,
    "nameBn": "আলীপুর",
    "nameEn": ""
  },
  {
    "id": 2635,
    "upazilaId": 273,
    "nameBn": "চর বোরহান",
    "nameEn": ""
  },
  {
    "id": 2636,
    "upazilaId": 273,
    "nameBn": "দশমিনা",
    "nameEn": ""
  },
  {
    "id": 2637,
    "upazilaId": 273,
    "nameBn": "বহরমপুর",
    "nameEn": ""
  },
  {
    "id": 2638,
    "upazilaId": 273,
    "nameBn": "বাঁশবাড়িয়া",
    "nameEn": ""
  },
  {
    "id": 2639,
    "upazilaId": 273,
    "nameBn": "বেতাগী সানকিপুর",
    "nameEn": ""
  },
  {
    "id": 2640,
    "upazilaId": 273,
    "nameBn": "রণগোপালদী",
    "nameEn": ""
  },
  {
    "id": 2641,
    "upazilaId": 274,
    "nameBn": "আদাবাড়িয়া",
    "nameEn": ""
  },
  {
    "id": 2642,
    "upazilaId": 274,
    "nameBn": "কনকদিয়া",
    "nameEn": ""
  },
  {
    "id": 2643,
    "upazilaId": 274,
    "nameBn": "কাছিপাড়া",
    "nameEn": ""
  },
  {
    "id": 2644,
    "upazilaId": 274,
    "nameBn": "কালাইয়া",
    "nameEn": ""
  },
  {
    "id": 2645,
    "upazilaId": 274,
    "nameBn": "কালিশুরী",
    "nameEn": ""
  },
  {
    "id": 2646,
    "upazilaId": 274,
    "nameBn": "কেশবপুর",
    "nameEn": ""
  },
  {
    "id": 2647,
    "upazilaId": 274,
    "nameBn": "চন্দ্রদ্বীপ",
    "nameEn": ""
  },
  {
    "id": 2648,
    "upazilaId": 274,
    "nameBn": "দাশপাড়া",
    "nameEn": ""
  },
  {
    "id": 2649,
    "upazilaId": 274,
    "nameBn": "ধুলিয়া",
    "nameEn": ""
  },
  {
    "id": 2650,
    "upazilaId": 274,
    "nameBn": "নওমালা",
    "nameEn": ""
  },
  {
    "id": 2651,
    "upazilaId": 274,
    "nameBn": "নাজিরপুর",
    "nameEn": ""
  },
  {
    "id": 2652,
    "upazilaId": 274,
    "nameBn": "বগা",
    "nameEn": ""
  },
  {
    "id": 2653,
    "upazilaId": 274,
    "nameBn": "বাউফল",
    "nameEn": ""
  },
  {
    "id": 2654,
    "upazilaId": 274,
    "nameBn": "মদনপুরা",
    "nameEn": ""
  },
  {
    "id": 2655,
    "upazilaId": 274,
    "nameBn": "সূর্য্যমনি",
    "nameEn": ""
  },
  {
    "id": 2656,
    "upazilaId": 275,
    "nameBn": "চম্পাপুর",
    "nameEn": ""
  },
  {
    "id": 2657,
    "upazilaId": 275,
    "nameBn": "চাকামইয়া",
    "nameEn": ""
  },
  {
    "id": 2658,
    "upazilaId": 275,
    "nameBn": "টিয়াখালী,ধানখালী",
    "nameEn": ""
  },
  {
    "id": 2659,
    "upazilaId": 275,
    "nameBn": "নীলগঞ্জ",
    "nameEn": ""
  },
  {
    "id": 2660,
    "upazilaId": 275,
    "nameBn": "বালিয়াতলী",
    "nameEn": ""
  },
  {
    "id": 2661,
    "upazilaId": 275,
    "nameBn": "মিঠাগঞ্জ",
    "nameEn": ""
  },
  {
    "id": 2662,
    "upazilaId": 275,
    "nameBn": "লালুয়া",
    "nameEn": ""
  },
  {
    "id": 2663,
    "upazilaId": 275,
    "nameBn": "ডালবুগঞ্জ",
    "nameEn": ""
  },
  {
    "id": 2664,
    "upazilaId": 275,
    "nameBn": "ধুলাসার",
    "nameEn": ""
  },
  {
    "id": 2665,
    "upazilaId": 275,
    "nameBn": "মহিপুর",
    "nameEn": ""
  },
  {
    "id": 2666,
    "upazilaId": 275,
    "nameBn": "লতাচাপলী",
    "nameEn": ""
  },
  {
    "id": 2667,
    "upazilaId": 276,
    "nameBn": "আমখোলা",
    "nameEn": ""
  },
  {
    "id": 2668,
    "upazilaId": 276,
    "nameBn": "কলাগাছিয়া",
    "nameEn": ""
  },
  {
    "id": 2669,
    "upazilaId": 276,
    "nameBn": "গজালিয়া",
    "nameEn": ""
  },
  {
    "id": 2670,
    "upazilaId": 276,
    "nameBn": "গলাচিপা",
    "nameEn": ""
  },
  {
    "id": 2671,
    "upazilaId": 276,
    "nameBn": "গোলখালী",
    "nameEn": ""
  },
  {
    "id": 2672,
    "upazilaId": 276,
    "nameBn": "চর কাজল",
    "nameEn": ""
  },
  {
    "id": 2673,
    "upazilaId": 276,
    "nameBn": "চর বিশ্বাস",
    "nameEn": ""
  },
  {
    "id": 2674,
    "upazilaId": 276,
    "nameBn": "চিকনিকান্দি",
    "nameEn": ""
  },
  {
    "id": 2675,
    "upazilaId": 276,
    "nameBn": "ডাকুয়া",
    "nameEn": ""
  },
  {
    "id": 2676,
    "upazilaId": 276,
    "nameBn": "পানপট্টি",
    "nameEn": ""
  },
  {
    "id": 2677,
    "upazilaId": 276,
    "nameBn": "বকুলবাড়িয়া",
    "nameEn": ""
  },
  {
    "id": 2678,
    "upazilaId": 276,
    "nameBn": "রতনদী তালতলী",
    "nameEn": ""
  },
  {
    "id": 2679,
    "upazilaId": 277,
    "nameBn": "রাঙ্গাবালী",
    "nameEn": ""
  },
  {
    "id": 2680,
    "upazilaId": 277,
    "nameBn": "ছোট বাইশদিয়া",
    "nameEn": ""
  },
  {
    "id": 2681,
    "upazilaId": 277,
    "nameBn": "বড় বাইশদিয়া",
    "nameEn": ""
  },
  {
    "id": 2682,
    "upazilaId": 277,
    "nameBn": "চালিতাবুনিয়া",
    "nameEn": ""
  },
  {
    "id": 2683,
    "upazilaId": 277,
    "nameBn": "চর মোন্তাজ",
    "nameEn": ""
  },
  {
    "id": 2684,
    "upazilaId": 278,
    "nameBn": "ভিটাবাড়িয়া",
    "nameEn": ""
  },
  {
    "id": 2685,
    "upazilaId": 278,
    "nameBn": "নদমূলা শিয়ালকাঠী",
    "nameEn": ""
  },
  {
    "id": 2686,
    "upazilaId": 278,
    "nameBn": "তেলিখালী",
    "nameEn": ""
  },
  {
    "id": 2687,
    "upazilaId": 278,
    "nameBn": "ইকড়ী",
    "nameEn": ""
  },
  {
    "id": 2688,
    "upazilaId": 278,
    "nameBn": "ধাওয়া",
    "nameEn": ""
  },
  {
    "id": 2689,
    "upazilaId": 278,
    "nameBn": "ভাণ্ডারিয়া সদর",
    "nameEn": ""
  },
  {
    "id": 2690,
    "upazilaId": 278,
    "nameBn": "গৌরীপুর",
    "nameEn": ""
  },
  {
    "id": 2691,
    "upazilaId": 108,
    "nameBn": "সয়না রঘুনাথপুর",
    "nameEn": ""
  },
  {
    "id": 2692,
    "upazilaId": 108,
    "nameBn": "আমড়াজুড়ি",
    "nameEn": ""
  },
  {
    "id": 2693,
    "upazilaId": 108,
    "nameBn": "কাউখালী সদর",
    "nameEn": ""
  },
  {
    "id": 2694,
    "upazilaId": 108,
    "nameBn": "চিরাপাড়া",
    "nameEn": ""
  },
  {
    "id": 2695,
    "upazilaId": 108,
    "nameBn": "শিয়ালকাঠী",
    "nameEn": ""
  },
  {
    "id": 2696,
    "upazilaId": 279,
    "nameBn": "তুষখালী",
    "nameEn": ""
  },
  {
    "id": 2697,
    "upazilaId": 279,
    "nameBn": "ধানীসাফা",
    "nameEn": ""
  },
  {
    "id": 2698,
    "upazilaId": 279,
    "nameBn": "মিরুখালী",
    "nameEn": ""
  },
  {
    "id": 2699,
    "upazilaId": 279,
    "nameBn": "দাউদখালী",
    "nameEn": ""
  },
  {
    "id": 2700,
    "upazilaId": 279,
    "nameBn": "মঠবাড়িয়া",
    "nameEn": ""
  },
  {
    "id": 2701,
    "upazilaId": 279,
    "nameBn": "টিকিকাটা",
    "nameEn": ""
  },
  {
    "id": 2702,
    "upazilaId": 279,
    "nameBn": "বেতমোর রাজপাড়া",
    "nameEn": ""
  },
  {
    "id": 2703,
    "upazilaId": 279,
    "nameBn": "আমড়াগাছিয়া",
    "nameEn": ""
  },
  {
    "id": 2704,
    "upazilaId": 279,
    "nameBn": "শাপলেজা",
    "nameEn": ""
  },
  {
    "id": 2705,
    "upazilaId": 279,
    "nameBn": "হলতা গুলিশাখালী",
    "nameEn": ""
  },
  {
    "id": 2706,
    "upazilaId": 279,
    "nameBn": "বড় মাছুয়া",
    "nameEn": ""
  },
  {
    "id": 2707,
    "upazilaId": 280,
    "nameBn": "মাটিভাঙ্গা",
    "nameEn": ""
  },
  {
    "id": 2708,
    "upazilaId": 280,
    "nameBn": "মালিখালী",
    "nameEn": ""
  },
  {
    "id": 2709,
    "upazilaId": 280,
    "nameBn": "দেউলবাড়ী দোবড়া",
    "nameEn": ""
  },
  {
    "id": 2710,
    "upazilaId": 280,
    "nameBn": "দীর্ঘা",
    "nameEn": ""
  },
  {
    "id": 2711,
    "upazilaId": 280,
    "nameBn": "শাখারীকাঠী",
    "nameEn": ""
  },
  {
    "id": 2712,
    "upazilaId": 280,
    "nameBn": "নাজিরপুর সদর",
    "nameEn": ""
  },
  {
    "id": 2713,
    "upazilaId": 280,
    "nameBn": "সেখমাটিয়া",
    "nameEn": ""
  },
  {
    "id": 2714,
    "upazilaId": 280,
    "nameBn": "শ্রীরামকাঠী",
    "nameEn": ""
  },
  {
    "id": 2715,
    "upazilaId": 280,
    "nameBn": "কলারদোয়ানিয়া",
    "nameEn": ""
  },
  {
    "id": 2716,
    "upazilaId": 281,
    "nameBn": "শিকদার মল্লিক",
    "nameEn": ""
  },
  {
    "id": 2717,
    "upazilaId": 281,
    "nameBn": "কদমতলা",
    "nameEn": ""
  },
  {
    "id": 2718,
    "upazilaId": 281,
    "nameBn": "দুর্গাপুর",
    "nameEn": ""
  },
  {
    "id": 2719,
    "upazilaId": 281,
    "nameBn": "কলাখালী",
    "nameEn": ""
  },
  {
    "id": 2720,
    "upazilaId": 281,
    "nameBn": "টোনা",
    "nameEn": ""
  },
  {
    "id": 2721,
    "upazilaId": 281,
    "nameBn": "শরিকতলা",
    "nameEn": ""
  },
  {
    "id": 2722,
    "upazilaId": 281,
    "nameBn": "শংকরপাশা",
    "nameEn": ""
  },
  {
    "id": 2723,
    "upazilaId": 282,
    "nameBn": "বলদিয়া",
    "nameEn": ""
  },
  {
    "id": 2724,
    "upazilaId": 282,
    "nameBn": "সোহাগদল",
    "nameEn": ""
  },
  {
    "id": 2725,
    "upazilaId": 282,
    "nameBn": "স্বরূপকাঠী",
    "nameEn": ""
  },
  {
    "id": 2726,
    "upazilaId": 282,
    "nameBn": "আটঘর কুড়িয়ানা",
    "nameEn": ""
  },
  {
    "id": 2727,
    "upazilaId": 282,
    "nameBn": "জলাবাড়ী",
    "nameEn": ""
  },
  {
    "id": 2728,
    "upazilaId": 282,
    "nameBn": "দৈহারী",
    "nameEn": ""
  },
  {
    "id": 2729,
    "upazilaId": 282,
    "nameBn": "গুয়ারেখা",
    "nameEn": ""
  },
  {
    "id": 2730,
    "upazilaId": 282,
    "nameBn": "সমুদয়কাঠী",
    "nameEn": ""
  },
  {
    "id": 2731,
    "upazilaId": 282,
    "nameBn": "সুটিয়াকাঠী",
    "nameEn": ""
  },
  {
    "id": 2732,
    "upazilaId": 282,
    "nameBn": "সারেংকাঠী",
    "nameEn": ""
  },
  {
    "id": 2733,
    "upazilaId": 283,
    "nameBn": "পাড়েরহাট",
    "nameEn": ""
  },
  {
    "id": 2734,
    "upazilaId": 283,
    "nameBn": "পত্তাশি",
    "nameEn": ""
  },
  {
    "id": 2735,
    "upazilaId": 283,
    "nameBn": "বালিপাড়া",
    "nameEn": ""
  },
  {
    "id": 2736,
    "upazilaId": 284,
    "nameBn": "আয়লা পাতাকাটা",
    "nameEn": ""
  },
  {
    "id": 2737,
    "upazilaId": 284,
    "nameBn": "এম বালিয়াতলী",
    "nameEn": ""
  },
  {
    "id": 2738,
    "upazilaId": 284,
    "nameBn": "কেওড়াবুনিয়া",
    "nameEn": ""
  },
  {
    "id": 2739,
    "upazilaId": 284,
    "nameBn": "গৌরিচন্না",
    "nameEn": ""
  },
  {
    "id": 2740,
    "upazilaId": 284,
    "nameBn": "ঢলুয়া",
    "nameEn": ""
  },
  {
    "id": 2741,
    "upazilaId": 284,
    "nameBn": "নলটোনা",
    "nameEn": ""
  },
  {
    "id": 2742,
    "upazilaId": 284,
    "nameBn": "ফুলঝুড়ি",
    "nameEn": ""
  },
  {
    "id": 2743,
    "upazilaId": 284,
    "nameBn": "বদরখালী",
    "nameEn": ""
  },
  {
    "id": 2744,
    "upazilaId": 284,
    "nameBn": "বরগুনা সদর",
    "nameEn": ""
  },
  {
    "id": 2745,
    "upazilaId": 284,
    "nameBn": "বরগুনা",
    "nameEn": ""
  },
  {
    "id": 2746,
    "upazilaId": 284,
    "nameBn": "বুড়িরচর",
    "nameEn": ""
  },
  {
    "id": 2747,
    "upazilaId": 285,
    "nameBn": "আমতলী",
    "nameEn": ""
  },
  {
    "id": 2748,
    "upazilaId": 285,
    "nameBn": "আঠারগাছিয়া",
    "nameEn": ""
  },
  {
    "id": 2749,
    "upazilaId": 285,
    "nameBn": "আড়পাঙ্গাশিয়া",
    "nameEn": ""
  },
  {
    "id": 2750,
    "upazilaId": 285,
    "nameBn": "কুকুয়া",
    "nameEn": ""
  },
  {
    "id": 2751,
    "upazilaId": 285,
    "nameBn": "গুলিশাখালী",
    "nameEn": ""
  },
  {
    "id": 2752,
    "upazilaId": 285,
    "nameBn": "চাওড়া",
    "nameEn": ""
  },
  {
    "id": 2753,
    "upazilaId": 285,
    "nameBn": "হলদিয়া",
    "nameEn": ""
  },
  {
    "id": 2754,
    "upazilaId": 286,
    "nameBn": "কাজিরাবাদ",
    "nameEn": ""
  },
  {
    "id": 2755,
    "upazilaId": 286,
    "nameBn": "বিবিচিনি",
    "nameEn": ""
  },
  {
    "id": 2756,
    "upazilaId": 286,
    "nameBn": "বুড়া মজুমদার",
    "nameEn": ""
  },
  {
    "id": 2757,
    "upazilaId": 286,
    "nameBn": "বেতাগী",
    "nameEn": ""
  },
  {
    "id": 2758,
    "upazilaId": 286,
    "nameBn": "মোকামিয়া",
    "nameEn": ""
  },
  {
    "id": 2759,
    "upazilaId": 286,
    "nameBn": "সরিষামুড়ি",
    "nameEn": ""
  },
  {
    "id": 2760,
    "upazilaId": 286,
    "nameBn": "হোসনাবাদ",
    "nameEn": ""
  },
  {
    "id": 2761,
    "upazilaId": 287,
    "nameBn": "ডৌয়াতলা",
    "nameEn": ""
  },
  {
    "id": 2762,
    "upazilaId": 287,
    "nameBn": "বামনা",
    "nameEn": ""
  },
  {
    "id": 2763,
    "upazilaId": 287,
    "nameBn": "বুকাবুনিয়া",
    "nameEn": ""
  },
  {
    "id": 2764,
    "upazilaId": 287,
    "nameBn": "রামনা",
    "nameEn": ""
  },
  {
    "id": 2765,
    "upazilaId": 288,
    "nameBn": "কাকচিড়া",
    "nameEn": ""
  },
  {
    "id": 2766,
    "upazilaId": 288,
    "nameBn": "কাঁঠালতলী",
    "nameEn": ""
  },
  {
    "id": 2767,
    "upazilaId": 288,
    "nameBn": "কালমেঘা",
    "nameEn": ""
  },
  {
    "id": 2768,
    "upazilaId": 288,
    "nameBn": "চর দুয়ানী",
    "nameEn": ""
  },
  {
    "id": 2769,
    "upazilaId": 288,
    "nameBn": "নাচনাপাড়া",
    "nameEn": ""
  },
  {
    "id": 2770,
    "upazilaId": 288,
    "nameBn": "পাথরঘাটা",
    "nameEn": ""
  },
  {
    "id": 2771,
    "upazilaId": 288,
    "nameBn": "রায়হানপুর",
    "nameEn": ""
  },
  {
    "id": 2772,
    "upazilaId": 289,
    "nameBn": "কড়ইবাড়িয়া",
    "nameEn": ""
  },
  {
    "id": 2773,
    "upazilaId": 289,
    "nameBn": "ছোট বগি",
    "nameEn": ""
  },
  {
    "id": 2774,
    "upazilaId": 289,
    "nameBn": "নিশানবাড়িয়া",
    "nameEn": ""
  },
  {
    "id": 2775,
    "upazilaId": 289,
    "nameBn": "পঁচা কোড়ালিয়া",
    "nameEn": ""
  },
  {
    "id": 2776,
    "upazilaId": 289,
    "nameBn": "বড় বগি",
    "nameEn": ""
  },
  {
    "id": 2777,
    "upazilaId": 289,
    "nameBn": "শারিকখালী",
    "nameEn": ""
  },
  {
    "id": 2778,
    "upazilaId": 289,
    "nameBn": "সোনাকাটা",
    "nameEn": ""
  },
  {
    "id": 2779,
    "upazilaId": 290,
    "nameBn": "ধানীখোলা",
    "nameEn": ""
  },
  {
    "id": 2780,
    "upazilaId": 290,
    "nameBn": "বৈলর",
    "nameEn": ""
  },
  {
    "id": 2781,
    "upazilaId": 290,
    "nameBn": "কাঁঠাল",
    "nameEn": ""
  },
  {
    "id": 2782,
    "upazilaId": 290,
    "nameBn": "কানিহারী",
    "nameEn": ""
  },
  {
    "id": 2783,
    "upazilaId": 290,
    "nameBn": "রামপুর",
    "nameEn": ""
  },
  {
    "id": 2784,
    "upazilaId": 290,
    "nameBn": "ত্রিশাল",
    "nameEn": ""
  },
  {
    "id": 2785,
    "upazilaId": 290,
    "nameBn": "হরিরামপুর",
    "nameEn": ""
  },
  {
    "id": 2786,
    "upazilaId": 290,
    "nameBn": "সাখুয়া",
    "nameEn": ""
  },
  {
    "id": 2787,
    "upazilaId": 290,
    "nameBn": "বালিপাড়া",
    "nameEn": ""
  },
  {
    "id": 2788,
    "upazilaId": 290,
    "nameBn": "মঠবাড়ী",
    "nameEn": ""
  },
  {
    "id": 2789,
    "upazilaId": 290,
    "nameBn": "মোক্ষপুর",
    "nameEn": ""
  },
  {
    "id": 2790,
    "upazilaId": 290,
    "nameBn": "আমিরাবাড়ী",
    "nameEn": ""
  },
  {
    "id": 2791,
    "upazilaId": 291,
    "nameBn": "অষ্টধার",
    "nameEn": ""
  },
  {
    "id": 2792,
    "upazilaId": 291,
    "nameBn": "কুষ্টিয়া",
    "nameEn": ""
  },
  {
    "id": 2793,
    "upazilaId": 291,
    "nameBn": "বোররচর",
    "nameEn": ""
  },
  {
    "id": 2794,
    "upazilaId": 291,
    "nameBn": "পরাণগঞ্জ",
    "nameEn": ""
  },
  {
    "id": 2795,
    "upazilaId": 291,
    "nameBn": "চর ঈশ্বরদিয়া",
    "nameEn": ""
  },
  {
    "id": 2796,
    "upazilaId": 291,
    "nameBn": "চর নিলক্ষিয়া",
    "nameEn": ""
  },
  {
    "id": 2797,
    "upazilaId": 291,
    "nameBn": "আকুয়া (বিলুপ্ত)",
    "nameEn": ""
  },
  {
    "id": 2798,
    "upazilaId": 291,
    "nameBn": "খাগডহর",
    "nameEn": ""
  },
  {
    "id": 2799,
    "upazilaId": 291,
    "nameBn": "দাপুনিয়া",
    "nameEn": ""
  },
  {
    "id": 2800,
    "upazilaId": 291,
    "nameBn": "ঘাগড়া",
    "nameEn": ""
  },
  {
    "id": 2801,
    "upazilaId": 291,
    "nameBn": "ভাবখালী",
    "nameEn": ""
  },
  {
    "id": 2802,
    "upazilaId": 291,
    "nameBn": "বয়ড়া (বিলুপ্ত)",
    "nameEn": ""
  },
  {
    "id": 2803,
    "upazilaId": 291,
    "nameBn": "সিরতা",
    "nameEn": ""
  },
  {
    "id": 2804,
    "upazilaId": 292,
    "nameBn": "আঠারবাড়ী",
    "nameEn": ""
  },
  {
    "id": 2805,
    "upazilaId": 292,
    "nameBn": "ঈশ্বরগঞ্জ",
    "nameEn": ""
  },
  {
    "id": 2806,
    "upazilaId": 292,
    "nameBn": "উচাখিলা",
    "nameEn": ""
  },
  {
    "id": 2807,
    "upazilaId": 292,
    "nameBn": "জাটিয়া",
    "nameEn": ""
  },
  {
    "id": 2808,
    "upazilaId": 292,
    "nameBn": "তারুন্দিয়া",
    "nameEn": ""
  },
  {
    "id": 2809,
    "upazilaId": 292,
    "nameBn": "বড়হিত",
    "nameEn": ""
  },
  {
    "id": 2810,
    "upazilaId": 292,
    "nameBn": "মগটুলা",
    "nameEn": ""
  },
  {
    "id": 2811,
    "upazilaId": 292,
    "nameBn": "মাইজবাগ",
    "nameEn": ""
  },
  {
    "id": 2812,
    "upazilaId": 292,
    "nameBn": "রাজিবপুর",
    "nameEn": ""
  },
  {
    "id": 2813,
    "upazilaId": 292,
    "nameBn": "সরিষা",
    "nameEn": ""
  },
  {
    "id": 2814,
    "upazilaId": 292,
    "nameBn": "সোহাগী",
    "nameEn": ""
  },
  {
    "id": 2815,
    "upazilaId": 293,
    "nameBn": "রসুলপুর",
    "nameEn": ""
  },
  {
    "id": 2816,
    "upazilaId": 293,
    "nameBn": "বারবাড়িয়া",
    "nameEn": ""
  },
  {
    "id": 2817,
    "upazilaId": 293,
    "nameBn": "চরআলগী",
    "nameEn": ""
  },
  {
    "id": 2818,
    "upazilaId": 293,
    "nameBn": "রাওনা",
    "nameEn": ""
  },
  {
    "id": 2819,
    "upazilaId": 293,
    "nameBn": "যশরা",
    "nameEn": ""
  },
  {
    "id": 2820,
    "upazilaId": 293,
    "nameBn": "সালটিয়া",
    "nameEn": ""
  },
  {
    "id": 2821,
    "upazilaId": 293,
    "nameBn": "গফরগাঁও",
    "nameEn": ""
  },
  {
    "id": 2822,
    "upazilaId": 293,
    "nameBn": "মশাখালী",
    "nameEn": ""
  },
  {
    "id": 2823,
    "upazilaId": 293,
    "nameBn": "উস্থি",
    "nameEn": ""
  },
  {
    "id": 2824,
    "upazilaId": 293,
    "nameBn": "পাইথল",
    "nameEn": ""
  },
  {
    "id": 2825,
    "upazilaId": 293,
    "nameBn": "পাঁচবাগ",
    "nameEn": ""
  },
  {
    "id": 2826,
    "upazilaId": 293,
    "nameBn": "লংগাইর",
    "nameEn": ""
  },
  {
    "id": 2827,
    "upazilaId": 293,
    "nameBn": "দত্তেরবাজার",
    "nameEn": ""
  },
  {
    "id": 2828,
    "upazilaId": 293,
    "nameBn": "নিগুয়ারী",
    "nameEn": ""
  },
  {
    "id": 2829,
    "upazilaId": 293,
    "nameBn": "টাংগাব",
    "nameEn": ""
  },
  {
    "id": 2830,
    "upazilaId": 294,
    "nameBn": "মইলাকান্দা",
    "nameEn": ""
  },
  {
    "id": 2831,
    "upazilaId": 294,
    "nameBn": "গৌরীপুর",
    "nameEn": ""
  },
  {
    "id": 2832,
    "upazilaId": 294,
    "nameBn": "অচিন্তপুর",
    "nameEn": ""
  },
  {
    "id": 2833,
    "upazilaId": 294,
    "nameBn": "মাওহা",
    "nameEn": ""
  },
  {
    "id": 2834,
    "upazilaId": 294,
    "nameBn": "সহনাটি",
    "nameEn": ""
  },
  {
    "id": 2835,
    "upazilaId": 294,
    "nameBn": "বোকাইনগর",
    "nameEn": ""
  },
  {
    "id": 2836,
    "upazilaId": 294,
    "nameBn": "রামগোপালপুর",
    "nameEn": ""
  },
  {
    "id": 2837,
    "upazilaId": 294,
    "nameBn": "ডৌহাখলা",
    "nameEn": ""
  },
  {
    "id": 2838,
    "upazilaId": 294,
    "nameBn": "ভাংনামারী",
    "nameEn": ""
  },
  {
    "id": 2839,
    "upazilaId": 294,
    "nameBn": "সিধলা",
    "nameEn": ""
  },
  {
    "id": 2840,
    "upazilaId": 295,
    "nameBn": "বানিহালা",
    "nameEn": ""
  },
  {
    "id": 2841,
    "upazilaId": 295,
    "nameBn": "কাকনী",
    "nameEn": ""
  },
  {
    "id": 2842,
    "upazilaId": 295,
    "nameBn": "তারাকান্দা",
    "nameEn": ""
  },
  {
    "id": 2843,
    "upazilaId": 295,
    "nameBn": "গালাগাঁও",
    "nameEn": ""
  },
  {
    "id": 2844,
    "upazilaId": 295,
    "nameBn": "বালিখা",
    "nameEn": ""
  },
  {
    "id": 2845,
    "upazilaId": 295,
    "nameBn": "কামারগাঁও",
    "nameEn": ""
  },
  {
    "id": 2846,
    "upazilaId": 295,
    "nameBn": "কামারিয়া",
    "nameEn": ""
  },
  {
    "id": 2847,
    "upazilaId": 295,
    "nameBn": "ঢাকুয়া",
    "nameEn": ""
  },
  {
    "id": 2848,
    "upazilaId": 295,
    "nameBn": "রামপুর",
    "nameEn": ""
  },
  {
    "id": 2849,
    "upazilaId": 295,
    "nameBn": "বিসকা",
    "nameEn": ""
  },
  {
    "id": 2850,
    "upazilaId": 296,
    "nameBn": "দক্ষিণ মাইজপাড়া",
    "nameEn": ""
  },
  {
    "id": 2851,
    "upazilaId": 296,
    "nameBn": "গামারিতলা",
    "nameEn": ""
  },
  {
    "id": 2852,
    "upazilaId": 296,
    "nameBn": "ধোবাউড়া",
    "nameEn": ""
  },
  {
    "id": 2853,
    "upazilaId": 296,
    "nameBn": "পোড়াকান্দুলিয়া",
    "nameEn": ""
  },
  {
    "id": 2854,
    "upazilaId": 296,
    "nameBn": "গোয়াতলা",
    "nameEn": ""
  },
  {
    "id": 2855,
    "upazilaId": 296,
    "nameBn": "ঘোষগাঁও",
    "nameEn": ""
  },
  {
    "id": 2856,
    "upazilaId": 296,
    "nameBn": "বাঘবেড়",
    "nameEn": ""
  },
  {
    "id": 2857,
    "upazilaId": 297,
    "nameBn": "বীর বেতাগৈর",
    "nameEn": ""
  },
  {
    "id": 2858,
    "upazilaId": 297,
    "nameBn": "মোয়াজ্জেমপুর",
    "nameEn": ""
  },
  {
    "id": 2859,
    "upazilaId": 297,
    "nameBn": "নান্দাইল",
    "nameEn": ""
  },
  {
    "id": 2860,
    "upazilaId": 297,
    "nameBn": "চণ্ডীপাশা",
    "nameEn": ""
  },
  {
    "id": 2861,
    "upazilaId": 297,
    "nameBn": "গাংগাইল",
    "nameEn": ""
  },
  {
    "id": 2862,
    "upazilaId": 297,
    "nameBn": "রাজগাতী",
    "nameEn": ""
  },
  {
    "id": 2863,
    "upazilaId": 297,
    "nameBn": "মুশুল্লী",
    "nameEn": ""
  },
  {
    "id": 2864,
    "upazilaId": 297,
    "nameBn": "সিংরইল",
    "nameEn": ""
  },
  {
    "id": 2865,
    "upazilaId": 297,
    "nameBn": "আচারগাঁও",
    "nameEn": ""
  },
  {
    "id": 2866,
    "upazilaId": 297,
    "nameBn": "শেরপুর",
    "nameEn": ""
  },
  {
    "id": 2867,
    "upazilaId": 297,
    "nameBn": "খারুয়া",
    "nameEn": ""
  },
  {
    "id": 2868,
    "upazilaId": 297,
    "nameBn": "জাহাঙ্গীরপুর",
    "nameEn": ""
  },
  {
    "id": 2869,
    "upazilaId": 298,
    "nameBn": "ছনধরা",
    "nameEn": ""
  },
  {
    "id": 2870,
    "upazilaId": 298,
    "nameBn": "রামভদ্রপুর",
    "nameEn": ""
  },
  {
    "id": 2871,
    "upazilaId": 298,
    "nameBn": "ভাইটকান্দি",
    "nameEn": ""
  },
  {
    "id": 2872,
    "upazilaId": 298,
    "nameBn": "সিংহেশ্বর",
    "nameEn": ""
  },
  {
    "id": 2873,
    "upazilaId": 298,
    "nameBn": "ফুলপুর",
    "nameEn": ""
  },
  {
    "id": 2874,
    "upazilaId": 298,
    "nameBn": "পয়ারী",
    "nameEn": ""
  },
  {
    "id": 2875,
    "upazilaId": 298,
    "nameBn": "রহিমগঞ্জ",
    "nameEn": ""
  },
  {
    "id": 2876,
    "upazilaId": 298,
    "nameBn": "রূপসী",
    "nameEn": ""
  },
  {
    "id": 2877,
    "upazilaId": 298,
    "nameBn": "বালিয়া",
    "nameEn": ""
  },
  {
    "id": 2878,
    "upazilaId": 298,
    "nameBn": "বওলা",
    "nameEn": ""
  },
  {
    "id": 2879,
    "upazilaId": 299,
    "nameBn": "নাওগাঁও",
    "nameEn": ""
  },
  {
    "id": 2880,
    "upazilaId": 299,
    "nameBn": "পুটিজানা",
    "nameEn": ""
  },
  {
    "id": 2881,
    "upazilaId": 299,
    "nameBn": "কুশমাইল",
    "nameEn": ""
  },
  {
    "id": 2882,
    "upazilaId": 299,
    "nameBn": "বালিয়ান",
    "nameEn": ""
  },
  {
    "id": 2883,
    "upazilaId": 299,
    "nameBn": "দেওখোলা",
    "nameEn": ""
  },
  {
    "id": 2884,
    "upazilaId": 299,
    "nameBn": "ফুলবাড়িয়া",
    "nameEn": ""
  },
  {
    "id": 2885,
    "upazilaId": 299,
    "nameBn": "বাক্তা",
    "nameEn": ""
  },
  {
    "id": 2886,
    "upazilaId": 299,
    "nameBn": "রাঙ্গামাটিয়া",
    "nameEn": ""
  },
  {
    "id": 2887,
    "upazilaId": 299,
    "nameBn": "এনায়েতপুর",
    "nameEn": ""
  },
  {
    "id": 2888,
    "upazilaId": 299,
    "nameBn": "কালাদহ",
    "nameEn": ""
  },
  {
    "id": 2889,
    "upazilaId": 299,
    "nameBn": "রাধাকানাই",
    "nameEn": ""
  },
  {
    "id": 2890,
    "upazilaId": 299,
    "nameBn": "আছিম পাটুলী",
    "nameEn": ""
  },
  {
    "id": 2891,
    "upazilaId": 299,
    "nameBn": "ভবানীপুর",
    "nameEn": ""
  },
  {
    "id": 2892,
    "upazilaId": 300,
    "nameBn": "উথুরা",
    "nameEn": ""
  },
  {
    "id": 2893,
    "upazilaId": 300,
    "nameBn": "মেদুয়ারী",
    "nameEn": ""
  },
  {
    "id": 2894,
    "upazilaId": 300,
    "nameBn": "ভরাডোবা",
    "nameEn": ""
  },
  {
    "id": 2895,
    "upazilaId": 300,
    "nameBn": "ধীতপুর",
    "nameEn": ""
  },
  {
    "id": 2896,
    "upazilaId": 300,
    "nameBn": "বিরুনিয়া",
    "nameEn": ""
  },
  {
    "id": 2897,
    "upazilaId": 300,
    "nameBn": "ভালুকা",
    "nameEn": ""
  },
  {
    "id": 2898,
    "upazilaId": 300,
    "nameBn": "মল্লিকবাড়ী",
    "nameEn": ""
  },
  {
    "id": 2899,
    "upazilaId": 300,
    "nameBn": "ডাকাতিয়া",
    "nameEn": ""
  },
  {
    "id": 2900,
    "upazilaId": 300,
    "nameBn": "কাচিনা",
    "nameEn": ""
  },
  {
    "id": 2901,
    "upazilaId": 300,
    "nameBn": "হবিরবাড়ী",
    "nameEn": ""
  },
  {
    "id": 2902,
    "upazilaId": 300,
    "nameBn": "রাজৈ",
    "nameEn": ""
  },
  {
    "id": 2903,
    "upazilaId": 301,
    "nameBn": "ভুবনকুড়া",
    "nameEn": ""
  },
  {
    "id": 2904,
    "upazilaId": 301,
    "nameBn": "জুগলী",
    "nameEn": ""
  },
  {
    "id": 2905,
    "upazilaId": 301,
    "nameBn": "কৈচাপুর",
    "nameEn": ""
  },
  {
    "id": 2906,
    "upazilaId": 301,
    "nameBn": "হালুয়াঘাট",
    "nameEn": ""
  },
  {
    "id": 2907,
    "upazilaId": 301,
    "nameBn": "গাজিরভিটা",
    "nameEn": ""
  },
  {
    "id": 2908,
    "upazilaId": 301,
    "nameBn": "বিলডোরা",
    "nameEn": ""
  },
  {
    "id": 2909,
    "upazilaId": 301,
    "nameBn": "শাকুয়াই",
    "nameEn": ""
  },
  {
    "id": 2910,
    "upazilaId": 301,
    "nameBn": "নড়াইল",
    "nameEn": ""
  },
  {
    "id": 2911,
    "upazilaId": 301,
    "nameBn": "ধারা",
    "nameEn": ""
  },
  {
    "id": 2912,
    "upazilaId": 301,
    "nameBn": "ধুরাইল",
    "nameEn": ""
  },
  {
    "id": 2913,
    "upazilaId": 301,
    "nameBn": "আমতৈল",
    "nameEn": ""
  },
  {
    "id": 2914,
    "upazilaId": 301,
    "nameBn": "স্বদেশী",
    "nameEn": ""
  },
  {
    "id": 2915,
    "upazilaId": 302,
    "nameBn": "দুল্লা",
    "nameEn": ""
  },
  {
    "id": 2916,
    "upazilaId": 302,
    "nameBn": "বড়গ্রাম",
    "nameEn": ""
  },
  {
    "id": 2917,
    "upazilaId": 302,
    "nameBn": "তারাটি",
    "nameEn": ""
  },
  {
    "id": 2918,
    "upazilaId": 302,
    "nameBn": "কুমারগাতা",
    "nameEn": ""
  },
  {
    "id": 2919,
    "upazilaId": 302,
    "nameBn": "বাঁশাটি",
    "nameEn": ""
  },
  {
    "id": 2920,
    "upazilaId": 302,
    "nameBn": "মানকোন",
    "nameEn": ""
  },
  {
    "id": 2921,
    "upazilaId": 302,
    "nameBn": "ঘোগা",
    "nameEn": ""
  },
  {
    "id": 2922,
    "upazilaId": 302,
    "nameBn": "দাওগাঁও",
    "nameEn": ""
  },
  {
    "id": 2923,
    "upazilaId": 302,
    "nameBn": "কাশিমপুর",
    "nameEn": ""
  },
  {
    "id": 2924,
    "upazilaId": 302,
    "nameBn": "খেরুয়াজানী",
    "nameEn": ""
  },
  {
    "id": 2925,
    "upazilaId": 303,
    "nameBn": "কুলকান্দি",
    "nameEn": ""
  },
  {
    "id": 2926,
    "upazilaId": 303,
    "nameBn": "বেলগাছা",
    "nameEn": ""
  },
  {
    "id": 2927,
    "upazilaId": 303,
    "nameBn": "চিনাডুলী",
    "nameEn": ""
  },
  {
    "id": 2928,
    "upazilaId": 303,
    "nameBn": "সাপধরী",
    "nameEn": ""
  },
  {
    "id": 2929,
    "upazilaId": 303,
    "nameBn": "নোয়ারপাড়া",
    "nameEn": ""
  },
  {
    "id": 2930,
    "upazilaId": 303,
    "nameBn": "ইসলামপুর",
    "nameEn": ""
  },
  {
    "id": 2931,
    "upazilaId": 303,
    "nameBn": "পাথর্শী",
    "nameEn": ""
  },
  {
    "id": 2932,
    "upazilaId": 303,
    "nameBn": "পলবান্ধা",
    "nameEn": ""
  },
  {
    "id": 2933,
    "upazilaId": 303,
    "nameBn": "গোয়ালেরচর",
    "nameEn": ""
  },
  {
    "id": 2934,
    "upazilaId": 303,
    "nameBn": "গাইবান্ধা",
    "nameEn": ""
  },
  {
    "id": 2935,
    "upazilaId": 303,
    "nameBn": "চর পুটিমারী",
    "nameEn": ""
  },
  {
    "id": 2936,
    "upazilaId": 303,
    "nameBn": "চর গোয়ালিনী",
    "nameEn": ""
  },
  {
    "id": 2937,
    "upazilaId": 304,
    "nameBn": "কেন্দুয়া",
    "nameEn": ""
  },
  {
    "id": 2938,
    "upazilaId": 304,
    "nameBn": "শরীফপুর",
    "nameEn": ""
  },
  {
    "id": 2939,
    "upazilaId": 304,
    "nameBn": "লক্ষ্মীরচর",
    "nameEn": ""
  },
  {
    "id": 2940,
    "upazilaId": 304,
    "nameBn": "তুলশীরচর",
    "nameEn": ""
  },
  {
    "id": 2941,
    "upazilaId": 304,
    "nameBn": "ইটাইল",
    "nameEn": ""
  },
  {
    "id": 2942,
    "upazilaId": 304,
    "nameBn": "নরুন্দি",
    "nameEn": ""
  },
  {
    "id": 2943,
    "upazilaId": 304,
    "nameBn": "ঘোড়াধাপ",
    "nameEn": ""
  },
  {
    "id": 2944,
    "upazilaId": 304,
    "nameBn": "বাঁশচড়া",
    "nameEn": ""
  },
  {
    "id": 2945,
    "upazilaId": 304,
    "nameBn": "রানাগাছা",
    "nameEn": ""
  },
  {
    "id": 2946,
    "upazilaId": 304,
    "nameBn": "শ্রীপুর",
    "nameEn": ""
  },
  {
    "id": 2947,
    "upazilaId": 304,
    "nameBn": "শাহবাজপুর",
    "nameEn": ""
  },
  {
    "id": 2948,
    "upazilaId": 304,
    "nameBn": "তিতপল্লা",
    "nameEn": ""
  },
  {
    "id": 2949,
    "upazilaId": 304,
    "nameBn": "মেষ্টা",
    "nameEn": ""
  },
  {
    "id": 2950,
    "upazilaId": 304,
    "nameBn": "দিগপাইত",
    "nameEn": ""
  },
  {
    "id": 2951,
    "upazilaId": 304,
    "nameBn": "রশিদপুর",
    "nameEn": ""
  },
  {
    "id": 2952,
    "upazilaId": 305,
    "nameBn": "ডাংধরা",
    "nameEn": ""
  },
  {
    "id": 2953,
    "upazilaId": 305,
    "nameBn": "চর আমখাওয়া",
    "nameEn": ""
  },
  {
    "id": 2954,
    "upazilaId": 305,
    "nameBn": "পার রামরামপুর",
    "nameEn": ""
  },
  {
    "id": 2955,
    "upazilaId": 305,
    "nameBn": "হাতীভাঙ্গা",
    "nameEn": ""
  },
  {
    "id": 2956,
    "upazilaId": 305,
    "nameBn": "বাহাদুরাবাদ",
    "nameEn": ""
  },
  {
    "id": 2957,
    "upazilaId": 305,
    "nameBn": "চিকাজানী",
    "nameEn": ""
  },
  {
    "id": 2958,
    "upazilaId": 305,
    "nameBn": "চুকাইবাড়ি",
    "nameEn": ""
  },
  {
    "id": 2959,
    "upazilaId": 305,
    "nameBn": "দেওয়ানগঞ্জ",
    "nameEn": ""
  },
  {
    "id": 2960,
    "upazilaId": 306,
    "nameBn": "বকশীগঞ্জ",
    "nameEn": ""
  },
  {
    "id": 2961,
    "upazilaId": 306,
    "nameBn": "বগারচর",
    "nameEn": ""
  },
  {
    "id": 2962,
    "upazilaId": 306,
    "nameBn": "কামালপুর",
    "nameEn": ""
  },
  {
    "id": 2963,
    "upazilaId": 306,
    "nameBn": "বাট্টাজোর",
    "nameEn": ""
  },
  {
    "id": 2964,
    "upazilaId": 306,
    "nameBn": "সাধুরপাড়া",
    "nameEn": ""
  },
  {
    "id": 2965,
    "upazilaId": 306,
    "nameBn": "নিলাক্ষিয়া",
    "nameEn": ""
  },
  {
    "id": 2966,
    "upazilaId": 306,
    "nameBn": "মেরুরচর",
    "nameEn": ""
  },
  {
    "id": 2967,
    "upazilaId": 307,
    "nameBn": "চরপাকেরদহ",
    "nameEn": ""
  },
  {
    "id": 2968,
    "upazilaId": 307,
    "nameBn": "কড়ইচড়া",
    "nameEn": ""
  },
  {
    "id": 2969,
    "upazilaId": 307,
    "nameBn": "গুণারীতলা",
    "nameEn": ""
  },
  {
    "id": 2970,
    "upazilaId": 307,
    "nameBn": "বালিজুড়ী",
    "nameEn": ""
  },
  {
    "id": 2971,
    "upazilaId": 307,
    "nameBn": "জোড়খালী",
    "nameEn": ""
  },
  {
    "id": 2972,
    "upazilaId": 307,
    "nameBn": "আদারভিটা",
    "nameEn": ""
  },
  {
    "id": 2973,
    "upazilaId": 307,
    "nameBn": "সিধুলী",
    "nameEn": ""
  },
  {
    "id": 2974,
    "upazilaId": 308,
    "nameBn": "কুলিয়া",
    "nameEn": ""
  },
  {
    "id": 2975,
    "upazilaId": 308,
    "nameBn": "দুরমুঠ",
    "nameEn": ""
  },
  {
    "id": 2976,
    "upazilaId": 308,
    "nameBn": "মাহমুদপুর",
    "nameEn": ""
  },
  {
    "id": 2977,
    "upazilaId": 308,
    "nameBn": "নাংলা",
    "nameEn": ""
  },
  {
    "id": 2978,
    "upazilaId": 308,
    "nameBn": "নয়ানগর",
    "nameEn": ""
  },
  {
    "id": 2979,
    "upazilaId": 308,
    "nameBn": "শ্যামপুর",
    "nameEn": ""
  },
  {
    "id": 2980,
    "upazilaId": 308,
    "nameBn": "আদ্রা",
    "nameEn": ""
  },
  {
    "id": 2981,
    "upazilaId": 308,
    "nameBn": "চর বানিপাকুরিয়া",
    "nameEn": ""
  },
  {
    "id": 2982,
    "upazilaId": 308,
    "nameBn": "ফুলকোচা",
    "nameEn": ""
  },
  {
    "id": 2983,
    "upazilaId": 308,
    "nameBn": "ঘোষেরপাড়া",
    "nameEn": ""
  },
  {
    "id": 2984,
    "upazilaId": 308,
    "nameBn": "ঝাউগড়া",
    "nameEn": ""
  },
  {
    "id": 2985,
    "upazilaId": 309,
    "nameBn": "সাতপোয়া",
    "nameEn": ""
  },
  {
    "id": 2986,
    "upazilaId": 309,
    "nameBn": "পোগলদীঘা",
    "nameEn": ""
  },
  {
    "id": 2987,
    "upazilaId": 309,
    "nameBn": "ডোয়াইল",
    "nameEn": ""
  },
  {
    "id": 2988,
    "upazilaId": 309,
    "nameBn": "আওনা",
    "nameEn": ""
  },
  {
    "id": 2989,
    "upazilaId": 309,
    "nameBn": "পিংনা",
    "nameEn": ""
  },
  {
    "id": 2990,
    "upazilaId": 309,
    "nameBn": "ভাটারা",
    "nameEn": ""
  },
  {
    "id": 2991,
    "upazilaId": 309,
    "nameBn": "কামরাবাদ",
    "nameEn": ""
  },
  {
    "id": 2992,
    "upazilaId": 309,
    "nameBn": "মহাদান",
    "nameEn": ""
  },
  {
    "id": 2993,
    "upazilaId": 310,
    "nameBn": "বানিয়াজান",
    "nameEn": ""
  },
  {
    "id": 2994,
    "upazilaId": 310,
    "nameBn": "শুনুই",
    "nameEn": ""
  },
  {
    "id": 2995,
    "upazilaId": 310,
    "nameBn": "স্বরমুশিয়া",
    "nameEn": ""
  },
  {
    "id": 2996,
    "upazilaId": 310,
    "nameBn": "সুখারী",
    "nameEn": ""
  },
  {
    "id": 2997,
    "upazilaId": 310,
    "nameBn": "তেলিগাতি",
    "nameEn": ""
  },
  {
    "id": 2998,
    "upazilaId": 310,
    "nameBn": "লুনেরশ্বর",
    "nameEn": ""
  },
  {
    "id": 2999,
    "upazilaId": 310,
    "nameBn": "দোয়জ",
    "nameEn": ""
  },
  {
    "id": 3000,
    "upazilaId": 311,
    "nameBn": "কলমাকান্দা",
    "nameEn": ""
  },
  {
    "id": 3001,
    "upazilaId": 311,
    "nameBn": "নাজিরপুর",
    "nameEn": ""
  },
  {
    "id": 3002,
    "upazilaId": 311,
    "nameBn": "লেঙ্গুরা",
    "nameEn": ""
  },
  {
    "id": 3003,
    "upazilaId": 311,
    "nameBn": "রংছাতি",
    "nameEn": ""
  },
  {
    "id": 3004,
    "upazilaId": 311,
    "nameBn": "কৈলাটি",
    "nameEn": ""
  },
  {
    "id": 3005,
    "upazilaId": 311,
    "nameBn": "খারনৈ",
    "nameEn": ""
  },
  {
    "id": 3006,
    "upazilaId": 311,
    "nameBn": "পোগলা",
    "nameEn": ""
  },
  {
    "id": 3007,
    "upazilaId": 311,
    "nameBn": "বরখাপন",
    "nameEn": ""
  },
  {
    "id": 3008,
    "upazilaId": 312,
    "nameBn": "আশুজিয়া",
    "nameEn": ""
  },
  {
    "id": 3009,
    "upazilaId": 312,
    "nameBn": "দল্পা",
    "nameEn": ""
  },
  {
    "id": 3010,
    "upazilaId": 312,
    "nameBn": "গড়াডোবা",
    "nameEn": ""
  },
  {
    "id": 3011,
    "upazilaId": 312,
    "nameBn": "গন্ডা",
    "nameEn": ""
  },
  {
    "id": 3012,
    "upazilaId": 312,
    "nameBn": "সান্দিকোণা",
    "nameEn": ""
  },
  {
    "id": 3013,
    "upazilaId": 312,
    "nameBn": "মাসকা",
    "nameEn": ""
  },
  {
    "id": 3014,
    "upazilaId": 312,
    "nameBn": "বলাইশিমূল",
    "nameEn": ""
  },
  {
    "id": 3015,
    "upazilaId": 312,
    "nameBn": "নওপাড়া",
    "nameEn": ""
  },
  {
    "id": 3016,
    "upazilaId": 312,
    "nameBn": "কান্দিউড়া",
    "nameEn": ""
  },
  {
    "id": 3017,
    "upazilaId": 312,
    "nameBn": "চিরাং বাজার",
    "nameEn": ""
  },
  {
    "id": 3018,
    "upazilaId": 312,
    "nameBn": "রোয়াইলবাড়ী",
    "nameEn": ""
  },
  {
    "id": 3019,
    "upazilaId": 312,
    "nameBn": "পাইকুড়া",
    "nameEn": ""
  },
  {
    "id": 3020,
    "upazilaId": 312,
    "nameBn": "মোজাফরপুর",
    "nameEn": ""
  },
  {
    "id": 3021,
    "upazilaId": 313,
    "nameBn": "মেন্দিপুর",
    "nameEn": ""
  },
  {
    "id": 3022,
    "upazilaId": 313,
    "nameBn": "চাকুয়া",
    "nameEn": ""
  },
  {
    "id": 3023,
    "upazilaId": 313,
    "nameBn": "খালিয়াজুরী",
    "nameEn": ""
  },
  {
    "id": 3024,
    "upazilaId": 313,
    "nameBn": "নগর",
    "nameEn": ""
  },
  {
    "id": 3025,
    "upazilaId": 313,
    "nameBn": "কৃষ্ণপুর",
    "nameEn": ""
  },
  {
    "id": 3026,
    "upazilaId": 313,
    "nameBn": "গাজীপুর",
    "nameEn": ""
  },
  {
    "id": 3027,
    "upazilaId": 314,
    "nameBn": "কুল্লাগড়া",
    "nameEn": ""
  },
  {
    "id": 3028,
    "upazilaId": 314,
    "nameBn": "দুর্গাপুর",
    "nameEn": ""
  },
  {
    "id": 3029,
    "upazilaId": 314,
    "nameBn": "চন্ডিগড়",
    "nameEn": ""
  },
  {
    "id": 3030,
    "upazilaId": 314,
    "nameBn": "বিরিশিরি",
    "nameEn": ""
  },
  {
    "id": 3031,
    "upazilaId": 314,
    "nameBn": "বাকলজোরা",
    "nameEn": ""
  },
  {
    "id": 3032,
    "upazilaId": 314,
    "nameBn": "কাকৈরগড়া",
    "nameEn": ""
  },
  {
    "id": 3033,
    "upazilaId": 314,
    "nameBn": "গাঁওকান্দিয়া",
    "nameEn": ""
  },
  {
    "id": 3034,
    "upazilaId": 315,
    "nameBn": "মৌগাতি",
    "nameEn": ""
  },
  {
    "id": 3035,
    "upazilaId": 315,
    "nameBn": "মেদনী",
    "nameEn": ""
  },
  {
    "id": 3036,
    "upazilaId": 315,
    "nameBn": "ঠাকুরাকোণা",
    "nameEn": ""
  },
  {
    "id": 3037,
    "upazilaId": 315,
    "nameBn": "রৌহা",
    "nameEn": ""
  },
  {
    "id": 3038,
    "upazilaId": 315,
    "nameBn": "চল্লিশা",
    "nameEn": ""
  },
  {
    "id": 3039,
    "upazilaId": 315,
    "nameBn": "আমতলা",
    "nameEn": ""
  },
  {
    "id": 3040,
    "upazilaId": 315,
    "nameBn": "কাইলাটি",
    "nameEn": ""
  },
  {
    "id": 3041,
    "upazilaId": 315,
    "nameBn": "লক্ষীগঞ্জ",
    "nameEn": ""
  },
  {
    "id": 3042,
    "upazilaId": 315,
    "nameBn": "দক্ষিণ বিশিউরা",
    "nameEn": ""
  },
  {
    "id": 3043,
    "upazilaId": 315,
    "nameBn": "মদনপুর",
    "nameEn": ""
  },
  {
    "id": 3044,
    "upazilaId": 315,
    "nameBn": "কালিয়ারা গাবরাগাতি",
    "nameEn": ""
  },
  {
    "id": 3045,
    "upazilaId": 315,
    "nameBn": "সিংহের বাংলা",
    "nameEn": ""
  },
  {
    "id": 3046,
    "upazilaId": 316,
    "nameBn": "বৈরাটি",
    "nameEn": ""
  },
  {
    "id": 3047,
    "upazilaId": 316,
    "nameBn": "জারিয়া",
    "nameEn": ""
  },
  {
    "id": 3048,
    "upazilaId": 316,
    "nameBn": "আগিয়া",
    "nameEn": ""
  },
  {
    "id": 3049,
    "upazilaId": 316,
    "nameBn": "বিশকাকুনি",
    "nameEn": ""
  },
  {
    "id": 3050,
    "upazilaId": 316,
    "nameBn": "খলিশাউড়",
    "nameEn": ""
  },
  {
    "id": 3051,
    "upazilaId": 316,
    "nameBn": "গোহালাকান্দা",
    "nameEn": ""
  },
  {
    "id": 3052,
    "upazilaId": 316,
    "nameBn": "নারান্দিয়া",
    "nameEn": ""
  },
  {
    "id": 3053,
    "upazilaId": 316,
    "nameBn": "হোগলা",
    "nameEn": ""
  },
  {
    "id": 3054,
    "upazilaId": 316,
    "nameBn": "ঘাগড়া",
    "nameEn": ""
  },
  {
    "id": 3055,
    "upazilaId": 316,
    "nameBn": "পূর্বধলা",
    "nameEn": ""
  },
  {
    "id": 3056,
    "upazilaId": 316,
    "nameBn": "ধলামুলগাঁও",
    "nameEn": ""
  },
  {
    "id": 3057,
    "upazilaId": 317,
    "nameBn": "বাউসী",
    "nameEn": ""
  },
  {
    "id": 3058,
    "upazilaId": 317,
    "nameBn": "সাহতা",
    "nameEn": ""
  },
  {
    "id": 3059,
    "upazilaId": 317,
    "nameBn": "বারহাট্টা",
    "nameEn": ""
  },
  {
    "id": 3060,
    "upazilaId": 317,
    "nameBn": "আসমা",
    "nameEn": ""
  },
  {
    "id": 3061,
    "upazilaId": 317,
    "nameBn": "চিরাম",
    "nameEn": ""
  },
  {
    "id": 3062,
    "upazilaId": 317,
    "nameBn": "সিংধা",
    "nameEn": ""
  },
  {
    "id": 3063,
    "upazilaId": 317,
    "nameBn": "রায়পুর",
    "nameEn": ""
  },
  {
    "id": 3064,
    "upazilaId": 318,
    "nameBn": "মদন",
    "nameEn": ""
  },
  {
    "id": 3065,
    "upazilaId": 318,
    "nameBn": "গোবিন্দশ্রী",
    "nameEn": ""
  },
  {
    "id": 3066,
    "upazilaId": 318,
    "nameBn": "তিয়শ্রী",
    "nameEn": ""
  },
  {
    "id": 3067,
    "upazilaId": 318,
    "nameBn": "মাঘান",
    "nameEn": ""
  },
  {
    "id": 3068,
    "upazilaId": 318,
    "nameBn": "ফতেপুর",
    "nameEn": ""
  },
  {
    "id": 3069,
    "upazilaId": 318,
    "nameBn": "চানগাঁও",
    "nameEn": ""
  },
  {
    "id": 3070,
    "upazilaId": 318,
    "nameBn": "নায়েকপুর",
    "nameEn": ""
  },
  {
    "id": 3071,
    "upazilaId": 318,
    "nameBn": "কাইটাইল",
    "nameEn": ""
  },
  {
    "id": 3072,
    "upazilaId": 319,
    "nameBn": "বড়কাশিয়া বিরামপুর",
    "nameEn": ""
  },
  {
    "id": 3073,
    "upazilaId": 319,
    "nameBn": "বড়তলী বানিয়াহারী",
    "nameEn": ""
  },
  {
    "id": 3074,
    "upazilaId": 319,
    "nameBn": "তেতুলিয়া",
    "nameEn": ""
  },
  {
    "id": 3075,
    "upazilaId": 319,
    "nameBn": "মাঘান সিয়াধার",
    "nameEn": ""
  },
  {
    "id": 3076,
    "upazilaId": 319,
    "nameBn": "সমাজ সহিলদেও",
    "nameEn": ""
  },
  {
    "id": 3077,
    "upazilaId": 319,
    "nameBn": "সুয়াইর",
    "nameEn": ""
  },
  {
    "id": 3078,
    "upazilaId": 319,
    "nameBn": "গাগলাজুর",
    "nameEn": ""
  },
  {
    "id": 3079,
    "upazilaId": 320,
    "nameBn": "কাংশা",
    "nameEn": ""
  },
  {
    "id": 3080,
    "upazilaId": 320,
    "nameBn": "গৌরীপুর",
    "nameEn": ""
  },
  {
    "id": 3081,
    "upazilaId": 320,
    "nameBn": "ঝিনাইগাতী",
    "nameEn": ""
  },
  {
    "id": 3082,
    "upazilaId": 320,
    "nameBn": "ধানশাইল",
    "nameEn": ""
  },
  {
    "id": 3083,
    "upazilaId": 320,
    "nameBn": "নলকুরা",
    "nameEn": ""
  },
  {
    "id": 3084,
    "upazilaId": 320,
    "nameBn": "মালিঝিকান্দা",
    "nameEn": ""
  },
  {
    "id": 3085,
    "upazilaId": 320,
    "nameBn": "হাতিবান্দা",
    "nameEn": ""
  },
  {
    "id": 3086,
    "upazilaId": 321,
    "nameBn": "গৌড়দ্বার",
    "nameEn": ""
  },
  {
    "id": 3087,
    "upazilaId": 321,
    "nameBn": "চন্দ্রকোনা",
    "nameEn": ""
  },
  {
    "id": 3088,
    "upazilaId": 321,
    "nameBn": "চর অষ্টধর",
    "nameEn": ""
  },
  {
    "id": 3089,
    "upazilaId": 321,
    "nameBn": "গণপদ্দী",
    "nameEn": ""
  },
  {
    "id": 3090,
    "upazilaId": 321,
    "nameBn": "টালকি",
    "nameEn": ""
  },
  {
    "id": 3091,
    "upazilaId": 321,
    "nameBn": "নকলা",
    "nameEn": ""
  },
  {
    "id": 3092,
    "upazilaId": 321,
    "nameBn": "উরফা",
    "nameEn": ""
  },
  {
    "id": 3093,
    "upazilaId": 321,
    "nameBn": "পাঠাকাটা",
    "nameEn": ""
  },
  {
    "id": 3094,
    "upazilaId": 321,
    "nameBn": "বানেশ্বর্দী",
    "nameEn": ""
  },
  {
    "id": 3095,
    "upazilaId": 322,
    "nameBn": "কলসপাড়",
    "nameEn": ""
  },
  {
    "id": 3096,
    "upazilaId": 322,
    "nameBn": "কাকরকান্দি",
    "nameEn": ""
  },
  {
    "id": 3097,
    "upazilaId": 322,
    "nameBn": "নন্নী",
    "nameEn": ""
  },
  {
    "id": 3098,
    "upazilaId": 322,
    "nameBn": "নয়াবিল",
    "nameEn": ""
  },
  {
    "id": 3099,
    "upazilaId": 322,
    "nameBn": "নালিতাবাড়ী",
    "nameEn": ""
  },
  {
    "id": 3100,
    "upazilaId": 322,
    "nameBn": "পোড়াগাও",
    "nameEn": ""
  },
  {
    "id": 3101,
    "upazilaId": 322,
    "nameBn": "বাঘবেড়",
    "nameEn": ""
  },
  {
    "id": 3102,
    "upazilaId": 322,
    "nameBn": "মরিচপুরান",
    "nameEn": ""
  },
  {
    "id": 3103,
    "upazilaId": 322,
    "nameBn": "যোগানীয়া",
    "nameEn": ""
  },
  {
    "id": 3104,
    "upazilaId": 322,
    "nameBn": "রাজনগর",
    "nameEn": ""
  },
  {
    "id": 3105,
    "upazilaId": 322,
    "nameBn": "রামচন্দ্রকোড়া",
    "nameEn": ""
  },
  {
    "id": 3106,
    "upazilaId": 322,
    "nameBn": "রূপনারায়নকুড়া",
    "nameEn": ""
  },
  {
    "id": 3107,
    "upazilaId": 323,
    "nameBn": "কামারের চর",
    "nameEn": ""
  },
  {
    "id": 3108,
    "upazilaId": 323,
    "nameBn": "গাজির খামার",
    "nameEn": ""
  },
  {
    "id": 3109,
    "upazilaId": 323,
    "nameBn": "চরপক্ষীমারী",
    "nameEn": ""
  },
  {
    "id": 3110,
    "upazilaId": 323,
    "nameBn": "চরমোচারিয়া",
    "nameEn": ""
  },
  {
    "id": 3111,
    "upazilaId": 323,
    "nameBn": "চরশেরপুর",
    "nameEn": ""
  },
  {
    "id": 3112,
    "upazilaId": 323,
    "nameBn": "ধলা",
    "nameEn": ""
  },
  {
    "id": 3113,
    "upazilaId": 323,
    "nameBn": "পাকুরিয়া",
    "nameEn": ""
  },
  {
    "id": 3114,
    "upazilaId": 323,
    "nameBn": "বলায়ের চর",
    "nameEn": ""
  },
  {
    "id": 3115,
    "upazilaId": 323,
    "nameBn": "বাজিতখিলা",
    "nameEn": ""
  },
  {
    "id": 3116,
    "upazilaId": 323,
    "nameBn": "বেতমারী ঘুঘুরাকান্দি",
    "nameEn": ""
  },
  {
    "id": 3117,
    "upazilaId": 323,
    "nameBn": "ভাতশালা",
    "nameEn": ""
  },
  {
    "id": 3118,
    "upazilaId": 323,
    "nameBn": "রৌহা",
    "nameEn": ""
  },
  {
    "id": 3119,
    "upazilaId": 323,
    "nameBn": "লছমনপুর",
    "nameEn": ""
  },
  {
    "id": 3120,
    "upazilaId": 324,
    "nameBn": "সিংগাবরুনা",
    "nameEn": ""
  },
  {
    "id": 3121,
    "upazilaId": 324,
    "nameBn": "রাণীশিমুল",
    "nameEn": ""
  },
  {
    "id": 3122,
    "upazilaId": 324,
    "nameBn": "গোঁসাইপুর",
    "nameEn": ""
  },
  {
    "id": 3123,
    "upazilaId": 324,
    "nameBn": "কাকিলাকুড়া",
    "nameEn": ""
  },
  {
    "id": 3124,
    "upazilaId": 324,
    "nameBn": "তাতীহাটি",
    "nameEn": ""
  },
  {
    "id": 3125,
    "upazilaId": 324,
    "nameBn": "শ্রীবরদী",
    "nameEn": ""
  },
  {
    "id": 3126,
    "upazilaId": 324,
    "nameBn": "ভেলুয়া",
    "nameEn": ""
  },
  {
    "id": 3127,
    "upazilaId": 324,
    "nameBn": "খড়িয়া কাজিরচর",
    "nameEn": ""
  },
  {
    "id": 3128,
    "upazilaId": 324,
    "nameBn": "কুড়িকাহনিয়া",
    "nameEn": ""
  },
  {
    "id": 3129,
    "upazilaId": 324,
    "nameBn": "গড়জরিপা",
    "nameEn": ""
  },
  {
    "id": 3130,
    "upazilaId": 325,
    "nameBn": "দূর্গাপুর",
    "nameEn": ""
  },
  {
    "id": 3131,
    "upazilaId": 325,
    "nameBn": "বেগমগঞ্জ",
    "nameEn": ""
  },
  {
    "id": 3132,
    "upazilaId": 325,
    "nameBn": "বুড়াবুড়ি",
    "nameEn": ""
  },
  {
    "id": 3133,
    "upazilaId": 325,
    "nameBn": "বজরা",
    "nameEn": ""
  },
  {
    "id": 3134,
    "upazilaId": 325,
    "nameBn": "দলদলিয়া",
    "nameEn": ""
  },
  {
    "id": 3135,
    "upazilaId": 325,
    "nameBn": "ধামশ্রেণী",
    "nameEn": ""
  },
  {
    "id": 3136,
    "upazilaId": 325,
    "nameBn": "ধরণীবাড়ী",
    "nameEn": ""
  },
  {
    "id": 3137,
    "upazilaId": 325,
    "nameBn": "গুনাইগাছ",
    "nameEn": ""
  },
  {
    "id": 3138,
    "upazilaId": 325,
    "nameBn": "হাতিয়া",
    "nameEn": ""
  },
  {
    "id": 3139,
    "upazilaId": 325,
    "nameBn": "পান্ডুল",
    "nameEn": ""
  },
  {
    "id": 3140,
    "upazilaId": 325,
    "nameBn": "সাহেবের আলগা",
    "nameEn": ""
  },
  {
    "id": 3141,
    "upazilaId": 325,
    "nameBn": "তবকপুর",
    "nameEn": ""
  },
  {
    "id": 3142,
    "upazilaId": 325,
    "nameBn": "থেতরাই",
    "nameEn": ""
  },
  {
    "id": 3143,
    "upazilaId": 326,
    "nameBn": "কাঁঠালবাড়ী",
    "nameEn": ""
  },
  {
    "id": 3144,
    "upazilaId": 326,
    "nameBn": "হলোখানা",
    "nameEn": ""
  },
  {
    "id": 3145,
    "upazilaId": 326,
    "nameBn": "ভোগডাঙ্গা",
    "nameEn": ""
  },
  {
    "id": 3146,
    "upazilaId": 326,
    "nameBn": "ঘোগাদহ",
    "nameEn": ""
  },
  {
    "id": 3147,
    "upazilaId": 326,
    "nameBn": "বেলগাছা",
    "nameEn": ""
  },
  {
    "id": 3148,
    "upazilaId": 326,
    "nameBn": "মোগলবাসা",
    "nameEn": ""
  },
  {
    "id": 3149,
    "upazilaId": 326,
    "nameBn": "পাঁচগাছি",
    "nameEn": ""
  },
  {
    "id": 3150,
    "upazilaId": 326,
    "nameBn": "যাত্রাপুর",
    "nameEn": ""
  },
  {
    "id": 3151,
    "upazilaId": 327,
    "nameBn": "রাজিবপুর",
    "nameEn": ""
  },
  {
    "id": 3152,
    "upazilaId": 327,
    "nameBn": "কোদালকাটি",
    "nameEn": ""
  },
  {
    "id": 3153,
    "upazilaId": 327,
    "nameBn": "মোহনগঞ্জ",
    "nameEn": ""
  },
  {
    "id": 3154,
    "upazilaId": 328,
    "nameBn": "অষ্টমির চর",
    "nameEn": ""
  },
  {
    "id": 3155,
    "upazilaId": 328,
    "nameBn": "নয়ারহাট",
    "nameEn": ""
  },
  {
    "id": 3156,
    "upazilaId": 328,
    "nameBn": "চিলমারী",
    "nameEn": ""
  },
  {
    "id": 3157,
    "upazilaId": 328,
    "nameBn": "রমনা",
    "nameEn": ""
  },
  {
    "id": 3158,
    "upazilaId": 328,
    "nameBn": "থানাহাট",
    "nameEn": ""
  },
  {
    "id": 3159,
    "upazilaId": 328,
    "nameBn": "রাণীগঞ্জ",
    "nameEn": ""
  },
  {
    "id": 3160,
    "upazilaId": 329,
    "nameBn": "রামখানা",
    "nameEn": ""
  },
  {
    "id": 3161,
    "upazilaId": 329,
    "nameBn": "রায়গঞ্জ",
    "nameEn": ""
  },
  {
    "id": 3162,
    "upazilaId": 329,
    "nameBn": "সন্তোষপুর",
    "nameEn": ""
  },
  {
    "id": 3163,
    "upazilaId": 329,
    "nameBn": "বামনডাঙ্গা",
    "nameEn": ""
  },
  {
    "id": 3164,
    "upazilaId": 329,
    "nameBn": "নেওয়াশী",
    "nameEn": ""
  },
  {
    "id": 3165,
    "upazilaId": 329,
    "nameBn": "হাসনাবাদ",
    "nameEn": ""
  },
  {
    "id": 3166,
    "upazilaId": 329,
    "nameBn": "ভিতরবন্দ",
    "nameEn": ""
  },
  {
    "id": 3167,
    "upazilaId": 329,
    "nameBn": "নুনখাওয়া",
    "nameEn": ""
  },
  {
    "id": 3168,
    "upazilaId": 329,
    "nameBn": "কালীগঞ্জ",
    "nameEn": ""
  },
  {
    "id": 3169,
    "upazilaId": 329,
    "nameBn": "বেরুবাড়ী",
    "nameEn": ""
  },
  {
    "id": 3170,
    "upazilaId": 329,
    "nameBn": "কেদার",
    "nameEn": ""
  },
  {
    "id": 3171,
    "upazilaId": 329,
    "nameBn": "কচাকাটা",
    "nameEn": ""
  },
  {
    "id": 3172,
    "upazilaId": 329,
    "nameBn": "বল্লভেরখাস",
    "nameEn": ""
  },
  {
    "id": 3173,
    "upazilaId": 329,
    "nameBn": "নারায়ণপুর",
    "nameEn": ""
  },
  {
    "id": 3174,
    "upazilaId": 330,
    "nameBn": "শিমুলবাড়ী",
    "nameEn": ""
  },
  {
    "id": 3175,
    "upazilaId": 330,
    "nameBn": "নাওডাঙ্গা",
    "nameEn": ""
  },
  {
    "id": 3176,
    "upazilaId": 330,
    "nameBn": "ভাঙ্গামোড়",
    "nameEn": ""
  },
  {
    "id": 3177,
    "upazilaId": 330,
    "nameBn": "ফুলবাড়ী",
    "nameEn": ""
  },
  {
    "id": 3178,
    "upazilaId": 330,
    "nameBn": "কাশিপুর",
    "nameEn": ""
  },
  {
    "id": 3179,
    "upazilaId": 330,
    "nameBn": "বড়ভিটা",
    "nameEn": ""
  },
  {
    "id": 3180,
    "upazilaId": 331,
    "nameBn": "পাথরডুবী",
    "nameEn": ""
  },
  {
    "id": 3181,
    "upazilaId": 331,
    "nameBn": "শিলখুড়ি",
    "nameEn": ""
  },
  {
    "id": 3182,
    "upazilaId": 331,
    "nameBn": "তিলাই",
    "nameEn": ""
  },
  {
    "id": 3183,
    "upazilaId": 331,
    "nameBn": "পাইকেরছড়া",
    "nameEn": ""
  },
  {
    "id": 3184,
    "upazilaId": 331,
    "nameBn": "ভূরুঙ্গামারী",
    "nameEn": ""
  },
  {
    "id": 3185,
    "upazilaId": 331,
    "nameBn": "জয়মনিরহাট",
    "nameEn": ""
  },
  {
    "id": 3186,
    "upazilaId": 331,
    "nameBn": "আন্ধারীঝাড়",
    "nameEn": ""
  },
  {
    "id": 3187,
    "upazilaId": 331,
    "nameBn": "বলদিয়া",
    "nameEn": ""
  },
  {
    "id": 3188,
    "upazilaId": 331,
    "nameBn": "চরভূরুঙ্গামারী",
    "nameEn": ""
  },
  {
    "id": 3189,
    "upazilaId": 331,
    "nameBn": "বঙ্গসোনাহাট",
    "nameEn": ""
  },
  {
    "id": 3190,
    "upazilaId": 332,
    "nameBn": "ঘড়িয়ালডাঙ্গা",
    "nameEn": ""
  },
  {
    "id": 3191,
    "upazilaId": 332,
    "nameBn": "ছিনাই",
    "nameEn": ""
  },
  {
    "id": 3192,
    "upazilaId": 332,
    "nameBn": "রাজারহাট",
    "nameEn": ""
  },
  {
    "id": 3193,
    "upazilaId": 332,
    "nameBn": "চাকিরপশার",
    "nameEn": ""
  },
  {
    "id": 3194,
    "upazilaId": 332,
    "nameBn": "বিদ্যানন্দ",
    "nameEn": ""
  },
  {
    "id": 3195,
    "upazilaId": 332,
    "nameBn": "উমরমজিদ",
    "nameEn": ""
  },
  {
    "id": 3196,
    "upazilaId": 332,
    "nameBn": "নজিমখাঁন",
    "nameEn": ""
  },
  {
    "id": 3197,
    "upazilaId": 333,
    "nameBn": "রৌমারী",
    "nameEn": ""
  },
  {
    "id": 3198,
    "upazilaId": 333,
    "nameBn": "যাদুর চর",
    "nameEn": ""
  },
  {
    "id": 3199,
    "upazilaId": 333,
    "nameBn": "শৌলমারী",
    "nameEn": ""
  },
  {
    "id": 3200,
    "upazilaId": 333,
    "nameBn": "দাতভাঙ্গা",
    "nameEn": ""
  },
  {
    "id": 3201,
    "upazilaId": 333,
    "nameBn": "বন্দবেড়",
    "nameEn": ""
  },
  {
    "id": 3202,
    "upazilaId": 333,
    "nameBn": "চর শৌলমারী",
    "nameEn": ""
  },
  {
    "id": 3203,
    "upazilaId": 334,
    "nameBn": "লক্ষ্মীপুর",
    "nameEn": ""
  },
  {
    "id": 3204,
    "upazilaId": 334,
    "nameBn": "মালিবাড়ী",
    "nameEn": ""
  },
  {
    "id": 3205,
    "upazilaId": 334,
    "nameBn": "কুপতলা",
    "nameEn": ""
  },
  {
    "id": 3206,
    "upazilaId": 334,
    "nameBn": "সাহাপাড়া",
    "nameEn": ""
  },
  {
    "id": 3207,
    "upazilaId": 334,
    "nameBn": "বল্লমঝাড়",
    "nameEn": ""
  },
  {
    "id": 3208,
    "upazilaId": 334,
    "nameBn": "রামচন্দ্রপুর",
    "nameEn": ""
  },
  {
    "id": 3209,
    "upazilaId": 334,
    "nameBn": "বাদিয়াখালী",
    "nameEn": ""
  },
  {
    "id": 3210,
    "upazilaId": 334,
    "nameBn": "বোয়ালী",
    "nameEn": ""
  },
  {
    "id": 3211,
    "upazilaId": 334,
    "nameBn": "খোলাহাটী",
    "nameEn": ""
  },
  {
    "id": 3212,
    "upazilaId": 334,
    "nameBn": "ঘাগোয়া",
    "nameEn": ""
  },
  {
    "id": 3213,
    "upazilaId": 334,
    "nameBn": "গিদারী",
    "nameEn": ""
  },
  {
    "id": 3214,
    "upazilaId": 334,
    "nameBn": "কামারজানি",
    "nameEn": ""
  },
  {
    "id": 3215,
    "upazilaId": 334,
    "nameBn": "মোল্লারচর",
    "nameEn": ""
  },
  {
    "id": 3216,
    "upazilaId": 335,
    "nameBn": "রসুলপুর",
    "nameEn": ""
  },
  {
    "id": 3217,
    "upazilaId": 335,
    "nameBn": "নলডাঙ্গা",
    "nameEn": ""
  },
  {
    "id": 3218,
    "upazilaId": 335,
    "nameBn": "দামোদরপুর",
    "nameEn": ""
  },
  {
    "id": 3219,
    "upazilaId": 335,
    "nameBn": "জামালপুর",
    "nameEn": ""
  },
  {
    "id": 3220,
    "upazilaId": 335,
    "nameBn": "ফরিদপুর",
    "nameEn": ""
  },
  {
    "id": 3221,
    "upazilaId": 335,
    "nameBn": "ধাপেরহাট",
    "nameEn": ""
  },
  {
    "id": 3222,
    "upazilaId": 335,
    "nameBn": "ইদিলপুর",
    "nameEn": ""
  },
  {
    "id": 3223,
    "upazilaId": 335,
    "nameBn": "ভাতগ্রাম",
    "nameEn": ""
  },
  {
    "id": 3224,
    "upazilaId": 335,
    "nameBn": "বনগ্রাম",
    "nameEn": ""
  },
  {
    "id": 3225,
    "upazilaId": 335,
    "nameBn": "কামারপাড়া",
    "nameEn": ""
  },
  {
    "id": 3226,
    "upazilaId": 335,
    "nameBn": "খোদকোমরপুর",
    "nameEn": ""
  },
  {
    "id": 3227,
    "upazilaId": 336,
    "nameBn": "কঞ্চিপাড়া",
    "nameEn": ""
  },
  {
    "id": 3228,
    "upazilaId": 336,
    "nameBn": "উড়িয়া",
    "nameEn": ""
  },
  {
    "id": 3229,
    "upazilaId": 336,
    "nameBn": "উদাখালী",
    "nameEn": ""
  },
  {
    "id": 3230,
    "upazilaId": 336,
    "nameBn": "গজারিয়া",
    "nameEn": ""
  },
  {
    "id": 3231,
    "upazilaId": 336,
    "nameBn": "ফুলছড়ি",
    "nameEn": ""
  },
  {
    "id": 3232,
    "upazilaId": 336,
    "nameBn": "এরেন্ডাবাড়ী",
    "nameEn": ""
  },
  {
    "id": 3233,
    "upazilaId": 336,
    "nameBn": "ফজলুপুর",
    "nameEn": ""
  },
  {
    "id": 3234,
    "upazilaId": 337,
    "nameBn": "মহিমাগঞ্জ",
    "nameEn": ""
  },
  {
    "id": 3235,
    "upazilaId": 337,
    "nameBn": "কামদিয়া",
    "nameEn": ""
  },
  {
    "id": 3236,
    "upazilaId": 337,
    "nameBn": "শাখাহার",
    "nameEn": ""
  },
  {
    "id": 3237,
    "upazilaId": 337,
    "nameBn": "কাটাবাড়ী",
    "nameEn": ""
  },
  {
    "id": 3238,
    "upazilaId": 337,
    "nameBn": "রাজাহার",
    "nameEn": ""
  },
  {
    "id": 3239,
    "upazilaId": 337,
    "nameBn": "সাপমারা",
    "nameEn": ""
  },
  {
    "id": 3240,
    "upazilaId": 337,
    "nameBn": "দরবস্ত",
    "nameEn": ""
  },
  {
    "id": 3241,
    "upazilaId": 337,
    "nameBn": "তালুককানুপুর",
    "nameEn": ""
  },
  {
    "id": 3242,
    "upazilaId": 337,
    "nameBn": "নাকাই",
    "nameEn": ""
  },
  {
    "id": 3243,
    "upazilaId": 337,
    "nameBn": "হরিরামপুর",
    "nameEn": ""
  },
  {
    "id": 3244,
    "upazilaId": 337,
    "nameBn": "রাখালবুরুজ",
    "nameEn": ""
  },
  {
    "id": 3245,
    "upazilaId": 337,
    "nameBn": "ফুলবাড়ী",
    "nameEn": ""
  },
  {
    "id": 3246,
    "upazilaId": 337,
    "nameBn": "গুমানীগঞ্জ",
    "nameEn": ""
  },
  {
    "id": 3247,
    "upazilaId": 337,
    "nameBn": "কামারদহ",
    "nameEn": ""
  },
  {
    "id": 3248,
    "upazilaId": 337,
    "nameBn": "কোচাশহর",
    "nameEn": ""
  },
  {
    "id": 3249,
    "upazilaId": 337,
    "nameBn": "শিবপুর",
    "nameEn": ""
  },
  {
    "id": 3250,
    "upazilaId": 337,
    "nameBn": "শালমারা",
    "nameEn": ""
  },
  {
    "id": 3251,
    "upazilaId": 338,
    "nameBn": "কিশোরগাড়ী",
    "nameEn": ""
  },
  {
    "id": 3252,
    "upazilaId": 338,
    "nameBn": "হোসেনপুর",
    "nameEn": ""
  },
  {
    "id": 3253,
    "upazilaId": 338,
    "nameBn": "পলাশবাড়ী",
    "nameEn": ""
  },
  {
    "id": 3254,
    "upazilaId": 338,
    "nameBn": "বরিশাল",
    "nameEn": ""
  },
  {
    "id": 3255,
    "upazilaId": 338,
    "nameBn": "মহদীপুর",
    "nameEn": ""
  },
  {
    "id": 3256,
    "upazilaId": 338,
    "nameBn": "বেতকাপা",
    "nameEn": ""
  },
  {
    "id": 3257,
    "upazilaId": 338,
    "nameBn": "পবনাপুর",
    "nameEn": ""
  },
  {
    "id": 3258,
    "upazilaId": 338,
    "nameBn": "মনোহরপুর",
    "nameEn": ""
  },
  {
    "id": 3259,
    "upazilaId": 338,
    "nameBn": "হরিণাথপুর",
    "nameEn": ""
  },
  {
    "id": 3260,
    "upazilaId": 339,
    "nameBn": "পদুমশহর",
    "nameEn": ""
  },
  {
    "id": 3261,
    "upazilaId": 339,
    "nameBn": "ভরতখালী",
    "nameEn": ""
  },
  {
    "id": 3262,
    "upazilaId": 339,
    "nameBn": "সাঘাটা",
    "nameEn": ""
  },
  {
    "id": 3263,
    "upazilaId": 339,
    "nameBn": "মুক্তিনগর",
    "nameEn": ""
  },
  {
    "id": 3264,
    "upazilaId": 339,
    "nameBn": "কচুয়া",
    "nameEn": ""
  },
  {
    "id": 3265,
    "upazilaId": 339,
    "nameBn": "ঘুরিদহ",
    "nameEn": ""
  },
  {
    "id": 3266,
    "upazilaId": 339,
    "nameBn": "হলদিয়া",
    "nameEn": ""
  },
  {
    "id": 3267,
    "upazilaId": 339,
    "nameBn": "জুমারবাড়ী",
    "nameEn": ""
  },
  {
    "id": 3268,
    "upazilaId": 339,
    "nameBn": "কামালেরপাড়া",
    "nameEn": ""
  },
  {
    "id": 3269,
    "upazilaId": 339,
    "nameBn": "বোনারপাড়া",
    "nameEn": ""
  },
  {
    "id": 3270,
    "upazilaId": 340,
    "nameBn": "বামনডাঙ্গা",
    "nameEn": ""
  },
  {
    "id": 3271,
    "upazilaId": 340,
    "nameBn": "সোনারায়",
    "nameEn": ""
  },
  {
    "id": 3272,
    "upazilaId": 340,
    "nameBn": "তারাপুর",
    "nameEn": ""
  },
  {
    "id": 3273,
    "upazilaId": 340,
    "nameBn": "বেলকা",
    "nameEn": ""
  },
  {
    "id": 3274,
    "upazilaId": 340,
    "nameBn": "দহবন্দ",
    "nameEn": ""
  },
  {
    "id": 3275,
    "upazilaId": 340,
    "nameBn": "সর্বানন্দ",
    "nameEn": ""
  },
  {
    "id": 3276,
    "upazilaId": 340,
    "nameBn": "রামজীবন",
    "nameEn": ""
  },
  {
    "id": 3277,
    "upazilaId": 340,
    "nameBn": "ধোপাডাঙ্গা",
    "nameEn": ""
  },
  {
    "id": 3278,
    "upazilaId": 340,
    "nameBn": "ছাপরহাটী",
    "nameEn": ""
  },
  {
    "id": 3279,
    "upazilaId": 340,
    "nameBn": "শান্তিরাম",
    "nameEn": ""
  },
  {
    "id": 3280,
    "upazilaId": 340,
    "nameBn": "কঞ্চিবাড়ী",
    "nameEn": ""
  },
  {
    "id": 3281,
    "upazilaId": 340,
    "nameBn": "শ্রীপুর",
    "nameEn": ""
  },
  {
    "id": 3282,
    "upazilaId": 340,
    "nameBn": "চন্ডিপুর",
    "nameEn": ""
  },
  {
    "id": 3283,
    "upazilaId": 340,
    "nameBn": "কাপাসিয়া",
    "nameEn": ""
  },
  {
    "id": 3284,
    "upazilaId": 340,
    "nameBn": "হরিপুর",
    "nameEn": ""
  },
  {
    "id": 3285,
    "upazilaId": 341,
    "nameBn": "রুহিয়া",
    "nameEn": ""
  },
  {
    "id": 3286,
    "upazilaId": 341,
    "nameBn": "আখানগর",
    "nameEn": ""
  },
  {
    "id": 3287,
    "upazilaId": 341,
    "nameBn": "আকচা",
    "nameEn": ""
  },
  {
    "id": 3288,
    "upazilaId": 341,
    "nameBn": "বড়গাঁও",
    "nameEn": ""
  },
  {
    "id": 3289,
    "upazilaId": 341,
    "nameBn": "বালিয়া",
    "nameEn": ""
  },
  {
    "id": 3290,
    "upazilaId": 341,
    "nameBn": "আউলিয়াপুর চিলারং",
    "nameEn": ""
  },
  {
    "id": 3291,
    "upazilaId": 341,
    "nameBn": "রহিমানপুর",
    "nameEn": ""
  },
  {
    "id": 3292,
    "upazilaId": 341,
    "nameBn": "রায়পুর",
    "nameEn": ""
  },
  {
    "id": 3293,
    "upazilaId": 341,
    "nameBn": "জামালপুর",
    "nameEn": ""
  },
  {
    "id": 3294,
    "upazilaId": 341,
    "nameBn": "মোহাম্মাদপুর",
    "nameEn": ""
  },
  {
    "id": 3295,
    "upazilaId": 341,
    "nameBn": "সালন্দর",
    "nameEn": ""
  },
  {
    "id": 3296,
    "upazilaId": 341,
    "nameBn": "গড়েয়া",
    "nameEn": ""
  },
  {
    "id": 3297,
    "upazilaId": 341,
    "nameBn": "রাজাগাঁও",
    "nameEn": ""
  },
  {
    "id": 3298,
    "upazilaId": 341,
    "nameBn": "দেবীপুর",
    "nameEn": ""
  },
  {
    "id": 3299,
    "upazilaId": 341,
    "nameBn": "নারগুন",
    "nameEn": ""
  },
  {
    "id": 3300,
    "upazilaId": 341,
    "nameBn": "জগন্নাথপুর",
    "nameEn": ""
  },
  {
    "id": 3301,
    "upazilaId": 341,
    "nameBn": "শুখানপুকুরী",
    "nameEn": ""
  },
  {
    "id": 3302,
    "upazilaId": 341,
    "nameBn": "বেগুনবাড়ী",
    "nameEn": ""
  },
  {
    "id": 3303,
    "upazilaId": 341,
    "nameBn": "রুহিয়া পশ্চিম",
    "nameEn": ""
  },
  {
    "id": 3304,
    "upazilaId": 341,
    "nameBn": "ঢোলার হাট",
    "nameEn": ""
  },
  {
    "id": 3305,
    "upazilaId": 342,
    "nameBn": "পাড়িয়া",
    "nameEn": ""
  },
  {
    "id": 3306,
    "upazilaId": 342,
    "nameBn": "চাড়োল",
    "nameEn": ""
  },
  {
    "id": 3307,
    "upazilaId": 342,
    "nameBn": "ধনতলা",
    "nameEn": ""
  },
  {
    "id": 3308,
    "upazilaId": 342,
    "nameBn": "বড়পলাশবাড়ী",
    "nameEn": ""
  },
  {
    "id": 3309,
    "upazilaId": 342,
    "nameBn": "দুওসুও",
    "nameEn": ""
  },
  {
    "id": 3310,
    "upazilaId": 342,
    "nameBn": "ভানোর",
    "nameEn": ""
  },
  {
    "id": 3311,
    "upazilaId": 342,
    "nameBn": "আমজানখোর",
    "nameEn": ""
  },
  {
    "id": 3312,
    "upazilaId": 342,
    "nameBn": "বড়বাড়ি",
    "nameEn": ""
  },
  {
    "id": 3313,
    "upazilaId": 343,
    "nameBn": "ভোমরাদহ",
    "nameEn": ""
  },
  {
    "id": 3314,
    "upazilaId": 343,
    "nameBn": "কোষারাণীগঞ্জ",
    "nameEn": ""
  },
  {
    "id": 3315,
    "upazilaId": 343,
    "nameBn": "খনগাঁও",
    "nameEn": ""
  },
  {
    "id": 3316,
    "upazilaId": 343,
    "nameBn": "পীরগঞ্জ",
    "nameEn": ""
  },
  {
    "id": 3317,
    "upazilaId": 343,
    "nameBn": "সৈয়দপুর",
    "nameEn": ""
  },
  {
    "id": 3318,
    "upazilaId": 343,
    "nameBn": "হাজীপুর",
    "nameEn": ""
  },
  {
    "id": 3319,
    "upazilaId": 343,
    "nameBn": "দৌলতপুর",
    "nameEn": ""
  },
  {
    "id": 3320,
    "upazilaId": 343,
    "nameBn": "সেনগাঁও",
    "nameEn": ""
  },
  {
    "id": 3321,
    "upazilaId": 343,
    "nameBn": "জাবরহাট",
    "nameEn": ""
  },
  {
    "id": 3322,
    "upazilaId": 343,
    "nameBn": "বৈরচুনা",
    "nameEn": ""
  },
  {
    "id": 3323,
    "upazilaId": 344,
    "nameBn": "গেদুড়া",
    "nameEn": ""
  },
  {
    "id": 3324,
    "upazilaId": 344,
    "nameBn": "আমগাও",
    "nameEn": ""
  },
  {
    "id": 3325,
    "upazilaId": 344,
    "nameBn": "বকুয়া",
    "nameEn": ""
  },
  {
    "id": 3326,
    "upazilaId": 344,
    "nameBn": "ডাঙ্গীপাড়া",
    "nameEn": ""
  },
  {
    "id": 3327,
    "upazilaId": 344,
    "nameBn": "হরিপুর",
    "nameEn": ""
  },
  {
    "id": 3328,
    "upazilaId": 344,
    "nameBn": "ভাতুরিয়া",
    "nameEn": ""
  },
  {
    "id": 3329,
    "upazilaId": 345,
    "nameBn": "ধর্মগড়",
    "nameEn": ""
  },
  {
    "id": 3330,
    "upazilaId": 345,
    "nameBn": "নেকমরদ",
    "nameEn": ""
  },
  {
    "id": 3331,
    "upazilaId": 345,
    "nameBn": "হোসেনগাঁও",
    "nameEn": ""
  },
  {
    "id": 3332,
    "upazilaId": 345,
    "nameBn": "লেহেম্বা",
    "nameEn": ""
  },
  {
    "id": 3333,
    "upazilaId": 345,
    "nameBn": "বাচোর",
    "nameEn": ""
  },
  {
    "id": 3334,
    "upazilaId": 345,
    "nameBn": "কাশিপুর",
    "nameEn": ""
  },
  {
    "id": 3335,
    "upazilaId": 345,
    "nameBn": "রাতোর",
    "nameEn": ""
  },
  {
    "id": 3336,
    "upazilaId": 345,
    "nameBn": "নন্দুয়ার",
    "nameEn": ""
  },
  {
    "id": 3337,
    "upazilaId": 346,
    "nameBn": "চেহেলগাজী",
    "nameEn": ""
  },
  {
    "id": 3338,
    "upazilaId": 346,
    "nameBn": "সুন্দরবন",
    "nameEn": ""
  },
  {
    "id": 3339,
    "upazilaId": 346,
    "nameBn": "ফাজিলপুর",
    "nameEn": ""
  },
  {
    "id": 3340,
    "upazilaId": 346,
    "nameBn": "শেখপুরা",
    "nameEn": ""
  },
  {
    "id": 3341,
    "upazilaId": 346,
    "nameBn": "শশরা",
    "nameEn": ""
  },
  {
    "id": 3342,
    "upazilaId": 346,
    "nameBn": "আউলিয়াপুর",
    "nameEn": ""
  },
  {
    "id": 3343,
    "upazilaId": 346,
    "nameBn": "উথরাইল",
    "nameEn": ""
  },
  {
    "id": 3344,
    "upazilaId": 346,
    "nameBn": "শংকরপুর",
    "nameEn": ""
  },
  {
    "id": 3345,
    "upazilaId": 346,
    "nameBn": "আস্করপুর",
    "nameEn": ""
  },
  {
    "id": 3346,
    "upazilaId": 346,
    "nameBn": "কমলপুর",
    "nameEn": ""
  },
  {
    "id": 3347,
    "upazilaId": 347,
    "nameBn": "মুকুন্দপুর",
    "nameEn": ""
  },
  {
    "id": 3348,
    "upazilaId": 347,
    "nameBn": "কাটলা",
    "nameEn": ""
  },
  {
    "id": 3349,
    "upazilaId": 347,
    "nameBn": "খানপুর",
    "nameEn": ""
  },
  {
    "id": 3350,
    "upazilaId": 347,
    "nameBn": "দিওড়",
    "nameEn": ""
  },
  {
    "id": 3351,
    "upazilaId": 347,
    "nameBn": "বিনাইল",
    "nameEn": ""
  },
  {
    "id": 3352,
    "upazilaId": 347,
    "nameBn": "জোতবানী",
    "nameEn": ""
  },
  {
    "id": 3353,
    "upazilaId": 348,
    "nameBn": "আলোকঝাড়ী",
    "nameEn": ""
  },
  {
    "id": 3354,
    "upazilaId": 348,
    "nameBn": "ভেড়ভেড়ী",
    "nameEn": ""
  },
  {
    "id": 3355,
    "upazilaId": 348,
    "nameBn": "আঙ্গারপাড়া",
    "nameEn": ""
  },
  {
    "id": 3356,
    "upazilaId": 348,
    "nameBn": "খামারপাড়া",
    "nameEn": ""
  },
  {
    "id": 3357,
    "upazilaId": 348,
    "nameBn": "ভাবকী",
    "nameEn": ""
  },
  {
    "id": 3358,
    "upazilaId": 348,
    "nameBn": "গোয়ালডিহি",
    "nameEn": ""
  },
  {
    "id": 3359,
    "upazilaId": 349,
    "nameBn": "শিবরামপুর",
    "nameEn": ""
  },
  {
    "id": 3360,
    "upazilaId": 349,
    "nameBn": "পলাশবাড়ী",
    "nameEn": ""
  },
  {
    "id": 3361,
    "upazilaId": 349,
    "nameBn": "শতগ্রাম",
    "nameEn": ""
  },
  {
    "id": 3362,
    "upazilaId": 349,
    "nameBn": "পাল্টাপুর",
    "nameEn": ""
  },
  {
    "id": 3363,
    "upazilaId": 349,
    "nameBn": "সুজালপুর",
    "nameEn": ""
  },
  {
    "id": 3364,
    "upazilaId": 349,
    "nameBn": "নিজপাড়া",
    "nameEn": ""
  },
  {
    "id": 3365,
    "upazilaId": 349,
    "nameBn": "মোহাম্মদপুর",
    "nameEn": ""
  },
  {
    "id": 3366,
    "upazilaId": 349,
    "nameBn": "ভোগনগর",
    "nameEn": ""
  },
  {
    "id": 3367,
    "upazilaId": 349,
    "nameBn": "সাতোর",
    "nameEn": ""
  },
  {
    "id": 3368,
    "upazilaId": 349,
    "nameBn": "মোহনপুর",
    "nameEn": ""
  },
  {
    "id": 3369,
    "upazilaId": 349,
    "nameBn": "মরিচা",
    "nameEn": ""
  },
  {
    "id": 3370,
    "upazilaId": 349,
    "nameBn": "গোলাপগঞ্জ (প্রস্তাবিত)",
    "nameEn": ""
  },
  {
    "id": 3371,
    "upazilaId": 350,
    "nameBn": "নাফানগর",
    "nameEn": ""
  },
  {
    "id": 3372,
    "upazilaId": 350,
    "nameBn": "ইশানিয়া",
    "nameEn": ""
  },
  {
    "id": 3373,
    "upazilaId": 350,
    "nameBn": "মুর্শিদহাট",
    "nameEn": ""
  },
  {
    "id": 3374,
    "upazilaId": 350,
    "nameBn": "আটগাঁও",
    "nameEn": ""
  },
  {
    "id": 3375,
    "upazilaId": 350,
    "nameBn": "ছাতইল",
    "nameEn": ""
  },
  {
    "id": 3376,
    "upazilaId": 350,
    "nameBn": "রনগাও",
    "nameEn": ""
  },
  {
    "id": 3377,
    "upazilaId": 330,
    "nameBn": "এলুয়াড়ী",
    "nameEn": ""
  },
  {
    "id": 3378,
    "upazilaId": 330,
    "nameBn": "আলাদীপুর",
    "nameEn": ""
  },
  {
    "id": 3379,
    "upazilaId": 330,
    "nameBn": "কাজিহাল",
    "nameEn": ""
  },
  {
    "id": 3380,
    "upazilaId": 330,
    "nameBn": "বেতদিঘী",
    "nameEn": ""
  },
  {
    "id": 3381,
    "upazilaId": 330,
    "nameBn": "খয়েরবাড়ী",
    "nameEn": ""
  },
  {
    "id": 3382,
    "upazilaId": 330,
    "nameBn": "দৌলতপুর",
    "nameEn": ""
  },
  {
    "id": 3383,
    "upazilaId": 330,
    "nameBn": "শিবনগর",
    "nameEn": ""
  },
  {
    "id": 3384,
    "upazilaId": 351,
    "nameBn": "নশরতপুর",
    "nameEn": ""
  },
  {
    "id": 3385,
    "upazilaId": 351,
    "nameBn": "সাতনালা",
    "nameEn": ""
  },
  {
    "id": 3386,
    "upazilaId": 351,
    "nameBn": "ফতেজংপুর",
    "nameEn": ""
  },
  {
    "id": 3387,
    "upazilaId": 351,
    "nameBn": "ইসবপুর",
    "nameEn": ""
  },
  {
    "id": 3388,
    "upazilaId": 351,
    "nameBn": "আব্দুলপুর",
    "nameEn": ""
  },
  {
    "id": 3389,
    "upazilaId": 351,
    "nameBn": "অমরপুর",
    "nameEn": ""
  },
  {
    "id": 3390,
    "upazilaId": 351,
    "nameBn": "আউলিয়াপুকুর",
    "nameEn": ""
  },
  {
    "id": 3391,
    "upazilaId": 351,
    "nameBn": "সাইতারা",
    "nameEn": ""
  },
  {
    "id": 3392,
    "upazilaId": 351,
    "nameBn": "ভিয়াইল",
    "nameEn": ""
  },
  {
    "id": 3393,
    "upazilaId": 351,
    "nameBn": "পুনট্টি",
    "nameEn": ""
  },
  {
    "id": 3394,
    "upazilaId": 351,
    "nameBn": "তেতুলিয়া",
    "nameEn": ""
  },
  {
    "id": 3395,
    "upazilaId": 351,
    "nameBn": "আলোকডিহি",
    "nameEn": ""
  },
  {
    "id": 3396,
    "upazilaId": 352,
    "nameBn": "বুলাকিপুর",
    "nameEn": ""
  },
  {
    "id": 3397,
    "upazilaId": 352,
    "nameBn": "পালশা",
    "nameEn": ""
  },
  {
    "id": 3398,
    "upazilaId": 352,
    "nameBn": "সিংড়া",
    "nameEn": ""
  },
  {
    "id": 3399,
    "upazilaId": 352,
    "nameBn": "ঘোড়াঘাট",
    "nameEn": ""
  },
  {
    "id": 3400,
    "upazilaId": 353,
    "nameBn": "খট্টামাধবপাড়া",
    "nameEn": ""
  },
  {
    "id": 3401,
    "upazilaId": 353,
    "nameBn": "বোয়ালদাড়",
    "nameEn": ""
  },
  {
    "id": 3402,
    "upazilaId": 353,
    "nameBn": "আলীহাট",
    "nameEn": ""
  },
  {
    "id": 3403,
    "upazilaId": 354,
    "nameBn": "ডাবর",
    "nameEn": ""
  },
  {
    "id": 3404,
    "upazilaId": 354,
    "nameBn": "রসুলপুর",
    "nameEn": ""
  },
  {
    "id": 3405,
    "upazilaId": 354,
    "nameBn": "মুকুন্দপুর",
    "nameEn": ""
  },
  {
    "id": 3406,
    "upazilaId": 354,
    "nameBn": "তারগাঁও",
    "nameEn": ""
  },
  {
    "id": 3407,
    "upazilaId": 354,
    "nameBn": "সুন্দরপুর",
    "nameEn": ""
  },
  {
    "id": 3408,
    "upazilaId": 354,
    "nameBn": "রামচন্দ্রপুর",
    "nameEn": ""
  },
  {
    "id": 3409,
    "upazilaId": 197,
    "nameBn": "জয়পুর",
    "nameEn": ""
  },
  {
    "id": 3410,
    "upazilaId": 197,
    "nameBn": "বিনোদনগর",
    "nameEn": ""
  },
  {
    "id": 3411,
    "upazilaId": 197,
    "nameBn": "গোলাপগঞ্জ",
    "nameEn": ""
  },
  {
    "id": 3412,
    "upazilaId": 197,
    "nameBn": "শালখুরিয়া",
    "nameEn": ""
  },
  {
    "id": 3413,
    "upazilaId": 197,
    "nameBn": "পুটিমারা",
    "nameEn": ""
  },
  {
    "id": 3414,
    "upazilaId": 197,
    "nameBn": "ভাদুরিয়া",
    "nameEn": ""
  },
  {
    "id": 3415,
    "upazilaId": 197,
    "nameBn": "দাউদপুর",
    "nameEn": ""
  },
  {
    "id": 3416,
    "upazilaId": 197,
    "nameBn": "মাহামুদপুর",
    "nameEn": ""
  },
  {
    "id": 3417,
    "upazilaId": 197,
    "nameBn": "কুশদহ",
    "nameEn": ""
  },
  {
    "id": 3418,
    "upazilaId": 355,
    "nameBn": "বেলাইচন্ডি",
    "nameEn": ""
  },
  {
    "id": 3419,
    "upazilaId": 355,
    "nameBn": "মন্মথপুর",
    "nameEn": ""
  },
  {
    "id": 3420,
    "upazilaId": 355,
    "nameBn": "চন্ডিপুর",
    "nameEn": ""
  },
  {
    "id": 3421,
    "upazilaId": 355,
    "nameBn": "পলাশবাড়ী",
    "nameEn": ""
  },
  {
    "id": 3422,
    "upazilaId": 355,
    "nameBn": "মোমিনপুর",
    "nameEn": ""
  },
  {
    "id": 3423,
    "upazilaId": 355,
    "nameBn": "মোস্তফাপুর",
    "nameEn": ""
  },
  {
    "id": 3424,
    "upazilaId": 355,
    "nameBn": "রামপুর",
    "nameEn": ""
  },
  {
    "id": 3425,
    "upazilaId": 355,
    "nameBn": "হরিরামপুর",
    "nameEn": ""
  },
  {
    "id": 3426,
    "upazilaId": 355,
    "nameBn": "হাবড়া",
    "nameEn": ""
  },
  {
    "id": 3427,
    "upazilaId": 355,
    "nameBn": "হামিদপুর",
    "nameEn": ""
  },
  {
    "id": 3428,
    "upazilaId": 356,
    "nameBn": "বিরল",
    "nameEn": ""
  },
  {
    "id": 3429,
    "upazilaId": 356,
    "nameBn": "আজিমপুর",
    "nameEn": ""
  },
  {
    "id": 3430,
    "upazilaId": 356,
    "nameBn": "ফরক্কাবাদ",
    "nameEn": ""
  },
  {
    "id": 3431,
    "upazilaId": 356,
    "nameBn": "ধামইর",
    "nameEn": ""
  },
  {
    "id": 3432,
    "upazilaId": 356,
    "nameBn": "শহরগ্রাম",
    "nameEn": ""
  },
  {
    "id": 3433,
    "upazilaId": 356,
    "nameBn": "ভান্ডারা",
    "nameEn": ""
  },
  {
    "id": 3434,
    "upazilaId": 356,
    "nameBn": "বিজোড়া",
    "nameEn": ""
  },
  {
    "id": 3435,
    "upazilaId": 356,
    "nameBn": "ধর্মপুর",
    "nameEn": ""
  },
  {
    "id": 3436,
    "upazilaId": 356,
    "nameBn": "মঙ্গলপুর",
    "nameEn": ""
  },
  {
    "id": 3437,
    "upazilaId": 356,
    "nameBn": "রানীপুকুর",
    "nameEn": ""
  },
  {
    "id": 3438,
    "upazilaId": 356,
    "nameBn": "পলাশবাড়ী",
    "nameEn": ""
  },
  {
    "id": 3439,
    "upazilaId": 356,
    "nameBn": "রাজারামপুর",
    "nameEn": ""
  },
  {
    "id": 3440,
    "upazilaId": 357,
    "nameBn": "চওড়া বড়গাছা",
    "nameEn": ""
  },
  {
    "id": 3441,
    "upazilaId": 357,
    "nameBn": "গোড়গ্রাম",
    "nameEn": ""
  },
  {
    "id": 3442,
    "upazilaId": 357,
    "nameBn": "খোকশাবাড়ী",
    "nameEn": ""
  },
  {
    "id": 3443,
    "upazilaId": 357,
    "nameBn": "পলাশবাড়ী",
    "nameEn": ""
  },
  {
    "id": 3444,
    "upazilaId": 357,
    "nameBn": "রামনগর",
    "nameEn": ""
  },
  {
    "id": 3445,
    "upazilaId": 357,
    "nameBn": "কচুকাটা",
    "nameEn": ""
  },
  {
    "id": 3446,
    "upazilaId": 357,
    "nameBn": "পঞ্চপুকুর",
    "nameEn": ""
  },
  {
    "id": 3447,
    "upazilaId": 357,
    "nameBn": "ইটাখোলা",
    "nameEn": ""
  },
  {
    "id": 3448,
    "upazilaId": 357,
    "nameBn": "কুন্দুপুকুর",
    "nameEn": ""
  },
  {
    "id": 3449,
    "upazilaId": 357,
    "nameBn": "সোনারায়",
    "nameEn": ""
  },
  {
    "id": 3450,
    "upazilaId": 357,
    "nameBn": "সংগলশী",
    "nameEn": ""
  },
  {
    "id": 3451,
    "upazilaId": 357,
    "nameBn": "চড়াইখোলা",
    "nameEn": ""
  },
  {
    "id": 3452,
    "upazilaId": 357,
    "nameBn": "চাপড়া সরঞ্জানী",
    "nameEn": ""
  },
  {
    "id": 3453,
    "upazilaId": 357,
    "nameBn": "টুপামারী",
    "nameEn": ""
  },
  {
    "id": 3454,
    "upazilaId": 357,
    "nameBn": "লক্ষীচাপ",
    "nameEn": ""
  },
  {
    "id": 3455,
    "upazilaId": 358,
    "nameBn": "ডোমার সদর",
    "nameEn": ""
  },
  {
    "id": 3456,
    "upazilaId": 358,
    "nameBn": "বোড়াগাড়ী",
    "nameEn": ""
  },
  {
    "id": 3457,
    "upazilaId": 358,
    "nameBn": "জোড়াবাড়ী",
    "nameEn": ""
  },
  {
    "id": 3458,
    "upazilaId": 358,
    "nameBn": "বামুনিয়া",
    "nameEn": ""
  },
  {
    "id": 3459,
    "upazilaId": 358,
    "nameBn": "পাংগা মটকপুর",
    "nameEn": ""
  },
  {
    "id": 3460,
    "upazilaId": 358,
    "nameBn": "সোনারায়",
    "nameEn": ""
  },
  {
    "id": 3461,
    "upazilaId": 358,
    "nameBn": "হরিণচড়া",
    "nameEn": ""
  },
  {
    "id": 3462,
    "upazilaId": 358,
    "nameBn": "ভোগডাবুড়ী",
    "nameEn": ""
  },
  {
    "id": 3463,
    "upazilaId": 358,
    "nameBn": "কেতকীবাড়ী",
    "nameEn": ""
  },
  {
    "id": 3464,
    "upazilaId": 358,
    "nameBn": "গোমনাতি",
    "nameEn": ""
  },
  {
    "id": 3465,
    "upazilaId": 359,
    "nameBn": "পশ্চিম ছাতনাই",
    "nameEn": ""
  },
  {
    "id": 3466,
    "upazilaId": 359,
    "nameBn": "বালাপাড়া",
    "nameEn": ""
  },
  {
    "id": 3467,
    "upazilaId": 359,
    "nameBn": "ডিমলা",
    "nameEn": ""
  },
  {
    "id": 3468,
    "upazilaId": 359,
    "nameBn": "খগাখড়িবাড়ী",
    "nameEn": ""
  },
  {
    "id": 3469,
    "upazilaId": 359,
    "nameBn": "গয়াবাড়ী",
    "nameEn": ""
  },
  {
    "id": 3470,
    "upazilaId": 359,
    "nameBn": "নাউতারা",
    "nameEn": ""
  },
  {
    "id": 3471,
    "upazilaId": 359,
    "nameBn": "খালিশা চাপানী",
    "nameEn": ""
  },
  {
    "id": 3472,
    "upazilaId": 359,
    "nameBn": "ঝুনাগাছ চাপানী",
    "nameEn": ""
  },
  {
    "id": 3473,
    "upazilaId": 359,
    "nameBn": "টেপাখড়িবাড়ী ও পূর্ব ছাতনাই",
    "nameEn": ""
  },
  {
    "id": 3474,
    "upazilaId": 360,
    "nameBn": "গোলমুন্ডা",
    "nameEn": ""
  },
  {
    "id": 3475,
    "upazilaId": 360,
    "nameBn": "মীরগঞ্জ",
    "nameEn": ""
  },
  {
    "id": 3476,
    "upazilaId": 360,
    "nameBn": "ডাউয়াবাড়ী",
    "nameEn": ""
  },
  {
    "id": 3477,
    "upazilaId": 360,
    "nameBn": "বালাগ্রাম",
    "nameEn": ""
  },
  {
    "id": 3478,
    "upazilaId": 360,
    "nameBn": "গোলনা",
    "nameEn": ""
  },
  {
    "id": 3479,
    "upazilaId": 360,
    "nameBn": "ধর্মপাল",
    "nameEn": ""
  },
  {
    "id": 3480,
    "upazilaId": 360,
    "nameBn": "শিমুলবাড়ী",
    "nameEn": ""
  },
  {
    "id": 3481,
    "upazilaId": 360,
    "nameBn": "কাঁঠালী",
    "nameEn": ""
  },
  {
    "id": 3482,
    "upazilaId": 360,
    "nameBn": "খুটামারা",
    "nameEn": ""
  },
  {
    "id": 3483,
    "upazilaId": 360,
    "nameBn": "শৌলমারী",
    "nameEn": ""
  },
  {
    "id": 3484,
    "upazilaId": 360,
    "nameBn": "কৈমারী",
    "nameEn": ""
  },
  {
    "id": 3485,
    "upazilaId": 361,
    "nameBn": "বড়ভিটা",
    "nameEn": ""
  },
  {
    "id": 3486,
    "upazilaId": 361,
    "nameBn": "পুটিমারী",
    "nameEn": ""
  },
  {
    "id": 3487,
    "upazilaId": 361,
    "nameBn": "নিতাই",
    "nameEn": ""
  },
  {
    "id": 3488,
    "upazilaId": 361,
    "nameBn": "বাহাগিলী",
    "nameEn": ""
  },
  {
    "id": 3489,
    "upazilaId": 361,
    "nameBn": "চাঁদখানা",
    "nameEn": ""
  },
  {
    "id": 3490,
    "upazilaId": 361,
    "nameBn": "কিশোরগঞ্জ সদর",
    "nameEn": ""
  },
  {
    "id": 3491,
    "upazilaId": 361,
    "nameBn": "রণচণ্ডি",
    "nameEn": ""
  },
  {
    "id": 3492,
    "upazilaId": 361,
    "nameBn": "গাড়াগ্রাম",
    "nameEn": ""
  },
  {
    "id": 3493,
    "upazilaId": 361,
    "nameBn": "মাগুড়া",
    "nameEn": ""
  },
  {
    "id": 3494,
    "upazilaId": 362,
    "nameBn": "কামারপুকুর",
    "nameEn": ""
  },
  {
    "id": 3495,
    "upazilaId": 362,
    "nameBn": "কাশিরামবেলপুকুর",
    "nameEn": ""
  },
  {
    "id": 3496,
    "upazilaId": 362,
    "nameBn": "বাঙ্গালীপুর",
    "nameEn": ""
  },
  {
    "id": 3497,
    "upazilaId": 362,
    "nameBn": "বোতলাগাড়ী",
    "nameEn": ""
  },
  {
    "id": 3498,
    "upazilaId": 362,
    "nameBn": "খাতামধুপুর",
    "nameEn": ""
  },
  {
    "id": 3499,
    "upazilaId": 363,
    "nameBn": "মির্জাপুর",
    "nameEn": ""
  },
  {
    "id": 3500,
    "upazilaId": 363,
    "nameBn": "তোড়িয়া",
    "nameEn": ""
  },
  {
    "id": 3501,
    "upazilaId": 363,
    "nameBn": "আলোয়াখোয়া",
    "nameEn": ""
  },
  {
    "id": 3502,
    "upazilaId": 363,
    "nameBn": "রাধানগর",
    "nameEn": ""
  },
  {
    "id": 3503,
    "upazilaId": 363,
    "nameBn": "বলরামপুর",
    "nameEn": ""
  },
  {
    "id": 3504,
    "upazilaId": 363,
    "nameBn": "ধামোর",
    "nameEn": ""
  },
  {
    "id": 3505,
    "upazilaId": 364,
    "nameBn": "বাংলাবান্ধা",
    "nameEn": ""
  },
  {
    "id": 3506,
    "upazilaId": 364,
    "nameBn": "তিরনইহাট",
    "nameEn": ""
  },
  {
    "id": 3507,
    "upazilaId": 364,
    "nameBn": "তেতুলিয়া",
    "nameEn": ""
  },
  {
    "id": 3508,
    "upazilaId": 364,
    "nameBn": "শালবাহান",
    "nameEn": ""
  },
  {
    "id": 3509,
    "upazilaId": 364,
    "nameBn": "বুড়াবুড়ি",
    "nameEn": ""
  },
  {
    "id": 3510,
    "upazilaId": 364,
    "nameBn": "ভজনপুর",
    "nameEn": ""
  },
  {
    "id": 3511,
    "upazilaId": 364,
    "nameBn": "দেবনগর",
    "nameEn": ""
  },
  {
    "id": 3512,
    "upazilaId": 365,
    "nameBn": "চিলাহাটি",
    "nameEn": ""
  },
  {
    "id": 3513,
    "upazilaId": 365,
    "nameBn": "শালডাঙ্গা",
    "nameEn": ""
  },
  {
    "id": 3514,
    "upazilaId": 365,
    "nameBn": "দেবীগঞ্জ",
    "nameEn": ""
  },
  {
    "id": 3515,
    "upazilaId": 365,
    "nameBn": "পামুলী",
    "nameEn": ""
  },
  {
    "id": 3516,
    "upazilaId": 365,
    "nameBn": "সুন্দরদিঘী",
    "nameEn": ""
  },
  {
    "id": 3517,
    "upazilaId": 365,
    "nameBn": "সোনাহার",
    "nameEn": ""
  },
  {
    "id": 3518,
    "upazilaId": 365,
    "nameBn": "টেপ্রীগঞ্জ",
    "nameEn": ""
  },
  {
    "id": 3519,
    "upazilaId": 365,
    "nameBn": "দন্ডপাল",
    "nameEn": ""
  },
  {
    "id": 3520,
    "upazilaId": 365,
    "nameBn": "দেবীডুবা",
    "nameEn": ""
  },
  {
    "id": 3521,
    "upazilaId": 365,
    "nameBn": "চেংঠী হাজরাডাঙ্গা",
    "nameEn": ""
  },
  {
    "id": 3522,
    "upazilaId": 366,
    "nameBn": "অমরখানা",
    "nameEn": ""
  },
  {
    "id": 3523,
    "upazilaId": 366,
    "nameBn": "হাফিজাবাদ",
    "nameEn": ""
  },
  {
    "id": 3524,
    "upazilaId": 366,
    "nameBn": "পঞ্চগড় সদর",
    "nameEn": ""
  },
  {
    "id": 3525,
    "upazilaId": 366,
    "nameBn": "কামাত কাজল দীঘি",
    "nameEn": ""
  },
  {
    "id": 3526,
    "upazilaId": 366,
    "nameBn": "চাকলাহাট",
    "nameEn": ""
  },
  {
    "id": 3527,
    "upazilaId": 366,
    "nameBn": "সাতমেরা",
    "nameEn": ""
  },
  {
    "id": 3528,
    "upazilaId": 366,
    "nameBn": "হাড়িভাসা",
    "nameEn": ""
  },
  {
    "id": 3529,
    "upazilaId": 366,
    "nameBn": "ধাক্কামারা",
    "nameEn": ""
  },
  {
    "id": 3530,
    "upazilaId": 366,
    "nameBn": "মাগুরা",
    "nameEn": ""
  },
  {
    "id": 3531,
    "upazilaId": 366,
    "nameBn": "গরিনাবাড়ী",
    "nameEn": ""
  },
  {
    "id": 3532,
    "upazilaId": 367,
    "nameBn": "ঝলইশালশিরি",
    "nameEn": ""
  },
  {
    "id": 3533,
    "upazilaId": 367,
    "nameBn": "ময়দানদিঘি",
    "nameEn": ""
  },
  {
    "id": 3534,
    "upazilaId": 367,
    "nameBn": "বেংহারি",
    "nameEn": ""
  },
  {
    "id": 3535,
    "upazilaId": 367,
    "nameBn": "কাজলদিঘী কালিয়াগঞ্জ",
    "nameEn": ""
  },
  {
    "id": 3536,
    "upazilaId": 367,
    "nameBn": "বড়শশী",
    "nameEn": ""
  },
  {
    "id": 3537,
    "upazilaId": 367,
    "nameBn": "মাড়েয়া",
    "nameEn": ""
  },
  {
    "id": 3538,
    "upazilaId": 367,
    "nameBn": "চন্দনবাড়ী",
    "nameEn": ""
  },
  {
    "id": 3539,
    "upazilaId": 367,
    "nameBn": "বোদা",
    "nameEn": ""
  },
  {
    "id": 3540,
    "upazilaId": 367,
    "nameBn": "সাকোয়া",
    "nameEn": ""
  },
  {
    "id": 3541,
    "upazilaId": 367,
    "nameBn": "পাঁচপীর",
    "nameEn": ""
  },
  {
    "id": 3542,
    "upazilaId": 368,
    "nameBn": "সারাই",
    "nameEn": ""
  },
  {
    "id": 3543,
    "upazilaId": 368,
    "nameBn": "হারাগাছ",
    "nameEn": ""
  },
  {
    "id": 3544,
    "upazilaId": 368,
    "nameBn": "কুর্শা",
    "nameEn": ""
  },
  {
    "id": 3545,
    "upazilaId": 368,
    "nameBn": "শহীদবাগ",
    "nameEn": ""
  },
  {
    "id": 3546,
    "upazilaId": 368,
    "nameBn": "বালাপারা",
    "nameEn": ""
  },
  {
    "id": 3547,
    "upazilaId": 368,
    "nameBn": "টেপামধুপুর",
    "nameEn": ""
  },
  {
    "id": 3548,
    "upazilaId": 369,
    "nameBn": "বেতগাড়ী",
    "nameEn": ""
  },
  {
    "id": 3549,
    "upazilaId": 369,
    "nameBn": "খলেয়া",
    "nameEn": ""
  },
  {
    "id": 3550,
    "upazilaId": 369,
    "nameBn": "বড়বিল",
    "nameEn": ""
  },
  {
    "id": 3551,
    "upazilaId": 369,
    "nameBn": "কোলকোন্দ",
    "nameEn": ""
  },
  {
    "id": 3552,
    "upazilaId": 369,
    "nameBn": "লক্ষীটারী",
    "nameEn": ""
  },
  {
    "id": 3553,
    "upazilaId": 369,
    "nameBn": "গংগাচড়া",
    "nameEn": ""
  },
  {
    "id": 3554,
    "upazilaId": 369,
    "nameBn": "গজঘন্টা",
    "nameEn": ""
  },
  {
    "id": 3555,
    "upazilaId": 369,
    "nameBn": "মর্ণেয়া",
    "nameEn": ""
  },
  {
    "id": 3556,
    "upazilaId": 369,
    "nameBn": "আলমবিদিতর",
    "nameEn": ""
  },
  {
    "id": 3557,
    "upazilaId": 369,
    "nameBn": "নোহালী",
    "nameEn": ""
  },
  {
    "id": 3558,
    "upazilaId": 370,
    "nameBn": "আলমপুর",
    "nameEn": ""
  },
  {
    "id": 3559,
    "upazilaId": 370,
    "nameBn": "কুর্শা",
    "nameEn": ""
  },
  {
    "id": 3560,
    "upazilaId": 370,
    "nameBn": "ইকরচালী",
    "nameEn": ""
  },
  {
    "id": 3561,
    "upazilaId": 370,
    "nameBn": "হাড়িয়ারকুঠি",
    "nameEn": ""
  },
  {
    "id": 3562,
    "upazilaId": 370,
    "nameBn": "সয়ার",
    "nameEn": ""
  },
  {
    "id": 3563,
    "upazilaId": 343,
    "nameBn": "চৈত্রকোল",
    "nameEn": ""
  },
  {
    "id": 3564,
    "upazilaId": 343,
    "nameBn": "ভেন্ডাবাড়ী",
    "nameEn": ""
  },
  {
    "id": 3565,
    "upazilaId": 343,
    "nameBn": "বড়দরগাহ্",
    "nameEn": ""
  },
  {
    "id": 3566,
    "upazilaId": 343,
    "nameBn": "কুমেদপুর",
    "nameEn": ""
  },
  {
    "id": 3567,
    "upazilaId": 343,
    "nameBn": "মদনখালী",
    "nameEn": ""
  },
  {
    "id": 3568,
    "upazilaId": 343,
    "nameBn": "টুকুরিয়া",
    "nameEn": ""
  },
  {
    "id": 3569,
    "upazilaId": 343,
    "nameBn": "বড়আলমপুর",
    "nameEn": ""
  },
  {
    "id": 3570,
    "upazilaId": 343,
    "nameBn": "রায়পুর",
    "nameEn": ""
  },
  {
    "id": 3571,
    "upazilaId": 343,
    "nameBn": "শানেরহাট",
    "nameEn": ""
  },
  {
    "id": 3572,
    "upazilaId": 343,
    "nameBn": "পাঁচগাছী",
    "nameEn": ""
  },
  {
    "id": 3573,
    "upazilaId": 343,
    "nameBn": "মিঠিপুর",
    "nameEn": ""
  },
  {
    "id": 3574,
    "upazilaId": 343,
    "nameBn": "রামনাথপুর",
    "nameEn": ""
  },
  {
    "id": 3575,
    "upazilaId": 343,
    "nameBn": "চতরা",
    "nameEn": ""
  },
  {
    "id": 3576,
    "upazilaId": 343,
    "nameBn": "কাবিলপুর",
    "nameEn": ""
  },
  {
    "id": 3577,
    "upazilaId": 371,
    "nameBn": "কল্যাণী",
    "nameEn": ""
  },
  {
    "id": 3578,
    "upazilaId": 371,
    "nameBn": "পারুল",
    "nameEn": ""
  },
  {
    "id": 3579,
    "upazilaId": 371,
    "nameBn": "ইটাকুমারী",
    "nameEn": ""
  },
  {
    "id": 3580,
    "upazilaId": 371,
    "nameBn": "অন্নদানগর",
    "nameEn": ""
  },
  {
    "id": 3581,
    "upazilaId": 371,
    "nameBn": "ছাওলা তাম্বুলপুর",
    "nameEn": ""
  },
  {
    "id": 3582,
    "upazilaId": 371,
    "nameBn": "পীরগাছা",
    "nameEn": ""
  },
  {
    "id": 3583,
    "upazilaId": 371,
    "nameBn": "কৈকুড়ী",
    "nameEn": ""
  },
  {
    "id": 3584,
    "upazilaId": 371,
    "nameBn": "কান্দি",
    "nameEn": ""
  },
  {
    "id": 3585,
    "upazilaId": 372,
    "nameBn": "রাধানগর",
    "nameEn": ""
  },
  {
    "id": 3586,
    "upazilaId": 372,
    "nameBn": "গোপীনাথপুর রামনাথপুর",
    "nameEn": ""
  },
  {
    "id": 3587,
    "upazilaId": 372,
    "nameBn": "দামোদরপুর",
    "nameEn": ""
  },
  {
    "id": 3588,
    "upazilaId": 372,
    "nameBn": "মধুপুর",
    "nameEn": ""
  },
  {
    "id": 3589,
    "upazilaId": 372,
    "nameBn": "গোপালপুর",
    "nameEn": ""
  },
  {
    "id": 3590,
    "upazilaId": 372,
    "nameBn": "কুতুবপুর",
    "nameEn": ""
  },
  {
    "id": 3591,
    "upazilaId": 372,
    "nameBn": "কালুপাড়া",
    "nameEn": ""
  },
  {
    "id": 3592,
    "upazilaId": 372,
    "nameBn": "বিষ্ণপুর",
    "nameEn": ""
  },
  {
    "id": 3593,
    "upazilaId": 372,
    "nameBn": "লোহানীপাড়া",
    "nameEn": ""
  },
  {
    "id": 3594,
    "upazilaId": 373,
    "nameBn": "ইমাদপুর",
    "nameEn": ""
  },
  {
    "id": 3595,
    "upazilaId": 373,
    "nameBn": "কাফ্রিখাল",
    "nameEn": ""
  },
  {
    "id": 3596,
    "upazilaId": 373,
    "nameBn": "খোড়াগাছ",
    "nameEn": ""
  },
  {
    "id": 3597,
    "upazilaId": 373,
    "nameBn": "গোপালপুর",
    "nameEn": ""
  },
  {
    "id": 3598,
    "upazilaId": 373,
    "nameBn": "মিঠাপুকুর",
    "nameEn": ""
  },
  {
    "id": 3599,
    "upazilaId": 373,
    "nameBn": "চেংমারী",
    "nameEn": ""
  },
  {
    "id": 3600,
    "upazilaId": 373,
    "nameBn": "দুর্গাপুর",
    "nameEn": ""
  },
  {
    "id": 3601,
    "upazilaId": 373,
    "nameBn": "পায়রাবন্দ",
    "nameEn": ""
  },
  {
    "id": 3602,
    "upazilaId": 373,
    "nameBn": "বড় হযরতপুর",
    "nameEn": ""
  },
  {
    "id": 3603,
    "upazilaId": 373,
    "nameBn": "বড়বালা",
    "nameEn": ""
  },
  {
    "id": 3604,
    "upazilaId": 373,
    "nameBn": "বালারহাট",
    "nameEn": ""
  },
  {
    "id": 3605,
    "upazilaId": 373,
    "nameBn": "বালুয়া মাসিমপুর",
    "nameEn": ""
  },
  {
    "id": 3606,
    "upazilaId": 373,
    "nameBn": "ভাংনী",
    "nameEn": ""
  },
  {
    "id": 3607,
    "upazilaId": 373,
    "nameBn": "ময়েনপুর",
    "nameEn": ""
  },
  {
    "id": 3608,
    "upazilaId": 373,
    "nameBn": "মিলনপুর",
    "nameEn": ""
  },
  {
    "id": 3609,
    "upazilaId": 373,
    "nameBn": "মির্জাপুর",
    "nameEn": ""
  },
  {
    "id": 3610,
    "upazilaId": 373,
    "nameBn": "রাণীপুকুর",
    "nameEn": ""
  },
  {
    "id": 3611,
    "upazilaId": 373,
    "nameBn": "লতিফপুর",
    "nameEn": ""
  },
  {
    "id": 3612,
    "upazilaId": 374,
    "nameBn": "মমিনপুর",
    "nameEn": ""
  },
  {
    "id": 3613,
    "upazilaId": 374,
    "nameBn": "হরিদেবপুর",
    "nameEn": ""
  },
  {
    "id": 3614,
    "upazilaId": 374,
    "nameBn": "চন্দনপাট",
    "nameEn": ""
  },
  {
    "id": 3615,
    "upazilaId": 374,
    "nameBn": "সদ্যপুস্করনী",
    "nameEn": ""
  },
  {
    "id": 3616,
    "upazilaId": 374,
    "nameBn": "খলেয়া",
    "nameEn": ""
  },
  {
    "id": 3617,
    "upazilaId": 375,
    "nameBn": "কমলাবাড়ী",
    "nameEn": ""
  },
  {
    "id": 3618,
    "upazilaId": 375,
    "nameBn": "দুর্গাপুর",
    "nameEn": ""
  },
  {
    "id": 3619,
    "upazilaId": 375,
    "nameBn": "পলাশী",
    "nameEn": ""
  },
  {
    "id": 3620,
    "upazilaId": 375,
    "nameBn": "ভাদাই",
    "nameEn": ""
  },
  {
    "id": 3621,
    "upazilaId": 375,
    "nameBn": "ভেলাবাড়ী",
    "nameEn": ""
  },
  {
    "id": 3622,
    "upazilaId": 375,
    "nameBn": "মহিষখোচা",
    "nameEn": ""
  },
  {
    "id": 3623,
    "upazilaId": 375,
    "nameBn": "সাপটিবাড়ী",
    "nameEn": ""
  },
  {
    "id": 3624,
    "upazilaId": 375,
    "nameBn": "শরপুকুর",
    "nameEn": ""
  },
  {
    "id": 3625,
    "upazilaId": 20,
    "nameBn": "কাকিনা",
    "nameEn": ""
  },
  {
    "id": 3626,
    "upazilaId": 20,
    "nameBn": "গোড়ল",
    "nameEn": ""
  },
  {
    "id": 3627,
    "upazilaId": 20,
    "nameBn": "চন্দ্রপুর",
    "nameEn": ""
  },
  {
    "id": 3628,
    "upazilaId": 20,
    "nameBn": "চলবলা",
    "nameEn": ""
  },
  {
    "id": 3629,
    "upazilaId": 20,
    "nameBn": "তুষভান্ডার",
    "nameEn": ""
  },
  {
    "id": 3630,
    "upazilaId": 20,
    "nameBn": "দলগ্রাম",
    "nameEn": ""
  },
  {
    "id": 3631,
    "upazilaId": 20,
    "nameBn": "ভোটমারী",
    "nameEn": ""
  },
  {
    "id": 3632,
    "upazilaId": 20,
    "nameBn": "মদাতী",
    "nameEn": ""
  },
  {
    "id": 3633,
    "upazilaId": 376,
    "nameBn": "শ্রীরামপুর",
    "nameEn": ""
  },
  {
    "id": 3634,
    "upazilaId": 376,
    "nameBn": "জগতবেড়",
    "nameEn": ""
  },
  {
    "id": 3635,
    "upazilaId": 376,
    "nameBn": "পাটগ্রাম",
    "nameEn": ""
  },
  {
    "id": 3636,
    "upazilaId": 376,
    "nameBn": "বাউরা",
    "nameEn": ""
  },
  {
    "id": 3637,
    "upazilaId": 376,
    "nameBn": "কুচলীবাড়ী",
    "nameEn": ""
  },
  {
    "id": 3638,
    "upazilaId": 376,
    "nameBn": "জোংড়া",
    "nameEn": ""
  },
  {
    "id": 3639,
    "upazilaId": 376,
    "nameBn": "দহগ্রাম",
    "nameEn": ""
  },
  {
    "id": 3640,
    "upazilaId": 376,
    "nameBn": "বুড়িমারী",
    "nameEn": ""
  },
  {
    "id": 3641,
    "upazilaId": 377,
    "nameBn": "মোগলহাট",
    "nameEn": ""
  },
  {
    "id": 3642,
    "upazilaId": 377,
    "nameBn": "কুলাঘাট",
    "nameEn": ""
  },
  {
    "id": 3643,
    "upazilaId": 377,
    "nameBn": "মহেন্দ্রনগর",
    "nameEn": ""
  },
  {
    "id": 3644,
    "upazilaId": 377,
    "nameBn": "হারাটি",
    "nameEn": ""
  },
  {
    "id": 3645,
    "upazilaId": 377,
    "nameBn": "খুনিয়াগাছ",
    "nameEn": ""
  },
  {
    "id": 3646,
    "upazilaId": 377,
    "nameBn": "রাজপুর",
    "nameEn": ""
  },
  {
    "id": 3647,
    "upazilaId": 377,
    "nameBn": "গোকুন্ডা",
    "nameEn": ""
  },
  {
    "id": 3648,
    "upazilaId": 377,
    "nameBn": "পঞ্চগ্রাম",
    "nameEn": ""
  },
  {
    "id": 3649,
    "upazilaId": 377,
    "nameBn": "বড়বাড়ী",
    "nameEn": ""
  },
  {
    "id": 3650,
    "upazilaId": 378,
    "nameBn": "বড়খাতা",
    "nameEn": ""
  },
  {
    "id": 3651,
    "upazilaId": 378,
    "nameBn": "গড্ডিমারী",
    "nameEn": ""
  },
  {
    "id": 3652,
    "upazilaId": 378,
    "nameBn": "সিংগীমারী",
    "nameEn": ""
  },
  {
    "id": 3653,
    "upazilaId": 378,
    "nameBn": "টংভাঙ্গা",
    "nameEn": ""
  },
  {
    "id": 3654,
    "upazilaId": 378,
    "nameBn": "সিন্দুর্ণা",
    "nameEn": ""
  },
  {
    "id": 3655,
    "upazilaId": 378,
    "nameBn": "পাটিকাপাড়া",
    "nameEn": ""
  },
  {
    "id": 3656,
    "upazilaId": 378,
    "nameBn": "ডাউয়াবাড়ী",
    "nameEn": ""
  },
  {
    "id": 3657,
    "upazilaId": 378,
    "nameBn": "নওদাবাস",
    "nameEn": ""
  },
  {
    "id": 3658,
    "upazilaId": 378,
    "nameBn": "গোতামারী",
    "nameEn": ""
  },
  {
    "id": 3659,
    "upazilaId": 378,
    "nameBn": "ভেলাগুড়ি",
    "nameEn": ""
  },
  {
    "id": 3660,
    "upazilaId": 378,
    "nameBn": "সানিয়াজান",
    "nameEn": ""
  },
  {
    "id": 3661,
    "upazilaId": 378,
    "nameBn": "ফকিরপাড়া",
    "nameEn": ""
  },
  {
    "id": 3662,
    "upazilaId": 379,
    "nameBn": "আলাতুলী",
    "nameEn": ""
  },
  {
    "id": 3663,
    "upazilaId": 379,
    "nameBn": "বারঘরিয়া",
    "nameEn": ""
  },
  {
    "id": 3664,
    "upazilaId": 379,
    "nameBn": "মহারাজপুর",
    "nameEn": ""
  },
  {
    "id": 3665,
    "upazilaId": 379,
    "nameBn": "রাণীহাটি",
    "nameEn": ""
  },
  {
    "id": 3666,
    "upazilaId": 379,
    "nameBn": "বালিয়াডাঙ্গা",
    "nameEn": ""
  },
  {
    "id": 3667,
    "upazilaId": 379,
    "nameBn": "গোবরাতলা ঝিলিম",
    "nameEn": ""
  },
  {
    "id": 3668,
    "upazilaId": 379,
    "nameBn": "চরঅনুপনগর",
    "nameEn": ""
  },
  {
    "id": 3669,
    "upazilaId": 379,
    "nameBn": "দেবীনগর",
    "nameEn": ""
  },
  {
    "id": 3670,
    "upazilaId": 379,
    "nameBn": "শাহজাহানপুর",
    "nameEn": ""
  },
  {
    "id": 3671,
    "upazilaId": 379,
    "nameBn": "ইসলামপুর",
    "nameEn": ""
  },
  {
    "id": 3672,
    "upazilaId": 379,
    "nameBn": "চরবাগডাঙ্গা",
    "nameEn": ""
  },
  {
    "id": 3673,
    "upazilaId": 379,
    "nameBn": "নারায়ণপুর",
    "nameEn": ""
  },
  {
    "id": 3674,
    "upazilaId": 379,
    "nameBn": "সুন্দরপুর",
    "nameEn": ""
  },
  {
    "id": 3675,
    "upazilaId": 380,
    "nameBn": "রহনপুর",
    "nameEn": ""
  },
  {
    "id": 3676,
    "upazilaId": 380,
    "nameBn": "গোমস্তাপুর",
    "nameEn": ""
  },
  {
    "id": 3677,
    "upazilaId": 380,
    "nameBn": "চৌডালা",
    "nameEn": ""
  },
  {
    "id": 3678,
    "upazilaId": 380,
    "nameBn": "বোয়ালিয়া",
    "nameEn": ""
  },
  {
    "id": 3679,
    "upazilaId": 380,
    "nameBn": "পার্বতীপুর",
    "nameEn": ""
  },
  {
    "id": 3680,
    "upazilaId": 380,
    "nameBn": "রাধানগর",
    "nameEn": ""
  },
  {
    "id": 3681,
    "upazilaId": 380,
    "nameBn": "আলীনগর",
    "nameEn": ""
  },
  {
    "id": 3682,
    "upazilaId": 380,
    "nameBn": "বাঙ্গাবাড়ী",
    "nameEn": ""
  },
  {
    "id": 3683,
    "upazilaId": 381,
    "nameBn": "কসবা",
    "nameEn": ""
  },
  {
    "id": 3684,
    "upazilaId": 381,
    "nameBn": "ফতেপুর",
    "nameEn": ""
  },
  {
    "id": 3685,
    "upazilaId": 381,
    "nameBn": "নাচোল",
    "nameEn": ""
  },
  {
    "id": 3686,
    "upazilaId": 381,
    "nameBn": "নেজামপুর",
    "nameEn": ""
  },
  {
    "id": 3687,
    "upazilaId": 382,
    "nameBn": "ভোলাহাট",
    "nameEn": ""
  },
  {
    "id": 3688,
    "upazilaId": 382,
    "nameBn": "গোহালবাড়ী",
    "nameEn": ""
  },
  {
    "id": 3689,
    "upazilaId": 382,
    "nameBn": "দলদলী",
    "nameEn": ""
  },
  {
    "id": 3690,
    "upazilaId": 382,
    "nameBn": "জামবাড়িয়া",
    "nameEn": ""
  },
  {
    "id": 3691,
    "upazilaId": 383,
    "nameBn": "বিনোদপুর",
    "nameEn": ""
  },
  {
    "id": 3692,
    "upazilaId": 383,
    "nameBn": "চককির্তী",
    "nameEn": ""
  },
  {
    "id": 3693,
    "upazilaId": 383,
    "nameBn": "দাইপুকুরিয়া",
    "nameEn": ""
  },
  {
    "id": 3694,
    "upazilaId": 383,
    "nameBn": "ধাইনগর",
    "nameEn": ""
  },
  {
    "id": 3695,
    "upazilaId": 383,
    "nameBn": "দূর্লভপুর",
    "nameEn": ""
  },
  {
    "id": 3696,
    "upazilaId": 383,
    "nameBn": "ঘোড়াপাখিয়া",
    "nameEn": ""
  },
  {
    "id": 3697,
    "upazilaId": 383,
    "nameBn": "মোবারকপুর",
    "nameEn": ""
  },
  {
    "id": 3698,
    "upazilaId": 383,
    "nameBn": "মনাকষা",
    "nameEn": ""
  },
  {
    "id": 3699,
    "upazilaId": 383,
    "nameBn": "নয়ালাভাঙ্গা",
    "nameEn": ""
  },
  {
    "id": 3700,
    "upazilaId": 383,
    "nameBn": "পাঁকা",
    "nameEn": ""
  },
  {
    "id": 3701,
    "upazilaId": 383,
    "nameBn": "ছত্রাজিতপুর",
    "nameEn": ""
  },
  {
    "id": 3702,
    "upazilaId": 383,
    "nameBn": "শাহবাজপুর",
    "nameEn": ""
  },
  {
    "id": 3703,
    "upazilaId": 383,
    "nameBn": "শ্যামপুর",
    "nameEn": ""
  },
  {
    "id": 3704,
    "upazilaId": 383,
    "nameBn": "কানসাট",
    "nameEn": ""
  },
  {
    "id": 3705,
    "upazilaId": 383,
    "nameBn": "উজিরপুর",
    "nameEn": ""
  },
  {
    "id": 3706,
    "upazilaId": 384,
    "nameBn": "মোহাম্মাদাবাদ",
    "nameEn": ""
  },
  {
    "id": 3707,
    "upazilaId": 384,
    "nameBn": "ধলাহার",
    "nameEn": ""
  },
  {
    "id": 3708,
    "upazilaId": 384,
    "nameBn": "দোগাছি",
    "nameEn": ""
  },
  {
    "id": 3709,
    "upazilaId": 384,
    "nameBn": "ভাদসা",
    "nameEn": ""
  },
  {
    "id": 3710,
    "upazilaId": 384,
    "nameBn": "পুরানাপৈল",
    "nameEn": ""
  },
  {
    "id": 3711,
    "upazilaId": 384,
    "nameBn": "আমদই",
    "nameEn": ""
  },
  {
    "id": 3712,
    "upazilaId": 384,
    "nameBn": "জামালপুর",
    "nameEn": ""
  },
  {
    "id": 3713,
    "upazilaId": 384,
    "nameBn": "জয়পুরহাট সদর",
    "nameEn": ""
  },
  {
    "id": 3714,
    "upazilaId": 384,
    "nameBn": "চকবরকত",
    "nameEn": ""
  },
  {
    "id": 3715,
    "upazilaId": 385,
    "nameBn": "রুকিন্দীপুর",
    "nameEn": ""
  },
  {
    "id": 3716,
    "upazilaId": 385,
    "nameBn": "সোনামুখী",
    "nameEn": ""
  },
  {
    "id": 3717,
    "upazilaId": 385,
    "nameBn": "গোপীনাথপুর",
    "nameEn": ""
  },
  {
    "id": 3718,
    "upazilaId": 385,
    "nameBn": "রায়কালী",
    "nameEn": ""
  },
  {
    "id": 3719,
    "upazilaId": 385,
    "nameBn": "তিলকপুর",
    "nameEn": ""
  },
  {
    "id": 3720,
    "upazilaId": 386,
    "nameBn": "মাত্রাই",
    "nameEn": ""
  },
  {
    "id": 3721,
    "upazilaId": 386,
    "nameBn": "আহম্মেদাবাদ",
    "nameEn": ""
  },
  {
    "id": 3722,
    "upazilaId": 386,
    "nameBn": "পুনট",
    "nameEn": ""
  },
  {
    "id": 3723,
    "upazilaId": 386,
    "nameBn": "জিন্দারপুর",
    "nameEn": ""
  },
  {
    "id": 3724,
    "upazilaId": 386,
    "nameBn": "উদয়পুর",
    "nameEn": ""
  },
  {
    "id": 3725,
    "upazilaId": 387,
    "nameBn": "ক্ষেতলাল (বিলুপ্ত)",
    "nameEn": ""
  },
  {
    "id": 3726,
    "upazilaId": 387,
    "nameBn": "আলমপুর",
    "nameEn": ""
  },
  {
    "id": 3727,
    "upazilaId": 387,
    "nameBn": "ক্ষেতলাল",
    "nameEn": ""
  },
  {
    "id": 3728,
    "upazilaId": 387,
    "nameBn": "তুলশীগঙ্গা",
    "nameEn": ""
  },
  {
    "id": 3729,
    "upazilaId": 387,
    "nameBn": "বড়তারা",
    "nameEn": ""
  },
  {
    "id": 3730,
    "upazilaId": 387,
    "nameBn": "বড়াইল",
    "nameEn": ""
  },
  {
    "id": 3731,
    "upazilaId": 387,
    "nameBn": "মামুদপুর",
    "nameEn": ""
  },
  {
    "id": 3732,
    "upazilaId": 388,
    "nameBn": "বাগজানা",
    "nameEn": ""
  },
  {
    "id": 3733,
    "upazilaId": 388,
    "nameBn": "ধরঞ্জি",
    "nameEn": ""
  },
  {
    "id": 3734,
    "upazilaId": 388,
    "nameBn": "আয়মারসুলপুর",
    "nameEn": ""
  },
  {
    "id": 3735,
    "upazilaId": 388,
    "nameBn": "বালিঘাটা",
    "nameEn": ""
  },
  {
    "id": 3736,
    "upazilaId": 388,
    "nameBn": "আটাপুর",
    "nameEn": ""
  },
  {
    "id": 3737,
    "upazilaId": 388,
    "nameBn": "মোহাম্মদপুর",
    "nameEn": ""
  },
  {
    "id": 3738,
    "upazilaId": 388,
    "nameBn": "কুসুম্বা",
    "nameEn": ""
  },
  {
    "id": 3739,
    "upazilaId": 388,
    "nameBn": "আওলাই",
    "nameEn": ""
  },
  {
    "id": 3740,
    "upazilaId": 389,
    "nameBn": "পত্নীতলা",
    "nameEn": ""
  },
  {
    "id": 3741,
    "upazilaId": 389,
    "nameBn": "নিরমইল",
    "nameEn": ""
  },
  {
    "id": 3742,
    "upazilaId": 389,
    "nameBn": "দিবর",
    "nameEn": ""
  },
  {
    "id": 3743,
    "upazilaId": 389,
    "nameBn": "আকবরপুর",
    "nameEn": ""
  },
  {
    "id": 3744,
    "upazilaId": 389,
    "nameBn": "মাটিন্দর",
    "nameEn": ""
  },
  {
    "id": 3745,
    "upazilaId": 389,
    "nameBn": "কৃষ্ণপুর",
    "nameEn": ""
  },
  {
    "id": 3746,
    "upazilaId": 389,
    "nameBn": "পাটিচরা",
    "nameEn": ""
  },
  {
    "id": 3747,
    "upazilaId": 389,
    "nameBn": "নজিপুর",
    "nameEn": ""
  },
  {
    "id": 3748,
    "upazilaId": 389,
    "nameBn": "ঘোষনগর",
    "nameEn": ""
  },
  {
    "id": 3749,
    "upazilaId": 389,
    "nameBn": "আমাইড়",
    "nameEn": ""
  },
  {
    "id": 3750,
    "upazilaId": 389,
    "nameBn": "শিহাড়া",
    "nameEn": ""
  },
  {
    "id": 3751,
    "upazilaId": 390,
    "nameBn": "ধামইরহাট",
    "nameEn": ""
  },
  {
    "id": 3752,
    "upazilaId": 390,
    "nameBn": "আলমপুর",
    "nameEn": ""
  },
  {
    "id": 3753,
    "upazilaId": 390,
    "nameBn": "উমার",
    "nameEn": ""
  },
  {
    "id": 3754,
    "upazilaId": 390,
    "nameBn": "আড়ানগর",
    "nameEn": ""
  },
  {
    "id": 3755,
    "upazilaId": 390,
    "nameBn": "জাহানপুর",
    "nameEn": ""
  },
  {
    "id": 3756,
    "upazilaId": 390,
    "nameBn": "ইসবপুর",
    "nameEn": ""
  },
  {
    "id": 3757,
    "upazilaId": 390,
    "nameBn": "খেলনা",
    "nameEn": ""
  },
  {
    "id": 3758,
    "upazilaId": 390,
    "nameBn": "আগ্রাদ্বিগুন",
    "nameEn": ""
  },
  {
    "id": 3759,
    "upazilaId": 391,
    "nameBn": "মহাদেবপুর সদর",
    "nameEn": ""
  },
  {
    "id": 3760,
    "upazilaId": 391,
    "nameBn": "হাতুড়",
    "nameEn": ""
  },
  {
    "id": 3761,
    "upazilaId": 391,
    "nameBn": "খাজুর",
    "nameEn": ""
  },
  {
    "id": 3762,
    "upazilaId": 391,
    "nameBn": "চাঁন্দাশ",
    "nameEn": ""
  },
  {
    "id": 3763,
    "upazilaId": 391,
    "nameBn": "রাইগাঁ",
    "nameEn": ""
  },
  {
    "id": 3764,
    "upazilaId": 391,
    "nameBn": "এনায়েতপুর",
    "nameEn": ""
  },
  {
    "id": 3765,
    "upazilaId": 391,
    "nameBn": "সফাপুর",
    "nameEn": ""
  },
  {
    "id": 3766,
    "upazilaId": 391,
    "nameBn": "উত্তরগ্রাম",
    "nameEn": ""
  },
  {
    "id": 3767,
    "upazilaId": 391,
    "nameBn": "চেরাগপুর",
    "nameEn": ""
  },
  {
    "id": 3768,
    "upazilaId": 391,
    "nameBn": "ভীমপুর",
    "nameEn": ""
  },
  {
    "id": 3769,
    "upazilaId": 392,
    "nameBn": "নিতপুর",
    "nameEn": ""
  },
  {
    "id": 3770,
    "upazilaId": 392,
    "nameBn": "তেতুলিয়া",
    "nameEn": ""
  },
  {
    "id": 3771,
    "upazilaId": 392,
    "nameBn": "ছাওড়",
    "nameEn": ""
  },
  {
    "id": 3772,
    "upazilaId": 392,
    "nameBn": "গাঙ্গুরিয়া",
    "nameEn": ""
  },
  {
    "id": 3773,
    "upazilaId": 392,
    "nameBn": "ঘাটনগর",
    "nameEn": ""
  },
  {
    "id": 3774,
    "upazilaId": 392,
    "nameBn": "মশিদপুর",
    "nameEn": ""
  },
  {
    "id": 3775,
    "upazilaId": 393,
    "nameBn": "সাপাহার",
    "nameEn": ""
  },
  {
    "id": 3776,
    "upazilaId": 393,
    "nameBn": "গোয়ালা",
    "nameEn": ""
  },
  {
    "id": 3777,
    "upazilaId": 393,
    "nameBn": "তিলনা",
    "nameEn": ""
  },
  {
    "id": 3778,
    "upazilaId": 393,
    "nameBn": "আইহাই",
    "nameEn": ""
  },
  {
    "id": 3779,
    "upazilaId": 393,
    "nameBn": "পাতাড়ী",
    "nameEn": ""
  },
  {
    "id": 3780,
    "upazilaId": 393,
    "nameBn": "শিরন্টি",
    "nameEn": ""
  },
  {
    "id": 3781,
    "upazilaId": 394,
    "nameBn": "বদলগাছী",
    "nameEn": ""
  },
  {
    "id": 3782,
    "upazilaId": 394,
    "nameBn": "মথুরাপুর",
    "nameEn": ""
  },
  {
    "id": 3783,
    "upazilaId": 394,
    "nameBn": "পাহাড়পুর",
    "nameEn": ""
  },
  {
    "id": 3784,
    "upazilaId": 394,
    "nameBn": "মিঠাপুর",
    "nameEn": ""
  },
  {
    "id": 3785,
    "upazilaId": 394,
    "nameBn": "কোলা",
    "nameEn": ""
  },
  {
    "id": 3786,
    "upazilaId": 394,
    "nameBn": "বিলাশবাড়ী",
    "nameEn": ""
  },
  {
    "id": 3787,
    "upazilaId": 394,
    "nameBn": "আধাইপুর",
    "nameEn": ""
  },
  {
    "id": 3788,
    "upazilaId": 394,
    "nameBn": "বালুভরা",
    "nameEn": ""
  },
  {
    "id": 3789,
    "upazilaId": 395,
    "nameBn": "ভারশোঁ",
    "nameEn": ""
  },
  {
    "id": 3790,
    "upazilaId": 395,
    "nameBn": "ভালাইন",
    "nameEn": ""
  },
  {
    "id": 3791,
    "upazilaId": 395,
    "nameBn": "পরানপুর",
    "nameEn": ""
  },
  {
    "id": 3792,
    "upazilaId": 395,
    "nameBn": "মান্দা",
    "nameEn": ""
  },
  {
    "id": 3793,
    "upazilaId": 395,
    "nameBn": "গনেশপুর",
    "nameEn": ""
  },
  {
    "id": 3794,
    "upazilaId": 395,
    "nameBn": "মৈনম",
    "nameEn": ""
  },
  {
    "id": 3795,
    "upazilaId": 395,
    "nameBn": "প্রসাদপুর",
    "nameEn": ""
  },
  {
    "id": 3796,
    "upazilaId": 395,
    "nameBn": "কুশুম্বা",
    "nameEn": ""
  },
  {
    "id": 3797,
    "upazilaId": 395,
    "nameBn": "তেতুলিয়া",
    "nameEn": ""
  },
  {
    "id": 3798,
    "upazilaId": 395,
    "nameBn": "নুরুল্লাবাদ",
    "nameEn": ""
  },
  {
    "id": 3799,
    "upazilaId": 395,
    "nameBn": "কালিকাপুর",
    "nameEn": ""
  },
  {
    "id": 3800,
    "upazilaId": 395,
    "nameBn": "কাঁশোপাড়া",
    "nameEn": ""
  },
  {
    "id": 3801,
    "upazilaId": 395,
    "nameBn": "কশব",
    "nameEn": ""
  },
  {
    "id": 3802,
    "upazilaId": 395,
    "nameBn": "বিষ্ণুপুর",
    "nameEn": ""
  },
  {
    "id": 3803,
    "upazilaId": 396,
    "nameBn": "হাজীনগর",
    "nameEn": ""
  },
  {
    "id": 3804,
    "upazilaId": 396,
    "nameBn": "চন্দননগর",
    "nameEn": ""
  },
  {
    "id": 3805,
    "upazilaId": 396,
    "nameBn": "ভাবিচা",
    "nameEn": ""
  },
  {
    "id": 3806,
    "upazilaId": 396,
    "nameBn": "নিয়ামতপুর",
    "nameEn": ""
  },
  {
    "id": 3807,
    "upazilaId": 396,
    "nameBn": "রসুলপুর",
    "nameEn": ""
  },
  {
    "id": 3808,
    "upazilaId": 396,
    "nameBn": "পাঁড়ইল",
    "nameEn": ""
  },
  {
    "id": 3809,
    "upazilaId": 396,
    "nameBn": "শ্রীমন্তপুর",
    "nameEn": ""
  },
  {
    "id": 3810,
    "upazilaId": 396,
    "nameBn": "বাহাদুরপুর",
    "nameEn": ""
  },
  {
    "id": 3811,
    "upazilaId": 397,
    "nameBn": "শাহাগোলা",
    "nameEn": ""
  },
  {
    "id": 3812,
    "upazilaId": 397,
    "nameBn": "ভোঁপাড়া",
    "nameEn": ""
  },
  {
    "id": 3813,
    "upazilaId": 397,
    "nameBn": "আহসানগঞ্জ",
    "nameEn": ""
  },
  {
    "id": 3814,
    "upazilaId": 397,
    "nameBn": "পাঁচুপুর",
    "nameEn": ""
  },
  {
    "id": 3815,
    "upazilaId": 397,
    "nameBn": "বিশা",
    "nameEn": ""
  },
  {
    "id": 3816,
    "upazilaId": 397,
    "nameBn": "মনিয়ারী",
    "nameEn": ""
  },
  {
    "id": 3817,
    "upazilaId": 397,
    "nameBn": "কালিকাপুর",
    "nameEn": ""
  },
  {
    "id": 3818,
    "upazilaId": 397,
    "nameBn": "হাটকালুপাড়া",
    "nameEn": ""
  },
  {
    "id": 3819,
    "upazilaId": 398,
    "nameBn": "খট্টেশ্বর রাণীনগর",
    "nameEn": ""
  },
  {
    "id": 3820,
    "upazilaId": 398,
    "nameBn": "কাশিমপুর",
    "nameEn": ""
  },
  {
    "id": 3821,
    "upazilaId": 398,
    "nameBn": "গোনা",
    "nameEn": ""
  },
  {
    "id": 3822,
    "upazilaId": 398,
    "nameBn": "পারইল",
    "nameEn": ""
  },
  {
    "id": 3823,
    "upazilaId": 398,
    "nameBn": "বড়গাছা",
    "nameEn": ""
  },
  {
    "id": 3824,
    "upazilaId": 398,
    "nameBn": "কালীগ্রাম",
    "nameEn": ""
  },
  {
    "id": 3825,
    "upazilaId": 398,
    "nameBn": "একডালা",
    "nameEn": ""
  },
  {
    "id": 3826,
    "upazilaId": 398,
    "nameBn": "মিরাট",
    "nameEn": ""
  },
  {
    "id": 3827,
    "upazilaId": 399,
    "nameBn": "বর্ষাইল",
    "nameEn": ""
  },
  {
    "id": 3828,
    "upazilaId": 399,
    "nameBn": "কীর্ত্তিপুর",
    "nameEn": ""
  },
  {
    "id": 3829,
    "upazilaId": 399,
    "nameBn": "বক্তারপুর",
    "nameEn": ""
  },
  {
    "id": 3830,
    "upazilaId": 399,
    "nameBn": "তিলকপুর",
    "nameEn": ""
  },
  {
    "id": 3831,
    "upazilaId": 399,
    "nameBn": "হাপানিয়া",
    "nameEn": ""
  },
  {
    "id": 3832,
    "upazilaId": 399,
    "nameBn": "দুবলহাটী",
    "nameEn": ""
  },
  {
    "id": 3833,
    "upazilaId": 399,
    "nameBn": "বোয়ালিয়া",
    "nameEn": ""
  },
  {
    "id": 3834,
    "upazilaId": 399,
    "nameBn": "হাঁসাইগাড়ী",
    "nameEn": ""
  },
  {
    "id": 3835,
    "upazilaId": 399,
    "nameBn": "চন্ডিপুর",
    "nameEn": ""
  },
  {
    "id": 3836,
    "upazilaId": 399,
    "nameBn": "বলিহার",
    "nameEn": ""
  },
  {
    "id": 3837,
    "upazilaId": 399,
    "nameBn": "শিকারপুর",
    "nameEn": ""
  },
  {
    "id": 3838,
    "upazilaId": 399,
    "nameBn": "শৈলগাছী",
    "nameEn": ""
  },
  {
    "id": 3839,
    "upazilaId": 400,
    "nameBn": "ছাতনী",
    "nameEn": ""
  },
  {
    "id": 3840,
    "upazilaId": 400,
    "nameBn": "তেবাড়িয়া",
    "nameEn": ""
  },
  {
    "id": 3841,
    "upazilaId": 400,
    "nameBn": "দিঘাপতিয়া",
    "nameEn": ""
  },
  {
    "id": 3842,
    "upazilaId": 400,
    "nameBn": "লক্ষীপুর খোলাবাড়িয়া",
    "nameEn": ""
  },
  {
    "id": 3843,
    "upazilaId": 400,
    "nameBn": "বড় হরিশপুর",
    "nameEn": ""
  },
  {
    "id": 3844,
    "upazilaId": 400,
    "nameBn": "কাফুরিয়া",
    "nameEn": ""
  },
  {
    "id": 3845,
    "upazilaId": 400,
    "nameBn": "হালসা",
    "nameEn": ""
  },
  {
    "id": 3846,
    "upazilaId": 401,
    "nameBn": "পাঁকা",
    "nameEn": ""
  },
  {
    "id": 3847,
    "upazilaId": 401,
    "nameBn": "জামনগর",
    "nameEn": ""
  },
  {
    "id": 3848,
    "upazilaId": 401,
    "nameBn": "বাগাতিপাড়া",
    "nameEn": ""
  },
  {
    "id": 3849,
    "upazilaId": 401,
    "nameBn": "দয়ারামপুর",
    "nameEn": ""
  },
  {
    "id": 3850,
    "upazilaId": 401,
    "nameBn": "ফাগুয়াড়দিয়াড়",
    "nameEn": ""
  },
  {
    "id": 3851,
    "upazilaId": 402,
    "nameBn": "জোয়াড়ী",
    "nameEn": ""
  },
  {
    "id": 3852,
    "upazilaId": 402,
    "nameBn": "বড়াইগ্রাম",
    "nameEn": ""
  },
  {
    "id": 3853,
    "upazilaId": 402,
    "nameBn": "জোনাইল",
    "nameEn": ""
  },
  {
    "id": 3854,
    "upazilaId": 402,
    "nameBn": "নগর",
    "nameEn": ""
  },
  {
    "id": 3855,
    "upazilaId": 402,
    "nameBn": "গোপালপুর",
    "nameEn": ""
  },
  {
    "id": 3856,
    "upazilaId": 402,
    "nameBn": "চান্দাই",
    "nameEn": ""
  },
  {
    "id": 3857,
    "upazilaId": 402,
    "nameBn": "মাঝগাঁও",
    "nameEn": ""
  },
  {
    "id": 3858,
    "upazilaId": 403,
    "nameBn": "নাজিরপুর",
    "nameEn": ""
  },
  {
    "id": 3859,
    "upazilaId": 403,
    "nameBn": "বিয়াঘাট",
    "nameEn": ""
  },
  {
    "id": 3860,
    "upazilaId": 403,
    "nameBn": "খুবজীপুর",
    "nameEn": ""
  },
  {
    "id": 3861,
    "upazilaId": 403,
    "nameBn": "মশিন্দা",
    "nameEn": ""
  },
  {
    "id": 3862,
    "upazilaId": 403,
    "nameBn": "ধারাবারিষা",
    "nameEn": ""
  },
  {
    "id": 3863,
    "upazilaId": 403,
    "nameBn": "চাপিলা",
    "nameEn": ""
  },
  {
    "id": 3864,
    "upazilaId": 404,
    "nameBn": "লালপুর",
    "nameEn": ""
  },
  {
    "id": 3865,
    "upazilaId": 404,
    "nameBn": "ঈশ্বরদী",
    "nameEn": ""
  },
  {
    "id": 3866,
    "upazilaId": 404,
    "nameBn": "চংধুপইল",
    "nameEn": ""
  },
  {
    "id": 3867,
    "upazilaId": 404,
    "nameBn": "আড়বাব",
    "nameEn": ""
  },
  {
    "id": 3868,
    "upazilaId": 404,
    "nameBn": "বিলমাড়িয়া",
    "nameEn": ""
  },
  {
    "id": 3869,
    "upazilaId": 404,
    "nameBn": "দুয়ারিয়া",
    "nameEn": ""
  },
  {
    "id": 3870,
    "upazilaId": 404,
    "nameBn": "ওয়ালিয়া",
    "nameEn": ""
  },
  {
    "id": 3871,
    "upazilaId": 404,
    "nameBn": "দুড়দুরিয়া",
    "nameEn": ""
  },
  {
    "id": 3872,
    "upazilaId": 404,
    "nameBn": "অর্জুনপুর বরমহাটী",
    "nameEn": ""
  },
  {
    "id": 3873,
    "upazilaId": 404,
    "nameBn": "কদিমচিলান",
    "nameEn": ""
  },
  {
    "id": 3874,
    "upazilaId": 405,
    "nameBn": "সুকাশ",
    "nameEn": ""
  },
  {
    "id": 3875,
    "upazilaId": 405,
    "nameBn": "ডাহিয়া",
    "nameEn": ""
  },
  {
    "id": 3876,
    "upazilaId": 405,
    "nameBn": "ইটালী",
    "nameEn": ""
  },
  {
    "id": 3877,
    "upazilaId": 405,
    "nameBn": "কলম",
    "nameEn": ""
  },
  {
    "id": 3878,
    "upazilaId": 405,
    "nameBn": "চামারী",
    "nameEn": ""
  },
  {
    "id": 3879,
    "upazilaId": 405,
    "nameBn": "হাতিয়ান্দহ",
    "nameEn": ""
  },
  {
    "id": 3880,
    "upazilaId": 405,
    "nameBn": "লালোর",
    "nameEn": ""
  },
  {
    "id": 3881,
    "upazilaId": 405,
    "nameBn": "শেরকোল",
    "nameEn": ""
  },
  {
    "id": 3882,
    "upazilaId": 405,
    "nameBn": "তাজপুর",
    "nameEn": ""
  },
  {
    "id": 3883,
    "upazilaId": 405,
    "nameBn": "চৌগ্রাম",
    "nameEn": ""
  },
  {
    "id": 3884,
    "upazilaId": 405,
    "nameBn": "ছাতারদিঘী",
    "nameEn": ""
  },
  {
    "id": 3885,
    "upazilaId": 405,
    "nameBn": "রামানন্দ খাজুরা",
    "nameEn": ""
  },
  {
    "id": 3886,
    "upazilaId": 406,
    "nameBn": "ব্রাহ্মপুর",
    "nameEn": ""
  },
  {
    "id": 3887,
    "upazilaId": 406,
    "nameBn": "মাধনগর",
    "nameEn": ""
  },
  {
    "id": 3888,
    "upazilaId": 406,
    "nameBn": "খাজুরা",
    "nameEn": ""
  },
  {
    "id": 3889,
    "upazilaId": 406,
    "nameBn": "পিপরুল",
    "nameEn": ""
  },
  {
    "id": 3890,
    "upazilaId": 406,
    "nameBn": "বিপ্রবেলঘরিয়া",
    "nameEn": ""
  },
  {
    "id": 3891,
    "upazilaId": 407,
    "nameBn": "মাজপাড়া",
    "nameEn": ""
  },
  {
    "id": 3892,
    "upazilaId": 407,
    "nameBn": "চাঁদভা",
    "nameEn": ""
  },
  {
    "id": 3893,
    "upazilaId": 407,
    "nameBn": "দেবোত্তর",
    "nameEn": ""
  },
  {
    "id": 3894,
    "upazilaId": 407,
    "nameBn": "একদন্ত",
    "nameEn": ""
  },
  {
    "id": 3895,
    "upazilaId": 407,
    "nameBn": "লক্ষ্মীপুর",
    "nameEn": ""
  },
  {
    "id": 3896,
    "upazilaId": 408,
    "nameBn": "সাহাপুর",
    "nameEn": ""
  },
  {
    "id": 3897,
    "upazilaId": 408,
    "nameBn": "লক্ষ্মীকুন্ডা",
    "nameEn": ""
  },
  {
    "id": 3898,
    "upazilaId": 408,
    "nameBn": "পাকশী",
    "nameEn": ""
  },
  {
    "id": 3899,
    "upazilaId": 408,
    "nameBn": "মুলাডুলি",
    "nameEn": ""
  },
  {
    "id": 3900,
    "upazilaId": 408,
    "nameBn": "দাশুড়িয়া",
    "nameEn": ""
  },
  {
    "id": 3901,
    "upazilaId": 408,
    "nameBn": "সলিমপুর",
    "nameEn": ""
  },
  {
    "id": 3902,
    "upazilaId": 408,
    "nameBn": "সাঁড়া",
    "nameEn": ""
  },
  {
    "id": 3903,
    "upazilaId": 409,
    "nameBn": "হান্ডিয়াল",
    "nameEn": ""
  },
  {
    "id": 3904,
    "upazilaId": 409,
    "nameBn": "ছাইকোলা",
    "nameEn": ""
  },
  {
    "id": 3905,
    "upazilaId": 409,
    "nameBn": "নিমাইচড়া",
    "nameEn": ""
  },
  {
    "id": 3906,
    "upazilaId": 409,
    "nameBn": "গুনাইগাছা",
    "nameEn": ""
  },
  {
    "id": 3907,
    "upazilaId": 409,
    "nameBn": "মূলগ্রাম",
    "nameEn": ""
  },
  {
    "id": 3908,
    "upazilaId": 409,
    "nameBn": "ফৈলজানা",
    "nameEn": ""
  },
  {
    "id": 3909,
    "upazilaId": 409,
    "nameBn": "পার্শ্বডাঙ্গা",
    "nameEn": ""
  },
  {
    "id": 3910,
    "upazilaId": 409,
    "nameBn": "ডিবিগ্রাম",
    "nameEn": ""
  },
  {
    "id": 3911,
    "upazilaId": 409,
    "nameBn": "মথুরাপুর",
    "nameEn": ""
  },
  {
    "id": 3912,
    "upazilaId": 409,
    "nameBn": "হরিপুর",
    "nameEn": ""
  },
  {
    "id": 3913,
    "upazilaId": 409,
    "nameBn": "বিলচলন",
    "nameEn": ""
  },
  {
    "id": 3914,
    "upazilaId": 409,
    "nameBn": "দাতিয়া বামন গ্রাম",
    "nameEn": ""
  },
  {
    "id": 3915,
    "upazilaId": 410,
    "nameBn": "মালিগাছা",
    "nameEn": ""
  },
  {
    "id": 3916,
    "upazilaId": 410,
    "nameBn": "ভাঁড়ারা",
    "nameEn": ""
  },
  {
    "id": 3917,
    "upazilaId": 410,
    "nameBn": "আতাইকুলা",
    "nameEn": ""
  },
  {
    "id": 3918,
    "upazilaId": 410,
    "nameBn": "মালঞ্চি",
    "nameEn": ""
  },
  {
    "id": 3919,
    "upazilaId": 410,
    "nameBn": "দাপুনিয়া",
    "nameEn": ""
  },
  {
    "id": 3920,
    "upazilaId": 410,
    "nameBn": "গয়েশপুর",
    "nameEn": ""
  },
  {
    "id": 3921,
    "upazilaId": 410,
    "nameBn": "সাদুল্লাপুর",
    "nameEn": ""
  },
  {
    "id": 3922,
    "upazilaId": 410,
    "nameBn": "চরতারাপুর",
    "nameEn": ""
  },
  {
    "id": 3923,
    "upazilaId": 410,
    "nameBn": "হেমায়েতপুর",
    "nameEn": ""
  },
  {
    "id": 3924,
    "upazilaId": 410,
    "nameBn": "দোগাছী",
    "nameEn": ""
  },
  {
    "id": 3925,
    "upazilaId": 411,
    "nameBn": "বৃলাহিড়ীবাড়ী",
    "nameEn": ""
  },
  {
    "id": 3926,
    "upazilaId": 411,
    "nameBn": "পুংগলী",
    "nameEn": ""
  },
  {
    "id": 3927,
    "upazilaId": 411,
    "nameBn": "ফরিদপুর",
    "nameEn": ""
  },
  {
    "id": 3928,
    "upazilaId": 411,
    "nameBn": "হাদল",
    "nameEn": ""
  },
  {
    "id": 3929,
    "upazilaId": 411,
    "nameBn": "বনওয়ারীনগর",
    "nameEn": ""
  },
  {
    "id": 3930,
    "upazilaId": 411,
    "nameBn": "ডেমরা",
    "nameEn": ""
  },
  {
    "id": 3931,
    "upazilaId": 412,
    "nameBn": "হাটুরিয়া নাকালিয়া",
    "nameEn": ""
  },
  {
    "id": 3932,
    "upazilaId": 412,
    "nameBn": "কৈটোলা",
    "nameEn": ""
  },
  {
    "id": 3933,
    "upazilaId": 412,
    "nameBn": "চাকলা",
    "nameEn": ""
  },
  {
    "id": 3934,
    "upazilaId": 412,
    "nameBn": "নতুন ভারেঙ্গা",
    "nameEn": ""
  },
  {
    "id": 3935,
    "upazilaId": 412,
    "nameBn": "পুরান ভারেঙ্গা",
    "nameEn": ""
  },
  {
    "id": 3936,
    "upazilaId": 412,
    "nameBn": "জাতসাখিনি",
    "nameEn": ""
  },
  {
    "id": 3937,
    "upazilaId": 412,
    "nameBn": "রূপপুর",
    "nameEn": ""
  },
  {
    "id": 3938,
    "upazilaId": 412,
    "nameBn": "মাসুমদিয়া",
    "nameEn": ""
  },
  {
    "id": 3939,
    "upazilaId": 412,
    "nameBn": "ঢালারচর",
    "nameEn": ""
  },
  {
    "id": 3940,
    "upazilaId": 413,
    "nameBn": "ভাঙ্গুড়া",
    "nameEn": ""
  },
  {
    "id": 3941,
    "upazilaId": 413,
    "nameBn": "পারভাঙ্গুড়া",
    "nameEn": ""
  },
  {
    "id": 3942,
    "upazilaId": 413,
    "nameBn": "অষ্টমনিষা",
    "nameEn": ""
  },
  {
    "id": 3943,
    "upazilaId": 413,
    "nameBn": "খান মরিচ",
    "nameEn": ""
  },
  {
    "id": 3944,
    "upazilaId": 413,
    "nameBn": "দিলপাশার",
    "nameEn": ""
  },
  {
    "id": 3945,
    "upazilaId": 413,
    "nameBn": "মন্ডতোষ",
    "nameEn": ""
  },
  {
    "id": 3946,
    "upazilaId": 414,
    "nameBn": "নাগডেমড়া",
    "nameEn": ""
  },
  {
    "id": 3947,
    "upazilaId": 414,
    "nameBn": "ধুলাউড়ি",
    "nameEn": ""
  },
  {
    "id": 3948,
    "upazilaId": 414,
    "nameBn": "ভুলবাড়ীয়া",
    "nameEn": ""
  },
  {
    "id": 3949,
    "upazilaId": 414,
    "nameBn": "ধোপাদহ",
    "nameEn": ""
  },
  {
    "id": 3950,
    "upazilaId": 414,
    "nameBn": "করমজা",
    "nameEn": ""
  },
  {
    "id": 3951,
    "upazilaId": 414,
    "nameBn": "কাশিনাথপুর",
    "nameEn": ""
  },
  {
    "id": 3952,
    "upazilaId": 414,
    "nameBn": "গৌরীগ্রাম",
    "nameEn": ""
  },
  {
    "id": 3953,
    "upazilaId": 414,
    "nameBn": "নন্দনপুর",
    "nameEn": ""
  },
  {
    "id": 3954,
    "upazilaId": 414,
    "nameBn": "ক্ষেতুপাড়া",
    "nameEn": ""
  },
  {
    "id": 3955,
    "upazilaId": 414,
    "nameBn": "আর-আতাইকুলা",
    "nameEn": ""
  },
  {
    "id": 3956,
    "upazilaId": 415,
    "nameBn": "ভায়না",
    "nameEn": ""
  },
  {
    "id": 3957,
    "upazilaId": 415,
    "nameBn": "সাতবাড়িয়া",
    "nameEn": ""
  },
  {
    "id": 3958,
    "upazilaId": 415,
    "nameBn": "মানিকহাট",
    "nameEn": ""
  },
  {
    "id": 3959,
    "upazilaId": 415,
    "nameBn": "নাজিরগঞ্জ",
    "nameEn": ""
  },
  {
    "id": 3960,
    "upazilaId": 415,
    "nameBn": "হাটখালী",
    "nameEn": ""
  },
  {
    "id": 3961,
    "upazilaId": 415,
    "nameBn": "সাগরকান্দি",
    "nameEn": ""
  },
  {
    "id": 3962,
    "upazilaId": 415,
    "nameBn": "রাণীনগর",
    "nameEn": ""
  },
  {
    "id": 3963,
    "upazilaId": 415,
    "nameBn": "আহম্মদপুর",
    "nameEn": ""
  },
  {
    "id": 3964,
    "upazilaId": 415,
    "nameBn": "দুলাই",
    "nameEn": ""
  },
  {
    "id": 3965,
    "upazilaId": 415,
    "nameBn": "তাঁতিবন্দ",
    "nameEn": ""
  },
  {
    "id": 3966,
    "upazilaId": 416,
    "nameBn": "আশেকপুর",
    "nameEn": ""
  },
  {
    "id": 3967,
    "upazilaId": 416,
    "nameBn": "মাদলা",
    "nameEn": ""
  },
  {
    "id": 3968,
    "upazilaId": 416,
    "nameBn": "মাঝিড়া",
    "nameEn": ""
  },
  {
    "id": 3969,
    "upazilaId": 416,
    "nameBn": "আড়িয়া",
    "nameEn": ""
  },
  {
    "id": 3970,
    "upazilaId": 416,
    "nameBn": "খরনা",
    "nameEn": ""
  },
  {
    "id": 3971,
    "upazilaId": 416,
    "nameBn": "গোহাইল",
    "nameEn": ""
  },
  {
    "id": 3972,
    "upazilaId": 416,
    "nameBn": "খোট্রাপাড়া",
    "nameEn": ""
  },
  {
    "id": 3973,
    "upazilaId": 416,
    "nameBn": "চোপিনগর",
    "nameEn": ""
  },
  {
    "id": 3974,
    "upazilaId": 416,
    "nameBn": "আমরুল",
    "nameEn": ""
  },
  {
    "id": 3975,
    "upazilaId": 417,
    "nameBn": "ছাতিয়ানগ্রাম",
    "nameEn": ""
  },
  {
    "id": 3976,
    "upazilaId": 417,
    "nameBn": "নশরতপুর",
    "nameEn": ""
  },
  {
    "id": 3977,
    "upazilaId": 417,
    "nameBn": "আদমদীঘি",
    "nameEn": ""
  },
  {
    "id": 3978,
    "upazilaId": 417,
    "nameBn": "কুন্দগ্রাম",
    "nameEn": ""
  },
  {
    "id": 3979,
    "upazilaId": 417,
    "nameBn": "চাঁপাপুর",
    "nameEn": ""
  },
  {
    "id": 3980,
    "upazilaId": 417,
    "nameBn": "সান্তাহার",
    "nameEn": ""
  },
  {
    "id": 3981,
    "upazilaId": 418,
    "nameBn": "এরুলিয়া",
    "nameEn": ""
  },
  {
    "id": 3982,
    "upazilaId": 418,
    "nameBn": "ফাঁপোর",
    "nameEn": ""
  },
  {
    "id": 3983,
    "upazilaId": 418,
    "nameBn": "সাবগ্রাম",
    "nameEn": ""
  },
  {
    "id": 3984,
    "upazilaId": 418,
    "nameBn": "নিশিন্দারা",
    "nameEn": ""
  },
  {
    "id": 3985,
    "upazilaId": 418,
    "nameBn": "রাজাপুর",
    "nameEn": ""
  },
  {
    "id": 3986,
    "upazilaId": 418,
    "nameBn": "শাখারিয়া",
    "nameEn": ""
  },
  {
    "id": 3987,
    "upazilaId": 418,
    "nameBn": "শেখেরকোলা",
    "nameEn": ""
  },
  {
    "id": 3988,
    "upazilaId": 418,
    "nameBn": "গোকুল",
    "nameEn": ""
  },
  {
    "id": 3989,
    "upazilaId": 418,
    "nameBn": "নুনগোলা",
    "nameEn": ""
  },
  {
    "id": 3990,
    "upazilaId": 418,
    "nameBn": "লাহিড়ীপাড়া",
    "nameEn": ""
  },
  {
    "id": 3991,
    "upazilaId": 418,
    "nameBn": "নামুজা",
    "nameEn": ""
  },
  {
    "id": 3992,
    "upazilaId": 419,
    "nameBn": "নিমগাছি",
    "nameEn": ""
  },
  {
    "id": 3993,
    "upazilaId": 419,
    "nameBn": "কালের পাড়া",
    "nameEn": ""
  },
  {
    "id": 3994,
    "upazilaId": 419,
    "nameBn": "চিকাশী",
    "nameEn": ""
  },
  {
    "id": 3995,
    "upazilaId": 419,
    "nameBn": "গোসাইবাড়ী",
    "nameEn": ""
  },
  {
    "id": 3996,
    "upazilaId": 419,
    "nameBn": "ভান্ডারবাড়ী",
    "nameEn": ""
  },
  {
    "id": 3997,
    "upazilaId": 419,
    "nameBn": "ধুনট",
    "nameEn": ""
  },
  {
    "id": 3998,
    "upazilaId": 419,
    "nameBn": "এলাঙ্গী",
    "nameEn": ""
  },
  {
    "id": 3999,
    "upazilaId": 419,
    "nameBn": "চৌকিবাড়ী",
    "nameEn": ""
  },
  {
    "id": 4000,
    "upazilaId": 419,
    "nameBn": "মথুরাপুর",
    "nameEn": ""
  },
  {
    "id": 4001,
    "upazilaId": 419,
    "nameBn": "গোপালনগর",
    "nameEn": ""
  },
  {
    "id": 4002,
    "upazilaId": 420,
    "nameBn": "জিয়ানগর",
    "nameEn": ""
  },
  {
    "id": 4003,
    "upazilaId": 420,
    "nameBn": "চামরুল",
    "nameEn": ""
  },
  {
    "id": 4004,
    "upazilaId": 420,
    "nameBn": "দুপচাঁচিয়া",
    "nameEn": ""
  },
  {
    "id": 4005,
    "upazilaId": 420,
    "nameBn": "গুনাহার",
    "nameEn": ""
  },
  {
    "id": 4006,
    "upazilaId": 420,
    "nameBn": "গোবিন্দপুর",
    "nameEn": ""
  },
  {
    "id": 4007,
    "upazilaId": 420,
    "nameBn": "তালোড়া",
    "nameEn": ""
  },
  {
    "id": 4008,
    "upazilaId": 421,
    "nameBn": "গাবতলি",
    "nameEn": ""
  },
  {
    "id": 4009,
    "upazilaId": 421,
    "nameBn": "নেপালতলী",
    "nameEn": ""
  },
  {
    "id": 4010,
    "upazilaId": 421,
    "nameBn": "সোনারায়",
    "nameEn": ""
  },
  {
    "id": 4011,
    "upazilaId": 421,
    "nameBn": "কাগইল",
    "nameEn": ""
  },
  {
    "id": 4012,
    "upazilaId": 421,
    "nameBn": "রামেশ্বরপুর",
    "nameEn": ""
  },
  {
    "id": 4013,
    "upazilaId": 421,
    "nameBn": "মহিষাবান",
    "nameEn": ""
  },
  {
    "id": 4014,
    "upazilaId": 421,
    "nameBn": "দক্ষিণপাড়া",
    "nameEn": ""
  },
  {
    "id": 4015,
    "upazilaId": 421,
    "nameBn": "দূর্গাহাটা",
    "nameEn": ""
  },
  {
    "id": 4016,
    "upazilaId": 421,
    "nameBn": "বালিয়াদিঘী",
    "nameEn": ""
  },
  {
    "id": 4017,
    "upazilaId": 421,
    "nameBn": "নাড়ুয়ামালা",
    "nameEn": ""
  },
  {
    "id": 4018,
    "upazilaId": 421,
    "nameBn": "নশিপুর",
    "nameEn": ""
  },
  {
    "id": 4019,
    "upazilaId": 422,
    "nameBn": "বীরকেদার",
    "nameEn": ""
  },
  {
    "id": 4020,
    "upazilaId": 422,
    "nameBn": "কালাই",
    "nameEn": ""
  },
  {
    "id": 4021,
    "upazilaId": 422,
    "nameBn": "পাইকড়",
    "nameEn": ""
  },
  {
    "id": 4022,
    "upazilaId": 422,
    "nameBn": "নারহট্ট",
    "nameEn": ""
  },
  {
    "id": 4023,
    "upazilaId": 422,
    "nameBn": "কাহালু",
    "nameEn": ""
  },
  {
    "id": 4024,
    "upazilaId": 422,
    "nameBn": "মুরইল",
    "nameEn": ""
  },
  {
    "id": 4025,
    "upazilaId": 422,
    "nameBn": "দূর্গাপুর",
    "nameEn": ""
  },
  {
    "id": 4026,
    "upazilaId": 422,
    "nameBn": "জামগ্রাম",
    "nameEn": ""
  },
  {
    "id": 4027,
    "upazilaId": 422,
    "nameBn": "মালঞ্চা",
    "nameEn": ""
  },
  {
    "id": 4028,
    "upazilaId": 423,
    "nameBn": "বুড়ইল",
    "nameEn": ""
  },
  {
    "id": 4029,
    "upazilaId": 423,
    "nameBn": "নন্দিগ্রাম",
    "nameEn": ""
  },
  {
    "id": 4030,
    "upazilaId": 423,
    "nameBn": "ভাটরা",
    "nameEn": ""
  },
  {
    "id": 4031,
    "upazilaId": 423,
    "nameBn": "থালতা মাঝগ্রাম",
    "nameEn": ""
  },
  {
    "id": 4032,
    "upazilaId": 423,
    "nameBn": "ভাটগ্রাম",
    "nameEn": ""
  },
  {
    "id": 4033,
    "upazilaId": 424,
    "nameBn": "চালুয়াবাড়ী",
    "nameEn": ""
  },
  {
    "id": 4034,
    "upazilaId": 424,
    "nameBn": "হাটশেরপুর",
    "nameEn": ""
  },
  {
    "id": 4035,
    "upazilaId": 424,
    "nameBn": "কাজলা",
    "nameEn": ""
  },
  {
    "id": 4036,
    "upazilaId": 424,
    "nameBn": "সারিয়াকান্দি সদর",
    "nameEn": ""
  },
  {
    "id": 4037,
    "upazilaId": 424,
    "nameBn": "নারচী",
    "nameEn": ""
  },
  {
    "id": 4038,
    "upazilaId": 424,
    "nameBn": "ফুলবাড়ী",
    "nameEn": ""
  },
  {
    "id": 4039,
    "upazilaId": 424,
    "nameBn": "কর্ণিবাড়ী",
    "nameEn": ""
  },
  {
    "id": 4040,
    "upazilaId": 424,
    "nameBn": "কুতুবপুর",
    "nameEn": ""
  },
  {
    "id": 4041,
    "upazilaId": 424,
    "nameBn": "ভেলাবাড়ী",
    "nameEn": ""
  },
  {
    "id": 4042,
    "upazilaId": 424,
    "nameBn": "চন্দনবাইশা",
    "nameEn": ""
  },
  {
    "id": 4043,
    "upazilaId": 424,
    "nameBn": "কামালপুর",
    "nameEn": ""
  },
  {
    "id": 4044,
    "upazilaId": 424,
    "nameBn": "বোহাইল",
    "nameEn": ""
  },
  {
    "id": 4045,
    "upazilaId": 425,
    "nameBn": "কুসুম্বী",
    "nameEn": ""
  },
  {
    "id": 4046,
    "upazilaId": 425,
    "nameBn": "গাড়ীদহ",
    "nameEn": ""
  },
  {
    "id": 4047,
    "upazilaId": 425,
    "nameBn": "খামারকান্দি",
    "nameEn": ""
  },
  {
    "id": 4048,
    "upazilaId": 425,
    "nameBn": "খানপুর",
    "nameEn": ""
  },
  {
    "id": 4049,
    "upazilaId": 425,
    "nameBn": "মির্জাপুর",
    "nameEn": ""
  },
  {
    "id": 4050,
    "upazilaId": 425,
    "nameBn": "বিশালপুর",
    "nameEn": ""
  },
  {
    "id": 4051,
    "upazilaId": 425,
    "nameBn": "ভবানীপুর",
    "nameEn": ""
  },
  {
    "id": 4052,
    "upazilaId": 425,
    "nameBn": "সুঘাট",
    "nameEn": ""
  },
  {
    "id": 4053,
    "upazilaId": 425,
    "nameBn": "সীমাবাড়ী",
    "nameEn": ""
  },
  {
    "id": 4054,
    "upazilaId": 425,
    "nameBn": "শাহবন্দেগী",
    "nameEn": ""
  },
  {
    "id": 4055,
    "upazilaId": 383,
    "nameBn": "শিবগঞ্জ",
    "nameEn": ""
  },
  {
    "id": 4056,
    "upazilaId": 383,
    "nameBn": "বিহার",
    "nameEn": ""
  },
  {
    "id": 4057,
    "upazilaId": 383,
    "nameBn": "রায়নগর",
    "nameEn": ""
  },
  {
    "id": 4058,
    "upazilaId": 383,
    "nameBn": "বুড়িগঞ্জ",
    "nameEn": ""
  },
  {
    "id": 4059,
    "upazilaId": 383,
    "nameBn": "মাঝিহট্ট",
    "nameEn": ""
  },
  {
    "id": 4060,
    "upazilaId": 383,
    "nameBn": "পিরব",
    "nameEn": ""
  },
  {
    "id": 4061,
    "upazilaId": 383,
    "nameBn": "আটমূল",
    "nameEn": ""
  },
  {
    "id": 4062,
    "upazilaId": 383,
    "nameBn": "কিচক",
    "nameEn": ""
  },
  {
    "id": 4063,
    "upazilaId": 383,
    "nameBn": "ময়দানহাট্টা",
    "nameEn": ""
  },
  {
    "id": 4064,
    "upazilaId": 383,
    "nameBn": "দেউলি",
    "nameEn": ""
  },
  {
    "id": 4065,
    "upazilaId": 383,
    "nameBn": "মোকামতলা",
    "nameEn": ""
  },
  {
    "id": 4066,
    "upazilaId": 383,
    "nameBn": "সৈয়দপুর",
    "nameEn": ""
  },
  {
    "id": 4067,
    "upazilaId": 426,
    "nameBn": "সোনাতলা",
    "nameEn": ""
  },
  {
    "id": 4068,
    "upazilaId": 426,
    "nameBn": "বালুয়া",
    "nameEn": ""
  },
  {
    "id": 4069,
    "upazilaId": 426,
    "nameBn": "দিগদাইড়",
    "nameEn": ""
  },
  {
    "id": 4070,
    "upazilaId": 426,
    "nameBn": "জোড়গাছা",
    "nameEn": ""
  },
  {
    "id": 4071,
    "upazilaId": 426,
    "nameBn": "মধুপুর",
    "nameEn": ""
  },
  {
    "id": 4072,
    "upazilaId": 426,
    "nameBn": "তেকানী চুকাইনগর",
    "nameEn": ""
  },
  {
    "id": 4073,
    "upazilaId": 426,
    "nameBn": "পাকুল্যা",
    "nameEn": ""
  },
  {
    "id": 4074,
    "upazilaId": 427,
    "nameBn": "গোদাগাড়ী",
    "nameEn": ""
  },
  {
    "id": 4075,
    "upazilaId": 427,
    "nameBn": "মোহনপুর",
    "nameEn": ""
  },
  {
    "id": 4076,
    "upazilaId": 427,
    "nameBn": "পাকড়ী",
    "nameEn": ""
  },
  {
    "id": 4077,
    "upazilaId": 427,
    "nameBn": "রিশিকুল",
    "nameEn": ""
  },
  {
    "id": 4078,
    "upazilaId": 427,
    "nameBn": "গোগ্রাম",
    "nameEn": ""
  },
  {
    "id": 4079,
    "upazilaId": 427,
    "nameBn": "মাটিকাটা",
    "nameEn": ""
  },
  {
    "id": 4080,
    "upazilaId": 427,
    "nameBn": "দেওপাড়া",
    "nameEn": ""
  },
  {
    "id": 4081,
    "upazilaId": 427,
    "nameBn": "বাসুদেবপুর",
    "nameEn": ""
  },
  {
    "id": 4082,
    "upazilaId": 427,
    "nameBn": "আষাড়িয়াদহ",
    "nameEn": ""
  },
  {
    "id": 4083,
    "upazilaId": 428,
    "nameBn": "কলমা",
    "nameEn": ""
  },
  {
    "id": 4084,
    "upazilaId": 428,
    "nameBn": "বাধাইড়",
    "nameEn": ""
  },
  {
    "id": 4085,
    "upazilaId": 428,
    "nameBn": "পাঁচন্দর",
    "nameEn": ""
  },
  {
    "id": 4086,
    "upazilaId": 428,
    "nameBn": "সরঞ্জাই",
    "nameEn": ""
  },
  {
    "id": 4087,
    "upazilaId": 428,
    "nameBn": "তালন্দ",
    "nameEn": ""
  },
  {
    "id": 4088,
    "upazilaId": 428,
    "nameBn": "কামারগাঁ",
    "nameEn": ""
  },
  {
    "id": 4089,
    "upazilaId": 428,
    "nameBn": "চান্দুড়িয়া",
    "nameEn": ""
  },
  {
    "id": 4090,
    "upazilaId": 429,
    "nameBn": "রায়ঘাটী",
    "nameEn": ""
  },
  {
    "id": 4091,
    "upazilaId": 429,
    "nameBn": "ঘাসিগ্রাম",
    "nameEn": ""
  },
  {
    "id": 4092,
    "upazilaId": 429,
    "nameBn": "মৌগাছি",
    "nameEn": ""
  },
  {
    "id": 4093,
    "upazilaId": 429,
    "nameBn": "জাহানাবাদ",
    "nameEn": ""
  },
  {
    "id": 4094,
    "upazilaId": 429,
    "nameBn": "বাকশিমইল",
    "nameEn": ""
  },
  {
    "id": 4095,
    "upazilaId": 429,
    "nameBn": "ধূরইল",
    "nameEn": ""
  },
  {
    "id": 4096,
    "upazilaId": 430,
    "nameBn": "গোবিন্দপাড়া",
    "nameEn": ""
  },
  {
    "id": 4097,
    "upazilaId": 430,
    "nameBn": "নরদাশ",
    "nameEn": ""
  },
  {
    "id": 4098,
    "upazilaId": 430,
    "nameBn": "দ্বীপপুর",
    "nameEn": ""
  },
  {
    "id": 4099,
    "upazilaId": 430,
    "nameBn": "বড়বিহানালী",
    "nameEn": ""
  },
  {
    "id": 4100,
    "upazilaId": 430,
    "nameBn": "আউচপাড়া",
    "nameEn": ""
  },
  {
    "id": 4101,
    "upazilaId": 430,
    "nameBn": "শ্রীপুর",
    "nameEn": ""
  },
  {
    "id": 4102,
    "upazilaId": 430,
    "nameBn": "বাসুপাড়া",
    "nameEn": ""
  },
  {
    "id": 4103,
    "upazilaId": 430,
    "nameBn": "কাচারী কোয়ালিপাড়া",
    "nameEn": ""
  },
  {
    "id": 4104,
    "upazilaId": 430,
    "nameBn": "শুভডাঙ্গা",
    "nameEn": ""
  },
  {
    "id": 4105,
    "upazilaId": 430,
    "nameBn": "মাড়িয়া",
    "nameEn": ""
  },
  {
    "id": 4106,
    "upazilaId": 430,
    "nameBn": "গণিপুর",
    "nameEn": ""
  },
  {
    "id": 4107,
    "upazilaId": 430,
    "nameBn": "ঝিকড়া",
    "nameEn": ""
  },
  {
    "id": 4108,
    "upazilaId": 430,
    "nameBn": "গোয়ালকান্দি",
    "nameEn": ""
  },
  {
    "id": 4109,
    "upazilaId": 430,
    "nameBn": "হামিরকুৎসা",
    "nameEn": ""
  },
  {
    "id": 4110,
    "upazilaId": 430,
    "nameBn": "যোগিপাড়া",
    "nameEn": ""
  },
  {
    "id": 4111,
    "upazilaId": 430,
    "nameBn": "সোনাডাঙ্গা",
    "nameEn": ""
  },
  {
    "id": 4112,
    "upazilaId": 314,
    "nameBn": "নওপাড়া",
    "nameEn": ""
  },
  {
    "id": 4113,
    "upazilaId": 314,
    "nameBn": "কিসমত গণকৈড়",
    "nameEn": ""
  },
  {
    "id": 4114,
    "upazilaId": 314,
    "nameBn": "পানানগর",
    "nameEn": ""
  },
  {
    "id": 4115,
    "upazilaId": 314,
    "nameBn": "দেলুয়াবাড়ী",
    "nameEn": ""
  },
  {
    "id": 4116,
    "upazilaId": 314,
    "nameBn": "মাড়িয়া",
    "nameEn": ""
  },
  {
    "id": 4117,
    "upazilaId": 314,
    "nameBn": "ঝালুকা",
    "nameEn": ""
  },
  {
    "id": 4118,
    "upazilaId": 314,
    "nameBn": "জয়নগর",
    "nameEn": ""
  },
  {
    "id": 4119,
    "upazilaId": 431,
    "nameBn": "বাজুবাঘা",
    "nameEn": ""
  },
  {
    "id": 4120,
    "upazilaId": 431,
    "nameBn": "গড়গড়ি",
    "nameEn": ""
  },
  {
    "id": 4121,
    "upazilaId": 431,
    "nameBn": "পাকুড়িয়া",
    "nameEn": ""
  },
  {
    "id": 4122,
    "upazilaId": 431,
    "nameBn": "মনিগ্রাম",
    "nameEn": ""
  },
  {
    "id": 4123,
    "upazilaId": 431,
    "nameBn": "বাউসা",
    "nameEn": ""
  },
  {
    "id": 4124,
    "upazilaId": 431,
    "nameBn": "আড়ানী",
    "nameEn": ""
  },
  {
    "id": 4125,
    "upazilaId": 431,
    "nameBn": "চকরাজাপুর",
    "nameEn": ""
  },
  {
    "id": 4126,
    "upazilaId": 432,
    "nameBn": "ইউসুফপুর",
    "nameEn": ""
  },
  {
    "id": 4127,
    "upazilaId": 432,
    "nameBn": "শলুয়া",
    "nameEn": ""
  },
  {
    "id": 4128,
    "upazilaId": 432,
    "nameBn": "সরদহ",
    "nameEn": ""
  },
  {
    "id": 4129,
    "upazilaId": 432,
    "nameBn": "নিমপাড়া",
    "nameEn": ""
  },
  {
    "id": 4130,
    "upazilaId": 432,
    "nameBn": "চারঘাট",
    "nameEn": ""
  },
  {
    "id": 4131,
    "upazilaId": 432,
    "nameBn": "ভায়ালক্ষীপুর",
    "nameEn": ""
  },
  {
    "id": 4132,
    "upazilaId": 433,
    "nameBn": "দর্শনপাড়া",
    "nameEn": ""
  },
  {
    "id": 4133,
    "upazilaId": 433,
    "nameBn": "হুজুরিপাড়া",
    "nameEn": ""
  },
  {
    "id": 4134,
    "upazilaId": 433,
    "nameBn": "দামকুড়া",
    "nameEn": ""
  },
  {
    "id": 4135,
    "upazilaId": 433,
    "nameBn": "হরিপুর",
    "nameEn": ""
  },
  {
    "id": 4136,
    "upazilaId": 433,
    "nameBn": "হড়গ্রাম",
    "nameEn": ""
  },
  {
    "id": 4137,
    "upazilaId": 433,
    "nameBn": "হরিয়ান",
    "nameEn": ""
  },
  {
    "id": 4138,
    "upazilaId": 433,
    "nameBn": "বড়গাছি",
    "nameEn": ""
  },
  {
    "id": 4139,
    "upazilaId": 433,
    "nameBn": "পারিলা",
    "nameEn": ""
  },
  {
    "id": 4140,
    "upazilaId": 434,
    "nameBn": "পুঠিয়া",
    "nameEn": ""
  },
  {
    "id": 4141,
    "upazilaId": 434,
    "nameBn": "বেলপুকুরিয়া",
    "nameEn": ""
  },
  {
    "id": 4142,
    "upazilaId": 434,
    "nameBn": "বানেশ্বর",
    "nameEn": ""
  },
  {
    "id": 4143,
    "upazilaId": 434,
    "nameBn": "ভালুকগাছী",
    "nameEn": ""
  },
  {
    "id": 4144,
    "upazilaId": 434,
    "nameBn": "শিলমাড়িয়া",
    "nameEn": ""
  },
  {
    "id": 4145,
    "upazilaId": 434,
    "nameBn": "জিউপাড়া",
    "nameEn": ""
  },
  {
    "id": 4146,
    "upazilaId": 435,
    "nameBn": "বেলকুচি সদর",
    "nameEn": ""
  },
  {
    "id": 4147,
    "upazilaId": 435,
    "nameBn": "রাজাপুর",
    "nameEn": ""
  },
  {
    "id": 4148,
    "upazilaId": 435,
    "nameBn": "ভাঙ্গাবাড়ী",
    "nameEn": ""
  },
  {
    "id": 4149,
    "upazilaId": 435,
    "nameBn": "দৌলতপুর",
    "nameEn": ""
  },
  {
    "id": 4150,
    "upazilaId": 435,
    "nameBn": "ধুকুরিয়াবেড়া",
    "nameEn": ""
  },
  {
    "id": 4151,
    "upazilaId": 435,
    "nameBn": "বড়ধুল",
    "nameEn": ""
  },
  {
    "id": 4152,
    "upazilaId": 436,
    "nameBn": "ভদ্রঘাট",
    "nameEn": ""
  },
  {
    "id": 4153,
    "upazilaId": 436,
    "nameBn": "ঝাঐল",
    "nameEn": ""
  },
  {
    "id": 4154,
    "upazilaId": 436,
    "nameBn": "জামতৈল",
    "nameEn": ""
  },
  {
    "id": 4155,
    "upazilaId": 436,
    "nameBn": "রায়দৌলতপুর",
    "nameEn": ""
  },
  {
    "id": 4156,
    "upazilaId": 437,
    "nameBn": "সদিয়া চাঁদপুর",
    "nameEn": ""
  },
  {
    "id": 4157,
    "upazilaId": 437,
    "nameBn": "স্থল",
    "nameEn": ""
  },
  {
    "id": 4158,
    "upazilaId": 437,
    "nameBn": "ঘোরজান",
    "nameEn": ""
  },
  {
    "id": 4159,
    "upazilaId": 437,
    "nameBn": "উমারপুর",
    "nameEn": ""
  },
  {
    "id": 4160,
    "upazilaId": 437,
    "nameBn": "খাসকাউলিয়া",
    "nameEn": ""
  },
  {
    "id": 4161,
    "upazilaId": 437,
    "nameBn": "খাসপুকুরিয়া",
    "nameEn": ""
  },
  {
    "id": 4162,
    "upazilaId": 437,
    "nameBn": "বাঘুটিয়া",
    "nameEn": ""
  },
  {
    "id": 4163,
    "upazilaId": 438,
    "nameBn": "চালিতাডাঙ্গা",
    "nameEn": ""
  },
  {
    "id": 4164,
    "upazilaId": 438,
    "nameBn": "চরগিরিশ",
    "nameEn": ""
  },
  {
    "id": 4165,
    "upazilaId": 438,
    "nameBn": "গান্ধাইল",
    "nameEn": ""
  },
  {
    "id": 4166,
    "upazilaId": 438,
    "nameBn": "কাজীপুর",
    "nameEn": ""
  },
  {
    "id": 4167,
    "upazilaId": 438,
    "nameBn": "খাসরাজবাড়ী",
    "nameEn": ""
  },
  {
    "id": 4168,
    "upazilaId": 438,
    "nameBn": "মাইজবাড়ী",
    "nameEn": ""
  },
  {
    "id": 4169,
    "upazilaId": 438,
    "nameBn": "মনসুরনগর",
    "nameEn": ""
  },
  {
    "id": 4170,
    "upazilaId": 438,
    "nameBn": "নাটুয়ারপাড়া",
    "nameEn": ""
  },
  {
    "id": 4171,
    "upazilaId": 438,
    "nameBn": "নিশ্চিন্তপুর",
    "nameEn": ""
  },
  {
    "id": 4172,
    "upazilaId": 438,
    "nameBn": "সোনামুখী",
    "nameEn": ""
  },
  {
    "id": 4173,
    "upazilaId": 438,
    "nameBn": "শুভগাছা",
    "nameEn": ""
  },
  {
    "id": 4174,
    "upazilaId": 438,
    "nameBn": "তেকানী",
    "nameEn": ""
  },
  {
    "id": 4175,
    "upazilaId": 439,
    "nameBn": "ধামাইনগর",
    "nameEn": ""
  },
  {
    "id": 4176,
    "upazilaId": 439,
    "nameBn": "সোনাখাড়া",
    "nameEn": ""
  },
  {
    "id": 4177,
    "upazilaId": 439,
    "nameBn": "ধুবিল",
    "nameEn": ""
  },
  {
    "id": 4178,
    "upazilaId": 439,
    "nameBn": "ব্রহ্মগাছা",
    "nameEn": ""
  },
  {
    "id": 4179,
    "upazilaId": 439,
    "nameBn": "নলকা",
    "nameEn": ""
  },
  {
    "id": 4180,
    "upazilaId": 439,
    "nameBn": "পাঙ্গাশী",
    "nameEn": ""
  },
  {
    "id": 4181,
    "upazilaId": 439,
    "nameBn": "চান্দাইকোনা",
    "nameEn": ""
  },
  {
    "id": 4182,
    "upazilaId": 439,
    "nameBn": "ঘুড়কা",
    "nameEn": ""
  },
  {
    "id": 4183,
    "upazilaId": 439,
    "nameBn": "ধানগড়া",
    "nameEn": ""
  },
  {
    "id": 4184,
    "upazilaId": 440,
    "nameBn": "রুপবাটি",
    "nameEn": ""
  },
  {
    "id": 4185,
    "upazilaId": 440,
    "nameBn": "বেলতৈল",
    "nameEn": ""
  },
  {
    "id": 4186,
    "upazilaId": 440,
    "nameBn": "জালালপুর",
    "nameEn": ""
  },
  {
    "id": 4187,
    "upazilaId": 440,
    "nameBn": "কায়েমপুর",
    "nameEn": ""
  },
  {
    "id": 4188,
    "upazilaId": 440,
    "nameBn": "গাড়াদহ",
    "nameEn": ""
  },
  {
    "id": 4189,
    "upazilaId": 440,
    "nameBn": "পোতাজিয়া",
    "nameEn": ""
  },
  {
    "id": 4190,
    "upazilaId": 440,
    "nameBn": "গালা",
    "nameEn": ""
  },
  {
    "id": 4191,
    "upazilaId": 440,
    "nameBn": "পোরজনা",
    "nameEn": ""
  },
  {
    "id": 4192,
    "upazilaId": 440,
    "nameBn": "হাবিবুল্লাহ নগর",
    "nameEn": ""
  },
  {
    "id": 4193,
    "upazilaId": 440,
    "nameBn": "খুকনী",
    "nameEn": ""
  },
  {
    "id": 4194,
    "upazilaId": 440,
    "nameBn": "কৈজুরী",
    "nameEn": ""
  },
  {
    "id": 4195,
    "upazilaId": 440,
    "nameBn": "সোনাতনী",
    "nameEn": ""
  },
  {
    "id": 4196,
    "upazilaId": 440,
    "nameBn": "নরিনা",
    "nameEn": ""
  },
  {
    "id": 4197,
    "upazilaId": 441,
    "nameBn": "বাগবাটি",
    "nameEn": ""
  },
  {
    "id": 4198,
    "upazilaId": 441,
    "nameBn": "বাহুলি",
    "nameEn": ""
  },
  {
    "id": 4199,
    "upazilaId": 441,
    "nameBn": "কালিয়াহরিপুর",
    "nameEn": ""
  },
  {
    "id": 4200,
    "upazilaId": 441,
    "nameBn": "কাওয়াখোলা",
    "nameEn": ""
  },
  {
    "id": 4201,
    "upazilaId": 441,
    "nameBn": "খোকশাবাড়ী",
    "nameEn": ""
  },
  {
    "id": 4202,
    "upazilaId": 441,
    "nameBn": "মেছড়া",
    "nameEn": ""
  },
  {
    "id": 4203,
    "upazilaId": 441,
    "nameBn": "রতনকান্দি",
    "nameEn": ""
  },
  {
    "id": 4204,
    "upazilaId": 441,
    "nameBn": "সয়দাবাদ",
    "nameEn": ""
  },
  {
    "id": 4205,
    "upazilaId": 441,
    "nameBn": "শিয়ালকোল",
    "nameEn": ""
  },
  {
    "id": 4206,
    "upazilaId": 441,
    "nameBn": "ছোনগাছা",
    "nameEn": ""
  },
  {
    "id": 4207,
    "upazilaId": 442,
    "nameBn": "সগুনা",
    "nameEn": ""
  },
  {
    "id": 4208,
    "upazilaId": 442,
    "nameBn": "তালম",
    "nameEn": ""
  },
  {
    "id": 4209,
    "upazilaId": 442,
    "nameBn": "বারুহাস",
    "nameEn": ""
  },
  {
    "id": 4210,
    "upazilaId": 442,
    "nameBn": "মাগুড়াবিনোদ",
    "nameEn": ""
  },
  {
    "id": 4211,
    "upazilaId": 442,
    "nameBn": "নওগাঁ",
    "nameEn": ""
  },
  {
    "id": 4212,
    "upazilaId": 442,
    "nameBn": "তাড়াশ সদর",
    "nameEn": ""
  },
  {
    "id": 4213,
    "upazilaId": 442,
    "nameBn": "মাধাইনগর",
    "nameEn": ""
  },
  {
    "id": 4214,
    "upazilaId": 442,
    "nameBn": "দেশীগ্রাম",
    "nameEn": ""
  },
  {
    "id": 4215,
    "upazilaId": 443,
    "nameBn": "উল্লাপাড়া সদর",
    "nameEn": ""
  },
  {
    "id": 4216,
    "upazilaId": 443,
    "nameBn": "পূর্ণিমাগাতী",
    "nameEn": ""
  },
  {
    "id": 4217,
    "upazilaId": 443,
    "nameBn": "উধুনিয়া",
    "nameEn": ""
  },
  {
    "id": 4218,
    "upazilaId": 443,
    "nameBn": "বড়পাঙ্গাসী",
    "nameEn": ""
  },
  {
    "id": 4219,
    "upazilaId": 443,
    "nameBn": "হাটিকুমরুল",
    "nameEn": ""
  },
  {
    "id": 4220,
    "upazilaId": 443,
    "nameBn": "পঞ্চক্রোশী",
    "nameEn": ""
  },
  {
    "id": 4221,
    "upazilaId": 443,
    "nameBn": "সলপ",
    "nameEn": ""
  },
  {
    "id": 4222,
    "upazilaId": 443,
    "nameBn": "কয়রা",
    "nameEn": ""
  },
  {
    "id": 4223,
    "upazilaId": 443,
    "nameBn": "মোহনপুর",
    "nameEn": ""
  },
  {
    "id": 4224,
    "upazilaId": 443,
    "nameBn": "দুর্গানগর",
    "nameEn": ""
  },
  {
    "id": 4225,
    "upazilaId": 443,
    "nameBn": "বড়হর",
    "nameEn": ""
  },
  {
    "id": 4226,
    "upazilaId": 443,
    "nameBn": "সলংগা",
    "nameEn": ""
  },
  {
    "id": 4227,
    "upazilaId": 443,
    "nameBn": "রামকৃষ্ণপুর",
    "nameEn": ""
  },
  {
    "id": 4228,
    "upazilaId": 443,
    "nameBn": "বাঙ্গালা",
    "nameEn": ""
  },
  {
    "id": 4229,
    "upazilaId": 444,
    "nameBn": "বড়লেখা",
    "nameEn": ""
  },
  {
    "id": 4230,
    "upazilaId": 444,
    "nameBn": "বর্ণি",
    "nameEn": ""
  },
  {
    "id": 4231,
    "upazilaId": 444,
    "nameBn": "দক্ষিণ শাহবাজপুর",
    "nameEn": ""
  },
  {
    "id": 4232,
    "upazilaId": 444,
    "nameBn": "দক্ষিণভাগ দক্ষিণ",
    "nameEn": ""
  },
  {
    "id": 4233,
    "upazilaId": 444,
    "nameBn": "দাসের বাজার",
    "nameEn": ""
  },
  {
    "id": 4234,
    "upazilaId": 444,
    "nameBn": "নিজ বাহাদুরপুর",
    "nameEn": ""
  },
  {
    "id": 4235,
    "upazilaId": 444,
    "nameBn": "সুজানগর",
    "nameEn": ""
  },
  {
    "id": 4236,
    "upazilaId": 444,
    "nameBn": "দক্ষিণভাগ উত্তর",
    "nameEn": ""
  },
  {
    "id": 4237,
    "upazilaId": 444,
    "nameBn": "উত্তর শাহবাজপুর",
    "nameEn": ""
  },
  {
    "id": 4238,
    "upazilaId": 444,
    "nameBn": "তালিমপুর",
    "nameEn": ""
  },
  {
    "id": 4239,
    "upazilaId": 445,
    "nameBn": "বরমচাল",
    "nameEn": ""
  },
  {
    "id": 4240,
    "upazilaId": 445,
    "nameBn": "ভূকশিমইল",
    "nameEn": ""
  },
  {
    "id": 4241,
    "upazilaId": 445,
    "nameBn": "জয়চণ্ডী",
    "nameEn": ""
  },
  {
    "id": 4242,
    "upazilaId": 445,
    "nameBn": "ব্রাহ্মণবাজার",
    "nameEn": ""
  },
  {
    "id": 4243,
    "upazilaId": 445,
    "nameBn": "কাদিপুর",
    "nameEn": ""
  },
  {
    "id": 4244,
    "upazilaId": 445,
    "nameBn": "কুলাউড়া",
    "nameEn": ""
  },
  {
    "id": 4245,
    "upazilaId": 445,
    "nameBn": "রাউৎগাঁও",
    "nameEn": ""
  },
  {
    "id": 4246,
    "upazilaId": 445,
    "nameBn": "টিলাগাঁও",
    "nameEn": ""
  },
  {
    "id": 4247,
    "upazilaId": 445,
    "nameBn": "শরীফপুর",
    "nameEn": ""
  },
  {
    "id": 4248,
    "upazilaId": 445,
    "nameBn": "পৃথিমপাশা",
    "nameEn": ""
  },
  {
    "id": 4249,
    "upazilaId": 445,
    "nameBn": "কর্মধা",
    "nameEn": ""
  },
  {
    "id": 4250,
    "upazilaId": 445,
    "nameBn": "ভাটেরা",
    "nameEn": ""
  },
  {
    "id": 4251,
    "upazilaId": 445,
    "nameBn": "হাজীপুর",
    "nameEn": ""
  },
  {
    "id": 4252,
    "upazilaId": 446,
    "nameBn": "ফতেপুর",
    "nameEn": ""
  },
  {
    "id": 4253,
    "upazilaId": 446,
    "nameBn": "উত্তরভাগ",
    "nameEn": ""
  },
  {
    "id": 4254,
    "upazilaId": 446,
    "nameBn": "মুন্সিবাজার",
    "nameEn": ""
  },
  {
    "id": 4255,
    "upazilaId": 446,
    "nameBn": "পাঁচগাঁও",
    "nameEn": ""
  },
  {
    "id": 4256,
    "upazilaId": 446,
    "nameBn": "রাজনগর",
    "nameEn": ""
  },
  {
    "id": 4257,
    "upazilaId": 446,
    "nameBn": "টেংরা",
    "nameEn": ""
  },
  {
    "id": 4258,
    "upazilaId": 446,
    "nameBn": "কামারচাক",
    "nameEn": ""
  },
  {
    "id": 4259,
    "upazilaId": 446,
    "nameBn": "মনসুরনগর",
    "nameEn": ""
  },
  {
    "id": 4260,
    "upazilaId": 447,
    "nameBn": "রহিমপুর",
    "nameEn": ""
  },
  {
    "id": 4261,
    "upazilaId": 447,
    "nameBn": "পতনঊষার",
    "nameEn": ""
  },
  {
    "id": 4262,
    "upazilaId": 447,
    "nameBn": "মুন্সিবাজার",
    "nameEn": ""
  },
  {
    "id": 4263,
    "upazilaId": 447,
    "nameBn": "শমসেরনগর",
    "nameEn": ""
  },
  {
    "id": 4264,
    "upazilaId": 447,
    "nameBn": "কমলগঞ্জ",
    "nameEn": ""
  },
  {
    "id": 4265,
    "upazilaId": 447,
    "nameBn": "আলীনগর",
    "nameEn": ""
  },
  {
    "id": 4266,
    "upazilaId": 447,
    "nameBn": "আদমপুর",
    "nameEn": ""
  },
  {
    "id": 4267,
    "upazilaId": 447,
    "nameBn": "মাধবপুর",
    "nameEn": ""
  },
  {
    "id": 4268,
    "upazilaId": 447,
    "nameBn": "ইসলামপুর",
    "nameEn": ""
  },
  {
    "id": 4269,
    "upazilaId": 448,
    "nameBn": "মির্জাপুর",
    "nameEn": ""
  },
  {
    "id": 4270,
    "upazilaId": 448,
    "nameBn": "ভূনবীর",
    "nameEn": ""
  },
  {
    "id": 4271,
    "upazilaId": 448,
    "nameBn": "শ্রীমঙ্গল",
    "nameEn": ""
  },
  {
    "id": 4272,
    "upazilaId": 448,
    "nameBn": "সিন্দুরখান",
    "nameEn": ""
  },
  {
    "id": 4273,
    "upazilaId": 448,
    "nameBn": "কালাপুর",
    "nameEn": ""
  },
  {
    "id": 4274,
    "upazilaId": 448,
    "nameBn": "আশিদ্রোন",
    "nameEn": ""
  },
  {
    "id": 4275,
    "upazilaId": 448,
    "nameBn": "রাজঘাট",
    "nameEn": ""
  },
  {
    "id": 4276,
    "upazilaId": 448,
    "nameBn": "কালীঘাট",
    "nameEn": ""
  },
  {
    "id": 4277,
    "upazilaId": 448,
    "nameBn": "সাতগাঁও",
    "nameEn": ""
  },
  {
    "id": 4278,
    "upazilaId": 449,
    "nameBn": "খলিলপুর",
    "nameEn": ""
  },
  {
    "id": 4279,
    "upazilaId": 449,
    "nameBn": "মনুমুখ",
    "nameEn": ""
  },
  {
    "id": 4280,
    "upazilaId": 449,
    "nameBn": "কামালপুর",
    "nameEn": ""
  },
  {
    "id": 4281,
    "upazilaId": 449,
    "nameBn": "আপার কাগাবলা",
    "nameEn": ""
  },
  {
    "id": 4282,
    "upazilaId": 449,
    "nameBn": "আখাইলকুড়া",
    "nameEn": ""
  },
  {
    "id": 4283,
    "upazilaId": 449,
    "nameBn": "একাটুনা",
    "nameEn": ""
  },
  {
    "id": 4284,
    "upazilaId": 449,
    "nameBn": "চাঁদনীঘাট",
    "nameEn": ""
  },
  {
    "id": 4285,
    "upazilaId": 449,
    "nameBn": "কনকপুর",
    "nameEn": ""
  },
  {
    "id": 4286,
    "upazilaId": 449,
    "nameBn": "আমতৈল",
    "nameEn": ""
  },
  {
    "id": 4287,
    "upazilaId": 449,
    "nameBn": "নাজিরাবাদ",
    "nameEn": ""
  },
  {
    "id": 4288,
    "upazilaId": 449,
    "nameBn": "মোস্তফাপুর",
    "nameEn": ""
  },
  {
    "id": 4289,
    "upazilaId": 449,
    "nameBn": "গিয়াসনগর",
    "nameEn": ""
  },
  {
    "id": 4290,
    "upazilaId": 450,
    "nameBn": "জায়ফরনগর",
    "nameEn": ""
  },
  {
    "id": 4291,
    "upazilaId": 450,
    "nameBn": "পশ্চিম জুড়ী",
    "nameEn": ""
  },
  {
    "id": 4292,
    "upazilaId": 450,
    "nameBn": "পূর্ব জুড়ী",
    "nameEn": ""
  },
  {
    "id": 4293,
    "upazilaId": 450,
    "nameBn": "গোয়ালবাড়ি",
    "nameEn": ""
  },
  {
    "id": 4294,
    "upazilaId": 450,
    "nameBn": "সাগরনাল",
    "nameEn": ""
  },
  {
    "id": 4295,
    "upazilaId": 450,
    "nameBn": "ফুলতলা",
    "nameEn": ""
  },
  {
    "id": 4296,
    "upazilaId": 451,
    "nameBn": "কুশিয়ারা বাজার",
    "nameEn": ""
  },
  {
    "id": 4297,
    "upazilaId": 451,
    "nameBn": "বোয়ালজুড়",
    "nameEn": ""
  },
  {
    "id": 4298,
    "upazilaId": 451,
    "nameBn": "দেওয়ানবাজার",
    "nameEn": ""
  },
  {
    "id": 4299,
    "upazilaId": 451,
    "nameBn": "আজিজপুর",
    "nameEn": ""
  },
  {
    "id": 4300,
    "upazilaId": 451,
    "nameBn": "বালাগঞ্জ",
    "nameEn": ""
  },
  {
    "id": 4301,
    "upazilaId": 451,
    "nameBn": "ওসমানীগঞ্জ",
    "nameEn": ""
  },
  {
    "id": 4302,
    "upazilaId": 452,
    "nameBn": "আলীনগর",
    "nameEn": ""
  },
  {
    "id": 4303,
    "upazilaId": 452,
    "nameBn": "কুড়ারবাজার",
    "nameEn": ""
  },
  {
    "id": 4304,
    "upazilaId": 452,
    "nameBn": "চরখাই",
    "nameEn": ""
  },
  {
    "id": 4305,
    "upazilaId": 452,
    "nameBn": "দুবাগ",
    "nameEn": ""
  },
  {
    "id": 4306,
    "upazilaId": 452,
    "nameBn": "মাথিউরা",
    "nameEn": ""
  },
  {
    "id": 4307,
    "upazilaId": 452,
    "nameBn": "তিলপাড়া",
    "nameEn": ""
  },
  {
    "id": 4308,
    "upazilaId": 452,
    "nameBn": "মুড়িয়া",
    "nameEn": ""
  },
  {
    "id": 4309,
    "upazilaId": 452,
    "nameBn": "মোল্লাপুর",
    "nameEn": ""
  },
  {
    "id": 4310,
    "upazilaId": 452,
    "nameBn": "লাউতা",
    "nameEn": ""
  },
  {
    "id": 4311,
    "upazilaId": 452,
    "nameBn": "শেওলা",
    "nameEn": ""
  },
  {
    "id": 4312,
    "upazilaId": 453,
    "nameBn": "লামাকাজী",
    "nameEn": ""
  },
  {
    "id": 4313,
    "upazilaId": 453,
    "nameBn": "খাজাঞ্চী",
    "nameEn": ""
  },
  {
    "id": 4314,
    "upazilaId": 453,
    "nameBn": "অলংকারী",
    "nameEn": ""
  },
  {
    "id": 4315,
    "upazilaId": 453,
    "nameBn": "রামপাশা",
    "nameEn": ""
  },
  {
    "id": 4316,
    "upazilaId": 453,
    "nameBn": "দৌলতপুর",
    "nameEn": ""
  },
  {
    "id": 4317,
    "upazilaId": 453,
    "nameBn": "বিশ্বনাথ",
    "nameEn": ""
  },
  {
    "id": 4318,
    "upazilaId": 453,
    "nameBn": "দেওকলস",
    "nameEn": ""
  },
  {
    "id": 4319,
    "upazilaId": 453,
    "nameBn": "দশঘর",
    "nameEn": ""
  },
  {
    "id": 4320,
    "upazilaId": 119,
    "nameBn": "ইসলামপুর",
    "nameEn": ""
  },
  {
    "id": 4321,
    "upazilaId": 119,
    "nameBn": "কলাবাড়ী",
    "nameEn": ""
  },
  {
    "id": 4322,
    "upazilaId": 119,
    "nameBn": "তেলিখাল",
    "nameEn": ""
  },
  {
    "id": 4323,
    "upazilaId": 119,
    "nameBn": "ইছাকলস",
    "nameEn": ""
  },
  {
    "id": 4324,
    "upazilaId": 119,
    "nameBn": "রনিখাই",
    "nameEn": ""
  },
  {
    "id": 4325,
    "upazilaId": 119,
    "nameBn": "গৌরীনগর",
    "nameEn": ""
  },
  {
    "id": 4326,
    "upazilaId": 454,
    "nameBn": "ফেঞ্চুগঞ্জ",
    "nameEn": ""
  },
  {
    "id": 4327,
    "upazilaId": 454,
    "nameBn": "মাইজগাঁও",
    "nameEn": ""
  },
  {
    "id": 4328,
    "upazilaId": 454,
    "nameBn": "ঘিলাছড়া",
    "nameEn": ""
  },
  {
    "id": 4329,
    "upazilaId": 454,
    "nameBn": "কুশিয়ারা",
    "nameEn": ""
  },
  {
    "id": 4330,
    "upazilaId": 454,
    "nameBn": "মানিককোনা",
    "nameEn": ""
  },
  {
    "id": 4331,
    "upazilaId": 455,
    "nameBn": "বাঘা",
    "nameEn": ""
  },
  {
    "id": 4332,
    "upazilaId": 455,
    "nameBn": "গোলাপগঞ্জ",
    "nameEn": ""
  },
  {
    "id": 4333,
    "upazilaId": 455,
    "nameBn": "ফুলবাড়ী",
    "nameEn": ""
  },
  {
    "id": 4334,
    "upazilaId": 455,
    "nameBn": "লক্ষ্মীপাশা",
    "nameEn": ""
  },
  {
    "id": 4335,
    "upazilaId": 455,
    "nameBn": "ঢাকাদক্ষিণ",
    "nameEn": ""
  },
  {
    "id": 4336,
    "upazilaId": 455,
    "nameBn": "লক্ষণাবন্দ",
    "nameEn": ""
  },
  {
    "id": 4337,
    "upazilaId": 455,
    "nameBn": "ভাদেশ্বর",
    "nameEn": ""
  },
  {
    "id": 4338,
    "upazilaId": 455,
    "nameBn": "আমুড়া",
    "nameEn": ""
  },
  {
    "id": 4339,
    "upazilaId": 455,
    "nameBn": "বাদেপাশা",
    "nameEn": ""
  },
  {
    "id": 4340,
    "upazilaId": 455,
    "nameBn": "শরীফগঞ্জ",
    "nameEn": ""
  },
  {
    "id": 4341,
    "upazilaId": 456,
    "nameBn": "রুস্তমপুর",
    "nameEn": ""
  },
  {
    "id": 4342,
    "upazilaId": 456,
    "nameBn": "পশ্চিম জাফলং",
    "nameEn": ""
  },
  {
    "id": 4343,
    "upazilaId": 456,
    "nameBn": "পূর্ব জাফলং",
    "nameEn": ""
  },
  {
    "id": 4344,
    "upazilaId": 456,
    "nameBn": "লেঙ্গুড়া",
    "nameEn": ""
  },
  {
    "id": 4345,
    "upazilaId": 456,
    "nameBn": "পূর্ব আলীরগাঁও",
    "nameEn": ""
  },
  {
    "id": 4346,
    "upazilaId": 456,
    "nameBn": "ফতেপুর",
    "nameEn": ""
  },
  {
    "id": 4347,
    "upazilaId": 456,
    "nameBn": "গোয়াইনঘাট",
    "nameEn": ""
  },
  {
    "id": 4348,
    "upazilaId": 456,
    "nameBn": "নন্দিরগাঁও",
    "nameEn": ""
  },
  {
    "id": 4349,
    "upazilaId": 456,
    "nameBn": "তোয়াকুল",
    "nameEn": ""
  },
  {
    "id": 4350,
    "upazilaId": 456,
    "nameBn": "ডৌবাড়ী",
    "nameEn": ""
  },
  {
    "id": 4351,
    "upazilaId": 457,
    "nameBn": "নিজপাট",
    "nameEn": ""
  },
  {
    "id": 4352,
    "upazilaId": 457,
    "nameBn": "জৈন্তাপুর",
    "nameEn": ""
  },
  {
    "id": 4353,
    "upazilaId": 457,
    "nameBn": "চারিকাটা",
    "nameEn": ""
  },
  {
    "id": 4354,
    "upazilaId": 457,
    "nameBn": "দরবস্ত",
    "nameEn": ""
  },
  {
    "id": 4355,
    "upazilaId": 457,
    "nameBn": "ফতেহপুর",
    "nameEn": ""
  },
  {
    "id": 4356,
    "upazilaId": 457,
    "nameBn": "চিকনাগুল",
    "nameEn": ""
  },
  {
    "id": 4357,
    "upazilaId": 458,
    "nameBn": "লক্ষ্মীপ্রাসাদ পূর্ব",
    "nameEn": ""
  },
  {
    "id": 4358,
    "upazilaId": 458,
    "nameBn": "লক্ষ্মীপ্রাসাদ পশ্চিম",
    "nameEn": ""
  },
  {
    "id": 4359,
    "upazilaId": 458,
    "nameBn": "দীঘিরপাড় পূর্ব",
    "nameEn": ""
  },
  {
    "id": 4360,
    "upazilaId": 458,
    "nameBn": "সাতবাঁক",
    "nameEn": ""
  },
  {
    "id": 4361,
    "upazilaId": 458,
    "nameBn": "বড়চতুল",
    "nameEn": ""
  },
  {
    "id": 4362,
    "upazilaId": 458,
    "nameBn": "কানাইঘাট",
    "nameEn": ""
  },
  {
    "id": 4363,
    "upazilaId": 458,
    "nameBn": "দক্ষিণ বাণীগ্রাম",
    "nameEn": ""
  },
  {
    "id": 4364,
    "upazilaId": 458,
    "nameBn": "ঝিঙ্গাবাড়ী",
    "nameEn": ""
  },
  {
    "id": 4365,
    "upazilaId": 458,
    "nameBn": "রাজাগঞ্জ",
    "nameEn": ""
  },
  {
    "id": 4366,
    "upazilaId": 459,
    "nameBn": "কান্দিগাঁও",
    "nameEn": ""
  },
  {
    "id": 4367,
    "upazilaId": 459,
    "nameBn": "খাদিমনগর",
    "nameEn": ""
  },
  {
    "id": 4368,
    "upazilaId": 459,
    "nameBn": "খাদিমপাড়া",
    "nameEn": ""
  },
  {
    "id": 4369,
    "upazilaId": 459,
    "nameBn": "জালালাবাদ",
    "nameEn": ""
  },
  {
    "id": 4370,
    "upazilaId": 459,
    "nameBn": "টুকের বাজার",
    "nameEn": ""
  },
  {
    "id": 4371,
    "upazilaId": 459,
    "nameBn": "মোগলগাঁও",
    "nameEn": ""
  },
  {
    "id": 4372,
    "upazilaId": 459,
    "nameBn": "হাটখোলা",
    "nameEn": ""
  },
  {
    "id": 4373,
    "upazilaId": 460,
    "nameBn": "বারহাল",
    "nameEn": ""
  },
  {
    "id": 4374,
    "upazilaId": 460,
    "nameBn": "বীরশ্রী",
    "nameEn": ""
  },
  {
    "id": 4375,
    "upazilaId": 460,
    "nameBn": "কাজলসার",
    "nameEn": ""
  },
  {
    "id": 4376,
    "upazilaId": 460,
    "nameBn": "খলাছড়া",
    "nameEn": ""
  },
  {
    "id": 4377,
    "upazilaId": 460,
    "nameBn": "জকিগঞ্জ",
    "nameEn": ""
  },
  {
    "id": 4378,
    "upazilaId": 460,
    "nameBn": "সুলতানপুর",
    "nameEn": ""
  },
  {
    "id": 4379,
    "upazilaId": 460,
    "nameBn": "বারঠাকুরী",
    "nameEn": ""
  },
  {
    "id": 4380,
    "upazilaId": 460,
    "nameBn": "কসকনকপুর",
    "nameEn": ""
  },
  {
    "id": 4381,
    "upazilaId": 460,
    "nameBn": "মানিকপুর",
    "nameEn": ""
  },
  {
    "id": 4382,
    "upazilaId": 461,
    "nameBn": "মোল্লারগাঁও",
    "nameEn": ""
  },
  {
    "id": 4383,
    "upazilaId": 461,
    "nameBn": "কামালবাজার",
    "nameEn": ""
  },
  {
    "id": 4384,
    "upazilaId": 461,
    "nameBn": "তেতলী",
    "nameEn": ""
  },
  {
    "id": 4385,
    "upazilaId": 461,
    "nameBn": "সিলাম",
    "nameEn": ""
  },
  {
    "id": 4386,
    "upazilaId": 461,
    "nameBn": "লালাবাজার",
    "nameEn": ""
  },
  {
    "id": 4387,
    "upazilaId": 461,
    "nameBn": "জালালপুর",
    "nameEn": ""
  },
  {
    "id": 4388,
    "upazilaId": 461,
    "nameBn": "মোগলাবাজার দাউদপুর",
    "nameEn": ""
  },
  {
    "id": 4389,
    "upazilaId": 462,
    "nameBn": "উমরপুর",
    "nameEn": ""
  },
  {
    "id": 4390,
    "upazilaId": 462,
    "nameBn": "তাজপুর",
    "nameEn": ""
  },
  {
    "id": 4391,
    "upazilaId": 462,
    "nameBn": "পশ্চিম পৈলনপুর",
    "nameEn": ""
  },
  {
    "id": 4392,
    "upazilaId": 462,
    "nameBn": "বুরুঙ্গাবাজার",
    "nameEn": ""
  },
  {
    "id": 4393,
    "upazilaId": 462,
    "nameBn": "গোয়ালাবাজার",
    "nameEn": ""
  },
  {
    "id": 4394,
    "upazilaId": 462,
    "nameBn": "সাদীপুর",
    "nameEn": ""
  },
  {
    "id": 4395,
    "upazilaId": 462,
    "nameBn": "উসমানপুর",
    "nameEn": ""
  },
  {
    "id": 4396,
    "upazilaId": 462,
    "nameBn": "দয়ামীর",
    "nameEn": ""
  },
  {
    "id": 4397,
    "upazilaId": 463,
    "nameBn": "ছাতক সদর",
    "nameEn": ""
  },
  {
    "id": 4398,
    "upazilaId": 463,
    "nameBn": "নোয়ারাই",
    "nameEn": ""
  },
  {
    "id": 4399,
    "upazilaId": 463,
    "nameBn": "ইসলামপুর",
    "nameEn": ""
  },
  {
    "id": 4400,
    "upazilaId": 463,
    "nameBn": "কালারুকা",
    "nameEn": ""
  },
  {
    "id": 4401,
    "upazilaId": 463,
    "nameBn": "খুরমা উত্তর",
    "nameEn": ""
  },
  {
    "id": 4402,
    "upazilaId": 463,
    "nameBn": "খুরমা দক্ষিণ",
    "nameEn": ""
  },
  {
    "id": 4403,
    "upazilaId": 463,
    "nameBn": "জাউয়াবাজার",
    "nameEn": ""
  },
  {
    "id": 4404,
    "upazilaId": 463,
    "nameBn": "চরমহল্লা",
    "nameEn": ""
  },
  {
    "id": 4405,
    "upazilaId": 463,
    "nameBn": "ভাতগাঁও",
    "nameEn": ""
  },
  {
    "id": 4406,
    "upazilaId": 463,
    "nameBn": "সিংচাপইড়",
    "nameEn": ""
  },
  {
    "id": 4407,
    "upazilaId": 463,
    "nameBn": "গোবিন্দগঞ্জ সৈদেরগাঁও",
    "nameEn": ""
  },
  {
    "id": 4408,
    "upazilaId": 463,
    "nameBn": "দোলারবাজার",
    "nameEn": ""
  },
  {
    "id": 4409,
    "upazilaId": 463,
    "nameBn": "ছৈলা আফজালাবাদ",
    "nameEn": ""
  },
  {
    "id": 4410,
    "upazilaId": 464,
    "nameBn": "কলকলিয়া",
    "nameEn": ""
  },
  {
    "id": 4411,
    "upazilaId": 464,
    "nameBn": "পাটলী",
    "nameEn": ""
  },
  {
    "id": 4412,
    "upazilaId": 464,
    "nameBn": "মীরপুর",
    "nameEn": ""
  },
  {
    "id": 4413,
    "upazilaId": 464,
    "nameBn": "জগন্নাথপুর",
    "nameEn": ""
  },
  {
    "id": 4414,
    "upazilaId": 464,
    "nameBn": "চিলাউড়া হলদিপুর",
    "nameEn": ""
  },
  {
    "id": 4415,
    "upazilaId": 464,
    "nameBn": "রাণীগঞ্জ",
    "nameEn": ""
  },
  {
    "id": 4416,
    "upazilaId": 464,
    "nameBn": "সৈয়দপুর শাহারপাড়া",
    "nameEn": ""
  },
  {
    "id": 4417,
    "upazilaId": 464,
    "nameBn": "আশারকান্দি",
    "nameEn": ""
  },
  {
    "id": 4418,
    "upazilaId": 464,
    "nameBn": "পাইলগাঁও",
    "nameEn": ""
  },
  {
    "id": 4419,
    "upazilaId": 465,
    "nameBn": "বেহেলী",
    "nameEn": ""
  },
  {
    "id": 4420,
    "upazilaId": 465,
    "nameBn": "জামালগঞ্জ",
    "nameEn": ""
  },
  {
    "id": 4421,
    "upazilaId": 465,
    "nameBn": "ফেনারবাঁক",
    "nameEn": ""
  },
  {
    "id": 4422,
    "upazilaId": 465,
    "nameBn": "সাচনা বাজার",
    "nameEn": ""
  },
  {
    "id": 4423,
    "upazilaId": 465,
    "nameBn": "ভীমখালী",
    "nameEn": ""
  },
  {
    "id": 4424,
    "upazilaId": 465,
    "nameBn": "জামালগঞ্জ উত্তর",
    "nameEn": ""
  },
  {
    "id": 4425,
    "upazilaId": 466,
    "nameBn": "বাদাঘাট",
    "nameEn": ""
  },
  {
    "id": 4426,
    "upazilaId": 466,
    "nameBn": "তাহিরপুর",
    "nameEn": ""
  },
  {
    "id": 4427,
    "upazilaId": 466,
    "nameBn": "বালিজুরি",
    "nameEn": ""
  },
  {
    "id": 4428,
    "upazilaId": 466,
    "nameBn": "শ্রীপুর উত্তর",
    "nameEn": ""
  },
  {
    "id": 4429,
    "upazilaId": 466,
    "nameBn": "শ্রীপুর দক্ষিণ",
    "nameEn": ""
  },
  {
    "id": 4430,
    "upazilaId": 466,
    "nameBn": "বড়দল দক্ষিণ",
    "nameEn": ""
  },
  {
    "id": 4431,
    "upazilaId": 466,
    "nameBn": "বড়দল উত্তর",
    "nameEn": ""
  },
  {
    "id": 4432,
    "upazilaId": 467,
    "nameBn": "শিমুলবাক",
    "nameEn": ""
  },
  {
    "id": 4433,
    "upazilaId": 467,
    "nameBn": "পশ্চিম পাগলা",
    "nameEn": ""
  },
  {
    "id": 4434,
    "upazilaId": 467,
    "nameBn": "পূর্ব পাগলা",
    "nameEn": ""
  },
  {
    "id": 4435,
    "upazilaId": 467,
    "nameBn": "জয়কলস",
    "nameEn": ""
  },
  {
    "id": 4436,
    "upazilaId": 467,
    "nameBn": "পাথারিয়া",
    "nameEn": ""
  },
  {
    "id": 4437,
    "upazilaId": 467,
    "nameBn": "দরগাপাশা",
    "nameEn": ""
  },
  {
    "id": 4438,
    "upazilaId": 467,
    "nameBn": "পূর্ব বীরগাঁও",
    "nameEn": ""
  },
  {
    "id": 4439,
    "upazilaId": 467,
    "nameBn": "পশ্চিম বীরগাঁও",
    "nameEn": ""
  },
  {
    "id": 4440,
    "upazilaId": 468,
    "nameBn": "রফিনগর",
    "nameEn": ""
  },
  {
    "id": 4441,
    "upazilaId": 468,
    "nameBn": "ভাটিপাড়া",
    "nameEn": ""
  },
  {
    "id": 4442,
    "upazilaId": 468,
    "nameBn": "রাজানগর",
    "nameEn": ""
  },
  {
    "id": 4443,
    "upazilaId": 468,
    "nameBn": "দিরাই",
    "nameEn": ""
  },
  {
    "id": 4444,
    "upazilaId": 468,
    "nameBn": "চরনারচর",
    "nameEn": ""
  },
  {
    "id": 4445,
    "upazilaId": 468,
    "nameBn": "দিরাই সরমঙ্গল",
    "nameEn": ""
  },
  {
    "id": 4446,
    "upazilaId": 468,
    "nameBn": "করিমপুর",
    "nameEn": ""
  },
  {
    "id": 4447,
    "upazilaId": 468,
    "nameBn": "জগদল",
    "nameEn": ""
  },
  {
    "id": 4448,
    "upazilaId": 468,
    "nameBn": "তাড়ল",
    "nameEn": ""
  },
  {
    "id": 4449,
    "upazilaId": 468,
    "nameBn": "কুলঞ্জ",
    "nameEn": ""
  },
  {
    "id": 4450,
    "upazilaId": 469,
    "nameBn": "বাংলাবাজার",
    "nameEn": ""
  },
  {
    "id": 4451,
    "upazilaId": 469,
    "nameBn": "দোয়ারাবাজার",
    "nameEn": ""
  },
  {
    "id": 4452,
    "upazilaId": 469,
    "nameBn": "নরসিংহপুর",
    "nameEn": ""
  },
  {
    "id": 4453,
    "upazilaId": 469,
    "nameBn": "মান্নারগাঁও",
    "nameEn": ""
  },
  {
    "id": 4454,
    "upazilaId": 469,
    "nameBn": "পাণ্ডারগাঁও",
    "nameEn": ""
  },
  {
    "id": 4455,
    "upazilaId": 469,
    "nameBn": "দোহালিয়া",
    "nameEn": ""
  },
  {
    "id": 4456,
    "upazilaId": 469,
    "nameBn": "লক্ষ্মীপুর",
    "nameEn": ""
  },
  {
    "id": 4457,
    "upazilaId": 469,
    "nameBn": "বোগলাবাজার",
    "nameEn": ""
  },
  {
    "id": 4458,
    "upazilaId": 469,
    "nameBn": "সুরমা",
    "nameEn": ""
  },
  {
    "id": 4459,
    "upazilaId": 470,
    "nameBn": "পাইকুরাটি",
    "nameEn": ""
  },
  {
    "id": 4460,
    "upazilaId": 470,
    "nameBn": "সেলবরষ",
    "nameEn": ""
  },
  {
    "id": 4461,
    "upazilaId": 470,
    "nameBn": "ধর্মপাশা",
    "nameEn": ""
  },
  {
    "id": 4462,
    "upazilaId": 470,
    "nameBn": "জয়শ্রী",
    "nameEn": ""
  },
  {
    "id": 4463,
    "upazilaId": 470,
    "nameBn": "সুখাইড় রাজাপুর উত্তর",
    "nameEn": ""
  },
  {
    "id": 4464,
    "upazilaId": 470,
    "nameBn": "সুখাইড় রাজাপুর দক্ষিণ",
    "nameEn": ""
  },
  {
    "id": 4465,
    "upazilaId": 471,
    "nameBn": "সলুকাবাদ",
    "nameEn": ""
  },
  {
    "id": 4466,
    "upazilaId": 471,
    "nameBn": "ধনপুর",
    "nameEn": ""
  },
  {
    "id": 4467,
    "upazilaId": 471,
    "nameBn": "পলাশ",
    "nameEn": ""
  },
  {
    "id": 4468,
    "upazilaId": 471,
    "nameBn": "ফতেপুর",
    "nameEn": ""
  },
  {
    "id": 4469,
    "upazilaId": 471,
    "nameBn": "বাদাঘাট দক্ষিণ",
    "nameEn": ""
  },
  {
    "id": 4470,
    "upazilaId": 472,
    "nameBn": "আটগাঁও",
    "nameEn": ""
  },
  {
    "id": 4471,
    "upazilaId": 472,
    "nameBn": "হবিবপুর",
    "nameEn": ""
  },
  {
    "id": 4472,
    "upazilaId": 472,
    "nameBn": "বাহাড়া",
    "nameEn": ""
  },
  {
    "id": 4473,
    "upazilaId": 472,
    "nameBn": "শাল্লা",
    "nameEn": ""
  },
  {
    "id": 4474,
    "upazilaId": 473,
    "nameBn": "লক্ষণশ্রী",
    "nameEn": ""
  },
  {
    "id": 4475,
    "upazilaId": 473,
    "nameBn": "মোহনপুর",
    "nameEn": ""
  },
  {
    "id": 4476,
    "upazilaId": 473,
    "nameBn": "কাঠইর",
    "nameEn": ""
  },
  {
    "id": 4477,
    "upazilaId": 473,
    "nameBn": "গৌরারং",
    "nameEn": ""
  },
  {
    "id": 4478,
    "upazilaId": 473,
    "nameBn": "সুরমা",
    "nameEn": ""
  },
  {
    "id": 4479,
    "upazilaId": 473,
    "nameBn": "জাহাঙ্গীরনগর",
    "nameEn": ""
  },
  {
    "id": 4480,
    "upazilaId": 473,
    "nameBn": "রংগারচর",
    "nameEn": ""
  },
  {
    "id": 4481,
    "upazilaId": 473,
    "nameBn": "কুরবাননগর",
    "nameEn": ""
  },
  {
    "id": 4482,
    "upazilaId": 473,
    "nameBn": "মোল্লাপাড়া",
    "nameEn": ""
  },
  {
    "id": 4483,
    "upazilaId": 474,
    "nameBn": "বংশীকুণ্ডা উত্তর",
    "nameEn": ""
  },
  {
    "id": 4484,
    "upazilaId": 474,
    "nameBn": "বংশীকুণ্ডা দক্ষিণ",
    "nameEn": ""
  },
  {
    "id": 4485,
    "upazilaId": 474,
    "nameBn": "চামরদানী",
    "nameEn": ""
  },
  {
    "id": 4486,
    "upazilaId": 474,
    "nameBn": "মধ্যনগর",
    "nameEn": ""
  },
  {
    "id": 4487,
    "upazilaId": 475,
    "nameBn": "আজমিরীগঞ্জ সদর",
    "nameEn": ""
  },
  {
    "id": 4488,
    "upazilaId": 475,
    "nameBn": "বদলপুর",
    "nameEn": ""
  },
  {
    "id": 4489,
    "upazilaId": 475,
    "nameBn": "জলসুখা",
    "nameEn": ""
  },
  {
    "id": 4490,
    "upazilaId": 475,
    "nameBn": "শিবপাশা",
    "nameEn": ""
  },
  {
    "id": 4491,
    "upazilaId": 475,
    "nameBn": "কাকাইলছেও",
    "nameEn": ""
  },
  {
    "id": 4492,
    "upazilaId": 476,
    "nameBn": "গাজীপুর",
    "nameEn": ""
  },
  {
    "id": 4493,
    "upazilaId": 476,
    "nameBn": "আহম্মদাবাদ",
    "nameEn": ""
  },
  {
    "id": 4494,
    "upazilaId": 476,
    "nameBn": "দেওরগাছ",
    "nameEn": ""
  },
  {
    "id": 4495,
    "upazilaId": 476,
    "nameBn": "পাইকপাড়া",
    "nameEn": ""
  },
  {
    "id": 4496,
    "upazilaId": 476,
    "nameBn": "শানখলা",
    "nameEn": ""
  },
  {
    "id": 4497,
    "upazilaId": 476,
    "nameBn": "চুনারুঘাট",
    "nameEn": ""
  },
  {
    "id": 4498,
    "upazilaId": 476,
    "nameBn": "উবাহাটা",
    "nameEn": ""
  },
  {
    "id": 4499,
    "upazilaId": 476,
    "nameBn": "সাটিয়াজুরী",
    "nameEn": ""
  },
  {
    "id": 4500,
    "upazilaId": 476,
    "nameBn": "রাণীগাঁও",
    "nameEn": ""
  },
  {
    "id": 4501,
    "upazilaId": 476,
    "nameBn": "মিরাশী",
    "nameEn": ""
  },
  {
    "id": 4502,
    "upazilaId": 477,
    "nameBn": "বড়ভাকৈর পশ্চিম",
    "nameEn": ""
  },
  {
    "id": 4503,
    "upazilaId": 477,
    "nameBn": "বড়ভাকৈর পূর্ব",
    "nameEn": ""
  },
  {
    "id": 4504,
    "upazilaId": 477,
    "nameBn": "ইনাতগঞ্জ",
    "nameEn": ""
  },
  {
    "id": 4505,
    "upazilaId": 477,
    "nameBn": "দীঘলবাক",
    "nameEn": ""
  },
  {
    "id": 4506,
    "upazilaId": 477,
    "nameBn": "আউশকান্দি",
    "nameEn": ""
  },
  {
    "id": 4507,
    "upazilaId": 477,
    "nameBn": "কুর্শি",
    "nameEn": ""
  },
  {
    "id": 4508,
    "upazilaId": 477,
    "nameBn": "করগাঁও",
    "nameEn": ""
  },
  {
    "id": 4509,
    "upazilaId": 477,
    "nameBn": "নবীগঞ্জ সদর",
    "nameEn": ""
  },
  {
    "id": 4510,
    "upazilaId": 477,
    "nameBn": "বাউসা",
    "nameEn": ""
  },
  {
    "id": 4511,
    "upazilaId": 477,
    "nameBn": "দেবপাড়া",
    "nameEn": ""
  },
  {
    "id": 4512,
    "upazilaId": 477,
    "nameBn": "গজনাইপুর",
    "nameEn": ""
  },
  {
    "id": 4513,
    "upazilaId": 477,
    "nameBn": "কালিয়ারভাঙ্গা",
    "nameEn": ""
  },
  {
    "id": 4514,
    "upazilaId": 477,
    "nameBn": "পানিউমদা",
    "nameEn": ""
  },
  {
    "id": 4515,
    "upazilaId": 478,
    "nameBn": "বানিয়াচং উত্তর পূর্ব",
    "nameEn": ""
  },
  {
    "id": 4516,
    "upazilaId": 478,
    "nameBn": "বানিয়াচং উত্তর পশ্চিম",
    "nameEn": ""
  },
  {
    "id": 4517,
    "upazilaId": 478,
    "nameBn": "বানিয়াচং দক্ষিণ পূর্ব",
    "nameEn": ""
  },
  {
    "id": 4518,
    "upazilaId": 478,
    "nameBn": "বানিয়াচং দক্ষিণ পশ্চিম",
    "nameEn": ""
  },
  {
    "id": 4519,
    "upazilaId": 478,
    "nameBn": "দৌলতপুর",
    "nameEn": ""
  },
  {
    "id": 4520,
    "upazilaId": 478,
    "nameBn": "কাগাপাশা",
    "nameEn": ""
  },
  {
    "id": 4521,
    "upazilaId": 478,
    "nameBn": "বড়ইউড়ি",
    "nameEn": ""
  },
  {
    "id": 4522,
    "upazilaId": 478,
    "nameBn": "খাগাউড়া",
    "nameEn": ""
  },
  {
    "id": 4523,
    "upazilaId": 478,
    "nameBn": "পুকড়া",
    "nameEn": ""
  },
  {
    "id": 4524,
    "upazilaId": 478,
    "nameBn": "সুবিদপুর",
    "nameEn": ""
  },
  {
    "id": 4525,
    "upazilaId": 478,
    "nameBn": "মক্রমপুর",
    "nameEn": ""
  },
  {
    "id": 4526,
    "upazilaId": 478,
    "nameBn": "সুজাতপুর",
    "nameEn": ""
  },
  {
    "id": 4527,
    "upazilaId": 478,
    "nameBn": "মন্দরী",
    "nameEn": ""
  },
  {
    "id": 4528,
    "upazilaId": 478,
    "nameBn": "মুরাদপুর",
    "nameEn": ""
  },
  {
    "id": 4529,
    "upazilaId": 478,
    "nameBn": "পৈলারকান্দি",
    "nameEn": ""
  },
  {
    "id": 4530,
    "upazilaId": 479,
    "nameBn": "স্নানঘাট",
    "nameEn": ""
  },
  {
    "id": 4531,
    "upazilaId": 479,
    "nameBn": "পুটিজুরী",
    "nameEn": ""
  },
  {
    "id": 4532,
    "upazilaId": 479,
    "nameBn": "সাতকাপন",
    "nameEn": ""
  },
  {
    "id": 4533,
    "upazilaId": 479,
    "nameBn": "বাহুবল সদর",
    "nameEn": ""
  },
  {
    "id": 4534,
    "upazilaId": 479,
    "nameBn": "লামাতাশী",
    "nameEn": ""
  },
  {
    "id": 4535,
    "upazilaId": 479,
    "nameBn": "মীরপুর",
    "nameEn": ""
  },
  {
    "id": 4536,
    "upazilaId": 479,
    "nameBn": "ভাদেশ্বর",
    "nameEn": ""
  },
  {
    "id": 4537,
    "upazilaId": 480,
    "nameBn": "আদাঐর",
    "nameEn": ""
  },
  {
    "id": 4538,
    "upazilaId": 480,
    "nameBn": "আন্দিউড়া",
    "nameEn": ""
  },
  {
    "id": 4539,
    "upazilaId": 480,
    "nameBn": "চৌমুহনী",
    "nameEn": ""
  },
  {
    "id": 4540,
    "upazilaId": 480,
    "nameBn": "ছাতিয়াইন",
    "nameEn": ""
  },
  {
    "id": 4541,
    "upazilaId": 480,
    "nameBn": "জগদীশপুর",
    "nameEn": ""
  },
  {
    "id": 4542,
    "upazilaId": 480,
    "nameBn": "ধর্মঘর",
    "nameEn": ""
  },
  {
    "id": 4543,
    "upazilaId": 480,
    "nameBn": "নোয়াপাড়া",
    "nameEn": ""
  },
  {
    "id": 4544,
    "upazilaId": 480,
    "nameBn": "বাঘাসুরা",
    "nameEn": ""
  },
  {
    "id": 4545,
    "upazilaId": 480,
    "nameBn": "বহরা",
    "nameEn": ""
  },
  {
    "id": 4546,
    "upazilaId": 480,
    "nameBn": "শাহজাহানপুর",
    "nameEn": ""
  },
  {
    "id": 4547,
    "upazilaId": 480,
    "nameBn": "বুল্লা",
    "nameEn": ""
  },
  {
    "id": 4548,
    "upazilaId": 481,
    "nameBn": "লাখাই",
    "nameEn": ""
  },
  {
    "id": 4549,
    "upazilaId": 481,
    "nameBn": "মোড়াকরি",
    "nameEn": ""
  },
  {
    "id": 4550,
    "upazilaId": 481,
    "nameBn": "মুড়িয়াউক",
    "nameEn": ""
  },
  {
    "id": 4551,
    "upazilaId": 481,
    "nameBn": "বামৈ",
    "nameEn": ""
  },
  {
    "id": 4552,
    "upazilaId": 481,
    "nameBn": "করাব",
    "nameEn": ""
  },
  {
    "id": 4553,
    "upazilaId": 481,
    "nameBn": "বুল্লা",
    "nameEn": ""
  },
  {
    "id": 4554,
    "upazilaId": 482,
    "nameBn": "নূরপুর",
    "nameEn": ""
  },
  {
    "id": 4555,
    "upazilaId": 482,
    "nameBn": "শায়েস্তাগঞ্জ",
    "nameEn": ""
  },
  {
    "id": 4556,
    "upazilaId": 482,
    "nameBn": "ব্রাহ্মনডোরা",
    "nameEn": ""
  },
  {
    "id": 4557,
    "upazilaId": 483,
    "nameBn": "লুকড়া",
    "nameEn": ""
  },
  {
    "id": 4558,
    "upazilaId": 483,
    "nameBn": "রিচি",
    "nameEn": ""
  },
  {
    "id": 4559,
    "upazilaId": 483,
    "nameBn": "তেঘরিয়া",
    "nameEn": ""
  },
  {
    "id": 4560,
    "upazilaId": 483,
    "nameBn": "পইল",
    "nameEn": ""
  },
  {
    "id": 4561,
    "upazilaId": 483,
    "nameBn": "গোপায়া",
    "nameEn": ""
  },
  {
    "id": 4562,
    "upazilaId": 483,
    "nameBn": "রাজিউরা",
    "nameEn": ""
  },
  {
    "id": 4563,
    "upazilaId": 483,
    "nameBn": "নিজামপুর",
    "nameEn": ""
  },
  {
    "id": 4564,
    "upazilaId": 483,
    "nameBn": "লস্করপুর,",
    "nameEn": ""
  }
] as const;

// ─── Convenience Lookup Maps ─────────────────────────────

export const DIVISION_BY_ID: Record<number, Division> = Object.fromEntries(DIVISIONS.map(d => [d.id, d]));
export const DISTRICT_BY_ID: Record<number, District> = Object.fromEntries(DISTRICTS.map(d => [d.id, d]));
export const DISTRICT_BY_BN: Record<string, District> = Object.fromEntries(DISTRICTS.map(d => [d.nameBn, d]));
export const UPAZILA_BY_ID: Record<number, Upazila> = Object.fromEntries(UPAZILAS.map(u => [u.id, u]));
export const UPAZILA_BY_BN: Record<string, Upazila> = Object.fromEntries(UPAZILAS.map(u => [u.nameBn, u]));

// District → division mapping
export const DISTRICT_TO_DIVISION: Record<string, number> = Object.fromEntries(DISTRICTS.map(d => [d.nameBn, d.divisionId]));

// Upazilas grouped by district_id
export const UPAZILAS_BY_DISTRICT: Record<number, Upazila[]> = {};

// Unions grouped by upazila_id
export const UNIONS_BY_UPAZILA: Record<number, Union[]> = {};

// Populate grouping maps
for (const u of UPAZILAS) {
  (UPAZILAS_BY_DISTRICT as any)[u.districtId] = (UPAZILAS_BY_DISTRICT as any)[u.districtId] || [];
  (UPAZILAS_BY_DISTRICT as any)[u.districtId].push(u);
}

for (const u of UNIONS) {
  (UNIONS_BY_UPAZILA as any)[u.upazilaId] = (UNIONS_BY_UPAZILA as any)[u.upazilaId] || [];
  (UNIONS_BY_UPAZILA as any)[u.upazilaId].push(u);
}

// ─── Aggregated hierarchy export ────────────────────────

export const ADMIN_HIERARCHY: AdminHierarchy = {
  divisions: DIVISIONS,
  districts: DISTRICTS,
  upazilas: UPAZILAS,
  unions: UNIONS,
};

// ─── All union names for a given upazila (lookup by Bengali name) ──
export function getUnionsForUpazila(upazilaNameBn: string): string[] {
  const upazila = UPAZILA_BY_BN[upazilaNameBn];
  if (!upazila) return [];
  return (UNIONS_BY_UPAZILA[upazila.id] || []).map(u => u.nameBn);
}

// ─── All upazila names for a given district (lookup by Bengali name) ──
export function getUpazilasForDistrict(districtNameBn: string): string[] {
  const district = DISTRICT_BY_BN[districtNameBn];
  if (!district) return [];
  return (UPAZILAS_BY_DISTRICT[district.id] || []).map(u => u.nameBn);
}

// ─── Get division for a district (Bengali name) ──
export function getDivisionForDistrict(districtNameBn: string): Division | undefined {
  const divId = DISTRICT_TO_DIVISION[districtNameBn];
  return divId ? DIVISION_BY_ID[divId] : undefined;
}

export default ADMIN_HIERARCHY;
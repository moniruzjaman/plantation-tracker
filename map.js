import fs from 'fs';

const p1 = fs.readFileSync('public/part1.txt', 'utf8');
const p2 = fs.readFileSync('public/part2.txt', 'utf8');
const p3 = fs.readFileSync('public/part3.txt', 'utf8');
const p4 = fs.readFileSync('public/part4.txt', 'utf8');
const p5 = fs.readFileSync('public/part5.txt', 'utf8');
const p6 = fs.readFileSync('public/part6.txt', 'utf8');
const p7 = fs.readFileSync('public/part7.txt', 'utf8');

let html = p1 + p2 + p3 + p4 + p5 + p6 + p7;

function applyPatches(h) {
  // 1. Queue bridge
  h = h.replace(`"use strict";

// Region → Districts (from official XLSX 2026)`, `"use strict";

// ── Phase-1: Offline Queue Integration ──
var _queueReady = false;
var _queueAPI = null;
function _initQueueBridge(){
  try {
    _queueAPI = window.offlineQueueAPI || window.parent?.offlineQueueAPI;
    if (!_queueAPI) {
      var attempts = 0;
      var poll = setInterval(function(){
        _queueAPI = window.offlineQueueAPI || window.parent?.offlineQueueAPI;
        if (_queueAPI || attempts++ > 20) {
          clearInterval(poll);
          if (_queueAPI) _seedQueueFromLocal();
        }
      }, 200);
      return;
    }
    _queueReady = true;
    _seedQueueFromLocal();
  } catch(e) { console.warn('[QueueBridge] init failed:', e); }
}
function _seedQueueFromLocal(){
  if (!_queueAPI || typeof _queueAPI.getAllSubmissions !== 'function') return;
  _queueAPI.getAllSubmissions().then(function(existing){
    if (existing && existing.length) return;
    var raw = localStorage.getItem(LS_KEY);
    if (!raw) return;
    try {
      var parsed = JSON.parse(raw);
      if (!Array.isArray(parsed)) return;
      parsed.forEach(function(s){
        var q = {
          submissionId: s.submissionId || s.id || genId(),
          syncStatus: s.synced ? 'synced' : 'pending',
          syncAttempts: s.synced ? 1 : 0,
          lastSyncAt: s.syncedAt,
          lastSyncError: undefined,
          submittedAt: s.submittedAt || new Date().toISOString()
        };
        Object.keys(s).forEach(function(k){ q[k] = s[k]; });
        _queueAPI.enqueueSubmission(q);
      });
    } catch(e){}
  });
}
_initQueueBridge();

// Region → Districts (from official XLSX 2026)`);

  // 2. Storage wrappers
  h = h.replace(`function getSubmissions(){try{return JSON.parse(localStorage.getItem(LS_KEY)||"[]")}catch(e){return[]}}
function saveSubmissions(d){localStorage.setItem(LS_KEY,JSON.stringify(d))}`, `function getSubmissions(){
  try {
    var raw = localStorage.getItem(LS_KEY);
    if (raw) {
      var parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) return parsed;
    }
  } catch(e){}
  return [];
}
function _syncToQueue(submissions){
  if (!_queueAPI || typeof _queueAPI.getAllSubmissions !== 'function') return;
  _queueAPI.getAllSubmissions().then(function(existing){
    var byId = {};
    existing.forEach(function(e){ byId[e.submissionId] = e; });
    submissions.forEach(function(s){
      var id = s.submissionId || s.id;
      if (!id) return;
      var prev = byId[id];
      var q = {
        submissionId: id,
        syncStatus: s.synced ? 'synced' : (s.syncStatus || 'pending'),
        syncAttempts: prev ? (prev.syncAttempts || 0) : 0,
        lastSyncAt: s.syncedAt || (prev ? prev.lastSyncAt : undefined),
        lastSyncError: prev ? prev.lastSyncError : undefined,
        submittedAt: s.submittedAt || new Date().toISOString()
      };
      Object.keys(s).forEach(function(k){ q[k] = s[k]; });
      _queueAPI.enqueueSubmission(q);
    });
  }).catch(function(e){ console.warn('[QueueBridge] sync failed:', e); });
}
function saveSubmissions(d){
  localStorage.setItem(LS_KEY, JSON.stringify(d));
  _syncToQueue(d);
}`);

  // 3. Quick actions
  h = h.replace(`<div id="profileBar" class="flex items-center justify-between rounded-lg px-3 py-2 mb-4" style="background:#f0fdf4;border:1px solid #bbf7d0">
<span id="profileBarText" class="text-xs font-semibold text-green-800">👤 প্রোফাইল লোড হচ্ছে...</span>
<button type="button" onclick="openProfileModal()" class="text-xs font-semibold" style="color:#15803d">পরিবর্তন</button>
</div>
<form id="nurseryForm" novalidate>`, `<div id="profileBar" class="flex items-center justify-between rounded-lg px-3 py-2 mb-4" style="background:#f0fdf4;border:1px solid #bbf7d0">
<span id="profileBarText" class="text-xs font-semibold text-green-800">👤 প্রোফাইল লোড হচ্ছে...</span>
<button type="button" onclick="openProfileModal()" class="text-xs font-semibold" style="color:#15803d">পরিবর্তন</button>
</div>
<!-- Phase-1 Quick Actions: Copy Last Entry / Repeat with New GPS -->
<div id="quickActionsBar" class="flex flex-wrap gap-2 mb-4">
<button type="button" onclick="copyLastEntry()" class="flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-bold bg-blue-50 text-blue-700 border border-blue-200 hover:bg-blue-100 transition active:scale-95 cursor-pointer" style="min-height:44px">
<svg style="height:14px;width:14px" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"/></svg>
<span>শেষ এন্ট্রি কপি করুন</span>
</button>
<button type="button" onclick="repeatWithNewGPS()" class="flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200 hover:bg-emerald-100 transition active:scale-95 cursor-pointer" style="min-height:44px">
<svg style="height:14px;width:14px" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/><path stroke-linecap="round" stroke-linejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/></svg>
<span>নতুন GPS দিয়ে পুনরায়</span>
</button>
</div>
<form id="nurseryForm" novalidate>`);

  // 4. Guided mode + fieldset IDs
  h = h.replace(`<!-- ===== 1. GENERAL INFO ===== -->
<fieldset style="border-color:#86efac;background:#f9fafb" class="rounded-xl border-2 p-4 sm:p-5 mb-4">
<legend class="px-3 py-1 rounded-lg text-white font-bold text-sm" style="background:#15803d">১. সাধারণ তথ্য</legend>`, `<!-- ===== 1. GENERAL INFO ===== -->
<div class="flex items-center justify-between mb-3">
<span class="text-xs font-semibold text-gray-500">📱 মোবাইল ফ্রেন্ডলি ফর্ম</span>
<button type="button" onclick="toggleGuidedMode()" id="guidedModeBtn" class="text-[11px] font-bold px-3 py-2 rounded-full border-2 transition cursor-pointer" style="border-color:#15803d;color:#15803d;background:#f0fdf4;min-height:44px">
🎯 সহজ মোড: বন্ধ
</button>
</div>
<fieldset id="fs-general" style="border-color:#86efac;background:#f9fafb" class="rounded-xl border-2 p-4 sm:p-5 mb-4">
<legend class="px-3 py-1 rounded-lg text-white font-bold text-sm" style="background:#15803d">১. সাধারণ তথ্য</legend>`);

  h = h.replace(`<fieldset style="border-color:#86efac;background:#f9faff" class="rounded-xl border-2 p-4 sm:p-5 mb-4">
<legend class="px-3 py-1 rounded-lg text-white font-bold text-sm" style="background:#15803d">২. চারার তথ্য`, `<fieldset id="fs-seedlings" style="border-color:#86efac;background:#f9faff" class="rounded-xl border-2 p-4 sm:p-5 mb-4">
<legend class="px-3 py-1 rounded-lg text-white font-bold text-sm" style="background:#15803d">২. চারার তথ্য`);

  h = h.replace(`<fieldset style="border-color:#86efac;background:#f9fafb" class="rounded-xl border-2 p-4 sm:p-5 mb-4">
<legend class="px-3 py-1 rounded-lg text-white font-bold text-sm" style="background:#15803d">৩. ছবি (ঐচ্ছিক কিন্তু সুপারিশকৃত)</legend>`, `<fieldset id="fs-photo" style="border-color:#86efac;background:#f9fafb" class="rounded-xl border-2 p-4 sm:p-5 mb-4">
<legend class="px-3 py-1 rounded-lg text-white font-bold text-sm" style="background:#15803d">৩. ছবি (ঐচ্ছিক কিন্তু সুপারিশকৃত) — সর্বোচ্চ ৫টি</legend>`);

  // 5. Photo input + species favorites
  h = h.replace(`<input type="file" id="fPhoto" accept="image/*" capture="environment" class="w-full border rounded-md px-3 py-2 text-xs focus:ring-2 focus:ring-green-400 outline-none" style="border-color:#d1d5db">
<p class="text-[10px] text-gray-500 mt-1">ছবি স্বয়ংক্রিয়ভাবে সংকুচিত হবে (সর্বোচ্চ ১০২৪px)। প্রতিটি রো এই ছবিটি গুগল ড্রাইভে সংরক্ষিত হবে এবং শিটে ইনলাইন প্রদর্শিত হবে।</p>
</div>
<div class="hidden" id="fPhotoPreviewWrap">
<img id="fPhotoPreview" alt="preview" class="rounded-lg border" style="max-height:140px;border-color:#d1d5db">
<button type="button" onclick="clearPhoto()" class="block mt-2 text-xs text-red-600 hover:underline">✕ ছবি সরান</button>
</div>`, `<input type="file" id="fPhoto" accept="image/*" capture="environment" multiple class="w-full border rounded-md px-3 py-2 text-xs focus:ring-2 focus:ring-green-400 outline-none" style="border-color:#d1d5db">
<p class="text-[10px] text-gray-500 mt-1">অনেক ছবি Select করুন (সর্বোচ্চ ৫টি, প্রতিটি ≤ 10MB)। ছবিগুলো স্বয়ংক্রিয়ভাবে সংকুচিত হবে (১০২৪px) এবং জিপিএস + সময়স্ট্যাম্প স্ট্যাম্প যুক্ত হবে।</p>
</div>
<div id="fPhotoPreviewWrap" class="hidden">
<div id="fPhotoPreviewGrid" class="grid grid-cols-2 gap-2"></div>
<button type="button" onclick="clearPhoto()" class="block mt-2 text-xs text-red-600 hover:underline">✕ সব ছবি সরান</button>
</div>`);

  h = h.replace(`<datalist id="speciesList">
<option value="আম"><option value="জাম"><option value="কাঁঠাল"><option value="লেবু"><option value="পেয়ারা"><option value="সফেদা"><option value="তরমুজ"><option value="আনারস"><option value="লিচু"><option value="কলা"><option value="পেঁপে"><option value="সেগুন"><option value="মেহগনি"><option value="আকাশমনি"><option value="নিম"><option value="তুলসী"><option value="বাসক"><option value="অশ্বগন্ধা"><option value="আমলকী"><option value="হারিতকী"><option value="অন্যান্য">
</datalist>
<div id="seedlingRows"`, `<div id="speciesFavoritesBar" class="flex flex-wrap gap-1.5 mt-3 mb-2"></div>
<datalist id="speciesList">
<option value="আম"><option value="জাম"><option value="কাঁঠাল"><option value="লেবু"><option value="পেয়ারা"><option value="সফেদা"><option value="তরমুজ"><option value="আনারস"><option value="লিচু"><option value="কলা"><option value="পেঁপে"><option value="সেগুন"><option value="মেহগনি"><option value="আকাশমনি"><option value="নিম"><option value="তুলসী"><option value="বাসক"><option value="অশ্বগন্ধা"><option value="আমলকী"><option value="হারিতকী"><option value="অন্যান্য">
</datalist>
<div id="seedlingRows"`);

  // 6. JS functions
  const jsFuncs = `// ── Phase-1 Quick Actions ──
window.copyLastEntry = function(){
  var subs = getSubmissions();
  if (!subs.length) {
    showBanner("errorBanner","কোনো পূর্বের এন্ট্রি পাওয়া যায়নি।");
    setTimeout(function(){hideBanner("errorBanner");},3000);
    return;
  }
  var last = subs[subs.length - 1];
  _fillFormFromSubmission(last);
  document.getElementById("formTitle").textContent="📋 শেষ এন্ট্রি কপি করা হয়েছে — সংশোধন করুন";
  document.getElementById("cancelBtn").classList.remove("hidden");
  document.getElementById("submitBtn").textContent="আপডেট করুন";
  showBanner("successBanner","শেষ এন্ট্রির তথ্য ফর্মে লোড হয়েছে। প্রয়োজনে পরিবর্তন করে আপডেট করুন।");
  setTimeout(function(){hideBanner("successBanner");},3000);
};

window.repeatWithNewGPS = function(){
  var subs = getSubmissions();
  if (!subs.length) {
    showBanner("errorBanner","কোনো পূর্বের এন্ট্রি পাওয়া যায়নি।");
    setTimeout(function(){hideBanner("errorBanner");},3000);
    return;
  }
  var last = subs[subs.length - 1];
  _fillFormFromSubmission(last);
  document.getElementById("fGeo").value = "";
  document.getElementById("fGeoLatManual").value = "";
  document.getElementById("fGeoLngManual").value = "";
  document.getElementById("fNdvi").value = "";
  window._photoBase64 = "";
  window._photoBase64Array = [];
  var photoWrap = document.getElementById("fPhotoPreviewWrap");
  if(photoWrap) photoWrap.classList.add("hidden");
  var grid = document.getElementById("fPhotoPreviewGrid");
  if(grid) grid.innerHTML = "";
  if(window.clearGeoFence) window.clearGeoFence();
  if(geoManualMarker && geoManualMap){ geoManualMap.removeLayer(geoManualMarker); geoManualMarker = null; }
  document.getElementById("formTitle").textContent="📍 নতুন GPS দিয়ে পুনরায় জমা দিন";
  document.getElementById("cancelBtn").classList.remove("hidden");
  document.getElementById("submitBtn").textContent="তথ্য জমা দিন";
  fetchGeoLocation();
  showBanner("successBanner","শেষ এন্ট্রির তথ্য লোড হয়েছে — এখন নতুন জিপিএস নিন।");
  setTimeout(function(){hideBanner("successBanner");},3000);
};

function _fillFormFromSubmission(s){
  if(s.division){document.getElementById("fDivision").value=s.division;}
  document.getElementById("fRegion").value=s.region;onFormRegionChange();
  setTimeout(function(){
    document.getElementById("fDistrict").value=s.district;onFormDistrictChange();
    document.getElementById("fUpazila").value=s.upazila||"";
    document.getElementById("fNursery").value=s.farmerName||s.nurseryName||"";
    document.getElementById("fMobile").value=s.farmerMobile||s.mobile||"";
    document.getElementById("fAddress").value=s.address||"";
    document.getElementById("fUnion").value=s.union||"";
    document.getElementById("fVillage").value=s.village||"";
    document.getElementById("fLocationType").value=s.locationType||"";
    document.getElementById("fSaaoName").value=s.saaoName||"";
    document.getElementById("fSaaoMobile").value=s.saaoMobile||"";
    document.getElementById("fOfficerName").value=s.officerName||s.caretakerName||"";
    document.getElementById("fOfficerMobile").value=s.officerMobile||s.caretakerMobile||"";
    document.getElementById("fRemarks").value=s.remarks||"";
    document.getElementById("fPlantingDate").value=s.plantingDate||new Date().toISOString().slice(0,10);
    var rowsEl=document.getElementById("seedlingRows");
    rowsEl.innerHTML="";
    if(Array.isArray(s.seedlings) && s.seedlings.length){
      s.seedlings.forEach(function(sd){ addSeedlingRow("seedlingRows", sd); });
    } else {
      [["fruitSeedlings","ফলদ"],["forestSeedlings","বনজ"],["medicinalSeedlings","ঔষধি"]].forEach(function(pair){
        (s[pair[0]]||[]).forEach(function(e){
          addSeedlingRow("seedlingRows", { speciesName:e.name, category:pair[1], quantity:(parseInt(e.count)||0)+(parseInt(e.graftingCount)||0) });
        });
      });
    }
    if(!rowsEl.children.length){ addSeedlingRow("seedlingRows"); }
    document.getElementById("tab-form").scrollIntoView({behavior:"smooth"});
  },100);
}

// ── Phase-1: Species Favorites / Recent ──
var SPECIES_FAV_KEY = "species_favorites_v1";
var MAX_FAV_SPECIES = 8;
function getSpeciesFavorites(){
  try {
    var raw = localStorage.getItem(SPECIES_FAV_KEY);
    if(raw) return JSON.parse(raw);
  } catch(e){}
  return ["আম","জাম","লেবু","কাঁঠাল","পেয়ারা","সেগুন","নিম","তুলসী"];
}
function saveSpeciesFavorites(list){
  try { localStorage.setItem(SPECIES_FAV_KEY, JSON.stringify(list.slice(0, MAX_FAV_SPECIES))); } catch(e){}
}
function addSpeciesFavorite(name){
  if(!name) return;
  var favs = getSpeciesFavorites();
  name = name.trim();
  var idx = favs.indexOf(name);
  if(idx >= 0) favs.splice(idx, 1);
  favs.unshift(name);
  saveSpeciesFavorites(favs);
  renderSpeciesFavorites();
}
function renderSpeciesFavorites(){
  var bar = document.getElementById("speciesFavoritesBar");
  if(!bar) return;
  var favs = getSpeciesFavorites();
  bar.innerHTML = favs.map(function(name){
    return '<button type="button" onclick="addSpeciesFavorite(\\'' + name.replace(/'/g, "\\\\'") + '\\');addSeedlingRow(\\'seedlingRows\\',{speciesName:\\'' + name.replace(/'/g, "\\\\'") + '\\'});document.getElementById(\\'seedlingRows\\').lastElementChild.scrollIntoView({behavior:\\'smooth\\',block:\\'center\\'});" class="text-[11px] font-bold px-2.5 py-1.5 rounded-full bg-lime-50 text-lime-800 border border-lime-200 hover:bg-lime-100 transition active:scale-95 cursor-pointer" style="min-height:36px">' + name + ' +</button>';
  }).join("");
}
function extractSpeciesFromSubmissions(){
  var subs = getSubmissions();
  var counts = {};
  subs.forEach(function(s){
    var items = s.seedlings || [];
    if(!items.length){
      (s.fruitSeedlings||[]).concat(s.forestSeedlings||[],s.medicinalSeedlings||[]).forEach(function(e){
        if(e.name) counts[e.name] = (counts[e.name]||0) + 1;
      });
    } else {
      items.forEach(function(e){
        if(e.speciesName) counts[e.speciesName] = (counts[e.speciesName]||0) + 1;
      });
    }
  });
  return Object.keys(counts).sort(function(a,b){return counts[b]-counts[a]}).slice(0, MAX_FAV_SPECIES);
}
function refreshSpeciesFavorites(){
  var recent = extractSpeciesFromSubmissions();
  if(recent.length){
    var merged = recent.concat(getSpeciesFavorites().filter(function(f){return recent.indexOf(f)<0}));
    saveSpeciesFavorites(merged);
  }
  renderSpeciesFavorites();
}

// ── Guided Mode ──
window.toggleGuidedMode = function(){
  var btn = document.getElementById("guidedModeBtn");
  if(!btn) return;
  var isGuided = btn.textContent.indexOf("চালু") > -1;
  var fieldsets = document.querySelectorAll("#tab-form fieldset");
  if(isGuided){
    btn.textContent = "🎯 সহজ মোড: বন্ধ";
    btn.style.background = "#f0fdf4";
    btn.style.color = "#15803d";
    fieldsets.forEach(function(fs){ fs.style.display = ""; });
  } else {
    btn.textContent = "🎯 সহজ মোড: চালু";
    btn.style.background = "#15803d";
    btn.style.color = "#fff";
    fieldsets.forEach(function(fs, i){
      if(i > 0) fs.style.display = "none";
    });
  }
};

// ── Multi-photo support ──
window._photoBase64 = "";
window._photoBase64Array = [];
window.MAX_PHOTOS = 5;
window.MAX_PHOTO_SIZE_MB = 10;
window.clearPhoto = function(){
  window._photoBase64 = "";
  window._photoBase64Array = [];
  var inp = document.getElementById("fPhoto");
  if(inp) inp.value = "";
  var wrap = document.getElementById("fPhotoPreviewWrap");
  if(wrap) wrap.classList.add("hidden");
  var grid = document.getElementById("fPhotoPreviewGrid");
  if(grid) grid.innerHTML = "";
};
window.handlePhotoChange = function(e){
  var files = e.target.files;
  if(!files || !files.length) return;
  if(files.length > window.MAX_PHOTOS){
    showBanner("errorBanner","সর্বোচ্চ " + window.MAX_PHOTOS + "টি ছবি Select করা যায়।");
    setTimeout(function(){hideBanner("errorBanner");},3500);
    e.target.value = "";
    return;
  }
  var results = [];
  var remaining = files.length;
  Array.from(files).forEach(function(file, idx){
    if(file.size > window.MAX_PHOTO_SIZE_MB * 1024 * 1024){
      showBanner("errorBanner","ছবির সাইজ " + window.MAX_PHOTO_SIZE_MB + "MB এর বেশি (" + file.name + ")।");
      setTimeout(function(){hideBanner("errorBanner");},3500);
      e.target.value = "";
      return;
    }
    var reader = new FileReader();
    reader.onload = function(ev){
      var img = new Image();
      img.onload = function(){
        var maxDim = 1024;
        var scale = Math.min(1, maxDim / Math.max(img.width, img.height));
        var canvas = document.createElement("canvas");
        canvas.width = Math.round(img.width * scale);
        canvas.height = Math.round(img.height * scale);
        var ctx = canvas.getContext("2d");
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        var stamped = _stampPhoto(ctx, canvas.width, canvas.height);
        try {
          results[idx] = stamped.canvas.toDataURL("image/jpeg", 0.6);
        } catch(err){
          console.error("Photo downscale failed:", err);
          results[idx] = ev.target.result;
        }
        remaining--;
        if(remaining <= 0){
          window._photoBase64Array = results.filter(Boolean);
          window._photoBase64 = window._photoBase64Array[0] || "";
          renderPhotoPreviewGrid();
        }
      };
      img.onerror = function(){
        console.error("Image load error:", file.name);
        remaining--;
      };
      img.src = ev.target.result;
    };
    reader.readAsDataURL(file);
  });
};
function _stampPhoto(ctx, w, h){
  var now = new Date();
  var ts = now.toLocaleString("bn-BD");
  var geoStr = document.getElementById("fGeo") ? document.getElementById("fGeo").value : "";
  var text = ts + (geoStr ? " | " + geoStr : "");
  ctx.font = "bold " + Math.max(14, w * 0.04) + "px Arial";
  ctx.fillStyle = "rgba(0,0,0,0.6)";
  var tw = ctx.measureText(text).width;
  ctx.fillRect(0, h - Math.max(28, h * 0.08), tw + 16, Math.max(28, h * 0.08));
  ctx.fillStyle = "#fff";
  ctx.fillText(text, 8, h - Math.max(8, h * 0.02));
  return { canvas: ctx.canvas };
}
function renderPhotoPreviewGrid(){
  var wrap = document.getElementById("fPhotoPreviewWrap");
  var grid = document.getElementById("fPhotoPreviewGrid");
  if(!wrap || !grid) return;
  grid.innerHTML = "";
  window._photoBase64Array.forEach(function(src, i){
    var div = document.createElement("div");
    div.style.cssText = "position:relative;border-radius:8px;overflow:hidden;border:1px solid #d1d5db;";
    var img = document.createElement("img");
    img.src = src;
    img.alt = "ছবি " + (i+1);
    img.style.cssText = "width:100%;height:80px;object-fit:cover;display:block;";
    var badge = document.createElement("span");
    badge.textContent = (i+1) + "/" + window._photoBase64Array.length;
    badge.style.cssText = "position:absolute;top:4px;left:4px;background:rgba(0,0,0,0.6);color:#fff;font-size:10px;padding:1px 6px;border-radius:999px;font-weight:700;";
    div.appendChild(img);
    div.appendChild(badge);
    grid.appendChild(div);
  });
  wrap.classList.remove("hidden");
}`;

  h = h.replace(`// ── Flat seedling repeater (one row per species) ──`, jsFuncs + `\n// ── Flat seedling repeater (one row per species) ──`);

  // 7. buildBaseSubmission
  h = h.replace(`photoBase64: prefix === "f" ? (window._photoBase64 || "") : "",
    submittedAt: new Date().toISOString()`, `photoBase64: prefix === "f" ? (window._photoBase64 || "") : "",
    additionalPhotosBase64: prefix === "f" ? (window._photoBase64Array || []).slice(1) : [],
    submittedAt: new Date().toISOString()`);

  // 8. Submit handler - edit path
  h = h.replace(`    if(editId){
    var idx = subs.findIndex(function(s){return s.id===editId || s.submissionId===editId;});
    if(idx > -1){
      base.submissionId = subs[idx].submissionId || subs[idx].id || base.submissionId;
      base.id = subs[idx].id;
      subs[idx] = Object.assign({}, subs[idx], base, { seedlings: seedlings, synced: false, syncedAt: null });
      saveSubmissions(subs);
    }
    document.getElementById("editId").value="";
    showBanner("successBanner");
    resetForm();
  } else {`, `    if(editId){
    var idx = subs.findIndex(function(s){return s.id===editId || s.submissionId===editId;});
    if(idx > -1){
      base.submissionId = subs[idx].submissionId || subs[idx].id || base.submissionId;
      base.id = subs[idx].id;
      subs[idx] = Object.assign({}, subs[idx], base, { seedlings: seedlings, synced: false, syncedAt: null });
      saveSubmissions(subs);
      if (_queueAPI && typeof _queueAPI.markSynced === 'function') {
        _queueAPI.markSynced(base.submissionId).catch(function(e){ console.warn('[Queue] markSynced failed:', e); });
      }
    }
    document.getElementById("editId").value="";
    showBanner("successBanner");
    resetForm();
    refreshSpeciesFavorites();
  } else {`);

  // 9. Submit handler - new path
  h = h.replace(`    var result = await sendToGAS(rows);
    if(result && result.ok){
      var updated = getSubmissions();
      var lastIdx = updated.length - 1;
      if(updated[lastIdx]){
        updated[lastIdx].synced = true;
        updated[lastIdx].syncedAt = new Date().toISOString();
        saveSubmissions(updated);
      }
      showBanner("successBanner");
      try{ window.parent.postMessage({ type:"offline-synced-success", count: rows.length }, "*"); }catch(_){}
    } else {
      console.warn("GAS sync failed:", result && result.error);
      showBanner("errorBanner","সিঙ্ক ব্যর্থ — তথ্য অফলাইনে সংরক্ষিত আছে। ড্যাশবোর্ড থেকে পরে আবার সিঙ্ক করুন।");
      setTimeout(function(){hideBanner("errorBanner");},5000);
    }`, `    var result = await sendToGAS(rows);
    if(result && result.ok){
      var updated = getSubmissions();
      var lastIdx = updated.length - 1;
      if(updated[lastIdx]){
        updated[lastIdx].synced = true;
        updated[lastIdx].syncedAt = new Date().toISOString();
        saveSubmissions(updated);
      }
      if (_queueAPI && typeof _queueAPI.markSynced === 'function') {
        _queueAPI.markSynced(base.submissionId).catch(function(e){ console.warn('[Queue] markSynced failed:', e); });
      }
      showBanner("successBanner");
      try{ window.parent.postMessage({ type:"offline-synced-success", count: rows.length }, "*"); }catch(_){}
      refreshSpeciesFavorites();
    } else {
      console.warn("GAS sync failed:", result && result.error);
      if (_queueAPI && typeof _queueAPI.markFailed === 'function') {
        _queueAPI.markFailed(base.submissionId, result && result.error || "unknown").catch(function(e){ console.warn('[Queue] markFailed failed:', e); });
      }
      showBanner("errorBanner","সিঙ্ক ব্যর্থ — তথ্য অফলাইনে সংরক্ষিত আছে। ড্যাশবোর্ড থেকে পরে আবার সিঙ্ক করুন।");
      setTimeout(function(){hideBanner("errorBanner");},5000);
    }`);

  // 10. Init section
  h = h.replace(`document.getElementById("seedlingRows").innerHTML="";
addSeedlingRow("seedlingRows");
var fPhotoEl=document.getElementById("fPhoto");`, `document.getElementById("seedlingRows").innerHTML="";
addSeedlingRow("seedlingRows");
renderSpeciesFavorites();
refreshSpeciesFavorites();
var fPhotoEl=document.getElementById("fPhoto");`);

  // 11. resetForm photo array reset
  h = h.replace(`window._photoBase64 = "";
  var photoWrap = document.getElementById("fPhotoPreviewWrap");
  if(photoWrap) photoWrap.classList.add("hidden");`, `window._photoBase64 = "";
  window._photoBase64Array = [];
  var photoWrap = document.getElementById("fPhotoPreviewWrap");
  if(photoWrap) photoWrap.classList.add("hidden");
  var grid = document.getElementById("fPhotoPreviewGrid");
  if(grid) grid.innerHTML = "";`);

  // 12. Remove old photo capture section
  h = h.replace(`// ── Photo capture + downscale ──
window._photoBase64 = "";
window.clearPhoto = function(){
  window._photoBase64 = "";
  var inp = document.getElementById("fPhoto");
  if(inp) inp.value = "";
  var wrap = document.getElementById("fPhotoPreviewWrap");
  if(wrap) wrap.classList.add("hidden");
};
window.handlePhotoChange = function(e){
  var file = e.target.files && e.target.files[0];
  if(!file) return;
  if(file.size > 15 * 1024 * 1024){
    showBanner("errorBanner","ছবির সাইজ ১৫MB এর বেশি। অনুগ্রহ করে ছোট ছবি দিন।");
    setTimeout(function(){hideBanner("errorBanner");},3500);
    e.target.value = "";
    return;
  }
  var reader = new FileReader();
  reader.onload = function(ev){
    var img = new Image();
    img.onload = function(){
      var maxDim = 1024;
      var scale = Math.min(1, maxDim / Math.max(img.width, img.height));
      var canvas = document.createElement("canvas");
      canvas.width = Math.round(img.width * scale);
      canvas.height = Math.round(img.height * scale);
      canvas.getContext("2d").drawImage(img, 0, 0, canvas.width, canvas.height);
      try {
        window._photoBase64 = canvas.toDataURL("image/jpeg", 0.7);
      } catch(err){
        console.error("Photo downscale failed:", err);
        window._photoBase64 = ev.target.result;
      }
      var prev = document.getElementById("fPhotoPreview");
      var wrap = document.getElementById("fPhotoPreviewWrap");
      if(prev) prev.src = window._photoBase64;
      if(wrap) wrap.classList.remove("hidden");
    };
    img.onerror = function(){
      console.error("Image load error");
      showBanner("errorBanner","ছবি লোড করা যায়নি। অন্য ছবি চেষ্টা করুন।");
      setTimeout(function(){hideBanner("errorBanner");},3500);
    };
    img.src = ev.target.result;
  };
  reader.readAsDataURL(file);
};

// ── Seedling Builder ──`, `// ── Seedling Builder ──`);

  return h;
}

const patched = applyPatches(html);
fs.writeFileSync('public/plantation.html', patched);
console.log('Done mapping + Phase-1 patches.');

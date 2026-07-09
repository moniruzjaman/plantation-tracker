/**
 * Google Apps Script — App_Entry sheet backend.
 *
 * This file is NOT deployed by Vercel/git. Copy its contents into the
 * Apps Script project bound to the Tree Plantation Reporting Workbook
 * (Extensions -> Apps Script), replacing the existing Code.gs, then
 * Deploy -> Manage deployments -> Edit -> New version. The deployment's
 * /exec URL is what you set as GAS_WEBHOOK_URL on Vercel -- the app never
 * calls this URL directly (browsers can't POST JSON to GAS without CORS
 * failing), it always goes through the /api/gas-sync proxy in this repo.
 *
 * Responsibilities:
 *   doPost(e) -- append one App_Entry row per request (the proxy calls this
 *               once per seedling row of a submission).
 *   doGet(e)  -- ?mobile=01XXXXXXXXX  -> existing-profile lookup for the
 *               Profile modal (search by farmer/SAAO/officer mobile).
 *             -- ?list=1[&district=..][&region=..] -> every App_Entry row,
 *               grouped one-object-per-submissionId with a seedlings[]
 *               array, for the Map tab. This is what keeps the Map's
 *               markers in sync with columns L (latitude) and
 *               M (longitude) for EVERY officer's entries,
 *               not just the requesting device's own submissions.
 */

var SHEET_NAME = 'App_Entry';

// Column order must match the App_Entry header row exactly.
var COLUMNS = [
  'জমার সময়', 'অ্যাপ জমা আইডি', 'বিভাগ', 'অঞ্চল', 'জেলা', 'উপজেলা',
  'ইউনিয়ন', 'গ্রাম', 'অবস্থানের ধরন', 'চারার উৎস', 'সুনির্দিষ্ট ঠিকানা',
  'অক্ষাংশ', 'দ্রাঘিমাংশ', 'রোপণের তারিখ', 'বৃক্ষের প্রজাতি/জাত',
  'বৃক্ষের শ্রেণী', 'সংখ্যা', 'প্রাথমিক NDVI', 'ছবি (ইনলাইন)',
  'ছবি SHA-256', 'কৃষকের নাম', 'কৃষকের মোবাইল', 'SAAO-এর নাম',
  'SAAO-এর মোবাইল', 'মনিটরিং অফিসারের নাম', 'মনিটরিং অফিসারের মোবাইল',
  'মন্তব্য', 'সত্যায়ন হ্যাশ', 'সিঙ্কের সময়'
];

function getSheet_() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getSheetByName(SHEET_NAME);
  if (!sheet) throw new Error('Sheet "' + SHEET_NAME + '" not found');
  return sheet;
}

function jsonOut_(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}

// doPost: append one row (one seedling line of one submission)
function doPost(e) {
  try {
    var raw = JSON.parse(e.postData.contents);
    var sheet = getSheet_();
    var now = new Date();

    var row = [
      now.toISOString(),
      raw.submissionId || '',
      raw.division || '',
      raw.region || '',
      raw.district || '',
      raw.upazila || '',
      raw.union || '',
      raw.village || '',
      raw.locationType || '',
      raw.sourceType || '',
      raw.address || '',
      raw.latitude || '',           // L -- latitude
      raw.longitude || '',          // M -- longitude
      raw.plantingDate || '',
      raw.speciesName || '',
      raw.category || '',
      raw.quantity || 0,
      raw.ndvi || '',
      '',                            // photo (inline) -- intentionally left blank; large base64 photos bloat the sheet
      raw.photoSha256 || '',
      raw.farmerName || '',
      raw.farmerMobile || '',
      raw.saaoName || '',
      raw.saaoMobile || '',
      raw.officerName || '',
      raw.officerMobile || '',
      raw.remarks || '',
      raw.authHash || '',
      now.toISOString()
    ];
    sheet.appendRow(row);
    return jsonOut_({ ok: true });
  } catch (err) {
    return jsonOut_({ ok: false, error: String(err) });
  }
}

// doGet: profile lookup by mobile, or the full/filtered App_Entry list
function doGet(e) {
  var params = (e && e.parameter) || {};
  try {
    if (params.list) return jsonOut_(listEntries_(params.district, params.region));
    if (params.mobile) return jsonOut_(lookupByMobile_(params.mobile));
    return jsonOut_({ ok: false, error: 'mobile or list query param required' });
  } catch (err) {
    return jsonOut_({ ok: false, error: String(err) });
  }
}

// Read the whole sheet once as an array of column-name -> value objects.
function readAllRows_() {
  var sheet = getSheet_();
  var values = sheet.getDataRange().getValues();
  if (values.length < 2) return [];
  var header = values[0];
  var idx = {};
  header.forEach(function(h, i) { idx[String(h).trim()] = i; });

  var rows = [];
  for (var r = 1; r < values.length; r++) {
    var v = values[r];
    if (!v.join('')) continue; // skip fully blank rows
    var get = function(col) { return idx.hasOwnProperty(col) ? v[idx[col]] : ''; };
    rows.push({
      submissionId: String(get('অ্যাপ জমা আইডি') || ''),
      division:     String(get('বিভাগ') || ''),
      region:       String(get('অঞ্চল') || ''),
      district:     String(get('জেলা') || ''),
      upazila:      String(get('উপজেলা') || ''),
      union:        String(get('ইউনিয়ন') || ''),
      village:      String(get('গ্রাম') || ''),
      locationType: String(get('অবস্থানের ধরন') || ''),
      sourceType:   String(get('চারার উৎস') || ''),
      address:      String(get('সুনির্দিষ্ট ঠিকানা') || ''),
      latitude:     get('অক্ষাংশ'),    // column L
      longitude:    get('দ্রাঘিমাংশ'), // column M
      plantingDate: String(get('রোপণের তারিখ') || ''),
      speciesName:  String(get('বৃক্ষের প্রজাতি/জাত') || ''),
      category:     String(get('বৃক্ষের শ্রেণী') || ''),
      quantity:     Number(get('সংখ্যা')) || 0,
      ndvi:         String(get('প্রাথমিক NDVI') || ''),
      farmerName:   String(get('কৃষকের নাম') || ''),
      farmerMobile: String(get('কৃষকের মোবাইল') || ''),
      saaoName:     String(get('SAAO-এর নাম') || ''),
      saaoMobile:   String(get('SAAO-এর মোবাইল') || ''),
      officerName:  String(get('মনিটরিং অফিসারের নাম') || ''),
      officerMobile:String(get('মনিটরিং অফিসারের মোবাইল') || ''),
      remarks:      String(get('মন্তব্য') || ''),
      submittedAt:  String(get('জমার সময়') || '')
    });
  }
  return rows;
}

// ?list=1 -- group flat sheet rows back into one-object-per-submission
// (mirroring the shape the app already keeps in localStorage), so the
// Map tab's existing rendering code can consume it unchanged.
function listEntries_(district, region) {
  var rows = readAllRows_();
  if (district) rows = rows.filter(function(r) { return r.district === district; });
  if (region) rows = rows.filter(function(r) { return r.region === region; });

  var bySubmission = {};
  var order = [];
  rows.forEach(function(r) {
    var key = r.submissionId || (r.latitude + ',' + r.longitude + '|' + r.farmerMobile + '|' + r.plantingDate);
    if (!bySubmission[key]) {
      bySubmission[key] = {
        submissionId: r.submissionId, division: r.division, region: r.region,
        district: r.district, upazila: r.upazila, union: r.union, village: r.village,
        locationType: r.locationType, sourceType: r.sourceType, address: r.address,
        latitude: r.latitude, longitude: r.longitude,
        geoLocation: (r.latitude && r.longitude) ? (r.latitude + ', ' + r.longitude) : '',
        plantingDate: r.plantingDate, ndvi: r.ndvi,
        farmerName: r.farmerName, farmerMobile: r.farmerMobile,
        saaoName: r.saaoName, saaoMobile: r.saaoMobile,
        officerName: r.officerName, officerMobile: r.officerMobile,
        remarks: r.remarks, submittedAt: r.submittedAt,
        seedlings: []
      };
      order.push(key);
    }
    if (r.speciesName) {
      bySubmission[key].seedlings.push({
        speciesName: r.speciesName, category: r.category, quantity: r.quantity
      });
    }
  });

  var entries = order.map(function(k) { return bySubmission[k]; });
  return { ok: true, count: entries.length, entries: entries };
}

// ?mobile=... -- most recent row where this number appears as farmer,
// SAAO, or monitoring officer; used to prefill the Profile modal so a
// person already known to the sheet doesn't get re-onboarded with
// conflicting details on a new device.
function lookupByMobile_(mobile) {
  var rows = readAllRows_();
  var matches = rows.filter(function(r) {
    return r.farmerMobile === mobile || r.saaoMobile === mobile || r.officerMobile === mobile;
  });
  if (!matches.length) return { ok: false, found: false };
  var latest = matches[matches.length - 1];
  return {
    ok: true,
    found: true,
    profile: {
      division: latest.division, region: latest.region, district: latest.district,
      upazila: latest.upazila, union: latest.union,
      saaoName: latest.saaoName, saaoMobile: latest.saaoMobile,
      officerName: latest.officerName, officerMobile: latest.officerMobile
    }
  };
}

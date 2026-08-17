/**
 * Google Apps Script — App_Entry + User_Profile + Growth_Log +
 * Custom_Upazila sheet backend.
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
 *   doPost(e)  -- entryType="user_profile"    -> User_Profile sheet
 *               -- entryType="growth_reading" -> Growth_Log sheet
 *               -- entryType="custom_upazila" -> Custom_Upazila sheet
 *               -- entryType="visitor_ping"   -> Visitor_Log sheet (guest/
 *                                              unprompted Google email
 *                                              capture, for unique-visitor
 *                                              counting -- no profile
 *                                              form required)
 *               -- otherwise                  -> App_Entry sheet (seedling row)
 *   doGet(e)   -- ?mobile=01XXXXXXXXX       -> User_Profile lookup by mobile
 *               -- ?list=1[&district=..]    -> every App_Entry row, grouped
 *               -- ?directory=1[&role=..]   -> personnel directory (deduped
 *                                              from User_Profile by mobile,
 *                                              most recent submission wins)
 *                                              -- powers SAAO/officer
 *                                              autocomplete; no separate
 *                                              directory sheet needed
 *               -- ?customUpazila=1[&district=..] -> all custom upazila
 *                                              names added across every
 *                                              device, so one officer's
 *                                              addition is visible to all
 *
 * IMPORTANT — one-time manual steps after deploying this version:
 *   1. App_Entry is now one row per SUBMISSION, not one row per seedling
 *      species (a 5-species submission used to write 5 rows with every
 *      other field duplicated across them; now it's 1 row, with the
 *      species combined into 'চারার বিবরণ' / 'চারার বিবরণ (JSON)' plus
 *      'মোট প্রজাতি' / 'মোট চারার সংখ্যা' totals). If App_Entry already has
 *      real data in the old format, run migrateAppEntryToOneRowPerSubmission()
 *      once from the Apps Script editor FIRST (see its doc-comment above
 *      the function for the full safe procedure -- it builds a new
 *      App_Entry_Migrated tab and never touches your existing data).
 *   2. Growth_Log, Custom_Upazila, and Visitor_Log sheets are created
 *      automatically on first write (same pattern as User_Profile) -- no
 *      manual sheet setup needed for those.
 */

var SHEET_NAME = 'App_Entry';
var PROFILE_SHEET_NAME = 'User_Profile';
var GROWTH_SHEET_NAME = 'Growth_Log';
var CUSTOM_UPAZILA_SHEET_NAME = 'Custom_Upazila';
var VISITOR_SHEET_NAME = 'Visitor_Log';
var MINISTRY_REPORT_SHEET_NAME = 'মূল_ডাটা';
var SEVENTEEN_COL_REPORT_SHEET_NAME = '১ৗ_কলাম_প্রতিবেদন';
var REPORT_UPAZILAS = ['ভুরুঙ্গামারী','চর রাজিবপুর','ফুলবাড়ী','উলিপুর','চিলমারী','রৌমারী','কুড়িগ্রাম সদর','নাগেশ্বরী','রাজারহাট'];
var REPORT_CATEGORIES = ['ফলদ','মিশ্র প্যাকেজ','একক প্রজাতি','ঔষধি','বনজ','অন্যান্য'];
var OFFICIAL_REPORT_CACHE_SECONDS = 300;

var VISITOR_COLUMNS = [
  'সময়', 'ইমেইল', 'ধরন', 'ডিভাইস আইডি'
  // ধরন: "guest" (skipped the profile form entirely) | "unprompted" (Google
  // One Tap resolved before the person interacted with the profile modal)
];

var COLUMNS = [
  'জমার সময়', 'অ্যাপ জমা আইডি', 'বিভাগ', 'অঞ্চল', 'জেলা', 'উপজেলা',
  'ইউনিয়ন', 'গ্রাম', 'অবস্থানের ধরন', 'চারার উৎস', 'সুনির্দিষ্ট ঠিকানা',
  'অক্ষাংশ', 'দ্রাঘিমাংশ', 'রোপণের তারিখ',
  // One row = one whole submission now (was: one row per seedling species,
  // duplicating every other field N times for an N-species submission).
  // চারার বিবরণ is a human-readable summary for anyone opening the sheet
  // directly; চারার বিবরণ (JSON) is what the app parses back into its
  // seedlings[] array. মোট প্রজাতি/মোট চারার সংখ্যা are plain numbers so
  // SUM()/pivot tables in the sheet keep working without parsing JSON.
  'চারার বিবরণ', 'মোট প্রজাতি', 'মোট চারার সংখ্যা', 'চারার বিবরণ (JSON)',
  'প্রাথমিক NDVI', 'ছবি (ইনলাইন)',
  'ছবি SHA-256', 'কৃষকের নাম', 'কৃষকের মোবাইল', 'SAAO-এর নাম',
  'SAAO-এর মোবাইল', 'মনিটরিং অফিসারের নাম', 'মনিটরিং অফিসারের মোবাইল',
  'মন্তব্য', 'সত্যায়ন হ্যাশ', 'সিঙ্কের সময়',
  'ব্লক' // Appended at the end (not inserted mid-schema) so existing rows
         // in the live sheet keep their column positions. Needed for the
         // government 17-column report, which is the only place ব্লক is
         // required — App_Entry never captured it before.
];

/**
 * Normalizes a raw lat/lng pair before it's ever written to the sheet.
 * The live "17 column report" / "ministry report" data contains several
 * malformed coordinates that break report generation and map rendering:
 *   - comma used as decimal separator: "25,477083" -> should be "25.477083"
 *   - missing decimal point entirely: "2547209" -> should be "25.47209"
 *   - double decimal points: "25.521270.89.822017" (lat/lng ran together)
 * This performs best-effort cleanup and flags anything it can't confidently
 * fix, rather than silently writing bad data into the sheet.
 */
function normalizeCoord_(raw) {
  var s = String(raw == null ? '' : raw).trim();
  if (!s) return { value: '', ok: true };
  s = s.replace(',', '.'); // comma-as-decimal-separator typo
  var dotCount = (s.match(/\./g) || []).length;
  if (dotCount > 1) return { value: s, ok: false }; // e.g. two numbers ran together
  if (dotCount === 0 && /^\d{5,}$/.test(s)) {
    // Missing decimal point on a plain digit string, e.g. "2547209" for a
    // Bangladesh latitude (always 2 integer digits) -> "25.47209".
    s = s.slice(0, 2) + '.' + s.slice(2);
  }
  var n = parseFloat(s);
  if (isNaN(n)) return { value: raw, ok: false };
  return { value: n, ok: true };
}

var PROFILE_COLUMNS = [
  'জমার সময়', 'অ্যাপ জমা আইডি', 'সংক্ষিপ্ত পদবি', 'পদবি',
  'নাম', 'মোবাইল', 'ইমেইল', 'ডিভাইস আইডি',
  'জেলা', 'উপজেলা', 'ইউনিয়ন', 'ব্লক'
];

var GROWTH_COLUMNS = [
  'জমার সময়', 'এন্ট্রি আইডি', 'পর্যবেক্ষণের তারিখ', 'NDVI',
  'উচ্চতা (cm)', 'অবস্থা', 'মন্তব্য', 'রেকর্ডকারী', 'ডিভাইস আইডি'
];

var CUSTOM_UPAZILA_COLUMNS = [
  'জমার সময়', 'জেলা', 'উপজেলার নাম', 'যোগকারী', 'ডিভাইস আইডি'
];

function getSheet_() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getSheetByName(SHEET_NAME);
  if (!sheet) throw new Error('Sheet "' + SHEET_NAME + '" not found');
  return sheet;
}

function getProfileSheet_() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getSheetByName(PROFILE_SHEET_NAME);
  if (!sheet) {
    sheet = ss.insertSheet(PROFILE_SHEET_NAME);
    sheet.appendRow(PROFILE_COLUMNS);
    sheet.getRange(1, 1, 1, PROFILE_COLUMNS.length).setFontWeight('bold');
  }
  return sheet;
}

function getGrowthSheet_() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getSheetByName(GROWTH_SHEET_NAME);
  if (!sheet) {
    sheet = ss.insertSheet(GROWTH_SHEET_NAME);
    sheet.appendRow(GROWTH_COLUMNS);
    sheet.getRange(1, 1, 1, GROWTH_COLUMNS.length).setFontWeight('bold');
  }
  return sheet;
}

function getCustomUpazilaSheet_() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getSheetByName(CUSTOM_UPAZILA_SHEET_NAME);
  if (!sheet) {
    sheet = ss.insertSheet(CUSTOM_UPAZILA_SHEET_NAME);
    sheet.appendRow(CUSTOM_UPAZILA_COLUMNS);
    sheet.getRange(1, 1, 1, CUSTOM_UPAZILA_COLUMNS.length).setFontWeight('bold');
  }
  return sheet;
}

function getVisitorSheet_() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getSheetByName(VISITOR_SHEET_NAME);
  if (!sheet) {
    sheet = ss.insertSheet(VISITOR_SHEET_NAME);
    sheet.appendRow(VISITOR_COLUMNS);
    sheet.getRange(1, 1, 1, VISITOR_COLUMNS.length).setFontWeight('bold');
  }
  return sheet;
}

function jsonOut_(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}

function doPost(e) {
  try {
    var raw = JSON.parse(e.postData.contents);

    if (!Array.isArray(raw) && raw.entryType === 'user_profile') {
      var ps = getProfileSheet_();
      var now = new Date();
      ps.appendRow([
        now.toISOString(),
        raw.submissionId || '',
        raw.shortRole || '',
        raw.roleLabel || '',
        raw.name || '',
        raw.mobile || '',
        raw.email || '',
        raw.deviceId || '',
        raw.district || '',
        raw.upazila || '',
        raw.union || '',
        raw.block || ''
      ]);
      return jsonOut_({ ok: true });
    }

    if (!Array.isArray(raw) && raw.entryType === 'growth_reading') {
      var gs = getGrowthSheet_();
      gs.appendRow([
        new Date().toISOString(),
        raw.entryId || '',
        raw.readingDate || '',
        raw.ndvi != null ? raw.ndvi : '',
        raw.heightCm != null ? raw.heightCm : '',
        raw.healthStatus || '',
        raw.note || '',
        raw.recordedBy || '',
        raw.deviceId || ''
      ]);
      return jsonOut_({ ok: true });
    }

    if (!Array.isArray(raw) && raw.entryType === 'custom_upazila') {
      var cus = getCustomUpazilaSheet_();
      cus.appendRow([
        new Date().toISOString(),
        raw.district || '',
        raw.upazilaName || '',
        raw.addedBy || '',
        raw.deviceId || ''
      ]);
      return jsonOut_({ ok: true });
    }

    if (!Array.isArray(raw) && raw.entryType === 'visitor_ping') {
      var vs = getVisitorSheet_();
      vs.appendRow([
        new Date().toISOString(),
        raw.email || '',
        raw.mode || '',
        raw.deviceId || ''
      ]);
      return jsonOut_({ ok: true });
    }

    // App_Entry: the client always posts an array here -- one item per
    // seedling species in the submission (all sharing one submissionId).
    // Wrap a bare object too, for any integration that posts a single row.
    var items = Array.isArray(raw) ? raw : [raw];
    if (!items.length) return jsonOut_({ ok: true });

    var sheet = getSheet_();
    var lock = LockService.getScriptLock();
    lock.waitLock(30000);
    try {
      // Upsert by submissionId: if this submission (new OR edited) already
      // has a row in the sheet, remove it first, then append the current
      // one. For a brand-new submissionId this delete is simply a no-op,
      // so create and edit both flow through the exact same safe path --
      // editing an already-synced entry no longer creates a duplicate row.
      var submissionId = items[0] && items[0].submissionId;
      if (submissionId) deleteAppEntryRowsBySubmissionId_(sheet, submissionId);
      var coordWarning = appendAppEntrySubmission_(sheet, items, new Date());
    } finally {
      lock.releaseLock();
    }
    return jsonOut_({ ok: true, coordWarning: coordWarning });
  } catch (err) {
    return jsonOut_({ ok: false, error: String(err) });
  }
}

/**
 * Builds and appends ONE row for an entire submission -- all of `items`
 * (one item per seedling species, sharing the same submission-level
 * fields) are combined into a single App_Entry row, rather than one row
 * per species. Returns true if the coordinates looked malformed.
 */
function appendAppEntrySubmission_(sheet, items, now) {
  var base = items[0] || {};
  var lat = normalizeCoord_(base.latitude);
  var lng = normalizeCoord_(base.longitude);

  var seedlings = items
    .filter(function(it) { return it && it.speciesName; })
    .map(function(it) {
      return { speciesName: it.speciesName || '', category: it.category || '', quantity: Number(it.quantity) || 0 };
    });
  var totalQty = seedlings.reduce(function(sum, s) { return sum + (s.quantity || 0); }, 0);
  var summaryText = seedlings.map(function(s) {
    return s.speciesName + (s.category ? ' (' + s.category + ')' : '') + ' \u00d7 ' + s.quantity;
  }).join(', ');

  var row = [
    now.toISOString(),
    base.submissionId || '',
    base.division || '',
    base.region || '',
    base.district || '',
    base.upazila || '',
    base.union || '',
    base.village || '',
    base.locationType || '',
    base.sourceType || '',
    base.address || '',
    lat.value,
    lng.value,
    base.plantingDate || '',
    summaryText,
    seedlings.length,
    totalQty,
    JSON.stringify(seedlings),
    base.ndvi || '',
    '',
    base.photoSha256 || '',
    base.farmerName || '',
    base.farmerMobile || '',
    base.saaoName || '',
    base.saaoMobile || '',
    base.officerName || '',
    base.officerMobile || '',
    base.remarks ? (base.remarks + (lat.ok && lng.ok ? '' : ' ⚠️ স্থানাঙ্ক যাচাই প্রয়োজন')) : (lat.ok && lng.ok ? '' : '⚠️ স্থানাঙ্ক যাচাই প্রয়োজন'),
    base.authHash || '',
    now.toISOString(),
    base.block || ''
  ];
  sheet.appendRow(row);
  return !lat.ok || !lng.ok;
}

/** Deletes the existing App_Entry row for a given submissionId (column B), if any. Bottom-up so row indices don't shift mid-loop (also tolerates legacy data that still has multiple rows per submissionId). Called under a script lock. */
function deleteAppEntryRowsBySubmissionId_(sheet, submissionId) {
  var lastRow = sheet.getLastRow();
  if (lastRow < 2) return;
  var ids = sheet.getRange(2, 2, lastRow - 1, 1).getValues(); // column B, 'অ্যাপ জমা আইডি'
  for (var i = ids.length - 1; i >= 0; i--) {
    if (String(ids[i][0]) === String(submissionId)) {
      sheet.deleteRow(i + 2); // +2: 1-indexed sheet rows, offset past the header
    }
  }
}

/**
 * ══════════════════════════════════════════════════════════════════════
 * ONE-TIME MIGRATION — run this once, manually, from the Apps Script
 * editor (function dropdown at the top -> select
 * "migrateAppEntryToOneRowPerSubmission" -> Run button) right after
 * deploying this version, before any new submissions arrive.
 * ══════════════════════════════════════════════════════════════════════
 *
 * Reads the CURRENT App_Entry sheet (old format: one row per seedling
 * species, several rows sharing one submissionId), groups rows by
 * submissionId, and writes the combined one-row-per-submission result
 * into a NEW sheet tab called "App_Entry_Migrated".
 *
 * SAFE: does not modify or delete the original App_Entry sheet at all.
 * Safe to re-run too -- it deletes and rebuilds only App_Entry_Migrated
 * each time.
 *
 * After running:
 *   1. Check the log output (View -> Logs, or Ctrl/Cmd+Enter) -- it
 *      reports how many old rows were read and how many submissions
 *      they combined into. Sanity-check that against what you'd expect.
 *   2. Open the App_Entry_Migrated tab and spot-check a few rows,
 *      especially any submission that had several seedling species --
 *      confirm 'চারার বিবরণ' lists all of them and 'মোট চারার সংখ্যা'
 *      matches the sum you'd expect.
 *   3. Only once you're satisfied: right-click App_Entry -> rename to
 *      "App_Entry_OldBackup", then right-click App_Entry_Migrated ->
 *      rename to "App_Entry". Keep the OldBackup tab around for a
 *      while as a safety net -- it costs nothing to leave it there.
 *
 * If your sheet's actual header row uses different column text than
 * what's hard-coded below (COLUMNS / this function's get() lookups),
 * this will simply find nothing for that field (get() returns '')
 * rather than erroring -- check the migrated tab's column contents
 * against the original before renaming anything.
 */
function migrateAppEntryToOneRowPerSubmission() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var oldSheet = ss.getSheetByName('App_Entry');
  if (!oldSheet) throw new Error('App_Entry sheet not found');

  var values = oldSheet.getDataRange().getValues();
  if (values.length < 2) { Logger.log('No data rows to migrate.'); return; }
  var header = values[0];
  var idx = {};
  header.forEach(function(h, i) { idx[String(h).trim()] = i; });
  function get(v, col) { return idx.hasOwnProperty(col) ? v[idx[col]] : ''; }

  var bySubmission = {};
  var order = [];
  var oldRowCount = 0;
  for (var r = 1; r < values.length; r++) {
    var v = values[r];
    if (!v.join('')) continue;
    oldRowCount++;
    var submissionId = String(get(v, 'অ্যাপ জমা আইডি') || '');
    var key = submissionId || ('__row' + r); // rows with no submissionId each become their own submission
    if (!bySubmission[key]) {
      bySubmission[key] = {
        submittedAt:  get(v, 'জমার সময়'),
        submissionId: submissionId,
        division:     get(v, 'বিভাগ'),
        region:       get(v, 'অঞ্চল'),
        district:     get(v, 'জেলা'),
        upazila:      get(v, 'উপজেলা'),
        union:        get(v, 'ইউনিয়ন'),
        village:      get(v, 'গ্রাম'),
        locationType: get(v, 'অবস্থানের ধরন'),
        sourceType:   get(v, 'চারার উৎস'),
        address:      get(v, 'সুনির্দিষ্ট ঠিকানা'),
        latitude:     get(v, 'অক্ষাংশ'),
        longitude:    get(v, 'দ্রাঘিমাংশ'),
        plantingDate: get(v, 'রোপণের তারিখ'),
        ndvi:         get(v, 'প্রাথমিক NDVI'),
        photoSha256:  get(v, 'ছবি SHA-256'),
        farmerName:   get(v, 'কৃষকের নাম'),
        farmerMobile: get(v, 'কৃষকের মোবাইল'),
        saaoName:     get(v, 'SAAO-এর নাম'),
        saaoMobile:   get(v, 'SAAO-এর মোবাইল'),
        officerName:  get(v, 'মনিটরিং অফিসারের নাম'),
        officerMobile:get(v, 'মনিটরিং অফিসারের মোবাইল'),
        remarks:      get(v, 'মন্তব্য'),
        authHash:     get(v, 'সত্যায়ন হ্যাশ'),
        syncedAt:     get(v, 'সিঙ্কের সময়'),
        block:        get(v, 'ব্লক'),
        seedlings: []
      };
      order.push(key);
    }
    var species = String(get(v, 'বৃক্ষের প্রজাতি/জাত') || '');
    if (species) {
      bySubmission[key].seedlings.push({
        speciesName: species,
        category: String(get(v, 'বৃক্ষের শ্রেণী') || ''),
        quantity: Number(get(v, 'সংখ্যা')) || 0
      });
    }
  }

  var newSheet = ss.getSheetByName('App_Entry_Migrated');
  if (newSheet) ss.deleteSheet(newSheet); // idempotent: re-running rebuilds cleanly
  newSheet = ss.insertSheet('App_Entry_Migrated');
  newSheet.appendRow(COLUMNS);
  newSheet.getRange(1, 1, 1, COLUMNS.length).setFontWeight('bold');

  order.forEach(function(key) {
    var s = bySubmission[key];
    var totalQty = s.seedlings.reduce(function(sum, sd) { return sum + (sd.quantity || 0); }, 0);
    var summaryText = s.seedlings.map(function(sd) {
      return sd.speciesName + (sd.category ? ' (' + sd.category + ')' : '') + ' \u00d7 ' + sd.quantity;
    }).join(', ');
    newSheet.appendRow([
      s.submittedAt, s.submissionId, s.division, s.region, s.district, s.upazila,
      s.union, s.village, s.locationType, s.sourceType, s.address,
      s.latitude, s.longitude, s.plantingDate,
      summaryText, s.seedlings.length, totalQty, JSON.stringify(s.seedlings),
      s.ndvi, '', s.photoSha256, s.farmerName, s.farmerMobile,
      s.saaoName, s.saaoMobile, s.officerName, s.officerMobile,
      s.remarks, s.authHash, s.syncedAt, s.block
    ]);
  });

  Logger.log('Read ' + oldRowCount + ' old rows -> combined into ' + order.length + ' submissions in App_Entry_Migrated.');
}

function doGet(e) {
  var params = (e && e.parameter) || {};
  try {
    if (params.list) return jsonOut_(listEntries_(params.district, params.region));
    if (params.mobile) return jsonOut_(lookupByMobile_(params.mobile));
    if (params.directory) return jsonOut_(getDirectory_(params.role, params.upazila));
    if (params.customUpazila) return jsonOut_(getCustomUpazilas_(params.district));
    if (params.officialSummary) return jsonOut_(getOfficialReportSummary_());
    return jsonOut_({ ok: false, error: 'mobile, list, directory, customUpazila, or officialSummary query param required' });
  } catch (err) {
    return jsonOut_({ ok: false, error: String(err) });
  }
}

/**
 * Personnel directory, deduplicated from User_Profile by mobile number
 * (most recent submission per person wins). This is deliberately NOT a
 * separate sheet -- User_Profile already is the single source of truth
 * for "who is this officer" across every role (ADD/AAO/AEO/UAO/SAAO);
 * duplicating it into a second sheet would just create two records that
 * can drift out of sync with each other.
 */
function getDirectory_(role, upazila) {
  var ps = getProfileSheet_();
  var values = ps.getDataRange().getValues();
  if (values.length < 2) return { ok: true, count: 0, people: [] };
  var header = values[0];
  var idx = {};
  header.forEach(function(h, i) { idx[String(h).trim()] = i; });

  var byMobile = {};
  var order = [];
  for (var r = 1; r < values.length; r++) {
    var v = values[r];
    if (!v.join('')) continue;
    var get = function(col) { return idx.hasOwnProperty(col) ? v[idx[col]] : ''; };
    var mobile = String(get('মোবাইল') || '');
    if (!mobile) continue;
    // Later rows overwrite earlier ones for the same mobile -> "most recent wins"
    if (!byMobile[mobile]) order.push(mobile);
    byMobile[mobile] = {
      shortRole: String(get('সংক্ষিপ্ত পদবি') || ''),
      roleLabel: String(get('পদবি') || ''),
      name:      String(get('নাম') || ''),
      mobile:    mobile,
      district:  String(get('জেলা') || ''),
      upazila:   String(get('উপজেলা') || ''),
      union:     String(get('ইউনিয়ন') || ''),
      block:     String(get('ব্লক') || '')
    };
  }

  var people = order.map(function(m) { return byMobile[m]; });
  if (role) people = people.filter(function(p) { return p.shortRole === role; });
  if (upazila) people = people.filter(function(p) { return p.upazila === upazila; });
  return { ok: true, count: people.length, people: people };
}

/** Every custom upazila name any officer has added, across all devices. */
function getCustomUpazilas_(district) {
  var cus = getCustomUpazilaSheet_();
  var values = cus.getDataRange().getValues();
  if (values.length < 2) return { ok: true, count: 0, items: [] };
  var header = values[0];
  var idx = {};
  header.forEach(function(h, i) { idx[String(h).trim()] = i; });

  var seen = {};
  var items = [];
  for (var r = 1; r < values.length; r++) {
    var v = values[r];
    if (!v.join('')) continue;
    var get = function(col) { return idx.hasOwnProperty(col) ? v[idx[col]] : ''; };
    var d = String(get('জেলা') || '');
    var name = String(get('উপজেলার নাম') || '');
    if (!name) continue;
    if (district && d !== district) continue;
    var key = d + '|' + name;
    if (seen[key]) continue;
    seen[key] = true;
    items.push({ district: d, upazilaName: name });
  }
  return { ok: true, count: items.length, items: items };
}

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
    if (!v.join('')) continue;
    var get = function(col) { return idx.hasOwnProperty(col) ? v[idx[col]] : ''; };

    // New schema: one row = one submission, seedlings packed into a JSON
    // column. Old schema (pre-migration legacy rows, if any survive):
    // one row = one seedling species, with speciesName/category/quantity
    // as plain columns -- still read those as a single-item fallback so
    // nothing gets silently dropped if a stray old-format row remains.
    var seedlings = [];
    var seedlingsRaw = get('চারার বিবরণ (JSON)');
    if (seedlingsRaw) {
      try {
        var parsed = JSON.parse(seedlingsRaw);
        if (Array.isArray(parsed)) seedlings = parsed;
      } catch (e) { /* fall through to legacy-column fallback below */ }
    }
    if (!seedlings.length) {
      var legacySpecies = String(get('বৃক্ষের প্রজাতি/জাত') || '');
      if (legacySpecies) {
        seedlings = [{
          speciesName: legacySpecies,
          category: String(get('বৃক্ষের শ্রেণী') || ''),
          quantity: Number(get('সংখ্যা')) || 0
        }];
      }
    }

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
      latitude:     get('অক্ষাংশ'),
      longitude:    get('দ্রাঘিমাংশ'),
      plantingDate: String(get('রোপণের তারিখ') || ''),
      seedlings:    seedlings,
      ndvi:         String(get('প্রাথমিক NDVI') || ''),
      farmerName:   String(get('কৃষকের নাম') || ''),
      farmerMobile: String(get('কৃষকের মোবাইল') || ''),
      saaoName:     String(get('SAAO-এর নাম') || ''),
      saaoMobile:   String(get('SAAO-এর মোবাইল') || ''),
      officerName:  String(get('মনিটরিং অফিসারের নাম') || ''),
      officerMobile:String(get('মনিটরিং অফিসারের মোবাইল') || ''),
      remarks:      String(get('মন্তব্য') || ''),
      submittedAt:  String(get('জমার সময়') || ''),
      block:        String(get('ব্লক') || '')
    });
  }
  return rows;
}

function listEntries_(district, region) {
  var rows = readAllRows_();
  if (district) rows = rows.filter(function(r) { return r.district === district; });
  if (region) rows = rows.filter(function(r) { return r.region === region; });

  // Rows are one-per-submission now, but this still groups by submissionId
  // as a safety net -- e.g. if a legacy multi-row-per-species submission
  // slipped through ungrouped, its seedlings still get merged into one entry
  // instead of showing up as several near-duplicate map markers.
  var bySubmission = {};
  var order = [];
  rows.forEach(function(r) {
    var key = r.submissionId || (r.latitude + ',' + r.longitude + '|' + r.farmerMobile + '|' + r.plantingDate);
    if (!bySubmission[key]) {
      bySubmission[key] = {
        submissionId: r.submissionId, division: r.division, region: r.region,
        district: r.district, upazila: r.upazila, union: r.union, village: r.village,
        block: r.block,
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
    (r.seedlings || []).forEach(function(sd) {
      bySubmission[key].seedlings.push(sd);
    });
  });

  var entries = order.map(function(k) { return bySubmission[k]; });
  return { ok: true, count: entries.length, entries: entries };
}

function lookupByMobile_(mobile) {
  var ps = getProfileSheet_();
  var values = ps.getDataRange().getValues();
  if (values.length < 2) return { ok: false, found: false };
  var header = values[0];
  var idx = {};
  header.forEach(function(h, i) { idx[String(h).trim()] = i; });

  var match = null;
  for (var r = values.length - 1; r >= 1; r--) {
    var v = values[r];
    var mob = idx.hasOwnProperty('মোবাইল') ? String(v[idx['মোবাইল']] || '') : '';
    if (mob === mobile) {
      var get = function(col) { return idx.hasOwnProperty(col) ? v[idx[col]] : ''; };
      match = {
        shortRole: String(get('সংক্ষিপ্ত পদবি') || ''),
        roleLabel: String(get('পদবি') || ''),
        name:      String(get('নাম') || ''),
        mobile:    mob,
        email:     String(get('ইমেইল') || ''),
        deviceId:  String(get('ডিভাইস আইডি') || ''),
        district:  String(get('জেলা') || ''),
        upazila:   String(get('উপজেলা') || ''),
        union:     String(get('ইউনিয়ন') || ''),
        block:     String(get('ব্লক') || '')
      };
      break;
    }
  }
  if (!match) return { ok: false, found: false };
  return { ok: true, found: true, user: match };
}
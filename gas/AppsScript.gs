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
    return jsonOut_({ ok: false, error: 'mobile, list, directory, or customUpazila query param required' });
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

// ═══════════════════════════════════════════════════════════════════════════
//  WEEKLY REPORT — EMAIL DELIVERY SYSTEM
//
//  How to deploy:
//   1. Save & deploy this script (Extensions → Apps Script → Deploy).
//   2. IMPORTANT: Go to Project Settings → Time zone → set to "Asia/Dhaka".
//   3. Run setupWeeklyTrigger()  — installs a recurring Wednesday 08:00 trigger.
//   4. Run setupOnceOffTrigger() — queues the first send for Thu 21 Aug 08:00 BDT.
//   5. Run sendWeeklyReport()    — manual test / send-now at any time.
//
//  Report window: rolling 7 days ending at the moment the function runs.
// ═══════════════════════════════════════════════════════════════════════════

// ── Configuration ─────────────────────────────────────────────────────────
var REPORT_RECIPIENTS  = ['moniruzjamanlearner@gmail.com'];
var REPORT_SENDER_NAME = 'DAE কুড়িগ্রাম — বৃক্ষরোপণ ট্র্যাকার';
var REPORT_DISTRICT    = 'কুড়িগ্রাম';
var REPORT_DEPT        = 'কৃষি সম্প্রসারণ অধিদপ্তর';

// ── Entry point ───────────────────────────────────────────────────────────
/**
 * Generates a dynamic weekly plantation progress report and emails it to
 * REPORT_RECIPIENTS. Safe to run manually; also called by the weekly trigger.
 */
function sendWeeklyReport() {
  var now       = new Date();
  var weekEnd   = new Date(now);
  var weekStart = new Date(now);
  weekStart.setDate(weekStart.getDate() - 7);
  weekStart.setHours(0, 0, 0, 0);

  var prevEnd   = new Date(weekStart);
  var prevStart = new Date(weekStart);
  prevStart.setDate(prevStart.getDate() - 7);
  prevStart.setHours(0, 0, 0, 0);

  var allRows = readAllRows_();
  var stats   = computeWeeklyStats_(allRows, weekStart, weekEnd, prevStart, prevEnd);
  var html    = buildWeeklyReportHtml_(stats, weekStart, weekEnd);

  var dateTag = Utilities.formatDate(now, 'Asia/Dhaka', 'dd MMM yyyy');
  var subject = '\uD83C\uDF33 সাপ্তাহিক বৃক্ষরোপণ অগ্রগতি — ' + REPORT_DISTRICT + ' জেলা (' + dateTag + ')';

  MailApp.sendEmail({
    to:       REPORT_RECIPIENTS.join(','),
    name:     REPORT_SENDER_NAME,
    subject:  subject,
    htmlBody: html
  });

  Logger.log('Weekly report sent to: ' + REPORT_RECIPIENTS.join(', '));
}

// ── Stats computation ─────────────────────────────────────────────────────
function computeWeeklyStats_(rows, weekStart, weekEnd, prevStart, prevEnd) {
  var thisWeek = { entries: 0, trees: 0, upazilas: {}, categories: {}, saao: {} };
  var prevWeek = { entries: 0, trees: 0 };
  var cumul    = { entries: 0, trees: 0, upazilaSet: {} };

  rows.forEach(function(r) {
    var d     = r.submittedAt ? new Date(r.submittedAt) : null;
    var trees = (r.seedlings || []).reduce(function(s, sd) {
      return s + (Number(sd.quantity) || 0);
    }, 0);

    // All-time cumulative
    cumul.entries++;
    cumul.trees += trees;
    if (r.upazila) cumul.upazilaSet[r.upazila] = true;

    if (!d) return;

    // This week
    if (d >= weekStart && d < weekEnd) {
      thisWeek.entries++;
      thisWeek.trees += trees;

      var uz = r.upazila || 'অজ্ঞাত';
      if (!thisWeek.upazilas[uz]) thisWeek.upazilas[uz] = { entries: 0, trees: 0 };
      thisWeek.upazilas[uz].entries++;
      thisWeek.upazilas[uz].trees += trees;

      (r.seedlings || []).forEach(function(sd) {
        var cat = sd.category || 'অন্যান্য';
        if (!thisWeek.categories[cat]) thisWeek.categories[cat] = { qty: 0 };
        thisWeek.categories[cat].qty += (Number(sd.quantity) || 0);
      });

      var saao = r.saaoName || '';
      if (saao) {
        if (!thisWeek.saao[saao]) thisWeek.saao[saao] = { entries: 0, trees: 0, upazila: r.upazila || '' };
        thisWeek.saao[saao].entries++;
        thisWeek.saao[saao].trees += trees;
      }
    }

    // Previous week (WoW delta)
    if (d >= prevStart && d < prevEnd) {
      prevWeek.entries++;
      prevWeek.trees += trees;
    }
  });

  var upazilaList = Object.keys(thisWeek.upazilas).map(function(uz) {
    return { name: uz, entries: thisWeek.upazilas[uz].entries, trees: thisWeek.upazilas[uz].trees };
  }).sort(function(a, b) { return b.trees - a.trees; });

  var catList = Object.keys(thisWeek.categories).map(function(c) {
    return { name: c, qty: thisWeek.categories[c].qty };
  }).sort(function(a, b) { return b.qty - a.qty; }).slice(0, 6);

  var saaoList = Object.keys(thisWeek.saao).map(function(n) {
    return { name: n, entries: thisWeek.saao[n].entries, trees: thisWeek.saao[n].trees, upazila: thisWeek.saao[n].upazila };
  }).sort(function(a, b) { return b.trees - a.trees; }).slice(0, 5);

  return {
    thisWeek:     thisWeek,
    cumul:        { entries: cumul.entries, trees: cumul.trees, upazilaCount: Object.keys(cumul.upazilaSet).length },
    upazilaList:  upazilaList,
    catList:      catList,
    saaoList:     saaoList,
    entriesDelta: thisWeek.entries - prevWeek.entries,
    treesDelta:   thisWeek.trees   - prevWeek.trees
  };
}

// ── Bengali numeral helpers ───────────────────────────────────────────────
function toBengaliNumber_(n) {
  var map = ['\u09E6','\u09E7','\u09E8','\u09E9','\u09EA','\u09EB','\u09EC','\u09ED','\u09EE','\u09EF'];
  var abs = Math.abs(Math.round(n));
  var s   = abs.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  var bn  = s.split('').map(function(c) { return /\d/.test(c) ? map[parseInt(c, 10)] : c; }).join('');
  return (n < 0 ? '\u2212' : '') + bn;
}

function fmtDelta_(n) {
  if (n === 0) return '\u00b1\u09E6';
  return (n > 0 ? '\u25B2' : '\u25BC') + toBengaliNumber_(Math.abs(n));
}

function deltaColor_(n) { return n >= 0 ? '#2E7D32' : '#C62828'; }

// ── HTML email builder ────────────────────────────────────────────────────
function buildWeeklyReportHtml_(stats, weekStart, weekEnd) {
  var tw       = stats.thisWeek;
  var cumul    = stats.cumul;
  var upazilas = stats.upazilaList;
  var cats     = stats.catList;
  var saaoList = stats.saaoList;

  function fmtDate(d) { return Utilities.formatDate(d, 'Asia/Dhaka', 'dd MMM yyyy'); }
  var periodLabel = fmtDate(weekStart) + ' \u2013 ' + fmtDate(new Date(weekEnd.getTime() - 1));
  var reportDate  = fmtDate(new Date());
  var maxTrees    = upazilas.length ? upazilas[0].trees : 1;
  var maxCat      = cats.length ? cats[0].qty : 1;

  // Upazila rows
  var uzRows = '';
  upazilas.forEach(function(uz, i) {
    var barPct   = Math.max(4, Math.round((uz.trees / maxTrees) * 100));
    var barColor = barPct >= 60 ? '#2E7D32' : (barPct >= 30 ? '#66BB6A' : '#A5D6A7');
    var bg       = i % 2 === 0 ? '#FFFFFF' : '#F1F8F1';
    var pct      = tw.trees > 0 ? Math.round(uz.trees / tw.trees * 100) : 0;
    uzRows +=
      '<tr style="background-color:' + bg + ';">' +
        '<td style="padding:6px 10px;font-size:12px;color:#212121;white-space:nowrap;">' + uz.name + '</td>' +
        '<td style="padding:6px 10px;">' +
          '<table role="presentation" width="100%" cellpadding="0" cellspacing="0"><tr>' +
            '<td><div style="background-color:' + barColor + ';height:10px;width:' + barPct + '%;min-width:4px;border-radius:3px;"></div></td>' +
            '<td width="44" style="font-size:11px;color:#424242;padding-left:6px;white-space:nowrap;" align="right">' + toBengaliNumber_(uz.trees) + '</td>' +
            '<td width="34" style="font-size:10px;color:#9E9E9E;white-space:nowrap;" align="right">' + toBengaliNumber_(pct) + '%</td>' +
          '</tr></table>' +
        '</td>' +
        '<td style="padding:6px 10px;font-size:11px;color:#757575;" align="center">' + toBengaliNumber_(uz.entries) + '</td>' +
      '</tr>';
  });
  if (!uzRows) uzRows = '<tr><td colspan="3" style="padding:12px;font-size:12px;color:#9E9E9E;text-align:center;">এই সপ্তাহে কোনো এন্ট্রি নেই</td></tr>';

  // Category rows
  var catRows = '';
  cats.forEach(function(c, i) {
    var barPct = Math.max(4, Math.round((c.qty / maxCat) * 100));
    var bg     = i % 2 === 0 ? '#FFFFFF' : '#FFF3E0';
    var pct    = tw.trees > 0 ? Math.round(c.qty / tw.trees * 100) : 0;
    catRows +=
      '<tr style="background-color:' + bg + ';">' +
        '<td style="padding:5px 10px;font-size:12px;color:#212121;">' + c.name + '</td>' +
        '<td style="padding:5px 10px;">' +
          '<table role="presentation" width="100%" cellpadding="0" cellspacing="0"><tr>' +
            '<td><div style="background-color:#F9A825;height:9px;width:' + barPct + '%;min-width:4px;border-radius:3px;"></div></td>' +
            '<td width="44" style="font-size:11px;color:#424242;padding-left:6px;white-space:nowrap;" align="right">' + toBengaliNumber_(c.qty) + '</td>' +
            '<td width="34" style="font-size:10px;color:#9E9E9E;white-space:nowrap;" align="right">' + toBengaliNumber_(pct) + '%</td>' +
          '</tr></table>' +
        '</td>' +
      '</tr>';
  });
  if (!catRows) catRows = '<tr><td colspan="2" style="padding:10px;font-size:12px;color:#9E9E9E;text-align:center;">\u09A4\u09A5\u09CD\u09AF \u09A8\u09C7\u0987</td></tr>';

  // SAAO rows
  var medals = ['\uD83E\uDD47','\uD83E\uDD48','\uD83E\uDD49','\u2464','\u2465'];
  var saaoRows = '';
  saaoList.forEach(function(s, i) {
    var bg = i % 2 === 0 ? '#FFFFFF' : '#EFF3FF';
    saaoRows +=
      '<tr style="background-color:' + bg + ';">' +
        '<td style="padding:5px 10px;font-size:12px;color:#212121;">' + medals[i] + ' ' + s.name + '</td>' +
        '<td style="padding:5px 10px;font-size:11px;color:#616161;" align="center">' + (s.upazila || '\u2014') + '</td>' +
        '<td style="padding:5px 10px;font-size:12px;font-weight:700;color:#2E7D32;" align="center">' + toBengaliNumber_(s.trees) + '</td>' +
        '<td style="padding:5px 10px;font-size:11px;color:#757575;" align="center">' + toBengaliNumber_(s.entries) + '</td>' +
      '</tr>';
  });
  if (!saaoRows) saaoRows = '<tr><td colspan="4" style="padding:10px;font-size:12px;color:#9E9E9E;text-align:center;">\u09A4\u09A5\u09CD\u09AF \u09A8\u09C7\u0987</td></tr>';

  // Delta chip
  function deltaChip(n, label) {
    return '<span style="font-size:10px;font-weight:600;color:' + deltaColor_(n) + ';">' +
      fmtDelta_(n) + ' ' + label + '</span>';
  }

  // ── Full HTML ──────────────────────────────────────────────────────────
  return '<!DOCTYPE html>' +
'<html lang="bn"><head><meta charset="UTF-8">' +
'<meta name="viewport" content="width=device-width,initial-scale=1">' +
'<title>\u09B8\u09BE\u09AA\u09CD\u09A4\u09BE\u09B9\u09BF\u0995 \u09AC\u09C3\u0995\u09CD\u09B7\u09B0\u09CB\u09AA\u09A3 \u09AA\u09CD\u09B0\u09A4\u09BF\u09AC\u09C7\u09A6\u09A8</title>' +
'</head>' +
'<body style="margin:0;padding:0;background-color:#EEF2ED;font-family:\'Noto Sans Bengali\',\'Segoe UI\',Arial,sans-serif;">' +

// Preheader hidden text
'<div style="display:none;max-height:0;overflow:hidden;opacity:0;">' +
REPORT_DISTRICT + ' — \u098F\u0987 \u09B8\u09AA\u09CD\u09A4\u09BE\u09B9\u09C7 ' + toBengaliNumber_(tw.entries) + '\u099F\u09BF \u098F\u09A8\u09CD\u099F\u09CD\u09B0\u09BF\u09A4\u09C7 ' + toBengaliNumber_(tw.trees) + '\u099F\u09BF \u09AC\u09C3\u0995\u09CD\u09B7 \u09B0\u09CB\u09AA\u09A3 \u09B8\u09AE\u09CD\u09AA\u09A8\u09CD\u09A8\u0964' +
'</div>' +

// Wrapper
'<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:#EEF2ED;padding:18px 0;">' +
'<tr><td align="center">' +
'<table role="presentation" width="620" cellpadding="0" cellspacing="0" style="background-color:#FFFFFF;border-radius:10px;overflow:hidden;box-shadow:0 2px 8px rgba(0,0,0,0.10);">' +

// HEADER
'<tr><td style="background:linear-gradient(135deg,#1B5E20 0%,#33691E 100%);padding:22px 26px 18px;">' +
  '<table role="presentation" width="100%" cellpadding="0" cellspacing="0"><tr>' +
    '<td>' +
      '<div style="font-size:10px;letter-spacing:1.2px;color:#A5D6A7;text-transform:uppercase;padding-bottom:3px;">' +
        REPORT_DEPT + '&nbsp;\u2022&nbsp;' + REPORT_DISTRICT + ' \u099C\u09C7\u09B2\u09BE' +
      '</div>' +
      '<div style="font-size:19px;font-weight:700;color:#FFFFFF;line-height:26px;">' +
        '\u09B8\u09BE\u09AA\u09CD\u09A4\u09BE\u09B9\u09BF\u0995 \u09AC\u09C3\u0995\u09CD\u09B7\u09B0\u09CB\u09AA\u09A3 \u0995\u09B0\u09CD\u09AE\u09B8\u09C2\u099A\u09BF\u09B0 \u0985\u0997\u09CD\u09B0\u0997\u09A4\u09BF \u09AA\u09CD\u09B0\u09A4\u09BF\u09AC\u09C7\u09A6\u09A8' +
      '</div>' +
      '<div style="font-size:11px;color:#C8E6C9;padding-top:5px;">' +
        '\u09AA\u09CD\u09B0\u09A4\u09BF\u09AC\u09C7\u09A6\u09A8\u09C7\u09B0 \u09A4\u09BE\u09B0\u09BF\u0996: <strong style="color:#E8F5E9;">' + reportDate + '</strong>' +
        '&nbsp;&nbsp;\u2502&nbsp;&nbsp;\u09B8\u09AE\u09AF\u09BC\u0995\u09BE\u09B2: <strong style="color:#E8F5E9;">' + periodLabel + '</strong>' +
      '</div>' +
    '</td>' +
    '<td width="52" align="right" style="font-size:34px;opacity:0.45;">\uD83C\uDF33</td>' +
  '</tr></table>' +
'</td></tr>' +

// KPI CARDS
'<tr><td style="padding:14px 22px 6px;">' +
  '<table role="presentation" width="100%" cellpadding="0" cellspacing="0"><tr>' +
    // Card 1 — this week entries
    '<td width="31%" align="center" style="background-color:#F1F8F1;border:1px solid #C8E6C9;border-radius:8px;padding:12px 6px;">' +
      '<div style="font-size:9px;color:#388E3C;font-weight:700;letter-spacing:.6px;text-transform:uppercase;">\u098F\u0987 \u09B8\u09AA\u09CD\u09A4\u09BE\u09B9\u09C7\u09B0 \u098F\u09A8\u09CD\u099F\u09CD\u09B0\u09BF</div>' +
      '<div style="font-size:26px;color:#1B5E20;font-weight:700;padding:3px 0 2px;">' + toBengaliNumber_(tw.entries) + '</div>' +
      '<div>' + deltaChip(stats.entriesDelta, '\u0997\u09A4 \u09B8\u09AA\u09CD\u09A4\u09BE\u09B9') + '</div>' +
    '</td>' +
    '<td width="3%"></td>' +
    // Card 2 — this week trees
    '<td width="31%" align="center" style="background-color:#2E7D32;border-radius:8px;padding:12px 6px;">' +
      '<div style="font-size:9px;color:#A5D6A7;font-weight:700;letter-spacing:.6px;text-transform:uppercase;">\u098F\u0987 \u09B8\u09AA\u09CD\u09A4\u09BE\u09B9\u09C7\u09B0 \u09AC\u09C3\u0995\u09CD\u09B7</div>' +
      '<div style="font-size:26px;color:#FFFFFF;font-weight:700;padding:3px 0 2px;">' + toBengaliNumber_(tw.trees) + '</div>' +
      '<div style="font-size:10px;color:#C8E6C9;">' + fmtDelta_(stats.treesDelta) + ' \u0997\u09A4 \u09B8\u09AA\u09CD\u09A4\u09BE\u09B9</div>' +
    '</td>' +
    '<td width="3%"></td>' +
    // Card 3 — all-time cumulative
    '<td width="31%" align="center" style="background-color:#1565C0;border-radius:8px;padding:12px 6px;">' +
      '<div style="font-size:9px;color:#BBDEFB;font-weight:700;letter-spacing:.6px;text-transform:uppercase;">\u09B8\u09B0\u09CD\u09AC\u09AE\u09CB\u099F \u09AC\u09C3\u0995\u09CD\u09B7 (\u098F \u09AF\u09BE\u09AC\u09CE)</div>' +
      '<div style="font-size:26px;color:#FFFFFF;font-weight:700;padding:3px 0 2px;">' + toBengaliNumber_(cumul.trees) + '</div>' +
      '<div style="font-size:10px;color:#90CAF9;">' + toBengaliNumber_(cumul.entries) + ' \u098F\u09A8\u09CD\u099F\u09CD\u09B0\u09BF&nbsp;\u2502&nbsp;' + toBengaliNumber_(cumul.upazilaCount) + ' \u0989\u09AA\u099C\u09C7\u09B2\u09BE</div>' +
    '</td>' +
  '</tr></table>' +
'</td></tr>' +

// SECTION A — Upazila
'<tr><td style="padding:14px 22px 0;">' +
  '<div style="background-color:#2E7D32;color:#FFFFFF;font-size:12px;font-weight:700;padding:7px 12px;border-radius:6px 6px 0 0;">' +
    '\u0995. \u0989\u09AA\u099C\u09C7\u09B2\u09BE\u09AD\u09BF\u09A4\u09CD\u09A4\u09BF\u0995 \u0985\u0997\u09CD\u09B0\u0997\u09A4\u09BF (\u098F\u0987 \u09B8\u09AA\u09CD\u09A4\u09BE\u09B9)' +
  '</div>' +
  '<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="border:1px solid #C8E6C9;border-top:none;">' +
    '<tr style="background-color:#1B5E20;">' +
      '<td style="color:#fff;padding:6px 10px;font-size:11px;font-weight:600;width:26%;">\u0989\u09AA\u099C\u09C7\u09B2\u09BE</td>' +
      '<td style="color:#fff;padding:6px 10px;font-size:11px;font-weight:600;">\u09AC\u09C3\u0995\u09CD\u09B7 (\u09AC\u09BE\u09B0 \u099A\u09BE\u09B0\u09CD\u099F)</td>' +
      '<td style="color:#fff;padding:6px 10px;font-size:11px;font-weight:600;width:12%;" align="center">\u098F\u09A8\u09CD\u099F\u09CD\u09B0\u09BF</td>' +
    '</tr>' +
    uzRows +
  '</table>' +
'</td></tr>' +

// SECTION B — Categories
'<tr><td style="padding:12px 22px 0;">' +
  '<div style="background-color:#E65100;color:#FFFFFF;font-size:12px;font-weight:700;padding:7px 12px;border-radius:6px 6px 0 0;">' +
    '\u0996. \u09AA\u09CD\u09B0\u099C\u09BE\u09A4\u09BF \u0995\u09CD\u09AF\u09BE\u099F\u09BE\u0997\u09B0\u09BF (\u098F\u0987 \u09B8\u09AA\u09CD\u09A4\u09BE\u09B9)' +
  '</div>' +
  '<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="border:1px solid #FFE0B2;border-top:none;">' +
    '<tr style="background-color:#BF360C;">' +
      '<td style="color:#fff;padding:6px 10px;font-size:11px;font-weight:600;width:34%;">\u0995\u09CD\u09AF\u09BE\u099F\u09BE\u0997\u09B0\u09BF</td>' +
      '<td style="color:#fff;padding:6px 10px;font-size:11px;font-weight:600;">\u099A\u09BE\u09B0\u09BE\u09B0 \u09B8\u0982\u0996\u09CD\u09AF\u09BE</td>' +
    '</tr>' +
    catRows +
  '</table>' +
'</td></tr>' +

// SECTION C — SAAO Leaderboard
'<tr><td style="padding:12px 22px 0;">' +
  '<div style="background-color:#1565C0;color:#FFFFFF;font-size:12px;font-weight:700;padding:7px 12px;border-radius:6px 6px 0 0;">' +
    '\u0997. \u09B6\u09C0\u09B0\u09CD\u09B7 \u09B8\u0995\u09CD\u09B0\u09BF\u09AF\u09BC \u098F\u09B8\u098F\u098F\u0993 (\u098F\u0987 \u09B8\u09AA\u09CD\u09A4\u09BE\u09B9)' +
  '</div>' +
  '<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="border:1px solid #BBDEFB;border-top:none;">' +
    '<tr style="background-color:#0D47A1;">' +
      '<td style="color:#fff;padding:6px 10px;font-size:11px;font-weight:600;">\u09A8\u09BE\u09AE</td>' +
      '<td style="color:#fff;padding:6px 10px;font-size:11px;font-weight:600;" align="center">\u0989\u09AA\u099C\u09C7\u09B2\u09BE</td>' +
      '<td style="color:#fff;padding:6px 10px;font-size:11px;font-weight:600;" align="center">\u09AC\u09C3\u0995\u09CD\u09B7</td>' +
      '<td style="color:#fff;padding:6px 10px;font-size:11px;font-weight:600;" align="center">\u098F\u09A8\u09CD\u099F\u09CD\u09B0\u09BF</td>' +
    '</tr>' +
    saaoRows +
  '</table>' +
'</td></tr>' +

// ATTACHMENT NOTE
'<tr><td style="padding:12px 22px 0;">' +
  '<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:#FFF8E1;border:1px solid #FFE082;border-radius:6px;">' +
    '<tr><td style="padding:10px 14px;font-size:11px;color:#5D4037;line-height:17px;">' +
      '\uD83D\uDCCE <strong>\u09B8\u0982\u09AF\u09C1\u0995\u09CD\u09A4\u09BF:</strong> \u09B8\u09BE\u09AA\u09CD\u09A4\u09BE\u09B9\u09BF\u0995 \u09B0\u09BF\u09AA\u09CB\u09B0\u09CD\u099F\u09C7\u09B0 \u09B8\u09BE\u09A5\u09C7 \u098F\u0995\u09CD\u09B8\u09C7\u09B2 \u09B8\u0982\u09AF\u09C1\u0995\u09CD\u09A4\u09BF \u09AC\u09BE\u099E\u09CD\u099B\u09A8\u09C0\u09AF\u09BC\u0964 ' +
      '\u09A1\u09CD\u09AF\u09BE\u09B6\u09AC\u09CB\u09B0\u09CD\u09A1 \u09A5\u09C7\u0995\u09C7 <strong>Gov Excel</strong> \u09AC\u09BE <strong>\u09E7\u09ED \u0995\u09B2\u09BE\u09AE \u099B\u0995</strong> \u09B0\u09AA\u09CD\u09A4\u09BE\u09A8\u09BF \u0995\u09B0\u09C7 \u098F\u0987 \u0987\u09AE\u09C7\u0987\u09B2\u09C7\u09B0 \u09B0\u09BF\u09AA\u09CD\u09B2\u09BE\u0987\u09A4\u09C7 \u09B8\u0982\u09AF\u09C1\u0995\u09CD\u09A4 \u0995\u09B0\u09C1\u09A8\u0964' +
    '</td></tr>' +
  '</table>' +
'</td></tr>' +

// CLOSING
'<tr><td style="padding:14px 22px 20px;font-size:13px;line-height:20px;color:#212121;">' +
  '\u09AA\u09CD\u09B0\u09A4\u09BF\u09AC\u09C7\u09A6\u09A8\u099F\u09BF \u0986\u09AA\u09A8\u09BE\u09B0 \u09B8\u09A6\u09AF\u09BC \u0985\u09AC\u0997\u09A4\u09BF \u0993 \u09AA\u09B0\u09AC\u09B0\u09CD\u09A4\u09C0 \u09AC\u09CD\u09AF\u09AC\u09B8\u09CD\u09A5\u09BE \u0997\u09CD\u09B0\u09B9\u09A3\u09C7\u09B0 \u099C\u09A8\u09CD\u09AF \u09AA\u09C7\u09B6 \u0995\u09B0\u09BE \u09B9\u09B2\u09CB\u0964<br><br>' +
  '\u09A7\u09A8\u09CD\u09AF\u09AC\u09BE\u09A6\u09BE\u09A8\u09CD\u09A4\u09C7,<br>' +
  '<strong>\u0989\u09AA\u09AA\u09B0\u09BF\u099A\u09BE\u09B2\u0995\u09C7\u09B0 \u0995\u09BE\u09B0\u09CD\u09AF\u09BE\u09B2\u09AF\u09BC</strong><br>' +
  REPORT_DEPT + ', ' + REPORT_DISTRICT +
'</td></tr>' +

// FOOTER
'<tr><td style="background-color:#F5F5F5;padding:10px 22px;border-top:1px solid #E0E0E0;">' +
  '<div style="font-size:10px;color:#BDBDBD;line-height:15px;">' +
    '\u09B8\u09CD\u09AC\u09AF\u09BC\u0982\u0995\u09CD\u09B0\u09BF\u09AF\u09BC \u09AA\u09CD\u09B0\u09A4\u09BF\u09AC\u09C7\u09A6\u09A8 \u2022 \u09A4\u09A5\u09CD\u09AF\u09B8\u09C2\u09A4\u09CD\u09B0: DAE ' + REPORT_DISTRICT + ' App_Entry \u09B0\u09C7\u099C\u09BF\u09B8\u09CD\u099F\u09CD\u09B0\u09BF \u2022 \u09AA\u09CD\u09B0\u09A4\u09BF \u09AC\u09C1\u09A7\u09AC\u09BE\u09B0 \u09B8\u0995\u09BE\u09B2 \u09EE:\u09E6\u09E6\u09A4\u09C7 \u09AA\u09CD\u09B0\u09C7\u09B0\u09BF\u09A4' +
  '</div>' +
'</td></tr>' +

'</table>' +
'</td></tr>' +
'</table>' +
'</body></html>';
}

// ── Trigger setup ─────────────────────────────────────────────────────────

/**
 * Creates a recurring WEEKLY trigger: every Wednesday at ~08:00 BDT.
 * Run ONCE from the Apps Script editor.
 * Pre-req: Project Settings → Time zone must be set to "Asia/Dhaka".
 */
function setupWeeklyTrigger() {
  ScriptApp.getProjectTriggers().forEach(function(t) {
    if (t.getHandlerFunction() === 'sendWeeklyReport') {
      ScriptApp.deleteTrigger(t);
    }
  });
  ScriptApp.newTrigger('sendWeeklyReport')
    .timeBased()
    .onWeekDay(ScriptApp.WeekDay.WEDNESDAY)
    .atHour(8)
    .nearMinute(0)
    .create();
  Logger.log('Weekly trigger set: every Wednesday ~08:00 BDT.');
}

/**
 * Queues a ONE-TIME send for Thu 21 Aug 2026 at 08:00 BDT (02:00 UTC).
 * Run ONCE from the Apps Script editor.
 * After firing the trigger self-destructs via sendWeeklyReportAndCleanup_.
 */
function setupOnceOffTrigger() {
  ScriptApp.getProjectTriggers().forEach(function(t) {
    if (t.getHandlerFunction() === 'sendWeeklyReportAndCleanup_') {
      ScriptApp.deleteTrigger(t);
    }
  });
  // Thu 21 Aug 2026 08:00 BDT = 02:00 UTC
  ScriptApp.newTrigger('sendWeeklyReportAndCleanup_')
    .timeBased()
    .at(new Date('2026-08-21T02:00:00Z'))
    .create();
  Logger.log('One-off trigger set: Thu 21 Aug 2026 08:00 BDT.');
}

/** Fires once (Thu 21 Aug), sends report, then self-destructs. */
function sendWeeklyReportAndCleanup_() {
  sendWeeklyReport();
  ScriptApp.getProjectTriggers().forEach(function(t) {
    if (t.getHandlerFunction() === 'sendWeeklyReportAndCleanup_') {
      ScriptApp.deleteTrigger(t);
    }
  });
  Logger.log('One-off trigger self-cleaned after firing.');
}
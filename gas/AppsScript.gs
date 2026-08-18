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

/**
 * ============================================================================
 * DYNAMIC WEEKLY REPORT
 * ============================================================================
 * Replaces the old manual process (someone opens the workbook, hand-copies
 * current totals into a static HTML email, uploads a fresh .xlsx export)
 * with a single function that reads live data straight from this workbook's
 * three real sources every time it runs, and emails a freshly-generated
 * report -- so the numbers are never more than a few minutes stale and no
 * one has to remember to update anything by hand.
 *
 * This workbook has THREE genuinely different data sources, verified by
 * inspecting the live sheet directly rather than guessing at column names:
 *
 *   1. App_Entry -- this app's own live submissions (one row per submission,
 *      already parsed by the existing readAllRows_() below). This is the
 *      only source with real-time GPS, photos, NDVI, and officer activity.
 *
 *   2. ministry_report -- a SEPARATE, manually-maintained government-format
 *      sheet. Its own header text (row 1-3) states it must be emailed to
 *      admonitoring@dae.gov.bd / ddimplement@dae.gov.bd (DAE) and
 *      E-mail-input2@moa.gov.bd / moa.input2@gmail.com (Ministry). Its rows
 *      are grouped by farmer within a location (not one-row-per-submission
 *      like App_Entry), so it's treated as a totals-only source here, not
 *      broken down by upazila.
 *
 *   3. "17 column report" -- the official 17-column government format, with
 *      clean per-row উপজেলা/ইউনিয়ন/গ্রাম columns, so upazila-wise breakdowns
 *      come from here.
 *
 * These two government sheets are NOT simply re-derived from App_Entry on
 * the fly -- they're read directly, live, exactly as this workbook actually
 * stores them, since that's the authoritative record for what's already
 * been officially reported.
 *
 * SETUP (one-time, run manually from the Apps Script editor):
 *   1. Run sendWeeklyReportTest() first -- sends the report to YOU ONLY
 *      (Session.getActiveUser().getEmail()), so you can check formatting
 *      and numbers before anything goes near a real ministry inbox.
 *   2. Once it looks right, review/edit WEEKLY_REPORT_RECIPIENTS below.
 *      It defaults to a single safe internal address, NOT the ministry
 *      addresses printed in the ministry_report sheet itself -- add those
 *      deliberately once you're confident, not as a default.
 *   3. Run createWeeklyReportTrigger() once to schedule the real weekly
 *      send (Wednesdays, 8:00 AM). Re-running it is safe -- it removes any
 *      previous trigger for this function first, so you never end up with
 *      duplicates silently sending the report twice.
 */

// Deliberately NOT the ministry addresses from the sheet's own instructions
// -- add those here yourself once a test run has been verified. Keeping
// this a plain array (not reading from the sheet) means a typo in the
// workbook can never accidentally redirect an official report.
var WEEKLY_REPORT_RECIPIENTS = ['ddaekurigram@gmail.com'];

var MINISTRY_REPORT_SHEET_NAME = 'ministry_report';
var SEVENTEEN_COL_SHEET_NAME = '17 column report';
var WEEKLY_SNAPSHOT_KEY = 'WEEKLY_REPORT_LAST_SNAPSHOT';

/** Bengali-digit, comma-grouped number formatting, e.g. 15412 -> "১৫,৪১২". */
function toBnNum_(n) {
  var num = Number(n);
  if (isNaN(num)) num = 0;
  var s = String(Math.round(num));
  var neg = s.charAt(0) === '-';
  if (neg) s = s.slice(1);
  var withCommas = s.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  var digitMap = { '0': '০', '1': '১', '2': '২', '3': '৩', '4': '৪', '5': '৫', '6': '৬', '7': '৭', '8': '৮', '9': '৯' };
  var bn = withCommas.replace(/[0-9]/g, function (d) { return digitMap[d]; });
  return (neg ? '-' : '') + bn;
}

/** Bengali date, e.g. "১৭ আগস্ট, ২০২৬". */
function toBnDate_(date) {
  var months = ['জানুয়ারি', 'ফেব্রুয়ারি', 'মার্চ', 'এপ্রিল', 'মে', 'জুন', 'জুলাই', 'আগস্ট', 'সেপ্টেম্বর', 'অক্টোবর', 'নভেম্বর', 'ডিসেম্বর'];
  return toBnNum_(date.getDate()) + ' ' + months[date.getMonth()] + ', ' + toBnNum_(date.getFullYear());
}

/**
 * Scans the first 10 rows of a sheet for the one that contains every string
 * in mustContainAll, rather than assuming the header sits at a fixed row
 * number -- both government sheets have a few title/instruction rows above
 * their real header, and this way an extra row inserted later up top can't
 * silently break report generation.
 */
function findHeaderRow_(sheet, mustContainAll) {
  var lastRow = sheet.getLastRow();
  var lastCol = sheet.getLastColumn();
  var maxScan = Math.min(lastRow, 10);
  if (maxScan < 1 || lastCol < 1) return null;
  var values = sheet.getRange(1, 1, maxScan, lastCol).getValues();
  for (var r = 0; r < values.length; r++) {
    var rowText = values[r].join('|');
    var allFound = mustContainAll.every(function (needle) { return rowText.indexOf(needle) !== -1; });
    if (allFound) return { rowIndex: r + 1, headers: values[r] };
  }
  return null;
}

/**
 * Both government sheets have a decorative row of plain sequential numbers
 * (১,২,৩.../1,2,3...) immediately under their real header -- detected and
 * skipped here so it's never miscounted as a data row.
 */
function readSheetDataRows_(sheet, headerInfo) {
  var lastRow = sheet.getLastRow();
  var lastCol = sheet.getLastColumn();
  var startRow = headerInfo.rowIndex + 1;
  if (startRow <= lastRow) {
    var probe = sheet.getRange(startRow, 1, 1, Math.min(5, lastCol)).getValues()[0];
    var looksSequential = probe.length > 1 && Number(probe[0]) === 1 && Number(probe[1]) === 2;
    if (looksSequential) startRow++;
  }
  if (startRow > lastRow) return [];
  return sheet.getRange(startRow, 1, lastRow - startRow + 1, lastCol).getValues();
}

function computeMinistryReportStats_() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getSheetByName(MINISTRY_REPORT_SHEET_NAME);
  if (!sheet) return { available: false };
  var headerInfo = findHeaderRow_(sheet, ['ক্রঃ নং', 'রোপণকৃত বৃক্ষের সংখ্যা']);
  if (!headerInfo) return { available: false };
  var idx = {};
  headerInfo.headers.forEach(function (h, i) { idx[String(h).trim()] = i; });
  var qtyCol = idx['রোপণকৃত বৃক্ষের সংখ্যা'];
  var rows = readSheetDataRows_(sheet, headerInfo);
  var totalEntries = 0, totalTrees = 0;
  rows.forEach(function (r) {
    if (!r.join('')) return;
    totalEntries++;
    totalTrees += Number(r[qtyCol]) || 0;
  });
  return { available: true, totalEntries: totalEntries, totalTrees: totalTrees };
}

function compute17ColumnReportStats_() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getSheetByName(SEVENTEEN_COL_SHEET_NAME);
  if (!sheet) return { available: false };
  var headerInfo = findHeaderRow_(sheet, ['ক্র. নং', 'উপজেলা']);
  if (!headerInfo) return { available: false };
  var idx = {};
  headerInfo.headers.forEach(function (h, i) { idx[String(h).trim()] = i; });
  var qtyCol = idx['রোপণকৃত বৃক্ষের চারার প্রজাতিভিত্তিক সংখ্যা'];
  var upazilaCol = idx['উপজেলা'];
  var rows = readSheetDataRows_(sheet, headerInfo);
  var totalEntries = 0, totalTrees = 0;
  var byUpazila = {};
  rows.forEach(function (r) {
    if (!r.join('')) return;
    totalEntries++;
    var qty = Number(r[qtyCol]) || 0;
    totalTrees += qty;
    var upz = String(r[upazilaCol] || 'অজানা').trim();
    if (!byUpazila[upz]) byUpazila[upz] = { entries: 0, trees: 0 };
    byUpazila[upz].entries++;
    byUpazila[upz].trees += qty;
  });
  return { available: true, totalEntries: totalEntries, totalTrees: totalTrees, byUpazila: byUpazila };
}

/** Live stats from the app's own data, reusing the existing readAllRows_(). */
function computeAppEntryStats_() {
  var rows = readAllRows_();
  var totalTrees = 0;
  var byUpazila = {};
  var byCategory = {};
  var bySpecies = {};
  var officerSet = {};
  var now = new Date();
  var sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
  var entriesThisWeek = 0, treesThisWeek = 0;

  rows.forEach(function (r) {
    var qty = (r.seedlings || []).reduce(function (sum, s) { return sum + (Number(s.quantity) || 0); }, 0);
    totalTrees += qty;

    var upz = r.upazila || 'অজানা';
    if (!byUpazila[upz]) byUpazila[upz] = { entries: 0, trees: 0 };
    byUpazila[upz].entries++;
    byUpazila[upz].trees += qty;

    (r.seedlings || []).forEach(function (s) {
      var cat = s.category || 'অন্যান্য';
      byCategory[cat] = (byCategory[cat] || 0) + (Number(s.quantity) || 0);
      var sp = s.speciesName || 'অজানা';
      bySpecies[sp] = (bySpecies[sp] || 0) + (Number(s.quantity) || 0);
    });

    if (r.saaoName) officerSet[r.saaoName] = true;
    if (r.officerName) officerSet[r.officerName] = true;

    var submittedAt = r.submittedAt ? new Date(r.submittedAt) : null;
    if (submittedAt && !isNaN(submittedAt.getTime()) && submittedAt >= sevenDaysAgo) {
      entriesThisWeek++;
      treesThisWeek += qty;
    }
  });

  return {
    totalEntries: rows.length, totalTrees: totalTrees,
    byUpazila: byUpazila, byCategory: byCategory, bySpecies: bySpecies,
    officerCount: Object.keys(officerSet).length,
    entriesThisWeek: entriesThisWeek, treesThisWeek: treesThisWeek
  };
}

function getLastWeeklySnapshot_() {
  var raw = PropertiesService.getScriptProperties().getProperty(WEEKLY_SNAPSHOT_KEY);
  if (!raw) return null;
  try { return JSON.parse(raw); } catch (e) { return null; }
}

function saveWeeklySnapshot_(snapshot) {
  PropertiesService.getScriptProperties().setProperty(WEEKLY_SNAPSHOT_KEY, JSON.stringify(snapshot));
}

/** "+X" / "-X" / "পরিবর্তন নেই" delta badge text against last week's snapshot. */
function deltaText_(current, previous) {
  if (previous === null || previous === undefined) return 'নতুন হিসাব শুরু';
  var diff = current - previous;
  if (diff === 0) return 'গত সপ্তাহের সমান';
  return (diff > 0 ? '▲ +' : '▼ ') + toBnNum_(Math.abs(diff)) + ' গত সপ্তাহ থেকে';
}

function topEntries_(obj, n) {
  return Object.keys(obj)
    .map(function (k) { return { name: k, value: typeof obj[k] === 'object' ? obj[k].trees : obj[k] }; })
    .sort(function (a, b) { return b.value - a.value; })
    .slice(0, n);
}

/**
 * Exports this bound spreadsheet as an .xlsx Blob for email attachment.
 * SpreadsheetApp has no direct "export as blob" call, so this fetches the
 * standard Sheets export URL with the script's own OAuth token.
 */
function exportSpreadsheetAsXlsxBlob_() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var url = 'https://docs.google.com/spreadsheets/d/' + ss.getId() + '/export?format=xlsx';
  var response = UrlFetchApp.fetch(url, {
    headers: { Authorization: 'Bearer ' + ScriptApp.getOAuthToken() }
  });
  var fileName = 'Tree_Plantation_Reporting_Workbook_' +
    Utilities.formatDate(new Date(), Session.getScriptTimeZone(), 'yyyy-MM-dd') + '.xlsx';
  return response.getBlob().setName(fileName);
}

/**
 * Builds the branded HTML email. Table-based layout (not flexbox/grid) is
 * deliberate -- this is the layout style that survives Gmail/Outlook's
 * aggressive CSS stripping, matching the design already proven in the
 * earlier hand-built weekly report.
 */
function buildWeeklyReportHtml_(ctx) {
  var p = [];
  p.push('<!DOCTYPE html><html lang="bn"><head><meta charset="UTF-8">');
  p.push('<meta name="viewport" content="width=device-width, initial-scale=1.0">');
  p.push('<title>সাপ্তাহিক বৃক্ষরোপণ অগ্রগতি প্রতিবেদন</title></head>');
  p.push('<body style="margin:0;padding:0;background-color:#EEF2ED;font-family:\'Noto Sans Bengali\',\'Segoe UI\',Arial,sans-serif;">');
  p.push('<div style="display:none;max-height:0;overflow:hidden;opacity:0;">');
  p.push('কুড়িগ্রাম জেলায় সরকারি প্রতিবেদনে এ পর্যন্ত ' + toBnNum_(ctx.ministry.totalEntries + ctx.seventeenCol.totalEntries) +
    'টি এন্ট্রিতে ' + toBnNum_(ctx.ministry.totalTrees + ctx.seventeenCol.totalTrees) + 'টি বৃক্ষ রোপণ সম্পন্ন — সম্পূর্ণ বিবরণ ভিতরে।</div>');

  p.push('<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:#EEF2ED;padding:24px 0;"><tr><td align="center">');
  p.push('<table role="presentation" width="640" cellpadding="0" cellspacing="0" style="background-color:#FFFFFF;border-radius:10px;overflow:hidden;box-shadow:0 1px 4px rgba(0,0,0,0.08);">');

  // Header
  p.push('<tr><td style="background-color:#1B5E20;padding:28px 32px;"><table role="presentation" width="100%" cellpadding="0" cellspacing="0">');
  p.push('<tr><td style="font-size:12px;letter-spacing:1px;color:#C8E6C9;text-transform:uppercase;padding-bottom:6px;">কৃষি সম্প্রসারণ অধিদপ্তর &nbsp;•&nbsp; কুড়িগ্রাম জেলা</td></tr>');
  p.push('<tr><td style="font-size:22px;line-height:30px;font-weight:700;color:#FFFFFF;">সাপ্তাহিক বৃক্ষরোপণ কর্মসূচির অগ্রগতি প্রতিবেদন</td></tr>');
  p.push('<tr><td style="font-size:13px;color:#E8F5E9;padding-top:8px;">৫ বছরে ২৫ কোটি বৃক্ষরোপণ কর্মসূচি &nbsp;|&nbsp; প্রতিবেদনের তারিখ: <strong>' + toBnDate_(ctx.now) + '</strong></td></tr>');
  p.push('</table></td></tr>');

  // Salutation
  p.push('<tr><td style="padding:28px 32px 4px 32px;font-size:14px;line-height:22px;color:#212121;">মহোদয়,<br>শুভেচ্ছা নিবেন। কৃষি সম্প্রসারণ অধিদপ্তর ও কৃষি মন্ত্রণালয়ের নিয়মিত নির্দেশনার আলোকে কুড়িগ্রাম জেলার বৃক্ষরোপণ কর্মসূচির হালনাগাদ অগ্রগতি প্রতিবেদন এই মেইলের সাথে সংযুক্ত করা হলো। প্রতিবেদনটি এই কর্মসূচির লাইভ তথ্যভাণ্ডার থেকে স্বয়ংক্রিয়ভাবে তৈরি — সংযুক্ত এক্সেল ফাইলে সম্পূর্ণ workbook রয়েছে।</td></tr>');

  // Official government-format KPI cards (ministry_report + 17 column report)
  p.push('<tr><td style="padding:20px 32px 4px 32px;font-size:13px;font-weight:700;color:#1B5E20;">সরকারি প্রতিবেদন ফরম্যাট (অফিসিয়াল)</td></tr>');
  p.push('<tr><td style="padding:8px 32px 4px 32px;"><table role="presentation" width="100%" cellpadding="0" cellspacing="0"><tr>');
  p.push(kpiCard_('মূল প্রতিবেদন এন্ট্রি', toBnNum_(ctx.ministry.totalEntries) + ' টি', '#2E7D32', deltaText_(ctx.ministry.totalEntries, ctx.prevSnapshot ? ctx.prevSnapshot.ministryEntries : null)));
  p.push('<td width="2%">&nbsp;</td>');
  p.push(kpiCard_('১৭-কলাম প্রতিবেদন এন্ট্রি', toBnNum_(ctx.seventeenCol.totalEntries) + ' টি', '#F9A825', deltaText_(ctx.seventeenCol.totalEntries, ctx.prevSnapshot ? ctx.prevSnapshot.seventeenColEntries : null)));
  p.push('<td width="2%">&nbsp;</td>');
  p.push(kpiCard_('মোট বৃক্ষ রোপণ', toBnNum_(ctx.ministry.totalTrees + ctx.seventeenCol.totalTrees) + ' টি', '#00695C', deltaText_(ctx.ministry.totalTrees + ctx.seventeenCol.totalTrees, ctx.prevSnapshot ? ctx.prevSnapshot.officialTotalTrees : null)));
  p.push('</tr></table></td></tr>');

  // Live app-data KPI cards
  p.push('<tr><td style="padding:20px 32px 4px 32px;font-size:13px;font-weight:700;color:#1B5E20;">বৃক্ষরোপণ ট্র্যাকার অ্যাপ (লাইভ)</td></tr>');
  p.push('<tr><td style="padding:8px 32px 4px 32px;"><table role="presentation" width="100%" cellpadding="0" cellspacing="0"><tr>');
  p.push(kpiCard_('অ্যাপ এন্ট্রি (সর্বমোট)', toBnNum_(ctx.app.totalEntries) + ' টি', '#2E7D32', deltaText_(ctx.app.totalEntries, ctx.prevSnapshot ? ctx.prevSnapshot.appEntries : null)));
  p.push('<td width="2%">&nbsp;</td>');
  p.push(kpiCard_('গত ৭ দিনে নতুন এন্ট্রি', toBnNum_(ctx.app.entriesThisWeek) + ' টি', '#F9A825', toBnNum_(ctx.app.treesThisWeek) + ' টি বৃক্ষ'));
  p.push('<td width="2%">&nbsp;</td>');
  p.push(kpiCard_('সক্রিয় মাঠকর্মী', toBnNum_(ctx.app.officerCount) + ' জন', '#00695C', 'SAAO ও মনিটরিং অফিসার'));
  p.push('</tr></table></td></tr>');

  // Upazila breakdown (from the 17-column report, which has clean columns)
  if (ctx.seventeenCol.available) {
    var upazilaRows = Object.keys(ctx.seventeenCol.byUpazila).sort(function (a, b) {
      return ctx.seventeenCol.byUpazila[b].trees - ctx.seventeenCol.byUpazila[a].trees;
    });
    p.push('<tr><td style="padding:24px 32px 8px 32px;font-size:13px;font-weight:700;color:#1B5E20;">উপজেলাভিত্তিক অগ্রগতি (১৭-কলাম প্রতিবেদন)</td></tr>');
    p.push('<tr><td style="padding:4px 32px 12px 32px;"><table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="border-collapse:collapse;font-size:12px;">');
    p.push('<tr style="background-color:#F1F8F2;"><td style="padding:8px 10px;font-weight:700;color:#1B5E20;border-bottom:2px solid #C8E6C9;">উপজেলা</td><td align="right" style="padding:8px 10px;font-weight:700;color:#1B5E20;border-bottom:2px solid #C8E6C9;">এন্ট্রি</td><td align="right" style="padding:8px 10px;font-weight:700;color:#1B5E20;border-bottom:2px solid #C8E6C9;">বৃক্ষ</td></tr>');
    upazilaRows.forEach(function (u, i) {
      var bg = i % 2 === 0 ? '#FFFFFF' : '#FAFDF8';
      p.push('<tr style="background-color:' + bg + ';"><td style="padding:7px 10px;color:#212121;border-bottom:1px solid #EEEEEE;">' + u + '</td><td align="right" style="padding:7px 10px;color:#212121;border-bottom:1px solid #EEEEEE;">' + toBnNum_(ctx.seventeenCol.byUpazila[u].entries) + '</td><td align="right" style="padding:7px 10px;color:#212121;font-weight:600;border-bottom:1px solid #EEEEEE;">' + toBnNum_(ctx.seventeenCol.byUpazila[u].trees) + '</td></tr>');
    });
    p.push('</table></td></tr>');
  }

  // Top species (from live app data)
  var topSpecies = topEntries_(ctx.app.bySpecies, 5);
  if (topSpecies.length) {
    p.push('<tr><td style="padding:8px 32px 8px 32px;font-size:13px;font-weight:700;color:#1B5E20;">শীর্ষ প্রজাতি (অ্যাপ থেকে)</td></tr>');
    p.push('<tr><td style="padding:0 32px 20px 32px;font-size:12px;color:#424242;line-height:20px;">');
    p.push(topSpecies.map(function (s) { return s.name + ' (' + toBnNum_(s.value) + ' টি)'; }).join(' &nbsp;•&nbsp; '));
    p.push('</td></tr>');
  }

  // Footer
  p.push('<tr><td style="padding:20px 32px 28px 32px;border-top:1px solid #EEEEEE;font-size:11px;color:#9E9E9E;line-height:18px;">');
  p.push('এই প্রতিবেদনটি স্বয়ংক্রিয়ভাবে তৈরি হয়েছে — ' + toBnDate_(ctx.now) + ' তারিখে। সম্পূর্ণ workbook সংযুক্ত এক্সেল ফাইলে রয়েছে।<br>');
  p.push('লাইভ ড্যাশবোর্ড: <a href="https://plantation.krishiai.live" style="color:#2E7D32;">plantation.krishiai.live</a></td></tr>');

  p.push('</table></td></tr></table></body></html>');
  return p.join('\n');
}

function kpiCard_(label, value, color, sublabel) {
  return '<td width="32%" align="center" style="background-color:' + color + ';border-radius:8px;padding:16px 8px;">' +
    '<div style="font-size:11px;color:#E8F5E9;font-weight:600;">' + label + '</div>' +
    '<div style="font-size:24px;color:#FFFFFF;font-weight:700;padding-top:4px;">' + value + '</div>' +
    (sublabel ? '<div style="font-size:10px;color:#E8F5E9;padding-top:3px;">' + sublabel + '</div>' : '') +
    '</td>';
}

/**
 * Main entry point -- computes live stats from all three sources, builds
 * the HTML email + fresh .xlsx attachment, sends to WEEKLY_REPORT_RECIPIENTS,
 * and saves this run's totals as next week's comparison snapshot. Safe to
 * run manually any time; only sendWeeklyReportTest() and the Wednesday
 * trigger from createWeeklyReportTrigger() call this in normal operation.
 */
function generateAndSendWeeklyReport(overrideRecipients) {
  var now = new Date();
  var ministry = computeMinistryReportStats_();
  var seventeenCol = compute17ColumnReportStats_();
  var app = computeAppEntryStats_();
  var prevSnapshot = getLastWeeklySnapshot_();

  var ctx = { now: now, ministry: ministry, seventeenCol: seventeenCol, app: app, prevSnapshot: prevSnapshot };
  var html = buildWeeklyReportHtml_(ctx);
  var plainText = 'সাপ্তাহিক বৃক্ষরোপণ অগ্রগতি প্রতিবেদন — ' + toBnDate_(now) +
    '। মূল প্রতিবেদন এন্ট্রি: ' + toBnNum_(ministry.totalEntries) +
    ', ১৭-কলাম প্রতিবেদন এন্ট্রি: ' + toBnNum_(seventeenCol.totalEntries) +
    ', অ্যাপ এন্ট্রি: ' + toBnNum_(app.totalEntries) +
    '। সম্পূর্ণ বিবরণের জন্য HTML সংস্করণ বা সংযুক্ত এক্সেল ফাইল দেখুন।';

  var recipients = overrideRecipients || WEEKLY_REPORT_RECIPIENTS;
  var xlsxBlob = exportSpreadsheetAsXlsxBlob_();

  GmailApp.sendEmail(recipients.join(','), 'সাপ্তাহিক বৃক্ষরোপণ অগ্রগতি প্রতিবেদন — ' + toBnDate_(now), plainText, {
    htmlBody: html,
    attachments: [xlsxBlob],
    name: 'বৃক্ষরোপণ ট্র্যাকার'
  });

  saveWeeklySnapshot_({
    date: now.toISOString(),
    ministryEntries: ministry.totalEntries,
    seventeenColEntries: seventeenCol.totalEntries,
    officialTotalTrees: ministry.totalTrees + seventeenCol.totalTrees,
    appEntries: app.totalEntries
  });

  return { ok: true, sentTo: recipients, ministry: ministry, seventeenCol: seventeenCol, app: app };
}

/**
 * Safe first run -- sends ONLY to the script's own active user, never
 * touching WEEKLY_REPORT_RECIPIENTS. Run this from the Apps Script editor
 * (select this function in the toolbar dropdown, then Run) before ever
 * wiring up the real weekly trigger.
 */
function sendWeeklyReportTest() {
  var me = Session.getActiveUser().getEmail();
  return generateAndSendWeeklyReport([me]);
}

/**
 * One-time setup -- schedules generateAndSendWeeklyReport() for every
 * Wednesday at 8 AM (script timezone). Safe to re-run: it always removes
 * any existing trigger for this function first, so you can never end up
 * with duplicate triggers silently double-sending the report.
 */
function createWeeklyReportTrigger() {
  var triggers = ScriptApp.getProjectTriggers();
  triggers.forEach(function (t) {
    if (t.getHandlerFunction() === 'generateAndSendWeeklyReport') {
      ScriptApp.deleteTrigger(t);
    }
  });
  ScriptApp.newTrigger('generateAndSendWeeklyReport')
    .timeBased()
    .onWeekDay(ScriptApp.WeekDay.WEDNESDAY)
    .atHour(8)
    .create();
  return { ok: true, message: 'Weekly report scheduled for every Wednesday at 8 AM.' };
}
/**
 * Plantation Tracker -> Google Sheet submission endpoint (v2)
 *
 * DEPLOY:
 *   1. Open the ACTUAL editable spreadsheet (not the pubhtml preview link).
 *   2. Extensions > Apps Script. Paste this file. Save.
 *   3. Deploy > New deployment > Web app
 *      - Execute as: Me
 *      - Who has access: Anyone with the link
 *   4. Copy the resulting /exec URL and set it as GAS_WEBHOOK_URL on Vercel.
 *
 * WHAT'S NEW IN v2 (vs the original paste-in script):
 *   - One row per seedling (the app fans out N seedlings from one form
 *     submission into N rows, all sharing the same submissionId).
 *   - Photo embedded INLINE in the cell via =IMAGE(url) formula instead of
 *     a bare URL string, so the photo renders inside the sheet.
 *   - New columns: "সত্যায়ন হ্যাশ" + "ছবি SHA-256" + "সিঙ্কের সময়".
 *     The Auth hash is an HMAC-SHA256 computed by the Vercel proxy using
 *     AUTH_SECRET (which never leaves the server). To verify a row later,
 *     recompute HMAC over the same fields server-side and compare.
 *   - All column headers in Bangla for the on-field officers who read the sheet.
 */

const TARGET_SHEET_NAME = 'App_Entry';          // rename your blank tab to this, or change here
const PHOTO_FOLDER_NAME = 'Plantation_Tracker_Photos';

// All headers in Bangla — matches the language used in the app's UI.
// IMPORTANT: getSheet_() looks up 'ছবি (ইনলাইন)' by name, so if you ever
// rename that header here, also update the lookup a few lines down.
const HEADERS = [
  'জমার সময়', 'অ্যাপ জমা আইডি',
  'বিভাগ', 'জেলা', 'উপজেলা', 'ইউনিয়ন', 'গ্রাম',
  'অবস্থানের ধরন', 'সুনির্দিষ্ট ঠিকানা',
  'অক্ষাংশ', 'দ্রাঘিমাংশ',
  'রোপণের তারিখ',
  'বৃক্ষের প্রজাতি/জাত', 'বৃক্ষের শ্রেণী', 'সংখ্যা',
  'প্রাথমিক NDVI',
  'ছবি (ইনলাইন)', 'ছবি SHA-256',
  'কৃষকের নাম', 'কৃষকের মোবাইল',
  'SAAO-এর নাম', 'SAAO-এর মোবাইল',
  'মনিটরিং অফিসারের নাম', 'মনিটরিং অফিসারের মোবাইল',
  'মন্তব্য',
  'সত্যায়ন হ্যাশ', 'সিঙ্কের সময়'
];

function getSheet_() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  let sheet = ss.getSheetByName(TARGET_SHEET_NAME);
  if (!sheet) sheet = ss.insertSheet(TARGET_SHEET_NAME);

  if (sheet.getLastRow() === 0) {
    // First run: write headers + freeze top row + set column widths.
    sheet.appendRow(HEADERS);
    sheet.setFrozenRows(1);

    // Make the Photo column wide enough to render the inline image nicely.
    const photoColIdx = HEADERS.indexOf('ছবি (ইনলাইন)') + 1;
    if (photoColIdx > 0) sheet.setColumnWidth(photoColIdx, 220);

    sheet.setRowHeight(1, 28);
  } else {
    // Sheet already exists — patch in any new columns added by v2 so old
    // deployments don't break silently. (Idempotent — only touches row 1.)
    const firstRow = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0];
    const existing = firstRow.map(String);
    HEADERS.forEach(function (h, i) {
      if (existing[i] !== String(h)) {
        sheet.getRange(1, i + 1).setValue(h);
      }
    });
    if (sheet.getLastColumn() < HEADERS.length) {
      sheet.getRange(1, HEADERS.length, 1, 1).setValue(HEADERS[HEADERS.length - 1]);
    }
  }
  return sheet;
}

function savePhoto_(base64Data, filenameHint) {
  if (!base64Data) return '';
  let folder;
  const folders = DriveApp.getFoldersByName(PHOTO_FOLDER_NAME);
  folder = folders.hasNext() ? folders.next() : DriveApp.createFolder(PHOTO_FOLDER_NAME);

  // Strip data: prefix if present.
  const matches = base64Data.match(/^data:(image\/\w+);base64,(.*)$/);
  const mimeType = matches ? matches[1] : 'image/jpeg';
  const raw = matches ? matches[2] : base64Data;
  const blob = Utilities.newBlob(
    Utilities.base64Decode(raw),
    mimeType,
    (filenameHint || 'plantation') + '_' + new Date().getTime() + '.jpg'
  );
  const file = folder.createFile(blob);
  file.setSharing(DriveApp.Access.ANYONE_WITH_LINK, DriveApp.Permission.VIEW);
  return file.getUrl();
}

/**
 * doPost — one call per row. The Vercel proxy calls this N times for a
 * submission with N seedlings (sequential, so appendRow ordering is safe).
 */
function doPost(e) {
  try {
    const body = JSON.parse(e.postData.contents);
    const sheet = getSheet_();

    // Persist photo to Drive and capture the URL. We embed it inline using
    // =IMAGE(url) so the picture renders directly in the cell.
    const photoUrl = savePhoto_(body.photoBase64, body.submissionId);
    const photoCellFormula = photoUrl ? '=IMAGE("' + photoUrl + '")' : '';

    sheet.appendRow([
      new Date(),                                  // জমার সময়
      body.submissionId || '',                     // অ্যাপ জমা আইডি
      body.division || '',                         // বিভাগ
      body.district || '',                         // জেলা
      body.upazila || '',                          // উপজেলা
      body.union || '',                            // ইউনিয়ন
      body.village || '',                          // গ্রাম
      body.locationType || '',                     // অবস্থানের ধরন
      body.address || '',                          // সুনির্দিষ্ট ঠিকানা
      body.latitude || '',                         // অক্ষাংশ
      body.longitude || '',                        // দ্রাঘিমাংশ
      body.plantingDate || '',                     // রোপণের তারিখ
      body.speciesName || '',                      // বৃক্ষের প্রজাতি/জাত
      body.category || '',                         // বৃক্ষের শ্রেণী
      body.quantity || '',                         // সংখ্যা
      body.ndvi || '',                             // প্রাথমিক NDVI
      photoCellFormula,                            // ছবি (ইনলাইন) — =IMAGE(url)
      body.photoSha256 || '',                      // ছবি SHA-256 (short)
      body.farmerName || '',                       // কৃষকের নাম
      body.farmerMobile || '',                     // কৃষকের মোবাইল
      body.saaoName || '',                         // SAAO-এর নাম
      body.saaoMobile || '',                       // SAAO-এর মোবাইল
      body.officerName || '',                      // মনিটরিং অফিসারের নাম
      body.officerMobile || '',                    // মনিটরিং অফিসারের মোবাইল
      body.remarks || '',                          // মন্তব্য
      body.authHash || '',                         // সত্যায়ন হ্যাশ
      new Date()                                   // সিঙ্কের সময় (server time)
    ]);

    return ContentService.createTextOutput(JSON.stringify({ ok: true }))
      .setMimeType(ContentService.MimeType.JSON);
  } catch (err) {
    return ContentService.createTextOutput(JSON.stringify({ ok: false, error: err.message }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

function doGet() {
  return ContentService.createTextOutput(
    JSON.stringify({ status: 'Plantation Tracker endpoint v2 is live' })
  ).setMimeType(ContentService.MimeType.JSON);
}

/**
 * ONE-OFF HELPER: convert old v1 photo URL strings to inline =IMAGE() formulas.
 * Run this ONCE from the Apps Script editor (Run → select function → Run)
 * if you have existing v1 rows whose "ছবি (ইনলাইন)" cell contains a plain
 * http://... URL instead of an =IMAGE(...) formula. Safe to run multiple times.
 */
function convertOldPhotoUrlsToImages() {
  const sheet = getSheet_();
  const lastRow = sheet.getLastRow();
  if (lastRow < 2) return;
  const photoCol = HEADERS.indexOf('ছবি (ইনলাইন)') + 1;
  if (photoCol < 1) return;
  const range = sheet.getRange(2, photoCol, lastRow - 1, 1);
  const values = range.getValues();
  for (let i = 0; i < values.length; i++) {
    const v = values[i][0];
    if (typeof v === 'string' && v.indexOf('http') === 0 && v.indexOf('IMAGE(') === -1) {
      values[i][0] = '=IMAGE("' + v + '")';
    }
  }
  range.setValues(values);
}

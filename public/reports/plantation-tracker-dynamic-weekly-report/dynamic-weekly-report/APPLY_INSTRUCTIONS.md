# How to apply: dynamic, professional-grade weekly report

One file changed: `gas/AppsScript.gs`. New branch (the previous one is
already merged into `main`).

## What was investigated first
I don't have write access to your live Google Sheet, but I do have
read-only Google Drive access in this session -- so rather than guessing
at column names from memory, I found and downloaded the actual live
"Tree_Plantation_Reporting_Workbook" and inspected its real structure.
Confirmed:
- `ministry_report` and `"17 column report"` are genuinely separate sheets
  in the same workbook this Apps Script is already bound to
- `ministry_report`'s own header text (rows 1-3) states it must be emailed
  to `admonitoring@dae.gov.bd` / `ddimplement@dae.gov.bd` (DAE) and
  `E-mail-input2@moa.gov.bd` (Ministry) -- a different address than the
  `ddaekurigram@gmail.com` your memory shows reports actually went to
- Cross-checked the aggregation logic in Python against the real live data
  before writing the production JS: 948 ministry_report entries + 1,599
  17-column entries = 2,547 combined official entries, 15,891 combined
  trees -- consistent growth from the 2,275/15,412 baseline in your last
  static report

## Apply

```bash
cd ~/plantation-tracker
git checkout main
git pull origin main
git checkout -b feat/dynamic-weekly-report

mkdir -p ~/tmp_weeklyreport
unzip -o ~/storage/downloads/plantation-tracker-dynamic-weekly-report.zip -d ~/tmp_weeklyreport
cp ~/tmp_weeklyreport/dynamic-weekly-report/gas/AppsScript.gs gas/AppsScript.gs

git add -A
git commit -m "feat: dynamic, professional-grade weekly report -- replaces manual xlsx-upload process"
git push -u origin feat/dynamic-weekly-report
```

Then open a PR the same way as before:
https://github.com/moniruzjaman/plantation-tracker/compare/main...feat/dynamic-weekly-report

Note: `gas/` isn't part of the Vite build or deployed by Vercel (see the
file's own header comment) -- merging this PR just keeps your repo's copy
of the script in sync with what you paste into the Apps Script editor. It
won't trigger a Vercel preview since no app code changed.

## REQUIRED manual step -- this is Apps Script, not a Vercel deploy
Copy the new `gas/AppsScript.gs` content into the actual Apps Script
project bound to `Tree_Plantation_Reporting_Workbook`:
1. Open the sheet -> Extensions -> Apps Script
2. Replace the existing script content with the new file's content
3. Save, then Deploy -> Manage deployments -> Edit -> New version
   (only needed if doGet/doPost changed -- they didn't here, so this step
   is likely unnecessary, but doesn't hurt)

## Test BEFORE the real send -- do this first
In the Apps Script editor, select `sendWeeklyReportTest` from the function
dropdown and click Run. This sends the report to **your own email only**
(`Session.getActiveUser().getEmail()`), completely independent of
`WEEKLY_REPORT_RECIPIENTS`. Check that:
- The numbers match what you'd expect
- The HTML renders correctly in Gmail
- The attached .xlsx opens and looks right

## Once you're happy with the test
1. Review `WEEKLY_REPORT_RECIPIENTS` near the top of the new code block --
   it currently defaults to `['ddaekurigram@gmail.com']` only. Add the
   ministry addresses yourself once you're confident, e.g.:
   ```js
   var WEEKLY_REPORT_RECIPIENTS = [
     'ddaekurigram@gmail.com',
     'admonitoring@dae.gov.bd',
     'ddimplement@dae.gov.bd',
     'E-mail-input2@moa.gov.bd'
   ];
   ```
2. Run `createWeeklyReportTrigger` once from the function dropdown -- this
   schedules `generateAndSendWeeklyReport` for every Wednesday at 8 AM.
   It's idempotent (always clears any prior trigger for this function
   first), so re-running it is always safe and can't create duplicates.

## What's dynamic now that wasn't before
- **Live data, every run** -- reads `App_Entry`, `ministry_report`, and
  `"17 column report"` directly, no manual xlsx upload ever again
- **Week-over-week deltas** -- `▲ +42 গত সপ্তাহ থেকে` badges, persisted via
  `PropertiesService` so each run remembers the last one's totals
- **Upazila-wise breakdown table** -- computed live from the 17-column
  report's clean per-row columns
- **Top species** -- computed live from the app's own submissions
- **Fresh .xlsx attachment** -- exported live from the workbook on every
  send, not a stale manually-uploaded file
- **Resilient header detection** -- scans for the real header row by
  content rather than assuming a fixed row number, so an inserted title
  row above it can't silently break the report
- Same professional, email-client-safe (table-based, not flexbox) HTML
  design as your original hand-built report, just fully parameterized

## Verified before packaging
- `gas/AppsScript.gs` syntax-checked clean via Node (`new Function(...)`)
- Core aggregation logic (header detection, row reading, sums, upazila
  grouping) replicated in Python and run against the actual downloaded
  live workbook -- numbers came out correct and consistent with your
  known baseline
- Not covered by `check.yml`/`vitest` (`gas/` isn't part of the Vite/TS
  build), so the live-data cross-check above was the strongest
  verification available in this environment -- the in-app
  `sendWeeklyReportTest()` step is the real final check

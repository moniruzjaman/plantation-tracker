# Enhance Dashboard & Map filters; fix Profile tab visibility

## What changed

### Dashboard tab
- **Filter panel moved to the top** (above the KPI cards), so users see filter
  state before any data summary. Previously the filter sat in the middle of the
  page between KPIs and charts.
- **Added date range filter** (`dashDateFrom` / `dashDateTo`) — the Dashboard
  previously only filtered on region / district / upazila / source type.
- Added **Reset** and **Apply** buttons + a live filter-summary line that
  shows the active filter values and the resulting entry count.
- Added the missing **১৭ কলাম ছক (17-column government format)** export
  button — the Dashboard previously had Gov Excel, plain Excel, KoBo XLS,
  and CSV, but the 17-column export was only available in Profile/Admin.

### Map tab
- **Rebuilt the filter panel into a 3-column grid** mirroring the Dashboard
  layout: date range, source type, region, district, upazila — with Apply and
  Reset buttons.
- Added the previously-missing **source type**, **date-from**, and **date-to**
  filters (`mapSourceType`, `mapDateFrom`, `mapDateTo`).
- Added a **dedicated Excel/CSV export row** with 5 buttons:
  - মন্ত্রণালয় ছক (Ministry 9-col Excel)
  - ১৭ কলাম ছক (17-col Excel)
  - সাধারণ Excel (plain Excel)
  - KoBo XLS
  - CSV

  The Map tab previously had **no Excel/CSV export buttons at all** — exports
  were only possible from the Dashboard tab. All five buttons pass the `'map'`
  prefix through `getGovReportSource_('map')` → `getMapEntries()`, so the
  exported data matches exactly what's currently visible on the map (after
  the active filters are applied).

### Profile tab (storedData → আমার এন্ট্রি)
- **Rewrote `getMySubmissionsBase()`** — this is the key bug fix.
- Previously it filtered `getSubmissions()` (localStorage only) by
  `farmerMobile === profile.mobile`. This silently hid two categories of
  entries that belong to the logged-in user:
  1. **Entries where the user is the monitoring officer or SAAO** (matched
     by `officerMobile` / `saaoMobile`), not the farmer.
  2. **Entries already synced to the national `App_Entry` sheet** from
     another device — these would appear in the Dashboard/Map (which merge
     `_nationalEntries` + local) but not in the user's own Profile tab.
- The new implementation merges `_nationalEntries` + `getSubmissions()`,
  de-duplicates by `submissionId`, and matches on **any** of
  `farmerMobile / saaoMobile / officerMobile / caretakerMobile === profile.mobile`.
- `renderMyTab()` now triggers `fetchNationalEntries()` on first open if the
  national cache isn't loaded yet, so the Profile tab populates correctly
  even on first visit.
- Each entry card now displays a **জাতীয় / লোকাল** source badge so the user
  can tell at a glance which entries are still device-local vs. already
  synced. The 🗑️ delete button is hidden for national entries (only admins
  can delete those).

## Test evidence

Verified with Playwright headless Chromium — **33 assertions, 0 failures,
0 page errors**. Test script and screenshots are included in the worklog.

Console output (relevant excerpt):
```
=== Dashboard tab ===
  ✅ Dashboard filter panel exists at top
  ✅ Filter panel sits above KPI cards — filter top=437px, KPI top=661px
  ✅ Filter summary updates on date change
  ✅ Reset clears date filter
  ✅ Dashboard export button "১৭ কলাম" wired — export17ColGovExcel('dash')
  ✅ ... (all 5 export buttons verified)

=== Map tab ===
  ✅ Map date range filter exists
  ✅ Map source type filter exists
  ✅ Map filter summary updates on source change
  ✅ Map export button "17-col Excel" wired with 'map' prefix — export17ColGovExcel('map')
  ✅ ... (all 5 export buttons verified)
  ✅ Leaflet map container has dimensions — 1096x550

=== Profile tab ===
  ✅ Profile card shows injected user name
  ✅ Profile list shows farmer-mobile match (রফিক)
  ✅ Profile list also shows officer-mobile match (করিম) — multi-mobile-field fix verified
  ✅ Local entry has লোকাল source badge

=== Page errors ===
  (none — all clean)
```

The only console warnings are from Google Sign-In (placeholder client ID) and
the expected "National App_Entry fetch failed" message when the GAS backend
isn't reachable (the app's documented graceful-fallback path).

## Files changed

- `public/legacy-nursery.html` — 241 insertions, 29 deletions (+211 net)

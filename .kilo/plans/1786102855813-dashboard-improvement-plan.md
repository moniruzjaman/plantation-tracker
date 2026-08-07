# Dashboard Improvement Plan — Plantation Tracker PWA

## Decision: Domain
**Plantation Tracker** (বৃক্ষ রোপণ). All requested features map to the existing data model in `public/plantation.html`.

## Goal
Add daily/weekly entry trends, upazila performance ranking, SAAO performance, and officer performance to the dashboard without breaking existing functionality.

## Constraints
- Edit only `public/plantation.html` (vanilla JS, additive changes).
- Use existing Chart.js 4.4.7 CDN; no new dependencies.
- Reuse `getDashEntries()` for filtering; existing exports and table views unchanged.
- Graceful degradation if Chart.js is unavailable (follow existing pattern at line 3033).

## Implementation Steps

### Step 1: Add HTML for new chart canvases
Insert after line 531 (end of existing charts row 2):
- Row 3 (2 cols): `chartUpazila` + `chartSaao` canvases
- Row 4 (full width): `chartOfficer` canvas
- Row 5 (full width): `chartTrend` canvas + period toggle buttons (Daily / Weekly / Monthly)

### Step 2: Add trend period state
Add `window.dashTrendPeriod = 'daily'` near other dashboard globals.

### Step 3: Create `renderTrendChart()`
- Call `getDashEntries()`.
- Use `plantingDate` with fallback to `submittedAt` (strip time, keep YYYY-MM-DD).
- Bucket logic:
  - `daily`: group by YYYY-MM-DD, show last 30 days (or filtered range)
  - `weekly`: group by ISO week (YYYY-Www) or 7-day rolling windows
  - `monthly`: group by YYYY-MM
- Two datasets: entries count, total seedlings (`countSeedlings(s).fruit + forest + medicinal`).
- Line chart with `tension: 0.3`, fill false.
- Destroy previous `chartTrend` before creating new one.

### Step 4: Create `renderUpazilaChart()`
- Call `getDashEntries()`.
- Aggregate by `s.upazila` (skip empty/undefined).
- Rank by total seedlings, take top 15.
- Horizontal bar chart (`indexAxis: 'y'`).
- `onClick` callback: set `dashUpazila` dropdown value, call `renderDashboard()`.

### Step 5: Create `renderSaaoChart()`
- Call `getDashEntries()`.
- Aggregate by `s.saaoName` (skip empty/undefined).
- Rank by total entries (or seedlings — recommend entries for simplicity), take top 10.
- Horizontal bar chart.
- Label empty/unknown as "অজ্ঞাত" if needed, or exclude.

### Step 6: Create `renderOfficerChart()`
- Call `getDashEntries()`.
- Aggregate by `s.officerName` (skip empty/undefined).
- Rank by total entries, take top 10.
- Horizontal bar chart.

### Step 7: Wire into `renderDashboard()`
After line 3076 (after existing Chart.js renders), add:
```js
renderTrendChart();
renderUpazilaChart();
renderSaaoChart();
renderOfficerChart();
```

### Step 8: Period toggle handlers
Add `onclick` handlers to Daily/Weekly/Monthly buttons that set `window.dashTrendPeriod` and call `renderDashboard()`.

## Data Edge Cases
- **Missing dates:** Use `plantingDate || submittedAt.slice(0,10) || ''`. Skip entries with no date in trend chart.
- **Empty SAAO/officer names:** Exclude from charts to avoid "অজ্ঞাত" clutter.
- **National entries:** GAS `listEntries_` (gas/AppsScript.gs line 618) returns `saaoName`, `officerName`, `plantingDate`, `submittedAt` — all required fields are present.
- **Offline mode:** Charts render from `localStorage` via `getDashEntries()`; no network needed.

## Validation
1. Open dashboard with existing filters; verify all 4 original charts still render.
2. Verify 4 new charts render with sample data.
3. Change date range; verify trend chart buckets update.
4. Click Daily/Weekly/Monthly; verify trend chart re-renders.
5. Click an upazila bar; verify upazila filter applies and all views (KPIs, charts, table) update.
6. Verify Excel/CSV export buttons still work (they use `getFiltered()`, unchanged).
7. Verify offline mode: disable network, open dashboard, confirm new charts render from localStorage.

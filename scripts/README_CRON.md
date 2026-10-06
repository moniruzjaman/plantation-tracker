# Weekly Plantation Report — Wednesday Cron Setup

This document explains how to register the weekly Wednesday report generator
as a recurring scheduled task in various environments, AND how to enable the
**real-time "Email Report" button** on the dashboard tab.

---

## 0. Quick summary — what gets built

| Capability                          | Where it lives                                                   |
|-------------------------------------|------------------------------------------------------------------|
| **Dynamic report generator**        | `scripts/generate_weekly_report.py`                              |
| **Cron wrapper script**             | `scripts/cron_weekly_report.sh`                                  |
| **Vercel serverless endpoint**      | `api/regenerate-weekly-report.ts`                                |
| **Local dev API server**            | `scripts/local_api_server.mjs`                                   |
| **Dashboard "Email Report" button** | inside `public/legacy/plantation.html` (officialReportCard)       |
| **Vercel cron schedule**            | `vercel.json` → `crons[0].schedule = "0 3 * * 3"` (= Wed 09:00 Asia/Dhaka) |

The dashboard button calls `POST /api/regenerate-weekly-report` which spawns
the Python generator with `--gas-url=$GAS_WEBHOOK_URL` (real-time data) and
`--email` (SMTP send). The cron does the same thing automatically every
Wednesday at 09:00 Asia/Dhaka.

---

## 1. What runs

**Script**: `/home/z/my-project/scripts/cron_weekly_report.sh`
**Generator**: `/home/z/my-project/scripts/generate_weekly_report.py`

**Schedule**: **Every Wednesday at 09:00 Asia/Dhaka** (UTC+06:00, Bangladesh
has no DST).

| Format        | Expression       | Timezone       |
|---------------|------------------|----------------|
| Standard cron | `0 9 * * 3`      | `Asia/Dhaka`   |
| UTC cron      | `0 3 * * 3`      | `UTC`          |
| Quartz        | `0 0 9 ? * WED`  | `Asia/Dhaka`   |
| Node-cron     | `0 9 * * 3`     | `Asia/Dhaka`   |
| iCal/RRULE    | `FREQ=WEEKLY;BYDAY=WE;BYHOUR=9;BYMINUTE=0` | — |

`0 9 * * 3` = at minute 0, hour 9, every day-of-month, every month, on day 3
of week (Sunday=0, Monday=1, Tuesday=2, **Wednesday=3**, Thursday=4…).

---

## 2. What it produces

Every Wednesday at 09:00 Asia/Dhaka, the cron:

1. **Auto-detects** the newest `.xlsx` file in `/home/z/my-project/upload/`.
   (Override with `REPORT_SOURCE_PATH`, `REPORT_LIVE_URL`, or
   `REPORT_GAS_URL` env vars.)
2. **Generates** these files in
   `/home/z/my-project/plantation-tracker/public/reports/`:
   - `weekly-report.html` — canonical HTML (always the latest)
   - `weekly-report.xlsx` — canonical Excel (always the latest)
   - `weekly-report-snapshot.json` — canonical JSON snapshot (always the latest)
   - `weekly-report-<YYYY-MM-DD>.html` — date-tagged archive
   - `weekly-report-<YYYY-MM-DD>.xlsx` — date-tagged archive
   - `weekly-report-<YYYY-MM-DD>-snapshot.json` — date-tagged archive
   - `weekly-report-manifest.json` — append-only history (last 52 runs)
3. **Sends** the report via SMTP if `SMTP_*` env vars are present.
4. **Logs** to `/home/z/my-project/cron_weekly_report.log`.

Because the dashboard tab in `plantation.html` fetches
`/reports/weekly-report-snapshot.json` on every render, the dashboard's
"Latest Official Weekly Report" card **automatically picks up** the new
numbers the moment the cron finishes — no manual update needed.

---

## 3. Email delivery (optional)

To have the cron email the report automatically, set these env vars:

```bash
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-account@gmail.com
SMTP_PASS=your-app-password      # Gmail: use App Password, not account password
SMTP_FROM=your-account@gmail.com
SMTP_TO=dd-kurigram@dae.gov.bd,assistant@dae.gov.bd
```

For Gmail, generate an App Password at
<https://myaccount.google.com/apppasswords> (regular passwords are
rejected since Google removed Less-Secure-Apps access).

For other providers (Outlook, Yahoo, Zoho Mail, your own SMTP relay):
just adjust `SMTP_HOST`/`SMTP_PORT`. TLS is attempted first; if it fails
the script falls back to plain SMTP on the same port.

---

## 4. Setup — pick your environment

### 4a. Linux / macOS — system crontab

```bash
# Edit the crontab for whichever user owns /home/z/my-project
crontab -e
```

Add this line (note: `TZ=Asia/Dhaka` per-entry is supported on most modern
crond implementations including vixie-cron and cronie):

```cron
# Weekly plantation report — every Wednesday 09:00 Asia/Dhaka
0 9 * * 3 TZ=Asia/Dhaka /home/z/my-project/scripts/cron_weekly_report.sh >> /home/z/my-project/cron_weekly_report.log 2>&1
```

If your `crond` doesn't support per-entry `TZ`, run it in UTC instead
(Wednesday 09:00 Asia/Dhaka = Wednesday 03:00 UTC):

```cron
0 3 * * 3 /home/z/my-project/scripts/cron_weekly_report.sh >> /home/z/my-project/cron_weekly_report.log 2>&1
```

For SMTP email, put the env vars in a sourced file and reference them:

```cron
# /home/z/my-project/.weekly-report.env  (chmod 600)
#   SMTP_HOST=smtp.gmail.com
#   SMTP_PORT=587
#   SMTP_USER=you@gmail.com
#   SMTP_PASS=xxxx xxxx xxxx xxxx
#   SMTP_FROM=you@gmail.com
#   SMTP_TO=dd-kurigram@dae.gov.bd

# crontab
0 9 * * 3 TZ=Asia/Dhaka bash -c 'set -a; source /home/z/my-project/.weekly-report.env; set +a; /home/z/my-project/scripts/cron_weekly_report.sh >> /home/z/my-project/cron_weekly_report.log 2>&1'
```

### 4b. Vercel Cron (recommended if the app is on Vercel)

Vercel Cron runs the cron in the same environment as your Vercel functions,
so it can reach `/api/gas-sync` directly. Add to `vercel.json`:

```json
{
  "crons": [
    {
      "path": "/api/regenerate-weekly-report",
      "schedule": "0 3 * * 3"
    }
  ]
}
```

(Note: Vercel Cron uses **UTC** by default. `0 3 * * 3` = Wednesday 03:00 UTC
= Wednesday 09:00 Asia/Dhaka.)

Then create `/api/regenerate-weekly-report.ts` as a serverless function that
spawns the Python generator (or re-implements the generation in TypeScript).
Set the `SMTP_*` env vars in Vercel → Settings → Environment Variables.

### 4c. GitHub Actions

```yaml
# .github/workflows/weekly-report.yml
name: Weekly Plantation Report
on:
  schedule:
    # Every Wednesday 09:00 Asia/Dhaka = 03:00 UTC
    - cron: '0 3 * * 3'
  workflow_dispatch:  # Manual trigger button in Actions UI

permissions:
  contents: write  # to commit the generated files back to the repo

jobs:
  generate:
    runs-on: ubuntu-latest
    env:
      TZ: Asia/Dhaka
      SMTP_HOST: ${{ secrets.SMTP_HOST }}
      SMTP_PORT: ${{ secrets.SMTP_PORT }}
      SMTP_USER: ${{ secrets.SMTP_USER }}
      SMTP_PASS: ${{ secrets.SMTP_PASS }}
      SMTP_FROM: ${{ secrets.SMTP_FROM }}
      SMTP_TO: ${{ secrets.SMTP_TO }}
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-python@v5
        with: { python-version: '3.11' }
      - run: pip install openpyxl
      - run: bash scripts/cron_weekly_report.sh
      - name: Commit generated reports
        run: |
          git config user.name "weekly-report-bot"
          git config user.email "bot@users.noreply.github.com"
          git add plantation-tracker/public/reports/
          git commit -m "chore: weekly report $(TZ=Asia/Dhaka date +%Y-%m-%d)" || true
          git push
```

### 4d. systemd timer (Linux, server-grade)

`/etc/systemd/system/weekly-report.service`:

```ini
[Unit]
Description=Weekly Plantation Report Generator

[Service]
Type=oneshot
User=z
EnvironmentFile=/home/z/my-project/.weekly-report.env
Environment=TZ=Asia/Dhaka
ExecStart=/home/z/my-project/scripts/cron_weekly_report.sh
StandardOutput=append:/home/z/my-project/cron_weekly_report.log
StandardError=append:/home/z/my-project/cron_weekly_report.log
```

`/etc/systemd/system/weekly-report.timer`:

```ini
[Unit]
Description=Run weekly-report every Wednesday 09:00 Asia/Dhaka

[Timer]
OnCalendar=Wed *-*-* 09:00:00
Persistent=true

[Install]
WantedBy=timers.target
```

Enable:

```bash
sudo systemctl enable --now weekly-report.timer
systemctl list-timers weekly-report.timer  # verify
```

### 4e. Windows Task Scheduler

1. Open Task Scheduler → Create Basic Task.
2. Name: `Weekly Plantation Report`.
3. Trigger: Weekly, Wednesday, 09:00 AM.
4. Action: Start a program
   - Program: `C:\Program Files\Git\bin\bash.exe` (or WSL bash)
   - Arguments: `-c "/home/z/my-project/scripts/cron_weekly_report.sh >> /home/z/my-project/cron_weekly_report.log 2>&1"`
5. Set env vars in the task's Environment panel.

### 4f. The IM `cron` tool (if your gateway supports it)

If your environment provides a `cron` tool that accepts a schedule spec,
use this JSON:

```json
{
  "schedule": {
    "kind": "cron",
    "expr": "0 9 * * 3",
    "tz": "Asia/Dhaka"
  },
  "action": "run-script",
  "script": "/home/z/my-project/scripts/cron_weekly_report.sh"
}
```

> ⚠️ **Note on this CLI session**: the in-CLI `cron` tool was not available in
> this session, so the schedule is **not** registered automatically. Pick
> one of the environments above (4a–4f) and register it yourself — it's a
> 30-second job.

---

## 5. Manual triggering (any time)

Run the cron script by hand whenever you need a fresh report:

```bash
# Default behavior — auto-detect, no email
bash /home/z/my-project/scripts/cron_weekly_report.sh

# With email (after exporting SMTP_* env vars)
bash /home/z/my-project/scripts/cron_weekly_report.sh

# Use a different source
REPORT_GAS_URL=https://your-app.vercel.app/api/gas-sync \
  bash /home/z/my-project/scripts/cron_weekly_report.sh

# Pin the report date
REPORT_DATE=2026-08-11 \
  bash /home/z/my-project/scripts/cron_weekly_report.sh
```

You can also call the Python generator directly:

```bash
python3 /home/z/my-project/scripts/generate_weekly_report.py --help
```

---

## 6. Verifying it works

After the first run:

```bash
# Check the log
tail -100 /home/z/my-project/cron_weekly_report.log

# Check the manifest
cat /home/z/my-project/plantation-tracker/public/reports/weekly-report-manifest.json | python3 -m json.tool

# Check the snapshot KPIs
python3 -c "
import json
with open('/home/z/my-project/plantation-tracker/public/reports/weekly-report-snapshot.json') as f:
    s = json.load(f)
print('Report date:', s['reportDate'])
print('Generated:', s['generatedAt'])
print('Source:', s['sourceKind'], '-', s['sourceLabel'])
print('KPIs:', s['kpi'])
"
```

The dashboard tab in `plantation.html` will automatically pick up the new
snapshot on the next page load (or when the user clicks "🔄 রিফ্রেশ").

---

## 6b. The "Email Report" button on the dashboard (real-time trigger)

The dashboard tab's "সর্বশেষ যাচাইকৃত সাপ্তাহিক প্রতিবেদন" card has three
buttons:

1. **⬇️ সম্পূর্ণ প্রতিবেদন ডাউনলোড (Excel)** — downloads `/reports/weekly-report.xlsx`
2. **📧 ইমেইল প্রতিবেদন দেখুন** — opens `/reports/weekly-report.html` in a new tab
3. **⚡ রিয়েল-টাইম প্রতিবেদন তৈরি ও ইমেইল** — calls `POST /api/regenerate-weekly-report`
   with `{ email: true, source: 'gas' }`. This triggers a full real-time
   regeneration: pulls live data from `$GAS_WEBHOOK_URL`, computes stats,
   writes HTML+XLSX+JSON, sends an email via SMTP, and returns the new
   snapshot so the card updates live without a page reload.

### Required env vars (Vercel → Settings → Environment Variables)

For the ⚡ button to send email, all of these must be set:

```
GAS_WEBHOOK_URL=https://script.google.com/macros/s/your-endpoint/exec
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=you@gmail.com
SMTP_PASS=your-app-password       # Gmail: use an App Password, not account password
SMTP_FROM=you@gmail.com
SMTP_TO=dd-kurigram@dae.gov.bd,assistant@dae.gov.bd
```

Without `GAS_WEBHOOK_URL`, the button returns:
> ❌ ত্রুটি: No real-time data source. Set GAS_WEBHOOK_URL env var or pass gasUrl in the body.

Without `SMTP_*`, the button returns:
> ❌ ত্রুটি: Email requested but SMTP_* env vars are incomplete. Set SMTP_HOST, SMTP_USER, SMTP_PASS, SMTP_TO (and optionally SMTP_PORT, SMTP_FROM).

### Local dev testing

For local development, a small Node server wraps the same generator:

```bash
# Start the API server (serves /legacy/plantation.html + /api/*)
cd /home/z/my-project
GAS_WEBHOOK_URL=https://your-gas-endpoint \
SMTP_HOST=smtp.gmail.com SMTP_PORT=587 \
SMTP_USER=you@gmail.com SMTP_PASS=your-app-pass \
SMTP_FROM=you@gmail.com SMTP_TO=recipient@example.com \
  node scripts/local_api_server.mjs

# Then open http://localhost:3001/legacy/plantation.html
# Click the "ড্যাশবোর্ড" tab → click "⚡ রিয়েল-টাইম প্রতিবেদন তৈরি ও ইমেইল"
```

For a no-config test (no GAS endpoint, no SMTP), the button can be triggered
manually via the browser console with `source: 'upload'` (uses whatever
.xlsx is in `/home/z/my-project/upload/`):

```javascript
fetch('/api/regenerate-weekly-report', {
  method: 'POST',
  headers: {'Content-Type': 'application/json'},
  body: JSON.stringify({ email: false, source: 'upload' })
}).then(r => r.json()).then(console.log)
```

### Vercel cron (auto-trigger every Wednesday 9 AM BD time)

`vercel.json` already declares:

```json
"crons": [
  {
    "path": "/api/regenerate-weekly-report",
    "schedule": "0 3 * * 3"
  }
]
```

`0 3 * * 3` = every Wednesday 03:00 UTC = **09:00 Asia/Dhaka**. Vercel's cron
uses GET (no body), and the endpoint defaults to `email=true` when SMTP env
vars are present, so the Wednesday 9 AM run will regenerate + email
automatically. The front-end countdown shows the next run date:

> ⏰ স্বয়ংক্রিয় ক্রোন: প্রতি বুধবার ০৯:০০ (Asia/Dhaka) — পরবর্তী রান: ৪ দিন ২২ ঘণ্টা ৩৭ মিনিট (বুধবার ৯ সেপ্টেম্বর ০৯:০০ AM)

---

## 7. Troubleshooting

| Symptom | Likely cause | Fix |
|---------|--------------|-----|
| `no .xlsx workbook found in upload/` | Upload dir empty | Drop a workbook into `/home/z/my-project/upload/`, or use `--live-url` / `--gas-url` |
| `--live-url fetch failed` | Network issue, bad URL, or non-HTTP(S) scheme | Check URL is reachable from the cron host |
| `--gas-url fetch failed` | Endpoint didn't return `{ok:true, entries:[...]}` | Verify the endpoint works (curl) and returns the expected shape |
| `SMTP env vars missing` | One of `SMTP_HOST/USER/PASS/TO` is unset | Export all four (and optionally `SMTP_PORT/FROM`) |
| Email TLS fails, plain also fails | Wrong port, or auth credentials | Most providers use 587 for TLS. Try 465 (SSL), or 25 (plain). |
| Dashboard shows "লোড হচ্ছে…" forever | `weekly-report-snapshot.json` missing or unreadable | Run the cron script once to generate it; check file permissions |
| Charts in detail panel don't render | Chart.js not loaded, or canvas still hidden | Open the detail panel — charts only render after the panel is visible (intentional, avoids 0×0 canvas bug) |
| ⚡ button shows "No real-time data source" | `GAS_WEBHOOK_URL` env var not set | Set `GAS_WEBHOOK_URL` (or `REPORT_GAS_URL`) on Vercel/host. The button always uses the live GAS endpoint. |
| ⚡ button shows "SMTP_* env vars are incomplete" | `--email` requested but SMTP env vars unset | Set `SMTP_HOST, SMTP_USER, SMTP_PASS, SMTP_TO` (and optionally `SMTP_PORT, SMTP_FROM`). |
| ⚡ button shows "Generator script not found" | `scripts/generate_weekly_report.py` missing from deployment | Make sure the `scripts/` directory is included in the Vercel build (or repo root if using GitHub Actions) |
| ⚡ button shows "Python interpreter not found" | Host has no `python3`/`python`/`py` on PATH | Install Python 3.10+ on the host, or use GitHub Actions (which has Python pre-installed) |
| Card doesn't update after ⚡ click (but no error) | Browser cache holding old `weekly-report.html`/`.xlsx` | The button adds `?v=Date.now()` cache-buster to download links; hard-reload (Cmd/Ctrl+Shift+R) if KPIs look stale |

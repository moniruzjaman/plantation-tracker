#!/usr/bin/env bash
# ============================================================================
# cron_weekly_report.sh
# ============================================================================
# Weekly plantation report cron entry point.
#
# Schedule:    Every Wednesday 09:00 Asia/Dhaka (UTC+06:00, no DST)
# Cron expr:   0 9 * * 3   (with TZ=Asia/Dhaka)
# UTC equiv:   0 3 * * 3
#
# What it does:
#   1. Auto-detects the newest source .xlsx in /home/z/my-project/upload/
#      (or uses --source / --live-url / --gas-url if $REPORT_SOURCE_* is set).
#   2. Runs the dynamic generator (Python) to produce:
#        - /home/z/my-project/plantation-tracker/public/reports/weekly-report.html
#        - /home/z/my-project/plantation-tracker/public/reports/weekly-report.xlsx
#        - /home/z/my-project/plantation-tracker/public/reports/weekly-report-snapshot.json
#        - weekly-report-<YYYY-MM-DD>.html/xlsx (date-tagged archive)
#        - weekly-report-manifest.json (append-only history)
#   3. Sends the report via SMTP if SMTP_* env vars are present.
#   4. Logs everything to /home/z/my-project/cron_weekly_report.log
#
# Usage from crontab:
#   0 9 * * 3 TZ=Asia/Dhaka /home/z/my-project/scripts/cron_weekly_report.sh \
#       >> /home/z/my-project/cron_weekly_report.log 2>&1
#
# Env vars (optional — control source + email):
#   REPORT_SOURCE_PATH   Path to a specific .xlsx (overrides auto-detect)
#   REPORT_LIVE_URL      HTTP(S) URL of a remote .xlsx
#   REPORT_GAS_URL       URL of a /api/gas-sync-compatible JSON endpoint
#   REPORT_OUT_DIR       Override the output directory
#   REPORT_DATE          Override the report reference date (YYYY-MM-DD)
#   SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS, SMTP_FROM, SMTP_TO
#                        If all of these are set, the report is emailed
#                        automatically after generation.
# ============================================================================

set -euo pipefail

# ----------------------------------------------------------------------------
# Paths — portable: resolve relative to this script's location so the cron
# works whether deployed from /home/z/my-project (dev) or from the repo
# root (production / GitHub Actions / Vercel build).
# ----------------------------------------------------------------------------
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
REPO_ROOT="$(cd "${SCRIPT_DIR}/.." && pwd)"
# Upload dir: in dev, /home/z/my-project/upload; in prod, $REPO_ROOT/upload
DEFAULT_UPLOAD_DIR="${REPO_ROOT}/upload"
UPLOAD_DIR="${REPORT_UPLOAD_DIR:-${DEFAULT_UPLOAD_DIR}}"
OUT_DIR="${REPORT_OUT_DIR:-${REPO_ROOT}/public/reports}"
LOG_FILE="${REPORT_LOG_FILE:-${REPO_ROOT}/cron_weekly_report.log}"

GENERATOR="${SCRIPT_DIR}/generate_weekly_report.py"
PYTHON_BIN="${PYTHON_BIN:-python3}"

# ----------------------------------------------------------------------------
# Banner
# ----------------------------------------------------------------------------
echo ""
echo "================================================================"
echo "  Weekly Plantation Report — Cron Run"
echo "  Started: $(date -u '+%Y-%m-%d %H:%M:%S UTC')  |  $(TZ=Asia/Dhaka date '+%Y-%m-%d %H:%M:%S %Z')"
echo "================================================================"

# ----------------------------------------------------------------------------
# Sanity checks
# ----------------------------------------------------------------------------
if [[ ! -f "${GENERATOR}" ]]; then
  echo "FATAL: generator script not found at ${GENERATOR}" >&2
  exit 2
fi
if ! command -v "${PYTHON_BIN}" >/dev/null 2>&1; then
  echo "FATAL: ${PYTHON_BIN} not on PATH" >&2
  exit 2
fi

mkdir -p "${OUT_DIR}"
mkdir -p "${UPLOAD_DIR}"

# ----------------------------------------------------------------------------
# Build CLI args from env vars (if present)
# ----------------------------------------------------------------------------
ARGS=()
ARGS+=("--out-dir" "${OUT_DIR}")

if [[ -n "${REPORT_SOURCE_PATH:-}" ]]; then
  echo "📌 Source: explicit path — ${REPORT_SOURCE_PATH}"
  ARGS+=("--source" "${REPORT_SOURCE_PATH}")
elif [[ -n "${REPORT_LIVE_URL:-}" ]]; then
  echo "📌 Source: live URL — ${REPORT_LIVE_URL}"
  ARGS+=("--live-url" "${REPORT_LIVE_URL}")
elif [[ -n "${REPORT_GAS_URL:-}" ]]; then
  echo "📌 Source: GAS endpoint — ${REPORT_GAS_URL}"
  ARGS+=("--gas-url" "${REPORT_GAS_URL}")
else
  echo "📌 Source: auto-detect (newest .xlsx in ${UPLOAD_DIR})"
fi

if [[ -n "${REPORT_DATE:-}" ]]; then
  echo "📅 Report date override: ${REPORT_DATE}"
  ARGS+=("--date" "${REPORT_DATE}")
fi

# Email if SMTP env vars are present
if [[ -n "${SMTP_HOST:-}" && -n "${SMTP_USER:-}" && -n "${SMTP_PASS:-}" && -n "${SMTP_TO:-}" ]]; then
  echo "📧 SMTP env vars present — email will be sent after generation"
  ARGS+=("--email")
else
  echo "📧 SMTP env vars incomplete — skipping email (report will be saved to disk only)"
fi

# ----------------------------------------------------------------------------
# Run the generator
# ----------------------------------------------------------------------------
echo ""
echo "🚀 Running generator: ${PYTHON_BIN} ${GENERATOR} ${ARGS[*]}"
echo "----------------------------------------------------------------"
"${PYTHON_BIN}" "${GENERATOR}" "${ARGS[@]}"
RC=$?
echo "----------------------------------------------------------------"
if [[ ${RC} -ne 0 ]]; then
  echo "❌ Generator failed with exit code ${RC}" >&2
  exit ${RC}
fi
echo "✅ Generator completed successfully"
echo ""

# ----------------------------------------------------------------------------
# Summary
# ----------------------------------------------------------------------------
echo "📊 Output files (in ${OUT_DIR}):"
ls -1 "${OUT_DIR}" 2>/dev/null | sed 's/^/    /'
echo ""

# Show the canonical snapshot's KPIs for quick log scanning
SNAPSHOT="${OUT_DIR}/weekly-report-snapshot.json"
if [[ -f "${SNAPSHOT}" ]]; then
  echo "🔗 Latest snapshot KPIs:"
  "${PYTHON_BIN}" -c "
import json, sys
with open('${SNAPSHOT}') as f:
    s = json.load(f)
print(f\"    reportDate:      {s.get('reportDate','—')}\")
print(f\"    generatedAt:     {s.get('generatedAt','—')}\")
print(f\"    sourceKind:      {s.get('sourceKind','—')}\")
print(f\"    totalEntries:    {s['kpi']['totalEntries']}\")
print(f\"    totalSeedlings:  {s['kpi']['totalSeedlings']}\")
print(f\"    upazilaCoverage: {s['kpi']['upazilaCoverage']}/{s['kpi']['upazilaTotal']}\")
print(f\"    needsVerify:     {s['kpi']['needsVerification']} ({s['kpi']['needsVerificationPct']}%)\")
" 2>&1 || true
fi

echo ""
echo "================================================================"
echo "  Cron run completed: $(date -u '+%Y-%m-%d %H:%M:%S UTC')"
echo "================================================================"

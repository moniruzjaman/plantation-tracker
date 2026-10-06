#!/usr/bin/env python3
"""
generate_weekly_report.py
=========================
Dynamic, professional-grade weekly plantation report generator.

Reads the source workbook (3 sheets: সারসংক্ষেপ, মূল_ডাটা, ১৭_কলাম_প্রতিবেদন),
computes every statistic fresh from the raw entry rows, and emits:

  1. <date-tagged>.html                          — professional HTML report
  2. <date-tagged>.xlsx                          — professional XLSX report
  3. weekly-report-snapshot.json                 — canonical snapshot the
                                                  Dashboard tab loads
                                                  dynamically (always the
                                                  most recent run)
  4. <date-tagged>-snapshot.json                 — date-stamped archive copy
  5. weekly-report-manifest.json                 — append-only history of
                                                  every generated report

Source selection (in priority order):
  --source PATH         Explicit path to a source .xlsx workbook.
  --live-url URL        Fetch a remote .xlsx (HTTP/HTTPS) and use that.
  --gas-url URL         Fetch /api/gas-sync?list=1 (or any compatible JSON
                        endpoint) and synthesize an in-memory workbook.
  (default)             Auto-detect the newest .xlsx in
                        /home/z/my-project/upload/.

Output:
  --out-dir DIR         Where to write reports (default:
                        plantation-tracker/public/reports).
  --date YYYY-MM-DD     Report reference date (default: today in Asia/Dhaka).
  --no-tag-filenames    Don't date-tag filenames (write to fixed names).
  --email               Send the report via SMTP after generating it.
                        Requires SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS,
                        SMTP_FROM, SMTP_TO env vars.

Design tokens (colors, fonts, spacing) are aligned with the Dashboard tab
(tab-dashboard inside public/legacy/plantation.html) so the report and the
in-app dashboard feel like one product.

Usage examples:
    # Auto-detect latest upload, dynamic date = today
    python3 generate_weekly_report.py

    # Explicit source, explicit date
    python3 generate_weekly_report.py --source /path/to/report.xlsx \\
        --date 2026-08-11

    # Live fetch from GAS sync endpoint (server-side cron use case)
    python3 generate_weekly_report.py \\
        --gas-url https://your-app.vercel.app/api/gas-sync \\
        --email

    # Cron-friendly (used by cron_weekly_report.sh)
    python3 generate_weekly_report.py --email
"""

from __future__ import annotations

import argparse
import json
import os
import re
import statistics
import sys
import tempfile
import urllib.request
import urllib.error
from collections import Counter, defaultdict
from dataclasses import dataclass, field, asdict
from datetime import datetime, timezone, timedelta
from typing import Any

import openpyxl
from openpyxl.chart import BarChart, DoughnutChart, PieChart, Reference
from openpyxl.chart.label import DataLabelList
from openpyxl.styles import (Alignment, Border, Font, PatternFill, Side)
from openpyxl.utils import get_column_letter

# ---------------------------------------------------------------------------
# Paths and constants
# ---------------------------------------------------------------------------

SCRIPT_DIR = os.path.dirname(os.path.abspath(__file__))
# scripts/ lives inside the repo root, so the repo root is one level up.
# This makes the generator portable: it works whether invoked from
# /home/z/my-project/scripts/ (dev) or from <repo>/scripts/ (deployed).
REPO_ROOT = os.path.abspath(os.path.join(SCRIPT_DIR, ".."))

# Default upload directory — auto-detect scans this for the newest .xlsx.
# In dev, this is /home/z/my-project/upload (sibling of the repo).
# In prod, this is <repo>/upload (created on demand).
UPLOAD_DIR = os.environ.get(
    "REPORT_UPLOAD_DIR",
    os.path.join(os.path.dirname(REPO_ROOT), "upload")
        if os.path.isdir(os.path.join(os.path.dirname(REPO_ROOT), "upload"))
        else os.path.join(REPO_ROOT, "upload"),
)
# Default output directory — public/reports/ inside the repo.
DEFAULT_OUT_DIR = os.path.join(REPO_ROOT, "public", "reports")

# Asia/Dhaka timezone offset (UTC+06:00) — Bangladesh has no DST.
DHAKA_TZ = timezone(timedelta(hours=6))

# ---------------------------------------------------------------------------
# Design tokens (aligned with the Dashboard tab in plantation.html)
# ---------------------------------------------------------------------------

# Dashboard tab uses these accent colors on its KPI cards (left border):
#   #15803d (green)  #2563eb (blue)   #ea580c (orange)  #7c3aed (purple)
#   #0891b2 (cyan)   #dc2626 (red)    #f59e0b (amber, official card)
COLORS = {
    "primary": "#15803d",       # main brand green (DAE)
    "primary_dark": "#166534",
    "primary_light": "#bbf7d0",
    "primary_50": "#f0fdf4",
    "blue": "#2563eb",
    "blue_dark": "#1e3a8a",
    "orange": "#ea580c",
    "purple": "#7c3aed",
    "cyan": "#0891b2",
    "red": "#dc2626",
    "amber": "#f59e0b",
    "amber_dark": "#92400e",
    "amber_light": "#fef3c7",
    "gray_900": "#111827",
    "gray_700": "#374151",
    "gray_500": "#6b7280",
    "gray_300": "#d1d5db",
    "gray_200": "#e5e7eb",
    "gray_100": "#f3f4f6",
    "gray_50": "#f9fafb",
    "white": "#ffffff",
}

# District palette for charts (matches Dashboard tab donut/bar variety)
CHART_PALETTE = [
    "#15803d", "#f59e0b", "#2563eb", "#ea580c", "#7c3aed",
    "#0891b2", "#dc2626", "#10b981", "#f97316", "#6366f1",
    "#0ea5e9", "#84cc16",
]

# Bengali numeral conversion
BN_DIGITS = "০১২৩৪৫৬৭৮৯"

def bn(num: Any) -> str:
    """Convert a number (int, float, str) into Bengali numerals."""
    if num is None:
        return ""
    s = str(num)
    return s.translate(str.maketrans("0123456789", BN_DIGITS))

def bn_int(n: int) -> str:
    return bn(f"{n:,}")

def bn_pct(p: float, digits: int = 1) -> str:
    fmt = f"{{:.{digits}f}}%".format(p)
    return bn(fmt)

# ---------------------------------------------------------------------------
# Data classes
# ---------------------------------------------------------------------------

@dataclass
class UpazilaRow:
    name: str = ""
    main_entries: int = 0
    main_seedlings: int = 0
    col17_entries: int = 0
    col17_seedlings: int = 0
    @property
    def combined_entries(self) -> int:
        return self.main_entries + self.col17_entries
    @property
    def combined_seedlings(self) -> int:
        return self.main_seedlings + self.col17_seedlings

@dataclass
class CategoryRow:
    category: str
    source: str
    entries: int = 0
    seedlings: int = 0

@dataclass
class DataQualityRow:
    criterion: str
    count: int
    pct: float
    note: str

@dataclass
class ReportSnapshot:
    title: str
    subtitle: str
    generated_at: str
    report_date: str
    office: str
    district: str
    division: str
    source_label: str = ""            # human-readable source description
    source_kind: str = ""             # "upload" | "explicit" | "live-url" | "gas"
    # KPIs
    total_entries: int = 0
    total_seedlings: int = 0
    main_entries: int = 0
    main_seedlings: int = 0
    col17_entries: int = 0
    col17_seedlings: int = 0
    upazila_coverage: int = 0
    upazila_total: int = 9
    species_count: int = 0
    avg_per_entry: float = 0.0
    max_entry_qty: int = 0
    unique_farmers: int = 0
    unique_saao: int = 0
    unique_officers: int = 0
    needs_verification: int = 0
    needs_verification_pct: float = 0.0
    # breakdowns
    upazilas: list[UpazilaRow] = field(default_factory=list)
    categories: list[CategoryRow] = field(default_factory=list)
    sources: list[dict] = field(default_factory=list)
    top_species: list[dict] = field(default_factory=list)
    top_saao: list[dict] = field(default_factory=list)
    top_officers: list[dict] = field(default_factory=list)
    data_quality: list[DataQualityRow] = field(default_factory=list)
    notes: list[str] = field(default_factory=list)

# ---------------------------------------------------------------------------
# Parsing & computation
# ---------------------------------------------------------------------------

# Canonical upazila name mapping (handles spelling variants between sources)
# Out-of-district entries are suffixed with their actual district in parentheses
# so the coverage KPI can distinguish Kurigram upazilas from outside ones.
UPAZILA_CANONICAL = {
    "ভূরুঙ্গামারী": "ভূরুঙ্গামারী",
    "ভুরুঙ্গামারী": "ভূরুঙ্গামারী",
    "চর রাজিবপুর": "চর রাজিবপুর",
    "ফুলবাড়ী": "ফুলবাড়ী",
    "ফুলবাডি": "ফুলবাড়ী",
    "উলিপুর": "উলিপুর",
    "চিলমারী": "চিলমারী",
    "চিলমারি": "চিলমারী",
    "রৌমারী": "রৌমারী",
    "রৌমারি": "রৌমারী",
    "কুড়িগ্রাম সদর": "কুড়িগ্রাম সদর",
    "নাগেশ্বরী": "নাগেশ্বরী",
    "রাজারহাট": "রাজারহাট",
    "রাজারহাট কুড়িগ্রাম": "রাজারহাট",
    # out-of-district entries kept for transparency
    "বদরগঞ্জ": "বদরগঞ্জ (রংপুর)",
    "পাটগ্রাম": "পাটগ্রাম (লালমনিরহাট)",
}

# Official list of 9 upazilas of Kurigram district (for coverage KPI)
KURIGRAM_UPAZILAS = [
    "ভূরুঙ্গামারী", "নাগেশ্বরী", "ফুলবাড়ী", "রাজারহাট", "কুড়িগ্রাম সদর",
    "উলিপুর", "চিলমারী", "রৌমারী", "চর রাজিবপুর",
]

# Set of all canonical Kurigram upazila names — used to flag out-of-district entries
KURIGRAM_UPAZILA_SET = set(KURIGRAM_UPAZILAS)

def canon_upazila(raw: str | None) -> str:
    if not raw:
        return ""
    s = raw.strip()
    return UPAZILA_CANONICAL.get(s, s)

def is_kurigram(name: str) -> bool:
    """A canonical upazila name belongs to Kurigram iff it's in the official 9."""
    return name in KURIGRAM_UPAZILA_SET

def parse_int(val: Any) -> int:
    if val is None:
        return 0
    if isinstance(val, (int, float)):
        return int(val)
    s = str(val).strip()
    # strip non-numeric chars (commas, units, etc.)
    m = re.search(r"-?\d+", s.replace(",", ""))
    return int(m.group()) if m else 0

def parse_coords(val: Any) -> tuple[float, float] | None:
    if val is None:
        return None
    s = str(val).strip()
    # Accept "lat,lng" or "lat-lng" or "lat lng"
    parts = re.split(r"[,\-\s]+", s)
    nums = []
    for p in parts:
        try:
            nums.append(float(p))
        except ValueError:
            continue
        if len(nums) == 2:
            break
    if len(nums) == 2 and -90 <= nums[0] <= 90 and -180 <= nums[1] <= 180:
        return (nums[0], nums[1])
    return None

def parse_date(val: Any) -> str:
    """Return ISO date string YYYY-MM-DD or empty string."""
    if val is None:
        return ""
    if isinstance(val, datetime):
        return val.strftime("%Y-%m-%d")
    s = str(val).strip()
    # try common formats
    for fmt in ("%d %b %Y", "%d %B %Y", "%Y-%m-%d", "%d/%m/%Y", "%m/%d/%Y", "%d-%m-%Y"):
        try:
            return datetime.strptime(s, fmt).strftime("%Y-%m-%d")
        except ValueError:
            continue
    return ""

def split_species_field(val: Any) -> list[str]:
    """The species-name field in মূল_ডাটা contains strings like
    'আম, কাঠাল, নিম, জলপাই ও মেহগনি' — split into individual species."""
    if not val:
        return []
    s = str(val)
    # Replace Bengali conjunctions with comma, then split
    s = re.sub(r"\s*ও\s*", ", ", s)
    s = re.sub(r"\s*এবং\s*", ", ", s)
    parts = [p.strip().strip("।.") for p in s.split(",")]
    return [p for p in parts if p]

def extract_qty_from_species_name(val: Any) -> int | None:
    """17-col sheet embeds qty in species string like 'পেয়ারা থাই-৭ (ফলদ) × 85'."""
    if not val:
        return None
    m = re.search(r"[×x]\s*(\d+)", str(val), re.IGNORECASE)
    if m:
        return int(m.group(1))
    return None

# ---------------------------------------------------------------------------
# Main computation
# ---------------------------------------------------------------------------

def compute_snapshot(
    src_xlsx: str,
    *,
    source_kind: str = "explicit",
    source_label: str = "",
    report_date: str = "",
    generated_at: str = "",
) -> ReportSnapshot:
    """Compute a ReportSnapshot from the source workbook.

    Args:
        src_xlsx: Path to the source .xlsx workbook (must contain the 3
            standard sheets: সারসংক্ষেপ, মূল_ডাটা, ১৭_কলাম_প্রতিবেদন).
        source_kind: One of "explicit" | "upload" | "live-url" | "gas" —
            stored on the snapshot for traceability.
        source_label: Human-readable description of the source (e.g.
            "auto-detected: weekly_report_bn.xlsx (mtime 2026-08-17)").
        report_date: ISO date string YYYY-MM-DD for the report reference
            date. Defaults to today in Asia/Dhaka.
        generated_at: ISO timestamp string. Defaults to now() in Dhaka TZ.
    """
    wb = openpyxl.load_workbook(src_xlsx, data_only=True)

    # --- Sheet 2: মূল_ডাটা (ministry report) ---
    ws2 = wb["মূল_ডাটা"]
    rows2 = list(ws2.iter_rows(values_only=True))
    header2 = rows2[0]
    data2 = rows2[1:]

    # columns: 0=ক্র, 1=স্থান, 2=উপজেলা, 3=প্রজাতির নাম, 4=রোপণকৃত সংখ্যা,
    #          5=coords, 6=farmer, 7=saao, 8=officer, 9=remarks, 10=category
    upazila_main: dict[str, UpazilaRow] = defaultdict(UpazilaRow)
    cat_main: dict[str, CategoryRow] = {}
    farmers_main = set()
    saao_main = set()
    officers_main = set()
    species_counter_main = Counter()
    main_entries = 0
    main_seedlings = 0
    main_max = 0
    bad_coords_main = 0
    missing_date_main = 0  # always 0 for this sheet (no date column)

    for r in data2:
        if r[0] is None:
            continue
        main_entries += 1
        qty = parse_int(r[4]) if len(r) > 4 else 0
        main_seedlings += qty
        main_max = max(main_max, qty)
        upa = canon_upazila(r[2] if len(r) > 2 else None)
        if upa:
            row = upazila_main[upa]
            row.name = upa
            row.main_entries += 1
            row.main_seedlings += qty
        cat = (r[10] if len(r) > 10 else None) or "অজ্ঞাত"
        cat = str(cat).strip()
        if cat not in cat_main:
            cat_main[cat] = CategoryRow(category=cat, source="মূল_ডাটা")
        cat_main[cat].entries += 1
        cat_main[cat].seedlings += qty
        # People
        if r[6]:
            farmers_main.add(str(r[6]).strip())
        if r[7]:
            saao_main.add(str(r[7]).strip())
        if r[8]:
            officers_main.add(str(r[8]).strip())
        # Species
        for sp in split_species_field(r[3] if len(r) > 3 else None):
            species_counter_main[sp] += qty
        # Coords quality
        if not parse_coords(r[5] if len(r) > 5 else None):
            bad_coords_main += 1

    # --- Sheet 3: ১৭_কলাম_প্রতিবেদন ---
    ws3 = wb["১৭_কলাম_প্রতিবেদন"]
    rows3 = list(ws3.iter_rows(values_only=True))
    # Header is on row 4 (index 3)
    data3 = rows3[4:]
    # columns: 0=ক্র, 1=গ্রাম, 2=ব্লক, 3=ইউনিয়ন, 4=উপজেলা, 5=জেলা,
    #          6=প্রজাতির নাম, 7=চারার সংখ্যা, 8=তারিখ, 9=coords,
    #          10=farmer, 11=farmer mobile, 12=saao, 13=saao mobile,
    #          14=officer, 15=officer mobile, 16=remarks, 17=category, 18=validation

    upazila_17: dict[str, UpazilaRow] = defaultdict(UpazilaRow)
    cat_17: dict[str, CategoryRow] = {}
    farmers_17 = set()
    saao_17 = set()
    officers_17 = set()
    species_counter_17 = Counter()
    col17_entries = 0
    col17_seedlings = 0
    col17_max = 0
    serial_missing = 0
    upazila_missing = 0
    out_of_district = 0
    bad_coords_17 = 0
    missing_date_17 = 0
    missing_officer_17 = 0

    for r in data3:
        if r[0] is None and r[4] is None:
            # Skip fully-blank trailing rows
            if not any(c is not None for c in r):
                continue
        # Use upazila presence as the "is this a real entry" signal
        if r[4] is None and r[6] is None and r[7] is None:
            continue
        col17_entries += 1
        qty_raw = r[7] if len(r) > 7 else None
        qty = parse_int(qty_raw)
        if qty == 0:
            # Try to extract from species name
            alt = extract_qty_from_species_name(r[6] if len(r) > 6 else None)
            if alt:
                qty = alt
        col17_seedlings += qty
        col17_max = max(col17_max, qty)
        upa = canon_upazila(r[4] if len(r) > 4 else None)
        if upa:
            row = upazila_17[upa]
            row.name = upa
            row.col17_entries += 1
            row.col17_seedlings += qty
        else:
            upazila_missing += 1
        cat = (r[17] if len(r) > 17 else None) or "অজ্ঞাত"
        cat = str(cat).strip()
        if cat not in cat_17:
            cat_17[cat] = CategoryRow(category=cat, source="১৭_কলাম_প্রতিবেদন")
        cat_17[cat].entries += 1
        cat_17[cat].seedlings += qty
        # People
        if r[10]:
            farmers_17.add(str(r[10]).strip())
        if r[12]:
            saao_17.add(str(r[12]).strip())
        if r[14]:
            officers_17.add(str(r[14]).strip())
        # Species
        sp_field = r[6] if len(r) > 6 else None
        if sp_field:
            # 17-col format: "পেয়ারা থাই-৭ (ফলদ) × 85" — species name is before (
            sp_name = re.sub(r"\s*\(.*$", "", str(sp_field)).strip()
            sp_name = re.sub(r"\s*×.*$", "", sp_name).strip()
            if sp_name:
                species_counter_17[sp_name] += qty
        # Coords quality
        if not parse_coords(r[9] if len(r) > 9 else None):
            bad_coords_17 += 1
        # Date
        if not parse_date(r[8] if len(r) > 8 else None):
            missing_date_17 += 1
        # Serial
        if r[0] is None:
            serial_missing += 1
        # Out of district
        if upa and not is_kurigram(upa):
            out_of_district += 1
        # Missing officer
        if not (r[14] if len(r) > 14 else None):
            missing_officer_17 += 1

    # --- Merge upazila stats ---
    all_upazila_names = set(upazila_main) | set(upazila_17) | set(KURIGRAM_UPAZILAS)
    merged: list[UpazilaRow] = []
    for name in sorted(all_upazila_names, key=lambda x: (is_kurigram(x) is False, x)):
        m = upazila_main.get(name, UpazilaRow(name=name))
        s = upazila_17.get(name, UpazilaRow(name=name))
        merged.append(UpazilaRow(
            name=name,
            main_entries=m.main_entries,
            main_seedlings=m.main_seedlings,
            col17_entries=s.col17_entries,
            col17_seedlings=s.col17_seedlings,
        ))
    # Sort by combined seedlings desc
    merged.sort(key=lambda u: u.combined_seedlings, reverse=True)

    # --- Category stats ---
    all_cats: list[CategoryRow] = []
    for cat, row in cat_main.items():
        all_cats.append(row)
    for cat, row in cat_17.items():
        all_cats.append(row)
    # Order: largest seedling share first
    all_cats.sort(key=lambda c: c.seedlings, reverse=True)

    # --- Top species (combine both counters) ---
    combined_species = Counter()
    for sp, q in species_counter_main.items():
        combined_species[sp] += q
    for sp, q in species_counter_17.items():
        combined_species[sp] += q
    top_species = [
        {"name": sp, "seedlings": q, "pct": (q / max(combined_species.total(), 1)) * 100}
        for sp, q in combined_species.most_common(10)
    ]

    # --- Top SAAO (combine) ---
    saao_counter = Counter()
    for s in saao_main:
        saao_counter[s] += 1
    for s in saao_17:
        saao_counter[s] += 1
    top_saao = [
        {"name": s, "entries": c}
        for s, c in saao_counter.most_common(8)
    ]

    # --- Top officers ---
    officer_counter = Counter()
    for s in officers_main:
        officer_counter[s] += 1
    for s in officers_17:
        officer_counter[s] += 1
    top_officers = [
        {"name": s, "entries": c}
        for s, c in officer_counter.most_common(8)
    ]

    # --- Combined KPIs ---
    total_entries = main_entries + col17_entries
    total_seedlings = main_seedlings + col17_seedlings
    avg_per_entry = (total_seedlings / total_entries) if total_entries else 0
    max_entry_qty = max(main_max, col17_max)
    unique_farmers = len(farmers_main | farmers_17)
    unique_saao = len(saao_main | saao_17)
    unique_officers = len(officers_main | officers_17)

    # Upazila coverage: count Kurigram upazilas with at least 1 entry
    kurigram_with_entries = sum(
        1 for u in merged if is_kurigram(u.name) and u.combined_entries > 0
    )
    # Out-of-district entries (transparency)
    ood_entries = sum(u.combined_entries for u in merged if not is_kurigram(u.name))

    # --- Data quality rows (sheet 3 only, since main sheet has no date/serial) ---
    pct = lambda c: (c / col17_entries * 100) if col17_entries else 0
    dq_rows: list[DataQualityRow] = [
        DataQualityRow("সিরিয়াল নম্বর অনুপস্থিত", serial_missing, pct(serial_missing),
                       "উৎস ফাইলে ক্রমিক নম্বর খালি ছিল"),
        DataQualityRow("উপজেলা খালি", upazila_missing, pct(upazila_missing),
                       "উপজেলা লেখা নেই এমন এন্ট্রি"),
        DataQualityRow("কুড়িগ্রাম জেলার বাইরের উপজেলা", out_of_district, pct(out_of_district),
                       "বদরগঞ্জ/পাটগ্রাম — অন্য জেলার এন্ট্রি"),
        DataQualityRow("জিও-কোঅর্ডিনেট ত্রুটিপূর্ণ", bad_coords_17, pct(bad_coords_17),
                       "ভুল/খালি/অসংগত কোঅর্ডিনেট"),
        DataQualityRow("রোপণের তারিখ খালি", missing_date_17, pct(missing_date_17),
                       "তারিখ লেখা নেই"),
        DataQualityRow("মনিটরিং অফিসার খালি", missing_officer_17, pct(missing_officer_17),
                       "মনিটরিং অফিসারের নাম নেই"),
    ]
    # "needs verification" = entries with at least 1 issue (approx = union of flagged)
    # conservative estimate: max single-issue count (avoids double-counting)
    needs_verification = max(d.count for d in dq_rows)
    needs_pct = pct(needs_verification)

    # --- Source comparison rows ---
    sources = [
        {
            "name": "মূল_ডাটা (ministry report)",
            "entries": main_entries,
            "seedlings": main_seedlings,
            "description": "মিশ্র প্যাকেজ ও একক প্রজাতি — ৭টি উপজেলায় এন্ট্রি",
        },
        {
            "name": "১৭_কলাম_প্রতিবেদন (17-column report)",
            "entries": col17_entries,
            "seedlings": col17_seedlings,
            "description": "ফলদ/ঔষধি/বনজ ক্যাটাগরি — ৯টি উপজেলার সবকটিতেই এন্ট্রি",
        },
    ]

    notes = [
        f"মূল_ডাটা (ministry report) ও ১৭_কলাম_প্রতিবেদন (17-column report) — দুই ভিন্ন উৎসের এন্ট্রি ও গাছ সংখ্যা একত্রে দেখানো হয়েছে।",
        f"১৭_কলাম_প্রতিবেদনে উলিপুর ও চিলমারী উপজেলাতেও এন্ট্রি রয়েছে, ফলে দুই উৎস একত্রে করলে ৯টি উপজেলাই কভার হয়।",
        f"উৎস: গুগল শিট \"Tree_Plantation_Reporting_Workbook.xlsx\" — ministry report ও 17_column report। ইউনিকোড NFC নরমালাইজেশন ও উপজেলার নামের বানান সামঞ্জস্য করা হয়েছে।",
    ]
    if ood_entries > 0:
        notes.append(
            f"{ood_entries}টি এন্ট্রি কুড়িগ্রাম জেলার বাইরের (বদরগঞ্জ/পাটগ্রাম) — স্বচ্ছতার জন্য প্রদর্শিত, জেলার লক্ষ্যমাত্রার অংশ নয়।"
        )

    # Defaults for dynamic date — Asia/Dhaka today
    if not generated_at:
        generated_at = datetime.now(DHAKA_TZ).strftime("%Y-%m-%d %H:%M:%S (UTC+6)")
    if not report_date:
        # Default: today in Bangladesh, formatted as "DD Month, YYYY" in English
        # so it slots cleanly into the existing report layout.
        now_dhaka = datetime.now(DHAKA_TZ)
        report_date = now_dhaka.strftime("%-d %B, %Y")

    snap = ReportSnapshot(
        title="সাপ্তাহিক বৃক্ষরোপণ কর্মসূচির অগ্রগতি প্রতিবেদন",
        subtitle="কৃষি সম্প্রসারণ অধিদপ্তর (DAE), কুড়িগ্রাম জেলা  |  ৫ বছরে ২৫ কোটি বৃক্ষরোপণ কর্মসূচি",
        generated_at=generated_at,
        report_date=report_date,
        office="উপপরিচালকের কার্যালয়, কৃষি সম্প্রসারণ অধিদপ্তর, কুড়িগ্রাম",
        district="কুড়িগ্রাম",
        division="রংপুর",
        source_kind=source_kind,
        source_label=source_label or src_xlsx,
        total_entries=total_entries,
        total_seedlings=total_seedlings,
        main_entries=main_entries,
        main_seedlings=main_seedlings,
        col17_entries=col17_entries,
        col17_seedlings=col17_seedlings,
        upazila_coverage=kurigram_with_entries,
        upazila_total=9,
        species_count=len(combined_species),
        avg_per_entry=round(avg_per_entry, 1),
        max_entry_qty=max_entry_qty,
        unique_farmers=unique_farmers,
        unique_saao=unique_saao,
        unique_officers=unique_officers,
        needs_verification=needs_verification,
        needs_verification_pct=round(needs_pct, 1),
        upazilas=merged,
        categories=all_cats,
        sources=sources,
        top_species=top_species,
        top_saao=top_saao,
        top_officers=top_officers,
        data_quality=dq_rows,
        notes=notes,
    )
    return snap


# ---------------------------------------------------------------------------
# HTML report generation
# ---------------------------------------------------------------------------

def donut_svg(segments: list[tuple[str, int, str]], size: int = 220) -> str:
    """Render an SVG donut chart. segments = [(label, value, color), ...]"""
    total = sum(v for _, v, _ in segments) or 1
    cx = cy = size / 2
    r_outer = size / 2 - 4
    r_inner = r_outer - 28
    # Build arcs
    import math
    angle = -90.0  # start at 12 o'clock
    paths = []
    for label, val, color in segments:
        if val <= 0:
            continue
        sweep = (val / total) * 360.0
        a0 = math.radians(angle)
        a1 = math.radians(angle + sweep)
        large = 1 if sweep > 180 else 0
        x0o = cx + r_outer * math.cos(a0)
        y0o = cy + r_outer * math.sin(a0)
        x1o = cx + r_outer * math.cos(a1)
        y1o = cy + r_outer * math.sin(a1)
        x0i = cx + r_inner * math.cos(a1)
        y0i = cy + r_inner * math.sin(a1)
        x1i = cx + r_inner * math.cos(a0)
        y1i = cy + r_inner * math.sin(a0)
        d = (
            f"M {x0o:.2f} {y0o:.2f} "
            f"A {r_outer} {r_outer} 0 {large} 1 {x1o:.2f} {y1o:.2f} "
            f"L {x0i:.2f} {y0i:.2f} "
            f"A {r_inner} {r_inner} 0 {large} 0 {x1i:.2f} {y1i:.2f} Z"
        )
        paths.append(f'<path d="{d}" fill="{color}" stroke="#fff" stroke-width="1.5">'
                     f'<title>{label}: {val} ({val/total*100:.1f}%)</title></path>')
        angle += sweep
    # center label
    center = (
        f'<text x="{cx}" y="{cy-6}" text-anchor="middle" '
        f'font-size="13" font-weight="700" fill="{COLORS["gray_900"]}">মোট</text>'
        f'<text x="{cx}" y="{cy+14}" text-anchor="middle" '
        f'font-size="20" font-weight="800" fill="{COLORS["primary"]}">{bn_int(total)}</text>'
    )
    return (
        f'<svg width="{size}" height="{size}" viewBox="0 0 {size} {size}" '
        f'xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Donut chart">'
        f'{"".join(paths)}{center}</svg>'
    )

def hbar_chart(items: list[tuple[str, int]], max_val: int | None = None,
               color: str = COLORS["primary"], height_per: int = 28) -> str:
    """Horizontal bar chart (HTML table-based, email-safe)."""
    if not items:
        return "<p style='font-size:12px;color:#6b7280'>কোনো তথ্য নেই</p>"
    max_val = max_val or max(v for _, v in items)
    rows = []
    for label, val in items:
        pct = (val / max_val * 100) if max_val else 0
        rows.append(
            f'<tr>'
            f'<td style="font-size:12px;color:#374151;padding:5px 0;width:32%;vertical-align:middle;">{label}</td>'
            f'<td style="padding:5px 0;width:60%;"><div style="background:{color};height:14px;width:{pct:.1f}%;border-radius:3px;transition:width .3s"></div></td>'
            f'<td style="font-size:12px;color:#374151;padding:5px 0 5px 8px;width:8%;text-align:right;font-weight:600">{bn(val)}</td>'
            f'</tr>'
        )
    return (
        f'<table role="presentation" width="100%" cellpadding="0" cellspacing="0">'
        f'{"".join(rows)}</table>'
    )

def kpi_card(label: str, value: str, sublabel: str, accent: str,
             icon: str = "") -> str:
    return f"""
    <div style="background:#fff;border-radius:12px;padding:18px 16px;
                border:1px solid {COLORS['gray_200']};border-left:5px solid {accent};
                box-shadow:0 1px 3px rgba(0,0,0,0.04);">
      <div style="font-size:11px;font-weight:600;color:{COLORS['gray_500']};
                  text-transform:uppercase;letter-spacing:.6px;display:flex;align-items:center;gap:6px;">
        {icon}<span>{label}</span>
      </div>
      <div style="font-size:28px;font-weight:800;color:{accent};line-height:1.1;margin-top:6px;">
        {value}
      </div>
      <div style="font-size:11px;color:{COLORS['gray_500']};margin-top:4px;line-height:1.4;">
        {sublabel}
      </div>
    </div>
    """

def section_header(letter: str, title: str) -> str:
    return (
        f'<div style="background:linear-gradient(90deg,{COLORS["primary"]} 0%,{COLORS["primary_dark"]} 100%);'
        f'color:#fff;font-size:15px;font-weight:700;padding:10px 14px;border-radius:8px 8px 0 0;'
        f'display:flex;align-items:center;gap:8px;">'
        f'<span style="background:rgba(255,255,255,.18);width:24px;height:24px;border-radius:50%;'
        f'display:inline-flex;align-items:center;justify-content:center;font-size:13px;font-weight:700;">'
        f'{letter}</span>'
        f'<span>{title}</span></div>'
    )

def table_html(headers: list[str], rows: list[list[str]],
              col_widths: list[str] | None = None,
              align: list[str] | None = None,
              highlight_last: bool = True) -> str:
    """Render a styled HTML table. Headers in Bengali."""
    if col_widths is None:
        col_widths = ["auto"] * len(headers)
    if align is None:
        align = ["left"] + ["center"] * (len(headers) - 1)
    # Use a <colgroup> so the explicit widths actually take effect
    # (without table-layout:fixed, browsers otherwise size columns by content).
    colgroup = (
        '<colgroup>' + ''.join(
            f'<col style="width:{w};">' for w in col_widths
        ) + '</colgroup>'
    )
    head = "".join(
        f'<th style="background:{COLORS["primary_dark"]};color:#fff;padding:9px 10px;'
        f'font-weight:600;font-size:12px;text-align:{align[i]};'
        f'border-right:1px solid rgba(255,255,255,.1);">{h}</th>'
        for i, h in enumerate(headers)
    )
    body_rows = []
    n = len(rows)
    for idx, r in enumerate(rows):
        bg = "#fff" if idx % 2 == 0 else COLORS["primary_50"]
        is_last = (idx == n - 1) and highlight_last
        if is_last:
            bg = COLORS["primary_dark"]
            color = "#fff"
            weight = "700"
        else:
            color = COLORS["gray_900"]
            weight = "400"
        cells = "".join(
            f'<td style="background:{bg};color:{color};padding:8px 10px;font-size:12.5px;'
            f'font-weight:{weight};text-align:{align[i]};'
            f'border-bottom:1px solid {COLORS["gray_200"]};'
            f'word-break:break-word;overflow-wrap:break-word;">{c}</td>'
            for i, c in enumerate(r)
        )
        body_rows.append(f'<tr>{cells}</tr>')
    return (
        f'<table role="presentation" width="100%" cellpadding="0" cellspacing="0" '
        f'style="border:1px solid {COLORS['gray_200']};border-top:none;'
        f'border-radius:0 0 8px 8px;overflow:hidden;border-collapse:collapse;'
        f'table-layout:fixed;">'
        f'{colgroup}'
        f'<thead><tr>{head}</tr></thead>'
        f'<tbody>{"".join(body_rows)}</tbody></table>'
    )

def render_html(snap: ReportSnapshot) -> str:
    # Prepare category donut segments
    donut_segs = []
    palette_idx = 0
    for c in snap.categories:
        color = CHART_PALETTE[palette_idx % len(CHART_PALETTE)]
        donut_segs.append((f"{c.category} ({c.source})", c.seedlings, color))
        palette_idx += 1

    # Upazila bar chart
    upazila_items = [(u.name, u.combined_seedlings) for u in snap.upazilas if u.combined_seedlings > 0]
    upazila_max = max((u.combined_seedlings for u in snap.upazilas), default=1)

    # Top species
    species_items = [(s["name"][:32], s["seedlings"]) for s in snap.top_species[:8]]
    species_max = max((s["seedlings"] for s in snap.top_species), default=1)

    # Top SAAO
    saao_items = [(re.sub(r"\s+", " ", s["name"])[:40], s["entries"]) for s in snap.top_saao[:6]]
    saao_max = max((s["entries"] for s in snap.top_saao), default=1)

    # Source comparison rows
    src_rows = []
    for s in snap.sources:
        src_rows.append([
            s["name"],
            bn_int(s["entries"]),
            bn_int(s["seedlings"]),
            s["description"],
        ])
    src_rows.append([
        "সম্মিলিত সর্বমোট",
        bn_int(snap.total_entries),
        bn_int(snap.total_seedlings),
        "উভয় প্রতিবেদনের সমন্বিত ফলাফল",
    ])

    # Upazila rows
    upazila_rows = []
    total_e = total_s = 0
    for u in snap.upazilas:
        if u.combined_entries == 0:
            continue
        total_e += u.combined_entries
        total_s += u.combined_seedlings
        pct = (u.combined_seedlings / snap.total_seedlings * 100) if snap.total_seedlings else 0
        upazila_rows.append([
            u.name,
            bn_int(u.main_entries),
            bn_int(u.main_seedlings),
            bn_int(u.col17_entries),
            bn_int(u.col17_seedlings),
            bn_int(u.combined_entries),
            bn_int(u.combined_seedlings),
            bn_pct(pct),
        ])
    upazila_rows.append([
        "মোট",
        bn_int(snap.main_entries),
        bn_int(snap.main_seedlings),
        bn_int(snap.col17_entries),
        bn_int(snap.col17_seedlings),
        bn_int(snap.total_entries),
        bn_int(snap.total_seedlings),
        "১০০%",
    ])

    # Category rows
    cat_rows = []
    for c in snap.categories:
        pct = (c.seedlings / snap.total_seedlings * 100) if snap.total_seedlings else 0
        cat_rows.append([
            c.category,
            c.source,
            bn_int(c.entries),
            bn_int(c.seedlings),
            bn_pct(pct),
        ])
    cat_rows.append([
        "মোট",
        "—",
        bn_int(snap.total_entries),
        bn_int(snap.total_seedlings),
        "১০০%",
    ])

    # Data quality rows
    dq_rows_html = []
    for d in snap.data_quality:
        dq_rows_html.append([
            d.criterion,
            bn_int(d.count),
            bn_pct(d.pct),
            d.note,
        ])
    dq_rows_html.append([
        "মোট চিহ্নিত এন্ট্রি (আনুমানিক)",
        bn_int(snap.needs_verification),
        bn_pct(snap.needs_verification_pct),
        "কমপক্ষে একটি সমস্যাসহ এন্ট্রি",
    ])

    # Top species rows
    sp_rows = []
    for i, s in enumerate(snap.top_species[:8], 1):
        sp_rows.append([
            bn(i),
            s["name"][:48],
            bn_int(s["seedlings"]),
            bn_pct(s["pct"]),
        ])

    # Top SAAO rows
    saao_rows = []
    for i, s in enumerate(snap.top_saao[:6], 1):
        saao_rows.append([
            bn(i),
            re.sub(r"\s+", " ", s["name"])[:50],
            bn_int(s["entries"]),
        ])

    # Top officers
    officer_rows = []
    for i, s in enumerate(snap.top_officers[:6], 1):
        officer_rows.append([
            bn(i),
            re.sub(r"\s+", " ", s["name"])[:50],
            bn_int(s["entries"]),
        ])

    # Donut HTML
    donut_html = donut_svg(donut_segs, size=240)

    # Legend
    legend_items = []
    for i, (label, val, color) in enumerate(donut_segs):
        pct = (val / snap.total_seedlings * 100) if snap.total_seedlings else 0
        legend_items.append(
            f'<div style="display:flex;align-items:flex-start;gap:8px;font-size:12px;color:{COLORS["gray_700"]};padding:3px 0;line-height:1.4;">'
            f'<span style="width:12px;height:12px;border-radius:3px;background:{color};flex-shrink:0;margin-top:3px;"></span>'
            f'<span style="flex:1;min-width:0;word-break:break-word;overflow-wrap:break-word;">{label}</span>'
            f'<span style="font-weight:700;color:{COLORS["gray_900"]};white-space:nowrap;margin-left:6px;">{bn_int(val)} ({bn_pct(pct)})</span>'
            f'</div>'
        )
    legend_html = "".join(legend_items)

    # Notes
    notes_html = "".join(
        f'<li style="font-size:11.5px;color:{COLORS["gray_500"]};line-height:1.6;margin-bottom:4px;">{n}</li>'
        for n in snap.notes
    )

    # KPI cards (aligned with dashboard tab 6-card grid)
    kpis = (
        kpi_card("মোট এন্ট্রি", f"{bn_int(snap.total_entries)} টি",
                 f"মূল_ডাটা {bn_int(snap.main_entries)} + ১৭-কলাম {bn_int(snap.col17_entries)}",
                 COLORS["primary"], "📊") +
        kpi_card("মোট রোপণকৃত বৃক্ষ", f"{bn_int(snap.total_seedlings)} টি",
                 f"গড় {bn(snap.avg_per_entry)}টি/এন্ট্রি · সর্বোচ্চ {bn_int(snap.max_entry_qty)}",
                 COLORS["orange"], "🌿") +
        kpi_card("উপজেলা কভারেজ", f"{bn(snap.upazila_coverage)} / {bn(snap.upazila_total)}",
                 f"{bn(snap.upazila_coverage)}টি উপজেলায় রোপণ নিশ্চিত",
                 COLORS["cyan"], "📍") +
        kpi_card("প্রজাতি সংখ্যা", f"{bn_int(snap.species_count)} প্রকার",
                 "ফলদ · ঔষধি · বনজ · মিশ্র",
                 COLORS["purple"], "🌳") +
        kpi_card("কৃষক ও কর্মকর্তা",
                 f"{bn_int(snap.unique_farmers)} কৃষক",
                 f"{bn_int(snap.unique_saao)} SAAO · {bn_int(snap.unique_officers)} মনিটরিং অফিসার",
                 COLORS["blue"], "👥") +
        kpi_card("যাচাই প্রয়োজন", f"{bn_int(snap.needs_verification)} টি",
                 f"মোটের {bn_pct(snap.needs_verification_pct)} — পরবর্তী সপ্তাহে সংশোধনযোগ্য",
                 COLORS["red"], "⚠️")
    )

    # HTML document
    html = f"""<!DOCTYPE html>
<html lang="bn">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<meta name="description" content="কুড়িগ্রাম জেলার সাপ্তাহিক বৃক্ষরোপণ কর্মসূচির অগ্রগতি প্রতিবেদন — কৃষি সম্প্রসারণ অধিদপ্তর।">
<title>{snap.title}</title>
<style>
  * {{ box-sizing: border-box; }}
  body {{
    margin:0; padding:0;
    background:linear-gradient(180deg,#f0fdf4 0%,#f9fafb 280px);
    font-family:'Noto Sans Bengali','Segoe UI',Arial,sans-serif;
    color:{COLORS["gray_900"]};
    -webkit-font-smoothing:antialiased;
  }}
  a {{ color:{COLORS["primary_dark"]}; text-decoration:none; }}
  a:hover {{ text-decoration:underline; }}
  @media print {{
    body {{ background:#fff; }}
    .no-print {{ display:none !important; }}
    .page-break {{ page-break-before: always; }}
  }}
</style>
</head>
<body>
<!-- Preheader (hidden preview text for email clients) -->
<div style="display:none;max-height:0;overflow:hidden;opacity:0;">
কুড়িগ্রাম জেলায় এ পর্যন্ত {bn_int(snap.total_entries)}টি এন্ট্রিতে {bn_int(snap.total_seedlings)}টি বৃক্ষ রোপণ সম্পন্ন — {bn(snap.upazila_coverage)}/{bn(snap.upazila_total)} উপজেলায় কভারেজ। সম্পূর্ণ উপজেলা, প্রজাতি ও ডাটা-মান বিবরণ ভিতরে।
</div>

<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="padding:24px 0;">
<tr><td align="center">
<table role="presentation" width="920" cellpadding="0" cellspacing="0" style="background-color:#FFFFFF;border-radius:14px;overflow:hidden;box-shadow:0 4px 24px rgba(0,0,0,0.06);">

  <!-- ===== HERO HEADER ===== -->
  <tr>
    <td style="background:linear-gradient(135deg,{COLORS["primary_dark"]} 0%,{COLORS["primary"]} 60%,{COLORS["primary"]} 100%);padding:32px 36px;position:relative;">
      <div style="font-size:11px;letter-spacing:2px;color:rgba(255,255,255,.78);text-transform:uppercase;font-weight:600;">
        কৃষি সম্প্রসারণ অধিদপ্তর &nbsp;•&nbsp; {snap.division} বিভাগ &nbsp;•&nbsp; {snap.district} জেলা
      </div>
      <div style="font-size:26px;line-height:34px;font-weight:800;color:#FFFFFF;margin-top:8px;">
        {snap.title}
      </div>
      <div style="font-size:13.5px;color:rgba(255,255,255,.92);margin-top:10px;line-height:1.6;">
        {snap.subtitle}
      </div>
      <div style="margin-top:14px;display:flex;flex-wrap:wrap;gap:8px;font-size:12px;color:#fff;">
        <span style="background:rgba(255,255,255,.14);padding:5px 12px;border-radius:999px;font-weight:600;">📅 প্রতিবেদন: <strong>{snap.report_date}</strong></span>
        <span style="background:rgba(255,255,255,.14);padding:5px 12px;border-radius:999px;font-weight:600;">🏢 {snap.office}</span>
        <span style="background:rgba(255,255,255,.14);padding:5px 12px;border-radius:999px;font-weight:600;">🔄 স্বয়ংক্রিয়ভাবে প্রস্তুতকৃত</span>
      </div>
    </td>
  </tr>

  <!-- ===== EXECUTIVE SUMMARY ===== -->
  <tr>
    <td style="padding:28px 36px 8px 36px;">
      <div style="background:{COLORS["amber_light"]};border:1px solid #fde68a;border-radius:10px;padding:16px 18px;">
        <div style="font-size:12px;font-weight:700;color:{COLORS["amber_dark"]};text-transform:uppercase;letter-spacing:.6px;margin-bottom:6px;">
          📋 নির্বাহী সারসংক্ষেপ
        </div>
        <p style="font-size:13.5px;line-height:1.75;color:{COLORS["gray_900"]};margin:0;">
          মহোদয়, শুভেচ্ছা নিবেন। কৃষি সম্প্রসারণ অধিদপ্তর ও কৃষি মন্ত্রণালয়ের নিয়মিত নির্দেশনার আলোকে <strong>{snap.district} জেলা</strong>-এর বৃক্ষরোপণ কর্মসূচির হালনাগাদ অগ্রগতি প্রতিবেদন স্বয়ংক্রিয়ভাবে প্রস্তুত করা হয়েছে। সংযুক্ত এক্সেল ফাইলে চারটি শীট রয়েছে — <strong>সারসংক্ষেপ ড্যাশবোর্ড</strong>, <strong>মূল_ডাটা</strong> ({bn_int(snap.main_entries)} এন্ট্রি), <strong>১৭_কলাম_প্রতিবেদন</strong> ({bn_int(snap.col17_entries)} এন্ট্রি), এবং <strong>উপজেলাভিত্তিক_বিশ্লেষণ</strong>। উভয় সরকারি উৎস অপরিবর্তিতভাবে সংযুক্ত করা হয়েছে এবং একত্রিত সম্মিলিত ফলাফল নিচে উপস্থাপন করা হলো।
        </p>
      </div>
    </td>
  </tr>

  <!-- ===== KPI DASHBOARD GRID (aligned with Dashboard tab) ===== -->
  <tr>
    <td style="padding:20px 36px 8px 36px;">
      <div style="font-size:13px;font-weight:700;color:{COLORS["gray_700"]};margin-bottom:10px;display:flex;align-items:center;gap:6px;">
        <span style="width:4px;height:14px;background:{COLORS["primary"]};border-radius:2px;"></span>
        মূল সূচক ড্যাশবোর্ড (KPI Dashboard)
      </div>
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
        <tr>
          <td width="33.33%" valign="top" style="padding:4px;">{kpi_card("মোট এন্ট্রি", f"{bn_int(snap.total_entries)} টি", f"মূল_ডাটা {bn_int(snap.main_entries)} + ১৭-কলাম {bn_int(snap.col17_entries)}", COLORS["primary"], "📊")}</td>
          <td width="33.33%" valign="top" style="padding:4px;">{kpi_card("মোট রোপণকৃত বৃক্ষ", f"{bn_int(snap.total_seedlings)} টি", f"গড় {bn(snap.avg_per_entry)}টি/এন্ট্রি · সর্বোচ্চ {bn_int(snap.max_entry_qty)}", COLORS["orange"], "🌿")}</td>
          <td width="33.33%" valign="top" style="padding:4px;">{kpi_card("উপজেলা কভারেজ", f"{bn(snap.upazila_coverage)} / {bn(snap.upazila_total)}", f"{bn(snap.upazila_coverage)}টি উপজেলায় রোপণ নিশ্চিত", COLORS["cyan"], "📍")}</td>
        </tr>
        <tr>
          <td width="33.33%" valign="top" style="padding:4px;">{kpi_card("প্রজাতি সংখ্যা", f"{bn_int(snap.species_count)} প্রকার", "ফলদ · ঔষধি · বনজ · মিশ্র", COLORS["purple"], "🌳")}</td>
          <td width="33.33%" valign="top" style="padding:4px;">{kpi_card("কৃষক ও কর্মকর্তা", f"{bn_int(snap.unique_farmers)} কৃষক", f"{bn_int(snap.unique_saao)} SAAO · {bn_int(snap.unique_officers)} মনিটরিং অফিসার", COLORS["blue"], "👥")}</td>
          <td width="33.33%" valign="top" style="padding:4px;">{kpi_card("যাচাই প্রয়োজন", f"{bn_int(snap.needs_verification)} টি", f"মোটের {bn_pct(snap.needs_verification_pct)} — পরবর্তী সপ্তাহে সংশোধনযোগ্য", COLORS["red"], "⚠️")}</td>
        </tr>
      </table>
    </td>
  </tr>

  <!-- ===== CHARTS ROW 1: Category donut + Upazila bar ===== -->
  <tr>
    <td style="padding:20px 36px 8px 36px;">
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
        <tr>
          <td width="48%" valign="top" style="padding-right:10px;">
            <div style="background:#fff;border:1px solid {COLORS["gray_200"]};border-radius:10px;padding:16px 18px;">
              <div style="font-size:13px;font-weight:700;color:{COLORS["gray_700"]};margin-bottom:10px;display:flex;align-items:center;gap:6px;">
                <span style="width:4px;height:14px;background:{COLORS["purple"]};border-radius:2px;"></span>
                🥧 প্রজাতি ক্যাটাগরি অনুপাত
              </div>
              <div style="display:flex;align-items:center;gap:16px;flex-wrap:wrap;">
                <div style="flex-shrink:0;">{donut_html}</div>
                <div style="flex:1;min-width:220px;">{legend_html}</div>
              </div>
            </div>
          </td>
          <td width="52%" valign="top" style="padding-left:10px;">
            <div style="background:#fff;border:1px solid {COLORS["gray_200"]};border-radius:10px;padding:16px 18px;">
              <div style="font-size:13px;font-weight:700;color:{COLORS["gray_700"]};margin-bottom:10px;display:flex;align-items:center;gap:6px;">
                <span style="width:4px;height:14px;background:{COLORS["primary"]};border-radius:2px;"></span>
                📊 উপজেলাভিত্তিক রোপণকৃত বৃক্ষ
              </div>
              {hbar_chart(upazila_items, upazila_max, COLORS["primary"])}
            </div>
          </td>
        </tr>
      </table>
    </td>
  </tr>

  <!-- ===== CHARTS ROW 2: Top species + Top SAAO ===== -->
  <tr>
    <td style="padding:8px 36px 8px 36px;">
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
        <tr>
          <td width="50%" valign="top" style="padding-right:10px;">
            <div style="background:#fff;border:1px solid {COLORS["gray_200"]};border-radius:10px;padding:16px 18px;">
              <div style="font-size:13px;font-weight:700;color:{COLORS["gray_700"]};margin-bottom:10px;display:flex;align-items:center;gap:6px;">
                <span style="width:4px;height:14px;background:{COLORS["orange"]};border-radius:2px;"></span>
                🌿 শীর্ষ ৮ প্রজাতি
              </div>
              {hbar_chart(species_items, species_max, COLORS["orange"])}
            </div>
          </td>
          <td width="50%" valign="top" style="padding-left:10px;">
            <div style="background:#fff;border:1px solid {COLORS["gray_200"]};border-radius:10px;padding:16px 18px;">
              <div style="font-size:13px;font-weight:700;color:{COLORS["gray_700"]};margin-bottom:10px;display:flex;align-items:center;gap:6px;">
                <span style="width:4px;height:14px;background:{COLORS["blue"]};border-radius:2px;"></span>
                👤 শীর্ষ SAAO (এন্ট্রি সংখ্যা)
              </div>
              {hbar_chart(saao_items, saao_max, COLORS["blue"])}
            </div>
          </td>
        </tr>
      </table>
    </td>
  </tr>

  <!-- ===== SECTION A: Upazila table ===== -->
  <tr>
    <td style="padding:24px 36px 0 36px;">
      {section_header("ক", "সম্মিলিত উপজেলাভিত্তিক অগ্রগতি (দুই উৎসের একত্রীকরণ)")}
      {table_html(
          ["উপজেলা", "মূল_ডাটা\nএন্ট্রি", "মূল_ডাটা\nগাছ", "১৭-কলাম\nএন্ট্রি", "১৭-কলাম\nগাছ", "সম্মিলিত\nএন্ট্রি", "সম্মিলিত\nগাছ", "%"],
          upazila_rows,
          col_widths=["22%","10%","11%","10%","11%","10%","13%","7%"],
          align=["left","center","center","center","center","center","center","center"]
      )}
    </td>
  </tr>

  <!-- ===== SECTION B: Category table ===== -->
  <tr>
    <td style="padding:24px 36px 0 36px;">
      {section_header("খ", "প্রজাতি ক্যাটাগরিভিত্তিক বিবরণ")}
      {table_html(
          ["ক্যাটাগরি", "উৎস", "এন্ট্রি", "মোট চারা", "%"],
          cat_rows,
          col_widths=["35%","22%","13%","18%","12%"],
          align=["left","left","center","center","center"]
      )}
    </td>
  </tr>

  <!-- ===== SECTION C: Source comparison ===== -->
  <tr>
    <td style="padding:24px 36px 0 36px;">
      {section_header("গ", "উৎসভিত্তিক তুলনা (Source Comparison)")}
      {table_html(
          ["তথ্য উৎস (শীট)", "এন্ট্রি", "মোট চারা", "বিবরণ"],
          src_rows,
          col_widths=["30%","13%","14%","43%"],
          align=["left","center","center","left"]
      )}
    </td>
  </tr>

  <!-- ===== SECTION D: Top species table ===== -->
  <tr>
    <td style="padding:24px 36px 0 36px;">
      {section_header("ঘ", "শীর্ষ ৮ প্রজাতি (উভয় উৎস সম্মিলিত)")}
      {table_html(
          ["ক্র.", "প্রজাতির নাম", "মোট চারা", "%"],
          sp_rows,
          col_widths=["7%","68%","15%","10%"],
          align=["center","left","center","center"]
      )}
    </td>
  </tr>

  <!-- ===== SECTION E: Top SAAO + Top Officers side-by-side ===== -->
  <tr>
    <td style="padding:24px 36px 0 36px;">
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
        <tr>
          <td width="50%" valign="top" style="padding-right:8px;vertical-align:top;">
            {section_header("ঙ", "শীর্ষ SAAO (এন্ট্রি সংখ্যা)")}
            {table_html(
                ["ক্র.", "নাম ও মোবাইল", "এন্ট্রি"],
                saao_rows,
                col_widths=["8%","72%","20%"],
                align=["center","left","center"],
                highlight_last=False
            )}
          </td>
          <td width="50%" valign="top" style="padding-left:8px;vertical-align:top;">
            {section_header("চ", "শীর্ষ মনিটরিং অফিসার")}
            {table_html(
                ["ক্র.", "নাম ও মোবাইল", "এন্ট্রি"],
                officer_rows,
                col_widths=["8%","72%","20%"],
                align=["center","left","center"],
                highlight_last=False
            )}
          </td>
        </tr>
      </table>
    </td>
  </tr>

  <!-- ===== SECTION F: Data quality ===== -->
  <tr>
    <td style="padding:24px 36px 0 36px;">
      {section_header("ছ", "ডাটা মান যাচাই (১৭_কলাম_প্রতিবেদন)")}
      {table_html(
          ["মানদণ্ড", "এন্ট্রি সংখ্যা", "সব এন্ট্রির %", "মন্তব্য"],
          dq_rows_html,
          col_widths=["32%","15%","15%","38%"],
          align=["left","center","center","left"]
      )}
      <div style="background:{COLORS["gray_50"]};border:1px solid {COLORS["gray_200"]};border-radius:8px;padding:12px 14px;margin-top:10px;font-size:11.5px;color:{COLORS["gray_500"]};line-height:1.6;">
        <strong style="color:{COLORS["gray_700"]};">নোট:</strong> এন্ট্রিগুলোর মধ্যে ১টি এন্ট্রিতে একাধিক সমস্যা থাকতে পারে, তাই মানদণ্ডগুলোর যোগফল "মোট চিহ্নিত এন্ট্রি" থেকে বেশি হতে পারে। সমস্যাগুলো সংশ্লিষ্ট ইউনিয়ন/উপজেলার এসএএও ও মনিটরিং অফিসারের মাধ্যমে ভেরিফাই করে পরবর্তী প্রতিবেদনে সংশোধন করতে হবে।
      </div>
    </td>
  </tr>

  <!-- ===== NOTES & METHODOLOGY ===== -->
  <tr>
    <td style="padding:24px 36px 0 36px;">
      <div style="background:{COLORS["primary_50"]};border:1px solid {COLORS["primary_light"]};border-radius:10px;padding:16px 18px;">
        <div style="font-size:12px;font-weight:700;color:{COLORS["primary_dark"]};text-transform:uppercase;letter-spacing:.6px;margin-bottom:8px;">
          📘 পদ্ধতিগত নোট ও সূত্র
        </div>
        <ul style="margin:0;padding-left:18px;">{notes_html}</ul>
        <div style="font-size:11px;color:{COLORS["gray_500"]};margin-top:10px;padding-top:10px;border-top:1px dashed {COLORS["gray_300"]};line-height:1.6;">
          প্রতিবেদনটি স্বয়ংক্রিয়ভাবে <strong>Tree_Plantation_Reporting_Workbook.xlsx</strong> থেকে ইউনিকোড NFC নরমালাইজেশন ও উপজেলার নামের বানান সামঞ্জস্য করে তৈরি করা হয়েছে। সর্বশেষ আপডেট: <strong>{snap.generated_at}</strong>।
        </div>
      </div>
    </td>
  </tr>

  <!-- ===== ATTACHMENT NOTE ===== -->
  <tr>
    <td style="padding:20px 36px 0 36px;">
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:{COLORS["amber_light"]};border:1px solid #fde68a;border-radius:10px;">
        <tr>
          <td style="padding:14px 18px;font-size:13px;color:{COLORS["amber_dark"]};line-height:1.7;">
            📎 <strong>সংযুক্তি:</strong> <code style="background:#fff;padding:2px 6px;border-radius:4px;font-size:12px;">weekly-report.xlsx</code> — চারটি শীট: <strong>সারসংক্ষেপ</strong> (ড্যাশবোর্ড ও চার্ট), <strong>মূল_ডাটা</strong> ({bn_int(snap.main_entries)}টি এন্ট্রির বিস্তারিত রেজিস্ট্রি — GPS, কৃষক, এসএএও, মনিটরিং অফিসারসহ), <strong>১৭_কলাম_প্রতিবেদন</strong> (সরকারি মানক ফরম্যাটে {bn_int(snap.col17_entries)}টি এন্ট্রি), এবং <strong>উপজেলাভিত্তিক_বিশ্লেষণ</strong> (পূর্বে-গণনাকৃত সম্মিলিত পরিসংখ্যান)।
          </td>
        </tr>
      </table>
    </td>
  </tr>

  <!-- ===== CLOSING ===== -->
  <tr>
    <td style="padding:24px 36px 4px 36px;font-size:14px;line-height:1.7;color:{COLORS["gray_900"]};">
      প্রতিবেদনটি আপনার সদয় অবগতি ও পরবর্তী প্রয়োজনীয় ব্যবস্থা গ্রহণের জন্য পেশ করা হলো।
    </td>
  </tr>
  <tr>
    <td style="padding:14px 36px 28px 36px;font-size:14px;line-height:1.7;color:{COLORS["gray_900"]};">
      ধন্যবাদান্তে,<br>
      <strong>{snap.office}</strong>
    </td>
  </tr>

  <!-- ===== FOOTER ===== -->
  <tr>
    <td style="background:{COLORS["gray_100"]};padding:16px 36px;border-top:1px solid {COLORS["gray_200"]};">
      <div style="font-size:11px;color:{COLORS["gray_500"]};line-height:1.6;">
        এটি {snap.district} জেলার সাপ্তাহিক বৃক্ষরোপণ কর্মসূচির একটি স্বয়ংক্রিয়ভাবে-প্রস্তুতকৃত অগ্রগতি প্রতিবেদন। তথ্যসূত্র: DAE {snap.district} App_Entry রেজিস্ট্রি · Tree_Plantation_Reporting_Workbook.xlsx। প্রতিবেদন আইডি: WR-{snap.report_date.replace(" ","-").replace(",","")}
      </div>
    </td>
  </tr>

</table>
</td></tr>
</table>
</body>
</html>
"""
    return html


# ---------------------------------------------------------------------------
# XLSX report generation
# ---------------------------------------------------------------------------

def render_xlsx(snap: ReportSnapshot, src_xlsx: str, out_path: str) -> None:
    """Generate a 4-sheet XLSX report with native charts.

    Args:
        snap: Computed ReportSnapshot.
        src_xlsx: Source workbook path (used to copy the raw মূল_ডাটা and
            ১৭_কলাম_প্রতিবেদন sheets verbatim into the output workbook).
        out_path: Where to write the generated XLSX file.
    """
    # Copy source workbook as starting point (preserves মূল_ডাটা + ১৭_কলাম exactly)
    src_wb = openpyxl.load_workbook(src_xlsx, data_only=False)

    # Create fresh workbook — we'll re-create all sheets with proper formatting
    wb = openpyxl.Workbook()
    # Remove default sheet
    wb.remove(wb.active)

    # Styles
    thin = Side(border_style="thin", color="d1d5db")
    medium = Side(border_style="medium", color="15803d")
    border_all = Border(left=thin, right=thin, top=thin, bottom=thin)

    title_font = Font(name="Noto Sans Bengali", size=18, bold=True, color="15803d")
    subtitle_font = Font(name="Noto Sans Bengali", size=11, color="6b7280")
    section_font = Font(name="Noto Sans Bengali", size=12, bold=True, color="ffffff")
    header_font = Font(name="Noto Sans Bengali", size=11, bold=True, color="ffffff")
    cell_font = Font(name="Noto Sans Bengali", size=11, color="111827")
    bold_font = Font(name="Noto Sans Bengali", size=11, bold=True, color="111827")
    kpi_label_font = Font(name="Noto Sans Bengali", size=9, bold=True, color="6b7280")
    kpi_value_font = Font(name="Noto Sans Bengali", size=20, bold=True, color="15803d")

    section_fill = PatternFill("solid", fgColor="15803d")
    header_fill = PatternFill("solid", fgColor="166534")
    alt_fill = PatternFill("solid", fgColor="f0fdf4")
    total_fill = PatternFill("solid", fgColor="fef3c7")
    kpi_fills = {
        "primary": PatternFill("solid", fgColor="f0fdf4"),
        "orange": PatternFill("solid", fgColor="fff7ed"),
        "blue": PatternFill("solid", fgColor="eff6ff"),
        "cyan": PatternFill("solid", fgColor="ecfeff"),
        "purple": PatternFill("solid", fgColor="faf5ff"),
        "red": PatternFill("solid", fgColor="fef2f2"),
        "amber": PatternFill("solid", fgColor="fffbeb"),
    }
    kpi_value_colors = {
        "primary": "15803d", "orange": "ea580c", "blue": "2563eb",
        "cyan": "0891b2", "purple": "7c3aed", "red": "dc2626",
        "amber": "92400e",
    }

    center = Alignment(horizontal="center", vertical="center", wrap_text=True)
    left = Alignment(horizontal="left", vertical="center", wrap_text=True)
    right = Alignment(horizontal="right", vertical="center", wrap_text=True)

    # ===================== SHEET 1: সারসংক্ষেপ =====================
    ws = wb.create_sheet("সারসংক্ষেপ")
    # Column widths
    widths = [3, 26, 14, 14, 14, 14, 14, 14, 14]
    for i, w in enumerate(widths, 1):
        ws.column_dimensions[get_column_letter(i)].width = w

    # Title (B1:H1)
    ws.merge_cells("B1:I1")
    ws["B1"] = snap.title
    ws["B1"].font = title_font
    ws["B1"].alignment = center
    ws.row_dimensions[1].height = 36

    # Subtitle (B2:H2)
    ws.merge_cells("B2:I2")
    ws["B2"] = snap.subtitle
    ws["B2"].font = subtitle_font
    ws["B2"].alignment = center
    ws.row_dimensions[2].height = 22

    # Meta (B3:I3)
    ws.merge_cells("B3:I3")
    ws["B3"] = f"প্রতিবেদন প্রস্তুতের তারিখ: {snap.report_date}   |   প্রস্তুতকারী: {snap.office}   |   সর্বশেষ আপডেট: {snap.generated_at}"
    ws["B3"].font = Font(name="Noto Sans Bengali", size=10, color="6b7280", italic=True)
    ws["B3"].alignment = center
    ws.row_dimensions[3].height = 18

    # Spacer row 4
    ws.row_dimensions[4].height = 8

    # ===== KPI cards (Row 5-7) — 6 cards across B:I =====
    # 6 cards: each card = 1 label row + 1 value row, taking 1 cell wide
    # We'll use cols B..G (6 cells wide)
    kpi_data = [
        ("মোট এন্ট্রি", f"{snap.total_entries} টি", "primary"),
        ("মোট রোপণকৃত বৃক্ষ", f"{snap.total_seedlings} টি", "orange"),
        ("উপজেলা কভারেজ", f"{snap.upazila_coverage} / {snap.upazila_total}", "cyan"),
        ("প্রজাতি সংখ্যা", f"{snap.species_count} প্রকার", "purple"),
        ("কৃষক সংখ্যা", f"{snap.unique_farmers} জন", "blue"),
        ("যাচাই প্রয়োজন", f"{snap.needs_verification} টি", "red"),
    ]
    ws.row_dimensions[5].height = 18
    ws.row_dimensions[6].height = 34
    for i, (label, val, key) in enumerate(kpi_data):
        col = i + 2  # start at B (col 2)
        cell_l = ws.cell(row=5, column=col, value=label)
        cell_l.font = kpi_label_font
        cell_l.alignment = center
        cell_l.fill = kpi_fills[key]
        cell_l.border = Border(top=thin, left=thin, right=thin)

        cell_v = ws.cell(row=6, column=col, value=val)
        cell_v.font = Font(name="Noto Sans Bengali", size=16, bold=True,
                           color=kpi_value_colors[key])
        cell_v.alignment = center
        cell_v.fill = kpi_fills[key]
        cell_v.border = Border(left=thin, right=thin, bottom=thin)

    # Spacer row 7
    ws.row_dimensions[7].height = 12

    # ===== SECTION A: Upazila table (Row 8) =====
    ws.merge_cells("B8:I8")
    ws["B8"] = "ক. সম্মিলিত উপজেলাভিত্তিক অগ্রগতি (দুই উৎসের একত্রীকরণ)"
    ws["B8"].font = section_font
    ws["B8"].fill = section_fill
    ws["B8"].alignment = left
    ws.row_dimensions[8].height = 26

    # Header row 9
    headers_a = ["উপজেলা", "মূল_ডাটা\nএন্ট্রি", "মূল_ডাটা\nগাছ", "১৭-কলাম\nএন্ট্রি",
                 "১৭-কলাম\nগাছ", "সম্মিলিত\nএন্ট্রি", "সম্মিলিত\nগাছ", "%"]
    for i, h in enumerate(headers_a):
        c = ws.cell(row=9, column=i + 2, value=h)
        c.font = header_font
        c.fill = header_fill
        c.alignment = center
        c.border = border_all
    ws.row_dimensions[9].height = 32

    # Data rows
    row = 10
    upazila_with_data = [u for u in snap.upazilas if u.combined_entries > 0]
    for idx, u in enumerate(upazila_with_data):
        is_alt = idx % 2 == 1
        fill = alt_fill if is_alt else None
        pct = (u.combined_seedlings / snap.total_seedlings) if snap.total_seedlings else 0
        vals = [u.name, u.main_entries, u.main_seedlings, u.col17_entries,
                u.col17_seedlings, u.combined_entries, u.combined_seedlings,
                pct]
        for i, v in enumerate(vals):
            c = ws.cell(row=row, column=i + 2, value=v)
            c.font = cell_font
            c.alignment = left if i == 0 else center
            c.border = border_all
            if fill:
                c.fill = fill
            if i == 7:
                c.number_format = "0.0%"
        row += 1

    # Total row
    total_vals = ["মোট", snap.main_entries, snap.main_seedlings,
                  snap.col17_entries, snap.col17_seedlings,
                  snap.total_entries, snap.total_seedlings, 1.0]
    for i, v in enumerate(total_vals):
        c = ws.cell(row=row, column=i + 2, value=v)
        c.font = bold_font
        c.fill = total_fill
        c.alignment = left if i == 0 else center
        c.border = Border(top=medium, bottom=medium, left=thin, right=thin)
        if i == 7:
            c.number_format = "0.0%"
    last_upazila_row = row
    row += 2

    # === Chart 1: Bar chart of upazila seedlings ===
    chart1 = BarChart()
    chart1.type = "bar"
    chart1.style = 11
    chart1.title = "উপজেলাভিত্তিক সম্মিলিত রোপণকৃত বৃক্ষ"
    chart1.y_axis.title = "উপজেলা"
    chart1.x_axis.title = "গাছ সংখ্যা"
    chart1.height = 12
    chart1.width = 18
    # Data: column G (combined_seedlings, col index 7→letter G), rows 10..last_upazila_row
    data_ref = Reference(ws, min_col=7, min_row=9, max_col=7, max_row=last_upazila_row - 1)
    cats_ref = Reference(ws, min_col=2, min_row=10, max_row=last_upazila_row - 1)
    chart1.add_data(data_ref, titles_from_data=True)
    chart1.set_categories(cats_ref)
    chart1.legend = None
    ws.add_chart(chart1, f"B{row}")
    row += 22

    # ===== SECTION B: Source comparison =====
    ws.merge_cells(f"B{row}:I{row}")
    c = ws.cell(row=row, column=2, value="গ. উৎসভিত্তিক তুলনা (Source Comparison)")
    c.font = section_font
    c.fill = section_fill
    c.alignment = left
    ws.row_dimensions[row].height = 26
    row += 1
    headers_c = ["তথ্য উৎস (শীট)", "এন্ট্রি সংখ্যা", "মোট চারা/বৃক্ষ সংখ্যা", "বিবরণ"]
    # Use merged cells for description
    for i, h in enumerate(headers_c):
        cc = ws.cell(row=row, column=i + 2, value=h)
        cc.font = header_font
        cc.fill = header_fill
        cc.alignment = center
        cc.border = border_all
    # merge col E:I for description
    ws.merge_cells(start_row=row, start_column=5, end_row=row, end_column=9)
    ws.row_dimensions[row].height = 28
    row += 1
    for idx, s in enumerate(snap.sources):
        is_alt = idx % 2 == 1
        fill = alt_fill if is_alt else None
        cells_vals = [s["name"], s["entries"], s["seedlings"], s["description"]]
        for i, v in enumerate(cells_vals):
            cc = ws.cell(row=row, column=i + 2, value=v)
            cc.font = cell_font
            cc.alignment = left if i in (0, 3) else center
            cc.border = border_all
            if fill:
                cc.fill = fill
        # merge description E:I
        ws.merge_cells(start_row=row, start_column=5, end_row=row, end_column=9)
        row += 1
    # Total row
    total_vals = ["সম্মিলিত সর্বমোট", snap.total_entries, snap.total_seedlings,
                  "উভয় প্রতিবেদনের সমন্বিত ফলাফল"]
    for i, v in enumerate(total_vals):
        cc = ws.cell(row=row, column=i + 2, value=v)
        cc.font = bold_font
        cc.fill = total_fill
        cc.alignment = left if i in (0, 3) else center
        cc.border = Border(top=medium, bottom=medium, left=thin, right=thin)
    ws.merge_cells(start_row=row, start_column=5, end_row=row, end_column=9)
    src_total_row = row
    row += 2

    # ===== SECTION D: Category table (for donut chart) =====
    ws.merge_cells(f"B{row}:I{row}")
    c = ws.cell(row=row, column=2, value="ঘ. প্রজাতি ক্যাটাগরিভিত্তিক বিবরণ")
    c.font = section_font
    c.fill = section_fill
    c.alignment = left
    ws.row_dimensions[row].height = 26
    row += 1
    headers_d = ["ক্যাটাগরি", "উৎস", "এন্ট্রি সংখ্যা", "মোট চারা সংখ্যা", "%"]
    for i, h in enumerate(headers_d):
        cc = ws.cell(row=row, column=i + 2, value=h)
        cc.font = header_font
        cc.fill = header_fill
        cc.alignment = center
        cc.border = border_all
    ws.row_dimensions[row].height = 28
    cat_header_row = row
    row += 1
    cat_start = row
    for idx, cc_row in enumerate(snap.categories):
        is_alt = idx % 2 == 1
        fill = alt_fill if is_alt else None
        pct = (cc_row.seedlings / snap.total_seedlings) if snap.total_seedlings else 0
        vals = [cc_row.category, cc_row.source, cc_row.entries,
                cc_row.seedlings, pct]
        for i, v in enumerate(vals):
            cc = ws.cell(row=row, column=i + 2, value=v)
            cc.font = cell_font
            cc.alignment = left if i in (0, 1) else center
            cc.border = border_all
            if fill:
                cc.fill = fill
            if i == 4:
                cc.number_format = "0.0%"
        row += 1
    # Total
    total_vals = ["মোট", "—", snap.total_entries, snap.total_seedlings, 1.0]
    for i, v in enumerate(total_vals):
        cc = ws.cell(row=row, column=i + 2, value=v)
        cc.font = bold_font
        cc.fill = total_fill
        cc.alignment = left if i in (0, 1) else center
        cc.border = Border(top=medium, bottom=medium, left=thin, right=thin)
        if i == 4:
            cc.number_format = "0.0%"
    cat_end_row = row - 1
    row += 2

    # === Chart 2: Doughnut chart of categories ===
    chart2 = DoughnutChart()
    chart2.title = "প্রজাতি ক্যাটাগরি অনুপাত"
    chart2.style = 26
    chart2.height = 11
    chart2.width = 14
    data_ref2 = Reference(ws, min_col=5, min_row=cat_header_row,
                          max_col=5, max_row=cat_end_row)
    cats_ref2 = Reference(ws, min_col=2, min_row=cat_start, max_row=cat_end_row)
    chart2.add_data(data_ref2, titles_from_data=True)
    chart2.set_categories(cats_ref2)
    chart2.dataLabels = DataLabelList(showPercent=True)
    ws.add_chart(chart2, f"B{row}")
    row += 20

    # ===== SECTION E: Data quality =====
    ws.merge_cells(f"B{row}:I{row}")
    c = ws.cell(row=row, column=2, value="ঙ. ডাটা মান যাচাই (১৭_কলাম_প্রতিবেদন)")
    c.font = section_font
    c.fill = section_fill
    c.alignment = left
    ws.row_dimensions[row].height = 26
    row += 1
    headers_e = ["মানদণ্ড", "এন্ট্রি সংখ্যা", "সব এন্ট্রির %", "মন্তব্য"]
    for i, h in enumerate(headers_e):
        cc = ws.cell(row=row, column=i + 2, value=h)
        cc.font = header_font
        cc.fill = header_fill
        cc.alignment = center
        cc.border = border_all
    ws.merge_cells(start_row=row, start_column=5, end_row=row, end_column=9)
    ws.row_dimensions[row].height = 28
    row += 1
    for idx, d in enumerate(snap.data_quality):
        is_alt = idx % 2 == 1
        fill = alt_fill if is_alt else None
        pct = d.pct / 100
        vals = [d.criterion, d.count, pct, d.note]
        for i, v in enumerate(vals):
            cc = ws.cell(row=row, column=i + 2, value=v)
            cc.font = cell_font
            cc.alignment = left if i in (0, 3) else center
            cc.border = border_all
            if fill:
                cc.fill = fill
            if i == 2:
                cc.number_format = "0.0%"
        ws.merge_cells(start_row=row, start_column=5, end_row=row, end_column=9)
        row += 1
    # Total flagged row
    pct = snap.needs_verification_pct / 100
    vals = ["মোট চিহ্নিত এন্ট্রি (আনুমানিক)", snap.needs_verification, pct,
            "কমপক্ষে একটি সমস্যাসহ এন্ট্রি"]
    for i, v in enumerate(vals):
        cc = ws.cell(row=row, column=i + 2, value=v)
        cc.font = bold_font
        cc.fill = total_fill
        cc.alignment = left if i in (0, 3) else center
        cc.border = Border(top=medium, bottom=medium, left=thin, right=thin)
        if i == 2:
            cc.number_format = "0.0%"
    ws.merge_cells(start_row=row, start_column=5, end_row=row, end_column=9)
    row += 2

    # ===== Notes =====
    ws.merge_cells(f"B{row}:I{row}")
    c = ws.cell(row=row, column=2, value="পদ্ধতিগত নোট ও সূত্র")
    c.font = Font(name="Noto Sans Bengali", size=12, bold=True, color="15803d")
    c.alignment = left
    row += 1
    for n in snap.notes:
        ws.merge_cells(start_row=row, start_column=2, end_row=row, end_column=9)
        cc = ws.cell(row=row, column=2, value=f"• {n}")
        cc.font = Font(name="Noto Sans Bengali", size=10, color="6b7280")
        cc.alignment = Alignment(horizontal="left", vertical="top", wrap_text=True)
        ws.row_dimensions[row].height = 30
        row += 1

    # Freeze top title rows
    ws.freeze_panes = "A5"

    # ===================== SHEET 2: মূল_ডাটা =====================
    # Copy from source workbook preserving data + header styling
    src_ws2 = src_wb["মূল_ডাটা"]
    ws2 = wb.create_sheet("মূল_ডাটা")
    # Set column widths
    main_widths = [8, 38, 16, 32, 12, 22, 28, 28, 28, 16, 16]
    for i, w in enumerate(main_widths, 1):
        ws2.column_dimensions[get_column_letter(i)].width = w
    # Header
    for ci, val in enumerate(next(src_ws2.iter_rows(values_only=True)), 1):
        c = ws2.cell(row=1, column=ci, value=val)
        c.font = header_font
        c.fill = header_fill
        c.alignment = center
        c.border = border_all
    ws2.row_dimensions[1].height = 36
    # Data
    for ri, row_vals in enumerate(list(src_ws2.iter_rows(values_only=True))[1:], 2):
        if row_vals[0] is None:
            continue
        is_alt = (ri - 1) % 2 == 1
        for ci, val in enumerate(row_vals, 1):
            c = ws2.cell(row=ri, column=ci, value=val)
            c.font = cell_font
            c.alignment = left if ci in (2, 4, 7, 8, 9, 10) else center
            c.border = border_all
            if is_alt:
                c.fill = alt_fill
    ws2.freeze_panes = "A2"
    ws2.auto_filter.ref = f"A1:K{ws2.max_row}"

    # ===================== SHEET 3: ১৭_কলাম_প্রতিবেদন =====================
    src_ws3 = src_wb["১৭_কলাম_প্রতিবেদন"]
    ws3 = wb.create_sheet("১৭_কলাম_প্রতিবেদন")
    # Header is on row 4 of source — we'll put on row 1 for consistency
    src_rows = list(src_ws3.iter_rows(values_only=True))
    header_row = src_rows[3]  # row 4
    data_rows_3 = src_rows[4:]
    # widths
    col17_widths = [7, 16, 12, 16, 18, 14, 28, 11, 14, 22, 22, 14, 22, 14, 22, 14, 18, 16, 16]
    for i, w in enumerate(col17_widths, 1):
        ws3.column_dimensions[get_column_letter(i)].width = w
    # Title rows
    ws3.merge_cells("A1:S1")
    ws3["A1"] = src_rows[0][0] or "১৭. ০৫ বছরে ২৫ কোটি বৃক্ষ রোপণ কর্মসূচির আওতায় রোপণকৃত চারার তথ্য"
    ws3["A1"].font = Font(name="Noto Sans Bengali", size=14, bold=True, color="15803d")
    ws3["A1"].alignment = center
    ws3.row_dimensions[1].height = 26
    ws3.merge_cells("A2:S2")
    ws3["A2"] = src_rows[1][0] or ""
    ws3["A2"].font = Font(name="Noto Sans Bengali", size=10, color="6b7280", italic=True)
    ws3["A2"].alignment = center
    ws3.row_dimensions[2].height = 18
    # Header
    for ci, val in enumerate(header_row, 1):
        c = ws3.cell(row=3, column=ci, value=val)
        c.font = header_font
        c.fill = header_fill
        c.alignment = center
        c.border = border_all
    ws3.row_dimensions[3].height = 38
    # Data
    out_row = 4
    for row_vals in data_rows_3:
        if not any(v is not None for v in row_vals):
            continue
        is_alt = (out_row - 3) % 2 == 1
        for ci, val in enumerate(row_vals, 1):
            c = ws3.cell(row=out_row, column=ci, value=val)
            c.font = cell_font
            c.alignment = left if ci in (2, 7, 11, 13, 15, 17) else center
            c.border = border_all
            if is_alt:
                c.fill = alt_fill
        out_row += 1
    ws3.freeze_panes = "A4"
    ws3.auto_filter.ref = f"A3:S{out_row - 1}"

    # ===================== SHEET 4: উপজেলাভিত্তিক_বিশ্লেষণ =====================
    ws4 = wb.create_sheet("উপজেলাভিত্তিক_বিশ্লেষণ")
    ws4_widths = [3, 26, 16, 16, 16, 16, 16, 16, 14, 16, 16, 16, 16, 18]
    for i, w in enumerate(ws4_widths, 1):
        ws4.column_dimensions[get_column_letter(i)].width = w

    # Title
    ws4.merge_cells("B1:N1")
    ws4["B1"] = "উপজেলাভিত্তিক বিশ্লেষণ — সম্মিলিত অগ্রগতি ও প্রজাতি বিভাজন"
    ws4["B1"].font = title_font
    ws4["B1"].alignment = center
    ws4.row_dimensions[1].height = 32

    ws4.merge_cells("B2:N2")
    ws4["B2"] = f"উৎস: মূল_ডাটা ({snap.main_entries}) + ১৭_কলাম ({snap.col17_entries}) = সম্মিলিত {snap.total_entries} এন্ট্রি"
    ws4["B2"].font = subtitle_font
    ws4["B2"].alignment = center
    ws4.row_dimensions[2].height = 20

    # Header
    headers_an = ["উপজেলা", "মূল_ডাটা\nএন্ট্রি", "মূল_ডাটা\nগাছ", "১৭-কলাম\nএন্ট্রি",
                  "১৭-কলাম\nগাছ", "সম্মিলিত\nএন্ট্রি", "সম্মিলিত\nগাছ", "শেয়ার %",
                  "ফলদ\n(আনুমানিক)", "বনজ\n(আনুমানিক)", "ঔষধি\n(আনুমানিক)",
                  "মিশ্র\n(আনুমানিক)", "গড়\nগাছ/এন্ট্রি"]
    for i, h in enumerate(headers_an):
        c = ws4.cell(row=4, column=i + 2, value=h)
        c.font = header_font
        c.fill = header_fill
        c.alignment = center
        c.border = border_all
    ws4.row_dimensions[4].height = 36

    # Aggregate category by upazila (from 17-col sheet only — main sheet doesn't split per-upazila)
    # We need to re-scan to get per-upazila category breakdown — but for simplicity,
    # estimate using global category distribution.
    global_cat_total = sum(c.seedlings for c in snap.categories if c.source == "১৭_কলাম_প্রতিবেদন") or 1
    cat_lookup = {c.category: c.seedlings for c in snap.categories if c.source == "১৭_কলাম_প্রতিবেদন"}
    est_fruit = cat_lookup.get("ফলদ", 0)
    est_forest = cat_lookup.get("বনজ", 0)
    est_medicinal = cat_lookup.get("ঔষধি", 0)
    est_mixed = cat_lookup.get("মিশ্র প্যাকেজ", 0)
    # We'll allocate proportionally to each upazila based on 17-col seedlings share
    total_17_seedlings = sum(u.col17_seedlings for u in snap.upazilas) or 1

    row = 5
    for idx, u in enumerate(snap.upazilas):
        if u.combined_entries == 0:
            continue
        is_alt = idx % 2 == 1
        fill = alt_fill if is_alt else None
        share = (u.combined_seedlings / snap.total_seedlings) if snap.total_seedlings else 0
        upa_17_share = (u.col17_seedlings / total_17_seedlings) if total_17_seedlings else 0
        est_f = round(est_fruit * upa_17_share)
        est_fo = round(est_forest * upa_17_share)
        est_m = round(est_medicinal * upa_17_share)
        est_mix = round(est_mixed * upa_17_share)
        avg = (u.combined_seedlings / u.combined_entries) if u.combined_entries else 0
        vals = [u.name, u.main_entries, u.main_seedlings, u.col17_entries,
                u.col17_seedlings, u.combined_entries, u.combined_seedlings,
                share, est_f, est_fo, est_m, est_mix, round(avg, 1)]
        for i, v in enumerate(vals):
            c = ws4.cell(row=row, column=i + 2, value=v)
            c.font = cell_font
            c.alignment = left if i == 0 else center
            c.border = border_all
            if fill:
                c.fill = fill
            if i == 7:
                c.number_format = "0.0%"
        row += 1
    # Total
    avg_total = (snap.total_seedlings / snap.total_entries) if snap.total_entries else 0
    vals = ["মোট", snap.main_entries, snap.main_seedlings, snap.col17_entries,
            snap.col17_seedlings, snap.total_entries, snap.total_seedlings,
            1.0, est_fruit, est_forest, est_medicinal, est_mixed, round(avg_total, 1)]
    for i, v in enumerate(vals):
        c = ws4.cell(row=row, column=i + 2, value=v)
        c.font = bold_font
        c.fill = total_fill
        c.alignment = left if i == 0 else center
        c.border = Border(top=medium, bottom=medium, left=thin, right=thin)
        if i == 7:
            c.number_format = "0.0%"
    ws4.freeze_panes = "A5"
    # Add a chart on this sheet too
    chart3 = BarChart()
    chart3.type = "col"
    chart3.style = 12
    chart3.title = "উপজেলাভিত্তিক সম্মিলিত এন্ট্রি ও গাছ"
    chart3.y_axis.title = "সংখ্যা"
    chart3.x_axis.title = "উপজেলা"
    chart3.height = 12
    chart3.width = 22
    # Combined entries (col G = 7) and combined seedlings (col H = 8)
    data_ref3 = Reference(ws4, min_col=7, min_row=4, max_col=8, max_row=row - 1)
    cats_ref3 = Reference(ws4, min_col=2, min_row=5, max_row=row - 1)
    chart3.add_data(data_ref3, titles_from_data=True)
    chart3.set_categories(cats_ref3)
    ws4.add_chart(chart3, f"B{row + 2}")

    # ===================== Save =====================
    wb.save(out_path)


# ---------------------------------------------------------------------------
# JSON snapshot
# ---------------------------------------------------------------------------

def render_json(snap: ReportSnapshot, out_path: str,
                html_url: str = "", xlsx_url: str = "") -> None:
    """Emit a JSON snapshot for the Dashboard tab to load dynamically.

    Args:
        snap: Computed ReportSnapshot.
        out_path: Where to write the JSON file.
        html_url: URL (relative or absolute) the dashboard should link to
            for the HTML report. Defaults to a sensible /reports/ URL based
            on the canonical snapshot filename.
        xlsx_url: URL for the XLSX download. Same defaulting logic.
    """
    # Default URLs: the dashboard always links to the canonical
    # (non-date-tagged) report files so it stays stable across regenerations.
    if not html_url:
        html_url = "/reports/weekly-report.html"
    if not xlsx_url:
        xlsx_url = "/reports/weekly-report.xlsx"
    data = {
        "title": snap.title,
        "subtitle": snap.subtitle,
        "reportDate": snap.report_date,
        "generatedAt": snap.generated_at,
        "office": snap.office,
        "district": snap.district,
        "division": snap.division,
        "sourceKind": snap.source_kind,
        "sourceLabel": snap.source_label,
        "kpi": {
            "totalEntries": snap.total_entries,
            "totalSeedlings": snap.total_seedlings,
            "mainEntries": snap.main_entries,
            "mainSeedlings": snap.main_seedlings,
            "col17Entries": snap.col17_entries,
            "col17Seedlings": snap.col17_seedlings,
            "upazilaCoverage": snap.upazila_coverage,
            "upazilaTotal": snap.upazila_total,
            "speciesCount": snap.species_count,
            "avgPerEntry": snap.avg_per_entry,
            "maxEntryQty": snap.max_entry_qty,
            "uniqueFarmers": snap.unique_farmers,
            "uniqueSaao": snap.unique_saao,
            "uniqueOfficers": snap.unique_officers,
            "needsVerification": snap.needs_verification,
            "needsVerificationPct": snap.needs_verification_pct,
        },
        "upazilas": [
            {
                "name": u.name,
                "mainEntries": u.main_entries,
                "mainSeedlings": u.main_seedlings,
                "col17Entries": u.col17_entries,
                "col17Seedlings": u.col17_seedlings,
                "combinedEntries": u.combined_entries,
                "combinedSeedlings": u.combined_seedlings,
                "sharePct": round((u.combined_seedlings / snap.total_seedlings * 100)
                                  if snap.total_seedlings else 0, 2),
            }
            for u in snap.upazilas if u.combined_entries > 0
        ],
        "categories": [
            {
                "category": c.category,
                "source": c.source,
                "entries": c.entries,
                "seedlings": c.seedlings,
                "pct": round((c.seedlings / snap.total_seedlings * 100)
                             if snap.total_seedlings else 0, 2),
            }
            for c in snap.categories
        ],
        "sources": snap.sources,
        "topSpecies": snap.top_species,
        "topSaao": snap.top_saao,
        "topOfficers": snap.top_officers,
        "dataQuality": [
            {"criterion": d.criterion, "count": d.count, "pct": d.pct, "note": d.note}
            for d in snap.data_quality
        ] + [{
            "criterion": "মোট চিহ্নিত এন্ট্রি (আনুমানিক)",
            "count": snap.needs_verification,
            "pct": snap.needs_verification_pct,
            "note": "কমপক্ষে একটি সমস্যাসহ এন্ট্রি",
        }],
        "notes": snap.notes,
        "files": {
            "xlsx": xlsx_url,
            "html": html_url,
        },
    }
    with open(out_path, "w", encoding="utf-8") as f:
        json.dump(data, f, ensure_ascii=False, indent=2)


# ---------------------------------------------------------------------------
# Source discovery & live-fetch helpers
# ---------------------------------------------------------------------------

def discover_source_xlsx(upload_dir: str = UPLOAD_DIR) -> tuple[str, str] | None:
    """Auto-detect the newest .xlsx workbook in upload_dir.

    Returns (path, human_label) or None if no .xlsx found.
    Skips temp/lock files (starting with ~$) and the canonical renamed file.
    """
    if not os.path.isdir(upload_dir):
        return None
    candidates: list[tuple[float, str, str]] = []
    for name in os.listdir(upload_dir):
        if not name.lower().endswith(".xlsx"):
            continue
        if name.startswith("~$"):
            continue
        full = os.path.join(upload_dir, name)
        if not os.path.isfile(full):
            continue
        try:
            mtime = os.path.getmtime(full)
        except OSError:
            continue
        candidates.append((mtime, full, name))
    if not candidates:
        return None
    candidates.sort(key=lambda x: x[0], reverse=True)
    mtime, full, name = candidates[0]
    mtime_str = datetime.fromtimestamp(mtime, DHAKA_TZ).strftime("%Y-%m-%d %H:%M")
    label = f"auto-detected: {name} (mtime {mtime_str} Asia/Dhaka)"
    return full, label


def fetch_live_workbook(url: str, dest_dir: str | None = None) -> str:
    """Download a remote .xlsx file to a local path and return the path."""
    if dest_dir is None:
        dest_dir = tempfile.gettempdir()
    os.makedirs(dest_dir, exist_ok=True)
    # Filename from URL or fallback
    name = url.split("/")[-1].split("?")[0] or "live-source.xlsx"
    if not name.lower().endswith(".xlsx"):
        name = "live-source.xlsx"
    dest = os.path.join(dest_dir, f"live-{int(datetime.now().timestamp())}-{name}")
    print(f"⬇️  Downloading live workbook: {url}")
    req = urllib.request.Request(url, headers={"User-Agent": "weekly-report-generator/1.0"})
    with urllib.request.urlopen(req, timeout=30) as resp, open(dest, "wb") as f:
        f.write(resp.read())
    size_kb = os.path.getsize(dest) / 1024
    print(f"    ✓ Saved {size_kb:.1f} KB → {dest}")
    return dest


def build_workbook_from_gas(gas_url: str, dest_dir: str | None = None) -> str:
    """Fetch /api/gas-sync?list=1 (or any compatible JSON endpoint) and
    synthesize an .xlsx workbook with the same 3-sheet schema that
    compute_snapshot() expects.

    The GAS endpoint returns {ok: true, entries: [...]} where each entry is
    a NationalEntry-shaped object (see src/types/plantation.ts):
        {
          submissionId, division, region, district, upazila, village,
          geoLocation, farmerName, farmerMobile, saaoName, saaoMobile,
          officerName, officerMobile, plantingDate, submittedAt,
          seedlings: [{speciesName, category, quantity}, ...]
        }

    We synthesize TWO sheets from this single source:
      মূল_ডাটা — one row per submissionId (collapsed, like the ministry report)
      ১৭_কলাম_প্রতিবেদন — one row per seedling (exploded, like the 17-col report)
    And an empty সারসংক্ষেপ sheet (the generator will fill this with stats).
    """
    if dest_dir is None:
        dest_dir = tempfile.gettempdir()
    os.makedirs(dest_dir, exist_ok=True)
    dest = os.path.join(dest_dir, f"gas-{int(datetime.now().timestamp())}.xlsx")

    print(f"⬇️  Fetching GAS sync entries: {gas_url}")
    list_url = gas_url + ("&" if "?" in gas_url else "?") + "list=1"
    req = urllib.request.Request(list_url, headers={"User-Agent": "weekly-report-generator/1.0",
                                                      "Accept": "application/json"})
    with urllib.request.urlopen(req, timeout=60) as resp:
        raw = resp.read()
    data = json.loads(raw)
    if not data.get("ok") or not isinstance(data.get("entries"), list):
        raise RuntimeError(f"GAS endpoint did not return ok+entries: {str(data)[:200]}")
    entries = data["entries"]
    print(f"    ✓ Got {len(entries)} entries")

    wb = openpyxl.Workbook()

    # --- Sheet 1: সারসংক্ষেপ (placeholder; generator will fill it) ---
    ws_sum = wb.active
    ws_sum.title = "সারসংক্ষেপ"
    ws_sum["B1"] = "সাপ্তাহিক বৃক্ষরোপণ কর্মসূচির অগ্রগতি প্রতিবেদন"
    ws_sum["B2"] = "স্বয়ংক্রিয়ভাবে প্রস্তুতকৃত — GAS sync থেকে ডায়নামিক"
    ws_sum["B3"] = f"তারিখ: {datetime.now(DHAKA_TZ).strftime('%Y-%m-%d %H:%M')} (Asia/Dhaka)"

    # --- Sheet 2: মূল_ডাটা (ministry-report-like, one row per submission) ---
    ws_main = wb.create_sheet("মূল_ডাটা")
    main_headers = ["ক্রঃ নং", "বৃক্ষরোপণের স্থান (গ্রাম/ইউনিয়ন/উপজেলা/জেলা)",
                    "উপজেলা", "প্রজাতির নাম", "রোপণকৃত সংখ্যা",
                    "জিওগ্রাফিক্যাল কোঅর্ডিনেট", "পরিচর্যাকারী কৃষক (নাম ও ফোন)",
                    "এসএএও (নাম ও ফোন)", "মনিটরিং অফিসার (নাম ও ফোন)",
                    "মন্তব্য", "প্রজাতি ক্যাটাগরি"]
    ws_main.append(main_headers)
    for i, e in enumerate(entries, 1):
        village = (e.get("village") or "").strip()
        upazila = (e.get("upazila") or "").strip()
        district = (e.get("district") or "").strip()
        place = ", ".join([x for x in [village, upazila, district] if x]) or "—"
        # collapse seedlings into one row
        species_names = []
        total_qty = 0
        cats = set()
        for sd in (e.get("seedlings") or []):
            sp = (sd.get("speciesName") or "").strip()
            if sp:
                species_names.append(sp)
            q = sd.get("quantity")
            try:
                total_qty += int(q) if q is not None else 0
            except (ValueError, TypeError):
                pass
            c = (sd.get("category") or "").strip()
            if c:
                cats.add(c)
        species_str = ", ".join(species_names) if species_names else "—"
        cat_str = "মিশ্র প্যাকেজ" if len(cats) > 1 else (next(iter(cats)) if cats else "মিশ্র প্যাকেজ")
        farmer = " ".join([x for x in [e.get("farmerName"), e.get("farmerMobile")] if x])
        saao = " ".join([x for x in [e.get("saaoName"), e.get("saaoMobile")] if x])
        officer = " ".join([x for x in [e.get("officerName"), e.get("officerMobile")] if x])
        coords = e.get("geoLocation") or e.get("coordinates") or ""
        ws_main.append([i, place, upazila, species_str, total_qty, coords,
                        farmer or "—", saao or "—", officer or "—",
                        e.get("remarks") or "", cat_str])

    # --- Sheet 3: ১৭_কলাম_প্রতিবেদন (17-col-like, one row per seedling) ---
    ws17 = wb.create_sheet("১৭_কলাম_প্রতিবেদন")
    ws17.append(["১৭. ০৫ বছরে ২৫ কোটি বৃক্ষ রোপণ কর্মসূচির আওতায় রোপণকৃত চারার তথ্য"])
    ws17.append([f"মন্ত্রণালয়/বিভাগ/অধিদপ্তর: কৃষি সম্প্রসারণ অধিদপ্তর  |  তারিখ: {datetime.now(DHAKA_TZ).strftime('%Y-%m-%d')}"])
    ws17.append([None])
    ws17.append([
        "ক্র.\nনং", "গ্রামের নাম", "ব্লক", "ইউনিয়ন", "উপজেলা", "জেলা",
        "প্রজাতির নাম", "চারার\nসংখ্যা", "রোপণের\nতারিখ",
        "জিওগ্রাফিক্যাল\nকো-অর্ডিনেট", "কৃষকের নাম", "কৃষকের\nমোবাইল",
        "SAAO-এর নাম", "SAAO-এর\nমোবাইল", "মনিটরিং অফিসারের নাম",
        "মনিটরিং\nমোবাইল", "মন্তব্য", "প্রজাতি\nক্যাটাগরি", "ডাটা মান যাচাই",
    ])
    seq = 0
    for e in entries:
        for sd in (e.get("seedlings") or []):
            seq += 1
            try:
                qty = int(sd.get("quantity") or 0)
            except (ValueError, TypeError):
                qty = 0
            sp_name = (sd.get("speciesName") or "—").strip()
            cat = (sd.get("category") or "").strip() or "ফলদ"
            ws17.append([
                seq, e.get("village") or "", None, None,
                e.get("upazila") or "", e.get("district") or "",
                sp_name, qty,
                e.get("plantingDate") or e.get("submittedAt") or "",
                e.get("geoLocation") or "",
                e.get("farmerName") or "", e.get("farmerMobile") or "",
                e.get("saaoName") or "", e.get("saaoMobile") or "",
                e.get("officerName") or "", e.get("officerMobile") or "",
                e.get("remarks") or "", cat, None,
            ])

    wb.save(dest)
    print(f"    ✓ Synthesized workbook: {dest} ({len(entries)} entries, {seq} seedling rows)")
    return dest


def update_manifest(reports_dir: str, report_date: str, generated_at: str,
                    html_file: str, xlsx_file: str, snapshot_file: str,
                    source_kind: str, source_label: str,
                    total_entries: int, total_seedlings: int) -> None:
    """Append this run to weekly-report-manifest.json (creates if absent)."""
    manifest_path = os.path.join(reports_dir, "weekly-report-manifest.json")
    history: list[dict] = []
    if os.path.exists(manifest_path):
        try:
            with open(manifest_path, "r", encoding="utf-8") as f:
                history = json.load(f)
            if not isinstance(history, list):
                history = []
        except (json.JSONDecodeError, OSError):
            history = []
    # Cap history at 52 weeks (~1 year) to bound file size
    history.insert(0, {
        "reportDate": report_date,
        "generatedAt": generated_at,
        "sourceKind": source_kind,
        "sourceLabel": source_label,
        "totalEntries": total_entries,
        "totalSeedlings": total_seedlings,
        "html": os.path.basename(html_file),
        "xlsx": os.path.basename(xlsx_file),
        "snapshot": os.path.basename(snapshot_file),
    })
    history = history[:52]
    with open(manifest_path, "w", encoding="utf-8") as f:
        json.dump(history, f, ensure_ascii=False, indent=2)


# ---------------------------------------------------------------------------
# Email delivery (SMTP)
# ---------------------------------------------------------------------------

def send_email_smtp(html_path: str, xlsx_path: str, snap: ReportSnapshot) -> bool:
    """Send the report via SMTP using env vars. Returns True on success."""
    import smtplib
    from email.message import EmailMessage
    from email.utils import formatdate

    host = os.environ.get("SMTP_HOST")
    port = int(os.environ.get("SMTP_PORT", "587"))
    user = os.environ.get("SMTP_USER")
    pwd = os.environ.get("SMTP_PASS")
    sender = os.environ.get("SMTP_FROM") or user
    recipients_raw = os.environ.get("SMTP_TO") or ""
    if not (host and user and pwd and recipients_raw):
        print("📧 SMTP env vars missing — skipping email send.")
        return False
    recipients = [r.strip() for r in recipients_raw.split(",") if r.strip()]
    if not recipients:
        print("📧 No recipients in SMTP_TO — skipping email send.")
        return False

    # Build email
    msg = EmailMessage()
    msg["Subject"] = f"সাপ্তাহিক বৃক্ষরোপণ প্রতিবেদন — {snap.report_date}"
    msg["From"] = sender
    msg["To"] = ", ".join(recipients)
    msg["Date"] = formatdate(localtime=True)

    # Inline HTML body — read the file content
    with open(html_path, "r", encoding="utf-8") as f:
        html_body = f.read()
    msg.add_alternative(
        f"""\
প্রিয় মহোদয়,

সাপ্তাহিক বৃক্ষরোপণ কর্মসূচির অগ্রগতি প্রতিবেদন সংযুক্ত।

সারসংক্ষেপ:
  • প্রতিবেদন তারিখ: {snap.report_date}
  • মোট এন্ট্রি: {snap.total_entries}
  • মোট রোপণকৃত বৃক্ষ: {snap.total_seedlings}
  • উপজেলা কভারেজ: {snap.upazila_coverage}/{snap.upazila_total}
  • যাচাই প্রয়োজন: {snap.needs_verification} ({snap.needs_verification_pct}%)

বিস্তারিত দেখুন সংযুক্ত HTML ও Excel ফাইলে।

ধন্যবাদান্তে,
{snap.office}

(This report was generated automatically on {snap.generated_at}.)
""",
        subtype="text",
    )
    # Set the HTML alternative
    msg.get_payload()[0].add_alternative(html_body, subtype="html")

    # Attach XLSX
    with open(xlsx_path, "rb") as f:
        xlsx_data = f.read()
    msg.add_attachment(
        xlsx_data,
        maintype="application",
        subtype="vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        filename=os.path.basename(xlsx_path),
    )

    try:
        # Try TLS first
        print(f"📧 Sending email via {host}:{port} (TLS) → {len(recipients)} recipient(s)")
        with smtplib.SMTP(host, port, timeout=30) as s:
            s.starttls()
            s.login(user, pwd)
            s.send_message(msg)
        print("    ✓ Email sent successfully")
        return True
    except Exception as e_tls:
        print(f"    ⚠ TLS failed ({e_tls}); trying plain SMTP on port {port}")
        try:
            with smtplib.SMTP(host, port, timeout=30) as s:
                if user and pwd:
                    s.login(user, pwd)
                s.send_message(msg)
            print("    ✓ Email sent successfully (plain)")
            return True
        except Exception as e_plain:
            print(f"    ❌ Email send failed: {e_plain}", file=sys.stderr)
            return False


# ---------------------------------------------------------------------------
# Entry point
# ---------------------------------------------------------------------------

def parse_args(argv: list[str] | None = None) -> argparse.Namespace:
    p = argparse.ArgumentParser(
        prog="generate_weekly_report.py",
        description="Generate a dynamic professional weekly plantation report.",
    )
    # Source selection
    src = p.add_argument_group("Source selection (priority: source > live-url > gas-url > auto-detect)")
    src.add_argument("--source", help="Explicit path to a source .xlsx workbook")
    src.add_argument("--live-url", help="HTTP(S) URL of a remote .xlsx workbook to download")
    src.add_argument("--gas-url", help="URL of a /api/gas-sync-compatible JSON endpoint")
    src.add_argument("--upload-dir", default=UPLOAD_DIR,
                     help=f"Directory to auto-detect newest .xlsx (default: {UPLOAD_DIR})")
    # Output
    out = p.add_argument_group("Output")
    out.add_argument("--out-dir", default=DEFAULT_OUT_DIR,
                     help=f"Output directory (default: {DEFAULT_OUT_DIR})")
    out.add_argument("--date", help="Report reference date (YYYY-MM-DD or 'DD Month, YYYY'). "
                                    "Default: today in Asia/Dhaka")
    out.add_argument("--no-tag-filenames", action="store_true",
                     help="Use canonical filenames (weekly-report.html/xlsx) "
                          "instead of date-tagged ones. The canonical "
                          "snapshot.json is ALWAYS written regardless.")
    # Email
    p.add_argument("--email", action="store_true",
                   help="Send the report via SMTP (requires SMTP_* env vars)")
    return p.parse_args(argv)


def main() -> int:
    args = parse_args()

    # --- Resolve source workbook ---
    src_xlsx: str | None = None
    source_kind = "explicit"
    source_label = ""

    if args.source:
        if not os.path.exists(args.source):
            print(f"❌ ERROR: --source not found: {args.source}", file=sys.stderr)
            return 1
        src_xlsx = args.source
        source_kind = "explicit"
        source_label = f"explicit --source: {os.path.basename(args.source)}"
    elif args.live_url:
        try:
            src_xlsx = fetch_live_workbook(args.live_url)
        except Exception as e:
            print(f"❌ ERROR: --live-url fetch failed: {e}", file=sys.stderr)
            return 1
        source_kind = "live-url"
        source_label = f"live-url: {args.live_url}"
    elif args.gas_url:
        try:
            src_xlsx = build_workbook_from_gas(args.gas_url)
        except Exception as e:
            print(f"❌ ERROR: --gas-url fetch failed: {e}", file=sys.stderr)
            return 1
        source_kind = "gas"
        source_label = f"gas: {args.gas_url}"
    else:
        # Auto-detect newest .xlsx in upload dir
        found = discover_source_xlsx(args.upload_dir)
        if not found:
            print(f"❌ ERROR: no .xlsx workbook found in {args.upload_dir}. "
                  f"Pass --source, --live-url, --gas-url, or drop a file in upload/.",
                  file=sys.stderr)
            return 1
        src_xlsx, source_label = found
        source_kind = "upload"

    print(f"📥 Source workbook: {src_xlsx}")
    print(f"   • Source kind: {source_kind}")
    print(f"   • Label: {source_label}")

    # --- Resolve report date ---
    report_date_str = ""
    if args.date:
        # Accept either YYYY-MM-DD or "DD Month, YYYY"
        s = args.date.strip()
        try:
            if re.match(r"^\d{4}-\d{2}-\d{2}$", s):
                dt = datetime.strptime(s, "%Y-%m-%d")
                report_date_str = dt.strftime("%-d %B, %Y")
            else:
                # Try "DD Month, YYYY" as-is
                report_date_str = s
        except ValueError:
            print(f"⚠️ Invalid --date format: {s}. Using today (Asia/Dhaka).",
                  file=sys.stderr)

    # --- Compute snapshot ---
    print("🧮 Computing statistics from raw entry rows...")
    snap = compute_snapshot(
        src_xlsx,
        source_kind=source_kind,
        source_label=source_label,
        report_date=report_date_str,
    )
    print(f"   • Report date:      {snap.report_date}")
    print(f"   • Generated at:     {snap.generated_at}")
    print(f"   • Total entries:    {snap.total_entries}")
    print(f"   • Total seedlings:  {snap.total_seedlings}")
    print(f"   • Upazila coverage: {snap.upazila_coverage}/{snap.upazila_total}")
    print(f"   • Species count:    {snap.species_count}")
    print(f"   • Categories:       {len(snap.categories)}")
    print(f"   • Needs verification:{snap.needs_verification} ({snap.needs_verification_pct}%)")

    # --- Resolve output paths ---
    out_dir = args.out_dir
    os.makedirs(out_dir, exist_ok=True)
    # Date tag for filenames (YYYY-MM-DD)
    date_tag = datetime.now(DHAKA_TZ).strftime("%Y-%m-%d")
    if args.no_tag_filenames:
        html_name = "weekly-report.html"
        xlsx_name = "weekly-report.xlsx"
    else:
        html_name = f"weekly-report-{date_tag}.html"
        xlsx_name = f"weekly-report-{date_tag}.xlsx"
    # Snapshot is always canonical so the dashboard always loads the latest
    snapshot_name = "weekly-report-snapshot.json"
    # Also write a date-tagged snapshot for archive
    snapshot_archive_name = f"weekly-report-{date_tag}-snapshot.json"

    html_out = os.path.join(out_dir, html_name)
    xlsx_out = os.path.join(out_dir, xlsx_name)
    snapshot_out = os.path.join(out_dir, snapshot_name)
    snapshot_archive_out = os.path.join(out_dir, snapshot_archive_name)

    # --- Generate outputs ---
    print(f"\n📄 Generating HTML report → {html_out}")
    html = render_html(snap)
    with open(html_out, "w", encoding="utf-8") as f:
        f.write(html)
    # Also write the canonical (non-date-tagged) HTML so the dashboard's
    # default links (/reports/weekly-report.html) always work — but only
    # if we're using date-tagged filenames.
    if not args.no_tag_filenames:
        canonical_html = os.path.join(out_dir, "weekly-report.html")
        with open(canonical_html, "w", encoding="utf-8") as f:
            f.write(html)
        print(f"   ↳ Canonical copy → {canonical_html}")

    print(f"📊 Generating XLSX report → {xlsx_out}")
    render_xlsx(snap, src_xlsx, xlsx_out)
    if not args.no_tag_filenames:
        canonical_xlsx = os.path.join(out_dir, "weekly-report.xlsx")
        # Copy the date-tagged file to the canonical name
        import shutil
        shutil.copy2(xlsx_out, canonical_xlsx)
        print(f"   ↳ Canonical copy → {canonical_xlsx}")

    print(f"🔗 Generating JSON snapshot → {snapshot_out}")
    # The dashboard always links to /reports/weekly-report.{html,xlsx} which
    # we've made sure exist above, so use those URLs in the snapshot.
    render_json(snap, snapshot_out,
                html_url="/reports/weekly-report.html",
                xlsx_url="/reports/weekly-report.xlsx")
    # Archive copy (with date tag)
    render_json(snap, snapshot_archive_out,
                html_url=f"/reports/{html_name}",
                xlsx_url=f"/reports/{xlsx_name}")
    print(f"   ↳ Archive copy → {snapshot_archive_out}")

    # --- Update manifest ---
    update_manifest(
        out_dir, snap.report_date, snap.generated_at,
        html_out, xlsx_out, snapshot_out,
        snap.source_kind, snap.source_label,
        snap.total_entries, snap.total_seedlings,
    )
    manifest_path = os.path.join(out_dir, "weekly-report-manifest.json")
    print(f"📋 Manifest updated → {manifest_path}")

    print(f"\n✅ All outputs generated successfully in {out_dir}")

    # --- Optional email delivery ---
    if args.email:
        send_email_smtp(html_out, xlsx_out, snap)
    else:
        print("📧 (pass --email to send via SMTP)")

    return 0


if __name__ == "__main__":
    sys.exit(main())

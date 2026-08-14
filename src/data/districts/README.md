# District upazila polygon data

One file per Bangladesh district (64 total), each exporting
`Record<upazilaName, UpazilaGeometry>` keyed by the **exact Bengali
upazila name `plantation.html`'s own `BD_UPAZILA` object uses** (i.e.
whatever a real submission's `upazila` field actually contains).

## Provenance

- Polygon source: a community-maintained Bangladesh administrative
  boundary GeoJSON (upazila-level, 544 features covering all 64
  districts plus Dhaka/Chittagong metro thanas).
- District/upazila name reference: `bd-districts.json` / `bd-upazilas.json`
  (BD government administrative code lists).
- Canonical upazila naming: extracted directly from `public/plantation.html`'s
  `BD_UPAZILA` object, since that's what real submissions' `upazila`
  field actually contains.

## Coverage

- **কুড়িগ্রাম (Kurigram): 9/9, hand-verified.** This is the district
  the app is actually used in today, so it got individual review rather
  than relying on the automated match below.
- **Nationwide: ~290/473 upazilas (61%) matched automatically.** The
  remaining ~39% failed automated matching due to genuine transliteration
  differences between the boundary dataset and `BD_UPAZILA` (e.g. "রাণীশংকৈল"
  vs a differently-spelled source variant) that a same-district name/geometry
  match couldn't resolve safely. A handful of whole-district name mismatches
  (e.g. "চাঁপাইনবাবগঞ্জ" vs the source's "নবাবগঞ্জ") were caught and fixed
  via a manual alias table in the generation script; individual upazila-level
  mismatches within an otherwise-matched district were not chased further.
- **A missing upazila is never a false positive.** `upazilaPointInPolygon.ts`
  returns "not mismatched" (i.e. doesn't flag) for any upazila name not
  present in the loaded district's data — so incomplete coverage only
  means reduced detection for that specific upazila, never a wrongly
  flagged entry.

## Regenerating

If `bangladesh.geojson` is updated, or you want to close more of the
~39% gap for a specific district: re-run the matching pipeline (group by
district → resolve blank names via `bd-upazilas.json` → NFC-normalize
**everything** before any string comparison — this bit us hard during
generation; the source datasets use different Unicode normalization
forms for the same visible Bengali text → fuzzy-match against
`BD_UPAZILA`'s canonical names → hand-review any remaining district with
Dhaka/Chittagong-style metro thana noise). Kurigram's file should stay
sourced from the hand-verified data rather than the automated pass
unless it's re-verified again.

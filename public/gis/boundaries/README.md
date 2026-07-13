# Bangladesh Administrative Boundaries (GeoJSON)

This directory contains GeoJSON boundary files for Bangladesh's administrative divisions, used by the Plantation Tracker application for GIS visualization and location-based features.

## Files

| File | Contents | Feature Count | Source |
|------|----------|---------------|--------|
| `divisions.geojson` | 8 administrative divisions | 8 | geoBoundaries ADM1 |
| `districts.geojson` | 64 districts (zila) | 64 | geoBoundaries ADM2 |
| `upazilas.geojson` | ~495 upazilas (sub-districts) | ~495 | geoBoundaries ADM3 |

## Properties

Each feature includes these properties:

- `shapeName` — Name (may be in Bengali)
- `shapeNameEn` — English name (if available)
- `shapeISO` — ISO/shape code (e.g., `BD-A` for Barisal)
- `shapeGroup` — Administrative level (`division`, `district`, `upazila`)
- `shapeID` — Numeric ID

## How to Regenerate

Run the download script from the project root:

```bash
node scripts/download-bd-boundaries.js
```

This will:
1. Download the latest boundaries from geoBoundaries (wmgeolab)
2. Simplify geometries to reduce file size
3. Save the files to this directory
4. Fall back to placeholder files if download fails

## Source Attribution

Boundary data sourced from [geoBoundaries](https://www.geoboundaries.org/) by William & Mary geoLab, licensed under [CC-BY 4.0](https://creativecommons.org/licenses/by/4.0/).

```
@data{geoboundaries,
  author    = {{geoLab}},
  title     = {{geoBoundaries Administrative Boundaries Database}},
  year      = {2024},
  url       = {https://www.geoboundaries.org/},
  publisher = {William & Mary}
}
```

## Notes

- The `divisions.geojson` file contains approximate placeholder polygons.
- District and upazila files start empty; run the download script to populate them.
- If the download script cannot reach the internet, it will keep the existing files unchanged.
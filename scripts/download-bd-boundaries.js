#!/usr/bin/env node

/**
 * download-bd-boundaries.js
 *
 * Downloads Bangladesh administrative boundary GeoJSON files from geoBoundaries
 * and saves simplified versions to public/gis/boundaries/.
 *
 * Usage:
 *   node scripts/download-bd-boundaries.js
 *
 * No npm dependencies required — uses native https module.
 * If @turf/simplify is installed, geometries will be simplified.
 */

"use strict";

const https = require("https");
const http = require("http");
const fs = require("fs");
const path = require("path");

// ---------------------------------------------------------------------------
// Configuration
// ---------------------------------------------------------------------------

const OUTPUT_DIR = path.resolve(
  __dirname,
  "..",
  "public",
  "gis",
  "boundaries"
);

const SOURCES = [
  {
    key: "divisions",
    urls: [
      "https://github.com/wmgeolab/geoBoundaries/raw/main/releaseData/gbOpen/BGD/ADM1/gbOpen_BGD_ADM1.geojson",
    ],
    filename: "divisions.geojson",
    simplify: false, // only 8 features — keep as-is
    tolerance: 0,
  },
  {
    key: "districts",
    urls: [
      "https://github.com/wmgeolab/geoBoundaries/raw/main/releaseData/gbOpen/BGD/ADM2/gbOpen_BGD_ADM2.geojson",
    ],
    filename: "districts.geojson",
    simplify: true,
    tolerance: 0.00045, // ~50 m at Bangladesh latitude
  },
  {
    key: "upazilas",
    urls: [
      "https://github.com/wmgeolab/geoBoundaries/raw/main/releaseData/gbOpen/BGD/ADM3/gbOpen_BGD_ADM3.geojson",
    ],
    filename: "upazilas.geojson",
    simplify: true,
    tolerance: 0.0009, // ~100 m at Bangladesh latitude
  },
];

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

/** Attempt to import @turf/simplify — returns null if unavailable. */
function tryLoadTurf() {
  try {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    return require("@turf/simplify");
  } catch {
    return null;
  }
}

/**
 * Download a URL to a Buffer. Follows redirects (up to 5).
 * Returns null on failure.
 */
function download(url) {
  return new Promise((resolve) => {
    const maxRedirects = 5;
    let redirectCount = 0;

    function attempt(currentUrl) {
      const client = currentUrl.startsWith("https") ? https : http;

      client
        .get(currentUrl, { timeout: 30000 }, (res) => {
          // Handle redirects
          if (
            res.statusCode >= 300 &&
            res.statusCode < 400 &&
            res.headers.location
          ) {
            redirectCount++;
            if (redirectCount > maxRedirects) {
              console.error(`  ✗ Too many redirects for ${currentUrl}`);
              resolve(null);
              return;
            }
            let next = res.headers.location;
            if (next.startsWith("/")) {
              const u = new URL(currentUrl);
              next = `${u.protocol}//${u.host}${next}`;
            }
            attempt(next);
            return;
          }

          if (res.statusCode !== 200) {
            console.error(
              `  ✗ HTTP ${res.statusCode} for ${currentUrl}`
            );
            res.resume();
            resolve(null);
            return;
          }

          const chunks = [];
          let totalBytes = 0;
          res.on("data", (chunk) => {
            chunks.push(chunk);
            totalBytes += chunk.length;
          });
          res.on("end", () => {
            const buf = Buffer.concat(chunks);
            console.log(
              `  ✓ Downloaded ${(totalBytes / 1024 / 1024).toFixed(2)} MB`
            );
            resolve(buf);
          });
          res.on("error", (err) => {
            console.error(`  ✗ Stream error: ${err.message}`);
            resolve(null);
          });
        })
        .on("error", (err) => {
          console.error(`  ✗ Request error: ${err.message}`);
          resolve(null);
        })
        .on("timeout", function () {
          console.error("  ✗ Request timed out");
          this.destroy();
          resolve(null);
        });
    }

    attempt(url);
  });
}

/**
 * Parse JSON, handling potential TopoJSON → GeoJSON conversion.
 */
function parseGeoJSON(buffer) {
  const str = buffer.toString("utf-8");
  let data = JSON.parse(str);

  // If it's TopoJSON, try to convert using topojson-client
  if (data.type === "Topology" || data.type === "topojson") {
    console.log("  ℹ Detected TopoJSON, attempting conversion...");
    try {
      // eslint-disable-next-line @typescript-eslint/no-var-requires
      const topojson = require("topojson-client");
      // Use the first object key as the layer
      const objectKey = Object.keys(data.objects)[0];
      data = topojson.feature(data, data.objects[objectKey]);
      console.log("  ✓ Converted TopoJSON to GeoJSON");
    } catch {
      console.error(
        "  ✗ topojson-client not installed; cannot convert TopoJSON. Skipping."
      );
      return null;
    }
  }

  return data;
}

/**
 * Normalize feature properties so every feature has shapeName, shapeISO,
 * and shapeGroup, regardless of the source schema.
 */
function normalizeProperties(geojson, shapeGroup) {
  if (!geojson || !geojson.features) return geojson;

  for (const feature of geojson.features) {
    const p = feature.properties || {};

    // geoBoundaries uses shapeName / shapeISO / shapeGroup natively
    if (!p.shapeGroup) p.shapeGroup = shapeGroup;

    // Ensure shapeName exists — prefer existing, fall back to name/NAME
    if (!p.shapeName) {
      p.shapeName =
        p.shapeName || p.name || p.NAME || p.ADMIN || `Unknown ${shapeGroup}`;
    }

    // Ensure shapeISO
    if (!p.shapeISO) {
      p.shapeISO =
        p.shapeISO || p.iso || p.ISO || p.code || p.adm1_code || "";
    }
  }

  return geojson;
}

/**
 * Simplify a GeoJSON FeatureCollection using @turf/simplify.
 */
function simplifyGeoJSON(geojson, tolerance) {
  const turf = tryLoadTurf();
  if (!turf) {
    console.log(
      "  ℹ @turf/simplify not installed — saving unsimplified geometry"
    );
    return geojson;
  }

  const before = JSON.stringify(geojson).length;
  const simplified = turf.simplify(geojson, { tolerance, highQuality: true });
  const after = JSON.stringify(simplified).length;
  const reduction = (((before - after) / before) * 100).toFixed(1);
  console.log(
    `  ✓ Simplified: ${(before / 1024).toFixed(0)} KB → ${(after / 1024).toFixed(0)} KB (${reduction}% smaller)`
  );
  return simplified;
}

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------

async function main() {
  console.log("━".repeat(60));
  console.log(" Bangladesh Boundary Downloader");
  console.log("━".repeat(60));

  // Ensure output directory exists
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });

  let successCount = 0;
  let failCount = 0;

  for (const source of SOURCES) {
    console.log(`\n📌 ${source.key.toUpperCase()}`);
    console.log(`   File: ${source.filename}`);

    let data = null;

    // Try each URL in order
    for (const url of source.urls) {
      console.log(`   Trying: ${url.replace(/.{50}/, "$&…")}`);
      const buf = await download(url);
      if (buf) {
        data = parseGeoJSON(buf);
        if (data && data.type === "FeatureCollection") break;
        data = null;
      }
    }

    if (!data || data.type !== "FeatureCollection") {
      console.log(`   ⚠ Download failed — keeping existing file (if any)`);
      failCount++;
      continue;
    }

    console.log(
      `   ℹ ${data.features.length} features retrieved`
    );

    // Normalize properties
    data = normalizeProperties(data, source.key.replace(/s$/, ""));

    // Simplify if configured
    if (source.simplify) {
      data = simplifyGeoJSON(data, source.tolerance);
    }

    // Add source metadata
    data._source = "geoBoundaries (wmgeolab/geoBoundaries)";
    data._downloaded = new Date().toISOString();
    data._simplified = source.simplify;

    // Write file
    const outPath = path.join(OUTPUT_DIR, source.filename);
    const json = JSON.stringify(data);
    fs.writeFileSync(outPath, json, "utf-8");
    console.log(
      `   💾 Saved to ${path.relative(process.cwd(), outPath)} (${(json.length / 1024).toFixed(0)} KB)`
    );

    successCount++;
  }

  console.log("\n" + "━".repeat(60));
  console.log(` Done: ${successCount} succeeded, ${failCount} skipped`);
  if (failCount > 0) {
    console.log(
      " Run again when you have internet access to populate missing files."
    );
  }
  console.log("━".repeat(60) + "\n");
}

main().catch((err) => {
  console.error("Fatal error:", err);
  process.exit(1);
});
// Vercel Serverless Function — PostGIS spatial API
//
// Provides spatial query endpoints over a PostgreSQL + PostGIS database.
// This runs alongside the existing GAS-based backend and does NOT modify it.
//
// Required env vars (set on Vercel → Settings → Environment Variables):
//   DATABASE_URL — PostgreSQL connection string
//                  e.g. postgresql://user:pass@host:5432/dbname?sslmode=require
//   Or individually: PGUSER, PGPASSWORD, PGHOST, PGPORT, PGDATABASE
//
// Required dependency (not yet in package.json — install with):
//   npm install pg
//
// Recommended Postgres hosts (all have free tiers):
//   • Supabase  — https://supabase.com  (built-in PostGIS, generous free tier)
//   • Neon      — https://neon.tech     (serverless Postgres, auto-suspend)
//   • Railway   — https://railway.app   (simple deploy, free $5 credit/month)

export const config = { runtime: 'nodejs' };

// NOTE: pg must be installed — run `npm install pg` in the project root.
// It is intentionally not added to package.json here to keep this file
// purely additive. Add "pg" to dependencies when ready to deploy.
import pg from 'pg';
const { Pool } = pg;

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

let _pool = null;

function getPool() {
  if (_pool) return _pool;

  // Support both DATABASE_URL and individual PG_* env vars.
  const databaseUrl = process.env.DATABASE_URL;
  const hasIndividual =
    process.env.PGHOST && process.env.PGDATABASE;

  if (!databaseUrl && !hasIndividual) {
    return null; // caller should return the "not configured" response
  }

  const config = databaseUrl
    ? { connectionString: databaseUrl, max: 5 }
    : {
        user: process.env.PGUSER,
        password: process.env.PGPASSWORD || '',
        host: process.env.PGHOST,
        port: parseInt(process.env.PGPORT || '5432', 10),
        database: process.env.PGDATABASE,
        max: 5,
      };

  // SSL: default to require for cloud hosts, but allow override.
  if (databaseUrl && !databaseUrl.includes('sslmode=')) {
    config.ssl = { rejectUnauthorized: false };
  }

  _pool = new Pool(config);
  return _pool;
}

function notConfigured(res) {
  return res.status(503).json({
    ok: false,
    error:
      'Spatial database is not configured. Set the DATABASE_URL environment ' +
      'variable (or PGHOST/PGDATABASE/PGUSER/PGPASSWORD) to point to a ' +
      'PostgreSQL database with PostGIS enabled.',
    setup: {
      step1: 'Provision a free PostGIS database on Supabase (supabase.com), Neon (neon.tech), or Railway (railway.app).',
      step2: 'Run sql/spatial-schema.sql against the database to create tables and functions.',
      step3: 'Set DATABASE_URL in Vercel → Settings → Environment Variables.',
      step4: 'Install the pg module: npm install pg',
    },
  });
}

/**
 * Convert a GEOGRAPHY value to a GeoJSON-like object that JSON.stringify can
 * handle.  PostGIS geography is returned as a hex WKB by node-postgres.
 */
function geographyToGeoJSON(wkbBuffer) {
  if (!wkbBuffer) return null;
  // For GeoJSON output we convert via WKT since we don't want to pull in
  // extra deps.  The client can reconstruct GeoJSON from {type, coordinates}.
  // Actually, let's just return the WKB as hex — the frontend can use
  // wellknown or terraformer-wkt-parser.  But a friendlier approach: we'll
  // ask Postgres for GeoJSON directly via ST_AsGeoJSON in our queries.
  return wkbBuffer;
}

/**
 * Helper: run a query and return rows. Handles pool errors gracefully.
 */
async function query(sql, params = []) {
  const pool = getPool();
  const client = await pool.connect();
  try {
    const result = await client.query(sql, params);
    return result.rows;
  } finally {
    client.release();
  }
}

/**
 * Helper: parse a GeoJSON feature from a PostGIS row.
 * Strips the raw geography columns and replaces them with GeoJSON geometry.
 */
function toGeoJSON(row) {
  if (!row) return null;
  const out = { ...row };
  // The queries below use ST_AsGeoJSON() to produce a `geojson` column,
  // and also a `lat`/`lng` pair for convenience.
  // Clean up raw columns the client doesn't need.
  delete out.point;
  delete out.polygon;
  delete out.centroid;
  return out;
}

// ---------------------------------------------------------------------------
// Handler
// ---------------------------------------------------------------------------

export default async function handler(req, res) {
  // CORS preflight
  if (req.method === 'OPTIONS') {
    return res.status(204).end();
  }

  const pool = getPool();
  if (!pool) {
    return notConfigured(res);
  }

  // Quick connectivity check — if the pool can't connect, say so clearly.
  try {
    const client = await pool.connect();
    client.release();
  } catch (err) {
    return res.status(503).json({
      ok: false,
      error: `Cannot connect to database: ${err.message}`,
      hint: 'Double-check DATABASE_URL or PG* env vars on Vercel.',
    });
  }

  const { method } = req;
  const { searchParams } = new URL(req.url, `http://${req.headers.host || 'localhost'}`);

  // ========================================================================
  // GET routes
  // ========================================================================
  if (method === 'GET') {
    try {
      // --- /api/spatial/stats ------------------------------------------------
      if (req.url.includes('/stats') && !req.url.includes('/density')) {
        const total = await query('SELECT COUNT(*)::int AS total FROM plantations');
        const byDistrict = await query(`
          SELECT district, COUNT(*)::int AS count,
                 SUM(total_seedlings)::int AS seedlings,
                 ROUND(AVG(survival_percent)::numeric, 1)::float AS avg_survival
          FROM plantations
          WHERE district IS NOT NULL
          GROUP BY district
          ORDER BY count DESC
        `);
        const byDivision = await query(`
          SELECT division, COUNT(*)::int AS count,
                 SUM(total_seedlings)::int AS seedlings,
                 ROUND(AVG(survival_percent)::numeric, 1)::float AS avg_survival
          FROM plantations
          WHERE division IS NOT NULL
          GROUP BY division
          ORDER BY count DESC
        `);
        const recent = await query(`
          SELECT id, submission_id, farmer_name, district, upazila,
                 planting_date, total_seedlings, survival_percent,
                 ST_Y(point::geometry) AS lat, ST_X(point::geometry) AS lng,
                 created_at
          FROM plantations
          WHERE point IS NOT NULL
          ORDER BY created_at DESC
          LIMIT 20
        `);
        return res.status(200).json({
          ok: true,
          total: total[0]?.total || 0,
          byDistrict,
          byDivision,
          recent,
        });
      }

      // --- /api/spatial/density ----------------------------------------------
      if (req.url.includes('/density')) {
        const rows = await query(`
          SELECT
            division, district, upazila,
            COUNT(*)::int AS plantation_count,
            COALESCE(SUM(total_seedlings), 0)::int AS total_seedlings,
            ROUND(AVG(survival_percent)::numeric, 1)::float AS avg_survival,
            ROUND(ST_Y(ST_Centroid(ST_Collect(point::geometry)))::numeric, 6) AS lat,
            ROUND(ST_X(ST_Centroid(ST_Collect(point::geometry)))::numeric, 6) AS lng
          FROM plantations
          WHERE point IS NOT NULL AND upazila IS NOT NULL
          GROUP BY division, district, upazila
          ORDER BY plantation_count DESC
        `);
        return res.status(200).json({ ok: true, data: rows });
      }

      // --- /api/spatial/visit?plantation_id=X --------------------------------
      if (req.url.includes('/visit')) {
        const plantationId = searchParams.get('plantation_id');
        if (!plantationId) {
          return res.status(400).json({ ok: false, error: 'plantation_id query param required' });
        }
        const rows = await query(`
          SELECT id, plantation_id, visit_date, visitor_name, visitor_mobile,
                 survival_count, dead_count, missing_count, total_planted,
                 notes, gps_accuracy,
                 CASE WHEN point IS NOT NULL THEN
                   ST_Y(point::geometry)
                 END AS lat,
                 CASE WHEN point IS NOT NULL THEN
                   ST_X(point::geometry)
                 END AS lng,
                 created_at
          FROM monitoring_visits
          WHERE plantation_id = $1
          ORDER BY visit_date DESC, created_at DESC
        `, [plantationId]);
        return res.status(200).json({ ok: true, data: rows });
      }

      // --- /api/spatial/geometry?plantation_id=X -----------------------------
      if (req.url.includes('/geometry')) {
        const plantationId = searchParams.get('plantation_id');
        if (!plantationId) {
          return res.status(400).json({ ok: false, error: 'plantation_id query param required' });
        }
        const rows = await query(`
          SELECT id, plantation_id, drawing_type,
                 ST_AsGeoJSON(geometry::geometry) AS geojson,
                 area_sqm, perimeter_m, properties, created_by,
                 created_at, updated_at
          FROM plantation_geometries
          WHERE plantation_id = $1
          ORDER BY created_at DESC
        `, [plantationId]);
        return res.status(200).json({ ok: true, data: rows });
      }

      // --- Query parameter based GET routes ----------------------------------

      // /api/spatial?bounds=sw_lat,sw_lng,ne_lat,ne_lng
      const bounds = searchParams.get('bounds');
      if (bounds) {
        const parts = bounds.split(',').map(Number);
        if (parts.length !== 4 || parts.some(isNaN)) {
          return res.status(400).json({ ok: false, error: 'bounds must be sw_lat,sw_lng,ne_lat,ne_lng' });
        }
        const [swLat, swLng, neLat, neLng] = parts;
        const rows = await query(`
          SELECT
            id, submission_id, district, upazila, division, region,
            union_name, village, farmer_name, farmer_mobile,
            saao_name, officer_name, planting_date,
            location_type, source_type, address, ndvi, remarks,
            survival_percent, total_seedlings, gps_accuracy, elevation,
            ST_AsGeoJSON(point::geometry) AS point_geojson,
            ST_AsGeoJSON(polygon::geometry) AS polygon_geojson,
            ST_Y(point::geometry) AS lat,
            ST_X(point::geometry) AS lng,
            created_at, updated_at
          FROM plantations
          WHERE point IS NOT NULL
            AND ST_X(point::geometry) BETWEEN $1 AND $2
            AND ST_Y(point::geometry) BETWEEN $3 AND $4
          ORDER BY created_at DESC
          LIMIT 2000
        `, [swLng, neLng, swLat, neLat]);
        return res.status(200).json({ ok: true, data: rows, count: rows.length });
      }

      // /api/spatial?nearby=lat,lng,radius
      const nearby = searchParams.get('nearby');
      if (nearby) {
        const parts = nearby.split(',').map(Number);
        if (parts.length < 2 || parts.some(isNaN)) {
          return res.status(400).json({ ok: false, error: 'nearby must be lat,lng[,radius_meters]' });
        }
        const [lat, lng, radius = 5000] = parts;
        const rows = await query(`
          SELECT
            id, submission_id, district, upazila, division, region,
            union_name, village, farmer_name, farmer_mobile,
            saao_name, officer_name, planting_date,
            location_type, source_type, address, ndvi, remarks,
            survival_percent, total_seedlings, gps_accuracy, elevation,
            ST_AsGeoJSON(point::geometry) AS point_geojson,
            ST_AsGeoJSON(polygon::geometry) AS polygon_geojson,
            ST_Y(point::geometry) AS lat,
            ST_X(point::geometry) AS lng,
            ROUND(ST_Distance(point, ST_MakePoint($2, $1)::geography)::numeric, 1)::float AS distance_m,
            created_at, updated_at
          FROM plantations
          WHERE point IS NOT NULL
            AND ST_DWithin(point, ST_MakePoint($2, $1)::geography, $3)
          ORDER BY point <-> ST_MakePoint($2, $1)::geography
          LIMIT 500
        `, [lat, lng, radius]);
        return res.status(200).json({ ok: true, data: rows, count: rows.length, query: { lat, lng, radius } });
      }

      // /api/spatial?district=name
      const district = searchParams.get('district');
      if (district) {
        const rows = await query(`
          SELECT
            id, submission_id, district, upazila, division, region,
            union_name, village, farmer_name, farmer_mobile,
            saao_name, officer_name, planting_date,
            location_type, source_type, address, ndvi, remarks,
            survival_percent, total_seedlings, gps_accuracy, elevation,
            ST_AsGeoJSON(point::geometry) AS point_geojson,
            ST_AsGeoJSON(polygon::geometry) AS polygon_geojson,
            ST_Y(point::geometry) AS lat,
            ST_X(point::geometry) AS lng,
            created_at, updated_at
          FROM plantations
          WHERE district ILIKE $1
          ORDER BY created_at DESC
          LIMIT 5000
        `, [district]);
        return res.status(200).json({ ok: true, data: rows, count: rows.length, district });
      }

      // /api/spatial?upazila=name
      const upazila = searchParams.get('upazila');
      if (upazila) {
        const rows = await query(`
          SELECT
            id, submission_id, district, upazila, division, region,
            union_name, village, farmer_name, farmer_mobile,
            saao_name, officer_name, planting_date,
            location_type, source_type, address, ndvi, remarks,
            survival_percent, total_seedlings, gps_accuracy, elevation,
            ST_AsGeoJSON(point::geometry) AS point_geojson,
            ST_AsGeoJSON(polygon::geometry) AS polygon_geojson,
            ST_Y(point::geometry) AS lat,
            ST_X(point::geometry) AS lng,
            created_at, updated_at
          FROM plantations
          WHERE upazila ILIKE $1
          ORDER BY created_at DESC
          LIMIT 5000
        `, [upazila]);
        return res.status(200).json({ ok: true, data: rows, count: rows.length, upazila });
      }

      // /api/spatial?submission_id=xxx — single plantation lookup
      const submissionId = searchParams.get('submission_id');
      if (submissionId) {
        const rows = await query(`
          SELECT
            p.*,
            ST_AsGeoJSON(p.point::geometry) AS point_geojson,
            ST_AsGeoJSON(p.polygon::geometry) AS polygon_geojson,
            ST_Y(p.point::geometry) AS lat,
            ST_X(p.point::geometry) AS lng,
            (SELECT json_agg(
              json_build_object(
                'id', v.id, 'visit_date', v.visit_date,
                'visitor_name', v.visitor_name, 'survival_count', v.survival_count,
                'dead_count', v.dead_count, 'missing_count', v.missing_count,
                'total_planted', v.total_planted, 'notes', v.notes, 'created_at', v.created_at
              )
              ORDER BY v.visit_date DESC
            ) FROM monitoring_visits v WHERE v.plantation_id = p.id) AS visits
          FROM plantations p
          WHERE p.submission_id = $1
        `, [submissionId]);
        if (!rows.length) {
          return res.status(404).json({ ok: false, error: 'Plantation not found' });
        }
        return res.status(200).json({ ok: true, data: rows[0] });
      }

      // No recognized query param — return a help message
      return res.status(200).json({
        ok: true,
        message: 'Plantation Tracker Spatial API',
        endpoints: {
          'GET /api/spatial?bounds=sw_lat,sw_lng,ne_lat,ne_lng': 'Plantations in a bounding box',
          'GET /api/spatial?nearby=lat,lng,radius': 'Nearby plantations (radius in meters, default 5000)',
          'GET /api/spatial?district=name': 'Plantations filtered by district (case-insensitive)',
          'GET /api/spatial?upazila=name': 'Plantations filtered by upazila (case-insensitive)',
          'GET /api/spatial?submission_id=xxx': 'Single plantation by submission ID',
          'GET /api/spatial/stats': 'Aggregate statistics (total, by district, by division)',
          'GET /api/spatial/density': 'Upazila-level density data for heatmap',
          'POST /api/spatial/plantation': 'Upsert a plantation record',
          'POST /api/spatial/geometry': 'Save a drawn geometry',
          'GET /api/spatial/geometry?plantation_id=X': 'Get geometries for a plantation',
          'DELETE /api/spatial/geometry?id=X': 'Delete a geometry',
          'POST /api/spatial/visit': 'Record a monitoring visit',
          'GET /api/spatial/visit?plantation_id=X': 'Get visits for a plantation',
        },
      });
    } catch (err) {
      return res.status(500).json({ ok: false, error: err.message });
    }
  }

  // ========================================================================
  // POST /api/spatial/plantation  — Upsert a plantation
  // ========================================================================
  if (method === 'POST' && req.url.includes('/plantation')) {
    try {
      const body = req.body;
      if (!body || !body.submission_id) {
        return res.status(400).json({ ok: false, error: 'submission_id is required' });
      }

      const lat = parseFloat(body.latitude);
      const lng = parseFloat(body.longitude);
      const hasCoords = !isNaN(lat) && !isNaN(lng);

      const row = await query(`
        INSERT INTO plantations (
          submission_id, point, centroid, gps_accuracy, elevation, bearing,
          recorded_at, offline_sync_id, division, region, district, upazila,
          union_name, village, farmer_name, farmer_mobile, saao_name,
          saao_mobile, officer_name, officer_mobile, planting_date,
          location_type, source_type, address, ndvi, remarks,
          survival_percent, total_seedlings, photo_sha256, auth_hash, synced_at
        ) VALUES (
          $1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16,$17,$18,$19,
          $20,$21,$22,$23,$24,$25,$26,$27,$28,$29,$30,$31
        )
        ON CONFLICT (submission_id) DO UPDATE SET
          point       = EXCLUDED.point,
          centroid    = EXCLUDED.centroid,
          gps_accuracy = EXCLUDED.gps_accuracy,
          elevation   = EXCLUDED.elevation,
          bearing     = EXCLUDED.bearing,
          recorded_at = EXCLUDED.recorded_at,
          division    = EXCLUDED.division,
          region      = EXCLUDED.region,
          district    = EXCLUDED.district,
          upazila     = EXCLUDED.upazila,
          union_name  = EXCLUDED.union_name,
          village     = EXCLUDED.village,
          farmer_name = EXCLUDED.farmer_name,
          farmer_mobile = EXCLUDED.farmer_mobile,
          saao_name   = EXCLUDED.saao_name,
          saao_mobile = EXCLUDED.saao_mobile,
          officer_name = EXCLUDED.officer_name,
          officer_mobile = EXCLUDED.officer_mobile,
          planting_date = EXCLUDED.planting_date,
          location_type = EXCLUDED.location_type,
          source_type = EXCLUDED.source_type,
          address     = EXCLUDED.address,
          ndvi        = EXCLUDED.ndvi,
          remarks     = EXCLUDED.remarks,
          survival_percent = EXCLUDED.survival_percent,
          total_seedlings = EXCLUDED.total_seedlings,
          photo_sha256 = EXCLUDED.photo_sha256,
          auth_hash   = EXCLUDED.auth_hash,
          synced_at   = EXCLUDED.synced_at
        RETURNING id, submission_id
      `, [
        body.submission_id,
        hasCoords ? `SRID=4326;POINT(${lng} ${lat})` : null,
        hasCoords ? `SRID=4326;POINT(${lng} ${lat})` : null,
        body.gps_accuracy ? parseFloat(body.gps_accuracy) : null,
        body.elevation ? parseFloat(body.elevation) : null,
        body.bearing ? parseFloat(body.bearing) : null,
        body.recorded_at || null,
        body.offline_sync_id || null,
        body.division || null,
        body.region || null,
        body.district || null,
        body.upazila || null,
        body.union_name || body.unionName || null,
        body.village || null,
        body.farmer_name || body.farmerName || null,
        body.farmer_mobile || body.farmerMobile || null,
        body.saao_name || body.saaoName || null,
        body.saao_mobile || body.saaoMobile || null,
        body.officer_name || body.officerName || null,
        body.officer_mobile || body.officerMobile || null,
        body.planting_date || body.plantingDate || null,
        body.location_type || body.locationType || null,
        body.source_type || body.sourceType || null,
        body.address || null,
        body.ndvi ? parseFloat(body.ndvi) : null,
        body.remarks || null,
        body.survival_percent ? parseFloat(body.survival_percent) : null,
        body.total_seedlings ? parseInt(body.total_seedlings, 10) : 0,
        body.photo_sha256 || body.photoSha256 || null,
        body.auth_hash || body.authHash || null,
        new Date(),
      ]);

      return res.status(200).json({ ok: true, id: row[0].id, submission_id: row[0].submission_id });
    } catch (err) {
      return res.status(500).json({ ok: false, error: err.message });
    }
  }

  // ========================================================================
  // POST /api/spatial/geometry  — Save a drawn geometry
  // ========================================================================
  if (method === 'POST' && req.url.includes('/geometry')) {
    try {
      const body = req.body;
      if (!body || !body.geometry || !body.drawing_type) {
        return res.status(400).json({ ok: false, error: 'geometry (GeoJSON) and drawing_type are required' });
      }

      // Convert GeoJSON geometry to WKT for PostGIS
      const geoWKT = geoJSONToWKT(body.geometry);
      if (!geoWKT) {
        return res.status(400).json({ ok: false, error: 'Could not parse geometry. Expected GeoJSON with type and coordinates.' });
      }

      const row = await query(`
        INSERT INTO plantation_geometries (
          plantation_id, drawing_type, geometry, area_sqm, perimeter_m,
          properties, created_by
        ) VALUES ($1, $2, $3, $4, $5, $6, $7)
        RETURNING id, drawing_type, area_sqm, perimeter_m, created_at
      `, [
        body.plantation_id || null,
        body.drawing_type,
        `SRID=4326;${geoWKT}`,
        body.area_sqm || null,
        body.perimeter_m || null,
        JSON.stringify(body.properties || {}),
        body.created_by || null,
      ]);

      return res.status(201).json({ ok: true, data: row[0] });
    } catch (err) {
      return res.status(500).json({ ok: false, error: err.message });
    }
  }

  // ========================================================================
  // DELETE /api/spatial/geometry?id=X
  // ========================================================================
  if (method === 'DELETE' && req.url.includes('/geometry')) {
    try {
      const id = searchParams.get('id');
      if (!id) {
        return res.status(400).json({ ok: false, error: 'id query param required' });
      }
      const result = await query(
        'DELETE FROM plantation_geometries WHERE id = $1 RETURNING id',
        [id]
      );
      if (!result.length) {
        return res.status(404).json({ ok: false, error: 'Geometry not found' });
      }
      return res.status(200).json({ ok: true, deleted: result[0].id });
    } catch (err) {
      return res.status(500).json({ ok: false, error: err.message });
    }
  }

  // ========================================================================
  // POST /api/spatial/visit  — Record a monitoring visit
  // ========================================================================
  if (method === 'POST' && req.url.includes('/visit')) {
    try {
      const body = req.body;
      if (!body || !body.plantation_id) {
        return res.status(400).json({ ok: false, error: 'plantation_id is required' });
      }

      const lat = parseFloat(body.latitude);
      const lng = parseFloat(body.longitude);
      const hasCoords = !isNaN(lat) && !isNaN(lng);

      const row = await query(`
        INSERT INTO monitoring_visits (
          plantation_id, visit_date, visitor_name, visitor_mobile,
          survival_count, dead_count, missing_count, total_planted,
          notes, point, gps_accuracy
        ) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11)
        RETURNING id, plantation_id, visit_date
      `, [
        parseInt(body.plantation_id, 10),
        body.visit_date || null,
        body.visitor_name || body.visitorName || null,
        body.visitor_mobile || body.visitorMobile || null,
        body.survival_count ? parseInt(body.survival_count, 10) : null,
        body.dead_count ? parseInt(body.dead_count, 10) : null,
        body.missing_count ? parseInt(body.missing_count, 10) : null,
        body.total_planted ? parseInt(body.total_planted, 10) : null,
        body.notes || null,
        hasCoords ? `SRID=4326;POINT(${lng} ${lat})` : null,
        body.gps_accuracy ? parseFloat(body.gps_accuracy) : null,
      ]);

      return res.status(201).json({ ok: true, data: row[0] });
    } catch (err) {
      return res.status(500).json({ ok: false, error: err.message });
    }
  }

  // ========================================================================
  // Catch-all
  // ========================================================================
  return res.status(405).json({ ok: false, error: 'Method not allowed' });
}

// ---------------------------------------------------------------------------
// GeoJSON → WKT converter (minimal, no external deps)
// Handles Point, LineString, Polygon, MultiPolygon, and GeometryCollection.
// ---------------------------------------------------------------------------

function geoJSONToWKT(geojson) {
  if (!geojson || !geojson.type) return null;

  switch (geojson.type) {
    case 'Point':
      return `POINT(${coordPair(geojson.coordinates)})`;
    case 'LineString':
      return `LINESTRING(${coordList(geojson.coordinates)})`;
    case 'Polygon':
      return `POLYGON(${ringList(geojson.coordinates)})`;
    case 'MultiPolygon':
      return `MULTIPOLYGON(${geojson.coordinates.map(ringList).join(',')})`;
    case 'GeometryCollection':
      return geojson.geometries.map(geoJSONToWKT).filter(Boolean).join(';');
    default:
      return null;
  }
}

function coordPair(c) {
  return `${c[0]} ${c[1]}`;
}

function coordList(coords) {
  return coords.map(coordPair).join(',');
}

function ringList(rings) {
  return rings.map(ring => `(${coordList(ring)})`).join(',');
}
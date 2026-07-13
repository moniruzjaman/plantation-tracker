-- ============================================================================
-- PostGIS Spatial Schema for Plantation Tracker
-- ============================================================================
-- Run this against a PostgreSQL 14+ database with PostGIS 3.x installed.
-- Recommended hosts: Supabase (free tier), Neon, or Railway.
-- ============================================================================

-- Enable PostGIS extension
CREATE EXTENSION IF NOT EXISTS postgis;

-- ============================================================================
-- Core plantation spatial table
-- ============================================================================
CREATE TABLE IF NOT EXISTS plantations (
  id SERIAL PRIMARY KEY,
  submission_id VARCHAR(255) UNIQUE,

  -- Spatial data
  point GEOGRAPHY(POINT, 4326),
  polygon GEOGRAPHY(POLYGON, 4326),
  centroid GEOGRAPHY(POINT, 4326),

  -- GPS metadata
  gps_accuracy FLOAT,
  elevation FLOAT,
  bearing FLOAT,
  recorded_at TIMESTAMPTZ,
  offline_sync_id VARCHAR(255),

  -- Administrative hierarchy (denormalized for fast queries)
  division VARCHAR(255),
  region VARCHAR(255),
  district VARCHAR(255),
  upazila VARCHAR(255),
  union_name VARCHAR(255),
  village VARCHAR(255),

  -- Plantation data
  farmer_name VARCHAR(255),
  farmer_mobile VARCHAR(50),
  saao_name VARCHAR(255),
  saao_mobile VARCHAR(50),
  officer_name VARCHAR(255),
  officer_mobile VARCHAR(50),
  planting_date DATE,
  location_type VARCHAR(100),
  source_type VARCHAR(100),
  address TEXT,
  ndvi FLOAT,
  remarks TEXT,
  survival_percent FLOAT,
  total_seedlings INT DEFAULT 0,

  -- Metadata
  photo_sha256 VARCHAR(128),
  auth_hash VARCHAR(128),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  synced_at TIMESTAMPTZ
);

-- ============================================================================
-- Spatial indexes
-- ============================================================================
CREATE INDEX IF NOT EXISTS idx_plantations_point ON plantations USING GIST(point);
CREATE INDEX IF NOT EXISTS idx_plantations_polygon ON plantations USING GIST(polygon);
CREATE INDEX IF NOT EXISTS idx_plantations_district ON plantations(district);
CREATE INDEX IF NOT EXISTS idx_plantations_upazila ON plantations(upazila);
CREATE INDEX IF NOT EXISTS idx_plantations_division ON plantations(division);
CREATE INDEX IF NOT EXISTS idx_plantations_planting_date ON plantations(planting_date);
CREATE INDEX IF NOT EXISTS idx_plantations_submission_id ON plantations(submission_id);

-- ============================================================================
-- Monitoring visits table
-- ============================================================================
CREATE TABLE IF NOT EXISTS monitoring_visits (
  id SERIAL PRIMARY KEY,
  plantation_id INT REFERENCES plantations(id) ON DELETE CASCADE,
  visit_date DATE,
  visitor_name VARCHAR(255),
  visitor_mobile VARCHAR(50),
  survival_count INT,
  dead_count INT,
  missing_count INT,
  total_planted INT,
  notes TEXT,
  point GEOGRAPHY(POINT, 4326),
  gps_accuracy FLOAT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_visits_plantation ON monitoring_visits USING GIST(point);
CREATE INDEX IF NOT EXISTS idx_visits_plantation_id ON monitoring_visits(plantation_id);

-- ============================================================================
-- Geometry drawings table (from MapLibre Draw)
-- ============================================================================
CREATE TABLE IF NOT EXISTS plantation_geometries (
  id SERIAL PRIMARY KEY,
  plantation_id INT REFERENCES plantations(id) ON DELETE SET NULL,
  drawing_type VARCHAR(50) NOT NULL CHECK (drawing_type IN ('polygon', 'point', 'line')),
  geometry GEOGRAPHY(GEOMETRY, 4326) NOT NULL,
  area_sqm FLOAT,
  perimeter_m FLOAT,
  properties JSONB DEFAULT '{}',
  created_by VARCHAR(255),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_geometries_geom ON plantation_geometries USING GIST(geometry);
CREATE INDEX IF NOT EXISTS idx_geometries_plantation ON plantation_geometries(plantation_id);

-- ============================================================================
-- Auto-update trigger for updated_at columns
-- ============================================================================
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_plantations_updated_at ON plantations;
CREATE TRIGGER trg_plantations_updated_at
  BEFORE UPDATE ON plantations
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS trg_geometries_updated_at ON plantation_geometries;
CREATE TRIGGER trg_geometries_updated_at
  BEFORE UPDATE ON plantation_geometries
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ============================================================================
-- Spatial query functions
-- ============================================================================

-- Plantations within a given radius (meters) of a point
-- Usage: SELECT * FROM nearby_plantations(23.8103, 90.4125, 5000);
CREATE OR REPLACE FUNCTION nearby_plantations(
  lat DOUBLE PRECISION,
  lng DOUBLE PRECISION,
  radius_meters DOUBLE PRECISION DEFAULT 5000
)
RETURNS TABLE (
  id INT,
  submission_id VARCHAR(255),
  point GEOGRAPHY,
  polygon GEOGRAPHY,
  centroid GEOGRAPHY,
  gps_accuracy FLOAT,
  elevation FLOAT,
  bearing FLOAT,
  recorded_at TIMESTAMPTZ,
  division VARCHAR(255),
  region VARCHAR(255),
  district VARCHAR(255),
  upazila VARCHAR(255),
  union_name VARCHAR(255),
  village VARCHAR(255),
  farmer_name VARCHAR(255),
  farmer_mobile VARCHAR(50),
  saao_name VARCHAR(255),
  saao_mobile VARCHAR(50),
  officer_name VARCHAR(255),
  officer_mobile VARCHAR(50),
  planting_date DATE,
  location_type VARCHAR(100),
  source_type VARCHAR(100),
  address TEXT,
  ndvi FLOAT,
  remarks TEXT,
  survival_percent FLOAT,
  total_seedlings INT,
  photo_sha256 VARCHAR(128),
  created_at TIMESTAMPTZ,
  updated_at TIMESTAMPTZ,
  distance_m FLOAT
)
AS $$
BEGIN
  RETURN QUERY
  SELECT
    p.id, p.submission_id, p.point, p.polygon, p.centroid,
    p.gps_accuracy, p.elevation, p.bearing, p.recorded_at,
    p.division, p.region, p.district, p.upazila, p.union_name, p.village,
    p.farmer_name, p.farmer_mobile, p.saao_name, p.saao_mobile,
    p.officer_name, p.officer_mobile, p.planting_date,
    p.location_type, p.source_type, p.address, p.ndvi, p.remarks,
    p.survival_percent, p.total_seedlings, p.photo_sha256,
    p.created_at, p.updated_at,
    ST_Distance(p.point, ST_MakePoint(lng, lat)::geography) AS distance_m
  FROM plantations p
  WHERE p.point IS NOT NULL
    AND ST_DWithin(p.point, ST_MakePoint(lng, lat)::geography, radius_meters)
  ORDER BY distance_m ASC;
END;
$$ LANGUAGE plpgsql STABLE;

-- Plantations inside a bounding box (southwest / northeast corners)
-- Usage: SELECT * FROM plantations_in_bounds(23.7, 90.3, 23.9, 90.5);
CREATE OR REPLACE FUNCTION plantations_in_bounds(
  sw_lat DOUBLE PRECISION,
  sw_lng DOUBLE PRECISION,
  ne_lat DOUBLE PRECISION,
  ne_lng DOUBLE PRECISION
)
RETURNS TABLE (
  id INT,
  submission_id VARCHAR(255),
  point GEOGRAPHY,
  polygon GEOGRAPHY,
  centroid GEOGRAPHY,
  gps_accuracy FLOAT,
  elevation FLOAT,
  bearing FLOAT,
  recorded_at TIMESTAMPTZ,
  division VARCHAR(255),
  region VARCHAR(255),
  district VARCHAR(255),
  upazila VARCHAR(255),
  union_name VARCHAR(255),
  village VARCHAR(255),
  farmer_name VARCHAR(255),
  farmer_mobile VARCHAR(50),
  saao_name VARCHAR(255),
  saao_mobile VARCHAR(50),
  officer_name VARCHAR(255),
  officer_mobile VARCHAR(50),
  planting_date DATE,
  location_type VARCHAR(100),
  source_type VARCHAR(100),
  address TEXT,
  ndvi FLOAT,
  remarks TEXT,
  survival_percent FLOAT,
  total_seedlings INT,
  photo_sha256 VARCHAR(128),
  created_at TIMESTAMPTZ,
  updated_at TIMESTAMPTZ
)
AS $$
BEGIN
  RETURN QUERY
  SELECT
    p.id, p.submission_id, p.point, p.polygon, p.centroid,
    p.gps_accuracy, p.elevation, p.bearing, p.recorded_at,
    p.division, p.region, p.district, p.upazila, p.union_name, p.village,
    p.farmer_name, p.farmer_mobile, p.saao_name, p.saao_mobile,
    p.officer_name, p.officer_mobile, p.planting_date,
    p.location_type, p.source_type, p.address, p.ndvi, p.remarks,
    p.survival_percent, p.total_seedlings, p.photo_sha256,
    p.created_at, p.updated_at
  FROM plantations p
  WHERE p.point IS NOT NULL
    AND ST_X(p.point::geometry) BETWEEN sw_lng AND ne_lng
    AND ST_Y(p.point::geometry) BETWEEN sw_lat AND ne_lat
  ORDER BY p.created_at DESC;
END;
$$ LANGUAGE plpgsql STABLE;

-- Aggregate statistics for a single district
-- Usage: SELECT * FROM district_stats('Dhaka');
CREATE OR REPLACE FUNCTION district_stats(
  district_name VARCHAR(255)
)
RETURNS TABLE (
  district VARCHAR(255),
  total_plantations BIGINT,
  total_seedlings BIGINT,
  avg_survival FLOAT,
  avg_ndvi FLOAT,
  earliest_date DATE,
  latest_date DATE,
  total_upazilas INT,
  total_unions INT,
  unique_farmers BIGINT,
  unique_officers BIGINT
)
AS $$
BEGIN
  RETURN QUERY
  SELECT
    p.district,
    COUNT(*)::BIGINT AS total_plantations,
    COALESCE(SUM(p.total_seedlings), 0)::BIGINT AS total_seedlings,
    ROUND(AVG(p.survival_percent)::numeric, 1)::float AS avg_survival,
    ROUND(AVG(p.ndvi)::numeric, 3)::float AS avg_ndvi,
    MIN(p.planting_date) AS earliest_date,
    MAX(p.planting_date) AS latest_date,
    COUNT(DISTINCT p.upazila) AS total_upazilas,
    COUNT(DISTINCT p.union_name) AS total_unions,
    COUNT(DISTINCT p.farmer_mobile) AS unique_farmers,
    COUNT(DISTINCT p.officer_mobile) AS unique_officers
  FROM plantations p
  WHERE p.district = district_name;
END;
$$ LANGUAGE plpgsql STABLE;

-- Per-upazila density data suitable for a heatmap layer
-- Usage: SELECT * FROM upazila_density();
CREATE OR REPLACE FUNCTION upazila_density()
RETURNS TABLE (
  division VARCHAR(255),
  district VARCHAR(255),
  upazila VARCHAR(255),
  plantation_count BIGINT,
  total_seedlings BIGINT,
  avg_survival FLOAT,
  centroid_lat DOUBLE PRECISION,
  centroid_lng DOUBLE PRECISION,
  convex_hull GEOGRAPHY
)
AS $$
BEGIN
  RETURN QUERY
  SELECT
    p.division,
    p.district,
    p.upazila,
    COUNT(*)::BIGINT AS plantation_count,
    COALESCE(SUM(p.total_seedlings), 0)::BIGINT AS total_seedlings,
    ROUND(AVG(p.survival_percent)::numeric, 1)::float AS avg_survival,
    ST_Y(ST_Centroid(ST_Collect(p.point::geometry))) AS centroid_lat,
    ST_X(ST_Centroid(ST_Collect(p.point::geometry))) AS centroid_lng,
    ST_ConvexHull(ST_Collect(p.point::geometry))::geography AS convex_hull
  FROM plantations p
  WHERE p.point IS NOT NULL
    AND p.upazila IS NOT NULL
  GROUP BY p.division, p.district, p.upazila
  ORDER BY plantation_count DESC;
END;
$$ LANGUAGE plpgsql STABLE;
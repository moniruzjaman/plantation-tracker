/**
 * Database model types — mirrors prisma/schema.prisma.
 * Use these in API routes, components, and utilities
 * instead of importing from @prisma/client directly
 * (keeps client code decoupled from the ORM).
 */

// ─── Admin Hierarchy ──────────────────────────────────────

export interface DbDivision {
  id: number;
  code: string;
  name_bn: string;   // snake_case matches DB column
  name_en: string;
  created_at: string;
  updated_at: string;
}

export interface DbDistrict {
  id: number;
  division_id: number;
  code: string;
  name_bn: string;
  name_en: string;
  lat: number | null;
  lng: number | null;
  created_at: string;
  updated_at: string;
}

export interface DbUpazila {
  id: number;
  district_id: number;
  code: string;
  name_bn: string;
  name_en: string;
  lat: number | null;
  lng: number | null;
  created_at: string;
  updated_at: string;
}

export interface DbUnion {
  id: number;
  upazila_id: number;
  name_bn: string;
  name_en: string | null;
  created_at: string;
  updated_at: string;
}

// ─── Application Data ─────────────────────────────────────

export interface DbUserProfile {
  id: number;
  mobile: string;
  name: string | null;
  designation: string | null;
  office: string | null;
  district: string | null;
  upazila: string | null;
  role: string | null;
  photo_url: string | null;
  synced_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface DbSubmission {
  id: number;
  submission_id: string;
  user_profile_id: number | null;
  farmer_name: string | null;
  farmer_mobile: string | null;
  nursery_name: string | null;
  division: string | null;
  region: string | null;
  district: string | null;
  upazila: string | null;
  union_name: string | null;
  village: string | null;
  block: string | null;
  location_type: string | null;
  specific_address: string | null;
  seedling_source: string | null;
  latitude: number | null;
  longitude: number | null;
  planting_date: string | null;
  seedlings_json: SeedlingRecord[] | null;
  species_summary: string | null;
  total_species: number | null;
  total_seedlings: number | null;
  initial_ndvi: number | null;
  photo_url: string | null;
  photo_sha256: string | null;
  auth_hash: string | null;
  saao_name: string | null;
  saao_mobile: string | null;
  monitor_name: string | null;
  monitor_mobile: string | null;
  comments: string | null;
  source: string | null;
  synced_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface SeedlingRecord {
  speciesName?: string;
  category?: string;
  quantity?: number | string;
}

export interface DbGrowthLog {
  id: number;
  submission_id: string;
  reading_date: string;
  ndvi_value: number;
  photo_url: string | null;
  remarks: string | null;
  recorded_by: string | null;
  synced_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface DbValidationTask {
  id: number;
  task_id: string;
  submission_id: string;
  site_id: string | null;
  saao_id: string | null;
  saao_name: string | null;
  decision: string | null;
  remarks: string | null;
  decided_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface DbAuditLog {
  id: number;
  entity: string;
  entity_id: string;
  action: string;
  user_id: string | null;
  user_name: string | null;
  device: string | null;
  gps: string | null;
  old_value: string | null;
  new_value: string | null;
  created_at: string;
}

// ─── API Response Wrappers ─────────────────────────────────

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

export interface SubmissionSummary {
  district: string;
  upazila: string;
  totalSeedlings: number;
  totalSubmissions: number;
  totalSpecies: number;
}

// ─── Dropdown option type for forms ────────────────────────

export interface SelectOption {
  value: string;
  label: string;
  labelEn?: string;
}

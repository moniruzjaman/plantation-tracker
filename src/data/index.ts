/**
 * Barrel export for the admin hierarchy data layer.
 *
 * Import from here in app code:
 *   import { DISTRICTS, getUpazilaOptionsForDistrict } from '@/data';
 *
 * For DB integration:
 *   import type { DbSubmission, DbUserProfile } from '@/data';
 */
export {
  // Types
  type Division,
  type District,
  type Upazila,
  type Union,
  type AdminHierarchy,
  // Static data
  DIVISIONS,
  DISTRICTS,
  UPAZILAS,
  UNIONS,
  // Lookup maps
  DIVISION_BY_ID,
  DISTRICT_BY_ID,
  DISTRICT_BY_BN,
  UPAZILA_BY_ID,
  UPAZILA_BY_BN,
  DISTRICT_TO_DIVISION,
  UPAZILAS_BY_DISTRICT,
  UNIONS_BY_UPAZILA,
  // Hierarchy tree
  ADMIN_HIERARCHY,
  default,
  // Query helpers
  getUnionsForUpazila,
  getUpazilasForDistrict,
  getDivisionForDistrict,
} from './adminHierarchy';

export {
  // Dropdown options
  getDivisionOptions,
  getDistrictOptions,
  getDistrictOptionsForDivision,
  getUpazilaOptions,
  getUpazilaOptionsForDistrict,
  getUnionOptions,
  getUnionOptionsForUpazila,
  // Validation
  isValidDistrict,
  isValidUpazila,
  isUpazilaInDistrict,
  isUnionInUpazila,
  // ID resolution
  getDistrictId,
  getUpazilaId,
  getDivisionIdForDistrict,
  // Stats
  getDistrictStats,
  getUpazilaCountByDistrict,
  getUnionCountByUpazila,
  resolveDivisionFromDistrict,
  // Utilities
  serializeHierarchy,
  parseHierarchy,
} from './adminHierarchyLoader';

export type {
  DbDivision,
  DbDistrict,
  DbUpazila,
  DbUnion,
  DbUserProfile,
  DbSubmission,
  DbGrowthLog,
  DbValidationTask,
  DbAuditLog,
  SeedlingRecord,
  PaginatedResponse,
  SubmissionSummary,
  SelectOption,
} from './db-types';

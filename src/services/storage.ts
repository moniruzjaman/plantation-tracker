/**
 * LocalStorage service for Plantation Tracker.
 * All JSON parse/write is wrapped with graceful error handling so the app
 * never crashes on corrupted or missing data.
 */

import type { Submission } from '../components/OfflinePlantationDashboard';

// ---------------------------------------------------------------------------
// Profile interface (defined inline as required)
// ---------------------------------------------------------------------------

export interface Profile {
  name?: string;
  mobile?: string;
  designation?: string;
  region?: string;
  district?: string;
  upazila?: string;
  block?: string;
  saaoName?: string;
  saaoMobile?: string;
  officerName?: string;
  officerMobile?: string;
  googleEmail?: string;
}

// ---------------------------------------------------------------------------
// Internal helpers
// ---------------------------------------------------------------------------

function safeRead<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    if (raw === null) return fallback;
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

function safeWrite<T>(key: string, value: T): void {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // Storage full or unavailable — silently swallow.
  }
}

// ---------------------------------------------------------------------------
// Submissions
// ---------------------------------------------------------------------------

const SUBMISSIONS_KEY = 'nursery_submissions';

/**
 * Reads all submissions from localStorage.
 * Returns an empty array when the key is missing or the data is corrupted.
 */
export function getSubmissions(): Submission[] {
  return safeRead<Submission[]>(SUBMISSIONS_KEY, []);
}

/**
 * Persists the full submissions array to localStorage.
 */
export function saveSubmissions(subs: Submission[]): void {
  safeWrite(SUBMISSIONS_KEY, subs);
}

// ---------------------------------------------------------------------------
// Profile
// ---------------------------------------------------------------------------

const PROFILE_KEY = 'plantation_profile';

/**
 * Reads the operator profile, or `null` if not yet saved / corrupted.
 */
export function getProfile(): Profile | null {
  return safeRead<Profile | null>(PROFILE_KEY, null);
}

/**
 * Persists the operator profile to localStorage.
 */
export function saveProfile(profile: Profile): void {
  safeWrite(PROFILE_KEY, profile);
}

// ---------------------------------------------------------------------------
// Admin password
// ---------------------------------------------------------------------------

const ADMIN_PW_KEY = 'admin_password';

/**
 * Returns the stored admin password, or an empty string when not set.
 */
export function getAdminPassword(): string {
  return safeRead<string>(ADMIN_PW_KEY, '');
}
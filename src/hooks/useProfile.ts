import { useState, useEffect, useCallback, useRef } from 'react';
import { getProfile, saveProfile } from '../services/storage';

// ── Public types ──────────────────────────────────────────────────────────

export interface Profile {
  name?: string;
  mobile?: string;
  designation?: string;
  shortRole?: string;
  roleLabel?: string;
  region?: string;
  district?: string;
  upazila?: string;
  block?: string;
  union?: string;
  googleEmail?: string;
  email?: string;
  saaoName?: string;
  saaoMobile?: string;
  officerName?: string;
  officerMobile?: string;
  deviceId?: string;
}

/** Key fields that constitute a "complete" profile for gating submissions. */
const REQUIRED_PROFILE_FIELDS: (keyof Profile)[] = ['name', 'mobile', 'designation'];

// ── Hook ──────────────────────────────────────────────────────────────────

export function useProfile() {
  const [profile, setProfile] = useState<Profile>({});
  const hydratedRef = useRef(false);

  // ── Hydrate from localStorage on mount ──────────────────────────────────
  useEffect(() => {
    if (hydratedRef.current) return;
    hydratedRef.current = true;
    setProfile(getProfile());
  }, []);

  // ── Persist to localStorage ─────────────────────────────────────────────
  const save = useCallback((updated: Profile) => {
    setProfile(updated);
    saveProfile(updated);
  }, []);

  // ── Gate: returns true when the profile is complete enough to proceed.
  //    Returns false when the caller should prompt the user to fill in
  //    missing fields before allowing a submission. ─────────────────────────
  const requireProfileOrPrompt = useCallback((): boolean => {
    const p = getProfile(); // always check latest from storage
    const isComplete = REQUIRED_PROFILE_FIELDS.every(
      (key) => p[key] && String(p[key]).trim().length > 0,
    );
    if (!isComplete) {
      setProfile(p); // sync state so UI can show current (incomplete) values
    }
    return isComplete;
  }, []);

  return {
    profile,
    save,
    requireProfileOrPrompt,
  };
}

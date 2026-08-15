/**
 * Tests for storage service — localStorage CRUD operations.
 */
import { describe, it, expect, beforeEach } from 'vitest';
import {
  getSubmissions,
  saveSubmissions,
  getProfile,
  saveProfile,
  getAdminPassword,
} from '../services/storage';

// Clear localStorage before each test
beforeEach(() => {
  localStorage.clear();
});

describe('getSubmissions', () => {
  it('returns empty array when no data stored', () => {
    expect(getSubmissions()).toEqual([]);
  });

  it('returns parsed data from localStorage', () => {
    const data = [{ id: 'PT-1', farmerName: 'Test' }];
    localStorage.setItem('nursery_submissions', JSON.stringify(data));
    expect(getSubmissions()).toEqual(data);
  });

  it('returns empty array for corrupted data', () => {
    localStorage.setItem('nursery_submissions', 'not-json');
    expect(getSubmissions()).toEqual([]);
  });
});

describe('saveSubmissions', () => {
  it('persists submissions to localStorage', () => {
    const data = [{ id: 'PT-1', farmerName: 'Test' }];
    saveSubmissions(data);
    expect(localStorage.getItem('nursery_submissions')).toBe(JSON.stringify(data));
  });
});

describe('getProfile', () => {
  it('returns null when no profile stored', () => {
    expect(getProfile()).toBeNull();
  });

  it('returns parsed profile from localStorage', () => {
    const profile = { name: 'Test User', mobile: '01712345678' };
    localStorage.setItem('plantation_profile', JSON.stringify(profile));
    expect(getProfile()).toEqual(profile);
  });
});

describe('saveProfile', () => {
  it('persists profile to localStorage', () => {
    const profile = { name: 'Test User', mobile: '01712345678' };
    saveProfile(profile);
    expect(localStorage.getItem('plantation_profile')).toBe(JSON.stringify(profile));
  });
});

describe('getAdminPassword', () => {
  it('returns empty string when no password stored', () => {
    expect(getAdminPassword()).toBe('');
  });

  it('returns stored password', () => {
    localStorage.setItem('admin_password', '"secret123"');
    expect(getAdminPassword()).toBe('secret123');
  });
});

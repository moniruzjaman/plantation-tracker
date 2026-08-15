/**
 * Tests for the useProfile hook — profile state management.
 */
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useProfile } from '../hooks/useProfile';
import { saveProfile as saveProfileService, getProfile as getProfileService } from '../services/storage';

vi.mock('../services/storage', () => ({
  getProfile: vi.fn(),
  saveProfile: vi.fn(),
}));

describe('useProfile', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('initializes with empty profile', async () => {
    (getProfileService as ReturnType<typeof vi.fn>).mockReturnValue(null);
    const { result } = renderHook(() => useProfile());
    expect(result.current).toBeDefined();
    expect(result.current.profile).toBeDefined();
    expect(result.current.save).toBeDefined();
    expect(result.current.requireProfileOrPrompt).toBeDefined();
  });

  it('hydrates from localStorage on mount', async () => {
    const profile = { name: 'Test', mobile: '01700000000', designation: 'SAAO' };
    (getProfileService as ReturnType<typeof vi.fn>).mockReturnValue(profile);
    const { result } = renderHook(() => useProfile());
    // The useEffect hydrates asynchronously; wait for it
    await vi.waitFor(() => {
      expect(result.current.profile.name).toBe('Test');
    });
    expect(result.current.profile.mobile).toBe('01700000000');
  });

  it('saves profile with save function', async () => {
    (getProfileService as ReturnType<typeof vi.fn>).mockReturnValue(null);
    const { result } = renderHook(() => useProfile());
    const newProfile = { name: 'New User', mobile: '01712345678' };
    act(() => {
      result.current.save(newProfile);
    });
    expect(saveProfileService).toHaveBeenCalledWith(newProfile);
  });

  it('updates state on save', async () => {
    (getProfileService as ReturnType<typeof vi.fn>).mockReturnValue(null);
    const { result } = renderHook(() => useProfile());
    const newProfile = { name: 'New User', mobile: '01712345678' };
    act(() => {
      result.current.save(newProfile);
    });
    expect(saveProfileService).toHaveBeenCalledWith(newProfile);
    // State should update after save
    await vi.waitFor(() => {
      expect(result.current.profile.name).toBe('New User');
    });
  });

  it('requireProfileOrPrompt returns true for complete profile', async () => {
    (getProfileService as ReturnType<typeof vi.fn>).mockReturnValue({
      name: 'Test',
      mobile: '01700000000',
      designation: 'SAAO',
    });
    const { result } = renderHook(() => useProfile());
    // After hydration, profile should be complete
    await vi.waitFor(() => {
      expect(result.current.requireProfileOrPrompt()).toBe(true);
    });
  });

  it('requireProfileOrPrompt returns false for incomplete profile', async () => {
    (getProfileService as ReturnType<typeof vi.fn>).mockReturnValue({
      name: 'Test',
    });
    const { result } = renderHook(() => useProfile());
    await vi.waitFor(() => {
      expect(result.current.requireProfileOrPrompt()).toBe(false);
    });
  });
});

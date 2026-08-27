import { describe, it, expect } from 'vitest';
import { can, normalizePermissions, getPermissionsForRole } from '../src/auth';
import { Role } from '@pmis/types';

describe('auth rbac', () => {
  it('admin has all permissions', () => {
    expect(can({ role: 'admin', permissions: [] }, 'farmers', 'create')).toBe(true);
    expect(can({ role: 'admin', permissions: [] }, 'plantations', 'delete')).toBe(true);
  });

  it('officer can read and update but not delete farmers', () => {
    expect(can({ role: 'officer', permissions: [] }, 'farmers', 'read')).toBe(true);
    expect(can({ role: 'officer', permissions: [] }, 'farmers', 'update')).toBe(true);
    expect(can({ role: 'officer', permissions: [] }, 'farmers', 'delete')).toBe(false);
  });

  it('field_officer can create and read farmers', () => {
    expect(can({ role: 'field_officer', permissions: [] }, 'farmers', 'create')).toBe(true);
    expect(can({ role: 'field_officer', permissions: [] }, 'farmers', 'read')).toBe(true);
    expect(can({ role: 'field_officer', permissions: [] }, 'farmers', 'delete')).toBe(false);
  });

  it('monitor can only read', () => {
    expect(can({ role: 'monitor', permissions: [] }, 'farmers', 'read')).toBe(true);
    expect(can({ role: 'monitor', permissions: [] }, 'farmers', 'create')).toBe(false);
  });

  it('normalizePermissions returns correct permissions', () => {
    const perms = normalizePermissions('officer');
    expect(perms).toContain('farmers:create');
    expect(perms).toContain('farmers:read');
    expect(perms).toContain('farmers:update');
  });
});

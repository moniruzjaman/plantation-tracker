import { describe, it, expect } from 'vitest';
import { ROLE_PERMISSIONS, type Role } from './auth';

describe('auth types', () => {
  it('has role permissions defined', () => {
    expect(ROLE_PERMISSIONS).toBeDefined();
    expect(ROLE_PERMISSIONS.admin).toBeDefined();
    expect(ROLE_PERMISSIONS.officer).toBeDefined();
    expect(ROLE_PERMISSIONS.field_officer).toBeDefined();
    expect(ROLE_PERMISSIONS.monitor).toBeDefined();
  });

  it('admin has all permissions', () => {
    const adminPerms = ROLE_PERMISSIONS.admin;
    expect(adminPerms.length).toBeGreaterThan(0);
    expect(adminPerms[0].actions).toContain('manage');
  });

  it('field_officer has limited permissions', () => {
    const perms = ROLE_PERMISSIONS.field_officer;
    const resources = perms.map(p => p.resource);
    expect(resources).toContain('farmers');
    expect(resources).toContain('plantations');
    expect(resources).toContain('monitoring');
  });
});

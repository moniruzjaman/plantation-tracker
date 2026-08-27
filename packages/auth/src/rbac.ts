import { Permission, ROLE_PERMISSIONS, Role } from '@pmis/types';

export function getPermissionsForRole(role: Role): Permission[] {
  return ROLE_PERMISSIONS[role] || [];
}

export function hasPermission(userPermissions: string[], resource: string, action: string): boolean {
  if (userPermissions.includes('*:*')) return true;
  if (userPermissions.includes(`${resource}:*`)) return true;
  if (userPermissions.includes(`*:${action}`)) return true;
  if (userPermissions.includes(`${resource}:${action}`)) return true;
  return false;
}

export function can(user: { role: string; permissions: string[] }, resource: string, action: string): boolean {
  const rolePerms = getPermissionsForRole(user.role as Role);
  const allPerms = [...user.permissions, ...rolePerms.map(p => `${p.resource}:${p.actions.join(',')}`)];
  
  const permissionStrings = allPerms.flatMap(p => {
    if (p === '*') return ['*:*'];
    if (p.includes('*')) {
      const [res] = p.split(':');
      return [`${res}:*`, `*:${action}`];
    }
    const [res, acts] = p.split(':');
    return acts.split(',').map(a => `${res}:${a}`);
  });

  return permissionStrings.some(perm => {
    if (perm === '*:*') return true;
    const [res, act] = perm.split(':');
    if (res === '*' || res === resource) {
      if (act === '*' || act === action) return true;
    }
    return false;
  });
}

export function normalizePermissions(role: Role): string[] {
  const perms = getPermissionsForRole(role);
  return perms.flatMap(p => p.actions.map(a => `${p.resource}:${a}`));
}

import { verifyAccessToken, JWTPayload } from './jwt';
import { can, normalizePermissions } from './rbac';

export interface AuthContext {
  user: JWTPayload;
  token: string;
}

export async function authenticate(token: string, secret: string): Promise<AuthContext> {
  const payload = await verifyAccessToken(token, secret);
  return { user: payload, token };
}

export function createAuthMiddleware(secret: string) {
  return async (c: any, next: any) => {
    const authHeader = c.req.header('Authorization');
    if (!authHeader?.startsWith('Bearer ')) {
      return c.json({ error: 'Unauthorized' }, 401);
    }
    
    const token = authHeader.slice(7);
    try {
      const { user } = await authenticate(token, secret);
      c.set('user', user);
      await next();
    } catch {
      return c.json({ error: 'Invalid token' }, 401);
    }
  };
}

export function requirePermission(resource: string, action: string) {
  return (c: any, next: any) => {
    const user = c.get('user') as JWTPayload;
    if (!can({ role: user.role, permissions: user.permissions }, resource, action)) {
      return c.json({ error: 'Forbidden' }, 403);
    }
    await next();
  };
}

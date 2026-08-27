export type Role = 'admin' | 'officer' | 'field_officer' | 'monitor';

export interface User {
  id: string;
  name: string;
  email: string;
  role: Role;
  division: string;
  district: string;
  upazila: string;
  permissions: string[];
  createdAt: string;
  updatedAt: string;
}

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  user: User;
  tokens: AuthTokens;
}

export interface RefreshTokenRequest {
  refreshToken: string;
}

export interface Permission {
  resource: string;
  actions: ('create' | 'read' | 'update' | 'delete' | 'manage')[];
}

export const ROLE_PERMISSIONS: Record<Role, Permission[]> = {
  admin: [
    { resource: '*', actions: ['create', 'read', 'update', 'delete', 'manage'] }
  ],
  officer: [
    { resource: 'farmers', actions: ['create', 'read', 'update'] },
    { resource: 'plantations', actions: ['create', 'read', 'update'] },
    { resource: 'monitoring', actions: ['create', 'read', 'update'] },
    { resource: 'tasks', actions: ['read', 'update'] },
    { resource: 'reports', actions: ['read'] }
  ],
  field_officer: [
    { resource: 'farmers', actions: ['create', 'read', 'update'] },
    { resource: 'plantations', actions: ['create', 'read', 'update'] },
    { resource: 'monitoring', actions: ['create', 'read'] }
  ],
  monitor: [
    { resource: 'farmers', actions: ['read'] },
    { resource: 'plantations', actions: ['read'] },
    { resource: 'monitoring', actions: ['read'] },
    { resource: 'reports', actions: ['read'] }
  ]
};

// ─── Enums ───────────────────────────────────────────────────────────────────

export type UserRole = "super_admin" | "admin" | "manager" | "user" | "guest";

// ─── Entities ────────────────────────────────────────────────────────────────

export interface AuthUser {
  id: string;
  email: string;
  name: string;
  avatarUrl?: string;
  roles: UserRole[];
  permissions: string[]; // fine-grained, e.g. "users:write"
  organizationId: string;
  lastLoginAt: string; // ISO 8601
}

// ─── Slice state ─────────────────────────────────────────────────────────────

export interface AuthState {
  user: AuthUser | null;
  token: string | null;
  refreshToken: string | null;
  tokenExpiresAt: number | null; // Unix ms — lets components show a countdown
  error: string | null;
}

// ─── Thunk payloads ──────────────────────────────────────────────────────────

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface LoginResponse {
  user: AuthUser;
  token: string;
  refreshToken: string;
  expiresIn: number; // seconds
}

export interface RefreshTokenResponse {
  token: string;
  expiresIn: number;
}

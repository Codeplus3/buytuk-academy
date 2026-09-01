// =============================================================================
// BuyTuk Academy - Auth Contracts
// =============================================================================

import { UserRole } from "./enums.js";

export interface LoginRequest {
  username: string;
  password: string;
}

export interface RegisterRequest {
  username: string;
  password: string;
  email?: string;
  role: UserRole;
  displayName?: string;
  grade?: string;
  nativeLanguage?: string;
}

export interface AuthResponse {
  ok: boolean;
  token?: string;
  refreshToken?: string;
  user?: {
    id: number;
    username: string;
    role: UserRole;
    email?: string;
  };
  error?: string;
}

export interface RefreshTokenRequest {
  refreshToken: string;
}

export interface JwtPayload {
  id: number;
  role: UserRole;
  iat: number;
  exp: number;
  iss: string;
  aud: string;
}
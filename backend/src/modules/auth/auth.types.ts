import { UserRole } from '../users/user.enums.js';
import { UserResponse } from '../users/user.types.js';

export interface JwtPayload {
  userId: string;
  email: string;
  role: UserRole;
}

export interface AuthResponse {
  user: UserResponse;

  accessToken: string;

  refreshToken: string;
}

export type RegisterResponse = AuthResponse;

export type LoginResponse = AuthResponse;
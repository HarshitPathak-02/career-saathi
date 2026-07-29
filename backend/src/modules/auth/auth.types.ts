import {
  UserRole,
} from "../users/user.enums.js";

import type {
  UserResponse,
} from "../users/user.types.js";

export interface RegisterInput {
  fullName: string;
  email: string;
  password: string;
}

export interface LoginInput {
  email: string;
  password: string;
}

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

export interface RefreshResponse {
  accessToken: string;
  refreshToken: string;
}

export type RegisterResponse =
  AuthResponse;

export type LoginResponse =
  AuthResponse;
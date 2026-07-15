export interface User {
  id: string;
  fullName: string;
  email: string;
  role: "USER" | "ADMIN";
  emailVerified: boolean;
}

export interface AuthResponse {
  user: User;

  accessToken: string;
}

export interface RefreshResponse {
  accessToken: string;
}


export interface RegisterRequest {
  fullName: string;
  email: string;
  password: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}
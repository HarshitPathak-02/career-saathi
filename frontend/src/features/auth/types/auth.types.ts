export interface User {
  id: string;
  fullName: string;
  email: string;
  role: "USER" | "ADMIN";
  emailVerified: boolean;
  phoneNumber?: string
}

export interface AuthResponse {
  user: User;
  accessToken: string;
}

export interface RefreshResponse {
  accessToken: string;
}

interface Credentials {
  email: string;
  password: string;
}

export interface LoginRequest
  extends Credentials { }

export interface RegisterRequest
  extends Credentials {

  fullName: string;
}

export type UpdateProfileDto =
  Pick<
    User,
    "fullName" |
    "email" |
    "phoneNumber"
  >;
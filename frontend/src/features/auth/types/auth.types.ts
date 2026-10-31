export interface User {
  id: string;
  fullName: string;
  email: string;
  role: "USER" | "ADMIN";
  emailVerified: boolean;
  phoneNumber?: string;
  headline?: string;
  bio?: string;
  githubUrl?: string;
  linkedinUrl?: string;
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

export type LoginRequest = Credentials;

export interface RegisterRequest
  extends Credentials {

  fullName: string;
}

export type UpdateProfileDto = Partial<
  Pick<
    User,
    "fullName" |
    "email" |
    "phoneNumber" |
    "headline" |
    "bio" |
    "githubUrl" |
    "linkedinUrl"
  >
>;
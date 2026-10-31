import { Types } from 'mongoose';

import {
  AccountStatus,
  UserRole,
} from './user.enums.js';

export interface IUser {
  fullName: string;

  email: string;

  password: string;

  role: UserRole;

  emailVerified: boolean;

  accountStatus: AccountStatus;

  activeCareerJourneyId?: Types.ObjectId | null;

  phoneNumber?: string | null;

  headline?: string | null;

  bio?: string | null;

  githubUrl?: string | null;

  linkedinUrl?: string | null;

  /*
   * SHA-256 hashes of active refresh tokens.
   * Used to revoke sessions on logout and to
   * detect refresh-token reuse.
   */
  refreshTokenHashes?: string[];

  lastLogin?: Date | null;

  deletedAt?: Date | null;

  createdAt: Date;

  updatedAt: Date;
}

export interface CreateUserInput {
  fullName: string;

  email: string;

  password: string;
}

export interface UpdateUserInput {
  fullName?: string;

  email?: string;

  password?: string;

  phoneNumber?: string | null;

  headline?: string | null;

  bio?: string | null;

  githubUrl?: string | null;

  linkedinUrl?: string | null;

  lastLogin?: Date;

  activeCareerJourneyId?: Types.ObjectId | null;

  refreshTokenHashes?: string[];

  emailVerified?: boolean;

  accountStatus?: AccountStatus;
}

export interface UserResponse {
  id: string;

  fullName: string;

  email: string;

  role: UserRole;

  emailVerified: boolean;

  phoneNumber?: string | null;

  headline?: string | null;

  bio?: string | null;

  githubUrl?: string | null;

  linkedinUrl?: string | null;
}
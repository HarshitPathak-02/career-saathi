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

  lastLogin?: Date;

  activeCareerJourneyId?: Types.ObjectId | null;

  emailVerified?: boolean;

  accountStatus?: AccountStatus;
}

export interface UserResponse {
  id: string;

  fullName: string;

  email: string;

  role: UserRole;

  emailVerified: boolean;
}
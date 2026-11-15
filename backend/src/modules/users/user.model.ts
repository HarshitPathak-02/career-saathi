import { Schema, model } from 'mongoose';

import { IUser } from './user.types.js';
import { AccountStatus, UserRole } from './user.enums.js';

const userSchema = new Schema<IUser>(
  {
    fullName: {
      type: String,
      required: true,
      trim: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },

    password: {
      type: String,
      required: true,
    },

    role: {
      type: String,
      enum: Object.values(UserRole),
      default: UserRole.USER,
      required: true,
    },

    emailVerified: {
      type: Boolean,
      default: false,
      required: true,
    },

    phoneNumber: {
      type: String,
      default: null,
      trim: true,
    },

    accountStatus: {
      type: String,
      enum: Object.values(AccountStatus),
      default: AccountStatus.ACTIVE,
      required: true,
    },

    activeCareerJourneyId: {
      type: Schema.Types.ObjectId,
      ref: 'CareerJourney',
      default: null,
    },

    refreshTokenHashes: {
      type: [String],
      default: [],
    },

    pushTokens: {
      type: [
        {
          token: { type: String, required: true },
          platform: { type: String, enum: ['android', 'ios'], default: 'android' },
          updatedAt: { type: Date, default: Date.now },
        },
      ],
      default: [],
    },

    lastLogin: {
      type: Date,
    },

    deletedAt: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

// Indexes
userSchema.index({ role: 1 });
userSchema.index({ accountStatus: 1 });

export const UserModel = model<IUser>('User', userSchema);
export type UserDocument = ReturnType<
  typeof UserModel.hydrate
>;
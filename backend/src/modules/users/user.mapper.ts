import { UserDocument } from './index.js';
import { UserResponse } from './index.js';

export const toUserResponse = (
  user: UserDocument
): UserResponse => {
  return {
    id: user.id,

    fullName: user.fullName,

    email: user.email,

    role: user.role,

    emailVerified: user.emailVerified,

    phoneNumber: user.phoneNumber ?? null,

    headline: user.headline ?? null,

    bio: user.bio ?? null,

    githubUrl: user.githubUrl ?? null,

    linkedinUrl: user.linkedinUrl ?? null,
  };
};

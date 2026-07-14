import jwt from 'jsonwebtoken';

import { jwtConfig } from '../../config/jwt.js';
import { JwtPayload } from '../../modules/auth/auth.types.js';
import { UserDocument } from '../../modules/users/user.model.js';
import { AppError } from '../../core/errors/app-error.js';
import { HTTP_STATUS } from '../../core/constants/http-status.constants.js';

export const createJwtPayload = (
  user: UserDocument
): JwtPayload => ({
  userId: user.id,
  email: user.email,
  role: user.role,
});

export const generateAccessToken = (
  payload: JwtPayload
): string => {
  return jwt.sign(payload, jwtConfig.accessTokenSecret, {
    expiresIn: jwtConfig.accessTokenExpiresIn,
  });
};

export const generateRefreshToken = (
  payload: JwtPayload
): string => {
  return jwt.sign(payload, jwtConfig.refreshTokenSecret, {
    expiresIn: jwtConfig.refreshTokenExpiresIn,
  });
};

export const verifyAccessToken = (
  token: string
): JwtPayload => {
  try {
    return jwt.verify(
      token,
      jwtConfig.accessTokenSecret
    ) as JwtPayload;
  } catch {
    throw new AppError(
      HTTP_STATUS.UNAUTHORIZED,
      'Invalid or expired access token.'
    );
  }
};
export const verifyRefreshToken = (
  token: string
): JwtPayload => {
  return jwt.verify(
    token,
    jwtConfig.refreshTokenSecret
  ) as JwtPayload;
};
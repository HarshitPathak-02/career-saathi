import { AUTH_MESSAGES } from './auth.constants.js';
import {
  AuthResponse,
  JwtPayload,
  LoginInput,
  RefreshResponse,
  RegisterInput,
  RegisterResponse,
} from './auth.types.js';

import { userRepository } from '../users/user.repository.js';
import { toUserResponse } from '../users/user.mapper.js';

import { AppError } from '../../core/errors/app-error.js';
import { HTTP_STATUS } from '../../core/constants/http-status.constants.js';

import { comparePassword, hashPassword } from '../../shared/utils/bcrypt.util.js';
import {
  createJwtPayload,
  generateAccessToken,
  generateRefreshToken,
  verifyRefreshToken,
} from '../../shared/utils/jwt.utlil.js';
import { AccountStatus } from '../users/user.enums.js';
import { UserResponse } from '../users/user.types.js';
import {
  hashToken,
  tokenHashesMatch,
} from '../../shared/utils/token-hash.util.js';

class AuthService {
  async register(
    data: RegisterInput
  ): Promise<RegisterResponse> {
    const existingUser = await userRepository.findByEmail(
      data.email
    );

    if (existingUser) {
      throw new AppError(
        HTTP_STATUS.CONFLICT,
        AUTH_MESSAGES.EMAIL_ALREADY_EXISTS
      );
    }

    const hashedPassword = await hashPassword(
      data.password
    );

    const user = await userRepository.create({
      fullName: data.fullName,
      email: data.email,
      password: hashedPassword,
    });

    const payload = createJwtPayload(user);

    const accessToken = generateAccessToken(payload);

    const refreshToken = generateRefreshToken(payload);

    await userRepository.addRefreshTokenHash(
      user.id,
      hashToken(refreshToken)
    );

    return {
      user: toUserResponse(user),
      accessToken,
      refreshToken,
    };
  }


  async login(
    data: LoginInput
  ): Promise<AuthResponse> {
    const user = await userRepository.findByEmail(
      data.email
    );

    if (!user) {
      throw new AppError(
        HTTP_STATUS.UNAUTHORIZED,
        AUTH_MESSAGES.INVALID_CREDENTIALS
      );
    }

    const isPasswordValid =
      await comparePassword(
        data.password,
        user.password
      );

    if (!isPasswordValid) {
      throw new AppError(
        HTTP_STATUS.UNAUTHORIZED,
        AUTH_MESSAGES.INVALID_CREDENTIALS
      );
    }

    if (
      user.accountStatus ===
      AccountStatus.INACTIVE
    ) {
      throw new AppError(
        HTTP_STATUS.FORBIDDEN,
        AUTH_MESSAGES.ACCOUNT_INACTIVE
      );
    }

    if (
      user.accountStatus ===
      AccountStatus.SUSPENDED
    ) {
      throw new AppError(
        HTTP_STATUS.FORBIDDEN,
        AUTH_MESSAGES.ACCOUNT_SUSPENDED
      );
    }

    const updatedUser =
      await userRepository.updateLastLogin(
        user.id
      );

    const payload = createJwtPayload(user);

    const accessToken =
      generateAccessToken(payload);

    const refreshToken =
      generateRefreshToken(payload);

    const authenticatedUser =
      updatedUser ?? user;

    await userRepository.addRefreshTokenHash(
      authenticatedUser.id,
      hashToken(refreshToken)
    );

    return {
      user: toUserResponse(
        authenticatedUser
      ),
      accessToken,
      refreshToken,
    };
  }

  async refresh(
    refreshToken: string
  ): Promise<RefreshResponse> {
    let payload: JwtPayload;

    try {
      payload =
        verifyRefreshToken(refreshToken);
    } catch {
      throw new AppError(
        HTTP_STATUS.UNAUTHORIZED,
        AUTH_MESSAGES.REFRESH_TOKEN_REVOKED
      );
    }

    const user =
      await userRepository.findById(
        payload.userId
      );

    if (!user) {
      throw new AppError(
        HTTP_STATUS.UNAUTHORIZED,
        AUTH_MESSAGES.INVALID_CREDENTIALS
      );
    }

    /*
     * Reject tokens that were already rotated or
     * revoked (logout, logout-all, token reuse).
     */
    const currentTokenHash =
      hashToken(refreshToken);

    const isKnownRefreshToken =
      (user.refreshTokenHashes ?? []).some(
        (storedHash) =>
          tokenHashesMatch(
            storedHash,
            currentTokenHash
          )
      );

    if (!isKnownRefreshToken) {
      throw new AppError(
        HTTP_STATUS.UNAUTHORIZED,
        AUTH_MESSAGES.REFRESH_TOKEN_REVOKED
      );
    }

    if (
      user.accountStatus ===
      AccountStatus.INACTIVE
    ) {
      throw new AppError(
        HTTP_STATUS.FORBIDDEN,
        AUTH_MESSAGES.ACCOUNT_INACTIVE
      );
    }

    if (
      user.accountStatus ===
      AccountStatus.SUSPENDED
    ) {
      throw new AppError(
        HTTP_STATUS.FORBIDDEN,
        AUTH_MESSAGES.ACCOUNT_SUSPENDED
      );
    }

    const jwtPayload =
      createJwtPayload(user);

    const accessToken =
      generateAccessToken(jwtPayload);

    const newRefreshToken =
      generateRefreshToken(jwtPayload);

    /*
     * Atomic rotation: only succeeds if the presented
     * token hash is still the stored one. Concurrent
     * refreshes therefore cannot both succeed.
     */
    const rotatedUser =
      await userRepository
        .replaceRefreshTokenHash(
          user.id,
          currentTokenHash,
          hashToken(newRefreshToken)
        );

    if (!rotatedUser) {
      throw new AppError(
        HTTP_STATUS.UNAUTHORIZED,
        AUTH_MESSAGES.REFRESH_TOKEN_REVOKED
      );
    }

    return {
      accessToken,
      refreshToken: newRefreshToken,
    };
  }

  async logout(
    refreshToken?: string
  ): Promise<void> {
    if (!refreshToken) {
      return;
    }

    /*
     * Resolve the user from the refresh token itself so
     * logout still works after the access token expires.
     */
    let userId: string;

    try {
      userId =
        verifyRefreshToken(
          refreshToken
        ).userId;
    } catch {
      return;
    }

    await userRepository.removeRefreshTokenHash(
      userId,
      hashToken(refreshToken)
    );
  }

  async logoutAll(
    userId: string
  ): Promise<void> {
    await userRepository.clearRefreshTokenHashes(
      userId
    );
  }

  async me(
    userId: string
  ): Promise<UserResponse> {

    const user = await userRepository.findById(userId);

    if (!user) {
      throw new AppError(
        HTTP_STATUS.NOT_FOUND,
        AUTH_MESSAGES.USER_NOT_FOUND
      );
    }

    return toUserResponse(user);
  }
}

export const authService = new AuthService();
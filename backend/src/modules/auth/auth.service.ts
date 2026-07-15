import { AUTH_MESSAGES } from './auth.constants.js';
import {
  AuthResponse,
  JwtPayload,
  RegisterResponse,
} from './auth.types.js';
import { LoginInput, RegisterInput } from './auth.validation.js';

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

    return {
      user: toUserResponse(
        updatedUser ?? user
      ),
      accessToken,
      refreshToken,
    };
  }

  async refresh(
    refreshToken: string
  ): Promise<AuthResponse> {
    const payload =
      verifyRefreshToken(refreshToken);

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

    if (
      user.accountStatus !==
      AccountStatus.ACTIVE
    ) {
      throw new AppError(
        HTTP_STATUS.FORBIDDEN,
        AUTH_MESSAGES.ACCOUNT_INACTIVE
      );
    }

    const jwtPayload: JwtPayload = {
      userId: user.id,
      email: user.email,
      role: user.role,
    };

    const accessToken =
      generateAccessToken(jwtPayload);

    const newRefreshToken =
      generateRefreshToken(jwtPayload);

    return {
      user: toUserResponse(user),
      accessToken,
      refreshToken: newRefreshToken,
    };
  }

  async me(
    userId: string
  ): Promise<UserResponse | null> {

    return userRepository.findById(userId);
  }
}

export const authService = new AuthService();
import { Request, Response } from "express";
import { asyncHandler } from "../../../core/middleware/async-handler.js";
import { successResponse } from "../../../core/responses/successResponse.js";
import { AppError } from "../../../core/errors/app-error.js";
import { HTTP_STATUS } from "../../../core/constants/http-status.constants.js";
import { UserModel, UserRole } from "../../users/index.js";
import { comparePassword } from "../../../shared/utils/bcrypt.util.js";
import {
  createJwtPayload,
  generateAccessToken,
  generateRefreshToken,
} from "../../../shared/utils/jwt.utlil.js";
import { setRefreshTokenCookie } from "../../../shared/utils/cookie.util.js";
import { ADMIN_MESSAGES } from "../admin.constants.js";

class AdminAuthController {
  login = asyncHandler(async (req: Request, res: Response) => {
    const { email, password } = req.body;

    if (!email || !password) {
      throw new AppError(
        HTTP_STATUS.BAD_REQUEST,
        "Email and password are required."
      );
    }

    const user = await UserModel.findOne({
      email: email.toLowerCase().trim(),
    });

    if (!user) {
      throw new AppError(
        HTTP_STATUS.UNAUTHORIZED,
        ADMIN_MESSAGES.INVALID_CREDENTIALS
      );
    }

    const isMatch = await comparePassword(password, user.password);
    if (!isMatch) {
      throw new AppError(
        HTTP_STATUS.UNAUTHORIZED,
        ADMIN_MESSAGES.INVALID_CREDENTIALS
      );
    }

    if (user.role !== UserRole.ADMIN) {
      throw new AppError(
        HTTP_STATUS.FORBIDDEN,
        ADMIN_MESSAGES.ACCESS_DENIED
      );
    }

    const jwtPayload = createJwtPayload(user);
    const accessToken = generateAccessToken(jwtPayload);
    const refreshToken = generateRefreshToken(jwtPayload);

    setRefreshTokenCookie(res, refreshToken);

    user.lastLogin = new Date();
    await user.save();

    return successResponse({
      res,
      statusCode: HTTP_STATUS.OK,
      message: ADMIN_MESSAGES.LOGIN_SUCCESS,
      data: {
        user: {
          id: user._id.toString(),
          fullName: user.fullName,
          email: user.email,
          role: user.role,
          emailVerified: user.emailVerified,
          accountStatus: user.accountStatus,
          createdAt: user.createdAt,
          updatedAt: user.updatedAt,
        },
        accessToken,
      },
    });
  });

  getMe = asyncHandler(async (req: Request, res: Response) => {
    if (!req.user?.userId) {
      throw new AppError(
        HTTP_STATUS.UNAUTHORIZED,
        "Authentication required."
      );
    }

    const user = await UserModel.findById(req.user.userId);
    if (!user) {
      throw new AppError(HTTP_STATUS.NOT_FOUND, "Admin user not found.");
    }

    return successResponse({
      res,
      statusCode: HTTP_STATUS.OK,
      message: ADMIN_MESSAGES.PROFILE_RETRIEVED,
      data: {
        id: user._id.toString(),
        fullName: user.fullName,
        email: user.email,
        role: user.role,
        emailVerified: user.emailVerified,
        accountStatus: user.accountStatus,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
      },
    });
  });
}

export const adminAuthController = new AdminAuthController();

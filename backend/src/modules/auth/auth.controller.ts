import { Request, Response } from 'express';

import { authService } from './auth.service.js';
import { AUTH_MESSAGES } from './auth.constants.js';

import { asyncHandler } from '../../core/middleware/async-handler.js';
import { successResponse } from '../../core/responses/successResponse.js';

import { clearRefreshTokenCookie, setRefreshTokenCookie } from '../../shared/utils/cookie.util.js';

import { HTTP_STATUS } from '../../core/constants/http-status.constants.js';
import { AppError } from '../../core/errors/app-error.js';

class AuthController {
    register = asyncHandler(
        async (req: Request, res: Response) => {
            const result = await authService.register(
                req.body
            );

            setRefreshTokenCookie(
                res,
                result.refreshToken
            );

            return successResponse({
                res,
                statusCode: HTTP_STATUS.CREATED,
                message: AUTH_MESSAGES.REGISTER_SUCCESS,
                data: {
                    user: result.user,
                    accessToken: result.accessToken,
                },
            });
        }
    );


    login = asyncHandler(
        async (req: Request, res: Response) => {
            const result =
                await authService.login(req.body);

            setRefreshTokenCookie(
                res,
                result.refreshToken
            );

            return successResponse({
                res,
                statusCode: HTTP_STATUS.OK,
                message: AUTH_MESSAGES.LOGIN_SUCCESS,
                data: {
                    user: result.user,
                    accessToken:
                        result.accessToken,
                },
            });
        }
    );

    me = asyncHandler(
        async (req, res) => {

            const user =
                await authService.me(
                    req.user.userId
                );

            return successResponse({
                res,
                message: "Authenticated.",
                data: user,
            });
        }
    );
    
    refresh = asyncHandler(
        async (req, res) => {
            const refreshToken =
                req.cookies.refreshToken;

            if (!refreshToken) {
                throw new AppError(
                    HTTP_STATUS.UNAUTHORIZED,
                    'Refresh token is required.'
                );
            }

            const result =
                await authService.refresh(
                    refreshToken
                );

            setRefreshTokenCookie(
                res,
                result.refreshToken
            );

            return successResponse({
                res,
                message:
                    'Token refreshed successfully.',
                data: {
                    accessToken:
                        result.accessToken,
                },
            });
        }
    );

    logout = asyncHandler(
        async (_req, res) => {
            clearRefreshTokenCookie(res);

            return successResponse({
                res,
                message: AUTH_MESSAGES.LOGOUT_SUCCESS,
            });
        }
    );
}

export const authController =
    new AuthController();
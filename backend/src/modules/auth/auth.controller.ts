import { Request, Response } from 'express';

import { asyncHandler } from '../../core/middleware/async-handler.js';
import { successResponse } from '../../core/responses/successResponse.js';

import { clearRefreshTokenCookie, setRefreshTokenCookie } from '../../shared/utils/cookie.util.js';

import { HTTP_STATUS } from '../../core/constants/http-status.constants.js';
import { AppError } from '../../core/errors/app-error.js';
import { getAuthUser } from '../../shared/utils/get-auth-user.js';
import { REFRESH_TOKEN_COOKIE_NAME } from '../../core/constants/cookie.constants.js';
import { AUTH_MESSAGES, authService } from './index.js';

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

            const authUser =
                getAuthUser(req);

            const user =
                await authService.me(
                    authUser.userId
                );

            return successResponse({
                res,
                message: AUTH_MESSAGES.PROFILE_FETCH_SUCCESS,
                data: user,
            });
        }
    );

    refresh = asyncHandler(
        async (req, res) => {
            const refreshToken =
                req.cookies[
                REFRESH_TOKEN_COOKIE_NAME
                ];

            if (!refreshToken) {
                throw new AppError(
                    HTTP_STATUS.UNAUTHORIZED,
                    AUTH_MESSAGES.REFRESH_TOKEN_REQUIRED
                );
            }

            const result =
                await authService
                    .refresh(refreshToken)
                    .catch((error) => {
                        /*
                         * A revoked or expired refresh
                         * token must not stay in the
                         * browser.
                         */
                        clearRefreshTokenCookie(res);

                        throw error;
                    });

            setRefreshTokenCookie(
                res,
                result.refreshToken
            );

            return successResponse({
                res,
                message:
                    AUTH_MESSAGES.REFRESH_SUCCESS,
                data: {
                    accessToken:
                        result.accessToken,
                },
            });
        }
    );

    logout = asyncHandler(
        async (req: Request, res: Response) => {
            const refreshToken =
                req.cookies[
                REFRESH_TOKEN_COOKIE_NAME
                ] as string | undefined;

            await authService.logout(
                refreshToken
            );

            clearRefreshTokenCookie(res);

            return successResponse({
                res,
                message: AUTH_MESSAGES.LOGOUT_SUCCESS,
            });
        }
    );

    logoutAll = asyncHandler(
        async (req: Request, res: Response) => {
            const authUser =
                getAuthUser(req);

            await authService.logoutAll(
                authUser.userId
            );

            clearRefreshTokenCookie(res);

            return successResponse({
                res,
                message:
                    AUTH_MESSAGES.ALL_SESSIONS_REVOKED,
            });
        }
    );

    updateProfile = asyncHandler(
        async (req: Request, res: Response) => {
            const authUser = getAuthUser(req);
            const user = await authService.updateProfile(authUser.userId, req.body);

            return successResponse({
                res,
                statusCode: HTTP_STATUS.OK,
                message: "Profile updated successfully.",
                data: user,
            });
        }
    );

    changePassword = asyncHandler(
        async (req: Request, res: Response) => {
            const authUser = getAuthUser(req);
            await authService.changePassword(
                authUser.userId,
                req.body.currentPassword,
                req.body.newPassword
            );

            clearRefreshTokenCookie(res);

            return successResponse({
                res,
                statusCode: HTTP_STATUS.OK,
                message: "Password changed successfully. Please log in again.",
            });
        }
    );
}

export const authController =
    new AuthController();
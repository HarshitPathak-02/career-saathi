import { Response } from 'express';

import { COOKIE_OPTIONS, REFRESH_TOKEN_COOKIE_NAME } from '../../core/constants/cookie.constants.js';

export const setRefreshTokenCookie = (
  res: Response,
  refreshToken: string
) => {
  res.cookie(
    REFRESH_TOKEN_COOKIE_NAME,
    refreshToken,
    COOKIE_OPTIONS
  );
};

export const clearRefreshTokenCookie = (
  res: Response
) => {
  res.clearCookie(
    REFRESH_TOKEN_COOKIE_NAME,
    COOKIE_OPTIONS
  );
};
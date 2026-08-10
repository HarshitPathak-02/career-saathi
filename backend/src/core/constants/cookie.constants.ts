import { CookieOptions } from 'express';
import { env } from '../../config/env.js';

export const COOKIE_OPTIONS: CookieOptions = {
  httpOnly: true,

  secure: env.NODE_ENV === 'production',

  sameSite: env.NODE_ENV === 'production' ? 'none' : 'lax',

  path: '/',
};

export const REFRESH_TOKEN_COOKIE_NAME = 'refreshToken';
import type { StringValue } from 'ms';

import { env } from './env.js';

export const jwtConfig = {
  accessTokenSecret: env.JWT_ACCESS_SECRET,

  refreshTokenSecret: env.JWT_REFRESH_SECRET,

  accessTokenExpiresIn:
    env.JWT_ACCESS_EXPIRES_IN as StringValue,

  refreshTokenExpiresIn:
    env.JWT_REFRESH_EXPIRES_IN as StringValue,
} as const;
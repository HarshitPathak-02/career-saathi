import { Request } from 'express';

import { AppError } from '../../core/errors/app-error.js';
import { HTTP_STATUS } from '../../core/constants/http-status.constants.js';

export const getAuthUser = (req: Request) => {
  if (!req.user) {
    throw new AppError(
      HTTP_STATUS.UNAUTHORIZED,
      'Authentication required.'
    );
  }

  return req.user;
};
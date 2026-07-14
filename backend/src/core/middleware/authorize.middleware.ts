import { Request, Response, NextFunction } from 'express';

import { AppError } from '../errors/app-error.js';

import { UserRole } from '../../modules/users/index.js';

import { HTTP_STATUS } from '../../core/constants/http-status.constants.js';

export const authorize =
  (...roles: UserRole[]) =>
  (
    req: Request,
    _res: Response,
    next: NextFunction
  ) => {
    if (!req.user) {
      throw new AppError(
        HTTP_STATUS.UNAUTHORIZED,
        'Authentication required.'
      );
    }

    if (!roles.includes(req.user.role)) {
      throw new AppError(
        HTTP_STATUS.FORBIDDEN,
        'You are not authorized to access this resource.'
      );
    }

    next();
  };
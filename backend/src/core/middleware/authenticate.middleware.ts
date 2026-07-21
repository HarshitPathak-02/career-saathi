import { Request, Response, NextFunction } from 'express';

import { AppError } from '../errors/app-error.js';

import { verifyAccessToken } from '../../shared/utils/jwt.utlil.js';

import { HTTP_STATUS } from '../../core/constants/http-status.constants.js';

export const authenticate = (
  req: Request,
  _res: Response,
  next: NextFunction
) => {
  const authorization = req.headers.authorization;

  if (!authorization) {
    throw new AppError(
      HTTP_STATUS.UNAUTHORIZED,
      'Authentication required.'
    );
  }

  const [scheme, token] =
    authorization.split(' ');

  if (
    scheme !== 'Bearer' ||
    !token
  ) {
    throw new AppError(
      HTTP_STATUS.UNAUTHORIZED,
      'Invalid authorization header.'
    );
  }

  const payload =
    verifyAccessToken(token);

  console.log("Payload", payload);

  req.user = payload;

  next();
};
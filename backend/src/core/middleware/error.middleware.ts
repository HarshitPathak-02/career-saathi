import { NextFunction, Request, Response } from 'express';

import { AppError } from '../errors/app-error.js';
import { HTTP_STATUS } from '../constants/http-status.constants.js';
import logger from '../../config/logger.js';

export const errorMiddleware = (
  error: Error,
  req: Request,
  res: Response,
  _next: NextFunction
) => {
  if (error instanceof AppError) {
    return res.status(error.statusCode).json({
      success: false,
      message: error.message,
    });
  }

  logger.error(
    {
      error,
      method: req.method,
      path: req.originalUrl,
    },
    'Unhandled request error.'
  );

  return res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
    success: false,
    message: 'Internal Server Error',
  });
};
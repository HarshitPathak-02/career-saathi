import { NextFunction, Request, Response } from 'express';
import multer from 'multer';

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

  if (error instanceof multer.MulterError) {
    const isFileTooLarge =
      error.code === 'LIMIT_FILE_SIZE';

    return res
      .status(
        isFileTooLarge
          ? HTTP_STATUS.PAYLOAD_TOO_LARGE
          : HTTP_STATUS.BAD_REQUEST
      )
      .json({
        success: false,
        message: isFileTooLarge
          ? 'Uploaded file is too large.'
          : 'File upload failed.',
      });
  }

  logger.error(
    {
      err: error,
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
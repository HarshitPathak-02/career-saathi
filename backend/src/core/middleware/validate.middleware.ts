import { NextFunction, Request, Response } from 'express';
import { ZodError, ZodSchema } from 'zod';
import { HTTP_STATUS } from '../constants/http-status.constants.js';

type ValidationTarget = 'body' | 'params' | 'query';

export const validate =
  (
    schema: ZodSchema,
    target: ValidationTarget = 'body'
  ) =>
  (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      req[target] = schema.parse(req[target]);

      next();
    } catch (error) {
      if (error instanceof ZodError) {
        return res.status(HTTP_STATUS.BAD_REQUEST).json({
          success: false,
          message: 'Validation failed',
          errors: error.issues,
        });
      }

      next(error);
    }
  };
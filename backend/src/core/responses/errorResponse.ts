import { Response } from 'express';

interface ErrorResponseOptions {
  res: Response;
  statusCode?: number;
  message: string;
  errors?: unknown;
}

export const errorResponse = ({
  res,
  statusCode = 500,
  message,
  errors,
}: ErrorResponseOptions) => {
  return res.status(statusCode).json({
    success: false,
    message,
    errors,
  });
};
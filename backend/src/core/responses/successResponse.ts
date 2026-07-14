import { Response } from 'express';

interface SuccessResponseOptions<T> {
  res: Response;
  statusCode?: number;
  message: string;
  data?: T;
}

export const successResponse = <T>({
  res,
  statusCode = 200,
  message,
  data,
}: SuccessResponseOptions<T>) => {
  return res.status(statusCode).json({
    success: true,
    message,
    data,
  });
};
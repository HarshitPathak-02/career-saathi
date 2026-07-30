import {
  NextFunction,
  Request,
  Response,
} from "express";

import {
  AppError,
} from "../errors/app-error.js";

import {
  HTTP_STATUS,
} from "../constants/http-status.constants.js";

export const errorMiddleware = (
  error: Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {

  /*
  |--------------------------------------------------------------------------
  | Operational Errors
  |--------------------------------------------------------------------------
  */

  if (
    error instanceof AppError
  ) {

    req.log.warn(
      {
        err: error,

        statusCode:
          error.statusCode,
      },
      "Operational request error."
    );

    return res
      .status(
        error.statusCode
      )
      .json({
        success: false,

        message:
          error.message,
      });
  }

  /*
  |--------------------------------------------------------------------------
  | Unexpected Errors
  |--------------------------------------------------------------------------
  */

  req.log.error(
    {
      err: error,
    },
    "Unexpected request error."
  );

  return res
    .status(
      HTTP_STATUS
        .INTERNAL_SERVER_ERROR
    )
    .json({
      success: false,

      message:
        "Internal Server Error",
    });
};
import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import compression from 'compression';
import cookieParser from 'cookie-parser';

import router from './routes/index.js';
import { errorMiddleware } from './core/middleware/error.middleware.js';
import { httpLogger } from './core/middleware/http-logger.js';
import { AppError } from './core/errors/app-error.js';
import { HTTP_STATUS } from './core/constants/http-status.constants.js';
import { env } from './config/env.js';

const app = express();

const configuredOrigins = [
  env.CLIENT_URL,
  ...(env.CORS_ORIGINS ?? '').split(','),
]
  .map((origin) => origin.trim())
  .filter(Boolean);

const allowedOrigins = new Set(configuredOrigins);

/*
 * Vite picks the next free port when 5173 is busy, so in
 * development allow any localhost origin regardless of port.
 */
const isLocalDevelopmentOrigin = (
  origin: string
): boolean =>
  env.NODE_ENV !== 'production' &&
  /^https?:\/\/(localhost|127\.0\.0\.1)(:\d+)?$/.test(
    origin
  );

app.use(httpLogger);

app.use(helmet());

app.use(
  cors({
    origin: (origin, callback) => {
      /*
       * Requests without an Origin header
       * (curl, server-to-server, health probes)
       * are always allowed.
       */
      if (
        !origin ||
        allowedOrigins.has(origin) ||
        isLocalDevelopmentOrigin(origin)
      ) {
        callback(null, true);

        return;
      }

      callback(
        new AppError(
          HTTP_STATUS.FORBIDDEN,
          'Origin is not allowed by CORS.'
        )
      );
    },
    credentials: true,
  })
);

app.use(compression());

app.use(express.json());

app.use(express.urlencoded({ extended: true }));

app.use(cookieParser());


app.use('/api/v1', router);


app.use(errorMiddleware);

export default app;
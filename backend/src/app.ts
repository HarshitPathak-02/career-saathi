import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import compression from 'compression';
import cookieParser from 'cookie-parser';

import router from './routes/index.js';
import { errorMiddleware } from './core/middleware/error.middleware.js';
import { env } from './config/env.js';

const app = express();

app.use(helmet());

app.use(
  cors({
    origin: [env.CLIENT_URL, "http://localhost:5173"],
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
import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import compression from 'compression';
import cookieParser from 'cookie-parser';

import router from './routes/index.js';
import { errorMiddleware } from './core/middleware/error.middleware.js';

const app = express();

// Security
app.use(helmet());

// CORS
app.use(
  cors({
    origin: true,
    credentials: true,
  })
);

// Compression
app.use(compression());

// Body Parser
app.use(express.json());

// URL Encoded
app.use(express.urlencoded({ extended: true }));

// Cookies
app.use(cookieParser());


// Routes
app.use('/api/v1', router);

app.use(errorMiddleware);

export default app;
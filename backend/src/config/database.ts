import mongoose from 'mongoose';
import { env } from './env.js';
import logger from './logger.js';

export const connectDatabase = async (): Promise<void> => {
  try {
    await mongoose.connect(env.MONGODB_URI);

    logger.info('MongoDB connected successfully.');
  } catch (error) {
    logger.error(
      { error },
      'Failed to connect to MongoDB.'
    );

    process.exit(1);
  }
};
import mongoose from 'mongoose';
import { env } from './env.js';

export const connectDatabase = async (): Promise<void> => {
  try {
    await mongoose.connect(env.MONGODB_URI);

    console.log('MongoDB connected successfully.');
  } catch (error) {
    console.error(error, 'Failed to connect to MongoDB.');

    process.exit(1);
  }
};
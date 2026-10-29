import app from './app.js';
import { connectDatabase } from './config/database.js';
import { env } from './config/env.js';
import logger from './config/logger.js';

const startServer = async (): Promise<void> => {
  try {
    await connectDatabase();

    app.listen(env.PORT, () => {
      logger.info(
        `Server running on port ${env.PORT}`
      );
    });
  } catch (error) {
    logger.error(
      { error },
      'Unable to start server.'
    );
  }
};

startServer();
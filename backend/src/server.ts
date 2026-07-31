import app from './app.js';
import { connectDatabase } from './config/database.js';
import { env } from './config/env.js';
import { appClock } from './shared/time/app-clock.js';

const startServer = async (): Promise<void> => {
  try {
    await connectDatabase();

    console.log("====================================");
    console.log("REAL DATE:", new Date());
    console.log("APP DATE:", appClock.now());
    console.log("TEST CLOCK ACTIVE:", appClock.isUsingTestDate());
    console.log("====================================");

    app.listen(env.PORT, () => {
      console.log(`Server running on port ${env.PORT}`);
    });
  } catch (error) {
    console.error(error, 'Unable to start server.');
  }
};

startServer();
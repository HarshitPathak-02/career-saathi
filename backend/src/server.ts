import app from "./app.js";

import {
  connectDatabase,
} from "./config/database.js";

import {
  env,
} from "./config/env.js";

import logger from "./config/logger.js";

const startServer =
  async (): Promise<void> => {

    try {

      await connectDatabase();

      app.listen(
        env.PORT,
        () => {

          logger.info(
            {
              port:
                env.PORT,

              environment:
                env.NODE_ENV,
            },
            "Server started successfully."
          );

        }
      );

    } catch (error) {

      logger.fatal(
        {
          err: error,
        },
        "Unable to start server."
      );

      process.exit(1);

    }

  };

startServer();
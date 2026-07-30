import pino from "pino";

import {
  env,
} from "./env.js";

const logger = pino({

  level:
    env.NODE_ENV === "development"
      ? "debug"
      : "info",

  redact: {
    paths: [
      "password",
      "token",
      "accessToken",
      "refreshToken",
      "authorization",

      "req.headers.authorization",
      "req.headers.cookie",

      "headers.authorization",
      "headers.cookie",
    ],

    censor: "[REDACTED]",
  },

  transport:
    env.NODE_ENV === "development"
      ? {
        target:
          "pino-pretty",

        options: {
          colorize: true,

          translateTime:
            "SYS:standard",

          ignore:
            "pid,hostname",
        },
      }
      : undefined,
});

export default logger;
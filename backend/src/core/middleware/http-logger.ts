import crypto from "node:crypto";

import { pinoHttp } from "pino-http";

import logger from "../../config/logger.js";

export const httpLogger =
    pinoHttp({

        logger,

        genReqId: (
            req,
            res
        ) => {

            const existingRequestId =
                req.headers[
                "x-request-id"
                ];

            const requestId =
                typeof existingRequestId ===
                    "string"
                    ? existingRequestId
                    : crypto.randomUUID();

            res.setHeader(
                "x-request-id",
                requestId
            );

            return requestId;
        },

        redact: {
            paths: [
                "req.headers.authorization",
                "req.headers.cookie",
                "res.headers.set-cookie",
            ],

            censor:
                "[REDACTED]",
        },

    });
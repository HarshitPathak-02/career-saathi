import type {
    Request,
    Response,
} from "express";

import { rateLimit } from "express-rate-limit";

import { HTTP_STATUS } from "../constants/http-status.constants.js";

const rateLimitHandler = (
    _req: Request,
    res: Response
) => {
    return res
        .status(HTTP_STATUS.TOO_MANY_REQUESTS)
        .json({
            success: false,
            message:
                "Too many requests. Please try again later.",
        });
};

export const resumeUploadLimiter = rateLimit({
    windowMs: 60 * 60 * 1000,

    limit: 20,

    standardHeaders: "draft-8",

    legacyHeaders: false,

    keyGenerator: (req) =>
        req.user?.userId ?? "unauthenticated",

    handler: rateLimitHandler,
});

export const resumeAnalysisLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,

    limit: 10,

    standardHeaders: "draft-8",

    legacyHeaders: false,

    keyGenerator: (req) =>
        req.user?.userId ?? "unauthenticated",

    handler: rateLimitHandler,
});

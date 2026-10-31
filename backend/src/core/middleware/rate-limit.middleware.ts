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

export const discoveryAiLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,

    limit: 30,

    standardHeaders: "draft-8",

    legacyHeaders: false,

    keyGenerator: (req) =>
        req.user?.userId ?? "unauthenticated",

    handler: rateLimitHandler,
});

export const codingEvaluationLimiter = rateLimit({
    windowMs: 5 * 60 * 1000,

    limit: 10,

    standardHeaders: "draft-8",

    legacyHeaders: false,

    keyGenerator: (req) =>
        req.user?.userId ?? "unauthenticated",

    handler: (_req, res) => {
        return res
            .status(HTTP_STATUS.TOO_MANY_REQUESTS)
            .json({
                success: false,
                message:
                    "Too many code evaluations submitted. Please review your solution and try again in a few minutes.",
            });
    },
});

export const interviewSessionStartLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,

    limit: 6,

    standardHeaders: "draft-8",

    legacyHeaders: false,

    keyGenerator: (req) =>
        req.user?.userId ?? "unauthenticated",

    handler: (_req, res) => {
        return res
            .status(HTTP_STATUS.TOO_MANY_REQUESTS)
            .json({
                success: false,
                message:
                    "You have initiated several interview sessions recently. Please resume your active session or try again in a few minutes.",
            });
    },
});

export const interviewAnswerLimiter = rateLimit({
    windowMs: 60 * 1000,

    limit: 10,

    standardHeaders: "draft-8",

    legacyHeaders: false,

    keyGenerator: (req) =>
        req.user?.userId ?? "unauthenticated",

    handler: (_req, res) => {
        return res
            .status(HTTP_STATUS.TOO_MANY_REQUESTS)
            .json({
                success: false,
                message:
                    "Please take a moment to reflect before submitting your next interview answer.",
            });
    },
});

export const roadmapGenerateLimiter = rateLimit({
    windowMs: 5 * 60 * 1000,

    limit: 3,

    standardHeaders: "draft-8",

    legacyHeaders: false,

    keyGenerator: (req) =>
        req.user?.userId ?? "unauthenticated",

    handler: (_req, res) => {
        return res
            .status(HTTP_STATUS.TOO_MANY_REQUESTS)
            .json({
                success: false,
                message:
                    "Roadmap generation was requested recently. Please check your workspace or wait a few minutes before generating again.",
            });
    },
});

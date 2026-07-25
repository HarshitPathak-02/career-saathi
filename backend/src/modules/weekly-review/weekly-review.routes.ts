import {
    Router,
} from "express";

import {
    authenticate,
} from "../../core/middleware/authenticate.middleware.js";

import {
    weeklyReviewController,
} from "./weekly-review.controller.js";

const router =
    Router();

router.get(
    "/current",
    authenticate,
    weeklyReviewController
        .getCurrentWeeklyReview
        .bind(weeklyReviewController)
);

router.post(
    "/submit",
    authenticate,
    weeklyReviewController
        .submitWeeklyReview
        .bind(weeklyReviewController)
);

export default router;
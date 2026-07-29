import {
    Router,
} from "express";

import {
    authenticate,
} from "../../core/middleware/authenticate.middleware.js";

import {
    validateRequest,
} from "../../core/middleware/validate.middleware.js";

import {
    weeklyReviewController,
} from "./weekly-review.controller.js";

import {
    submitWeeklyReviewSchema,
} from "./weekly-review.validator.js";

const router =
    Router();

/*
|--------------------------------------------------------------------------
| Current Weekly Review
|--------------------------------------------------------------------------
*/

router.get(
    "/current",

    authenticate,

    weeklyReviewController
        .getCurrentWeeklyReview
);

/*
|--------------------------------------------------------------------------
| Submit Weekly Review
|--------------------------------------------------------------------------
*/

router.post(
    "/submit",

    authenticate,

    validateRequest({
        body:
            submitWeeklyReviewSchema,
    }),

    weeklyReviewController
        .submitWeeklyReview
);

export default router;
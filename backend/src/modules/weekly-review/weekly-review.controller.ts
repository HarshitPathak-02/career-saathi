import {
    Request,
    Response,
} from "express";

import {
    asyncHandler,
} from "../../core/middleware/async-handler.js";

import {
    successResponse,
} from "../../core/responses/successResponse.js";

import {
    getAuthUser,
} from "../../shared/utils/get-auth-user.js";

import {
    weeklyReviewWorkflow,
} from "./weekly-review.workflow.js";

import type {
    SubmitWeeklyReviewDTO,
} from "./weekly-review.types.js";

class WeeklyReviewController {

    /*
    |--------------------------------------------------------------------------
    | Get Current Weekly Review
    |--------------------------------------------------------------------------
    */

    getCurrentWeeklyReview =
        asyncHandler(
            async (
                req: Request,
                res: Response
            ) => {

                const user =
                    getAuthUser(req);

                const review =
                    await weeklyReviewWorkflow
                        .getCurrentWeeklyReview(
                            user.userId
                        );

                return successResponse({
                    res,

                    statusCode: 200,

                    message:
                        "Weekly review fetched successfully.",

                    data:
                        review,
                });

            }
        );

    /*
    |--------------------------------------------------------------------------
    | Submit Weekly Review
    |--------------------------------------------------------------------------
    */

    submitWeeklyReview =
        asyncHandler(
            async (
                req: Request,
                res: Response
            ) => {

                const user =
                    getAuthUser(req);

                const dto =
                    req.body as SubmitWeeklyReviewDTO;

                const result =
                    await weeklyReviewWorkflow
                        .submitWeeklyReview(
                            user.userId,
                            dto
                        );

                return successResponse({
                    res,

                    statusCode: 201,

                    message:
                        "Weekly review completed successfully.",

                    data:
                        result,
                });

            }
        );

}

export const weeklyReviewController =
    new WeeklyReviewController();
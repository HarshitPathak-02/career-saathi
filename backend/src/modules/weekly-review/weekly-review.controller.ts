import {
    NextFunction,
    Request,
    Response,
} from "express";

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

    async getCurrentWeeklyReview(
        req: Request,
        res: Response,
        next: NextFunction
    ) {

        try {

            const user =
                getAuthUser(req);

            const review =
                await weeklyReviewWorkflow
                    .getCurrentWeeklyReview(
                        user.userId
                    );

            res.status(200).json({

                success: true,

                data: review,

            });

        } catch (error) {

            next(error);

        }

    }

    /*
    |--------------------------------------------------------------------------
    | Submit Weekly Review
    |--------------------------------------------------------------------------
    */

    async submitWeeklyReview(
        req: Request,
        res: Response,
        next: NextFunction
    ) {

        try {

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

            res.status(201).json({

                success: true,

                message:
                    "Weekly review completed successfully.",

                data: result,

            });

        } catch (error) {

            next(error);

        }

    }

}

export const weeklyReviewController =
    new WeeklyReviewController();
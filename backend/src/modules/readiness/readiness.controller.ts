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
    HTTP_STATUS,
} from "../../core/constants/http-status.constants.js";

import {
    getAuthUser,
} from "../../shared/utils/get-auth-user.js";

import {
    readinessService,
} from "./readiness.service.js";


class ReadinessController {

    /*
    |--------------------------------------------------------------------------
    | Evaluate Readiness
    |--------------------------------------------------------------------------
    */

    evaluateReadiness =
        asyncHandler(
            async (
                req: Request,
                res: Response
            ) => {

                const user =
                    getAuthUser(req);

                const {
                    careerJourneyId,
                } =
                    req.params as {
                        careerJourneyId:
                        string;
                    };

                const evaluation =
                    await readinessService
                        .evaluateReadiness(
                            user.userId,
                            careerJourneyId
                        );

                return successResponse({
                    res,

                    statusCode:
                        HTTP_STATUS.OK,

                    message:
                        "Readiness evaluated successfully.",

                    data:
                        evaluation,
                });
            }
        );
}


export const readinessController =
    new ReadinessController();
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
    | Get Readiness State
    |--------------------------------------------------------------------------
    |
    | Query-only endpoint.
    |
    | This endpoint does not create a readiness evaluation.
    | It only returns the current readiness state.
    |
    */

    getReadinessState =
        asyncHandler(
            async (
                req: Request,
                res: Response
            ) => {

                const user =
                    getAuthUser(
                        req
                    );


                const {
                    careerJourneyId,
                } =
                    req.params as {
                        careerJourneyId:
                        string;
                    };


                const readiness =
                    await readinessService
                        .getReadinessState(
                            user.userId,
                            careerJourneyId
                        );


                return successResponse({

                    res,

                    statusCode:
                        HTTP_STATUS.OK,

                    message:
                        "Readiness state fetched successfully.",

                    data:
                        readiness,

                });

            }
        );


    /*
    |--------------------------------------------------------------------------
    | Evaluate Readiness
    |--------------------------------------------------------------------------
    |
    | Command endpoint.
    |
    | Calculates readiness using the latest mock interview
    | evidence and persists the resulting evaluation.
    |
    */

    evaluateReadiness =
        asyncHandler(
            async (
                req: Request,
                res: Response
            ) => {

                const user =
                    getAuthUser(
                        req
                    );


                const {
                    careerJourneyId,
                } =
                    req.params as {
                        careerJourneyId:
                        string;
                    };


                const evaluation =
                    await readinessService
                        .performReadinessEvaluation(
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
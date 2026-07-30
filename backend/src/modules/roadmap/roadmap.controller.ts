import {
    Request,
    Response,
} from "express";

import {
    Types,
} from "mongoose";

import {
    asyncHandler,
} from "../../core/middleware/async-handler.js";

import {
    successResponse,
} from "../../core/responses/successResponse.js";

import {
    roadmapService,
} from "./roadmap.service.js";

import {
    roadmapWorkflowService,
} from "./roadmap-workflow.service.js";

import {
    roadmapResponseMapper,
} from "./roadmap-response.mapper.js";

import {
    AppError,
} from "../../core/errors/app-error.js";


class RoadmapController {

    /*
    |--------------------------------------------------------------------------
    | Generate Roadmap
    |--------------------------------------------------------------------------
    */

    generateRoadmap =
        asyncHandler(
            async (
                req: Request,
                res: Response
            ) => {

                const {
                    careerJourneyId,
                } = req.body;

                const roadmap =
                    await roadmapWorkflowService
                        .generateRoadmap(
                            new Types.ObjectId(
                                careerJourneyId
                            )
                        );

                const data =
                    roadmapResponseMapper
                        .toRoadmapResponse(
                            roadmap
                        );

                return successResponse({
                    res,

                    statusCode: 201,

                    message:
                        "Roadmap generated successfully.",

                    data,
                });

            }
        );

    /*
    |--------------------------------------------------------------------------
    | Get Roadmap
    |--------------------------------------------------------------------------
    */

    getRoadmap =
        asyncHandler(
            async (
                req: Request,
                res: Response
            ) => {

                const roadmap =
                    await roadmapService
                        .getRoadmapByCareerJourney(
                            req.params
                                .careerJourneyId as string
                        );

                if (!roadmap) {

                    throw new AppError(
                        404,
                        "Roadmap not found."
                    );

                }

                const data =
                    roadmapResponseMapper
                        .toRoadmapResponse(
                            roadmap
                        );

                return successResponse({
                    res,

                    statusCode: 200,

                    message:
                        "Roadmap fetched successfully.",

                    data,
                });

            }
        );

    /*
    |--------------------------------------------------------------------------
    | Get Roadmap Items
    |--------------------------------------------------------------------------
    */

    getRoadmapItems =
        asyncHandler(
            async (
                req: Request,
                res: Response
            ) => {

                const roadmapItems =
                    await roadmapService
                        .getRoadmapItems(
                            req.params
                                .roadmapId as string
                        );

                const data =
                    roadmapResponseMapper
                        .toRoadmapItemsResponse(
                            roadmapItems
                        );

                return successResponse({
                    res,

                    statusCode: 200,

                    message:
                        "Roadmap items fetched successfully.",

                    data,
                });

            }
        );

    /*
    |--------------------------------------------------------------------------
    | Get Next Pending Items
    |--------------------------------------------------------------------------
    */

    getNextPendingItems =
        asyncHandler(
            async (
                req: Request,
                res: Response
            ) => {

                const limit =
                    Number(
                        req.query.limit
                    ) || 5;

                const roadmapItems =
                    await roadmapService
                        .getNextPendingItems(
                            new Types.ObjectId(
                                req.params
                                    .roadmapId as string
                            ),
                            limit
                        );

                const data =
                    roadmapResponseMapper
                        .toRoadmapItemsResponse(
                            roadmapItems
                        );

                return successResponse({
                    res,

                    statusCode: 200,

                    message:
                        "Next pending roadmap items fetched successfully.",

                    data,
                });

            }
        );

}


export const roadmapController =
    new RoadmapController();
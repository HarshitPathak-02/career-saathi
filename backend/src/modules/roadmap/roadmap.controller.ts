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
import { HTTP_STATUS } from "../../core/constants/http-status.constants.js";
import { getAuthUser } from "../../shared/utils/get-auth-user.js";
import { roadmapAdaptiveWorkflowService } from "./roadmap-adaptive-workflow.service.js";


class RoadmapController {

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
                        HTTP_STATUS.NOT_FOUND,
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

    generateAdaptiveRoadmap =
        asyncHandler(
            async (
                req: Request,
                res: Response
            ) => {

                const user =
                    getAuthUser(req);

                const careerJourneyId =
                    req.params
                        .careerJourneyId as string;

                const roadmap =
                    await roadmapAdaptiveWorkflowService
                        .generateAdaptiveRoadmap(
                            user.userId,
                            careerJourneyId
                        );

                const data =
                    roadmapResponseMapper
                        .toRoadmapResponse(
                            roadmap
                        );

                return successResponse({
                    res,

                    statusCode:
                        HTTP_STATUS.CREATED,

                    message:
                        "Adaptive roadmap generated successfully.",

                    data,
                });
            }
        );

}


export const roadmapController =
    new RoadmapController();
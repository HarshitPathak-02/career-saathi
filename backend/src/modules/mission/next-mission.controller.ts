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
    getAuthUser,
} from "../../shared/utils/get-auth-user.js";

import {
    nextMissionWorkflow,
} from "./next-mission.workflow.js";

class NextMissionController {

    generateNextMission =
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
                } = req.params as {
                    careerJourneyId: string;
                };

                const mission =
                    await nextMissionWorkflow
                        .generateNextMission(
                            user.userId,
                            new Types.ObjectId(
                                careerJourneyId
                            )
                        );

                return successResponse({
                    res,

                    statusCode: 201,

                    message:
                        "Next mission generated successfully.",

                    data:
                        mission,
                });
            }
        );
}

export const nextMissionController =
    new NextMissionController();
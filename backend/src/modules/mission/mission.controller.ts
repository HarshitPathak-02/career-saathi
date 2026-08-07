import {
    Request,
    Response,
} from "express";

import {
    Types,
} from "mongoose";

import {
    missionService,
} from "./mission.service.js";

import {
    missionWorkflowService,
} from "./mission.workflow.js";

import {
    missionMapper,
} from "./mission.mapper.js";

import {
    dailyTaskService,
} from "../daily-task/daily-task.service.js";

import {
    getAuthUser,
} from "../../shared/utils/get-auth-user.js";

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
    AppError,
} from "../../core/errors/app-error.js";
import { MissionMessages } from "./index.js";


class MissionController {

    /*
    |--------------------------------------------------------------------------
    | Create Initial Mission
    |--------------------------------------------------------------------------
    */

    createInitialMission = asyncHandler(
        async (
            req: Request,
            res: Response
        ) => {

            const user =
                getAuthUser(req);

            const {
                careerJourneyId,
            } = req.params as {
                careerJourneyId: string;
            };

            const mission =
                await missionWorkflowService
                    .createInitialMission(
                        new Types.ObjectId(
                            careerJourneyId
                        )
                    );

            const progress =
                await dailyTaskService
                    .getMissionProgress(
                        mission._id
                    );

            const data =
                missionMapper
                    .toMissionSummaryDto(
                        mission,
                        progress
                    );

            return successResponse({
                res,

                statusCode:
                    HTTP_STATUS.CREATED,

                message:
                    "Initial mission created successfully.",

                data,
            });
        }
    );

    /*
    |--------------------------------------------------------------------------
    | Get Mission By Id
    |--------------------------------------------------------------------------
    */

    getMission = asyncHandler(
        async (
            req: Request,
            res: Response
        ) => {

            const {
                missionId,
            } = req.params as {
                missionId: string;
            };

            const mission =
                await missionService
                    .getMission(
                        missionId
                    );

            if (!mission) {
                throw new AppError(
                    HTTP_STATUS.NOT_FOUND,
                    MissionMessages.NOT_FOUND
                );
            }

            const progress =
                await dailyTaskService
                    .getMissionProgress(
                        mission._id
                    );

            const currentMissionDay =
                await missionService
                    .getCurrentMissionDay(
                        mission._id
                    );

            const data =
                missionMapper
                    .toMissionDetailsDto(
                        mission,
                        progress,
                        currentMissionDay
                    );

            return successResponse({
                res,

                statusCode:
                    HTTP_STATUS.OK,

                message:
                    "Mission fetched successfully.",

                data,
            });
        }
    );

    /*
    |--------------------------------------------------------------------------
    | Get Current Mission
    |--------------------------------------------------------------------------
    */

    getCurrentMission = asyncHandler(
        async (
            req: Request,
            res: Response
        ) => {

            const {
                careerJourneyId,
            } = req.params as {
                careerJourneyId: string;
            };

            const mission =
                await missionService
                    .getActiveMission(
                        careerJourneyId
                    );

            if (!mission) {
                throw new AppError(
                    HTTP_STATUS.NOT_FOUND,
                    MissionMessages.NOT_FOUND
                );
            }

            const progress =
                await dailyTaskService
                    .getMissionProgress(
                        mission._id
                    );

            const data =
                missionMapper
                    .toMissionSummaryDto(
                        mission,
                        progress
                    );

            return successResponse({
                res,

                statusCode:
                    HTTP_STATUS.OK,

                message:
                    "Current mission fetched successfully.",

                data,
            });
        }
    );

    /*
    |--------------------------------------------------------------------------
    | Get Latest Mission
    |--------------------------------------------------------------------------
    */

    getLatestMission = asyncHandler(
        async (
            req: Request,
            res: Response
        ) => {

            const {
                careerJourneyId,
            } = req.params as {
                careerJourneyId: string;
            };

            const mission =
                await missionService
                    .getLatestMission(
                        careerJourneyId
                    );

            if (!mission) {
                throw new AppError(
                    HTTP_STATUS.NOT_FOUND,
                    MissionMessages.NOT_FOUND
                );
            }

            const progress =
                await dailyTaskService
                    .getMissionProgress(
                        mission._id
                    );

            const data =
                missionMapper
                    .toMissionSummaryDto(
                        mission,
                        progress
                    );

            return successResponse({
                res,

                statusCode:
                    HTTP_STATUS.OK,

                message:
                    "Latest mission fetched successfully.",

                data,
            });
        }
    );

    /*
    |--------------------------------------------------------------------------
    | Get Mission History
    |--------------------------------------------------------------------------
    */

    getMissionHistory = asyncHandler(
        async (
            req: Request,
            res: Response
        ) => {

            console.log("Mission hit");

            const {
                careerJourneyId,
            } = req.params as {
                careerJourneyId: string;
            };

            const missions =
                await missionService
                    .getMissionHistory(
                        careerJourneyId
                    );

            const data =
                await Promise.all(
                    missions.map(
                        async (mission) => {

                            const progress =
                                await dailyTaskService
                                    .getMissionProgress(
                                        mission._id
                                    );

                            return missionMapper
                                .toMissionSummaryDto(
                                    mission,
                                    progress
                                );
                        }
                    )
                );

            console.log("Mission data:", data);

            return successResponse({
                res,

                statusCode:
                    HTTP_STATUS.OK,

                message:
                    "Mission history fetched successfully.",

                data,
            });
        }
    );
}

export const missionController =
    new MissionController();
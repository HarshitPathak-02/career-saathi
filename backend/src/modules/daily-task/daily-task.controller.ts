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
    dailyTaskService,
} from "./daily-task.service.js";

import {
    dailyTaskResponseMapper,
} from "./daily-task.response.mapper.js";

import {
    AppError,
} from "../../core/errors/app-error.js";
import { HTTP_STATUS } from "../../core/constants/http-status.constants.js";

class DailyTaskController {

    getTask = asyncHandler(
        async (
            req: Request,
            res: Response
        ) => {

            const task =
                await dailyTaskService
                    .getTask(
                        new Types.ObjectId(
                            req.params.taskId as string
                        )
                    );

            if (!task) {

                throw new AppError(
                    HTTP_STATUS.NOT_FOUND,
                    "Daily task not found."
                );

            }

            res.status(HTTP_STATUS.OK).json(
                dailyTaskResponseMapper
                    .toTaskResponse(
                        task
                    )
            );

        }
    );

    getTasksByMission = asyncHandler(
        async (
            req: Request,
            res: Response
        ) => {

            const tasks =
                await dailyTaskService
                    .getTasksByMission(
                        new Types.ObjectId(
                            req.params.missionId as string
                        )
                    );

            res.status(HTTP_STATUS.OK).json(
                dailyTaskResponseMapper
                    .toTasksResponse(
                        tasks
                    )
            );

        }
    );

    markCompleted = asyncHandler(
        async (
            req: Request,
            res: Response
        ) => {

            const task =
                await dailyTaskService
                    .markCompleted(
                        new Types.ObjectId(
                            req.params.taskId as string
                        )
                    );

            if (!task) {

                throw new AppError(
                    HTTP_STATUS.NOT_FOUND,
                    "Daily task not found."
                );

            }

            res.status(HTTP_STATUS.OK).json(
                dailyTaskResponseMapper
                    .toTaskResponse(
                        task
                    )
            );

        }
    );

    markPending = asyncHandler(
        async (
            req: Request,
            res: Response
        ) => {

            const task =
                await dailyTaskService
                    .markPending(
                        new Types.ObjectId(
                            req.params.taskId as string
                        )
                    );

            if (!task) {

                throw new AppError(
                    HTTP_STATUS.NOT_FOUND,
                    "Daily task not found."
                );

            }

            res.status(HTTP_STATUS.OK).json(
                dailyTaskResponseMapper
                    .toTaskResponse(
                        task
                    )
            );

        }
    );

    markSkipped = asyncHandler(
        async (
            req: Request,
            res: Response
        ) => {

            const task =
                await dailyTaskService
                    .markSkipped(
                        new Types.ObjectId(
                            req.params.taskId as string
                        )
                    );

            if (!task) {

                throw new AppError(
                    HTTP_STATUS.NOT_FOUND,
                    "Daily task not found."
                );

            }

            res.status(HTTP_STATUS.OK).json(
                dailyTaskResponseMapper
                    .toTaskResponse(
                        task
                    )
            );

        }
    );

}

export const dailyTaskController =
    new DailyTaskController();
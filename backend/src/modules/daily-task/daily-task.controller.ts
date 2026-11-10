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
import { getAuthUser } from "../../shared/utils/get-auth-user.js";
import { missionRepository } from "../mission/mission.repository.js";
import { careerJourneyRepository } from "../career-journey/career-journey.repository.js";

class DailyTaskController {

    private async ensureTaskOwnership(taskId: Types.ObjectId, userId: string) {
        const task = await dailyTaskService.getTask(taskId);
        if (!task) {
            throw new AppError(HTTP_STATUS.NOT_FOUND, "Daily task not found.");
        }
        const mission = await missionRepository.findById(task.missionId);
        if (!mission) {
            throw new AppError(HTTP_STATUS.NOT_FOUND, "Daily task not found.");
        }
        const careerJourney = await careerJourneyRepository.findByIdAndUserId(
            mission.careerJourneyId,
            new Types.ObjectId(userId)
        );
        if (!careerJourney) {
            throw new AppError(HTTP_STATUS.NOT_FOUND, "Daily task not found.");
        }
        return task;
    }

    private async ensureMissionOwnership(missionId: Types.ObjectId, userId: string) {
        const mission = await missionRepository.findById(missionId);
        if (!mission) {
            throw new AppError(HTTP_STATUS.NOT_FOUND, "Mission not found.");
        }
        const careerJourney = await careerJourneyRepository.findByIdAndUserId(
            mission.careerJourneyId,
            new Types.ObjectId(userId)
        );
        if (!careerJourney) {
            throw new AppError(HTTP_STATUS.NOT_FOUND, "Mission not found.");
        }
        return mission;
    }

    getTask = asyncHandler(
        async (
            req: Request,
            res: Response
        ) => {
            const user = getAuthUser(req);
            const taskId = new Types.ObjectId(req.params.taskId as string);
            const task = await this.ensureTaskOwnership(taskId, user.userId);

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
            const user = getAuthUser(req);
            const missionId = new Types.ObjectId(req.params.missionId as string);
            await this.ensureMissionOwnership(missionId, user.userId);

            const tasks =
                await dailyTaskService
                    .getTasksByMission(
                        missionId
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
            const user = getAuthUser(req);
            const taskId = new Types.ObjectId(req.params.taskId as string);
            await this.ensureTaskOwnership(taskId, user.userId);

            const task =
                await dailyTaskService
                    .markCompleted(
                        taskId
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
            const user = getAuthUser(req);
            const taskId = new Types.ObjectId(req.params.taskId as string);
            await this.ensureTaskOwnership(taskId, user.userId);

            const task =
                await dailyTaskService
                    .markPending(
                        taskId
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
            const user = getAuthUser(req);
            const taskId = new Types.ObjectId(req.params.taskId as string);
            await this.ensureTaskOwnership(taskId, user.userId);

            const task =
                await dailyTaskService
                    .markSkipped(
                        taskId
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
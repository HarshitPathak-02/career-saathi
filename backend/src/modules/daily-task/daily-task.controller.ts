import {
    Request,
    Response,
    NextFunction,
} from "express";

import { Types } from "mongoose";

import {
    dailyTaskService,
} from "./daily-task.service.js";

import {
    dailyTaskResponseMapper,
} from "./daily-task.response.mapper.js";

import {
    AppError,
} from "../../core/errors/app-error.js";

class DailyTaskController {

    async getTask(
        req: Request,
        res: Response,
        next: NextFunction
    ) {

        try {

            const task =
                await dailyTaskService.getTask(
                    new Types.ObjectId(
                        req.params.taskId as string
                    )
                );

            if (!task) {
                throw new AppError(
                    404,
                    "Daily task not found."
                );
            }

            res.json(
                dailyTaskResponseMapper.toTaskResponse(
                    task
                )
            );

        } catch (error) {

            next(error);

        }

    }

    async getTasksByMission(
        req: Request,
        res: Response,
        next: NextFunction
    ) {

        try {

            const tasks =
                await dailyTaskService.getTasksByMission(
                    new Types.ObjectId(
                        req.params.missionId as string
                    )
                );

            res.json(
                dailyTaskResponseMapper.toTasksResponse(
                    tasks
                )
            );

        } catch (error) {

            next(error);

        }

    }

    async markCompleted(
        req: Request,
        res: Response,
        next: NextFunction
    ) {

        try {

            const task =
                await dailyTaskService.markCompleted(
                    new Types.ObjectId(
                        req.params.taskId as string
                    )
                );

            res.json(
                dailyTaskResponseMapper.toTaskResponse(
                    task!
                )
            );

        } catch (error) {

            next(error);

        }

    }

    async markPending(
        req: Request,
        res: Response,
        next: NextFunction
    ) {

        try {

            const task =
                await dailyTaskService.markPending(
                    new Types.ObjectId(
                        req.params.taskId as string
                    )
                );

            res.json(
                dailyTaskResponseMapper.toTaskResponse(
                    task!
                )
            );

        } catch (error) {

            next(error);

        }

    }

    async markSkipped(
        req: Request,
        res: Response,
        next: NextFunction
    ) {

        try {

            const task =
                await dailyTaskService.markSkipped(
                    new Types.ObjectId(
                        req.params.taskId as string
                    )
                );

            res.json(
                dailyTaskResponseMapper.toTaskResponse(
                    task!
                )
            );

        } catch (error) {

            next(error);

        }

    }

}

export const dailyTaskController =
    new DailyTaskController();
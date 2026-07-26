import {
    ClientSession,
    Types,
} from "mongoose";

import {
    dailyTaskRepository,
} from "./daily-task.repository.js";

import {
    DailyTaskStatus,
    DailyTaskType,
} from "./daily-task.enums.js";

import {
    DailyTaskGenerationOutput,
    MissionProgress,
} from "./daily-task.types.js";

import {
    AppError,
} from "../../core/errors/app-error.js";

import {
    missionService,
} from "../mission/mission.service.js";

class DailyTaskService {

    async createMany(
        missionId: Types.ObjectId,
        tasks: DailyTaskGenerationOutput,
        session?: ClientSession
    ) {

        const dailyTasks =
            tasks.map(task => ({

                missionId,

                dayNumber: task.dayNumber,

                type:
                    task.type ??
                    DailyTaskType.STUDY,

                title: task.title,

                description: task.description,

                topics: task.topics,

                estimatedMinutes:
                    task.estimatedMinutes,

            }));

        return dailyTaskRepository.createMany(
            dailyTasks,
            session
        );

    }

    async getTask(
        taskId: Types.ObjectId
    ) {

        return dailyTaskRepository.findById(
            taskId
        );

    }

    async getTasksByMission(
        missionId: Types.ObjectId
    ) {

        return dailyTaskRepository.findByMissionId(
            missionId
        );

    }

    async getTaskByMissionAndDay(
        missionId: Types.ObjectId,
        dayNumber: number
    ) {

        return dailyTaskRepository.findByMissionAndDay(
            missionId,
            dayNumber
        );

    }

    /*
    |--------------------------------------------------------------------------
    | Normal Daily Task Completion
    |--------------------------------------------------------------------------
    |
    | Used by the public daily-task endpoint.
    |
    | Rules:
    | - Previous/current days can be completed.
    | - Future days cannot be completed.
    | - Day 7 cannot be completed directly.
    |
    */

    async markCompleted(
        taskId: Types.ObjectId,
        session?: ClientSession
    ) {

        console.trace(
            "NORMAL DAILY TASK markCompleted CALLED:",
            taskId.toString()
        );

        const task =
            await dailyTaskRepository.findById(
                taskId,
                session
            );

        if (!task) {

            throw new AppError(
                404,
                "Daily task not found."
            );

        }

        if (task.dayNumber === 7) {

            throw new AppError(
                409,
                "Day 7 can only be completed through the weekly review."
            );

        }

        const currentMissionDay =
            await missionService.getCurrentMissionDay(
                task.missionId,
                session
            );

        if (
            task.dayNumber >
            currentMissionDay
        ) {

            throw new AppError(
                409,
                "Future daily tasks cannot be completed."
            );

        }

        return this.updateTaskStatus(
            taskId,
            DailyTaskStatus.COMPLETED,
            session
        );

    }

    /*
    |--------------------------------------------------------------------------
    | Weekly Review Task Completion
    |--------------------------------------------------------------------------
    |
    | Internal workflow operation.
    | This should NOT get its own public route.
    |
    */

    async completeWeeklyReviewTask(
        missionId: Types.ObjectId,
        session?: ClientSession
    ) {

        const task =
            await dailyTaskRepository.findByMissionAndDay(
                missionId,
                7,
                session
            );

        if (!task) {

            throw new AppError(
                404,
                "Weekly review task not found."
            );

        }

        const currentMissionDay =
            await missionService.getCurrentMissionDay(
                missionId,
                session
            );

        if (currentMissionDay < 7) {

            throw new AppError(
                409,
                "Weekly review is not available yet."
            );

        }

        if (
            task.status ===
            DailyTaskStatus.COMPLETED
        ) {

            return task;

        }

        return this.updateTaskStatus(
            task._id,
            DailyTaskStatus.COMPLETED,
            session
        );

    }

    async markPending(
        taskId: Types.ObjectId,
        session?: ClientSession,
    ) {

        await this.ensureNormalDailyTask(
            taskId,
            session,
        );

        return this.updateTaskStatus(
            taskId,
            DailyTaskStatus.PENDING,
            session,
        );

    }

    async markSkipped(
        taskId: Types.ObjectId,
        session?: ClientSession,
    ) {

        await this.ensureNormalDailyTask(
            taskId,
            session,
        );

        return this.updateTaskStatus(
            taskId,
            DailyTaskStatus.SKIPPED,
            session,
        );

    }

    async getMissionProgress(
        missionId: Types.ObjectId
    ): Promise<MissionProgress> {

        const tasks =
            await dailyTaskRepository.findByMissionId(
                missionId
            );

        const totalDays =
            tasks.length;

        const completedDays =
            tasks.filter(
                task =>
                    task.status ===
                    DailyTaskStatus.COMPLETED
            ).length;

        const progressPercentage =
            totalDays === 0
                ? 0
                : Math.round(
                    (completedDays / totalDays) *
                    100
                );

        return {

            totalDays,

            completedDays,

            progressPercentage,

        };

    }

    private async updateTaskStatus(
        taskId: Types.ObjectId,
        status: DailyTaskStatus,
        session?: ClientSession
    ) {

        return dailyTaskRepository.updateById(
            taskId,
            {
                status,

                completedAt:
                    status ===
                        DailyTaskStatus.COMPLETED
                        ? new Date()
                        : null,
            },
            session
        );

    }

    private async ensureNormalDailyTask(
        taskId: Types.ObjectId,
        session?: ClientSession,
    ) {

        const task =
            await dailyTaskRepository.findById(
                taskId,
                session,
            );

        if (!task) {

            throw new AppError(
                404,
                "Daily task not found.",
            );

        }

        if (task.dayNumber === 7) {

            throw new AppError(
                409,
                "Weekly review task cannot be modified directly.",
            );

        }

        return task;
    }
}

export const dailyTaskService =
    new DailyTaskService();
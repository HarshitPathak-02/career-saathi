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

import {
    roadmapItemProgressService,
} from "../roadmap/roadmap-item-progress.service.js";
import { executeTransaction } from "../../shared/utils/transaction.util.js";
import { appClock } from "../../shared/time/app-clock.js";
import { DailyTaskDocument } from "./daily-task.model.js";
import { DailyTaskMessages } from "./daily-task.constants.js";
import { HTTP_STATUS } from "../../core/constants/http-status.constants.js";

class DailyTaskService {

    async createMany(
        missionId: Types.ObjectId,
        tasks: DailyTaskGenerationOutput,
        session?: ClientSession
    ): Promise<DailyTaskDocument[]> {

        const dailyTasks =
            tasks.map(task => ({

                missionId,

                roadmapItemIds:
                    (
                        task.roadmapItemIds ??
                        []
                    ).map(
                        id =>
                            new Types.ObjectId(
                                id
                            )
                    ),

                revisionSkillIds:
                    (
                        task.revisionSkillIds ??
                        []
                    ).map(
                        id =>
                            new Types.ObjectId(
                                id
                            )
                    ),

                dayNumber:
                    task.dayNumber,

                type:
                    task.type ??
                    DailyTaskType.STUDY,

                title:
                    task.title,

                description:
                    task.description,

                topics:
                    task.topics,

                estimatedMinutes:
                    task.estimatedMinutes,

            }));

        return dailyTaskRepository
            .createMany(
                dailyTasks,
                session
            );

    }

    async getTask(
        taskId: Types.ObjectId,
        session?: ClientSession
    ): Promise<DailyTaskDocument | null> {

        return dailyTaskRepository
            .findById(
                taskId,
                session
            );

    }

    async getTasksByMission(
        missionId: Types.ObjectId,
        session?: ClientSession
    ): Promise<DailyTaskDocument[]> {

        return dailyTaskRepository
            .findByMissionId(
                missionId,
                session
            );

    }

    async getTaskByMissionAndDay(
        missionId: Types.ObjectId,
        dayNumber: number,
        session?: ClientSession
    ): Promise<DailyTaskDocument | null> {

        return dailyTaskRepository
            .findByMissionAndDay(
                missionId,
                dayNumber,
                session
            );

    }

    /*
    |--------------------------------------------------------------------------
    | Normal Daily Task Completion
    |--------------------------------------------------------------------------
    */

    async markCompleted(
        taskId: Types.ObjectId
    ): Promise<DailyTaskDocument | null> {

        return executeTransaction(
            async (session) => {

                const task =
                    await dailyTaskRepository
                        .findById(
                            taskId,
                            session
                        );

                if (!task) {

                    throw new AppError(
                        HTTP_STATUS.NOT_FOUND,
                        "Daily task not found."
                    );

                }

                if (task.dayNumber === 7) {

                    throw new AppError(
                        HTTP_STATUS.CONFLICT,
                        "Day 7 can only be completed through the weekly review."
                    );

                }

                const currentMissionDay =
                    await missionService
                        .getCurrentMissionDay(
                            task.missionId,
                            session
                        );

                if (
                    task.dayNumber >
                    currentMissionDay
                ) {

                    throw new AppError(
                        HTTP_STATUS.CONFLICT,
                        "Future daily tasks cannot be completed."
                    );

                }

                const updatedTask =
                    await this.updateTaskStatus(
                        taskId,
                        DailyTaskStatus.COMPLETED,
                        session
                    );

                if (!updatedTask) {

                    throw new AppError(
                        HTTP_STATUS.NOT_FOUND,
                        "Daily task not found."
                    );

                }

                if (
                    task.roadmapItemIds.length >
                    0
                ) {

                    await roadmapItemProgressService
                        .syncRoadmapItemsForTask(
                            task.missionId,
                            task.roadmapItemIds,
                            session
                        );

                }

                return updatedTask;

            }
        );

    }

    /*
    |--------------------------------------------------------------------------
    | Weekly Review Task Completion
    |--------------------------------------------------------------------------
    */

    async completeWeeklyReviewTask(
        missionId: Types.ObjectId,
        session?: ClientSession
    ): Promise<DailyTaskDocument> {

        const task =
            await dailyTaskRepository
                .findByMissionAndDay(
                    missionId,
                    7,
                    session
                );

        if (!task) {

            throw new AppError(
                HTTP_STATUS.NOT_FOUND,
                "Weekly review task not found."
            );

        }

        const currentMissionDay =
            await missionService
                .getCurrentMissionDay(
                    missionId,
                    session
                );

        if (currentMissionDay < 7) {

            throw new AppError(
                HTTP_STATUS.CONFLICT,
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
        taskId: Types.ObjectId
    ): Promise<DailyTaskDocument | null> {

        return executeTransaction(
            async (session) => {

                const task =
                    await this.ensureNormalDailyTask(
                        taskId,
                        session
                    );

                const updatedTask =
                    await this.updateTaskStatus(
                        taskId,
                        DailyTaskStatus.PENDING,
                        session
                    );

                if (!updatedTask) {

                    throw new AppError(
                        HTTP_STATUS.NOT_FOUND,
                        "Daily task not found."
                    );

                }

                if (
                    task.roadmapItemIds.length >
                    0
                ) {

                    await roadmapItemProgressService
                        .syncRoadmapItemsForTask(
                            task.missionId,
                            task.roadmapItemIds,
                            session
                        );

                }

                return updatedTask;

            }
        );

    }

    async markSkipped(
        taskId: Types.ObjectId
    ): Promise<DailyTaskDocument | null> {

        return executeTransaction(
            async (session) => {

                const task =
                    await this.ensureNormalDailyTask(
                        taskId,
                        session
                    );

                const updatedTask =
                    await this.updateTaskStatus(
                        taskId,
                        DailyTaskStatus.SKIPPED,
                        session
                    );

                if (!updatedTask) {

                    throw new AppError(
                        HTTP_STATUS.NOT_FOUND,
                        "Daily task not found."
                    );

                }

                if (
                    task.roadmapItemIds.length >
                    0
                ) {

                    await roadmapItemProgressService
                        .syncRoadmapItemsForTask(
                            task.missionId,
                            task.roadmapItemIds,
                            session
                        );

                }

                return updatedTask;

            }
        );

    }

    async getMissionProgress(
        missionId: Types.ObjectId,
        session?: ClientSession
    ): Promise<MissionProgress> {

        const tasks =
            await dailyTaskRepository
                .findByMissionId(
                    missionId,
                    session
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
                    (
                        completedDays /
                        totalDays
                    ) * 100
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
    ): Promise<DailyTaskDocument> {

        return dailyTaskRepository
            .updateById(
                taskId,
                {
                    status,

                    completedAt:
                        status ===
                            DailyTaskStatus.COMPLETED
                            ? appClock.now()
                            : null,
                },
                session
            );

    }

    private async ensureNormalDailyTask(
        taskId: Types.ObjectId,
        session?: ClientSession
    ): Promise<DailyTaskDocument> {

        const task =
            await dailyTaskRepository
                .findById(
                    taskId,
                    session
                );

        if (!task) {

            throw new AppError(
                HTTP_STATUS.NOT_FOUND,
                DailyTaskMessages.NOT_FOUND
            );

        }

        if (task.dayNumber === 7) {

            throw new AppError(
                HTTP_STATUS.CONFLICT,
                "Weekly review task cannot be modified directly."
            );

        }

        return task;

    }

}

export const dailyTaskService =
    new DailyTaskService();
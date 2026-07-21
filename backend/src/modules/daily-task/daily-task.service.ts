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
} from "./daily-task.types.js";

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

    async markPending(
        taskId: Types.ObjectId,
        session?: ClientSession
    ) {

        return this.updateTaskStatus(
            taskId,
            DailyTaskStatus.PENDING,
            session
        );

    }

    async markCompleted(
        taskId: Types.ObjectId,
        session?: ClientSession
    ) {

        return this.updateTaskStatus(
            taskId,
            DailyTaskStatus.COMPLETED,
            session
        );

    }

    async markSkipped(
        taskId: Types.ObjectId,
        session?: ClientSession
    ) {

        return this.updateTaskStatus(
            taskId,
            DailyTaskStatus.SKIPPED,
            session
        );

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
                    status === DailyTaskStatus.COMPLETED
                        ? new Date()
                        : null,
            },
            session
        );

    }

}

export const dailyTaskService =
    new DailyTaskService();
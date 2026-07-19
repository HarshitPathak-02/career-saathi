import {
    ClientSession,
    Types,
} from "mongoose";

import {
    dailyTaskRepository,
} from "./daily-task.repository.js";

import {
    DailyTaskStatus,
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

                dayNumber:
                    task.dayNumber,

                title:
                    task.title,

                description:
                    task.description,

                topics:
                    task.topics,

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

        return dailyTaskRepository.updateById(
            taskId,
            {
                status: DailyTaskStatus.PENDING,
                completedAt: null,
            },
            session
        );

    }

    async markCompleted(
        taskId: Types.ObjectId,
        session?: ClientSession
    ) {

        return dailyTaskRepository.updateById(
            taskId,
            {
                status:
                    DailyTaskStatus.COMPLETED,

                completedAt:
                    new Date(),
            },
            session
        );

    }

    async markSkipped(
        taskId: Types.ObjectId,
        session?: ClientSession
    ) {

        return dailyTaskRepository.updateById(
            taskId,
            {
                status: DailyTaskStatus.SKIPPED,
                completedAt: null,
            },
            session
        );

    }

}

export const dailyTaskService =
    new DailyTaskService();
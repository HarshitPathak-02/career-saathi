import {
    DailyTaskDocument,
} from "./daily-task.schema.js";

class DailyTaskResponseMapper {

    toTaskResponse(
        task: DailyTaskDocument
    ) {

        return {

            taskId:
                task._id,

            missionId:
                task.missionId,

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

            status:
                task.status,

            completedAt:
                task.completedAt,

            createdAt:
                task.createdAt,

            updatedAt:
                task.updatedAt,

        };

    }

    toTasksResponse(
        tasks: DailyTaskDocument[]
    ) {

        return tasks.map(task =>
            this.toTaskResponse(task)
        );

    }

}

export const dailyTaskResponseMapper =
    new DailyTaskResponseMapper();
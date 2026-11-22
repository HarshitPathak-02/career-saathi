import {
    DailyTaskDocument,
} from "./daily-task.model.js";
import {
    taskResourceService,
} from "./task-resource.service.js";

class DailyTaskResponseMapper {

    toTaskResponse(
        task: DailyTaskDocument
    ) {

        const existingResources = (task as any).resources;
        const resources =
            Array.isArray(existingResources) && existingResources.length > 0
                ? existingResources
                : taskResourceService.resolveResourcesForTask(task as any);

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

            resources,

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
import {
    TaskDocument,
    TaskResponse,
} from './task.types.js';

export function toTaskResponse(
    task: TaskDocument
): TaskResponse {

    return {

        id:
            task.id,

        skillCode:
            task.skillCode,

        topicCodes:
            task.topicCodes,

        title:
            task.title,

        description:
            task.description,

        order:
            task.order,

        estimatedHours:
            task.estimatedHours,

        taskType:
            task.taskType,

        completionType:
            task.completionType,

        status:
            task.status,

        progress:
            task.progress,

        optional:
            task.optional,

        resources:
            task.resources,

        unlockedAt:
            task.unlockedAt,

        startedAt:
            task.startedAt,

        completedAt:
            task.completedAt,

        createdAt:
            task.createdAt,

        updatedAt:
            task.updatedAt,
    };
}

export function toTaskResponseList(
    tasks: TaskDocument[]
): TaskResponse[] {

    return tasks.map(
        toTaskResponse
    );
}
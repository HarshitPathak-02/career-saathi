import {
    HTTP_STATUS,
} from '../../core/constants/http-status.constants.js';

import {
    AppError,
} from '../../core/errors/app-error.js';

import {
    ProgressStatus,
} from '../../shared/enums/progress-status.enums.js';

import {
    CompletionType,
} from '../task/task.enums.js';

import {
    taskRepository,
} from '../task/task.repository.js';

import {
    taskService,
} from '../task/task.service.js';

import {
    CompleteTaskInput,
} from './task-completion.types.js';

class TaskCompletionService {

    async completeTask(
        input: CompleteTaskInput
    ) {

        const task =
            await taskRepository.findById(
                input.taskId
            );

        if (!task) {

            throw new AppError(
                HTTP_STATUS.NOT_FOUND,
                'Task not found.'
            );
        }

        if (
            task.status ===
            ProgressStatus.LOCKED
        ) {

            throw new AppError(
                HTTP_STATUS.BAD_REQUEST,
                'Task is locked.'
            );
        }

        if (
            task.status ===
            ProgressStatus.COMPLETED
        ) {

            throw new AppError(
                HTTP_STATUS.BAD_REQUEST,
                'Task is already completed.'
            );
        }

        if (
            task.status ===
            ProgressStatus.ASSESSMENT_PENDING
        ) {

            return task;
        }
        switch (
        task.completionType
        ) {

            case CompletionType.SELF:

                return taskService.completeTask(
                    task.id
                );

            case CompletionType.QUIZ:

                return taskService.markAssessmentPending(
                    task.id
                );

            case CompletionType.AI_REVIEW:

                throw new AppError(
                    HTTP_STATUS.BAD_REQUEST,
                    'AI review is not available yet.'
                );

            case CompletionType.MANUAL:

                throw new AppError(
                    HTTP_STATUS.BAD_REQUEST,
                    'Manual approval is not available yet.'
                );

            default:

                throw new AppError(
                    HTTP_STATUS.BAD_REQUEST,
                    'Unsupported task completion type.'
                );
        }
    }
}

export const taskCompletionService =
    new TaskCompletionService();
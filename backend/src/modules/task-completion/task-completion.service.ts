import { HTTP_STATUS } from "../../core/constants/http-status.constants.js";
import { AppError } from "../../core/errors/app-error.js";
import { CompletionType } from "../task/task.enums.js";
import { taskRepository } from "../task/task.repository.js";
import { taskService } from "../task/task.service.js";
import { CompleteTaskInput } from "./task-completion.types.js";

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

        switch (
            task.completionType
        ) {

            case CompletionType.SELF:

                return taskService.updateProgress(
                    task.id,
                    100
                );

            case CompletionType.QUIZ:

                if (
                    !input.score ||
                    input.score < 70
                ) {

                    throw new AppError(
                        HTTP_STATUS.BAD_REQUEST,
                        'Quiz not passed.'
                    );
                }

                return taskService.updateProgress(
                    task.id,
                    100
                );

            case CompletionType.AI_REVIEW:

                throw new AppError(
                    HTTP_STATUS.NO_CONTENT,
                    'AI Review coming soon.'
                );

            case CompletionType.MANUAL:

                throw new AppError(
                    HTTP_STATUS.BAD_REQUEST,
                    'Awaiting mentor approval.'
                );
        }
    }
}

export const taskCompletionService = new TaskCompletionService();
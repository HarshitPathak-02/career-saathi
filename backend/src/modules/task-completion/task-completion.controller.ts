import { Request, Response } from 'express';

import { asyncHandler } from '../../core/middleware/async-handler.js';

import { taskCompletionService } from './task-completion.service.js';

class TaskCompletionController {

    completeTask =
        asyncHandler(
            async (
                req: Request,
                res: Response
            ) => {

                const task =
                    await taskCompletionService.completeTask({

                        taskId:
                            req.params.taskId as string,

                        ...req.body,
                    });

                res.json({

                    success: true,

                    message:
                        'Task completed successfully.',

                    data: task,
                });
            }
        );
}

export const taskCompletionController =
    new TaskCompletionController();
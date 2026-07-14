import { Request, Response } from 'express';

import { asyncHandler } from '../../core/middleware/async-handler.js';

import { taskService } from './task.service.js';

class TaskController {

    getMissionTasks =
        asyncHandler(
            async (
                req: Request,
                res: Response
            ) => {

                const tasks =
                    await taskService.getMissionTasks(
                        req.params.missionId as string
                    );

                res.json({

                    success: true,

                    data:
                        tasks,
                });
            }
        );

    getById =
        asyncHandler(
            async (
                req: Request,
                res: Response
            ) => {

                const task =
                    await taskService.getById(
                        req.params.taskId as string
                    );

                res.json({

                    success: true,

                    data:
                        task,
                });
            }
        );
}

export const taskController =
    new TaskController();
import { Router } from 'express';

import { authenticate } from '../../core/middleware/authenticate.middleware.js';

import { taskController } from './task.controller.js';

const router =
    Router();

router.get(

    '/missions/:missionId/tasks',

    authenticate,

    taskController.getMissionTasks
);

router.get(

    '/:taskId',

    authenticate,

    taskController.getById
);

export default router;
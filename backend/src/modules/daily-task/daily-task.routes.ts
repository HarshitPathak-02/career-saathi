import {
    Router,
} from "express";

import {
    dailyTaskController,
} from "./daily-task.controller.js";

import {
    authenticate,
} from "../../core/middleware/authenticate.middleware.js";

import {
    validateRequest,
} from "../../core/middleware/validate.middleware.js";

import {
    taskIdParamSchema,
    taskMissionIdParamSchema,
} from "./daily-task.validator.js";

const dailyTaskRouter =
    Router();

/*
|--------------------------------------------------------------------------
| Mission Tasks
|--------------------------------------------------------------------------
*/

dailyTaskRouter.get(
    "/mission/:missionId",

    authenticate,

    validateRequest({
        params:
            taskMissionIdParamSchema,
    }),

    dailyTaskController
        .getTasksByMission
);

/*
|--------------------------------------------------------------------------
| Task Status
|--------------------------------------------------------------------------
*/

dailyTaskRouter.patch(
    "/:taskId/complete",

    authenticate,

    validateRequest({
        params:
            taskIdParamSchema,
    }),

    dailyTaskController
        .markCompleted
);

dailyTaskRouter.patch(
    "/:taskId/pending",

    authenticate,

    validateRequest({
        params:
            taskIdParamSchema,
    }),

    dailyTaskController
        .markPending
);

dailyTaskRouter.patch(
    "/:taskId/skip",

    authenticate,

    validateRequest({
        params:
            taskIdParamSchema,
    }),

    dailyTaskController
        .markSkipped
);

/*
|--------------------------------------------------------------------------
| Task By Id
|--------------------------------------------------------------------------
*/

dailyTaskRouter.get(
    "/:taskId",

    authenticate,

    validateRequest({
        params:
            taskIdParamSchema,
    }),

    dailyTaskController
        .getTask
);

export default dailyTaskRouter;
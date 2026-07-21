import {
    Router,
} from "express";

import {
    dailyTaskController,
} from "./daily-task.controller.js";

const dailyTaskRouter =
    Router();

dailyTaskRouter.get(
    "/mission/:missionId",
    dailyTaskController.getTasksByMission
);

dailyTaskRouter.get(
    "/:taskId",
    dailyTaskController.getTask
);

dailyTaskRouter.patch(
    "/:taskId/complete",
    dailyTaskController.markCompleted
);

dailyTaskRouter.patch(
    "/:taskId/pending",
    dailyTaskController.markPending
);

dailyTaskRouter.patch(
    "/:taskId/skip",
    dailyTaskController.markSkipped
);

export default dailyTaskRouter;
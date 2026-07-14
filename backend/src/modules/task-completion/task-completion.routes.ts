import { Router } from "express";
import { completeTaskSchema } from "./task-completion.validators.js";
import { validate } from "../../core/middleware/validate.middleware.js";
import { taskCompletionController } from "./task-completion.controller.js";

const router = Router();

router.post(
    '/tasks/:taskId/complete',
    validate(completeTaskSchema),
    taskCompletionController.completeTask
);

export default router;
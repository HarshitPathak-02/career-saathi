import { Router } from "express";

import { authenticate } from "../../core/middleware/authenticate.middleware.js";
import { validateRequest } from "../../core/middleware/validate.middleware.js";
import {
    attemptIdParamSchema,
    autosaveAnswersSchema,
    submitAttemptAnswersSchema,
} from "./assessment.validator.js";
import { assessmentEngineController } from "./assessment-engine.controller.js";

const assessmentAttemptRouter = Router();

assessmentAttemptRouter.use(authenticate);

assessmentAttemptRouter.get(
    "/:attemptId",

    validateRequest({
        params: attemptIdParamSchema,
    }),

    assessmentEngineController.getAttempt
);

assessmentAttemptRouter.patch(
    "/:attemptId/answers",

    validateRequest({
        params: attemptIdParamSchema,
        body: autosaveAnswersSchema,
    }),

    assessmentEngineController.autosaveAttempt
);

assessmentAttemptRouter.post(
    "/:attemptId/submit",

    validateRequest({
        params: attemptIdParamSchema,
        body: submitAttemptAnswersSchema,
    }),

    assessmentEngineController.submitAttempt
);

export default assessmentAttemptRouter;

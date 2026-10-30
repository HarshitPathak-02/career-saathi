import { Router } from "express";

import { authenticate } from "../../core/middleware/authenticate.middleware.js";
import { validateRequest } from "../../core/middleware/validate.middleware.js";
import { sectionIdParamSchema } from "./assessment.validator.js";
import { assessmentEngineController } from "./assessment-engine.controller.js";

const assessmentSectionRouter = Router();

assessmentSectionRouter.use(authenticate);

assessmentSectionRouter.post(
    "/:sectionId/attempts",

    validateRequest({
        params: sectionIdParamSchema,
    }),

    assessmentEngineController
        .startOrResumeSectionAttempt
);

export default assessmentSectionRouter;

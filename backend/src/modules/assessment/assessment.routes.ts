import {
    Router,
} from "express";

import {
    assessmentController,
} from "./assessment.controller.js";

import {
    authenticate,
} from "../../core/middleware/authenticate.middleware.js";

import {
    validateRequest,
} from "../../core/middleware/validate.middleware.js";
import { assessmentIdParamSchema, careerJourneyIdParamSchema, startInitialAssessmentSchema, startWeeklyAssessmentSchema, submitAssessmentSchema } from "./index.js";



const assessmentRouter =
    Router();

assessmentRouter.use(
    authenticate
);

assessmentRouter.post(
    "/initial/start",

    validateRequest({
        body:
            startInitialAssessmentSchema,
    }),

    assessmentController
        .startInitialAssessment
);

assessmentRouter.post(
    "/initial/submit",

    validateRequest({
        body:
            submitAssessmentSchema,
    }),

    assessmentController
        .submitInitialAssessment
);


assessmentRouter.post(
    "/weekly/start",

    validateRequest({
        body:
            startWeeklyAssessmentSchema,
    }),

    assessmentController
        .startWeeklyAssessment
);

assessmentRouter.post(
    "/weekly/submit",

    validateRequest({
        body:
            submitAssessmentSchema,
    }),

    assessmentController
        .submitWeeklyAssessment
);


assessmentRouter.get(
    "/career-journey/:careerJourneyId",

    validateRequest({
        params:
            careerJourneyIdParamSchema,
    }),

    assessmentController
        .getAssessmentHistory
);


assessmentRouter.get(
    "/:assessmentId/details",

    validateRequest({
        params:
            assessmentIdParamSchema,
    }),

    assessmentController
        .getAssessmentDetails
);


assessmentRouter.get(
    "/:assessmentId/weekly-plan",

    validateRequest({
        params:
            assessmentIdParamSchema,
    }),

    assessmentController
        .getWeeklyAssessmentPlan
);


assessmentRouter.get(
    "/:assessmentId",

    validateRequest({
        params:
            assessmentIdParamSchema,
    }),

    assessmentController
        .getAssessmentById
);

export default assessmentRouter;
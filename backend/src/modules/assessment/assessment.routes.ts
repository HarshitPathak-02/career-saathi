import { Router } from "express";

import {
    assessmentController,
} from "./assessment.controller.js";

import {
    validateRequest,
} from "../../core/middleware/validate.middleware.js";

import {
    startInitialAssessmentSchema,
    startWeeklyAssessmentSchema,
    submitAssessmentSchema,
    assessmentIdParamSchema,
    careerJourneyIdParamSchema,
} from "./assessment.validator.js";

const assessmentRouter = Router();

/*
|--------------------------------------------------------------------------
| Initial Assessment
|--------------------------------------------------------------------------
*/

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

/*
|--------------------------------------------------------------------------
| Weekly Assessment
|--------------------------------------------------------------------------
*/

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

/*
|--------------------------------------------------------------------------
| Assessment History
|--------------------------------------------------------------------------
*/

assessmentRouter.get(
    "/career-journey/:careerJourneyId",

    validateRequest({
        params:
            careerJourneyIdParamSchema,
    }),

    assessmentController
        .getAssessmentHistory
);

/*
|--------------------------------------------------------------------------
| Assessment Details
|--------------------------------------------------------------------------
*/

assessmentRouter.get(
    "/:assessmentId/details",

    validateRequest({
        params:
            assessmentIdParamSchema,
    }),

    assessmentController
        .getAssessmentDetails
);

/*
|--------------------------------------------------------------------------
| Assessment
|--------------------------------------------------------------------------
*/

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
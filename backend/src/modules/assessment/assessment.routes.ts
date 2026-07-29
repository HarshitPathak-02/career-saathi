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

/*
|--------------------------------------------------------------------------
| Authentication
|--------------------------------------------------------------------------
*/

assessmentRouter.use(
    authenticate
);

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
| Weekly Assessment Plan
|--------------------------------------------------------------------------
*/

assessmentRouter.get(
    "/:assessmentId/weekly-plan",

    validateRequest({
        params:
            assessmentIdParamSchema,
    }),

    assessmentController
        .getWeeklyAssessmentPlan
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
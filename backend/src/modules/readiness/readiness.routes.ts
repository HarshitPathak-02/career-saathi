import {
    Router,
} from "express";

import {
    readinessController,
} from "./readiness.controller.js";

import {
    authenticate,
} from "../../core/middleware/authenticate.middleware.js";

import {
    validateRequest,
} from "../../core/middleware/validate.middleware.js";

import {
    evaluateReadinessParamsSchema,
} from "./readiness.validation.js";


const router =
    Router();


router.use(
    authenticate
);


/*
|--------------------------------------------------------------------------
| Get Current Readiness State
|--------------------------------------------------------------------------
*/

router.get(
    "/:careerJourneyId",

    validateRequest({
        params:
            evaluateReadinessParamsSchema,
    }),

    readinessController
        .getReadinessState
);


/*
|--------------------------------------------------------------------------
| Perform Readiness Evaluation
|--------------------------------------------------------------------------
*/

router.post(
    "/:careerJourneyId/evaluate",

    validateRequest({
        params:
            evaluateReadinessParamsSchema,
    }),

    readinessController
        .evaluateReadiness
);


export default router;
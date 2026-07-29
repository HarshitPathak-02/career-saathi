import {
    Router,
} from "express";

import {
    authenticate,
} from "../../core/middleware/authenticate.middleware.js";

import {
    validateRequest,
} from "../../core/middleware/validate.middleware.js";

import {
    weeklyReportController,
} from "./weekly-report.controller.js";

import {
    careerJourneyIdParamSchema,
    weeklyReportIdParamSchema,
} from "./weekly-report.validation.js";

const router =
    Router();

/*
|--------------------------------------------------------------------------
| Latest Weekly Report
|--------------------------------------------------------------------------
*/

router.get(
    "/:careerJourneyId/latest",

    authenticate,

    validateRequest({
        params:
            careerJourneyIdParamSchema,
    }),

    weeklyReportController
        .getLatestWeeklyReport
);

/*
|--------------------------------------------------------------------------
| Weekly Report By Id
|--------------------------------------------------------------------------
*/

router.get(
    "/report/:reportId",

    authenticate,

    validateRequest({
        params:
            weeklyReportIdParamSchema,
    }),

    weeklyReportController
        .getWeeklyReport
);

/*
|--------------------------------------------------------------------------
| Weekly Report History
|--------------------------------------------------------------------------
*/

router.get(
    "/:careerJourneyId",

    authenticate,

    validateRequest({
        params:
            careerJourneyIdParamSchema,
    }),

    weeklyReportController
        .getWeeklyReports
);

export default router;
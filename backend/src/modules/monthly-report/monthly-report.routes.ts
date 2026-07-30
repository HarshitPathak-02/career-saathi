import {
    Router,
} from "express";

import {
    monthlyReportController,
} from "./monthly-report.controller.js";

import { authenticate } from "../../core/middleware/authenticate.middleware.js";


const router =
    Router();


router.use(authenticate)

/*
|--------------------------------------------------------------------------
| Monthly Report Routes
|--------------------------------------------------------------------------
*/


/*
|--------------------------------------------------------------------------
| Check Monthly Report Due Status
|--------------------------------------------------------------------------
|
| Frontend calls this when the user enters
| the dashboard/workspace.
|
| GET
| /monthly-reports/:careerJourneyId/due-status
|
*/

router.get(
    "/:careerJourneyId/due-status",
    monthlyReportController
        .getDueStatus
);


/*
|--------------------------------------------------------------------------
| Generate Monthly Report
|--------------------------------------------------------------------------
|
| Called when user clicks:
|
| "Generate Monthly Report"
|
| POST
| /monthly-reports/:careerJourneyId/generate
|
*/

router.post(
    "/:careerJourneyId/generate",
    monthlyReportController
        .generateMonthlyReport
);


/*
|--------------------------------------------------------------------------
| Get Latest Monthly Report
|--------------------------------------------------------------------------
|
| GET
| /monthly-reports/:careerJourneyId/latest
|
*/

router.get(
    "/:careerJourneyId/latest",
    monthlyReportController
        .getLatestMonthlyReport
);


/*
|--------------------------------------------------------------------------
| Get Monthly Report History
|--------------------------------------------------------------------------
|
| GET
| /monthly-reports/:careerJourneyId/history
|
*/

router.get(
    "/:careerJourneyId/history",
    monthlyReportController
        .getMonthlyReportHistory
);

router.get(
    "/:careerJourneyId/:reportNumber",
    monthlyReportController
        .getMonthlyReportByNumber
);


export default router;
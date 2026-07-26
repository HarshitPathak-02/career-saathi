import {
    Router,
} from "express";

import {
    authenticate,
} from "../../core/middleware/authenticate.middleware.js";

import {
    weeklyReportController,
} from "./weekly-report.controller.js";

const router =
    Router();

router.get(
    "/:careerJourneyId/latest",
    authenticate,
    weeklyReportController
        .getLatestWeeklyReport
        .bind(
            weeklyReportController
        )
);

router.get(
    "/report/:reportId",
    authenticate,
    weeklyReportController
        .getWeeklyReport
        .bind(
            weeklyReportController
        )
);

router.get(
    "/:careerJourneyId",
    authenticate,
    weeklyReportController
        .getWeeklyReports
        .bind(
            weeklyReportController
        )
);

export default router;
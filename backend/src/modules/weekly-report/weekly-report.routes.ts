import {
    Router,
} from "express";

import {
    weeklyReportController,
} from "./weekly-report.controller.js";
import { authenticate } from "../../core/middleware/authenticate.middleware.js";

const router =
    Router();


router.get(
    "/:careerJourneyId/latest",
    authenticate,
    weeklyReportController.getLatestWeeklyReport
);

router.get(
    "/:careerJourneyId",
    authenticate,
    weeklyReportController.getWeeklyReports
);

router.get(
    "/report/:reportId",
    authenticate,
    weeklyReportController.getWeeklyReport
);

export default router;
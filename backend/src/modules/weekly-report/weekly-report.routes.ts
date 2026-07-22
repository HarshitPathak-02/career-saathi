import {
    Router,
} from "express";

import {
    weeklyReportController,
} from "./weekly-report.controller.js";
import { authenticate } from "../../core/middleware/authenticate.middleware.js";

const router =
    Router();

router.post(
    "/generate",
    authenticate,
    weeklyReportController.generateWeeklyReport
);

router.get(
    "/:careerJourneyId/latest",
    weeklyReportController.getLatestWeeklyReport
);

router.get(
    "/:careerJourneyId",
    weeklyReportController.getWeeklyReports
);

router.get(
    "/report/:reportId",
    weeklyReportController.getWeeklyReport
);

export default router;
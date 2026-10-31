import { Router } from "express";
import { adminAnalyticsController } from "./admin-analytics.controller.js";
import { authenticate } from "../../../core/middleware/authenticate.middleware.js";
import { authorize } from "../../../core/middleware/authorize.middleware.js";
import { UserRole } from "../../users/index.js";

const router = Router();

router.use(authenticate, authorize(UserRole.ADMIN));

router.get("/overview", adminAnalyticsController.getOverview);
router.get("/ai-usage", adminAnalyticsController.getAiUsageHistory);
router.get("/track-distribution", adminAnalyticsController.getTrackDistribution);
router.get("/stalled-learners", adminAnalyticsController.getStalledLearners);

export default router;

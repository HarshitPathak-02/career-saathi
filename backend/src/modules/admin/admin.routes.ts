import { Router } from "express";
import adminAuthRoutes from "./auth/admin-auth.routes.js";
import adminAnalyticsRoutes from "./analytics/admin-analytics.routes.js";
import adminUsersRoutes from "./users/admin-users.routes.js";
import adminCurriculumRoutes from "./curriculum/admin-curriculum.routes.js";
import adminChallengesRoutes from "./challenges/admin-challenges.routes.js";
import adminAiTelemetryRoutes from "./ai-telemetry/admin-ai-telemetry.routes.js";
import adminNotificationsRoutes from "./notifications/admin-notifications.routes.js";

const router = Router();

router.use("/auth", adminAuthRoutes);
router.use("/analytics", adminAnalyticsRoutes);
router.use("/users", adminUsersRoutes);
router.use("/curriculum", adminCurriculumRoutes);
router.use("/", adminChallengesRoutes); // covers /challenges and /interview-rubrics
router.use("/ai-generations", adminAiTelemetryRoutes);
router.use("/notifications", adminNotificationsRoutes);

export default router;

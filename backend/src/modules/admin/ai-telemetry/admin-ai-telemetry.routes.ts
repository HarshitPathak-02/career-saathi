import { Router } from "express";
import { adminAiTelemetryController } from "./admin-ai-telemetry.controller.js";
import { authenticate } from "../../../core/middleware/authenticate.middleware.js";
import { authorize } from "../../../core/middleware/authorize.middleware.js";
import { UserRole } from "../../users/index.js";

const router = Router();

router.use(authenticate, authorize(UserRole.ADMIN));

router.get("/", adminAiTelemetryController.getAiGenerations);
router.get("/:id", adminAiTelemetryController.getAiGenerationDetail);
router.post("/:id/retry", adminAiTelemetryController.retryAiGeneration);

export default router;

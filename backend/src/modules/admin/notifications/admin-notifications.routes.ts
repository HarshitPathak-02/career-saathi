import { Router } from "express";
import { adminNotificationsController } from "./admin-notifications.controller.js";
import { authenticate } from "../../../core/middleware/authenticate.middleware.js";
import { authorize } from "../../../core/middleware/authorize.middleware.js";
import { UserRole } from "../../users/index.js";

const router = Router();

router.use(authenticate, authorize(UserRole.ADMIN));

router.get("/broadcast/history", adminNotificationsController.getBroadcastHistory);
router.post("/broadcast", adminNotificationsController.sendBroadcast);

export default router;

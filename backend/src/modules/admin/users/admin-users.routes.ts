import { Router } from "express";
import { adminUsersController } from "./admin-users.controller.js";
import { authenticate } from "../../../core/middleware/authenticate.middleware.js";
import { authorize } from "../../../core/middleware/authorize.middleware.js";
import { UserRole } from "../../users/index.js";

const router = Router();

router.use(authenticate, authorize(UserRole.ADMIN));

router.get("/", adminUsersController.getUsers);
router.get("/:userId/dossier", adminUsersController.getUserDossier);
router.patch("/:userId/status", adminUsersController.updateStatus);
router.post("/:userId/reset-quota", adminUsersController.resetQuota);
router.post("/:userId/impersonate", adminUsersController.impersonate);

export default router;

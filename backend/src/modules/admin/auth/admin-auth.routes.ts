import { Router } from "express";
import { adminAuthController } from "./admin-auth.controller.js";
import { authenticate } from "../../../core/middleware/authenticate.middleware.js";
import { authorize } from "../../../core/middleware/authorize.middleware.js";
import { UserRole } from "../../users/index.js";

const router = Router();

// Public admin login
router.post("/login", adminAuthController.login);

// Guarded profile
router.get(
  "/me",
  authenticate,
  authorize(UserRole.ADMIN),
  adminAuthController.getMe
);

export default router;

import { Router } from "express";

import { authenticate } from "../../core/middleware/authenticate.middleware.js";

import { workspaceController } from "./wworkspace.controller.js";


const router = Router();

router.get(
    "/",
    authenticate,
    workspaceController.getWorkspace
);

export default router;

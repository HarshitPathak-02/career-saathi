import {
    Router,
} from "express";

import {
    authenticate,
} from "../../core/middleware/authenticate.middleware.js";

import {
    workspaceController,
} from "./workspace.controller.js";

const router = Router();

router.use(authenticate);

router.get(
    "/",
    workspaceController.getWorkspace
);

export default router;
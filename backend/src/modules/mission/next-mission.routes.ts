import { Router } from "express";

import { authenticate } from "../../core/middleware/authenticate.middleware.js";

import { nextMissionController } from "./next-mission.controller.js";

const router = Router();

router.post(
    "/:careerJourneyId/next",
    authenticate,
    nextMissionController.generateNextMission,
);

export default router;
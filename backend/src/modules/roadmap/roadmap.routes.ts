import { Router } from "express";

import { roadmapController } from "./roadmap.controller.js";

const router = Router();

router.post(
    "/generate",
    roadmapController.generateRoadmap
);

router.get(
    "/career-journey/:careerJourneyId",
    roadmapController.getRoadmap
);

router.get(
    "/:roadmapId/items",
    roadmapController.getRoadmapItems
);

router.get(
    "/:roadmapId/next-items",
    roadmapController.getNextPendingItems
);

export default router;
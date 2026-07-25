import {
    Router,
} from "express";

import {
    roadmapController,
} from "./roadmap.controller.js";

import {
    validateRequest,
} from "../../core/middleware/validate.middleware.js";

import {
    careerJourneyIdParamSchema,
    generateRoadmapSchema,
    nextPendingItemsQuerySchema,
    roadmapIdParamSchema,
} from "./roadmap.validation.js";


const router =
    Router();


/*
 * Generate personalized roadmap
 */
router.post(
    "/generate",

    validateRequest({
        body:
            generateRoadmapSchema,
    }),

    roadmapController.generateRoadmap
);


/*
 * Get roadmap for career journey
 */
router.get(
    "/career-journey/:careerJourneyId",

    validateRequest({
        params:
            careerJourneyIdParamSchema,
    }),

    roadmapController.getRoadmap
);


/*
 * Get all roadmap items
 */
router.get(
    "/:roadmapId/items",

    validateRequest({
        params:
            roadmapIdParamSchema,
    }),

    roadmapController.getRoadmapItems
);


/*
 * Get next pending roadmap items
 */
router.get(
    "/:roadmapId/next-items",

    validateRequest({
        params:
            roadmapIdParamSchema,

        query:
            nextPendingItemsQuerySchema,
    }),

    roadmapController.getNextPendingItems
);


export default router;
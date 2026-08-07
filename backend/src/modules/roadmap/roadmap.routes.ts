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
    generateAdaptiveRoadmapValidation,
    generateRoadmapSchema,
    nextPendingItemsQuerySchema,
    roadmapIdParamSchema,
} from "./roadmap.validation.js";
import { authenticate } from "../../core/middleware/authenticate.middleware.js";


const router =
    Router();


router.use(authenticate);

router.post(
    "/generate",

    validateRequest({
        body:
            generateRoadmapSchema,
    }),

    roadmapController.generateRoadmap
);

router.get(
    "/career-journey/:careerJourneyId",

    validateRequest({
        params:
            careerJourneyIdParamSchema,
    }),

    roadmapController.getRoadmap
);

router.get(
    "/:roadmapId/items",

    validateRequest({
        params:
            roadmapIdParamSchema,
    }),

    roadmapController.getRoadmapItems
);

router.post(
    "/:careerJourneyId/adaptive",

    validateRequest(
        { params: generateAdaptiveRoadmapValidation },
    ),

    roadmapController
        .generateAdaptiveRoadmap
);

export default router;
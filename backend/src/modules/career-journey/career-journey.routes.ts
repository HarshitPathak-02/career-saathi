import { Router } from "express";

import { careerJourneyController } from "./career-journey.controller.js";

import { authenticate } from "../../core/middleware/authenticate.middleware.js";
import { validateRequest } from "../../core/middleware/validate.middleware.js";

import {
    careerJourneyIdParamSchema,
    createCareerJourneySchema,
    updateCareerJourneySchema,
    updateCareerJourneyStatusSchema,
} from "./career-journey.validation.js";

const router = Router();

router.use(authenticate);

router.post(
    "/",
    validateRequest({
        body: createCareerJourneySchema,
    }),
    careerJourneyController.createCareerJourney
);

router.get(
    "/active",
    careerJourneyController.getActiveCareerJourney
);

router.get(
    "/:careerJourneyId",
    validateRequest({
        params: careerJourneyIdParamSchema,
    }),
    careerJourneyController.getCareerJourneyById
);

router.patch(
    "/:careerJourneyId",
    validateRequest({
        params: careerJourneyIdParamSchema,
        body: updateCareerJourneySchema,
    }),
    careerJourneyController.updateCareerJourney
);

router.patch(
    "/:careerJourneyId/status",
    validateRequest({
        params: careerJourneyIdParamSchema,
        body: updateCareerJourneyStatusSchema,
    }),
    careerJourneyController.updateCareerJourneyStatus
);

router.delete(
    "/:careerJourneyId",
    validateRequest({
        params: careerJourneyIdParamSchema,
    }),
    careerJourneyController.deleteCareerJourney
);

export default router;
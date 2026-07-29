import { Router } from "express";

import { authenticate } from "../../core/middleware/authenticate.middleware.js";
import { validateRequest } from "../../core/middleware/validate.middleware.js";
import { careerJourneyController, careerJourneyIdParamSchema, createCareerJourneySchema, updateCareerJourneySchema } from "./index.js";


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

router.delete(
    "/:careerJourneyId",
    validateRequest({
        params: careerJourneyIdParamSchema,
    }),
    careerJourneyController.deleteCareerJourney
);

export default router;
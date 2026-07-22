import { Router } from "express";

import { weeklyReflectionController } from "./weekly-reflection.controller.js";
import { authenticate } from "../../core/middleware/authenticate.middleware.js";

const router = Router();

router.post(
    "/:careerJourneyId/submit",
    authenticate,
    weeklyReflectionController.submitReflection
);

// router.get(
//     "/current/:careerJourneyId",
//     weeklyReflectionController.getCurrentReflection.bind(
//         weeklyReflectionController,
//     ),
// );

// router.get(
//     "/:careerJourneyId/week/:weekNumber",
//     weeklyReflectionController.getReflectionByWeek.bind(
//         weeklyReflectionController,
//     ),
// );

export default router;
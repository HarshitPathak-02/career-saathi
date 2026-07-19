import { Router } from "express";

import { userSkillController } from "./user-skill.controller.js";

import { validateRequest } from "../../core/middleware/validate.middleware.js";

import {
    initializeUserSkillsBodyValidator,
    careerJourneyIdParamsValidator,
    updateSelectedSkillsBodyValidator,
} from "./user-skill.validator.js";

const router = Router();

router.get(
    "/career-journeys/:careerJourneyId/available-skills",
    validateRequest({
        params: careerJourneyIdParamsValidator,
    }),
    userSkillController.getAvailableSkills
);

router.post(
    "/career-journeys/:careerJourneyId/user-skills",
    validateRequest({
        params: careerJourneyIdParamsValidator,
        body: initializeUserSkillsBodyValidator,
    }),
    userSkillController.initializeUserSkills
);

router.get(
    "/career-journeys/:careerJourneyId/user-skills",
    validateRequest({
        params: careerJourneyIdParamsValidator,
    }),
    userSkillController.getUserSkills
);

router.patch(
    "/career-journeys/:careerJourneyId/user-skills",
    validateRequest({
        params: careerJourneyIdParamsValidator,
        body: updateSelectedSkillsBodyValidator,
    }),
    userSkillController.updateSelectedSkills
);

export default router;
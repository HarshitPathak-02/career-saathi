import { Router } from "express";

import { resumeController } from "./resume.controller.js";

import { authenticate } from "../../core/middleware/authenticate.middleware.js";
import { validateRequest } from "../../core/middleware/validate.middleware.js";


import {
    createResumeSchema,
    resumeIdParamSchema,
    careerJourneyResumeParamSchema,
} from "./resume.validator.js";
import { resumeUpload } from "./resume.upload.js";

const router = Router();

router.post(
    "/",
    authenticate,
    resumeUpload.single("resume"),
    validateRequest({body:createResumeSchema}),
    resumeController.uploadResume
);

router.get(
    "/",
    authenticate,
    resumeController.getUserResumes
);

router.get(
    "/:resumeId",
    authenticate,
    validateRequest({params:resumeIdParamSchema}),
    resumeController.getResumeById
);

router.get(
    "/career-journey/:careerJourneyId",
    authenticate,
    validateRequest({params:careerJourneyResumeParamSchema}),
    resumeController.getResumeByCareerJourney
);

router.delete(
    "/:resumeId",
    authenticate,
    validateRequest({params:resumeIdParamSchema}),
    resumeController.deleteResume
);

export default router;
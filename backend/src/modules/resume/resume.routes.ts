import { Router } from "express";

import { resumeController } from "./resume.controller.js";

import { authenticate } from "../../core/middleware/authenticate.middleware.js";
import { validateRequest } from "../../core/middleware/validate.middleware.js";

import {
    resumeAnalysisLimiter,
    resumeUploadLimiter,
} from "../../core/middleware/rate-limit.middleware.js";


import {
    createResumeSchema,
    resumeIdParamSchema,
    careerJourneyResumeParamSchema,
    confirmResumeSkillsSchema,
} from "./resume.validator.js";
import { resumeUpload } from "./resume.upload.js";

const router = Router();

router.post(
    "/",
    authenticate,
    resumeUploadLimiter,
    resumeUpload.single("resume"),
    validateRequest({body:createResumeSchema}),
    resumeController.uploadResume
);

router.post(
    "/:resumeId/analyze",
    authenticate,
    resumeAnalysisLimiter,
    validateRequest({params:resumeIdParamSchema}),
    resumeController.analyzeResume
);

router.post(
    "/:resumeId/skills/confirm",
    authenticate,
    validateRequest({
        params: resumeIdParamSchema,
        body: confirmResumeSkillsSchema,
    }),
    resumeController.confirmSkills
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
import { Router } from "express";

import { authenticate } from "../../core/middleware/authenticate.middleware.js";
import { validateRequest } from "../../core/middleware/validate.middleware.js";
import {
  attemptIdParamSchema,
  challengeSlugParamSchema,
  evaluateChallengeSchema,
  getChallengeQuerySchema,
  getPracticeHubQuerySchema,
  optInJourneySchema,
} from "./practice.validation.js";
import { practiceController } from "./practice.controller.js";

const practiceRouter = Router();

practiceRouter.use(authenticate);

practiceRouter.get(
  "/hub",
  validateRequest({
    query: getPracticeHubQuerySchema,
  }),
  practiceController.getPracticeHub
);

practiceRouter.get(
  "/challenges/:slug",
  validateRequest({
    params: challengeSlugParamSchema,
    query: getChallengeQuerySchema,
  }),
  practiceController.getChallenge
);

practiceRouter.post(
  "/challenges/:slug/evaluate",
  validateRequest({
    params: challengeSlugParamSchema,
    body: evaluateChallengeSchema,
  }),
  practiceController.evaluateChallenge
);

practiceRouter.post(
  "/attempts/:attemptId/opt-in",
  validateRequest({
    params: attemptIdParamSchema,
    body: optInJourneySchema,
  }),
  practiceController.optInAttempt
);

export default practiceRouter;

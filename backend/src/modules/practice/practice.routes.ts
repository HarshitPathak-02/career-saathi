import { Router } from "express";

import { authenticate } from "../../core/middleware/authenticate.middleware.js";
import { validateRequest } from "../../core/middleware/validate.middleware.js";
import {
  codingEvaluationLimiter,
  interviewAnswerLimiter,
  interviewSessionStartLimiter,
} from "../../core/middleware/rate-limit.middleware.js";
import {
  attemptIdParamSchema,
  challengeSlugParamSchema,
  evaluateChallengeSchema,
  getChallengeQuerySchema,
  getInterviewSessionQuerySchema,
  getPracticeHubQuerySchema,
  optInJourneySchema,
  sessionIdParamSchema,
  startInterviewSchema,
  submitInterviewAnswerSchema,
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
  codingEvaluationLimiter,
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

practiceRouter.post(
  "/interviews/start",
  interviewSessionStartLimiter,
  validateRequest({
    body: startInterviewSchema,
  }),
  practiceController.startInterview
);

practiceRouter.get(
  "/interviews/:sessionId",
  validateRequest({
    params: sessionIdParamSchema,
    query: getInterviewSessionQuerySchema,
  }),
  practiceController.getInterview
);

practiceRouter.post(
  "/interviews/:sessionId/answer",
  interviewAnswerLimiter,
  validateRequest({
    params: sessionIdParamSchema,
    body: submitInterviewAnswerSchema,
  }),
  practiceController.submitInterviewAnswer
);

practiceRouter.post(
  "/interviews/:sessionId/opt-in",
  validateRequest({
    params: sessionIdParamSchema,
    body: optInJourneySchema,
  }),
  practiceController.optInInterview
);

export default practiceRouter;

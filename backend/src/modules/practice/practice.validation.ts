import Joi from "joi";

const objectIdSchema = Joi.string()
  .hex()
  .length(24)
  .messages({
    "string.hex": "Invalid id format",
    "string.length": "Id must be 24 characters",
  });

export const getPracticeHubQuerySchema = Joi.object({
  careerJourneyId: objectIdSchema.required(),
});

export const challengeSlugParamSchema = Joi.object({
  slug: Joi.string().trim().min(2).max(120).required(),
});

export const getChallengeQuerySchema = Joi.object({
  careerJourneyId: objectIdSchema.required(),
});

export const attemptIdParamSchema = Joi.object({
  attemptId: objectIdSchema.required(),
});

export const evaluateChallengeSchema = Joi.object({
  careerJourneyId: objectIdSchema.required(),
  submittedCode: Joi.string().min(1).max(50000).required(),
  testResults: Joi.object({
    total: Joi.number().integer().min(0).required(),
    passed: Joi.number().integer().min(0).required(),
    failed: Joi.number().integer().min(0).required(),
    executionTimeMs: Joi.number().min(0).required(),
  }).required(),
  durationSeconds: Joi.number().min(0).max(86400).default(0),
  runCount: Joi.number().integer().min(1).max(1000).default(1),
});

export const optInJourneySchema = Joi.object({
  optIn: Joi.boolean().required(),
});

export const startInterviewSchema = Joi.object({
  careerJourneyId: objectIdSchema.required(),
  skillCatalogId: objectIdSchema.required(),
});

export const sessionIdParamSchema = Joi.object({
  sessionId: objectIdSchema.required(),
});

export const submitInterviewAnswerSchema = Joi.object({
  careerJourneyId: objectIdSchema.required(),
  candidateAnswer: Joi.string().trim().min(2).max(10000).required(),
});

export const getInterviewSessionQuerySchema = Joi.object({
  careerJourneyId: objectIdSchema.required(),
});

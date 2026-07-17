import Joi from "joi";
import { objectIdSchema } from "../../shared/validators/common-validator.js";

export const createResumeSchema = Joi.object({
    careerJourneyId: objectIdSchema.required(),
});

export const resumeIdParamSchema = Joi.object({
    resumeId: objectIdSchema.required(),
});
export const careerJourneyResumeParamSchema = Joi.object({
    careerJourneyId: objectIdSchema.required(),
});
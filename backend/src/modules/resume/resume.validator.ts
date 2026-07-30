import Joi from "joi";

const objectIdSchema = Joi.string()
    .trim()
    .pattern(/^[a-f\d]{24}$/i)
    .messages({
        "string.pattern.base":
            "Invalid ObjectId.",
    });


export const createResumeSchema = Joi.object({
    careerJourneyId: objectIdSchema.required(),
});

export const resumeIdParamSchema = Joi.object({
    resumeId: objectIdSchema.required(),
});
export const careerJourneyResumeParamSchema = Joi.object({
    careerJourneyId: objectIdSchema.required(),
});
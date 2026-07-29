import Joi from "joi";


const objectIdSchema = Joi.string()
    .trim()
    .pattern(/^[a-f\d]{24}$/i)
    .messages({
        "string.pattern.base":
            "Invalid ObjectId.",
    });


export const startInitialAssessmentSchema = Joi.object({
    careerJourneyId: objectIdSchema.required(),
});

export const startWeeklyAssessmentSchema = Joi.object({
    careerJourneyId: objectIdSchema.required(),
});

export const submittedSkillSchema = Joi.object({
    userSkillId: objectIdSchema.required(),

    obtainedMarks:
        Joi.number()
            .min(0)
            .max(
                Joi.ref("totalMarks")
            )
            .required(),

    totalMarks:
        Joi.number()
            .greater(0)
            .required(),

    remarks: Joi.string()
        .trim()
        .max(500)
        .allow("")
        .optional(),
});

export const submitAssessmentSchema = Joi.object({
    assessmentId: objectIdSchema.required(),

    skills: Joi.array()
        .items(submittedSkillSchema)
        .min(1)
        .required(),
});

export const assessmentIdParamSchema = Joi.object({
    assessmentId: objectIdSchema.required(),
});

export const careerJourneyIdParamSchema =
    Joi.object({
        careerJourneyId:
            objectIdSchema.required(),
    });
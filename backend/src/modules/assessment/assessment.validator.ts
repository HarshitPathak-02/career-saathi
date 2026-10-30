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

export const startResumeAssessmentSchema = Joi.object({
    careerJourneyId: objectIdSchema.required(),

    skillCatalogIds:
        Joi.array()
            .items(
                objectIdSchema.required()
            )
            .unique()
            .min(1)
            .max(50)
            .required(),
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

export const sectionIdParamSchema = Joi.object({
    sectionId: objectIdSchema.required(),
});

export const attemptIdParamSchema = Joi.object({
    attemptId: objectIdSchema.required(),
});

export const autosaveAnswerSchema = Joi.object({
    assessmentQuestionId:
        objectIdSchema.required(),

    selectedOptionKeys:
        Joi.array()
            .items(
                Joi.string()
                    .trim()
                    .min(1)
                    .max(20)
            )
            .unique()
            .max(8)
            .optional(),

    numericValue:
        Joi.number()
            .allow(null)
            .optional(),

    matchingPairs:
        Joi.array()
            .items(
                Joi.object({
                    leftKey:
                        Joi.string()
                            .trim()
                            .min(1)
                            .max(20)
                            .required(),

                    rightKey:
                        Joi.string()
                            .trim()
                            .min(1)
                            .max(20)
                            .required(),
                })
            )
            .unique(
                (a, b) =>
                    a.leftKey === b.leftKey &&
                    a.rightKey === b.rightKey
            )
            .max(10)
            .optional(),

    timeSpentSeconds:
        Joi.number()
            .integer()
            .min(0)
            .max(600)
            .optional(),
});

export const autosaveAnswersSchema = Joi.object({
    answers: Joi.array()
        .items(autosaveAnswerSchema)
        .min(1)
        .max(20)
        .required(),
});

export const submitAttemptAnswersSchema =
    Joi.object({
        answers: Joi.array()
            .items(autosaveAnswerSchema)
            .max(20)
            .optional(),
    });
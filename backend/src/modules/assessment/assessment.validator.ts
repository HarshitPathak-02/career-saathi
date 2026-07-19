import Joi from "joi";

import { objectIdSchema } from "../../shared/validators/common-validator.js";

import {
    AssessmentMethod,
} from "../skill-progress/skill-progress.enums.js";

/**
 * Start Initial Assessment
 */
export const startInitialAssessmentSchema = Joi.object({
    careerJourneyId: objectIdSchema.required(),
});

/**
 * Start Weekly Assessment
 */
export const startWeeklyAssessmentSchema = Joi.object({
    careerJourneyId: objectIdSchema.required(),
});

/**
 * Skill Submission
 */
export const submittedSkillSchema = Joi.object({
    userSkillId: objectIdSchema.required(),

    obtainedMarks: Joi.number()
        .min(0)
        .required(),

    totalMarks: Joi.number()
        .greater(0)
        .required(),

    assessmentMethod: Joi.string()
        .valid(...Object.values(AssessmentMethod))
        .required(),

    assessmentPlatform: Joi.string().optional(),

    assessmentName: Joi.string()
        .trim()
        .max(150).optional(),

    remarks: Joi.string()
        .trim()
        .max(500)
        .allow("")
        .optional(),
});

/**
 * Submit Assessment
 */
export const submitAssessmentSchema = Joi.object({
    assessmentId: objectIdSchema.required(),

    skills: Joi.array()
        .items(submittedSkillSchema)
        .min(1)
        .required(),
});

/**
 * Params
 */
export const assessmentIdParamSchema = Joi.object({
    assessmentId: objectIdSchema.required(),
});
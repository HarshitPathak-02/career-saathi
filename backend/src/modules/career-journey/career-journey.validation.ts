import Joi from "joi";

import { objectIdSchema } from "../../shared/validators/common-validator.js";

import {
    CareerJourneyStatus,
    PreferredLanguage,
    SkillSource,
} from "./career-journey.enums.js";

import {
    MAX_DAILY_STUDY_HOURS,
    MAX_TARGET_DURATION_MONTHS,
    MIN_DAILY_STUDY_HOURS,
    MIN_TARGET_DURATION_MONTHS,
} from "./career-journey.constants.js";

/**
 * Create Career Journey
 */
export const createCareerJourneySchema = Joi.object({
    domainId: objectIdSchema.required(),

    roleId: objectIdSchema.required(),

    targetCompany: Joi.string()
        .trim()
        .max(100)
        .optional(),

    targetDurationMonths: Joi.number()
        .integer()
        .min(MIN_TARGET_DURATION_MONTHS)
        .max(MAX_TARGET_DURATION_MONTHS)
        .required(),

    dailyStudyHours: Joi.number()
        .min(MIN_DAILY_STUDY_HOURS)
        .max(MAX_DAILY_STUDY_HOURS)
        .required(),

    preferredLanguage: Joi.string()
        .valid(...Object.values(PreferredLanguage))
        .default(PreferredLanguage.ENGLISH),

});

/**
 * Update Career Journey
 */
export const updateCareerJourneySchema = Joi.object({
    domainId: objectIdSchema,
    roleId: objectIdSchema,
    targetCompany: Joi.string().trim().max(100),
    targetDurationMonths: Joi.number()
        .integer()
        .min(MIN_TARGET_DURATION_MONTHS)
        .max(MAX_TARGET_DURATION_MONTHS),
    dailyStudyHours: Joi.number()
        .min(MIN_DAILY_STUDY_HOURS)
        .max(MAX_DAILY_STUDY_HOURS),
    preferredLanguage: Joi.string().valid(...Object.values(PreferredLanguage)),
}).min(1);

/**
 * Update Career Journey Status
 */
export const updateCareerJourneyStatusSchema = Joi.object({
    status: Joi.string()
        .valid(...Object.values(CareerJourneyStatus))
        .required(),
});

/**
 * Params
 */
export const careerJourneyIdParamSchema = Joi.object({
    careerJourneyId: objectIdSchema.required(),
});
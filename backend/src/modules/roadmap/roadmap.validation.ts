import Joi from "joi";

import {
    objectIdSchema,
} from "../../shared/validators/common-validator.js";


/*
 * Generate roadmap
 */
export const generateRoadmapSchema =
    Joi.object({
        careerJourneyId:
            objectIdSchema.required(),
    });


/*
 * Career journey param
 */
export const careerJourneyIdParamSchema =
    Joi.object({
        careerJourneyId:
            objectIdSchema.required(),
    });


/*
 * Roadmap param
 */
export const roadmapIdParamSchema =
    Joi.object({
        roadmapId:
            objectIdSchema.required(),
    });


/*
 * Next pending items query
 */
export const nextPendingItemsQuerySchema =
    Joi.object({
        limit:
            Joi.number()
                .integer()
                .min(1)
                .max(50)
                .optional(),
    });
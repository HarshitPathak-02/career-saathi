import Joi from "joi";


const objectIdSchema =
    Joi.string()
        .trim()
        .pattern(/^[0-9a-fA-F]{24}$/)
        .messages({
            "string.empty":
                "Id is required.",

            "string.pattern.base":
                "Invalid MongoDB ObjectId.",
        });

export const generateRoadmapSchema =
    Joi.object({
        careerJourneyId:
            objectIdSchema
                .required()
                .messages({
                    "any.required":
                        "Career journey id is required.",
                }),
    });

export const careerJourneyIdParamSchema =
    Joi.object({
        careerJourneyId:
            objectIdSchema
                .required()
                .messages({
                    "any.required":
                        "Career journey id is required.",
                }),
    });

export const roadmapIdParamSchema =
    Joi.object({
        roadmapId:
            objectIdSchema
                .required()
                .messages({
                    "any.required":
                        "Roadmap id is required.",
                }),
    });


export const nextPendingItemsQuerySchema =
    Joi.object({
        limit:
            Joi.number()
                .integer()
                .min(1)
                .max(50)
                .optional(),
    });
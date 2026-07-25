import Joi from "joi";

/*
|--------------------------------------------------------------------------
| Common Schemas
|--------------------------------------------------------------------------
*/

const objectIdSchema = Joi.string()
    .trim()
    .pattern(/^[0-9a-fA-F]{24}$/)
    .messages({
        "string.empty":
            "Id is required.",

        "string.pattern.base":
            "Invalid MongoDB ObjectId.",
    });

/*
|--------------------------------------------------------------------------
| Career Journey Id Param
|--------------------------------------------------------------------------
*/

export const missionCareerJourneyIdParamSchema =
    Joi.object({
        careerJourneyId:
            objectIdSchema
                .required()
                .messages({
                    "any.required":
                        "Career journey id is required.",
                }),
    });

/*
|--------------------------------------------------------------------------
| Mission Id Param
|--------------------------------------------------------------------------
*/

export const missionIdParamSchema =
    Joi.object({
        missionId:
            objectIdSchema
                .required()
                .messages({
                    "any.required":
                        "Mission id is required.",
                }),
    });

/*
|--------------------------------------------------------------------------
| Mission Number Param
|--------------------------------------------------------------------------
|
| Not currently required by the existing routes,
| but the service already supports fetching a
| mission by mission number.
|
*/

export const missionNumberParamSchema =
    Joi.object({
        careerJourneyId:
            objectIdSchema
                .required()
                .messages({
                    "any.required":
                        "Career journey id is required.",
                }),

        missionNumber:
            Joi.number()
                .integer()
                .min(1)
                .required()
                .messages({
                    "number.base":
                        "Mission number must be a number.",

                    "number.integer":
                        "Mission number must be an integer.",

                    "number.min":
                        "Mission number must be at least 1.",

                    "any.required":
                        "Mission number is required.",
                }),
    });
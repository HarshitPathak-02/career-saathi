import Joi from "joi";

/*
|--------------------------------------------------------------------------
| Common Schemas
|--------------------------------------------------------------------------
*/

const objectIdSchema =
    Joi.string()
        .trim()
        .pattern(
            /^[0-9a-fA-F]{24}$/
        )
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

/*
|--------------------------------------------------------------------------
| Weekly Report Id Param
|--------------------------------------------------------------------------
*/

export const weeklyReportIdParamSchema =
    Joi.object({

        reportId:
            objectIdSchema
                .required()
                .messages({
                    "any.required":
                        "Weekly report id is required.",
                }),

    });
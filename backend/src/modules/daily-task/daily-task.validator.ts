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
| Task Id Param
|--------------------------------------------------------------------------
*/

export const taskIdParamSchema =
    Joi.object({
        taskId:
            objectIdSchema
                .required()
                .messages({
                    "any.required":
                        "Task id is required.",
                }),
    });

/*
|--------------------------------------------------------------------------
| Mission Id Param
|--------------------------------------------------------------------------
*/

export const taskMissionIdParamSchema =
    Joi.object({
        missionId:
            objectIdSchema
                .required()
                .messages({
                    "any.required":
                        "Mission id is required.",
                }),
    });
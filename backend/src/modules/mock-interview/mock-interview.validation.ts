import Joi from "joi";

import {
    MockInterviewType,
} from "./mock-interview.enums.js";


/*
|--------------------------------------------------------------------------
| Mongo ObjectId
|--------------------------------------------------------------------------
*/

const objectId =
    Joi.string()
        .hex()
        .length(24);


/*
|--------------------------------------------------------------------------
| Create Mock Interview
|--------------------------------------------------------------------------
*/

export const createMockInterviewSchema =
    Joi.object({

        careerJourneyId:
            objectId
                .required()
                .messages({
                    "any.required":
                        "Career journey id is required.",

                    "string.hex":
                        "Career journey id must be a valid ObjectId.",

                    "string.length":
                        "Career journey id must be a valid ObjectId.",
                }),

        platform:
            Joi.string()
                .trim()
                .min(1)
                .max(100)
                .required(),

        interviewType:
            Joi.string()
                .valid(
                    ...Object.values(
                        MockInterviewType
                    )
                )
                .required(),

        overallScore:
            Joi.number()
                .min(0)
                .max(100)
                .required(),

        technicalScore:
            Joi.number()
                .min(0)
                .max(100)
                .required(),

        problemSolvingScore:
            Joi.number()
                .min(0)
                .max(100)
                .required(),

        communicationScore:
            Joi.number()
                .min(0)
                .max(100)
                .required(),

        feedback:
            Joi.string()
                .trim()
                .max(2000)
                .allow("")
                .optional(),

        interviewedAt:
            Joi.date()
                .iso()
                .max("now")
                .required(),
    });


/*
|--------------------------------------------------------------------------
| Career Journey Id Param
|--------------------------------------------------------------------------
*/

export const mockInterviewHistoryParamSchema =
    Joi.object({

        careerJourneyId:
            objectId
                .required()
                .messages({
                    "any.required":
                        "Career journey id is required.",

                    "string.hex":
                        "Career journey id must be a valid ObjectId.",

                    "string.length":
                        "Career journey id must be a valid ObjectId.",
                }),
    });


/*
|--------------------------------------------------------------------------
| Mock Interview Id Param
|--------------------------------------------------------------------------
*/

export const mockInterviewIdParamSchema =
    Joi.object({

        mockInterviewId:
            objectId
                .required()
                .messages({
                    "any.required":
                        "Mock interview id is required.",

                    "string.hex":
                        "Mock interview id must be a valid ObjectId.",

                    "string.length":
                        "Mock interview id must be a valid ObjectId.",
                }),
    });
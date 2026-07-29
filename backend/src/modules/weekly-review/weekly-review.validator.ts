import Joi from "joi";

import {
    DifficultyType,
    MotivationLevel,
    OverallWeek,
    ReflectionReason,
} from "../weekly-reflection/weekly-reflection.enums.js";

import {
    WeeklyReflectionConstants,
} from "../weekly-reflection/weekly-reflection.constants.js";

/*
|--------------------------------------------------------------------------
| Assessment Skill
|--------------------------------------------------------------------------
*/

const assessmentSkillSchema =
    Joi.object({

        userSkillId:
            Joi.string()
                .hex()
                .length(24)
                .required(),

        obtainedMarks:
            Joi.number()
                .min(0)
                .required(),

        totalMarks:
            Joi.number()
                .greater(0)
                .required(),

    });

/*
|--------------------------------------------------------------------------
| Assessment
|--------------------------------------------------------------------------
*/

const assessmentSchema =
    Joi.object({

        assessmentId:
            Joi.string()
                .hex()
                .length(24)
                .required(),

        skills:
            Joi.array()
                .items(
                    assessmentSkillSchema
                )
                .min(1)
                .required(),

    });

/*
|--------------------------------------------------------------------------
| Learning Reflection
|--------------------------------------------------------------------------
*/

const learningReflectionSchema =
    Joi.object({

        completedAllTasks:
            Joi.boolean()
                .required(),

        reason:
            Joi.string()
                .valid(
                    ...Object.values(
                        ReflectionReason
                    )
                )
                .optional(),

        difficultyType:
            Joi.string()
                .valid(
                    ...Object.values(
                        DifficultyType
                    )
                )
                .optional(),

        confidenceRating:
            Joi.number()
                .integer()
                .min(
                    WeeklyReflectionConstants
                        .CONFIDENCE_RATING
                        .MIN
                )
                .max(
                    WeeklyReflectionConstants
                        .CONFIDENCE_RATING
                        .MAX
                )
                .required(),

    });

/*
|--------------------------------------------------------------------------
| Mentor Check-In
|--------------------------------------------------------------------------
*/

const mentorCheckInSchema =
    Joi.object({

        overallWeek:
            Joi.string()
                .valid(
                    ...Object.values(
                        OverallWeek
                    )
                )
                .required(),

        motivationLevel:
            Joi.string()
                .valid(
                    ...Object.values(
                        MotivationLevel
                    )
                )
                .required(),

        externalFactors:
            Joi.string()
                .trim()
                .max(1000)
                .allow("")
                .optional(),

        careerConcern:
            Joi.string()
                .trim()
                .max(1000)
                .allow("")
                .optional(),

        helpNeeded:
            Joi.string()
                .trim()
                .max(1000)
                .allow("")
                .optional(),

    });

/*
|--------------------------------------------------------------------------
| Reflection
|--------------------------------------------------------------------------
*/

const reflectionSchema =
    Joi.object({

        learningReflection:
            learningReflectionSchema
                .required(),

        mentorCheckIn:
            mentorCheckInSchema
                .required(),

        additionalComments:
            Joi.string()
                .trim()
                .max(2000)
                .allow("")
                .optional(),

    });

/*
|--------------------------------------------------------------------------
| Submit Weekly Review
|--------------------------------------------------------------------------
*/

export const submitWeeklyReviewSchema =
    Joi.object({

        assessment:
            assessmentSchema
                .required(),

        reflection:
            reflectionSchema
                .required(),

    });
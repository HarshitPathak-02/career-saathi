import {
    HydratedDocument,
    InferSchemaType,
    Schema,
    model,
} from "mongoose";

import {
    CAREER_JOURNEY_MODEL,
} from "../career-journey/career-journey.constants.js";

import {
    ReadinessStatus,
    ReadinessWeakArea,
    ReadinessRecommendation,
} from "./readiness.enums.js";
import { READINESS_EVALUATION_COLLECTION, READINESS_EVALUATION_MODEL } from "./readiness.constants.js";
import { ROADMAP_MODEL } from "../roadmap/roadmap.constants.js";



/*
|--------------------------------------------------------------------------
| Readiness Breakdown Schema
|--------------------------------------------------------------------------
*/

const ReadinessBreakdownSchema =
    new Schema(
        {
            skillScore: {
                type: Number,
                required: true,
                min: 0,
                max: 100,
            },

            technicalInterviewScore: {
                type: Number,
                required: true,
                min: 0,
                max: 100,
            },

            problemSolvingScore: {
                type: Number,
                required: true,
                min: 0,
                max: 100,
            },

            communicationScore: {
                type: Number,
                required: true,
                min: 0,
                max: 100,
            },
        },
        {
            _id: false,
        }
    );


/*
|--------------------------------------------------------------------------
| Readiness Evaluation Schema
|--------------------------------------------------------------------------
*/

const ReadinessEvaluationSchema =
    new Schema(
        {
            careerJourneyId: {
                type:
                    Schema.Types.ObjectId,

                ref:
                    CAREER_JOURNEY_MODEL,

                required:
                    true,

                index:
                    true,
            },

            roadmapId: {
                type: Schema.Types.ObjectId,
                ref: ROADMAP_MODEL,
                required: true,
                index:
                    true,
            },


            /*
            |--------------------------------------------------------------------------
            | Evaluation Number
            |--------------------------------------------------------------------------
            |
            | A career journey can go through readiness multiple times:
            |
            | Initial Roadmap
            |      ↓
            | Readiness #1
            |      ↓
            | Adaptive Roadmap
            |      ↓
            | Readiness #2
            |
            */

            evaluationNumber: {
                type: Number,

                required: true,

                min: 1,
            },

            evidenceKey: {
                type: String,

                required: true,

                trim: true,
            },


            /*
            |--------------------------------------------------------------------------
            | Result
            |--------------------------------------------------------------------------
            */

            status: {
                type: String,

                enum:
                    Object.values(
                        ReadinessStatus
                    ),

                required:
                    true,
            },

            readinessScore: {
                type: Number,

                min: 0,

                max: 100,

                default:
                    null,
            },

            readyForInterviews: {
                type: Boolean,

                required:
                    true,
            },


            /*
            |--------------------------------------------------------------------------
            | Evidence
            |--------------------------------------------------------------------------
            */

            mockInterviewsConsidered: {
                type: Number,

                required:
                    true,

                min:
                    0,
            },

            mockInterviewIds: {
                type: [
                    Schema.Types.ObjectId
                ],

                default:
                    [],
            },


            /*
            |--------------------------------------------------------------------------
            | Score Breakdown
            |--------------------------------------------------------------------------
            */

            breakdown: {
                type:
                    ReadinessBreakdownSchema,

                default:
                    null,
            },


            /*
            |--------------------------------------------------------------------------
            | Weak Areas
            |--------------------------------------------------------------------------
            */

            weakAreas: {
                type: [
                    {
                        type:
                            String,

                        enum:
                            Object.values(
                                ReadinessWeakArea
                            ),
                    }
                ],

                default:
                    [],
            },


            /*
            |--------------------------------------------------------------------------
            | Recommendation
            |--------------------------------------------------------------------------
            */

            recommendation: {
                type: String,

                enum:
                    Object.values(
                        ReadinessRecommendation
                    ),

                required:
                    true,
            },


            /*
            |--------------------------------------------------------------------------
            | Evaluation Time
            |--------------------------------------------------------------------------
            */

            evaluatedAt: {
                type: Date,

                required:
                    true,

                default:
                    Date.now,
            },
        },
        {
            timestamps:
                true,

            versionKey:
                false,

            strict:
                "throw",

            collection:
                READINESS_EVALUATION_COLLECTION,
        }
    );


/*
|--------------------------------------------------------------------------
| Indexes
|--------------------------------------------------------------------------
*/

/*
 * Every readiness evaluation for a journey
 * receives a unique sequence number.
 */

ReadinessEvaluationSchema.index(
    {
        careerJourneyId: 1,
        evaluationNumber: 1,
    },
    {
        unique: true,
    }
);


/*
 * Used for fetching latest evaluation.
 */

ReadinessEvaluationSchema.index({
    careerJourneyId: 1,
    evaluatedAt: -1,
});


/*
 * Useful for finding the final READY evaluation.
 */

ReadinessEvaluationSchema.index({
    careerJourneyId: 1,
    status: 1,
    evaluatedAt: -1,
});

ReadinessEvaluationSchema.index(
    {
        careerJourneyId: 1,
        roadmapId: 1,
        evidenceKey: 1,
    },
    {
        unique: true,
    }
);

/*
|--------------------------------------------------------------------------
| Types
|--------------------------------------------------------------------------
*/

export type ReadinessEvaluationRecord =
    InferSchemaType<
        typeof ReadinessEvaluationSchema
    >;


export type ReadinessEvaluationDocument =
    HydratedDocument<
        ReadinessEvaluationRecord
    >;


/*
|--------------------------------------------------------------------------
| Model
|--------------------------------------------------------------------------
*/

export const ReadinessEvaluationModel =
    model<ReadinessEvaluationRecord>(
        READINESS_EVALUATION_MODEL,
        ReadinessEvaluationSchema
    );
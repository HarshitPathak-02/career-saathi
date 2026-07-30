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
    SKILL_CATALOG_MODEL,
} from "../../master-data/skill-catalog/skill-catalog.constants.js";

import {
    MonthlyReportStatus,
} from "./monthly-report.enums.js";

import {
    MONTHLY_REPORT_COLLECTION,
    MONTHLY_REPORT_MODEL,
} from "./monthly-report.constants.js";


/*
|--------------------------------------------------------------------------
| Mission Metrics
|--------------------------------------------------------------------------
*/

const MissionMetricsSchema =
    new Schema(
        {
            generated: {
                type: Number,
                required: true,
                min: 0,
            },

            completed: {
                type: Number,
                required: true,
                min: 0,
            },

            active: {
                type: Number,
                required: true,
                min: 0,
            },
        },
        {
            _id: false,
            strict: "throw",
        }
    );


/*
|--------------------------------------------------------------------------
| Task Metrics
|--------------------------------------------------------------------------
*/

const TaskMetricsSchema =
    new Schema(
        {
            total: {
                type: Number,
                required: true,
                min: 0,
            },

            completed: {
                type: Number,
                required: true,
                min: 0,
            },

            pending: {
                type: Number,
                required: true,
                min: 0,
            },

            completionRate: {
                type: Number,
                required: true,
                min: 0,
                max: 100,
            },
        },
        {
            _id: false,
            strict: "throw",
        }
    );


/*
|--------------------------------------------------------------------------
| Assessment Score Trend
|--------------------------------------------------------------------------
*/

const AssessmentScoreTrendSchema =
    new Schema(
        {
            weekNumber: {
                type: Number,
                required: true,
                min: 1,
            },

            score: {
                type: Number,
                required: true,
                min: 0,
                max: 100,
            },
        },
        {
            _id: false,
            strict: "throw",
        }
    );


/*
|--------------------------------------------------------------------------
| Assessment Metrics
|--------------------------------------------------------------------------
*/

const AssessmentMetricsSchema =
    new Schema(
        {
            totalAssessments: {
                type: Number,
                required: true,
                min: 0,
            },

            averageScore: {
                type: Number,
                default: null,
                min: 0,
                max: 100,
            },

            scoreTrend: {
                type: [
                    AssessmentScoreTrendSchema,
                ],

                default: [],
            },
        },
        {
            _id: false,
            strict: "throw",
        }
    );


/*
|--------------------------------------------------------------------------
| Skill Progress
|--------------------------------------------------------------------------
*/

const SkillProgressSchema =
    new Schema(
        {
            skillCatalogId: {
                type:
                    Schema.Types.ObjectId,

                ref:
                    SKILL_CATALOG_MODEL,

                required:
                    true,
            },

            skillName: {
                type: String,
                required: true,
                trim: true,
            },

            assessmentsTaken: {
                type: Number,
                required: true,
                min: 0,
            },

            averageScore: {
                type: Number,
                required: true,
                min: 0,
                max: 100,
            },

            startScore: {
                type: Number,
                required: true,
                min: 0,
                max: 100,
            },

            endScore: {
                type: Number,
                required: true,
                min: 0,
                max: 100,
            },

            improvement: {
                type: Number,
                required: true,
            },

            trend: {
                type: String,

                enum: [
                    "improving",
                    "declining",
                    "stable",
                ],

                required: true,
            },
        },
        {
            _id: false,
            strict: "throw",
        }
    );


/*
|--------------------------------------------------------------------------
| Occurrence
|--------------------------------------------------------------------------
*/

const ReasonOccurrenceSchema =
    new Schema(
        {
            reason: {
                type: String,
                required: true,
                trim: true,
            },

            occurrences: {
                type: Number,
                required: true,
                min: 0,
            },
        },
        {
            _id: false,
            strict: "throw",
        }
    );


const DifficultyOccurrenceSchema =
    new Schema(
        {
            difficultyType: {
                type: String,
                required: true,
                trim: true,
            },

            occurrences: {
                type: Number,
                required: true,
                min: 0,
            },
        },
        {
            _id: false,
            strict: "throw",
        }
    );


const MotivationOccurrenceSchema =
    new Schema(
        {
            motivationLevel: {
                type: String,
                required: true,
                trim: true,
            },

            occurrences: {
                type: Number,
                required: true,
                min: 0,
            },
        },
        {
            _id: false,
            strict: "throw",
        }
    );


/*
|--------------------------------------------------------------------------
| Reflection Metrics
|--------------------------------------------------------------------------
*/

const ReflectionMetricsSchema =
    new Schema(
        {
            reflectionsConsidered: {
                type: Number,
                required: true,
                min: 0,
            },

            completedAllTasksWeeks: {
                type: Number,
                required: true,
                min: 0,
            },

            averageConfidenceRating: {
                type: Number,
                required: true,
                min: 0,
                max: 5,
            },

            reasons: {
                type: [
                    ReasonOccurrenceSchema,
                ],

                default: [],
            },

            difficultyDistribution: {
                type: [
                    DifficultyOccurrenceSchema,
                ],

                default: [],
            },

            motivationDistribution: {
                type: [
                    MotivationOccurrenceSchema,
                ],

                default: [],
            },
        },
        {
            _id: false,
            strict: "throw",
        }
    );


/*
|--------------------------------------------------------------------------
| Roadmap Progress
|--------------------------------------------------------------------------
*/

const RoadmapProgressSchema =
    new Schema(
        {
            completedItems: {
                type: Number,
                required: true,
                min: 0,
            },

            totalItems: {
                type: Number,
                required: true,
                min: 0,
            },

            completionRate: {
                type: Number,
                required: true,
                min: 0,
                max: 100,
            },
        },
        {
            _id: false,
            strict: "throw",
        }
    );


/*
|--------------------------------------------------------------------------
| Timeline
|--------------------------------------------------------------------------
*/

const TimelineSchema =
    new Schema(
        {
            expectedWeeks: {
                type: Number,
                required: true,
                min: 0,
            },

            estimatedDelayDays: {
                type: Number,
                required: true,
                min: 0,
            },

            projectedWeeks: {
                type: Number,
                required: true,
                min: 0,
            },
        },
        {
            _id: false,
            strict: "throw",
        }
    );


/*
|--------------------------------------------------------------------------
| AI Insights
|--------------------------------------------------------------------------
*/

const InsightsSchema =
    new Schema(
        {
            summary: {
                type: String,
                required: true,
                trim: true,
            },

            strengths: [
                {
                    type: String,
                    trim: true,
                },
            ],

            concerns: [
                {
                    type: String,
                    trim: true,
                },
            ],

            recommendations: [
                {
                    type: String,
                    trim: true,
                },
            ],
        },
        {
            _id: false,
            strict: "throw",
        }
    );


/*
|--------------------------------------------------------------------------
| Monthly Report
|--------------------------------------------------------------------------
*/

const MonthlyReportSchema =
    new Schema(
        {
            careerJourneyId: {
                type:
                    Schema.Types.ObjectId,

                ref:
                    CAREER_JOURNEY_MODEL,

                required:
                    true,
            },

            reportNumber: {
                type: Number,
                required: true,
                min: 1,
            },

            periodStart: {
                type: Date,
                required: true,
            },

            periodEnd: {
                type: Date,
                required: true,
            },


            /*
             * Timeline / Consistency
             */

            expectedDays: {
                type: Number,
                required: true,
                min: 1,
            },

            missionCoveredDays: {
                type: Number,
                required: true,
                min: 0,
            },

            completedTaskDays: {
                type: Number,
                required: true,
                min: 0,
            },

            missedTaskDays: {
                type: Number,
                required: true,
                min: 0,
            },

            scheduleGapDays: {
                type: Number,
                required: true,
                min: 0,
            },

            consistencyRate: {
                type: Number,
                required: true,
                min: 0,
                max: 100,
            },


            /*
             * Metrics
             */

            missionMetrics: {
                type:
                    MissionMetricsSchema,

                required:
                    true,
            },

            taskMetrics: {
                type:
                    TaskMetricsSchema,

                required:
                    true,
            },

            assessmentMetrics: {
                type:
                    AssessmentMetricsSchema,

                required:
                    true,
            },

            skillProgress: {
                type: [
                    SkillProgressSchema,
                ],

                default: [],
            },

            reflectionMetrics: {
                type:
                    ReflectionMetricsSchema,

                required:
                    true,
            },

            roadmapProgress: {
                type:
                    RoadmapProgressSchema,

                required:
                    true,
            },

            timeline: {
                type:
                    TimelineSchema,

                required:
                    true,
            },


            /*
             * AI Interpretation
             */

            insights: {
                type:
                    InsightsSchema,

                required:
                    true,
            },


            /*
             * Report State
             */

            status: {
                type: String,

                enum:
                    Object.values(
                        MonthlyReportStatus
                    ),

                required: true,
            },

            generatedAt: {
                type: Date,
                default: null,
            },
        },
        {
            timestamps: true,

            versionKey: false,

            strict: "throw",

            collection:
                MONTHLY_REPORT_COLLECTION,
        }
    );


/*
|--------------------------------------------------------------------------
| Indexes
|--------------------------------------------------------------------------
*/

MonthlyReportSchema.index(
    {
        careerJourneyId: 1,
        reportNumber: 1,
    },
    {
        unique: true,
    }
);


MonthlyReportSchema.index({
    careerJourneyId: 1,
    generatedAt: -1,
});


MonthlyReportSchema.index({
    status: 1,
});


export type MonthlyReport =
    InferSchemaType<
        typeof MonthlyReportSchema
    >;


export type MonthlyReportDocument =
    HydratedDocument<
        MonthlyReport
    >;


export const MonthlyReportModel =
    model<MonthlyReport>(
        MONTHLY_REPORT_MODEL,
        MonthlyReportSchema
    );
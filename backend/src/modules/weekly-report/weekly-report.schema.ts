import {
    HydratedDocument,
    InferSchemaType,
    Schema,
    model,
} from "mongoose";

import {
    WEEKLY_REPORT_COLLECTION,
    WEEKLY_REPORT_CONSTANTS,
    WEEKLY_REPORT_MODEL,
} from "./weekly-report.constants.js";

import {
    CAREER_JOURNEY_MODEL,
} from "../career-journey/career-journey.constants.js";

import {
    MISSION_MODEL,
} from "../mission/mission.enums.js";

import {
    ASSESSMENT_MODEL,
} from "../assessment/assessment.constants.js";

import {
    WeeklyReflectionConstants,
} from "../weekly-reflection/weekly-reflection.constants.js";

import {
    WeeklyReportStatus,
} from "./weekly-report.enums.js";

const WeeklySummarySchema = new Schema(
    {
        summary: {
            type: String,
            required: true,
            trim: true,
        },

        achievements: [{
            type: String,
            trim: true,
        }],

        improvements: [{
            type: String,
            trim: true,
        }],
    },
    {
        _id: false,
        strict: "throw",
    }
);

const WeeklyReportSchema = new Schema(
    {
        careerJourneyId: {
            type: Schema.Types.ObjectId,
            ref: CAREER_JOURNEY_MODEL,
            required: true,
        },

        missionId: {
            type: Schema.Types.ObjectId,
            ref: MISSION_MODEL,
            required: true,
        },

        assessmentId: {
            type: Schema.Types.ObjectId,
            ref: ASSESSMENT_MODEL,
            required: true,
        },

        reflectionId: {
            type: Schema.Types.ObjectId,
            ref: WeeklyReflectionConstants.WEEKLY_REFLECTION_MODEL,
            required: true,
        },

        status: {
            type: String,
            enum: Object.values(
                WeeklyReportStatus
            ),
            default:
                WeeklyReportStatus.COMPLETED,
        },

        promptVersion: {
            type: Number,
            required: true,
            default: WEEKLY_REPORT_CONSTANTS.DEFAULT_PROMPT_VERSION,
            min: 1,
        },

        summary: {
            type: WeeklySummarySchema,
            required: true,
        },

        mentorFeedback: {
            advice: {
                type: String,
                required: true,
                trim: true,
            },

            motivationMessage: {
                type: String,
                required: true,
                trim: true,
            },
        },

        recommendation: {

            weakSkills: [{
                type: String,
                trim: true,
            }],

            revisionTopics: [{
                type: String,
                trim: true,
            }],

            recommendedDifficulty: {
                type: String,
                required: true,
            },

            recommendedStudyHours: {
                type: Number,
                required: true,
                min: 1,
            },

            prioritizeRevision: {
                type: Boolean,
                required: true,
            },

            skipCompletedTopics: {
                type: Boolean,
                required: true,
            },

        },

        generatedAt: {
            type: Date,
            default: Date.now,
        },
    },
    {
        timestamps: true,
        versionKey: false,
        strict: "throw",
        collection:
            WEEKLY_REPORT_COLLECTION,
    }
);

WeeklyReportSchema.index(
    {
        reflectionId: 1,
    },
    {
        unique: true,
    }
);

WeeklyReportSchema.index({
    missionId: 1
});

WeeklyReportSchema.index({
    status: 1,
});

export type WeeklyReport =
    InferSchemaType<
        typeof WeeklyReportSchema
    >;

export type WeeklyReportDocument =
    HydratedDocument<WeeklyReport>;

export const WeeklyReportModel =
    model<WeeklyReport>(
        WEEKLY_REPORT_MODEL,
        WeeklyReportSchema
    );
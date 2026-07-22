import mongoose, { HydratedDocument, InferSchemaType } from "mongoose";

import {
    AssessmentStatus,
    AssessmentType,
} from "./assessment.enums.js";

const AssessmentSchema = new mongoose.Schema(
    {
        careerJourneyId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "CareerJourney",
            required: true,
        },

        type: {
            type: String,
            enum: Object.values(AssessmentType),
            required: true,
        },

        weekNumber: {
            type: Number,
            required: true,
            min: 0,
        },

        title: {
            type: String,
            required: true,
            trim: true,
        },

        description: {
            type: String,
            trim: true,
        },

        status: {
            type: String,
            enum: Object.values(AssessmentStatus),
            default: AssessmentStatus.PENDING,
        },

        completedAt: {
            type: Date,
            default: null,
        },

        isDeleted: {
            type: Boolean,
            default: false,
        },

        deletedAt: {
            type: Date,
            default: null,
        },
    },
    {
        timestamps: true,
    }
);

AssessmentSchema.index({
    careerJourneyId: 1,
});

AssessmentSchema.index({
    careerJourneyId: 1,
    weekNumber: 1,
});

AssessmentSchema.index(
    {
        careerJourneyId: 1,
        type: 1,
        weekNumber: 1,
    },
    {
        unique: true,
        partialFilterExpression: {
            isDeleted: false,
        },
    }
);

export type Assessment =
    InferSchemaType<typeof AssessmentSchema>;

export type AssessmentDocument =
    HydratedDocument<Assessment>;

export const AssessmentModel = mongoose.model(
    "Assessment",
    AssessmentSchema
);
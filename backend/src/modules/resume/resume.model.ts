import {
    Schema,
    model,
} from "mongoose";

import type {
    HydratedDocument,
    InferSchemaType,
} from "mongoose";

import { ResumeStatus } from "./resume.enums.js";

const ResumeSkillSchema = new Schema(
    {
        skillCatalogId: {
            type: Schema.Types.ObjectId,
            ref: "SkillCatalog",
            default: null,
        },

        name: {
            type: String,
            required: true,
            trim: true,
        },

        slug: {
            type: String,
            default: null,
            trim: true,
        },

        evidence: {
            type: String,
            required: true,
            trim: true,
        },

        confidence: {
            type: Number,
            required: true,
            min: 0,
            max: 1,
        },

        matched: {
            type: Boolean,
            required: true,
        },
    },
    {
        _id: false,
        versionKey: false,
    }
);

const ResumeAnalysisSchema = new Schema(
    {
        skills: {
            type: [ResumeSkillSchema],
            default: [],
        },

        provider: {
            type: String,
            required: true,
            trim: true,
        },

        model: {
            type: String,
            required: true,
            trim: true,
        },

        analyzedAt: {
            type: Date,
            required: true,
        },

        textLength: {
            type: Number,
            required: true,
            min: 0,
        },
    },
    {
        _id: false,
        versionKey: false,
    }
);

const ResumeConfirmationSchema = new Schema(
    {
        skillCatalogIds: {
            type: [
                {
                    type: Schema.Types.ObjectId,
                    ref: "SkillCatalog",
                },
            ],
            default: [],
        },

        confirmedAt: {
            type: Date,
            required: true,
        },
    },
    {
        _id: false,
        versionKey: false,
    }
);

const ResumeSchema = new Schema(
    {
        userId: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: true,
            index: true,
        },

        careerJourneyId: {
            type: Schema.Types.ObjectId,
            ref: "CareerJourney",
            required: true,
            index: true,
        },

        originalFileName: {
            type: String,
            required: true,
            trim: true,
        },

        cloudinaryPublicId: {
            type: String,
            required: true,
            unique: true,
        },

        cloudinarySecureUrl: {
            type: String,
            required: true,
        },

        mimeType: {
            type: String,
            required: true,
        },

        fileSize: {
            type: Number,
            required: true,
        },

        extractedText: {
            type: String,
            default: "",
            select: false,
        },

        extractedTextLength: {
            type: Number,
            default: 0,
        },

        pageCount: {
            type: Number,
            default: null,
        },

        status: {
            type: String,
            enum: Object.values(ResumeStatus),
            default: ResumeStatus.UPLOADED,
            required: true,
        },

        analysis: {
            type: ResumeAnalysisSchema,
            default: null,
        },

        analysisError: {
            type: String,
            default: null,
        },

        confirmation: {
            type: ResumeConfirmationSchema,
            default: null,
        },

        uploadedAt: {
            type: Date,
            default: Date.now,
            required: true,
        },

        isDeleted: {
            type: Boolean,
            default: false,
            index: true,
        },

        deletedAt: {
            type: Date,
            default: null,
        },
    },
    {
        timestamps: true,
        versionKey: false,
    }
);

ResumeSchema.index({
    userId: 1,
    careerJourneyId: 1,
});

ResumeSchema.index({
    userId: 1,
    isDeleted: 1,
});

export type Resume = InferSchemaType<
    typeof ResumeSchema
>;

export type ResumeDocument =
    HydratedDocument<Resume>;

export const ResumeModel =
    model<Resume>("Resume", ResumeSchema);
import { Schema, model } from "mongoose";

import { ResumeStatus } from "./resume.enums.js";

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

        status: {
            type: String,
            enum: Object.values(ResumeStatus),
            default: ResumeStatus.UPLOADED,
            required: true,
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

export const ResumeModel = model("Resume", ResumeSchema);
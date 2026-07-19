import mongoose, {
    InferSchemaType,
} from "mongoose";

import {
    AssessmentMethod,
    SkillLevel,
} from "./skill-progress.enums.js";

const SkillProgressSchema =
    new mongoose.Schema(
        {

            careerJourneyId: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "CareerJourney",
                required: true,
            },

            assessmentId: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Assessment",
                required: true,
            },

            userSkillId: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "UserSkill",
                required: true,
            },

            obtainedMarks: {
                type: Number,
                required: true,
                min: 0,
            },

            totalMarks: {
                type: Number,
                required: true,
                min: 1,
            },

            percentage: {
                type: Number,
                required: true,
                min: 0,
                max: 100,
            },

            improvementPercentage: {
                type: Number,
                default: null,
            },

            assessmentMethod: {
                type: String,
                enum: Object.values(
                    AssessmentMethod
                ),
                required: true,
            },

            assessmentPlatform: {
                type: String,
                trim: true,
            },

            assessmentName: {
                type: String,
                trim: true,
            },

            remarks: {
                type: String,
                trim: true,
            },

        },
        {
            timestamps: true,
        }
    );

SkillProgressSchema.index({
    assessmentId: 1,
});

SkillProgressSchema.index({
    userSkillId: 1,
});

SkillProgressSchema.index({
    careerJourneyId: 1,
});

SkillProgressSchema.index({
    userSkillId: 1,
    createdAt: -1,
});

export type SkillProgress =
    InferSchemaType<typeof SkillProgressSchema>;

export type SkillProgressDocument =
    mongoose.HydratedDocument<SkillProgress>;

export const SkillProgressModel =
    mongoose.model(
        "SkillProgress",
        SkillProgressSchema
    );
import {
    HydratedDocument,
    InferSchemaType,
    Schema,
    Types,
    model,
} from "mongoose";

import {
    AssessmentMethod,
} from "./index.js";

const SkillProgressSchema = new Schema(
    {
        careerJourneyId: {
            type: Types.ObjectId,
            ref: "CareerJourney",
            required: true,
            index: true,
        },

        assessmentId: {
            type: Types.ObjectId,
            ref: "Assessment",
            required: true,
            index: true,
        },

        userSkillId: {
            type: Types.ObjectId,
            ref: "UserSkill",
            required: true,
            index: true,
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
        versionKey: false,
        strict: "throw",
    }
);

SkillProgressSchema.index({
    userSkillId: 1,
    createdAt: -1,
});

export type SkillProgress =
    InferSchemaType<
        typeof SkillProgressSchema
    >;

export type SkillProgressDocument =
    HydratedDocument<SkillProgress>;

export const SkillProgressModel =
    model<SkillProgress>(
        "SkillProgress",
        SkillProgressSchema
    );
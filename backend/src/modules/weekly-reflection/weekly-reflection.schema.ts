import {
    Schema,
    model,
    Types,
    InferSchemaType,
    HydratedDocument,
} from "mongoose";

import {
    DifficultyType,
    MotivationLevel,
    OverallWeek,
    ReflectionReason,
} from "./weekly-reflection.enums.js";
import { LearningReflection, MentorCheckIn } from "./weekly-reflection.types.js";

const LearningReflectionSchema = new Schema({

    completedAllTasks: {
        type: Boolean,
        required: true,
    },

    reason: {
        type: String,
        enum: Object.values(ReflectionReason),
    },

    difficultyType: {
        type: String,
        enum: Object.values(DifficultyType),
    },

    confidenceRating: {
        type: Number,
        required: true,
        min: 1,
        max: 5,
    },

}, {
    _id: false,
});

const MentorCheckInSchema = new Schema({

    overallWeek: {
        type: String,
        enum: Object.values(OverallWeek),
        required: true,
    },

    motivationLevel: {
        type: String,
        enum: Object.values(MotivationLevel),
        required: true,
    },

    externalFactors: {
        type: String,
        trim: true,
    },

    careerConcern: {
        type: String,
        trim: true,
    },

    helpNeeded: {
        type: String,
        trim: true,
    },

}, {
    _id: false,
});

const WeeklyReflectionSchema = new Schema({

    careerJourneyId: {
        type: Types.ObjectId,
        ref: "CareerJourney",
        required: true,
        index: true,
    },

    missionId: {
        type: Types.ObjectId,
        ref: "Mission",
        required: true,
    },

    assessmentId: {
        type: Types.ObjectId,
        ref: "Assessment",
        required: true,
    },

    weekNumber: {
        type: Number,
        required: true,
    },

    learningReflection: {
        type: LearningReflectionSchema,
        required: true,
    },

    mentorCheckIn: {
        type: MentorCheckInSchema,
        required: true,
    },

    additionalComments: {
        type: String,
        trim: true,
    }

}, {
    timestamps: true,
});

WeeklyReflectionSchema.index({

    careerJourneyId: 1,

    weekNumber: 1,

}, {

    unique: true,

});

WeeklyReflectionSchema.index({

    missionId: 1,

});

WeeklyReflectionSchema.index({

    assessmentId: 1,

});


export type WeeklyReflection =
    InferSchemaType<typeof WeeklyReflectionSchema>;

export type WeeklyReflectionDocument =
    HydratedDocument<WeeklyReflection>;

export const WeeklyReflectionModel =
    model<WeeklyReflection>(
        "WeeklyReflection",
        WeeklyReflectionSchema
    );
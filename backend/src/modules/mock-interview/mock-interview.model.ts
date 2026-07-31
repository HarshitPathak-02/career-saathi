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
    MOCK_INTERVIEW_COLLECTION,
    MOCK_INTERVIEW_MODEL,
} from "./mock-interview.constants.js";

import {
    MockInterviewStatus,
    MockInterviewType,
} from "./mock-interview.enums.js";
import { ROADMAP_MODEL } from "../roadmap/roadmap.constants.js";


const MockInterviewSchema =
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

            roadmapId: {
                type: Schema.Types.ObjectId,
                ref: ROADMAP_MODEL,
                required: true,
                index: true
            },

            interviewNumber: {
                type: Number,

                required: true,

                min: 1,
            },

            platform: {
                type: String,

                required: true,

                trim: true,
            },

            interviewType: {
                type: String,

                enum:
                    Object.values(
                        MockInterviewType
                    ),

                required: true,
            },

            overallScore: {
                type: Number,

                required: true,

                min: 0,

                max: 100,
            },

            technicalScore: {
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

            feedback: {
                type: String,

                trim: true,

                default: "",
            },

            interviewedAt: {
                type: Date,

                required: true,
            },

            status: {
                type: String,

                enum:
                    Object.values(
                        MockInterviewStatus
                    ),

                default:
                    MockInterviewStatus
                        .COMPLETED,

                required: true,
            },
        },
        {
            timestamps: true,

            versionKey: false,

            strict: "throw",

            collection:
                MOCK_INTERVIEW_COLLECTION,
        }
    );


MockInterviewSchema.index(
    {
        careerJourneyId: 1,
        interviewNumber: 1,
    },
    {
        unique: true,
    }
);


MockInterviewSchema.index(
    {
        careerJourneyId: 1,
        interviewedAt: -1,
    }
);


export type MockInterview =
    InferSchemaType<
        typeof MockInterviewSchema
    >;


export type MockInterviewDocument =
    HydratedDocument<
        MockInterview
    >;


export const MockInterviewModel =
    model<MockInterview>(
        MOCK_INTERVIEW_MODEL,
        MockInterviewSchema
    );
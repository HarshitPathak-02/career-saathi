import {
  HydratedDocument,
  InferSchemaType,
  Schema,
  Types,
  model,
} from "mongoose";

import {
  INTERVIEW_SESSION_COLLECTION,
  INTERVIEW_SESSION_MODEL,
} from "./practice.constants.js";
import {
  InterviewSessionStatus,
  InterviewTurnType,
} from "./practice.enums.js";

const InterviewTurnSchema = new Schema(
  {
    turnIndex: {
      type: Number,
      required: true,
      min: 0,
      max: 10,
    },
    questionIndex: {
      type: Number,
      required: true,
      min: 0,
      max: 5,
    },
    turnType: {
      type: String,
      enum: Object.values(InterviewTurnType),
      required: true,
    },
    questionText: {
      type: String,
      required: true,
      trim: true,
    },
    candidateAnswer: {
      type: String,
      trim: true,
      default: null,
    },
    answeredAt: {
      type: Date,
      default: null,
    },
    quickCritique: {
      type: String,
      trim: true,
      default: null,
    },
  },
  { _id: false }
);

const InterviewEvaluationSchema = new Schema(
  {
    conceptualDepthScore: {
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
    overallScore: {
      type: Number,
      required: true,
      min: 0,
      max: 100,
    },
    observedStrengths: {
      type: [String],
      default: [],
    },
    observedGaps: {
      type: [String],
      default: [],
    },
    antiPatterns: {
      type: [String],
      default: [],
    },
    mentorFeedback: {
      type: String,
      required: true,
      trim: true,
    },
  },
  { _id: false }
);

const InterviewSessionSchema = new Schema(
  {
    userId: {
      type: Types.ObjectId,
      ref: "User",
      required: true,
    },
    careerJourneyId: {
      type: Types.ObjectId,
      ref: "CareerJourney",
      required: true,
    },
    skillCatalogId: {
      type: Types.ObjectId,
      ref: "SkillCatalog",
      required: false,
      default: null,
    },
    isOfficialReadinessMock: {
      type: Boolean,
      default: false,
    },
    mockInterviewNumber: {
      type: Number,
      enum: [1, 2, 3],
      default: null,
    },
    mockInterviewType: {
      type: String,
      default: null,
    },
    roadmapId: {
      type: Types.ObjectId,
      ref: "Roadmap",
      default: null,
    },
    roleTitle: {
      type: String,
      trim: true,
      default: null,
    },
    status: {
      type: String,
      enum: Object.values(InterviewSessionStatus),
      default: InterviewSessionStatus.IN_PROGRESS,
      required: true,
    },
    currentQuestionIndex: {
      type: Number,
      default: 0,
      min: 0,
      max: 5,
    },
    isAwaitingFollowUp: {
      type: Boolean,
      default: false,
    },
    turns: {
      type: [InterviewTurnSchema],
      default: [],
    },
    evaluation: {
      type: InterviewEvaluationSchema,
      default: null,
    },
    optedInToJourney: {
      type: Boolean,
      default: false,
    },
    startedAt: {
      type: Date,
      required: true,
    },
    completedAt: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
    versionKey: false,
    collection: INTERVIEW_SESSION_COLLECTION,
  }
);

InterviewSessionSchema.index({ userId: 1, createdAt: -1 });
InterviewSessionSchema.index({ careerJourneyId: 1, status: 1 });
InterviewSessionSchema.index({ careerJourneyId: 1, isOfficialReadinessMock: 1, mockInterviewNumber: 1 });
InterviewSessionSchema.index({ skillCatalogId: 1 });

export type InterviewSession = InferSchemaType<typeof InterviewSessionSchema>;
export type InterviewSessionDocument = HydratedDocument<InterviewSession>;
export const InterviewSessionModel = model<InterviewSession>(
  INTERVIEW_SESSION_MODEL,
  InterviewSessionSchema
);

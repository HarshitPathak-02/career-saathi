import {
  HydratedDocument,
  InferSchemaType,
  Schema,
  Types,
  model,
} from "mongoose";

import {
  AssessmentAttemptStatus,
} from "./assessment-engine.enums.js";
import {
  ASSESSMENT_ATTEMPT_COLLECTION,
  ASSESSMENT_ATTEMPT_MODEL,
} from "./assessment-engine.constants.js";

const AssessmentAttemptSchema = new Schema(
  {
    assessmentId: {
      type: Types.ObjectId,
      ref: "Assessment",
      required: true,
      index: true,
    },

    sectionId: {
      type: Types.ObjectId,
      ref: "AssessmentSection",
      required: true,
    },

    userId: {
      type: Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    careerJourneyId: {
      type: Types.ObjectId,
      ref: "CareerJourney",
      required: true,
      index: true,
    },

    skillCatalogId: {
      type: Types.ObjectId,
      ref: "SkillCatalog",
      required: true,
      index: true,
    },

    attemptNumber: {
      type: Number,
      required: true,
      min: 1,
    },

    status: {
      type: String,
      enum: Object.values(
        AssessmentAttemptStatus
      ),
      default:
        AssessmentAttemptStatus.IN_PROGRESS,
      index: true,
    },

    startedAt: {
      type: Date,
      required: true,
    },

    expiresAt: {
      type: Date,
      required: true,
    },

    submittedAt: {
      type: Date,
      default: null,
    },

    durationSeconds: {
      type: Number,
      default: null,
      min: 0,
    },

    score: {
      type: Number,
      default: null,
      min: 0,
      max: 100,
    },

    maxScore: {
      type: Number,
      default: null,
      min: 1,
    },

    correctCount: {
      type: Number,
      default: null,
      min: 0,
    },

    questionCount: {
      type: Number,
      default: null,
      min: 1,
    },

    hasRetiredQuestion: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
    versionKey: false,
    strict: "throw",
    collection:
      ASSESSMENT_ATTEMPT_COLLECTION,
  }
);

AssessmentAttemptSchema.index(
  {
    sectionId: 1,
    attemptNumber: 1,
  },
  {
    unique: true,
  }
);

AssessmentAttemptSchema.index(
  {
    sectionId: 1,
  },
  {
    unique: true,
    partialFilterExpression: {
      status:
        AssessmentAttemptStatus.IN_PROGRESS,
    },
  }
);

AssessmentAttemptSchema.index({
  userId: 1,
  assessmentId: 1,
});

export type AssessmentAttempt =
  InferSchemaType<
    typeof AssessmentAttemptSchema
  >;

export type AssessmentAttemptDocument =
  HydratedDocument<AssessmentAttempt>;

export const AssessmentAttemptModel =
  model<AssessmentAttempt>(
    ASSESSMENT_ATTEMPT_MODEL,
    AssessmentAttemptSchema
  );

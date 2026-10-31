import {
  HydratedDocument,
  InferSchemaType,
  Schema,
  Types,
  model,
} from "mongoose";

import {
  CODING_ATTEMPT_COLLECTION,
  CODING_ATTEMPT_MODEL,
} from "./practice.constants.js";
import {
  CodingAttemptStatus,
} from "./practice.enums.js";

const TestResultsSchema = new Schema(
  {
    total: {
      type: Number,
      required: true,
      min: 0,
    },
    passed: {
      type: Number,
      required: true,
      min: 0,
    },
    failed: {
      type: Number,
      required: true,
      min: 0,
    },
    executionTimeMs: {
      type: Number,
      required: true,
      min: 0,
    },
  },
  {
    _id: false,
    strict: "throw",
  }
);

const EvaluationSchema = new Schema(
  {
    correctnessScore: {
      type: Number,
      required: true,
      min: 0,
      max: 100,
    },
    codeQualityScore: {
      type: Number,
      required: true,
      min: 0,
      max: 100,
    },
    observedStrengths: {
      type: [String],
      default: [],
    },
    observedStruggles: {
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
  {
    _id: false,
    strict: "throw",
  }
);

const CodingAttemptSchema = new Schema(
  {
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

    challengeId: {
      type: Types.ObjectId,
      ref: "CodingChallenge",
      required: true,
      index: true,
    },

    skillCatalogId: {
      type: Types.ObjectId,
      ref: "SkillCatalog",
      required: true,
      index: true,
    },

    topicId: {
      type: Types.ObjectId,
      ref: "SkillTopic",
      required: true,
      index: true,
    },

    submittedCode: {
      type: String,
      required: true,
    },

    testResults: {
      type: TestResultsSchema,
      required: true,
    },

    runCount: {
      type: Number,
      default: 1,
      min: 1,
    },

    durationSeconds: {
      type: Number,
      default: 0,
      min: 0,
    },

    status: {
      type: String,
      enum: Object.values(CodingAttemptStatus),
      default: CodingAttemptStatus.PENDING,
      index: true,
    },

    evaluation: {
      type: EvaluationSchema,
      default: null,
    },

    optedInToJourney: {
      type: Boolean,
      default: false,
      index: true,
    },

    evaluatedAt: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
    versionKey: false,
    strict: "throw",
    collection: CODING_ATTEMPT_COLLECTION,
  }
);

CodingAttemptSchema.index({
  userId: 1,
  challengeId: 1,
  createdAt: -1,
});

CodingAttemptSchema.index({
  careerJourneyId: 1,
  optedInToJourney: 1,
  createdAt: -1,
});

export type CodingAttempt = InferSchemaType<typeof CodingAttemptSchema>;

export type CodingAttemptDocument = HydratedDocument<CodingAttempt>;

export const CodingAttemptModel = model<CodingAttempt>(
  CODING_ATTEMPT_MODEL,
  CodingAttemptSchema
);

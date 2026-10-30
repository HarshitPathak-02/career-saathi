import {
  HydratedDocument,
  InferSchemaType,
  Schema,
  Types,
  model,
} from "mongoose";

import {
  ASSESSMENT_ANSWER_COLLECTION,
  ASSESSMENT_ANSWER_MODEL,
} from "./assessment-engine.constants.js";

const AnswerMatchingPairSchema = new Schema(
  {
    leftKey: {
      type: String,
      required: true,
      trim: true,
    },

    rightKey: {
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

const AssessmentAnswerSchema = new Schema(
  {
    attemptId: {
      type: Types.ObjectId,
      ref: "AssessmentAttempt",
      required: true,
      index: true,
    },

    assessmentQuestionId: {
      type: Types.ObjectId,
      ref: "AssessmentQuestion",
      required: true,
      index: true,
    },

    selectedOptionKeys: {
      type: [String],
      default: [],
    },

    numericValue: {
      type: Number,
      default: null,
    },

    matchingPairs: {
      type: [AnswerMatchingPairSchema],
      default: [],
    },

    isCorrect: {
      type: Boolean,
      default: null,
    },

    pointsAwarded: {
      type: Number,
      default: null,
      min: 0,
    },

    timeSpentSeconds: {
      type: Number,
      default: 0,
      min: 0,
    },

    answeredAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
    versionKey: false,
    strict: "throw",
    collection:
      ASSESSMENT_ANSWER_COLLECTION,
  }
);

AssessmentAnswerSchema.index(
  {
    attemptId: 1,
    assessmentQuestionId: 1,
  },
  {
    unique: true,
  }
);

export type AssessmentAnswer =
  InferSchemaType<
    typeof AssessmentAnswerSchema
  >;

export type AssessmentAnswerDocument =
  HydratedDocument<AssessmentAnswer>;

export const AssessmentAnswerModel =
  model<AssessmentAnswer>(
    ASSESSMENT_ANSWER_MODEL,
    AssessmentAnswerSchema
  );

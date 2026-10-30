import {
  HydratedDocument,
  InferSchemaType,
  Schema,
  Types,
  model,
} from "mongoose";

import {
  QuestionDifficulty,
  QuestionStatus,
  QuestionType,
} from "./assessment-engine.enums.js";
import {
  ASSESSMENT_QUESTION_COLLECTION,
  ASSESSMENT_QUESTION_MODEL,
} from "./assessment-engine.constants.js";

const SnapshotOptionSchema = new Schema(
  {
    key: {
      type: String,
      required: true,
      trim: true,
    },

    text: {
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

const SnapshotMatchingSchema = new Schema(
  {
    leftItems: {
      type: [SnapshotOptionSchema],
      default: [],
    },

    rightItems: {
      type: [SnapshotOptionSchema],
      default: [],
    },
  },
  {
    _id: false,
    strict: "throw",
  }
);

const AssessmentQuestionSchema = new Schema(
  {
    attemptId: {
      type: Types.ObjectId,
      ref: "AssessmentAttempt",
      required: true,
      index: true,
    },

    questionId: {
      type: Types.ObjectId,
      ref: "Question",
      required: true,
      index: true,
    },

    questionVersion: {
      type: Number,
      required: true,
      min: 1,
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

    topicNameSnapshot: {
      type: String,
      required: true,
      trim: true,
    },

    type: {
      type: String,
      enum: Object.values(QuestionType),
      required: true,
    },

    difficulty: {
      type: String,
      enum: Object.values(QuestionDifficulty),
      required: true,
    },

    stemSnapshot: {
      type: String,
      required: true,
      trim: true,
    },

    optionsSnapshot: {
      type: [SnapshotOptionSchema],
      default: [],
    },

    matchingSnapshot: {
      type: SnapshotMatchingSchema,
      default: undefined,
    },

    answerKeySnapshot: {
      type: Schema.Types.Mixed,
      required: true,
      select: false,
    },

    explanationSnapshot: {
      type: String,
      required: true,
      trim: true,
      select: false,
    },

    order: {
      type: Number,
      required: true,
      min: 1,
    },

    estimatedTimeSeconds: {
      type: Number,
      required: true,
      min: 10,
      max: 600,
    },

    points: {
      type: Number,
      default: 1,
      min: 0,
    },

    reviewStatusAtServe: {
      type: String,
      enum: Object.values(QuestionStatus),
      required: true,
    },
  },
  {
    timestamps: {
      createdAt: true,
      updatedAt: false,
    },
    versionKey: false,
    strict: "throw",
    collection:
      ASSESSMENT_QUESTION_COLLECTION,
  }
);

AssessmentQuestionSchema.index(
  {
    attemptId: 1,
    order: 1,
  },
  {
    unique: true,
  }
);

AssessmentQuestionSchema.index({
  attemptId: 1,
  questionId: 1,
});

export type AssessmentQuestion =
  InferSchemaType<
    typeof AssessmentQuestionSchema
  >;

export type AssessmentQuestionDocument =
  HydratedDocument<AssessmentQuestion>;

export const AssessmentQuestionModel =
  model<AssessmentQuestion>(
    ASSESSMENT_QUESTION_MODEL,
    AssessmentQuestionSchema
  );

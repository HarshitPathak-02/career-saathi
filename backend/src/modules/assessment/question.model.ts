import {
  HydratedDocument,
  InferSchemaType,
  Schema,
  Types,
  model,
} from "mongoose";

import {
  QuestionDifficulty,
  QuestionSource,
  QuestionStatus,
  QuestionType,
} from "./assessment-engine.enums.js";
import { validateQuestionContent } from "./question.validator.js";

const QuestionOptionSchema = new Schema(
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

const NumericAnswerSchema = new Schema(
  {
    value: {
      type: Number,
      required: true,
    },

    tolerance: {
      type: Number,
      required: true,
      min: 0,
    },

    unit: {
      type: String,
      trim: true,
      default: "",
    },
  },
  {
    _id: false,
    strict: "throw",
  }
);

const MatchingItemSchema = new Schema(
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

const MatchingPairSchema = new Schema(
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

const MatchingSchema = new Schema(
  {
    leftItems: {
      type: [MatchingItemSchema],
      default: [],
    },

    rightItems: {
      type: [MatchingItemSchema],
      default: [],
    },

    correctPairs: {
      type: [MatchingPairSchema],
      default: [],
    },
  },
  {
    _id: false,
    strict: "throw",
  }
);

const GeneratedBySchema = new Schema(
  {
    provider: {
      type: String,
      required: true,
      trim: true,
    },

    model: {
      type: String,
      required: true,
      trim: true,
    },

    promptVersion: {
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

const QuestionSchema = new Schema(
  {
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

    stem: {
      type: String,
      required: true,
      trim: true,
    },

    options: {
      type: [QuestionOptionSchema],
      default: [],
    },

    correctOptionKeys: {
      type: [String],
      default: [],
    },

    numericAnswer: {
      type: NumericAnswerSchema,
      default: undefined,
    },

    matching: {
      type: MatchingSchema,
      default: undefined,
    },

    explanation: {
      type: String,
      required: true,
      trim: true,
    },

    estimatedTimeSeconds: {
      type: Number,
      required: true,
      min: 10,
      max: 600,
    },

    status: {
      type: String,
      enum: Object.values(QuestionStatus),
      default: QuestionStatus.AI_GENERATED,
      index: true,
    },

    source: {
      type: String,
      enum: Object.values(QuestionSource),
      default: QuestionSource.AI,
    },

    version: {
      type: Number,
      required: true,
      min: 1,
      default: 1,
    },

    contentHash: {
      type: String,
      required: true,
    },

    generatedBy: {
      type: GeneratedBySchema,
      default: undefined,
    },

    reviewedBy: {
      type: Types.ObjectId,
      ref: "User",
      default: null,
    },

    reviewedAt: {
      type: Date,
      default: null,
    },

    reviewNotes: {
      type: String,
      trim: true,
      default: null,
    },

    usageCount: {
      type: Number,
      default: 0,
      min: 0,
    },

    lastServedAt: {
      type: Date,
      default: null,
    },

    isDeleted: {
      type: Boolean,
      default: false,
      index: true,
    },
  },
  {
    timestamps: true,
    versionKey: false,
    strict: "throw",
    collection: "questions",
  }
);

QuestionSchema.index({
  skillCatalogId: 1,
  topicId: 1,
  difficulty: 1,
  status: 1,
});

QuestionSchema.index({
  status: 1,
  createdAt: 1,
});

QuestionSchema.index(
  {
    contentHash: 1,
  },
  {
    unique: true,
    partialFilterExpression: {
      isDeleted: false,
    },
  }
);

QuestionSchema.pre(
  "validate",
  function () {
    validateQuestionContent(
      this as unknown as Parameters<
        typeof validateQuestionContent
      >[0]
    );
  }
);

export type Question = InferSchemaType<
  typeof QuestionSchema
>;

export type QuestionDocument =
  HydratedDocument<Question>;

export const QuestionModel = model<Question>(
  "Question",
  QuestionSchema
);

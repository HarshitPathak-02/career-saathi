import {
  HydratedDocument,
  InferSchemaType,
  Schema,
  Types,
  model,
} from "mongoose";

import {
  CODING_CHALLENGE_COLLECTION,
  CODING_CHALLENGE_MODEL,
} from "./practice.constants.js";
import {
  ChallengeDifficulty,
  ChallengeSource,
} from "./practice.enums.js";

const TestCaseSchema = new Schema(
  {
    id: {
      type: String,
      required: true,
      trim: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    inputCode: {
      type: String,
      required: true,
      trim: true,
    },
    expectedOutput: {
      type: String,
      required: true,
      trim: true,
    },
    isHidden: {
      type: Boolean,
      default: false,
    },
    explanation: {
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

const CodingChallengeSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },

    slug: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
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

    roleSlugs: {
      type: [String],
      default: [],
      index: true,
    },

    difficulty: {
      type: String,
      enum: Object.values(ChallengeDifficulty),
      required: true,
    },

    estimatedMinutes: {
      type: Number,
      required: true,
      min: 5,
      max: 120,
    },

    description: {
      type: String,
      required: true,
      trim: true,
    },

    starterCode: {
      type: String,
      required: true,
    },

    solutionCode: {
      type: String,
      default: "",
    },

    testCases: {
      type: [TestCaseSchema],
      default: [],
    },

    source: {
      type: String,
      enum: Object.values(ChallengeSource),
      default: ChallengeSource.SEEDED,
    },

    isActive: {
      type: Boolean,
      default: true,
      index: true,
    },
  },
  {
    timestamps: true,
    versionKey: false,
    strict: "throw",
    collection: CODING_CHALLENGE_COLLECTION,
  }
);

CodingChallengeSchema.index(
  {
    slug: 1,
  },
  {
    unique: true,
  }
);

CodingChallengeSchema.index({
  skillCatalogId: 1,
  topicId: 1,
  difficulty: 1,
  isActive: 1,
});

export type CodingChallenge = InferSchemaType<typeof CodingChallengeSchema>;

export type CodingChallengeDocument = HydratedDocument<CodingChallenge>;

export const CodingChallengeModel = model<CodingChallenge>(
  CODING_CHALLENGE_MODEL,
  CodingChallengeSchema
);

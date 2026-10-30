import {
  HydratedDocument,
  InferSchemaType,
  Schema,
  Types,
  model,
} from "mongoose";

import {
  SKILL_TOPIC_PROGRESS_COLLECTION,
  SKILL_TOPIC_PROGRESS_MODEL,
} from "./assessment-engine.constants.js";

const SkillTopicProgressSchema = new Schema(
  {
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

    topicId: {
      type: Types.ObjectId,
      ref: "SkillTopic",
      required: true,
      index: true,
    },

    masteryScore: {
      type: Number,
      required: true,
      min: 0,
      max: 100,
    },

    accuracy: {
      type: Number,
      required: true,
      min: 0,
      max: 100,
    },

    questionsAnswered: {
      type: Number,
      required: true,
      min: 0,
    },

    correctCount: {
      type: Number,
      required: true,
      min: 0,
    },

    confidence: {
      type: Number,
      required: true,
      min: 0,
      max: 1,
    },

    lastAttemptId: {
      type: Types.ObjectId,
      ref: "AssessmentAttempt",
      default: null,
    },

    lastAssessedAt: {
      type: Date,
      required: true,
    },
  },
  {
    timestamps: true,
    versionKey: false,
    strict: "throw",
    collection:
      SKILL_TOPIC_PROGRESS_COLLECTION,
  }
);

SkillTopicProgressSchema.index(
  {
    careerJourneyId: 1,
    skillCatalogId: 1,
    topicId: 1,
  },
  {
    unique: true,
  }
);

SkillTopicProgressSchema.index({
  careerJourneyId: 1,
  masteryScore: 1,
});

export type SkillTopicProgress =
  InferSchemaType<
    typeof SkillTopicProgressSchema
  >;

export type SkillTopicProgressDocument =
  HydratedDocument<SkillTopicProgress>;

export const SkillTopicProgressModel =
  model<SkillTopicProgress>(
    SKILL_TOPIC_PROGRESS_MODEL,
    SkillTopicProgressSchema
  );

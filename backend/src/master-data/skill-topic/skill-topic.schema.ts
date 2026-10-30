import {
  Schema,
  Types,
  model,
} from "mongoose";

import type {
  HydratedDocument,
  InferSchemaType,
} from "mongoose";

import {
  SKILL_TOPIC_COLLECTION,
  SKILL_TOPIC_MODEL,
} from "./skill-topic.constants.js";

const SkillTopicSchema = new Schema(
  {
    skillCatalogId: {
      type: Types.ObjectId,
      ref: "SkillCatalog",
      required: true,
      index: true,
    },

    name: {
      type: String,
      required: true,
      trim: true,
    },

    slug: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
    },

    description: {
      type: String,
      default: "",
      trim: true,
    },

    displayOrder: {
      type: Number,
      required: true,
      min: 1,
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
    collection: SKILL_TOPIC_COLLECTION,
  }
);

SkillTopicSchema.index(
  {
    skillCatalogId: 1,
    slug: 1,
  },
  {
    unique: true,
  }
);

SkillTopicSchema.index({
  skillCatalogId: 1,
  displayOrder: 1,
});

export type SkillTopic = InferSchemaType<
  typeof SkillTopicSchema
>;

export type SkillTopicDocument =
  HydratedDocument<SkillTopic>;

export const SkillTopicModel =
  model<SkillTopic>(
    SKILL_TOPIC_MODEL,
    SkillTopicSchema
  );

import {
  HydratedDocument,
  InferSchemaType,
  Schema,
  model,
} from "mongoose";

import {
  SKILL_CATALOG_COLLECTION,
  SKILL_CATALOG_MODEL,
} from "./skill-catalog.constants.js";

import {
  SkillCategory,
  SkillDifficulty,
} from "./skill-catalog.enums.js";

const SkillCatalogSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      unique: true,
    },

    slug: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
      unique: true,
    },

    category: {
      type: String,
      enum: Object.values(SkillCategory),
      required: true,
    },

    difficulty: {
      type: String,
      enum: Object.values(SkillDifficulty),
      default: SkillDifficulty.BEGINNER,
    },

    description: {
      type: String,
      default: "",
      trim: true,
    },

    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
    versionKey: false,
    strict: "throw",
    collection: SKILL_CATALOG_COLLECTION,
  }
);

SkillCatalogSchema.index(
  { slug: 1 },
  { unique: true }
);

SkillCatalogSchema.index({
  category: 1,
});

SkillCatalogSchema.index({
  isActive: 1,
});

export type SkillCatalog = InferSchemaType<
  typeof SkillCatalogSchema
>;

export type SkillCatalogDocument =
  HydratedDocument<SkillCatalog>;

export const SkillCatalogModel =
  model<SkillCatalog>(
    SKILL_CATALOG_MODEL,
    SkillCatalogSchema
  );
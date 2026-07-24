import {
  HydratedDocument,
  InferSchemaType,
  Schema,
  Types,
  model,
} from "mongoose";

import {
  USER_SKILL_COLLECTION,
  USER_SKILL_MODEL,
} from "./user-skill.constants.js";

import {
  SkillCategory,
  SkillDifficulty,
} from "../../master-data/skill-catalog/skill-catalog.enums.js";

import { SkillLevel } from "./user-skill.enums.js";

const UserSkillSchema = new Schema(
  {
    careerJourneyId: {
      type: Types.ObjectId,
      ref: "CareerJourney",
      required: true,
    },

    skillCatalogId: {
      type: Types.ObjectId,
      ref: "SkillCatalog",
      required: true,
    },

    selectedByUser: {
      type: Boolean,
      default: false,
    },

    currentScore: {
      type: Number,
      default: 0,
      min: 0,
      max: 100,
    },

    currentLevel: {
      type: String,
      enum: Object.values(SkillLevel),
      default: SkillLevel.NOT_STARTED,
    },

    lastAssessmentAt: {
      type: Date,
    },

    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
    versionKey: false,
    collection: USER_SKILL_COLLECTION,
  }
);

UserSkillSchema.index(
  {
    careerJourneyId: 1,
    skillCatalogId: 1,
  },
  {
    unique: true,
  }
);

UserSkillSchema.index({
  careerJourneyId: 1,
});

UserSkillSchema.index({
  selectedByUser: 1,
});


export type UserSkill = InferSchemaType<
  typeof UserSkillSchema
>;

export type UserSkillDocument =
  HydratedDocument<UserSkill>;

export const UserSkillModel =
  model<UserSkill>(
    USER_SKILL_MODEL,
    UserSkillSchema
  );
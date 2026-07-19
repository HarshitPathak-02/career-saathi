import {
  HydratedDocument,
  InferSchemaType,
  Schema,
  Types,
  model,
} from "mongoose";

import {
  CAREER_ROLE_SKILL_COLLECTION,
  CAREER_ROLE_SKILL_MODEL,
} from "./career-role-skill.constants.js";

import { SkillPriority } from "./career-role-skill.enums.js";

const CareerRoleSkillSchema = new Schema(
  {
    roleId: {
      type: Types.ObjectId,
      ref: "CareerRole",
      required: true,
      index: true,
    },

    skillId: {
      type: Types.ObjectId,
      ref: "SkillCatalog",
      required: true,
      index: true,
    },

    displayOrder: {
      type: Number,
      required: true,
      min: 1,
    },

    priority: {
      type: String,
      enum: Object.values(SkillPriority),
      default: SkillPriority.MEDIUM,
      required: true,
    },

    isMandatory: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
    versionKey: false,
    strict: "throw",
    collection: CAREER_ROLE_SKILL_COLLECTION,
  }
);

CareerRoleSkillSchema.index(
  {
    roleId: 1,
    skillId: 1,
  },
  {
    unique: true,
  }
);

CareerRoleSkillSchema.index({
  roleId: 1,
  displayOrder: 1,
});

CareerRoleSkillSchema.index({
  roleId: 1,
  priority: 1,
});

export type CareerRoleSkill =
  InferSchemaType<typeof CareerRoleSkillSchema>;

export type CareerRoleSkillDocument =
  HydratedDocument<CareerRoleSkill>;

export const CareerRoleSkillModel =
  model<CareerRoleSkill>(
    CAREER_ROLE_SKILL_MODEL,
    CareerRoleSkillSchema
  );
import {
  HydratedDocument,
  InferSchemaType,
  Schema,
  Types,
  model,
} from "mongoose";

import {
  CAREER_ROLE_COLLECTION,
  CAREER_ROLE_MODEL,
} from "./career-role.constants.js";

const CareerRoleSchema = new Schema(
  {
    domainId: {
      type: Types.ObjectId,
      ref: "CareerDomain",
      required: true,
    },

    name: {
      type: String,
      required: true,
      trim: true,
      unique: true,
    },

    slug: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
    },

    description: {
      type: String,
      trim: true,
      default: "",
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
    collection: CAREER_ROLE_COLLECTION,
  }
);

CareerRoleSchema.index({
  domainId: 1,
});

CareerRoleSchema.index(
  {
    slug: 1,
  },
  {
    unique: true,
  }
);

CareerRoleSchema.index({
  isActive: 1,
});

export type CareerRole = InferSchemaType<
  typeof CareerRoleSchema
>;

export type CareerRoleDocument =
  HydratedDocument<CareerRole>;

export const CareerRoleModel =
  model<CareerRole>(
    CAREER_ROLE_MODEL,
    CareerRoleSchema
  );
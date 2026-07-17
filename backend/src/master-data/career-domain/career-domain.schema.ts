import {
  HydratedDocument,
  InferSchemaType,
  Schema,
  model,
} from "mongoose";

import {
  CAREER_DOMAIN_COLLECTION,
  CAREER_DOMAIN_MODEL,
} from "./career-domain.constants.js";

const CareerDomainSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },

    slug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
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
    collection: CAREER_DOMAIN_COLLECTION,
    versionKey: false,
  }
);

CareerDomainSchema.index(
  {
    slug: 1,
  },
  {
    unique: true,
  }
);

CareerDomainSchema.index({
  isActive: 1,
});

export type CareerDomain = InferSchemaType<typeof CareerDomainSchema>;

export type CareerDomainDocument =
  HydratedDocument<CareerDomain>;

export const CareerDomainModel = model<CareerDomain>(
  CAREER_DOMAIN_MODEL,
  CareerDomainSchema
);
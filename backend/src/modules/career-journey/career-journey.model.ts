import {
  HydratedDocument,
  InferSchemaType,
  Schema,
  Types,
  model,
} from "mongoose";

import {
  CAREER_JOURNEY_COLLECTION,
  CAREER_JOURNEY_MODEL,
} from "./career-journey.constants.js";

import {
  CareerJourneyStatus,
  PreferredLanguage,
  SkillSource,
} from "./career-journey.enums.js";

const CareerJourneySchema = new Schema(
  {
    userId: {
      type: Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    domainId: {
      type: Types.ObjectId,
      ref: "CareerDomain",
      required: true,
    },

    roleId: {
      type: Types.ObjectId,
      ref: "CareerRole",
      required: true,
    },

    targetCompany: {
      type: String,
      trim: true,
      default: "",
    },

    targetDurationMonths: {
      type: Number,
      required: true,
      min: 1,
      max: 24,
    },

    dailyStudyHours: {
      type: Number,
      required: true,
      min: 1,
      max: 12,
    },

    preferredLanguage: {
      type: String,
      enum: Object.values(PreferredLanguage),
      default: PreferredLanguage.ENGLISH,
    },

    resumeId: {
      type: Types.ObjectId,
      ref: "Resume",
      default: null,
    },

    resumeUploadedAt: {
      type: Date,
      default: null,
    },

    status: {
      type: String,
      enum: Object.values(CareerJourneyStatus),
      default: CareerJourneyStatus.DRAFT,
      index: true,
    },

    isDeleted: {
      type: Boolean,
      default: false,
    },

    deletedAt: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
    versionKey: false,
    strict: "throw",
    collection: CAREER_JOURNEY_COLLECTION,
  }
);

CareerJourneySchema.index(
  {
    userId: 1,
    status: 1,
  },
  {
    unique: true,
    partialFilterExpression: {
      isDeleted: false,
      status: {
        $in: [
          CareerJourneyStatus.DRAFT,
          CareerJourneyStatus.READY,
          CareerJourneyStatus.ACTIVE,
        ],
      },
    },
  }
);

CareerJourneySchema.index({
  roleId: 1,
});

CareerJourneySchema.index({
  domainId: 1,
});

CareerJourneySchema.index({
  isDeleted: 1,
});

export type CareerJourney = InferSchemaType<
  typeof CareerJourneySchema
>;

export type CareerJourneyDocument =
  HydratedDocument<CareerJourney>;

export const CareerJourneyModel =
  model<CareerJourney>(
    CAREER_JOURNEY_MODEL,
    CareerJourneySchema
  );
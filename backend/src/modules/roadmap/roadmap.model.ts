import {
  HydratedDocument,
  InferSchemaType,
  Schema,
  model,
} from "mongoose";

import {
  ROADMAP_COLLECTION,
  ROADMAP_MODEL,
} from "./roadmap.constants.js";

import {
  CAREER_JOURNEY_MODEL,
} from "../career-journey/career-journey.constants.js";

import {
  RoadmapStatus,
} from "./roadmap.enums.js";

const RoadmapSchema = new Schema(
  {
    careerJourneyId: {
      type: Schema.Types.ObjectId,
      ref: CAREER_JOURNEY_MODEL,
      required: true,
    },

    title: {
      type: String,
      required: true,
      trim: true,
    },

    targetRole: {
      type: String,
      required: true,
      trim: true,
    },

    targetDomain: {
      type: String,
      required: true,
      trim: true,
    },

    targetDurationMonths: {
      type: Number,
      required: true,
      min: 1,
    },

    estimatedWeeks: {
      type: Number,
      required: true,
      min: 1,
    },

    totalItems: {
      type: Number,
      default: 0,
      min: 0,
    },

    completedItems: {
      type: Number,
      default: 0,
      min: 0,
    },

    status: {
      type: String,
      enum: Object.values(RoadmapStatus),
      default: RoadmapStatus.GENERATING,
    },

    generatedAt: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
    versionKey: false,
    strict: "throw",
    collection: ROADMAP_COLLECTION,
  }
);

RoadmapSchema.index(
  {
    careerJourneyId: 1,
  },
  {
    unique: true,
  }
);

RoadmapSchema.index({
  status: 1,
}); 

export type Roadmap =
  InferSchemaType<typeof RoadmapSchema>;

export type RoadmapDocument =
  HydratedDocument<Roadmap>;

export const RoadmapModel =
  model<Roadmap>(
    ROADMAP_MODEL,
    RoadmapSchema
  );
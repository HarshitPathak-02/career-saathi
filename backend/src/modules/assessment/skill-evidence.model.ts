import {
  HydratedDocument,
  InferSchemaType,
  Schema,
  Types,
  model,
} from "mongoose";

import {
  SkillEvidenceSource,
} from "./assessment-engine.enums.js";
import {
  SKILL_EVIDENCE_COLLECTION,
  SKILL_EVIDENCE_MODEL,
} from "./assessment-engine.constants.js";

const SkillEvidenceSchema = new Schema(
  {
    userId: {
      type: Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    careerJourneyId: {
      type: Types.ObjectId,
      ref: "CareerJourney",
      default: null,
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
      default: null,
    },

    source: {
      type: String,
      enum: Object.values(
        SkillEvidenceSource
      ),
      required: true,
      index: true,
    },

    sourceId: {
      type: Types.ObjectId,
      default: null,
    },

    score: {
      type: Number,
      default: null,
      min: 0,
      max: 100,
    },

    confidence: {
      type: Number,
      required: true,
      min: 0,
      max: 1,
    },

    evidenceText: {
      type: String,
      trim: true,
      default: "",
    },

    scoringEligible: {
      type: Boolean,
      default: false,
      index: true,
    },

    observedAt: {
      type: Date,
      required: true,
    },
  },
  {
    timestamps: true,
    versionKey: false,
    strict: "throw",
    collection:
      SKILL_EVIDENCE_COLLECTION,
  }
);

SkillEvidenceSchema.index({
  userId: 1,
  skillCatalogId: 1,
  source: 1,
});

SkillEvidenceSchema.index({
  careerJourneyId: 1,
  scoringEligible: 1,
});

export type SkillEvidence =
  InferSchemaType<
    typeof SkillEvidenceSchema
  >;

export type SkillEvidenceDocument =
  HydratedDocument<SkillEvidence>;

export const SkillEvidenceModel =
  model<SkillEvidence>(
    SKILL_EVIDENCE_MODEL,
    SkillEvidenceSchema
  );

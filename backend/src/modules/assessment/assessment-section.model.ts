import {
  HydratedDocument,
  InferSchemaType,
  Schema,
  Types,
  model,
} from "mongoose";

import {
  AssessmentSectionStatus,
} from "./assessment-engine.enums.js";
import {
  ASSESSMENT_ENGINE,
  ASSESSMENT_SECTION_COLLECTION,
  ASSESSMENT_SECTION_MODEL,
} from "./assessment-engine.constants.js";

const AssessmentSectionSchema = new Schema(
  {
    assessmentId: {
      type: Types.ObjectId,
      ref: "Assessment",
      required: true,
      index: true,
    },

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

    displayOrder: {
      type: Number,
      required: true,
      min: 1,
    },

    status: {
      type: String,
      enum: Object.values(
        AssessmentSectionStatus
      ),
      default:
        AssessmentSectionStatus.PENDING,
      index: true,
    },

    questionCount: {
      type: Number,
      default:
        ASSESSMENT_ENGINE
          .QUESTIONS_PER_SKILL,
      min: 1,
    },

    timeLimitSeconds: {
      type: Number,
      default:
        ASSESSMENT_ENGINE
          .SECTION_TIME_LIMIT_SECONDS,
      min: 60,
    },

    score: {
      type: Number,
      default: null,
      min: 0,
      max: 100,
    },

    maxScore: {
      type: Number,
      default: 100,
      min: 1,
    },

    startedAt: {
      type: Date,
      default: null,
    },

    completedAt: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
    versionKey: false,
    strict: "throw",
    collection:
      ASSESSMENT_SECTION_COLLECTION,
  }
);

AssessmentSectionSchema.index(
  {
    assessmentId: 1,
    skillCatalogId: 1,
  },
  {
    unique: true,
  }
);

AssessmentSectionSchema.index({
  assessmentId: 1,
  displayOrder: 1,
});

AssessmentSectionSchema.index({
  careerJourneyId: 1,
  status: 1,
});

export type AssessmentSection =
  InferSchemaType<
    typeof AssessmentSectionSchema
  >;

export type AssessmentSectionDocument =
  HydratedDocument<AssessmentSection>;

export const AssessmentSectionModel =
  model<AssessmentSection>(
    ASSESSMENT_SECTION_MODEL,
    AssessmentSectionSchema
  );

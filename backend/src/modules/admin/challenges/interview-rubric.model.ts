import { Schema, model, HydratedDocument, InferSchemaType } from "mongoose";

const RubricCriterionSchema = new Schema(
  {
    name: { type: String, required: true, trim: true },
    weight: { type: Number, required: true, min: 1, max: 100 },
    description: { type: String, required: true, trim: true },
  },
  { _id: false }
);

const InterviewRubricSchema = new Schema(
  {
    roleSlug: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
      index: true,
    },
    roleTitle: {
      type: String,
      required: true,
      trim: true,
    },
    tier: {
      type: String,
      enum: ["ENTRY", "MID", "SENIOR"],
      default: "ENTRY",
      required: true,
    },
    personaPrompt: {
      type: String,
      required: true,
      trim: true,
    },
    rubricCriteria: {
      type: [RubricCriterionSchema],
      default: [],
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
    collection: "interview_rubrics",
    versionKey: false,
  }
);

export type InterviewRubric = InferSchemaType<typeof InterviewRubricSchema>;
export type InterviewRubricDocument = HydratedDocument<InterviewRubric>;

export const InterviewRubricModel = model<InterviewRubric>(
  "InterviewRubric",
  InterviewRubricSchema
);

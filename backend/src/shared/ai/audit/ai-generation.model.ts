import {
  HydratedDocument,
  InferSchemaType,
  Schema,
  model,
} from "mongoose";

import {
  AI_GENERATION_COLLECTION,
  AI_GENERATION_MODEL,
  AiGenerationStatus,
} from "./ai-generation.constants.js";

const AiGenerationSchema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      default: null,
      index: true,
    },

    feature: {
      type: String,
      required: true,
      default: "GENERAL",
      trim: true,
      index: true,
    },

    provider: {
      type: String,
      required: true,
      default: "gemini",
      trim: true,
    },

    model: {
      type: String,
      required: true,
      trim: true,
    },

    prompt: {
      type: String,
      required: true,
    },

    systemInstruction: {
      type: String,
      default: null,
    },

    temperature: {
      type: Number,
      default: null,
    },

    maxOutputTokens: {
      type: Number,
      default: null,
    },

    rawResponseText: {
      type: String,
      default: "",
    },

    promptTokens: {
      type: Number,
      default: 0,
    },

    candidateTokens: {
      type: Number,
      default: 0,
    },

    totalTokens: {
      type: Number,
      default: 0,
    },

    durationMs: {
      type: Number,
      required: true,
      default: 0,
    },

    status: {
      type: String,
      enum: Object.values(AiGenerationStatus),
      required: true,
      default: AiGenerationStatus.SUCCESS,
      index: true,
    },

    errorMessage: {
      type: String,
      default: null,
    },
  },
  {
    timestamps: { createdAt: true, updatedAt: false },
    versionKey: false,
    collection: AI_GENERATION_COLLECTION,
  }
);

AiGenerationSchema.index({ createdAt: -1 });
AiGenerationSchema.index({ feature: 1, createdAt: -1 });
AiGenerationSchema.index({ userId: 1, createdAt: -1 });
AiGenerationSchema.index({ status: 1, createdAt: -1 });

export type AiGeneration = InferSchemaType<typeof AiGenerationSchema>;
export type AiGenerationDocument = HydratedDocument<AiGeneration>;

export const AiGenerationModel = model<AiGeneration>(
  AI_GENERATION_MODEL,
  AiGenerationSchema
);

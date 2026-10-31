import { Types } from "mongoose";
import logger from "../../../config/logger.js";
import { AiGenerationModel, AiGenerationDocument } from "./ai-generation.model.js";
import { AiGenerationStatus } from "./ai-generation.constants.js";

export interface CreateAiGenerationInput {
  userId?: Types.ObjectId | null;
  feature?: string;
  provider: string;
  model: string;
  prompt: string;
  systemInstruction?: string;
  temperature?: number;
  maxOutputTokens?: number;
  rawResponseText?: string;
  promptTokens?: number;
  candidateTokens?: number;
  totalTokens?: number;
  durationMs: number;
  status: AiGenerationStatus;
  errorMessage?: string | null;
}

class AiGenerationRepository {
  async create(data: CreateAiGenerationInput): Promise<AiGenerationDocument | null> {
    try {
      const record = await AiGenerationModel.create(data);
      return record;
    } catch (err) {
      logger.warn(
        { error: err, feature: data.feature, provider: data.provider },
        "Failed to write AI generation audit log"
      );
      return null;
    }
  }

  async findRecent(limit = 50): Promise<AiGenerationDocument[]> {
    return AiGenerationModel.find().sort({ createdAt: -1 }).limit(limit) as unknown as Promise<AiGenerationDocument[]>;
  }

  async findByUserId(userId: Types.ObjectId, limit = 50): Promise<AiGenerationDocument[]> {
    return AiGenerationModel.find({ userId }).sort({ createdAt: -1 }).limit(limit) as unknown as Promise<AiGenerationDocument[]>;
  }
}

export const aiGenerationRepository = new AiGenerationRepository();

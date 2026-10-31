import { Types } from 'mongoose';
import type { AIProvider as AIProviderInterface } from './ai-provider.interface.js';
import { AIProvider as AIProviderEnum } from './ai.enums.js';
import type { AIRequest, AIResponse } from './ai.types.js';
import { createAIProvider } from './ai.provider.factory.js';
import { aiGenerationRepository } from './audit/ai-generation.repository.js';
import { AiGenerationStatus } from './audit/ai-generation.constants.js';

class AIService {
  private readonly providers = new Map<AIProviderEnum, AIProviderInterface>();

  constructor(private readonly defaultProvider: AIProviderInterface) {}

  async generate(request: AIRequest): Promise<AIResponse> {
    const startTime = Date.now();
    let provider = this.defaultProvider;

    if (request.provider) {
      let cached = this.providers.get(request.provider);
      if (!cached) {
        cached = createAIProvider(request.provider);
        this.providers.set(request.provider, cached);
      }
      provider = cached;
    }

    try {
      const response = await provider.generate(request);
      const durationMs = Date.now() - startTime;

      // Fire-and-forget non-blocking audit persistence
      void aiGenerationRepository.create({
        userId: request.userId ? new Types.ObjectId(request.userId) : null,
        feature: request.feature || "GENERAL",
        provider: response.metadata.provider || "gemini",
        model: response.metadata.model || "gemini-2.5-flash",
        prompt: request.prompt,
        systemInstruction: request.systemInstruction,
        temperature: request.temperature,
        maxOutputTokens: request.maxOutputTokens,
        rawResponseText: response.text,
        promptTokens: response.metadata.promptTokens ?? 0,
        candidateTokens: response.metadata.candidateTokens ?? 0,
        totalTokens: response.metadata.totalTokens ?? 0,
        durationMs,
        status: AiGenerationStatus.SUCCESS,
      });

      return response;
    } catch (error) {
      const durationMs = Date.now() - startTime;
      const errorMessage =
        error instanceof Error ? error.message : "AI generation failed";

      void aiGenerationRepository.create({
        userId: request.userId ? new Types.ObjectId(request.userId) : null,
        feature: request.feature || "GENERAL",
        provider: request.provider || "gemini",
        model: "unknown",
        prompt: request.prompt,
        systemInstruction: request.systemInstruction,
        temperature: request.temperature,
        maxOutputTokens: request.maxOutputTokens,
        rawResponseText: "",
        durationMs,
        status: AiGenerationStatus.FAILED,
        errorMessage,
      });

      throw error;
    }
  }
}

export const aiService = new AIService(createAIProvider());

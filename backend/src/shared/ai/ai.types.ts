import type { AIProvider } from './ai.enums.js';

export interface AIRequest {
  prompt: string;

  systemInstruction?: string;

  temperature?: number;

  maxOutputTokens?: number;

  thinkingBudget?: number;

  provider?: AIProvider;

  userId?: string;

  feature?: string;
}

export interface AIResponse {
  text: string;

  metadata: AIResponseMetadata;
}

export interface AIResponseMetadata {
  provider: string;

  model: string;

  generatedAt: Date;

  promptTokens?: number;

  candidateTokens?: number;

  totalTokens?: number;
}

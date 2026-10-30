import type { AIProvider } from './ai.enums.js';

export interface AIRequest {
  prompt: string;

  systemInstruction?: string;

  temperature?: number;

  maxOutputTokens?: number;

  thinkingBudget?: number;

  provider?: AIProvider;
}

export interface AIResponse {
  text: string;

  metadata: AIResponseMetadata;
}

export interface AIResponseMetadata {
  provider: string;

  model: string;

  generatedAt: Date;
}

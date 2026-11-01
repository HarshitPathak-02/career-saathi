import { AIProvider as AIProviderInterface } from './ai-provider.interface.js';

import { AIProvider } from './ai.enums.js';

import { GeminiProvider } from './gemini.provider.js';

import { GroqProvider } from './groq.provider.js';

export function createAIProvider(requestedProvider?: AIProvider): AIProviderInterface {
  const envProvider = process.env.AI_PROVIDER?.toUpperCase() as AIProvider | undefined;
  const provider = envProvider ?? requestedProvider ?? AIProvider.GROQ;

  switch (provider) {
    case AIProvider.GROQ:
      return new GroqProvider();

    case AIProvider.GEMINI:
      return new GeminiProvider();

    default:
      return new GroqProvider();
  }
}

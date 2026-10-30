import type { AIProvider as AIProviderInterface } from './ai-provider.interface.js';
import { AIProvider as AIProviderEnum } from './ai.enums.js';
import type { AIRequest, AIResponse } from './ai.types.js';
import { createAIProvider } from './ai.provider.factory.js';

class AIService {
  private readonly providers = new Map<AIProviderEnum, AIProviderInterface>();

  constructor(private readonly defaultProvider: AIProviderInterface) {}

  async generate(request: AIRequest): Promise<AIResponse> {
    if (!request.provider) {
      return this.defaultProvider.generate(request);
    }

    let provider = this.providers.get(request.provider);

    if (!provider) {
      provider = createAIProvider(request.provider);
      this.providers.set(request.provider, provider);
    }

    return provider.generate(request);
  }
}

export const aiService = new AIService(createAIProvider());

import { GeminiProvider } from "./gemini.provider.js";

import { AIProvider } from "./ai-provider.interface.js";

import {
    AIRequest,
    AIResponse,
} from "./ai.types.js";

class AIService {

    constructor(
        private readonly provider: AIProvider
    ) {}

    async generate(
        request: AIRequest
    ): Promise<AIResponse> {

        return this.provider.generate(
            request
        );

    }

}

export const aiService =
    new AIService(
        new GeminiProvider()
    );
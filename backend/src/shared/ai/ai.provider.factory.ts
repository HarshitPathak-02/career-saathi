import {
    AIProvider as AIProviderInterface,
} from "./ai-provider.interface.js";

import {
    AIProvider,
} from "./ai.enums.js";

import {
    GeminiProvider,
} from "./gemini.provider.js";

import {
    GroqProvider,
} from "./groq.provider.js";


export function createAIProvider():
    AIProviderInterface {

    const provider =
        process.env.AI_PROVIDER ??
        AIProvider.GEMINI;


    switch (provider) {

        case AIProvider.GEMINI:

            return new GeminiProvider();


        case AIProvider.GROQ:

            return new GroqProvider();


        default:

            throw new Error(
                `Unsupported AI provider: ${provider}`
            );

    }

}
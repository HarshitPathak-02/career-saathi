import { GoogleGenAI } from "@google/genai";

import {
    AI_CONSTANTS,
} from "./ai.constants.js";

import {
    AIRequest,
    AIResponse,
} from "./ai.types.js";

import {
    AIProvider,
} from "./ai-provider.interface.js";

export class GeminiProvider
    implements AIProvider {

    private readonly client =
        new GoogleGenAI({
            apiKey: process.env.GEMINI_API_KEY!,
        });

    async generate(
        request: AIRequest
    ): Promise<AIResponse> {

        const response =
            await this.client.models.generateContent({

                model:
                    AI_CONSTANTS.DEFAULT_MODEL,

                contents: request.prompt,

                config: {

                    systemInstruction:
                        request.systemInstruction,

                    temperature:
                        request.temperature ??
                        AI_CONSTANTS.DEFAULT_TEMPERATURE,

                    maxOutputTokens:
                        request.maxOutputTokens ??
                        AI_CONSTANTS.DEFAULT_MAX_OUTPUT_TOKENS,

                    responseMimeType:
                        "application/json",

                },

            });

        console.dir(response, { depth: null });

        return {

            text:
                response.text ?? "",

            metadata: {

                provider:
                    AI_CONSTANTS.DEFAULT_PROVIDER,

                model:
                    AI_CONSTANTS.DEFAULT_MODEL,

                generatedAt:
                    new Date(),

            },

        };

    }

}
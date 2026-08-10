import Groq from "groq-sdk";

import {
    AIProvider,
} from "./ai-provider.interface.js";

import {
    AIRequest,
    AIResponse,
} from "./ai.types.js";

import {
    AI_CONSTANTS,
} from "./ai.constants.js";

import {
    AIProvider as AIProviderEnum,
} from "./ai.enums.js";


export class GroqProvider
    implements AIProvider {

    private readonly client =
        new Groq({
            apiKey:
                process.env.GROQ_API_KEY!,
        });


    async generate(
        request: AIRequest
    ): Promise<AIResponse> {

        const response =
            await this.client
                .chat
                .completions
                .create({

                    model:
                        AI_CONSTANTS
                            .GROQ
                            .MODEL,

                    messages: [

                        ...(
                            request
                                .systemInstruction
                                ? [
                                    {
                                        role:
                                            "system" as const,

                                        content:
                                            request
                                                .systemInstruction,
                                    },
                                ]
                                : []
                        ),

                        {
                            role:
                                "user" as const,

                            content:
                                request.prompt,
                        },

                    ],

                    temperature:
                        request.temperature ??
                        AI_CONSTANTS
                            .DEFAULT_TEMPERATURE,

                    max_completion_tokens:
                        request.maxOutputTokens ??
                        AI_CONSTANTS.DEFAULT_MAX_OUTPUT_TOKENS,

                    response_format: {
                        type:
                            "json_object",
                    },

                });


        return {

            text:
                response
                    .choices[0]
                    ?.message
                    ?.content ??
                "",

            metadata: {

                provider:
                    AIProviderEnum.GROQ,

                model:
                    AI_CONSTANTS
                        .GROQ
                        .MODEL,

                generatedAt:
                    new Date(),

            },

        };

    }

}
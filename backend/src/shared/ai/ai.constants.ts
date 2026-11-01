import {
    AIProvider,
} from "./ai.enums.js";


export const AI_CONSTANTS = {

    DEFAULT_PROVIDER:
        AIProvider.GROQ,

    DEFAULT_TEMPERATURE:
        0.2,

    DEFAULT_MAX_OUTPUT_TOKENS:
        8192,

    GEMINI: {
        MODEL:
            "gemini-2.5-flash",
    },

    GROQ: {
        MODEL:
            process.env.GROQ_MODEL || "openai/gpt-oss-120b",
    },

} as const;
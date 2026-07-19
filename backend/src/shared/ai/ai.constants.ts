import { AIProvider } from "./ai.enums.js";

export const AI_CONSTANTS = {
    DEFAULT_PROVIDER: AIProvider.GEMINI,

    DEFAULT_MODEL: "gemini-2.5-flash",

    DEFAULT_TEMPERATURE: 0.2,

    DEFAULT_MAX_OUTPUT_TOKENS: 8192,
} as const;
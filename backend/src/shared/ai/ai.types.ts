export interface AIRequest {
    prompt: string;

    systemInstruction?: string;

    temperature?: number;

    maxOutputTokens?: number;
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
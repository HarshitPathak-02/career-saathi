import {
    AIRequest,
    AIResponse,
} from "./ai.types.js";

export interface AIProvider {

    generate(
        request: AIRequest
    ): Promise<AIResponse>;

}
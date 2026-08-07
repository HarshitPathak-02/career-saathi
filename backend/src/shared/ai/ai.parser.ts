import { HTTP_STATUS } from "../../core/constants/http-status.constants.js";
import { AppError } from "../../core/errors/app-error.js";

class AIParser {

    parse<T>(
        response: string
    ): T {

        try {
            return JSON.parse(response);
        } catch {

            throw new AppError(HTTP_STATUS.INTERNAL_SERVER_ERROR, "Failed to parse AI response.");

        }

    }

}

export const aiParser =
    new AIParser();
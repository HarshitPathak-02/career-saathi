class AIParser {

    parse<T>(
        response: string
    ): T {

        try {
            return JSON.parse(response);
        } catch {

            throw new Error(
                "Failed to parse AI response."
            );

        }

    }

}

export const aiParser =
    new AIParser();
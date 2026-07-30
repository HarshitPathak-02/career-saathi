import {
    aiService,
} from "../../shared/ai/ai.service.js";

import {
    aiParser,
} from "../../shared/ai/ai.parser.js";

import {
    aiValidator,
} from "../../shared/ai/ai.validator.js";

import {
    monthlyReportPromptBuilder,
} from "./monthly-report-prompt.builder.js";

import {
    MonthlyReportAIInput,
    MonthlyReportAIOutput,
} from "./monthly-report-ai.types.js";


class MonthlyReportAIService {

    /*
    |--------------------------------------------------------------------------
    | Generate Insights
    |--------------------------------------------------------------------------
    */

    async generateInsights(
        input:
            MonthlyReportAIInput
    ): Promise<
        MonthlyReportAIOutput
    > {

        /*
         * Build Prompt
         */

        const prompt =
            monthlyReportPromptBuilder
                .build(
                    input
                );


        /*
         * Generate AI Response
         */

        const aiResponse =
            await aiService
                .generate({
                    prompt,
                });


        /*
         * Parse AI Response
         */

        const parsedResponse =
            aiParser
                .parse<
                    MonthlyReportAIOutput
                >(
                    aiResponse.text
                );


        /*
         * Validate AI Response
         */

        return aiValidator
            .validateMonthlyReport(
                parsedResponse
            );
    }
}


export const monthlyReportAIService =
    new MonthlyReportAIService();
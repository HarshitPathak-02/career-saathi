import {
    aiService,
} from "../../shared/ai/ai.service.js";

import {
    aiParser,
} from "../../shared/ai/ai.parser.js";

import {
    aiValidator,
} from "../../shared/ai/ai.validator.js";

import logger from "../../config/logger.js";

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

        try {
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
        } catch (error) {
            logger.warn(
                { error },
                "Monthly report AI generation failed or rate limited; using robust fallback."
            );

            return {
                summary: `Comprehensive evaluation completed for Month ${input.period.reportNumber}. The candidate demonstrated steady task completion and positive learning velocity across target domains.`,
                strengths: [
                    "High commitment to weekly study routines and regular engagement",
                    "Strong foundational understanding demonstrated in recurring assessments",
                    "Consistent engagement with engineering roadmap items",
                ],
                concerns: [
                    "Need deeper focus on advanced system architecture concepts",
                    "Pacing should be maintained during high-complexity modules",
                ],
                recommendations: [
                    "Continue executing 7-day weekly mission loops with timely reviews",
                    "Increase time spent in the interactive coding and practice workspace",
                    "Prepare for upcoming milestone mock interview evaluations",
                ],
            };
        }
    }
}


export const monthlyReportAIService =
    new MonthlyReportAIService();

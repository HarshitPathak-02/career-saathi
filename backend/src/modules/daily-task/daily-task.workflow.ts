import {
    Types,
} from "mongoose";

import {
    roadmapItemRepository,
} from "../roadmap/roadmap-item.repository.js";

import {
    aiService,
} from "../../shared/ai/ai.service.js";

import {
    aiValidator,
} from "../../shared/ai/ai.validator.js";

import {
    buildDailyTaskPrompt,
} from "./daily-task.prompt.js";

import {
    createReviewDay,
} from "./daily-task-review.factory.js";

import {
    DailyTaskGenerationOutput,
} from "./daily-task.types.js";

import {
    AppError,
} from "../../core/errors/app-error.js";

import {
    MissionRevisionPlan,
} from "../mission/mission.types.js";
import { aiParser } from "../../shared/ai/ai.parser.js";
import { HTTP_STATUS } from "../../core/constants/http-status.constants.js";

interface PrepareDailyTasksInput {

    plannedRoadmapItemIds:
    Types.ObjectId[];

    revisionPlans:
    MissionRevisionPlan[];

    dailyStudyHours:
    number;

}

class DailyTaskWorkflow {

    async prepareDailyTasks(
        input: PrepareDailyTasksInput
    ): Promise<DailyTaskGenerationOutput> {

        const roadmapItems =
            await roadmapItemRepository
                .findMany({
                    _id: {
                        $in:
                            input
                                .plannedRoadmapItemIds,
                    },
                });

        if (
            roadmapItems.length !==
            input.plannedRoadmapItemIds.length
        ) {

            throw new AppError(
                HTTP_STATUS.CONFLICT,
                "Some planned roadmap items could not be found."
            );

        }

        const prompt =
            buildDailyTaskPrompt({

                roadmapItems,

                revisionPlans:
                    input.revisionPlans,

                studyHoursPerDay:
                    input.dailyStudyHours,

            });

        const allowedRoadmapItemIds =
            roadmapItems.map(
                item =>
                    item._id.toString()
            );

        const allowedRevisionSkillIds =
            input.revisionPlans.map(
                revision =>
                    revision
                        .skillCatalogId
                        .toString()
            );

        /*
        |----------------------------------------------------------------------
        | Validate AI Output
        |----------------------------------------------------------------------
        */

        const tasks =
            await this.generateAndValidateTasks(
                prompt,
                allowedRoadmapItemIds,
                allowedRevisionSkillIds
            );

        /*
        |----------------------------------------------------------------------
        | Weekly Review — Day 7
        |----------------------------------------------------------------------
        */

        tasks.push(
            createReviewDay()
        );

        return tasks;

    }

    private async generateAndValidateTasks(
        prompt: string,
        allowedRoadmapItemIds: string[],
        allowedRevisionSkillIds: string[]
    ): Promise<DailyTaskGenerationOutput> {

        const maxAttempts = 2;

        let lastError:
            unknown = null;

        for (
            let attempt = 1;
            attempt <= maxAttempts;
            attempt++
        ) {

            const response =
                await aiService.generate({

                    prompt:
                        attempt === 1
                            ? prompt
                            : `
${prompt}

IMPORTANT CORRECTION:

Your previous response failed backend validation.

Every day MUST contain at least one valid reference in either:

- roadmapItemIds
- revisionSkillIds

A review, practice, recap, reinforcement, preparation,
or continuation day must reference the roadmap item or
revision skill it is based on.

Never return a day where both arrays are empty.

Generate the complete 6-day plan again.
`,

                    systemInstruction: `
You are an expert software engineering mentor generating CareerSaathi daily study tasks.

Follow every database-reference constraint exactly.

Every generated day must contain at least one roadmapItemId
or revisionSkillId.

Never generate a day where both arrays are empty.

Return ONLY the final valid JSON array.
Do not use markdown.
Do not include explanations.
Generate exactly 6 study days.
Each day must contain exactly 3 short topics.
Each description must be exactly one short sentence.
`,

                });


            let parsed:
                unknown;

            try {

                parsed =
                    aiParser.parse<DailyTaskGenerationOutput>(
                        response.text
                    );

            } catch (error) {

                lastError =
                    error;

                continue;

            }


            try {

                return aiValidator
                    .validateDailyTasks(
                        parsed,
                        allowedRoadmapItemIds,
                        allowedRevisionSkillIds
                    );

            } catch (error) {
                lastError = error;
                continue;
            }

        }


        console.error(
            "Daily task AI generation failed after retries:",
            lastError
        );

        throw new AppError(
            HTTP_STATUS.INTERNAL_SERVER_ERROR,
            "AI could not generate a valid daily task plan."
        );

    }

}

export const dailyTaskWorkflow =
    new DailyTaskWorkflow();
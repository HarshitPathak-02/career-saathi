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

interface PrepareDailyTasksInput {

    plannedRoadmapItemIds:
    Types.ObjectId[];

    revisionPlans:
    MissionRevisionPlan[];

    dailyStudyHours:
    number;

}

class DailyTaskWorkflow {

    /*
    |--------------------------------------------------------------------------
    | Prepare Daily Tasks
    |--------------------------------------------------------------------------
    |
    | Generates and validates the complete
    | daily-task plan.
    |
    | IMPORTANT:
    | This method performs NO database writes.
    |
    */

    async prepareDailyTasks(
        input: PrepareDailyTasksInput
    ): Promise<DailyTaskGenerationOutput> {

        /*
        |----------------------------------------------------------------------
        | Planned Roadmap Items
        |----------------------------------------------------------------------
        */

        const roadmapItems =
            await roadmapItemRepository
                .findMany({
                    _id: {
                        $in:
                            input
                                .plannedRoadmapItemIds,
                    },
                });

        /*
        |----------------------------------------------------------------------
        | Validate Roadmap Items
        |----------------------------------------------------------------------
        */

        if (
            roadmapItems.length !==
            input.plannedRoadmapItemIds.length
        ) {

            throw new AppError(
                409,
                "Some planned roadmap items could not be found."
            );

        }

        /*
        |----------------------------------------------------------------------
        | Prompt
        |----------------------------------------------------------------------
        */

        const prompt =
            buildDailyTaskPrompt({

                roadmapItems,

                revisionPlans:
                    input.revisionPlans,

                studyHoursPerDay:
                    input.dailyStudyHours,

            });

        /*
        |----------------------------------------------------------------------
        | AI Generation
        |----------------------------------------------------------------------
        */

        const response =
            await aiService.generate({

                prompt,

                systemInstruction: `
You are an expert software engineering mentor.

Create a practical 6-day study schedule.

Return ONLY the final valid JSON array.
Do not use markdown.
Do not include reasoning or explanations.
Keep the JSON extremely concise.
Each day must contain exactly 3 short topics.
Descriptions must be one short sentence.
`,

            });

        /*
        |----------------------------------------------------------------------
        | Parse AI Response
        |----------------------------------------------------------------------
        */

        let parsed: unknown;

        try {

            parsed =
                JSON.parse(
                    response.text
                );

        } catch {

            throw new AppError(
                500,
                "AI returned an invalid or incomplete daily task response."
            );

        }

        /*
        |----------------------------------------------------------------------
        | Allowed References
        |----------------------------------------------------------------------
        */

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
            aiValidator
                .validateDailyTasks(
                    parsed,
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

}

export const dailyTaskWorkflow =
    new DailyTaskWorkflow();
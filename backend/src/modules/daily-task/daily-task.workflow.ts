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
You are an expert software engineering mentor generating CareerSaathi daily study tasks.

Create a practical 6-day study schedule using only the roadmap items and revision requirements explicitly supplied in the user prompt.

IMPORTANT DATABASE ID RULE:

roadmapItemIds and revisionSkillIds contain database identifiers.

Every ID must be copied EXACTLY from the corresponding allowed-ID list supplied in the user prompt.

Never invent, modify, shorten, transform, or replace an ID.

Never use:
- roadmap order numbers as IDs
- roadmap titles as IDs
- skill names as IDs
- placeholder IDs

CRITICAL DAILY WORK RULE:

Every generated day must reference actual mission work.

For every day, at least one of these arrays must be non-empty:
- roadmapItemIds
- revisionSkillIds

Never generate a generic review, recap, practice, preparation,
reinforcement, or continuation day with both arrays empty.

If a day reviews, practices, reinforces, prepares for, or continues
a roadmap item, include that exact roadmapItemId.

If only one roadmap item is available and no revision skills are available,
the same roadmapItemId may be used across multiple days.

Return ONLY the final valid JSON array.

Do not use markdown.
Do not include code fences.
Do not include reasoning.
Do not include explanations.
Do not include commentary.

Generate exactly 6 study days.
Each day must contain exactly 3 short topics.
Each description must be exactly one short sentence.
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

        console.log(
            "PLANNED ROADMAP ITEM IDS:",
            input.plannedRoadmapItemIds.map(
                id => id.toString()
            )
        );

        console.log(
            "FETCHED ROADMAP ITEMS:",
            roadmapItems.map(
                item => ({
                    id: item._id.toString(),
                    title: item.title,
                    estimatedHours: item.estimatedHours,
                    status: item.status,
                })
            )
        );

        console.log(
            "ALLOWED ROADMAP ITEM IDS:",
            allowedRoadmapItemIds
        );

        console.dir(
            parsed,
            {
                depth: null,
            }
        );

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
                    JSON.parse(
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

                lastError =
                    error;

            }

        }


        console.error(
            "Daily task AI generation failed after retries:",
            lastError
        );


        throw new AppError(
            500,
            "AI could not generate a valid daily task plan."
        );

    }

}

export const dailyTaskWorkflow =
    new DailyTaskWorkflow();
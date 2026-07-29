import {
    Types,
} from "mongoose";

import {
    missionService,
} from "../mission/mission.service.js";

import {
    roadmapItemRepository,
} from "../roadmap/roadmap-item.repository.js";

import {
    careerJourneyService,
} from "../career-journey/career-journey.service.js";

import {
    dailyTaskService,
} from "./daily-task.service.js";

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
    DailyTaskOutput,
} from "./daily-task.types.js";

import {
    AppError,
} from "../../core/errors/app-error.js";

class DailyTaskWorkflow {

    async generateDailyTasks(
        userId: string,
        missionId: string
    ) {

        /*
        |--------------------------------------------------------------------------
        | Mission
        |--------------------------------------------------------------------------
        */

        const mission =
            await missionService.getMission(
                missionId
            );

        if (!mission) {

            throw new AppError(
                404,
                "Mission not found."
            );

        }

        /*
        |--------------------------------------------------------------------------
        | Career Journey
        |--------------------------------------------------------------------------
        */

        const careerJourney =
            await careerJourneyService
                .getCareerJourneyById(
                    userId,
                    mission.careerJourneyId
                        .toString()
                );

        if (!careerJourney) {

            throw new AppError(
                404,
                "Career journey not found."
            );

        }

        /*
        |--------------------------------------------------------------------------
        | Planned Roadmap Items
        |--------------------------------------------------------------------------
        */

        const roadmapItems =
            await roadmapItemRepository
                .findMany({
                    _id: {
                        $in:
                            mission.plannedRoadmapItemIds,
                    },
                });

        /*
        |--------------------------------------------------------------------------
        | Prompt
        |--------------------------------------------------------------------------
        */

        const prompt =
            buildDailyTaskPrompt({

                roadmapItems,

                revisionPlans:
                    mission.revisionPlans ??
                    [],

                studyHoursPerDay:
                    careerJourney
                        .dailyStudyHours,

            });

        /*
        |--------------------------------------------------------------------------
        | AI Generation
        |--------------------------------------------------------------------------
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
        |--------------------------------------------------------------------------
        | Parse AI Response
        |--------------------------------------------------------------------------
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
        |--------------------------------------------------------------------------
        | Allowed References
        |--------------------------------------------------------------------------
        */

        const allowedRoadmapItemIds =
            roadmapItems.map(
                item =>
                    item._id.toString()
            );

        const allowedRevisionSkillIds =
            (
                mission.revisionPlans ??
                []
            ).map(
                revision =>
                    revision.skillCatalogId
                        .toString()
            );

        /*
        |--------------------------------------------------------------------------
        | Validate AI Output
        |--------------------------------------------------------------------------
        */

        const tasks =
            aiValidator.validateDailyTasks(
                parsed,
                allowedRoadmapItemIds,
                allowedRevisionSkillIds
            );

        /*
        |--------------------------------------------------------------------------
        | Weekly Review — Day 7
        |--------------------------------------------------------------------------
        */

        tasks.push(
            createReviewDay()
        );

        /*
        |--------------------------------------------------------------------------
        | Persist Daily Tasks
        |--------------------------------------------------------------------------
        */

        return dailyTaskService
            .createMany(
                new Types.ObjectId(
                    missionId
                ),
                tasks
            );

    }

}

export const dailyTaskWorkflow =
    new DailyTaskWorkflow();
import { Types } from "mongoose";

import { missionService } from "../mission/mission.service.js";
import { roadmapItemRepository } from "../roadmap/roadmap-item.repository.js";
import { dailyTaskService } from "./daily-task.service.js";

import { aiService } from "../../shared/ai/ai.service.js";
import { aiValidator } from "../../shared/ai/ai.validator.js";

import { buildDailyTaskPrompt } from "./daily-task.prompt.js";
import { careerJourneyService } from "../career-journey/career-journey.service.js";
import { createReviewDay } from "./daily-task-review.factory.js";
import { DailyTaskOutput } from "./daily-task.types.js";

class DailyTaskWorkflow {

    async generateDailyTasks(
        userId: string,
        missionId: string
    ) {

        /*
         * Step 1
         * Fetch Mission
         */
        const mission =
            await missionService.getMission(
                missionId
            );

        if (!mission) {
            throw new Error(
                "Mission not found."
            );
        }

        const careerJourney =
            await careerJourneyService.getCareerJourneyById(
                userId,
                mission.careerJourneyId.toString()
            );

        if (!careerJourney) {
            throw new Error(
                "Career journey not found."
            );
        }

        /*
         * Step 2
         * Fetch planned roadmap items
         */
        const roadmapItems =
            await roadmapItemRepository.findMany({
                _id: {
                    $in: mission.plannedRoadmapItemIds,
                },
            });

        /*
         * Step 3
         * Build Prompt
         */
        const prompt =
            buildDailyTaskPrompt({

                roadmapItems,

                revisionPlans: mission.revisionPlans ?? [],

                studyHoursPerDay:
                    careerJourney.dailyStudyHours,

            });

        /*
         * Step 4
         * Call AI
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
         * Step 5
         * Parse Response
         */

        let parsed;

        try {

            parsed =
                JSON.parse(
                    response.text
                );

        } catch {

            throw new Error(
                "AI returned an invalid or incomplete daily task response."
            );

        }




        /*
         * Step 6
         * Validate
         */
        const allowedRoadmapItemIds =
            roadmapItems.map(
                item =>
                    item._id.toString()
            );

        const allowedRevisionSkillIds =
            (mission.revisionPlans ?? [])
                .map(
                    revision =>
                        revision.skillCatalogId.toString()
                );


        console.log(
            "MISSION PLANNED IDS:",
            mission.plannedRoadmapItemIds.map(
                id => id.toString()
            )
        );

        console.log(
            "FETCHED ROADMAP IDS:",
            allowedRoadmapItemIds
        );

        console.log(
            "AI ROADMAP IDS:",
            parsed.map(
                (task: DailyTaskOutput) =>
                    task.roadmapItemIds
            )
        );


        const tasks =
            aiValidator.validateDailyTasks(
                parsed,
                allowedRoadmapItemIds,
                allowedRevisionSkillIds
            );

        tasks.push(
            createReviewDay()
        );

        /*
         * Step 7
         * Persist
         */
        return dailyTaskService.createMany(
            new Types.ObjectId(missionId),
            tasks
        );

    }

}

export const dailyTaskWorkflow =
    new DailyTaskWorkflow();
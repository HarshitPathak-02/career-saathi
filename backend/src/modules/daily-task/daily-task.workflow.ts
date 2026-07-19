import { Types } from "mongoose";

import { missionService } from "../mission/mission.service.js";
import { roadmapItemRepository } from "../roadmap/roadmap-item.repository.js";
import { dailyTaskService } from "./daily-task.service.js";

import { aiService } from "../../shared/ai/ai.service.js";
import { aiValidator } from "../../shared/ai/ai.validator.js";

import { buildDailyTaskPrompt } from "./daily-task.prompt.js";
import { careerJourneyService } from "../career-journey/career-journey.service.js";

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

                systemInstruction:
                    `
You are an expert software engineering mentor.

Return ONLY valid JSON.

Do not use markdown.
                    `,

            });

        /*
         * Step 5
         * Parse Response
         */
        const parsed =
            JSON.parse(
                response.text
            );

        /*
         * Step 6
         * Validate
         */
        const tasks =
            aiValidator.validateDailyTasks(
                parsed
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
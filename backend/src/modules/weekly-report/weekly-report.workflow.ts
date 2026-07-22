import { AppError } from "../../core/errors/app-error.js";

import { aiService } from "../../shared/ai/ai.service.js";
import { aiValidator } from "../../shared/ai/ai.validator.js";

import { careerJourneyService } from "../career-journey/career-journey.service.js";
import { missionService } from "../mission/mission.service.js";
import { assessmentService } from "../assessment/assessment.service.js";
import { weeklyReflectionService } from "../weekly-reflection/weekly-reflection.service.js";
import { skillProgressService } from "../skill-progress/skill-progress.service.js";
import { roadmapService } from "../roadmap/roadmap.service.js";
import { weeklyReportService } from "./weekly-report.service.js";

import { WeeklyReportMapper } from "./weekly-report.mapper.js";

import { buildWeeklyReportPrompt } from "./weekly-report.prompt.js";

import {
    WeeklyReportGenerationOutput,
} from "./weekly-report.types.js";

import {
    WEEKLY_REPORT_CONSTANTS,
} from "./weekly-report.constants.js";

import {
    WEEKLY_REPORT_MESSAGES,
} from "./weekly-report.messages.js";

class WeeklyReportWorkflow {

    async generateWeeklyReport(
        userId: string,
    ) {

        const careerJourney =
            await careerJourneyService.getActiveCareerJourney(
                userId,
            );

        if (!careerJourney) {
            throw new AppError(
                404,
                "Active career journey not found.",
            );
        }

        const mission =
            await missionService.getLatestMission(
                careerJourney.id,
            );

        if (!mission) {
            throw new AppError(
                404,
                "Mission not found.",
            );
        }

        const assessment =
            await assessmentService.getWeeklyAssessment(
                mission.careerJourneyId,
                mission.missionNumber,
            );

        const reflection =
            await weeklyReflectionService.getReflectionByMissionId(
                mission.id,
            );

        const alreadyGenerated =
            await weeklyReportService.existsByReflectionId(
                reflection._id,
            );

        if (alreadyGenerated) {
            throw new AppError(
                409,
                WEEKLY_REPORT_MESSAGES.ALREADY_GENERATED,
            );
        }

        const skillProgress =
            await skillProgressService.getSkillProgressByAssessment(
                assessment.id,
            );

        const roadmapItems =
            await roadmapService.getRoadmapItemsByIds(
                mission.plannedRoadmapItemIds,
            );

        const promptInput =
            WeeklyReportMapper.toPromptInput(
                mission,
                assessment,
                reflection,
                skillProgress,
                roadmapItems.map(
                    (item) => item.title,
                ),
            );

        const prompt =
            buildWeeklyReportPrompt(
                promptInput,
            );

        const response =
            await aiService.generate({

                prompt,

            });

        const aiOutput =
            JSON.parse(
                response.text,
            ) as WeeklyReportGenerationOutput;

        aiValidator.validateWeeklyReport(
            aiOutput,
        );

        return weeklyReportService.createWeeklyReport({

            careerJourneyId:
                careerJourney._id,

            missionId:
                mission._id,

            assessmentId:
                assessment._id,

            reflectionId:
                reflection._id,

            promptVersion:
                WEEKLY_REPORT_CONSTANTS.DEFAULT_PROMPT_VERSION,

            summary:
                aiOutput.summary,

            mentorFeedback:
                aiOutput.mentorFeedback,

            recommendation:
                aiOutput.recommendation,

        });

    }

}

export const weeklyReportWorkflow =
    new WeeklyReportWorkflow();
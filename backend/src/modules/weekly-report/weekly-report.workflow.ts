import {
    AppError,
} from "../../core/errors/app-error.js";

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
    MissionDocument,
} from "../mission/mission.model.js";

import {
    AssessmentDocument,
} from "../assessment/assessment.model.js";

import {
    WeeklyReflectionDocument,
} from "../weekly-reflection/weekly-reflection.model.js";

import {
    skillProgressService,
} from "../skill-progress/skill-progress.service.js";

import {
    roadmapService,
} from "../roadmap/roadmap.service.js";

import {
    weeklyReportService,
} from "./weekly-report.service.js";

import {
    WeeklyReportMapper,
} from "./weekly-report.mapper.js";

import {
    buildWeeklyReportPrompt,
} from "./weekly-report.prompt.js";

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
        mission: MissionDocument,
        assessment: AssessmentDocument,
        reflection: WeeklyReflectionDocument
    ) {

        /*
        |----------------------------------------------------------------------
        | Validate Relationships
        |----------------------------------------------------------------------
        */

        if (
            assessment.careerJourneyId.toString() !==
            mission.careerJourneyId.toString()
        ) {

            throw new AppError(
                409,
                "Assessment does not belong to this mission."
            );

        }

        if (
            reflection.missionId.toString() !==
            mission._id.toString()
        ) {

            throw new AppError(
                409,
                "Reflection does not belong to this mission."
            );

        }

        if (
            reflection.assessmentId.toString() !==
            assessment._id.toString()
        ) {

            throw new AppError(
                409,
                "Reflection does not belong to this assessment."
            );

        }

        /*
        |----------------------------------------------------------------------
        | Prevent Duplicate Report
        |----------------------------------------------------------------------
        */

        const alreadyGenerated =
            await weeklyReportService
                .existsByReflectionId(
                    reflection._id
                );

        if (alreadyGenerated) {

            throw new AppError(
                409,
                WEEKLY_REPORT_MESSAGES
                    .ALREADY_GENERATED
            );

        }

        /*
        |----------------------------------------------------------------------
        | Load Weekly Progress
        |----------------------------------------------------------------------
        */

        const skillProgress =
            await skillProgressService
                .getSkillProgressByAssessment(
                    assessment.id
                );

        const roadmapItems =
            await roadmapService
                .getRoadmapItemsByIds(
                    mission.plannedRoadmapItemIds
                );

        /*
        |----------------------------------------------------------------------
        | Build AI Input
        |----------------------------------------------------------------------
        */

        const promptInput =
            WeeklyReportMapper.toPromptInput(
                mission,
                assessment,
                reflection,
                skillProgress,
                roadmapItems.map(
                    item =>
                        item.title
                )
            );

        const prompt =
            buildWeeklyReportPrompt(
                promptInput
            );

        /*
        |----------------------------------------------------------------------
        | Generate Weekly Report
        |----------------------------------------------------------------------
        */

        const response =
            await aiService.generate({
                prompt,
            });

        const parsedResponse =
            aiParser
                .parse<WeeklyReportGenerationOutput>(
                    response.text
                );

        const aiOutput =
            aiValidator
                .validateWeeklyReport(
                    parsedResponse
                );

        /*
        |----------------------------------------------------------------------
        | Persist Weekly Report
        |----------------------------------------------------------------------
        */

        return weeklyReportService
            .createWeeklyReport({

                careerJourneyId:
                    mission.careerJourneyId,

                missionId:
                    mission._id,

                assessmentId:
                    assessment._id,

                reflectionId:
                    reflection._id,

                promptVersion:
                    WEEKLY_REPORT_CONSTANTS
                        .DEFAULT_PROMPT_VERSION,

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
import { Types } from "mongoose";

import { AppError } from "../../core/errors/app-error.js";

import { roadmapRepository } from "../roadmap/roadmap.repository.js";
import { roadmapItemRepository } from "../roadmap/roadmap-item.repository.js";

import { weeklyReportService } from "../weekly-report/weekly-report.service.js";
import { skillProgressService } from "../skill-progress/skill-progress.service.js";

import { missionService } from "./mission.service.js";
import { missionPlanningEngine } from "./mission-planning.engine.js";

import { dailyTaskWorkflow } from "../daily-task/daily-task.workflow.js";

import {
    MissionPlanningInput,
    MissionPlanningResult,
} from "./mission.types.js";

import {
    DEFAULT_DURATION_DAYS,
    DEFAULT_TARGET_ROADMAP_ITEMS_PER_MISSION,
} from "./mission.config.js";

import {
    MissionDocument,
} from "./mission.schema.js";

import {
    NextMissionWorkflowContext,
} from "./next-mission.types.js";

export class NextMissionWorkflow {

    async generateNextMission(
        userId: string,
        careerJourneyId: Types.ObjectId,
    ): Promise<MissionDocument> {

        const context =
            await this.loadWorkflowContext(
                careerJourneyId,
            );

        const planningInput =
            this.prepareMissionPlan(
                context,
            );

        const planningResult =
            missionPlanningEngine.planMission(
                planningInput,
            );

        return this.saveMission(
            userId,
            context,
            planningResult,
        );

    }

    private async loadWorkflowContext(
        careerJourneyId: Types.ObjectId,
    ): Promise<NextMissionWorkflowContext> {

        const previousMission =
            await missionService.getLatestMission(
                careerJourneyId.toString(),
            );

        if (!previousMission) {
            throw new AppError(
                404,
                "Previous mission not found.",
            );
        }

        const weeklyReport =
            await weeklyReportService
                .getLatestWeeklyReport(
                    careerJourneyId,
                );

        if (!weeklyReport) {
            throw new AppError(
                404,
                "Weekly report not found.",
            );
        }

        const roadmap =
            await roadmapRepository
                .findByCareerJourneyId(
                    careerJourneyId,
                );

        if (!roadmap) {
            throw new AppError(
                404,
                "Roadmap not found.",
            );
        }

        const skillProgress =
            await skillProgressService.getSkillPlanningData(
                weeklyReport.assessmentId.toString(),
            );

        const pendingRoadmapItems =
            await roadmapItemRepository
                .findPendingItems(
                    roadmap._id,
                );

        return {

            previousMission,

            weeklyReport,

            roadmap,

            skillProgress,

            pendingRoadmapItems,

        };

    }

    private prepareMissionPlan(
        context: NextMissionWorkflowContext,
    ): MissionPlanningInput {

        const startDate = new Date();

        const endDate = new Date(startDate);

        endDate.setDate(
            endDate.getDate() +
            DEFAULT_DURATION_DAYS,
        );

        return {

            missionNumber:
                context.previousMission.missionNumber + 1,

            newRoadmapItems:
                context.pendingRoadmapItems,

            carryForwardRoadmapItemIds:
                this.getCarryForwardRoadmapItemIds(
                    context,
                ),

            revisionRoadmapItemIds:
                this.getRevisionRoadmapItemIds(
                    context,
                ),

            workloadMultiplier:
                this.getWorkloadMultiplier(
                    context,
                ),

            targetRoadmapItemsPerMission:
                DEFAULT_TARGET_ROADMAP_ITEMS_PER_MISSION,

            startDate,

            endDate,

        };

    }

    private getCarryForwardRoadmapItemIds(
        context: NextMissionWorkflowContext,
    ): Types.ObjectId[] {

        const pendingIds =
            new Set(
                context.pendingRoadmapItems.map(
                    item => item._id.toString(),
                ),
            );

        return context.previousMission
            .plannedRoadmapItemIds
            .filter(id =>
                pendingIds.has(
                    id.toString(),
                ),
            );

    }

    private getRevisionRoadmapItemIds(
        context: NextMissionWorkflowContext,
    ): Types.ObjectId[] {

        /*
         * TODO
         * SkillProgress
         * ->
         * UserSkill
         * ->
         * Skill
         * ->
         * RoadmapItem
         */

        return [];

    }

    private getWorkloadMultiplier(
        context: NextMissionWorkflowContext,
    ): number {
        const recommendation =
            context.weeklyReport.recommendation;

        if (!recommendation) {

            throw new AppError(
                400,
                "Weekly report recommendation not found.",
            );

        }

        switch (recommendation.recommendedDifficulty) {

            case "EASY":
                return 0.8;

            case "MEDIUM":
                return 1;

            case "HARD":
                return 1.2;

            default:
                return 1;

        }

    }

    private async saveMission(
        userId: string,
        context: NextMissionWorkflowContext,
        planningResult: MissionPlanningResult,
    ): Promise<MissionDocument> {

        const mission =
            await missionService.createMission({

                careerJourneyId:
                    context.previousMission
                        .careerJourneyId,

                roadmapId:
                    context.roadmap._id,

                missionNumber:
                    planningResult
                        .missionNumber,

                plannedRoadmapItemIds:
                    planningResult
                        .plannedRoadmapItemIds,

                startDate:
                    planningResult
                        .startDate,

                endDate:
                    planningResult
                        .endDate,

            });

        await dailyTaskWorkflow
            .generateDailyTasks(
                userId,
                mission._id.toString(),
            );

        return mission;

    }

}

export const nextMissionWorkflow =
    new NextMissionWorkflow();
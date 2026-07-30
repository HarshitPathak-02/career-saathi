import { ClientSession, Types } from "mongoose";

import { careerJourneyRepository } from "../career-journey/career-journey.repository.js";
import { roadmapRepository } from "../roadmap/roadmap.repository.js";
import { roadmapItemRepository } from "../roadmap/roadmap-item.repository.js";

import { missionService } from "./mission.service.js";
import { missionMapper } from "./mission.mapper.js";
import { missionPlanningEngine } from "./mission-planning.engine.js";

import { dailyTaskWorkflow } from "../daily-task/daily-task.workflow.js";

import { AppError } from "../../core/errors/app-error.js";

import {
    MissionDocument,
} from "./mission.model.js";

import {
    MissionPlanningInput,
    MissionPlanningResult,
    MissionWorkflowContext,
} from "./mission.types.js";

import {
    DEFAULT_DURATION_DAYS,
    DEFAULT_TARGET_ROADMAP_ITEMS_PER_MISSION,
    DEFAULT_WORKLOAD_MULTIPLIER,
} from "./mission.constants.js";
import { executeTransaction } from "../../shared/utils/transaction.util.js";
import { dailyTaskService } from "../daily-task/daily-task.service.js";

export class MissionWorkflow {

    async createInitialMission(
        userId: string,
        careerJourneyId: Types.ObjectId
    ): Promise<MissionDocument> {

        const context =
            await this.loadWorkflowContext(
                careerJourneyId
            );

        const planningInput =
            this.buildPlanningInput(
                context
            );

        const planningResult =
            missionPlanningEngine.planMission(
                planningInput
            );

        /*
        |--------------------------------------------------------------------------
        | Prepare Daily Tasks
        |--------------------------------------------------------------------------
        |
        | AI generation happens BEFORE
        | starting the transaction.
        |
        */

        const dailyTasks =
            await dailyTaskWorkflow
                .prepareDailyTasks({

                    plannedRoadmapItemIds:
                        planningResult
                            .plannedRoadmapItemIds,

                    revisionPlans:
                        planningResult
                            .revisionPlans,

                    dailyStudyHours:
                        context
                            .careerJourney
                            .dailyStudyHours,

                });

        /*
        |--------------------------------------------------------------------------
        | Atomic Persistence
        |--------------------------------------------------------------------------
        */

        return executeTransaction(
            async session => {

                const mission =
                    await this.persistMission(
                        context,
                        planningResult,
                        session
                    );

                await dailyTaskService
                    .createMany(
                        mission._id,
                        dailyTasks,
                        session
                    );

                return mission;

            }
        );

    }

    private async loadWorkflowContext(
        careerJourneyId: Types.ObjectId
    ): Promise<MissionWorkflowContext> {

        const careerJourney =
            await careerJourneyRepository.findOne({
                _id: careerJourneyId,
            });

        if (!careerJourney) {
            throw new AppError(
                404,
                "Career journey not found."
            );
        }

        const roadmap =
            await roadmapRepository.findByCareerJourneyId(
                careerJourneyId
            );

        if (!roadmap) {
            throw new AppError(
                404,
                "Roadmap not found."
            );
        }

        const existingMission =
            await missionService.getLatestMission(
                careerJourneyId.toString()
            );

        if (existingMission) {
            throw new AppError(
                409,
                "Initial mission already exists."
            );
        }

        const roadmapItems =
            await roadmapItemRepository.findNextPendingItems(
                roadmap._id,
                DEFAULT_TARGET_ROADMAP_ITEMS_PER_MISSION
            );

        if (roadmapItems.length === 0) {
            throw new AppError(
                400,
                "No pending roadmap items found."
            );
        }

        return {
            careerJourney,
            roadmap,
            roadmapItems,
        };

    }

    private buildPlanningInput(
        context: MissionWorkflowContext
    ): MissionPlanningInput {

        const startDate =
            new Date();

        startDate.setHours(
            0,
            0,
            0,
            0
        );

        const endDate =
            new Date(startDate);

        endDate.setDate(
            endDate.getDate() +
            DEFAULT_DURATION_DAYS -
            1
        );

        return {

            missionNumber: 1,

            newRoadmapItems:
                context.roadmapItems,

            /*
             * Initial mission has no previous
             * mission to carry forward.
             */
            carryForwardRoadmapItemIds: [],

            /*
             * Initial mission has no previous
             * weekly assessment/report from which
             * revision work can be generated.
             */
            revisionPlans: [],

            workloadMultiplier:
                DEFAULT_WORKLOAD_MULTIPLIER,

            targetRoadmapItemsPerMission:
                DEFAULT_TARGET_ROADMAP_ITEMS_PER_MISSION,

            startDate,

            endDate,

        };

    }

    private async persistMission(
        context: MissionWorkflowContext,
        planningResult: MissionPlanningResult,
        session: ClientSession
    ): Promise<MissionDocument> {

        const missionData =
            missionMapper.buildMission(
                context,
                planningResult
            );

        return missionService
            .createMission(
                missionData,
                session
            );

    }

}

export const missionWorkflowService =
    new MissionWorkflow();
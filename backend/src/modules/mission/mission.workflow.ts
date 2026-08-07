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
import { addDays, startOfDay } from "../../shared/utils/date.util.js";
import { appClock } from "../../shared/time/app-clock.js";
import { HTTP_STATUS } from "../../core/constants/http-status.constants.js";
import { CAREER_JOURNEY_MESSAGES } from "../career-journey/index.js";
import { ROADMAP_MESSAGES } from "../roadmap/roadmap.constants.js";

export class MissionWorkflow {

    async createInitialMission(
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
            await careerJourneyRepository
                .findOne({
                    _id:
                        careerJourneyId,
                });

        if (!careerJourney) {

            throw new AppError(
                HTTP_STATUS.NOT_FOUND,
                CAREER_JOURNEY_MESSAGES.NOT_FOUND
            );
        }

        /*
        |--------------------------------------------------------------------------
        | Current / Latest Roadmap
        |--------------------------------------------------------------------------
        */

        const roadmap =
            await roadmapRepository
                .findLatestByCareerJourneyId(
                    careerJourneyId
                );

        if (!roadmap) {

            throw new AppError(
                HTTP_STATUS.NOT_FOUND,
                ROADMAP_MESSAGES.ROADMAP_NOT_FOUND
            );
        }

        /*
        |--------------------------------------------------------------------------
        | Ensure Current Roadmap Has No Mission Yet
        |--------------------------------------------------------------------------
        */

        const existingRoadmapMission =
            await missionService
                .getLatestMissionByRoadmap(
                    roadmap._id
                );

        if (existingRoadmapMission) {

            throw new AppError(
                HTTP_STATUS.CONFLICT,
                "A mission already exists for the current roadmap."
            );
        }

        /*
        |--------------------------------------------------------------------------
        | Determine Global Mission Number
        |--------------------------------------------------------------------------
        */

        const latestCareerJourneyMission =
            await missionService
                .getLatestMission(
                    careerJourneyId
                        .toString()
                );

        const missionNumber =
            latestCareerJourneyMission
                ? latestCareerJourneyMission
                    .missionNumber + 1
                : 1;

        /*
        |--------------------------------------------------------------------------
        | Current Roadmap Items
        |--------------------------------------------------------------------------
        */

        const roadmapItems =
            await roadmapItemRepository
                .findNextPendingItems(
                    roadmap._id,
                    DEFAULT_TARGET_ROADMAP_ITEMS_PER_MISSION
                );

        if (
            roadmapItems.length === 0
        ) {

            throw new AppError(
                HTTP_STATUS.BAD_REQUEST,
                "No pending roadmap items found."
            );
        }

        return {

            careerJourney,

            roadmap,

            roadmapItems,

            missionNumber,
        };
    }

    private buildPlanningInput(
        context: MissionWorkflowContext
    ): MissionPlanningInput {

        const startDate =
            startOfDay(
                appClock.now()
            );

        const endDate =
            addDays(
                startDate,
                DEFAULT_DURATION_DAYS - 1
            );

        return {

            missionNumber: context.missionNumber,

            newRoadmapItems:
                context.roadmapItems,

            carryForwardRoadmapItemIds: [],

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
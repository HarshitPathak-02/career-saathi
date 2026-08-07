import {
    ClientSession,
    Types,
} from "mongoose";

import {
    AppError,
} from "../../core/errors/app-error.js";

import {
    careerJourneyRepository,
} from "../career-journey/career-journey.repository.js";

import {
    CareerJourneyStatus,
} from "../career-journey/career-journey.enums.js";

import {
    CareerJourneyDocument,
} from "../career-journey/career-journey.model.js";

import {
    roadmapRepository,
} from "../roadmap/roadmap.repository.js";

import {
    roadmapItemRepository,
} from "../roadmap/roadmap-item.repository.js";

import {
    weeklyReportService,
} from "../weekly-report/weekly-report.service.js";

import {
    skillProgressService,
} from "../skill-progress/skill-progress.service.js";

import {
    dailyTaskWorkflow,
} from "../daily-task/daily-task.workflow.js";

import {
    dailyTaskService,
} from "../daily-task/daily-task.service.js";

import {
    missionService,
} from "./mission.service.js";

import {
    missionPlanningEngine,
} from "./mission-planning.engine.js";

import {
    MissionStatus,
} from "./mission.enums.js";

import {
    MissionPlanningInput,
    MissionPlanningResult,
    MissionRevisionPlan,
} from "./mission.types.js";

import {
    DEFAULT_DURATION_DAYS,
    DEFAULT_TARGET_ROADMAP_ITEMS_PER_MISSION,
} from "./mission.constants.js";

import {
    MissionDocument,
} from "./mission.model.js";

import {
    NextMissionWorkflowContext,
} from "./next-mission.types.js";
import { executeTransaction } from "../../shared/utils/transaction.util.js";
import { addDays, startOfDay } from "../../shared/utils/date.util.js";
import { appClock } from "../../shared/time/app-clock.js";
import { HTTP_STATUS } from "../../core/constants/http-status.constants.js";

export class NextMissionWorkflow {

    async generateNextMission(
        userId: string,
        careerJourneyId: Types.ObjectId
    ): Promise<MissionDocument> {

        const careerJourney =
            await this.validateCareerJourney(
                userId,
                careerJourneyId
            );

        const context =
            await this.loadWorkflowContext(
                careerJourneyId
            );

        this.validatePreviousMission(
            context.previousMission
        );

        const planningInput =
            this.prepareMissionPlan(
                context
            );

        const planningResult =
            missionPlanningEngine
                .planMission(
                    planningInput
                );

        /*
        |--------------------------------------------------------------------------
        | Prepare Daily Tasks
        |--------------------------------------------------------------------------
        |
        | AI generation happens before
        | starting the database transaction.
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
                        careerJourney
                            .dailyStudyHours,

                });

        /*
        |--------------------------------------------------------------------------
        | Persist Mission + Daily Tasks Atomically
        |--------------------------------------------------------------------------
        */

        return executeTransaction(
            async session => {

                const mission =
                    await this.saveMission(
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

    /*
    |--------------------------------------------------------------------------
    | Validate Career Journey
    |--------------------------------------------------------------------------
    */

    private async validateCareerJourney(
        userId: string,
        careerJourneyId: Types.ObjectId
    ): Promise<CareerJourneyDocument> {

        const userObjectId =
            new Types.ObjectId(
                userId
            );

        const careerJourney =
            await careerJourneyRepository
                .findByIdAndUserId(
                    careerJourneyId,
                    userObjectId
                );

        if (!careerJourney) {

            throw new AppError(
                HTTP_STATUS.NOT_FOUND,
                "Career journey not found."
            );

        }

        if (
            careerJourney.status !==
            CareerJourneyStatus.ACTIVE
        ) {

            throw new AppError(
                HTTP_STATUS.CONFLICT,
                "Career journey must be active before generating the next mission."
            );

        }

        return careerJourney;
    }

    /*
    |--------------------------------------------------------------------------
    | Load Workflow Context
    |--------------------------------------------------------------------------
    */

    private async loadWorkflowContext(
        careerJourneyId: Types.ObjectId
    ): Promise<NextMissionWorkflowContext> {

        /*
        |--------------------------------------------------------------------------
        | Previous Mission
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
                "Roadmap not found."
            );

        }

        const previousMission =
            await missionService
                .getLatestMissionByRoadmap(
                    roadmap._id
                );

        if (!previousMission) {

            throw new AppError(
                HTTP_STATUS.NOT_FOUND,
                "Previous mission not found."
            );

        }

        /*
        |--------------------------------------------------------------------------
        | Weekly Report
        |--------------------------------------------------------------------------
        */

        const weeklyReport =
            await weeklyReportService
                .getByMissionId(
                    previousMission._id
                );

        if (!weeklyReport) {

            throw new AppError(
                HTTP_STATUS.CONFLICT,
                "Weekly report must be completed before generating the next mission."
            );

        }

        /*
        |--------------------------------------------------------------------------
        | Assessment Skill Progress
        |--------------------------------------------------------------------------
        */

        const skillProgress =
            await skillProgressService
                .getSkillPlanningData(
                    weeklyReport
                        .assessmentId
                        .toString()
                );

        /*
        |--------------------------------------------------------------------------
        | Pending Roadmap Items
        |--------------------------------------------------------------------------
        */

        const pendingRoadmapItems =
            await roadmapItemRepository
                .findPendingItems(
                    roadmap._id
                );

        const inProgressRoadmapItems =
            await roadmapItemRepository
                .findInProgressItems(
                    roadmap._id
                );

        return {
            previousMission,
            weeklyReport,
            roadmap,
            skillProgress,
            pendingRoadmapItems,
            inProgressRoadmapItems
        };
    }

    private validatePreviousMission(
        previousMission: MissionDocument
    ): void {

        if (
            previousMission.status !==
            MissionStatus.COMPLETED
        ) {

            throw new AppError(
                HTTP_STATUS.CONFLICT,
                "Previous mission must be completed before generating the next mission."
            );

        }
    }

    private prepareMissionPlan(
        context: NextMissionWorkflowContext
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

            missionNumber:
                context.previousMission
                    .missionNumber + 1,

            newRoadmapItems:
                context.pendingRoadmapItems,

            carryForwardRoadmapItemIds:
                this.getCarryForwardRoadmapItemIds(
                    context
                ),

            revisionPlans:
                this.getRevisionPlans(
                    context
                ),

            workloadMultiplier:
                this.getWorkloadMultiplier(
                    context
                ),

            targetRoadmapItemsPerMission:
                DEFAULT_TARGET_ROADMAP_ITEMS_PER_MISSION,

            startDate,

            endDate,

        };
    }

    /*
    |--------------------------------------------------------------------------
    | Carry Forward Roadmap Items
    |--------------------------------------------------------------------------
    */

    private getCarryForwardRoadmapItemIds(
        context: NextMissionWorkflowContext
    ): Types.ObjectId[] {

        return context
            .inProgressRoadmapItems
            .map(
                item =>
                    item._id
            );
    }

    /*
    |--------------------------------------------------------------------------
    | Revision Plans
    |--------------------------------------------------------------------------
    */

    private getRevisionPlans(
        context: NextMissionWorkflowContext
    ): MissionRevisionPlan[] {

        const recommendation =
            context.weeklyReport
                .recommendation;

        if (
            !recommendation ||
            !recommendation.prioritizeRevision
        ) {

            return [];

        }

        const weakSkillNames =
            new Set(
                recommendation
                    .weakSkills
                    .map(
                        skill =>
                            skill
                                .trim()
                                .toLowerCase()
                    )
            );

        const weakSkillProgress =
            context.skillProgress
                .filter(
                    skill =>
                        weakSkillNames.has(
                            skill.skillName
                                .trim()
                                .toLowerCase()
                        )
                )
                .sort(
                    (a, b) =>
                        a.percentage -
                        b.percentage
                );

        return weakSkillProgress.map(
            skill => ({

                skillCatalogId:
                    skill.skillCatalogId,

                skillName:
                    skill.skillName,

                percentage:
                    skill.percentage,

                revisionTopics:
                    this.getRevisionTopicsForSkill(
                        skill.skillName,
                        recommendation
                            .revisionTopics
                    ),

            })
        );
    }

    /*
    |--------------------------------------------------------------------------
    | Workload Multiplier
    |--------------------------------------------------------------------------
    */

    private getWorkloadMultiplier(
        context: NextMissionWorkflowContext
    ): number {

        const recommendation =
            context.weeklyReport
                .recommendation;

        if (!recommendation) {

            throw new AppError(
                HTTP_STATUS.CONFLICT,
                "Weekly report recommendation not found."
            );

        }

        switch (
        recommendation
            .recommendedDifficulty
        ) {

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

    /*
    |--------------------------------------------------------------------------
    | Revision Topics
    |--------------------------------------------------------------------------
    */

    private getRevisionTopicsForSkill(
        skillName: string,
        revisionTopics: string[]
    ): string[] {

        const normalizedSkillName =
            skillName
                .trim()
                .toLowerCase();

        const matchedTopics =
            revisionTopics.filter(
                topic =>
                    topic
                        .toLowerCase()
                        .includes(
                            normalizedSkillName
                        )
            );

        return matchedTopics.length > 0
            ? matchedTopics
            : revisionTopics;
    }

    /*
    |--------------------------------------------------------------------------
    | Save Mission
    |--------------------------------------------------------------------------
    */

    private async saveMission(
        context: NextMissionWorkflowContext,
        planningResult: MissionPlanningResult,
        session: ClientSession
    ): Promise<MissionDocument> {

        return missionService
            .createMission(
                {

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

                    revisionPlans:
                        planningResult
                            .revisionPlans,

                    startDate:
                        planningResult
                            .startDate,

                    endDate:
                        planningResult
                            .endDate,

                },
                session
            );
    }
}

export const nextMissionWorkflow =
    new NextMissionWorkflow();
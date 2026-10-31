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
    assessmentRepository,
} from "../assessment/index.js";

import {
    codingAttemptRepository,
} from "../practice/coding-attempt.repository.js";

import {
    codingChallengeRepository,
} from "../practice/coding-challenge.repository.js";

import {
    skillCatalogRepository,
} from "../../master-data/skill-catalog/skill-catalog.repository.js";

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
            await this.prepareMissionPlan(
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
        | Resume Skill Progress
        |--------------------------------------------------------------------------
        |
        | A resume assessment completed during the
        | previous mission can surface weak new
        | skills that should influence the next
        | mission even when the weekly report did
        | not request revision.
        |
        */

        const latestResumeAssessment =
            await assessmentRepository
                .findLatestCompletedResumeAssessment(
                    careerJourneyId
                );

        const resumeSkillProgress =
            latestResumeAssessment &&
            latestResumeAssessment.completedAt &&
            latestResumeAssessment.completedAt >=
                previousMission.startDate
                ? await skillProgressService
                    .getSkillPlanningData(
                        latestResumeAssessment._id
                            .toString()
                    )
                : [];

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

        const optedInCodingAttempts =
            await codingAttemptRepository
                .findOptedInByJourneyAndDateRange(
                    careerJourneyId,
                    previousMission.startDate,
                    previousMission.endDate ?? appClock.now()
                );

        return {
            previousMission,
            weeklyReport,
            roadmap,
            skillProgress,
            resumeSkillProgress,
            optedInCodingAttempts,
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

    private async prepareMissionPlan(
        context: NextMissionWorkflowContext
    ): Promise<MissionPlanningInput> {

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
                await this.getRevisionPlans(
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

    private async getRevisionPlans(
        context: NextMissionWorkflowContext
    ): Promise<MissionRevisionPlan[]> {

        const recommendation =
            context.weeklyReport
                .recommendation;

        const revisionPlans:
            MissionRevisionPlan[] = [];

        if (
            recommendation &&
            recommendation.prioritizeRevision
        ) {

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

            revisionPlans.push(
                ...weakSkillProgress.map(
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
                )
            );
        }

        const plannedSkillIds =
            new Set(
                revisionPlans.map(
                    revision =>
                        revision
                            .skillCatalogId
                            .toString()
                )
            );

        const resumeWeakSkills =
            context.resumeSkillProgress
                .filter(
                    skill =>
                        skill.percentage < 60 &&
                        !plannedSkillIds.has(
                            skill
                                .skillCatalogId
                                .toString()
                        )
                )
                .sort(
                    (a, b) =>
                        a.percentage -
                        b.percentage
                );

        revisionPlans.push(
            ...resumeWeakSkills.map(
                skill => ({

                    skillCatalogId:
                        skill.skillCatalogId,

                    skillName:
                        skill.skillName,

                    percentage:
                        skill.percentage,

                    revisionTopics: [
                        "Review core concepts",
                        "Practice weak areas",
                        "Complete focused exercises",
                    ],

                })
            )
        );

        for (const plan of revisionPlans) {
            plannedSkillIds.add(plan.skillCatalogId.toString());
        }

        if (context.optedInCodingAttempts && context.optedInCodingAttempts.length > 0) {
            const lowScoreAttempts = context.optedInCodingAttempts.filter(attempt => {
                if (!attempt.evaluation) return false;
                const avgScore = (attempt.evaluation.correctnessScore + attempt.evaluation.codeQualityScore) / 2;
                return avgScore < 70;
            });

            if (lowScoreAttempts.length > 0) {
                const challengeIds = [...new Set(lowScoreAttempts.map(a => a.challengeId))];
                const challenges = await codingChallengeRepository.findByIds(challengeIds);
                const challengeMap = new Map(challenges.map(c => [c._id.toString(), c]));

                const skillIdsToFetch = [
                    ...new Set(
                        challenges
                            .map(c => c.skillCatalogId)
                            .filter(id => !plannedSkillIds.has(id.toString()))
                    ),
                ];

                if (skillIdsToFetch.length > 0) {
                    const skills = await skillCatalogRepository.findActiveByIds(skillIdsToFetch);
                    const skillMap = new Map(skills.map(s => [s._id.toString(), s]));

                    for (const attempt of lowScoreAttempts) {
                        if (!attempt.evaluation) continue;
                        const challenge = challengeMap.get(attempt.challengeId.toString());
                        if (!challenge) continue;

                        const skillIdStr = challenge.skillCatalogId.toString();
                        if (plannedSkillIds.has(skillIdStr)) continue;

                        const skill = skillMap.get(skillIdStr);
                        if (!skill) continue;

                        const avgScore = Math.round(
                            (attempt.evaluation.correctnessScore + attempt.evaluation.codeQualityScore) / 2
                        );

                        const revisionTopics = [
                            `Review coding implementation for ${challenge.title}`,
                            ...(attempt.evaluation.observedStruggles && attempt.evaluation.observedStruggles.length > 0
                                ? attempt.evaluation.observedStruggles.slice(0, 2)
                                : ["Practice code structure and edge cases"]),
                        ];

                        revisionPlans.push({
                            skillCatalogId: skill._id,
                            skillName: skill.name,
                            percentage: avgScore,
                            revisionTopics,
                        });

                        plannedSkillIds.add(skillIdStr);
                    }
                }
            }
        }

        return revisionPlans;
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
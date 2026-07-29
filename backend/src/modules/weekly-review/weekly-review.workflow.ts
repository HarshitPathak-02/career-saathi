import {
    Types,
} from "mongoose";

import {
    AppError,
} from "../../core/errors/app-error.js";

import {
    careerJourneyService,
} from "../career-journey/career-journey.service.js";

import {
    missionService,
} from "../mission/mission.service.js";

import {
    roadmapService,
} from "../roadmap/roadmap.service.js";

import {
    userSkillService,
} from "../user-skill/user-skill.service.js";

import {
    assessmentWorkflowService,
} from "../assessment/assessment-workflow.service.js";

import {
    AssessmentStatus,
} from "../assessment/assessment.enums.js";

import {
    weeklyReflectionService,
} from "../weekly-reflection/weekly-reflection.service.js";

import {
    weeklyReportWorkflow,
} from "../weekly-report/weekly-report.workflow.js";

import {
    weeklyReportService,
} from "../weekly-report/weekly-report.service.js";

import {
    dailyTaskService,
} from "../daily-task/daily-task.service.js";

import {
    DailyTaskStatus,
} from "../daily-task/daily-task.enums.js";

import type {
    MissionAssessmentContext,
    SubmitWeeklyReviewDTO,
    WeeklyReviewPreparationDTO,
    WeeklyReviewSkillDTO,
} from "./weekly-review.types.js";

class WeeklyReviewWorkflow {

    /*
    |--------------------------------------------------------------------------
    | Get Current Weekly Review
    |--------------------------------------------------------------------------
    */

    async getCurrentWeeklyReview(
        userId: string
    ): Promise<WeeklyReviewPreparationDTO> {

        const careerJourney =
            await careerJourneyService
                .getActiveCareerJourney(
                    userId
                );

        if (!careerJourney) {

            throw new AppError(
                404,
                "Active career journey not found."
            );

        }

        const mission =
            await missionService
                .getActiveMission(
                    careerJourney._id.toString()
                );

        if (!mission) {

            throw new AppError(
                404,
                "Active mission not found."
            );

        }

        const currentMissionDay =
            await missionService
                .getCurrentMissionDay(
                    mission._id
                );

        if (currentMissionDay < 7) {

            throw new AppError(
                409,
                "Weekly review is not available yet."
            );

        }

        const roadmapItems =
            await roadmapService
                .getRoadmapItemsByIds(
                    mission.plannedRoadmapItemIds
                );

        const skillCatalogIds =
            await this.resolveMissionAssessmentSkillIds(
                mission
            );

        if (skillCatalogIds.length === 0) {

            throw new AppError(
                409,
                "No assessable skills found for this mission."
            );

        }

        const userSkills =
            await userSkillService
                .getUserSkillsByCatalogIds(
                    careerJourney._id,
                    skillCatalogIds
                );

        if (userSkills.length === 0) {

            throw new AppError(
                409,
                "No user skills found for this weekly assessment."
            );

        }

        const assessment =
            await assessmentWorkflowService
                .getOrCreateWeeklyAssessment(
                    careerJourney._id,
                    mission.missionNumber
                );

        const revisionSkillIds =
            new Set(
                (mission.revisionPlans ?? [])
                    .map(
                        revision =>
                            revision.skillCatalogId
                                .toString()
                    )
            );

        const skills: WeeklyReviewSkillDTO[] =
            userSkills.map(
                userSkill => {

                    const populatedSkill =
                        userSkill.skillCatalogId as unknown as {
                            _id: Types.ObjectId;
                            name: string;
                        };

                    const matchingRoadmapItems =
                        roadmapItems.filter(
                            item =>
                                item.skillId &&
                                item.skillId.toString() ===
                                populatedSkill._id.toString()
                        );

                    const revisionPlan =
                        (mission.revisionPlans ?? [])
                            .find(
                                revision =>
                                    revision.skillCatalogId
                                        .toString() ===
                                    populatedSkill._id
                                        .toString()
                            );

                    const isRevision =
                        revisionSkillIds.has(
                            populatedSkill._id
                                .toString()
                        );

                    return {

                        userSkillId:
                            userSkill._id.toString(),

                        skillCatalogId:
                            populatedSkill._id.toString(),

                        skillName:
                            populatedSkill.name,

                        currentScore:
                            userSkill.currentScore,

                        source:
                            isRevision
                                ? "REVISION"
                                : "NEW",

                        previousPercentage:
                            revisionPlan
                                ? revisionPlan.percentage
                                : null,

                        revisionTopics:
                            revisionPlan
                                ? revisionPlan.revisionTopics
                                : [],

                        roadmapItems:
                            matchingRoadmapItems.map(
                                item => ({

                                    id:
                                        item._id.toString(),

                                    title:
                                        item.title,

                                    description:
                                        item.description,

                                })
                            ),

                    };

                }
            );

        return {

            missionId:
                mission._id.toString(),

            missionNumber:
                mission.missionNumber,

            weekNumber:
                assessment.weekNumber,

            assessmentId:
                assessment._id.toString(),

            skills,

        };

    }

    /*
    |--------------------------------------------------------------------------
    | Submit Weekly Review
    |--------------------------------------------------------------------------
    */

    async submitWeeklyReview(
        userId: string,
        dto: SubmitWeeklyReviewDTO
    ) {

        const careerJourney =
            await careerJourneyService
                .getActiveCareerJourney(
                    userId
                );

        if (!careerJourney) {

            throw new AppError(
                404,
                "Active career journey not found."
            );

        }

        const mission =
            await missionService
                .getActiveMission(
                    careerJourney._id.toString()
                );

        if (!mission) {

            throw new AppError(
                404,
                "Active mission not found."
            );

        }

        const currentMissionDay =
            await missionService
                .getCurrentMissionDay(
                    mission._id
                );

        if (currentMissionDay < 7) {

            throw new AppError(
                409,
                "Weekly review is not available yet."
            );

        }

        let assessment =
            await assessmentWorkflowService
                .getOrCreateWeeklyAssessment(
                    careerJourney._id,
                    mission.missionNumber
                );

        if (
            assessment._id.toString() !==
            dto.assessment.assessmentId
        ) {

            throw new AppError(
                409,
                "Assessment does not belong to the current weekly review."
            );

        }

        await this.validateSubmittedSkills(
            careerJourney._id,
            mission,
            dto.assessment.skills
        );

        const daySevenTask =
            await dailyTaskService
                .getTaskByMissionAndDay(
                    mission._id,
                    7
                );

        if (!daySevenTask) {

            throw new AppError(
                404,
                "Weekly review task not found."
            );

        }

        if (
            daySevenTask.status ===
            DailyTaskStatus.COMPLETED
        ) {

            throw new AppError(
                409,
                "Weekly review has already been completed."
            );

        }

        if (
            assessment.status !==
            AssessmentStatus.COMPLETED
        ) {

            assessment =
                await assessmentWorkflowService
                    .completeWeeklyAssessment(
                        dto.assessment
                    );

        }

        let reflection =
            await weeklyReflectionService
                .getReflection({
                    missionId:
                        mission._id,
                });

        if (!reflection) {

            reflection =
                await weeklyReflectionService
                    .createReflection({

                        careerJourneyId:
                            careerJourney._id,

                        missionId:
                            mission._id,

                        assessmentId:
                            assessment._id,

                        weekNumber:
                            assessment.weekNumber,

                        learningReflection:
                            dto.reflection
                                .learningReflection,

                        mentorCheckIn:
                            dto.reflection
                                .mentorCheckIn,

                        additionalComments:
                            dto.reflection
                                .additionalComments,

                    });

        }

        let weeklyReport =
            await weeklyReportService
                .getByReflectionId(
                    reflection._id
                );

        if (!weeklyReport) {

            weeklyReport =
                await weeklyReportWorkflow
                    .generateWeeklyReport(
                        mission,
                        assessment,
                        reflection
                    );

        }

        await dailyTaskService
            .completeWeeklyReviewTask(
                mission._id
            );

        await missionService
            .markAsCompleted(
                mission._id.toString()
            );

        return {

            missionId:
                mission._id.toString(),

            missionNumber:
                mission.missionNumber,

            assessment,

            reflection,

            weeklyReport,

        };

    }

    /*
    |--------------------------------------------------------------------------
    | Resolve Mission Assessment Skills
    |--------------------------------------------------------------------------
    */

    private async resolveMissionAssessmentSkillIds(
        mission: MissionAssessmentContext
    ): Promise<Types.ObjectId[]> {

        const roadmapItems =
            await roadmapService
                .getRoadmapItemsByIds(
                    mission.plannedRoadmapItemIds
                );

        const newSkillIds =
            roadmapItems
                .filter(
                    item =>
                        item.skillId
                )
                .map(
                    item =>
                        new Types.ObjectId(
                            item.skillId!.toString()
                        )
                );

        const revisionSkillIds =
            (mission.revisionPlans ?? [])
                .map(
                    revision =>
                        new Types.ObjectId(
                            revision.skillCatalogId
                                .toString()
                        )
                );

        const uniqueSkillIds =
            new Map<
                string,
                Types.ObjectId
            >();

        [
            ...newSkillIds,
            ...revisionSkillIds,
        ].forEach(
            skillId => {

                uniqueSkillIds.set(
                    skillId.toString(),
                    skillId
                );

            }
        );

        return [
            ...uniqueSkillIds.values(),
        ];

    }

    /*
    |--------------------------------------------------------------------------
    | Validate Submitted Skills
    |--------------------------------------------------------------------------
    */

    private async validateSubmittedSkills(
        careerJourneyId: Types.ObjectId,
        mission: MissionAssessmentContext,
        submittedSkills: {
            userSkillId: Types.ObjectId;
            obtainedMarks: number;
            totalMarks: number;
        }[]
    ): Promise<void> {

        const skillCatalogIds =
            await this.resolveMissionAssessmentSkillIds(
                mission
            );

        if (skillCatalogIds.length === 0) {

            throw new AppError(
                409,
                "No assessable skills found for this mission."
            );

        }

        const userSkills =
            await userSkillService
                .getUserSkillsByCatalogIds(
                    careerJourneyId,
                    skillCatalogIds
                );

        const allowedUserSkillIds =
            new Set(
                userSkills.map(
                    skill =>
                        skill._id.toString()
                )
            );

        const submittedUserSkillIds =
            submittedSkills.map(
                skill =>
                    skill.userSkillId.toString()
            );

        const uniqueSubmittedIds =
            new Set(
                submittedUserSkillIds
            );

        if (
            uniqueSubmittedIds.size !==
            submittedUserSkillIds.length
        ) {

            throw new AppError(
                400,
                "Duplicate skills are not allowed in weekly assessment."
            );

        }

        const containsInvalidSkill =
            submittedUserSkillIds.some(
                id =>
                    !allowedUserSkillIds.has(
                        id
                    )
            );

        if (containsInvalidSkill) {

            throw new AppError(
                400,
                "Assessment contains a skill that does not belong to the current weekly review."
            );

        }

        if (
            uniqueSubmittedIds.size !==
            allowedUserSkillIds.size
        ) {

            throw new AppError(
                400,
                "Assessment scores must be submitted for every skill in the current weekly review."
            );

        }

    }

}

export const weeklyReviewWorkflow =
    new WeeklyReviewWorkflow();
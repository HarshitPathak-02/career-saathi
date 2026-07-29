import {
    ClientSession,
    Types,
} from "mongoose";

import {
    AppError,
} from "../../core/errors/app-error.js";

import {
    HTTP_STATUS,
} from "../../core/constants/http-status.constants.js";



import {
    SubmitAssessmentDTO,
    WeeklyAssessmentPlan,
    WeeklyAssessmentSkill,
} from "./assessment.types.js";

import {
    skillProgressService,
} from "../skill-progress/skill-progress.service.js";

import {
    AssessmentMethod,
} from "../skill-progress/skill-progress.enums.js";

import {
    userSkillService,
} from "../user-skill/user-skill.service.js";

import {
    missionService,
} from "../mission/mission.service.js";

import {
    roadmapItemRepository,
} from "../roadmap/roadmap-item.repository.js";
import { careerJourneyRepository, CareerJourneyStatus } from "../career-journey/index.js";
import { ASSESSMENT_MESSAGES, assessmentRepository, assessmentService, AssessmentSkillSource, AssessmentStatus, AssessmentType } from "./index.js";

class AssessmentWorkflowService {

    async startInitialAssessment(
        careerJourneyId: string,
        session?: ClientSession
    ) {

        const careerJourneyObjectId =
            new Types.ObjectId(
                careerJourneyId
            );

        const careerJourney =
            await careerJourneyRepository
                .findOne(
                    {
                        _id:
                            careerJourneyObjectId,
                    },
                    session
                );

        if (!careerJourney) {

            throw new AppError(
                HTTP_STATUS.NOT_FOUND,
                "Career journey not found."
            );
        }

        /*
         * Initial assessment is only
         * available while the journey
         * is still in DRAFT state.
         */

        if (
            careerJourney.status !==
            CareerJourneyStatus.DRAFT
        ) {

            throw new AppError(
                HTTP_STATUS.CONFLICT,
                ASSESSMENT_MESSAGES
                    .INVALID_STATUS
            );
        }

        /*
         * A career journey can have
         * only one initial assessment.
         */

        const alreadyExists =
            await assessmentRepository
                .exists(
                    {
                        careerJourneyId:
                            careerJourneyObjectId,

                        type:
                            AssessmentType.INITIAL,
                    },
                    session
                );

        if (alreadyExists) {

            throw new AppError(
                HTTP_STATUS.CONFLICT,
                ASSESSMENT_MESSAGES
                    .INITIAL_ALREADY_EXISTS
            );
        }

        return assessmentService
            .createAssessment(
                {
                    careerJourneyId:
                        careerJourneyObjectId,

                    type:
                        AssessmentType.INITIAL,

                    weekNumber: 0,

                    title:
                        "Initial Assessment",

                    description:
                        "Initial assessment to evaluate current skill levels.",
                },
                session
            );
    }

    async startWeeklyAssessment(
        careerJourneyId: string,
        session?: ClientSession
    ) {

        const careerJourneyObjectId =
            new Types.ObjectId(
                careerJourneyId
            );

        const careerJourney =
            await careerJourneyRepository
                .findOne(
                    {
                        _id:
                            careerJourneyObjectId,
                    },
                    session
                );

        if (!careerJourney) {

            throw new AppError(
                HTTP_STATUS.NOT_FOUND,
                "Career journey not found."
            );
        }

        /*
         * Weekly assessments belong to
         * an ACTIVE career journey.
         *
         * DRAFT:
         * Initial assessment not completed.
         *
         * ACTIVE:
         * Initial assessment completed and
         * career journey is in progress.
         */

        if (
            careerJourney.status !==
            CareerJourneyStatus.ACTIVE
        ) {

            throw new AppError(
                HTTP_STATUS.CONFLICT,
                ASSESSMENT_MESSAGES
                    .INVALID_STATUS
            );
        }

        const latestAssessment =
            await assessmentRepository
                .findLatestWeeklyAssessment(
                    careerJourneyObjectId,
                    session
                );

        const weekNumber =
            latestAssessment
                ? latestAssessment.weekNumber + 1
                : 1;

        return assessmentService
            .createAssessment(
                {
                    careerJourneyId:
                        careerJourneyObjectId,

                    type:
                        AssessmentType.WEEKLY,

                    weekNumber,

                    title:
                        `Week ${weekNumber} Assessment`,

                    description:
                        `Weekly assessment for week ${weekNumber}.`,
                },
                session
            );
    }

    async completeInitialAssessment(
        userId: string,
        data: SubmitAssessmentDTO,
        session?: ClientSession
    ) {


        const assessment =
            await assessmentService
                .getAssessmentById(
                    data.assessmentId,
                    session
                );

        if (
            assessment.type !==
            AssessmentType.INITIAL
        ) {

            throw new AppError(
                HTTP_STATUS.CONFLICT,
                ASSESSMENT_MESSAGES
                    .NOT_INITIAL_ASSESSMENT
            );
        }


        if (
            assessment.status ===
            AssessmentStatus.COMPLETED
        ) {

            throw new AppError(
                HTTP_STATUS.CONFLICT,
                ASSESSMENT_MESSAGES
                    .ALREADY_COMPLETED
            );
        }

        const skillProgress =
            await skillProgressService
                .createManySkillProgress(
                    data.skills.map(
                        (skill) => ({
                            ...skill,

                            assessmentId:
                                assessment._id,

                            careerJourneyId:
                                assessment
                                    .careerJourneyId,

                            assessmentMethod:
                                AssessmentMethod
                                    .PLATFORM,
                        })
                    ),
                    session
                );

        await userSkillService
            .updateManySkills(
                skillProgress.map(
                    (progress) => ({
                        userSkillId:
                            progress.userSkillId,

                        currentScore:
                            progress.percentage,

                        lastAssessmentAt:
                            progress.createdAt,
                    })
                ),
                session
            );


        await assessmentService
            .submitAssessment(
                assessment._id.toString(),
                session
            );

        await careerJourneyRepository
            .updateStatusByIdAndUserId(
                assessment.careerJourneyId,
                new Types.ObjectId(userId),
                CareerJourneyStatus.ACTIVE,
                session
            );

        return assessmentService
            .getAssessmentById(
                assessment._id.toString(),
                session
            );
    }


    async completeWeeklyAssessment(
        data: SubmitAssessmentDTO,
        session?: ClientSession
    ) {

        const assessment =
            await assessmentService
                .getAssessmentById(
                    data.assessmentId,
                    session
                );

        if (
            assessment.type !==
            AssessmentType.WEEKLY
        ) {

            throw new AppError(
                HTTP_STATUS.CONFLICT,
                ASSESSMENT_MESSAGES
                    .NOT_WEEKLY_ASSESSMENT
            );
        }

        if (
            assessment.status ===
            AssessmentStatus.COMPLETED
        ) {

            throw new AppError(
                HTTP_STATUS.CONFLICT,
                ASSESSMENT_MESSAGES
                    .ALREADY_COMPLETED
            );
        }

        await this
            .validateWeeklyAssessmentSubmission(
                assessment._id.toString(),
                data.skills,
                session
            );

        const skillProgress =
            await skillProgressService
                .createManySkillProgress(
                    data.skills.map(
                        (skill) => ({
                            ...skill,

                            assessmentId:
                                assessment._id,

                            careerJourneyId:
                                assessment
                                    .careerJourneyId,

                            assessmentMethod:
                                AssessmentMethod
                                    .PLATFORM,
                        })
                    ),
                    session
                );

        await userSkillService
            .updateManySkills(
                skillProgress.map(
                    (progress) => ({
                        userSkillId:
                            progress.userSkillId,

                        currentScore:
                            progress.percentage,

                        lastAssessmentAt:
                            progress.createdAt,
                    })
                ),
                session
            );

        await assessmentService
            .submitAssessment(
                assessment._id.toString(),
                session
            );

        return assessmentService
            .getAssessmentById(
                assessment._id.toString(),
                session
            );
    }


    async getOrCreateWeeklyAssessment(
        careerJourneyId:
            Types.ObjectId,

        weekNumber:
            number,

        session?:
            ClientSession
    ) {

        const existingAssessment =
            await assessmentRepository
                .findWeeklyAssessment(
                    careerJourneyId,
                    weekNumber,
                    session
                );

        if (existingAssessment) {
            return existingAssessment;
        }

        return assessmentService
            .createAssessment(
                {
                    careerJourneyId,

                    type:
                        AssessmentType.WEEKLY,

                    weekNumber,

                    title:
                        `Week ${weekNumber} Assessment`,

                    description:
                        `Weekly assessment for week ${weekNumber}.`,
                },
                session
            );
    }

    async getWeeklyAssessmentPlan(
        assessmentId: string,
        session?: ClientSession
    ): Promise<WeeklyAssessmentPlan> {

        const assessment =
            await assessmentService
                .getAssessmentById(
                    assessmentId,
                    session
                );

        if (
            assessment.type !==
            AssessmentType.WEEKLY
        ) {

            throw new AppError(
                HTTP_STATUS.CONFLICT,
                "Assessment must be a weekly assessment."
            );
        }

        const mission =
            await missionService
                .getMissionByNumber(
                    assessment
                        .careerJourneyId
                        .toString(),

                    assessment.weekNumber,

                    session
                );

        if (!mission) {

            throw new AppError(
                HTTP_STATUS.NOT_FOUND,
                `Mission ${assessment.weekNumber} not found.`
            );
        }

        const roadmapItems =
            await roadmapItemRepository
                .findMany(
                    {
                        _id: {
                            $in:
                                mission
                                    .plannedRoadmapItemIds,
                        },
                    },
                    session
                );

        const newSkillIds =
            roadmapItems
                .filter(
                    (item) =>
                        item.skillId != null
                )
                .map(
                    (item) =>
                        item.skillId as
                        Types.ObjectId
                );

        const revisionSkillIds =
            (
                mission.revisionPlans ??
                []
            ).map(
                (revision) =>
                    revision.skillCatalogId
            );

        const uniqueSkillIdMap =
            new Map<
                string,
                Types.ObjectId
            >();

        for (
            const skillId
            of newSkillIds
        ) {

            uniqueSkillIdMap.set(
                skillId.toString(),
                skillId
            );
        }

        for (
            const skillId
            of revisionSkillIds
        ) {

            uniqueSkillIdMap.set(
                skillId.toString(),
                skillId
            );
        }

        const assessmentSkillCatalogIds =
            Array.from(
                uniqueSkillIdMap.values()
            );

        if (
            assessmentSkillCatalogIds
                .length === 0
        ) {

            throw new AppError(
                HTTP_STATUS.CONFLICT,
                "No skills are available for this weekly assessment."
            );
        }

        const userSkills =
            await userSkillService
                .getUserSkillsByCatalogIds(
                    assessment
                        .careerJourneyId,

                    assessmentSkillCatalogIds,

                    session
                );

        if (
            userSkills.length !==
            assessmentSkillCatalogIds.length
        ) {

            throw new AppError(
                HTTP_STATUS.CONFLICT,
                "Some assessment skills are not initialized for this career journey."
            );
        }

        const newSkillIdSet =
            new Set(
                newSkillIds.map(
                    (id) =>
                        id.toString()
                )
            );

        const revisionPlanMap =
            new Map(
                (
                    mission.revisionPlans ??
                    []
                ).map(
                    (revision) => [
                        revision
                            .skillCatalogId
                            .toString(),

                        revision,
                    ]
                )
            );

        const skills:
            WeeklyAssessmentSkill[] =
            userSkills.map(
                (userSkill) => {

                    const skillCatalog =
                        userSkill
                            .skillCatalogId;

                    const skillCatalogId =
                        skillCatalog
                            ._id
                            .toString();

                    const isNew =
                        newSkillIdSet.has(
                            skillCatalogId
                        );

                    const revisionPlan =
                        revisionPlanMap.get(
                            skillCatalogId
                        );

                    const isRevision =
                        Boolean(
                            revisionPlan
                        );

                    let source:
                        AssessmentSkillSource;

                    if (
                        isNew &&
                        isRevision
                    ) {

                        source =
                            AssessmentSkillSource
                                .NEW_AND_REVISION;

                    } else if (
                        isRevision
                    ) {

                        source =
                            AssessmentSkillSource
                                .REVISION;

                    } else {

                        source =
                            AssessmentSkillSource
                                .NEW;
                    }

                    return {

                        userSkillId:
                            userSkill
                                ._id
                                .toString(),

                        skillCatalogId,

                        skillName:
                            skillCatalog.name,

                        source,

                        previousPercentage:
                            revisionPlan
                                ?.percentage ??
                            null,

                        revisionTopics:
                            revisionPlan
                                ?.revisionTopics ??
                            [],
                    };
                }
            );

        return {

            assessmentId:
                assessment._id
                    .toString(),

            weekNumber:
                assessment.weekNumber,

            skills,
        };
    }

    private async validateWeeklyAssessmentSubmission(
        assessmentId:
            string,

        submittedSkills:
            SubmitAssessmentDTO["skills"],

        session?:
            ClientSession
    ): Promise<void> {


        const plan =
            await this
                .getWeeklyAssessmentPlan(
                    assessmentId,
                    session
                );

        const expectedSkillIds =
            new Set(
                plan.skills.map(
                    (skill) =>
                        skill.userSkillId
                )
            );

        const submittedSkillIds =
            submittedSkills.map(
                (skill) =>
                    skill.userSkillId
                        .toString()
            );

        const uniqueSubmittedSkillIds =
            new Set(
                submittedSkillIds
            );

        if (
            uniqueSubmittedSkillIds.size !==
            submittedSkillIds.length
        ) {

            throw new AppError(
                HTTP_STATUS.BAD_REQUEST,
                "Duplicate skills are not allowed in the assessment submission."
            );
        }

        if (
            uniqueSubmittedSkillIds.size !==
            expectedSkillIds.size
        ) {

            throw new AppError(
                HTTP_STATUS.BAD_REQUEST,
                "Assessment submission does not contain all required skills."
            );
        }

        for (
            const submittedSkillId
            of uniqueSubmittedSkillIds
        ) {

            if (
                !expectedSkillIds.has(
                    submittedSkillId
                )
            ) {

                throw new AppError(
                    HTTP_STATUS.BAD_REQUEST,
                    `Skill ${submittedSkillId} does not belong to this assessment.`
                );
            }
        }

        for (
            const expectedSkillId
            of expectedSkillIds
        ) {

            if (
                !uniqueSubmittedSkillIds.has(
                    expectedSkillId
                )
            ) {

                throw new AppError(
                    HTTP_STATUS.BAD_REQUEST,
                    `Required skill ${expectedSkillId} is missing from the assessment submission.`
                );
            }
        }
    }
}

export const assessmentWorkflowService =
    new AssessmentWorkflowService();
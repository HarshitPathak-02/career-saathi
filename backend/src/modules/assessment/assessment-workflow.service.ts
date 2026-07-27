import { Types } from "mongoose";

import { AppError } from "../../core/errors/app-error.js";

import {
    careerJourneyRepository,
} from "../career-journey/career-journey.repository.js";

import {
    CareerJourneyStatus,
} from "../career-journey/career-journey.enums.js";

import {
    assessmentRepository,
} from "./assessment.repository.js";

import {
    assessmentService,
} from "./assessment.service.js";

import {
    AssessmentSkillSource,
    AssessmentStatus,
    AssessmentType,
} from "./assessment.enums.js";

import {
    AssessmentMessages,
} from "./assessment.messages.js";

import {
    SubmitAssessmentDTO,
    WeeklyAssessmentPlan,
    WeeklyAssessmentSkill,
} from "./assessment.types.js";

import {
    skillProgressService,
} from "../skill-progress/skill-progress.service.js";

import {
    userSkillService,
} from "../user-skill/user-skill.service.js";
import { AssessmentMethod } from "../skill-progress/skill-progress.enums.js";
import { missionService } from "../mission/mission.service.js";
import { roadmapItemRepository } from "../roadmap/roadmap-item.repository.js";

class AssessmentWorkflowService {

    async startInitialAssessment(
        careerJourneyId: string
    ) {

        const careerJourneyObjectId =
            new Types.ObjectId(careerJourneyId);

        const careerJourney =
            await careerJourneyRepository.findOne({
                _id: careerJourneyObjectId,
            });

        if (!careerJourney) {
            throw new AppError(
                404,
                "Career Journey not found."
            );
        }

        if (
            careerJourney.status !==
            CareerJourneyStatus.DRAFT
        ) {
            throw new AppError(
                409,
                AssessmentMessages.INVALID_STATUS
            );
        }

        const alreadyExists =
            await assessmentRepository.exists({
                careerJourneyId:
                    careerJourneyObjectId,
                type:
                    AssessmentType.INITIAL,
            });

        if (alreadyExists) {
            throw new AppError(
                409,
                AssessmentMessages.INITIAL_ALREADY_EXISTS
            );
        }

        return assessmentService.createAssessment({

            careerJourneyId:
                careerJourneyObjectId,

            type:
                AssessmentType.INITIAL,

            weekNumber: 0,

            title:
                "Initial Assessment",

            description:
                "Initial assessment to evaluate current skill levels.",

        });

    }

    async startWeeklyAssessment(
        careerJourneyId: string
    ) {

        const careerJourneyObjectId =
            new Types.ObjectId(careerJourneyId);

        const careerJourney =
            await careerJourneyRepository.findOne({
                _id: careerJourneyObjectId,
            });

        if (!careerJourney) {
            throw new AppError(
                404,
                "Career Journey not found."
            );
        }

        if (
            careerJourney.status !==
            CareerJourneyStatus.DRAFT
        ) {
            throw new AppError(
                409,
                AssessmentMessages.INVALID_STATUS
            );
        }

        const latestAssessment =
            await assessmentRepository.findLatestWeeklyAssessment(
                careerJourneyObjectId
            );

        const weekNumber =
            latestAssessment
                ? latestAssessment.weekNumber + 1
                : 1;

        return assessmentService.createAssessment({

            careerJourneyId:
                careerJourneyObjectId,

            type:
                AssessmentType.WEEKLY,

            weekNumber,

            title:
                `Week ${weekNumber} Assessment`,

            description:
                `Weekly assessment for week ${weekNumber}.`,

        });

    }

    async completeInitialAssessment(
        data: SubmitAssessmentDTO
    ) {

        const assessment =
            await assessmentService.getAssessmentById(
                data.assessmentId
            );

        if (
            assessment.type !==
            AssessmentType.INITIAL
        ) {
            throw new AppError(
                409,
                AssessmentMessages.NOT_INITIAL_ASSESSMENT
            );
        }

        if (
            assessment.status ===
            AssessmentStatus.COMPLETED
        ) {
            throw new AppError(
                409,
                AssessmentMessages.ALREADY_COMPLETED
            );
        }

        const skillProgress =
            await skillProgressService.createManySkillProgress(

                data.skills.map(skill => ({

                    ...skill,

                    assessmentId:
                        assessment._id,

                    careerJourneyId:
                        assessment.careerJourneyId,

                    assessmentMethod: AssessmentMethod.PLATFORM

                }))

            );

        await userSkillService.updateManySkills(

            skillProgress.map(progress => ({

                userSkillId:
                    progress.userSkillId,

                currentScore:
                    progress.percentage,

                lastAssessmentAt:
                    progress.createdAt,

            }))

        );

        await assessmentService.submitAssessment(
            assessment._id.toString()
        );

        await careerJourneyRepository.updateStatus(
            assessment.careerJourneyId,
            CareerJourneyStatus.ACTIVE
        );

        return assessmentService.getAssessmentById(
            assessment._id.toString()
        );

    }

    async completeWeeklyAssessment(
        data: SubmitAssessmentDTO
    ) {

        const assessment =
            await assessmentService.getAssessmentById(
                data.assessmentId
            );

        if (
            assessment.type !==
            AssessmentType.WEEKLY
        ) {
            throw new AppError(
                409,
                AssessmentMessages.NOT_WEEKLY_ASSESSMENT
            );
        }

        if (
            assessment.status ===
            AssessmentStatus.COMPLETED
        ) {
            throw new AppError(
                409,
                AssessmentMessages.ALREADY_COMPLETED
            );
        }

        console.log(
            "ASSESSMENT BEFORE SKILL PROGRESS:",
            {
                id: assessment._id.toString(),
                type: assessment.type,
                weekNumber: assessment.weekNumber,
                status: assessment.status,
            }
        );

        console.log(
            "SKILLS RECEIVED:",
            JSON.stringify(
                data.skills,
                null,
                2
            )
        );

        await this.validateWeeklyAssessmentSubmission(
            assessment._id.toString(),
            data.skills
        );

        const skillProgress =
            await skillProgressService.createManySkillProgress(

                data.skills.map(skill => ({

                    ...skill,

                    assessmentId:
                        assessment._id,

                    careerJourneyId:
                        assessment.careerJourneyId,

                    assessmentMethod: AssessmentMethod.PLATFORM

                }))

            );

        console.log(
            "SKILL PROGRESS CREATED:",
            skillProgress.map(progress => ({
                id: progress._id.toString(),
                assessmentId:
                    progress.assessmentId.toString(),
                userSkillId:
                    progress.userSkillId.toString(),
                obtainedMarks:
                    progress.obtainedMarks,
                totalMarks:
                    progress.totalMarks,
                percentage:
                    progress.percentage,
                assessmentMethod:
                    progress.assessmentMethod,
            }))
        );

        await userSkillService.updateManySkills(

            skillProgress.map(progress => ({

                userSkillId:
                    progress.userSkillId,

                currentScore:
                    progress.percentage,

                lastAssessmentAt:
                    progress.createdAt,

            }))

        );

        await assessmentService.submitAssessment(
            assessment._id.toString()
        );


        return assessmentService.getAssessmentById(
            assessment._id.toString()
        );

    }

    async getOrCreateWeeklyAssessment(
        careerJourneyId: Types.ObjectId,
        weekNumber: number
    ) {

        const existingAssessment =
            await assessmentRepository
                .findWeeklyAssessment(
                    careerJourneyId,
                    weekNumber
                );

        if (existingAssessment) {
            return existingAssessment;
        }

        return assessmentService.createAssessment({

            careerJourneyId,

            type:
                AssessmentType.WEEKLY,

            weekNumber,

            title:
                `Week ${weekNumber} Assessment`,

            description:
                `Weekly assessment for week ${weekNumber}.`,

        });

    }

    async getWeeklyAssessmentPlan(
        assessmentId: string
    ): Promise<WeeklyAssessmentPlan> {

        /*
         * Step 1
         * Fetch assessment
         */

        const assessment =
            await assessmentService
                .getAssessmentById(
                    assessmentId
                );

        if (
            assessment.type !==
            AssessmentType.WEEKLY
        ) {

            throw new AppError(
                409,
                "Assessment must be a weekly assessment."
            );

        }

        /*
         * Step 2
         * Fetch corresponding mission
         *
         * Week 1 -> Mission 1
         * Week 2 -> Mission 2
         */

        const mission =
            await missionService
                .getMissionByNumber(
                    assessment.careerJourneyId
                        .toString(),

                    assessment.weekNumber
                );

        if (!mission) {

            throw new AppError(
                404,
                `Mission ${assessment.weekNumber} not found.`
            );

        }

        /*
         * Step 3
         * Fetch planned roadmap items
         */

        const roadmapItems =
            await roadmapItemRepository
                .findMany({
                    _id: {
                        $in:
                            mission.plannedRoadmapItemIds,
                    },
                });

        /*
         * Step 4
         * Collect NEW skill catalog IDs
         *
         * Only roadmap items having a skillId
         * represent assessable skills.
         */

        const newSkillIds =
            roadmapItems
                .filter(
                    item =>
                        item.skillId != null
                )
                .map(
                    item =>
                        item.skillId as Types.ObjectId
                );

        /*
         * Step 5
         * Collect REVISION skill catalog IDs
         */

        const revisionSkillIds =
            (mission.revisionPlans ?? [])
                .map(
                    revision =>
                        revision.skillCatalogId
                );

        /*
         * Step 6
         * Merge + deduplicate skill catalog IDs
         */

        const uniqueSkillIdMap =
            new Map<
                string,
                Types.ObjectId
            >();

        for (const skillId of newSkillIds) {

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
            assessmentSkillCatalogIds.length === 0
        ) {

            throw new AppError(
                409,
                "No skills are available for this weekly assessment."
            );

        }

        /*
         * Step 7
         * Resolve SkillCatalog IDs -> UserSkills
         */

        const userSkills =
            await userSkillService
                .getUserSkillsByCatalogIds(
                    assessment.careerJourneyId,
                    assessmentSkillCatalogIds
                );

        /*
         * Every assessment skill must have
         * a corresponding UserSkill.
         */

        if (
            userSkills.length !==
            assessmentSkillCatalogIds.length
        ) {

            throw new AppError(
                409,
                "Some assessment skills are not initialized for this career journey."
            );

        }

        /*
         * Step 8
         * Create lookup sets
         */

        const newSkillIdSet =
            new Set(
                newSkillIds.map(
                    id =>
                        id.toString()
                )
            );

        const revisionPlanMap =
            new Map(
                (mission.revisionPlans ?? [])
                    .map(
                        revision => [
                            revision.skillCatalogId
                                .toString(),

                            revision,
                        ]
                    )
            );

        /*
         * Step 9
         * Build assessment skill response
         */

        const skills:
            WeeklyAssessmentSkill[] =
            userSkills.map(
                userSkill => {

                    const skillCatalog =
                        userSkill.skillCatalogId;

                    const skillCatalogId =
                        skillCatalog._id
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
                            userSkill._id
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

        /*
         * Step 10
         * Return plan
         */

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
        assessmentId: string,
        submittedSkills: SubmitAssessmentDTO["skills"]
    ): Promise<void> {

        /*
         * Step 1
         * Get server-generated assessment plan
         */

        const plan =
            await this.getWeeklyAssessmentPlan(
                assessmentId
            );

        /*
         * Step 2
         * Expected UserSkill IDs
         */

        const expectedSkillIds =
            new Set(
                plan.skills.map(
                    skill =>
                        skill.userSkillId
                )
            );

        /*
         * Step 3
         * Extract submitted UserSkill IDs
         */

        const submittedSkillIds =
            submittedSkills.map(
                skill =>
                    skill.userSkillId.toString()
            );

        /*
         * Step 4
         * Reject duplicate submissions
         */

        const uniqueSubmittedSkillIds =
            new Set(
                submittedSkillIds
            );

        if (
            uniqueSubmittedSkillIds.size !==
            submittedSkillIds.length
        ) {

            throw new AppError(
                400,
                "Duplicate skills are not allowed in the assessment submission."
            );

        }

        /*
         * Step 5
         * Ensure same number of skills
         */

        if (
            uniqueSubmittedSkillIds.size !==
            expectedSkillIds.size
        ) {

            throw new AppError(
                400,
                "Assessment submission does not contain all required skills."
            );

        }

        /*
         * Step 6
         * Reject missing / unexpected skills
         */

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
                    400,
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
                    400,
                    `Required skill ${expectedSkillId} is missing from the assessment submission.`
                );

            }

        }

    }

}

export const assessmentWorkflowService =
    new AssessmentWorkflowService();
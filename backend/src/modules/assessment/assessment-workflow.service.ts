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
    AssessmentStatus,
    AssessmentType,
} from "./assessment.enums.js";

import {
    AssessmentMessages,
} from "./assessment.messages.js";

import {
    SubmitAssessmentDTO,
} from "./assessment.types.js";

import {
    skillProgressService,
} from "../skill-progress/skill-progress.service.js";

import {
    userSkillService,
} from "../user-skill/user-skill.service.js";
import { AssessmentMethod } from "../skill-progress/skill-progress.enums.js";

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

}

export const assessmentWorkflowService =
    new AssessmentWorkflowService();
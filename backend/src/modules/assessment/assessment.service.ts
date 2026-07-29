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
import { ASSESSMENT_MESSAGES, AssessmentDetailResponse, AssessmentDocument, AssessmentHistoryItem, assessmentRepository, AssessmentStatus, AssessmentType, CreateAssessmentDTO } from "./index.js";
import { skillProgressService } from "../skill-progress/index.js";



class AssessmentService {

    /*
    |--------------------------------------------------------------------------
    | Create Assessment
    |--------------------------------------------------------------------------
    */

    async createAssessment(
        data:
            CreateAssessmentDTO,
        session?:
            ClientSession
    ) {

        return assessmentRepository
            .create(
                {
                    ...data,

                    status:
                        AssessmentStatus.PENDING,
                },
                session
            );
    }

    /*
    |--------------------------------------------------------------------------
    | Submit Assessment
    |--------------------------------------------------------------------------
    */

    async submitAssessment(
        assessmentId:
            string,
        session?:
            ClientSession
    ) {

        const assessmentObjectId =
            new Types.ObjectId(
                assessmentId
            );

        const assessment =
            await assessmentRepository
                .findById(
                    assessmentObjectId,
                    session
                );

        if (!assessment) {

            throw new AppError(
                HTTP_STATUS.NOT_FOUND,
                ASSESSMENT_MESSAGES.NOT_FOUND
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

        return assessmentRepository
            .updateStatus(
                assessmentObjectId,

                AssessmentStatus.COMPLETED,

                session
            );
    }

    /*
    |--------------------------------------------------------------------------
    | Get Assessment By Id
    |--------------------------------------------------------------------------
    */

    async getAssessmentById(
        assessmentId:
            string,
        session?:
            ClientSession
    ) {

        const assessmentObjectId =
            new Types.ObjectId(
                assessmentId
            );

        const assessment =
            await assessmentRepository
                .findById(
                    assessmentObjectId,
                    session
                );

        if (!assessment) {

            throw new AppError(
                HTTP_STATUS.NOT_FOUND,
                ASSESSMENT_MESSAGES.NOT_FOUND
            );
        }

        return assessment;
    }

    /*
    |--------------------------------------------------------------------------
    | Assessment History
    |--------------------------------------------------------------------------
    */

    async getAssessmentHistory(
        careerJourneyId:
            Types.ObjectId,
        session?:
            ClientSession
    ): Promise<
        AssessmentHistoryItem[]
    > {

        const assessments =
            await assessmentRepository
                .findHistory(
                    careerJourneyId,
                    session
                );

        return assessments.map(
            (assessment) => ({

                id:
                    assessment._id
                        .toString(),

                type:
                    assessment.type,

                weekNumber:
                    assessment.weekNumber,

                title:
                    assessment.title,

                description:
                    assessment.description,

                status:
                    assessment.status,

                completedAt:
                    assessment.completedAt ??
                    null,

                createdAt:
                    assessment.createdAt,
            })
        );
    }

    /*
    |--------------------------------------------------------------------------
    | Assessment Details
    |--------------------------------------------------------------------------
    */

    async getAssessmentDetails(
        assessmentId:
            string
    ): Promise<
        AssessmentDetailResponse
    > {

        const assessment =
            await this
                .getAssessmentById(
                    assessmentId
                );

        const progress =
            await skillProgressService
                .getSkillProgressByAssessment(
                    assessmentId
                );

        const skills =
            progress.map(
                (item) => ({

                    id:
                        item._id
                            .toString(),

                    userSkillId:
                        item.userSkillId
                            ._id
                            .toString(),

                    skillCatalogId:
                        item.userSkillId
                            .skillCatalogId
                            ._id
                            .toString(),

                    skillName:
                        item.userSkillId
                            .skillCatalogId
                            .name,

                    obtainedMarks:
                        item.obtainedMarks,

                    totalMarks:
                        item.totalMarks,

                    percentage:
                        item.percentage,

                    improvementPercentage:
                        item.improvementPercentage ??
                        null,

                    assessmentMethod:
                        item.assessmentMethod,

                    assessmentPlatform:
                        item.assessmentPlatform,

                    assessmentName:
                        item.assessmentName,

                    remarks:
                        item.remarks,
                })
            );

        const averagePercentage =
            skills.length > 0

                ? Number(
                    (
                        skills.reduce(
                            (
                                total,
                                skill
                            ) =>
                                total +
                                skill.percentage,
                            0
                        ) /
                        skills.length
                    ).toFixed(2)
                )

                : 0;

        return {

            assessment: {

                id:
                    assessment._id
                        .toString(),

                careerJourneyId:
                    assessment
                        .careerJourneyId
                        .toString(),

                type:
                    assessment.type,

                weekNumber:
                    assessment.weekNumber,

                title:
                    assessment.title,

                description:
                    assessment.description,

                status:
                    assessment.status,

                completedAt:
                    assessment.completedAt ??
                    null,

                createdAt:
                    assessment.createdAt,
            },

            skills,

            summary: {

                totalSkills:
                    skills.length,

                averagePercentage,
            },
        };
    }

    /*
    |--------------------------------------------------------------------------
    | Delete Assessment
    |--------------------------------------------------------------------------
    */

    async deleteAssessment(
        assessmentId:
            Types.ObjectId,
        session?:
            ClientSession
    ) {

        const assessment =
            await assessmentRepository
                .findById(
                    assessmentId,
                    session
                );

        if (!assessment) {

            throw new AppError(
                HTTP_STATUS.NOT_FOUND,
                ASSESSMENT_MESSAGES.NOT_FOUND
            );
        }

        return assessmentRepository
            .softDelete(
                assessmentId,
                session
            );
    }

    /*
    |--------------------------------------------------------------------------
    | Get Weekly Assessment
    |--------------------------------------------------------------------------
    */

    async getWeeklyAssessment(
        careerJourneyId:
            Types.ObjectId,

        weekNumber:
            number,

        session?:
            ClientSession
    ): Promise<
        AssessmentDocument
    > {

        const assessment =
            await assessmentRepository
                .findOne(
                    {
                        careerJourneyId,

                        weekNumber,

                        type:
                            AssessmentType.WEEKLY,
                    },
                    session
                );

        if (!assessment) {

            throw new AppError(
                HTTP_STATUS.NOT_FOUND,
                ASSESSMENT_MESSAGES.NOT_FOUND
            );
        }

        return assessment;
    }
}

export const assessmentService =
    new AssessmentService();
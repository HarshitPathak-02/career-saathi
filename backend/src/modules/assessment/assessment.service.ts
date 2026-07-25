import { Types } from "mongoose";

import { AppError } from "../../core/errors/app-error.js";

import {
    AssessmentStatus,
    AssessmentType,
} from "./assessment.enums.js";

import {
    CreateAssessmentDTO,
    AssessmentDetailResponse,
    AssessmentHistoryItem,
} from "./assessment.types.js";

import {
    AssessmentMessages,
} from "./assessment.messages.js";

import {
    assessmentRepository,
} from "./assessment.repository.js";

import {
    AssessmentDocument,
} from "./assessment.schema.js";

import {
    skillProgressService,
} from "../skill-progress/skill-progress.service.js";

class AssessmentService {

    async createAssessment(
        data: CreateAssessmentDTO
    ) {
        return assessmentRepository.create({
            ...data,

            status:
                AssessmentStatus.PENDING,
        });
    }

    async submitAssessment(
        assessmentId: string
    ) {
        const assessmentObjectId =
            new Types.ObjectId(
                assessmentId
            );

        const assessment =
            await assessmentRepository.findById(
                assessmentObjectId
            );

        if (!assessment) {
            throw new AppError(
                404,
                AssessmentMessages.NOT_FOUND
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

        return assessmentRepository.updateStatus(
            assessmentObjectId,
            AssessmentStatus.COMPLETED
        );
    }

    async getAssessmentById(
        assessmentId: string
    ) {
        const assessmentObjectId =
            new Types.ObjectId(
                assessmentId
            );

        const assessment =
            await assessmentRepository.findById(
                assessmentObjectId
            );

        if (!assessment) {
            throw new AppError(
                404,
                AssessmentMessages.NOT_FOUND
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
        careerJourneyId: Types.ObjectId
    ): Promise<AssessmentHistoryItem[]> {

        const assessments =
            await assessmentRepository.findHistory(
                careerJourneyId
            );

        return assessments.map(
            (assessment) => ({
                id:
                    assessment._id.toString(),

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
        assessmentId: string
    ): Promise<AssessmentDetailResponse> {

        const assessment =
            await this.getAssessmentById(
                assessmentId
            );

        const progress =
            await skillProgressService
                .getSkillProgressByAssessment(
                    assessmentId
                );

        const skills =
            progress.map((item) => ({
                id:
                    item._id.toString(),

                userSkillId:
                    item.userSkillId._id.toString(),

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
            }));

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
                    assessment._id.toString(),

                careerJourneyId:
                    assessment.careerJourneyId
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

    async deleteAssessment(
        assessmentId: Types.ObjectId
    ) {
        const assessment =
            await assessmentRepository.findById(
                assessmentId
            );

        if (!assessment) {
            throw new AppError(
                404,
                AssessmentMessages.NOT_FOUND
            );
        }

        return assessmentRepository.softDelete(
            assessmentId
        );
    }

    async getWeeklyAssessment(
        careerJourneyId: Types.ObjectId,
        weekNumber: number
    ): Promise<AssessmentDocument> {

        const assessment =
            await assessmentRepository.findOne({
                careerJourneyId,

                weekNumber,

                type:
                    AssessmentType.WEEKLY,
            });

        if (!assessment) {
            throw new AppError(
                404,
                AssessmentMessages.NOT_FOUND
            );
        }

        return assessment;
    }
}

export const assessmentService =
    new AssessmentService();
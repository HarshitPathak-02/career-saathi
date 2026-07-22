import { Types } from "mongoose";

import { AppError } from "../../core/errors/app-error.js";

import {
    AssessmentStatus,
    AssessmentType,
} from "./assessment.enums.js";

import {
    CreateAssessmentDTO,
} from "./assessment.types.js";

import {
    AssessmentMessages,
} from "./assessment.messages.js";

import {
    assessmentRepository,
} from "./assessment.repository.js";
import { AssessmentDocument } from "./assessment.schema.js";

class AssessmentService {

    async createAssessment(
        data: CreateAssessmentDTO
    ) {
        return assessmentRepository.create({
            ...data,
            status: AssessmentStatus.PENDING,
        });
    }

    async submitAssessment(
        assessmentId: string
    ) {

        const assessmentObjectId = new Types.ObjectId(assessmentId)

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

        const assessmentObjectId = new Types.ObjectId(assessmentId)

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

    async getAssessmentHistory(
        careerJourneyId: Types.ObjectId
    ) {
        return assessmentRepository.findHistory(
            careerJourneyId
        );
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
        weekNumber: number,
    ): Promise<AssessmentDocument> {

        const assessment =
            await assessmentRepository.findOne({

                careerJourneyId,

                weekNumber,

                type: AssessmentType.WEEKLY,

            });

        if (!assessment) {

            throw new AppError(
                404,
                AssessmentMessages.NOT_FOUND,
            );

        }

        return assessment;

    }

}

export const assessmentService =
    new AssessmentService();
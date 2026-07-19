import {
    ClientSession,
    Types,
    UpdateQuery,
} from "mongoose";

import {
    AssessmentDocument,
    AssessmentModel,
} from "./assessment.schema.js";

import { AssessmentStatus, AssessmentType } from "./assessment.enums.js";

class AssessmentRepository {
    async create(
        data: Partial<AssessmentDocument>,
        session?: ClientSession
    ) {
        const [assessment] = await AssessmentModel.create(
            [data],
            { session }
        );

        return assessment;
    }

    async findById(
        id: Types.ObjectId
    ) {
        return this.findOne({
            _id: id,
        });
    }

    async findOne(
        filter: Record<string, unknown>,
        session?: ClientSession
    ) {
        return AssessmentModel.findOne({
            ...filter,
            isDeleted: false,
        });
    }

    async findMany(
        filter: Record<string, unknown>,
        session?: ClientSession
    ) {
        return AssessmentModel.find({
            ...filter,
            isDeleted: false,
        });
    }

    async exists(
        filter: Record<string, unknown>,
        session?: ClientSession
    ) {
        const exists =
            await AssessmentModel.exists({
                ...filter,
                isDeleted: false,
            });

        return Boolean(exists);
    }

    async updateById(
        id: Types.ObjectId,
        update: UpdateQuery<AssessmentDocument>,
        session?: ClientSession
    ) {
        return AssessmentModel.findOneAndUpdate(
            id,
            update,
            {
                new: true,
                session,
            }
        );
    }

    async updateStatus(
        id: Types.ObjectId,
        status: AssessmentStatus,
        session?: ClientSession
    ) {
        return AssessmentModel.findByIdAndUpdate(
            id,
            {
                status,
                ...(status === AssessmentStatus.COMPLETED && {
                    completedAt: new Date(),
                }),
            },
            {
                new: true,
                session,
            }
        );
    }

    async softDelete(
        id: Types.ObjectId,
        session?: ClientSession
    ) {
        return AssessmentModel.findByIdAndUpdate(
            id,
            {
                isDeleted: true,
                deletedAt: new Date(),
            },
            {
                new: true,
                session,
            }
        );
    }

    async findHistory(
        careerJourneyId: Types.ObjectId,
        session?: ClientSession
    ) {
        return AssessmentModel.find({
            careerJourneyId,
            isDeleted: false,
        }).sort({
            weekNumber: 1,
        });
    }

    async findLatestWeeklyAssessment(
        careerJourneyId: Types.ObjectId,
        session?: ClientSession
    ) {
        return AssessmentModel.findOne({
            careerJourneyId,
            type: AssessmentType.WEEKLY,
            isDeleted: false,
        }).sort({
            weekNumber: -1,
        });
    }
}

export const assessmentRepository =
    new AssessmentRepository();
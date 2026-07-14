import { ClientSession } from 'mongoose';

import {
    AssessmentDocument,
    CreateAssessmentData,
    UpdateAssessmentData,
} from './assessment.types.js';

import { AssessmentModel } from './assessment.model.js';

import {
    AssessmentStatus,
} from './assessment.enums.js';

class AssessmentRepository {
    async create(
        data: CreateAssessmentData,
        session?: ClientSession
    ): Promise<AssessmentDocument> {
        if (session) {
            const [assessment] =
                await AssessmentModel.create(
                    [data],
                    { session }
                );

            return assessment;
        }

        return AssessmentModel.create(data);
    }

    async findById(
        id: string,
        session?: ClientSession
    ): Promise<AssessmentDocument | null> {
        const query =
            AssessmentModel.findById(id);

        if (session) {
            query.session(session);
        }

        return query;
    }

    async findByCareerJourneyId(
        careerJourneyId: string,
        session?: ClientSession
    ): Promise<AssessmentDocument[]> {
        const query =
            AssessmentModel.find({
                careerJourneyId,
            }).sort({
                createdAt: -1,
            });

        if (session) {
            query.session(session);
        }

        return query;
    }

    async findInProgressByCareerJourneyId(
        careerJourneyId: string,
        session?: ClientSession
    ): Promise<AssessmentDocument | null> {
        const query =
            AssessmentModel.findOne({
                careerJourneyId,
                status:
                    AssessmentStatus.IN_PROGRESS,
            });

        if (session) {
            query.session(session);
        }

        return query;
    }

    async updateById(
        id: string,
        data: UpdateAssessmentData,
        session?: ClientSession
    ): Promise<AssessmentDocument | null> {
        return AssessmentModel.findByIdAndUpdate(
            id,
            data,
            {
                new: true,
                runValidators: true,
                session,
            }
        );
    }
}

export const assessmentRepository =
    new AssessmentRepository();
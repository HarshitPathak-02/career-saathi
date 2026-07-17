import {
    ClientSession,
} from 'mongoose';

import {
    AssessmentDocument,
    CreateAssessmentData,
    UpdateAssessmentData,
} from './assessment.types.js';

import {
    AssessmentModel,
} from './assessment.model.js';

import {
    AssessmentContextType,
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
                    {
                        session,
                    }
                );

            return assessment;
        }

        return AssessmentModel.create(
            data
        );
    }

    async findById(
        id: string,
        session?: ClientSession
    ): Promise<AssessmentDocument | null> {

        const query =
            AssessmentModel.findById(
                id
            );

        if (session) {

            query.session(
                session
            );
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
            })
                .sort({
                    createdAt: -1,
                });

        if (session) {

            query.session(
                session
            );
        }

        return query;
    }

    async findInProgressInitialAssessment(
        careerJourneyId: string,
        session?: ClientSession
    ): Promise<AssessmentDocument | null> {

        const query =
            AssessmentModel.findOne({

                careerJourneyId,

                contextType:
                    AssessmentContextType.INITIAL,

                status:
                    AssessmentStatus.IN_PROGRESS,
            });

        if (session) {

            query.session(
                session
            );
        }

        return query;
    }

    async findCompletedInitialAssessment(
        careerJourneyId: string,
        session?: ClientSession
    ): Promise<AssessmentDocument | null> {

        const query =
            AssessmentModel.findOne({

                careerJourneyId,

                contextType:
                    AssessmentContextType.INITIAL,

                status:
                    AssessmentStatus.COMPLETED,
            })
                .sort({
                    completedAt: -1,
                });

        if (session) {

            query.session(
                session
            );
        }

        return query;
    }

    async findInProgressTaskAssessment(
        careerJourneyId: string,
        taskId: string,
        session?: ClientSession
    ): Promise<AssessmentDocument | null> {

        const query =
            AssessmentModel.findOne({

                careerJourneyId,

                contextType:
                    AssessmentContextType.TASK,

                contextId:
                    taskId,

                status:
                    AssessmentStatus.IN_PROGRESS,
            });

        if (session) {

            query.session(
                session
            );
        }

        return query;
    }

    async findLatestCompletedTaskAssessment(
        careerJourneyId: string,
        taskId: string,
        session?: ClientSession
    ): Promise<AssessmentDocument | null> {

        const query =
            AssessmentModel.findOne({

                careerJourneyId,

                contextType:
                    AssessmentContextType.TASK,

                contextId:
                    taskId,

                status:
                    AssessmentStatus.COMPLETED,
            })
                .sort({
                    completedAt: -1,
                });

        if (session) {

            query.session(
                session
            );
        }

        return query;
    }

    async findInProgressPhaseAssessment(
        careerJourneyId: string,
        phaseId: string,
        session?: ClientSession
    ): Promise<AssessmentDocument | null> {

        const query =
            AssessmentModel.findOne({

                careerJourneyId,

                contextType:
                    AssessmentContextType.ROADMAP_PHASE,

                contextId:
                    phaseId,

                status:
                    AssessmentStatus.IN_PROGRESS,
            });

        if (session) {

            query.session(
                session
            );
        }

        return query;
    }

    async findLatestCompletedPhaseAssessment(
        careerJourneyId: string,
        phaseId: string,
        session?: ClientSession
    ): Promise<AssessmentDocument | null> {

        const query =
            AssessmentModel.findOne({

                careerJourneyId,

                contextType:
                    AssessmentContextType.ROADMAP_PHASE,

                contextId:
                    phaseId,

                status:
                    AssessmentStatus.COMPLETED,
            })
                .sort({
                    completedAt: -1,
                });

        if (session) {

            query.session(
                session
            );
        }

        return query;
    }

    async findInProgressByContext(
        careerJourneyId: string,
        contextType: AssessmentContextType,
        contextId?: string,
        session?: ClientSession
    ): Promise<AssessmentDocument | null> {

        const query =
            AssessmentModel.findOne({

                careerJourneyId,

                contextType,

                contextId:
                    contextId ?? null,

                status:
                    AssessmentStatus.IN_PROGRESS,
            });

        if (session) {

            query.session(
                session
            );
        }

        return query;
    }

    async findCompletedByContext(
        careerJourneyId: string,
        contextType: AssessmentContextType,
        contextId?: string,
        session?: ClientSession
    ): Promise<AssessmentDocument | null> {

        const query =
            AssessmentModel.findOne({

                careerJourneyId,

                contextType,

                contextId:
                    contextId ?? null,

                status:
                    AssessmentStatus.COMPLETED,
            })
                .sort({
                    completedAt: -1,
                });

        if (session) {

            query.session(
                session
            );
        }

        return query;
    }

    async findLatestByContext(
        careerJourneyId: string,
        contextType: AssessmentContextType,
        contextId?: string,
        session?: ClientSession
    ): Promise<AssessmentDocument | null> {

        const query =
            AssessmentModel.findOne({

                careerJourneyId,

                contextType,

                contextId:
                    contextId ?? null,
            })
                .sort({
                    createdAt: -1,
                });

        if (session) {

            query.session(
                session
            );
        }

        return query;
    }

    async updateById(
        id: string,
        data: UpdateAssessmentData,
        session?: ClientSession
    ): Promise<AssessmentDocument | null> {

        return AssessmentModel
            .findByIdAndUpdate(
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
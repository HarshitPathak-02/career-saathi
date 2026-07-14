import { ClientSession } from 'mongoose';

import {
    CreateRoadmapPhaseData,
    RoadmapPhaseDocument,
    UpdateRoadmapPhaseData,
} from './roadmap-phase.types.js';

import { RoadmapPhaseModel } from './roadmap-phase.model.js';

import { PhaseStatus } from './roadmap-phase.enums.js';
import { HTTP_STATUS } from '../../core/constants/http-status.constants.js';
import { AppError } from '../../core/errors/app-error.js';
import { ProgressStatus } from '../../shared/enums/progress-status.enums.js';

class RoadmapPhaseRepository {

    async create(
        data: CreateRoadmapPhaseData,
        session?: ClientSession
    ): Promise<RoadmapPhaseDocument> {

        if (session) {

            const [phase] =
                await RoadmapPhaseModel.create(
                    [data],
                    { session }
                );

            return phase;
        }

        return RoadmapPhaseModel.create(data);
    }

    async createMany(
        data: CreateRoadmapPhaseData[],
        session?: ClientSession
    ): Promise<RoadmapPhaseDocument[]> {

        if (session) {
            return RoadmapPhaseModel.insertMany(
                data,
                { session }
            );
        }

        return RoadmapPhaseModel.insertMany(
            data
        );
    }

    async findById(
        id: string,
        session?: ClientSession
    ) {

        const query =
            RoadmapPhaseModel.findById(id);

        if (session) {
            query.session(session);
        }

        return query;
    }

    async findByRoadmapId(
        roadmapId: string,
        session?: ClientSession
    ) {

        const query =
            RoadmapPhaseModel.find({
                roadmapId,
            }).sort({
                order: 1,
            });

        if (session) {
            query.session(session);
        }

        return query;
    }

    async findCurrentPhase(
        roadmapId: string,
        session?: ClientSession
    ) {

        const query =
            RoadmapPhaseModel.findOne({

                roadmapId,

                status:
                    ProgressStatus.IN_PROGRESS,
            });

        if (session) {
            query.session(session);
        }

        return query;
    }

    async findByOrder(
        roadmapId: string,
        order: number,
        session?: ClientSession
    ): Promise<RoadmapPhaseDocument | null> {

        const query =
            RoadmapPhaseModel.findOne({

                roadmapId,

                order,
            });

        if (session) {
            query.session(session);
        }

        return query;
    }

    async updateById(
        id: string,
        data: UpdateRoadmapPhaseData,
        session?: ClientSession
    ) {
        const query =
            RoadmapPhaseModel.findByIdAndUpdate(
                id,
                data,
                {
                    new: true,
                }
            );

        if (session) {
            query.session(session);
        }

        return query;
    }

    async deleteById(
        id: string,
        session?: ClientSession
    ) {

        return RoadmapPhaseModel.findByIdAndDelete(
            id,
            {
                session,
            }
        );
    }
    async findCompletedPhases(
        roadmapId: string,
        session?: ClientSession
    ) {

        const query =
            RoadmapPhaseModel.find({

                roadmapId,

                status:
                    ProgressStatus.COMPLETED,
            }).sort({
                order: 1,
            });

        if (session) {
            query.session(session);
        }

        return query;
    }

    async findFirstPhase(
        roadmapId: string,
        session?: ClientSession
    ): Promise<RoadmapPhaseDocument | null> {

        const query =
            RoadmapPhaseModel.findOne({
                roadmapId,
            }).sort({
                order: 1,
            });

        if (session) {
            query.session(session);
        }

        return query;
    }

    async completePhase(
        roadmapId: string
    ) {

        const currentPhase =
            await roadmapPhaseRepository.findCurrentPhase(
                roadmapId
            );

        if (!currentPhase) {
            throw new AppError(
                HTTP_STATUS.NOT_FOUND,
                'No active phase found.'
            );
        }

        await roadmapPhaseRepository.updateById(
            currentPhase.id,
            {
                status: ProgressStatus.COMPLETED,
                progress: 100,
                completedAt: new Date(),
            }
        );

        const nextPhase =
            await roadmapPhaseRepository.findByOrder(
                roadmapId,
                currentPhase.order + 1
            );

        if (nextPhase) {

            await roadmapPhaseRepository.updateById(
                nextPhase.id,
                {
                    status: ProgressStatus.AVAILABLE,
                    unlockedAt: new Date(),
                }
            );
        }

        return nextPhase;
    }

}

export const roadmapPhaseRepository =
    new RoadmapPhaseRepository();
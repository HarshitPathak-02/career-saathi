import { ClientSession } from 'mongoose';

import {
    CreateMissionData,
    MissionDocument,
    UpdateMissionData,
} from './mission.types.js';

import { MissionModel } from './mission.model.js';

import { ProgressStatus } from '../../shared/enums/progress-status.enums.js';

class MissionRepository {

    async create(
        data: CreateMissionData,
        session?: ClientSession
    ): Promise<MissionDocument> {

        if (session) {

            const [mission] =
                await MissionModel.create(
                    [data],
                    { session }
                );

            return mission;
        }

        return MissionModel.create(data);
    }

    async createMany(
        data: CreateMissionData[],
        session?: ClientSession
    ): Promise<MissionDocument[]> {

        if (session) {
            return MissionModel.insertMany(
                data,
                { session }
            );
        }

        return MissionModel.insertMany(
            data
        );
    }

    async findById(
        id: string,
        session?: ClientSession
    ): Promise<MissionDocument | null> {

        const query =
            MissionModel.findById(id);

        if (session) {
            query.session(session);
        }

        return query;
    }

    async findByPhaseId(
        roadmapPhaseId: string,
        session?: ClientSession
    ): Promise<MissionDocument[]> {

        const query =
            MissionModel.find({
                roadmapPhaseId,
            }).sort({
                order: 1,
            });

        if (session) {
            query.session(session);
        }

        return query;
    }

    async findCurrentMission(
        roadmapPhaseId: string,
        session?: ClientSession
    ): Promise<MissionDocument | null> {

        const query =
            MissionModel.findOne({

                roadmapPhaseId,

                status:
                    ProgressStatus.IN_PROGRESS,
            });

        if (session) {
            query.session(session);
        }

        return query;
    }

    async findFirstMission(
        roadmapPhaseId: string,
        session?: ClientSession
    ): Promise<MissionDocument | null> {

        const query =
            MissionModel.findOne({
                roadmapPhaseId,
            }).sort({
                order: 1,
            });

        if (session) {
            query.session(session);
        }

        return query;
    }

    async findByOrder(
        roadmapPhaseId: string,
        order: number,
        session?: ClientSession
    ): Promise<MissionDocument | null> {

        const query =
            MissionModel.findOne({

                roadmapPhaseId,

                order,
            });

        if (session) {
            query.session(session);
        }

        return query;
    }

    async updateById(
        id: string,
        data: UpdateMissionData,
        session?: ClientSession
    ): Promise<MissionDocument | null> {

        const query = MissionModel.findByIdAndUpdate(
            id,
            data,
            {
                new: true,
                runValidators: true,
                session,
            }
        );

        return query;


    }

    async deleteById(
        id: string,
        session?: ClientSession
    ): Promise<MissionDocument | null> {

        return MissionModel.findByIdAndDelete(
            id,
            {
                session,
            }
        );
    }

    async findCompletedMissions(
        roadmapPhaseId: string,
        session?: ClientSession
    ): Promise<MissionDocument[]> {

        const query =
            MissionModel.find({

                roadmapPhaseId,

                status:
                    ProgressStatus.COMPLETED,
            });

        if (session) {
            query.session(session);
        }

        return query;
    }
}

export const missionRepository =
    new MissionRepository();
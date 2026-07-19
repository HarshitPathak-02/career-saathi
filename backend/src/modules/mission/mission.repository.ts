import {
    ClientSession,
    Types,
    UpdateQuery,
} from "mongoose";

import {
    MissionDocument,
    MissionModel,
} from "./mission.schema.js";

import {
    MissionStatus,
} from "./mission.enums.js";

class MissionRepository {

    async create(
        data: Partial<MissionDocument>,
        session?: ClientSession
    ) {
        const [mission] =
            await MissionModel.create(
                [data],
                { session }
            );

        return mission;
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
        return MissionModel
            .findOne(filter)
            .session(session ?? null);
    }

    async findMany(
        filter: Record<string, unknown>,
        session?: ClientSession
    ) {
        return MissionModel
            .find(filter)
            .session(session ?? null);
    }

    async exists(
        filter: Record<string, unknown>,
        session?: ClientSession
    ) {
        const exists =
            await MissionModel
                .exists(filter)
                .session(session ?? null);

        return Boolean(exists);
    }

    async updateById(
        id: Types.ObjectId,
        update: UpdateQuery<MissionDocument>,
        session?: ClientSession
    ) {
        return MissionModel.findByIdAndUpdate(
            id,
            update,
            {
                new: true,
                session,
            }
        );
    }

    async findLatestMission(
        careerJourneyId: Types.ObjectId
    ) {
        return MissionModel
            .findOne({
                careerJourneyId,
            })
            .sort({
                missionNumber: -1,
            });
    }

    async findActiveMission(
        careerJourneyId: Types.ObjectId
    ) {
        return MissionModel.findOne({
            careerJourneyId,
            status: MissionStatus.ACTIVE,
        });
    }

    async findUpcomingMission(
        careerJourneyId: Types.ObjectId
    ) {
        return MissionModel
            .findOne({
                careerJourneyId,
                status: MissionStatus.UPCOMING,
            })
            .sort({
                missionNumber: 1,
            });
    }

    async findByMissionNumber(
        careerJourneyId: Types.ObjectId,
        missionNumber: number
    ) {
        return MissionModel.findOne({
            careerJourneyId,
            missionNumber,
        });
    }

    async updateStatus(
        id: Types.ObjectId,
        status: MissionStatus,
        session?: ClientSession
    ) {
        const update: UpdateQuery<MissionDocument> = {
            status,
        };

        if (status === MissionStatus.ACTIVE) {
            update.activatedAt = new Date();
        }

        return MissionModel.findByIdAndUpdate(
            id,
            update,
            {
                new: true,
                session,
            }
        );
    }
    async findAllByCareerJourney(
        careerJourneyId: Types.ObjectId
    ) {
        return MissionModel
            .find({
                careerJourneyId,
            })
            .sort({
                missionNumber: 1,
            });
    }

}

export const missionRepository =
    new MissionRepository();
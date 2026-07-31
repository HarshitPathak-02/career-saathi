import {
    ClientSession,
    Types,
    UpdateQuery,
} from "mongoose";

import {
    MissionDocument,
    MissionModel,
} from "./mission.model.js";

import {
    MissionStatus,
} from "./mission.enums.js";

import {
    CreateMissionDTO,
} from "./mission.types.js";

class MissionRepository {

    async create(
        data: CreateMissionDTO,
        session?: ClientSession
    ): Promise<MissionDocument> {

        const [mission] =
            await MissionModel.create(
                [data],
                {
                    session,
                }
            );

        return mission;
    }

    async findById(
        id: Types.ObjectId,
        session?: ClientSession
    ): Promise<MissionDocument | null> {

        return this.findOne(
            {
                _id: id,
            },
            session
        );
    }

    async findOne(
        filter: Record<string, unknown>,
        session?: ClientSession
    ): Promise<MissionDocument | null> {

        return MissionModel
            .findOne(filter)
            .session(
                session ?? null
            );
    }

    async findMany(
        filter: Record<string, unknown>,
        session?: ClientSession
    ): Promise<MissionDocument[]> {

        return MissionModel
            .find(filter)
            .session(
                session ?? null
            );
    }

    async exists(
        filter: Record<string, unknown>,
        session?: ClientSession
    ): Promise<boolean> {

        const exists =
            await MissionModel
                .exists(filter)
                .session(
                    session ?? null
                );

        return Boolean(exists);
    }

    async updateById(
        id: Types.ObjectId,
        update: UpdateQuery<MissionDocument>,
        session?: ClientSession
    ): Promise<MissionDocument | null> {

        return MissionModel
            .findByIdAndUpdate(
                id,
                update,
                {
                    new: true,
                    runValidators: true,
                    session,
                }
            );
    }

    async findLatestMission(
        careerJourneyId: Types.ObjectId,
        session?: ClientSession
    ): Promise<MissionDocument | null> {

        return MissionModel
            .findOne({
                careerJourneyId,
            })
            .sort({
                missionNumber: -1,
            })
            .session(
                session ?? null
            );
    }

    async findActiveMission(
        careerJourneyId: Types.ObjectId,
        session?: ClientSession
    ): Promise<MissionDocument | null> {

        return MissionModel
            .findOne({
                careerJourneyId,

                status:
                    MissionStatus.ACTIVE,
            })
            .session(
                session ?? null
            );
    }

    async findByMissionNumber(
        careerJourneyId: Types.ObjectId,
        missionNumber: number,
        session?: ClientSession
    ): Promise<MissionDocument | null> {

        return MissionModel
            .findOne({
                careerJourneyId,
                missionNumber,
            })
            .session(
                session ?? null
            );
    }

    async updateStatus(
        id: Types.ObjectId,
        status: MissionStatus,
        session?: ClientSession
    ): Promise<MissionDocument | null> {

        return MissionModel
            .findByIdAndUpdate(
                id,
                {
                    status,
                },
                {
                    new: true,
                    runValidators: true,
                    session,
                }
            );
    }

    async findAllByCareerJourney(
        careerJourneyId: Types.ObjectId,
        session?: ClientSession
    ): Promise<MissionDocument[]> {

        return MissionModel
            .find({
                careerJourneyId,
            })
            .sort({
                missionNumber: -1,
            })
            .session(
                session ?? null
            );
    }

    async findFirstMission(
        careerJourneyId:
            Types.ObjectId,

        session?:
            ClientSession
    ): Promise<
        MissionDocument | null
    > {

        return MissionModel
            .findOne({
                careerJourneyId,
            })
            .sort({
                missionNumber: 1,
            })
            .session(
                session ?? null
            );
    }

    async findByCareerJourneyAndDateRange(
        careerJourneyId:
            Types.ObjectId,

        startDate:
            Date,

        endDate:
            Date,

        session?:
            ClientSession
    ): Promise<MissionDocument[]> {

        return MissionModel
            .find({
                careerJourneyId,

                startDate: {
                    $lte: endDate,
                },

                endDate: {
                    $gte: startDate,
                },
            })
            .sort({
                startDate: 1,
            })
            .session(
                session ?? null
            );
    }

    /*
|--------------------------------------------------------------------------
| Find First Mission By Career Journey
|--------------------------------------------------------------------------
*/

    async findFirstByCareerJourney(
        careerJourneyId:
            Types.ObjectId,

        session?:
            ClientSession
    ): Promise<
        MissionDocument | null
    > {

        return MissionModel
            .findOne({
                careerJourneyId,
            })
            .sort({
                missionNumber: 1,
            })
            .session(
                session ?? null
            );
    }

    async findLatestMissionByRoadmap(
        roadmapId: Types.ObjectId,
        session?: ClientSession
    ): Promise<MissionDocument | null> {

        return MissionModel
            .findOne({
                roadmapId,
            })
            .sort({
                missionNumber: -1,
            })
            .session(
                session ?? null
            );
    }

    async findActiveMissionByRoadmap(
        roadmapId: Types.ObjectId,
        session?: ClientSession
    ): Promise<MissionDocument | null> {

        return MissionModel
            .findOne({
                roadmapId,

                status:
                    MissionStatus.ACTIVE,
            })
            .sort({
                missionNumber: -1,
            })
            .session(
                session ?? null
            );
    }
}

export const missionRepository =
    new MissionRepository();
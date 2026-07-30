import {
    ClientSession,
    Types,
    UpdateQuery,
} from "mongoose";

import {
    RoadmapDocument,
    RoadmapModel,
} from "./roadmap.model.js";

import {
    RoadmapStatus,
} from "./roadmap.enums.js";

class RoadmapRepository {

    async create(
        data: Partial<RoadmapDocument>,
        session?: ClientSession
    ) {
        const [roadmap] =
            await RoadmapModel.create(
                [data],
                {
                    session,
                }
            );

        return roadmap;
    }

    async findById(
        id: Types.ObjectId,
        session?: ClientSession
    ) {
        return this.findOne(
            {
                _id: id,
            },
            session
        );
    }

    async findByCareerJourneyId(
        careerJourneyId: Types.ObjectId,
        session?: ClientSession
    ) {
        return this.findOne(
            {
                careerJourneyId,
            },
            session
        );
    }

    async findLatestByCareerJourneyId(
        careerJourneyId: Types.ObjectId,
        session?: ClientSession
    ) {
        return RoadmapModel
            .findOne({
                careerJourneyId,
            })
            .sort({
                version: -1,
            })
            .session(
                session ?? null
            );
    }

    async findByCareerJourneyAndVersion(
        careerJourneyId: Types.ObjectId,
        version: number,
        session?: ClientSession
    ) {

        return RoadmapModel
            .findOne({
                careerJourneyId,
                version,
            })
            .session(
                session ?? null
            );
    }

    async findAllByCareerJourneyId(
        careerJourneyId: Types.ObjectId,
        session?: ClientSession
    ) {

        return RoadmapModel
            .find({
                careerJourneyId,
            })
            .sort({
                version: -1,
            })
            .session(
                session ?? null
            );
    }

    async findOne(
        filter: Record<string, unknown>,
        session?: ClientSession
    ) {
        return RoadmapModel
            .findOne(filter)
            .session(session ?? null);
    }

    async findMany(
        filter: Record<string, unknown>,
        session?: ClientSession
    ) {
        return RoadmapModel
            .find(filter)
            .session(session ?? null);
    }

    async exists(
        filter: Record<string, unknown>,
        session?: ClientSession
    ) {
        const exists =
            await RoadmapModel
                .exists(filter)
                .session(session ?? null);

        return Boolean(exists);
    }

    async updateById(
        id: Types.ObjectId,
        update: UpdateQuery<RoadmapDocument>,
        session?: ClientSession
    ) {
        return RoadmapModel.findByIdAndUpdate(
            id,
            update,
            {
                new: true,
                runValidators: true,
                session,
            }
        );
    }

    async updateStatus(
        id: Types.ObjectId,
        status: RoadmapStatus,
        session?: ClientSession
    ) {

        return RoadmapModel.findByIdAndUpdate(
            id,
            {
                status,

                ...(status === RoadmapStatus.ACTIVE && {
                    generatedAt: new Date(),
                }),

                ...(status === RoadmapStatus.COMPLETED && {
                    completedAt: new Date(),
                }),
            },
            {
                new: true,
                runValidators: true,
                session,
            }
        );
    }

    async updateCompletedItems(
        roadmapId: Types.ObjectId,
        completedItems: number,
        session?: ClientSession
    ) {
        return RoadmapModel.findByIdAndUpdate(
            roadmapId,
            {
                completedItems,
            },
            {
                new: true,
                runValidators: true,
                session,
            }
        );
    }

    /*
|--------------------------------------------------------------------------
| Find Roadmaps Overlapping Period
|--------------------------------------------------------------------------
*/

    async findByCareerJourneyAndPeriod(
        careerJourneyId:
            Types.ObjectId,

        periodStart:
            Date,

        periodEnd:
            Date,

        session?:
            ClientSession
    ): Promise<RoadmapDocument[]> {

        return RoadmapModel
            .find({
                careerJourneyId,

                generatedAt: {
                    $lte:
                        periodEnd,
                },

                $or: [

                    {
                        completedAt: {
                            $gte:
                                periodStart,
                        },
                    },

                    {
                        completedAt:
                            null,
                    },
                ],
            })
            .sort({
                version: 1,
            })
            .session(
                session ?? null
            );
    }
}

export const roadmapRepository =
    new RoadmapRepository();
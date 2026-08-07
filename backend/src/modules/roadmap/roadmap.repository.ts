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
import { appClock } from "../../shared/time/app-clock.js";

class RoadmapRepository {

    async create(
        data: Partial<RoadmapDocument>,
        session?: ClientSession
    ): Promise<RoadmapDocument> {
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
    ): Promise<RoadmapDocument | null> {
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
    ): Promise<RoadmapDocument | null> {
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
    ): Promise<RoadmapDocument | null> {
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
    ): Promise<RoadmapDocument | null> {

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
    ): Promise<RoadmapDocument[]> {

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
    ): Promise<RoadmapDocument | null> {
        return RoadmapModel
            .findOne(filter)
            .session(session ?? null);
    }

    async findMany(
        filter: Record<string, unknown>,
        session?: ClientSession
    ): Promise<RoadmapDocument[]> {
        return RoadmapModel
            .find(filter)
            .session(session ?? null);
    }

    async exists(
        filter: Record<string, unknown>,
        session?: ClientSession
    ): Promise<boolean> {
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
    ): Promise<RoadmapDocument | null> {
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
    ): Promise<RoadmapDocument | null> {

        return RoadmapModel.findByIdAndUpdate(
            id,
            {
                status,

                ...(status === RoadmapStatus.ACTIVE && {
                    generatedAt: appClock.now(),
                }),

                ...(status === RoadmapStatus.COMPLETED && {
                    completedAt: appClock.now(),
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
    ): Promise<RoadmapDocument | null> {
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
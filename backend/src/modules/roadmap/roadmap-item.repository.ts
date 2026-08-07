import {
    ClientSession,
    Types,
    UpdateQuery,
} from "mongoose";

import {
    RoadmapItemDocument,
    RoadmapItemModel,
} from "./roadmap-item.model.js";

import {
    RoadmapItemStatus,
} from "./roadmap.enums.js";
import { appClock } from "../../shared/time/app-clock.js";

class RoadmapItemRepository {

    async createMany(
        data: Partial<RoadmapItemDocument>[],
        session?: ClientSession
    ): Promise<RoadmapItemDocument[]> {
        return RoadmapItemModel.insertMany(
            data,
            {
                session,
            }
        );
    }

    async findById(
        id: Types.ObjectId,
        session?: ClientSession
    ): Promise<RoadmapItemDocument | null> {
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
    ): Promise<RoadmapItemDocument | null> {
        return RoadmapItemModel
            .findOne(filter)
            .session(session ?? null);
    }

    async findMany(
        filter: Record<string, unknown>,
        session?: ClientSession
    ): Promise<RoadmapItemDocument[]> {
        return RoadmapItemModel
            .find(filter)
            .sort({
                order: 1,
            })
            .session(session ?? null);
    }

    async findByRoadmapId(
        roadmapId: Types.ObjectId,
        session?: ClientSession
    ): Promise<RoadmapItemDocument[]> {
        return this.findMany(
            {
                roadmapId,
            },
            session
        );
    }

    async updateStatus(
        id:
            Types.ObjectId,

        status:
            RoadmapItemStatus,

        session?:
            ClientSession
    ): Promise<RoadmapItemDocument | null> {

        return RoadmapItemModel
            .findByIdAndUpdate(
                id,
                {
                    $set: {

                        status,

                        completedAt:
                            status ===
                                RoadmapItemStatus.COMPLETED
                                ? appClock.now()
                                : null,
                    },
                },
                {
                    new: true,

                    runValidators: true,

                    session,
                }
            );
    }

    async findNextPendingItems(
        roadmapId: Types.ObjectId,
        limit: number,
        session?: ClientSession
    ): Promise<RoadmapItemDocument[]> {
        return RoadmapItemModel
            .find({
                roadmapId,

                status:
                    RoadmapItemStatus.PENDING,
            })
            .sort({
                order: 1,
            })
            .limit(limit)
            .session(session ?? null);
    }

    async countCompleted(
        roadmapId: Types.ObjectId,
        session?: ClientSession
    ): Promise<number> {
        return RoadmapItemModel
            .countDocuments({
                roadmapId,

                status:
                    RoadmapItemStatus.COMPLETED,
            })
            .session(session ?? null);
    }

    async findByIds(
        ids: Types.ObjectId[],
        session?: ClientSession
    ): Promise<RoadmapItemDocument[]> {
        return RoadmapItemModel
            .find({
                _id: {
                    $in: ids,
                },
            })
            .sort({
                order: 1,
            })
            .session(session ?? null);
    }

    async findPendingItems(
        roadmapId: Types.ObjectId,
        session?: ClientSession
    ): Promise<RoadmapItemDocument[]> {
        return RoadmapItemModel
            .find({
                roadmapId,

                status:
                    RoadmapItemStatus.PENDING,
            })
            .sort({
                order: 1,
            })
            .session(session ?? null);
    }

    async findInProgressItems(
        roadmapId: Types.ObjectId,
        session?: ClientSession
    ): Promise<RoadmapItemDocument[]> {

        return RoadmapItemModel
            .find({
                roadmapId,

                status:
                    RoadmapItemStatus.IN_PROGRESS,
            })
            .sort({
                order: 1,
            })
            .session(
                session ?? null
            );
    }


    async findCompletedInPeriod(
        roadmapIds:
            Types.ObjectId[],

        startDate:
            Date,

        endDate:
            Date,

        session?:
            ClientSession
    ): Promise<RoadmapItemDocument[]> {

        if (
            roadmapIds.length === 0
        ) {
            return [];
        }

        return RoadmapItemModel
            .find({
                roadmapId: {
                    $in: roadmapIds,
                },

                status:
                    RoadmapItemStatus.COMPLETED,

                completedAt: {
                    $gte: startDate,
                    $lte: endDate,
                },
            })
            .sort({
                completedAt: 1,
            })
            .session(
                session ?? null
            );
    }

    async findByRoadmapIds(
        roadmapIds:
            Types.ObjectId[],

        session?:
            ClientSession
    ): Promise<RoadmapItemDocument[]> {

        if (
            roadmapIds.length === 0
        ) {
            return [];
        }


        return RoadmapItemModel
            .find({
                roadmapId: {
                    $in:
                        roadmapIds,
                },
            })
            .sort({
                order: 1,
            })
            .session(
                session ?? null
            );
    }
}

export const roadmapItemRepository =
    new RoadmapItemRepository();
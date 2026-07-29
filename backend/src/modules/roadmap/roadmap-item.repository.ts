import {
    ClientSession,
    Types,
    UpdateQuery,
} from "mongoose";

import {
    RoadmapItemDocument,
    RoadmapItemModel,
} from "./roadmap-item.schema.js";

import {
    RoadmapItemStatus,
} from "./roadmap.enums.js";

class RoadmapItemRepository {

    async createMany(
        data: Partial<RoadmapItemDocument>[],
        session?: ClientSession
    ) {
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
    ) {
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
    ) {
        return RoadmapItemModel
            .findOne(filter)
            .session(session ?? null);
    }

    async findMany(
        filter: Record<string, unknown>,
        session?: ClientSession
    ) {
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
    ) {
        return this.findMany(
            {
                roadmapId,
            },
            session
        );
    }

    async exists(
        filter: Record<string, unknown>,
        session?: ClientSession
    ) {
        const exists =
            await RoadmapItemModel
                .exists(filter)
                .session(session ?? null);

        return Boolean(exists);
    }

    async updateById(
        id: Types.ObjectId,
        update: UpdateQuery<RoadmapItemDocument>,
        session?: ClientSession
    ) {
        return RoadmapItemModel.findByIdAndUpdate(
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
        status: RoadmapItemStatus,
        session?: ClientSession
    ) {
        return RoadmapItemModel.findByIdAndUpdate(
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

    async findNextPendingItems(
        roadmapId: Types.ObjectId,
        limit: number,
        session?: ClientSession
    ) {
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
    ) {
        return RoadmapItemModel
            .countDocuments({
                roadmapId,

                status:
                    RoadmapItemStatus.COMPLETED,
            })
            .session(session ?? null);
    }

    async deleteByRoadmapId(
        roadmapId: Types.ObjectId,
        session?: ClientSession
    ) {
        return RoadmapItemModel.deleteMany(
            {
                roadmapId,
            },
            {
                session,
            }
        );
    }

    async findByIds(
        ids: Types.ObjectId[],
        session?: ClientSession
    ) {
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
}

export const roadmapItemRepository =
    new RoadmapItemRepository();
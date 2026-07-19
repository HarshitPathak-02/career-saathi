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
        return RoadmapItemModel.findOne(filter);
    }

    async findMany(
        filter: Record<string, unknown>,
        session?: ClientSession
    ) {
        return RoadmapItemModel.find(filter)
            .sort({
                order: 1,
            });
    }

    async findByRoadmapId(
        roadmapId: Types.ObjectId
    ) {
        return this.findMany({
            roadmapId,
        });
    }

    async exists(
        filter: Record<string, unknown>,
        session?: ClientSession
    ) {
        const exists =
            await RoadmapItemModel.exists(filter);

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
                session,
            }
        );
    }

    async findNextPendingItems(
        roadmapId: Types.ObjectId,
        limit: number,
        session?: ClientSession
    ) {
        return RoadmapItemModel.find({
            roadmapId,
            status:
                RoadmapItemStatus.PENDING,
        })
            .sort({
                order: 1,
            })
            .limit(limit);
    }

    async countCompleted(
        roadmapId: Types.ObjectId
    ) {
        return RoadmapItemModel.countDocuments({
            roadmapId,
            status:
                RoadmapItemStatus.COMPLETED,
        });
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
}

export const roadmapItemRepository =
    new RoadmapItemRepository();
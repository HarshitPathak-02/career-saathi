import {
    ClientSession,
    Types,
    UpdateQuery,
} from "mongoose";

import {
    RoadmapDocument,
    RoadmapModel,
} from "./roadmap.schema.js";

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
                { session }
            );

        return roadmap;
    }

    async findById(
        id: Types.ObjectId
    ) {
        return this.findOne({
            _id: id,
        });
    }

    async findByCareerJourneyId(
        careerJourneyId: Types.ObjectId
    ){
        return this.findOne({
            careerJourneyId,
        });
    }

    async findOne(
        filter: Record<string, unknown>,
        session?: ClientSession
    ) {
        return RoadmapModel.findOne(filter);
    }

    async findMany(
        filter: Record<string, unknown>,
        session?: ClientSession
    ) {
        return RoadmapModel.find(filter);
    }

    async exists(
        filter: Record<string, unknown>,
        session?: ClientSession
    ) {
        const exists =
            await RoadmapModel.exists(filter);

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
                ...(status ===
                    RoadmapStatus.ACTIVE && {
                    generatedAt: new Date(),
                }),
            },
            {
                new: true,
                session,
            }
        );
    }

    async incrementCompletedItems(
        roadmapId: Types.ObjectId,
        count = 1,
        session?: ClientSession
    ) {
        return RoadmapModel.findByIdAndUpdate(
            roadmapId,
            {
                $inc: {
                    completedItems: count,
                },
            },
            {
                new: true,
                session,
            }
        );
    }

    async softDelete(
        id: Types.ObjectId,
        session?: ClientSession
    ) {
        return RoadmapModel.findByIdAndUpdate(
            id,
            {
                isDeleted: true,
                deletedAt: new Date(),
            },
            {
                new: true,
                session,
            }
        );
    }
}

export const roadmapRepository =
    new RoadmapRepository();
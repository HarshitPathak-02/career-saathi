import {
    ClientSession,
    Types,
    UpdateQuery,
} from "mongoose";

import {
    DailyTaskDocument,
    DailyTaskModel,
} from "./daily-task.model.js";

import {
    DailyTaskStatus,
} from "./daily-task.enums.js";

class DailyTaskRepository {

    async createMany(
        data: Partial<DailyTaskDocument>[],
        session?: ClientSession
    ) {

        return DailyTaskModel.insertMany(
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

        return DailyTaskModel
            .findOne(filter)
            .session(
                session ?? null
            );

    }

    async findMany(
        filter: Record<string, unknown>,
        session?: ClientSession
    ) {

        return DailyTaskModel
            .find(filter)
            .sort({
                dayNumber: 1,
            })
            .session(
                session ?? null
            );

    }

    async findByMissionId(
        missionId: Types.ObjectId,
        session?: ClientSession
    ) {

        return this.findMany(
            {
                missionId,
            },
            session
        );

    }

    async findByMissionAndDay(
        missionId: Types.ObjectId,
        dayNumber: number,
        session?: ClientSession
    ) {

        return this.findOne(
            {
                missionId,
                dayNumber,
            },
            session
        );

    }

    async findByMissionAndRoadmapItem(
        missionId: Types.ObjectId,
        roadmapItemId: Types.ObjectId,
        session?: ClientSession
    ) {

        return this.findMany(
            {
                missionId,

                roadmapItemIds:
                    roadmapItemId,
            },
            session
        );

    }

    async exists(
        filter: Record<string, unknown>,
        session?: ClientSession
    ): Promise<boolean> {

        const exists =
            await DailyTaskModel
                .exists(filter)
                .session(
                    session ?? null
                );

        return Boolean(exists);

    }

    async updateById(
        id: Types.ObjectId,
        update: UpdateQuery<DailyTaskDocument>,
        session?: ClientSession
    ) {

        return DailyTaskModel
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

    async updateStatus(
        id: Types.ObjectId,
        status: DailyTaskStatus,
        session?: ClientSession
    ) {

        return this.updateById(
            id,
            {
                status,
            },
            session
        );

    }

    async deleteByMissionId(
        missionId: Types.ObjectId,
        session?: ClientSession
    ) {

        return DailyTaskModel
            .deleteMany(
                {
                    missionId,
                },
                {
                    session,
                }
            );

    }

    async findByMissionIds(
        missionIds:
            Types.ObjectId[],

        session?:
            ClientSession
    ): Promise<DailyTaskDocument[]> {

        if (
            missionIds.length === 0
        ) {
            return [];
        }

        return DailyTaskModel
            .find({
                missionId: {
                    $in: missionIds,
                },
            })
            .session(
                session ?? null
            );
    }

}

export const dailyTaskRepository =
    new DailyTaskRepository();
import {
    ClientSession,
    Types,
    UpdateQuery,
} from "mongoose";

import {
    DailyTaskDocument,
    DailyTaskModel,
} from "./daily-task.schema.js";

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
        return DailyTaskModel.findOne(filter);
    }

    async findMany(
        filter: Record<string, unknown>,
        session?: ClientSession
    ) {
        return DailyTaskModel.find(filter)
            .sort({
                dayNumber: 1,
            });
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

    async exists(
        filter: Record<string, unknown>,
        session?: ClientSession
    ) {
        const exists =
            await DailyTaskModel.exists(filter);

        return Boolean(exists);
    }

    async updateById(
        id: Types.ObjectId,
        update: UpdateQuery<DailyTaskDocument>,
        session?: ClientSession
    ) {
        return DailyTaskModel.findByIdAndUpdate(
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
        status: DailyTaskStatus,
        session?: ClientSession
    ) {
        return DailyTaskModel.findByIdAndUpdate(
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

    async deleteByMissionId(
        missionId: Types.ObjectId,
        session?: ClientSession
    ) {
        return DailyTaskModel.deleteMany(
            {
                missionId,
            },
            {
                session,
            }
        );
    }

}

export const dailyTaskRepository =
    new DailyTaskRepository();
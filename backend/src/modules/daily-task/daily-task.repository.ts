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
import { AppError } from "../../core/errors/app-error.js";
import { DailyTaskMessages } from "./daily-task.constants.js";
import { HTTP_STATUS } from "../../core/constants/http-status.constants.js";

class DailyTaskRepository {

    async createMany(
        data: Partial<DailyTaskDocument>[],
        session?: ClientSession
    ): Promise<DailyTaskDocument[]> {

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
    ): Promise<DailyTaskDocument | null> {

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
    ): Promise<DailyTaskDocument | null> {

        return DailyTaskModel
            .findOne(filter)
            .session(
                session ?? null
            );

    }

    async findMany(
        filter: Record<string, unknown>,
        session?: ClientSession
    ): Promise<DailyTaskDocument[]> {

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
    ): Promise<DailyTaskDocument[]> {

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
    ): Promise<DailyTaskDocument | null> {

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
    ): Promise<DailyTaskDocument[]> {

        return this.findMany(
            {
                missionId,

                roadmapItemIds:
                    roadmapItemId,
            },
            session
        );

    }

    async updateById(
        id: Types.ObjectId,
        update: UpdateQuery<DailyTaskDocument>,
        session?: ClientSession
    ): Promise<DailyTaskDocument> {
        const updatedTask = await DailyTaskModel
            .findByIdAndUpdate(
                id,
                update,
                {
                    new: true,
                    runValidators: true,
                    session,
                }
            );

        if (!updatedTask) {
            throw new AppError(
                HTTP_STATUS.NOT_FOUND,
                DailyTaskMessages.NOT_FOUND
            );
        }
        return updatedTask;

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
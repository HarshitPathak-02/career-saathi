import {
    ClientSession,
    Types,
} from "mongoose";

import {
    WeeklyReflectionDocument,
    WeeklyReflectionModel,
} from "./weekly-reflection.model.js";

import {
    CreateWeeklyReflectionDTO,
    WeeklyReflectionQuery,
} from "./weekly-reflection.types.js";
import { AppError } from "../../core/errors/app-error.js";
import { HTTP_STATUS } from "../../core/constants/http-status.constants.js";

class WeeklyReflectionRepository {

    async create(
        data: CreateWeeklyReflectionDTO,
        session?: ClientSession,
    ): Promise<WeeklyReflectionDocument> {

        const [reflection] =
            await WeeklyReflectionModel.create(
                [data],
                {
                    session,
                }
            );

        return reflection;

    }

    async findById(
        id: string | Types.ObjectId,
        session?: ClientSession,
    ): Promise<WeeklyReflectionDocument> {

        const reflection = await WeeklyReflectionModel
            .findById(id)
            .session(
                session ?? null
            );

        if (!reflection) {
            throw new AppError(
                HTTP_STATUS.NOT_FOUND,
                "Weekly Reflection not found"
            );
        }

        return reflection;

    }

    async findOne(
        query: WeeklyReflectionQuery,
        session?: ClientSession,
    ): Promise<WeeklyReflectionDocument> {

        const weeklyReflection = await WeeklyReflectionModel
            .findOne(query)
            .session(
                session ?? null
            );

        if (!weeklyReflection) {
            throw new AppError(
                HTTP_STATUS.NOT_FOUND,
                "Weekly Reflection not found"
            );
        }

        return weeklyReflection;

    }

    async exists(
        query: WeeklyReflectionQuery,
        session?: ClientSession,
    ): Promise<boolean> {

        const exists =
            await WeeklyReflectionModel
                .exists(query)
                .session(
                    session ?? null
                );

        return Boolean(exists);

    }

    async findByMissionIds(
        missionIds:
            Types.ObjectId[],

        session?:
            ClientSession
    ): Promise<
        WeeklyReflectionDocument[]
    > {

        if (
            missionIds.length === 0
        ) {
            return [];
        }

        return WeeklyReflectionModel
            .find({
                missionId: {
                    $in: missionIds,
                },
            })
            .sort({
                weekNumber: 1,
            })
            .session(
                session ?? null
            );
    }
}

export const weeklyReflectionRepository =
    new WeeklyReflectionRepository();
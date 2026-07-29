import {
    ClientSession,
    Types,
} from "mongoose";

import {
    WeeklyReflectionModel,
} from "./weekly-reflection.model.js";

import {
    CreateWeeklyReflectionDTO,
    WeeklyReflectionQuery,
} from "./weekly-reflection.types.js";

class WeeklyReflectionRepository {

    async create(
        data: CreateWeeklyReflectionDTO,
        session?: ClientSession,
    ) {

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
    ) {

        return WeeklyReflectionModel
            .findById(id)
            .session(
                session ?? null
            );

    }

    async findOne(
        query: WeeklyReflectionQuery,
        session?: ClientSession,
    ) {

        return WeeklyReflectionModel
            .findOne(query)
            .session(
                session ?? null
            );

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

}

export const weeklyReflectionRepository =
    new WeeklyReflectionRepository();
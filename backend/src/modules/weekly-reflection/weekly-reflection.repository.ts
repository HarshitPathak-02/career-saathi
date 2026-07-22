import { ClientSession, Types } from "mongoose";

import {
    WeeklyReflectionModel,
} from "./weekly-reflection.schema.js";

import {
    CreateWeeklyReflectionDTO,
    WeeklyReflectionQuery,
} from "./weekly-reflection.types.js";

class WeeklyReflectionRepository {

    async create(
        data: CreateWeeklyReflectionDTO,
        session?: ClientSession,
    ) {

        const reflection = new WeeklyReflectionModel(data);

        return reflection.save({ session });

    }

    async findById(
        id: string | Types.ObjectId
    ) {

        return WeeklyReflectionModel.findById(id);

    }

    async findOne(
        query: WeeklyReflectionQuery
    ) {

        return WeeklyReflectionModel.findOne(query);

    }

    async exists(
        query: WeeklyReflectionQuery
    ) {

        return WeeklyReflectionModel.exists(query);

    }

}

export const weeklyReflectionRepository = new WeeklyReflectionRepository();
import {
    ClientSession,
    Types,
} from "mongoose";

import {
    weeklyReflectionRepository,
} from "./weekly-reflection.repository.js";

import {
    CreateWeeklyReflectionDTO,
    WeeklyReflectionQuery,
} from "./weekly-reflection.types.js";


import {
    AppError,
} from "../../core/errors/app-error.js";

import {
    WeeklyReflectionDocument,
} from "./weekly-reflection.model.js";
import { WeeklyReflectionMessages } from "./weekly-reflection.constants.js";

class WeeklyReflectionService {

    async createReflection(
        data: CreateWeeklyReflectionDTO,
        session?: ClientSession,
    ): Promise<WeeklyReflectionDocument> {

        return weeklyReflectionRepository.create(
            data,
            session
        );

    }

    async getReflectionById(
        reflectionId: Types.ObjectId,
        session?: ClientSession,
    ): Promise<WeeklyReflectionDocument> {

        const reflection =
            await weeklyReflectionRepository.findById(
                reflectionId,
                session
            );

        if (!reflection) {

            throw new AppError(
                404,
                WeeklyReflectionMessages.NOT_FOUND
            );

        }

        return reflection;

    }

    async getReflection(
        query: WeeklyReflectionQuery,
        session?: ClientSession,
    ): Promise<WeeklyReflectionDocument | null> {

        return weeklyReflectionRepository.findOne(
            query,
            session
        );

    }

    async exists(
        query: WeeklyReflectionQuery,
        session?: ClientSession,
    ): Promise<boolean> {

        return weeklyReflectionRepository.exists(
            query,
            session
        );

    }

    async getReflectionByMissionId(
        missionId: string,
        session?: ClientSession,
    ): Promise<WeeklyReflectionDocument> {

        const reflection =
            await this.getReflection(
                {
                    missionId:
                        new Types.ObjectId(
                            missionId
                        ),
                },
                session
            );

        if (!reflection) {

            throw new AppError(
                404,
                WeeklyReflectionMessages.NOT_FOUND
            );

        }

        return reflection;

    }

}

export const weeklyReflectionService =
    new WeeklyReflectionService();
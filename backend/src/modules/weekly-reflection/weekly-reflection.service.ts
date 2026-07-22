import { ClientSession, Types } from "mongoose";

import { weeklyReflectionRepository } from "./weekly-reflection.repository.js";
import {
    CreateWeeklyReflectionDTO,
    WeeklyReflectionQuery,
} from "./weekly-reflection.types.js";
import { WeeklyReflectionMessages } from "./weekly-reflection.messages.js";
import { AppError } from "../../core/errors/app-error.js";

class WeeklyReflectionService {

    async createReflection(
        data: CreateWeeklyReflectionDTO,
        session?: ClientSession,
    ) {

        return weeklyReflectionRepository.create(
            data,
            session,
        );

    }

    async getReflectionById(
        id: string | Types.ObjectId,
    ) {

        return weeklyReflectionRepository.findById(id);

    }

    async getReflection(
        query: WeeklyReflectionQuery,
    ) {

        return weeklyReflectionRepository.findOne(query);

    }

    async exists(
        query: WeeklyReflectionQuery,
    ) {

        return weeklyReflectionRepository.exists(query);

    }

    async getReflectionByMissionId(
        missionId: string
    ) {

        const reflection =
            await this.getReflection({
                missionId:
                    new Types.ObjectId(
                        missionId
                    )
            });

        if (!reflection) {
            throw new AppError(
                404,
                WeeklyReflectionMessages.NOT_FOUND
            );
        }

        return reflection;

    }
}

export const weeklyReflectionService = new WeeklyReflectionService();
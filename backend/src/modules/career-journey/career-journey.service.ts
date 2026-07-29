import {
    Types,
} from "mongoose";

import {
    AppError,
} from "../../core/errors/app-error.js";

import {
    HTTP_STATUS,
} from "../../core/constants/http-status.constants.js";
import { CAREER_JOURNEY_MESSAGES, CareerJourneyMapper, careerJourneyRepository, CareerJourneyStatus, CreateCareerJourneyDto, UpdateCareerJourneyDto } from "./index.js";


export class CareerJourneyService {

    async createCareerJourney(
        userId: string,
        data: CreateCareerJourneyDto
    ) {

        const userObjectId =
            new Types.ObjectId(userId);

        const existingJourney =
            await careerJourneyRepository
                .findActiveByUserId(
                    userObjectId
                );

        if (existingJourney) {

            throw new AppError(
                HTTP_STATUS.CONFLICT,
                CAREER_JOURNEY_MESSAGES.ACTIVE_ALREADY_EXISTS
            );

        }

        const createInput =
            CareerJourneyMapper.toCreateInput(
                userObjectId,
                data
            );

        return careerJourneyRepository
            .create(
                createInput
            );
    }


    async getCareerJourneyById(
        userId: string,
        careerJourneyId: string
    ) {

        const userObjectId =
            new Types.ObjectId(userId);

        const careerJourneyObjectId =
            new Types.ObjectId(
                careerJourneyId
            );

        const careerJourney =
            await careerJourneyRepository
                .findByIdAndUserId(
                    careerJourneyObjectId,
                    userObjectId
                );

        if (!careerJourney) {

            throw new AppError(
                HTTP_STATUS.NOT_FOUND,
                CAREER_JOURNEY_MESSAGES.NOT_FOUND
            );

        }

        return careerJourney;
    }


    async getActiveCareerJourney(
        userId: string
    ) {

        const userObjectId =
            new Types.ObjectId(userId);

        return careerJourneyRepository
            .findActiveByUserId(
                userObjectId
            );
    }


    async updateCareerJourney(
        userId: string,
        careerJourneyId: string,
        data: UpdateCareerJourneyDto
    ) {

        const userObjectId =
            new Types.ObjectId(userId);

        const careerJourneyObjectId =
            new Types.ObjectId(
                careerJourneyId
            );

        const updateInput =
            CareerJourneyMapper
                .toUpdateInput(data);

        const careerJourney =
            await careerJourneyRepository
                .updateByIdAndUserId(
                    careerJourneyObjectId,
                    userObjectId,
                    updateInput
                );

        if (!careerJourney) {

            throw new AppError(
                HTTP_STATUS.NOT_FOUND,
                CAREER_JOURNEY_MESSAGES.NOT_FOUND
            );

        }

        return careerJourney;
    }


    async updateCareerJourneyStatus(
        userId: string,
        careerJourneyId: string,
        status: CareerJourneyStatus
    ) {

        const userObjectId =
            new Types.ObjectId(userId);

        const careerJourneyObjectId =
            new Types.ObjectId(
                careerJourneyId
            );

        const careerJourney =
            await careerJourneyRepository
                .updateStatusByIdAndUserId(
                    careerJourneyObjectId,
                    userObjectId,
                    status
                );

        if (!careerJourney) {

            throw new AppError(
                HTTP_STATUS.NOT_FOUND,
                CAREER_JOURNEY_MESSAGES.NOT_FOUND
            );

        }

        return careerJourney;
    }


    async deleteCareerJourney(
        userId: string,
        careerJourneyId: string
    ) {

        const userObjectId =
            new Types.ObjectId(userId);

        const careerJourneyObjectId =
            new Types.ObjectId(
                careerJourneyId
            );

        const careerJourney =
            await careerJourneyRepository
                .softDeleteByIdAndUserId(
                    careerJourneyObjectId,
                    userObjectId
                );

        if (!careerJourney) {

            throw new AppError(
                HTTP_STATUS.NOT_FOUND,
                CAREER_JOURNEY_MESSAGES.NOT_FOUND
            );

        }
    }
}


export const careerJourneyService =
    new CareerJourneyService();
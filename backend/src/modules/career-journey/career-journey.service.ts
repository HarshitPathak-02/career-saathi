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
import { userRepository } from "../users/user.repository.js";


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

    async getAllCareerJourneys(userId: string) {
        const userObjectId = new Types.ObjectId(userId);
        const user = await userRepository.findById(userId);
        const journeys = await careerJourneyRepository.findAllByUserId(userObjectId);

        return journeys.map((journey) => {
            const role = journey.roleId as any;
            const domain = journey.domainId as any;

            return {
                ...CareerJourneyMapper.toResponse(journey as any),
                targetRole: role?.name || "Career Target",
                targetDomain: domain?.name || "General",
                isCurrentlyActive: user?.activeCareerJourneyId
                    ? user.activeCareerJourneyId.toString() === journey._id.toString()
                    : journey.status === CareerJourneyStatus.ACTIVE,
            };
        });
    }

    async switchActiveCareerJourney(userId: string, careerJourneyId: string) {
        const userObjectId = new Types.ObjectId(userId);
        const journeyObjectId = new Types.ObjectId(careerJourneyId);

        const journey = await careerJourneyRepository.findByIdAndUserId(
            journeyObjectId,
            userObjectId
        );

        if (!journey) {
            throw new AppError(
                HTTP_STATUS.NOT_FOUND,
                CAREER_JOURNEY_MESSAGES.NOT_FOUND
            );
        }

        await userRepository.updateById(userId, {
            activeCareerJourneyId: journeyObjectId,
        });

        return {
            ...CareerJourneyMapper.toResponse(journey as any),
            isCurrentlyActive: true,
        };
    }
}


export const careerJourneyService =
    new CareerJourneyService();
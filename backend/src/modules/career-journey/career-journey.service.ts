import { Types } from "mongoose";

import {
    CreateCareerJourneyDto,
    UpdateCareerJourneyDto,
} from "./career-journey.types.js"

import { CareerJourneyStatus } from "./career-journey.enums.js";

import { careerJourneyRepository } from "./career-journey.repository.js";
import { CareerJourneyMapper } from "./career-journey.mapper.js";
import { AppError } from "../../core/errors/app-error.js";

export class CareerJourneyService {
    async createCareerJourney(
        userId: string,
        data: CreateCareerJourneyDto
    ) {

        const userObjectId = new Types.ObjectId(userId);
        const existingJourney =
            await careerJourneyRepository.findActiveByUserId(userObjectId);

        if (existingJourney) {
            throw new AppError(
                409, "An active career journey already exists."
            );
        }

        const createInput =
            CareerJourneyMapper.toCreateInput(
                userObjectId,
                data
            );

        return careerJourneyRepository.create(createInput);
    }

    async getCareerJourneyById(
        userId: string,
        careerJourneyId: string
    ) {
        const userObjectId = new Types.ObjectId(userId);
        const careerJourneyObjectId = new Types.ObjectId(careerJourneyId);

        const careerJourney =
            await careerJourneyRepository.findByIdAndUserId(userObjectId, careerJourneyObjectId,);

        if (!careerJourney) {
            throw new AppError(404, "Career journey not found.");
        }

        return careerJourney;
    }

    async getActiveCareerJourney(
        userId: string
    ) {
        const userObjectId = new Types.ObjectId(userId);
        return careerJourneyRepository.findActiveByUserId(
            userObjectId
        );
    }

    async updateCareerJourney(
        userId: string,
        careerJourneyId: string,
        data: UpdateCareerJourneyDto
    ) {
        const userObjectId = new Types.ObjectId(userId);
        const careerJourneyObjectId = new Types.ObjectId(careerJourneyId);

        const careerJourney =
            await careerJourneyRepository.findByIdAndUserId(careerJourneyObjectId, userObjectId);

        console.log("career journeysss", careerJourney)

        if (!careerJourney) {
            throw new AppError(404, "Career journey not found.");
        }

        const updateInput =
            CareerJourneyMapper.toUpdateInput(data);

        return careerJourneyRepository.updateById(
            careerJourneyObjectId,
            updateInput
        );
    }

    async updateCareerJourneyStatus(
        userId: string,
        careerJourneyId: string,
        status: CareerJourneyStatus
    ) {
        const userObjectId = new Types.ObjectId(userId);
        const careerJourneyObjectId = new Types.ObjectId(careerJourneyId);

        const careerJourney =
            await careerJourneyRepository.findByIdAndUserId(careerJourneyObjectId, userObjectId);

        if (!careerJourney) {
            throw new AppError(404, "Career journey not found.");
        }

        return careerJourneyRepository.updateStatus(
            careerJourneyObjectId,
            status
        );
    }

    async deleteCareerJourney(
        userId: string,
        careerJourneyId: string
    ) {
        const userObjectId = new Types.ObjectId(userId);
        const careerJourneyObjectId = new Types.ObjectId(careerJourneyId);

        const careerJourney =
            await careerJourneyRepository.findByIdAndUserId(careerJourneyObjectId, userObjectId);

        if (!careerJourney) {
            throw new AppError(404, "Career journey not found.");
        }

        await careerJourneyRepository.softDelete(careerJourneyObjectId);
    }
}

export const careerJourneyService =
    new CareerJourneyService();
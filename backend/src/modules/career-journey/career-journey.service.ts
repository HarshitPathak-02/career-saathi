import { CareerJourneyStatus } from './career-journey.enums.js';
import {
    CareerJourneyDocument,
    CareerJourneyResponse,
} from './career-journey.types.js';
import { careerJourneyRepository } from './career-journey.repository.js';
import { toCareerJourneyResponse } from './career-journey.mapper.js';

import { userRepository } from '../users/user.repository.js';

import { executeTransaction } from '../../shared/utils/transaction.util.js';
import { AppError } from '../../core/errors/app-error.js';
import { HTTP_STATUS } from '../../core/constants/http-status.constants.js';
import { CreateCareerJourneyInput, UpdateCareerJourneyInput } from './career-journey.validation.js';
import { CAREER_JOURNEY_MESSAGES } from './career-journey.constants.js';
import { ClientSession } from 'mongoose';

class CareerJourneyService {
    private async getOwnedJourney(
        journeyId: string,
        userId: string,
        session?: ClientSession
    ): Promise<CareerJourneyDocument> {
        const journey =
            await careerJourneyRepository.findById(
                journeyId,
                session
            );

        if (!journey) {
            throw new AppError(
                HTTP_STATUS.NOT_FOUND,
                CAREER_JOURNEY_MESSAGES.NOT_FOUND
            );
        }

        if (
            journey.userId.toString() !== userId
        ) {
            throw new AppError(
                HTTP_STATUS.FORBIDDEN,
                CAREER_JOURNEY_MESSAGES.ACCESS_DENIED
            );
        }

        return journey;
    }


    async create(
        userId: string,
        data: CreateCareerJourneyInput
    ): Promise<CareerJourneyResponse> {
        return executeTransaction(async (session) => {
            const user =
                await userRepository.findById(
                    userId,
                    session
                );

            if (!user) {
                throw new AppError(
                    HTTP_STATUS.NOT_FOUND,
                    'User not found.'
                );
            }

            const activeJourney =
                await careerJourneyRepository.findActiveByUserId(
                    userId,
                    session
                );

            if (activeJourney) {
                await careerJourneyRepository.updateById(
                    activeJourney.id,
                    {
                        status:
                            CareerJourneyStatus.PAUSED,
                    },
                    session
                );
            }

            const journey =
                await careerJourneyRepository.create(
                    {
                        userId: user._id,
                        ...data,
                        status:
                            CareerJourneyStatus.ACTIVE,
                    },
                    session
                );

            await userRepository.updateById(
                user.id,
                {
                    activeCareerJourneyId:
                        journey._id,
                },
                session
            );

            return toCareerJourneyResponse(journey);
        });
    }

    async findAll(
        userId: string
    ): Promise<CareerJourneyResponse[]> {
        const journeys =
            await careerJourneyRepository.findByUserId(
                userId
            );

        return journeys.map(
            toCareerJourneyResponse
        );
    }

    async findById(
        journeyId: string,
        userId: string
    ): Promise<CareerJourneyResponse> {
        const journey =
            await this.getOwnedJourney(
                journeyId,
                userId,
            );

        return toCareerJourneyResponse(
            journey
        );
    }

    async update(
        journeyId: string,
        userId: string,
        data: UpdateCareerJourneyInput
    ): Promise<CareerJourneyResponse> {
        await this.getOwnedJourney(
            journeyId,
            userId
        );

        const updatedJourney =
            await careerJourneyRepository.updateById(
                journeyId,
                data
            );

        if (!updatedJourney) {
            throw new AppError(
                HTTP_STATUS.NOT_FOUND,
                CAREER_JOURNEY_MESSAGES.NOT_FOUND
            );
        }

        return toCareerJourneyResponse(
            updatedJourney
        );
    }

    async delete(
        journeyId: string,
        userId: string
    ): Promise<void> {
        return executeTransaction(
            async (session) => {

                const journey =
                    await this.getOwnedJourney(
                        journeyId,
                        userId,
                        session
                    );

                await careerJourneyRepository.deleteById(
                    journeyId,
                    session
                );

                if (
                    journey.status ===
                    CareerJourneyStatus.ACTIVE
                ) {
                    await userRepository.updateById(
                        userId,
                        {
                            activeCareerJourneyId: null,
                        },
                        session
                    );
                }
            }
        );
    }

    async activate(
        journeyId: string,
        userId: string
    ): Promise<CareerJourneyResponse> {
        return executeTransaction(
            async (session) => {
                const journey =
                    await this.getOwnedJourney(
                        journeyId,
                        userId,
                        session
                    );

                if (
                    journey.status ===
                    CareerJourneyStatus.ACTIVE
                ) {
                    return toCareerJourneyResponse(
                        journey
                    );
                }

                const activeJourney =
                    await careerJourneyRepository.findActiveByUserId(
                        userId,
                        session
                    );

                if (activeJourney) {
                    await careerJourneyRepository.updateById(
                        activeJourney.id,
                        {
                            status:
                                CareerJourneyStatus.PAUSED,
                        },
                        session
                    );
                }

                const updatedJourney =
                    await careerJourneyRepository.updateById(
                        journey.id,
                        {
                            status:
                                CareerJourneyStatus.ACTIVE,
                        },
                        session
                    );

                await userRepository.updateById(
                    userId,
                    {
                        activeCareerJourneyId:
                            journey._id,
                    },
                    session
                );

                if (!updatedJourney) {
                    throw new AppError(
                        HTTP_STATUS.NOT_FOUND,
                        CAREER_JOURNEY_MESSAGES.NOT_FOUND
                    );
                }

                return toCareerJourneyResponse(
                    updatedJourney
                );
            }
        );
    }

}

export const careerJourneyService =
    new CareerJourneyService();
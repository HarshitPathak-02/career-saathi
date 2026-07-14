import {
    CareerJourneyDocument,
    CreateCareerJourneyData,
    UpdateCareerJourneyData,
} from './career-journey.types.js';

import { CareerJourneyModel } from './career-journey.model.js';
import { CareerJourneyStatus } from './career-journey.enums.js';
import { ClientSession } from 'mongoose';

class CareerJourneyRepository {
    async create(
        data: CreateCareerJourneyData,
        session?: ClientSession
    ): Promise<CareerJourneyDocument> {
        if (session) {
            const [journey] =
                await CareerJourneyModel.create(
                    [data],
                    { session }
                );

            return journey;
        }

        return CareerJourneyModel.create(data);
    }


    async findById(
        id: string,
        session?: ClientSession
    ): Promise<CareerJourneyDocument | null> {
        const query =
            CareerJourneyModel.findById(id);

        if (session) {
            query.session(session);
        }

        return query;
    }


    async findByUserId(
        userId: string,
        session?: ClientSession
    ): Promise<CareerJourneyDocument[]> {
        const query = CareerJourneyModel
            .find({
                userId,
            })
            .sort({
                createdAt: -1,
            });

        if (session) {
            query.session(session);
        }

        return query;
    }


    async findActiveByUserId(
        userId: string,
        session?: ClientSession
    ): Promise<CareerJourneyDocument | null> {

        const query =
            CareerJourneyModel.findOne({
                userId,
                status:
                    CareerJourneyStatus.ACTIVE,
            });

        if (session) {
            query.session(session);
        }

        return query;
    }

    async updateById(
        id: string,
        data: UpdateCareerJourneyData,
        session?: ClientSession
    ): Promise<CareerJourneyDocument | null> {
        return CareerJourneyModel.findByIdAndUpdate(
            id,
            data,
            {
                new: true,
                runValidators: true,
                session,
            }
        );
    }

    async deleteById(
        id: string,
        session?: ClientSession
    ): Promise<CareerJourneyDocument | null> {
        return CareerJourneyModel.findByIdAndDelete(
            id,
            { session }
        );
    }

}



export const careerJourneyRepository =
    new CareerJourneyRepository();
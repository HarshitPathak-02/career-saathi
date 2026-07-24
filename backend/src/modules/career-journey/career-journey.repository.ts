import {
    ClientSession,
    Types,
} from "mongoose";

import {
    CareerJourney,
    CareerJourneyDocument,
    CareerJourneyModel,
} from "./career-journey.model.js";

import { CreateCareerJourneyInput, UpdateCareerJourneyInput } from "./career-journey.types.js";
import { CareerJourneyStatus } from "./career-journey.enums.js";

export class CareerJourneyRepository {

    async create(
        data: CreateCareerJourneyInput,
        session?: ClientSession
    ): Promise<CareerJourney> {

        const [careerJourney] =
            await CareerJourneyModel.create(
                [data],
                {
                    session,
                }
            );

        return careerJourney;
    }

    async findByIdAndUserId(
        id: Types.ObjectId,
        userId: Types.ObjectId,
        session?: ClientSession
    ): Promise<CareerJourneyDocument | null> {

        return CareerJourneyModel.findOne({
            _id: id,
            userId,
            isDeleted: false,
        }).session(session ?? null);
    }

    async findOne(
        filter: Record<string, unknown>,
        session?: ClientSession
    ): Promise<CareerJourneyDocument | null> {

        return CareerJourneyModel.findOne({
            ...filter,
            isDeleted: false,
        }).session(session ?? null);
    }

    async exists(
        filter: Record<string, unknown>,
        session?: ClientSession
    ): Promise<boolean> {

        const exists =
            await CareerJourneyModel.exists({
                ...filter,
                isDeleted: false,
            }).session(session ?? null);

        return Boolean(exists);
    }

    async findActiveByUserId(
        userId: Types.ObjectId,
        session?: ClientSession
    ): Promise<CareerJourneyDocument | null> {

        return CareerJourneyModel.findOne({
            userId,
            status: {
                $in: [
                    CareerJourneyStatus.DRAFT,
                    CareerJourneyStatus.ACTIVE,
                ],
            },
            isDeleted: false,
        }).populate("roleId")
            .populate("domainId").session(session ?? null);
    }

    async updateById(
        id: Types.ObjectId,
        data: UpdateCareerJourneyInput,
        session?: ClientSession
    ): Promise<CareerJourney | null> {

        return CareerJourneyModel.findOneAndUpdate(
            {
                _id: id,
                isDeleted: false,
            },
            data,
            {
                new: true,
                runValidators: true,
                session,
            }
        );
    }

    async softDelete(
        id: Types.ObjectId,
        session?: ClientSession
    ): Promise<CareerJourney | null> {

        return CareerJourneyModel.findOneAndUpdate(
            {
                _id: id,
                isDeleted: false,
            },
            {
                $set: {
                    isDeleted: true,
                    deletedAt: new Date(),
                },
            },
            {
                new: true,
                session,
            }
        );
    }

    async updateStatus(
        id: Types.ObjectId,
        status: CareerJourneyStatus,
        session?: ClientSession
    ): Promise<CareerJourney | null> {
        return CareerJourneyModel.findOneAndUpdate(
            {
                _id: id,
                isDeleted: false,
            },
            {
                status,
            },
            {
                new: true,
                runValidators: true,
                session,
            }
        );
    }
}

export const careerJourneyRepository =
    new CareerJourneyRepository();
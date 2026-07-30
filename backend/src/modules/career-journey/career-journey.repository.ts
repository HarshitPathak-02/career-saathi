import {
    ClientSession,
    Types,
} from "mongoose";
import { CareerJourneyDocument, CareerJourneyModel, CareerJourneyStatus, CreateCareerJourneyInput, PopulatedCareerJourneyDocument, UpdateCareerJourneyInput } from "./index.js";




export class CareerJourneyRepository {

    async create(
        data: CreateCareerJourneyInput,
        session?: ClientSession
    ): Promise<CareerJourneyDocument> {

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

        const query =
            CareerJourneyModel.findOne({
                _id: id,
                userId,
                isDeleted: false,
            });

        if (session) {
            query.session(session);
        }

        return query;
    }

    async findOne(
        filter: Record<string, unknown>,
        session?: ClientSession
    ): Promise<CareerJourneyDocument | null> {

        const query =
            CareerJourneyModel.findOne({
                ...filter,
                isDeleted: false,
            });

        if (session) {
            query.session(session);
        }

        return query;
    }

    async exists(
        filter: Record<string, unknown>,
        session?: ClientSession
    ): Promise<boolean> {

        const query =
            CareerJourneyModel.exists({
                ...filter,
                isDeleted: false,
            });

        if (session) {
            query.session(session);
        }

        const exists =
            await query;

        return Boolean(exists);
    }

    async findActiveByUserId(
        userId: Types.ObjectId,
        session?: ClientSession
    ): Promise<PopulatedCareerJourneyDocument | null> {

        const query =
            CareerJourneyModel.findOne({
                userId,

                status: {
                    $in: [
                        CareerJourneyStatus.DRAFT,
                        CareerJourneyStatus.ACTIVE,
                        CareerJourneyStatus.READINESS,
                        CareerJourneyStatus.READY,
                    ],
                },

                isDeleted: false,
            })
                .populate("roleId")
                .populate("domainId");

        if (session) {
            query.session(session);
        }

        return query as unknown as Promise<
            PopulatedCareerJourneyDocument | null
        >;
    }

    async updateByIdAndUserId(
        id: Types.ObjectId,
        userId: Types.ObjectId,
        data: UpdateCareerJourneyInput,
        session?: ClientSession
    ): Promise<CareerJourneyDocument | null> {

        return CareerJourneyModel.findOneAndUpdate(
            {
                _id: id,
                userId,
                isDeleted: false,
            },
            {
                $set: data,
            },
            {
                new: true,
                runValidators: true,
                session,
            }
        );
    }

    async updateStatusByIdAndUserId(
        id: Types.ObjectId,
        userId: Types.ObjectId,
        status: CareerJourneyStatus,
        session?: ClientSession
    ): Promise<CareerJourneyDocument | null> {

        return CareerJourneyModel.findOneAndUpdate(
            {
                _id: id,
                userId,
                isDeleted: false,
            },
            {
                $set: {
                    status,
                },
            },
            {
                new: true,
                runValidators: true,
                session,
            }
        );
    }

    async updateStatusById(
        id: Types.ObjectId,
        status: CareerJourneyStatus,
        session?: ClientSession
    ): Promise<CareerJourneyDocument | null> {

        return CareerJourneyModel.findOneAndUpdate(
            {
                _id: id,
                isDeleted: false,
            },
            {
                $set: {
                    status,
                },
            },
            {
                new: true,
                runValidators: true,
                session,
            }
        );
    }

    async softDeleteByIdAndUserId(
        id: Types.ObjectId,
        userId: Types.ObjectId,
        session?: ClientSession
    ): Promise<CareerJourneyDocument | null> {

        return CareerJourneyModel.findOneAndUpdate(
            {
                _id: id,
                userId,
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
                runValidators: true,
                session,
            }
        );
    }

}


export const careerJourneyRepository =
    new CareerJourneyRepository();
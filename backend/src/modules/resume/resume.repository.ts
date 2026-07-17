import {
    ClientSession,
    Types,
    UpdateQuery,
} from "mongoose";

import { ResumeModel } from "./resume.model.js";

import {
    CreateResumeInput,
    UpdateResumeInput,
} from "./resume.types.js";

export class ResumeRepository {

    async create(
        data: CreateResumeInput,
        session?: ClientSession
    ) {

        const [resume] =
            await ResumeModel.create(
                [data],
                { session }
            );

        return resume;
    }

    async findById(
        resumeId: Types.ObjectId,
        session?: ClientSession
    ) {

        return ResumeModel.findOne({
            _id: resumeId,
            isDeleted: false,
        }).session(session ?? null);
    }

    async findByIdAndUserId(
        userId: Types.ObjectId,
        resumeId: Types.ObjectId,
        session?: ClientSession
    ) {

        return ResumeModel.findOne({
            _id: resumeId,
            userId,
            isDeleted: false,
        }).session(session ?? null);
    }

    async findOne(
        filter: Record<string, unknown>,
        session?: ClientSession
    ) {

        return ResumeModel.findOne({
            ...filter,
            isDeleted: false,
        }).session(session ?? null);
    }

    async findAllByUserId(
        userId: Types.ObjectId,
        session?: ClientSession
    ) {

        return ResumeModel.find({
            userId,
            isDeleted: false,
        })
            .sort({
                createdAt: -1,
            })
            .session(session ?? null);
    }

    async updateById(
        resumeId: Types.ObjectId,
        update: UpdateResumeInput,
        session?: ClientSession
    ) {

        return ResumeModel.findOneAndUpdate(
            {
                _id: resumeId,
                isDeleted: false,
            },
            update as UpdateQuery<any>,
            {
                new: true,
                runValidators: true,
                session,
            }
        );
    }

    async findByCareerJourneyId(
        careerJourneyId: Types.ObjectId,
        session?: ClientSession
    ) {

        return ResumeModel.findOne({
            careerJourneyId,
            isDeleted: false,
        }).session(session ?? null);
    }

    async findByCareerJourneyIdAndUserId(
        userId: Types.ObjectId,
        careerJourneyId: Types.ObjectId,
        session?: ClientSession
    ) {

        return ResumeModel.findOne({
            userId,
            careerJourneyId,
            isDeleted: false,
        }).session(session ?? null);
    }

    async softDelete(
        resumeId: Types.ObjectId,
        session?: ClientSession
    ) {

        return ResumeModel.findOneAndUpdate(
            {
                _id: resumeId,
                isDeleted: false,
            },
            {
                isDeleted: true,
                deletedAt: new Date(),
            },
            {
                new: true,
                session,
            }
        );
    }

    async exists(
        filter: Record<string, unknown>,
        session?: ClientSession
    ) {

        const document =
            await ResumeModel.exists({
                ...filter,
                isDeleted: false,
            }).session(session ?? null);

        return !!document;
    }
}

export const resumeRepository =
    new ResumeRepository();
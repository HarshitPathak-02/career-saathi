import {
    ClientSession,
    Types,
    UpdateQuery,
} from "mongoose";
import { SkillProgressDocument, SkillProgressModel } from "./index.js";
import { UserSkillDocument } from "../user-skill/index.js";
import { SkillCatalogDocument } from "../../master-data/skill-catalog/index.js";



class SkillProgressRepository {

    async create(
        data: Partial<SkillProgressDocument>,
        session?: ClientSession
    ): Promise<SkillProgressDocument> {

        const [skillProgress] =
            await SkillProgressModel.create(
                [data],
                {
                    session,
                }
            );

        return skillProgress;
    }

    async findById(
        id: Types.ObjectId,
        session?: ClientSession
    ): Promise<SkillProgressDocument | null> {

        return SkillProgressModel
            .findById(id)
            .session(session ?? null);
    }

    async findOne(
        filter: Record<string, unknown>,
        session?: ClientSession
    ): Promise<SkillProgressDocument | null> {

        return SkillProgressModel
            .findOne(filter)
            .session(session ?? null);
    }

    async findMany(
        filter: Record<string, unknown>,
        session?: ClientSession
    ): Promise<SkillProgressDocument[]> {

        return SkillProgressModel
            .find(filter)
            .session(session ?? null);
    }

    async exists(
        filter: Record<string, unknown>,
        session?: ClientSession
    ): Promise<boolean> {

        const exists =
            await SkillProgressModel
                .exists(filter)
                .session(session ?? null);

        return Boolean(exists);
    }

    async updateById(
        id: Types.ObjectId,
        data: UpdateQuery<SkillProgressDocument>,
        session?: ClientSession
    ): Promise<SkillProgressDocument | null> {

        return SkillProgressModel.findByIdAndUpdate(
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
        id: Types.ObjectId,
        session?: ClientSession
    ): Promise<SkillProgressDocument | null> {

        return SkillProgressModel.findByIdAndDelete(
            id,
            {
                session,
            }
        );
    }

    async findHistoryByUserSkill(
        userSkillId: Types.ObjectId,
        session?: ClientSession
    ): Promise<SkillProgressDocument[]> {

        return SkillProgressModel
            .find({
                userSkillId,
            })
            .sort({
                createdAt: 1,
            })
            .session(session ?? null);
    }

    async findLatestByUserSkill(
        userSkillId: Types.ObjectId,
        session?: ClientSession
    ): Promise<SkillProgressDocument | null> {

        return SkillProgressModel
            .findOne({
                userSkillId,
            })
            .sort({
                createdAt: -1,
            })
            .session(session ?? null);
    }

    async findByAssessment(
        assessmentId: Types.ObjectId,
        session?: ClientSession
    ) {

        return SkillProgressModel
            .find({
                assessmentId,
            })
            .populate<{
                userSkillId:
                UserSkillDocument & {
                    skillCatalogId:
                    SkillCatalogDocument;
                };
            }>({
                path: "userSkillId",

                populate: {
                    path: "skillCatalogId",
                    select: "name",
                },
            })
            .sort({
                createdAt: 1,
            })
            .session(session ?? null);
    }

    async findLatestByAssessmentAndUserSkill(
        assessmentId: Types.ObjectId,
        userSkillId: Types.ObjectId,
        session?: ClientSession
    ): Promise<SkillProgressDocument | null> {

        return SkillProgressModel
            .findOne({
                assessmentId,
                userSkillId,
            })
            .sort({
                createdAt: -1,
            })
            .session(session ?? null);
    }
}

export const skillProgressRepository =
    new SkillProgressRepository();
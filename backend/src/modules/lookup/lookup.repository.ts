import {
    ClientSession,
    Types,
} from "mongoose";

import {
    CareerDomainDocument,
    CareerDomainModel,
} from "../../master-data/career-domain/career-domain.schema.js";

import {
    CareerRoleDocument,
    CareerRoleModel,
} from "../../master-data/career-role/career-role.schema.js";

import {
    CareerRoleSkillModel,
} from "../../master-data/career-role-skill/career-role-skill.schema.js";

import {
    CareerDomainLookup,
    CareerRoleLookup,
    CareerRoleSkillLookup,
} from "./lookup.types.js";

export class LookupRepository {

    async getCareerDomains(
        session?: ClientSession
    ): Promise<CareerDomainDocument[]> {

        return CareerDomainModel.find({
            isActive: true,
        })
            .sort({
                name: 1,
            })
            .session(session ?? null);

    }

    async getCareerRolesByDomain(
        domainId: Types.ObjectId,
        session?: ClientSession,
    ): Promise<CareerRoleDocument[]> {

        return CareerRoleModel.find({
            domainId,
            isActive: true,
        })
            .sort({
                name: 1,
            })
            .session(session ?? null);

    }

    async getCareerRoleSkills(
        roleId: Types.ObjectId,
        session?: ClientSession,
    ): Promise<CareerRoleSkillLookup[]> {

        const skills =
            await CareerRoleSkillModel.aggregate([
                {
                    $match: {
                        roleId,
                    },
                },

                {
                    $lookup: {
                        from: "skill_catalog",
                        localField: "skillId",
                        foreignField: "_id",
                        as: "skill",
                    },
                },

                {
                    $unwind: "$skill",
                },

                {
                    $match: {
                        "skill.isActive": true,
                    },
                },

                {
                    $project: {

                        _id: 0,

                        skillId:
                            "$skill._id",

                        name:
                            "$skill.name",

                        slug:
                            "$skill.slug",

                        category:
                            "$skill.category",

                        difficulty:
                            "$skill.difficulty",

                        displayOrder: 1,

                        priority: 1,

                        isMandatory: 1,

                    },
                },

                {
                    $sort: {
                        displayOrder: 1,
                    },
                },

            ]).session(session ?? null);

        return skills.map(skill => ({

            skillId:
                skill.skillId.toString(),

            name:
                skill.name,

            slug:
                skill.slug,

            category:
                skill.category,

            difficulty:
                skill.difficulty,

            displayOrder:
                skill.displayOrder,

            priority:
                skill.priority,

            isMandatory:
                skill.isMandatory,

        }));

    }

    async findCareerDomainById(
        id: Types.ObjectId,
        session?: ClientSession
    ): Promise<CareerDomainDocument | null> {

        return CareerDomainModel.findOne({
            _id: id,
            isActive: true,
        }).session(session ?? null);

    }

    async findCareerRoleById(
        roleId: Types.ObjectId,
        session?: ClientSession
    ): Promise<CareerRoleDocument | null> {

        return CareerRoleModel.findOne({
            _id: roleId,
            isActive: true,
        }).session(session ?? null);

    }

}

export const lookupRepository =
    new LookupRepository();
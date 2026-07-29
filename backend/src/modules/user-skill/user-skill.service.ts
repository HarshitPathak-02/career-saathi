import {
    ClientSession,
    Types,
} from "mongoose";

import {
    userSkillRepository,
} from "./user-skill.repository.js";

import {
    careerJourneyRepository,
} from "../career-journey/career-journey.repository.js";

import {
    SkillLevel,
} from "./user-skill.enums.js";

import {
    CareerRoleSkillModel,
} from "../../master-data/career-role-skill/career-role-skill.schema.js";

import {
    SkillCatalogModel,
} from "../../master-data/skill-catalog/skill-catalog.schema.js";

import {
    AppError,
} from "../../core/errors/app-error.js";

import {
    HTTP_STATUS,
} from "../../core/constants/http-status.constants.js";

import {
    UpdateUserSkillProgressDTO,
} from "./user-skill.types.js";

class UserSkillService {

    async getAvailableSkills(
        careerJourneyId: string,
        session?: ClientSession
    ) {

        const careerJourneyObjectId =
            new Types.ObjectId(
                careerJourneyId
            );

        const journey =
            await careerJourneyRepository
                .findOne(
                    {
                        _id:
                            careerJourneyObjectId,
                    },
                    session
                );

        if (!journey) {
            throw new AppError(
                HTTP_STATUS.NOT_FOUND,
                "Career Journey not found."
            );
        }

        const roleSkillsQuery =
            CareerRoleSkillModel
                .find({
                    roleId:
                        journey.roleId,
                })
                .sort({
                    displayOrder: 1,
                });

        if (session) {
            roleSkillsQuery.session(
                session
            );
        }

        const roleSkills =
            await roleSkillsQuery.lean();

        const skillIds =
            roleSkills.map(
                roleSkill =>
                    roleSkill.skillId
            );

        const skillsQuery =
            SkillCatalogModel.find({
                _id: {
                    $in:
                        skillIds,
                },

                isActive: true,
            });

        if (session) {
            skillsQuery.session(
                session
            );
        }

        return skillsQuery.lean();
    }

    async initializeUserSkills(
        careerJourneyId: string,
        selectedSkillCatalogIds:
            Types.ObjectId[],
        session?: ClientSession
    ) {

        const careerJourneyObjectId =
            new Types.ObjectId(
                careerJourneyId
            );

        const journey =
            await careerJourneyRepository
                .findOne(
                    {
                        _id:
                            careerJourneyObjectId,
                    },
                    session
                );

        if (!journey) {
            throw new AppError(
                HTTP_STATUS.NOT_FOUND,
                "Career Journey not found."
            );
        }

        const alreadyInitialized =
            await userSkillRepository
                .exists(
                    {
                        careerJourneyId:
                            careerJourneyObjectId,

                        isActive: true,
                    },
                    session
                );

        if (alreadyInitialized) {
            throw new AppError(
                HTTP_STATUS.CONFLICT,
                "User skills have already been initialized."
            );
        }

        const roleSkillsQuery =
            CareerRoleSkillModel
                .find({
                    roleId:
                        journey.roleId,
                })
                .sort({
                    displayOrder: 1,
                });

        if (session) {
            roleSkillsQuery.session(
                session
            );
        }

        const roleSkills =
            await roleSkillsQuery.lean();

        const skillsQuery =
            SkillCatalogModel.find({
                _id: {
                    $in:
                        roleSkills.map(
                            roleSkill =>
                                roleSkill.skillId
                        ),
                },

                isActive: true,
            });

        if (session) {
            skillsQuery.session(
                session
            );
        }

        const skills =
            await skillsQuery;

        const documents =
            skills.map(
                skill => ({
                    careerJourneyId:
                        careerJourneyObjectId,

                    skillCatalogId:
                        skill._id,

                    selectedByUser:
                        selectedSkillCatalogIds
                            .some(
                                id =>
                                    id.toString() ===
                                    skill._id.toString()
                            ),

                    currentScore: 0,

                    currentLevel:
                        SkillLevel.NOT_STARTED,

                    isActive: true,
                })
            );

        await userSkillRepository
            .createMany(
                documents,
                session
            );
    }

    async getUserSkills(
        careerJourneyId: string,
        session?: ClientSession
    ) {

        const careerJourneyObjectId =
            new Types.ObjectId(
                careerJourneyId
            );

        return userSkillRepository
            .findMany(
                {
                    careerJourneyId:
                        careerJourneyObjectId,

                    isActive: true,
                },
                undefined,
                undefined,
                session
            );
    }

    async updateSelectedSkills(
        careerJourneyId: string,
        selectedSkillCatalogIds:
            Types.ObjectId[],
        session?: ClientSession
    ) {

        const careerJourneyObjectId =
            new Types.ObjectId(
                careerJourneyId
            );

        await userSkillRepository
            .updateMany(
                {
                    careerJourneyId:
                        careerJourneyObjectId,
                },
                {
                    $set: {
                        selectedByUser:
                            false,
                    },
                },
                session
            );

        await userSkillRepository
            .updateMany(
                {
                    careerJourneyId:
                        careerJourneyObjectId,

                    skillCatalogId: {
                        $in:
                            selectedSkillCatalogIds,
                    },
                },
                {
                    $set: {
                        selectedByUser:
                            true,
                    },
                },
                session
            );

        return this.getUserSkills(
            careerJourneyId,
            session
        );
    }

    async updateManySkills(
        skills:
            UpdateUserSkillProgressDTO[],
        session?: ClientSession
    ) {

        const updatedSkills = [];

        for (const skill of skills) {

            const currentLevel =
                this.calculateSkillLevel(
                    skill.currentScore
                );

            const updatedSkill =
                await userSkillRepository
                    .updateProgress(
                        skill.userSkillId,
                        skill.currentScore,
                        currentLevel,
                        skill.lastAssessmentAt,
                        session
                    );

            updatedSkills.push(
                updatedSkill
            );
        }

        return updatedSkills;
    }

    private calculateSkillLevel(
        score: number
    ): SkillLevel {

        if (score >= 80) {
            return SkillLevel.EXPERT;
        }

        if (score >= 60) {
            return SkillLevel.ADVANCED;
        }

        if (score >= 40) {
            return SkillLevel.INTERMEDIATE;
        }

        if (score > 0) {
            return SkillLevel.BEGINNER;
        }

        return SkillLevel.NOT_STARTED;
    }

    async getUserSkillsByCatalogIds(
        careerJourneyId:
            Types.ObjectId,

        skillCatalogIds:
            Types.ObjectId[],

        session?: ClientSession
    ) {

        if (
            skillCatalogIds.length === 0
        ) {
            return [];
        }

        return userSkillRepository
            .findByCareerJourneyAndSkillCatalogIds(
                careerJourneyId,
                skillCatalogIds,
                session
            );
    }
}

export const userSkillService =
    new UserSkillService();
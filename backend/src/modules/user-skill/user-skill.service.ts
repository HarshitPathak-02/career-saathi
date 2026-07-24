import { Types } from "mongoose";

import { userSkillRepository } from "./user-skill.repository.js";
import { careerJourneyRepository } from "../career-journey/career-journey.repository.js";

import { SkillLevel } from "./user-skill.enums.js";
import { CareerJourneyStatus } from "../career-journey/career-journey.enums.js";

import { CareerRoleSkillModel } from "../../master-data/career-role-skill/career-role-skill.schema.js";
import { SkillCatalogModel } from "../../master-data/skill-catalog/skill-catalog.schema.js";

import { AppError } from "../../core/errors/app-error.js";
import { UpdateUserSkillProgressDTO } from "./user-skill.types.js";

class UserSkillService {
    async getAvailableSkills(
        careerJourneyId: Types.ObjectId
    ) {
        const journey = await careerJourneyRepository.findOne({
            _id: careerJourneyId,
        });

        if (!journey) {
            throw new AppError(404, "Career Journey not found.");
        }

        const roleSkills = await CareerRoleSkillModel.find({
            roleId: journey.roleId,
        })
            .sort({ displayOrder: 1 })
            .lean();

        const skillIds = roleSkills.map(
            (roleSkill) => roleSkill.skillId
        );

        return await SkillCatalogModel.find({
            _id: {
                $in: skillIds,
            },
            isActive: true,
        }).lean();
    }

    async initializeUserSkills(
        careerJourneyId: string,
        selectedSkillCatalogIds: Types.ObjectId[]
    ) {
        const careerJourneyObjectId = new Types.ObjectId(careerJourneyId)
        const journey = await careerJourneyRepository.findOne({
            _id: careerJourneyObjectId,
        });

        if (!journey) {
            throw new AppError(404, "Career Journey not found.");
        }

        if (journey.status !== CareerJourneyStatus.DRAFT) {
            throw new AppError(
                409,
                "User skills have already been initialized."
            );
        }

        const alreadyInitialized =
            await userSkillRepository.exists({
                careerJourneyId: careerJourneyObjectId,
                isActive: true,
            });

        if (alreadyInitialized) {
            throw new AppError(
                409,
                "User skills have already been initialized."
            );
        }

        const roleSkills = await CareerRoleSkillModel.find({
            roleId: journey.roleId,
        })
            .sort({ displayOrder: 1 })
            .lean();

        const skills = await SkillCatalogModel.find({
            _id: {
                $in: roleSkills.map(
                    (roleSkill) => roleSkill.skillId
                ),
            },
            isActive: true,
        });

        const documents = skills.map((skill) => ({
            careerJourneyId: careerJourneyObjectId,

            skillCatalogId: skill._id,

            selectedByUser:
                selectedSkillCatalogIds.some(
                    (id) =>
                        id.toString() ===
                        skill._id.toString()
                ),

            currentScore: 0,

            currentLevel: SkillLevel.NOT_STARTED,

            isActive: true,
        }));

        console.log(documents);

        await userSkillRepository.createMany(documents);

        await careerJourneyRepository.updateStatus(
            careerJourneyObjectId,
            CareerJourneyStatus.ACTIVE
        );
    }

    async getUserSkills(
        careerJourneyId: Types.ObjectId
    ) {
        return userSkillRepository.findMany({
            careerJourneyId,
            isActive: true,
        });
    }

    async updateSelectedSkills(
        careerJourneyId: Types.ObjectId,
        selectedSkillCatalogIds: Types.ObjectId[]
    ) {
        await userSkillRepository.updateMany(
            {
                careerJourneyId,
            },
            {
                $set: {
                    selectedByUser: false,
                },
            }
        );

        await userSkillRepository.updateMany(
            {
                careerJourneyId,
                skillCatalogId: {
                    $in: selectedSkillCatalogIds,
                },
            },
            {
                $set: {
                    selectedByUser: true,
                },
            }
        );

        return this.getUserSkills(careerJourneyId);
    }

    async updateManySkills(
        skills: UpdateUserSkillProgressDTO[]
    ) {

        const updatedSkills = [];

        for (const skill of skills) {

            const currentLevel =
                this.calculateSkillLevel(
                    skill.currentScore
                );

            const updatedSkill =
                await userSkillRepository.updateProgress(
                    skill.userSkillId,
                    skill.currentScore,
                    currentLevel,
                    skill.lastAssessmentAt
                );

            updatedSkills.push(updatedSkill);

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
}

export const userSkillService =
    new UserSkillService();
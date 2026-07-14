import { Types } from 'mongoose';

import {
    CareerJourneyDocument,
} from '../career-journey/career-journey.types.js';
import { careerJourneyRepository } from '../career-journey/career-journey.repository.js';

import {
    CreateUserSkillData,
    UserSkillDocument,
    UserSkillResponse,
} from './skill.types.js';

import {
    CreateUserSkillsInput,
    UpdateUserSkillInput,
} from './skill.validation.js';

import {
    UserSkillSource,
} from './skill.enums.js';

import { userSkillRepository } from './skill.repository.js';
import { toUserSkillResponse } from './skill.mapper.js';
import { USER_SKILL_MESSAGES } from './skill.constant.js';

import {
    getCareerRoleByCode,
    isSkillAllowedForCareerRole,
} from '../../shared/utils/career-role.util.js';

import { getSkillByCode } from '../../shared/utils/skill.util.js';

import { executeTransaction } from '../../shared/utils/transaction.util.js';

import { AppError } from '../../core/errors/app-error.js';
import { HTTP_STATUS } from '../../core/constants/http-status.constants.js';

class UserSkillService {

    private async getOwnedJourney(
        careerJourneyId: string,
        userId: string
    ): Promise<CareerJourneyDocument> {

        const journey =
            await careerJourneyRepository.findById(
                careerJourneyId
            );

        if (!journey) {
            throw new AppError(
                HTTP_STATUS.NOT_FOUND,
                USER_SKILL_MESSAGES.CAREER_JOURNEY_NOT_FOUND
            );
        }

        if (
            journey.userId.toString() !== userId
        ) {
            throw new AppError(
                HTTP_STATUS.FORBIDDEN,
                USER_SKILL_MESSAGES.ACCESS_DENIED
            );
        }

        return journey;
    }

    private async getOwnedSkill(
        skillId: string,
        userId: string
    ): Promise<UserSkillDocument> {

        const skill =
            await userSkillRepository.findById(
                skillId
            );

        if (!skill) {
            throw new AppError(
                HTTP_STATUS.NOT_FOUND,
                USER_SKILL_MESSAGES.NOT_FOUND
            );
        }

        if (
            skill.userId.toString() !== userId
        ) {
            throw new AppError(
                HTTP_STATUS.FORBIDDEN,
                USER_SKILL_MESSAGES.ACCESS_DENIED
            );
        }

        return skill;
    }

    private validateSkills(
        journey: CareerJourneyDocument,
        submittedSkills: CreateUserSkillsInput['skills'],
        existingSkills: UserSkillDocument[]
    ) {

        const role =
            getCareerRoleByCode(
                journey.careerContext.careerRoleCode
            );

        if (!role) {
            throw new AppError(
                HTTP_STATUS.BAD_REQUEST,
                USER_SKILL_MESSAGES.INVALID_CAREER_ROLE
            );
        }

        const existingSkillCodes =
            new Set(
                existingSkills.map(
                    skill => skill.skillCode
                )
            );

        const requestSkillCodes =
            new Set<string>();

        for (const skill of submittedSkills) {

            const skillInfo =
                getSkillByCode(
                    skill.skillCode
                );

            if (!skillInfo) {
                throw new AppError(
                    HTTP_STATUS.BAD_REQUEST,
                    USER_SKILL_MESSAGES.INVALID_SKILL
                );
            }

            if (
                !isSkillAllowedForCareerRole(
                    journey.careerContext.careerRoleCode,
                    skill.skillCode
                )
            ) {
                throw new AppError(
                    HTTP_STATUS.BAD_REQUEST,
                    USER_SKILL_MESSAGES.SKILL_NOT_ALLOWED
                );
            }

            if (
                requestSkillCodes.has(
                    skill.skillCode
                )
            ) {
                throw new AppError(
                    HTTP_STATUS.BAD_REQUEST,
                    USER_SKILL_MESSAGES.DUPLICATE_SKILL
                );
            }

            requestSkillCodes.add(
                skill.skillCode
            );

            if (
                existingSkillCodes.has(
                    skill.skillCode
                )
            ) {
                throw new AppError(
                    HTTP_STATUS.CONFLICT,
                    USER_SKILL_MESSAGES.SKILL_ALREADY_EXISTS
                );
            }
        }
    }

    private mapCreateData(
        journey: CareerJourneyDocument,
        skills: CreateUserSkillsInput['skills']
    ): CreateUserSkillData[] {

        return skills.map(skill => ({
            userId: journey.userId as Types.ObjectId,
            careerJourneyId: journey._id as Types.ObjectId,
            skillCode: skill.skillCode,
            declaredLevel: skill.declaredLevel,
            source: UserSkillSource.MANUAL,
            verified: false,
        }));
    }

    async create(
        userId: string,
        data: CreateUserSkillsInput
    ): Promise<UserSkillResponse[]> {

        return executeTransaction(
            async (session) => {

                const journey =
                    await this.getOwnedJourney(
                        data.careerJourneyId,
                        userId
                    );

                const existingSkills =
                    await userSkillRepository.findByJourneyId(
                        journey.id,
                        session
                    );

                this.validateSkills(
                    journey,
                    data.skills,
                    existingSkills
                );

                const createData =
                    this.mapCreateData(
                        journey,
                        data.skills
                    );

                const createdSkills =
                    await userSkillRepository.createMany(
                        createData,
                        session
                    );

                return createdSkills.map(
                    toUserSkillResponse
                );
            }
        );
    }

    async findByJourney(
        careerJourneyId: string,
        userId: string
    ): Promise<UserSkillResponse[]> {

        await this.getOwnedJourney(
            careerJourneyId,
            userId
        );

        const skills =
            await userSkillRepository.findByJourneyId(
                careerJourneyId
            );

        return skills.map(
            toUserSkillResponse
        );
    }

    async update(
        skillId: string,
        userId: string,
        data: UpdateUserSkillInput
    ): Promise<UserSkillResponse> {

        await this.getOwnedSkill(
            skillId,
            userId
        );

        const updatedSkill =
            await userSkillRepository.updateById(
                skillId,
                data
            );

        if (!updatedSkill) {
            throw new AppError(
                HTTP_STATUS.NOT_FOUND,
                USER_SKILL_MESSAGES.NOT_FOUND
            );
        }

        return toUserSkillResponse(
            updatedSkill
        );
    }

    async delete(
        skillId: string,
        userId: string
    ): Promise<void> {

        await this.getOwnedSkill(
            skillId,
            userId
        );

        await userSkillRepository.deleteById(
            skillId
        );
    }
}

export const userSkillService =
    new UserSkillService();
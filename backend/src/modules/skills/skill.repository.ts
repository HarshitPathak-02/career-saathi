import { ClientSession } from 'mongoose';

import {
    CreateUserSkillData,
    UpdateUserSkillData,
    UserSkillDocument,
} from './skill.types.js';

import { UserSkillModel } from './skill.model.js';
import { UserSkillLevel } from './skill.enums.js';
import { ProficiencyLevel } from '../../shared/enums/proficiency-level.enum.js';

class UserSkillRepository {
    async createMany(
        data: CreateUserSkillData[],
        session?: ClientSession
    ): Promise<UserSkillDocument[]> {
        if (session) {
            return UserSkillModel.insertMany(data, {
                session,
            });
        }

        return UserSkillModel.insertMany(data);
    }

    async findById(
        id: string,
        session?: ClientSession
    ) {
        const query =
            UserSkillModel.findById(id);

        if (session) {
            query.session(session);
        }

        return query;
    }

    async findByJourneyId(
        careerJourneyId: string,
        session?: ClientSession
    ) {
        const query =
            UserSkillModel.find({
                careerJourneyId,
            });

        if (session) {
            query.session(session);
        }

        return query;
    }

    async updateById(
        id: string,
        data: UpdateUserSkillData,
        session?: ClientSession
    ) {
        return UserSkillModel.findByIdAndUpdate(
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
    ) {
        return UserSkillModel.findByIdAndDelete(
            id,
            {
                session,
            }
        );
    }

    async deleteByJourneyId(
        careerJourneyId: string,
        session?: ClientSession
    ) {
        return UserSkillModel.deleteMany(
            {
                careerJourneyId,
            },
            {
                session,
            }
        );
    }

    async bulkUpdateAssessmentLevels(
        updates: {
            skillCode: string;
            assessmentLevel: ProficiencyLevel;
        }[],
        careerJourneyId: string,
        session?: ClientSession
    ): Promise<void> {

        if (updates.length === 0) {
            return;
        }

        await UserSkillModel.bulkWrite(
            updates.map(update => ({
                updateOne: {
                    filter: {
                        careerJourneyId,
                        skillCode: update.skillCode,
                    },
                    update: {
                        $set: {
                            assessmentLevel:
                                update.assessmentLevel,
                        },
                    },
                },
            })),
            {
                session,
            }
        );
    }
}

export const userSkillRepository =
    new UserSkillRepository();
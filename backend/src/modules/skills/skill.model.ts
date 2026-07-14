import {
    Schema,
    model,
} from 'mongoose';

import {
    IUserSkill,
} from './skill.types.js';

import {
    UserSkillLevel,
    UserSkillSource,
} from './skill.enums.js';
import { ProficiencyLevel } from '../../shared/enums/proficiency-level.enum.js';

const userSkillSchema =
    new Schema<IUserSkill>(
        {
            userId: {
                type: Schema.Types.ObjectId,
                ref: 'User',
                required: true,
            },

            careerJourneyId: {
                type: Schema.Types.ObjectId,
                ref: 'CareerJourney',
                required: true,
            },

            skillCode: {
                type: String,
                required: true,
                trim: true,
            },

            declaredLevel: {
                type: String,
                enum: Object.values(
                    ProficiencyLevel
                ),
                required: true,
            },

            assessmentLevel: {
                type: String,
                enum: Object.values(
                    ProficiencyLevel
                ),
            },

            source: {
                type: String,
                enum: Object.values(
                    UserSkillSource
                ),
                required: true,
            },

            verified: {
                type: Boolean,
                default: false,
            },
        },
        {
            timestamps: true,
        }
    );

userSkillSchema.index(
    {
        careerJourneyId: 1,
        skillCode: 1,
    },
    {
        unique: true,
    }
);

userSkillSchema.index({
    userId: 1,
});

userSkillSchema.index({
    careerJourneyId: 1,
});

export const UserSkillModel =
    model<IUserSkill>(
        'UserSkill',
        userSkillSchema
    );
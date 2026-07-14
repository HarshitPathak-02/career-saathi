import { Schema, model } from 'mongoose';

import {
    IAssessmentSkillResult,
} from './assessment-skill-result.types.js';

import { ProficiencyLevel } from '../../shared/enums/proficiency-level.enum.js';

const assessmentSkillResultSchema =
    new Schema<IAssessmentSkillResult>(
        {
            assessmentId: {
                type: Schema.Types.ObjectId,
                ref: 'Assessment',
                required: true,
                index: true,
            },

            skillCode: {
                type: String,
                required: true,
                trim: true,
            },

            score: {
                type: Number,
                required: true,
                min: 0,
                max: 100,
            },

            level: {
                type: String,
                enum: Object.values(ProficiencyLevel),
                required: true,
            },

            correctAnswers: {
                type: Number,
                required: true,
                min: 0,
            },

            totalQuestions: {
                type: Number,
                required: true,
                min: 1,
            },
        },
        {
            timestamps: true,
        }
    );

assessmentSkillResultSchema.index(
    {
        assessmentId: 1,
        skillCode: 1,
    },
    {
        unique: true,
    }
);

export const AssessmentSkillResultModel =
    model<IAssessmentSkillResult>(
        'AssessmentSkillResult',
        assessmentSkillResultSchema
    );
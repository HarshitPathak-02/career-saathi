import {
    Schema,
    model,
} from 'mongoose';

import {
    IAssessmentQuestion,
} from './assessment-question.types.js';

import {
    QuestionDifficulty,
    QuestionType,
} from './assessment-question.enums.js';

import { CareerRoleCode } from '../career-role/career-role.enums.js';

const assessmentQuestionSchema =
    new Schema<IAssessmentQuestion>(
        {
            careerRoleCode: {
                type: String,
                enum: Object.values(
                    CareerRoleCode
                ),
                required: true,
            },

            skillCode: {
                type: String,
                required: true,
                trim: true,
            },

            difficulty: {
                type: String,
                enum: Object.values(
                    QuestionDifficulty
                ),
                required: true,
            },

            type: {
                type: String,
                enum: Object.values(
                    QuestionType
                ),
                required: true,
            },

            question: {
                type: String,
                required: true,
                trim: true,
            },

            options: [
                {
                    type: String,
                    trim: true,
                },
            ],

            correctAnswer: {
                type: String,
                required: true,
                trim: true,
            },

            explanation: {
                type: String,
                required: true,
                trim: true,
            },

            isActive: {
                type: Boolean,
                default: true,
            },
        },
        {
            timestamps: true,
        }
    );

assessmentQuestionSchema.index({
    careerRoleCode: 1,
    skillCode: 1,
});

assessmentQuestionSchema.index({
    isActive: 1,
});

export const AssessmentQuestionModel =
    model<IAssessmentQuestion>(
        'AssessmentQuestion',
        assessmentQuestionSchema
    );
import { z } from 'zod';

import { CareerRoleCode } from '../career-role/career-role.enums.js';

import {
    QuestionDifficulty,
    QuestionType,
} from './assessment-question.enums.js';

export const createAssessmentQuestionSchema =
    z.object({
        careerRoleCode:
            z.nativeEnum(
                CareerRoleCode
            ),

        skillCode:
            z.string().trim().min(1),

        difficulty:
            z.nativeEnum(
                QuestionDifficulty
            ),

        type:
            z.nativeEnum(
                QuestionType
            ),

        question:
            z.string().trim().min(5),

        options:
            z.array(
                z.string().trim()
            )
            .min(2),

        correctAnswer:
            z.string().trim().min(1),

        explanation:
            z.string().trim().min(5),

        isActive:
            z.boolean().optional(),
    });

export type CreateAssessmentQuestionInput =
    z.infer<
        typeof createAssessmentQuestionSchema
    >;

export const updateAssessmentQuestionSchema =
    createAssessmentQuestionSchema
        .partial();

export type UpdateAssessmentQuestionInput =
    z.infer<
        typeof updateAssessmentQuestionSchema
    >;

export const assessmentQuestionIdParamsSchema =
    z.object({
        id: z.string().regex(
            /^[a-f\d]{24}$/i,
            'Invalid assessment question id.'
        ),
    });
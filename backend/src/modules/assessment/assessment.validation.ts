import { z } from 'zod';
import { ProficiencyLevel } from '../../shared/enums/proficiency-level.enum.js';

export const startAssessmentSchema =
    z.object({
        careerJourneyId: z.string().regex(
            /^[a-f\d]{24}$/i,
            'Invalid career journey id.'
        ),
    });

export type StartAssessmentInput =
    z.infer<
        typeof startAssessmentSchema
    >;

export const completeAssessmentSchema =
    z.object({
        overallScore: z
            .number()
            .min(0)
            .max(100),

        overallLevel:
            z.nativeEnum(
                ProficiencyLevel
            ),
    });

export type CompleteAssessmentInput =
    z.infer<
        typeof completeAssessmentSchema
    >;

export const assessmentIdParamsSchema =
    z.object({
        id: z.string().regex(
            /^[a-f\d]{24}$/i,
            'Invalid assessment id.'
        ),
    });
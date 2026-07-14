import { z } from 'zod';

export const assessmentIdParamsSchema =
    z.object({
        assessmentId: z.string().regex(
            /^[a-f\d]{24}$/i,
            'Invalid assessment id.'
        ),
    });

export type AssessmentIdParams =
    z.infer<
        typeof assessmentIdParamsSchema
    >;
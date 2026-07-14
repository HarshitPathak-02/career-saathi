import { z } from 'zod';

export const assessmentIdParamsSchema =
    z.object({
        assessmentId: z.string().regex(
            /^[a-f\d]{24}$/i,
            'Invalid assessment id.'
        ),
    });

export const submitAssessmentSchema =
    z.object({
        answers: z
            .array(
                z.object({
                    questionId: z.string().regex(
                        /^[a-f\d]{24}$/i
                    ),

                    selectedAnswer:
                        z.string().trim().min(1),
                })
            )
            .min(1),
    });

export type SubmitAssessmentInput =
    z.infer<
        typeof submitAssessmentSchema
    >;

export const startAssessmentSchema =
    z.object({

        careerJourneyId:
            z.string().regex(
                /^[a-f\d]{24}$/i,
                'Invalid career journey id.'
            ),
    });
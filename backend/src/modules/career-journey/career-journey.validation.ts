import { z } from 'zod';

import {
    CurrentLevel,
    DurationUnit,
} from './career-journey.enums.js';
import { CareerRoleCode } from '../career-role/career-role.enums.js';

export const createCareerJourneySchema = z.object({
    title: z.string().trim().min(3).max(100),

    careerContext: z.object({
        domain: z.string().trim().min(2).max(100),

        goal: z.string().trim().min(2).max(100),

        careerRoleCode: z.nativeEnum(CareerRoleCode),

        currentLevel: z.nativeEnum(CurrentLevel),

        targetDuration: z.object({
            value: z.number().int().min(1),

            unit: z.nativeEnum(DurationUnit),
        }),

        dailyAvailability: z
            .number()
            .min(1)
            .max(24),
    }),
});

export type CreateCareerJourneyInput =
    z.infer<
        typeof createCareerJourneySchema
    >;


export const updateCareerJourneySchema = z.object({
    title: z
        .string()
        .trim()
        .min(3)
        .max(100)
        .optional(),

    careerContext: z
        .object({
            domain: z
                .string()
                .trim()
                .min(2)
                .max(100),

            goal: z
                .string()
                .trim()
                .min(2)
                .max(100),

            careerRoleCode: z.nativeEnum(CareerRoleCode),

            currentLevel:
                z.nativeEnum(CurrentLevel),

            targetDuration: z.object({
                value: z.number().int().min(1),

                unit:
                    z.nativeEnum(DurationUnit),
            }),

            dailyAvailability: z
                .number()
                .min(1)
                .max(24),
        })
        .optional(),
});

export type UpdateCareerJourneyInput =
    z.infer<
        typeof updateCareerJourneySchema
    >


export const careerJourneyIdParamsSchema =
    z.object({

        id: z.string().regex(
            /^[a-f\d]{24}$/i,
            'Invalid career journey id.'
        ),
    });

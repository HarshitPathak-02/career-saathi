import { z } from 'zod';

import {
    UserSkillLevel,
} from './skill.enums.js';
import { ProficiencyLevel } from '../../shared/enums/proficiency-level.enum.js';

export const createUserSkillsSchema = z.object({
    careerJourneyId: z.string().regex(
        /^[a-f\d]{24}$/i,
        'Invalid career journey id.'
    ),

    skills: z
        .array(
            z.object({
                skillCode: z
                    .string()
                    .trim()
                    .min(1),

                declaredLevel:
                    z.nativeEnum(
                        ProficiencyLevel
                    ),
            })
        )
        .min(1),
});

export type CreateUserSkillsInput =
    z.infer<
        typeof createUserSkillsSchema
    >;

export const updateUserSkillSchema =
    z.object({
        declaredLevel:
            z.nativeEnum(
                ProficiencyLevel
            )
                .optional(),

        assessmentLevel:
            z.nativeEnum(
                ProficiencyLevel
            )
                .optional(),

        verified:
            z.boolean().optional(),
    });

export type UpdateUserSkillInput =
    z.infer<
        typeof updateUserSkillSchema
    >;

export const userSkillIdParamsSchema =
    z.object({
        id: z.string().regex(
            /^[a-f\d]{24}$/i,
            'Invalid user skill id.'
        ),
    });

export const careerJourneyIdRouteParamsSchema =
    z.object({
        careerJourneyId: z.string().regex(
            /^[a-f\d]{24}$/i,
            'Invalid career journey id.'
        ),
    });
import { z } from "zod";
import { PreferredLanguage } from "../constants/enums";

export const careerJourneySchema = z.object({
    targetCompany: z
        .string()
        .trim()
        .max(100),

    targetDurationMonths: z
        .number({
            error: "Please select your target duration.",
        })
        .min(1)
        .max(24),

    dailyStudyHours: z
        .number({
            error: "Please select daily study hours.",
        })
        .min(1)
        .max(12),

    preferredLanguage: z.nativeEnum(
        PreferredLanguage
    ),
});

export type CareerJourneyFormValues =
    z.infer<typeof careerJourneySchema>;
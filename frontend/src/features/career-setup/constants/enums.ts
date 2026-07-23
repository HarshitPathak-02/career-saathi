export const PreferredLanguage = {
    ENGLISH: "english",
    HINDI: "hindi",
    MIXED: "mixed",
} as const

export type PreferredLanguage = typeof PreferredLanguage[keyof typeof PreferredLanguage];

export const CareerJourneyStatus = {
    DRAFT: "draft",
    READY: "ready",
    ACTIVE: "active",
    COMPLETED: "completed",
    ARCHIVED: "archived",
} as const

export type CareerJourneyStatus = typeof CareerJourneyStatus[keyof typeof CareerJourneyStatus];
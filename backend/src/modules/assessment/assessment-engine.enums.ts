export enum QuestionType {
    SINGLE_CHOICE = "SINGLE_CHOICE",
    MULTI_SELECT = "MULTI_SELECT",
    NUMERIC = "NUMERIC",
    MATCHING = "MATCHING",
}

export enum QuestionDifficulty {
    EASY = "EASY",
    MEDIUM = "MEDIUM",
    HARD = "HARD",
}

export enum QuestionStatus {
    AI_GENERATED = "AI_GENERATED",
    AI_VALIDATED = "AI_VALIDATED",
    ADMIN_APPROVED = "ADMIN_APPROVED",
    REJECTED = "REJECTED",
    RETIRED = "RETIRED",
}

export enum QuestionSource {
    AI = "AI",
    MANUAL = "MANUAL",
    IMPORTED = "IMPORTED",
}

export enum AssessmentDeliveryMode {
    INTERNAL = "INTERNAL",
    MANUAL = "MANUAL",
}

export enum AssessmentSectionStatus {
    PENDING = "PENDING",
    IN_PROGRESS = "IN_PROGRESS",
    COMPLETED = "COMPLETED",
    CANCELLED = "CANCELLED",
}

export enum AssessmentAttemptStatus {
    IN_PROGRESS = "IN_PROGRESS",
    SUBMITTED = "SUBMITTED",
    EXPIRED = "EXPIRED",
    ABANDONED = "ABANDONED",
}

export enum SkillEvidenceSource {
    CLAIMED = "CLAIMED",
    RESUME = "RESUME",
    ASSESSMENT = "ASSESSMENT",
    LEGACY_MANUAL = "LEGACY_MANUAL",
    MOCK_INTERVIEW = "MOCK_INTERVIEW",
    CODING_PRACTICE = "CODING_PRACTICE",
}

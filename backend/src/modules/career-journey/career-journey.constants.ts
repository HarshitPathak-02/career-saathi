export const CAREER_JOURNEY_MODEL = "CareerJourney";

export const CAREER_JOURNEY_COLLECTION = "career_journeys";

export const MIN_TARGET_DURATION_MONTHS = 1;

export const MAX_TARGET_DURATION_MONTHS = 24;

export const MIN_DAILY_STUDY_HOURS = 1;

export const MAX_DAILY_STUDY_HOURS = 12;


export const CAREER_JOURNEY_MESSAGES = {
    CREATED:
        "Career journey created successfully.",

    UPDATED:
        "Career journey updated successfully.",

    STATUS_UPDATED:
        "Career journey status updated successfully.",

    DELETED:
        "Career journey deleted successfully.",

    FETCHED:
        "Career journey fetched successfully.",

    ACTIVE_FETCHED:
        "Active career journey fetched successfully.",

    NOT_FOUND:
        "Career journey not found.",

    ACTIVE_ALREADY_EXISTS:
        "An active career journey already exists.",
} as const;
export const DEFAULT_MISSION_SIZE = 6;

export const DEFAULT_DURATION_DAYS = 7;

export const DEFAULT_TARGET_ROADMAP_ITEMS_PER_MISSION = 3;

export const DEFAULT_WORKLOAD_MULTIPLIER = 1;

export const MISSION_MODEL = "Mission";

export const MISSION_COLLECTION = "missions";

export const MissionMessages = {
    NOT_FOUND:
        "Mission not found.",

    ALREADY_ACTIVE:
        "Another mission is already active.",

    INVALID_STATUS:
        "Mission status is invalid.",

    ALREADY_COMPLETED:
        "Mission has already been completed.",

    ALREADY_SKIPPED:
        "Mission has already been skipped.",
} as const;
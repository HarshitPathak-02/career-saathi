export const DAILY_TASK_MODEL =
    "DailyTask";

export const DAILY_TASK_COLLECTION =
    "daily_tasks";

export const DAYS_PER_MISSION = 6;

export const DEFAULT_TASK_DURATION_MINUTES = 60;

export const MAX_TASKS_PER_DAY = 3;

export const DailyTaskMessages = {

    NOT_FOUND:
        "Daily task not found.",

    ALREADY_COMPLETED:
        "Daily task is already completed.",

    ALREADY_SKIPPED:
        "Daily task is already skipped.",

    INVALID_STATUS:
        "Invalid daily task status.",

} as const;
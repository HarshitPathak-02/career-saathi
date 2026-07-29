export const INITIAL_ASSESSMENT_WEEK = 0;
export const ASSESSMENT_MODEL = "Assessment"
export const ASSESSMENT_COLLECTION =
    "assessments";

export const ASSESSMENT_MESSAGES = {

    NOT_FOUND:
        "Assessment not found.",

    ALREADY_COMPLETED:
        "Assessment has already been completed.",

    INVALID_STATUS:
        "Assessment is not in a valid state.",

    INITIAL_ALREADY_EXISTS:
        "Initial assessment already exists.",

    WEEKLY_ALREADY_EXISTS:
        "Weekly assessment already exists.",

    NOT_INITIAL_ASSESSMENT:
        "This is not an initial assessment.",

    NOT_WEEKLY_ASSESSMENT:
        "This is not a weekly assessment.",

    INITIAL_CREATED:
        "Initial assessment created successfully.",

    WEEKLY_CREATED:
        "Weekly assessment created successfully.",

    INITIAL_SUBMITTED:
        "Initial assessment submitted successfully.",

    WEEKLY_SUBMITTED:
        "Weekly assessment submitted successfully.",

    HISTORY_FETCHED:
        "Assessment history fetched successfully.",

    DETAILS_FETCHED:
        "Assessment details fetched successfully.",

    FETCHED:
        "Assessment fetched successfully.",

    WEEKLY_PLAN_FETCHED:
        "Weekly assessment plan fetched successfully.",

} as const;
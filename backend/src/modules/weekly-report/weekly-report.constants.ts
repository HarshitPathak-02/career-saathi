export const WEEKLY_REPORT_CONSTANTS = {

    DEFAULT_PROMPT_VERSION: 1,

};

export const WEEKLY_REPORT_COLLECTION = "weekly_report_collections"
export const WEEKLY_REPORT_MODEL = "WeeklyReport"

export const WEEKLY_REPORT_MESSAGES = {

    WEEKLY_REPORT_GENERATED:
        "Weekly report generated successfully.",

    WEEKLY_REPORT_ALREADY_EXISTS:
        "Weekly report already exists.",

    WEEKLY_REPORT_NOT_FOUND:
        "Weekly report not found.",

    INVALID_AI_RESPONSE:
        "AI generated an invalid weekly report.",
    ALREADY_GENERATED: "Weekly report already generated."

} as const;
export const READINESS_MIN_MOCK_INTERVIEWS =
    3;


export const READINESS_THRESHOLDS = {

    SKILL_SCORE:
        70,

    TECHNICAL_INTERVIEW:
        70,

    PROBLEM_SOLVING:
        70,

    COMMUNICATION:
        65,

    OVERALL:
        70,

} as const;


export const READINESS_WEIGHTS = {

    SKILL_SCORE:
        0.35,

    TECHNICAL_INTERVIEW:
        0.25,

    PROBLEM_SOLVING:
        0.20,

    COMMUNICATION:
        0.20,

} as const;


export const READINESS_RECENT_INTERVIEW_LIMIT =
    3;
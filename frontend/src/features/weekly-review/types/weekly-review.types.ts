/*
|--------------------------------------------------------------------------
| Weekly Review Preparation
|--------------------------------------------------------------------------
*/

export interface WeeklyReviewRoadmapItem {
    id: string;

    title: string;

    description: string;
}

export interface WeeklyReviewSkill {
    userSkillId: string;

    skillCatalogId: string;

    skillName: string;

    currentScore: number;

    roadmapItems: WeeklyReviewRoadmapItem[];
}

export interface WeeklyReviewPreparation {
    missionId: string;

    missionNumber: number;

    weekNumber: number;

    assessmentId: string;

    skills: WeeklyReviewSkill[];
}

export interface WeeklyReviewPreparationResponse {
    success: boolean;

    data: WeeklyReviewPreparation;
}

/*
|--------------------------------------------------------------------------
| Assessment
|--------------------------------------------------------------------------
*/

export interface WeeklyAssessmentSkillInput {
    userSkillId: string;

    obtainedMarks: number;

    totalMarks: number;
}

export interface WeeklyAssessmentSubmission {
    assessmentId: string;

    skills: WeeklyAssessmentSkillInput[];
}

/*
|--------------------------------------------------------------------------
| Reflection Enums
|--------------------------------------------------------------------------
*/

export const ReflectionReason = {

    LACK_OF_TIME:
        "LACK_OF_TIME",

    DID_NOT_UNDERSTAND:
        "DID_NOT_UNDERSTAND",

    TOO_DIFFICULT:
        "TOO_DIFFICULT",

    HEALTH_ISSUES:
        "HEALTH_ISSUES",

    PERSONAL_WORK:
        "PERSONAL_WORK",

    OTHER:
        "OTHER",

} as const;

export type ReflectionReason =
    typeof ReflectionReason[
    keyof typeof ReflectionReason
    ];


export const DifficultyType = {

    THEORY:
        "THEORY",

    CODING:
        "CODING",

    DEBUGGING:
        "DEBUGGING",

    PROBLEM_SOLVING:
        "PROBLEM_SOLVING",

    REVISION:
        "REVISION",

} as const;

export type DifficultyType =
    typeof DifficultyType[
    keyof typeof DifficultyType
    ];


export const OverallWeek = {

    EXCELLENT:
        "EXCELLENT",

    GOOD:
        "GOOD",

    AVERAGE:
        "AVERAGE",

    POOR:
        "POOR",

    VERY_POOR:
        "VERY_POOR",

} as const;

export type OverallWeek =
    typeof OverallWeek[
    keyof typeof OverallWeek
    ];


export const MotivationLevel = {

    VERY_HIGH:
        "VERY_HIGH",

    HIGH:
        "HIGH",

    MEDIUM:
        "MEDIUM",

    LOW:
        "LOW",

    VERY_LOW:
        "VERY_LOW",

} as const;

export type MotivationLevel =
    typeof MotivationLevel[
    keyof typeof MotivationLevel
    ];

/*
|--------------------------------------------------------------------------
| Student Reflection
|--------------------------------------------------------------------------
*/

export interface LearningReflection {
    completedAllTasks: boolean;

    reason?: ReflectionReason;

    difficultyType?: DifficultyType;

    confidenceRating: number;
}

export interface MentorCheckIn {
    overallWeek?: OverallWeek;

    motivationLevel?: MotivationLevel;

    externalFactors?: string;

    careerConcern?: string;

    helpNeeded?: string;
}

export interface WeeklyReflectionSubmission {
    learningReflection: LearningReflection;

    mentorCheckIn: MentorCheckIn;

    additionalComments?: string;
}

/*
|--------------------------------------------------------------------------
| Submit Weekly Review
|--------------------------------------------------------------------------
*/

export interface SubmitWeeklyReviewRequest {
    assessment: WeeklyAssessmentSubmission;

    reflection: WeeklyReflectionSubmission;
}
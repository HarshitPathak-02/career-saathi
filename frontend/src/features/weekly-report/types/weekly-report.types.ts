export interface WeeklyReportSummary {

    summary: string;

    achievements: string[];

    improvements: string[];

}

export interface WeeklyReportMentorFeedback {

    advice: string;

    motivationMessage: string;

}

export interface WeeklyReportRecommendation {

    weakSkills: string[];

    revisionTopics: string[];

    recommendedDifficulty:
    "EASY" |
    "MEDIUM" |
    "HARD";

    recommendedStudyHours: number;

    prioritizeRevision: boolean;

    skipCompletedTopics: boolean;

}

export type WeeklyReportStatus =
    "COMPLETED" |
    "GENERATING" |
    "FAILED";

export interface WeeklyReportAssessment {

    id: string;

    title: string;

    type: string;

    weekNumber: number;

    status: string;

    completedAt: string | null;

}

export interface WeeklyReportLearningReflection {

    completedAllTasks: boolean;

    reason: string | null;

    difficultyType: string | null;

    confidenceRating: number;

}

export interface WeeklyReportMentorCheckIn {

    overallWeek: string;

    motivationLevel: string;

    externalFactors: string | null;

    careerConcern: string | null;

    helpNeeded: string | null;

}

export interface WeeklyReportReflection {

    weekNumber: number;

    learningReflection:
    WeeklyReportLearningReflection;

    mentorCheckIn:
    WeeklyReportMentorCheckIn;

    additionalComments:
    string | null;

}

export interface WeeklyReportSkill {

    userSkillId: string;

    skillCatalogId: string;

    skillName: string;

    obtainedMarks: number;

    totalMarks: number;

    percentage: number;

    improvementPercentage:
    number | null;

}

/*
|--------------------------------------------------------------------------
| History Report
|--------------------------------------------------------------------------
*/

export interface WeeklyReport {

    id: string;

    careerJourneyId: string;

    missionId: string;

    assessmentId: string;

    reflectionId: string;

    summary:
    WeeklyReportSummary;

    mentorFeedback:
    WeeklyReportMentorFeedback;

    recommendation:
    WeeklyReportRecommendation;

    status: string;

    promptVersion: number;

    generatedAt: string;

    createdAt: string;

    updatedAt: string;

}

/*
|--------------------------------------------------------------------------
| Report Details
|--------------------------------------------------------------------------
*/

export interface WeeklyReportDetails {

    id: string;

    careerJourneyId: string;

    missionId: string;

    generatedAt: string;

    status: string;

    summary:
    WeeklyReportSummary;

    mentorFeedback:
    WeeklyReportMentorFeedback;

    recommendation:
    WeeklyReportRecommendation;

    assessment:
    WeeklyReportAssessment;

    reflection:
    WeeklyReportReflection;

    skills:
    WeeklyReportSkill[];

}

export interface WeeklyReportResponse {

    success: boolean;

    data: WeeklyReport;

}

export interface WeeklyReportsResponse {

    success: boolean;

    data: WeeklyReport[];

}

export interface WeeklyReportDetailsResponse {

    success: boolean;

    data: WeeklyReportDetails;

}


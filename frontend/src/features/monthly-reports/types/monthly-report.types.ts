export type MonthlyReportStatus =
    "COMPLETED" |
    "GENERATING" |
    "FAILED";


/*
|--------------------------------------------------------------------------
| Mission Metrics
|--------------------------------------------------------------------------
*/

export interface MonthlyMissionMetrics {

    generated:
    number;

    completed:
    number;

    active:
    number;
}


/*
|--------------------------------------------------------------------------
| Task Metrics
|--------------------------------------------------------------------------
*/

export interface MonthlyTaskMetrics {

    total:
    number;

    completed:
    number;

    pending:
    number;

    completionRate:
    number;
}


/*
|--------------------------------------------------------------------------
| Assessment Metrics
|--------------------------------------------------------------------------
*/

export interface MonthlyAssessmentScoreTrend {

    weekNumber:
    number;

    score:
    number;
}


export interface MonthlyAssessmentMetrics {

    totalAssessments:
    number;

    averageScore:
    number | null;

    scoreTrend:
    MonthlyAssessmentScoreTrend[];
}


/*
|--------------------------------------------------------------------------
| Skill Progress
|--------------------------------------------------------------------------
*/

export type MonthlySkillTrend =
    "improving" |
    "declining" |
    "stable";


export interface MonthlySkillProgress {

    skillCatalogId:
    string;

    skillName:
    string;

    assessmentsTaken:
    number;

    averageScore:
    number;

    startScore:
    number;

    endScore:
    number;

    improvement:
    number;

    trend:
    MonthlySkillTrend;
}


/*
|--------------------------------------------------------------------------
| Reflection Metrics
|--------------------------------------------------------------------------
*/

export interface MonthlyReflectionReason {

    reason:
    string;

    occurrences:
    number;
}


export interface MonthlyDifficultyDistribution {

    difficultyType:
    string;

    occurrences:
    number;
}


export interface MonthlyMotivationDistribution {

    motivationLevel:
    string;

    occurrences:
    number;
}


export interface MonthlyReflectionMetrics {

    reflectionsConsidered:
    number;

    completedAllTasksWeeks:
    number;

    averageConfidenceRating:
    number;

    reasons:
    MonthlyReflectionReason[];

    difficultyDistribution:
    MonthlyDifficultyDistribution[];

    motivationDistribution:
    MonthlyMotivationDistribution[];
}


/*
|--------------------------------------------------------------------------
| Roadmap Progress
|--------------------------------------------------------------------------
*/

export interface MonthlyRoadmapProgress {

    completedItems:
    number;

    totalItems:
    number;

    completionRate:
    number;
}


/*
|--------------------------------------------------------------------------
| Timeline Projection
|--------------------------------------------------------------------------
*/

export interface MonthlyTimelineProjection {

    expectedWeeks:
    number;

    estimatedDelayDays:
    number;

    projectedWeeks:
    number;
}


/*
|--------------------------------------------------------------------------
| AI Insights
|--------------------------------------------------------------------------
*/

export interface MonthlyReportInsights {

    summary:
    string;

    strengths:
    string[];

    concerns:
    string[];

    recommendations:
    string[];
}


/*
|--------------------------------------------------------------------------
| Monthly Report
|--------------------------------------------------------------------------
*/

export interface MonthlyReport {

    id:
    string;

    careerJourneyId:
    string;

    reportNumber:
    number;

    periodStart:
    string;

    periodEnd:
    string;


    /*
     * Timeline / Consistency
     */

    expectedDays:
    number;

    missionCoveredDays:
    number;

    completedTaskDays:
    number;

    missedTaskDays:
    number;

    scheduleGapDays:
    number;

    consistencyRate:
    number;


    /*
     * Metrics
     */

    missionMetrics:
    MonthlyMissionMetrics;

    taskMetrics:
    MonthlyTaskMetrics;

    assessmentMetrics:
    MonthlyAssessmentMetrics;

    skillProgress:
    MonthlySkillProgress[];

    reflectionMetrics:
    MonthlyReflectionMetrics;

    roadmapProgress:
    MonthlyRoadmapProgress;

    timeline:
    MonthlyTimelineProjection;

    insights:
    MonthlyReportInsights;


    /*
     * State
     */

    status:
    MonthlyReportStatus;

    generatedAt:
    string | null;

    createdAt:
    string;

    updatedAt:
    string;
}


/*
|--------------------------------------------------------------------------
| API Responses
|--------------------------------------------------------------------------
*/

export interface MonthlyReportResponse {

    success:
    boolean;

    data:
    MonthlyReport;
}


export interface MonthlyReportsResponse {

    success:
    boolean;

    data:
    MonthlyReport[];
}


/*
|--------------------------------------------------------------------------
| Monthly Report Due Status
|--------------------------------------------------------------------------
*/

export interface MonthlyReportDueStatus {

    due:
    boolean;

    reportNumber:
    number | null;

    periodStart:
    string | null;

    periodEnd:
    string | null;
}


export interface MonthlyReportDueStatusResponse {

    success:
    boolean;

    data:
    MonthlyReportDueStatus;
}
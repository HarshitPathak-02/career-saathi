import {
    Types,
} from "mongoose";

import {
    MonthlyReportStatus,
} from "./monthly-report.enums.js";


export interface MonthlyReportPeriod {

    reportNumber:
    number;

    periodStart:
    Date;

    periodEnd:
    Date;

}


export interface MonthlyReportDueResult {

    due:
    boolean;

    reportNumber:
    number | null;

    periodStart:
    Date | null;

    periodEnd:
    Date | null;

}


export interface CreateMonthlyReportInput {

    careerJourneyId:
    Types.ObjectId;

    reportNumber:
    number;

    periodStart:
    Date;

    periodEnd:
    Date;

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

    missionMetrics: {

        generated:
        number;

        completed:
        number;

        active:
        number;
    };

    taskMetrics: {

        total:
        number;

        completed:
        number;

        pending:
        number;

        completionRate:
        number;
    };

    assessmentMetrics: {

        totalAssessments:
        number;

        averageScore:
        number | null;

        scoreTrend: {
            weekNumber:
            number;

            score:
            number;
        }[];
    };

    skillProgress:
    MonthlySkillProgressMetrics[];

    reflectionMetrics: {

        reflectionsConsidered:
        number;

        completedAllTasksWeeks:
        number;

        averageConfidenceRating:
        number;

        reasons: {
            reason:
            string;

            occurrences:
            number;
        }[];

        difficultyDistribution: {
            difficultyType:
            string;

            occurrences:
            number;
        }[];

        motivationDistribution: {
            motivationLevel:
            string;

            occurrences:
            number;
        }[];
    };

    roadmapProgress: {

        completedItems:
        number;

        totalItems:
        number;

        completionRate:
        number;
    };

    timeline: {

        expectedWeeks:
        number;

        estimatedDelayDays:
        number;

        projectedWeeks:
        number;
    };

    insights: {

        summary:
        string;

        strengths:
        string[];

        concerns:
        string[];

        recommendations:
        string[];
    };

    status:
    MonthlyReportStatus;

    generatedAt?:
    Date | null;
}

export interface MonthlySkillProgressMetrics {

    skillCatalogId:
    Types.ObjectId;

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
    "improving"
    | "declining"
    | "stable";
}

export interface MonthlyReportMetrics {

    period: {
        startDate: Date;
        endDate: Date;
        expectedDays: number;
    };

    timeline: {
        expectedDays:
        number;

        activeMissionDays:
        number;

        scheduleGapDays:
        number;

        progressLagDays:
        number;

        scheduleAdherenceRate:
        number;
    };

    missions: {
        generated: number;
        completed: number;
    };

    tasks: {
        generated: number;
        completed: number;
        pending: number;

        completionRate: number;

        plannedMinutes: number;
        completedMinutes: number;
    };

    assessments: {

        completed:
        number;

        averageScore:
        number | null;

        scoreTrend: {

            weekNumber:
            number;

            score:
            number;

        }[];
    };


    skillProgress:
    MonthlySkillProgressMetrics[];

    roadmap: {

        itemsCompletedThisPeriod:
        number;

        overallCompletedItems:
        number;

        totalItems:
        number;

        overallCompletionRate:
        number;

        estimatedHoursCompleted:
        number;

        roadmapVersionsTouched:
        number;
    };

    projection: {

        expectedWeeks:
        number;

        estimatedDelayDays:
        number;

        projectedWeeks:
        number;
    };

    reflections: MonthlyReflectionMetrics;
}


export interface MonthlyReflectionMetrics {

    reflectionsSubmitted:
    number;

    completedAllTasksWeeks:
    number;

    averageConfidenceRating:
    number;

    incompleteTaskReasons:
    Record<string, number>;

    difficultyTypes:
    Record<string, number>;

    overallWeeks:
    Record<string, number>;

    motivationLevels:
    Record<string, number>;

    externalFactors:
    string[];

    careerConcerns:
    string[];

    helpNeeded:
    string[];
}
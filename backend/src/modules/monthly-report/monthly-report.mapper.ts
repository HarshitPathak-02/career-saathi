import {
    Types,
} from "mongoose";

import {
    CreateMonthlyReportInput,
} from "./monthly-report.types.js";

import {
    MonthlyReportStatus,
} from "./monthly-report.enums.js";


/*
|--------------------------------------------------------------------------
| Mapper Input
|--------------------------------------------------------------------------
*/

export interface MonthlyReportMapperInput {

    careerJourneyId:
    Types.ObjectId;

    reportNumber:
    number;

    periodStart:
    Date;

    periodEnd:
    Date;


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
     * Missions
     */

    missionMetrics: {

        generated:
        number;

        completed:
        number;

        active:
        number;
    };


    /*
     * Tasks
     */

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


    /*
     * Assessments
     */

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


    /*
     * Skill Progress
     */

    skillProgress: {

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
        "improving" |
        "declining" |
        "stable";

    }[];


    /*
     * Reflections
     */

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


    /*
     * Roadmap
     */

    roadmapProgress: {

        completedItems:
        number;

        totalItems:
        number;

        completionRate:
        number;
    };


    /*
     * Timeline Projection
     */

    timeline: {

        expectedWeeks:
        number;

        estimatedDelayDays:
        number;

        projectedWeeks:
        number;
    };


    /*
     * AI Insights
     */

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
}


class MonthlyReportMapper {

    /*
    |--------------------------------------------------------------------------
    | Build Monthly Report
    |--------------------------------------------------------------------------
    */

    buildMonthlyReport(
        input:
            MonthlyReportMapperInput
    ): CreateMonthlyReportInput {

        return {

            /*
             * Identity
             */

            careerJourneyId:
                input.careerJourneyId,

            reportNumber:
                input.reportNumber,

            periodStart:
                input.periodStart,

            periodEnd:
                input.periodEnd,


            /*
             * Timeline / Consistency
             */

            expectedDays:
                input.expectedDays,

            missionCoveredDays:
                input.missionCoveredDays,

            completedTaskDays:
                input.completedTaskDays,

            missedTaskDays:
                input.missedTaskDays,

            scheduleGapDays:
                input.scheduleGapDays,

            consistencyRate:
                input.consistencyRate,


            /*
             * Mission Metrics
             */

            missionMetrics: {

                generated:
                    input
                        .missionMetrics
                        .generated,

                completed:
                    input
                        .missionMetrics
                        .completed,

                active:
                    input
                        .missionMetrics
                        .active,
            },


            /*
             * Task Metrics
             */

            taskMetrics: {

                total:
                    input
                        .taskMetrics
                        .total,

                completed:
                    input
                        .taskMetrics
                        .completed,

                pending:
                    input
                        .taskMetrics
                        .pending,

                completionRate:
                    input
                        .taskMetrics
                        .completionRate,
            },


            /*
             * Assessment Metrics
             */

            assessmentMetrics: {

                totalAssessments:
                    input
                        .assessmentMetrics
                        .totalAssessments,

                averageScore:
                    input
                        .assessmentMetrics
                        .averageScore,

                scoreTrend:
                    input
                        .assessmentMetrics
                        .scoreTrend,
            },


            /*
             * Skill Progress
             */

            skillProgress:
                input.skillProgress.map(
                    skill => ({

                        skillCatalogId:
                            skill
                                .skillCatalogId,

                        skillName:
                            skill
                                .skillName,

                        assessmentsTaken:
                            skill
                                .assessmentsTaken,

                        averageScore:
                            skill
                                .averageScore,

                        startScore:
                            skill
                                .startScore,

                        endScore:
                            skill
                                .endScore,

                        improvement:
                            skill
                                .improvement,

                        trend:
                            skill
                                .trend,
                    })
                ),


            /*
             * Reflection Metrics
             */

            reflectionMetrics: {

                reflectionsConsidered:
                    input
                        .reflectionMetrics
                        .reflectionsConsidered,

                completedAllTasksWeeks:
                    input
                        .reflectionMetrics
                        .completedAllTasksWeeks,

                averageConfidenceRating:
                    input
                        .reflectionMetrics
                        .averageConfidenceRating,

                reasons:
                    input
                        .reflectionMetrics
                        .reasons,

                difficultyDistribution:
                    input
                        .reflectionMetrics
                        .difficultyDistribution,

                motivationDistribution:
                    input
                        .reflectionMetrics
                        .motivationDistribution,
            },


            /*
             * Roadmap Progress
             */

            roadmapProgress: {

                completedItems:
                    input
                        .roadmapProgress
                        .completedItems,

                totalItems:
                    input
                        .roadmapProgress
                        .totalItems,

                completionRate:
                    input
                        .roadmapProgress
                        .completionRate,
            },


            /*
             * Timeline Projection
             */

            timeline: {

                expectedWeeks:
                    input
                        .timeline
                        .expectedWeeks,

                estimatedDelayDays:
                    input
                        .timeline
                        .estimatedDelayDays,

                projectedWeeks:
                    input
                        .timeline
                        .projectedWeeks,
            },


            /*
             * AI Insights
             */

            insights: {

                summary:
                    input
                        .insights
                        .summary,

                strengths:
                    input
                        .insights
                        .strengths,

                concerns:
                    input
                        .insights
                        .concerns,

                recommendations:
                    input
                        .insights
                        .recommendations,
            },


            /*
             * State
             */

            status:
                MonthlyReportStatus
                    .COMPLETED,

            generatedAt:
                new Date(),
        };
    }
}


export const monthlyReportMapper =
    new MonthlyReportMapper();
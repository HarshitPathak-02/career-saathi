import {
    Types,
} from "mongoose";

import {
    AppError,
} from "../../core/errors/app-error.js";

import {
    HTTP_STATUS,
} from "../../core/constants/http-status.constants.js";

import {
    addDays,
    differenceInCalendarDays,
    startOfDay,
} from "../../shared/utils/date.util.js";

import {
    careerJourneyRepository,
} from "../career-journey/index.js";

import {
    missionRepository,
} from "../mission/index.js";

import {
    CareerRoleModel,
} from "../../master-data/career-role/career-role.schema.js";

import {
    CareerDomainModel,
} from "../../master-data/career-domain/career-domain.schema.js";

import {
    monthlyReportRepository,
} from "./monthly-report.repository.js";

import {
    monthlyReportMetricsService,
} from "./monthly-report-metrics.service.js";

import {
    monthlyReportAIMapper,
} from "./monthly-report-ai.mapper.js";

import {
    monthlyReportAIService,
} from "./monthly-report-ai.service.js";

import {
    monthlyReportMapper,
    MonthlyReportMapperInput,
} from "./monthly-report.mapper.js";

import {
    MonthlyReportDueResult,
    MonthlyReportMetrics,
} from "./monthly-report.types.js";

import {
    MONTHLY_REPORT_CYCLE_DAYS,
} from "./monthly-report.constants.js";
import { appClock } from "../../shared/time/app-clock.js";


class MonthlyReportWorkflowService {

    /*
    |--------------------------------------------------------------------------
    | Generate Monthly Report
    |--------------------------------------------------------------------------
    */

    async generateMonthlyReport(
        userId:
            string,

        careerJourneyId:
            string
    ) {

        const userObjectId =
            new Types.ObjectId(
                userId
            );

        const careerJourneyObjectId =
            new Types.ObjectId(
                careerJourneyId
            );


        /*
         * Career Journey
         */

        const careerJourney =
            await careerJourneyRepository
                .findByIdAndUserId(
                    careerJourneyObjectId,
                    userObjectId
                );

        if (!careerJourney) {

            throw new AppError(
                HTTP_STATUS.NOT_FOUND,
                "Career journey not found."
            );
        }


        /*
         * Determine Report Period
         */

        const dueResult =
            await this.determineReportPeriod(
                careerJourneyObjectId
            );


        if (
            !dueResult.due ||
            dueResult.reportNumber ===
            null ||
            dueResult.periodStart ===
            null ||
            dueResult.periodEnd ===
            null
        ) {

            throw new AppError(
                HTTP_STATUS.CONFLICT,
                "Monthly report is not due yet."
            );
        }

        const reportNumber =
            dueResult.reportNumber;

        const periodStart =
            dueResult.periodStart;

        const periodEnd =
            dueResult.periodEnd;


        /*
         * Prevent Duplicate Report
         */

        const reportExists =
            await monthlyReportRepository
                .existsByCareerJourneyAndReportNumber(
                    careerJourneyObjectId,
                    reportNumber
                );

        if (reportExists) {

            throw new AppError(
                HTTP_STATUS.CONFLICT,
                "Monthly report has already been generated for this period."
            );
        }


        /*
         * Build Deterministic Metrics
         */

        const metrics =
            await monthlyReportMetricsService
                .buildMetrics(
                    careerJourneyObjectId,
                    periodStart,
                    periodEnd
                );


        /*
         * Career Role
         */

        const role =
            await CareerRoleModel
                .findById(
                    careerJourney.roleId
                );

        if (!role) {

            throw new AppError(
                HTTP_STATUS.NOT_FOUND,
                "Career role not found."
            );
        }


        /*
         * Career Domain
         */

        const domain =
            await CareerDomainModel
                .findById(
                    careerJourney.domainId
                );

        if (!domain) {

            throw new AppError(
                HTTP_STATUS.NOT_FOUND,
                "Career domain not found."
            );
        }


        /*
         * Build AI Input
         */

        const aiInput =
            monthlyReportAIMapper
                .buildInput(
                    careerJourney,
                    role,
                    domain,
                    reportNumber,
                    metrics
                );


        /*
         * Generate AI Insights
         */

        const insights =
            await monthlyReportAIService
                .generateInsights(
                    aiInput
                );


        /*
         * Build Persistence Input
         */

        const mapperInput =
            this.buildMapperInput(
                careerJourneyObjectId,

                {
                    reportNumber,
                    periodStart,
                    periodEnd,
                },

                metrics,
                insights
            );


        /*
         * Build Monthly Report
         */

        const reportData =
            monthlyReportMapper
                .buildMonthlyReport(
                    mapperInput
                );


        /*
         * Persist Monthly Report
         */

        const monthlyReport =
            await monthlyReportRepository
                .create(
                    reportData
                );


        return monthlyReport;
    }


    /*
    |--------------------------------------------------------------------------
    | Get Monthly Report Due Status
    |--------------------------------------------------------------------------
    */

    async getMonthlyReportDueStatus(
        careerJourneyId:
            Types.ObjectId
    ): Promise<MonthlyReportDueResult> {

        return this.determineReportPeriod(
            careerJourneyId
        );
    }


    /*
    |--------------------------------------------------------------------------
    | Build Mapper Input
    |--------------------------------------------------------------------------
    */

    private buildMapperInput(
        careerJourneyId:
            Types.ObjectId,

        dueResult: {
            reportNumber: number;
            periodStart: Date;
            periodEnd: Date;
        },

        metrics:
            MonthlyReportMetrics,

        insights: {
            summary: string;
            strengths: string[];
            concerns: string[];
            recommendations: string[];
        }
    ): MonthlyReportMapperInput {

        /*
         * Completed Task Days
         *
         * A daily task represents one
         * scheduled learning day.
         */

        const completedTaskDays =
            metrics
                .tasks
                .completed;


        /*
         * Missed Task Days
         */

        const missedTaskDays =
            metrics
                .tasks
                .pending;


        /*
         * Active Missions
         *
         * Missions that were generated
         * during the period but were not
         * completed.
         */

        const activeMissions =
            Math.max(
                0,

                metrics
                    .missions
                    .generated
                -
                metrics
                    .missions
                    .completed
            );


        /*
         * Convert Reflection Counters
         */

        const reasons =
            Object.entries(
                metrics
                    .reflections
                    .incompleteTaskReasons
            )
                .map(
                    (
                        [
                            reason,
                            occurrences,
                        ]
                    ) => ({

                        reason,

                        occurrences,
                    })
                );


        const difficultyDistribution =
            Object.entries(
                metrics
                    .reflections
                    .difficultyTypes
            )
                .map(
                    (
                        [
                            difficultyType,
                            occurrences,
                        ]
                    ) => ({

                        difficultyType,

                        occurrences,
                    })
                );


        const motivationDistribution =
            Object.entries(
                metrics
                    .reflections
                    .motivationLevels
            )
                .map(
                    (
                        [
                            motivationLevel,
                            occurrences,
                        ]
                    ) => ({

                        motivationLevel,

                        occurrences,
                    })
                );


        /*
         * Mapper Input
         */

        return {

            careerJourneyId,

            reportNumber:
                dueResult.reportNumber,

            periodStart:
                dueResult.periodStart,

            periodEnd:
                dueResult.periodEnd,


            /*
             * Timeline / Consistency
             */

            expectedDays:
                metrics
                    .period
                    .expectedDays,

            missionCoveredDays:
                metrics
                    .timeline
                    .activeMissionDays,

            completedTaskDays,

            missedTaskDays,

            scheduleGapDays:
                metrics
                    .timeline
                    .scheduleGapDays,

            consistencyRate:
                metrics
                    .timeline
                    .scheduleAdherenceRate,


            /*
             * Missions
             */

            missionMetrics: {

                generated:
                    metrics
                        .missions
                        .generated,

                completed:
                    metrics
                        .missions
                        .completed,

                active:
                    activeMissions,
            },


            /*
             * Tasks
             */

            taskMetrics: {

                total:
                    metrics
                        .tasks
                        .generated,

                completed:
                    metrics
                        .tasks
                        .completed,

                pending:
                    metrics
                        .tasks
                        .pending,

                completionRate:
                    metrics
                        .tasks
                        .completionRate,
            },


            /*
             * Assessments
             */

            assessmentMetrics: {

                totalAssessments:
                    metrics
                        .assessments
                        .completed,

                averageScore:
                    metrics
                        .assessments
                        .averageScore,

                scoreTrend:
                    metrics
                        .assessments
                        .scoreTrend,
            },


            /*
             * Skill Progress
             */

            skillProgress:
                metrics
                    .skillProgress
                    .map(
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
             * Reflections
             */

            reflectionMetrics: {

                reflectionsConsidered:
                    metrics
                        .reflections
                        .reflectionsSubmitted,

                completedAllTasksWeeks:
                    metrics
                        .reflections
                        .completedAllTasksWeeks,

                averageConfidenceRating:
                    metrics
                        .reflections
                        .averageConfidenceRating,

                reasons,

                difficultyDistribution,

                motivationDistribution,
            },


            /*
             * Roadmap Progress
             */

            roadmapProgress: {

                completedItems:
                    metrics
                        .roadmap
                        .overallCompletedItems,

                totalItems:
                    metrics
                        .roadmap
                        .totalItems,

                completionRate:
                    metrics
                        .roadmap
                        .overallCompletionRate,
            },


            /*
             * Timeline Projection
             */

            timeline: {

                expectedWeeks:
                    metrics
                        .projection
                        .expectedWeeks,

                estimatedDelayDays:
                    metrics
                        .projection
                        .estimatedDelayDays,

                projectedWeeks:
                    metrics
                        .projection
                        .projectedWeeks,
            },


            /*
             * AI Insights
             */

            insights: {

                summary:
                    insights.summary,

                strengths:
                    insights.strengths,

                concerns:
                    insights.concerns,

                recommendations:
                    insights.recommendations,
            },
        };
    }


    /*
    |--------------------------------------------------------------------------
    | Determine Monthly Report Period
    |--------------------------------------------------------------------------
    |
    | CareerSaathi reports follow fixed
    | 28-day learning cycles beginning
    | from the first mission start date.
    |
    | Report 1:
    | Day 1  -> Day 28
    |
    | Report 2:
    | Day 29 -> Day 56
    |
    | Report 3:
    | Day 57 -> Day 84
    |
    |--------------------------------------------------------------------------
    */

    private async determineReportPeriod(
        careerJourneyId:
            Types.ObjectId
    ): Promise<MonthlyReportDueResult> {

        /*
         * First Mission
         */

        const firstMission =
            await missionRepository
                .findFirstByCareerJourney(
                    careerJourneyId
                );


        /*
         * Learning Timeline
         * Has Not Started
         */

        if (!firstMission) {

            return {

                due:
                    false,

                reportNumber:
                    null,

                periodStart:
                    null,

                periodEnd:
                    null,
            };
        }


        const firstLearningDay =
            startOfDay(
                firstMission.startDate
            );


        const today =
            startOfDay(
                appClock.now()
            );


        /*
         * Calendar Days Since
         * Learning Started
         *
         * Day 1  => 1
         * Day 28 => 28
         */

        const elapsedDays =
            differenceInCalendarDays(
                today,
                firstLearningDay
            ) + 1;


        /*
         * Defensive Guard
         */

        if (
            elapsedDays <= 0
        ) {

            return {

                due:
                    false,

                reportNumber:
                    null,

                periodStart:
                    null,

                periodEnd:
                    null,
            };
        }


        /*
         * Matured 28-Day Cycles
         *
         * Day 27 => 0
         * Day 28 => 1
         * Day 55 => 1
         * Day 56 => 2
         */

        const maturedReportCount =
            Math.floor(
                elapsedDays /
                MONTHLY_REPORT_CYCLE_DAYS
            );


        /*
         * No Report Due Yet
         */

        if (
            maturedReportCount === 0
        ) {

            return {

                due:
                    false,

                reportNumber:
                    null,

                periodStart:
                    null,

                periodEnd:
                    null,
            };
        }


        /*
         * Latest Generated Report
         */

        const latestReport =
            await monthlyReportRepository
                .findLatestByCareerJourney(
                    careerJourneyId
                );


        const lastGeneratedReportNumber =
            latestReport
                ?.reportNumber ?? 0;


        /*
         * All Matured Reports
         * Already Generated
         */

        if (
            lastGeneratedReportNumber >=
            maturedReportCount
        ) {

            return {

                due:
                    false,

                reportNumber:
                    null,

                periodStart:
                    null,

                periodEnd:
                    null,
            };
        }


        /*
         * Generate Oldest Missing Report
         */

        const reportNumber =
            lastGeneratedReportNumber +
            1;


        /*
         * Period Offset
         */

        const periodOffset =
            (
                reportNumber -
                1
            ) *
            MONTHLY_REPORT_CYCLE_DAYS;


        /*
         * Period Start
         */

        const periodStart =
            addDays(
                firstLearningDay,
                periodOffset
            );


        /*
         * Period End
         */

        const periodEnd =
            addDays(
                periodStart,
                MONTHLY_REPORT_CYCLE_DAYS -
                1
            );


        return {

            due:
                true,

            reportNumber,

            periodStart,

            periodEnd,
        };
    }
}


export const monthlyReportWorkflowService =
    new MonthlyReportWorkflowService();
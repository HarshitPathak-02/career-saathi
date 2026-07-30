import {
    CareerJourneyDocument,
} from "../career-journey/career-journey.model.js";

import {
    CareerRoleDocument,
} from "../../master-data/career-role/career-role.schema.js";

import {
    CareerDomainDocument,
} from "../../master-data/career-domain/career-domain.schema.js";

import {
    MonthlyReportMetrics,
} from "./monthly-report.types.js";
import { MonthlyReportAIInput } from "./monthly-report-ai.types.js";




class MonthlyReportAIMapper {

    /*
    |--------------------------------------------------------------------------
    | Build AI Input
    |--------------------------------------------------------------------------
    */

    buildInput(
        careerJourney:
            CareerJourneyDocument,

        role:
            CareerRoleDocument,

        domain:
            CareerDomainDocument,

        reportNumber:
            number,

        metrics:
            MonthlyReportMetrics
    ): MonthlyReportAIInput {

        return {

            /*
            |--------------------------------------------------------------------------
            | Target
            |--------------------------------------------------------------------------
            */

            target: {

                role:
                    role.name,

                domain:
                    domain.name,

                targetDurationMonths:
                    careerJourney
                        .targetDurationMonths,

                dailyStudyHours:
                    careerJourney
                        .dailyStudyHours,
            },


            /*
            |--------------------------------------------------------------------------
            | Reporting Period
            |--------------------------------------------------------------------------
            */

            period: {

                reportNumber,

                startDate:
                    metrics
                        .period
                        .startDate,

                endDate:
                    metrics
                        .period
                        .endDate,

                expectedDays:
                    metrics
                        .period
                        .expectedDays,
            },


            /*
            |--------------------------------------------------------------------------
            | Timeline
            |--------------------------------------------------------------------------
            */

            timeline: {

                activeMissionDays:
                    metrics
                        .timeline
                        .activeMissionDays,

                scheduleGapDays:
                    metrics
                        .timeline
                        .scheduleGapDays,

                progressLagDays:
                    metrics
                        .timeline
                        .progressLagDays,

                scheduleAdherenceRate:
                    metrics
                        .timeline
                        .scheduleAdherenceRate,

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
            |--------------------------------------------------------------------------
            | Missions
            |--------------------------------------------------------------------------
            */

            missions: {

                generated:
                    metrics
                        .missions
                        .generated,

                completed:
                    metrics
                        .missions
                        .completed,
            },


            /*
            |--------------------------------------------------------------------------
            | Tasks
            |--------------------------------------------------------------------------
            */

            tasks: {

                generated:
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

                plannedMinutes:
                    metrics
                        .tasks
                        .plannedMinutes,

                completedMinutes:
                    metrics
                        .tasks
                        .completedMinutes,
            },


            /*
            |--------------------------------------------------------------------------
            | Assessments
            |--------------------------------------------------------------------------
            */

            assessments: {

                completed:
                    metrics
                        .assessments
                        .completed,

                averageScore:
                    metrics
                        .assessments
                        .averageScore,
            },


            /*
            |--------------------------------------------------------------------------
            | Skill Progress
            |--------------------------------------------------------------------------
            */

            skillProgress:
                metrics
                    .skillProgress
                    .map(
                        skill => ({

                            skillName:
                                skill.skillName,

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
            |--------------------------------------------------------------------------
            | Roadmap
            |--------------------------------------------------------------------------
            */

            roadmap: {

                itemsCompletedThisPeriod:
                    metrics
                        .roadmap
                        .itemsCompletedThisPeriod,

                overallCompletedItems:
                    metrics
                        .roadmap
                        .overallCompletedItems,

                totalItems:
                    metrics
                        .roadmap
                        .totalItems,

                overallCompletionRate:
                    metrics
                        .roadmap
                        .overallCompletionRate,

                estimatedHoursCompleted:
                    metrics
                        .roadmap
                        .estimatedHoursCompleted,

                roadmapVersionsTouched:
                    metrics
                        .roadmap
                        .roadmapVersionsTouched,
            },


            /*
            |--------------------------------------------------------------------------
            | Weekly Reflection Context
            |--------------------------------------------------------------------------
            */

            reflections: {

                reflectionsSubmitted:
                    metrics
                        .reflections
                        .reflectionsSubmitted,

                incompleteTaskReasons:
                    metrics
                        .reflections
                        .incompleteTaskReasons,

                difficultyTypes:
                    metrics
                        .reflections
                        .difficultyTypes,

                overallWeeks:
                    metrics
                        .reflections
                        .overallWeeks,

                motivationLevels:
                    metrics
                        .reflections
                        .motivationLevels,

                externalFactors:
                    metrics
                        .reflections
                        .externalFactors,

                careerConcerns:
                    metrics
                        .reflections
                        .careerConcerns,

                helpNeeded:
                    metrics
                        .reflections
                        .helpNeeded,
            },
        };
    }
}


export const monthlyReportAIMapper =
    new MonthlyReportAIMapper();
import {
    ClientSession,
    Types,
} from "mongoose";

import {
    missionRepository,
} from "../mission/mission.repository.js";

import {
    dailyTaskRepository,
} from "../daily-task/daily-task.repository.js";

import {
    weeklyReflectionRepository,
} from "../weekly-reflection/weekly-reflection.repository.js";

import {
    assessmentRepository,
} from "../assessment/assessment.repository.js";

import {
    roadmapItemRepository,
} from "../roadmap/roadmap-item.repository.js";

import {
    roadmapRepository,
} from "../roadmap/roadmap.repository.js";

import {
    skillProgressRepository,
} from "../skill-progress/index.js";

import {
    DailyTaskStatus,
} from "../daily-task/daily-task.enums.js";

import {
    MissionStatus,
} from "../mission/mission.enums.js";

import {
    RoadmapItemStatus,
} from "../roadmap/roadmap.enums.js";

import {
    MonthlyReportMetrics,
    MonthlyReflectionMetrics,
} from "./monthly-report.types.js";

import {
    addDays,
    differenceInCalendarDays,
    startOfDay,
} from "../../shared/utils/date.util.js";


class MonthlyReportMetricsService {

    /*
    |--------------------------------------------------------------------------
    | Build Metrics
    |--------------------------------------------------------------------------
    */

    async buildMetrics(
        careerJourneyId:
            Types.ObjectId,

        periodStart:
            Date,

        periodEnd:
            Date,

        session?:
            ClientSession
    ): Promise<MonthlyReportMetrics> {

        /*
        |--------------------------------------------------------------------------
        | Normalize Reporting Period
        |--------------------------------------------------------------------------
        */

        const normalizedPeriodStart =
            startOfDay(
                periodStart
            );

        const normalizedPeriodEnd =
            startOfDay(
                periodEnd
            );


        /*
        |--------------------------------------------------------------------------
        | Period Metrics
        |--------------------------------------------------------------------------
        */

        const expectedDays =
            differenceInCalendarDays(
                normalizedPeriodEnd,
                normalizedPeriodStart
            ) + 1;


        /*
        |--------------------------------------------------------------------------
        | Missions Overlapping Reporting Period
        |--------------------------------------------------------------------------
        */

        const missions =
            await missionRepository
                .findByCareerJourneyAndDateRange(
                    careerJourneyId,
                    normalizedPeriodStart,
                    normalizedPeriodEnd,
                    session
                );


        const missionIds =
            missions.map(
                mission =>
                    mission._id
            );


        /*
        |--------------------------------------------------------------------------
        | Roadmaps Active During Reporting Period
        |--------------------------------------------------------------------------
        |
        | Do not derive roadmaps only from missions.
        |
        | A roadmap may exist during the reporting period even if the user
        | delayed generating missions.
        |
        |--------------------------------------------------------------------------
        */

        const roadmaps =
            await roadmapRepository
                .findByCareerJourneyAndPeriod(
                    careerJourneyId,
                    normalizedPeriodStart,
                    normalizedPeriodEnd,
                    session
                );


        const roadmapIds =
            roadmaps.map(
                roadmap =>
                    roadmap._id
            );


        /*
        |--------------------------------------------------------------------------
        | Daily Tasks
        |--------------------------------------------------------------------------
        */

        const allTasks =
            missionIds.length > 0
                ? await dailyTaskRepository
                    .findByMissionIds(
                        missionIds,
                        session
                    )
                : [];


        /*
        |--------------------------------------------------------------------------
        | Mission Lookup
        |--------------------------------------------------------------------------
        */

        const missionMap =
            new Map(
                missions.map(
                    mission => [
                        mission
                            ._id
                            .toString(),

                        mission,
                    ]
                )
            );


        /*
        |--------------------------------------------------------------------------
        | Tasks Belonging To Reporting Period
        |--------------------------------------------------------------------------
        |
        | Daily task does not directly contain a scheduled date.
        |
        | Therefore:
        |
        | scheduledDate =
        | mission.startDate + (dayNumber - 1)
        |
        |--------------------------------------------------------------------------
        */

        const tasks =
            allTasks.filter(
                task => {

                    const mission =
                        missionMap.get(
                            task
                                .missionId
                                .toString()
                        );

                    if (!mission) {
                        return false;
                    }


                    const scheduledDate =
                        startOfDay(
                            addDays(
                                mission.startDate,
                                task.dayNumber - 1
                            )
                        );


                    return (
                        scheduledDate >=
                        normalizedPeriodStart
                        &&
                        scheduledDate <=
                        normalizedPeriodEnd
                    );
                }
            );


        /*
        |--------------------------------------------------------------------------
        | Weekly Reflections
        |--------------------------------------------------------------------------
        */

        const reflections =
            missionIds.length > 0
                ? await weeklyReflectionRepository
                    .findByMissionIds(
                        missionIds,
                        session
                    )
                : [];


        /*
        |--------------------------------------------------------------------------
        | Completed Assessments
        |--------------------------------------------------------------------------
        */

        const assessments =
            await assessmentRepository
                .findCompletedInPeriod(
                    careerJourneyId,
                    normalizedPeriodStart,
                    normalizedPeriodEnd,
                    session
                );



        const assessmentIds =
            assessments.map(
                assessment =>
                    assessment._id
            );


        /*
        |--------------------------------------------------------------------------
        | Skill Progress
        |--------------------------------------------------------------------------
        */

        const skillProgress =
            assessmentIds.length > 0
                ? await skillProgressRepository
                    .findByAssessmentIds(
                        assessmentIds,
                        session
                    )
                : [];


        const skillProgressMetrics =
            this.buildSkillProgressMetrics(
                skillProgress
            );


        /*
|--------------------------------------------------------------------------
| Assessment Score Trend
|--------------------------------------------------------------------------
|
| Each assessment may contain multiple
| SkillProgress records.
|
| First calculate one average score for
| each assessment, then use those scores
| for the monthly trend and overall average.
|
|--------------------------------------------------------------------------
*/

        const scoreTrend: {
            weekNumber: number;
            score: number;
        }[] = [];


        for (
            const assessment
            of assessments
        ) {

            const assessmentProgress =
                skillProgress.filter(
                    progress =>
                        progress
                            .assessmentId
                            .toString() ===
                        assessment
                            ._id
                            .toString()
                );


            /*
             * Assessment Has No
             * Skill Progress Records
             */

            if (
                assessmentProgress.length ===
                0
            ) {
                continue;
            }


            /*
             * Average Score For
             * This Assessment
             */

            const assessmentAverage =
                Number(
                    (
                        assessmentProgress.reduce(
                            (
                                total,
                                progress
                            ) =>
                                total +
                                progress.percentage,
                            0
                        )
                        /
                        assessmentProgress.length
                    ).toFixed(2)
                );


            scoreTrend.push({

                weekNumber:
                    assessment.weekNumber,

                score:
                    assessmentAverage,
            });
        }


        /*
         * Ensure Chronological Order
         */

        scoreTrend.sort(
            (
                first,
                second
            ) =>
                first.weekNumber -
                second.weekNumber
        );


        /*
        |--------------------------------------------------------------------------
        | Average Assessment Score
        |--------------------------------------------------------------------------
        |
        | Average the assessment-level scores,
        | not every individual skill-progress row.
        |
        | This ensures each weekly assessment
        | contributes equally to the monthly score.
        |
        |--------------------------------------------------------------------------
        */

        const averageAssessmentScore =
            scoreTrend.length === 0
                ? null
                : Number(
                    (
                        scoreTrend.reduce(
                            (
                                total,
                                item
                            ) =>
                                total +
                                item.score,
                            0
                        )
                        /
                        scoreTrend.length
                    ).toFixed(2)
                );
        /*
        |--------------------------------------------------------------------------
        | Roadmap Items Completed During Reporting Period
        |--------------------------------------------------------------------------
        */

        const completedRoadmapItems =
            roadmapIds.length > 0
                ? await roadmapItemRepository
                    .findCompletedInPeriod(
                        roadmapIds,
                        normalizedPeriodStart,
                        normalizedPeriodEnd,
                        session
                    )
                : [];


        /*
        |--------------------------------------------------------------------------
        | All Roadmap Items
        |--------------------------------------------------------------------------
        |
        | Required to calculate overall roadmap completion.
        |
        |--------------------------------------------------------------------------
        */

        const allRoadmapItems =
            roadmapIds.length > 0
                ? await roadmapItemRepository
                    .findByRoadmapIds(
                        roadmapIds,
                        session
                    )
                : [];


        /*
        |--------------------------------------------------------------------------
        | Overall Completed Roadmap Items
        |--------------------------------------------------------------------------
        */

        const overallCompletedRoadmapItems =
            allRoadmapItems.filter(
                item =>
                    item.status ===
                    RoadmapItemStatus.COMPLETED
            );


        const totalRoadmapItems =
            allRoadmapItems.length;


        const overallRoadmapCompletionRate =
            this.percentage(
                overallCompletedRoadmapItems.length,
                totalRoadmapItems
            );


        /*
        |--------------------------------------------------------------------------
        | Estimated Roadmap Hours Completed During Period
        |--------------------------------------------------------------------------
        */

        const estimatedHoursCompleted =
            completedRoadmapItems.reduce(
                (
                    total,
                    item
                ) =>
                    total +
                    item.estimatedHours,
                0
            );


        /*
        |--------------------------------------------------------------------------
        | Active Mission Days
        |--------------------------------------------------------------------------
        */

        const activeMissionDays =
            this.calculateActiveMissionDays(
                missions,
                normalizedPeriodStart,
                normalizedPeriodEnd
            );


        /*
        |--------------------------------------------------------------------------
        | Actual Schedule Gap Days
        |--------------------------------------------------------------------------
        |
        | These are empty days BETWEEN generated missions.
        |
        | Example:
        |
        | Mission 1: Aug 1 - Aug 7
        | Mission 2: Aug 10 - Aug 16
        |
        | Aug 8 and Aug 9 = 2 schedule gap days.
        |
        |--------------------------------------------------------------------------
        */

        const scheduleGapDays =
            this.calculateScheduleGapDays(
                missions,
                normalizedPeriodStart,
                normalizedPeriodEnd
            );


        /*
        |--------------------------------------------------------------------------
        | Mission Metrics
        |--------------------------------------------------------------------------
        */

        const completedMissions =
            missions.filter(
                mission =>
                    mission.status ===
                    MissionStatus.COMPLETED
            ).length;


        /*
        |--------------------------------------------------------------------------
        | Task Metrics
        |--------------------------------------------------------------------------
        */

        const completedTasks =
            tasks.filter(
                task =>
                    task.status ===
                    DailyTaskStatus.COMPLETED
            );


        const tasksGenerated =
            tasks.length;


        const taskCompletionRate =
            this.percentage(
                completedTasks.length,
                tasksGenerated
            );


        const plannedMinutes =
            tasks.reduce(
                (
                    total,
                    task
                ) =>
                    total +
                    task.estimatedMinutes,
                0
            );


        const completedMinutes =
            completedTasks.reduce(
                (
                    total,
                    task
                ) =>
                    total +
                    task.estimatedMinutes,
                0
            );


        /*
        |--------------------------------------------------------------------------
        | Completed Task Days
        |--------------------------------------------------------------------------
        |
        | We count unique scheduled learning days whose task was completed.
        |
        |--------------------------------------------------------------------------
        */

        const completedTaskDateKeys =
            new Set<string>();


        for (
            const task
            of completedTasks
        ) {

            const mission =
                missionMap.get(
                    task
                        .missionId
                        .toString()
                );


            if (!mission) {
                continue;
            }


            const scheduledDate =
                startOfDay(
                    addDays(
                        mission.startDate,
                        task.dayNumber - 1
                    )
                );


            if (
                scheduledDate <
                normalizedPeriodStart
                ||
                scheduledDate >
                normalizedPeriodEnd
            ) {
                continue;
            }


            completedTaskDateKeys.add(
                this.dateKey(
                    scheduledDate
                )
            );
        }


        const completedTaskDays =
            completedTaskDateKeys.size;


        /*
        |--------------------------------------------------------------------------
        | Progress Lag
        |--------------------------------------------------------------------------
        |
        | scheduleGapDays:
        |     Time lost because no mission existed.
        |
        | progressLagDays:
        |     Total expected learning days that were not completed.
        |
        | Example:
        |
        | Expected days       = 28
        | Active mission days = 25
        | Completed task days = 19
        |
        | Schedule gap        = 3
        | Progress lag        = 9
        |
        |--------------------------------------------------------------------------
        */

        const progressLagDays =
            Math.max(
                0,
                expectedDays -
                completedTaskDays
            );


        /*
        |--------------------------------------------------------------------------
        | Schedule Adherence
        |--------------------------------------------------------------------------
        |
        | This measures whether missions were generated consistently.
        |
        | It intentionally does NOT measure task completion.
        |
        |--------------------------------------------------------------------------
        */

        const scheduleAdherenceRate =
            this.percentage(
                activeMissionDays,
                expectedDays
            );


        /*
        |--------------------------------------------------------------------------
        | Timeline Projection
        |--------------------------------------------------------------------------
        */

        const timelineProjection =
            this.buildTimelineProjection(
                roadmaps,
                progressLagDays
            );


        /*
        |--------------------------------------------------------------------------
        | Reflection Metrics
        |--------------------------------------------------------------------------
        */

        const reflectionMetrics =
            this.buildReflectionMetrics(
                reflections
            );


        /*
        |--------------------------------------------------------------------------
        | Final Metrics
        |--------------------------------------------------------------------------
        */

        return {

            period: {

                startDate:
                    normalizedPeriodStart,

                endDate:
                    normalizedPeriodEnd,

                expectedDays,
            },


            timeline: {

                expectedDays,

                activeMissionDays,

                scheduleGapDays,

                progressLagDays,

                scheduleAdherenceRate,
            },


            missions: {

                generated:
                    missions.length,

                completed:
                    completedMissions,
            },


            tasks: {

                generated:
                    tasksGenerated,

                completed:
                    completedTasks.length,

                pending:
                    tasksGenerated -
                    completedTasks.length,

                completionRate:
                    taskCompletionRate,

                plannedMinutes,

                completedMinutes,
            },


            assessments: {

                completed:
                    assessments.length,

                averageScore:
                    averageAssessmentScore,

                scoreTrend
            },


            skillProgress:
                skillProgressMetrics,


            roadmap: {

                itemsCompletedThisPeriod:
                    completedRoadmapItems.length,

                overallCompletedItems:
                    overallCompletedRoadmapItems.length,

                totalItems:
                    totalRoadmapItems,

                overallCompletionRate:
                    overallRoadmapCompletionRate,

                estimatedHoursCompleted,

                roadmapVersionsTouched:
                    roadmapIds.length,
            },


            projection:
                timelineProjection,


            reflections:
                reflectionMetrics,
        };
    }


    /*
    |--------------------------------------------------------------------------
    | Calculate Active Mission Days
    |--------------------------------------------------------------------------
    */

    private calculateActiveMissionDays(
        missions:
            {
                startDate: Date;
                endDate: Date;
            }[],

        periodStart:
            Date,

        periodEnd:
            Date
    ): number {

        const activeDates =
            new Set<string>();


        for (
            const mission
            of missions
        ) {

            const missionStart =
                startOfDay(
                    mission.startDate
                );


            const missionEnd =
                startOfDay(
                    mission.endDate
                );


            const start =
                missionStart >
                    periodStart
                    ? missionStart
                    : periodStart;


            const end =
                missionEnd <
                    periodEnd
                    ? missionEnd
                    : periodEnd;


            /*
             * Mission Does Not Intersect
             * Reporting Period
             */

            if (
                start > end
            ) {
                continue;
            }


            let current =
                start;


            while (
                current <= end
            ) {

                activeDates.add(
                    this.dateKey(
                        current
                    )
                );


                current =
                    addDays(
                        current,
                        1
                    );
            }
        }


        return activeDates.size;
    }


    /*
    |--------------------------------------------------------------------------
    | Calculate Schedule Gap Days
    |--------------------------------------------------------------------------
    |
    | Counts empty days BETWEEN missions.
    |
    | It intentionally does not count:
    |
    | - days before the first generated mission
    | - days after the latest generated mission
    |
    | Those are reflected by progressLagDays instead.
    |
    |--------------------------------------------------------------------------
    */

    private calculateScheduleGapDays(
        missions:
            {
                startDate: Date;
                endDate: Date;
            }[],

        periodStart:
            Date,

        periodEnd:
            Date
    ): number {

        if (
            missions.length <= 1
        ) {
            return 0;
        }


        const sortedMissions =
            [...missions]
                .sort(
                    (
                        first,
                        second
                    ) =>
                        first.startDate
                            .getTime()
                        -
                        second.startDate
                            .getTime()
                );


        let gapDays =
            0;


        for (
            let index = 1;
            index <
            sortedMissions.length;
            index++
        ) {

            const previousMission =
                sortedMissions[
                index - 1
                ];


            const currentMission =
                sortedMissions[
                index
                ];


            const previousEnd =
                startOfDay(
                    previousMission.endDate
                );


            const currentStart =
                startOfDay(
                    currentMission.startDate
                );


            /*
             * First Empty Day
             */

            const gapStart =
                addDays(
                    previousEnd,
                    1
                );


            /*
             * Last Empty Day
             */

            const gapEnd =
                addDays(
                    currentStart,
                    -1
                );


            /*
             * Missions Touch Or Overlap
             */

            if (
                gapStart >
                gapEnd
            ) {
                continue;
            }


            /*
             * Clamp To Reporting Period
             */

            const effectiveStart =
                gapStart >
                    periodStart
                    ? gapStart
                    : periodStart;


            const effectiveEnd =
                gapEnd <
                    periodEnd
                    ? gapEnd
                    : periodEnd;


            if (
                effectiveStart >
                effectiveEnd
            ) {
                continue;
            }


            gapDays +=
                differenceInCalendarDays(
                    effectiveEnd,
                    effectiveStart
                ) + 1;
        }


        return gapDays;
    }


    /*
    |--------------------------------------------------------------------------
    | Build Timeline Projection
    |--------------------------------------------------------------------------
    |
    | This is only an analytical projection.
    |
    | It DOES NOT modify roadmap.estimatedWeeks.
    |
    |--------------------------------------------------------------------------
    */

    private buildTimelineProjection(
        roadmaps:
            {
                estimatedWeeks:
                number;

                version:
                number;
            }[],

        progressLagDays:
            number
    ): {

        expectedWeeks:
        number;

        estimatedDelayDays:
        number;

        projectedWeeks:
        number;

    } {

        if (
            roadmaps.length === 0
        ) {

            return {

                expectedWeeks:
                    0,

                estimatedDelayDays:
                    progressLagDays,

                projectedWeeks:
                    0,
            };
        }


        /*
         * Explicitly select latest
         * roadmap by version.
         */

        const latestRoadmap =
            [...roadmaps]
                .sort(
                    (
                        first,
                        second
                    ) =>
                        second.version -
                        first.version
                )[0];


        const expectedWeeks =
            latestRoadmap
                .estimatedWeeks;


        const additionalWeeks =
            progressLagDays /
            7;


        const projectedWeeks =
            Number(
                (
                    expectedWeeks +
                    additionalWeeks
                ).toFixed(2)
            );


        return {

            expectedWeeks,

            estimatedDelayDays:
                progressLagDays,

            projectedWeeks,
        };
    }


    /*
    |--------------------------------------------------------------------------
    | Reflection Metrics
    |--------------------------------------------------------------------------
    */

    private buildReflectionMetrics(
        reflections:
            any[]
    ): MonthlyReflectionMetrics {

        const result:
            MonthlyReflectionMetrics = {

            reflectionsSubmitted:
                reflections.length,

            completedAllTasksWeeks:
                0,

            averageConfidenceRating:
                0,

            incompleteTaskReasons:
                {},

            difficultyTypes:
                {},

            overallWeeks:
                {},

            motivationLevels:
                {},

            externalFactors:
                [],

            careerConcerns:
                [],

            helpNeeded:
                [],
        };


        let totalConfidenceRating =
            0;

        let confidenceRatingCount =
            0;


        for (
            const reflection
            of reflections
        ) {

            const learning =
                reflection
                    .learningReflection;


            const mentor =
                reflection
                    .mentorCheckIn;


            /*
             * Completed All Tasks
             */

            if (
                learning.completedAllTasks
            ) {

                result
                    .completedAllTasksWeeks +=
                    1;
            }


            /*
             * Confidence Rating
             */

            if (
                typeof learning.confidenceRating ===
                "number"
            ) {

                totalConfidenceRating +=
                    learning.confidenceRating;

                confidenceRatingCount +=
                    1;
            }


            /*
             * Incomplete Task Reason
             */

            if (
                learning.reason
            ) {

                this.incrementCounter(
                    result
                        .incompleteTaskReasons,

                    learning.reason
                );
            }


            /*
             * Difficulty
             */

            if (
                learning.difficultyType
            ) {

                this.incrementCounter(
                    result
                        .difficultyTypes,

                    learning.difficultyType
                );
            }


            /*
             * Overall Week
             */

            if (
                mentor.overallWeek
            ) {

                this.incrementCounter(
                    result
                        .overallWeeks,

                    mentor.overallWeek
                );
            }


            /*
             * Motivation
             */

            if (
                mentor.motivationLevel
            ) {

                this.incrementCounter(
                    result
                        .motivationLevels,

                    mentor.motivationLevel
                );
            }


            /*
             * External Factors
             */

            if (
                mentor.externalFactors
            ) {

                result
                    .externalFactors
                    .push(
                        mentor.externalFactors
                    );
            }


            /*
             * Career Concerns
             */

            if (
                mentor.careerConcern
            ) {

                result
                    .careerConcerns
                    .push(
                        mentor.careerConcern
                    );
            }


            /*
             * Help Needed
             */

            if (
                mentor.helpNeeded
            ) {

                result
                    .helpNeeded
                    .push(
                        mentor.helpNeeded
                    );
            }
        }


        /*
         * Average Confidence
         */

        result.averageConfidenceRating =
            confidenceRatingCount === 0
                ? 0
                : Number(
                    (
                        totalConfidenceRating /
                        confidenceRatingCount
                    ).toFixed(2)
                );


        return result;
    }

    /*
    |--------------------------------------------------------------------------
    | Build Skill Progress Metrics
    |--------------------------------------------------------------------------
    */

    private buildSkillProgressMetrics(
        progressRecords:
            any[]
    ) {

        const groupedProgress =
            new Map<
                string,
                typeof progressRecords
            >();


        /*
         * Group Progress By Skill
         */

        for (
            const progress
            of progressRecords
        ) {

            const userSkill =
                progress.userSkillId;


            const skillCatalog =
                userSkill.skillCatalogId;


            const skillId =
                skillCatalog
                    ._id
                    .toString();


            const existing =
                groupedProgress.get(
                    skillId
                ) ?? [];


            existing.push(
                progress
            );


            groupedProgress.set(
                skillId,
                existing
            );
        }


        /*
         * Build Metrics
         */

        return Array.from(
            groupedProgress.values()
        ).map(
            records => {

                /*
                 * Sort Chronologically
                 */

                const sortedRecords =
                    [...records]
                        .sort(
                            (
                                first,
                                second
                            ) =>
                                first.createdAt
                                    .getTime()
                                -
                                second.createdAt
                                    .getTime()
                        );


                const first =
                    sortedRecords[0];


                const last =
                    sortedRecords[
                    sortedRecords.length - 1
                    ];


                const skillCatalog =
                    first
                        .userSkillId
                        .skillCatalogId;


                const averageScore =
                    Number(
                        (
                            sortedRecords.reduce(
                                (
                                    total,
                                    progress
                                ) =>
                                    total +
                                    progress.percentage,
                                0
                            )
                            /
                            sortedRecords.length
                        ).toFixed(2)
                    );


                const startScore =
                    first.percentage;


                const endScore =
                    last.percentage;


                const improvement =
                    Number(
                        (
                            endScore -
                            startScore
                        ).toFixed(2)
                    );


                let trend:
                    "improving"
                    | "declining"
                    | "stable";


                if (
                    improvement > 0
                ) {

                    trend =
                        "improving";

                } else if (
                    improvement < 0
                ) {

                    trend =
                        "declining";

                } else {

                    trend =
                        "stable";
                }


                return {

                    skillCatalogId:
                        skillCatalog._id,

                    skillName:
                        skillCatalog.name,

                    assessmentsTaken:
                        sortedRecords.length,

                    averageScore,

                    startScore,

                    endScore,

                    improvement,

                    trend,
                };
            }
        );
    }


    /*
    |--------------------------------------------------------------------------
    | Increment Counter
    |--------------------------------------------------------------------------
    */

    private incrementCounter(
        record:
            Record<string, number>,

        key:
            string
    ): void {

        record[key] =
            (
                record[key] ??
                0
            ) + 1;
    }


    /*
    |--------------------------------------------------------------------------
    | Percentage
    |--------------------------------------------------------------------------
    */

    private percentage(
        value:
            number,

        total:
            number
    ): number {

        if (
            total === 0
        ) {
            return 0;
        }


        return Number(
            (
                (
                    value /
                    total
                ) *
                100
            ).toFixed(2)
        );
    }


    /*
    |--------------------------------------------------------------------------
    | Date Key
    |--------------------------------------------------------------------------
    */

    private dateKey(
        date:
            Date
    ): string {

        return [
            date.getFullYear(),

            String(
                date.getMonth() + 1
            ).padStart(
                2,
                "0"
            ),

            String(
                date.getDate()
            ).padStart(
                2,
                "0"
            ),
        ].join("-");
    }
}


export const monthlyReportMetricsService =
    new MonthlyReportMetricsService();
/* -------------------------------------------------------------------------- */
/*                       MONTHLY REPORT AI ANALYSIS                           */
/* -------------------------------------------------------------------------- */

export interface MonthlyReportAIInput {

    target: {

        role:
        string;

        domain:
        string;

        targetDurationMonths:
        number;

        dailyStudyHours:
        number;
    };


    period: {

        reportNumber:
        number;

        startDate:
        Date;

        endDate:
        Date;

        expectedDays:
        number;
    };


    timeline: {

        activeMissionDays:
        number;

        scheduleGapDays:
        number;

        progressLagDays:
        number;

        scheduleAdherenceRate:
        number;

        expectedWeeks:
        number;

        estimatedDelayDays:
        number;

        projectedWeeks:
        number;
    };


    missions: {

        generated:
        number;

        completed:
        number;
    };


    tasks: {

        generated:
        number;

        completed:
        number;

        pending:
        number;

        completionRate:
        number;

        plannedMinutes:
        number;

        completedMinutes:
        number;
    };


    assessments: {

        completed:
        number;

        averageScore:
        number | null;
    };


    skillProgress: {

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

    }[];


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


    reflections: {

        reflectionsSubmitted:
        number;

        incompleteTaskReasons:
        Record<
            string,
            number
        >;

        difficultyTypes:
        Record<
            string,
            number
        >;

        overallWeeks:
        Record<
            string,
            number
        >;

        motivationLevels:
        Record<
            string,
            number
        >;

        externalFactors:
        string[];

        careerConcerns:
        string[];

        helpNeeded:
        string[];
    };
}


/* -------------------------------------------------------------------------- */
/*                        MONTHLY REPORT AI OUTPUT                            */
/* -------------------------------------------------------------------------- */

export interface MonthlyReportAIOutput {

    summary:
    string;


    strengths:
    string[];


    concerns:
    string[];


    recommendations:
    string[];
}
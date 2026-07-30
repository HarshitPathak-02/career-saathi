import {
    AlertCircle,
    BarChart3,
    CalendarDays,
    CheckCircle2,
    Map,
    Sparkles,
    Target,
} from "lucide-react";

import {
    useNavigate,
    useParams,
} from "react-router-dom";

import {
    useGetMonthlyReportDetailsQuery,
} from "../api/monthlyReportApi";

import {
    useGetWorkspaceQuery,
} from "../../workspace/api/workspaceApi";


/*
|--------------------------------------------------------------------------
| Monthly Report Components
|--------------------------------------------------------------------------
|
| If your component filenames differ slightly,
| only adjust these import paths.
|
*/

import AssessmentTrendChart
    from "../components/AssessmentScoreChart";

import SkillProgressChart
    from "../components/SkillProgressChart";

import TaskCompletionChart
    from "../components/TaskCompletionChart";

import RoadmapProgressCard
    from "../components/RoadmapProgressCard";

import ReflectionInsightsCard
    from "../components/ReflectionInsightsCard";

import MonthlyAIInsightsCard
    from "../components/MonthlyAIInsightsCard";


/*
|--------------------------------------------------------------------------
| Helpers
|--------------------------------------------------------------------------
*/

const formatDate = (
    value: string
) => {

    return new Intl.DateTimeFormat(
        "en-IN",
        {
            day: "numeric",
            month: "short",
            year: "numeric",
        }
    ).format(
        new Date(value)
    );

};


const formatPercentage = (
    value: number
) => {

    return `${Math.round(value)}%`;

};


/*
|--------------------------------------------------------------------------
| Monthly Report Details Page
|--------------------------------------------------------------------------
*/

export default function MonthlyReportDetailsPage() {

    const navigate =
        useNavigate();


    /*
    |--------------------------------------------------------------------------
    | Route Params
    |--------------------------------------------------------------------------
    */

    const {
        reportNumber,
    } =
        useParams<{
            reportNumber: string;
        }>();


    /*
    |--------------------------------------------------------------------------
    | Active Career Journey
    |--------------------------------------------------------------------------
    */

    const {
        data:
        workspaceResponse,

        isLoading:
        isWorkspaceLoading,

        isError:
        isWorkspaceError,

        error:
        workspaceError,
    } =
        useGetWorkspaceQuery();


    const careerJourneyId =
        workspaceResponse
            ?.data
            ?.careerJourney
            ?.id;


    /*
    |--------------------------------------------------------------------------
    | Report Number
    |--------------------------------------------------------------------------
    */

    const parsedReportNumber =
        Number(
            reportNumber
        );


    const isValidReportNumber =
        Number.isInteger(
            parsedReportNumber
        ) &&
        parsedReportNumber > 0;


    /*
    |--------------------------------------------------------------------------
    | Monthly Report
    |--------------------------------------------------------------------------
    */

    const {
        data:
        reportResponse,

        isLoading:
        isReportLoading,

        isError:
        isReportError,

        error:
        reportError,
    } =
        useGetMonthlyReportDetailsQuery(
            {
                careerJourneyId:
                    careerJourneyId ?? "",

                reportNumber:
                    parsedReportNumber,
            },
            {
                skip:
                    !careerJourneyId ||
                    !isValidReportNumber,
            }
        );


    /*
    |--------------------------------------------------------------------------
    | Loading
    |--------------------------------------------------------------------------
    */

    if (
        isWorkspaceLoading ||
        isReportLoading
    ) {

        return (

            <div className="p-6">

                <div
                    className="
                        mx-auto
                        max-w-7xl
                        animate-pulse
                        space-y-6
                    "
                >

                    <div
                        className="
                            h-8
                            w-40
                            rounded
                            bg-slate-200
                        "
                    />


                    <div
                        className="
                            h-44
                            rounded-2xl
                            bg-slate-100
                        "
                    />


                    <div
                        className="
                            grid
                            gap-4
                            sm:grid-cols-2
                            xl:grid-cols-4
                        "
                    >

                        {[1, 2, 3, 4].map(
                            item => (

                                <div
                                    key={item}
                                    className="
                                        h-32
                                        rounded-2xl
                                        bg-slate-100
                                    "
                                />

                            )
                        )}

                    </div>


                    <div
                        className="
                            grid
                            gap-6
                            lg:grid-cols-2
                        "
                    >

                        <div
                            className="
                                h-80
                                rounded-2xl
                                bg-slate-100
                            "
                        />

                        <div
                            className="
                                h-80
                                rounded-2xl
                                bg-slate-100
                            "
                        />

                    </div>


                    <div
                        className="
                            h-96
                            rounded-2xl
                            bg-slate-100
                        "
                    />

                </div>

            </div>

        );

    }


    /*
    |--------------------------------------------------------------------------
    | Error
    |--------------------------------------------------------------------------
    */

    if (
        isWorkspaceError ||
        isReportError ||
        !careerJourneyId ||
        !isValidReportNumber ||
        !reportResponse?.data
    ) {

        console.error(
            "Failed to load monthly report:",
            {
                workspaceError,
                reportError,
            }
        );


        return (

            <div className="p-6">

                <div
                    className="
                        mx-auto
                        max-w-7xl
                    "
                >


                    <div
                        className="
                            mt-8
                            rounded-2xl
                            border
                            border-red-200
                            bg-red-50
                            p-6
                        "
                    >

                        <div
                            className="
                                flex
                                items-center
                                gap-2
                                font-semibold
                                text-red-900
                            "
                        >

                            <AlertCircle
                                size={19}
                            />

                            Unable to load report

                        </div>


                        <p
                            className="
                                mt-2
                                text-sm
                                text-red-700
                            "
                        >

                            We couldn't load this monthly
                            report right now.

                        </p>

                    </div>

                </div>

            </div>

        );

    }


    /*
    |--------------------------------------------------------------------------
    | Report
    |--------------------------------------------------------------------------
    */

    const report =
        reportResponse.data;


    /*
    |--------------------------------------------------------------------------
    | UI
    |--------------------------------------------------------------------------
    */

    return (

        <div className="p-6">

            <div
                className="
                    mx-auto
                    max-w-7xl
                "
            >


                {/* ---------------------------------------------------------- */}
                {/* Report Header                                              */}
                {/* ---------------------------------------------------------- */}

                <section
                    className="
                        mt-6
                        overflow-hidden
                        rounded-2xl
                        border
                        border-slate-200
                        bg-white
                        shadow-sm
                    "
                >

                    <div
                        className="
                            bg-linear-to-r
                            from-indigo-50/70
                            via-white
                            to-violet-50/60
                            p-6
                        "
                    >

                        <div
                            className="
                                flex
                                flex-col
                                justify-between
                                gap-5
                                md:flex-row
                                md:items-start
                            "
                        >

                            <div>

                                <div
                                    className="
                                        flex
                                        items-center
                                        gap-2
                                        text-indigo-600
                                    "
                                >

                                    <Sparkles
                                        size={17}
                                    />

                                    <span
                                        className="
                                            text-xs
                                            font-semibold
                                            uppercase
                                            tracking-wide
                                        "
                                    >

                                        Monthly Progress Review

                                    </span>

                                </div>


                                <h1
                                    className="
                                        mt-3
                                        text-3xl
                                        font-bold
                                        tracking-tight
                                        text-slate-900
                                    "
                                >

                                    Monthly Report{" "}
                                    {report.reportNumber}

                                </h1>


                                <div
                                    className="
                                        mt-3
                                        flex
                                        flex-wrap
                                        items-center
                                        gap-2
                                        text-sm
                                        text-slate-500
                                    "
                                >

                                    <CalendarDays
                                        size={16}
                                    />

                                    {formatDate(
                                        report.periodStart
                                    )}

                                    <span>
                                        –
                                    </span>

                                    {formatDate(
                                        report.periodEnd
                                    )}

                                    <span
                                        className="
                                            hidden
                                            text-slate-300
                                            sm:inline
                                        "
                                    >
                                        •
                                    </span>

                                    <span>
                                        {report.expectedDays}-day cycle
                                    </span>

                                </div>

                            </div>


                            <span
                                className={`
                                    w-fit
                                    rounded-full
                                    px-3
                                    py-1.5
                                    text-xs
                                    font-semibold

                                    ${report.status ===
                                        "COMPLETED"

                                        ? `
                                                bg-emerald-50
                                                text-emerald-700
                                            `

                                        : `
                                                bg-slate-100
                                                text-slate-600
                                            `
                                    }
                                `}
                            >

                                {report.status}

                            </span>

                        </div>

                    </div>

                </section>


                {/* ---------------------------------------------------------- */}
                {/* Main KPI Cards                                             */}
                {/* ---------------------------------------------------------- */}

                <section
                    className="
                        mt-6
                        grid
                        gap-4
                        sm:grid-cols-2
                        xl:grid-cols-4
                    "
                >

                    <MetricCard
                        icon={Target}

                        title="Consistency"

                        value={
                            formatPercentage(
                                report.consistencyRate
                            )
                        }

                        description={
                            `${report.missionCoveredDays}/${report.expectedDays} mission-covered days`
                        }
                    />


                    <MetricCard
                        icon={CheckCircle2}

                        title="Tasks Completed"

                        value={
                            `${report.taskMetrics.completed}/${report.taskMetrics.total}`
                        }

                        description={
                            `${formatPercentage(
                                report
                                    .taskMetrics
                                    .completionRate
                            )} completion rate`
                        }
                    />


                    <MetricCard
                        icon={BarChart3}

                        title="Assessment Score"

                        value={
                            report
                                .assessmentMetrics
                                .averageScore !==
                                null

                                ? formatPercentage(
                                    report
                                        .assessmentMetrics
                                        .averageScore
                                )

                                : "—"
                        }

                        description={
                            `${report.assessmentMetrics.totalAssessments} assessments completed`
                        }
                    />


                    <MetricCard
                        icon={Map}

                        title="Roadmap Progress"

                        value={
                            formatPercentage(
                                report
                                    .roadmapProgress
                                    .completionRate
                            )
                        }

                        description={
                            `${report.roadmapProgress.completedItems}/${report.roadmapProgress.totalItems} items completed`
                        }
                    />

                </section>


                {/* ---------------------------------------------------------- */}
                {/* Assessment Trend + Skill Progress                          */}
                {/* ---------------------------------------------------------- */}

                <section
                    className="
                        mt-6
                        grid
                        gap-6
                        xl:grid-cols-2
                    "
                >

                    <AssessmentTrendChart
                        data={
                            report
                                .assessmentMetrics
                                .scoreTrend
                        }
                    />


                    <SkillProgressChart
                        data={
                            report.skillProgress
                        }
                    />

                </section>


                {/* ---------------------------------------------------------- */}
                {/* Task Completion + Roadmap Progress                         */}
                {/* ---------------------------------------------------------- */}

                <section
                    className="
                        mt-6
                        grid
                        gap-6
                        xl:grid-cols-2
                    "
                >

                    <TaskCompletionChart
                        data={
                            report.taskMetrics
                        }
                    />


                    <RoadmapProgressCard
                        roadmap={
                            report.roadmapProgress
                        }

                        timeline={
                            report.timeline
                        }
                    />

                </section>


                {/* ---------------------------------------------------------- */}
                {/* Learning Activity + Timeline                               */}
                {/* ---------------------------------------------------------- */}

                <section
                    className="
                        mt-6
                        grid
                        gap-6
                        xl:grid-cols-2
                    "
                >

                    <ReportSection
                        title="Learning Activity"

                        description={
                            "How consistently you participated in your learning cycle."
                        }
                    >

                        <div
                            className="
                                grid
                                grid-cols-2
                                gap-4
                            "
                        >

                            <SmallMetric
                                label="Expected Days"

                                value={
                                    report.expectedDays
                                }
                            />


                            <SmallMetric
                                label="Mission Days"

                                value={
                                    report
                                        .missionCoveredDays
                                }
                            />


                            <SmallMetric
                                label="Completed Days"

                                value={
                                    report
                                        .completedTaskDays
                                }
                            />


                            <SmallMetric
                                label="Missed Days"

                                value={
                                    report
                                        .missedTaskDays
                                }
                            />

                        </div>


                        <div
                            className="
                                mt-5
                                border-t
                                border-slate-100
                                pt-5
                            "
                        >

                            <div
                                className="
                                    flex
                                    items-center
                                    justify-between
                                    gap-4
                                "
                            >

                                <div>

                                    <p
                                        className="
                                            text-sm
                                            font-medium
                                            text-slate-700
                                        "
                                    >
                                        Schedule adherence
                                    </p>

                                    <p
                                        className="
                                            mt-1
                                            text-xs
                                            text-slate-500
                                        "
                                    >
                                        {report.scheduleGapDays} schedule
                                        gap days recorded this cycle.
                                    </p>

                                </div>


                                <span
                                    className="
                                        text-lg
                                        font-bold
                                        text-slate-900
                                    "
                                >

                                    {formatPercentage(
                                        report.consistencyRate
                                    )}

                                </span>

                            </div>


                            <div
                                className="
                                    mt-4
                                    h-2.5
                                    overflow-hidden
                                    rounded-full
                                    bg-slate-100
                                "
                            >

                                <div
                                    className="
                                        h-full
                                        rounded-full
                                        bg-indigo-600
                                        transition-all
                                    "
                                    style={{
                                        width:
                                            `${Math.min(
                                                100,
                                                Math.max(
                                                    0,
                                                    report
                                                        .consistencyRate
                                                )
                                            )}%`,
                                    }}
                                />

                            </div>

                        </div>

                    </ReportSection>


                    <ReportSection
                        title="Timeline Projection"

                        description={
                            "How your current learning pace affects your target completion timeline."
                        }
                    >

                        <div
                            className="
                                grid
                                grid-cols-3
                                gap-3
                            "
                        >

                            <SmallMetric
                                label="Expected"

                                value={
                                    `${report.timeline.expectedWeeks}w`
                                }
                            />


                            <SmallMetric
                                label="Delay"

                                value={
                                    `${report.timeline.estimatedDelayDays}d`
                                }
                            />


                            <SmallMetric
                                label="Projected"

                                value={
                                    `${report.timeline.projectedWeeks}w`
                                }
                            />

                        </div>


                        <div
                            className="
                                mt-5
                                rounded-xl
                                border
                                border-slate-100
                                bg-slate-50
                                p-4
                            "
                        >

                            <p
                                className="
                                    text-sm
                                    leading-6
                                    text-slate-600
                                "
                            >

                                At your current learning pace,
                                your roadmap is projected to
                                finish in{" "}

                                <strong
                                    className="
                                        font-semibold
                                        text-slate-900
                                    "
                                >

                                    {
                                        report
                                            .timeline
                                            .projectedWeeks
                                    } weeks

                                </strong>.

                                {" "}

                                {report
                                    .timeline
                                    .estimatedDelayDays >
                                    0 && (

                                        <>

                                            This represents an
                                            estimated delay of{" "}

                                            <strong
                                                className="
                                                font-semibold
                                                text-amber-700
                                            "
                                            >

                                                {
                                                    report
                                                        .timeline
                                                        .estimatedDelayDays
                                                } days

                                            </strong>

                                            {" "}from the original
                                            learning schedule.

                                        </>

                                    )}

                            </p>

                        </div>

                    </ReportSection>

                </section>


                {/* ---------------------------------------------------------- */}
                {/* Reflection Insights                                        */}
                {/* ---------------------------------------------------------- */}

                <div className="mt-6">

                    <ReflectionInsightsCard
                        data={
                            report
                                .reflectionMetrics
                        }
                    />

                </div>


                {/* ---------------------------------------------------------- */}
                {/* AI Monthly Analysis                                        */}
                {/* ---------------------------------------------------------- */}

                <div className="mt-6">

                    <MonthlyAIInsightsCard
                        insights={
                            report.insights
                        }
                    />

                </div>


                {/* ---------------------------------------------------------- */}
                {/* Report Footer                                              */}
                {/* ---------------------------------------------------------- */}

                <div
                    className="
                        mt-8
                        flex
                        flex-col
                        gap-2
                        border-t
                        border-slate-200
                        py-6
                        text-xs
                        text-slate-400
                        sm:flex-row
                        sm:items-center
                        sm:justify-between
                    "
                >

                    <span>

                        CareerSaathi Monthly Progress Report

                    </span>


                    {report.generatedAt && (

                        <span>

                            Generated{" "}
                            {formatDate(
                                report.generatedAt
                            )}

                        </span>

                    )}

                </div>

            </div>

        </div>

    );

}


/*
|--------------------------------------------------------------------------
| Metric Card
|--------------------------------------------------------------------------
*/

interface MetricCardProps {

    icon:
    React.ComponentType<{
        size?: number;
        className?: string;
    }>;

    title:
    string;

    value:
    string;

    description:
    string;

}


function MetricCard({

    icon:
    Icon,

    title,

    value,

    description,

}: MetricCardProps) {

    return (

        <div
            className="
                rounded-2xl
                border
                border-slate-200
                bg-white
                p-5
                shadow-sm
            "
        >

            <div
                className="
                    flex
                    h-10
                    w-10
                    items-center
                    justify-center
                    rounded-xl
                    bg-indigo-50
                    text-indigo-600
                "
            >

                <Icon
                    size={19}
                />

            </div>


            <p
                className="
                    mt-4
                    text-sm
                    font-medium
                    text-slate-500
                "
            >

                {title}

            </p>


            <p
                className="
                    mt-1
                    text-2xl
                    font-bold
                    text-slate-900
                "
            >

                {value}

            </p>


            <p
                className="
                    mt-1
                    text-xs
                    leading-5
                    text-slate-400
                "
            >

                {description}

            </p>

        </div>

    );

}


/*
|--------------------------------------------------------------------------
| Report Section
|--------------------------------------------------------------------------
*/

interface ReportSectionProps {

    title:
    string;

    description:
    string;

    children:
    React.ReactNode;

}


function ReportSection({

    title,

    description,

    children,

}: ReportSectionProps) {

    return (

        <div
            className="
                rounded-2xl
                border
                border-slate-200
                bg-white
                p-6
                shadow-sm
            "
        >

            <h2
                className="
                    text-lg
                    font-bold
                    text-slate-900
                "
            >

                {title}

            </h2>


            <p
                className="
                    mt-1
                    text-sm
                    leading-6
                    text-slate-500
                "
            >

                {description}

            </p>


            <div className="mt-6">

                {children}

            </div>

        </div>

    );

}


/*
|--------------------------------------------------------------------------
| Small Metric
|--------------------------------------------------------------------------
*/

function SmallMetric({

    label,

    value,

}: {

    label:
    string;

    value:
    string | number;

}) {

    return (

        <div
            className="
                rounded-xl
                bg-slate-50
                p-4
            "
        >

            <p
                className="
                    text-xs
                    font-medium
                    text-slate-500
                "
            >

                {label}

            </p>


            <p
                className="
                    mt-2
                    text-xl
                    font-bold
                    text-slate-900
                "
            >

                {value}

            </p>

        </div>

    );

}
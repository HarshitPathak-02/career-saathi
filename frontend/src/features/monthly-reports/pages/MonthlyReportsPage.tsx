import {
    ArrowRight,
    BarChart3,
    CalendarDays,
    CheckCircle2,
    FileText,
    Map,
    Sparkles,
    Target,
} from "lucide-react";

import {
    useNavigate,
} from "react-router-dom";

import {
    useGetMonthlyReportsQuery,
} from "../api/monthlyReportApi";

import {
    useGetWorkspaceQuery,
} from "../../workspace/api/workspaceApi";

import type {
    MonthlyReport,
} from "../types/monthly-report.types";


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
| Monthly Reports Page
|--------------------------------------------------------------------------
*/

export default function MonthlyReportsPage() {

    const navigate =
        useNavigate();


    /*
    |--------------------------------------------------------------------------
    | Workspace
    |--------------------------------------------------------------------------
    */

    const {
        data: workspaceResponse,

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
    | Monthly Reports
    |--------------------------------------------------------------------------
    */

    const {
        data: reportsResponse,

        isLoading:
        isReportsLoading,

        isError:
        isReportsError,

        error:
        reportsError,
    } =
        useGetMonthlyReportsQuery(
            careerJourneyId ?? "",
            {
                skip:
                    !careerJourneyId,
            }
        );


    /*
    |--------------------------------------------------------------------------
    | Loading
    |--------------------------------------------------------------------------
    */

    if (
        isWorkspaceLoading ||
        isReportsLoading
    ) {

        return (

            <div className="p-6">

                <div
                    className="
                        mx-auto
                        max-w-6xl
                        animate-pulse
                        space-y-6
                    "
                >

                    <div
                        className="
                            h-9
                            w-72
                            rounded
                            bg-slate-200
                        "
                    />

                    <div
                        className="
                            h-5
                            w-96
                            max-w-full
                            rounded
                            bg-slate-100
                        "
                    />

                    <div
                        className="
                            grid
                            gap-5
                            md:grid-cols-2
                        "
                    >

                        {[1, 2, 3, 4].map(
                            item => (

                                <div
                                    key={item}
                                    className="
                                        h-80
                                        rounded-2xl
                                        border
                                        border-slate-200
                                        bg-white
                                    "
                                />

                            )
                        )}

                    </div>

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
        isReportsError ||
        !careerJourneyId
    ) {

        console.error(
            "Failed to load monthly reports:",
            {
                workspaceError,
                reportsError,
            }
        );

        return (

            <div className="p-6">

                <div
                    className="
                        mx-auto
                        max-w-6xl
                        rounded-2xl
                        border
                        border-red-200
                        bg-red-50
                        p-6
                    "
                >

                    <h2
                        className="
                            font-semibold
                            text-red-900
                        "
                    >

                        Unable to load monthly reports

                    </h2>

                    <p
                        className="
                            mt-2
                            text-sm
                            text-red-700
                        "
                    >

                        We couldn't load your monthly
                        progress reports right now.

                    </p>

                </div>

            </div>

        );

    }


    /*
    |--------------------------------------------------------------------------
    | Reports
    |--------------------------------------------------------------------------
    */

    const reports =
        reportsResponse
            ?.data ?? [];


    /*
    |--------------------------------------------------------------------------
    | UI
    |--------------------------------------------------------------------------
    */

    return (

        <div className="p-6">

            <div className="mx-auto max-w-6xl">

                {/* Header */}

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
                            size={18}
                        />

                        <span
                            className="
                                text-sm
                                font-semibold
                                uppercase
                                tracking-wide
                            "
                        >

                            Long-Term Progress

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

                        Monthly Reports

                    </h1>


                    <p
                        className="
                            mt-2
                            max-w-2xl
                            text-slate-500
                        "
                    >

                        Track your progress across each
                        28-day learning cycle, including
                        consistency, assessments, skill
                        growth, roadmap progress and
                        personalized AI insights.

                    </p>

                </div>


                {/* Empty State */}

                {reports.length === 0 ? (

                    <div
                        className="
                            mt-10
                            rounded-2xl
                            border
                            border-dashed
                            border-slate-300
                            bg-white
                            px-6
                            py-16
                            text-center
                        "
                    >

                        <div
                            className="
                                mx-auto
                                flex
                                h-14
                                w-14
                                items-center
                                justify-center
                                rounded-2xl
                                bg-indigo-50
                                text-indigo-600
                            "
                        >

                            <BarChart3
                                size={28}
                            />

                        </div>


                        <h2
                            className="
                                mt-5
                                text-lg
                                font-semibold
                                text-slate-900
                            "
                        >

                            No monthly reports yet

                        </h2>


                        <p
                            className="
                                mx-auto
                                mt-2
                                max-w-md
                                text-sm
                                leading-6
                                text-slate-500
                            "
                        >

                            Your first monthly progress
                            report will become available
                            after your first 28-day
                            learning cycle is completed.

                        </p>

                    </div>

                ) : (

                    /*
                    |--------------------------------------------------------------------------
                    | Report Cards
                    |--------------------------------------------------------------------------
                    */

                    <div
                        className="
                            mt-10
                            grid
                            gap-5
                            md:grid-cols-2
                        "
                    >

                        {reports.map(
                            (
                                report:
                                    MonthlyReport
                            ) => (

                                <MonthlyReportCard
                                    key={
                                        report.id
                                    }

                                    report={
                                        report
                                    }

                                    onOpen={() =>
                                        navigate(
                                            `/monthly-reports/${report.reportNumber}`
                                        )
                                    }
                                />

                            )
                        )}

                    </div>

                )}

            </div>

        </div>

    );

}


/*
|--------------------------------------------------------------------------
| Monthly Report Card
|--------------------------------------------------------------------------
*/

interface MonthlyReportCardProps {

    report:
    MonthlyReport;

    onOpen:
    () => void;

}


function MonthlyReportCard({

    report,
    onOpen,

}: MonthlyReportCardProps) {

    const isCompleted =
        report.status ===
        "COMPLETED";


    return (

        <button
            type="button"

            onClick={
                onOpen
            }

            className="
                group
                w-full
                rounded-2xl
                border
                border-slate-200
                bg-white
                p-6
                text-left
                shadow-sm
                transition
                hover:-translate-y-0.5
                hover:border-indigo-200
                hover:shadow-md
            "
        >

            {/* Header */}

            <div
                className="
                    flex
                    items-start
                    justify-between
                    gap-4
                "
            >

                <div
                    className="
                        flex
                        h-11
                        w-11
                        items-center
                        justify-center
                        rounded-xl
                        bg-indigo-50
                        text-indigo-600
                    "
                >

                    <FileText
                        size={21}
                    />

                </div>


                <span
                    className={`
                        rounded-full
                        px-3
                        py-1
                        text-xs
                        font-semibold

                        ${isCompleted
                            ? "bg-green-50 text-green-700"
                            : "bg-slate-100 text-slate-600"
                        }
                    `}
                >

                    {isCompleted
                        ? "Completed"
                        : report.status}

                </span>

            </div>


            {/* Title */}

            <div className="mt-5">

                <p
                    className="
                        text-xs
                        font-semibold
                        uppercase
                        tracking-wide
                        text-indigo-600
                    "
                >

                    Monthly Report{" "}
                    {report.reportNumber}

                </p>


                <h2
                    className="
                        mt-2
                        text-xl
                        font-bold
                        text-slate-900
                    "
                >

                    Your 28-Day Progress Review

                </h2>


                <div
                    className="
                        mt-2
                        flex
                        items-center
                        gap-2
                        text-sm
                        text-slate-500
                    "
                >

                    <CalendarDays
                        size={15}
                    />

                    <span>

                        {formatDate(
                            report.periodStart
                        )}

                        {" – "}

                        {formatDate(
                            report.periodEnd
                        )}

                    </span>

                </div>

            </div>


            {/* Summary */}

            <p
                className="
                    mt-4
                    line-clamp-2
                    text-sm
                    leading-6
                    text-slate-600
                "
            >

                {report.insights.summary}

            </p>


            {/* Metrics */}

            <div
                className="
                    mt-6
                    grid
                    grid-cols-2
                    gap-3
                "
            >

                {/* Consistency */}

                <MetricItem
                    icon={
                        Target
                    }

                    label="Consistency"

                    value={
                        formatPercentage(
                            report.consistencyRate
                        )
                    }
                />


                {/* Tasks */}

                <MetricItem
                    icon={
                        CheckCircle2
                    }

                    label="Tasks"

                    value={
                        `${report.taskMetrics.completed}/${report.taskMetrics.total}`
                    }
                />


                {/* Assessment */}

                <MetricItem
                    icon={
                        BarChart3
                    }

                    label="Avg. Score"

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
                />


                {/* Roadmap */}

                <MetricItem
                    icon={
                        Map
                    }

                    label="Roadmap"

                    value={
                        formatPercentage(
                            report
                                .roadmapProgress
                                .completionRate
                        )
                    }
                />

            </div>


            {/* Footer */}

            <div
                className="
                    mt-6
                    flex
                    items-center
                    justify-between
                    gap-4
                    border-t
                    border-slate-100
                    pt-4
                "
            >

                <div
                    className="
                        text-xs
                        text-slate-500
                    "
                >

                    {report.generatedAt
                        ? (
                            <>
                                Generated{" "}
                                {formatDate(
                                    report.generatedAt
                                )}
                            </>
                        )
                        : (
                            "Report generated"
                        )
                    }

                </div>


                <div
                    className="
                        flex
                        items-center
                        gap-1
                        text-sm
                        font-semibold
                        text-indigo-600
                    "
                >

                    View Report

                    <ArrowRight
                        size={16}

                        className="
                            transition-transform
                            group-hover:translate-x-1
                        "
                    />

                </div>

            </div>

        </button>

    );

}


/*
|--------------------------------------------------------------------------
| Metric Item
|--------------------------------------------------------------------------
*/

interface MetricItemProps {

    icon:
    React.ComponentType<{
        size?: number;
        className?: string;
    }>;

    label:
    string;

    value:
    string;

}


function MetricItem({

    icon:
    Icon,

    label,

    value,

}: MetricItemProps) {

    return (

        <div
            className="
                rounded-xl
                bg-slate-50
                p-3
            "
        >

            <div
                className="
                    flex
                    items-center
                    gap-2
                    text-slate-500
                "
            >

                <Icon
                    size={15}
                />

                <span
                    className="
                        text-xs
                        font-medium
                    "
                >

                    {label}

                </span>

            </div>


            <p
                className="
                    mt-2
                    text-base
                    font-bold
                    text-slate-900
                "
            >

                {value}

            </p>

        </div>

    );

}
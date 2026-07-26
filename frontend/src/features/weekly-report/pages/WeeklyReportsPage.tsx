import {
    ArrowRight,
    CalendarDays,
    FileText,
    Sparkles,
} from "lucide-react";

import {
    useNavigate,
} from "react-router-dom";

import {
    useGetWeeklyReportsQuery,
} from "../api/weeklyReportApi";

import {
    useGetWorkspaceQuery,
} from "../../workspace/api/workspaceApi";

import type {
    WeeklyReport,
} from "../types/weekly-report.types";


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


/*
|--------------------------------------------------------------------------
| Weekly Reports Page
|--------------------------------------------------------------------------
*/

export default function WeeklyReportsPage() {

    const navigate =
        useNavigate();

    /*
    |--------------------------------------------------------------------------
    | Workspace
    |--------------------------------------------------------------------------
    |
    | We use the workspace to determine the user's
    | currently active career journey.
    |
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
        workspaceResponse?.data
            ?.careerJourney
            ?.id;


    /*
    |--------------------------------------------------------------------------
    | Weekly Reports
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
        useGetWeeklyReportsQuery(
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
                            w-64
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
                                        h-64
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
            "Failed to load weekly reports:",
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

                        Unable to load weekly reports

                    </h2>

                    <p
                        className="
                            mt-2
                            text-sm
                            text-red-700
                        "
                    >

                        We couldn't load your weekly report
                        history right now.

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
        reportsResponse?.data ?? [];


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

                            Progress Insights

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

                        Weekly Reports

                    </h1>

                    <p
                        className="
                            mt-2
                            max-w-2xl
                            text-slate-500
                        "
                    >

                        Review your weekly progress,
                        achievements, mentor feedback,
                        and recommendations for upcoming
                        missions.

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

                            <FileText
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

                            No weekly reports yet

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

                            Your first weekly report will
                            appear here after you complete
                            your first weekly review.

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
                                report: WeeklyReport,
                                index
                            ) => (

                                <WeeklyReportCard
                                    key={
                                        report.id
                                    }
                                    report={
                                        report
                                    }
                                    reportNumber={
                                        reports.length -
                                        index
                                    }
                                    onOpen={() =>
                                        navigate(
                                            `/weekly-reports/${report.id}`
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
| Weekly Report Card
|--------------------------------------------------------------------------
*/

interface WeeklyReportCardProps {

    report: WeeklyReport;

    reportNumber: number;

    onOpen: () => void;

}


function WeeklyReportCard({

    report,
    reportNumber,
    onOpen,

}: WeeklyReportCardProps) {

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

            {/* Card Header */}

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


            {/* Report Title */}

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

                    Weekly Report{" "}
                    {reportNumber}

                </p>

                <h2
                    className="
                        mt-2
                        text-xl
                        font-bold
                        text-slate-900
                    "
                >

                    Your Weekly Progress Review

                </h2>

            </div>


            {/* Summary */}

            <p
                className="
                    mt-3
                    line-clamp-3
                    text-sm
                    leading-6
                    text-slate-600
                "
            >

                {report.summary.summary}

            </p>


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
                        flex
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
                        report.generatedAt
                    )}

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
import {
    Bar,
    BarChart,
    CartesianGrid,
    ResponsiveContainer,
    Tooltip,
    XAxis,
    YAxis,
} from "recharts";

import {
    Brain,
    CheckCircle2,
    CircleGauge,
    TriangleAlert,
} from "lucide-react";

import type {
    MonthlyReflectionMetrics,
} from "../types/monthly-report.types";


interface ReflectionInsightsCardProps {

    data:
    MonthlyReflectionMetrics;

}


/*
|--------------------------------------------------------------------------
| Format Label
|--------------------------------------------------------------------------
*/

const formatLabel = (
    value: string
) => {

    return value
        .replaceAll("_", " ")
        .toLowerCase()
        .replace(
            /\b\w/g,
            character =>
                character.toUpperCase()
        );

};


export default function ReflectionInsightsCard({

    data,

}: ReflectionInsightsCardProps) {

    /*
    |--------------------------------------------------------------------------
    | Motivation Chart Data
    |--------------------------------------------------------------------------
    */

    const motivationData =
        data.motivationDistribution.map(
            item => ({

                motivation:
                    formatLabel(
                        item.motivationLevel
                    ),

                weeks:
                    item.occurrences,

            })
        );


    /*
    |--------------------------------------------------------------------------
    | Most Common Difficulty
    |--------------------------------------------------------------------------
    */

    const mostCommonDifficulty =
        [...data.difficultyDistribution]
            .sort(
                (first, second) =>
                    second.occurrences -
                    first.occurrences
            )[0];


    /*
    |--------------------------------------------------------------------------
    | Most Common Incomplete Reason
    |--------------------------------------------------------------------------
    */

    const mostCommonReason =
        [...data.reasons]
            .sort(
                (first, second) =>
                    second.occurrences -
                    first.occurrences
            )[0];


    /*
    |--------------------------------------------------------------------------
    | UI
    |--------------------------------------------------------------------------
    */

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

            {/* Header */}

            <div
                className="
                    flex
                    items-start
                    gap-3
                "
            >

                <div
                    className="
                        flex
                        h-10
                        w-10
                        shrink-0
                        items-center
                        justify-center
                        rounded-xl
                        bg-violet-50
                        text-violet-600
                    "
                >

                    <Brain size={20} />

                </div>

                <div>

                    <h2
                        className="
                            text-lg
                            font-bold
                            text-slate-900
                        "
                    >
                        Reflection Insights
                    </h2>

                    <p
                        className="
                            mt-1
                            text-sm
                            text-slate-500
                        "
                    >
                        Patterns from your weekly
                        reflections during this cycle.
                    </p>

                </div>

            </div>


            {/* Summary Metrics */}

            <div
                className="
                    mt-6
                    grid
                    gap-3
                    sm:grid-cols-2
                    xl:grid-cols-4
                "
            >

                {/* Confidence */}

                <MetricCard
                    icon={
                        CircleGauge
                    }
                    label="Avg. Confidence"
                    value={
                        `${data.averageConfidenceRating}/5`
                    }
                />


                {/* Completed Weeks */}

                <MetricCard
                    icon={
                        CheckCircle2
                    }
                    label="Complete Weeks"
                    value={
                        `${data.completedAllTasksWeeks}/${data.reflectionsConsidered}`
                    }
                />


                {/* Difficulty */}

                <MetricCard
                    icon={
                        TriangleAlert
                    }
                    label="Common Difficulty"
                    value={
                        mostCommonDifficulty
                            ? formatLabel(
                                mostCommonDifficulty
                                    .difficultyType
                            )
                            : "None"
                    }
                />


                {/* Incomplete Reason */}

                <MetricCard
                    icon={
                        Brain
                    }
                    label="Common Blocker"
                    value={
                        mostCommonReason
                            ? formatLabel(
                                mostCommonReason
                                    .reason
                            )
                            : "None"
                    }
                />

            </div>


            {/* Motivation Chart */}

            <div
                className="
                    mt-7
                    border-t
                    border-slate-100
                    pt-6
                "
            >

                <div>

                    <h3
                        className="
                            text-sm
                            font-semibold
                            text-slate-900
                        "
                    >
                        Motivation Distribution
                    </h3>

                    <p
                        className="
                            mt-1
                            text-xs
                            text-slate-500
                        "
                    >
                        Motivation levels reported
                        across weekly reflections.
                    </p>

                </div>


                {motivationData.length === 0 ? (

                    <div
                        className="
                            flex
                            h-56
                            items-center
                            justify-center
                            text-sm
                            text-slate-400
                        "
                    >
                        No motivation data available.
                    </div>

                ) : (

                    <div className="mt-5 h-56">

                        <ResponsiveContainer
                            width="100%"
                            height="100%"
                        >

                            <BarChart
                                data={
                                    motivationData
                                }
                                margin={{
                                    top: 5,
                                    right: 10,
                                    left: -25,
                                    bottom: 0,
                                }}
                            >

                                <CartesianGrid
                                    strokeDasharray="4 4"
                                    vertical={false}
                                    stroke="#e2e8f0"
                                />

                                <XAxis
                                    dataKey="motivation"
                                    axisLine={false}
                                    tickLine={false}
                                    tick={{
                                        fill: "#64748b",
                                        fontSize: 12,
                                    }}
                                />

                                <YAxis
                                    allowDecimals={
                                        false
                                    }
                                    axisLine={false}
                                    tickLine={false}
                                    tick={{
                                        fill: "#64748b",
                                        fontSize: 12,
                                    }}
                                />

                                <Tooltip
                                    formatter={(
                                        value
                                    ) => [
                                            `${value} reflection(s)`,
                                            "Occurrences",
                                        ]}
                                    contentStyle={{
                                        borderRadius:
                                            "12px",

                                        border:
                                            "1px solid #e2e8f0",

                                        boxShadow:
                                            "0 8px 24px rgba(15,23,42,0.08)",
                                    }}
                                />

                                <Bar
                                    dataKey="weeks"
                                    name="Occurrences"
                                    fill="#7c3aed"
                                    radius={[
                                        6,
                                        6,
                                        0,
                                        0,
                                    ]}
                                    maxBarSize={55}
                                />

                            </BarChart>

                        </ResponsiveContainer>

                    </div>

                )}

            </div>


            {/* Reflection Details */}

            <div
                className="
                    mt-6
                    grid
                    gap-6
                    border-t
                    border-slate-100
                    pt-6
                    md:grid-cols-2
                "
            >

                {/* Incomplete Reasons */}

                <div>

                    <h3
                        className="
                            text-sm
                            font-semibold
                            text-slate-900
                        "
                    >
                        Incomplete Task Reasons
                    </h3>


                    <div
                        className="
                            mt-3
                            space-y-2
                        "
                    >

                        {data.reasons.length === 0 ? (

                            <p
                                className="
                                    text-sm
                                    text-slate-400
                                "
                            >
                                No blockers reported.
                            </p>

                        ) : (

                            data.reasons.map(
                                item => (

                                    <DistributionRow
                                        key={
                                            item.reason
                                        }
                                        label={
                                            formatLabel(
                                                item.reason
                                            )
                                        }
                                        value={
                                            item.occurrences
                                        }
                                    />

                                )
                            )

                        )}

                    </div>

                </div>


                {/* Difficulty */}

                <div>

                    <h3
                        className="
                            text-sm
                            font-semibold
                            text-slate-900
                        "
                    >
                        Difficulty Distribution
                    </h3>


                    <div
                        className="
                            mt-3
                            space-y-2
                        "
                    >

                        {
                            data
                                .difficultyDistribution
                                .length === 0
                                ? (

                                    <p
                                        className="
                                            text-sm
                                            text-slate-400
                                        "
                                    >
                                        No difficulty data available.
                                    </p>

                                )
                                : (

                                    data
                                        .difficultyDistribution
                                        .map(
                                            item => (

                                                <DistributionRow
                                                    key={
                                                        item.difficultyType
                                                    }
                                                    label={
                                                        formatLabel(
                                                            item.difficultyType
                                                        )
                                                    }
                                                    value={
                                                        item.occurrences
                                                    }
                                                />

                                            )
                                        )

                                )
                        }

                    </div>

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

    label:
    string;

    value:
    string;

}


function MetricCard({

    icon: Icon,
    label,
    value,

}: MetricCardProps) {

    return (

        <div
            className="
                rounded-xl
                border
                border-slate-100
                bg-slate-50
                p-4
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

                <Icon size={16} />

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
                    mt-3
                    truncate
                    text-lg
                    font-bold
                    text-slate-900
                "
                title={value}
            >
                {value}
            </p>

        </div>

    );

}


/*
|--------------------------------------------------------------------------
| Distribution Row
|--------------------------------------------------------------------------
*/

interface DistributionRowProps {

    label:
    string;

    value:
    number;

}


function DistributionRow({

    label,
    value,

}: DistributionRowProps) {

    return (

        <div
            className="
                flex
                items-center
                justify-between
                gap-3
                rounded-lg
                bg-slate-50
                px-3
                py-2.5
            "
        >

            <span
                className="
                    text-sm
                    text-slate-600
                "
            >
                {label}
            </span>

            <span
                className="
                    rounded-full
                    bg-white
                    px-2.5
                    py-1
                    text-xs
                    font-semibold
                    text-slate-700
                    shadow-sm
                "
            >
                {value}
            </span>

        </div>

    );

}
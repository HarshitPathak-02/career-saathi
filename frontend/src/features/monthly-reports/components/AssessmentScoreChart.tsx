import {
    CartesianGrid,
    Line,
    LineChart,
    ResponsiveContainer,
    Tooltip,
    XAxis,
    YAxis,
} from "recharts";

import type {
    MonthlyAssessmentScoreTrend,
} from "../types/monthly-report.types";


interface AssessmentScoreChartProps {

    data:
    MonthlyAssessmentScoreTrend[];

}


export default function AssessmentScoreChart({

    data,

}: AssessmentScoreChartProps) {

    if (data.length === 0) {

        return (

            <div
                className="
                    flex
                    h-72
                    items-center
                    justify-center
                    text-sm
                    text-slate-400
                "
            >
                No assessment data available.
            </div>

        );

    }


    const chartData =
        data.map(
            item => ({

                week:
                    `Week ${item.weekNumber}`,

                score:
                    item.score,

            })
        );


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

            <div>

                <h2
                    className="
                        text-lg
                        font-bold
                        text-slate-900
                    "
                >
                    Assessment Performance
                </h2>

                <p
                    className="
                        mt-1
                        text-sm
                        text-slate-500
                    "
                >
                    Your assessment score progression
                    during this reporting cycle.
                </p>

            </div>


            {/* Chart */}

            <div className="mt-6 h-72">

                <ResponsiveContainer
                    width="100%"
                    height="100%"
                >

                    <LineChart
                        data={chartData}
                        margin={{
                            top: 10,
                            right: 15,
                            left: -15,
                            bottom: 0,
                        }}
                    >

                        <CartesianGrid
                            strokeDasharray="4 4"
                            vertical={false}
                            stroke="#e2e8f0"
                        />

                        <XAxis
                            dataKey="week"
                            axisLine={false}
                            tickLine={false}
                            tick={{
                                fill: "#64748b",
                                fontSize: 12,
                            }}
                        />

                        <YAxis
                            domain={[0, 100]}
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
                                    `${value}%`,
                                    "Score",
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

                        <Line
                            type="monotone"
                            dataKey="score"
                            stroke="#4f46e5"
                            strokeWidth={3}
                            dot={{
                                r: 5,
                                fill: "#4f46e5",
                                strokeWidth: 0,
                            }}
                            activeDot={{
                                r: 7,
                            }}
                        />

                    </LineChart>

                </ResponsiveContainer>

            </div>

        </div>

    );

}
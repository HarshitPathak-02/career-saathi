import {
    Bar,
    BarChart,
    CartesianGrid,
    Legend,
    ResponsiveContainer,
    Tooltip,
    XAxis,
    YAxis,
} from "recharts";

import type {
    MonthlySkillProgress,
} from "../types/monthly-report.types";


interface SkillProgressChartProps {

    data:
    MonthlySkillProgress[];

}


export default function SkillProgressChart({

    data,

}: SkillProgressChartProps) {

    /*
    |--------------------------------------------------------------------------
    | Empty State
    |--------------------------------------------------------------------------
    */

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
                No skill progress data available.
            </div>

        );

    }


    /*
    |--------------------------------------------------------------------------
    | Chart Data
    |--------------------------------------------------------------------------
    */

    const chartData =
        data.map(
            skill => ({

                skill:
                    skill.skillName,

                startScore:
                    skill.startScore,

                endScore:
                    skill.endScore,

            })
        );


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

            <div>

                <h2
                    className="
                        text-lg
                        font-bold
                        text-slate-900
                    "
                >
                    Skill Progress
                </h2>

                <p
                    className="
                        mt-1
                        text-sm
                        text-slate-500
                    "
                >
                    Compare your starting and latest
                    assessment scores for each skill.
                </p>

            </div>


            {/* Chart */}

            <div className="mt-6 h-80">

                <ResponsiveContainer
                    width="100%"
                    height="100%"
                >

                    <BarChart
                        data={chartData}
                        margin={{
                            top: 10,
                            right: 10,
                            left: -15,
                            bottom: 5,
                        }}
                        barGap={4}
                    >

                        <CartesianGrid
                            strokeDasharray="4 4"
                            vertical={false}
                            stroke="#e2e8f0"
                        />


                        <XAxis
                            dataKey="skill"
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


                        <Legend
                            wrapperStyle={{
                                fontSize:
                                    "12px",
                            }}
                        />


                        <Bar
                            dataKey="startScore"
                            name="Start Score"
                            fill="#cbd5e1"
                            radius={[
                                6,
                                6,
                                0,
                                0,
                            ]}
                            maxBarSize={42}
                        />


                        <Bar
                            dataKey="endScore"
                            name="End Score"
                            fill="#4f46e5"
                            radius={[
                                6,
                                6,
                                0,
                                0,
                            ]}
                            maxBarSize={42}
                        />

                    </BarChart>

                </ResponsiveContainer>

            </div>

        </div>

    );

}
import {
    Cell,
    Pie,
    PieChart,
    ResponsiveContainer,
    Tooltip,
} from "recharts";

import type {
    MonthlyTaskMetrics,
} from "../types/monthly-report.types";


interface TaskCompletionChartProps {

    data:
    MonthlyTaskMetrics;

}


export default function TaskCompletionChart({

    data,

}: TaskCompletionChartProps) {

    /*
    |--------------------------------------------------------------------------
    | Chart Data
    |--------------------------------------------------------------------------
    */

    const chartData = [

        {
            name:
                "Completed",

            value:
                data.completed,

            color:
                "#4f46e5",
        },

        {
            name:
                "Pending",

            value:
                data.pending,

            color:
                "#e2e8f0",
        },

    ];


    /*
    |--------------------------------------------------------------------------
    | Empty State
    |--------------------------------------------------------------------------
    */

    if (data.total === 0) {

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
                    Task Completion
                </h2>

                <div
                    className="
                        flex
                        h-64
                        items-center
                        justify-center
                        text-sm
                        text-slate-400
                    "
                >
                    No task data available.
                </div>

            </div>

        );

    }


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
                    Task Completion
                </h2>

                <p
                    className="
                        mt-1
                        text-sm
                        text-slate-500
                    "
                >
                    Your planned task completion
                    during this reporting cycle.
                </p>

            </div>


            {/* Donut */}

            <div
                className="
                    relative
                    mt-4
                    h-56
                "
            >

                <ResponsiveContainer
                    width="100%"
                    height="100%"
                >

                    <PieChart>

                        <Pie
                            data={chartData}
                            dataKey="value"
                            nameKey="name"
                            cx="50%"
                            cy="50%"
                            innerRadius={65}
                            outerRadius={88}
                            paddingAngle={3}
                            stroke="none"
                        >

                            {chartData.map(
                                item => (

                                    <Cell
                                        key={
                                            item.name
                                        }
                                        fill={
                                            item.color
                                        }
                                    />

                                )
                            )}

                        </Pie>


                        <Tooltip
                            formatter={(
                                value,
                                name
                            ) => [
                                    `${value} tasks`,
                                    name,
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

                    </PieChart>

                </ResponsiveContainer>


                {/* Center Content */}

                <div
                    className="
                        pointer-events-none
                        absolute
                        inset-0
                        flex
                        flex-col
                        items-center
                        justify-center
                    "
                >

                    <span
                        className="
                            text-3xl
                            font-bold
                            text-slate-900
                        "
                    >
                        {data.completionRate}%
                    </span>

                    <span
                        className="
                            mt-1
                            text-xs
                            font-medium
                            uppercase
                            tracking-wide
                            text-slate-400
                        "
                    >
                        Completed
                    </span>

                </div>

            </div>


            {/* Breakdown */}

            <div
                className="
                    grid
                    grid-cols-2
                    gap-3
                    border-t
                    border-slate-100
                    pt-5
                "
            >

                {/* Completed */}

                <div>

                    <div
                        className="
                            flex
                            items-center
                            gap-2
                        "
                    >

                        <span
                            className="
                                h-2.5
                                w-2.5
                                rounded-full
                                bg-indigo-600
                            "
                        />

                        <span
                            className="
                                text-sm
                                text-slate-500
                            "
                        >
                            Completed
                        </span>

                    </div>

                    <p
                        className="
                            mt-2
                            text-xl
                            font-bold
                            text-slate-900
                        "
                    >
                        {data.completed}
                    </p>

                </div>


                {/* Pending */}

                <div>

                    <div
                        className="
                            flex
                            items-center
                            gap-2
                        "
                    >

                        <span
                            className="
                                h-2.5
                                w-2.5
                                rounded-full
                                bg-slate-300
                            "
                        />

                        <span
                            className="
                                text-sm
                                text-slate-500
                            "
                        >
                            Pending
                        </span>

                    </div>

                    <p
                        className="
                            mt-2
                            text-xl
                            font-bold
                            text-slate-900
                        "
                    >
                        {data.pending}
                    </p>

                </div>

            </div>

        </div>

    );

}
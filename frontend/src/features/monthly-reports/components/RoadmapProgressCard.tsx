import {
    CalendarClock,
    CheckCircle2,
    Clock3,
    Map,
    Target,
} from "lucide-react";

import type {
    MonthlyRoadmapProgress,
    MonthlyTimelineProjection,
} from "../types/monthly-report.types";


interface RoadmapProgressCardProps {

    roadmap:
    MonthlyRoadmapProgress;

    timeline:
    MonthlyTimelineProjection;

}


export default function RoadmapProgressCard({

    roadmap,
    timeline,

}: RoadmapProgressCardProps) {

    /*
    |--------------------------------------------------------------------------
    | Derived Values
    |--------------------------------------------------------------------------
    */

    const remainingItems =
        Math.max(
            0,
            roadmap.totalItems -
            roadmap.completedItems
        );


    const progress =
        Math.min(
            100,
            Math.max(
                0,
                roadmap.completionRate
            )
        );


    const hasDelay =
        timeline.estimatedDelayDays > 0;


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
                    justify-between
                    gap-4
                "
            >

                <div>

                    <div
                        className="
                            flex
                            items-center
                            gap-2
                        "
                    >

                        <Map
                            size={19}
                            className="text-indigo-600"
                        />

                        <h2
                            className="
                                text-lg
                                font-bold
                                text-slate-900
                            "
                        >
                            Roadmap Progress
                        </h2>

                    </div>

                    <p
                        className="
                            mt-1
                            text-sm
                            text-slate-500
                        "
                    >
                        Your overall roadmap completion
                        and projected timeline.
                    </p>

                </div>


                <span
                    className="
                        rounded-full
                        bg-indigo-50
                        px-3
                        py-1
                        text-sm
                        font-bold
                        text-indigo-700
                    "
                >
                    {roadmap.completionRate}%
                </span>

            </div>


            {/* Progress */}

            <div className="mt-7">

                <div
                    className="
                        flex
                        items-end
                        justify-between
                        gap-4
                    "
                >

                    <div>

                        <p
                            className="
                                text-3xl
                                font-bold
                                tracking-tight
                                text-slate-900
                            "
                        >
                            {roadmap.completedItems}

                            <span
                                className="
                                    ml-1
                                    text-lg
                                    font-medium
                                    text-slate-400
                                "
                            >
                                / {roadmap.totalItems}
                            </span>

                        </p>

                        <p
                            className="
                                mt-1
                                text-sm
                                text-slate-500
                            "
                        >
                            roadmap items completed
                        </p>

                    </div>

                    <Target
                        size={28}
                        className="text-slate-300"
                    />

                </div>


                {/* Progress Bar */}

                <div
                    className="
                        mt-5
                        h-3
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
                            duration-500
                        "
                        style={{
                            width:
                                `${progress}%`,
                        }}
                    />

                </div>

            </div>


            {/* Item Breakdown */}

            <div
                className="
                    mt-6
                    grid
                    grid-cols-2
                    gap-4
                "
            >

                <div
                    className="
                        rounded-xl
                        bg-slate-50
                        p-4
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

                        <CheckCircle2
                            size={16}
                            className="text-green-600"
                        />

                        Completed

                    </div>

                    <p
                        className="
                            mt-2
                            text-2xl
                            font-bold
                            text-slate-900
                        "
                    >
                        {roadmap.completedItems}
                    </p>

                </div>


                <div
                    className="
                        rounded-xl
                        bg-slate-50
                        p-4
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

                        <Clock3
                            size={16}
                            className="text-slate-500"
                        />

                        Remaining

                    </div>

                    <p
                        className="
                            mt-2
                            text-2xl
                            font-bold
                            text-slate-900
                        "
                    >
                        {remainingItems}
                    </p>

                </div>

            </div>


            {/* Timeline */}

            <div
                className="
                    mt-6
                    border-t
                    border-slate-100
                    pt-6
                "
            >

                <div
                    className="
                        flex
                        items-center
                        gap-2
                    "
                >

                    <CalendarClock
                        size={18}
                        className="text-indigo-600"
                    />

                    <h3
                        className="
                            text-sm
                            font-semibold
                            text-slate-900
                        "
                    >
                        Timeline Projection
                    </h3>

                </div>


                <div
                    className="
                        mt-4
                        grid
                        grid-cols-3
                        gap-3
                    "
                >

                    {/* Expected */}

                    <div>

                        <p
                            className="
                                text-xs
                                font-medium
                                uppercase
                                tracking-wide
                                text-slate-400
                            "
                        >
                            Expected
                        </p>

                        <p
                            className="
                                mt-1
                                text-lg
                                font-bold
                                text-slate-900
                            "
                        >
                            {timeline.expectedWeeks}
                            <span
                                className="
                                    ml-1
                                    text-xs
                                    font-medium
                                    text-slate-500
                                "
                            >
                                weeks
                            </span>
                        </p>

                    </div>


                    {/* Projected */}

                    <div>

                        <p
                            className="
                                text-xs
                                font-medium
                                uppercase
                                tracking-wide
                                text-slate-400
                            "
                        >
                            Projected
                        </p>

                        <p
                            className="
                                mt-1
                                text-lg
                                font-bold
                                text-slate-900
                            "
                        >
                            {timeline.projectedWeeks}

                            <span
                                className="
                                    ml-1
                                    text-xs
                                    font-medium
                                    text-slate-500
                                "
                            >
                                weeks
                            </span>

                        </p>

                    </div>


                    {/* Delay */}

                    <div>

                        <p
                            className="
                                text-xs
                                font-medium
                                uppercase
                                tracking-wide
                                text-slate-400
                            "
                        >
                            Delay
                        </p>

                        <p
                            className={`
                                mt-1
                                text-lg
                                font-bold

                                ${hasDelay
                                    ? "text-amber-600"
                                    : "text-green-600"
                                }
                            `}
                        >

                            {
                                timeline
                                    .estimatedDelayDays
                            }

                            <span
                                className="
                                    ml-1
                                    text-xs
                                    font-medium
                                "
                            >
                                days
                            </span>

                        </p>

                    </div>

                </div>

            </div>

        </div>

    );

}
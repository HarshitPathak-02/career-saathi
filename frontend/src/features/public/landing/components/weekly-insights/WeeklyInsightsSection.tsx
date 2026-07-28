import {
    ArrowRight,
} from "lucide-react";

import {
    Link,
} from "react-router-dom";

import {
    WEEKLY_INSIGHTS,
} from "./weeklyInsights";

import WeeklyInsightsPreview
    from "./WeeklyInsightsPreview";

const WeeklyInsightsSection = () => {

    return (

        <section
            id="weekly-insights"
            className="
                overflow-hidden
                bg-slate-50
                py-24
                lg:py-32
            "
        >

            <div
                className="
                    mx-auto
                    max-w-[1440px]
                    px-6
                    xl:px-10
                "
            >

                {/* Header */}

                <div
                    className="
                        mx-auto
                        max-w-4xl
                        text-center
                    "
                >

                    <span
                        className="
                            inline-flex
                            rounded-full
                            bg-indigo-100
                            px-4
                            py-2
                            text-sm
                            font-semibold
                            text-indigo-700
                        "
                    >

                        More Than Progress Tracking

                    </span>

                    <h2
                        className="
                            mt-6
                            text-4xl
                            font-bold
                            tracking-tight
                            text-slate-900
                            sm:text-5xl
                        "
                    >

                        Every Week Teaches CareerSaathi

                        <span className="text-indigo-600">
                            {" "}How to Guide You Better.
                        </span>

                    </h2>

                    <p
                        className="
                            mx-auto
                            mt-6
                            max-w-3xl
                            text-lg
                            leading-8
                            text-slate-600
                        "
                    >

                        Your weekly review isn't just another
                        progress report. CareerSaathi brings
                        together your completed work, assessment
                        performance, confidence, challenges, and
                        improvement to understand how your
                        journey is actually progressing.

                    </p>

                </div>


                {/* Insight Features */}

                <div
                    className="
                        mx-auto
                        mt-14
                        grid
                        max-w-6xl
                        gap-4
                        sm:grid-cols-2
                        lg:grid-cols-4
                    "
                >

                    {WEEKLY_INSIGHTS.map(
                        (insight) => {

                            const Icon =
                                insight.icon;

                            return (

                                <div
                                    key={
                                        insight.title
                                    }
                                    className="
                                        rounded-2xl
                                        border
                                        border-slate-200
                                        bg-white
                                        p-6
                                        shadow-sm
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
                                        "
                                    >

                                        <Icon
                                            size={21}
                                            className="
                                                text-indigo-600
                                            "
                                        />

                                    </div>

                                    <h3
                                        className="
                                            mt-5
                                            font-semibold
                                            text-slate-900
                                        "
                                    >

                                        {insight.title}

                                    </h3>

                                    <p
                                        className="
                                            mt-2
                                            text-sm
                                            leading-6
                                            text-slate-500
                                        "
                                    >

                                        {insight.description}

                                    </p>

                                </div>

                            );

                        }
                    )}

                </div>


                {/* Real Product Screenshots */}

                <WeeklyInsightsPreview />


                {/* Bottom Explanation */}

                <div
                    className="
                        mx-auto
                        mt-20
                        max-w-5xl
                        rounded-3xl
                        border
                        border-indigo-100
                        bg-white
                        px-6
                        py-10
                        shadow-sm
                        sm:px-10
                        lg:flex
                        lg:items-center
                        lg:justify-between
                        lg:gap-12
                    "
                >

                    <div className="max-w-2xl">

                        <p
                            className="
                                text-sm
                                font-semibold
                                uppercase
                                tracking-wider
                                text-indigo-600
                            "
                        >

                            The Adaptive Loop

                        </p>

                        <h3
                            className="
                                mt-3
                                text-2xl
                                font-bold
                                tracking-tight
                                text-slate-900
                                sm:text-3xl
                            "
                        >

                            Your next week isn't a copy
                            of the previous one.

                        </h3>

                        <p
                            className="
                                mt-4
                                leading-7
                                text-slate-600
                            "
                        >

                            CareerSaathi uses what it learns
                            from your weekly performance to
                            identify revision needs, adjust
                            priorities, and prepare the focus
                            for your next mission.

                        </p>

                    </div>

                    <div
                        className="
                            mt-8
                            shrink-0
                            lg:mt-0
                        "
                    >

                        <Link
                            to="/register"
                            className="
                                group
                                inline-flex
                                items-center
                                gap-2
                                rounded-xl
                                bg-slate-900
                                px-6
                                py-3
                                text-sm
                                font-semibold
                                text-white
                                transition
                                hover:bg-slate-800
                            "
                        >

                            Build My Career Plan

                            <ArrowRight
                                size={17}
                                className="
                                    transition-transform
                                    group-hover:translate-x-1
                                "
                            />

                        </Link>

                    </div>

                </div>

            </div>

        </section>

    );

};

export default WeeklyInsightsSection;
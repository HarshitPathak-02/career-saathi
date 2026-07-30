import {
    AlertTriangle,
    BrainCircuit,
    CheckCircle2,
    Lightbulb,
    Sparkles,
} from "lucide-react";

import type {
    MonthlyReportInsights,
} from "../types/monthly-report.types";


interface MonthlyAIInsightsCardProps {

    insights:
    MonthlyReportInsights;

}


export default function MonthlyAIInsightsCard({

    insights,

}: MonthlyAIInsightsCardProps) {

    return (

        <section
            className="
                overflow-hidden
                rounded-2xl
                border
                border-slate-200
                bg-white
                shadow-sm
            "
        >

            {/* Header */}

            <div
                className="
                    border-b
                    border-slate-100
                    bg-gradient-to-r
                    from-indigo-50
                    via-white
                    to-violet-50
                    px-6
                    py-6
                "
            >

                <div
                    className="
                        flex
                        items-start
                        gap-4
                    "
                >

                    <div
                        className="
                            flex
                            h-11
                            w-11
                            shrink-0
                            items-center
                            justify-center
                            rounded-xl
                            bg-indigo-600
                            text-white
                            shadow-sm
                        "
                    >

                        <BrainCircuit
                            size={22}
                        />

                    </div>


                    <div>

                        <div
                            className="
                                flex
                                items-center
                                gap-2
                            "
                        >

                            <h2
                                className="
                                    text-lg
                                    font-bold
                                    text-slate-900
                                "
                            >
                                AI Monthly Analysis
                            </h2>

                            <Sparkles
                                size={16}
                                className="
                                    text-indigo-500
                                "
                            />

                        </div>


                        <p
                            className="
                                mt-1
                                max-w-2xl
                                text-sm
                                leading-6
                                text-slate-500
                            "
                        >
                            CareerSaathi analyzed your
                            learning activity, assessments,
                            skills, reflections, and roadmap
                            progress from this cycle.
                        </p>

                    </div>

                </div>

            </div>


            {/* Summary */}

            <div className="p-6">

                <div
                    className="
                        rounded-xl
                        border
                        border-indigo-100
                        bg-indigo-50/60
                        p-5
                    "
                >

                    <div
                        className="
                            flex
                            items-center
                            gap-2
                        "
                    >

                        <Sparkles
                            size={17}
                            className="
                                text-indigo-600
                            "
                        />

                        <h3
                            className="
                                text-sm
                                font-semibold
                                text-indigo-950
                            "
                        >
                            Your Month at a Glance
                        </h3>

                    </div>


                    <p
                        className="
                            mt-3
                            text-sm
                            leading-7
                            text-slate-700
                        "
                    >
                        {insights.summary}
                    </p>

                </div>


                {/* Analysis Columns */}

                <div
                    className="
                        mt-6
                        grid
                        gap-5
                        lg:grid-cols-3
                    "
                >

                    {/* Strengths */}

                    <InsightColumn
                        title="What Went Well"
                        description={
                            "Positive signals from your learning cycle."
                        }
                        items={
                            insights.strengths
                        }
                        icon={
                            CheckCircle2
                        }
                        variant="success"
                    />


                    {/* Concerns */}

                    <InsightColumn
                        title="Needs Attention"
                        description={
                            "Areas that could slow down your progress."
                        }
                        items={
                            insights.concerns
                        }
                        icon={
                            AlertTriangle
                        }
                        variant="warning"
                    />


                    {/* Recommendations */}

                    <InsightColumn
                        title="Next Cycle Focus"
                        description={
                            "Actions CareerSaathi recommends for your next cycle."
                        }
                        items={
                            insights.recommendations
                        }
                        icon={
                            Lightbulb
                        }
                        variant="recommendation"
                    />

                </div>

            </div>

        </section>

    );

}


/*
|--------------------------------------------------------------------------
| Insight Column
|--------------------------------------------------------------------------
*/

type InsightVariant =
    "success" |
    "warning" |
    "recommendation";


interface InsightColumnProps {

    title:
    string;

    description:
    string;

    items:
    string[];

    icon:
    React.ComponentType<{
        size?: number;
        className?: string;
    }>;

    variant:
    InsightVariant;

}


function InsightColumn({

    title,
    description,
    items,
    icon: Icon,
    variant,

}: InsightColumnProps) {

    /*
    |--------------------------------------------------------------------------
    | Variant Styles
    |--------------------------------------------------------------------------
    */

    const styles = {

        success: {

            container:
                "border-emerald-100 bg-emerald-50/40",

            icon:
                "bg-emerald-100 text-emerald-700",

            bullet:
                "bg-emerald-500",

        },

        warning: {

            container:
                "border-amber-100 bg-amber-50/40",

            icon:
                "bg-amber-100 text-amber-700",

            bullet:
                "bg-amber-500",

        },

        recommendation: {

            container:
                "border-indigo-100 bg-indigo-50/40",

            icon:
                "bg-indigo-100 text-indigo-700",

            bullet:
                "bg-indigo-500",

        },

    }[variant];


    return (

        <div
            className={`
                rounded-xl
                border
                p-5
                ${styles.container}
            `}
        >

            {/* Column Header */}

            <div
                className="
                    flex
                    items-start
                    gap-3
                "
            >

                <div
                    className={`
                        flex
                        h-9
                        w-9
                        shrink-0
                        items-center
                        justify-center
                        rounded-lg
                        ${styles.icon}
                    `}
                >

                    <Icon size={18} />

                </div>


                <div>

                    <h3
                        className="
                            text-sm
                            font-bold
                            text-slate-900
                        "
                    >
                        {title}
                    </h3>

                    <p
                        className="
                            mt-1
                            text-xs
                            leading-5
                            text-slate-500
                        "
                    >
                        {description}
                    </p>

                </div>

            </div>


            {/* Items */}

            <div
                className="
                    mt-5
                    space-y-4
                "
            >

                {items.length === 0 ? (

                    <p
                        className="
                            text-sm
                            text-slate-400
                        "
                    >
                        Nothing identified for
                        this section.
                    </p>

                ) : (

                    items.map(
                        (
                            item,
                            index
                        ) => (

                            <div
                                key={
                                    `${item}-${index}`
                                }
                                className="
                                    flex
                                    items-start
                                    gap-3
                                "
                            >

                                <span
                                    className={`
                                        mt-2
                                        h-1.5
                                        w-1.5
                                        shrink-0
                                        rounded-full
                                        ${styles.bullet}
                                    `}
                                />


                                <p
                                    className="
                                        text-sm
                                        leading-6
                                        text-slate-700
                                    "
                                >
                                    {item}
                                </p>

                            </div>

                        )
                    )

                )}

            </div>

        </div>

    );

}
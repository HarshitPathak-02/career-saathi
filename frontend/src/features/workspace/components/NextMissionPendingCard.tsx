import {
    BarChart3,
    CalendarClock,
    CheckCircle2,
    RefreshCw,
    Sparkles,
    Target,
} from "lucide-react";

interface NextMissionPendingCardProps {

    nextMissionAvailableAt:
    string | null;

}

const NextMissionPendingCard = ({
    nextMissionAvailableAt,
}: NextMissionPendingCardProps) => {

    const formattedDate =
        nextMissionAvailableAt
            ? new Date(
                nextMissionAvailableAt
            ).toLocaleDateString(
                undefined,
                {
                    weekday: "long",
                    month: "long",
                    day: "numeric",
                }
            )
            : null;

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

            {/* Completion Header */}

            <div
                className="
                    relative
                    overflow-hidden
                    px-5
                    py-8
                    text-center
                    sm:px-7
                    sm:py-10
                    lg:px-8
                "
            >

                {/* Background Accent */}

                <div
                    className="
                        pointer-events-none
                        absolute
                        left-1/2
                        top-0
                        h-56
                        w-56
                        -translate-x-1/2
                        -translate-y-1/2
                        rounded-full
                        bg-emerald-50
                        blur-3xl
                    "
                />

                <div className="relative">

                    <div
                        className="
                            mx-auto
                            flex
                            h-16
                            w-16
                            items-center
                            justify-center
                            rounded-2xl
                            bg-emerald-50
                            text-emerald-600
                        "
                    >

                        <CheckCircle2 size={30} />

                    </div>

                    <p
                        className="
                            mt-5
                            text-xs
                            font-semibold
                            uppercase
                            tracking-[0.14em]
                            text-emerald-600
                        "
                    >

                        Weekly Mission Complete

                    </p>

                    <h2
                        className="
                            mt-2
                            text-2xl
                            font-bold
                            tracking-tight
                            text-slate-900
                            sm:text-3xl
                        "
                    >

                        You've completed this week's journey

                    </h2>

                    <p
                        className="
                            mx-auto
                            mt-3
                            max-w-2xl
                            text-sm
                            leading-6
                            text-slate-600
                            sm:text-base
                            sm:leading-7
                        "
                    >

                        Your mission, weekly assessment, and
                        reflection are complete. CareerSaathi
                        will use this week's performance to
                        determine what should be prioritized
                        in your next mission.

                    </p>

                </div>

            </div>

            {/* Weekly Completion Summary */}

            <div
                className="
                    border-y
                    border-slate-200
                    bg-slate-50/60
                    px-5
                    py-5
                    sm:px-7
                    lg:px-8
                "
            >

                <div
                    className="
                        grid
                        gap-3
                        md:grid-cols-3
                    "
                >

                    <CompletionItem
                        icon={Target}
                        title="Mission Completed"
                        description="Your planned learning work for this week is complete."
                    />

                    <CompletionItem
                        icon={BarChart3}
                        title="Progress Reviewed"
                        description="Your performance and weekly assessment have been recorded."
                    />

                    <CompletionItem
                        icon={RefreshCw}
                        title="Journey Adapting"
                        description="Your progress will influence what CareerSaathi prioritizes next."
                    />

                </div>

            </div>

            {/* Next Mission */}

            <div
                className="
                    px-5
                    py-7
                    sm:px-7
                    sm:py-8
                    lg:px-8
                "
            >

                <div
                    className="
                        mx-auto
                        max-w-2xl
                        rounded-2xl
                        border
                        border-blue-100
                        bg-blue-50/70
                        p-5
                        sm:p-6
                    "
                >

                    <div
                        className="
                            flex
                            flex-col
                            gap-4
                            sm:flex-row
                            sm:items-center
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
                                bg-white
                                text-blue-600
                                shadow-sm
                            "
                        >

                            <CalendarClock size={21} />

                        </div>

                        <div className="min-w-0">

                            <p
                                className="
                                    text-xs
                                    font-semibold
                                    uppercase
                                    tracking-[0.12em]
                                    text-blue-600
                                "
                            >

                                Next Mission

                            </p>

                            <h3
                                className="
                                    mt-1
                                    text-lg
                                    font-bold
                                    text-slate-900
                                "
                            >

                                Your next week starts
                                {formattedDate
                                    ? ` ${formattedDate}`
                                    : " tomorrow"}

                            </h3>

                            <p
                                className="
                                    mt-1.5
                                    text-sm
                                    leading-6
                                    text-slate-600
                                "
                            >

                                Your next personalized mission
                                will automatically become available
                                when the new mission period begins.

                            </p>

                        </div>

                    </div>

                </div>

                {/* Adaptation Note */}

                <div
                    className="
                        mx-auto
                        mt-5
                        flex
                        max-w-2xl
                        items-start
                        gap-3
                        rounded-xl
                        border
                        border-slate-200
                        bg-white
                        p-4
                    "
                >

                    <div
                        className="
                            flex
                            h-8
                            w-8
                            shrink-0
                            items-center
                            justify-center
                            rounded-lg
                            bg-blue-50
                            text-blue-600
                        "
                    >

                        <Sparkles size={16} />

                    </div>

                    <div>

                        <p
                            className="
                                text-sm
                                font-semibold
                                text-slate-900
                            "
                        >

                            Your journey keeps adapting

                        </p>

                        <p
                            className="
                                mt-1
                                text-sm
                                leading-6
                                text-slate-500
                            "
                        >

                            Your next mission will consider
                            your completed work, assessment
                            performance, revision needs, and
                            progress from this week.

                        </p>

                    </div>

                </div>

            </div>

        </section>

    );

};

interface CompletionItemProps {

    icon:
    React.ComponentType<{
        size?: number;
        className?: string;
    }>;

    title: string;

    description: string;

}

const CompletionItem = ({

    icon: Icon,

    title,

    description,

}: CompletionItemProps) => {

    return (

        <div
            className="
                rounded-xl
                border
                border-slate-200
                bg-white
                p-4
            "
        >

            <div
                className="
                    flex
                    h-9
                    w-9
                    items-center
                    justify-center
                    rounded-lg
                    bg-emerald-50
                    text-emerald-600
                "
            >

                <Icon size={18} />

            </div>

            <h3
                className="
                    mt-3
                    text-sm
                    font-semibold
                    text-slate-900
                "
            >

                {title}

            </h3>

            <p
                className="
                    mt-1.5
                    text-sm
                    leading-6
                    text-slate-500
                "
            >

                {description}

            </p>

        </div>

    );

};

export default NextMissionPendingCard;
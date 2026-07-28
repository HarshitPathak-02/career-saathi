import {
    CalendarCheck2,
    CheckCircle2,
    ListChecks,
    Route,
    Sparkles,
    Target,
} from "lucide-react";

const MissionGeneratingState = () => {
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
                    relative
                    overflow-hidden
                    px-6
                    py-10
                    text-center
                    sm:px-8
                    sm:py-12
                "
            >
                <div
                    className="
                        pointer-events-none
                        absolute
                        left-1/2
                        top-0
                        h-72
                        w-72
                        -translate-x-1/2
                        rounded-full
                        bg-blue-50
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
                            bg-blue-50
                            text-blue-600
                        "
                    >
                        <Sparkles
                            size={28}
                            className="animate-pulse"
                        />
                    </div>

                    <p
                        className="
                            mt-6
                            text-sm
                            font-semibold
                            text-blue-600
                        "
                    >
                        Preparing Your First Mission
                    </p>

                    <h2
                        className="
                            mx-auto
                            mt-2
                            max-w-xl
                            text-2xl
                            font-bold
                            tracking-tight
                            text-slate-900
                            sm:text-3xl
                        "
                    >
                        Turning your roadmap into
                        action
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
                        CareerSaathi is selecting the
                        right starting priorities and
                        converting your roadmap into a
                        focused weekly mission with
                        practical daily tasks.
                    </p>
                </div>
            </div>

            {/* Steps */}

            <div
                className="
                    border-t
                    border-slate-200
                    bg-slate-50/70
                    px-6
                    py-8
                    sm:px-8
                "
            >
                <div className="mx-auto max-w-2xl">

                    <MissionStep
                        icon={CheckCircle2}
                        title="Roadmap reviewed"
                        description="Your personalized learning path and priorities have been loaded."
                        state="completed"
                    />

                    <MissionStep
                        icon={CheckCircle2}
                        title="Starting priorities identified"
                        description="CareerSaathi has identified the best areas to begin your journey."
                        state="completed"
                    />

                    <MissionStep
                        icon={Target}
                        title="Planning your weekly focus"
                        description="The right amount of learning is being selected for your first mission."
                        state="active"
                    />

                    <MissionStep
                        icon={CalendarCheck2}
                        title="Balancing your workload"
                        description="Your mission is being adjusted around your daily study commitment."
                        state="pending"
                    />

                    <MissionStep
                        icon={ListChecks}
                        title="Creating your daily tasks"
                        description="Your weekly goals will be converted into focused actions for each day."
                        state="pending"
                        isLast
                    />

                    <div
                        className="
                            mt-6
                            rounded-xl
                            border
                            border-blue-100
                            bg-blue-50/60
                            p-4
                        "
                    >
                        <div className="flex items-start gap-3">
                            <Route
                                size={18}
                                className="
                                    mt-0.5
                                    shrink-0
                                    text-blue-600
                                "
                            />

                            <p
                                className="
                                    text-sm
                                    leading-6
                                    text-slate-600
                                "
                            >
                                Your mission is designed to
                                give you one clear focus at
                                a time. Once it is ready,
                                your workspace will show
                                exactly what you need to do
                                today.
                            </p>
                        </div>
                    </div>

                    <div className="mt-6 text-center">
                        <div
                            className="
                                mx-auto
                                h-1.5
                                w-32
                                overflow-hidden
                                rounded-full
                                bg-slate-200
                            "
                        >
                            <div
                                className="
                                    h-full
                                    w-1/2
                                    animate-pulse
                                    rounded-full
                                    bg-blue-600
                                "
                            />
                        </div>

                        <p
                            className="
                                mt-3
                                text-xs
                                text-slate-500
                            "
                        >
                            Preparing your mission and
                            daily tasks...
                        </p>
                    </div>

                </div>
            </div>
        </section>
    );
};

interface MissionStepProps {
    icon: React.ComponentType<{
        size?: number;
        className?: string;
    }>;

    title: string;

    description: string;

    state:
    | "completed"
    | "active"
    | "pending";

    isLast?: boolean;
}

const MissionStep = ({
    icon: Icon,
    title,
    description,
    state,
    isLast = false,
}: MissionStepProps) => {
    return (
        <div className="relative flex gap-4">

            <div
                className="
                    flex
                    w-10
                    shrink-0
                    flex-col
                    items-center
                "
            >
                <div
                    className={`
                        relative
                        z-10
                        flex
                        h-10
                        w-10
                        items-center
                        justify-center
                        rounded-xl
                        border

                        ${state === "completed"
                            ? `
                                    border-emerald-200
                                    bg-emerald-50
                                    text-emerald-600
                                `
                            : state === "active"
                                ? `
                                        border-blue-200
                                        bg-blue-50
                                        text-blue-600
                                    `
                                : `
                                        border-slate-200
                                        bg-white
                                        text-slate-400
                                    `
                        }
                    `}
                >
                    <Icon
                        size={19}
                        className={
                            state === "active"
                                ? "animate-pulse"
                                : ""
                        }
                    />
                </div>

                {!isLast && (
                    <div
                        className={`
                            min-h-8
                            w-px
                            flex-1

                            ${state === "completed"
                                ? "bg-emerald-200"
                                : "bg-slate-200"
                            }
                        `}
                    />
                )}
            </div>

            <div
                className={`
                    mb-4
                    min-w-0
                    flex-1
                    rounded-xl
                    border
                    p-4

                    ${state === "active"
                        ? `
                                border-blue-200
                                bg-blue-50/60
                            `
                        : `
                                border-slate-200
                                bg-white
                            `
                    }
                `}
            >
                <div
                    className="
                        flex
                        flex-wrap
                        items-center
                        gap-2
                    "
                >
                    <h3
                        className={`
                            text-sm
                            font-semibold

                            ${state === "pending"
                                ? "text-slate-500"
                                : "text-slate-900"
                            }
                        `}
                    >
                        {title}
                    </h3>

                    {state === "active" && (
                        <span
                            className="
                                rounded-full
                                bg-blue-100
                                px-2
                                py-0.5
                                text-[10px]
                                font-semibold
                                uppercase
                                tracking-wide
                                text-blue-700
                            "
                        >
                            In Progress
                        </span>
                    )}
                </div>

                <p
                    className={`
                        mt-1
                        text-sm
                        leading-6

                        ${state === "pending"
                            ? "text-slate-400"
                            : "text-slate-600"
                        }
                    `}
                >
                    {description}
                </p>
            </div>

        </div>
    );
};

export default MissionGeneratingState;
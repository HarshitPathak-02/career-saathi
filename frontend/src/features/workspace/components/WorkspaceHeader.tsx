import {
    BriefcaseBusiness,
    Building2,
    CalendarRange,
    Clock3,
    Menu,
    Target,
} from "lucide-react";

import type {
    WorkspaceCareerJourney,
    WorkspaceUser,
} from "../types/workspace.types";

interface WorkspaceHeaderProps {

    user: WorkspaceUser;

    careerJourney:
    WorkspaceCareerJourney;

    onOpenMenu: () => void;

}

const WorkspaceHeader = ({

    user,

    careerJourney,

    onOpenMenu,

}: WorkspaceHeaderProps) => {

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

            {/* Mobile Product Header */}

            <div
                className="
                    flex
                    items-center
                    justify-between
                    border-b
                    border-slate-200
                    px-4
                    py-3
                    sm:px-6
                    lg:hidden
                "
            >

                <div>

                    <p
                        className="
                            text-xs
                            font-semibold
                            uppercase
                            tracking-[0.12em]
                            text-blue-600
                        "
                    >
                        CareerSaathi
                    </p>

                    <p
                        className="
                            mt-0.5
                            text-sm
                            font-semibold
                            text-slate-900
                        "
                    >
                        Your Workspace
                    </p>

                </div>

                <button
                    type="button"
                    aria-label="Open navigation"
                    onClick={
                        onOpenMenu
                    }
                    className="
                        flex
                        h-10
                        w-10
                        items-center
                        justify-center
                        rounded-xl
                        border
                        border-slate-200
                        bg-white
                        text-slate-600
                        transition
                        hover:bg-slate-50
                    "
                >

                    <Menu size={21} />

                </button>

            </div>

            {/* Welcome */}

            <div
                className="
                    relative
                    overflow-hidden
                    px-5
                    py-6
                    sm:px-7
                    sm:py-8
                    lg:px-8
                "
            >

                <div
                    className="
                        pointer-events-none
                        absolute
                        -right-20
                        -top-24
                        h-64
                        w-64
                        rounded-full
                        bg-blue-50
                        blur-3xl
                    "
                />

                <div
                    className="
                        relative
                        max-w-3xl
                    "
                >

                    <p
                        className="
                            text-sm
                            font-semibold
                            text-blue-600
                        "
                    >
                        Your Career Workspace
                    </p>

                    <h1
                        className="
                            mt-2
                            text-2xl
                            font-bold
                            tracking-tight
                            text-slate-900
                            sm:text-3xl
                        "
                    >
                        Welcome back, {user.firstName}
                    </h1>

                    <p
                        className="
                            mt-3
                            max-w-2xl
                            text-sm
                            leading-6
                            text-slate-600
                            sm:text-base
                            sm:leading-7
                        "
                    >
                        Stay focused on your goal.
                        CareerSaathi will guide you
                        through the next most important
                        step in your journey.
                    </p>

                </div>

            </div>

            {/* Journey Context */}

            <div
                className="
                    border-t
                    border-slate-200
                    bg-slate-50/70
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
                        sm:grid-cols-2
                        xl:grid-cols-5
                    "
                >

                    <JourneyInfo

                        icon={
                            Target
                        }

                        label="Target Role"

                        value={
                            careerJourney
                                .targetRole
                        }

                    />

                    <JourneyInfo

                        icon={
                            BriefcaseBusiness
                        }

                        label="Domain"

                        value={
                            careerJourney
                                .targetDomain
                        }

                    />

                    <JourneyInfo

                        icon={
                            Building2
                        }

                        label="Target Company"

                        value={
                            careerJourney
                                .targetCompany ||
                            "Open to opportunities"
                        }

                    />

                    <JourneyInfo

                        icon={
                            CalendarRange
                        }

                        label="Target Timeline"

                        value={
                            `${careerJourney.targetDurationMonths} months`
                        }

                    />

                    <JourneyInfo

                        icon={
                            Clock3
                        }

                        label="Daily Commitment"

                        value={
                            `${careerJourney.dailyStudyHours} ${careerJourney.dailyStudyHours === 1
                                ? "hour"
                                : "hours"
                            }`
                        }

                    />

                </div>

            </div>

        </section>

    );

};

interface JourneyInfoProps {

    icon:
    React.ComponentType<{
        size?: number;
        className?: string;
    }>;

    label: string;

    value: string;

}

const JourneyInfo = ({
    icon: Icon,
    label,
    value,
}: JourneyInfoProps) => {
    return (
        <div
            className="
                flex
                min-w-0
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
                    h-9
                    w-9
                    shrink-0
                    items-center
                    justify-center
                    rounded-lg
                    bg-blue-50
                    text-blue-600
                "
            >
                <Icon size={18} />
            </div>

            <div className="min-w-0 flex-1">
                <p
                    className="
                        text-[11px]
                        font-semibold
                        uppercase
                        tracking-wide
                        text-slate-400
                    "
                >
                    {label}
                </p>

                <p
                    className="
                        mt-1
                        break-words
                        text-sm
                        font-semibold
                        leading-5
                        text-slate-800
                    "
                >
                    {value}
                </p>
            </div>
        </div>
    );
};
export default WorkspaceHeader;
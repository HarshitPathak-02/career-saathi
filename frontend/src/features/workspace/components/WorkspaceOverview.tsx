import {
    CheckCircle2,
    Flag,
    ListChecks,
    TrendingUp,
} from "lucide-react";

import type {
    WorkspaceOverview as WorkspaceOverviewType,
} from "../types/workspace.types";

interface WorkspaceOverviewProps {

    overview:
    WorkspaceOverviewType;

}

const WorkspaceOverview = ({

    overview,

}: WorkspaceOverviewProps) => {

    const hasMission =
        overview.currentMission > 0;

    return (

        <section>

            <div
                className="
                    mb-4
                    flex
                    items-end
                    justify-between
                    gap-4
                "
            >

                <div>

                    <p
                        className="
                            text-sm
                            font-semibold
                            text-slate-900
                        "
                    >
                        Journey Overview
                    </p>

                    <p
                        className="
                            mt-1
                            text-sm
                            text-slate-500
                        "
                    >
                        Your current learning progress
                        at a glance.
                    </p>

                </div>

            </div>

            <div
                className="
                    grid
                    grid-cols-2
                    gap-3
                    sm:gap-4
                    xl:grid-cols-4
                "
            >

                <OverviewCard

                    icon={Flag}

                    label="Current Mission"

                    value={
                        hasMission
                            ? `Mission ${overview.currentMission}`
                            : "Getting ready"
                    }

                    description={
                        hasMission
                            ? "Current learning cycle"
                            : "Complete setup to begin"
                    }

                />

                <OverviewCard

                    icon={TrendingUp}

                    label="Current Week"

                    value={
                        overview.currentWeek > 0
                            ? `Week ${overview.currentWeek}`
                            : "Not started"
                    }

                    description={
                        overview.currentWeek > 0
                            ? "Career journey progress"
                            : "Your journey begins soon"
                    }

                />

                <OverviewCard

                    icon={CheckCircle2}

                    label="Tasks Completed"

                    value={
                        overview.totalTasks > 0
                            ? `${overview.completedTasks}/${overview.totalTasks}`
                            : "—"
                    }

                    description={
                        overview.totalTasks > 0
                            ? "This mission"
                            : "No tasks assigned yet"
                    }

                />

                <OverviewCard

                    icon={ListChecks}

                    label="Mission Progress"

                    value={
                        overview.totalTasks > 0
                            ? `${overview.progressPercentage}%`
                            : "—"
                    }

                    description={
                        overview.totalTasks > 0
                            ? "Overall completion"
                            : "Starts with your mission"
                    }

                    progress={
                        overview.totalTasks > 0
                            ? overview
                                .progressPercentage
                            : undefined
                    }

                />

            </div>

        </section>

    );

};

interface OverviewCardProps {

    icon:
    React.ComponentType<{
        size?: number;
        className?: string;
    }>;

    label: string;

    value: string;

    description: string;

    progress?: number;

}

const OverviewCard = ({

    icon: Icon,

    label,

    value,

    description,

    progress,

}: OverviewCardProps) => {

    return (

        <div
            className="
                min-w-0
                rounded-2xl
                border
                border-slate-200
                bg-white
                p-4
                shadow-sm
                sm:p-5
            "
        >

            <div
                className="
                    flex
                    items-center
                    justify-between
                    gap-3
                "
            >

                <p
                    className="
                        truncate
                        text-xs
                        font-medium
                        text-slate-500
                        sm:text-sm
                    "
                >
                    {label}
                </p>

                <div
                    className="
                        hidden
                        h-9
                        w-9
                        shrink-0
                        items-center
                        justify-center
                        rounded-lg
                        bg-blue-50
                        text-blue-600
                        sm:flex
                    "
                >

                    <Icon size={18} />

                </div>

            </div>

            <p
                className="
                    mt-3
                    truncate
                    text-lg
                    font-bold
                    tracking-tight
                    text-slate-900
                    sm:text-xl
                "
            >
                {value}
            </p>

            <p
                className="
                    mt-1
                    hidden
                    truncate
                    text-xs
                    text-slate-400
                    sm:block
                "
            >
                {description}
            </p>

            {progress !== undefined && (

                <div
                    className="
                        mt-4
                        h-1.5
                        overflow-hidden
                        rounded-full
                        bg-slate-100
                    "
                >

                    <div
                        className="
                            h-full
                            rounded-full
                            bg-blue-600
                            transition-all
                            duration-500
                        "
                        style={{
                            width:
                                `${Math.min(
                                    progress,
                                    100
                                )}%`,
                        }}
                    />

                </div>

            )}

        </div>

    );

};

export default WorkspaceOverview;
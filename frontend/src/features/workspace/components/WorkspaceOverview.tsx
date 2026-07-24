import type {
    WorkspaceOverview as WorkspaceOverviewType,
} from "../types/workspace.types";

interface WorkspaceOverviewProps {
    overview: WorkspaceOverviewType;
}

const WorkspaceOverview = ({
    overview,
}: WorkspaceOverviewProps) => {
    return (
        <section
            className="
        grid
        gap-4
        sm:grid-cols-2
        lg:grid-cols-4
      "
        >
            <OverviewCard
                label="Current Mission"
                value={
                    overview.currentMission > 0
                        ? `Mission ${overview.currentMission}`
                        : "Not started"
                }
            />

            <OverviewCard
                label="Current Week"
                value={
                    overview.currentWeek > 0
                        ? `Week ${overview.currentWeek}`
                        : "Not started"
                }
            />

            <OverviewCard
                label="Tasks Completed"
                value={`${overview.completedTasks}/${overview.totalTasks}`}
            />

            <OverviewCard
                label="Progress"
                value={`${overview.progressPercentage}%`}
            />
        </section>
    );
};

interface OverviewCardProps {
    label: string;
    value: string;
}

const OverviewCard = ({
    label,
    value,
}: OverviewCardProps) => {
    return (
        <div
            className="
        rounded-xl
        border
        border-slate-200
        bg-white
        p-5
      "
        >
            <p className="text-sm text-slate-500">
                {label}
            </p>

            <p className="mt-2 text-xl font-semibold text-slate-900">
                {value}
            </p>
        </div>
    );
};

export default WorkspaceOverview;
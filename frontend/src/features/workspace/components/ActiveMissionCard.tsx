import {
    CheckCircle2,
    Circle,
    Clock3,
    ListChecks,
} from "lucide-react";

import type {
    WorkspaceActiveMission,
    WorkspaceDailyTask,
    WorkspaceOverview,
} from "../types/workspace.types";

import {
    DailyTaskStatus,
} from "../types/workspace.types";

interface ActiveMissionCardProps {
    overview: WorkspaceOverview;

    activeMission: WorkspaceActiveMission | null;

    tasks: WorkspaceDailyTask[];
}

const ActiveMissionCard = ({
    overview,
    activeMission,
    tasks,
}: ActiveMissionCardProps) => {

    if (!activeMission) {
        return null;
    }

    const sortedTasks = [...tasks].sort(
        (a, b) => a.dayNumber - b.dayNumber
    );

    return (
        <section className="rounded-xl border border-slate-200 bg-white p-8">

            {/* Mission Header */}

            <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">

                <div>
                    <div className="flex items-center gap-3">

                        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600">
                            <ListChecks size={24} />
                        </div>

                        <div>
                            <p className="text-sm font-medium text-indigo-600">
                                Current Mission
                            </p>

                            <h2 className="text-xl font-semibold text-slate-900">
                                Mission {activeMission.missionNumber}
                            </h2>
                        </div>

                    </div>

                    <p className="mt-4 text-sm text-slate-600">
                        Complete your daily targets and keep moving
                        through your career journey.
                    </p>
                </div>

                <div className="rounded-lg bg-slate-50 px-4 py-3">
                    <p className="text-xs text-slate-500">
                        Tasks Completed
                    </p>

                    <p className="mt-1 text-lg font-semibold text-slate-900">
                        {overview.completedTasks}
                        {" / "}
                        {overview.totalTasks}
                    </p>
                </div>

            </div>


            {/* Progress */}

            <div className="mt-7">

                <div className="mb-2 flex items-center justify-between text-sm">

                    <span className="text-slate-600">
                        Mission Progress
                    </span>

                    <span className="font-medium text-slate-900">
                        {overview.progressPercentage}%
                    </span>

                </div>

                <div className="h-2 overflow-hidden rounded-full bg-slate-200">

                    <div
                        className="h-full rounded-full bg-indigo-600 transition-all"
                        style={{
                            width: `${Math.min(
                                overview.progressPercentage,
                                100
                            )}%`,
                        }}
                    />

                </div>

            </div>


            {/* Daily Tasks */}

            <div className="mt-8">

                <div className="mb-4 flex items-center justify-between">

                    <div>
                        <h3 className="text-lg font-semibold text-slate-900">
                            Your Mission Plan
                        </h3>

                        <p className="mt-1 text-sm text-slate-500">
                            Follow your daily learning targets for this mission.
                        </p>
                    </div>

                </div>


                {/* Empty state */}

                {sortedTasks.length === 0 && (

                    <div className="rounded-lg border border-dashed border-slate-300 p-8 text-center">

                        <ListChecks
                            size={30}
                            className="mx-auto text-slate-400"
                        />

                        <p className="mt-3 font-medium text-slate-700">
                            No tasks found for this mission.
                        </p>

                        <p className="mt-1 text-sm text-slate-500">
                            Your mission is active, but no daily tasks
                            have been generated.
                        </p>

                    </div>

                )}


                {/* Task List */}

                {sortedTasks.length > 0 && (

                    <div className="space-y-4">

                        {sortedTasks.map((task) => {

                            const isCompleted =
                                task.status ===
                                DailyTaskStatus.COMPLETED;

                            const isSkipped =
                                task.status ===
                                DailyTaskStatus.SKIPPED;

                            return (
                                <article
                                    key={task.id}
                                    className={`
                                        rounded-xl
                                        border
                                        p-5
                                        transition

                                        ${isCompleted
                                            ? "border-green-200 bg-green-50/40"
                                            : isSkipped
                                                ? "border-slate-200 bg-slate-50"
                                                : "border-slate-200 bg-white hover:border-indigo-200"
                                        }
                                    `}
                                >

                                    <div className="flex items-start gap-4">

                                        {/* Status Icon */}

                                        <div className="mt-1 shrink-0">

                                            {isCompleted ? (
                                                <CheckCircle2
                                                    size={22}
                                                    className="text-green-600"
                                                />
                                            ) : (
                                                <Circle
                                                    size={22}
                                                    className={
                                                        isSkipped
                                                            ? "text-slate-400"
                                                            : "text-indigo-500"
                                                    }
                                                />
                                            )}

                                        </div>


                                        <div className="min-w-0 flex-1">

                                            {/* Day + Duration */}

                                            <div className="flex flex-wrap items-center gap-3">

                                                <span className="rounded-md bg-indigo-50 px-2.5 py-1 text-xs font-medium text-indigo-700">
                                                    Day {task.dayNumber}
                                                </span>

                                                <span className="flex items-center gap-1 text-xs text-slate-500">
                                                    <Clock3 size={14} />

                                                    {task.estimatedMinutes} min
                                                </span>

                                                <span className="text-xs font-medium text-slate-500">
                                                    {task.type}
                                                </span>

                                            </div>


                                            {/* Title */}

                                            <h4
                                                className={`
                                                    mt-3
                                                    font-semibold

                                                    ${isCompleted
                                                        ? "text-slate-600"
                                                        : "text-slate-900"
                                                    }
                                                `}
                                            >
                                                {task.title}
                                            </h4>


                                            {/* Description */}

                                            {task.description && (
                                                <p className="mt-1 text-sm leading-6 text-slate-600">
                                                    {task.description}
                                                </p>
                                            )}


                                            {/* Topics */}

                                            {task.topics.length > 0 && (

                                                <div className="mt-4 flex flex-wrap gap-2">

                                                    {task.topics.map(
                                                        (topic) => (
                                                            <span
                                                                key={topic}
                                                                className="rounded-full bg-slate-100 px-3 py-1 text-xs text-slate-600"
                                                            >
                                                                {topic}
                                                            </span>
                                                        )
                                                    )}

                                                </div>

                                            )}


                                            {/* Status */}

                                            <div className="mt-4">

                                                {isCompleted && (
                                                    <span className="text-xs font-medium text-green-700">
                                                        Completed
                                                    </span>
                                                )}

                                                {isSkipped && (
                                                    <span className="text-xs font-medium text-slate-500">
                                                        Skipped
                                                    </span>
                                                )}

                                                {!isCompleted &&
                                                    !isSkipped && (
                                                        <span className="text-xs font-medium text-indigo-600">
                                                            Pending
                                                        </span>
                                                    )}

                                            </div>

                                        </div>

                                    </div>

                                </article>
                            );
                        })}

                    </div>

                )}

            </div>

        </section>
    );
};

export default ActiveMissionCard;
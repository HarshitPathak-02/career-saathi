import {
    BookOpen,
    CheckCircle2,
    Clock3,
    Target,
    Trophy,
} from "lucide-react";

import type {
    WorkspaceActiveMission,
    WorkspaceDailyTask,
    WorkspaceOverview,
    WorkspaceToday,
} from "../types/workspace.types";

import {
    DailyTaskStatus,
} from "../types/workspace.types";
import { useCompleteDailyTaskMutation } from "../../mission/api/dailyTaskApi";

interface ActiveMissionCardProps {
    overview: WorkspaceOverview;

    activeMission: WorkspaceActiveMission | null;

    today: WorkspaceToday | null;

    todayTask: WorkspaceDailyTask | null;
}

const formatDuration = (
    minutes: number
) => {

    const hours = Math.floor(
        minutes / 60
    );

    const remainingMinutes =
        minutes % 60;

    if (hours === 0) {
        return `${remainingMinutes} min`;
    }

    if (remainingMinutes === 0) {
        return `${hours} hr${hours > 1 ? "s" : ""}`;
    }

    return `${hours} hr ${remainingMinutes} min`;

};

const ActiveMissionCard = ({
    overview,
    activeMission,
    today,
    todayTask,
}: ActiveMissionCardProps) => {

    if (!activeMission || !today) {
        return null;
    }

    const isCompleted =
        todayTask?.status ===
        DailyTaskStatus.COMPLETED;

    const [
        completeDailyTask,
        {
            isLoading: isCompleting,
        },
    ] = useCompleteDailyTaskMutation();

    const handleCompleteMission = async () => {

        if (!todayTask || isCompleted) {
            return;
        }

        try {

            await completeDailyTask(
                todayTask.id
            ).unwrap();

        } catch (error) {

            console.error(
                "Failed to complete daily task",
                error
            );

        }

    };

    return (

        <section className="rounded-2xl border border-slate-200 bg-white shadow-sm">

            {/* Header */}

            <div className="border-b border-slate-200 p-8">

                <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">

                    <div>

                        <div className="flex items-center gap-3">

                            <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-indigo-100 text-indigo-600">

                                <Target size={28} />

                            </div>

                            <div>

                                <p className="text-sm font-semibold uppercase tracking-wide text-indigo-600">
                                    Current Mission
                                </p>

                                <h2 className="mt-1 text-3xl font-bold text-slate-900">
                                    Mission {activeMission.missionNumber}
                                </h2>

                            </div>

                        </div>

                        <p className="mt-5 text-slate-600">
                            Stay consistent. Complete today's learning goal
                            and move one step closer to your target career.
                        </p>

                    </div>

                    <div className="rounded-xl bg-indigo-50 px-5 py-4">

                        <p className="text-xs uppercase tracking-wide text-indigo-600">
                            Today
                        </p>

                        <h3 className="mt-1 text-xl font-bold text-slate-900">
                            Day {today.dayNumber}
                        </h3>

                        <p className="mt-1 text-sm text-slate-600">
                            {today.remainingDays} day
                            {today.remainingDays !== 1 && "s"} remaining
                        </p>

                    </div>

                </div>

            </div>

            {/* Progress */}

            <div className="border-b border-slate-200 p-8">

                <div className="mb-3 flex items-center justify-between">

                    <div className="flex items-center gap-2">

                        <Trophy
                            size={18}
                            className="text-amber-500"
                        />

                        <span className="font-semibold text-slate-900">
                            Mission Progress
                        </span>

                    </div>

                    <span className="font-semibold text-indigo-600">
                        {overview.progressPercentage}%
                    </span>

                </div>

                <div className="h-3 overflow-hidden rounded-full bg-slate-200">

                    <div
                        className="h-full rounded-full bg-indigo-600 transition-all duration-500"
                        style={{
                            width: `${Math.min(
                                overview.progressPercentage,
                                100
                            )}%`,
                        }}
                    />

                </div>

                <p className="mt-3 text-sm text-slate-500">

                    {overview.completedTasks}
                    {" / "}
                    {overview.totalTasks}
                    {" days completed"}

                </p>

            </div>

            {/* Today's Mission */}

            <div className="p-8">

                {!todayTask ? (

                    <div className="rounded-xl border border-dashed border-slate-300 py-12 text-center">

                        <BookOpen
                            size={48}
                            className="mx-auto text-slate-400"
                        />

                        <h3 className="mt-4 text-lg font-semibold text-slate-900">
                            No task scheduled for today
                        </h3>

                        <p className="mt-2 text-slate-500">
                            Enjoy your day. Your next mission will
                            appear automatically.
                        </p>

                    </div>

                ) : (

                    <>

                        <div className="flex flex-wrap items-center justify-between gap-4">

                            <div>

                                <p className="text-sm font-semibold uppercase tracking-wide text-indigo-600">
                                    Today's Mission
                                </p>

                                <h3 className="mt-2 text-2xl font-bold text-slate-900">
                                    {todayTask.title}
                                </h3>

                            </div>

                            <div className="flex items-center gap-2 rounded-lg bg-slate-100 px-4 py-2">

                                <Clock3 size={18} />

                                <span className="text-sm font-medium">
                                    {formatDuration(
                                        todayTask.estimatedMinutes
                                    )}
                                </span>

                            </div>

                        </div>

                        {todayTask.description && (

                            <p className="mt-5 leading-7 text-slate-600">

                                {todayTask.description}

                            </p>

                        )}

                        <div className="mt-8">

                            <h4 className="mb-4 text-lg font-semibold text-slate-900">
                                Today's Learning Checklist
                            </h4>

                            <div className="space-y-3">

                                {todayTask.topics.map(
                                    (
                                        topic,
                                        index
                                    ) => (

                                        <div
                                            key={index}
                                            className="flex items-start gap-3 rounded-xl border border-slate-200 bg-slate-50 p-4"
                                        >

                                            <BookOpen
                                                size={18}
                                                className="mt-1 text-indigo-600"
                                            />

                                            <span className="leading-6 text-slate-700">
                                                {topic}
                                            </span>

                                        </div>

                                    )
                                )}

                            </div>

                        </div>

                        <div className="mt-10 flex flex-col gap-5 border-t border-slate-200 pt-6 md:flex-row md:items-center md:justify-between">

                            <div>

                                <p className="text-sm text-slate-500">
                                    Status
                                </p>

                                <p
                                    className={`mt-1 font-semibold ${isCompleted
                                        ? "text-green-600"
                                        : "text-amber-600"
                                        }`}
                                >
                                    {isCompleted
                                        ? "Completed"
                                        : "Pending"}
                                </p>

                            </div>

                            <button
                                onClick={handleCompleteMission}
                                disabled={
                                    isCompleted ||
                                    isCompleting
                                }
                                className={`
                                    inline-flex
                                    items-center
                                    justify-center
                                    gap-2
                                    rounded-xl
                                    px-6
                                    py-3
                                    font-semibold
                                    transition-all

                                    ${isCompleted || isCompleting
                                        ? "cursor-not-allowed bg-green-100 text-green-700"
                                        : "bg-indigo-600 text-white hover:bg-indigo-700"
                                    }
                                `}
                            >

                                <CheckCircle2 size={20} />

                                {isCompleting
                                    ? "Completing..."
                                    : isCompleted
                                        ? "Today's Mission Completed"
                                        : "Complete Today's Mission"}

                            </button>

                        </div>

                    </>

                )}

            </div>

        </section>

    );

};

export default ActiveMissionCard;
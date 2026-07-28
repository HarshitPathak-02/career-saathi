import {
    BookOpen,
    CheckCircle2,
    Clock3,
    Target,
    Trophy,
    ClipboardCheck,
    CalendarDays,
    CircleCheckBig,
    ListChecks,
} from "lucide-react";

import {
    useNavigate,
} from "react-router-dom";

import type {
    WorkspaceActiveMission,
    WorkspaceDailyTask,
    WorkspaceOverview,
    WorkspaceToday,
} from "../types/workspace.types";

import {
    DailyTaskStatus,
} from "../types/workspace.types";

import {
    useCompleteDailyTaskMutation,
} from "../../mission/api/dailyTaskApi";

interface ActiveMissionCardProps {

    overview: WorkspaceOverview;

    activeMission: WorkspaceActiveMission | null;

    today: WorkspaceToday | null;

    todayTask: WorkspaceDailyTask | null;

}

const formatDuration = (
    minutes: number
) => {

    const hours =
        Math.floor(
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

    const navigate =
        useNavigate();

    /*
    |--------------------------------------------------------------------------
    | Mutation
    |--------------------------------------------------------------------------
    */

    const [
        completeDailyTask,
        {
            isLoading: isCompleting,
        },
    ] =
        useCompleteDailyTaskMutation();

    /*
    |--------------------------------------------------------------------------
    | Empty Mission
    |--------------------------------------------------------------------------
    */

    if (
        !activeMission ||
        !today
    ) {

        return null;

    }

    /*
    |--------------------------------------------------------------------------
    | Task State
    |--------------------------------------------------------------------------
    */

    const isCompleted =
        todayTask?.status ===
        DailyTaskStatus.COMPLETED;

    const isWeeklyReviewDay =
        today.dayNumber === 7;

    /*
    |--------------------------------------------------------------------------
    | Complete Regular Daily Task
    |--------------------------------------------------------------------------
    */

    const handleCompleteTask =
        async () => {

            if (
                !todayTask ||
                isCompleted ||
                isWeeklyReviewDay
            ) {

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

    /*
    |--------------------------------------------------------------------------
    | Start Weekly Review
    |--------------------------------------------------------------------------
    */

    const handleStartWeeklyReview =
        () => {

            navigate(
                "/weekly-review"
            );

        };

    /*
    |--------------------------------------------------------------------------
    | UI
    |--------------------------------------------------------------------------
    */

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

            {/* Mission Header */}

            <div
                className="
                    relative
                    overflow-hidden
                    border-b
                    border-slate-200
                    px-5
                    py-6
                    sm:px-7
                    sm:py-7
                    lg:px-8
                "
            >

                <div
                    className="
                        pointer-events-none
                        absolute
                        -right-16
                        -top-20
                        h-52
                        w-52
                        rounded-full
                        bg-blue-50
                        blur-3xl
                    "
                />

                <div
                    className="
                        relative
                        flex
                        flex-col
                        gap-6
                        lg:flex-row
                        lg:items-center
                        lg:justify-between
                    "
                >

                    <div className="min-w-0">

                        <div className="flex items-center gap-4">

                            <div
                                className="
                                    flex
                                    h-12
                                    w-12
                                    shrink-0
                                    items-center
                                    justify-center
                                    rounded-xl
                                    bg-blue-50
                                    text-blue-600
                                    sm:h-14
                                    sm:w-14
                                "
                            >

                                <Target size={26} />

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

                                    Current Mission

                                </p>

                                <h2
                                    className="
                                        mt-1
                                        text-2xl
                                        font-bold
                                        tracking-tight
                                        text-slate-900
                                        sm:text-3xl
                                    "
                                >

                                    Mission {activeMission.missionNumber}

                                </h2>

                            </div>

                        </div>

                        <p
                            className="
                                mt-4
                                max-w-2xl
                                text-sm
                                leading-6
                                text-slate-600
                                sm:text-base
                                sm:leading-7
                            "
                        >

                            {isWeeklyReviewDay
                                ? "You've reached the final day of this mission. Review your week, complete your assessment, and reflect on your progress."
                                : "Stay focused on today's objective. Every completed day moves you one step closer to your target career."
                            }

                        </p>

                    </div>

                    {/* Day Information */}

                    <div
                        className="
                            flex
                            shrink-0
                            items-center
                            gap-4
                            rounded-xl
                            border
                            border-blue-100
                            bg-blue-50/70
                            px-4
                            py-3.5
                            sm:px-5
                        "
                    >

                        <div
                            className="
                                flex
                                h-10
                                w-10
                                shrink-0
                                items-center
                                justify-center
                                rounded-lg
                                bg-white
                                text-blue-600
                                shadow-sm
                            "
                        >

                            <CalendarDays size={20} />

                        </div>

                        <div>

                            <p
                                className="
                                    text-[11px]
                                    font-semibold
                                    uppercase
                                    tracking-wide
                                    text-blue-600
                                "
                            >

                                Today

                            </p>

                            <p
                                className="
                                    mt-0.5
                                    font-bold
                                    text-slate-900
                                "
                            >

                                Day {today.dayNumber}

                            </p>

                            <p
                                className="
                                    mt-0.5
                                    text-xs
                                    text-slate-500
                                "
                            >

                                {today.remainingDays} day
                                {today.remainingDays !== 1 && "s"} remaining

                            </p>

                        </div>

                    </div>

                </div>

            </div>

            {/* Mission Progress */}

            <div
                className="
                    border-b
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
                        flex
                        items-center
                        justify-between
                        gap-4
                    "
                >

                    <div className="flex items-center gap-2.5">

                        <Trophy
                            size={18}
                            className="text-amber-500"
                        />

                        <span
                            className="
                                text-sm
                                font-semibold
                                text-slate-800
                            "
                        >

                            Mission Progress

                        </span>

                    </div>

                    <span
                        className="
                            text-sm
                            font-bold
                            text-blue-600
                        "
                    >

                        {overview.progressPercentage}%

                    </span>

                </div>

                <div
                    className="
                        mt-3
                        h-2.5
                        overflow-hidden
                        rounded-full
                        bg-slate-200
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
                            width: `${Math.min(
                                overview.progressPercentage,
                                100
                            )}%`,
                        }}
                    />

                </div>

                <div
                    className="
                        mt-3
                        flex
                        flex-wrap
                        items-center
                        justify-between
                        gap-2
                        text-xs
                        text-slate-500
                        sm:text-sm
                    "
                >

                    <span>

                        {overview.completedTasks}
                        {" of "}
                        {overview.totalTasks}
                        {" days completed"}

                    </span>

                    <span>

                        Keep building consistency

                    </span>

                </div>

            </div>

            {/* Today's Mission */}

            <div
                className="
                    px-5
                    py-6
                    sm:px-7
                    sm:py-7
                    lg:px-8
                    lg:py-8
                "
            >

                {!todayTask ? (

                    <div
                        className="
                            rounded-2xl
                            border
                            border-dashed
                            border-slate-300
                            bg-slate-50/50
                            px-5
                            py-12
                            text-center
                        "
                    >

                        <div
                            className="
                                mx-auto
                                flex
                                h-14
                                w-14
                                items-center
                                justify-center
                                rounded-xl
                                bg-white
                                text-slate-400
                                shadow-sm
                            "
                        >

                            <BookOpen size={27} />

                        </div>

                        <h3
                            className="
                                mt-5
                                text-lg
                                font-semibold
                                text-slate-900
                            "
                        >

                            No task scheduled for today

                        </h3>

                        <p
                            className="
                                mx-auto
                                mt-2
                                max-w-md
                                text-sm
                                leading-6
                                text-slate-500
                            "
                        >

                            You're all caught up for today.
                            Your next learning objective will
                            appear automatically when it becomes
                            available.

                        </p>

                    </div>

                ) : (

                    <>

                        {/* Task Heading */}

                        <div
                            className="
                                flex
                                flex-col
                                gap-4
                                sm:flex-row
                                sm:items-start
                                sm:justify-between
                            "
                        >

                            <div className="min-w-0">

                                <div className="flex items-center gap-2">

                                    {isWeeklyReviewDay ? (

                                        <ClipboardCheck
                                            size={17}
                                            className="text-blue-600"
                                        />

                                    ) : (

                                        <BookOpen
                                            size={17}
                                            className="text-blue-600"
                                        />

                                    )}

                                    <p
                                        className="
                                            text-xs
                                            font-semibold
                                            uppercase
                                            tracking-[0.12em]
                                            text-blue-600
                                        "
                                    >

                                        {isWeeklyReviewDay
                                            ? "Weekly Review"
                                            : "Today's Mission"
                                        }

                                    </p>

                                </div>

                                <h3
                                    className="
                                        mt-2
                                        text-xl
                                        font-bold
                                        leading-tight
                                        text-slate-900
                                        sm:text-2xl
                                    "
                                >

                                    {todayTask.title}

                                </h3>

                            </div>

                            <div
                                className="
                                    inline-flex
                                    w-fit
                                    shrink-0
                                    items-center
                                    gap-2
                                    rounded-lg
                                    border
                                    border-slate-200
                                    bg-slate-50
                                    px-3.5
                                    py-2
                                    text-sm
                                    font-medium
                                    text-slate-600
                                "
                            >

                                <Clock3 size={17} />

                                {formatDuration(
                                    todayTask.estimatedMinutes
                                )}

                            </div>

                        </div>

                        {/* Description */}

                        {todayTask.description && (

                            <div
                                className="
                                    mt-5
                                    rounded-xl
                                    border
                                    border-slate-200
                                    bg-slate-50/70
                                    p-4
                                    sm:p-5
                                "
                            >

                                <p
                                    className="
                                        text-sm
                                        leading-6
                                        text-slate-600
                                        sm:text-base
                                        sm:leading-7
                                    "
                                >

                                    {todayTask.description}

                                </p>

                            </div>

                        )}

                        {/* Checklist */}

                        <div className="mt-7">

                            <div className="flex items-center gap-2.5">

                                <ListChecks
                                    size={19}
                                    className="text-slate-500"
                                />

                                <h4
                                    className="
                                        font-semibold
                                        text-slate-900
                                    "
                                >

                                    {isWeeklyReviewDay
                                        ? "Weekly Review Checklist"
                                        : "Today's Learning Checklist"
                                    }

                                </h4>

                            </div>

                            <div
                                className="
                                    mt-4
                                    grid
                                    gap-3
                                    lg:grid-cols-2
                                "
                            >

                                {todayTask.topics.map(
                                    (
                                        topic,
                                        index
                                    ) => (

                                        <div
                                            key={index}
                                            className="
                                                flex
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
                                                    mt-0.5
                                                    flex
                                                    h-7
                                                    w-7
                                                    shrink-0
                                                    items-center
                                                    justify-center
                                                    rounded-lg
                                                    bg-blue-50
                                                    text-blue-600
                                                "
                                            >

                                                <BookOpen size={14} />

                                            </div>

                                            <span
                                                className="
                                                    text-sm
                                                    leading-6
                                                    text-slate-700
                                                "
                                            >

                                                {topic}

                                            </span>

                                        </div>

                                    )
                                )}

                            </div>

                        </div>

                        {/* Footer */}

                        <div
                            className="
                                mt-8
                                flex
                                flex-col
                                gap-5
                                border-t
                                border-slate-200
                                pt-6
                                sm:flex-row
                                sm:items-center
                                sm:justify-between
                            "
                        >

                            {/* Status */}

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

                                    Today's Status

                                </p>

                                <div
                                    className={`
                                        mt-1.5
                                        flex
                                        items-center
                                        gap-2
                                        text-sm
                                        font-semibold

                                        ${isCompleted
                                            ? "text-emerald-600"
                                            : "text-amber-600"
                                        }
                                    `}
                                >

                                    {isCompleted ? (

                                        <CircleCheckBig size={17} />

                                    ) : (

                                        <Clock3 size={17} />

                                    )}

                                    {isCompleted
                                        ? "Completed"
                                        : "Pending"
                                    }

                                </div>

                            </div>

                            {/* Day 7 */}

                            {isWeeklyReviewDay &&
                                !isCompleted ? (

                                <button
                                    type="button"
                                    onClick={
                                        handleStartWeeklyReview
                                    }
                                    className="
                                        inline-flex
                                        w-full
                                        items-center
                                        justify-center
                                        gap-2
                                        rounded-xl
                                        bg-blue-600
                                        px-6
                                        py-3
                                        text-sm
                                        font-semibold
                                        text-white
                                        shadow-sm
                                        transition
                                        hover:bg-blue-700
                                        focus:outline-none
                                        focus:ring-2
                                        focus:ring-blue-500
                                        focus:ring-offset-2
                                        sm:w-auto
                                    "
                                >

                                    <ClipboardCheck size={19} />

                                    Start Weekly Review

                                </button>

                            ) : (

                                /* Regular Day */

                                <button
                                    type="button"
                                    onClick={
                                        handleCompleteTask
                                    }
                                    disabled={
                                        isCompleted ||
                                        isCompleting
                                    }
                                    className={`
                                        inline-flex
                                        w-full
                                        items-center
                                        justify-center
                                        gap-2
                                        rounded-xl
                                        px-6
                                        py-3
                                        text-sm
                                        font-semibold
                                        shadow-sm
                                        transition
                                        focus:outline-none
                                        focus:ring-2
                                        focus:ring-offset-2
                                        sm:w-auto

                                        ${isCompleted
                                            ? "cursor-default bg-emerald-50 text-emerald-700 shadow-none"
                                            : isCompleting
                                                ? "cursor-not-allowed bg-blue-400 text-white"
                                                : "bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500"
                                        }
                                    `}
                                >

                                    <CheckCircle2 size={19} />

                                    {isCompleting
                                        ? "Completing..."
                                        : isCompleted
                                            ? "Today's Mission Completed"
                                            : "Complete Today's Mission"
                                    }

                                </button>

                            )}

                        </div>

                    </>

                )}

            </div>

        </section>

    );

};

export default ActiveMissionCard;
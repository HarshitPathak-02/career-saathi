import {
    ArrowLeft,
    AlertCircle,
    RefreshCw,
} from "lucide-react";

import {
    useNavigate,
    useParams,
} from "react-router-dom";

import {
    useState,
} from "react";

import MissionHeader from "../components/MissionHeader";
import DailyTaskCard from "../components/DailyTaskCard";
import DailyTaskDrawer from "../components/DailyTaskDrawer";

import {
    useGetMissionQuery,
} from "../api/missionApi";

import {
    useCompleteDailyTaskMutation,
    useGetMissionDailyTasksQuery,
} from "../api/dailyTaskApi";

import type {
    DailyTask,
} from "../types/daily-task.types";

const MissionDetailsPage = () => {

    const navigate =
        useNavigate();

    const {
        missionId,
    } = useParams();

    /*
    |----------------------------------------------------------------------
    | State
    |----------------------------------------------------------------------
    */

    const [
        selectedTask,
        setSelectedTask,
    ] =
        useState<DailyTask | null>(
            null
        );

    /*
    |----------------------------------------------------------------------
    | Queries
    |----------------------------------------------------------------------
    */

    const {
        data: mission,
        isLoading: missionLoading,
        isError: missionError,
        refetch: refetchMission,
    } =
        useGetMissionQuery(
            missionId ?? "",
            {
                skip: !missionId,
            }
        );

    const {
        data: dailyTasks,
        isLoading: taskLoading,
        isError: taskError,
        refetch: refetchTasks,
    } =
        useGetMissionDailyTasksQuery(
            missionId ?? "",
            {
                skip: !missionId,
            }
        );

    /*
    |----------------------------------------------------------------------
    | Mutation
    |----------------------------------------------------------------------
    */

    const [
        completeTask,
        {
            isLoading: isCompletingTask,
        },
    ] =
        useCompleteDailyTaskMutation();

    /*
    |----------------------------------------------------------------------
    | Invalid Mission
    |----------------------------------------------------------------------
    */

    if (!missionId) {

        return (
            <div
                className="
                    flex
                    min-h-screen
                    items-center
                    justify-center
                    bg-slate-50
                    px-4
                "
            >
                <div
                    className="
                        max-w-md
                        rounded-2xl
                        border
                        border-slate-200
                        bg-white
                        p-8
                        text-center
                        shadow-sm
                    "
                >
                    <AlertCircle
                        size={24}
                        className="mx-auto text-red-500"
                    />

                    <h2 className="mt-4 text-xl font-bold text-slate-900">
                        Invalid mission
                    </h2>

                    <p className="mt-2 text-sm text-slate-600">
                        We couldn't identify the mission
                        you're trying to view.
                    </p>

                    <button
                        type="button"
                        onClick={() =>
                            navigate("/missions")
                        }
                        className="
                            mt-6
                            rounded-xl
                            bg-blue-600
                            px-5
                            py-2.5
                            text-sm
                            font-semibold
                            text-white
                            hover:bg-blue-700
                        "
                    >
                        View Missions
                    </button>
                </div>
            </div>
        );
    }

    /*
    |----------------------------------------------------------------------
    | Sorted Tasks
    |----------------------------------------------------------------------
    */

    const sortedDailyTasks =
        dailyTasks
            ?.slice()
            .sort(
                (a, b) =>
                    a.dayNumber -
                    b.dayNumber
            ) ?? [];

    /*
    |----------------------------------------------------------------------
    | Complete Task
    |----------------------------------------------------------------------
    */

    const handleCompleteTask =
        async (
            taskId: string
        ) => {

            try {

                await completeTask(
                    taskId
                ).unwrap();

                setSelectedTask(
                    null
                );

            } catch (error) {

                console.error(
                    "Failed to complete daily task:",
                    error
                );

            }

        };

    /*
    |----------------------------------------------------------------------
    | Weekly Review
    |----------------------------------------------------------------------
    */

    const handleStartWeeklyReview =
        () => {

            setSelectedTask(
                null
            );

            navigate(
                "/weekly-review"
            );

        };

    /*
    |----------------------------------------------------------------------
    | Loading
    |----------------------------------------------------------------------
    */

    if (
        missionLoading ||
        taskLoading
    ) {

        return (
            <MissionDetailsLoading />
        );

    }

    /*
    |----------------------------------------------------------------------
    | Error
    |----------------------------------------------------------------------
    */

    if (
        missionError ||
        taskError ||
        !mission
    ) {

        return (
            <div className="min-h-screen bg-slate-50 px-4 py-10 sm:px-6">

                <div
                    className="
                        mx-auto
                        max-w-4xl
                        rounded-2xl
                        border
                        border-slate-200
                        bg-white
                        p-8
                        text-center
                        shadow-sm
                    "
                >
                    <div
                        className="
                            mx-auto
                            flex
                            h-12
                            w-12
                            items-center
                            justify-center
                            rounded-xl
                            bg-red-50
                            text-red-600
                        "
                    >
                        <AlertCircle size={23} />
                    </div>

                    <h2 className="mt-5 text-xl font-bold text-slate-900">
                        Unable to load this mission
                    </h2>

                    <p className="mt-2 text-sm text-slate-600">
                        We couldn't retrieve the mission
                        and its daily tasks.
                    </p>

                    <button
                        type="button"
                        onClick={() => {
                            refetchMission();
                            refetchTasks();
                        }}
                        className="
                            mt-6
                            inline-flex
                            items-center
                            gap-2
                            rounded-xl
                            bg-blue-600
                            px-5
                            py-2.5
                            text-sm
                            font-semibold
                            text-white
                            hover:bg-blue-700
                        "
                    >
                        <RefreshCw size={17} />

                        Try Again
                    </button>
                </div>

            </div>
        );

    }

    /*
    |----------------------------------------------------------------------
    | UI
    |----------------------------------------------------------------------
    */

    return (
        <div className="min-h-screen bg-slate-50">

            <div
                className="
                    mx-auto
                    max-w-6xl
                    px-4
                    py-8
                    sm:px-6
                    sm:py-10
                    lg:px-8
                "
            >

                <div className="mt-6">

                    <MissionHeader
                        mission={mission}
                    />

                </div>

                {/* Daily Plan */}

                <section className="mt-8">

                    <div
                        className="
                            flex
                            flex-col
                            gap-2
                            sm:flex-row
                            sm:items-end
                            sm:justify-between
                        "
                    >

                        <div>

                            <p
                                className="
                                    text-sm
                                    font-semibold
                                    text-blue-600
                                "
                            >
                                Your Weekly Plan
                            </p>

                            <h2
                                className="
                                    mt-1
                                    text-xl
                                    font-bold
                                    text-slate-900
                                    sm:text-2xl
                                "
                            >
                                Daily Tasks
                            </h2>

                            <p
                                className="
                                    mt-1
                                    text-sm
                                    text-slate-500
                                "
                            >
                                Complete each day's focused
                                learning target and finish
                                the week with your review.
                            </p>

                        </div>

                    </div>

                    <div
                        className="
                            mt-5
                            grid
                            gap-4
                            lg:grid-cols-2
                        "
                    >

                        {sortedDailyTasks.map(
                            (task) => (

                                <DailyTaskCard
                                    key={
                                        task.taskId
                                    }
                                    task={task}
                                    onClick={() =>
                                        setSelectedTask(
                                            task
                                        )
                                    }
                                />

                            )
                        )}

                    </div>

                </section>

            </div>

            <DailyTaskDrawer
                task={
                    selectedTask
                }
                currentMissionDay={
                    mission.currentMissionDay
                }
                open={
                    selectedTask !== null
                }
                onClose={() =>
                    setSelectedTask(
                        null
                    )
                }
                onComplete={
                    handleCompleteTask
                }
                onStartWeeklyReview={
                    handleStartWeeklyReview
                }
                isCompleting={
                    isCompletingTask
                }
            />

        </div>
    );
};

const MissionDetailsLoading = () => {

    return (
        <div className="min-h-screen bg-slate-50">

            <div
                className="
                    mx-auto
                    max-w-6xl
                    px-4
                    py-8
                    sm:px-6
                    sm:py-10
                    lg:px-8
                "
            >

                <div className="h-5 w-36 animate-pulse rounded bg-slate-200" />

                <div
                    className="
                        mt-6
                        h-64
                        animate-pulse
                        rounded-2xl
                        border
                        border-slate-200
                        bg-white
                    "
                />

                <div className="mt-8 h-7 w-44 animate-pulse rounded bg-slate-200" />

                <div
                    className="
                        mt-5
                        grid
                        gap-4
                        lg:grid-cols-2
                    "
                >
                    {[1, 2, 3, 4].map(
                        (item) => (
                            <div
                                key={item}
                                className="
                                    h-44
                                    animate-pulse
                                    rounded-2xl
                                    border
                                    border-slate-200
                                    bg-white
                                "
                            />
                        )
                    )}
                </div>

            </div>

        </div>
    );
};

export default MissionDetailsPage;
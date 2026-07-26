import {
    ArrowLeft,
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

export default function MissionDetailsPage() {

    const navigate =
        useNavigate();

    const {
        missionId,
    } = useParams();

    /*
    |--------------------------------------------------------------------------
    | State
    |--------------------------------------------------------------------------
    */

    const [
        selectedTask,
        setSelectedTask,
    ] =
        useState<DailyTask | null>(
            null
        );

    /*
    |--------------------------------------------------------------------------
    | Mutations
    |--------------------------------------------------------------------------
    */

    const [
        completeTask,
    ] =
        useCompleteDailyTaskMutation();

    /*
    |--------------------------------------------------------------------------
    | Invalid Mission
    |--------------------------------------------------------------------------
    */

    if (!missionId) {

        return (

            <div className="p-6">

                Invalid mission.

            </div>

        );

    }

    /*
    |--------------------------------------------------------------------------
    | Queries
    |--------------------------------------------------------------------------
    */

    const {

        data: mission,

        isLoading: missionLoading,

        isError: missionError,

    } =
        useGetMissionQuery(
            missionId
        );

    const {

        data: dailyTasks,

        isLoading: taskLoading,

        isError: taskError,

    } =
        useGetMissionDailyTasksQuery(
            missionId
        );

    /*
    |--------------------------------------------------------------------------
    | Sorted Tasks
    |--------------------------------------------------------------------------
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
    |--------------------------------------------------------------------------
    | Complete Regular Daily Task
    |--------------------------------------------------------------------------
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
    |--------------------------------------------------------------------------
    | Start Weekly Review
    |--------------------------------------------------------------------------
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
    |--------------------------------------------------------------------------
    | Loading
    |--------------------------------------------------------------------------
    */

    if (
        missionLoading ||
        taskLoading
    ) {

        return (

            <div className="p-6">

                Loading...

            </div>

        );

    }

    /*
    |--------------------------------------------------------------------------
    | Error
    |--------------------------------------------------------------------------
    */

    if (
        missionError ||
        taskError ||
        !mission
    ) {

        return (

            <div className="p-6">

                Something went wrong.

            </div>

        );

    }

    /*
    |--------------------------------------------------------------------------
    | UI
    |--------------------------------------------------------------------------
    */

    return (

        <div className="space-y-6 p-6">

            {/* Back */}

            <button
                type="button"
                onClick={() =>
                    navigate(-1)
                }
                className="
                    flex
                    items-center
                    gap-2
                    text-sm
                    font-medium
                    text-slate-600
                    hover:text-slate-900
                "
            >

                <ArrowLeft
                    size={18}
                />

                Back

            </button>

            {/* Mission Header */}

            <MissionHeader
                mission={mission}
            />

            {/* Daily Tasks */}

            <div>

                <h2 className="mb-4 text-xl font-semibold">

                    Daily Tasks

                </h2>

                <div className="space-y-4">

                    {sortedDailyTasks.map(
                        (task) => (

                            <DailyTaskCard
                                key={
                                    task.taskId
                                }
                                task={
                                    task
                                }
                                onClick={() =>
                                    setSelectedTask(
                                        task
                                    )
                                }
                            />

                        )
                    )}

                </div>

            </div>

            {/* Daily Task Drawer */}

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

            />

        </div>

    );

}
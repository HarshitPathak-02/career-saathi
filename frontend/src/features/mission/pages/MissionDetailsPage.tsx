import {
    ArrowLeft,
} from "lucide-react";

import {
    useNavigate,
    useParams,
} from "react-router-dom";

import MissionHeader from "../components/MissionHeader";
import DailyTaskCard from "../components/DailyTaskCard";

import {
    useGetMissionQuery,
} from "../api/missionApi";

import {
    useCompleteDailyTaskMutation,
    useGetMissionDailyTasksQuery,
} from "../api/dailyTaskApi";
import type { DailyTask } from "../types/daily-task.types";
import { useState } from "react";
import DailyTaskDrawer from "../components/DailyTaskDrawer";

export default function MissionDetailsPage() {

    const navigate =
        useNavigate();

    const {
        missionId,
    } = useParams();

    if (!missionId) {

        return (

            <div className="p-6">

                Invalid mission.

            </div>

        );

    }

    const [selectedTask, setSelectedTask] =
        useState<DailyTask | null>(null);

    const [completeTask] =
        useCompleteDailyTaskMutation();

    /*
    |--------------------------------------------------------------------------
    | Queries
    |--------------------------------------------------------------------------
    */

    const {

        data: mission,

        isLoading: missionLoading,

        isError: missionError,

    } = useGetMissionQuery(
        missionId
    );

    const {

        data: dailyTasks,

        isLoading: taskLoading,

        isError: taskError,

    } = useGetMissionDailyTasksQuery(
        missionId
    );

    const sortedDailyTasks =
        dailyTasks
            ?.slice()
            .sort(
                (a, b) =>
                    a.dayNumber -
                    b.dayNumber,
            ) ?? [];

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

            <button
                onClick={() => navigate(-1)}
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

                <ArrowLeft size={18} />

                Back

            </button>

            <MissionHeader
                mission={mission}
            />

            <div>

                <h2 className="mb-4 text-xl font-semibold">

                    Daily Tasks

                </h2>

                <div className="space-y-4">

                    {sortedDailyTasks.map((task) => (

                        <DailyTaskCard
                            key={task.taskId}
                            task={task}
                            onClick={() => setSelectedTask(task)}
                        />

                    ))}

                </div>

            </div>

            <DailyTaskDrawer
                task={selectedTask}
                currentMissionDay={mission.currentMissionDay}
                open={selectedTask !== null}
                onClose={() => setSelectedTask(null)}
                onComplete={async (taskId) => {

                    try {

                        await completeTask(taskId).unwrap();

                        setSelectedTask(null);

                    } catch (error) {

                        console.error(error);

                    }

                }}
            />

        </div>

    );

}
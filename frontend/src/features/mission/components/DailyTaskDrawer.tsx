import {
    Clock3,
    CheckCircle2,
    Circle,
    XCircle,
    X,
} from "lucide-react";

import type {
    DailyTask,
} from "../types/daily-task.types";

import {
    DailyTaskStatus,
} from "../types/daily-task.types";

interface DailyTaskDrawerProps {

    task: DailyTask | null;

    currentMissionDay: number;

    open: boolean;

    onClose: () => void;

    onComplete?: (taskId: string) => void;

    onStartWeeklyReview?: () => void;

}

export default function DailyTaskDrawer({

    task,

    currentMissionDay,

    open,

    onClose,

    onComplete,

    onStartWeeklyReview,

}: DailyTaskDrawerProps) {

    if (!open || !task) {

        return null;

    }

    /*
    |--------------------------------------------------------------------------
    | Task State
    |--------------------------------------------------------------------------
    */

    const isPending =
        task.status ===
        DailyTaskStatus.PENDING;

    const isAvailable =
        task.dayNumber <=
        currentMissionDay;

    const isWeeklyReview =
        task.dayNumber === 7;

    const canCompleteRegularTask =
        isPending &&
        isAvailable &&
        !isWeeklyReview;

    const canStartWeeklyReview =
        isPending &&
        isAvailable &&
        isWeeklyReview;

    /*
    |--------------------------------------------------------------------------
    | Status
    |--------------------------------------------------------------------------
    */

    const renderStatus = () => {

        switch (task.status) {

            case DailyTaskStatus.COMPLETED:

                return (

                    <span className="flex items-center gap-2 text-green-600">

                        <CheckCircle2
                            size={18}
                        />

                        Completed

                    </span>

                );

            case DailyTaskStatus.SKIPPED:

                return (

                    <span className="flex items-center gap-2 text-gray-600">

                        <XCircle
                            size={18}
                        />

                        Skipped

                    </span>

                );

            default:

                return (

                    <span className="flex items-center gap-2 text-blue-600">

                        <Circle
                            size={18}
                        />

                        Pending

                    </span>

                );

        }

    };

    /*
    |--------------------------------------------------------------------------
    | UI
    |--------------------------------------------------------------------------
    */

    return (

        <>

            {/* Overlay */}

            <div
                onClick={onClose}
                className="
                    fixed
                    inset-0
                    z-40
                    bg-black/40
                "
            />

            {/* Drawer */}

            <div
                className="
                    fixed
                    right-0
                    top-0
                    z-50
                    flex
                    h-screen
                    w-full
                    max-w-xl
                    flex-col
                    bg-white
                    shadow-xl
                "
            >

                {/* Header */}

                <div className="flex items-center justify-between border-b p-6">

                    <div>

                        <p className="text-sm text-slate-500">

                            Day {task.dayNumber}

                        </p>

                        <h2 className="mt-1 text-2xl font-bold">

                            {task.title}

                        </h2>

                    </div>

                    <button
                        type="button"
                        onClick={onClose}
                    >

                        <X size={24} />

                    </button>

                </div>

                {/* Content */}

                <div className="flex-1 space-y-6 overflow-y-auto p-6">

                    {/* Status */}

                    <div>

                        {renderStatus()}

                    </div>

                    {/* Description */}

                    <div>

                        <h3 className="font-semibold">

                            Description

                        </h3>

                        <p className="mt-2 text-slate-600">

                            {task.description}

                        </p>

                    </div>

                    {/* Topics */}

                    <div>

                        <h3 className="font-semibold">

                            Topics

                        </h3>

                        <ul className="mt-3 space-y-2">

                            {task.topics.map(
                                (topic) => (

                                    <li
                                        key={topic}
                                        className="
                                            rounded-lg
                                            bg-slate-100
                                            px-3
                                            py-2
                                            text-sm
                                        "
                                    >

                                        {topic}

                                    </li>

                                )
                            )}

                        </ul>

                    </div>

                    {/* Estimated Time */}

                    <div className="flex items-center gap-2 text-slate-600">

                        <Clock3
                            size={18}
                        />

                        {task.estimatedMinutes} Minutes

                    </div>

                </div>

                {/* Footer */}

                <div className="border-t p-6">

                    {/* Regular Day 1 - 6 */}

                    {canCompleteRegularTask && (

                        <button
                            type="button"
                            onClick={() =>
                                onComplete?.(
                                    task.taskId
                                )
                            }
                            className="
                w-full
                rounded-lg
                bg-blue-600
                py-3
                font-medium
                text-white
                transition
                hover:bg-blue-700
            "
                        >

                            Complete Today's Task

                        </button>

                    )}

                    {/* Day 7 - Weekly Review */}

                    {canStartWeeklyReview && (

                        <button
                            type="button"
                            onClick={() =>
                                onStartWeeklyReview?.()
                            }
                            className="
                w-full
                rounded-lg
                bg-blue-600
                py-3
                font-medium
                text-white
                transition
                hover:bg-blue-700
            "
                        >

                            Start Weekly Review

                        </button>

                    )}

                    {/* Future Task */}

                    {
                        isPending &&
                        !isAvailable &&
                        (

                            <div
                                className="
                    rounded-lg
                    bg-slate-100
                    px-4
                    py-3
                    text-center
                    text-sm
                    text-slate-600
                "
                            >

                                This task will unlock on Day{" "}
                                {task.dayNumber}.

                            </div>

                        )
                    }

                </div>

            </div>

        </>

    );

}
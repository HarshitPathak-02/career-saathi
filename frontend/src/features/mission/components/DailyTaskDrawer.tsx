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

}

export default function DailyTaskDrawer({

    task,

    currentMissionDay,

    open,

    onClose,

    onComplete,

}: DailyTaskDrawerProps) {

    if (!open || !task) {

        return null;

    }

    const canComplete =
        task.status === DailyTaskStatus.PENDING &&
        task.dayNumber <= currentMissionDay;

    const renderStatus = () => {

        switch (task.status) {

            case DailyTaskStatus.COMPLETED:

                return (
                    <span className="flex items-center gap-2 text-green-600">

                        <CheckCircle2 size={18} />

                        Completed

                    </span>
                );

            case DailyTaskStatus.SKIPPED:

                return (
                    <span className="flex items-center gap-2 text-gray-600">

                        <XCircle size={18} />

                        Skipped

                    </span>
                );

            default:

                return (
                    <span className="flex items-center gap-2 text-blue-600">

                        <Circle size={18} />

                        Pending

                    </span>
                );

        }

    };

    return (

        <>
            <div
                onClick={onClose}
                className="fixed inset-0 z-40 bg-black/40"
            />

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

                <div className="flex items-center justify-between border-b p-6">

                    <div>

                        <p className="text-sm text-slate-500">

                            Day {task.dayNumber}

                        </p>

                        <h2 className="mt-1 text-2xl font-bold">

                            {task.title}

                        </h2>

                    </div>

                    <button onClick={onClose}>

                        <X size={24} />

                    </button>

                </div>

                <div className="flex-1 overflow-y-auto p-6 space-y-6">

                    <div>

                        {renderStatus()}

                    </div>

                    <div>

                        <h3 className="font-semibold">

                            Description

                        </h3>

                        <p className="mt-2 text-slate-600">

                            {task.description}

                        </p>

                    </div>

                    <div>

                        <h3 className="font-semibold">

                            Topics

                        </h3>

                        <ul className="mt-3 space-y-2">

                            {task.topics.map((topic) => (

                                <li
                                    key={topic}
                                    className="rounded-lg bg-slate-100 px-3 py-2 text-sm"
                                >
                                    {topic}
                                </li>

                            ))}

                        </ul>

                    </div>

                    <div className="flex items-center gap-2 text-slate-600">

                        <Clock3 size={18} />

                        {task.estimatedMinutes} Minutes

                    </div>

                </div>

                <div className="border-t p-6">

                    {canComplete ? (

                        <button
                            onClick={() => onComplete?.(task.taskId)}
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

                    ) : task.status === DailyTaskStatus.PENDING ? (

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

                            This task will unlock on Day {task.dayNumber}.

                        </div>

                    ) : null}

                </div>

            </div>

        </>

    );

}
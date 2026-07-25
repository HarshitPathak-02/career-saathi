import {
    CheckCircle2,
    Clock3,
    Circle,
    XCircle,
} from "lucide-react";

import type {
    DailyTask,
} from "../types/daily-task.types";

import {
    DailyTaskStatus,
} from "../types/daily-task.types";

interface DailyTaskCardProps {

    task: DailyTask;

    onClick?: () => void;

}

export default function DailyTaskCard({

    task,

    onClick,

}: DailyTaskCardProps) {

    const renderStatusIcon = () => {

        switch (task.status) {

            case DailyTaskStatus.COMPLETED:

                return (
                    <CheckCircle2
                        className="text-green-600"
                        size={20}
                    />
                );

            case DailyTaskStatus.SKIPPED:

                return (
                    <XCircle
                        className="text-gray-500"
                        size={20}
                    />
                );

            default:

                return (
                    <Circle
                        className="text-blue-500"
                        size={20}
                    />
                );

        }

    };

    return (

        <button
            onClick={onClick}
            className="
                w-full
                rounded-xl
                border
                bg-white
                p-5
                text-left
                transition
                hover:shadow-md
            "
        >

            <div className="flex items-center justify-between">

                <div>

                    <p className="text-sm text-slate-500">

                        Day {task.dayNumber}

                    </p>

                    <h3 className="mt-1 text-lg font-semibold">

                        {task.title}

                    </h3>

                </div>

                {renderStatusIcon()}

            </div>

            <p className="mt-2 line-clamp-2 text-sm text-slate-500">

                {task.description}

            </p>

            <div className="mt-4 flex items-center gap-2 text-sm text-slate-500">

                <Clock3 size={16} />

                {task.estimatedMinutes} Minutes

            </div>

        </button>

    );

}
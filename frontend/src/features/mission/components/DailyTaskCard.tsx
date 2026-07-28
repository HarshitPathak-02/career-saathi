import {
    CheckCircle2,
    Circle,
    Clock3,
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

const DailyTaskCard = ({

    task,

    onClick,

}: DailyTaskCardProps) => {

    const renderStatusIcon = () => {

        switch (task.status) {

            case DailyTaskStatus.COMPLETED:
                return (
                    <CheckCircle2
                        size={20}
                        className="text-emerald-600"
                    />
                );

            case DailyTaskStatus.SKIPPED:
                return (
                    <XCircle
                        size={20}
                        className="text-slate-400"
                    />
                );

            default:
                return (
                    <Circle
                        size={20}
                        className="text-blue-500"
                    />
                );

        }

    };

    const getStatusLabel = () => {

        switch (task.status) {

            case DailyTaskStatus.COMPLETED:
                return "Completed";

            case DailyTaskStatus.SKIPPED:
                return "Skipped";

            default:
                return "Pending";

        }

    };

    return (
        <button
            type="button"
            onClick={onClick}
            className="
                group
                w-full
                rounded-2xl
                border
                border-slate-200
                bg-white
                p-5
                text-left
                shadow-sm
                transition
                hover:border-blue-200
                hover:shadow-md
                sm:p-6
            "
        >

            <div
                className="
                    flex
                    items-start
                    justify-between
                    gap-4
                "
            >

                <div
                    className="
                        flex
                        min-w-0
                        items-start
                        gap-3
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
                            rounded-xl
                            bg-slate-50
                            text-sm
                            font-bold
                            text-slate-700
                        "
                    >
                        {task.dayNumber}
                    </div>

                    <div className="min-w-0">

                        <p
                            className="
                                text-xs
                                font-semibold
                                uppercase
                                tracking-wide
                                text-slate-400
                            "
                        >
                            Day {task.dayNumber}
                        </p>

                        <h3
                            className="
                                mt-1
                                text-base
                                font-bold
                                text-slate-900
                                sm:text-lg
                            "
                        >
                            {task.title}
                        </h3>

                    </div>

                </div>

                <div
                    className="
                        flex
                        shrink-0
                        items-center
                        gap-2
                    "
                >
                    {renderStatusIcon()}

                    <span
                        className="
                            hidden
                            text-xs
                            font-medium
                            text-slate-500
                            sm:inline
                        "
                    >
                        {getStatusLabel()}
                    </span>
                </div>

            </div>

            <p
                className="
                    mt-4
                    line-clamp-2
                    text-sm
                    leading-6
                    text-slate-600
                "
            >
                {task.description}
            </p>

            <div
                className="
                    mt-5
                    flex
                    items-center
                    gap-2
                    border-t
                    border-slate-100
                    pt-4
                    text-sm
                    text-slate-500
                "
            >
                <Clock3 size={16} />

                {task.estimatedMinutes} minutes
            </div>

        </button>
    );
};

export default DailyTaskCard;
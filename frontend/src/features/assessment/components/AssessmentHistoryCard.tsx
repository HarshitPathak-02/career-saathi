import {
    CalendarDays,
    ChevronRight,
    ClipboardCheck,
} from "lucide-react";

import {
    useNavigate,
} from "react-router-dom";

import type {
    AssessmentHistoryItem,
} from "../types/assessment.types";

interface AssessmentHistoryCardProps {
    assessment: AssessmentHistoryItem;
}

const AssessmentHistoryCard = ({
    assessment,
}: AssessmentHistoryCardProps) => {

    const navigate =
        useNavigate();

    const isInitial =
        assessment.type === "INITIAL";

    const isCompleted =
        assessment.status === "COMPLETED";

    const formattedDate =
        new Date(
            assessment.completedAt ??
            assessment.createdAt
        ).toLocaleDateString(
            "en-IN",
            {
                day: "numeric",
                month: "short",
                year: "numeric",
            }
        );

    return (
        <button
            type="button"
            onClick={() =>
                navigate(
                    `/assessments/${assessment.id}`
                )
            }
            className="
                group
                flex
                w-full
                items-center
                justify-between
                gap-5
                rounded-xl
                border
                border-slate-200
                bg-white
                p-5
                text-left
                transition
                hover:border-indigo-200
                hover:shadow-sm
            "
        >
            <div className="flex min-w-0 items-start gap-4">

                <div
                    className="
                        flex
                        h-11
                        w-11
                        shrink-0
                        items-center
                        justify-center
                        rounded-xl
                        bg-indigo-50
                        text-indigo-600
                    "
                >
                    <ClipboardCheck
                        size={21}
                    />
                </div>

                <div className="min-w-0">

                    <div className="flex flex-wrap items-center gap-2">

                        <h3 className="font-semibold text-slate-900">
                            {assessment.title}
                        </h3>

                        <span
                            className={`
                                rounded-full
                                px-2.5
                                py-1
                                text-xs
                                font-medium

                                ${isCompleted
                                    ? "bg-emerald-50 text-emerald-700"
                                    : "bg-amber-50 text-amber-700"
                                }
                            `}
                        >
                            {assessment.status}
                        </span>

                    </div>

                    <p className="mt-1 text-sm text-slate-500">
                        {isInitial
                            ? "Initial skill assessment"
                            : `Weekly assessment · Week ${assessment.weekNumber}`}
                    </p>

                    <div className="mt-3 flex items-center gap-2 text-xs text-slate-500">

                        <CalendarDays
                            size={14}
                        />

                        <span>
                            {formattedDate}
                        </span>

                    </div>

                </div>
            </div>

            <ChevronRight
                size={20}
                className="
                    shrink-0
                    text-slate-400
                    transition
                    group-hover:translate-x-1
                    group-hover:text-indigo-600
                "
            />
        </button>
    );
};

export default AssessmentHistoryCard;
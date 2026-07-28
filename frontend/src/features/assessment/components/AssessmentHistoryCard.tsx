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

    assessment:
    AssessmentHistoryItem;

}

const AssessmentHistoryCard = ({
    assessment,
}: AssessmentHistoryCardProps) => {

    const navigate =
        useNavigate();

    const isInitial =
        assessment.type ===
        "INITIAL";

    const isCompleted =
        assessment.status ===
        "COMPLETED";

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
                w-full
                rounded-2xl
                border
                border-slate-200
                bg-white
                p-4
                text-left
                shadow-sm
                transition-all
                hover:border-blue-200
                hover:shadow-md
                sm:p-5
            "
        >

            <div
                className="
                    flex
                    items-start
                    gap-3
                    sm:gap-4
                "
            >

                <div
                    className="
                        flex
                        h-11
                        w-11
                        shrink-0
                        items-center
                        justify-center
                        rounded-xl
                        bg-blue-50
                        text-blue-600
                    "
                >

                    <ClipboardCheck
                        size={21}
                    />

                </div>

                <div
                    className="
                        min-w-0
                        flex-1
                    "
                >

                    <div
                        className="
                            flex
                            flex-col
                            gap-2
                            sm:flex-row
                            sm:items-center
                        "
                    >

                        <h3
                            className="
                                min-w-0
                                font-semibold
                                text-slate-900
                            "
                        >
                            {assessment.title}
                        </h3>

                        <span
                            className={`
                                w-fit
                                rounded-full
                                px-2.5
                                py-1
                                text-[11px]
                                font-semibold
                                uppercase
                                tracking-wide

                                ${isCompleted
                                    ? "bg-emerald-50 text-emerald-700"
                                    : "bg-amber-50 text-amber-700"
                                }
                            `}
                        >
                            {assessment.status}
                        </span>

                    </div>

                    <p
                        className="
                            mt-2
                            text-sm
                            text-slate-500
                        "
                    >
                        {isInitial
                            ? "Initial skill assessment"
                            : `Weekly assessment · Week ${assessment.weekNumber}`
                        }
                    </p>

                    <div
                        className="
                            mt-3
                            flex
                            items-center
                            gap-2
                            text-xs
                            text-slate-400
                        "
                    >

                        <CalendarDays
                            size={14}
                        />

                        <span>
                            {formattedDate}
                        </span>

                    </div>

                </div>

                <div
                    className="
                        hidden
                        h-9
                        w-9
                        shrink-0
                        items-center
                        justify-center
                        rounded-lg
                        text-slate-400
                        transition
                        group-hover:bg-blue-50
                        group-hover:text-blue-600
                        sm:flex
                    "
                >

                    <ChevronRight
                        size={19}
                        className="
                            transition-transform
                            group-hover:translate-x-0.5
                        "
                    />

                </div>

            </div>

        </button>

    );

};

export default AssessmentHistoryCard;
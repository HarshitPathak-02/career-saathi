import {
    ArrowDown,
    ArrowUp,
    Minus,
} from "lucide-react";

import type {
    AssessmentSkillDetail,
} from "../types/assessment.types";

interface AssessmentSkillResultCardProps {
    skill: AssessmentSkillDetail;
}

const AssessmentSkillResultCard = ({
    skill,
}: AssessmentSkillResultCardProps) => {

    const improvement =
        skill.improvementPercentage;

    const hasImprovement =
        improvement !== null;

    const isPositive =
        hasImprovement &&
        improvement > 0;

    const isNegative =
        hasImprovement &&
        improvement < 0;

    return (
        <div
            className="
                rounded-xl
                border
                border-slate-200
                bg-white
                p-5
            "
        >
            <div className="flex items-start justify-between gap-5">

                <div>
                    <h3 className="font-semibold text-slate-900">
                        {skill.skillName}
                    </h3>

                    <p className="mt-1 text-sm text-slate-500">
                        {skill.obtainedMarks}
                        {" / "}
                        {skill.totalMarks}
                        {" marks"}
                    </p>
                </div>

                <div className="text-right">

                    <p className="text-2xl font-bold text-slate-900">
                        {skill.percentage}%
                    </p>

                    {hasImprovement && (
                        <div
                            className={`
                                mt-1
                                flex
                                items-center
                                justify-end
                                gap-1
                                text-xs
                                font-medium

                                ${isPositive
                                    ? "text-emerald-600"
                                    : isNegative
                                        ? "text-red-500"
                                        : "text-slate-500"
                                }
                            `}
                        >
                            {isPositive && (
                                <ArrowUp
                                    size={13}
                                />
                            )}

                            {isNegative && (
                                <ArrowDown
                                    size={13}
                                />
                            )}

                            {!isPositive &&
                                !isNegative && (
                                    <Minus
                                        size={13}
                                    />
                                )}

                            {improvement > 0
                                ? "+"
                                : ""}

                            {improvement}%
                        </div>
                    )}

                </div>
            </div>

            <div className="mt-5">

                <div className="h-2 overflow-hidden rounded-full bg-slate-100">
                    <div
                        className="h-full rounded-full bg-indigo-600"
                        style={{
                            width:
                                `${Math.min(
                                    skill.percentage,
                                    100
                                )}%`,
                        }}
                    />
                </div>

            </div>

            <div className="mt-5 flex flex-wrap gap-2">

                <span
                    className="
                        rounded-full
                        bg-slate-100
                        px-3
                        py-1
                        text-xs
                        font-medium
                        text-slate-600
                    "
                >
                    {skill.assessmentMethod}
                </span>

                {skill.assessmentPlatform && (
                    <span
                        className="
                            rounded-full
                            bg-indigo-50
                            px-3
                            py-1
                            text-xs
                            font-medium
                            text-indigo-700
                        "
                    >
                        {skill.assessmentPlatform}
                    </span>
                )}

            </div>

            {skill.assessmentName && (
                <p className="mt-4 text-sm text-slate-600">
                    <span className="font-medium text-slate-700">
                        Assessment:
                    </span>{" "}
                    {skill.assessmentName}
                </p>
            )}

            {skill.remarks && (
                <p className="mt-2 text-sm leading-6 text-slate-600">
                    {skill.remarks}
                </p>
            )}
        </div>
    );
};

export default AssessmentSkillResultCard;
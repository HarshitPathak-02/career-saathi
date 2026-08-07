import {
    ArrowDown,
    ArrowUp,
    Minus,
} from "lucide-react";

import type {
    AssessmentSkillDetail,
} from "../types/assessment.types";

interface AssessmentSkillResultCardProps {

    skill:
    AssessmentSkillDetail;

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

    const progress =
        Math.min(
            Math.max(
                skill.percentage,
                0
            ),
            100
        );

    return (

        <article
            className="
                rounded-2xl
                border
                border-slate-200
                bg-white
                p-5
                shadow-sm
                sm:p-6
            "
        >

            {/* Skill + Score */}

            <div
                className="
                    flex
                    items-start
                    justify-between
                    gap-4
                "
            >

                <div className="min-w-0">

                    <p
                        className="
                            text-xs
                            font-semibold
                            uppercase
                            tracking-widest
                            text-slate-400
                        "
                    >
                        Skill
                    </p>


                    <h3
                        className="
                            mt-1
                            text-lg
                            font-bold
                            text-slate-900
                        "
                    >
                        {skill.skillName}
                    </h3>

                    <p
                        className="
                            mt-1
                            text-sm
                            text-slate-500
                        "
                    >
                        {skill.obtainedMarks}
                        {" / "}
                        {skill.totalMarks}
                        {" marks"}
                    </p>

                </div>

                <div
                    className="
                        shrink-0
                        text-right
                    "
                >

                    <p
                        className="
                            text-2xl
                            font-bold
                            tracking-tight
                            text-slate-900
                            sm:text-3xl
                        "
                    >
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
                                font-semibold

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
                                    size={14}
                                />
                            )}

                            {isNegative && (
                                <ArrowDown
                                    size={14}
                                />
                            )}

                            {!isPositive &&
                                !isNegative && (

                                    <Minus
                                        size={14}
                                    />

                                )}

                            <span>

                                {improvement > 0
                                    ? "+"
                                    : ""
                                }

                                {improvement}%

                            </span>

                        </div>

                    )}

                </div>

            </div>

            {/* Progress */}

            <div className="mt-5">

                <div
                    className="
                        flex
                        items-center
                        justify-between
                        text-xs
                        text-slate-400
                    "
                >

                    <span>
                        Performance
                    </span>

                    <span>
                        {progress}%
                    </span>

                </div>

                <div
                    className="
                        mt-2
                        h-2
                        overflow-hidden
                        rounded-full
                        bg-slate-100
                    "
                >

                    <div
                        className="
                            h-full
                            rounded-full
                            bg-blue-600
                            transition-all
                            duration-500
                        "
                        style={{
                            width:
                                `${progress}%`,
                        }}
                    />

                </div>

            </div>

            {/* Metadata */}

            <div
                className="
                    mt-5
                    flex
                    flex-wrap
                    gap-2
                "
            >

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
                            bg-blue-50
                            px-3
                            py-1
                            text-xs
                            font-medium
                            text-blue-700
                        "
                    >
                        {skill.assessmentPlatform}
                    </span>

                )}

            </div>

            {/* Assessment Name */}

            {skill.assessmentName && (

                <div
                    className="
                        mt-5
                        border-t
                        border-slate-100
                        pt-4
                    "
                >

                    <p
                        className="
                            text-xs
                            font-semibold
                            uppercase
                            tracking-wide
                            text-slate-400
                        "
                    >
                        Assessment
                    </p>

                    <p
                        className="
                            mt-1
                            text-sm
                            font-medium
                            leading-6
                            text-slate-700
                        "
                    >
                        {skill.assessmentName}
                    </p>

                </div>

            )}

            {/* Remarks */}

            {skill.remarks && (

                <div
                    className="
                        mt-4
                        rounded-xl
                        bg-slate-50
                        p-4
                    "
                >

                    <p
                        className="
                            text-xs
                            font-semibold
                            uppercase
                            tracking-wide
                            text-slate-400
                        "
                    >
                        Remarks
                    </p>

                    <p
                        className="
                            mt-1.5
                            text-sm
                            leading-6
                            text-slate-600
                        "
                    >
                        {skill.remarks}
                    </p>

                </div>

            )}

        </article>

    );

};

export default AssessmentSkillResultCard;
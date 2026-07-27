import {
    ArrowRight,
    BookOpen,
    RotateCcw,
    Sparkles,
    Target,
} from "lucide-react";

import type {
    WeeklyReviewPreparation,
} from "../types/weekly-review.types";

interface ReviewTopicsStepProps {

    review: WeeklyReviewPreparation;

    onContinue: () => void;

}

export default function ReviewTopicsStep({

    review,

    onContinue,

}: ReviewTopicsStepProps) {

    return (

        <div className="space-y-6">

            {/* Header */}

            <div>

                <div className="flex items-center gap-2 text-sm font-medium text-slate-500">

                    <Target size={16} />

                    Week {review.weekNumber}

                </div>

                <h2 className="mt-2 text-2xl font-semibold text-slate-900">

                    Your Weekly Assessment

                </h2>

                <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500">

                    Review the new skills you studied and the
                    skills selected for revision. Complete an
                    assessment covering all the areas below.

                </p>

            </div>


            {/* Skills */}

            <div className="space-y-4">

                {review.skills.map(
                    (skill) => {

                        const isRevision =
                            skill.source ===
                            "REVISION";

                        return (

                            <div
                                key={
                                    skill.userSkillId
                                }
                                className="
                                    rounded-xl
                                    border
                                    border-slate-200
                                    bg-white
                                    p-5
                                "
                            >

                                {/* Skill Header */}

                                <div className="flex flex-wrap items-start justify-between gap-4">

                                    <div>

                                        <div className="flex flex-wrap items-center gap-2">

                                            <BookOpen
                                                size={18}
                                                className="text-slate-500"
                                            />

                                            <h3 className="font-semibold text-slate-900">

                                                {skill.skillName}

                                            </h3>

                                            {/* Source */}

                                            <span
                                                className={`
                                                    inline-flex
                                                    items-center
                                                    gap-1
                                                    rounded-full
                                                    px-2.5
                                                    py-1
                                                    text-xs
                                                    font-semibold

                                                    ${isRevision
                                                        ? "bg-amber-100 text-amber-700"
                                                        : "bg-indigo-100 text-indigo-700"
                                                    }
                                                `}
                                            >

                                                {isRevision ? (

                                                    <RotateCcw
                                                        size={12}
                                                    />

                                                ) : (

                                                    <Sparkles
                                                        size={12}
                                                    />

                                                )}

                                                {isRevision
                                                    ? "Revision"
                                                    : "New Skill"
                                                }

                                            </span>

                                        </div>

                                        <p className="mt-2 text-sm text-slate-500">

                                            Current score:{" "}

                                            <span className="font-semibold text-slate-700">

                                                {skill.currentScore}%

                                            </span>

                                        </p>

                                    </div>


                                    {/* Previous Assessment */}

                                    {isRevision &&
                                        skill.previousPercentage !==
                                        null && (

                                            <div
                                                className="
                                                rounded-lg
                                                bg-amber-50
                                                px-3
                                                py-2
                                                text-sm
                                            "
                                            >

                                                <span className="text-slate-500">

                                                    Previous assessment

                                                </span>

                                                <span className="ml-2 font-semibold text-amber-700">

                                                    {
                                                        skill.previousPercentage
                                                    }%

                                                </span>

                                            </div>

                                        )}

                                </div>


                                {/* NEW SKILL */}

                                {!isRevision && (

                                    <div className="mt-5">

                                        <p
                                            className="
                                                mb-3
                                                text-xs
                                                font-semibold
                                                uppercase
                                                tracking-wide
                                                text-slate-500
                                            "
                                        >

                                            Topics covered this week

                                        </p>


                                        {skill.roadmapItems.length >
                                            0 ? (

                                            <div className="space-y-3">

                                                {skill.roadmapItems.map(
                                                    (
                                                        item,
                                                        index
                                                    ) => (

                                                        <div
                                                            key={
                                                                item.id
                                                            }
                                                            className="
                                                                rounded-lg
                                                                bg-slate-50
                                                                p-4
                                                            "
                                                        >

                                                            <div className="flex gap-3">

                                                                <div
                                                                    className="
                                                                        flex
                                                                        h-7
                                                                        w-7
                                                                        shrink-0
                                                                        items-center
                                                                        justify-center
                                                                        rounded-full
                                                                        bg-white
                                                                        text-xs
                                                                        font-semibold
                                                                        text-slate-600
                                                                        shadow-sm
                                                                    "
                                                                >

                                                                    {
                                                                        index +
                                                                        1
                                                                    }

                                                                </div>

                                                                <div>

                                                                    <p className="text-sm font-medium text-slate-900">

                                                                        {
                                                                            item.title
                                                                        }

                                                                    </p>

                                                                    {item.description && (

                                                                        <p className="mt-1 text-sm leading-5 text-slate-500">

                                                                            {
                                                                                item.description
                                                                            }

                                                                        </p>

                                                                    )}

                                                                </div>

                                                            </div>

                                                        </div>

                                                    )
                                                )}

                                            </div>

                                        ) : (

                                            <p className="text-sm text-slate-500">

                                                No roadmap topics available.

                                            </p>

                                        )}

                                    </div>

                                )}


                                {/* REVISION SKILL */}

                                {isRevision && (

                                    <div className="mt-5">

                                        <div
                                            className="
                                                rounded-lg
                                                border
                                                border-amber-100
                                                bg-amber-50/50
                                                p-4
                                            "
                                        >

                                            <div className="flex items-center gap-2">

                                                <RotateCcw
                                                    size={16}
                                                    className="text-amber-600"
                                                />

                                                <p
                                                    className="
                                                        text-xs
                                                        font-semibold
                                                        uppercase
                                                        tracking-wide
                                                        text-amber-700
                                                    "
                                                >

                                                    Revision Focus

                                                </p>

                                            </div>


                                            {skill.revisionTopics.length >
                                                0 ? (

                                                <div className="mt-3 space-y-2">

                                                    {skill.revisionTopics.map(
                                                        (
                                                            topic,
                                                            index
                                                        ) => (

                                                            <div
                                                                key={
                                                                    `${skill.userSkillId}-${topic}`
                                                                }
                                                                className="
                                                                    flex
                                                                    items-start
                                                                    gap-3
                                                                    rounded-lg
                                                                    bg-white
                                                                    px-3
                                                                    py-2.5
                                                                "
                                                            >

                                                                <div
                                                                    className="
                                                                        flex
                                                                        h-6
                                                                        w-6
                                                                        shrink-0
                                                                        items-center
                                                                        justify-center
                                                                        rounded-full
                                                                        bg-amber-100
                                                                        text-xs
                                                                        font-semibold
                                                                        text-amber-700
                                                                    "
                                                                >

                                                                    {
                                                                        index +
                                                                        1
                                                                    }

                                                                </div>

                                                                <span className="text-sm text-slate-700">

                                                                    {
                                                                        topic
                                                                    }

                                                                </span>

                                                            </div>

                                                        )
                                                    )}

                                                </div>

                                            ) : (

                                                <p className="mt-3 text-sm text-slate-500">

                                                    Review the core concepts of this skill.

                                                </p>

                                            )}

                                        </div>

                                    </div>

                                )}

                            </div>

                        );

                    }
                )}

            </div>


            {/* Platform Notice */}

            <div
                className="
                    rounded-xl
                    border
                    border-dashed
                    border-slate-300
                    bg-slate-50
                    p-5
                "
            >

                <p className="text-sm font-medium text-slate-900">

                    Complete your assessment

                </p>

                <p className="mt-1 text-sm leading-6 text-slate-500">

                    Take an assessment covering all the skills
                    listed above. For revision skills, focus
                    specifically on the recommended revision
                    topics. Enter your scores in the next step.

                </p>

            </div>


            {/* Continue */}

            <div className="flex justify-end">

                <button
                    type="button"
                    onClick={
                        onContinue
                    }
                    className="
                        flex
                        items-center
                        gap-2
                        rounded-lg
                        bg-slate-900
                        px-5
                        py-3
                        text-sm
                        font-semibold
                        text-white
                        transition
                        hover:bg-slate-800
                    "
                >

                    I've Completed My Assessment

                    <ArrowRight
                        size={17}
                    />

                </button>

            </div>

        </div>

    );

}
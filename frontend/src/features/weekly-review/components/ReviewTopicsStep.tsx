import {
    ArrowRight,
    BookOpen,
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

                    Review the skills and topics you studied this
                    week. Take an assessment for these areas on
                    your preferred learning or coding platform.

                </p>

            </div>


            {/* Skills */}

            <div className="space-y-4">

                {review.skills.map(
                    (skill) => (

                        <div
                            key={skill.userSkillId}
                            className="
                                rounded-xl
                                border
                                border-slate-200
                                bg-white
                                p-5
                            "
                        >

                            {/* Skill Header */}

                            <div className="flex items-start justify-between gap-4">

                                <div>

                                    <div className="flex items-center gap-2">

                                        <BookOpen
                                            size={18}
                                            className="text-slate-500"
                                        />

                                        <h3 className="font-semibold text-slate-900">

                                            {skill.skillName}

                                        </h3>

                                    </div>

                                    <p className="mt-1 text-sm text-slate-500">

                                        Current score:{" "}
                                        {skill.currentScore}%

                                    </p>

                                </div>

                            </div>


                            {/* Roadmap Items */}

                            <div className="mt-5 space-y-3">

                                {skill.roadmapItems.map(
                                    (
                                        item,
                                        index,
                                    ) => (

                                        <div
                                            key={item.id}
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

                                                    {index + 1}

                                                </div>

                                                <div>

                                                    <p className="text-sm font-medium text-slate-900">

                                                        {item.title}

                                                    </p>

                                                    <p className="mt-1 text-sm leading-5 text-slate-500">

                                                        {item.description}

                                                    </p>

                                                </div>

                                            </div>

                                        </div>

                                    ),
                                )}

                            </div>

                        </div>

                    ),
                )}

            </div>


            {/* Temporary Platform Notice */}

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

                    Use a suitable assessment or coding platform
                    to test yourself on the topics above.
                    Platform recommendations will be added here
                    later.

                </p>

            </div>


            {/* Continue */}

            <div className="flex justify-end">

                <button
                    type="button"
                    onClick={onContinue}
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

                    <ArrowRight size={17} />

                </button>

            </div>

        </div>

    );

}
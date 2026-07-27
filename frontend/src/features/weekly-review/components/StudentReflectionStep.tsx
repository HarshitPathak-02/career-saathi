import {
    useMemo,
} from "react";

import {
    DifficultyType,
    MotivationLevel,
    OverallWeek,
    ReflectionReason,
} from "../types/weekly-review.types";

import type {
    LearningReflection,
    MentorCheckIn,
    WeeklyReflectionSubmission,
} from "../types/weekly-review.types";

interface Props {

    value:
    WeeklyReflectionSubmission;

    onChange: (
        value:
            WeeklyReflectionSubmission
    ) => void;

    onBack: () => void;

    onSubmit: () => void;

    isSubmitting?: boolean;

}

export default function StudentReflectionStep({

    value,

    onChange,

    onBack,

    onSubmit,

    isSubmitting = false,

}: Props) {

    /*
    |--------------------------------------------------------------------------
    | Update Learning Reflection
    |--------------------------------------------------------------------------
    */

    function updateLearning<
        K extends keyof LearningReflection
    >(
        key: K,
        val: LearningReflection[K]
    ) {

        onChange({

            ...value,

            learningReflection: {

                ...value.learningReflection,

                [key]:
                    val,

            },

        });

    }

    /*
    |--------------------------------------------------------------------------
    | Completed Tasks
    |--------------------------------------------------------------------------
    */

    function updateCompletedTasks(
        completed: boolean
    ) {

        if (completed) {

            const {
                reason: _reason,
                ...learningReflection
            } =
                value.learningReflection;

            onChange({

                ...value,

                learningReflection: {

                    ...learningReflection,

                    completedAllTasks:
                        true,

                },

            });

            return;

        }

        updateLearning(
            "completedAllTasks",
            false
        );

    }

    /*
    |--------------------------------------------------------------------------
    | Update Mentor
    |--------------------------------------------------------------------------
    */

    function updateMentor<
        K extends keyof MentorCheckIn
    >(
        key: K,
        val: MentorCheckIn[K]
    ) {

        onChange({

            ...value,

            mentorCheckIn: {

                ...value.mentorCheckIn,

                [key]:
                    val,

            },

        });

    }

    /*
    |--------------------------------------------------------------------------
    | Validation
    |--------------------------------------------------------------------------
    */

    const canSubmit =
        useMemo(() => {

            const learning =
                value.learningReflection;

            const mentor =
                value.mentorCheckIn;

            if (
                !learning.completedAllTasks &&
                !learning.reason
            ) {

                return false;

            }

            if (
                learning.confidenceRating < 1 ||
                learning.confidenceRating > 5
            ) {

                return false;

            }

            if (
                !mentor.overallWeek
            ) {

                return false;

            }

            if (
                !mentor.motivationLevel
            ) {

                return false;

            }

            return true;

        }, [
            value,
        ]);

    /*
    |--------------------------------------------------------------------------
    | UI
    |--------------------------------------------------------------------------
    */

    return (

        <div className="space-y-8">

            <div>

                <h2 className="text-2xl font-semibold text-slate-900">

                    Weekly Reflection

                </h2>

                <p className="mt-2 text-sm text-slate-500">

                    Help your Career Companion understand how your
                    week went so the next mission can adapt to you.

                </p>

            </div>

            {/* Completed Tasks */}

            <div className="rounded-xl border border-slate-200 bg-white p-5">

                <label className="font-medium text-slate-900">

                    Did you complete all your planned tasks?

                </label>

                <div className="mt-4 flex gap-6">

                    <label className="flex cursor-pointer items-center">

                        <input

                            type="radio"

                            checked={
                                value.learningReflection
                                    .completedAllTasks ===
                                true
                            }

                            onChange={() =>
                                updateCompletedTasks(
                                    true
                                )
                            }

                        />

                        <span className="ml-2 text-sm text-slate-700">

                            Yes

                        </span>

                    </label>

                    <label className="flex cursor-pointer items-center">

                        <input

                            type="radio"

                            checked={
                                value.learningReflection
                                    .completedAllTasks ===
                                false
                            }

                            onChange={() =>
                                updateCompletedTasks(
                                    false
                                )
                            }

                        />

                        <span className="ml-2 text-sm text-slate-700">

                            No

                        </span>

                    </label>

                </div>

            </div>

            {/* Reason */}

            {!value.learningReflection
                .completedAllTasks && (

                    <div>

                        <label className="font-medium text-slate-900">

                            What was the biggest reason?

                        </label>

                        <select

                            className="
                            mt-2
                            w-full
                            rounded-lg
                            border
                            border-slate-300
                            p-2.5
                            outline-none
                            focus:border-indigo-500
                        "

                            value={
                                value.learningReflection
                                    .reason ??
                                ""
                            }

                            onChange={e =>
                                updateLearning(

                                    "reason",

                                    e.target.value as
                                    ReflectionReason

                                )
                            }

                        >

                            <option value="">

                                Select a reason

                            </option>

                            {Object.values(
                                ReflectionReason
                            ).map(
                                reason => (

                                    <option
                                        key={
                                            reason
                                        }
                                        value={
                                            reason
                                        }
                                    >

                                        {reason.replaceAll(
                                            "_",
                                            " "
                                        )}

                                    </option>

                                )
                            )}

                        </select>

                    </div>

                )}

            {/* Difficulty */}

            <div>

                <label className="font-medium text-slate-900">

                    Which area was most difficult?

                </label>

                <p className="mt-1 text-sm text-slate-500">

                    Optional — select one if you faced a major difficulty.

                </p>

                <select

                    className="
                        mt-2
                        w-full
                        rounded-lg
                        border
                        border-slate-300
                        p-2.5
                        outline-none
                        focus:border-indigo-500
                    "

                    value={
                        value.learningReflection
                            .difficultyType ??
                        ""
                    }

                    onChange={e =>

                        updateLearning(

                            "difficultyType",

                            e.target.value
                                ? e.target.value as
                                DifficultyType
                                : undefined

                        )

                    }

                >

                    <option value="">

                        No major difficulty

                    </option>

                    {Object.values(
                        DifficultyType
                    ).map(
                        type => (

                            <option
                                key={
                                    type
                                }
                                value={
                                    type
                                }
                            >

                                {type.replaceAll(
                                    "_",
                                    " "
                                )}

                            </option>

                        )
                    )}

                </select>

            </div>

            {/* Confidence */}

            <div>

                <div className="flex items-center justify-between">

                    <label className="font-medium text-slate-900">

                        Confidence

                    </label>

                    <span className="rounded-full bg-indigo-50 px-3 py-1 text-sm font-semibold text-indigo-700">

                        {
                            value.learningReflection
                                .confidenceRating
                        } / 5

                    </span>

                </div>

                <input

                    type="range"

                    min={1}

                    max={5}

                    step={1}

                    value={
                        value.learningReflection
                            .confidenceRating
                    }

                    onChange={e =>
                        updateLearning(

                            "confidenceRating",

                            Number(
                                e.target.value
                            )

                        )
                    }

                    className="mt-4 w-full"

                />

                <div className="mt-1 flex justify-between text-xs text-slate-400">

                    <span>Low</span>

                    <span>High</span>

                </div>

            </div>

            {/* Mentor */}

            <div className="border-t border-slate-200 pt-6">

                <h3 className="text-lg font-semibold text-slate-900">

                    Mentor Check-in

                </h3>

                <p className="mt-1 text-sm text-slate-500">

                    This helps personalize your next mission and mentor feedback.

                </p>

            </div>

            {/* Overall Week */}

            <div>

                <label className="font-medium text-slate-900">

                    How was your overall week?

                </label>

                <select

                    className="mt-2 w-full rounded-lg border border-slate-300 p-2.5"

                    value={
                        value.mentorCheckIn
                            .overallWeek ??
                        ""
                    }

                    onChange={e =>
                        updateMentor(

                            "overallWeek",

                            e.target.value as
                            OverallWeek

                        )
                    }

                >

                    <option value="">

                        Select

                    </option>

                    {Object.values(
                        OverallWeek
                    ).map(
                        item => (

                            <option
                                key={
                                    item
                                }
                                value={
                                    item
                                }
                            >

                                {item.replaceAll(
                                    "_",
                                    " "
                                )}

                            </option>

                        )
                    )}

                </select>

            </div>

            {/* Motivation */}

            <div>

                <label className="font-medium text-slate-900">

                    What was your motivation level?

                </label>

                <select

                    className="mt-2 w-full rounded-lg border border-slate-300 p-2.5"

                    value={
                        value.mentorCheckIn
                            .motivationLevel ??
                        ""
                    }

                    onChange={e =>
                        updateMentor(

                            "motivationLevel",

                            e.target.value as
                            MotivationLevel

                        )
                    }

                >

                    <option value="">

                        Select

                    </option>

                    {Object.values(
                        MotivationLevel
                    ).map(
                        item => (

                            <option
                                key={
                                    item
                                }
                                value={
                                    item
                                }
                            >

                                {item.replaceAll(
                                    "_",
                                    " "
                                )}

                            </option>

                        )
                    )}

                </select>

            </div>

            {/* External Factors */}

            <div>

                <label className="font-medium text-slate-900">

                    External factors

                </label>

                <textarea

                    rows={3}

                    placeholder="Did college, work, health, travel, or anything else affect your study time?"

                    value={
                        value.mentorCheckIn
                            .externalFactors ??
                        ""
                    }

                    onChange={e =>
                        updateMentor(
                            "externalFactors",
                            e.target.value
                        )
                    }

                    className="mt-2 w-full rounded-lg border border-slate-300 p-3"

                />

            </div>

            {/* Career Concern */}

            <div>

                <label className="font-medium text-slate-900">

                    Career concerns

                </label>

                <textarea

                    rows={3}

                    placeholder="Is anything about your career preparation worrying you?"

                    value={
                        value.mentorCheckIn
                            .careerConcern ??
                        ""
                    }

                    onChange={e =>
                        updateMentor(
                            "careerConcern",
                            e.target.value
                        )
                    }

                    className="mt-2 w-full rounded-lg border border-slate-300 p-3"

                />

            </div>

            {/* Help Needed */}

            <div>

                <label className="font-medium text-slate-900">

                    Where do you need help?

                </label>

                <textarea

                    rows={3}

                    placeholder="Tell your mentor what you need help with."

                    value={
                        value.mentorCheckIn
                            .helpNeeded ??
                        ""
                    }

                    onChange={e =>
                        updateMentor(
                            "helpNeeded",
                            e.target.value
                        )
                    }

                    className="mt-2 w-full rounded-lg border border-slate-300 p-3"

                />

            </div>

            {/* Additional */}

            <div>

                <label className="font-medium text-slate-900">

                    Anything else?

                </label>

                <textarea

                    rows={4}

                    placeholder="Add anything else you'd like your Career Companion to know."

                    value={
                        value.additionalComments ??
                        ""
                    }

                    onChange={e =>
                        onChange({

                            ...value,

                            additionalComments:
                                e.target.value,

                        })
                    }

                    className="mt-2 w-full rounded-lg border border-slate-300 p-3"

                />

            </div>

            {/* Navigation */}

            <div className="flex justify-between border-t border-slate-200 pt-6">

                <button
                    type="button"
                    onClick={
                        onBack
                    }
                    disabled={
                        isSubmitting
                    }
                    className="
                        rounded-lg
                        border
                        border-slate-300
                        px-5
                        py-2.5
                        font-medium
                        text-slate-700
                        hover:bg-slate-50
                        disabled:opacity-50
                    "
                >

                    Back

                </button>

                <button
                    type="button"
                    disabled={
                        !canSubmit ||
                        isSubmitting
                    }
                    onClick={
                        onSubmit
                    }
                    className="
                        rounded-lg
                        bg-slate-900
                        px-6
                        py-2.5
                        font-medium
                        text-white
                        hover:bg-slate-800
                        disabled:cursor-not-allowed
                        disabled:opacity-50
                    "
                >

                    {isSubmitting
                        ? "Generating Report..."
                        : "Complete Weekly Review"
                    }

                </button>

            </div>

        </div>

    );

}
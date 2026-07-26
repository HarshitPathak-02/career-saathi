import {
    useMemo,
} from "react";

import {
    DifficultyType,
    MotivationLevel,
    OverallWeek,
    ReflectionReason,
    type WeeklyReflectionSubmission,
} from "../types/weekly-review.types";

interface Props {

    value: WeeklyReflectionSubmission;

    onChange: (
        value: WeeklyReflectionSubmission
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

    function updateLearning(
        key: string,
        val: any,
    ) {

        onChange({

            ...value,

            learningReflection: {

                ...value.learningReflection,

                [key]: val,

            },

        });

    }

    function updateMentor(
        key: string,
        val: any,
    ) {

        onChange({

            ...value,

            mentorCheckIn: {

                ...value.mentorCheckIn,

                [key]: val,

            },

        });

    }

    const canSubmit = useMemo(() => {

        const learning =
            value.learningReflection;

        const mentor =
            value.mentorCheckIn;

        if (
            learning.completedAllTasks === false &&
            !learning.reason
        ) {
            return false;
        }

        if (!learning.difficultyType)
            return false;

        if (
            learning.confidenceRating <
            1 ||
            learning.confidenceRating >
            5
        )
            return false;

        if (!mentor.overallWeek)
            return false;

        if (!mentor.motivationLevel)
            return false;

        return true;

    }, [value]);

    return (

        <div className="space-y-8">

            <div>

                <h2 className="text-2xl font-semibold">

                    Weekly Reflection

                </h2>

                <p className="mt-2 text-sm text-slate-500">

                    Help your Career Companion understand how your week went.

                </p>

            </div>

            {/* Completed Tasks */}

            <div className="space-y-3">

                <label className="font-medium">

                    Did you complete all your planned tasks?

                </label>

                <div className="flex gap-6">

                    <label>

                        <input
                            type="radio"
                            checked={
                                value.learningReflection.completedAllTasks === true
                            }
                            onChange={() =>
                                updateLearning(
                                    "completedAllTasks",
                                    true
                                )
                            }
                        />

                        <span className="ml-2">Yes</span>

                    </label>

                    <label>

                        <input
                            type="radio"
                            checked={
                                value.learningReflection.completedAllTasks === false
                            }
                            onChange={() =>
                                updateLearning(
                                    "completedAllTasks",
                                    false
                                )
                            }
                        />

                        <span className="ml-2">No</span>

                    </label>

                </div>

            </div>

            {value.learningReflection.completedAllTasks === false && (

                <div>

                    <label className="font-medium">

                        Biggest reason?

                    </label>

                    <select
                        className="mt-2 w-full rounded-lg border p-2"
                        value={
                            value.learningReflection.reason ?? ""
                        }
                        onChange={(e) =>
                            updateLearning(
                                "reason",
                                e.target.value
                            )
                        }
                    >
                        <option value="">
                            Select
                        </option>

                        {Object.values(
                            ReflectionReason
                        ).map(reason => (

                            <option
                                key={reason}
                                value={reason}
                            >
                                {reason.replaceAll(
                                    "_",
                                    " "
                                )}

                            </option>

                        ))}

                    </select>

                </div>

            )}

            {/* Difficulty */}

            <div>

                <label className="font-medium">

                    Which area was most difficult?

                </label>

                <select
                    className="mt-2 w-full rounded-lg border p-2"
                    value={
                        value.learningReflection
                            .difficultyType ?? ""
                    }
                    onChange={(e) =>
                        updateLearning(
                            "difficultyType",
                            e.target.value
                        )
                    }
                >
                    <option value="">
                        Select
                    </option>

                    {Object.values(
                        DifficultyType
                    ).map(type => (

                        <option
                            key={type}
                            value={type}
                        >
                            {type.replaceAll(
                                "_",
                                " "
                            )}
                        </option>

                    ))}

                </select>

            </div>

            {/* Confidence */}

            <div>

                <label className="font-medium">

                    Confidence (1-5)

                </label>

                <input

                    type="range"

                    min={1}

                    max={5}

                    value={
                        value.learningReflection
                            .confidenceRating
                    }

                    onChange={(e) =>
                        updateLearning(
                            "confidenceRating",
                            Number(
                                e.target.value
                            )
                        )
                    }

                    className="w-full"

                />

                <p className="text-sm text-slate-500">

                    {
                        value.learningReflection
                            .confidenceRating
                    } / 5

                </p>

            </div>

            {/* Mentor */}

            <div className="border-t pt-6">

                <h3 className="text-lg font-semibold">

                    Mentor Check-in

                </h3>

            </div>

            <div>

                <label className="font-medium">

                    Overall Week

                </label>

                <select

                    className="mt-2 w-full rounded-lg border p-2"

                    value={
                        value.mentorCheckIn
                            .overallWeek ?? ""
                    }

                    onChange={(e) =>
                        updateMentor(
                            "overallWeek",
                            e.target.value
                        )
                    }

                >

                    <option value="">
                        Select
                    </option>

                    {Object.values(
                        OverallWeek
                    ).map(item => (

                        <option
                            key={item}
                            value={item}
                        >
                            {item.replaceAll(
                                "_",
                                " "
                            )}
                        </option>

                    ))}

                </select>

            </div>

            <div>

                <label className="font-medium">

                    Motivation

                </label>

                <select

                    className="mt-2 w-full rounded-lg border p-2"

                    value={
                        value.mentorCheckIn
                            .motivationLevel ?? ""
                    }

                    onChange={(e) =>
                        updateMentor(
                            "motivationLevel",
                            e.target.value
                        )
                    }

                >

                    <option value="">
                        Select
                    </option>

                    {Object.values(
                        MotivationLevel
                    ).map(item => (

                        <option
                            key={item}
                            value={item}
                        >
                            {item.replaceAll(
                                "_",
                                " "
                            )}
                        </option>

                    ))}

                </select>

            </div>

            <textarea

                rows={3}

                placeholder="External factors"

                value={
                    value.mentorCheckIn
                        .externalFactors ?? ""
                }

                onChange={(e) =>
                    updateMentor(
                        "externalFactors",
                        e.target.value
                    )
                }

                className="w-full rounded-lg border p-3"

            />

            <textarea

                rows={3}

                placeholder="Career concerns"

                value={
                    value.mentorCheckIn
                        .careerConcern ?? ""
                }

                onChange={(e) =>
                    updateMentor(
                        "careerConcern",
                        e.target.value
                    )
                }

                className="w-full rounded-lg border p-3"

            />

            <textarea

                rows={3}

                placeholder="Need help with"

                value={
                    value.mentorCheckIn
                        .helpNeeded ?? ""
                }

                onChange={(e) =>
                    updateMentor(
                        "helpNeeded",
                        e.target.value
                    )
                }

                className="w-full rounded-lg border p-3"

            />

            <textarea

                rows={4}

                placeholder="Anything else?"

                value={
                    value.additionalComments ??
                    ""
                }

                onChange={(e) =>
                    onChange({

                        ...value,

                        additionalComments:
                            e.target.value,

                    })
                }

                className="w-full rounded-lg border p-3"

            />

            <div className="flex justify-between">

                <button

                    onClick={onBack}

                    className="rounded-lg border px-5 py-2"

                >

                    Back

                </button>

                <button

                    disabled={
                        !canSubmit ||
                        isSubmitting
                    }

                    onClick={onSubmit}

                    className="
                        rounded-lg
                        bg-slate-900
                        px-6
                        py-2
                        text-white
                        disabled:opacity-50
                    "

                >

                    {isSubmitting
                        ? "Submitting..."
                        : "Generate Weekly Report"}

                </button>

            </div>

        </div>

    );

}
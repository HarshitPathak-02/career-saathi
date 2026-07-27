import {
    RotateCcw,
    Sparkles,
} from "lucide-react";

import {
    useEffect,
} from "react";

import type {
    WeeklyReviewAssessmentSkillInput,
    WeeklyReviewPreparation,
} from "../types/weekly-review.types";

interface Props {

    review:
    WeeklyReviewPreparation;

    values:
    WeeklyReviewAssessmentSkillInput[];

    onChange: (
        values:
            WeeklyReviewAssessmentSkillInput[]
    ) => void;

    onBack: () => void;

    onContinue: () => void;

}

export default function AssessmentScoresStep({

    review,

    values,

    onChange,

    onBack,

    onContinue,

}: Props) {

    /*
    |--------------------------------------------------------------------------
    | Initialize
    |--------------------------------------------------------------------------
    */

    useEffect(() => {

        if (
            values.length > 0
        ) {

            return;

        }

        onChange(

            review.skills.map(
                skill => ({

                    userSkillId:
                        skill.userSkillId,

                    obtainedMarks: 0,

                    totalMarks: 100,

                    assessmentMethod:
                        "PLATFORM",

                })
            )

        );

    }, [
        review.skills,
        values.length,
        onChange,
    ]);

    /*
    |--------------------------------------------------------------------------
    | Update
    |--------------------------------------------------------------------------
    */

    function updateSkill(

        index: number,

        key:
            | "obtainedMarks"
            | "totalMarks",

        value: number

    ) {

        const updated =
            [...values];

        const current =
            updated[index];

        if (!current) {
            return;
        }

        updated[index] = {

            ...current,

            [key]:
                value,

        };

        onChange(
            updated
        );

    }

    /*
    |--------------------------------------------------------------------------
    | Validation
    |--------------------------------------------------------------------------
    */

    const canContinue =

        values.length ===
        review.skills.length &&

        values.every(

            item =>

                item.totalMarks > 0 &&

                item.obtainedMarks >= 0 &&

                item.obtainedMarks <=
                item.totalMarks

        );

    /*
    |--------------------------------------------------------------------------
    | UI
    |--------------------------------------------------------------------------
    */

    return (

        <div className="space-y-6">

            <div>

                <h2 className="text-2xl font-semibold text-slate-900">

                    Enter Assessment Scores

                </h2>

                <p className="mt-2 text-sm text-slate-500">

                    Enter your assessment result for every skill covered
                    or revised during this mission.

                </p>

            </div>

            <div className="space-y-5">

                {review.skills.map(

                    (
                        skill,
                        index
                    ) => {

                        const score =
                            values[index];

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
                                    shadow-sm
                                "
                            >

                                {/* Header */}

                                <div className="flex flex-wrap items-start justify-between gap-3">

                                    <div>

                                        <div className="flex items-center gap-2">

                                            <h3 className="text-lg font-semibold text-slate-900">

                                                {skill.skillName}

                                            </h3>

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

                                            Current skill score:

                                            {" "}

                                            <span className="font-semibold text-slate-700">

                                                {skill.currentScore}%

                                            </span>

                                        </p>

                                    </div>

                                    {isRevision &&
                                        skill.previousPercentage !== null && (

                                            <div className="rounded-lg bg-amber-50 px-3 py-2 text-sm">

                                                <span className="text-slate-500">

                                                    Before revision

                                                </span>

                                                <span className="ml-2 font-semibold text-amber-700">

                                                    {skill.previousPercentage}%

                                                </span>

                                            </div>

                                        )}

                                </div>

                                {/* New Skill Context */}

                                {!isRevision &&
                                    skill.roadmapItems.length > 0 && (

                                        <div className="mt-4 rounded-lg bg-slate-50 p-4">

                                            <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">

                                                Covered this week

                                            </p>

                                            <div className="mt-2 space-y-2">

                                                {skill.roadmapItems.map(
                                                    item => (

                                                        <div
                                                            key={
                                                                item.id
                                                            }
                                                        >

                                                            <p className="text-sm font-medium text-slate-800">

                                                                {item.title}

                                                            </p>

                                                            <p className="text-xs text-slate-500">

                                                                {item.description}

                                                            </p>

                                                        </div>

                                                    )
                                                )}

                                            </div>

                                        </div>

                                    )}

                                {/* Revision Topics */}

                                {isRevision &&
                                    skill.revisionTopics.length > 0 && (

                                        <div className="mt-4 rounded-lg border border-amber-100 bg-amber-50/50 p-4">

                                            <p className="text-xs font-semibold uppercase tracking-wide text-amber-700">

                                                Revision Focus

                                            </p>

                                            <div className="mt-2 flex flex-wrap gap-2">

                                                {skill.revisionTopics.map(
                                                    topic => (

                                                        <span
                                                            key={
                                                                topic
                                                            }
                                                            className="
                                                            rounded-md
                                                            border
                                                            border-amber-200
                                                            bg-white
                                                            px-2.5
                                                            py-1
                                                            text-xs
                                                            text-slate-700
                                                        "
                                                        >

                                                            {topic}

                                                        </span>

                                                    )
                                                )}

                                            </div>

                                        </div>

                                    )}

                                {/* Marks */}

                                <div className="mt-5 grid gap-4 sm:grid-cols-2">

                                    <div>

                                        <label className="text-sm font-medium text-slate-700">

                                            Obtained Marks

                                        </label>

                                        <input

                                            type="number"

                                            min={0}

                                            max={
                                                score?.totalMarks ??
                                                undefined
                                            }

                                            value={
                                                score?.obtainedMarks ??
                                                0
                                            }

                                            onChange={e =>

                                                updateSkill(

                                                    index,

                                                    "obtainedMarks",

                                                    Number(
                                                        e.target.value
                                                    )

                                                )

                                            }

                                            className="
                                                mt-2
                                                w-full
                                                rounded-lg
                                                border
                                                border-slate-300
                                                px-3
                                                py-2.5
                                                outline-none
                                                transition
                                                focus:border-indigo-500
                                                focus:ring-2
                                                focus:ring-indigo-100
                                            "

                                        />

                                    </div>

                                    <div>

                                        <label className="text-sm font-medium text-slate-700">

                                            Total Marks

                                        </label>

                                        <input

                                            type="number"

                                            min={1}

                                            value={
                                                score?.totalMarks ??
                                                100
                                            }

                                            onChange={e =>

                                                updateSkill(

                                                    index,

                                                    "totalMarks",

                                                    Number(
                                                        e.target.value
                                                    )

                                                )

                                            }

                                            className="
                                                mt-2
                                                w-full
                                                rounded-lg
                                                border
                                                border-slate-300
                                                px-3
                                                py-2.5
                                                outline-none
                                                transition
                                                focus:border-indigo-500
                                                focus:ring-2
                                                focus:ring-indigo-100
                                            "

                                        />

                                    </div>

                                </div>

                                {/* Invalid Score */}

                                {score &&
                                    (
                                        score.totalMarks <= 0 ||
                                        score.obtainedMarks < 0 ||
                                        score.obtainedMarks >
                                        score.totalMarks
                                    ) && (

                                        <p className="mt-3 text-sm text-red-600">

                                            Obtained marks must be between 0 and total marks.

                                        </p>

                                    )}

                            </div>

                        );

                    }

                )}

            </div>

            {/* Navigation */}

            <div className="flex justify-between border-t border-slate-200 pt-6">

                <button
                    type="button"
                    onClick={
                        onBack
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
                    "
                >

                    Back

                </button>

                <button
                    type="button"
                    disabled={
                        !canContinue
                    }
                    onClick={
                        onContinue
                    }
                    className="
                        rounded-lg
                        bg-slate-900
                        px-5
                        py-2.5
                        font-medium
                        text-white
                        hover:bg-slate-800
                        disabled:cursor-not-allowed
                        disabled:opacity-50
                    "
                >

                    Continue

                </button>

            </div>

        </div>

    );

}
import {
    useEffect,
} from "react";

import type {
    WeeklyAssessmentSkillInput,
    WeeklyReviewPreparation,
} from "../types/weekly-review.types";

interface Props {

    review: WeeklyReviewPreparation;

    values: WeeklyAssessmentSkillInput[];

    onChange: (
        values: WeeklyAssessmentSkillInput[]
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

        if (values.length > 0) {
            return;
        }

        onChange(

            review.skills.map(skill => ({

                userSkillId:
                    skill.userSkillId,

                obtainedMarks: 0,

                totalMarks: 100,

            }))

        );

    }, []);

    /*
    |--------------------------------------------------------------------------
    | Update
    |--------------------------------------------------------------------------
    */

    function updateSkill(

        index: number,

        key:
            "obtainedMarks" |
            "totalMarks",

        value: number

    ) {

        const updated =
            [...values];

        updated[index] = {

            ...updated[index],

            [key]: value,

        };

        onChange(updated);

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

    return (

        <div className="space-y-6">

            <div>

                <h2 className="text-2xl font-semibold">

                    Enter Assessment Scores

                </h2>

                <p className="mt-2 text-sm text-slate-500">

                    Enter the score you obtained for
                    each skill.

                </p>

            </div>

            <div className="space-y-5">

                {

                    review.skills.map(

                        (

                            skill,

                            index

                        ) => (

                            <div
                                key={
                                    skill.userSkillId
                                }
                                className="
                                    rounded-xl
                                    border
                                    bg-white
                                    p-5
                                "
                            >

                                <h3 className="font-semibold">

                                    {
                                        skill.skillName
                                    }

                                </h3>

                                <p className="mt-1 text-sm text-slate-500">

                                    Current Score :

                                    {" "}

                                    {
                                        skill.currentScore
                                    }%

                                </p>

                                <div className="mt-5 grid grid-cols-2 gap-4">

                                    <div>

                                        <label
                                            className="text-sm font-medium"
                                        >

                                            Obtained Marks

                                        </label>

                                        <input

                                            type="number"

                                            min={0}

                                            value={
                                                values[index]
                                                    ?.obtainedMarks ??
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
                                                px-3
                                                py-2
                                            "

                                        />

                                    </div>

                                    <div>

                                        <label
                                            className="text-sm font-medium"
                                        >

                                            Total Marks

                                        </label>

                                        <input

                                            type="number"

                                            min={1}

                                            value={
                                                values[index]
                                                    ?.totalMarks ??
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
                                                px-3
                                                py-2
                                            "

                                        />

                                    </div>

                                </div>

                            </div>

                        )

                    )

                }

            </div>

            <div className="flex justify-between">

                <button

                    onClick={onBack}

                    className="
                        rounded-lg
                        border
                        px-5
                        py-2
                    "

                >

                    Back

                </button>

                <button

                    disabled={!canContinue}

                    onClick={onContinue}

                    className="
                        rounded-lg
                        bg-slate-900
                        px-5
                        py-2
                        text-white
                        disabled:opacity-50
                    "

                >

                    Continue

                </button>

            </div>

        </div>

    );

}
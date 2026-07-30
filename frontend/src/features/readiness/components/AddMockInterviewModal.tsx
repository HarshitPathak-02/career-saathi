import {
    useState,
    type FormEvent,
    type ReactNode,
} from "react";

import {
    AlertCircle,
    Loader2,
    X,
} from "lucide-react";

import {
    useCreateMockInterviewMutation,
} from "../../mock-interviews/api/mockInterviewApi";

import type {
    MockInterviewType,
} from "../../mock-interviews/types/mock-interview.types";


interface AddMockInterviewModalProps {

    open:
    boolean;

    careerJourneyId:
    string;

    onClose:
    () => void;

}


interface FormState {

    platform:
    string;

    interviewType:
    MockInterviewType;

    overallScore:
    string;

    technicalScore:
    string;

    problemSolvingScore:
    string;

    communicationScore:
    string;

    feedback:
    string;

    interviewedAt:
    string;

}


const createInitialState =
    (): FormState => ({

        platform:
            "",

        interviewType:
            "mixed",

        overallScore:
            "",

        technicalScore:
            "",

        problemSolvingScore:
            "",

        communicationScore:
            "",

        feedback:
            "",

        interviewedAt:
            new Date()
                .toISOString()
                .split("T")[0],

    });


export default function AddMockInterviewModal({

    open,
    careerJourneyId,
    onClose,

}: AddMockInterviewModalProps) {

    const [
        form,
        setForm,
    ] =
        useState<FormState>(
            createInitialState
        );


    const [
        createMockInterview,
        {
            isLoading,
        },
    ] =
        useCreateMockInterviewMutation();


    const [
        errorMessage,
        setErrorMessage,
    ] =
        useState<string | null>(
            null
        );


    if (!open) {

        return null;

    }


    /*
    |--------------------------------------------------------------------------
    | Change
    |--------------------------------------------------------------------------
    */

    const handleChange = (
        field:
            keyof FormState,

        value:
            string
    ) => {

        setForm(
            previous => ({

                ...previous,

                [field]:
                    value,

            })
        );

    };


    /*
    |--------------------------------------------------------------------------
    | Validate Score
    |--------------------------------------------------------------------------
    */

    const parseScore = (
        value:
            string
    ) => {

        const score =
            Number(value);

        if (
            !Number.isFinite(score) ||
            score < 0 ||
            score > 100
        ) {

            return null;

        }

        return score;

    };


    /*
    |--------------------------------------------------------------------------
    | Submit
    |--------------------------------------------------------------------------
    */

    const handleSubmit =
        async (
            event:
                FormEvent<HTMLFormElement>
        ) => {

            event.preventDefault();

            setErrorMessage(
                null
            );


            const overallScore =
                parseScore(
                    form.overallScore
                );

            const technicalScore =
                parseScore(
                    form.technicalScore
                );

            const problemSolvingScore =
                parseScore(
                    form.problemSolvingScore
                );

            const communicationScore =
                parseScore(
                    form.communicationScore
                );


            if (
                overallScore === null ||
                technicalScore === null ||
                problemSolvingScore === null ||
                communicationScore === null
            ) {

                setErrorMessage(
                    "All scores must be between 0 and 100."
                );

                return;

            }


            if (
                !form.platform.trim()
            ) {

                setErrorMessage(
                    "Please enter the mock interview platform."
                );

                return;

            }


            if (
                !form.interviewedAt
            ) {

                setErrorMessage(
                    "Please select the interview date."
                );

                return;

            }


            try {

                await createMockInterview({

                    careerJourneyId,

                    platform:
                        form.platform.trim(),

                    interviewType:
                        form.interviewType,

                    overallScore,

                    technicalScore,

                    problemSolvingScore,

                    communicationScore,

                    feedback:
                        form.feedback.trim(),

                    interviewedAt:
                        new Date(
                            `${form.interviewedAt}T12:00:00`
                        ).toISOString(),

                }).unwrap();


                setForm(
                    createInitialState()
                );

                onClose();

            }
            catch (error) {

                console.error(
                    "Failed to create mock interview:",
                    error
                );

                setErrorMessage(
                    "Unable to save the mock interview. Please check the details and try again."
                );

            }

        };


    /*
    |--------------------------------------------------------------------------
    | UI
    |--------------------------------------------------------------------------
    */

    return (

        <div
            className="
                fixed
                inset-0
                z-[100]
                flex
                items-center
                justify-center
                bg-slate-950/50
                p-4
                backdrop-blur-sm
            "
        >

            <div
                className="
                    max-h-[90vh]
                    w-full
                    max-w-2xl
                    overflow-y-auto
                    rounded-3xl
                    bg-white
                    shadow-2xl
                "
            >

                {/* Header */}

                <div
                    className="
                        sticky
                        top-0
                        z-10
                        flex
                        items-start
                        justify-between
                        gap-4
                        border-b
                        border-slate-200
                        bg-white
                        px-6
                        py-5
                    "
                >

                    <div>

                        <h2
                            className="
                                text-xl
                                font-bold
                                text-slate-900
                            "
                        >
                            Add Mock Interview
                        </h2>

                        <p
                            className="
                                mt-1
                                text-sm
                                text-slate-500
                            "
                        >
                            Enter the results from your
                            external mock interview.
                        </p>

                    </div>


                    <button
                        type="button"
                        disabled={
                            isLoading
                        }
                        onClick={
                            onClose
                        }
                        className="
                            rounded-lg
                            p-2
                            text-slate-400
                            transition
                            hover:bg-slate-100
                            hover:text-slate-700
                        "
                    >
                        <X
                            size={20}
                        />
                    </button>

                </div>


                <form
                    onSubmit={
                        handleSubmit
                    }
                    className="p-6"
                >

                    {/* Basic Information */}

                    <div
                        className="
                            grid
                            gap-5
                            sm:grid-cols-2
                        "
                    >

                        <FormField
                            label="Platform"
                        >

                            <input
                                type="text"
                                value={
                                    form.platform
                                }
                                onChange={
                                    event =>
                                        handleChange(
                                            "platform",
                                            event.target.value
                                        )
                                }
                                placeholder="e.g. Pramp"
                                className={inputClass}
                            />

                        </FormField>


                        <FormField
                            label="Interview Type"
                        >

                            <select
                                value={
                                    form.interviewType
                                }
                                onChange={
                                    event =>
                                        handleChange(
                                            "interviewType",
                                            event.target.value
                                        )
                                }
                                className={inputClass}
                            >

                                <option value="mixed">
                                    Mixed
                                </option>

                                <option value="technical">
                                    Technical
                                </option>

                                <option value="behavioral">
                                    Behavioral
                                </option>

                            </select>

                        </FormField>


                        <FormField
                            label="Interview Date"
                        >

                            <input
                                type="date"
                                value={
                                    form.interviewedAt
                                }
                                max={
                                    new Date()
                                        .toISOString()
                                        .split("T")[0]
                                }
                                onChange={
                                    event =>
                                        handleChange(
                                            "interviewedAt",
                                            event.target.value
                                        )
                                }
                                className={inputClass}
                            />

                        </FormField>

                    </div>


                    {/* Scores */}

                    <div
                        className="
                            mt-8
                            border-t
                            border-slate-100
                            pt-7
                        "
                    >

                        <h3
                            className="
                                font-bold
                                text-slate-900
                            "
                        >
                            Interview Scores
                        </h3>

                        <p
                            className="
                                mt-1
                                text-sm
                                text-slate-500
                            "
                        >
                            Enter each score on a scale
                            from 0 to 100.
                        </p>


                        <div
                            className="
                                mt-5
                                grid
                                gap-5
                                sm:grid-cols-2
                            "
                        >

                            <ScoreInput
                                label="Overall Score"
                                value={
                                    form.overallScore
                                }
                                onChange={
                                    value =>
                                        handleChange(
                                            "overallScore",
                                            value
                                        )
                                }
                            />

                            <ScoreInput
                                label="Technical"
                                value={
                                    form.technicalScore
                                }
                                onChange={
                                    value =>
                                        handleChange(
                                            "technicalScore",
                                            value
                                        )
                                }
                            />

                            <ScoreInput
                                label="Problem Solving"
                                value={
                                    form.problemSolvingScore
                                }
                                onChange={
                                    value =>
                                        handleChange(
                                            "problemSolvingScore",
                                            value
                                        )
                                }
                            />

                            <ScoreInput
                                label="Communication"
                                value={
                                    form.communicationScore
                                }
                                onChange={
                                    value =>
                                        handleChange(
                                            "communicationScore",
                                            value
                                        )
                                }
                            />

                        </div>

                    </div>


                    {/* Feedback */}

                    <div className="mt-7">

                        <FormField
                            label="Feedback"
                            optional
                        >

                            <textarea
                                value={
                                    form.feedback
                                }
                                onChange={
                                    event =>
                                        handleChange(
                                            "feedback",
                                            event.target.value
                                        )
                                }
                                rows={4}
                                placeholder="Paste or summarize the feedback you received..."
                                className={`
                                    ${inputClass}
                                    resize-none
                                `}
                            />

                        </FormField>

                    </div>


                    {/* Error */}

                    {errorMessage && (

                        <div
                            className="
                                mt-5
                                flex
                                items-start
                                gap-3
                                rounded-xl
                                border
                                border-red-200
                                bg-red-50
                                p-4
                            "
                        >

                            <AlertCircle
                                size={18}
                                className="
                                    mt-0.5
                                    shrink-0
                                    text-red-600
                                "
                            />

                            <p
                                className="
                                    text-sm
                                    text-red-700
                                "
                            >
                                {errorMessage}
                            </p>

                        </div>

                    )}


                    {/* Actions */}

                    <div
                        className="
                            mt-8
                            flex
                            justify-end
                            gap-3
                            border-t
                            border-slate-100
                            pt-6
                        "
                    >

                        <button
                            type="button"
                            disabled={
                                isLoading
                            }
                            onClick={
                                onClose
                            }
                            className="
                                rounded-xl
                                border
                                border-slate-200
                                px-5
                                py-2.5
                                text-sm
                                font-semibold
                                text-slate-700
                                transition
                                hover:bg-slate-50
                                disabled:opacity-50
                            "
                        >
                            Cancel
                        </button>


                        <button
                            type="submit"
                            disabled={
                                isLoading
                            }
                            className="
                                inline-flex
                                items-center
                                justify-center
                                gap-2
                                rounded-xl
                                bg-indigo-600
                                px-5
                                py-2.5
                                text-sm
                                font-semibold
                                text-white
                                transition
                                hover:bg-indigo-700
                                disabled:cursor-not-allowed
                                disabled:opacity-60
                            "
                        >

                            {isLoading && (

                                <Loader2
                                    size={17}
                                    className="
                                        animate-spin
                                    "
                                />

                            )}

                            {isLoading
                                ? "Saving..."
                                : "Save Mock Interview"
                            }

                        </button>

                    </div>

                </form>

            </div>

        </div>

    );

}


/*
|--------------------------------------------------------------------------
| Form Field
|--------------------------------------------------------------------------
*/

function FormField({

    label,
    optional = false,
    children,

}: {

    label:
    string;

    optional?:
    boolean;

    children:
    ReactNode;

}) {

    return (

        <label className="block">

            <div
                className="
                    mb-2
                    flex
                    items-center
                    gap-2
                "
            >

                <span
                    className="
                        text-sm
                        font-semibold
                        text-slate-700
                    "
                >
                    {label}
                </span>

                {optional && (

                    <span
                        className="
                            text-xs
                            text-slate-400
                        "
                    >
                        Optional
                    </span>

                )}

            </div>

            {children}

        </label>

    );

}


/*
|--------------------------------------------------------------------------
| Score Input
|--------------------------------------------------------------------------
*/

function ScoreInput({

    label,
    value,
    onChange,

}: {

    label:
    string;

    value:
    string;

    onChange:
    (value: string) => void;

}) {

    return (

        <FormField
            label={
                label
            }
        >

            <div className="relative">

                <input
                    type="number"
                    min={0}
                    max={100}
                    step={1}
                    value={
                        value
                    }
                    onChange={
                        event =>
                            onChange(
                                event.target.value
                            )
                    }
                    placeholder="0"
                    className={`
                        ${inputClass}
                        pr-14
                    `}
                />

                <span
                    className="
                        pointer-events-none
                        absolute
                        right-4
                        top-1/2
                        -translate-y-1/2
                        text-sm
                        font-medium
                        text-slate-400
                    "
                >
                    /100
                </span>

            </div>

        </FormField>

    );

}


/*
|--------------------------------------------------------------------------
| Styles
|--------------------------------------------------------------------------
*/

const inputClass =
    `
        w-full
        rounded-xl
        border
        border-slate-200
        bg-white
        px-4
        py-3
        text-sm
        text-slate-900
        outline-none
        transition
        placeholder:text-slate-400
        focus:border-indigo-400
        focus:ring-4
        focus:ring-indigo-50
    `;
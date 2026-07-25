import {
    ArrowLeft,
} from "lucide-react";

import {
    useState,
} from "react";

import {
    useNavigate,
} from "react-router-dom";

import {
    useGetCurrentWeeklyReviewQuery,
} from "../api/weeklyReviewApi";

import WeeklyReviewStepper from "../components/WeeklyReviewStepper";

import ReviewTopicsStep from "../components/ReviewTopicsStep";

export default function WeeklyReviewPage() {

    const navigate =
        useNavigate();

    const [
        currentStep,
        setCurrentStep,
    ] = useState(1);

    /*
    |--------------------------------------------------------------------------
    | Weekly Review
    |--------------------------------------------------------------------------
    */

    const {

        data: response,

        isLoading,

        isError,

        error,

    } = useGetCurrentWeeklyReviewQuery();

    /*
    |--------------------------------------------------------------------------
    | Loading
    |--------------------------------------------------------------------------
    */

    if (isLoading) {

        return (

            <div className="flex min-h-[400px] items-center justify-center">

                <p className="text-sm text-slate-500">

                    Preparing your weekly review...

                </p>

            </div>

        );

    }

    /*
    |--------------------------------------------------------------------------
    | Error
    |--------------------------------------------------------------------------
    */

    if (
        isError ||
        !response?.data
    ) {

        console.error(
            "Weekly review error:",
            error,
        );

        return (

            <div className="p-6">

                <div
                    className="
                        rounded-xl
                        border
                        border-red-200
                        bg-red-50
                        p-5
                    "
                >

                    <h2 className="font-semibold text-red-900">

                        Weekly review unavailable

                    </h2>

                    <p className="mt-1 text-sm text-red-700">

                        Your weekly review could not be loaded.
                        It may not be available yet.

                    </p>

                </div>

            </div>

        );

    }

    const review =
        response.data;

    /*
    |--------------------------------------------------------------------------
    | UI
    |--------------------------------------------------------------------------
    */

    return (

        <div className="mx-auto max-w-4xl p-6">

            {/* Back */}

            <button
                type="button"
                onClick={() =>
                    navigate(-1)
                }
                className="
                    flex
                    items-center
                    gap-2
                    text-sm
                    font-medium
                    text-slate-500
                    transition
                    hover:text-slate-900
                "
            >

                <ArrowLeft size={17} />

                Back to Mission

            </button>


            {/* Page Header */}

            <div className="mt-6">

                <p className="text-sm font-medium text-slate-500">

                    Mission #{review.missionNumber}

                </p>

                <h1 className="mt-1 text-3xl font-bold tracking-tight text-slate-900">

                    Weekly Review

                </h1>

                <p className="mt-2 text-slate-500">

                    Review your progress, record your
                    assessment results, and reflect on your
                    learning.

                </p>

            </div>


            {/* Stepper */}

            <div
                className="
                    mt-8
                    rounded-xl
                    border
                    border-slate-200
                    bg-white
                    p-6
                "
            >

                <WeeklyReviewStepper
                    currentStep={currentStep}
                />

            </div>


            {/* Content */}

            <div className="mt-8">

                {currentStep === 1 && (

                    <ReviewTopicsStep

                        review={review}

                        onContinue={() =>
                            setCurrentStep(2)
                        }

                    />

                )}


                {currentStep === 2 && (

                    <div
                        className="
                            rounded-xl
                            border
                            bg-white
                            p-8
                        "
                    >

                        Assessment Score Form

                        <div className="mt-4 flex gap-3">

                            <button
                                type="button"
                                onClick={() =>
                                    setCurrentStep(1)
                                }
                                className="
                                    rounded-lg
                                    border
                                    px-4
                                    py-2
                                    text-sm
                                "
                            >

                                Back

                            </button>

                            <button
                                type="button"
                                onClick={() =>
                                    setCurrentStep(3)
                                }
                                className="
                                    rounded-lg
                                    bg-slate-900
                                    px-4
                                    py-2
                                    text-sm
                                    text-white
                                "
                            >

                                Continue

                            </button>

                        </div>

                    </div>

                )}


                {currentStep === 3 && (

                    <div
                        className="
                            rounded-xl
                            border
                            bg-white
                            p-8
                        "
                    >

                        Student Reflection Form

                        <button
                            type="button"
                            onClick={() =>
                                setCurrentStep(2)
                            }
                            className="
                                mt-4
                                rounded-lg
                                border
                                px-4
                                py-2
                                text-sm
                            "
                        >

                            Back

                        </button>

                    </div>

                )}

            </div>

        </div>

    );

}
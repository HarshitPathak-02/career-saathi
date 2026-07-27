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
    useSubmitWeeklyReviewMutation,
} from "../api/weeklyReviewApi";

import WeeklyReviewStepper from "../components/WeeklyReviewStepper";

import ReviewTopicsStep from "../components/ReviewTopicsStep";

import AssessmentScoresStep from "../components/AssessmentScoresStep";

import StudentReflectionStep from "../components/StudentReflectionStep";

import type {
    WeeklyReviewAssessmentSkillInput,
    WeeklyReflectionSubmission,
} from "../types/weekly-review.types";

export default function WeeklyReviewPage() {

    const navigate =
        useNavigate();

    /*
    |--------------------------------------------------------------------------
    | State
    |--------------------------------------------------------------------------
    */

    const [
        currentStep,
        setCurrentStep,
    ] =
        useState(1);

    const [
        assessmentScores,
        setAssessmentScores,
    ] =
        useState<
            WeeklyReviewAssessmentSkillInput[]
        >([]);

    const [
        reflection,
        setReflection,
    ] =
        useState<WeeklyReflectionSubmission>({

            learningReflection: {

                completedAllTasks: true,

                confidenceRating: 3,

            },

            mentorCheckIn: {},

            additionalComments: "",

        });

    /*
    |--------------------------------------------------------------------------
    | Queries
    |--------------------------------------------------------------------------
    */

    const {

        data: response,

        isLoading,

        isError,

        error,

    } =
        useGetCurrentWeeklyReviewQuery();

    const [

        submitWeeklyReview,

        {
            isLoading:
            isSubmitting,
        },

    ] =
        useSubmitWeeklyReviewMutation();

    /*
    |--------------------------------------------------------------------------
    | Loading
    |--------------------------------------------------------------------------
    */

    if (isLoading) {

        return (

            <div className="flex min-h-100 items-center justify-center">

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
            error
        );

        return (

            <div className="p-6">

                <div className="rounded-xl border border-red-200 bg-red-50 p-5">

                    <h2 className="font-semibold text-red-900">

                        Weekly review unavailable

                    </h2>

                    <p className="mt-1 text-sm text-red-700">

                        Your weekly review could not be loaded.

                    </p>

                </div>

            </div>

        );

    }

    const review =
        response.data;

    /*
    |--------------------------------------------------------------------------
    | Submit
    |--------------------------------------------------------------------------
    */

    async function handleSubmit() {

        /*
        |--------------------------------------------------------------------------
        | Final Assessment Validation
        |--------------------------------------------------------------------------
        */

        if (
            assessmentScores.length !==
            review.skills.length
        ) {

            console.error(
                "Assessment scores are incomplete."
            );

            return;

        }

        const hasInvalidScore =
            assessmentScores.some(
                skill =>
                    skill.totalMarks <= 0 ||
                    skill.obtainedMarks < 0 ||
                    skill.obtainedMarks >
                    skill.totalMarks
            );

        if (hasInvalidScore) {

            console.error(
                "Assessment contains invalid marks."
            );

            return;

        }

        /*
        |--------------------------------------------------------------------------
        | Remove Conditional / Empty Reflection Values
        |--------------------------------------------------------------------------
        */

        const learningReflection = {

            ...reflection.learningReflection,

            ...(
                reflection.learningReflection
                    .completedAllTasks
                    ? {
                        reason:
                            undefined,
                    }
                    : {}
            ),

        };

        try {

            const result =
                await submitWeeklyReview({

                    assessment: {

                        assessmentId:
                            review.assessmentId,

                        skills:
                            assessmentScores,

                    },

                    reflection: {

                        ...reflection,

                        learningReflection,

                    },

                }).unwrap();

            console.log(
                "Weekly review completed:",
                result
            );

            navigate(
                "/missions"
            );

        } catch (err) {

            console.error(
                "Weekly review submission failed",
                err
            );

        }

    }

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
                    hover:text-slate-900
                "
            >

                <ArrowLeft
                    size={17}
                />

                Back to Mission

            </button>

            {/* Header */}

            <div className="mt-6">

                <p className="text-sm font-medium text-indigo-600">

                    Mission {review.missionNumber}
                    {" • "}
                    Week {review.weekNumber}

                </p>

                <h1 className="mt-1 text-3xl font-bold text-slate-900">

                    Weekly Review

                </h1>

                <p className="mt-2 text-slate-500">

                    Review your progress, record your assessment
                    results, and reflect on your learning.

                </p>

            </div>

            {/* Stepper */}

            <div className="mt-8 rounded-xl border border-slate-200 bg-white p-6 shadow-sm">

                <WeeklyReviewStepper
                    currentStep={
                        currentStep
                    }
                />

            </div>

            {/* Content */}

            <div className="mt-8">

                {currentStep === 1 && (

                    <ReviewTopicsStep

                        review={
                            review
                        }

                        onContinue={() =>
                            setCurrentStep(2)
                        }

                    />

                )}

                {currentStep === 2 && (

                    <AssessmentScoresStep

                        review={
                            review
                        }

                        values={
                            assessmentScores
                        }

                        onChange={
                            setAssessmentScores
                        }

                        onBack={() =>
                            setCurrentStep(1)
                        }

                        onContinue={() =>
                            setCurrentStep(3)
                        }

                    />

                )}

                {currentStep === 3 && (

                    <StudentReflectionStep

                        value={
                            reflection
                        }

                        onChange={
                            setReflection
                        }

                        onBack={() =>
                            setCurrentStep(2)
                        }

                        onSubmit={
                            handleSubmit
                        }

                        isSubmitting={
                            isSubmitting
                        }

                    />

                )}

            </div>

        </div>

    );

}
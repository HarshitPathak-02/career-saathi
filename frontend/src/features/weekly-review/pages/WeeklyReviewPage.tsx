import {
    useState,
} from "react";

import {
    useNavigate,
} from "react-router-dom";

import {
    AlertCircle,
} from "lucide-react";

import {
    showSuccess,
    showError,
} from "../../../shared/lib/toast";

import {
    getApiErrorMessage,
} from "../../../shared/lib/getApiErrorMessage";

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

    const {

        data: response,

        isLoading,

        isError,

        error,

    } =
        useGetCurrentWeeklyReviewQuery(undefined, {
            refetchOnMountOrArgChange: true,
        });

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

        const errorMsg =
            getApiErrorMessage(error) ||
            "Your weekly review could not be loaded.";

        const isNotReady =
            errorMsg.toLowerCase().includes("not available yet") ||
            (error as any)?.status === 409;

        return (

            <div className="mx-auto max-w-2xl px-4 py-16 sm:px-6">

                <div className="rounded-2xl border border-amber-200 bg-amber-50/70 p-8 text-center shadow-sm">

                    <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-amber-100 text-amber-700">
                        <AlertCircle size={28} />
                    </div>

                    <h2 className="mt-4 text-xl font-bold text-slate-900">
                        {isNotReady
                            ? "Weekly Review Not Yet Available"
                            : "Weekly Review Unavailable"}
                    </h2>

                    <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-600">
                        {isNotReady
                            ? "Weekly review unlocks on Day 7 of your active weekly mission. Please complete your daily tasks first."
                            : errorMsg}
                    </p>

                    <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
                        <button
                            type="button"
                            onClick={() => navigate("/workspace")}
                            className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-blue-700 transition"
                        >
                            Return to Workspace
                        </button>

                        <button
                            type="button"
                            onClick={() => navigate("/missions")}
                            className="inline-flex items-center gap-2 rounded-xl border border-slate-300 bg-white px-5 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50 transition"
                        >
                            View Missions
                        </button>
                    </div>

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

            showSuccess(
                "Weekly review submitted successfully!"
            );

            navigate(
                "/workspace"
            );

        } catch (err) {

            console.error(
                "Weekly review submission failed",
                err
            );

            showError(
                getApiErrorMessage(err) ||
                "Weekly review submission failed."
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
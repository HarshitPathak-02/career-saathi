import {
    ArrowRight,
    BrainCircuit,
    CheckCircle2,
    ClipboardCheck,
    Loader2,
    RefreshCw,
    Target,
    Trophy,
} from "lucide-react";

import {
    useState,
} from "react";

import AddMockInterviewModal
    from "../components/AddMockInterviewModal";

import {
    useGetWorkspaceQuery,
} from "../../workspace/api/workspaceApi";

import {
    useEvaluateReadinessMutation,
    useGetReadinessStateQuery,
} from "../api/readinessApi";

import type {
    ReadinessBreakdown,
    ReadinessWeakArea,
} from "../types/readiness.types";
import MockInterviewHistory from "../components/MockInterviewHistory";
import { useGenerateAdaptiveRoadmapMutation } from "../../roadmap/api/roadmapApi";
import { useNavigate } from "react-router-dom";


/*
|--------------------------------------------------------------------------
| Constants
|--------------------------------------------------------------------------
|
| This mirrors the current backend requirement.
| Later we should return this value from the readiness API itself.
|
*/

const MINIMUM_MOCK_INTERVIEWS =
    3;


/*
|--------------------------------------------------------------------------
| Readiness Page
|--------------------------------------------------------------------------
*/

export default function ReadinessPage() {

    const [
        isMockInterviewModalOpen,
        setIsMockInterviewModalOpen,
    ] =
        useState(false);

    const [
        showAdaptiveRoadmapModal,
        setShowAdaptiveRoadmapModal,
    ] =
        useState(false);


    const navigate =
        useNavigate();


    const [
        generateAdaptiveRoadmap,
        {
            isLoading:
            isGeneratingAdaptiveRoadmap,
        },
    ] =
        useGenerateAdaptiveRoadmapMutation();

    const [
        evaluateReadiness,
        {
            isLoading:
            isEvaluatingReadiness,
        },
    ] =
        useEvaluateReadinessMutation();

    const handleEvaluateReadiness =
        async () => {

            if (
                !careerJourneyId ||
                isEvaluatingReadiness
            ) {
                return;
            }

            try {

                await evaluateReadiness(
                    careerJourneyId
                ).unwrap();

                /*
                 * evaluateReadiness invalidates
                 * the Readiness tag, so the
                 * readiness query will refetch
                 * automatically.
                 */

            } catch (error) {

                console.error(
                    "Failed to evaluate readiness:",
                    error
                );

            }

        };

    const handleGenerateAdaptiveRoadmap =
        async () => {

            if (
                !careerJourneyId ||
                isGeneratingAdaptiveRoadmap
            ) {
                return;
            }

            try {

                await generateAdaptiveRoadmap(
                    careerJourneyId
                ).unwrap();


                /*
                 * Close Confirmation Modal
                 */

                setShowAdaptiveRoadmapModal(
                    false
                );


                /*
                 * Adaptive roadmap generation
                 * changes the career journey:
                 *
                 * READINESS
                 *      ↓
                 * ACTIVE
                 *
                 * Roadmap queries are invalidated
                 * by the mutation.
                 */

                navigate(
                    "/roadmap",
                    {
                        replace: true,
                    }
                );

            } catch (error) {

                console.error(
                    "Failed to generate adaptive roadmap:",
                    error
                );

            }

        };

    /*
    |--------------------------------------------------------------------------
    | Workspace
    |--------------------------------------------------------------------------
    */

    const {
        data:
        workspaceResponse,

        isLoading:
        isWorkspaceLoading,

        isError:
        isWorkspaceError,

        error:
        workspaceError,
    } =
        useGetWorkspaceQuery();


    const careerJourneyId =
        workspaceResponse
            ?.data
            ?.careerJourney
            ?.id;


    /*
    |--------------------------------------------------------------------------
    | Readiness
    |--------------------------------------------------------------------------
    */

    const {
        data:
        readinessResponse,

        isLoading:
        isReadinessLoading,

        isFetching:
        isReadinessFetching,

        isError:
        isReadinessError,

        error:
        readinessError,

        refetch:
        refetchReadiness,
    } =
        useGetReadinessStateQuery(
            careerJourneyId ?? "",
            {
                skip:
                    !careerJourneyId,
            }
        );


    /*
    |--------------------------------------------------------------------------
    | Loading
    |--------------------------------------------------------------------------
    */


    if (
        isWorkspaceLoading ||
        isReadinessLoading
    ) {

        return (
            <ReadinessLoadingState />
        );

    }


    /*
    |--------------------------------------------------------------------------
    | Error
    |--------------------------------------------------------------------------
    */

    if (
        isWorkspaceError ||
        isReadinessError ||
        !careerJourneyId
    ) {

        console.error(
            "Failed to load readiness:",
            {
                workspaceError,
                readinessError,
            }
        );

        return (

            <div className="p-6">

                <div
                    className="
                        mx-auto
                        max-w-6xl
                        rounded-2xl
                        border
                        border-red-200
                        bg-red-50
                        p-6
                    "
                >

                    <h2
                        className="
                            font-semibold
                            text-red-900
                        "
                    >
                        Unable to load interview readiness
                    </h2>

                    <p
                        className="
                            mt-2
                            text-sm
                            leading-6
                            text-red-700
                        "
                    >
                        We couldn't evaluate your interview
                        readiness right now.
                    </p>

                    <button
                        type="button"
                        onClick={() =>
                            refetchReadiness()
                        }
                        className="
                            mt-5
                            inline-flex
                            items-center
                            gap-2
                            rounded-xl
                            bg-red-600
                            px-4
                            py-2.5
                            text-sm
                            font-semibold
                            text-white
                            transition
                            hover:bg-red-700
                        "
                    >
                        <RefreshCw
                            size={16}
                        />

                        Try Again
                    </button>

                </div>

            </div>

        );

    }


    const readiness =
        readinessResponse?.data;


    if (!readiness) {

        return null;

    }


    /*
    |--------------------------------------------------------------------------
    | UI
    |--------------------------------------------------------------------------
    */

    return (

        <>

            <div className="p-6">

                <div
                    className="
                    mx-auto
                    max-w-6xl
                "
                >

                    {/* Header */}

                    <div
                        className="
                        flex
                        flex-col
                        gap-5
                        sm:flex-row
                        sm:items-start
                        sm:justify-between
                    "
                    >

                        <div>

                            <div
                                className="
                                flex
                                items-center
                                gap-2
                                text-indigo-600
                            "
                            >

                                <BrainCircuit
                                    size={18}
                                />

                                <span
                                    className="
                                    text-sm
                                    font-semibold
                                    uppercase
                                    tracking-wide
                                "
                                >
                                    Interview Readiness
                                </span>

                            </div>

                            <h1
                                className="
                                mt-3
                                text-3xl
                                font-bold
                                tracking-tight
                                text-slate-900
                            "
                            >
                                Are you ready for interviews?
                            </h1>

                            <p
                                className="
                                mt-2
                                max-w-2xl
                                text-slate-500
                            "
                            >
                                Your learning roadmap is complete.
                                Now CareerSaathi uses mock interview
                                performance and your current skill
                                scores to measure real interview
                                readiness.
                            </p>

                        </div>


                        <button
                            type="button"
                            disabled={
                                isReadinessFetching
                            }
                            onClick={() =>
                                refetchReadiness()
                            }
                            className="
                            inline-flex
                            shrink-0
                            items-center
                            justify-center
                            gap-2
                            rounded-xl
                            border
                            border-slate-200
                            bg-white
                            px-4
                            py-2.5
                            text-sm
                            font-semibold
                            text-slate-700
                            shadow-sm
                            transition
                            hover:bg-slate-50
                            disabled:cursor-not-allowed
                            disabled:opacity-60
                        "
                        >

                            <RefreshCw
                                size={16}
                                className={
                                    isReadinessFetching
                                        ? "animate-spin"
                                        : ""
                                }
                            />

                            Refresh

                        </button>

                    </div>


                    {/* Status */}

                    <div className="mt-10">

                        {
                            readiness.status ===
                            "insufficient_data"
                            && (

                                <InsufficientDataState

                                    available={
                                        readiness
                                            .availableMockInterviews
                                    }

                                    required={
                                        readiness
                                            .minimumMockInterviewsRequired
                                    }

                                    onAddMock={() =>
                                        setIsMockInterviewModalOpen(
                                            true
                                        )
                                    }

                                />

                            )
                        }

                        {
                            readiness.status ===
                            "ready_to_evaluate"
                            && (

                                <ReadyToEvaluateState

                                    available={
                                        readiness
                                            .availableMockInterviews
                                    }

                                    required={
                                        readiness
                                            .minimumMockInterviewsRequired
                                    }

                                    isEvaluating={
                                        isEvaluatingReadiness
                                    }

                                    onEvaluate={
                                        handleEvaluateReadiness
                                    }

                                    onAddMock={() =>
                                        setIsMockInterviewModalOpen(
                                            true
                                        )
                                    }

                                />



                            )
                        }

                        {
                            readiness.status ===
                            "not_ready"
                            && (

                                <NotReadyState
                                    score={
                                        readiness
                                            .readinessScore
                                    }
                                    breakdown={
                                        readiness
                                            .breakdown
                                    }
                                    weakAreas={
                                        readiness
                                            .weakAreas
                                    }
                                    onGenerateAdaptiveRoadmap={() =>
                                        setShowAdaptiveRoadmapModal(
                                            true
                                        )
                                    }
                                />

                            )
                        }


                        {
                            readiness.status ===
                            "ready"
                            && (

                                <ReadyState
                                    score={
                                        readiness
                                            .readinessScore
                                    }
                                    breakdown={
                                        readiness
                                            .breakdown
                                    }
                                />

                            )
                        }

                    </div>
                    {/* Mock Interview History */}

                    <div className="mt-6">

                        <MockInterviewHistory
                            careerJourneyId={
                                careerJourneyId
                            }
                        />

                    </div>

                </div>

            </div>
            <AddMockInterviewModal
                open={
                    isMockInterviewModalOpen
                }
                careerJourneyId={
                    careerJourneyId
                }
                onClose={() =>
                    setIsMockInterviewModalOpen(
                        false
                    )
                }
            />
            <AdaptiveRoadmapConfirmationModal
                open={
                    showAdaptiveRoadmapModal
                }
                loading={
                    isGeneratingAdaptiveRoadmap
                }
                weakAreas={
                    readiness.weakAreas
                }
                onClose={() =>
                    setShowAdaptiveRoadmapModal(
                        false
                    )
                }
                onConfirm={
                    handleGenerateAdaptiveRoadmap
                }
            />

        </>

    );

}


/*
|--------------------------------------------------------------------------
| Insufficient Data
|--------------------------------------------------------------------------
*/

interface InsufficientDataStateProps {


    available:
    number;

    required:
    number;

    onAddMock:
    () => void;

}


function InsufficientDataState({

    available,
    required,
    onAddMock,

}: InsufficientDataStateProps) {

    const remaining =
        Math.max(
            0,
            required -
            available
        );


    const progress =
        required > 0
            ? Math.min(
                100,
                (
                    available /
                    required
                ) * 100
            )
            : 0;

    return (

        <div
            className="
                overflow-hidden
                rounded-3xl
                border
                border-slate-200
                bg-white
                shadow-sm
            "
        >

            <div
                className="
                    grid
                    lg:grid-cols-[1.2fr_0.8fr]
                "
            >

                {/* Content */}

                <div
                    className="
                        p-7
                        sm:p-9
                    "
                >

                    <div
                        className="
                            flex
                            h-14
                            w-14
                            items-center
                            justify-center
                            rounded-2xl
                            bg-indigo-50
                            text-indigo-600
                        "
                    >

                        <ClipboardCheck
                            size={27}
                        />

                    </div>


                    <div className="mt-6">

                        <span
                            className="
                                rounded-full
                                bg-amber-50
                                px-3
                                py-1
                                text-xs
                                font-bold
                                uppercase
                                tracking-wide
                                text-amber-700
                            "
                        >
                            More evidence required
                        </span>


                        <h2
                            className="
                                mt-4
                                text-2xl
                                font-bold
                                tracking-tight
                                text-slate-900
                            "
                        >
                            Complete your mock interviews
                        </h2>


                        <p
                            className="
                                mt-3
                                max-w-2xl
                                text-sm
                                leading-7
                                text-slate-600
                            "
                        >
                            Completing the roadmap proves that
                            you've covered the required learning.
                            Mock interviews now help measure how
                            well you can apply that knowledge
                            under interview conditions.
                        </p>

                    </div>


                    {/* Progress */}

                    <div
                        className="
                            mt-8
                            max-w-xl
                        "
                    >

                        <div
                            className="
                                flex
                                items-center
                                justify-between
                                gap-4
                            "
                        >

                            <span
                                className="
                                    text-sm
                                    font-semibold
                                    text-slate-700
                                "
                            >
                                Mock interview progress
                            </span>

                            <span
                                className="
                                    text-sm
                                    font-bold
                                    text-indigo-600
                                "
                            >
                                {available}
                                {" / "}
                                {MINIMUM_MOCK_INTERVIEWS}
                            </span>

                        </div>


                        <div
                            className="
                                mt-3
                                h-2.5
                                overflow-hidden
                                rounded-full
                                bg-slate-100
                            "
                        >

                            <div
                                className="
                                    h-full
                                    rounded-full
                                    bg-indigo-600
                                    transition-all
                                    duration-500
                                "
                                style={{
                                    width:
                                        `${progress}%`,
                                }}
                            />

                        </div>


                        <p
                            className="
                                mt-3
                                text-sm
                                text-slate-500
                            "
                        >

                            {remaining > 0
                                ? `${remaining} more mock ${remaining === 1
                                    ? "interview"
                                    : "interviews"
                                } needed before readiness can be evaluated.`
                                : "Enough interview evidence has been collected."
                            }

                        </p>

                    </div>


                    <button
                        type="button"
                        onClick={
                            onAddMock
                        }
                        className="
                            mt-7
                            inline-flex
                            items-center
                            justify-center
                            gap-2
                            rounded-xl
                            bg-indigo-600
                            px-5
                            py-3
                            text-sm
                            font-semibold
                            text-white
                            shadow-sm
                            transition
                            hover:bg-indigo-700
                        "
                    >

                        Add Mock Interview Result

                        <ArrowRight
                            size={17}
                        />

                    </button>

                </div>


                {/* Explanation */}

                <div
                    className="
                        border-t
                        border-slate-200
                        bg-slate-50
                        p-7
                        sm:p-9
                        lg:border-l
                        lg:border-t-0
                    "
                >

                    <p
                        className="
                            text-xs
                            font-bold
                            uppercase
                            tracking-[0.12em]
                            text-slate-400
                        "
                    >
                        What we'll evaluate
                    </p>


                    <div
                        className="
                            mt-6
                            space-y-5
                        "
                    >

                        <EvaluationFactor
                            title="Technical Skills"
                            description="Your current skill performance from CareerSaathi assessments."
                        />

                        <EvaluationFactor
                            title="Technical Interview"
                            description="How well you answer technical interview questions."
                        />

                        <EvaluationFactor
                            title="Problem Solving"
                            description="Your ability to reason through interview problems."
                        />

                        <EvaluationFactor
                            title="Communication"
                            description="How clearly you explain your thinking and solutions."
                        />

                    </div>

                </div>

            </div>

        </div>

    );

}


/*
|--------------------------------------------------------------------------
| Not Ready
|--------------------------------------------------------------------------
*/

interface NotReadyStateProps {

    score:
    number | null;

    breakdown:
    ReadinessBreakdown | null;

    weakAreas:
    ReadinessWeakArea[];

    onGenerateAdaptiveRoadmap:
    () => void;

}


function NotReadyState({

    score,
    breakdown,
    weakAreas,
    onGenerateAdaptiveRoadmap,

}: NotReadyStateProps) {

    return (

        <div className="space-y-6">

            <div
                className="
                    rounded-3xl
                    border
                    border-amber-200
                    bg-amber-50
                    p-7
                    sm:p-9
                "
            >

                <div
                    className="
                        flex
                        flex-col
                        gap-6
                        md:flex-row
                        md:items-center
                        md:justify-between
                    "
                >

                    <div>

                        <span
                            className="
                                text-sm
                                font-bold
                                uppercase
                                tracking-wide
                                text-amber-700
                            "
                        >
                            Improvement needed
                        </span>

                        <h2
                            className="
                                mt-2
                                text-2xl
                                font-bold
                                text-slate-900
                            "
                        >
                            You're close, but there are
                            areas to strengthen.
                        </h2>

                        <p
                            className="
                                mt-3
                                max-w-2xl
                                text-sm
                                leading-7
                                text-slate-600
                            "
                        >
                            Your mock interview evidence
                            identified specific weaknesses.
                            We'll use those results to build
                            focused preparation instead of
                            repeating your original roadmap.
                        </p>

                    </div>


                    <ScoreCircle
                        score={
                            score
                        }
                        label="Readiness"
                    />

                </div>

            </div>


            {breakdown && (

                <ReadinessBreakdownGrid
                    breakdown={
                        breakdown
                    }
                />

            )}


            <div
                className="
                    grid
                    gap-6
                    lg:grid-cols-2
                "
            >

                <WeakAreasCard
                    weakAreas={
                        weakAreas
                    }
                />


                <div
                    className="
                        rounded-2xl
                        border
                        border-indigo-200
                        bg-indigo-50
                        p-6
                    "
                >

                    <Target
                        size={24}
                        className="text-indigo-600"
                    />

                    <h3
                        className="
                            mt-4
                            text-lg
                            font-bold
                            text-slate-900
                        "
                    >
                        Your next step
                    </h3>

                    <p
                        className="
                            mt-2
                            text-sm
                            leading-6
                            text-slate-600
                        "
                    >
                        CareerSaathi can create an adaptive
                        roadmap focused on the weaknesses
                        discovered through your recent mock
                        interviews.
                    </p>


                    {/*
                        We'll connect this to the adaptive
                        roadmap mutation once we add its API.
                    */}

                    <div
                        className="
        rounded-xl
        border
        border-indigo-100
        bg-indigo-50
        p-4
    "
                    >

                        <p
                            className="
            text-sm
            font-semibold
            text-indigo-900
        "
                        >
                            Your next step
                        </p>

                        <p
                            className="
            mt-1
            text-sm
            leading-6
            text-indigo-700
        "
                        >
                            We'll create a focused follow-up roadmap
                            based on your current skills, weak areas,
                            and recent mock interview performance.
                            You'll only revisit the areas that need
                            improvement.
                        </p>

                    </div>

                    <button
                        type="button"
                        onClick={
                            onGenerateAdaptiveRoadmap
                        }
                        className="
        mt-5
        inline-flex
        items-center
        justify-center
        gap-2
        rounded-xl
        bg-indigo-600
        px-5
        py-3
        text-sm
        font-semibold
        text-white
        shadow-sm
        transition
        hover:bg-indigo-700
    "
                    >

                        Generate Adaptive Roadmap

                        <ArrowRight
                            size={17}
                        />

                    </button>

                </div>

            </div>

        </div>

    );

}


/*
|--------------------------------------------------------------------------
| Adaptive Roadmap Confirmation Modal
|--------------------------------------------------------------------------
*/

interface AdaptiveRoadmapConfirmationModalProps {

    open:
    boolean;

    loading:
    boolean;

    weakAreas:
    ReadinessWeakArea[];

    onClose:
    () => void;

    onConfirm:
    () => void;

}


function AdaptiveRoadmapConfirmationModal({

    open,
    loading,
    weakAreas,
    onClose,
    onConfirm,

}: AdaptiveRoadmapConfirmationModalProps) {

    if (!open) {

        return null;

    }


    const labels:
        Record<
            ReadinessWeakArea,
            string
        > = {

        technical_skills:
            "Technical Skills",

        technical_interview:
            "Technical Interview",

        problem_solving:
            "Problem Solving",

        communication:
            "Communication",

    };


    return (

        <div
            className="
                fixed
                inset-0
                z-100
                flex
                items-center
                justify-center
                bg-slate-950/50
                px-4
                py-6
                backdrop-blur-sm
            "
            onMouseDown={() => {

                if (!loading) {

                    onClose();

                }

            }}
        >

            <div
                role="dialog"
                aria-modal="true"
                aria-labelledby="adaptive-roadmap-title"
                onMouseDown={
                    event =>
                        event.stopPropagation()
                }
                className="
                    w-full
                    max-w-lg
                    overflow-hidden
                    rounded-3xl
                    bg-white
                    shadow-2xl
                "
            >

                {/* Header */}

                <div
                    className="
                        border-b
                        border-slate-100
                        p-6
                        sm:p-7
                    "
                >

                    <div
                        className="
                            flex
                            h-12
                            w-12
                            items-center
                            justify-center
                            rounded-2xl
                            bg-indigo-50
                            text-indigo-600
                        "
                    >

                        <Target
                            size={24}
                        />

                    </div>


                    <h2
                        id="adaptive-roadmap-title"
                        className="
                            mt-5
                            text-xl
                            font-bold
                            text-slate-900
                        "
                    >
                        Create your improvement roadmap?
                    </h2>


                    <p
                        className="
                            mt-2
                            text-sm
                            leading-6
                            text-slate-500
                        "
                    >
                        CareerSaathi will use your current
                        skills and recent mock interview
                        performance to create a focused
                        follow-up roadmap.
                    </p>

                </div>


                {/* Content */}

                <div className="p-6 sm:p-7">

                    {weakAreas.length > 0 && (

                        <div>

                            <p
                                className="
                                    text-xs
                                    font-bold
                                    uppercase
                                    tracking-wide
                                    text-slate-400
                                "
                            >
                                Areas we'll focus on
                            </p>


                            <div
                                className="
                                    mt-3
                                    flex
                                    flex-wrap
                                    gap-2
                                "
                            >

                                {weakAreas.map(
                                    area => (

                                        <span
                                            key={
                                                area
                                            }
                                            className="
                                                rounded-full
                                                bg-amber-50
                                                px-3
                                                py-1.5
                                                text-xs
                                                font-semibold
                                                text-amber-700
                                            "
                                        >
                                            {
                                                labels[
                                                area
                                                ]
                                            }
                                        </span>

                                    )
                                )}

                            </div>

                        </div>

                    )}


                    <div
                        className="
                            mt-6
                            rounded-2xl
                            border
                            border-indigo-100
                            bg-indigo-50
                            p-4
                        "
                    >

                        <p
                            className="
                                text-sm
                                font-semibold
                                text-indigo-900
                            "
                        >
                            What happens next?
                        </p>


                        <p
                            className="
                                mt-1
                                text-sm
                                leading-6
                                text-indigo-700
                            "
                        >
                            You'll return to the learning
                            stage with a new adaptive
                            roadmap. Once you complete it,
                            you'll come back to interview
                            readiness for another
                            evaluation cycle.
                        </p>

                    </div>


                    {/* Actions */}

                    <div
                        className="
                            mt-7
                            flex
                            flex-col-reverse
                            gap-3
                            sm:flex-row
                            sm:justify-end
                        "
                    >

                        <button
                            type="button"
                            disabled={
                                loading
                            }
                            onClick={
                                onClose
                            }
                            className="
                                rounded-xl
                                border
                                border-slate-200
                                bg-white
                                px-5
                                py-2.5
                                text-sm
                                font-semibold
                                text-slate-700
                                transition
                                hover:bg-slate-50
                                disabled:cursor-not-allowed
                                disabled:opacity-50
                            "
                        >
                            Not Now
                        </button>


                        <button
                            type="button"
                            disabled={
                                loading
                            }
                            onClick={
                                onConfirm
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
                                shadow-sm
                                transition
                                hover:bg-indigo-700
                                disabled:cursor-not-allowed
                                disabled:opacity-60
                            "
                        >

                            {loading ? (

                                <>

                                    <Loader2
                                        size={17}
                                        className="
                                            animate-spin
                                        "
                                    />

                                    Creating your roadmap...

                                </>

                            ) : (

                                <>

                                    Generate Roadmap

                                    <ArrowRight
                                        size={17}
                                    />

                                </>

                            )}

                        </button>

                    </div>

                </div>

            </div>

        </div>

    );

}


/*
|--------------------------------------------------------------------------
| Ready
|--------------------------------------------------------------------------
*/

interface EvaluationStateProps {

    score:
    number | null;

    breakdown:
    ReadinessBreakdown | null;

}


function ReadyState({

    score,
    breakdown,

}: EvaluationStateProps) {

    return (

        <div className="space-y-6">

            <div
                className="
                    overflow-hidden
                    rounded-3xl
                    border
                    border-green-200
                    bg-green-50
                    p-7
                    sm:p-10
                "
            >

                <div
                    className="
                        flex
                        flex-col
                        gap-7
                        md:flex-row
                        md:items-center
                        md:justify-between
                    "
                >

                    <div>

                        <div
                            className="
                                flex
                                h-14
                                w-14
                                items-center
                                justify-center
                                rounded-2xl
                                bg-green-100
                                text-green-700
                            "
                        >
                            <Trophy
                                size={27}
                            />
                        </div>


                        <span
                            className="
                                mt-6
                                inline-block
                                text-sm
                                font-bold
                                uppercase
                                tracking-wide
                                text-green-700
                            "
                        >
                            Interview ready
                        </span>


                        <h2
                            className="
                                mt-2
                                text-3xl
                                font-bold
                                tracking-tight
                                text-slate-900
                            "
                        >
                            You're ready to start applying.
                        </h2>


                        <p
                            className="
                                mt-3
                                max-w-2xl
                                text-sm
                                leading-7
                                text-slate-600
                            "
                        >
                            Your current skills and recent
                            mock interview performance meet
                            the readiness requirements. Your
                            focus can now move from structured
                            learning to real interview
                            opportunities.
                        </p>

                    </div>


                    <ScoreCircle
                        score={
                            score
                        }
                        label="Readiness"
                    />

                </div>

            </div>


            {breakdown && (

                <ReadinessBreakdownGrid
                    breakdown={
                        breakdown
                    }
                />

            )}


            <div
                className="
                    rounded-2xl
                    border
                    border-slate-200
                    bg-white
                    p-6
                    shadow-sm
                "
            >

                <div
                    className="
                        flex
                        items-start
                        gap-4
                    "
                >

                    <div
                        className="
                            flex
                            h-11
                            w-11
                            shrink-0
                            items-center
                            justify-center
                            rounded-xl
                            bg-green-50
                            text-green-600
                        "
                    >
                        <CheckCircle2
                            size={21}
                        />
                    </div>


                    <div>

                        <h3
                            className="
                                font-bold
                                text-slate-900
                            "
                        >
                            Learning phase complete
                        </h3>

                        <p
                            className="
                                mt-1
                                max-w-2xl
                                text-sm
                                leading-6
                                text-slate-500
                            "
                        >
                            You don't need another learning
                            roadmap right now. Continue
                            interview practice while actively
                            applying for suitable roles.
                        </p>

                    </div>

                </div>

            </div>

        </div>

    );

}

interface ReadyToEvaluateStateProps {
    available:
    number;

    required:
    number;

    isEvaluating:
    boolean;

    onEvaluate:
    () => void;

    onAddMock:
    () => void;

}


function ReadyToEvaluateState({

    available,
    required,
    isEvaluating,
    onEvaluate,
    onAddMock,

}: ReadyToEvaluateStateProps) {

    return (

        <div
            className="
                overflow-hidden
                rounded-3xl
                border
                border-indigo-200
                bg-white
                shadow-sm
            "
        >

            <div
                className="
                    grid
                    lg:grid-cols-[1.15fr_0.85fr]
                "
            >

                {/* Main Content */}

                <div
                    className="
                        p-7
                        sm:p-9
                    "
                >

                    <div
                        className="
                            flex
                            h-14
                            w-14
                            items-center
                            justify-center
                            rounded-2xl
                            bg-indigo-50
                            text-indigo-600
                        "
                    >

                        <ClipboardCheck
                            size={27}
                        />

                    </div>


                    <span
                        className="
                            mt-6
                            inline-block
                            rounded-full
                            bg-green-50
                            px-3
                            py-1
                            text-xs
                            font-bold
                            uppercase
                            tracking-wide
                            text-green-700
                        "
                    >
                        Evidence collected
                    </span>


                    <h2
                        className="
                            mt-4
                            text-2xl
                            font-bold
                            tracking-tight
                            text-slate-900
                        "
                    >
                        You're ready for your
                        readiness evaluation
                    </h2>


                    <p
                        className="
                            mt-3
                            max-w-2xl
                            text-sm
                            leading-7
                            text-slate-600
                        "
                    >
                        You've completed enough mock
                        interviews for CareerSaathi to
                        evaluate your interview
                        readiness using your current
                        skills and recent interview
                        performance.
                    </p>


                    <div
                        className="
                            mt-6
                            rounded-2xl
                            border
                            border-green-100
                            bg-green-50
                            p-4
                        "
                    >

                        <div
                            className="
                                flex
                                items-center
                                gap-3
                            "
                        >

                            <CheckCircle2
                                size={20}
                                className="
                                    shrink-0
                                    text-green-600
                                "
                            />

                            <div>

                                <p
                                    className="
        text-sm
        font-semibold
        text-green-900
    "
                                >
                                    {available} mock interviews available
                                </p>

                                <p
                                    className="
        mt-1
        text-sm
        text-green-700
    "
                                >
                                    Minimum requirement of{" "}
                                    {required} mock interviews
                                    has been satisfied.
                                </p>

                            </div>

                        </div>

                    </div>


                    <div
                        className="
                            mt-7
                            flex
                            flex-col
                            gap-3
                            sm:flex-row
                        "
                    >

                        <button
                            type="button"
                            disabled={
                                isEvaluating
                            }
                            onClick={
                                onEvaluate
                            }
                            className="
                                inline-flex
                                items-center
                                justify-center
                                gap-2
                                rounded-xl
                                bg-indigo-600
                                px-5
                                py-3
                                text-sm
                                font-semibold
                                text-white
                                shadow-sm
                                transition
                                hover:bg-indigo-700
                                disabled:cursor-not-allowed
                                disabled:opacity-60
                            "
                        >

                            {isEvaluating ? (

                                <>

                                    <Loader2
                                        size={17}
                                        className="
                                            animate-spin
                                        "
                                    />

                                    Evaluating...

                                </>

                            ) : (

                                <>

                                    <BrainCircuit
                                        size={17}
                                    />

                                    Evaluate My Readiness

                                    <ArrowRight
                                        size={17}
                                    />

                                </>

                            )}

                        </button>


                        <button
                            type="button"
                            disabled={
                                isEvaluating
                            }
                            onClick={
                                onAddMock
                            }
                            className="
                                inline-flex
                                items-center
                                justify-center
                                rounded-xl
                                border
                                border-slate-200
                                bg-white
                                px-5
                                py-3
                                text-sm
                                font-semibold
                                text-slate-700
                                transition
                                hover:bg-slate-50
                                disabled:cursor-not-allowed
                                disabled:opacity-60
                            "
                        >
                            Add Another Mock
                        </button>

                    </div>

                </div>


                {/* Evaluation Explanation */}

                <div
                    className="
                        border-t
                        border-slate-200
                        bg-slate-50
                        p-7
                        sm:p-9
                        lg:border-l
                        lg:border-t-0
                    "
                >

                    <p
                        className="
                            text-xs
                            font-bold
                            uppercase
                            tracking-[0.12em]
                            text-slate-400
                        "
                    >
                        What happens next
                    </p>


                    <div
                        className="
                            mt-6
                            space-y-5
                        "
                    >

                        <EvaluationFactor
                            title="Technical Skills"
                            description="Your current skill scores will contribute to the evaluation."
                        />

                        <EvaluationFactor
                            title="Technical Interview"
                            description="Your recent technical interview performance will be measured."
                        />

                        <EvaluationFactor
                            title="Problem Solving"
                            description="Your reasoning and problem-solving performance will be evaluated."
                        />

                        <EvaluationFactor
                            title="Communication"
                            description="Your ability to explain solutions clearly will contribute to your readiness."
                        />

                    </div>


                    <div
                        className="
                            mt-7
                            rounded-2xl
                            border
                            border-indigo-100
                            bg-indigo-50
                            p-4
                        "
                    >

                        <p
                            className="
                                text-sm
                                font-semibold
                                text-indigo-900
                            "
                        >
                            One evaluation, two outcomes
                        </p>

                        <p
                            className="
                                mt-1
                                text-sm
                                leading-6
                                text-indigo-700
                            "
                        >
                            If you're ready, CareerSaathi
                            will move you into the job
                            application stage. If not,
                            we'll identify your weak areas
                            and create a focused adaptive
                            roadmap.
                        </p>

                    </div>

                </div>

            </div>

        </div>

    );

}


/*
|--------------------------------------------------------------------------
| Readiness Breakdown
|--------------------------------------------------------------------------
*/

function ReadinessBreakdownGrid({

    breakdown,

}: {

    breakdown:
    ReadinessBreakdown;

}) {

    const items = [

        {
            label:
                "Technical Skills",

            value:
                breakdown.skillScore,
        },

        {
            label:
                "Technical Interview",

            value:
                breakdown
                    .technicalInterviewScore,
        },

        {
            label:
                "Problem Solving",

            value:
                breakdown
                    .problemSolvingScore,
        },

        {
            label:
                "Communication",

            value:
                breakdown
                    .communicationScore,
        },

    ];


    return (

        <div
            className="
                grid
                gap-4
                sm:grid-cols-2
                xl:grid-cols-4
            "
        >

            {items.map(
                item => (

                    <div
                        key={
                            item.label
                        }
                        className="
                            rounded-2xl
                            border
                            border-slate-200
                            bg-white
                            p-5
                            shadow-sm
                        "
                    >

                        <p
                            className="
                                text-sm
                                font-medium
                                text-slate-500
                            "
                        >
                            {item.label}
                        </p>

                        <p
                            className="
                                mt-3
                                text-3xl
                                font-bold
                                tracking-tight
                                text-slate-900
                            "
                        >
                            {item.value}

                            <span
                                className="
                                    text-base
                                    font-medium
                                    text-slate-400
                                "
                            >
                                /100
                            </span>
                        </p>

                    </div>

                )
            )}

        </div>

    );

}


/*
|--------------------------------------------------------------------------
| Weak Areas
|--------------------------------------------------------------------------
*/

function WeakAreasCard({

    weakAreas,

}: {

    weakAreas:
    ReadinessWeakArea[];

}) {

    const labels:
        Record<
            ReadinessWeakArea,
            string
        > = {

        technical_skills:
            "Technical Skills",

        technical_interview:
            "Technical Interview",

        problem_solving:
            "Problem Solving",

        communication:
            "Communication",

    };


    return (

        <div
            className="
                rounded-2xl
                border
                border-slate-200
                bg-white
                p-6
                shadow-sm
            "
        >

            <h3
                className="
                    text-lg
                    font-bold
                    text-slate-900
                "
            >
                Areas to strengthen
            </h3>

            <p
                className="
                    mt-1
                    text-sm
                    text-slate-500
                "
            >
                These areas currently fall below
                your readiness requirements.
            </p>


            <div
                className="
                    mt-5
                    space-y-3
                "
            >

                {weakAreas.map(
                    area => (

                        <div
                            key={
                                area
                            }
                            className="
                                flex
                                items-center
                                gap-3
                                rounded-xl
                                bg-amber-50
                                px-4
                                py-3
                            "
                        >

                            <Target
                                size={17}
                                className="
                                    text-amber-600
                                "
                            />

                            <span
                                className="
                                    text-sm
                                    font-semibold
                                    text-slate-700
                                "
                            >
                                {labels[area]}
                            </span>

                        </div>

                    )
                )}

            </div>

        </div>

    );

}


/*
|--------------------------------------------------------------------------
| Score Circle
|--------------------------------------------------------------------------
*/

function ScoreCircle({

    score,
    label,

}: {

    score:
    number | null;

    label:
    string;

}) {

    return (

        <div
            className="
                flex
                h-36
                w-36
                shrink-0
                flex-col
                items-center
                justify-center
                rounded-full
                border-8
                border-white
                bg-white
                shadow-sm
            "
        >

            <span
                className="
                    text-4xl
                    font-bold
                    tracking-tight
                    text-slate-900
                "
            >
                {score ?? "--"}
            </span>

            <span
                className="
                    mt-1
                    text-xs
                    font-semibold
                    uppercase
                    tracking-wide
                    text-slate-400
                "
            >
                {label}
            </span>

        </div>

    );

}


/*
|--------------------------------------------------------------------------
| Evaluation Factor
|--------------------------------------------------------------------------
*/

function EvaluationFactor({

    title,
    description,

}: {

    title:
    string;

    description:
    string;

}) {

    return (

        <div
            className="
                flex
                gap-3
            "
        >

            <CheckCircle2
                size={18}
                className="
                    mt-0.5
                    shrink-0
                    text-indigo-600
                "
            />

            <div>

                <p
                    className="
                        text-sm
                        font-semibold
                        text-slate-800
                    "
                >
                    {title}
                </p>

                <p
                    className="
                        mt-1
                        text-sm
                        leading-6
                        text-slate-500
                    "
                >
                    {description}
                </p>

            </div>

        </div>

    );

}


/*
|--------------------------------------------------------------------------
| Loading
|--------------------------------------------------------------------------
*/

function ReadinessLoadingState() {

    return (

        <div className="p-6">

            <div
                className="
                    mx-auto
                    max-w-6xl
                    animate-pulse
                "
            >

                <div
                    className="
                        h-5
                        w-40
                        rounded
                        bg-slate-200
                    "
                />

                <div
                    className="
                        mt-4
                        h-9
                        w-96
                        max-w-full
                        rounded
                        bg-slate-200
                    "
                />

                <div
                    className="
                        mt-3
                        h-5
                        w-lg
                        max-w-full
                        rounded
                        bg-slate-100
                    "
                />

                <div
                    className="
                        mt-10
                        h-96
                        rounded-3xl
                        border
                        border-slate-200
                        bg-white
                    "
                />

            </div>

        </div>

    );

}
import {
    ClipboardCheck,
    RefreshCw,
} from "lucide-react";

import {
    useGetWorkspaceQuery,
} from "../../workspace/api/workspaceApi";

import {
    useGetAssessmentHistoryQuery,
} from "../api/assessmentApi";

import AssessmentHistoryCard from "../components/AssessmentHistoryCard";

const AssessmentsPage = () => {

    const {
        data: workspaceResponse,
        isLoading: workspaceLoading,
        isError: workspaceError,
    } = useGetWorkspaceQuery();

    const careerJourneyId =
        workspaceResponse?.data
            ?.careerJourney.id;

    const {
        data: historyResponse,
        isLoading: historyLoading,
        isError: historyError,
        refetch,
    } = useGetAssessmentHistoryQuery(
        careerJourneyId ?? "",
        {
            skip:
                !careerJourneyId,
        }
    );

    const assessments =
        historyResponse?.data ?? [];

    const isLoading =
        workspaceLoading ||
        historyLoading;

    if (isLoading) {

        return (
            <AssessmentsLoading />
        );

    }

    if (
        workspaceError ||
        historyError
    ) {

        return (

            <div className="min-h-screen bg-slate-50">

                <div
                    className="
                        mx-auto
                        flex
                        min-h-150
                        max-w-6xl
                        items-center
                        justify-center
                        px-4
                        py-8
                        sm:px-6
                        lg:px-8
                    "
                >

                    <div
                        className="
                            w-full
                            max-w-md
                            rounded-2xl
                            border
                            border-slate-200
                            bg-white
                            p-6
                            text-center
                            shadow-sm
                            sm:p-8
                        "
                    >

                        <div
                            className="
                                mx-auto
                                flex
                                h-12
                                w-12
                                items-center
                                justify-center
                                rounded-xl
                                bg-red-50
                                text-red-600
                            "
                        >

                            <RefreshCw size={21} />

                        </div>

                        <h2
                            className="
                                mt-5
                                text-xl
                                font-bold
                                text-slate-900
                            "
                        >
                            Unable to load assessments
                        </h2>

                        <p
                            className="
                                mt-2
                                text-sm
                                leading-6
                                text-slate-600
                            "
                        >
                            We couldn't load your assessment
                            history. Please try again.
                        </p>

                        <button
                            type="button"
                            onClick={() =>
                                refetch()
                            }
                            className="
                                mt-6
                                inline-flex
                                items-center
                                justify-center
                                gap-2
                                rounded-xl
                                bg-blue-600
                                px-5
                                py-2.5
                                text-sm
                                font-semibold
                                text-white
                                transition
                                hover:bg-blue-700
                            "
                        >

                            <RefreshCw size={16} />

                            Try Again

                        </button>

                    </div>

                </div>

            </div>

        );

    }

    return (

        <div className="min-h-screen bg-slate-50">

            <div
                className="
                    mx-auto
                    max-w-6xl
                    px-4
                    py-8
                    sm:px-6
                    sm:py-10
                    lg:px-8
                "
            >

                {/* Header */}

                <section
                    className="
                        overflow-hidden
                        rounded-2xl
                        border
                        border-slate-200
                        bg-white
                        shadow-sm
                    "
                >

                    <div
                        className="
                            relative
                            overflow-hidden
                            px-5
                            py-6
                            sm:px-7
                            sm:py-8
                            lg:px-8
                        "
                    >

                        <div
                            className="
                                pointer-events-none
                                absolute
                                -right-16
                                -top-20
                                h-56
                                w-56
                                rounded-full
                                bg-blue-50
                                blur-3xl
                            "
                        />

                        <div
                            className="
                                relative
                                flex
                                items-start
                                gap-4
                            "
                        >

                            <div
                                className="
                                    flex
                                    h-12
                                    w-12
                                    shrink-0
                                    items-center
                                    justify-center
                                    rounded-xl
                                    bg-blue-50
                                    text-blue-600
                                "
                            >

                                <ClipboardCheck
                                    size={23}
                                />

                            </div>

                            <div>

                                <p
                                    className="
                                        text-xs
                                        font-semibold
                                        uppercase
                                        tracking-[0.12em]
                                        text-blue-600
                                    "
                                >
                                    Performance Tracking
                                </p>

                                <h1
                                    className="
                                        mt-1
                                        text-2xl
                                        font-bold
                                        tracking-tight
                                        text-slate-900
                                        sm:text-3xl
                                    "
                                >
                                    Assessments
                                </h1>

                                <p
                                    className="
                                        mt-2
                                        max-w-2xl
                                        text-sm
                                        leading-6
                                        text-slate-600
                                        sm:text-base
                                    "
                                >
                                    Review your initial and weekly
                                    assessments to understand how
                                    your skills are progressing
                                    throughout your career journey.
                                </p>

                            </div>

                        </div>

                    </div>

                </section>

                {/* History */}

                <section className="mt-8">

                    <div>

                        <h2
                            className="
                                text-lg
                                font-bold
                                text-slate-900
                                sm:text-xl
                            "
                        >
                            Assessment History
                        </h2>

                        <p
                            className="
                                mt-1
                                text-sm
                                text-slate-500
                            "
                        >
                            Your completed and recorded
                            assessments appear here.
                        </p>

                    </div>

                    {assessments.length === 0 ? (

                        <div
                            className="
                                mt-5
                                rounded-2xl
                                border
                                border-dashed
                                border-slate-300
                                bg-white
                                px-5
                                py-14
                                text-center
                                sm:px-8
                                sm:py-16
                            "
                        >

                            <div
                                className="
                                    mx-auto
                                    flex
                                    h-14
                                    w-14
                                    items-center
                                    justify-center
                                    rounded-2xl
                                    bg-slate-100
                                    text-slate-400
                                "
                            >

                                <ClipboardCheck
                                    size={26}
                                />

                            </div>

                            <h2
                                className="
                                    mt-5
                                    text-lg
                                    font-semibold
                                    text-slate-900
                                "
                            >
                                No assessments yet
                            </h2>

                            <p
                                className="
                                    mx-auto
                                    mt-2
                                    max-w-md
                                    text-sm
                                    leading-6
                                    text-slate-500
                                "
                            >
                                Your initial assessment and
                                future weekly assessments will
                                appear here once completed.
                            </p>

                        </div>

                    ) : (

                        <div
                            className="
                                mt-5
                                space-y-4
                            "
                        >

                            {assessments.map(
                                (assessment) => (

                                    <AssessmentHistoryCard
                                        key={
                                            assessment.id
                                        }
                                        assessment={
                                            assessment
                                        }
                                    />

                                )
                            )}

                        </div>

                    )}

                </section>

            </div>

        </div>

    );

};

const AssessmentsLoading = () => {

    return (

        <div className="min-h-screen bg-slate-50">

            <div
                className="
                    mx-auto
                    max-w-6xl
                    px-4
                    py-8
                    sm:px-6
                    sm:py-10
                    lg:px-8
                "
            >

                <div
                    className="
                        h-44
                        animate-pulse
                        rounded-2xl
                        border
                        border-slate-200
                        bg-white
                    "
                />

                <div
                    className="
                        mt-8
                        h-7
                        w-48
                        animate-pulse
                        rounded
                        bg-slate-200
                    "
                />

                <div className="mt-5 space-y-4">

                    {[1, 2, 3].map(
                        (item) => (

                            <div
                                key={item}
                                className="
                                    h-32
                                    animate-pulse
                                    rounded-2xl
                                    border
                                    border-slate-200
                                    bg-white
                                "
                            />

                        )
                    )}

                </div>

            </div>

        </div>

    );

};

export default AssessmentsPage;
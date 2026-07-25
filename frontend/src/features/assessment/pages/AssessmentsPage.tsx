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
            <div className="flex min-h-[500px] items-center justify-center">
                <p className="text-slate-600">
                    Loading assessments...
                </p>
            </div>
        );
    }

    if (
        workspaceError ||
        historyError
    ) {
        return (
            <div className="flex min-h-[500px] items-center justify-center px-6">

                <div className="text-center">

                    <h2 className="text-lg font-semibold text-slate-900">
                        Unable to load assessments
                    </h2>

                    <p className="mt-2 text-sm text-slate-600">
                        We couldn't load your assessment
                        history.
                    </p>

                    <button
                        type="button"
                        onClick={() =>
                            refetch()
                        }
                        className="
                            mt-5
                            inline-flex
                            items-center
                            gap-2
                            rounded-lg
                            bg-indigo-600
                            px-4
                            py-2.5
                            text-sm
                            font-medium
                            text-white
                            transition
                            hover:bg-indigo-700
                        "
                    >
                        <RefreshCw
                            size={16}
                        />

                        Retry
                    </button>

                </div>
            </div>
        );
    }

    return (
        <div className="mx-auto max-w-5xl px-6 py-10">

            <div className="mb-8">

                <div className="flex items-center gap-3">

                    <div
                        className="
                            flex
                            h-12
                            w-12
                            items-center
                            justify-center
                            rounded-xl
                            bg-indigo-50
                            text-indigo-600
                        "
                    >
                        <ClipboardCheck
                            size={24}
                        />
                    </div>

                    <div>
                        <h1 className="text-2xl font-bold text-slate-900">
                            Assessments
                        </h1>

                        <p className="mt-1 text-sm text-slate-600">
                            Review your initial and weekly
                            skill assessments.
                        </p>
                    </div>

                </div>

            </div>

            {assessments.length === 0 ? (

                <div
                    className="
                        rounded-2xl
                        border
                        border-dashed
                        border-slate-300
                        bg-white
                        px-6
                        py-16
                        text-center
                    "
                >
                    <ClipboardCheck
                        size={36}
                        className="mx-auto text-slate-400"
                    />

                    <h2 className="mt-4 font-semibold text-slate-900">
                        No assessments yet
                    </h2>

                    <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-600">
                        Your completed initial and weekly
                        assessments will appear here.
                    </p>

                </div>

            ) : (

                <div className="space-y-4">
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

        </div>
    );
};

export default AssessmentsPage;
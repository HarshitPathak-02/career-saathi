import {
    Navigate,
    useNavigate,
} from "react-router-dom";

import {
    ArrowLeft,
} from "lucide-react";

import Button from "../../../components/ui/Button/Button";

import {
    useGetWorkspaceQuery,
} from "../../workspace/api/workspaceApi";

import {
    useGetRoadmapByCareerJourneyQuery,
    useGetRoadmapItemsQuery,
} from "../api/roadmapApi";

const RoadmapPage = () => {
    const navigate = useNavigate();

    const {
        data: workspaceResponse,
        isLoading: workspaceLoading,
        isError: workspaceError,
        refetch: refetchWorkspace,
    } = useGetWorkspaceQuery();

    const workspace =
        workspaceResponse?.data;

    const careerJourneyId =
        workspace?.careerJourney.id ?? "";

    const {
        data: roadmap,
        isLoading: roadmapLoading,
        isError: roadmapError,
        refetch: refetchRoadmap,
    } = useGetRoadmapByCareerJourneyQuery(
        careerJourneyId,
        {
            skip: !careerJourneyId,
        }
    );

    const roadmapId =
        roadmap?.id ?? "";

    const {
        data: roadmapItems,
        isLoading: itemsLoading,
        isError: itemsError,
        refetch: refetchItems,
    } = useGetRoadmapItemsQuery(
        roadmapId,
        {
            skip: !roadmapId,
        }
    );

    if (workspaceLoading) {
        return (
            <div className="flex min-h-screen items-center justify-center bg-slate-50">
                <p className="text-slate-600">
                    Loading your roadmap...
                </p>
            </div>
        );
    }

    if (
        workspaceError ||
        !workspace
    ) {
        return (
            <div className="flex min-h-screen items-center justify-center bg-slate-50 px-6">
                <div className="text-center">
                    <h2 className="text-lg font-semibold text-slate-900">
                        Unable to load your journey
                    </h2>

                    <p className="mt-2 text-sm text-slate-600">
                        We couldn't retrieve your career
                        journey.
                    </p>

                    <Button
                        className="mt-5"
                        onClick={() =>
                            refetchWorkspace()
                        }
                    >
                        Retry
                    </Button>
                </div>
            </div>
        );
    }

    /*
     * A roadmap cannot exist before the
     * initial assessment is completed.
     */
    if (
        workspace.workspaceState ===
        "initial_assessment"
    ) {
        return (
            <Navigate
                to="/workspace"
                replace
            />
        );
    }

    if (
        roadmapLoading ||
        itemsLoading
    ) {
        return (
            <div className="flex min-h-screen items-center justify-center bg-slate-50">
                <p className="text-slate-600">
                    Loading your personalized roadmap...
                </p>
            </div>
        );
    }

    if (
        roadmapError ||
        itemsError ||
        !roadmap
    ) {
        return (
            <div className="flex min-h-screen items-center justify-center bg-slate-50 px-6">
                <div className="text-center">
                    <h2 className="text-lg font-semibold text-slate-900">
                        Unable to load roadmap
                    </h2>

                    <p className="mt-2 text-sm text-slate-600">
                        We couldn't retrieve your
                        personalized roadmap.
                    </p>

                    <Button
                        className="mt-5"
                        onClick={() => {
                            refetchRoadmap();

                            if (roadmapId) {
                                refetchItems();
                            }
                        }}
                    >
                        Retry
                    </Button>
                </div>
            </div>
        );
    }

    const items =
        roadmapItems ?? [];

    return (
        <div className="min-h-screen bg-slate-50">
            <div className="mx-auto max-w-6xl px-6 py-10">
                <button
                    type="button"
                    onClick={() =>
                        navigate("/workspace")
                    }
                    className="mb-6 flex items-center gap-2 text-sm font-medium text-slate-600 transition hover:text-slate-900"
                >
                    <ArrowLeft size={17} />

                    Back to Workspace
                </button>

                <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm md:p-8">
                    <span className="text-sm font-semibold text-indigo-600">
                        Personalized Roadmap
                    </span>

                    <h1 className="mt-2 text-2xl font-bold text-slate-900 md:text-3xl">
                        {roadmap.title}
                    </h1>

                    <p className="mt-2 text-slate-600">
                        {roadmap.targetRole}
                        {" • "}
                        {roadmap.targetDomain}
                    </p>

                    <div className="mt-8 grid gap-4 sm:grid-cols-3">
                        <div className="rounded-xl bg-slate-50 p-4">
                            <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
                                Estimated Duration
                            </p>

                            <p className="mt-2 text-lg font-semibold text-slate-900">
                                {roadmap.estimatedWeeks} weeks
                            </p>
                        </div>

                        <div className="rounded-xl bg-slate-50 p-4">
                            <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
                                Roadmap Items
                            </p>

                            <p className="mt-2 text-lg font-semibold text-slate-900">
                                {roadmap.totalItems}
                            </p>
                        </div>

                        <div className="rounded-xl bg-slate-50 p-4">
                            <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
                                Completed
                            </p>

                            <p className="mt-2 text-lg font-semibold text-slate-900">
                                {roadmap.completedItems}
                                {" / "}
                                {roadmap.totalItems}
                            </p>
                        </div>
                    </div>

                    <div className="mt-8 border-t border-slate-200 pt-8">
                        <h2 className="text-lg font-semibold text-slate-900">
                            Your Learning Path
                        </h2>

                        <p className="mt-1 text-sm text-slate-600">
                            Follow this sequence as your
                            CareerSaathi journey progresses.
                        </p>

                        <div className="mt-6 space-y-4">
                            {items.map((item) => (
                                <div
                                    key={item.id}
                                    className="rounded-xl border border-slate-200 p-5"
                                >
                                    <div className="flex items-start gap-4">
                                        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-indigo-50 text-sm font-semibold text-indigo-600">
                                            {item.order}
                                        </div>

                                        <div className="min-w-0 flex-1">
                                            <div className="flex flex-wrap items-center gap-2">
                                                <h3 className="font-semibold text-slate-900">
                                                    {item.title}
                                                </h3>

                                                <span className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-600">
                                                    {item.type.replaceAll(
                                                        "_",
                                                        " "
                                                    )}
                                                </span>
                                            </div>

                                            <p className="mt-2 text-sm leading-6 text-slate-600">
                                                {item.description}
                                            </p>

                                            <p className="mt-3 text-sm font-medium text-slate-500">
                                                {item.estimatedHours}{" "}
                                                estimated hours
                                            </p>

                                            {item.aiReason && (
                                                <div className="mt-4 rounded-lg bg-indigo-50 p-3">
                                                    <p className="text-xs font-semibold text-indigo-700">
                                                        Why this is in your roadmap
                                                    </p>

                                                    <p className="mt-1 text-sm leading-6 text-indigo-900">
                                                        {item.aiReason}
                                                    </p>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default RoadmapPage;
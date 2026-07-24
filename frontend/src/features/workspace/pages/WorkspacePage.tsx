import WorkspaceSidebar from "../components/WorkspaceSidebar";
import WorkspaceHeader from "../components/WorkspaceHeader";
import WorkspaceOverview from "../components/WorkspaceOverview";
import WorkspaceLoading from "../components/WorkspaceLoading";
import StageRenderer from "../components/StageRenderer";

import {
  useGetWorkspaceQuery,
} from "../api/workspaceApi";

const WorkspacePage = () => {
  const {
    data,
    isLoading,
    isFetching,
    isError,
    refetch,
  } = useGetWorkspaceQuery();

  if (isLoading) {
    return <WorkspaceLoading />;
  }

  if (
    isError ||
    !data?.data
  ) {
    return (
      <div
        className="
          flex
          min-h-screen
          items-center
          justify-center
          bg-slate-50
          p-6
        "
      >
        <div
          className="
            max-w-md
            rounded-xl
            border
            border-slate-200
            bg-white
            p-8
            text-center
          "
        >
          <h2 className="text-xl font-semibold text-slate-900">
            Unable to load your workspace
          </h2>

          <p className="mt-2 text-sm text-slate-600">
            We couldn't fetch your career journey
            information. Please try again.
          </p>

          <button
            type="button"
            onClick={() => refetch()}
            className="
              mt-5
              rounded-lg
              bg-indigo-600
              px-5
              py-2.5
              text-sm
              font-medium
              text-white
              hover:bg-indigo-700
            "
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  const workspace = data.data;

  return (
    <div className="flex min-h-screen bg-slate-50">
      <WorkspaceSidebar />

      <main className="min-w-0 flex-1">
        <div className="mx-auto max-w-7xl p-8">
          <div className="space-y-6">

            <WorkspaceHeader
              user={workspace.user}
              careerJourney={
                workspace.careerJourney
              }
            />

            <WorkspaceOverview
              overview={workspace.overview}
            />

            <StageRenderer
              workspace={workspace}
            />

            {isFetching && (
              <p className="text-xs text-slate-400">
                Updating workspace...
              </p>
            )}

          </div>
        </div>
      </main>
    </div>
  );
};

export default WorkspacePage;
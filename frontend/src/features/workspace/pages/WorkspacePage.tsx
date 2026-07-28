import {
  useState,
} from "react";

import WorkspaceSidebar
  from "../components/WorkspaceSidebar";

import WorkspaceHeader
  from "../components/WorkspaceHeader";

import WorkspaceOverview
  from "../components/WorkspaceOverview";

import WorkspaceLoading
  from "../components/WorkspaceLoading";

import StageRenderer
  from "../components/StageRenderer";

import {
  useGetWorkspaceQuery,
} from "../api/workspaceApi";

const WorkspacePage = () => {

  const [
    sidebarOpen,
    setSidebarOpen,
  ] = useState(false);

  const {

    data,

    isLoading,

    isFetching,

    isError,

    refetch,

  } = useGetWorkspaceQuery();

  /*
  |--------------------------------------------------------------------------
  | Loading
  |--------------------------------------------------------------------------
  */

  if (isLoading) {

    return (
      <WorkspaceLoading />
    );

  }

  /*
  |--------------------------------------------------------------------------
  | Error
  |--------------------------------------------------------------------------
  */

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
                    px-5
                    py-10
                    sm:px-6
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
                            text-xl
                            font-bold
                            text-red-600
                        "
          >
            !
          </div>

          <h2
            className="
                            mt-5
                            text-xl
                            font-bold
                            text-slate-900
                        "
          >
            Unable to load your workspace
          </h2>

          <p
            className="
                            mt-2
                            text-sm
                            leading-6
                            text-slate-600
                        "
          >
            We couldn't load your career
            workspace right now. Your progress
            is safe. Please try again.
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
                            rounded-xl
                            bg-blue-600
                            px-5
                            py-2.5
                            text-sm
                            font-semibold
                            text-white
                            transition
                            hover:bg-blue-700
                            focus:outline-none
                            focus:ring-2
                            focus:ring-blue-500
                            focus:ring-offset-2
                        "
          >
            Try Again
          </button>

        </div>

      </div>

    );

  }

  const workspace =
    data.data;

  /*
  |--------------------------------------------------------------------------
  | UI
  |--------------------------------------------------------------------------
  */

  return (

    <div
      className="
                min-h-screen
                bg-slate-50
                lg:flex
            "
    >

      <WorkspaceSidebar

        mobileOpen={
          sidebarOpen
        }

        onMobileClose={() =>
          setSidebarOpen(false)
        }

      />

      <main
        className="
                    min-w-0
                    flex-1
                    lg:ml-64
                "
      >

        <div
          className="
                        mx-auto
                        w-full
                        max-w-7xl
                        px-4
                        py-5
                        sm:px-6
                        sm:py-7
                        lg:px-8
                        lg:py-8
                    "
        >

          <div
            className="
                            space-y-5
                            sm:space-y-6
                        "
          >

            <WorkspaceHeader

              user={
                workspace.user
              }

              careerJourney={
                workspace
                  .careerJourney
              }

              onOpenMenu={() =>
                setSidebarOpen(true)
              }

            />

            <WorkspaceOverview
              overview={
                workspace.overview
              }
            />

            <StageRenderer
              workspace={
                workspace
              }
            />

            {isFetching && (

              <div
                className="
                                    flex
                                    items-center
                                    gap-2
                                    px-1
                                    text-xs
                                    font-medium
                                    text-slate-400
                                "
              >

                <span
                  className="
                                        h-1.5
                                        w-1.5
                                        animate-pulse
                                        rounded-full
                                        bg-blue-500
                                    "
                />

                Updating your workspace...

              </div>

            )}

          </div>

        </div>

      </main>

    </div>

  );

};

export default WorkspacePage;
import {
    useNavigate,
} from "react-router-dom";

import {
    WorkspaceState,
    type Workspace,
} from "../types/workspace.types";

import {
    useGenerateRoadmapMutation,
} from "../../roadmap/api/roadmapApi";

import InitialAssessmentCard
    from "./InitialAssessmentCard";

import GenerateRoadmapCard
    from "./GenerateRoadmapCard";

import StartJourneyCard
    from "./StartJourneyCard";

import ActiveMissionCard
    from "./ActiveMissionCard";

import NextMissionPendingCard
    from "./NextMissionPendingCard";

interface StageRendererProps {

    workspace: Workspace;

}

const StageRenderer = ({

    workspace,

}: StageRendererProps) => {

    const navigate =
        useNavigate();

    const [

        generateRoadmap,

        {
            isLoading:
            isGenerating,

            error:
            generationError,
        },

    ] =
        useGenerateRoadmapMutation();

    /*
    |--------------------------------------------------------------------------
    | Generate Roadmap
    |--------------------------------------------------------------------------
    */

    const handleGenerateRoadmap =
        async () => {

            try {

                await generateRoadmap({

                    careerJourneyId:
                        workspace
                            .careerJourney
                            .id,

                }).unwrap();

                navigate(
                    "/roadmap"
                );

            } catch {

                /*
                 * RTK Query exposes the
                 * request error through
                 * generationError.
                 */

            }

        };

    /*
    |--------------------------------------------------------------------------
    | Render Stage
    |--------------------------------------------------------------------------
    */

    switch (
    workspace.workspaceState
    ) {

        case WorkspaceState
            .INITIAL_ASSESSMENT:

            return (

                <InitialAssessmentCard />

            );

        case WorkspaceState
            .ROADMAP_PENDING:

            return (

                <div>

                    <GenerateRoadmapCard

                        onGenerate={
                            handleGenerateRoadmap
                        }

                        isGenerating={
                            isGenerating
                        }

                    />

                    {generationError && (

                        <div
                            className="
                                mt-4
                                rounded-xl
                                border
                                border-red-200
                                bg-red-50
                                px-4
                                py-3
                                text-sm
                                text-red-700
                            "
                        >
                            We couldn't generate your
                            roadmap. Please try again.
                        </div>

                    )}

                </div>

            );

        case WorkspaceState
            .MISSION_PENDING:

            return (

                <StartJourneyCard

                    careerJourneyId={
                        workspace
                            .careerJourney
                            .id
                    }

                />

            );

        case WorkspaceState
            .NEXT_MISSION_PENDING:

            return (

                <NextMissionPendingCard

                    nextMissionAvailableAt={
                        workspace
                            .nextMissionAvailableAt
                    }

                />

            );

        case WorkspaceState.ACTIVE:

            if (
                !workspace.activeMission
            ) {

                return null;

            }

            return (

                <ActiveMissionCard

                    activeMission={
                        workspace
                            .activeMission
                    }

                    today={
                        workspace.today
                    }

                    todayTask={
                        workspace.todayTask
                    }

                    overview={
                        workspace.overview
                    }

                />

            );

        case WorkspaceState
            .ROADMAP_COMPLETED:

            return (

                <section
                    className="
                        rounded-2xl
                        border
                        border-slate-200
                        bg-white
                        p-6
                        text-center
                        shadow-sm
                        sm:p-10
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
                            bg-blue-50
                            text-2xl
                            font-bold
                            text-blue-600
                        "
                    >
                        ✓
                    </div>

                    <h2
                        className="
                            mt-5
                            text-2xl
                            font-bold
                            text-slate-900
                        "
                    >
                        Roadmap completed
                    </h2>

                    <p
                        className="
                            mx-auto
                            mt-2
                            max-w-lg
                            text-sm
                            leading-6
                            text-slate-600
                        "
                    >
                        You've completed the learning
                        roadmap created for this career
                        journey.
                    </p>

                </section>

            );

        default:

            return null;

    }

};

export default StageRenderer;
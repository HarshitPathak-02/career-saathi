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

import ReadinessStageCard
    from "./ReadinessStageCard";


interface StageRendererProps {

    workspace:
    Workspace;

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

        /*
        |--------------------------------------------------------------------------
        | Initial Assessment
        |--------------------------------------------------------------------------
        */

        case WorkspaceState
            .INITIAL_ASSESSMENT:

            return (

                <InitialAssessmentCard />

            );


        /*
        |--------------------------------------------------------------------------
        | Roadmap Pending
        |--------------------------------------------------------------------------
        */

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


        /*
        |--------------------------------------------------------------------------
        | Initial Mission Pending
        |--------------------------------------------------------------------------
        */

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


        /*
        |--------------------------------------------------------------------------
        | Next Mission Pending
        |--------------------------------------------------------------------------
        */

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


        /*
        |--------------------------------------------------------------------------
        | Active Learning
        |--------------------------------------------------------------------------
        */

        case WorkspaceState
            .ACTIVE:

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


        /*
        |--------------------------------------------------------------------------
        | Readiness Stage
        |--------------------------------------------------------------------------
        |
        | Roadmap has been completed.
        |
        | User now:
        |
        | 1. Performs mock interviews
        | 2. Records scores
        | 3. Gets readiness evaluation
        | 4. Generates adaptive roadmap if not ready
        |
        |--------------------------------------------------------------------------
        */

        case WorkspaceState
            .READINESS:

            return (

                <ReadinessStageCard />

            );


        /*
        |--------------------------------------------------------------------------
        | Interview Ready
        |--------------------------------------------------------------------------
        */

        case WorkspaceState
            .READY:

            return (

                <section
                    className="
                        rounded-2xl
                        border
                        border-green-200
                        bg-white
                        p-6
                        shadow-sm
                        sm:p-8
                    "
                >

                    <div
                        className="
                            mx-auto
                            max-w-2xl
                            text-center
                        "
                    >

                        {/* Success Icon */}

                        <div
                            className="
                                mx-auto
                                flex
                                h-14
                                w-14
                                items-center
                                justify-center
                                rounded-2xl
                                bg-green-50
                                text-2xl
                                font-bold
                                text-green-600
                            "
                        >
                            ✓
                        </div>


                        {/* Title */}

                        <h2
                            className="
                                mt-5
                                text-2xl
                                font-bold
                                text-slate-900
                            "
                        >
                            You're interview ready
                        </h2>


                        {/* Description */}

                        <p
                            className="
                                mt-2
                                text-sm
                                leading-6
                                text-slate-600
                            "
                        >
                            Your recent mock interview
                            performance meets the readiness
                            criteria. You can now begin
                            applying for your target roles.
                        </p>


                        {/* CTA */}

                        <div
                            className="
                                mt-6
                                flex
                                justify-center
                            "
                        >

                            <button
                                type="button"
                                onClick={() =>
                                    navigate(
                                        "/jobs"
                                    )
                                }
                                className="
                                    rounded-xl
                                    bg-green-600
                                    px-5
                                    py-3
                                    text-sm
                                    font-semibold
                                    text-white
                                    transition
                                    hover:bg-green-700
                                "
                            >
                                Start Applying
                            </button>

                        </div>

                    </div>

                </section>

            );


        /*
        |--------------------------------------------------------------------------
        | Defensive Fallback
        |--------------------------------------------------------------------------
        */

        case WorkspaceState
            .ROADMAP_COMPLETED:

            return (

                <ReadinessStageCard />

            );


        /*
        |--------------------------------------------------------------------------
        | Unknown State
        |--------------------------------------------------------------------------
        */

        default:

            return null;

    }

};


export default StageRenderer;
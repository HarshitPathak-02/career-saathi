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

import InitialAssessmentCard from "./InitialAssessmentCard";
import GenerateRoadmapCard from "./GenerateRoadmapCard";
import StartJourneyCard from "./StartJourneyCard";
import ActiveMissionCard from "./ActiveMissionCard";
import NextMissionPendingCard from "./NextMissionPendingCard";

interface StageRendererProps {
    workspace: Workspace;
}

const StageRenderer = ({
    workspace,
}: StageRendererProps) => {
    const navigate = useNavigate();

    const [
        generateRoadmap,
        {
            isLoading: isGenerating,
            error: generationError,
        },
    ] = useGenerateRoadmapMutation();

    const handleGenerateRoadmap =
        async () => {
            try {
                await generateRoadmap({
                    careerJourneyId:
                        workspace.careerJourney.id,
                }).unwrap();

                navigate("/roadmap");
            } catch {
                // RTK Query exposes the error
                // through generationError.
            }
        };

    switch (workspace.workspaceState) {
        case WorkspaceState.INITIAL_ASSESSMENT:
            return (
                <InitialAssessmentCard />
            );

        case WorkspaceState.ROADMAP_PENDING:
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
                        <p className="mt-4 text-sm text-red-500">
                            We couldn't generate your
                            roadmap. Please try again.
                        </p>
                    )}
                </div>
            );

        case WorkspaceState.MISSION_PENDING:
            return (
                <StartJourneyCard
                    careerJourneyId={
                        workspace
                            .careerJourney
                            .id
                    }
                />
            );

        case WorkspaceState.NEXT_MISSION_PENDING:

            return (
                <NextMissionPendingCard
                    nextMissionAvailableAt={
                        workspace.nextMissionAvailableAt
                    }
                />
            );

        case WorkspaceState.ACTIVE:
            /*
             * ACTIVE workspace should always
             * contain an active mission.
             *
             * Still guard against null because
             * Workspace.activeMission is nullable.
             */
            if (!workspace.activeMission) {
                return null;
            }

            return (
                <ActiveMissionCard
                    activeMission={
                        workspace.activeMission
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

        default:
            return null;
    }
};

export default StageRenderer;
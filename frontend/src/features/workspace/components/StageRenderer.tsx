import {
    WorkspaceState,
    type Workspace,
} from "../types/workspace.types";

import InitialAssessmentCard from "./InitialAssessmentCard";
import GenerateRoadmapCard from "./GenerateRoadmapCard";
import StartJourneyCard from "./StartJourneyCard";
import ActiveMissionCard from "./ActiveMissionCard";

interface StageRendererProps {
    workspace: Workspace;
}

const StageRenderer = ({
    workspace,
}: StageRendererProps) => {

    switch (workspace.workspaceState) {

        case WorkspaceState.INITIAL_ASSESSMENT:
            return (
                <InitialAssessmentCard />
            );

        case WorkspaceState.ROADMAP_PENDING:
            return (
                <GenerateRoadmapCard />
            );

        case WorkspaceState.MISSION_PENDING:
            return (
                <StartJourneyCard />
            );

        case WorkspaceState.ACTIVE:
            return (
                <ActiveMissionCard
                    activeMission={
                        workspace.activeMission
                    }
                    tasks={
                        workspace.tasks
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
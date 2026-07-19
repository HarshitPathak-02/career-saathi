import {
    CreateMissionDTO,
    MissionPlanningResult,
    MissionWorkflowContext,
} from "./mission.types.js";

class MissionMapper {

    buildMission(
        context: MissionWorkflowContext,
        planning: MissionPlanningResult
    ): CreateMissionDTO {

        return {

            careerJourneyId:
                context.careerJourney._id,

            roadmapId:
                context.roadmap._id,

            missionNumber:
                planning.missionNumber,

            plannedRoadmapItemIds:
                planning.plannedRoadmapItemIds,

            startDate:
                planning.startDate,

            endDate:
                planning.endDate,

        };

    }

}

export const missionMapper =
    new MissionMapper();
import { MissionProgress } from "../daily-task/daily-task.types.js";
import { MissionDetailsDto, MissionSummaryDto } from "./mission.dto.js";
import { MissionDocument } from "./mission.schema.js";
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

    toMissionSummaryDto(
        mission: MissionDocument,
        progress: MissionProgress
    ): MissionSummaryDto {

        return {

            id:
                mission._id.toString(),

            missionNumber:
                mission.missionNumber,

            status:
                mission.status,

            startDate:
                mission.startDate,

            endDate:
                mission.endDate,

            totalDays:
                progress.totalDays,

            completedDays:
                progress.completedDays,

            progressPercentage:
                progress.progressPercentage,

        };

    }

    toMissionDetailsDto(
        mission: MissionDocument,
        progress: MissionProgress,
        currentMissionDay: number
    ): MissionDetailsDto {

        return {

            ...this.toMissionSummaryDto(
                mission,
                progress
            ),

            roadmapItemIds:
                mission.plannedRoadmapItemIds.map(
                    id => id.toString()
                ),

            currentMissionDay:
                currentMissionDay


        };

    }

}

export const missionMapper =
    new MissionMapper();
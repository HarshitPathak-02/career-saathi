import { UserDocument } from "../users/user.model.js";
import { CareerJourneyDocument } from "../career-journey/career-journey.model.js";
import { MissionDocument } from "../mission/mission.schema.js";

import { WorkspaceState } from "./workspace.enums.js";
import { WorkspaceResponseDto } from "./workspace-response.dto.js";

interface WorkspaceMapperInput {
    workspaceState: WorkspaceState;

    user: UserDocument;

    careerJourney: CareerJourneyDocument;

    hasInitialAssessment: boolean;

    hasRoadmap: boolean;

    hasActiveMission: boolean;

    activeMission: MissionDocument | null;
}

export class WorkspaceMapper {

    static toResponse(
        data: WorkspaceMapperInput
    ): WorkspaceResponseDto {

        return {

            workspaceState: data.workspaceState,

            user: {
                id: data.user._id.toString(),
                firstName: data.user.fullName,
            },

            careerJourney: {

                id: data.careerJourney._id.toString(),

                targetRole:
                    (data.careerJourney as any).roleId?.name ??
                    "",

                targetDomain:
                    (data.careerJourney as any).domainId?.name ??
                    "",

                targetCompany:
                    data.careerJourney.targetCompany,

                targetDurationMonths:
                    data.careerJourney.targetDurationMonths,

                dailyStudyHours:
                    data.careerJourney.dailyStudyHours,
            },

            overview: {

                currentMission:
                    data.activeMission?.missionNumber ?? 0,

                currentWeek: 0,

                completedTasks: 0,

                totalTasks: 0,

                progressPercentage: 0,

                streak: 0,
            },

            actions: {

                canStartAssessment:
                    !data.hasInitialAssessment,

                canGenerateRoadmap:
                    data.hasInitialAssessment &&
                    !data.hasRoadmap,

                canStartJourney:
                    data.hasRoadmap &&
                    !data.hasActiveMission,
            },
        };
    }

}
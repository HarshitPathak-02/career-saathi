import { Types } from "mongoose";

import { AppError } from "../../core/errors/app-error.js";

import { careerJourneyRepository } from "../career-journey/career-journey.repository.js";
import { assessmentRepository } from "../assessment/assessment.repository.js";
import { roadmapRepository } from "../roadmap/roadmap.repository.js";
import { missionRepository } from "../mission/mission.repository.js";

import { WorkspaceState } from "./workspace.enums.js";
import { AssessmentType } from "../assessment/assessment.enums.js";
import { WorkspaceMapper } from "./workspace.mapper.js";
import { userRepository } from "../users/index.js";

export class WorkspaceService {

    async getWorkspace(userId: string) {

        const userObjectId = new Types.ObjectId(userId);

        const careerJourney =
            await careerJourneyRepository.findActiveByUserId(
                userObjectId
            );

        if (!careerJourney) {
            throw new AppError(
                404,
                "Active career journey not found."
            );
        }

        const assessment =
            await assessmentRepository.findOne({
                careerJourneyId: careerJourney._id,
                type: AssessmentType.INITIAL,
            });

        const roadmap =
            await roadmapRepository.findByCareerJourneyId(
                careerJourney._id
            );

        const activeMission =
            await missionRepository.findActiveMission(
                careerJourney._id
            );

        const workspaceState =
            this.getWorkspaceState(
                !!assessment,
                !!roadmap,
                !!activeMission
            );

        const user =
            await userRepository.findById(userId);

        if (!user) {
            throw new AppError(
                404,
                "User not found."
            );
        }

        return WorkspaceMapper.toResponse({

            workspaceState,

            user,

            careerJourney,

            hasInitialAssessment: !!assessment,

            hasRoadmap: !!roadmap,

            hasActiveMission: !!activeMission,

            activeMission,

        });
    }

    private getWorkspaceState(
        hasAssessment: boolean,
        hasRoadmap: boolean,
        hasMission: boolean
    ): WorkspaceState {

        if (!hasAssessment) {
            return WorkspaceState.INITIAL_ASSESSMENT;
        }

        if (!hasRoadmap) {
            return WorkspaceState.ROADMAP_PENDING;
        }

        if (!hasMission) {
            return WorkspaceState.MISSION_PENDING;
        }

        return WorkspaceState.ACTIVE;
    }
}

export const workspaceService =
    new WorkspaceService();
import {
    Types,
} from "mongoose";

import {
    AppError,
} from "../../core/errors/app-error.js";

import {
    userRepository,
} from "../../modules/users/user.repository.js";

import {
    careerJourneyRepository,
} from "../career-journey/career-journey.repository.js";

import {
    assessmentRepository,
} from "../assessment/assessment.repository.js";

import {
    roadmapRepository,
} from "../roadmap/roadmap.repository.js";

import {
    missionRepository,
} from "../mission/mission.repository.js";

import {
    dailyTaskRepository,
} from "../daily-task/daily-task.repository.js";

import {
    AssessmentType,
} from "../assessment/assessment.enums.js";

import {
    WorkspaceMapper,
} from "./workspace.mapper.js";

export class WorkspaceService {

    async getWorkspace(
        userId: string
    ) {

        const userObjectId =
            new Types.ObjectId(userId);

        /*
         * 1. User
         */
        const user =
            await userRepository.findById(
                userId
            );

        if (!user) {
            throw new AppError(
                404,
                "User not found."
            );
        }

        /*
         * 2. Active Career Journey
         *
         * roleId and domainId are populated
         * by the repository.
         */
        const careerJourney =
            await careerJourneyRepository
                .findActiveByUserId(
                    userObjectId
                );

        if (!careerJourney) {
            throw new AppError(
                404,
                "Active career journey not found."
            );
        }

        /*
         * 3. Assessment + Roadmap + Mission
         */
        const [
            assessment,
            roadmap,
            activeMission,
        ] = await Promise.all([
            assessmentRepository.findOne({
                careerJourneyId:
                    careerJourney._id,

                type:
                    AssessmentType.INITIAL,
            }),

            roadmapRepository
                .findByCareerJourneyId(
                    careerJourney._id
                ),

            missionRepository
                .findActiveMission(
                    careerJourney._id
                ),
        ]);

        /*
         * 4. Active mission tasks
         */
        const tasks =
            activeMission
                ? await dailyTaskRepository
                    .findByMissionId(
                        activeMission._id
                    )
                : [];

        /*
         * 5. Names from populated master data
         */
        const targetRole =
            careerJourney.roleId.name;

        const targetDomain =
            careerJourney.domainId.name;

        return WorkspaceMapper.toResponse({
            user,

            careerJourney,

            assessment,

            roadmap,

            activeMission,

            tasks,

            targetRole,

            targetDomain,
        });
    }
}

export const workspaceService =
    new WorkspaceService();
import {
    ClientSession,
    Types,
} from 'mongoose';

import {
    AppError,
} from '../../core/errors/app-error.js';

import {
    HTTP_STATUS,
} from '../../core/constants/http-status.constants.js';

import {
    ProgressStatus,
} from '../../shared/enums/progress-status.enums.js';

import {
    missionRepository,
} from './mission.repository.js';

import {
    MissionDocument,
    MissionResponse,
} from './mission.types.js';

import {
    GeneratedMission,
} from '../roadmaps/roadmap.types.js';

import {
    toMissionResponse,
} from './mission.mapper.js';

class MissionService {

    async getPhaseMissions(
        roadmapPhaseId: string
    ): Promise<MissionResponse[]> {

        const missions =
            await missionRepository.findByPhaseId(
                roadmapPhaseId
            );

        return missions.map(
            toMissionResponse
        );
    }

    async getCurrentMission(
        roadmapPhaseId: string
    ): Promise<MissionDocument | null> {

        return missionRepository.findCurrentMission(
            roadmapPhaseId
        );
    }

    async unlockFirstMission(
        roadmapPhaseId: string,
        session?: ClientSession
    ): Promise<MissionDocument> {

        const firstMission =
            await missionRepository.findFirstMission(
                roadmapPhaseId,
                session
            );

        if (!firstMission) {

            throw new AppError(
                HTTP_STATUS.NOT_FOUND,
                'No missions found.'
            );
        }

        if (
            firstMission.status !==
            ProgressStatus.LOCKED
        ) {

            return firstMission;
        }

        const updatedMission =
            await missionRepository.updateById(
                firstMission.id,

                {
                    status:
                        ProgressStatus.AVAILABLE,

                    unlockedAt:
                        new Date(),
                },

                session
            );

        if (!updatedMission) {

            throw new AppError(
                HTTP_STATUS.INTERNAL_SERVER_ERROR,
                'Failed to unlock mission.'
            );
        }

        return updatedMission;
    }

    async createFromGeneratedMissions(
        userId: string,
        roadmapId: string,
        roadmapPhaseId: string,
        missions: GeneratedMission[],
        session: ClientSession
    ): Promise<MissionDocument[]> {

        const missionData =
            missions.map(
                (mission) => ({

                    userId:
                        new Types.ObjectId(
                            userId
                        ),

                    roadmapId:
                        new Types.ObjectId(
                            roadmapId
                        ),

                    roadmapPhaseId:
                        new Types.ObjectId(
                            roadmapPhaseId
                        ),

                    title:
                        mission.title,

                    description:
                        mission.description,

                    order:
                        mission.order,

                    estimatedDurationDays:
                        mission.tasks.reduce(
                            (
                                total,
                                task
                            ) =>
                                total +
                                Math.ceil(
                                    task.estimatedHours /
                                    2
                                ),

                            0
                        ),

                    status:
                        ProgressStatus.LOCKED,

                    progress:
                        0,

                    completedTaskCount:
                        0,

                    taskCount:
                        mission.tasks.length,
                })
            );

        return missionRepository.createMany(
            missionData,
            session
        );
    }

    async getById(
        missionId: string
    ): Promise<MissionResponse> {

        const mission =
            await missionRepository.findById(
                missionId
            );

        if (!mission) {

            throw new AppError(
                HTTP_STATUS.NOT_FOUND,
                'Mission not found.'
            );
        }

        return toMissionResponse(
            mission
        );
    }
}

export const missionService =
    new MissionService();
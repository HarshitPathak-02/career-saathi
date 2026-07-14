import { AppError } from '../../core/errors/app-error.js';
import { HTTP_STATUS } from '../../core/constants/http-status.constants.js';

import { missionRepository } from './mission.repository.js';

import { roadmapPhaseService } from '../roadmap-phase/roadmap-phase.service.js';

import { ProgressStatus } from '../../shared/enums/progress-status.enums.js';

import { MissionDocument, MissionResponse } from './mission.types.js';
import { GeneratedMission } from '../roadmaps/roadmap.types.js';
import { ClientSession, Types } from 'mongoose';
import { taskService } from '../task/task.service.js';
import { toMissionResponse } from './mission.mapper.js';

class MissionService {

    async getPhaseMissions(
        roadmapPhaseId: string
    ): Promise<MissionResponse[]> {

        return missionRepository.findByPhaseId(
            roadmapPhaseId
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
        console.log("unlockFirstMission phaseId:", roadmapPhaseId);

        const firstMission =
            await missionRepository.findFirstMission(
                roadmapPhaseId,
                session
            );
        console.log("firstMission:", firstMission);

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

        await taskService.unlockFirstTask(
            updatedMission.id,
            session
        );

        return updatedMission;
    }

    async updateProgress(
        missionId: string,
        completedTaskCount: number,
        taskCount: number
    ): Promise<MissionDocument> {

        const progress =
            taskCount === 0
                ? 0
                : Math.round(
                    (completedTaskCount /
                        taskCount) * 100
                );

        const mission =
            await missionRepository.updateById(
                missionId,
                {
                    completedTaskCount,
                    taskCount,
                    progress,
                }
            );

        if (!mission) {

            throw new AppError(
                HTTP_STATUS.NOT_FOUND,
                'Mission not found.'
            );
        }

        if (progress === 100) {

            await this.completeMission(
                mission.id
            );
        }

        return mission;
    }

    private async completeMission(
        missionId: string
    ): Promise<void> {

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

        await missionRepository.updateById(
            missionId,
            {
                status:
                    ProgressStatus.COMPLETED,

                progress: 100,

                completedAt:
                    new Date(),
            }
        );

        const nextMission = await this.unlockNextMission(
            mission.roadmapPhaseId.toString(),
            mission.order
        );

        if (nextMission) {

            await taskService.unlockFirstTask(
                nextMission.id
            );
        }

        const completedMissions =
            await missionRepository.findCompletedMissions(
                mission.roadmapPhaseId.toString()
            );

        const allMissions =
            await missionRepository.findByPhaseId(
                mission.roadmapPhaseId.toString()
            );

        await roadmapPhaseService.updateProgress(
            mission.roadmapPhaseId.toString(),
            completedMissions.length,
            allMissions.length
        );
    }

    private async unlockNextMission(
        roadmapPhaseId: string,
        currentOrder: number
    ): Promise<MissionDocument | null> {

        const nextMission =
            await missionRepository.findByOrder(
                roadmapPhaseId,
                currentOrder + 1
            );

        if (!nextMission) {
            return null;
        }

        if (
            nextMission.status !==
            ProgressStatus.LOCKED
        ) {
            return nextMission;
        }

        const updatedMission = await missionRepository.updateById(
            nextMission.id,
            {
                status:
                    ProgressStatus.AVAILABLE,

                unlockedAt:
                    new Date(),
            }
        );

        if (!updatedMission) {
            throw new AppError(
                HTTP_STATUS.INTERNAL_SERVER_ERROR,
                'Failed to unlock next mission.'
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
            missions.map(mission => ({

                userId: new Types.ObjectId(userId),

                roadmapId: new Types.ObjectId(roadmapId),

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

                        (total, task) =>

                            total +
                            Math.ceil(
                                task.estimatedHours / 2
                            ),

                        0
                    ),

                status:
                    ProgressStatus.LOCKED,

                progress: 0,

                completedTaskCount: 0,

                taskCount:
                    mission.tasks.length,
            }));

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
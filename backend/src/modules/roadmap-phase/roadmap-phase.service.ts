import { AppError } from '../../core/errors/app-error.js';
import { HTTP_STATUS } from '../../core/constants/http-status.constants.js';

import { roadmapPhaseRepository } from './roadmap-phase.repository.js';
import { PhaseStatus } from './roadmap-phase.enums.js';
import { RoadmapPhaseDocument, RoadmapPhaseResponse } from './roadmap-phase.types.js';
import { ClientSession, Types } from 'mongoose';
import { GeneratedPhase } from '../roadmaps/roadmap.types.js';
import { ProgressStatus } from '../../shared/enums/progress-status.enums.js';
import { missionService } from '../mission/mission.service.js';
import { toRoadmapPhaseResponse } from './roadmap-phase.mapper.js';

class RoadmapPhaseService {

    async getRoadmapPhases(
        roadmapId: string
    ): Promise<RoadmapPhaseResponse[]> {

        return roadmapPhaseRepository.findByRoadmapId(
            roadmapId
        );
    }

    async getCurrentPhase(
        roadmapId: string
    ): Promise<RoadmapPhaseDocument | null> {

        return roadmapPhaseRepository.findCurrentPhase(
            roadmapId
        );
    }

    async unlockFirstPhase(
        roadmapId: string,
        session?: ClientSession
    ): Promise<RoadmapPhaseResponse> {

        const firstPhase =
            await roadmapPhaseRepository.findFirstPhase(
                roadmapId,
                session
            );

        if (!firstPhase) {
            throw new AppError(
                HTTP_STATUS.NOT_FOUND,
                'No phases found for roadmap.'
            );
        }

        if (
            firstPhase.status !==
            ProgressStatus.LOCKED
        ) {
            return toRoadmapPhaseResponse(firstPhase);
        }

        const updatedPhase =
            await roadmapPhaseRepository.updateById(
                firstPhase.id,
                {
                    status:
                        ProgressStatus.AVAILABLE,

                    unlockedAt:
                        new Date(),
                },
                session
            );

        if (!updatedPhase) {
            throw new AppError(
                HTTP_STATUS.INTERNAL_SERVER_ERROR,
                'Failed to unlock first phase.'
            );
        }


        await missionService.unlockFirstMission(
            updatedPhase.id,
            session
        );

        return toRoadmapPhaseResponse(updatedPhase);
    }

    async updateProgress(
        phaseId: string,
        completedMissionCount: number,
        missionCount: number
    ): Promise<RoadmapPhaseResponse> {

        const progress =
            missionCount === 0
                ? 0
                : Math.round(
                    (completedMissionCount /
                        missionCount) * 100
                );

        const phase =
            await roadmapPhaseRepository.updateById(
                phaseId,
                {
                    completedMissionCount,

                    missionCount,

                    progress,
                }
            );

        if (!phase) {

            throw new AppError(
                HTTP_STATUS.NOT_FOUND,
                'Phase not found.'
            );
        }

        if (progress === 100) {

            await this.completePhase(
                phase.id
            );
        }

        return toRoadmapPhaseResponse(phase);
    }

    private async completePhase(
        phaseId: string
    ): Promise<void> {

        const phase =
            await roadmapPhaseRepository.findById(
                phaseId
            );

        if (!phase) {

            throw new AppError(
                HTTP_STATUS.NOT_FOUND,
                'Phase not found.'
            );
        }

        await roadmapPhaseRepository.updateById(
            phaseId,
            {
                status:
                    ProgressStatus.COMPLETED,

                progress: 100,

                completedAt:
                    new Date(),
            }
        );

        const nextPhase = await this.unlockNextPhase(
            phase.roadmapId.toString(),
            phase.order
        );

        if (nextPhase) {

            await missionService.unlockFirstMission(
                nextPhase.id
            );
        }
    }

    private async unlockNextPhase(
        roadmapId: string,
        currentOrder: number
    ): Promise<RoadmapPhaseDocument | null> {

        const nextPhase =
            await roadmapPhaseRepository.findByOrder(
                roadmapId,
                currentOrder + 1
            );

        if (!nextPhase) {
            return null;
        }

        if (
            nextPhase.status !==
            ProgressStatus.LOCKED
        ) {
            return nextPhase;
        }

        const updatedPhase = await roadmapPhaseRepository.updateById(
            nextPhase.id,
            {
                status:
                    ProgressStatus.AVAILABLE,

                unlockedAt:
                    new Date(),
            }
        );

        if (!updatedPhase) {
            throw new AppError(
                HTTP_STATUS.INTERNAL_SERVER_ERROR,
                'Failed to unlock next phase.'
            );
        }

        return updatedPhase;
    }

    async createFromGeneratedPhases(
        userId: string,
        roadmapId: string,
        phases: GeneratedPhase[],
        session: ClientSession
    ): Promise<RoadmapPhaseDocument[]> {

        const phaseData =
            phases.map(phase => ({

                userId: new Types.ObjectId(
                    userId
                ),
                roadmapId:
                    new Types.ObjectId(
                        roadmapId
                    ),

                title:
                    phase.title,

                description:
                    phase.description,

                order:
                    phase.order,

                estimatedDurationWeeks:
                    phase.estimatedWeeks,

                status:
                    ProgressStatus.LOCKED,

                progress: 0,

                completedMissionCount: 0,

                missionCount:
                    phase.missions.length,
            }));

        return roadmapPhaseRepository.createMany(
            phaseData,
            session
        );
    }

    async getById(
        phaseId: string
    ): Promise<RoadmapPhaseResponse> {

        const phase =
            await roadmapPhaseRepository.findById(
                phaseId
            );

        if (!phase) {

            throw new AppError(

                HTTP_STATUS.NOT_FOUND,

                'Roadmap phase not found.'
            );
        }

        return toRoadmapPhaseResponse(
            phase
        );
    }
}

export const roadmapPhaseService =
    new RoadmapPhaseService();
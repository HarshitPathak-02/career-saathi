import mongoose, { ClientSession } from 'mongoose';

import { Types } from 'mongoose';

import { roadmapRepository } from './roadmap.repository.js';

import { careerJourneyRepository } from '../career-journey/career-journey.repository.js';

import { assessmentRepository } from '../assessment/assessment.repository.js';

import { RoadmapGeneratorFactory } from '../generators/roadmap-generator.factory.js';

import {

    RoadmapGeneratedBy,

    RoadmapStatus,

} from './roadmap.enums.js';

import {

    GeneratedPhase,
    RoadmapGenerationInput,

    RoadmapResponse,

} from './roadmap.types.js';

import { toRoadmapResponse } from './roadmap.mapper.js';

import { AppError } from '../../core/errors/app-error.js';

import { HTTP_STATUS } from '../../core/constants/http-status.constants.js';

import { ROADMAP_MESSAGES } from './roadmap.constants.js';
import { roadmapPhaseRepository } from '../roadmap-phase/roadmap-phase.repository.js';
import { RoadmapPhaseDocument } from '../roadmap-phase/roadmap-phase.types.js';
import { ProgressStatus } from '../../shared/enums/progress-status.enums.js';
import { roadmapPhaseService } from '../roadmap-phase/roadmap-phase.service.js';
import { missionService } from '../mission/mission.service.js';
import { taskService } from '../task/task.service.js';
import { MissionDocument } from '../mission/mission.types.js';
import { roadmapHierarchyService } from '../roadmap-hierarchy/roadmap-hierarchy.service.js';

class RoadmapService {
    async generate(

        input: RoadmapGenerationInput

    ): Promise<RoadmapResponse> {
        const session =
            await mongoose.startSession();

        session.startTransaction();

        try {
            const journey =
                await careerJourneyRepository.findById(

                    input.careerJourneyId,

                    session

                );

            if (!journey)

                throw new AppError(

                    HTTP_STATUS.NOT_FOUND,

                    'Career journey not found.'

                );

            const assessment =
                await assessmentRepository.findById(

                    input.assessmentId,

                    session

                );

            if (!assessment)

                throw new AppError(

                    HTTP_STATUS.NOT_FOUND,

                    'Assessment not found.'

                );
            if (

                journey.userId.toString() !==

                input.userId

            )

                throw new AppError(

                    HTTP_STATUS.FORBIDDEN,

                    ROADMAP_MESSAGES.UNAUTHORIZED

                );
            const latest =
                await roadmapRepository.findLatestByJourneyId(

                    input.careerJourneyId,

                    session

                );
            const version =
                latest

                    ? latest.version + 1

                    : 1;
            await roadmapRepository.archiveActiveRoadmaps(

                input.careerJourneyId,

                session

            );
            const generator =

                RoadmapGeneratorFactory.create();

            const generated =

                await generator.generate(input);
            const roadmap =
                await roadmapRepository.create(
                    {
                        userId: new Types.ObjectId(
                            input.userId
                        ),

                        careerJourneyId:
                            new Types.ObjectId(
                                input.careerJourneyId
                            ),

                        assessmentId:
                            new Types.ObjectId(
                                input.assessmentId
                            ),

                        title:
                            generated.title,

                        description:
                            generated.description,

                        status:
                            RoadmapStatus.ACTIVE,

                        generatedBy:
                            RoadmapGeneratedBy.RULE_ENGINE,

                        version,
                    },
                    session
                );

            await roadmapHierarchyService.build(
                input.userId,
                roadmap.id,
                generated,
                session
            );

            await session.commitTransaction();
            return toRoadmapResponse(
                roadmap
            );
        }

        catch (error) {

            await session.abortTransaction();

            throw error;
        }
        finally {

            session.endSession();

        }
    }

    async getById(
        roadmapId: string
    ): Promise<RoadmapResponse> {

        const roadmap =
            await roadmapRepository.findById(
                roadmapId
            );

        if (!roadmap) {

            throw new AppError(

                HTTP_STATUS.NOT_FOUND,

                'Roadmap not found.'
            );
        }

        return toRoadmapResponse(
            roadmap
        );
    }

    async getActiveRoadmap(
        userId: string
    ): Promise<RoadmapResponse> {

        const journey =
            await careerJourneyRepository.findActiveByUserId(
                userId
            );

        if (!journey) {

            throw new AppError(

                HTTP_STATUS.NOT_FOUND,

                'Active career journey not found.'
            );
        }

        const roadmap =
            await roadmapRepository.findActiveByJourneyId(
                journey.id
            );

        if (!roadmap) {

            throw new AppError(

                HTTP_STATUS.NOT_FOUND,

                'Active roadmap not found.'
            );
        }

        return toRoadmapResponse(
            roadmap
        );
    }

    async getByCareerJourney(
        careerJourneyId: string
    ): Promise<RoadmapResponse[]> {

        const roadmaps =
            await roadmapRepository.findByJourneyId(
                careerJourneyId
            );

        return roadmaps.map(
            toRoadmapResponse
        );
    }

}

export const roadmapService = new RoadmapService();
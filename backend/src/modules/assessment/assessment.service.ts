import {
    assessmentRepository,
} from './assessment.repository.js';

import {
    careerJourneyRepository,
} from '../career-journey/career-journey.repository.js';

import {
    AssessmentResponse,
} from './assessment.types.js';

import {
    toAssessmentResponse,
} from './assessment.mapper.js';

import {
    AppError,
} from '../../core/errors/app-error.js';

import {
    HTTP_STATUS,
} from '../../core/constants/http-status.constants.js';

import {
    ASSESSMENT_MESSAGES,
} from './assessment.constants.js';

class AssessmentService {

    async getById(
        id: string,
        userId: string
    ): Promise<AssessmentResponse> {

        const assessment =
            await assessmentRepository.findById(
                id
            );

        if (!assessment) {

            throw new AppError(
                HTTP_STATUS.NOT_FOUND,
                ASSESSMENT_MESSAGES.NOT_FOUND
            );
        }

        if (
            assessment.userId.toString() !==
            userId
        ) {

            throw new AppError(
                HTTP_STATUS.FORBIDDEN,
                ASSESSMENT_MESSAGES.UNAUTHORIZED
            );
        }

        return toAssessmentResponse(
            assessment
        );
    }

    async getByJourney(
        careerJourneyId: string,
        userId: string
    ): Promise<AssessmentResponse[]> {

        const careerJourney =
            await careerJourneyRepository.findById(
                careerJourneyId
            );

        if (!careerJourney) {

            throw new AppError(
                HTTP_STATUS.NOT_FOUND,
                'Career journey not found.'
            );
        }

        if (
            careerJourney.userId.toString() !==
            userId
        ) {

            throw new AppError(
                HTTP_STATUS.FORBIDDEN,
                ASSESSMENT_MESSAGES.UNAUTHORIZED
            );
        }

        const assessments =
            await assessmentRepository
                .findByCareerJourneyId(
                    careerJourneyId
                );

        return assessments.map(
            toAssessmentResponse
        );
    }
}

export const assessmentService =
    new AssessmentService();
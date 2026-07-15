import {
    AssessmentSkillResultResponse,
} from './assessment-skill-result.types.js';

import {
    assessmentSkillResultRepository,
} from './assessment-skill-result.repository.js';

import {
    assessmentRepository,
} from '../assessment/assessment.repository.js';

import {
    toAssessmentSkillResultResponse,
} from './assessment-skill-result.mapper.js';

import {
    AppError,
} from '../../core/errors/app-error.js';

import {
    HTTP_STATUS,
} from '../../core/constants/http-status.constants.js';

class AssessmentSkillResultService {
    async findByAssessment(
        assessmentId: string,
        userId: string
    ): Promise<
        AssessmentSkillResultResponse[]
    > {
        const assessment =
            await assessmentRepository.findById(
                assessmentId
            );

        if (!assessment) {
            throw new AppError(
                HTTP_STATUS.NOT_FOUND,
                'Assessment not found.'
            );
        }

        if (
            assessment.userId.toString() !==
            userId
        ) {
            throw new AppError(
                HTTP_STATUS.FORBIDDEN,
                'Unauthorized.'
            );
        }

        const results =
            await assessmentSkillResultRepository
                .findByAssessmentId(
                    assessmentId
                );

        return results.map(
            toAssessmentSkillResultResponse
        );
    }
}

export const assessmentSkillResultService =
    new AssessmentSkillResultService();
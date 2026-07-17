import {
    AssessmentSkillResultResponse,
} from './assessment-skill-result.types.js';

import {
    assessmentSkillResultRepository,
} from './assessment-skill-result.repository.js';

import {
    toAssessmentSkillResultResponse,
} from './assessment-skill-result.mapper.js';

import {
    assessmentRepository,
} from '../assessment/assessment.repository.js';

import {
    AppError,
} from '../../core/errors/app-error.js';

import {
    HTTP_STATUS,
} from '../../core/constants/http-status.constants.js';

import {
    ASSESSMENT_MESSAGES,
} from '../assessment/assessment.constants.js';

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
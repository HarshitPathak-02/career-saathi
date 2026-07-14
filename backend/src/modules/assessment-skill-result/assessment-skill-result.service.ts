import {
    AssessmentSkillResultResponse,
} from './assessment-skill-result.types.js';

import {
    assessmentSkillResultRepository,
} from './assessment-skill-result.repository.js';

import {
    toAssessmentSkillResultResponse,
} from './assessment-skill-result.mapper.js';

class AssessmentSkillResultService {

    async findByAssessment(
        assessmentId: string
    ): Promise<
        AssessmentSkillResultResponse[]
    > {

        const results =
            await assessmentSkillResultRepository.findByAssessmentId(
                assessmentId
            );

        return results.map(
            toAssessmentSkillResultResponse
        );
    }
}

export const assessmentSkillResultService =
    new AssessmentSkillResultService();
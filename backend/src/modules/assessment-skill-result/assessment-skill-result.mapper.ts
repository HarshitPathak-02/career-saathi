import {
    AssessmentSkillResultDocument,
    AssessmentSkillResultResponse,
} from './assessment-skill-result.types.js';

export function toAssessmentSkillResultResponse(
    result: AssessmentSkillResultDocument
): AssessmentSkillResultResponse {

    return {
        id: result.id,

        skillCode:
            result.skillCode,

        score:
            result.score,

        level:
            result.level,

        correctAnswers:
            result.correctAnswers,

        totalQuestions:
            result.totalQuestions,

        createdAt:
            result.createdAt,

        updatedAt:
            result.updatedAt,
    };
}
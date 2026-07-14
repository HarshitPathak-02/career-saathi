import {
    AssessmentQuestionDocument,
    AssessmentQuestionResponse,
} from './assessment-question.types.js';

export function toAssessmentQuestionResponse(
    question: AssessmentQuestionDocument
): AssessmentQuestionResponse {
    return {
        id: question.id,

        careerRoleCode:
            question.careerRoleCode,

        skillCode:
            question.skillCode,

        difficulty:
            question.difficulty,

        type:
            question.type,

        question:
            question.question,

        options:
            question.options,

        explanation:
            question.explanation,

        isActive:
            question.isActive,

        createdAt:
            question.createdAt,

        updatedAt:
            question.updatedAt,
    };
}
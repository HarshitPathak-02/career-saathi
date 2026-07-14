import {
    AssessmentDocument,
    AssessmentResponse,
} from './assessment.types.js';

export function toAssessmentResponse(
    assessment: AssessmentDocument
): AssessmentResponse {
    return {
        id: assessment.id,

        status: assessment.status,

        overallScore:
            assessment.overallScore,

        overallLevel:
            assessment.overallLevel,

        startedAt:
            assessment.startedAt,

        completedAt:
            assessment.completedAt,

        createdAt:
            assessment.createdAt,

        updatedAt:
            assessment.updatedAt,
    };
}
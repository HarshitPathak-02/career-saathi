import {
    AssessmentDocument,
    AssessmentResponse,
} from './assessment.types.js';

export function toAssessmentResponse(
    assessment: AssessmentDocument
): AssessmentResponse {

    return {

        id:
            assessment.id,

        contextType:
            assessment.contextType,

        contextId:
            assessment.contextId
                ?.toString(),

        status:
            assessment.status,

        passingScore:
            assessment.passingScore,

        passed:
            assessment.passed,

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
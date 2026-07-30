import {
    AssessmentDocument,
} from "./assessment.model.js";

import type {
    AssessmentResponse,
} from "./assessment.types.js";

class AssessmentResponseMapper {

    /*
    |--------------------------------------------------------------------------
    | Assessment
    |--------------------------------------------------------------------------
    */

    toAssessmentResponse(
        assessment: AssessmentDocument
    ): AssessmentResponse {

        return {

            id:
                assessment._id
                    .toString(),

            careerJourneyId:
                assessment
                    .careerJourneyId
                    .toString(),

            type:
                assessment.type,

            weekNumber:
                assessment.weekNumber,

            title:
                assessment.title,

            description:
                assessment.description ??
                null,

            status:
                assessment.status,

            completedAt:
                assessment.completedAt ??
                null,

            createdAt:
                assessment.createdAt,

            updatedAt:
                assessment.updatedAt,

        };

    }

}

export const assessmentResponseMapper =
    new AssessmentResponseMapper();
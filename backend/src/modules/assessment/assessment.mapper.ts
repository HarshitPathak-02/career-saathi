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

            skillCatalogIds:
                assessment.skillCatalogIds.map(
                    (skillCatalogId) =>
                        skillCatalogId.toString()
                ),

            deliveryMode:
                assessment.deliveryMode,

            status:
                assessment.status,

            sectionCount:
                assessment.sectionCount,

            completedSectionCount:
                assessment.completedSectionCount,

            startedAt:
                assessment.startedAt ??
                null,

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
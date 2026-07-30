import {
    MockInterviewDocument,
} from "./mock-interview.model.js";

import {
    MockInterviewResponse,
} from "./mock-interview.types.js";


class MockInterviewResponseMapper {

    toResponse(
        mockInterview:
            MockInterviewDocument
    ): MockInterviewResponse {

        return {

            id:
                mockInterview._id
                    .toString(),

            careerJourneyId:
                mockInterview
                    .careerJourneyId
                    .toString(),

            interviewNumber:
                mockInterview
                    .interviewNumber,

            platform:
                mockInterview.platform,

            interviewType:
                mockInterview
                    .interviewType,

            overallScore:
                mockInterview
                    .overallScore,

            technicalScore:
                mockInterview
                    .technicalScore,

            problemSolvingScore:
                mockInterview
                    .problemSolvingScore,

            communicationScore:
                mockInterview
                    .communicationScore,

            feedback:
                mockInterview.feedback,

            interviewedAt:
                mockInterview
                    .interviewedAt,

            status:
                mockInterview.status,

            createdAt:
                mockInterview.createdAt,
        };
    }


    toResponseList(
        mockInterviews:
            MockInterviewDocument[]
    ): MockInterviewResponse[] {

        return mockInterviews.map(
            mockInterview =>
                this.toResponse(
                    mockInterview
                )
        );
    }
}


export const mockInterviewResponseMapper =
    new MockInterviewResponseMapper();
export type MockInterviewType =
    "technical" |
    "behavioral" |
    "mixed";


export type MockInterviewStatus =
    "completed";


/*
|--------------------------------------------------------------------------
| Create Mock Interview
|--------------------------------------------------------------------------
*/

export interface CreateMockInterviewInput {

    careerJourneyId:
    string;

    platform:
    string;

    interviewType:
    MockInterviewType;

    overallScore:
    number;

    technicalScore:
    number;

    problemSolvingScore:
    number;

    communicationScore:
    number;

    feedback?:
    string;

    interviewedAt:
    string;

}


/*
|--------------------------------------------------------------------------
| Mock Interview
|--------------------------------------------------------------------------
*/

export interface MockInterview {

    id:
    string;

    careerJourneyId:
    string;

    interviewNumber:
    number;

    platform:
    string;

    interviewType:
    MockInterviewType;

    overallScore:
    number;

    technicalScore:
    number;

    problemSolvingScore:
    number;

    communicationScore:
    number;

    feedback:
    string;

    interviewedAt:
    string;

    status:
    MockInterviewStatus;

    createdAt:
    string;

    updatedAt:
    string;

}


/*
|--------------------------------------------------------------------------
| API Responses
|--------------------------------------------------------------------------
*/

export interface MockInterviewResponse {

    success:
    boolean;

    data:
    MockInterview;

}


export interface MockInterviewsResponse {

    success:
    boolean;

    data:
    MockInterview[];

}
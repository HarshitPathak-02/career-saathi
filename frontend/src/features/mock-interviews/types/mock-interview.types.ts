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

export type ReadinessBatterySlotStatus =
    "LOCKED" |
    "NOT_STARTED" |
    "IN_PROGRESS" |
    "COMPLETED";

export interface ReadinessBatterySlot {
    interviewNumber: number;
    title: string;
    description: string;
    type: MockInterviewType;
    status: ReadinessBatterySlotStatus;
    overallScore: number | null;
    technicalScore: number | null;
    problemSolvingScore: number | null;
    communicationScore: number | null;
    feedback: string | null;
    completedAt: string | null;
    sessionId: string | null;
}

export interface ReadinessBatteryResponse {
    careerJourneyId: string;
    status: string;
    slots: ReadinessBatterySlot[];
    completedCount: number;
    totalRequired: number;
    canEvaluateReadiness: boolean;
}

export interface StartOfficialMockInterviewRequest {
    careerJourneyId: string;
    interviewNumber: number;
}
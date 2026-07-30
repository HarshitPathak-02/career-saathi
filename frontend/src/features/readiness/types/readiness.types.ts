/*
|--------------------------------------------------------------------------
| Readiness
|--------------------------------------------------------------------------
*/

export type ReadinessStatus =
    "insufficient_data" |
    "ready_to_evaluate" |
    "not_ready" |
    "ready";


export type ReadinessWeakArea =
    "technical_skills" |
    "technical_interview" |
    "problem_solving" |
    "communication";


export type ReadinessRecommendation =
    "complete_more_mock_interviews" |
    "continue_interview_practice" |
    "generate_adaptive_roadmap" |
    "start_job_applications";


/*
|--------------------------------------------------------------------------
| Breakdown
|--------------------------------------------------------------------------
*/

export interface ReadinessBreakdown {

    skillScore:
    number;

    technicalInterviewScore:
    number;

    problemSolvingScore:
    number;

    communicationScore:
    number;

}


/*
|--------------------------------------------------------------------------
| Evaluation
|--------------------------------------------------------------------------
*/

/*
|--------------------------------------------------------------------------
| Evaluation
|--------------------------------------------------------------------------
*/

export interface ReadinessEvaluation {

    careerJourneyId:
    string;

    status:
    ReadinessStatus;

    readinessScore:
    number | null;

    readyForInterviews:
    boolean;

    /*
     * Number of recent completed mock interviews
     * currently available as readiness evidence.
     *
     * Example:
     * User has completed 2 mocks -> 2
     */
    availableMockInterviews:
    number;

    /*
     * Minimum number of mock interviews required
     * before readiness can be evaluated.
     *
     * Currently -> 3
     */
    minimumMockInterviewsRequired:
    number;

    /*
     * Number of mock interviews actually used
     * in the persisted readiness evaluation.
     *
     * Before evaluation -> 0
     * After evaluation  -> 3
     */
    mockInterviewsConsidered:
    number;

    breakdown:
    ReadinessBreakdown | null;

    weakAreas:
    ReadinessWeakArea[];

    recommendation:
    ReadinessRecommendation;

}


/*
|--------------------------------------------------------------------------
| API Response
|--------------------------------------------------------------------------
*/

export interface ReadinessResponse {

    success:
    boolean;

    data:
    ReadinessEvaluation;

}

/*
|--------------------------------------------------------------------------
| Mock Interviews
|--------------------------------------------------------------------------
*/

export type MockInterviewType =
    "technical" |
    "behavioral" |
    "mixed";


export type MockInterviewStatus =
    "completed";


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
| Mock Interview API Responses
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
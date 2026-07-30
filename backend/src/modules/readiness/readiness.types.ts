import {
    ReadinessRecommendation,
    ReadinessStatus,
    ReadinessWeakArea,
} from "./readiness.enums.js";


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
    |--------------------------------------------------------------------------
    | Mock Interview Evidence
    |--------------------------------------------------------------------------
    |
    | availableMockInterviews:
    | Number of currently completed mock interviews available for the
    | readiness workflow.
    |
    | minimumMockInterviewsRequired:
    | Minimum number required before evaluation can be performed.
    |
    | mockInterviewsConsidered:
    | Number of mock interviews actually used by the persisted readiness
    | evaluation. Before an evaluation exists, this should be 0.
    |
    */

    availableMockInterviews:
    number;

    minimumMockInterviewsRequired:
    number;

    mockInterviewsConsidered:
    number;


    /*
    |--------------------------------------------------------------------------
    | Evaluation Result
    |--------------------------------------------------------------------------
    */

    breakdown:
    ReadinessBreakdown | null;

    weakAreas:
    ReadinessWeakArea[];

    recommendation:
    ReadinessRecommendation;

}
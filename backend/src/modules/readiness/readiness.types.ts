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

    mockInterviewsConsidered:
    number;

    breakdown:
    ReadinessBreakdown | null;

    weakAreas:
    ReadinessWeakArea[];

    recommendation:
    ReadinessRecommendation;
}
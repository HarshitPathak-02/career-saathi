export type RoadmapStatus =
    | "GENERATING"
    | "ACTIVE"
    | "COMPLETED"
    | "FAILED";

export type RoadmapItemType =
    | "TOPIC"
    | "PROJECT"
    | "REVISION"
    | "MOCK_INTERVIEW"
    | "RESUME"
    | "PORTFOLIO"
    | "JOB_APPLICATION"
    | "ASSESSMENT";

export type RoadmapItemStatus =
    | "PENDING"
    | "IN_PROGRESS"
    | "COMPLETED"
    | "SKIPPED";


export interface Roadmap {

    id: string;

    title: string;

    targetRole: string;

    targetDomain: string;

    targetDurationMonths: number;

    estimatedWeeks: number;

    totalItems: number;

    completedItems: number;

    status: RoadmapStatus;

    generatedAt?: string | null;

}


export interface RoadmapItem {

    id: string;

    order: number;

    type: RoadmapItemType;

    title: string;

    description: string;

    estimatedHours: number;

    aiReason: string;

    status: RoadmapItemStatus;

}


export interface GenerateRoadmapRequest {

    careerJourneyId: string;

}
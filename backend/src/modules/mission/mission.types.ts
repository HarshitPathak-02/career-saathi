import { Types } from "mongoose";
import { MissionStatus } from "./mission.enums.js";
import { RoadmapItemDocument } from "../roadmap/roadmap-item.model.js";
import { CareerJourneyDocument } from "../career-journey/career-journey.model.js";
import { RoadmapDocument } from "../roadmap/roadmap.model.js";

export interface CreateMissionDTO {

    careerJourneyId: Types.ObjectId;

    roadmapId: Types.ObjectId;

    missionNumber: number;

    plannedRoadmapItemIds: Types.ObjectId[];

    revisionPlans: MissionRevisionPlan[];

    startDate: Date;

    endDate: Date;

}

export interface UpdateMissionDTO {

    status?: MissionStatus;

    startDate?: Date;

    endDate?: Date;

}

export interface MissionFilter {

    careerJourneyId?: Types.ObjectId;

    status?: MissionStatus;

    missionNumber?: number;

}

export interface MissionPlanningResult {

    missionNumber: number;

    plannedRoadmapItemIds: Types.ObjectId[];

    revisionPlans: MissionRevisionPlan[];

    startDate: Date;

    endDate: Date;
}

export interface MissionPlanningInput {

    missionNumber: number;

    newRoadmapItems: RoadmapItemDocument[];

    carryForwardRoadmapItemIds: Types.ObjectId[];

    revisionPlans: MissionRevisionPlan[];

    workloadMultiplier: number;

    startDate: Date;

    endDate: Date;

    targetRoadmapItemsPerMission: number;

}

export interface MissionWorkflowContext {

    careerJourney: CareerJourneyDocument;

    roadmap: RoadmapDocument;

    roadmapItems: RoadmapItemDocument[];

    missionNumber: number

}

export interface MissionRevisionPlan {

    skillCatalogId: Types.ObjectId;

    skillName: string;

    percentage: number;

    revisionTopics: string[];

}
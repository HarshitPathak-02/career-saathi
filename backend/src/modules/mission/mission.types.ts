import { Types } from "mongoose";
import { MissionStatus } from "./mission.enums.js";
import { RoadmapItemDocument } from "../roadmap/roadmap-item.schema.js";
import { CareerJourneyDocument } from "../career-journey/career-journey.model.js";
import { RoadmapDocument } from "../roadmap/roadmap.schema.js";

export interface CreateMissionDTO {

    careerJourneyId: Types.ObjectId;

    roadmapId: Types.ObjectId;

    missionNumber: number;

    plannedRoadmapItemIds: Types.ObjectId[];

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

    startDate: Date;

    endDate: Date;
}

export interface MissionPlanningInput {

    missionNumber: number;

    newRoadmapItems: RoadmapItemDocument[];

    carryForwardRoadmapItemIds: Types.ObjectId[];

    revisionRoadmapItemIds: Types.ObjectId[];

    workloadMultiplier: number;

    startDate: Date;

    endDate: Date;

    targetRoadmapItemsPerMission: number;

}

export interface MissionWorkflowContext {

    careerJourney: CareerJourneyDocument;

    roadmap: RoadmapDocument;

    roadmapItems: RoadmapItemDocument[];

}
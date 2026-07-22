import { MissionDocument } from "./mission.schema.js";
import { WeeklyReportDocument } from "../weekly-report/weekly-report.schema.js";
import { SkillProgressDocument } from "../skill-progress/skill-progress.schema.js";
import { RoadmapDocument } from "../roadmap/roadmap.schema.js";
import { RoadmapItemDocument } from "../roadmap/roadmap-item.schema.js";
import { Types } from "mongoose";
import { PopulatedSkillProgressDocument, SkillProgressPlanningData } from "../skill-progress/skill-progress.types.js";

export interface NextMissionWorkflowContext {

    previousMission: MissionDocument;

    weeklyReport: WeeklyReportDocument;

    roadmap: RoadmapDocument;

    skillProgress: SkillProgressPlanningData[];

    pendingRoadmapItems: RoadmapItemDocument[];

}
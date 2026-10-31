import {
    MissionDocument,
} from "./mission.model.js";

import {
    WeeklyReportDocument,
} from "../weekly-report/weekly-report.model.js";

import {
    RoadmapDocument,
} from "../roadmap/roadmap.model.js";

import {
    RoadmapItemDocument,
} from "../roadmap/roadmap-item.model.js";

import {
    SkillProgressPlanningData,
} from "../skill-progress/skill-progress.types.js";

import {
  CodingAttemptDocument,
} from "../practice/coding-attempt.model.js";

import {
  InterviewSessionDocument,
} from "../practice/interview-session.model.js";

export interface NextMissionWorkflowContext {

    previousMission:
    MissionDocument;

    weeklyReport:
    WeeklyReportDocument;

    roadmap:
    RoadmapDocument;

    skillProgress:
    SkillProgressPlanningData[];

    resumeSkillProgress:
    SkillProgressPlanningData[];

    optedInCodingAttempts:
    CodingAttemptDocument[];

    optedInInterviewSessions?:
    InterviewSessionDocument[];

    pendingRoadmapItems:
    RoadmapItemDocument[];

    inProgressRoadmapItems:
    RoadmapItemDocument[];
}
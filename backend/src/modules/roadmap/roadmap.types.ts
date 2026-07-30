import { CareerDomainDocument } from "../../master-data/career-domain/career-domain.schema.js";
import { CareerRoleDocument } from "../../master-data/career-role/career-role.schema.js";
import { SkillCatalogDocument, SkillDifficulty } from "../../master-data/skill-catalog/index.js";
import { CareerJourneyDocument } from "../career-journey/career-journey.model.js";
import { MockInterviewDocument } from "../mock-interview/mock-interview.model.js";
import { ReadinessEvaluation } from "../readiness/readiness.types.js";
import { SkillLevel } from "../user-skill/user-skill.enums.js";
import { UserSkillDocument } from "../user-skill/user-skill.model.js";
import { RoadmapItemStatus, RoadmapItemType, RoadmapStatus, RoadmapType } from "./roadmap.enums.js";
import { RoadmapDocument } from "./roadmap.model.js";

/* -------------------------------------------------------------------------- */
/*                           AI INPUT (Backend -> AI)                         */
/* -------------------------------------------------------------------------- */

export interface AvailableSkill {
    skillId: string;
    title: string;
    description: string;

    category: string;

    difficulty: SkillDifficulty;
}

export interface RoadmapGenerationInput {
    target: TargetContext;
    currentSkills: CurrentSkillContext[];
    requiredSkills: RequiredSkillContext[];

    availableSkills: AvailableSkill[];
}

export interface TargetContext {
    role: string;
    domain: string;
    targetCompany?: string;
    durationMonths: number;
    dailyStudyHours: number;
}

export interface RequiredSkillContext {
    skillId: string;
    skillName: string;
    category: string;
    difficulty: SkillDifficulty;
    description: string;
}

export interface CurrentSkillContext {
    skillId: string;

    skillName: string;

    currentScore: number;

    currentLevel: SkillLevel;

    selectedByUser: boolean;

    lastAssessmentAt?: Date | null;
}

export interface CareerJourneyContext {
    targetRole: string;
    targetDomain: string;
    targetDurationMonths: number;
    studyHoursPerDay: number;
}

export interface AssessmentContext {
    skills: SkillAssessmentContext[];
}

export interface SkillAssessmentContext {
    skillId: string;
    skillName: string;
    score: number;
    level: string;
}

export interface SkillCatalogContext {
    skills: SkillCatalogItem[];
}

export interface SkillCatalogItem {
    skillId: string;
    skillName: string;
}

/* -------------------------------------------------------------------------- */
/*                           AI OUTPUT (AI -> Backend)                        */
/* -------------------------------------------------------------------------- */

export interface RoadmapGenerationOutput {
    title: string;
    roadmapItems: RoadmapItemOutput[];
}

export interface RoadmapItemOutput {
    order: number;

    type: RoadmapItemType;

    skillId?: string;


    title: string;

    description: string;

    estimatedHours: number;

    aiReason: string;

    skillName?: string;

    metadata?: Record<string, unknown>;
}

export interface RoadmapWorkflowContext {
    careerJourney: CareerJourneyDocument;
    role: CareerRoleDocument;
    domain: CareerDomainDocument;
    skillCatalog: SkillCatalogDocument[];
    userSkills: UserSkillDocument[];
}

export interface RoadmapResponse {

    id: string;

    version: number;

    type: RoadmapType;

    previousRoadmapId?: string | null;

    title: string;

    targetRole: string;

    targetDomain: string;

    targetDurationMonths: number;

    estimatedWeeks: number;

    totalItems: number;

    completedItems: number;

    status: RoadmapStatus;

    generatedAt?: Date | null;

    completedAt?: Date | null;

}

export interface RoadmapItemResponse {

    id: string;

    order: number;

    type: RoadmapItemType;

    title: string;

    description: string;

    estimatedHours: number;

    aiReason: string;

    status: RoadmapItemStatus;

    completedAt?: Date;

}

export interface GenerateRoadmapResponse {

    roadmapId: string;

    message: string;

}

/* -------------------------------------------------------------------------- */
/*                       ADAPTIVE ROADMAP GENERATION                           */
/* -------------------------------------------------------------------------- */

export interface AdaptiveRoadmapGenerationInput {

    target:
    TargetContext;

    previousRoadmap: {
        roadmapId: string;

        version: number;

        title: string;
    };

    currentSkills:
    AdaptiveSkillContext[];

    recentMockInterviews:
    AdaptiveMockInterviewContext[];

    readiness: {
        readinessScore: number;

        skillScore: number;

        technicalInterviewScore: number;

        problemSolvingScore: number;

        communicationScore: number;

        weakAreas: string[];
    };
}


export interface AdaptiveSkillContext {

    skillId: string;

    skillName: string;

    currentScore: number;

    currentLevel:
    SkillLevel;
}


export interface AdaptiveMockInterviewContext {

    interviewNumber: number;

    interviewType: string;

    overallScore: number;

    technicalScore: number;

    problemSolvingScore: number;

    communicationScore: number;

    feedback: string;
}

export interface AdaptiveRoadmapWorkflowContext {

    careerJourney:
    CareerJourneyDocument;

    role:
    CareerRoleDocument;

    domain:
    CareerDomainDocument;

    previousRoadmap:
    RoadmapDocument;

    userSkills:
    UserSkillDocument[];

    skillCatalog:
    SkillCatalogDocument[];

    mockInterviews:
    MockInterviewDocument[];

    readiness:
    ReadinessEvaluation;
}
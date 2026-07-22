import { Types } from "mongoose";
import { SkillCatalogDocument } from "../../master-data/skill-catalog/skill-catalog.schema.js";
import { MissionDifficulty } from "../mission/mission.enums.js";
import { SkillProgressDocument } from "../skill-progress/skill-progress.schema.js";
import { UserSkillDocument } from "../user-skill/user-skill.schema.js";

export interface WeeklySummaryOutput {

    summary: string;

    achievements: string[];

    improvements: string[];

}

export interface MentorFeedbackOutput {

    advice: string;

    motivationMessage: string;

}

export interface MissionRecommendationOutput {

    weakSkills: string[];

    revisionTopics: string[];

    recommendedDifficulty: MissionDifficulty;

    recommendedStudyHours: number;

    prioritizeRevision: boolean;

    skipCompletedTopics: boolean;

}

export interface WeeklyReportGenerationOutput {

    summary: WeeklySummaryOutput;

    mentorFeedback: MentorFeedbackOutput;

    recommendation: MissionRecommendationOutput;

}

export interface WeeklyReportMission {

    missionNumber: number;

    roadmapItems: string[];

}

export interface WeeklyReportAssessment {

    title: string;

    type: string;

    weekNumber: number;

}

export interface WeeklyReportReflection {

    learningReflection: {

        completedAllTasks: boolean;

        reason?: string | null;

        difficultyType?: string | null;

        confidenceRating: number;

    };

    mentorCheckIn: {

        overallWeek: string;

        motivationLevel: string;

        externalFactors?: string | null;

        careerConcern?: string | null;

        helpNeeded?: string | null;

    };

    additionalComments?: string | null;

}

export interface WeeklyReportSkill {

    skillName: string;

    obtainedMarks: number;

    totalMarks: number;

    percentage: number;

    improvementPercentage: number | null | undefined;

}

export interface BuildWeeklyReportPromptInput {

    mission: WeeklyReportMission;

    assessment: WeeklyReportAssessment;

    reflection: WeeklyReportReflection;

    skills: WeeklyReportSkill[];

}

export type PopulatedUserSkillDocument =
    Omit<UserSkillDocument, "skillCatalogId"> & {
        skillCatalogId: SkillCatalogDocument;
    };

export type PopulatedSkillProgressDocument =
    Omit<SkillProgressDocument, "userSkillId"> & {
        userSkillId: PopulatedUserSkillDocument;
    };

export interface CreateWeeklyReportDTO {

    careerJourneyId: Types.ObjectId;

    missionId: Types.ObjectId;

    assessmentId: Types.ObjectId;

    reflectionId: Types.ObjectId;

    promptVersion: number;

    summary: WeeklySummaryOutput;

    mentorFeedback: MentorFeedbackOutput;

    recommendation: MissionRecommendationOutput;

}
import {
    SubmitAssessmentDTO,
} from "../assessment/assessment.types.js";

import {
    CreateWeeklyReflectionDTO,
    SubmitWeeklyReflectionDTO,
} from "../weekly-reflection/weekly-reflection.types.js";

export interface SubmitWeeklyReviewDTO {

    assessment: SubmitAssessmentDTO;

    reflection: SubmitWeeklyReflectionDTO;

}

export interface WeeklyReviewRoadmapItemDTO {

    id: string;

    title: string;

    description: string;

}

export interface WeeklyReviewSkillDTO {

    userSkillId: string;

    skillCatalogId: string;

    skillName: string;

    currentScore: number;

    roadmapItems: WeeklyReviewRoadmapItemDTO[];

}

export interface WeeklyReviewPreparationDTO {

    missionId: string;

    missionNumber: number;

    weekNumber: number;

    assessmentId: string;

    skills: WeeklyReviewSkillDTO[];

}
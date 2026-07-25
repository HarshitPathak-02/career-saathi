import { Types } from "mongoose";

import {
    AssessmentStatus,
    AssessmentType,
} from "./assessment.enums.js";
import { CreateSkillProgressDTO } from "../skill-progress/skill-progress.types.js";
import { AssessmentMethod } from "../skill-progress/skill-progress.enums.js";

export interface CreateAssessmentDTO {
    careerJourneyId: Types.ObjectId;

    type: AssessmentType;

    weekNumber: number;

    title: string;

    description?: string;
}

export interface UpdateAssessmentStatusDTO {
    status: AssessmentStatus;

    completedAt?: Date;
}

export interface SubmitAssessmentDTO {

    assessmentId: string;

    skills: CreateSkillProgressDTO[];

}

/*
|--------------------------------------------------------------------------
| Assessment History
|--------------------------------------------------------------------------
*/

export interface AssessmentHistoryItem {
    id: string;

    type: AssessmentType;

    weekNumber: number;

    title: string;

    description?: string | null;

    status: AssessmentStatus;

    completedAt: Date | null;

    createdAt: Date;
}

/*
|--------------------------------------------------------------------------
| Assessment Detail
|--------------------------------------------------------------------------
*/

export interface AssessmentSkillDetail {
    id: string;

    userSkillId: string;

    skillCatalogId: string;

    skillName: string;

    obtainedMarks: number;

    totalMarks: number;

    percentage: number;

    improvementPercentage: number | null;

    assessmentMethod: AssessmentMethod;

    assessmentPlatform?: string | null;

    assessmentName?: string | null;

    remarks?: string | null;
}

export interface AssessmentDetailResponse {
    assessment: {
        id: string;

        careerJourneyId: string;

        type: AssessmentType;

        weekNumber: number;

        title: string;

        description?: string | null;

        status: AssessmentStatus;

        completedAt: Date | null;

        createdAt: Date;
    };

    skills: AssessmentSkillDetail[];

    summary: {
        totalSkills: number;

        averagePercentage: number;
    };
}
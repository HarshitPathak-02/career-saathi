import { Types } from "mongoose";

import {
    AssessmentStatus,
    AssessmentType,
} from "./assessment.enums.js";
import { CreateSkillProgressDTO } from "../skill-progress/skill-progress.types.js";

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
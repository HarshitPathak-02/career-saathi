import { Types } from "mongoose";

import {
    AssessmentMethod,
    SkillLevel,
} from "./skill-progress.enums.js";

export interface CreateSkillProgressDTO {
    careerJourneyId: Types.ObjectId;

    assessmentId: Types.ObjectId;

    userSkillId: Types.ObjectId;

    obtainedMarks: number;

    totalMarks: number;

    assessmentMethod: AssessmentMethod;

    assessmentPlatform?: string;

    assessmentName?: string;

    remarks?: string;
}

export interface UpdateSkillProgressDTO {

    obtainedMarks?: number;

    totalMarks?: number;

    percentage?: number;

    improvementPercentage: number | null;

    level?: SkillLevel;

    assessmentMethod?: AssessmentMethod;

    assessmentPlatform?: string;

    assessmentName?: string;

    remarks?: string;

}
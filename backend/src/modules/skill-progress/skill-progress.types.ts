import { Types } from "mongoose";

import {
    AssessmentMethod,
    SkillLevel,
} from "./skill-progress.enums.js";
import { UserSkillDocument } from "../user-skill/user-skill.schema.js";
import { SkillProgressDocument } from "./skill-progress.schema.js";
import { SkillCatalogDocument } from "../../master-data/skill-catalog/skill-catalog.schema.js";

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

export type PopulatedSkillProgressDocument =
    SkillProgressDocument & {

        userSkillId:
        UserSkillDocument & {

            skillCatalogId:
            SkillCatalogDocument;

        };

    };

export interface SkillProgressPlanningData {

    userSkillId: Types.ObjectId;

    skillCatalogId: Types.ObjectId;

    skillName: string;

    percentage: number;

}
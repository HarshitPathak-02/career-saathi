import {
    Types,
} from "mongoose";
import { AssessmentMethod, SkillProgressDocument } from "./index.js";
import { UserSkillDocument } from "../user-skill/index.js";
import { SkillCatalogDocument } from "../../master-data/skill-catalog/index.js";



export interface CreateSkillProgressDTO {

    careerJourneyId:
    Types.ObjectId;

    assessmentId:
    Types.ObjectId;

    userSkillId:
    Types.ObjectId;

    obtainedMarks:
    number;

    totalMarks:
    number;

    assessmentMethod:
    AssessmentMethod;

    assessmentPlatform?:
    string;

    assessmentName?:
    string;

    remarks?:
    string;
}

export interface UpdateSkillProgressDTO {

    obtainedMarks?:
    number;

    totalMarks?:
    number;

    percentage?:
    number;

    improvementPercentage?:
    number | null;

    assessmentMethod?:
    AssessmentMethod;

    assessmentPlatform?:
    string;

    assessmentName?:
    string;

    remarks?:
    string;
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

    userSkillId:
    Types.ObjectId;

    skillCatalogId:
    Types.ObjectId;

    skillName:
    string;

    percentage:
    number;
}
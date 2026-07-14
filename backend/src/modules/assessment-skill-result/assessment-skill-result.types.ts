import { HydratedDocument, Types } from 'mongoose';

import { UserSkillLevel } from '../skills/skill.enums.js';
import { ProficiencyLevel } from '../../shared/enums/proficiency-level.enum.js';

export interface IAssessmentSkillResult {
    assessmentId: Types.ObjectId;

    skillCode: string;

    score: number;

    level: ProficiencyLevel;

    correctAnswers: number;

    totalQuestions: number;

    createdAt: Date;

    updatedAt: Date;
}

export type AssessmentSkillResultDocument =
    HydratedDocument<IAssessmentSkillResult>;

export interface CreateAssessmentSkillResultData {
    assessmentId: Types.ObjectId;

    skillCode: string;

    score: number;

    level: ProficiencyLevel;

    correctAnswers: number;

    totalQuestions: number;
}

export interface UpdateAssessmentSkillResultData
    extends Partial<
        Omit<CreateAssessmentSkillResultData, 'assessmentId'>
    > {}

export interface AssessmentSkillResultResponse {
    id: string;

    skillCode: string;

    score: number;

    level: ProficiencyLevel;

    correctAnswers: number;

    totalQuestions: number;

    createdAt: Date;

    updatedAt: Date;
}
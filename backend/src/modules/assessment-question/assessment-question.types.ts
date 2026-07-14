import { HydratedDocument } from 'mongoose';

import { CareerRoleCode } from '../career-role/career-role.enums.js';

import {
    QuestionDifficulty,
    QuestionType,
} from './assessment-question.enums.js';

export interface IAssessmentQuestion {
    careerRoleCode: CareerRoleCode;

    skillCode: string;

    difficulty: QuestionDifficulty;

    type: QuestionType;

    question: string;

    options: string[];

    correctAnswer: string;

    explanation: string;

    isActive: boolean;

    createdAt: Date;

    updatedAt: Date;
}

export type AssessmentQuestionDocument =
    HydratedDocument<IAssessmentQuestion>;

export interface CreateAssessmentQuestionData {
    careerRoleCode: CareerRoleCode;

    skillCode: string;

    difficulty: QuestionDifficulty;

    type: QuestionType;

    question: string;

    options: string[];

    correctAnswer: string;

    explanation: string;

    isActive: boolean;
}

export interface UpdateAssessmentQuestionData
    extends Partial<CreateAssessmentQuestionData> {}

export interface AssessmentQuestionResponse {
    id: string;

    careerRoleCode: CareerRoleCode;

    skillCode: string;

    difficulty: QuestionDifficulty;

    type: QuestionType;

    question: string;

    options: string[];

    explanation: string;

    isActive: boolean;

    createdAt: Date;

    updatedAt: Date;
}
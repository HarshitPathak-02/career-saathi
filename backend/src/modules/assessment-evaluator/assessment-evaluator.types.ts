import { ProficiencyLevel } from '../../shared/enums/proficiency-level.enum.js';
import { UserSkillLevel } from '../skills/skill.enums.js';

export interface EvaluationQuestion {

    id: string;

    skillCode: string;

    correctAnswer: string;
}

export interface EvaluationAnswer {

    questionId: string;

    selectedAnswer: string;
}

export interface SkillEvaluationResult {

    skillCode: string;

    score: number;

    level: ProficiencyLevel;

    correctAnswers: number;

    totalQuestions: number;
}

export interface EvaluationResult {

    overallScore: number;

    overallLevel: ProficiencyLevel;

    skillResults: SkillEvaluationResult[];
}
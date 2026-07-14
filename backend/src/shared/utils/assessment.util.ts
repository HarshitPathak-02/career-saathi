import { UserSkillLevel } from '../../modules/skills/skill.enums.js';
import { ProficiencyLevel } from '../enums/proficiency-level.enum.js';

export function calculateScore(
    correctAnswers: number,
    totalQuestions: number
): number {

    if (totalQuestions === 0) {
        return 0;
    }

    return Number(
        (
            (correctAnswers / totalQuestions) *
            100
        ).toFixed(2)
    );
}

export function calculateLevel(
    score: number
): ProficiencyLevel {

    if (score >= 90) {
        return ProficiencyLevel.EXPERT;
    }

    if (score >= 75) {
        return ProficiencyLevel.ADVANCED;
    }

    if (score >= 50) {
        return ProficiencyLevel.INTERMEDIATE;
    }

    return ProficiencyLevel.BEGINNER;
}
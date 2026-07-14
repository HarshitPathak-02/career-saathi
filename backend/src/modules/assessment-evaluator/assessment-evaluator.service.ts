import { HTTP_STATUS } from '../../core/constants/http-status.constants.js';
import { AppError } from '../../core/errors/app-error.js';
import { ProficiencyLevel } from '../../shared/enums/proficiency-level.enum.js';

import {

    EvaluationAnswer,

    EvaluationQuestion,

    EvaluationResult,

    SkillEvaluationResult,

} from './assessment-evaluator.types.js';

class AssessmentEvaluatorService {

    evaluate(

        questions: EvaluationQuestion[],

        answers: EvaluationAnswer[]

    ): EvaluationResult {

        const questionMap =
            new Map(
                questions.map(question => [
                    question.id,
                    question,
                ])
            );

        const skillMap =
            new Map<
                string,
                {
                    correct: number;
                    total: number;
                }
            >();

        let totalCorrect = 0;

        for (const answer of answers) {

            const question =
                questionMap.get(
                    answer.questionId
                );

            if (!question) {
                throw new AppError(
                    HTTP_STATUS.BAD_REQUEST,
                    'Invalid assessment submission.'
                );
            }

            if (
                !skillMap.has(
                    question.skillCode
                )
            ) {

                skillMap.set(
                    question.skillCode,
                    {
                        correct: 0,
                        total: 0,
                    }
                );
            }

            const skill =
                skillMap.get(
                    question.skillCode
                )!;

            skill.total++;

            if (
                answer.selectedAnswer ===
                question.correctAnswer
            ) {

                skill.correct++;

                totalCorrect++;
            }
        }

        const skillResults =
            this.buildSkillResults(
                skillMap
            );

        const overallScore =
            this.calculateScore(
                totalCorrect,
                questions.length
            );

        const overallLevel =
            this.calculateLevel(
                overallScore
            );

        return {

            overallScore,

            overallLevel,

            skillResults,
        };
    }

    private buildSkillResults(
        skillMap: Map<
            string,
            {
                correct: number;
                total: number;
            }
        >
    ): SkillEvaluationResult[] {

        const results: SkillEvaluationResult[] = [];

        for (const [
            skillCode,
            value,
        ] of skillMap) {

            const score =
                this.calculateScore(
                    value.correct,
                    value.total
                );

            results.push({

                skillCode,

                score,

                level:
                    this.calculateLevel(score),

                correctAnswers:
                    value.correct,

                totalQuestions:
                    value.total,
            });
        }

        return results;
    }

    private calculateScore(
        correct: number,
        total: number
    ): number {

        if (total === 0) {
            return 0;
        }

        return Math.round(
            (correct / total) * 100
        );
    }

    private calculateLevel(
        score: number
    ): ProficiencyLevel {

        if (score >= 85) {
            return ProficiencyLevel.EXPERT;
        }

        if (score >= 70) {
            return ProficiencyLevel.ADVANCED;
        }

        if (score >= 40) {
            return ProficiencyLevel.INTERMEDIATE;
        }

        return ProficiencyLevel.BEGINNER;
    }
}

export const assessmentEvaluatorService =
    new AssessmentEvaluatorService();
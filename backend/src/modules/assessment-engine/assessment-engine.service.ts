import mongoose, { ClientSession, Types } from 'mongoose';

import { assessmentRepository } from '../assessment/assessment.repository.js';
import { careerJourneyRepository } from '../career-journey/career-journey.repository.js';
import { userSkillRepository } from '../skills/skill.repository.js';
import { assessmentQuestionRepository } from '../assessment-question/assessment-question.repository.js';
import { assessmentSkillResultRepository } from '../assessment-skill-result/assessment-skill-result.repository.js';

import { assessmentEvaluatorService } from '../assessment-evaluator/assessment-evaluator.service.js';

import {
    AssessmentStatus,
} from '../assessment/assessment.enums.js';

import { QUESTIONS_PER_SKILL } from './assessment-engine.constants.js';

import {
    StartAssessmentResponse,
    SubmitAssessmentAnswer,
    SubmitAssessmentResponse,
} from './assessment-engine.types.js';

import { AppError } from '../../core/errors/app-error.js';
import { HTTP_STATUS } from '../../core/constants/http-status.constants.js';
import { AssessmentQuestionDocument } from '../assessment-question/assessment-question.types.js';
import { EvaluationResult, SkillEvaluationResult } from '../assessment-evaluator/assessment-evaluator.types.js';
import { CreateAssessmentSkillResultData } from '../assessment-skill-result/assessment-skill-result.types.js';
import { ProficiencyLevel } from '../../shared/enums/proficiency-level.enum.js';

class AssessmentEngineService {

    async startAssessment(
        careerJourneyId: string,
        userId: string
    ): Promise<StartAssessmentResponse> {

        const journey =
            await careerJourneyRepository.findById(
                careerJourneyId
            );

        if (!journey) {
            throw new AppError(
                HTTP_STATUS.NOT_FOUND,
                'Career journey not found.'
            );
        }

        if (
            journey.userId.toString() !==
            userId
        ) {
            throw new AppError(
                HTTP_STATUS.FORBIDDEN,
                'Unauthorized.'
            );
        }

        let assessment =
            await assessmentRepository.findInProgressByCareerJourneyId(
                careerJourneyId
            );

        if (!assessment) {

            assessment =
                await assessmentRepository.create({

                    userId: new Types.ObjectId(
                        userId
                    ),

                    careerJourneyId:
                        new Types.ObjectId(
                            careerJourneyId
                        ),

                    status:
                        AssessmentStatus.IN_PROGRESS,

                    overallScore: 0,

                    overallLevel:
                        ProficiencyLevel.BEGINNER,

                    startedAt:
                        new Date(),
                });
        }

        const userSkills =
            await userSkillRepository.findByJourneyId(
                careerJourneyId
            );

        if (userSkills.length === 0) {

            throw new AppError(
                HTTP_STATUS.BAD_REQUEST,
                'No skills found for this journey.'
            );
        }

        const skillCodes =
            userSkills.map(
                skill => skill.skillCode
            );

        const questions =
            await assessmentQuestionRepository.findRandomQuestionsForSkills(
                journey.careerContext.careerRoleCode,
                skillCodes,
                QUESTIONS_PER_SKILL
            );

        if (questions.length === 0) {

            throw new AppError(
                HTTP_STATUS.BAD_REQUEST,
                'No assessment questions available.'
            );
        }

        return {

            assessmentId:
                assessment.id,

            questions:
                this.sanitizeQuestions(
                    questions
                ),
        };
    }

    async submitAssessment(
        assessmentId: string,
        userId: string,
        answers: SubmitAssessmentAnswer[]
    ): Promise<SubmitAssessmentResponse> {

        const assessment =
            await assessmentRepository.findById(
                assessmentId
            );

        if (!assessment) {
            throw new AppError(
                HTTP_STATUS.NOT_FOUND,
                'Assessment not found.'
            );
        }

        if (
            assessment.userId.toString() !==
            userId
        ) {
            throw new AppError(
                HTTP_STATUS.FORBIDDEN,
                'Unauthorized.'
            );
        }

        if (
            assessment.status !==
            AssessmentStatus.IN_PROGRESS
        ) {
            throw new AppError(
                HTTP_STATUS.BAD_REQUEST,
                'Assessment already completed.'
            );
        }

        const questionIds = answers.map(
            answer => answer.questionId
        );

        const questions =
            await assessmentQuestionRepository.findByIds(
                questionIds
            );

        if (
            questions.length !==
            answers.length
        ) {
            throw new AppError(
                HTTP_STATUS.BAD_REQUEST,
                'Invalid assessment submission.'
            );
        }

        const evaluation =
            assessmentEvaluatorService.evaluate(

                questions.map(question => ({

                    id: question.id,

                    skillCode:
                        question.skillCode,

                    correctAnswer:
                        question.correctAnswer,

                })),

                answers
            );

        const session =
            await mongoose.startSession();

        try {

            session.startTransaction();

            await assessmentSkillResultRepository.createMany(

                this.buildSkillResultDocuments(
                    assessment.id,
                    evaluation.skillResults
                ),

                session
            );

            await userSkillRepository.bulkUpdateAssessmentLevels(

                this.buildBulkSkillUpdates(
                    evaluation.skillResults
                ),

                assessment.careerJourneyId.toString(),

                session
            );

            await this.completeAssessment(

                assessment.id,

                evaluation,

                session
            );

            await session.commitTransaction();

            return {

                overallScore:
                    evaluation.overallScore,

                overallLevel:
                    evaluation.overallLevel,

                skillResults:
                    evaluation.skillResults,
            };

        } catch (error) {

            await session.abortTransaction();

            throw error;

        } finally {

            await session.endSession();

        }
    }

    private sanitizeQuestions(
        questions: AssessmentQuestionDocument[]
    ) {

        return questions.map(
            question => ({

                id: question.id,

                skillCode:
                    question.skillCode,

                question:
                    question.question,

                difficulty:
                    question.difficulty,

                type:
                    question.type,

                options:
                    question.options,
            })
        );
    }

    private buildSkillResultDocuments(
        assessmentId: string,
        skillResults: SkillEvaluationResult[]
    ): CreateAssessmentSkillResultData[] {

        return skillResults.map(result => ({

            assessmentId:
                new Types.ObjectId(
                    assessmentId
                ),

            skillCode:
                result.skillCode,

            score:
                result.score,

            level:
                result.level,

            correctAnswers:
                result.correctAnswers,

            totalQuestions:
                result.totalQuestions,
        }));
    }

    private buildBulkSkillUpdates(
        skillResults: SkillEvaluationResult[]
    ) {

        return skillResults.map(result => ({

            skillCode:
                result.skillCode,

            assessmentLevel:
                result.level,
        }));
    }

    private async completeAssessment(
        assessmentId: string,
        evaluation: EvaluationResult,
        session: ClientSession
    ): Promise<void> {

        const assessment =
            await assessmentRepository.updateById(
                assessmentId,
                {
                    status:
                        AssessmentStatus.COMPLETED,

                    completedAt:
                        new Date(),

                    overallScore:
                        evaluation.overallScore,

                    overallLevel:
                        evaluation.overallLevel as ProficiencyLevel,
                },
                session
            );

        if (!assessment) {

            throw new AppError(
                HTTP_STATUS.INTERNAL_SERVER_ERROR,
                'Failed to complete assessment.'
            );
        }
    }

}

export const assessmentEngineService =
    new AssessmentEngineService();
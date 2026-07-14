import { AppError } from '../../core/errors/app-error.js';
import { HTTP_STATUS } from '../../core/constants/http-status.constants.js';

import { assessmentQuestionRepository } from './assessment-question.repository.js';

import {
    CreateAssessmentQuestionInput,
    UpdateAssessmentQuestionInput,
} from './assessment-question.validation.js';

import {
    AssessmentQuestionResponse,
} from './assessment-question.types.js';

import {
    toAssessmentQuestionResponse,
} from './assessment-question.mapper.js';

import {
    ASSESSMENT_QUESTION_MESSAGES,
} from './assessment-question.constants.js';

import {
    isSkillAllowedForCareerRole,
} from '../../shared/utils/career-role.util.js';
import { CareerRoleCode } from '../career-role/career-role.enums.js';

class AssessmentQuestionService {

    async create(
        data: CreateAssessmentQuestionInput
    ): Promise<AssessmentQuestionResponse> {

        const allowed =
            isSkillAllowedForCareerRole(
                data.careerRoleCode,
                data.skillCode
            );

        if (!allowed) {
            throw new AppError(
                HTTP_STATUS.BAD_REQUEST,
                ASSESSMENT_QUESTION_MESSAGES.INVALID_SKILL
            );
        }

        const question =
            await assessmentQuestionRepository.create({
                ...data,
                isActive:
                    data.isActive ?? true,
            });

        return toAssessmentQuestionResponse(
            question
        );
    }

    async getById(
        id: string
    ): Promise<AssessmentQuestionResponse> {

        const question =
            await assessmentQuestionRepository.findById(
                id
            );

        if (!question) {
            throw new AppError(
                HTTP_STATUS.NOT_FOUND,
                ASSESSMENT_QUESTION_MESSAGES.NOT_FOUND
            );
        }

        return toAssessmentQuestionResponse(
            question
        );
    }

    async getAll(): Promise<
        AssessmentQuestionResponse[]
    > {

        const questions =
            await assessmentQuestionRepository.findAll();

        return questions.map(
            toAssessmentQuestionResponse
        );
    }

    async getByCareerRoleAndSkill(
        careerRoleCode: CareerRoleCode,
        skillCode: string
    ): Promise<
        AssessmentQuestionResponse[]
    > {

        const questions =
            await assessmentQuestionRepository.findByCareerRoleAndSkill(
                careerRoleCode,
                skillCode
            );

        return questions.map(
            toAssessmentQuestionResponse
        );
    }

    async update(
        id: string,
        data: UpdateAssessmentQuestionInput
    ): Promise<AssessmentQuestionResponse> {

        if (
            data.careerRoleCode &&
            data.skillCode
        ) {

            const allowed =
                isSkillAllowedForCareerRole(
                    data.careerRoleCode,
                    data.skillCode
                );

            if (!allowed) {
                throw new AppError(
                    HTTP_STATUS.BAD_REQUEST,
                    ASSESSMENT_QUESTION_MESSAGES.INVALID_SKILL
                );
            }
        }

        const updatedQuestion =
            await assessmentQuestionRepository.updateById(
                id,
                data
            );

        if (!updatedQuestion) {
            throw new AppError(
                HTTP_STATUS.NOT_FOUND,
                ASSESSMENT_QUESTION_MESSAGES.NOT_FOUND
            );
        }

        return toAssessmentQuestionResponse(
            updatedQuestion
        );
    }

    async delete(
        id: string
    ): Promise<void> {

        const deleted =
            await assessmentQuestionRepository.deleteById(
                id
            );

        if (!deleted) {
            throw new AppError(
                HTTP_STATUS.NOT_FOUND,
                ASSESSMENT_QUESTION_MESSAGES.NOT_FOUND
            );
        }
    }
}

export const assessmentQuestionService =
    new AssessmentQuestionService();
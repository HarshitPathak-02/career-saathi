import { Request, Response } from 'express';

import { asyncHandler } from '../../core/middleware/async-handler.js';
import { successResponse } from '../../core/responses/successResponse.js';

import { assessmentQuestionService } from './assessment-question.service.js';

import { HTTP_STATUS } from '../../core/constants/http-status.constants.js';

import {
    ASSESSMENT_QUESTION_MESSAGES,
} from './assessment-question.constants.js';
import { CareerRoleCode } from '../career-role/career-role.enums.js';

class AssessmentQuestionController {

    create = asyncHandler(
        async (
            req: Request,
            res: Response
        ) => {

            const question =
                await assessmentQuestionService.create(
                    req.body
                );

            return successResponse({
                res,
                statusCode:
                    HTTP_STATUS.CREATED,
                message:
                    ASSESSMENT_QUESTION_MESSAGES.CREATED,
                data: question,
            });
        }
    );

    getAll = asyncHandler(
        async (
            req: Request,
            res: Response
        ) => {

            const questions =
                await assessmentQuestionService.getAll();

            return successResponse({
                res,
                message:
                    ASSESSMENT_QUESTION_MESSAGES.LIST_FETCHED,
                data: questions,
            });
        }
    );

    getById = asyncHandler(
        async (
            req: Request,
            res: Response
        ) => {

            const question =
                await assessmentQuestionService.getById(
                    req.params.id as string
                );

            return successResponse({
                res,
                message:
                    ASSESSMENT_QUESTION_MESSAGES.FETCHED,
                data: question,
            });
        }
    );

    getByCareerRoleAndSkill =
        asyncHandler(
            async (
                req: Request,
                res: Response
            ) => {

                const questions =
                    await assessmentQuestionService.getByCareerRoleAndSkill(
                        req.params.careerRoleCode as CareerRoleCode,
                        req.params.skillCode as string
                    );

                return successResponse({
                    res,
                    message:
                        ASSESSMENT_QUESTION_MESSAGES.LIST_FETCHED,
                    data: questions,
                });
            }
        );

    update = asyncHandler(
        async (
            req: Request,
            res: Response
        ) => {

            const question =
                await assessmentQuestionService.update(
                    req.params.id as string,
                    req.body
                );

            return successResponse({
                res,
                message:
                    ASSESSMENT_QUESTION_MESSAGES.UPDATED,
                data: question,
            });
        }
    );

    delete = asyncHandler(
        async (
            req: Request,
            res: Response
        ) => {

            await assessmentQuestionService.delete(
                req.params.id as string
            );

            return successResponse({
                res,
                message:
                    ASSESSMENT_QUESTION_MESSAGES.DELETED,
            });
        }
    );
}

export const assessmentQuestionController =
    new AssessmentQuestionController();
import { Request, Response } from 'express';

import { asyncHandler } from '../../core/middleware/async-handler.js';
import { successResponse } from '../../core/responses/successResponse.js';
import { getAuthUser } from '../../shared/utils/get-auth-user.js';

import { assessmentService } from './assessment.service.js';

import { HTTP_STATUS } from '../../core/constants/http-status.constants.js';
import { ASSESSMENT_MESSAGES } from './assessment.constants.js';

class AssessmentController {

    getById = asyncHandler(
        async (req: Request, res: Response) => {
            const user = getAuthUser(req);

            const assessment =
                await assessmentService.getById(
                    req.params.id as string,
                    user.userId
                );

            return successResponse({
                res,
                statusCode: HTTP_STATUS.OK,
                message:
                    ASSESSMENT_MESSAGES.FETCHED,
                data: assessment,
            });
        }
    );

    getByJourney = asyncHandler(
        async (req: Request, res: Response) => {
            const user = getAuthUser(req);

            const assessments =
                await assessmentService.getByJourney(
                    req.params.careerJourneyId as string,
                    user.userId
                );

            return successResponse({
                res,
                statusCode: HTTP_STATUS.OK,
                message:
                    ASSESSMENT_MESSAGES.LIST_FETCHED,
                data: assessments,
            });
        }
    );

}

export const assessmentController =
    new AssessmentController();
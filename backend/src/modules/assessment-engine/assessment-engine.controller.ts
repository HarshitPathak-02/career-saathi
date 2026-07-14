import { Request, Response } from 'express';

import { asyncHandler } from '../../core/middleware/async-handler.js';

import { assessmentEngineService } from './assessment-engine.service.js';

import { JwtPayload } from '../auth/auth.types.js';

import { successResponse } from '../../core/responses/successResponse.js';
import { HTTP_STATUS } from '../../core/constants/http-status.constants.js';
import { ASSESSMENT_MESSAGES } from '../assessment/assessment.constants.js';
import { ASSESSMENT_ENGINE_MESSAGES } from './assessment-engine.constants.js';
import { getAuthUser } from '../../shared/utils/get-auth-user.js';

class AssessmentEngineController {

    start = asyncHandler(
        async (
            req: Request,
            res: Response
        ) => {

            const user =
                getAuthUser(req);

            const result =
                await assessmentEngineService.startAssessment(

                    req.body.careerJourneyId,

                    user.userId
                );

            return successResponse({
                res,
                statusCode:
                    HTTP_STATUS.CREATED,
                message:
                    ASSESSMENT_ENGINE_MESSAGES.GENERATED,
                data: result,
            });
        }
    );

    submit = asyncHandler(
        async (
            req: Request,
            res: Response
        ) => {

            const user =
                getAuthUser(req);

            const result =
                await assessmentEngineService.submitAssessment(

                    req.params.assessmentId as string,

                    user.userId,

                    req.body.answers
                );

            return successResponse({
                res,
                statusCode:
                    HTTP_STATUS.CREATED,
                message:
                    ASSESSMENT_ENGINE_MESSAGES.SUBMITTED,
                data: result,
            });
        }
    );
}

export const assessmentEngineController =
    new AssessmentEngineController();
import { Request, Response } from 'express';

import { asyncHandler } from '../../core/middleware/async-handler.js';
import { successResponse } from '../../core/responses/successResponse.js';
import { getAuthUser } from '../../shared/utils/get-auth-user.js';

import { userSkillService } from './skill.service.js';
import { USER_SKILL_MESSAGES } from './skill.constant.js';

import { HTTP_STATUS } from '../../core/constants/http-status.constants.js';

class UserSkillController {
    create = asyncHandler(
        async (req: Request, res: Response) => {
            const user = getAuthUser(req);

            const skills =
                await userSkillService.create(
                    user.userId,
                    req.body
                );

            return successResponse({
                res,
                statusCode: HTTP_STATUS.CREATED,
                message: USER_SKILL_MESSAGES.CREATED,
                data: skills,
            });
        }
    );

    findByJourney = asyncHandler(
        async (req: Request, res: Response) => {
            const user = getAuthUser(req);

            const skills =
                await userSkillService.findByJourney(
                    req.params.careerJourneyId as string,
                    user.userId
                );

            return successResponse({
                res,
                statusCode: HTTP_STATUS.OK,
                message: 'Skills fetched successfully.',
                data: skills,
            });
        }
    );

    update = asyncHandler(
        async (req: Request, res: Response) => {
            const user = getAuthUser(req);

            const skill =
                await userSkillService.update(
                    req.params.id as string,
                    user.userId,
                    req.body
                );

            return successResponse({
                res,
                statusCode: HTTP_STATUS.OK,
                message: USER_SKILL_MESSAGES.UPDATED,
                data: skill,
            });
        }
    );

    delete = asyncHandler(
        async (req: Request, res: Response) => {
            const user = getAuthUser(req);

            await userSkillService.delete(
                req.params.id as string,
                user.userId
            );

            return successResponse({
                res,
                statusCode: HTTP_STATUS.OK,
                message: USER_SKILL_MESSAGES.DELETED,
            });
        }
    );
}

export const userSkillController =
    new UserSkillController();
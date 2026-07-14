import { Request, Response } from 'express';

import { JwtPayload } from 'jsonwebtoken';

import { asyncHandler } from '../../core/middleware/async-handler.js';

import { weeklyProgressService } from './weekly-progress.service.js';
import { getAuthUser } from '../../shared/utils/get-auth-user.js';

class WeeklyProgressController {

    getWeeklyProgress =
        asyncHandler(
            async (
                req: Request,
                res: Response
            ) => {

                const user =
                    getAuthUser(req)

                const progress =
                    await weeklyProgressService.getWeeklyProgress(
                        user.userId
                    );

                res.json({

                    success: true,

                    data: progress,
                });
            }
        );
}

export const weeklyProgressController =
    new WeeklyProgressController();
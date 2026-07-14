import { Request, Response } from 'express';

import { asyncHandler } from '../../core/middleware/async-handler.js';

import { dashboardService } from './dashboard.service.js';

class DashboardController {

    getDashboard =
        asyncHandler(

            async (
                req: Request,
                res: Response
            ) => {

                const user =
                    req.user!;

                const dashboard =
                    await dashboardService.getDashboard(
                        user.userId
                    );

                res.json({

                    success: true,

                    data: dashboard,
                });
            }
        );
}

export const dashboardController =
    new DashboardController();
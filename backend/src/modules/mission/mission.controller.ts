import { Request, Response } from 'express';

import { asyncHandler } from '../../core/middleware/async-handler.js';

import { missionService } from './mission.service.js';
import { successResponse } from '../../core/responses/successResponse.js';
import { HTTP_STATUS } from '../../core/constants/http-status.constants.js';

class MissionController {

    getPhaseMissions =
        asyncHandler(
            async (
                req: Request,
                res: Response
            ) => {

                const missions =
                    await missionService.getPhaseMissions(
                        req.params.phaseId as string
                    );

                successResponse({
                    res,
                    statusCode: HTTP_STATUS.OK,
                    message: "Missions are fetched",
                    data: missions,
                });
            }
        );

    getById =
        asyncHandler(
            async (
                req: Request,
                res: Response
            ) => {

                const mission =
                    await missionService.getById(
                        req.params.missionId as string
                    );

                res.json({

                    success: true,

                    data:
                        mission,
                });
            }
        );
}

export const missionController =
    new MissionController();
import { Request, Response } from 'express';

import { asyncHandler } from '../../core/middleware/async-handler.js';

import { roadmapService } from './roadmap.service.js';
import { getAuthUser } from '../../shared/utils/get-auth-user.js';
import { HTTP_STATUS } from '../../core/constants/http-status.constants.js';

class RoadmapController {

    generate =
        asyncHandler(
            async (
                req: Request,
                res: Response
            ) => {

                const user = getAuthUser(req);
                const roadmap =

                    await roadmapService.generate({

                        userId:
                            user.userId,

                        careerJourneyId:
                            req.body.careerJourneyId,

                        assessmentId:
                            req.body.assessmentId,
                    });

                res.status(HTTP_STATUS.CREATED).json({

                    success: true,

                    message:
                        'Roadmap generated successfully.',

                    data:
                        roadmap,
                });
            }
        );

    getById =
        asyncHandler(
            async (
                req: Request,
                res: Response
            ) => {

                const roadmap =
                    await roadmapService.getById(
                        req.params.roadmapId as string
                    );

                res.json({

                    success: true,

                    data:
                        roadmap,
                });
            }
        );

    getActiveRoadmap =
        asyncHandler(

            async (
                req: Request,
                res: Response
            ) => {

                const user =
                    req.user!;

                const roadmap =
                    await roadmapService.getActiveRoadmap(
                        user.userId
                    );

                res.json({

                    success: true,

                    data: roadmap,
                });
            }
        );
    getByCareerJourney =
        asyncHandler(

            async (
                req: Request,
                res: Response
            ) => {

                const roadmaps =
                    await roadmapService.getByCareerJourney(

                        req.params.careerJourneyId as string
                    );

                res.json({

                    success: true,

                    data: roadmaps,
                });
            }
        );

}

export const roadmapController =
    new RoadmapController();
import { Request, Response } from 'express';

import { asyncHandler } from '../../core/middleware/async-handler.js';

import { roadmapPhaseService } from './roadmap-phase.service.js';

class RoadmapPhaseController {

    getRoadmapPhases =
        asyncHandler(
            async (
                req: Request,
                res: Response
            ) => {

                const phases =
                    await roadmapPhaseService.getRoadmapPhases(
                        req.params.roadmapId as string
                    );

                res.json({

                    success: true,

                    data:
                        phases,
                });
            }
        );

    getById =
        asyncHandler(
            async (
                req: Request,
                res: Response
            ) => {

                const phase =
                    await roadmapPhaseService.getById(
                        req.params.phaseId as string
                    );

                res.json({

                    success: true,

                    data:
                        phase,
                });
            }
        );
}

export const roadmapPhaseController =
    new RoadmapPhaseController();
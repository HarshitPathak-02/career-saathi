import { Request, Response } from 'express';

import { asyncHandler } from '../../core/middleware/async-handler.js';

import { resourceService } from './resource.service.js';

class ResourceController {

    getTaskResources =
        asyncHandler(
            async (
                req: Request,
                res: Response
            ) => {

                const resources =
                    await resourceService.getTaskResources(
                        req.params.taskId as string
                    );

                res.json({

                    success: true,

                    data: resources,
                });
            }
        );
}

export const resourceController =
    new ResourceController();   
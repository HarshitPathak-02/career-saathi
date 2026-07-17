import { Router } from 'express';

import { authenticate } from '../../core/middleware/authenticate.middleware.js';

import { missionController } from './mission.controller.js';

const router =
    Router();

router.get(

    '/roadmaps/:roadmapId',

    authenticate,

    missionController.getPhaseMissions
);

router.get(

    '/:missionId',

    authenticate,

    missionController.getById
);

export default router;
import { Router } from 'express';

import { authenticate } from '../../core/middleware/authenticate.middleware.js';

import { roadmapPhaseController } from './roadmap-phase.controller.js';

const router =
    Router();

router.get(

    '/roadmap/:roadmapId',

    authenticate,

    roadmapPhaseController.getRoadmapPhases
);

router.get(

    '/:phaseId',

    authenticate,

    roadmapPhaseController.getById
);

export default router;
import { Router } from 'express';

import { authenticate } from '../../core/middleware/authenticate.middleware.js';

import { roadmapController } from './roadmap.controller.js';

const router =
    Router();

router.post(
    '/generate',
    authenticate,
    roadmapController.generate
);

router.get(
    '/active',
    authenticate,
    roadmapController.getActiveRoadmap
);

router.get(
    '/journey/:careerJourneyId',
    authenticate,
    roadmapController.getByCareerJourney
);

router.get(
    '/:roadmapId',
    authenticate,
    roadmapController.getById
);

export default router;
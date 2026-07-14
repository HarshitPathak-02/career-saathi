import { Router } from 'express';

import { authenticate } from '../../core/middleware/authenticate.middleware.js';

import { weeklyProgressController } from './weekly-progress.controller.js';

const router = Router();

router.get(
    '/',
    authenticate,
    weeklyProgressController.getWeeklyProgress
);

export default router;
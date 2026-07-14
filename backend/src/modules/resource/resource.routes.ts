import { Router } from 'express';

import { resourceController } from './resource.controller.js';

const router = Router();

router.get(
    '/tasks/:taskId/resources',
    resourceController.getTaskResources
);

export default router;
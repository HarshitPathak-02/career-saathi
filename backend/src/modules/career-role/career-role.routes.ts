import { Router } from 'express';

import { careerRoleController } from './career-role.controller.js';

import { authenticate } from '../../core/middleware/authenticate.middleware.js';

const router = Router();

router.use(authenticate);

router.get(
  '/',
  careerRoleController.findAll
);

router.get(
  '/:code',
  careerRoleController.findByCode
);

export default router;
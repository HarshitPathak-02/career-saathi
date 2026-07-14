import { Router } from 'express';

import { authController } from './auth.controller.js';
import {
    registerSchema, loginSchema
} from './auth.validation.js';

import { validate } from '../../core/middleware/validate.middleware.js';
import { authenticate } from '../../core/middleware/authenticate.middleware.js';

const router = Router();

router.post(
    '/register',
    validate(registerSchema),
    authController.register
);

router.post(
    '/login',
    validate(loginSchema),
    authController.login
);

router.get(
    '/me',
    authenticate,
    authController.me
);

router.post(
  '/refresh',
  authController.refresh
);

router.post(
  '/logout',
  authController.logout
);

export default router;
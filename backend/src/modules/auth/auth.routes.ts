import { Router } from 'express';

import { authController } from './auth.controller.js';
import {
    registerSchema,
    loginSchema,
    updateProfileSchema,
    changePasswordSchema,
} from './auth.validation.js';

import { validateRequest } from '../../core/middleware/validate.middleware.js';
import { authenticate } from '../../core/middleware/authenticate.middleware.js';

const router = Router();

router.post(
    '/register',
    validateRequest({body:registerSchema}),
    authController.register
);

router.post(
    '/login',
    validateRequest({body:loginSchema}),
    authController.login
);

router.get(
    '/me',
    authenticate,
    authController.me
);

router.patch(
    '/me',
    authenticate,
    validateRequest({ body: updateProfileSchema }),
    authController.updateProfile
);

router.post(
    '/change-password',
    authenticate,
    validateRequest({ body: changePasswordSchema }),
    authController.changePassword
);

router.post(
  '/refresh',
  authController.refresh
);

router.post(
  '/logout',
  authController.logout
);

router.post(
  '/logout-all',
  authenticate,
  authController.logoutAll
);

export default router;
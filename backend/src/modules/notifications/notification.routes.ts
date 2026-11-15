import { Router } from 'express';
import { authenticate } from '../../core/middleware/authenticate.middleware.js';
import { registerPushToken, getNotifications } from './notification.controller.js';

const router = Router();

router.use(authenticate);

router.post('/push-token', registerPushToken);
router.get('/', getNotifications);

export default router;

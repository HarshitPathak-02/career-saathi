import { Router } from 'express';

import { discoveryController } from './discovery.controller.js';
import {
  createDiscoveryCandidateSchema,
  addDiscoveryAnswerSchema,
  discoveryCandidateParamSchema,
  discoveryIdParamSchema,
  startDiscoverySchema,
} from './discovery.validator.js';
import { authenticate } from '../../core/middleware/authenticate.middleware.js';
import { discoveryAiLimiter } from '../../core/middleware/rate-limit.middleware.js';
import { validateRequest } from '../../core/middleware/validate.middleware.js';

const router = Router();

router.use(authenticate);

router.post(
  '/',
  discoveryAiLimiter,
  validateRequest({ body: startDiscoverySchema }),
  discoveryController.startDiscovery
);
router.get('/latest', discoveryController.getLatestDiscovery);
router.get(
  '/:discoveryId',
  validateRequest({ params: discoveryIdParamSchema }),
  discoveryController.getDiscovery
);
router.post(
  '/:discoveryId/answers',
  discoveryAiLimiter,
  validateRequest({ params: discoveryIdParamSchema, body: addDiscoveryAnswerSchema }),
  discoveryController.addDiscoveryAnswer
);
router.post(
  '/:discoveryId/generate',
  discoveryAiLimiter,
  validateRequest({ params: discoveryIdParamSchema }),
  discoveryController.generateDiscoveryCandidates
);
router.get(
  '/:discoveryId/messages',
  validateRequest({ params: discoveryIdParamSchema }),
  discoveryController.getDiscoveryMessages
);
router.get(
  '/:discoveryId/candidates',
  validateRequest({ params: discoveryIdParamSchema }),
  discoveryController.getDiscoveryCandidates
);
router.post(
  '/:discoveryId/candidates',
  validateRequest({ params: discoveryIdParamSchema, body: createDiscoveryCandidateSchema }),
  discoveryController.createDiscoveryCandidate
);
router.patch(
  '/:discoveryId/candidates/:candidateId/select',
  validateRequest({ params: discoveryCandidateParamSchema }),
  discoveryController.selectDiscoveryCandidate
);

export default router;

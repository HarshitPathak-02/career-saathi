import { Router } from 'express';

import { assessmentController } from './assessment.controller.js';

import { authenticate } from '../../core/middleware/authenticate.middleware.js';
import { validate } from '../../core/middleware/validate.middleware.js';

import {
    startAssessmentSchema,
    completeAssessmentSchema,
    assessmentIdParamsSchema,
} from './assessment.validation.js';
import { careerJourneyIdParamsSchema } from '../career-journey/career-journey.validation.js';

const router = Router();

router.use(authenticate);

router.post(
    '/start',
    validate(startAssessmentSchema),
    assessmentController.start
);

router.get(
    '/:id',
    validate(assessmentIdParamsSchema, 'params'),
    assessmentController.getById
);

router.get(
    '/career-journey/:careerJourneyId',
    validate(careerJourneyIdParamsSchema,"params"),
    assessmentController.getByJourney
);

router.patch(
    '/:id/complete',
    validate(assessmentIdParamsSchema, 'params'),
    validate(completeAssessmentSchema),
    assessmentController.complete
);

export default router;
import {
    Router,
} from 'express';

import {
    assessmentController,
} from './assessment.controller.js';

import {
    authenticate,
} from '../../core/middleware/authenticate.middleware.js';

import {
    validate,
} from '../../core/middleware/validate.middleware.js';

import {
    assessmentIdParamsSchema,
} from './assessment.validation.js';

import {
    careerJourneyIdParamsSchema,
} from '../career-journey/career-journey.validation.js';

const router = Router();

router.use(authenticate);

router.get(
    '/career-journey/:careerJourneyId',

    validate(
        careerJourneyIdParamsSchema,
        'params'
    ),

    assessmentController.getByJourney
);

router.get(
    '/:id',

    validate(
        assessmentIdParamsSchema,
        'params'
    ),

    assessmentController.getById
);

export default router;
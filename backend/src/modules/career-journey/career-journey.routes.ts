import { Router } from 'express';

import { careerJourneyController } from './career-journey.controller.js';
import { careerJourneyIdParamsSchema, createCareerJourneySchema, updateCareerJourneySchema } from './career-journey.validation.js';

import { authenticate } from '../../core/middleware/authenticate.middleware.js';
import { validate } from '../../core/middleware/validate.middleware.js';

const router = Router();
router.post(
    '/',
    authenticate,
    validate(createCareerJourneySchema),
    careerJourneyController.create
);

router.get(
    '/',
    authenticate,
    careerJourneyController.findAll
);

router.get(
    '/:id',
    authenticate,
    validate(careerJourneyIdParamsSchema, "params"),
    careerJourneyController.findById
);

router.patch(
    '/:id',
    authenticate,
    validate(updateCareerJourneySchema),
    validate(careerJourneyIdParamsSchema, "params"),
    careerJourneyController.update
);

router.delete(
    '/:id',
    authenticate,
    validate(
        careerJourneyIdParamsSchema,
        'params'
    ),
    careerJourneyController.delete
);

router.patch(
    '/:id/activate',
    authenticate,
    validate(
        careerJourneyIdParamsSchema,
        'params'
    ),
    careerJourneyController.activate
);


export default router;
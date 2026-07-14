import { Router } from 'express';

import { authenticate } from '../../core/middleware/authenticate.middleware.js';

import { validate } from '../../core/middleware/validate.middleware.js';

import { assessmentEngineController } from './assessment-engine.controller.js';

import {
    startAssessmentSchema,
    submitAssessmentSchema,
    assessmentIdParamsSchema,
} from './assessment-engine.validation.js';

const router = Router();

router.use(authenticate);

router.post(

    '/start',

    validate(startAssessmentSchema),

    assessmentEngineController.start
);

router.post(

    '/:assessmentId/submit',

    validate(
        submitAssessmentSchema
    ),

    validate(assessmentIdParamsSchema,"params"),

    assessmentEngineController.submit
);

export default router;
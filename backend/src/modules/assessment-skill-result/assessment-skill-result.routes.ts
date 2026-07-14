import { Router } from 'express';

import { authenticate } from '../../core/middleware/authenticate.middleware.js';

import { validate } from '../../core/middleware/validate.middleware.js';

import {
    assessmentSkillResultController,
} from './assessment-skill-result.controller.js';

import {
    assessmentIdParamsSchema,
} from './assessment-skill-result.validation.js';

const router = Router();

router.use(authenticate);

router.get(
    '/:assessmentId',
    validate(
        assessmentIdParamsSchema,
        'params'
    ),
    assessmentSkillResultController.findByAssessment
);

export default router;
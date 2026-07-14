import { Router } from 'express';

import { authenticate } from '../../core/middleware/authenticate.middleware.js';
import { validate } from '../../core/middleware/validate.middleware.js';

import {
    assessmentQuestionController,
} from './assessment-question.controller.js';

import {
    createAssessmentQuestionSchema,
    updateAssessmentQuestionSchema,
    assessmentQuestionIdParamsSchema,
} from './assessment-question.validation.js';

const router = Router();

router.use(authenticate);

router.post(
    '/',
    validate(createAssessmentQuestionSchema),
    assessmentQuestionController.create
);

router.get(
    '/',
    assessmentQuestionController.getAll
);

router.get(
    '/career-role/:careerRoleCode/skill/:skillCode',
    assessmentQuestionController.getByCareerRoleAndSkill
);

router.get(
    '/:id',
    validate(
        assessmentQuestionIdParamsSchema,
        'params'
    ),
    assessmentQuestionController.getById
);

router.patch(
    '/:id',
    validate(
        assessmentQuestionIdParamsSchema,
        'params'
    ),
    validate(updateAssessmentQuestionSchema),
    assessmentQuestionController.update
);

router.delete(
    '/:id',
    validate(
        assessmentQuestionIdParamsSchema,
        'params'
    ),
    assessmentQuestionController.delete
);

export default router;
import { Router } from 'express';

import { authenticate } from '../../core/middleware/authenticate.middleware.js';
// import { validate } from '../../core/middlewares/validate.middleware.js';
import { validate } from '../../core/middleware/validate.middleware.js';

import { userSkillController } from './skill.controller.js';

import {
    careerJourneyIdRouteParamsSchema,
    createUserSkillsSchema,
    updateUserSkillSchema,
    userSkillIdParamsSchema,
} from './skill.validation.js';

import { careerJourneyIdParamsSchema } from '../career-journey/career-journey.validation.js';

const router = Router();

router.post(
    '/',
    authenticate,
    validate(createUserSkillsSchema),
    userSkillController.create
);

router.get(
    '/journey/:careerJourneyId',
    authenticate,
    validate(careerJourneyIdRouteParamsSchema, "params"),
    userSkillController.findByJourney
);

router.patch(
    '/:id',
    authenticate,
    validate(userSkillIdParamsSchema, "params"),
    validate(updateUserSkillSchema),
    userSkillController.update
);

router.delete(
    '/:id',
    authenticate,
    validate(userSkillIdParamsSchema, "params"),
    userSkillController.delete
);

export default router;
import { Router } from 'express';
import authRoutes from '../modules/auth/auth.routes.js';
import careerJourneyRoutes from '../modules/career-journey/career-journey.routes.js';
import careerRoleRoutes from '../modules/career-role/career-role.routes.js';
import userSkillsRoutes from '../modules/skills/skill.routes.js'
import assessmentRoutes from '../modules/assessment/assessment.routes.js'
import assessmentQuestionsRoutes from '../modules/assessment-question/assessment-question.routes.js'
import assessmentEngineRoutes from '../modules/assessment-engine/assessment-engine.routes.js'
import roadmapsRoutes from "../modules/roadmaps/roadmap.routes.js"
import dashboardRoutes from '../modules/dashboard/dashboard.routes.js';
import roadmapPhasesRoutes from "../modules/roadmap-phase/roadmap-phase.routes.js"
import missionRoutes from '../modules/mission/mission.routes.js';
import weeklyProgressRoutes from '../modules/weekly-progress/weekly-progress.routes.js';
import taskCompletionRoutes from '../modules/task-completion/task-completion.routes.js';
import { HTTP_STATUS } from '../core/constants/http-status.constants.js';

const router = Router();

router.get('/health', (_req, res) => {
  res.status(HTTP_STATUS.CREATED).json({
    success: true,
    message: 'CareerSaathi Backend is running successfully.',
  });
});

router.use('/auth', authRoutes)

router.use(
  '/career-journeys',
  careerJourneyRoutes
);

router.use(
  '/career-roles',
  careerRoleRoutes
);

router.use(
  '/user-skills',
  userSkillsRoutes
)

router.use(
  '/assessments',
  assessmentRoutes
)

router.use(
  '/assessment-questions',
  assessmentQuestionsRoutes
)
router.use(
  '/assessment-engine',
  assessmentEngineRoutes
)

router.use(
  '/roadmaps',
  roadmapsRoutes
)

router.use(
  '/roadmap-phases',
  roadmapPhasesRoutes
)

router.use(
  '/missions',
  missionRoutes
)

router.use(
  '/dashboard',
  dashboardRoutes
);

router.use(
    '/weekly-progress',
    weeklyProgressRoutes
);

router.use(
    '/task-completion',
    taskCompletionRoutes
);


export default router;
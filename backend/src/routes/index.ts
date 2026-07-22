import { Router } from 'express';
import authRoutes from '../modules/auth/auth.routes.js';
import careerJourneyRoutes from '../modules/career-journey/career-journey.routes.js';
import { HTTP_STATUS } from '../core/constants/http-status.constants.js';
import { resumeRoutes } from '../modules/resume/index.js';
import { userSkillsRoutes } from '../modules/user-skill/index.js';
import assessmentRoutes from '../modules/assessment/assessment.routes.js'
import roadmapRoutes from '../modules/roadmap/roadmap.routes.js';
import missionsRoutes from '../modules/mission/mission.routes.js';
import weeklyReportRoutes from '../modules/weekly-report/weekly-report.routes.js';
import weeklyReflectionRoutes from '../modules/weekly-reflection/weekly-reflection.routes.js';

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
    '/resume',
    resumeRoutes
);

router.use(
    '/user-skills',
    userSkillsRoutes
);

router.use(
    '/assessments',
    assessmentRoutes
);

router.use(
    "/roadmaps",
    roadmapRoutes
);

router.use(
    "/missions",
    missionsRoutes
);

router.use(
    "/weekly-reflections",
    weeklyReflectionRoutes
);
router.use(
    "/weekly-reports",
    weeklyReportRoutes
);



export default router;
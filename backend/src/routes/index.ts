import { Router } from 'express';
import mongoose from 'mongoose';
import authRoutes from '../modules/auth/auth.routes.js';
import careerJourneyRoutes from '../modules/career-journey/career-journey.routes.js';
import { resumeRoutes } from '../modules/resume/index.js';
import { userSkillsRoutes } from '../modules/user-skill/index.js';
import assessmentRoutes from '../modules/assessment/assessment.routes.js'
import assessmentSectionRoutes from '../modules/assessment/assessment-section.routes.js'
import assessmentAttemptRoutes from '../modules/assessment/assessment-attempt.routes.js'
import discoveryRoutes from '../modules/discovery/discovery.routes.js';
import roadmapRoutes from '../modules/roadmap/roadmap.routes.js';
import missionsRoutes from '../modules/mission/mission.routes.js';
import weeklyReportRoutes from '../modules/weekly-report/weekly-report.routes.js';
import { lookupRoutes } from '../modules/lookup/index.js';
import workspaceRoutes from '../modules/workspace/workspace.routes.js';
import dailyTasksRoutes from '../modules/daily-task/daily-task.routes.js';
import weeklyReviewsRoutes from '../modules/weekly-review/weekly-review.routes.js'
import mockInterviewsRoutes from '../modules/mock-interview/mock-interview.routes.js'
import readinessRoutes from '../modules/readiness/readiness.routes.js'
import monthlyReportRoutes from '../modules/monthly-report/monthly-report.routes.js'
import practiceRoutes from '../modules/practice/practice.routes.js';
import { adminRoutes } from '../modules/admin/index.js';

const router = Router();

router.get('/health', (_req, res) => {
    res.status(200).json({
        success: true,
        message: 'CareerSaathi Backend is running successfully.',
        uptime: process.uptime(),
        timestamp: new Date().toISOString(),
    });
});

router.get('/health/ready', (_req, res) => {
    const databaseReady =
        mongoose.connection.readyState === 1;

    const statusCode =
        databaseReady ? 200 : 503;

    res.status(statusCode).json({
        success: databaseReady,
        message: databaseReady
            ? 'CareerSaathi Backend is ready.'
            : 'CareerSaathi Backend is not ready.',
        database: databaseReady
            ? 'connected'
            : 'disconnected',
        timestamp: new Date().toISOString(),
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
    '/assessment-sections',
    assessmentSectionRoutes
);

router.use(
    '/assessment-attempts',
    assessmentAttemptRoutes
);

router.use(
    '/discovery',
    discoveryRoutes
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
    "/daily-tasks",
    dailyTasksRoutes
);

router.use(
    "/weekly-reports",
    weeklyReportRoutes
);

router.use(
    "/weekly-reviews",
    weeklyReviewsRoutes
);

router.use(
    "/lookup",
    lookupRoutes
);

router.use(
    "/workspace",
    workspaceRoutes
);

router.use(
    "/mock-interviews",
    mockInterviewsRoutes
);

router.use(
    "/readiness",
    readinessRoutes
);

router.use(
    "/monthly-reports",
    monthlyReportRoutes
);

router.use(
    "/practice",
    practiceRoutes
);

router.use(
    "/admin",
    adminRoutes
);

export default router;
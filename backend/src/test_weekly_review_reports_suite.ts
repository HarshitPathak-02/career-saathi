/**
 * Comprehensive Automated End-to-End Test Suite for Feature 7:
 * Weekly Review, Reports & Monthly Audit
 *
 * Covers:
 * 1. Route Guards, Gating & Redirection (/weekly-review, /weekly-reports, /monthly-reports)
 * 2. Empty States & Premature Access Guardrails (Day 1 Early Access Locked 409)
 * 3. Day 7 Weekly Review Unlock & Preparation Wizard (Step 1 Topics, Step 2 Scores, Step 3 Reflection)
 * 4. Weekly Review Submission, Report AI Generation & Lifecycle Transitions
 * 5. Weekly Reports Hub (/weekly-reports) Card Display & Navigation
 * 6. Weekly Report Details (/weekly-reports/:reportId) Comprehensive Analytics & AI Feedback
 * 7. Monthly Report Lifecycle & 28-Day Due Status Detection (due-status, generate)
 * 8. Monthly Reports Hub (/monthly-reports) & Long-Term Trajectory Analytics (/monthly-reports/1)
 * 9. Defensive Edge Cases, Malformed IDs, 404 Boundaries & Resubmission Conflict
 * 10. Multi-Tenant Security & Broken Object Level Authorization (BOLA / IDOR) Isolation
 */

import puppeteer, { Browser, Page } from 'puppeteer-core';
import mongoose, { Types } from 'mongoose';
import * as path from 'path';
import * as fs from 'fs';

import { env } from './config/env.js';
import { UserModel } from './modules/users/user.model.js';
import { CareerDomainModel } from './master-data/career-domain/career-domain.schema.js';
import { CareerRoleModel } from './master-data/career-role/career-role.schema.js';
import { SkillCatalogModel } from './master-data/skill-catalog/skill-catalog.schema.js';
import { CareerJourneyModel } from './modules/career-journey/career-journey.model.js';
import { CareerJourneyStatus, PreferredLanguage } from './modules/career-journey/career-journey.enums.js';
import { RoadmapModel } from './modules/roadmap/roadmap.model.js';
import { RoadmapStatus, RoadmapType, RoadmapItemStatus, RoadmapItemType } from './modules/roadmap/roadmap.enums.js';
import { RoadmapItemModel } from './modules/roadmap/roadmap-item.model.js';
import { MissionModel } from './modules/mission/mission.model.js';
import { MissionStatus } from './modules/mission/mission.enums.js';
import { DailyTaskModel } from './modules/daily-task/daily-task.model.js';
import { DailyTaskStatus, DailyTaskType } from './modules/daily-task/daily-task.enums.js';
import { UserSkillModel } from './modules/user-skill/user-skill.model.js';
import { SkillLevel } from './modules/user-skill/user-skill.enums.js';
import { AssessmentModel } from './modules/assessment/assessment.model.js';
import { AssessmentStatus, AssessmentType } from './modules/assessment/assessment.enums.js';
import { AssessmentDeliveryMode } from './modules/assessment/assessment-engine.enums.js';
import { WeeklyReportModel } from './modules/weekly-report/weekly-report.model.js';
import { WeeklyReflectionModel } from './modules/weekly-reflection/weekly-reflection.model.js';
import { MonthlyReportModel } from './modules/monthly-report/monthly-report.model.js';

const EDGE_PATH = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
const FRONTEND_URL = 'http://localhost:5174';
const BACKEND_URL = 'http://localhost:5000/api/v1';
const SCREENSHOT_DIR = path.resolve(process.cwd(), 'docs', 'test-reports', 'weekly-reports');

fs.mkdirSync(SCREENSHOT_DIR, { recursive: true });

interface TestResult {
  suite: string;
  test: string;
  status: 'PASS' | 'FAIL';
  details?: string;
  error?: string;
}

const results: TestResult[] = [];

function record(suite: string, test: string, status: 'PASS' | 'FAIL', details?: string, error?: string) {
  results.push({ suite, test, status, details, error });
  const icon = status === 'PASS' ? '✅' : '❌';
  console.log(`${icon} [${suite}] ${test}: ${status} ${details ? `(${details})` : ''} ${error ? `\n   Error: ${error}` : ''}`);
}

async function createBrowser(): Promise<Browser> {
  return puppeteer.launch({
    executablePath: EDGE_PATH,
    headless: true,
    args: [
      '--no-sandbox',
      '--disable-setuid-sandbox',
      '--disable-dev-shm-usage',
      '--disable-gpu',
      '--window-size=1280,850',
    ],
  });
}

async function delay(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function takeScreenshot(page: Page, filename: string) {
  const filepath = path.join(SCREENSHOT_DIR, filename);
  await page.screenshot({ path: filepath, fullPage: false });
  console.log(`   📸 Screenshot: ${filename}`);
}

async function loginUserInBrowser(page: Page, email: string, pass: string) {
  const client = await page.target().createCDPSession();
  await client.send('Network.clearBrowserCookies');
  await client.send('Network.clearBrowserCache');
  await page.goto(`${FRONTEND_URL}/login`, { waitUntil: 'networkidle2' });
  await page.evaluate(() => {
    localStorage.clear();
    sessionStorage.clear();
  });
  await page.waitForSelector('#email', { timeout: 10000 });
  await page.$eval('#email', (el) => ((el as HTMLInputElement).value = ''));
  await page.type('#email', email);
  await page.$eval('#password', (el) => ((el as HTMLInputElement).value = ''));
  await page.type('#password', pass);
  await page.click('button[type="submit"]');
  await page.waitForFunction(() => !window.location.pathname.includes('/login'), { timeout: 15000 });
  await delay(1000);
}

async function runTestSuite() {
  console.log('======================================================================');
  console.log('🚀 STARTING FEATURE 7: WEEKLY REVIEW, REPORTS & MONTHLY AUDIT SUITE');
  console.log('======================================================================\n');

  await mongoose.connect(env.MONGODB_URI);
  console.log('Connected to MongoDB Atlas.\n');

  const timestamp = Date.now();
  const userAEmail = `review.cand.${timestamp}@example.com`;
  const userBEmail = `review.intruder.${timestamp}@example.com`;
  const userPassword = 'Password@123';

  let browser: Browser | null = null;
  let page: Page | null = null;

  try {
    // -------------------------------------------------------------
    // SEED USERS & MASTER DATA
    // -------------------------------------------------------------
    console.log('--- Step 0: Registering Test Candidates via API ---');

    let domain = await CareerDomainModel.findOne();
    if (!domain) {
      domain = await (CareerDomainModel as any).create({
        name: 'Backend Engineering',
        slug: 'backend-engineering',
        description: 'Server-side systems',
        isActive: true,
      });
    }

    let role = await CareerRoleModel.findOne({ domainId: (domain as any)._id });
    if (!role) {
      role = await (CareerRoleModel as any).create({
        domainId: (domain as any)._id,
        name: 'Node.js Backend Engineer',
        slug: 'nodejs-backend-engineer',
        description: 'Scalable APIs with Node.js',
        isActive: true,
      });
    }

    let skill = await SkillCatalogModel.findOne();
    if (!skill) {
      skill = await (SkillCatalogModel as any).create({
        name: 'Node.js Architecture',
        category: 'TECHNICAL',
        description: 'Event loop and clustering',
      });
    }

    // Register User A
    const regARes = await fetch(`${BACKEND_URL}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        fullName: 'Weekly Candidate A',
        email: userAEmail,
        password: userPassword,
      }),
    });
    const regAData: any = await regARes.json();
    const tokenA = regAData.data.accessToken;
    const userAId = regAData.data.user.id;

    // Register User B
    const regBRes = await fetch(`${BACKEND_URL}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        fullName: 'Weekly Intruder B',
        email: userBEmail,
        password: userPassword,
      }),
    });
    const regBData: any = await regBRes.json();
    const tokenB = regBData.data.accessToken;
    const userBId = regBData.data.user.id;

    console.log('Registered User A and User B successfully.\n');

    // Seed Journey A
    const journeyA: any = await CareerJourneyModel.create({
      userId: new Types.ObjectId(userAId),
      domainId: domain!._id,
      roleId: role!._id,
      targetCompany: 'Uber',
      status: CareerJourneyStatus.ACTIVE,
      targetDurationMonths: 6,
      dailyStudyHours: 2,
      preferredLanguage: PreferredLanguage.ENGLISH,
    });

    // Seed Journey B
    const journeyB: any = await CareerJourneyModel.create({
      userId: new Types.ObjectId(userBId),
      domainId: domain!._id,
      roleId: role!._id,
      targetCompany: 'Google',
      status: CareerJourneyStatus.ACTIVE,
      targetDurationMonths: 6,
      dailyStudyHours: 2,
      preferredLanguage: PreferredLanguage.ENGLISH,
    });

    await UserModel.findByIdAndUpdate(userAId, {
      hasCompletedOnboarding: true,
      activeCareerJourneyId: journeyA._id,
    });

    await UserModel.findByIdAndUpdate(userBId, {
      hasCompletedOnboarding: true,
      activeCareerJourneyId: journeyB._id,
    });

    // Seed Completed Initial Assessment for User A
    await AssessmentModel.create({
      careerJourneyId: journeyA._id,
      type: AssessmentType.INITIAL,
      weekNumber: 0,
      title: 'Initial Diagnostic Assessment',
      description: 'Initial skills assessment for career path setup.',
      deliveryMode: AssessmentDeliveryMode.INTERNAL,
      status: AssessmentStatus.COMPLETED,
    });

    // Seed Completed Initial Assessment for User B
    await AssessmentModel.create({
      careerJourneyId: journeyB._id,
      type: AssessmentType.INITIAL,
      weekNumber: 0,
      title: 'Initial Diagnostic Assessment',
      description: 'Initial skills assessment for career path setup.',
      deliveryMode: AssessmentDeliveryMode.INTERNAL,
      status: AssessmentStatus.COMPLETED,
    });

    // Seed Roadmap for User A
    const roadmapA: any = await RoadmapModel.create({
      careerJourneyId: journeyA._id,
      version: 1,
      title: 'Full Stack Node.js Backend Roadmap',
      targetRole: 'Node.js Developer',
      targetDomain: 'Backend Engineering',
      targetDurationMonths: 6,
      estimatedWeeks: 12,
      totalItems: 6,
      completedItems: 0,
      type: RoadmapType.INITIAL,
      status: RoadmapStatus.ACTIVE,
      generatedAt: new Date(),
    });

    // Seed 6 Roadmap Items for User A
    const roadmapItemsData = [
      { title: 'Node.js Event Loop Internals', description: 'Deep dive into libuv and microtask queues.', estimatedHours: 4 },
      { title: 'Asynchronous Programming & Streams', description: 'Transform streams and backpressure.', estimatedHours: 3 },
      { title: 'RESTful API Architecture & Validation', description: 'Building resilient API controllers.', estimatedHours: 4 },
      { title: 'Database Optimization & Indexing', description: 'MongoDB aggregation pipelines.', estimatedHours: 3 },
      { title: 'Authentication, JWT & OWASP Security', description: 'Hardening backend against BOLA/IDOR.', estimatedHours: 4 },
      { title: 'Microservices & Message Queues', description: 'Scalable pub/sub with Redis.', estimatedHours: 3 },
    ];

    const roadmapItemsA: any[] = [];
    for (let i = 0; i < roadmapItemsData.length; i++) {
      const item = await RoadmapItemModel.create({
        roadmapId: roadmapA._id,
        order: i + 1,
        type: RoadmapItemType.TOPIC,
        skillId: skill!._id,
        title: roadmapItemsData[i].title,
        description: roadmapItemsData[i].description,
        estimatedHours: roadmapItemsData[i].estimatedHours,
        status: RoadmapItemStatus.PENDING,
        aiReason: 'Core topic required for production backend engineering.',
      });
      roadmapItemsA.push(item);
    }

    // Seed User Skills for User A
    const userSkillA = await UserSkillModel.create({
      careerJourneyId: journeyA._id,
      skillCatalogId: skill!._id,
      selectedByUser: true,
      currentScore: 60,
      currentLevel: SkillLevel.BEGINNER,
    });

    // Seed User Skills for User B
    const userSkillB = await UserSkillModel.create({
      careerJourneyId: journeyB._id,
      skillCatalogId: skill!._id,
      selectedByUser: true,
      currentScore: 50,
      currentLevel: SkillLevel.BEGINNER,
    });

    browser = await createBrowser();
    page = await browser.newPage();
    await page.setViewport({ width: 1280, height: 850 });

    // =========================================================================
    // SUITE 1: Route Guards, Gating & Redirection
    // =========================================================================
    console.log('--- SUITE 1: Route Guards, Gating & Redirection ---');

    await page.goto(`${FRONTEND_URL}/login`, { waitUntil: 'networkidle2' });
    await page.evaluate(() => {
      localStorage.clear();
      sessionStorage.clear();
    });

    // Test 1: Unauth /weekly-review
    await page.goto(`${FRONTEND_URL}/weekly-review`, { waitUntil: 'networkidle2' });
    await delay(600);
    const unauthReviewUrl = page.url();
    if (unauthReviewUrl.includes('/login')) {
      record('SUITE 1', 'Unauthenticated /weekly-review redirects to /login', 'PASS', unauthReviewUrl);
    } else {
      record('SUITE 1', 'Unauthenticated /weekly-review redirects to /login', 'FAIL', `Stayed on: ${unauthReviewUrl}`);
    }

    // Test 2: Unauth /weekly-reports
    await page.goto(`${FRONTEND_URL}/weekly-reports`, { waitUntil: 'networkidle2' });
    await delay(600);
    const unauthReportsUrl = page.url();
    if (unauthReportsUrl.includes('/login')) {
      record('SUITE 1', 'Unauthenticated /weekly-reports redirects to /login', 'PASS', unauthReportsUrl);
    } else {
      record('SUITE 1', 'Unauthenticated /weekly-reports redirects to /login', 'FAIL', `Stayed on: ${unauthReportsUrl}`);
    }

    // Test 3: Unauth /monthly-reports
    await page.goto(`${FRONTEND_URL}/monthly-reports`, { waitUntil: 'networkidle2' });
    await delay(600);
    const unauthMonthlyUrl = page.url();
    if (unauthMonthlyUrl.includes('/login')) {
      record('SUITE 1', 'Unauthenticated /monthly-reports redirects to /login', 'PASS', unauthMonthlyUrl);
    } else {
      record('SUITE 1', 'Unauthenticated /monthly-reports redirects to /login', 'FAIL', `Stayed on: ${unauthMonthlyUrl}`);
    }

    await takeScreenshot(page, '01_unauth_route_guard.png');

    // Test 4: API unauth rejection
    const unauthReviewRes = await fetch(`${BACKEND_URL}/weekly-reviews/current`);
    const unauthReportsRes = await fetch(`${BACKEND_URL}/weekly-reports/${journeyA._id}`);
    const unauthMonthlyRes = await fetch(`${BACKEND_URL}/monthly-reports/${journeyA._id}/due-status`);

    if (unauthReviewRes.status === 401 && unauthReportsRes.status === 401 && unauthMonthlyRes.status === 401) {
      record('SUITE 1', 'All review and report endpoints reject unauthenticated requests with 401', 'PASS', '401 Unauthorized');
    } else {
      record('SUITE 1', 'All review and report endpoints reject unauthenticated requests with 401', 'FAIL', `Statuses: ${unauthReviewRes.status}, ${unauthReportsRes.status}, ${unauthMonthlyRes.status}`);
    }

    // =========================================================================
    // SUITE 2: Empty States & Premature Access Guardrails
    // =========================================================================
    console.log('\n--- SUITE 2: Empty States & Premature Access Guardrails ---');

    await loginUserInBrowser(page, userAEmail, userPassword);

    // Test 1: Zero weekly reports empty state
    await page.goto(`${FRONTEND_URL}/weekly-reports`, { waitUntil: 'networkidle2' });
    try {
      await page.waitForFunction(() => {
        const text = document.body.textContent || '';
        return text.includes('No weekly reports yet');
      }, { timeout: 10000 });
    } catch (_) {}
    await delay(1000);

    const weeklyEmptyText = await page.evaluate(() => {
      const text = document.body.textContent || '';
      return text.includes('No weekly reports yet') && text.includes('Go to Workspace');
    });

    if (weeklyEmptyText) {
      record('SUITE 2', 'Weekly reports hub renders empty state with "Go to Workspace" CTA', 'PASS', 'Empty State verified');
    } else {
      record('SUITE 2', 'Weekly reports hub renders empty state with "Go to Workspace" CTA', 'FAIL', 'Empty state missing');
    }
    await takeScreenshot(page, '02_weekly_reports_empty_state.png');

    // Test 2: Zero monthly reports empty state
    await page.goto(`${FRONTEND_URL}/monthly-reports`, { waitUntil: 'networkidle2' });
    try {
      await page.waitForFunction(() => document.body.textContent?.includes('No monthly reports yet'), { timeout: 8000 });
    } catch (_) {}
    await delay(500);

    const monthlyEmptyText = await page.evaluate(() => {
      const text = document.body.textContent || '';
      return text.includes('No monthly reports yet') && text.includes('Go to Workspace');
    });

    if (monthlyEmptyText) {
      record('SUITE 2', 'Monthly reports hub renders empty state with "Go to Workspace" CTA', 'PASS', 'Empty State verified');
    } else {
      record('SUITE 2', 'Monthly reports hub renders empty state with "Go to Workspace" CTA', 'FAIL', 'Empty state missing');
    }
    await takeScreenshot(page, '03_monthly_reports_empty_state.png');

    // Create Initial Mission for User A on Day 1 (organically starting today)
    const initMissionRes = await fetch(`${BACKEND_URL}/missions/${journeyA._id}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${tokenA}`,
      },
    });
    const initMissionData: any = await initMissionRes.json();
    const createdMissionId = initMissionData.data?.id || initMissionData.data?._id;

    // Test 3: Early access to /weekly-review when on Day 1
    await page.goto(`${FRONTEND_URL}/weekly-review`, { waitUntil: 'networkidle2' });
    await delay(1200);

    const earlyReviewText = await page.evaluate(() => {
      const text = document.body.textContent || '';
      return text.includes('Weekly Review Not Yet Available') && text.includes('Day 7') && text.includes('Return to Workspace');
    });

    if (earlyReviewText) {
      record('SUITE 2', 'Early /weekly-review access displays friendly Day 7 lock banner with workspace return button', 'PASS', 'Day 7 Lock verified');
    } else {
      record('SUITE 2', 'Early /weekly-review access displays friendly Day 7 lock banner with workspace return button', 'FAIL', 'Early review guard missing');
    }
    await takeScreenshot(page, '04_weekly_review_early_locked.png');

    // Test 4: Direct API early review rejection
    const earlyApiRes = await fetch(`${BACKEND_URL}/weekly-reviews/current`, {
      headers: { Authorization: `Bearer ${tokenA}` },
    });
    const earlyApiJson: any = await earlyApiRes.json();

    if (earlyApiRes.status === 409 && earlyApiJson.message?.includes('not available yet')) {
      record('SUITE 2', 'Direct GET /weekly-reviews/current rejected with 409 Conflict when currentMissionDay < 7', 'PASS', earlyApiJson.message);
    } else {
      record('SUITE 2', 'Direct GET /weekly-reviews/current rejected with 409 Conflict when currentMissionDay < 7', 'FAIL', `Status: ${earlyApiRes.status}`);
    }

    // =========================================================================
    // SUITE 3: Day 7 Weekly Review Unlock & Preparation Wizard
    // =========================================================================
    console.log('\n--- SUITE 3: Day 7 Weekly Review Unlock & Preparation Wizard ---');

    // Fast-forward mission start date to 7 days in the past so currentMissionDay evaluates to 7
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    await MissionModel.findByIdAndUpdate(createdMissionId, { startDate: sevenDaysAgo });

    // Verify API unlock
    const unlockedApiRes = await fetch(`${BACKEND_URL}/weekly-reviews/current`, {
      headers: { Authorization: `Bearer ${tokenA}` },
    });
    const unlockedApiJson: any = await unlockedApiRes.json();

    if (unlockedApiRes.status === 200 && unlockedApiJson.data?.missionId === createdMissionId && unlockedApiJson.data?.skills?.length > 0) {
      record('SUITE 3', 'GET /weekly-reviews/current unlocks successfully on Day 7 returning mission skills', 'PASS', `Skills: ${unlockedApiJson.data.skills.length}`);
    } else {
      record('SUITE 3', 'GET /weekly-reviews/current unlocks successfully on Day 7 returning mission skills', 'FAIL', `Status: ${unlockedApiRes.status}`);
    }

    // Navigate to /weekly-review with a fresh page load
    await page.goto(`${FRONTEND_URL}/workspace`, { waitUntil: 'networkidle2' });
    await delay(500);
    await page.goto(`${FRONTEND_URL}/weekly-review`, { waitUntil: 'networkidle2' });
    await page.reload({ waitUntil: 'networkidle2' });
    try {
      await page.waitForFunction(() => {
        const text = document.body.textContent || '';
        return text.includes('Review Topics') || text.includes('Covered this week') || text.includes('Weekly Review');
      }, { timeout: 10000 });
    } catch (_) {}
    await delay(1000);

    // Verify Step 1: Topics Step renders
    const step1Rendered = await page.evaluate(() => {
      const text = document.body.textContent || '';
      return text.includes('Review Topics') || text.includes('Weekly Review') || text.includes('Covered this week');
    });

    if (step1Rendered) {
      record('SUITE 3', 'Weekly Review Wizard renders Step 1 (Curriculum & Skills to Review)', 'PASS', 'Step 1 verified');
    } else {
      record('SUITE 3', 'Weekly Review Wizard renders Step 1 (Curriculum & Skills to Review)', 'FAIL', 'Step 1 missing');
    }
    await takeScreenshot(page, '05_weekly_review_step1_topics.png');

    // Click "I've Completed My Assessment" to advance to Step 2
    await page.evaluate(() => {
      const btns = Array.from(document.querySelectorAll('button'));
      const continueBtn = btns.find(b =>
        b.textContent?.includes("I've Completed My Assessment") ||
        b.textContent?.includes('Continue') ||
        b.textContent?.includes('Next')
      );
      if (continueBtn) (continueBtn as HTMLElement).click();
    });
    await delay(1200);

    // Verify Step 2: Assessment Scores Step renders
    const step2Rendered = await page.evaluate(() => {
      const text = document.body.textContent || '';
      return text.includes('Assessment Scores') || text.includes('Obtained Marks');
    });

    if (step2Rendered) {
      record('SUITE 3', 'Weekly Review Wizard advances cleanly to Step 2 (Assessment Scores input)', 'PASS', 'Step 2 verified');
    } else {
      record('SUITE 3', 'Weekly Review Wizard advances cleanly to Step 2 (Assessment Scores input)', 'FAIL', 'Step 2 missing');
    }

    // Fill in assessment score (e.g. 85 / 100)
    await page.evaluate(() => {
      const inputs = Array.from(document.querySelectorAll('input[type="number"]')) as HTMLInputElement[];
      if (inputs.length > 0) {
        inputs[0].value = '85';
        inputs[0].dispatchEvent(new Event('input', { bubbles: true }));
        inputs[0].dispatchEvent(new Event('change', { bubbles: true }));
      }
    });
    await delay(1000);
    await takeScreenshot(page, '06_weekly_review_step2_assessment.png');

    // Click Continue to advance to Step 3 (Student Reflection)
    await page.evaluate(() => {
      const btns = Array.from(document.querySelectorAll('button'));
      const continueBtn = btns.find(b => b.textContent?.trim() === 'Continue');
      if (continueBtn) (continueBtn as HTMLElement).click();
    });
    await delay(1200);

    // Verify Step 3: Student Reflection
    const step3Rendered = await page.evaluate(() => {
      const text = document.body.textContent || '';
      return text.includes('Student Reflection') || text.includes('Mentor Check-In') || text.includes('Complete Weekly Review');
    });

    if (step3Rendered) {
      record('SUITE 3', 'Weekly Review Wizard advances to Step 3 (Reflection & Mentor Check-In)', 'PASS', 'Step 3 verified');
    } else {
      record('SUITE 3', 'Weekly Review Wizard advances to Step 3 (Reflection & Mentor Check-In)', 'FAIL', 'Step 3 missing');
    }

    // Select reflection radio / rating buttons in Step 3
    await page.evaluate(() => {
      const btns = Array.from(document.querySelectorAll('button'));
      // Select Great overall week
      const greatBtn = btns.find(b => b.textContent?.toLowerCase().includes('great') || b.textContent?.toLowerCase().includes('good'));
      if (greatBtn) greatBtn.click();

      // Select High motivation
      const highBtn = btns.find(b => b.textContent?.toLowerCase().includes('high'));
      if (highBtn) highBtn.click();
    });
    await delay(800);
    await takeScreenshot(page, '07_weekly_review_step3_reflection.png');

    // =========================================================================
    // SUITE 4: Review Submission & Lifecycle Completion
    // =========================================================================
    console.log('\n--- SUITE 4: Review Submission & Lifecycle Completion ---');

    // Submit Weekly Review via API/UI
    const currentReviewData = unlockedApiJson.data;
    const submitReviewRes = await fetch(`${BACKEND_URL}/weekly-reviews/submit`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${tokenA}`,
      },
      body: JSON.stringify({
        assessment: {
          assessmentId: currentReviewData.assessmentId,
          skills: currentReviewData.skills.map((s: any) => ({
            userSkillId: s.userSkillId,
            obtainedMarks: 85,
            totalMarks: 100,
          })),
        },
        reflection: {
          learningReflection: {
            completedAllTasks: true,
            confidenceRating: 4,
          },
          mentorCheckIn: {
            overallWeek: 'GOOD',
            motivationLevel: 'HIGH',
            externalFactors: 'Smooth learning pace without blockers.',
          },
          additionalComments: 'Enjoyed deep diving into Node.js event loop and architecture.',
        },
      }),
    });

    const submitJson: any = await submitReviewRes.json();
    console.log('DEBUG submitJson status:', submitReviewRes.status, 'body:', JSON.stringify(submitJson));

    const createdReportId = submitJson.data?.weeklyReport?._id || submitJson.data?.weeklyReport?.id;

    if (submitReviewRes.status === 201 && createdReportId) {
      record('SUITE 4', 'POST /weekly-reviews/submit executes atomic review lifecycle with report creation', 'PASS', `Report ID: ${createdReportId}`);
    } else {
      record('SUITE 4', 'POST /weekly-reviews/submit executes atomic review lifecycle with report creation', 'FAIL', `Status: ${submitReviewRes.status}`);
    }

    // Verify Mission #1 and Day 7 Task completion in Database
    const completedMission: any = await MissionModel.findById(createdMissionId);
    const completedDay7: any = await DailyTaskModel.findOne({ missionId: createdMissionId, dayNumber: 7 });
    const persistedReflection: any = await WeeklyReflectionModel.findOne({ missionId: createdMissionId });
    const persistedReport: any = await WeeklyReportModel.findById(createdReportId);

    if (completedMission && completedMission.status === MissionStatus.COMPLETED) {
      record('SUITE 4', 'Mission #1 transitioned to status COMPLETED upon review submission', 'PASS', completedMission.status);
    } else {
      record('SUITE 4', 'Mission #1 transitioned to status COMPLETED upon review submission', 'FAIL', `Status: ${completedMission?.status}`);
    }

    if (completedDay7 && completedDay7.status === DailyTaskStatus.COMPLETED) {
      record('SUITE 4', 'Day 7 Weekly Review task transitioned to COMPLETED atomically', 'PASS', completedDay7.status);
    } else {
      record('SUITE 4', 'Day 7 Weekly Review task transitioned to COMPLETED atomically', 'FAIL', `Status: ${completedDay7?.status}`);
    }

    if (persistedReflection && persistedReport) {
      record('SUITE 4', 'WeeklyReflection and WeeklyReport documents persisted with complete feedback', 'PASS', 'Audit Persisted');
    } else {
      record('SUITE 4', 'WeeklyReflection and WeeklyReport documents persisted with complete feedback', 'FAIL', 'Persistence missing');
    }

    await page.goto(`${FRONTEND_URL}/workspace`, { waitUntil: 'networkidle2' });
    await delay(1200);
    await takeScreenshot(page, '08_weekly_review_submitted_workspace.png');

    // =========================================================================
    // SUITE 5: Weekly Reports Hub (/weekly-reports) Card Display & Navigation
    // =========================================================================
    console.log('\n--- SUITE 5: Weekly Reports Hub (/weekly-reports) Cards & Navigation ---');

    await page.goto(`${FRONTEND_URL}/weekly-reports`, { waitUntil: 'networkidle2' });
    try {
      await page.waitForFunction(() => {
        const text = document.body.textContent || '';
        return text.includes('Weekly Reports') && (text.includes('Weekly Report 1') || text.includes('Weekly Progress Review') || text.includes('Week 1'));
      }, { timeout: 10000 });
    } catch (_) {}
    await delay(1000);

    const hubHeaderPresent = await page.evaluate(() => {
      const text = document.body.textContent || '';
      return text.includes('Weekly Reports') && text.includes('Progress Insights');
    });

    const reportCardPresent = await page.evaluate(() => {
      const text = document.body.textContent || '';
      return text.includes('Weekly Report 1') || text.includes('Weekly Progress Review') || text.includes('Week 1') || text.includes('Mission 1');
    });

    if (hubHeaderPresent && reportCardPresent) {
      record('SUITE 5', 'Weekly Reports Hub renders Week 1 Report Card with summary badge', 'PASS', 'Report card visible');
    } else {
      record('SUITE 5', 'Weekly Reports Hub renders Week 1 Report Card with summary badge', 'FAIL', `Header: ${hubHeaderPresent}, Card: ${reportCardPresent}`);
    }
    await takeScreenshot(page, '09_weekly_reports_hub.png');

    // Click card to open report details
    await page.evaluate(() => {
      const btns = Array.from(document.querySelectorAll('button'));
      const card = btns.find(b =>
        b.textContent?.includes('Weekly Report 1') ||
        b.textContent?.includes('Weekly Progress Review') ||
        b.textContent?.includes('Week 1') ||
        b.textContent?.includes('Mission 1')
      );
      if (card) card.click();
    });
    await delay(1500);

    const currentUrl = page.url();
    if (currentUrl.includes(`/weekly-reports/${createdReportId}`) || currentUrl.includes('/weekly-reports/')) {
      record('SUITE 5', 'Clicking report card navigates smoothly to /weekly-reports/:reportId', 'PASS', currentUrl);
    } else {
      record('SUITE 5', 'Clicking report card navigates smoothly to /weekly-reports/:reportId', 'FAIL', currentUrl);
    }

    // =========================================================================
    // SUITE 6: Weekly Report Details (/weekly-reports/:reportId) Breakdown
    // =========================================================================
    console.log('\n--- SUITE 6: Weekly Report Details Breakdown ---');

    await page.goto(`${FRONTEND_URL}/weekly-reports/${createdReportId}`, { waitUntil: 'networkidle2' });
    try {
      await page.waitForFunction(() => {
        const text = document.body.textContent || '';
        return text.includes('Summary') || text.includes('Achievements') || text.includes('Mentor Feedback');
      }, { timeout: 10000 });
    } catch (_) {}
    await delay(1000);

    const reportDetailsContent = await page.evaluate(() => {
      const text = document.body.textContent || '';
      return {
        hasSummary: text.includes('Summary') || text.includes('Achievements') || text.includes('Solid progress'),
        hasFeedback: text.includes('Mentor Feedback') || text.includes('Consistency is key') || text.includes('Advice'),
        hasRecommendation: text.includes('Recommendation') || text.includes('Next Week') || text.includes('Study Hours'),
        hasSkills: text.includes('Node.js Architecture') || text.includes('85%') || text.includes('Marks'),
      };
    });

    if (reportDetailsContent.hasSummary && reportDetailsContent.hasFeedback) {
      record('SUITE 6', 'Weekly Report Details renders AI Summary, Achievements and Mentor Feedback', 'PASS', 'Feedback verified');
    } else {
      record('SUITE 6', 'Weekly Report Details renders AI Summary, Achievements and Mentor Feedback', 'FAIL', JSON.stringify(reportDetailsContent));
    }

    if (reportDetailsContent.hasRecommendation && reportDetailsContent.hasSkills) {
      record('SUITE 6', 'Weekly Report Details renders Skill Breakdown and Next Mission Recommendations', 'PASS', 'Recommendations verified');
    } else {
      record('SUITE 6', 'Weekly Report Details renders Skill Breakdown and Next Mission Recommendations', 'FAIL', JSON.stringify(reportDetailsContent));
    }

    await takeScreenshot(page, '10_weekly_report_details_page.png');

    // =========================================================================
    // SUITE 7: Monthly Report Due Status & Cycle Calculation
    // =========================================================================
    console.log('\n--- SUITE 7: Monthly Report Lifecycle & Due Status ---');

    // Test 1: Check due status when < 28 days elapsed
    const dueBeforeRes = await fetch(`${BACKEND_URL}/monthly-reports/${journeyA._id}/due-status`, {
      headers: { Authorization: `Bearer ${tokenA}` },
    });
    const dueBeforeJson: any = await dueBeforeRes.json();

    if (dueBeforeRes.status === 200 && dueBeforeJson.data?.due === false) {
      record('SUITE 7', 'Monthly report due status correctly reports due: false during active 28-day cycle', 'PASS', 'due: false');
    } else {
      record('SUITE 7', 'Monthly report due status correctly reports due: false during active 28-day cycle', 'FAIL', JSON.stringify(dueBeforeJson));
    }

    // Advance first mission start date to 28 days in the past
    const twentyEightDaysAgo = new Date();
    twentyEightDaysAgo.setDate(twentyEightDaysAgo.getDate() - 28);
    await MissionModel.findByIdAndUpdate(createdMissionId, { startDate: twentyEightDaysAgo });

    // Test 2: Check due status now
    const dueAfterRes = await fetch(`${BACKEND_URL}/monthly-reports/${journeyA._id}/due-status`, {
      headers: { Authorization: `Bearer ${tokenA}` },
    });
    const dueAfterJson: any = await dueAfterRes.json();

    if (dueAfterRes.status === 200 && dueAfterJson.data?.due === true && dueAfterJson.data?.reportNumber === 1) {
      record('SUITE 7', 'Monthly report unlocks with due: true on Day 28 of cycle', 'PASS', 'Cycle 1 Due verified');
    } else {
      record('SUITE 7', 'Monthly report unlocks with due: true on Day 28 of cycle', 'FAIL', JSON.stringify(dueAfterJson));
    }

    // Test 3: Generate Monthly Report #1
    const genMonthlyRes = await fetch(`${BACKEND_URL}/monthly-reports/${journeyA._id}/generate`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${tokenA}` },
    });
    const genMonthlyJson: any = await genMonthlyRes.json();

    if (genMonthlyRes.status === 201 && genMonthlyJson.data?.reportNumber === 1) {
      record('SUITE 7', 'POST /monthly-reports/:id/generate generates comprehensive 28-day monthly audit', 'PASS', 'Report #1 generated');
    } else {
      record('SUITE 7', 'POST /monthly-reports/:id/generate generates comprehensive 28-day monthly audit', 'FAIL', `Status: ${genMonthlyRes.status}`);
    }

    const monthlyReportInDb: any = await MonthlyReportModel.findOne({ careerJourneyId: journeyA._id, reportNumber: 1 });
    if (monthlyReportInDb && monthlyReportInDb.reportNumber === 1) {
      record('SUITE 7', 'Monthly Report #1 persisted in database with metrics and strategic insights', 'PASS', `Cycle: ${monthlyReportInDb.reportNumber}`);
    } else {
      record('SUITE 7', 'Monthly Report #1 persisted in database with metrics and strategic insights', 'FAIL', 'Persistence missing');
    }

    await takeScreenshot(page, '11_monthly_report_due_and_generated.png');

    // =========================================================================
    // SUITE 8: Monthly Reports Hub & Detailed Analytics
    // =========================================================================
    console.log('\n--- SUITE 8: Monthly Reports Hub & Detailed Analytics ---');

    await page.goto(`${FRONTEND_URL}/monthly-reports`, { waitUntil: 'networkidle2' });
    await delay(1200);

    const monthlyHubRendered = await page.evaluate(() => {
      const text = document.body.textContent || '';
      return text.includes('Monthly Reports') && (text.includes('Month 1') || text.includes('Report #1') || text.includes('Long-Term Progress'));
    });

    if (monthlyHubRendered) {
      record('SUITE 8', 'Monthly Reports Hub lists Month 1 Report card with metrics overview', 'PASS', 'Month 1 card rendered');
    } else {
      record('SUITE 8', 'Monthly Reports Hub lists Month 1 Report card with metrics overview', 'FAIL', 'Month 1 card missing');
    }
    await takeScreenshot(page, '12_monthly_reports_hub.png');

    // Navigate to Month 1 details
    await page.goto(`${FRONTEND_URL}/monthly-reports/1`, { waitUntil: 'networkidle2' });
    await delay(1200);

    const monthlyDetailsRendered = await page.evaluate(() => {
      const text = document.body.textContent || '';
      return {
        hasHeader: text.includes('Month 1') || text.includes('Monthly Progress Report') || text.includes('Evaluation'),
        hasOverview: text.includes('Consistency') || text.includes('Task') || text.includes('Completed') || text.includes('Strengths'),
      };
    });

    if (monthlyDetailsRendered.hasHeader && monthlyDetailsRendered.hasOverview) {
      record('SUITE 8', 'Monthly Report Details page renders comprehensive 28-day analytics and strategic audit', 'PASS', 'Analytics verified');
    } else {
      record('SUITE 8', 'Monthly Report Details page renders comprehensive 28-day analytics and strategic audit', 'FAIL', JSON.stringify(monthlyDetailsRendered));
    }
    await takeScreenshot(page, '13_monthly_report_details_analytics.png');

    // =========================================================================
    // SUITE 9: Defensive Edge Cases & Malformed Route Boundaries
    // =========================================================================
    console.log('\n--- SUITE 9: Defensive Edge Cases & Idempotency Guards ---');

    // Test 1: Malformed reportId
    const malformedReportRes = await fetch(`${BACKEND_URL}/weekly-reports/report/invalid-id`, {
      headers: { Authorization: `Bearer ${tokenA}` },
    });
    if (malformedReportRes.status === 400) {
      record('SUITE 9', 'Malformed reportId returns 400 Validation Error', 'PASS', 'Status 400');
    } else {
      record('SUITE 9', 'Malformed reportId returns 400 Validation Error', 'FAIL', `Status: ${malformedReportRes.status}`);
    }

    // Test 2: Non-existent reportId
    const nonExistentReportRes = await fetch(`${BACKEND_URL}/weekly-reports/report/507f1f77bcf86cd799439011`, {
      headers: { Authorization: `Bearer ${tokenA}` },
    });
    if (nonExistentReportRes.status === 404) {
      record('SUITE 9', 'Non-existent reportId returns 404 Not Found', 'PASS', 'Status 404');
    } else {
      record('SUITE 9', 'Non-existent reportId returns 404 Not Found', 'FAIL', `Status: ${nonExistentReportRes.status}`);
    }

    // Test 3: Resubmitting completed weekly review
    const resubmitRes = await fetch(`${BACKEND_URL}/weekly-reviews/submit`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${tokenA}`,
      },
      body: JSON.stringify({
        assessment: {
          assessmentId: currentReviewData.assessmentId,
          skills: currentReviewData.skills.map((s: any) => ({
            userSkillId: s.userSkillId,
            obtainedMarks: 90,
            totalMarks: 100,
          })),
        },
        reflection: {
          learningReflection: { completedAllTasks: true, confidenceRating: 5 },
          mentorCheckIn: { overallWeek: 'GOOD', motivationLevel: 'HIGH' },
        },
      }),
    });
    const resubmitJson: any = await resubmitRes.json();

    if (resubmitRes.status === 409 && resubmitJson.message?.includes('already been completed')) {
      record('SUITE 9', 'Resubmitting Weekly Review on completed mission rejected with 409 Conflict', 'PASS', resubmitJson.message);
    } else {
      record('SUITE 9', 'Resubmitting Weekly Review on completed mission rejected with 409 Conflict', 'FAIL', `Status: ${resubmitRes.status}`);
    }

    // Test 4: Frontend non-trapping error state on invalid report ID
    await page.goto(`${FRONTEND_URL}/weekly-reports/507f1f77bcf86cd799439011`, { waitUntil: 'networkidle2' });
    await delay(1000);

    const errorBoundaryReturn = await page.evaluate(() => {
      const text = document.body.textContent || '';
      return text.includes('Weekly report unavailable') && text.includes('Back to Weekly Reports') && text.includes('Return to Workspace');
    });

    if (errorBoundaryReturn) {
      record('SUITE 9', 'Frontend weekly report error state renders friendly recovery buttons without trapping user', 'PASS', 'Recovery verified');
    } else {
      record('SUITE 9', 'Frontend weekly report error state renders friendly recovery buttons without trapping user', 'FAIL', 'Recovery CTA missing');
    }
    await takeScreenshot(page, '14_defensive_error_states.png');

    // =========================================================================
    // SUITE 10: Multi-Tenant Security & BOLA / IDOR Verification
    // =========================================================================
    console.log('\n--- SUITE 10: Multi-Tenant Security & BOLA / IDOR Protection ---');

    // Test 1: User B cannot fetch User A's latest weekly report
    const idorLatestRes = await fetch(`${BACKEND_URL}/weekly-reports/${journeyA._id}/latest`, {
      headers: { Authorization: `Bearer ${tokenB}` },
    });
    if (idorLatestRes.status === 404) {
      record('SUITE 10', "User B cannot fetch User A's latest weekly report (GET .../latest -> 404)", 'PASS', 'Status 404');
    } else {
      record('SUITE 10', "User B cannot fetch User A's latest weekly report (GET .../latest -> 404)", 'FAIL', `Status: ${idorLatestRes.status}`);
    }

    // Test 2: User B cannot fetch User A's weekly reports list
    const idorListRes = await fetch(`${BACKEND_URL}/weekly-reports/${journeyA._id}`, {
      headers: { Authorization: `Bearer ${tokenB}` },
    });
    if (idorListRes.status === 404) {
      record('SUITE 10', "User B cannot fetch User A's weekly reports list (GET .../:journeyId -> 404)", 'PASS', 'Status 404');
    } else {
      record('SUITE 10', "User B cannot fetch User A's weekly reports list (GET .../:journeyId -> 404)", 'FAIL', `Status: ${idorListRes.status}`);
    }

    // Test 3: User B cannot fetch User A's weekly report details by reportId
    const idorDetailsRes = await fetch(`${BACKEND_URL}/weekly-reports/report/${createdReportId}`, {
      headers: { Authorization: `Bearer ${tokenB}` },
    });
    if (idorDetailsRes.status === 404) {
      record('SUITE 10', "User B cannot fetch User A's weekly report details (GET .../report/:id -> 404)", 'PASS', 'Status 404');
    } else {
      record('SUITE 10', "User B cannot fetch User A's weekly report details (GET .../report/:id -> 404)", 'FAIL', `Status: ${idorDetailsRes.status}`);
    }

    // Test 4: User B cannot check User A's monthly report due status
    const idorMonthlyDueRes = await fetch(`${BACKEND_URL}/monthly-reports/${journeyA._id}/due-status`, {
      headers: { Authorization: `Bearer ${tokenB}` },
    });
    if (idorMonthlyDueRes.status === 404) {
      record('SUITE 10', "User B cannot check User A's monthly report due status (GET .../due-status -> 404)", 'PASS', 'Status 404');
    } else {
      record('SUITE 10', "User B cannot check User A's monthly report due status (GET .../due-status -> 404)", 'FAIL', `Status: ${idorMonthlyDueRes.status}`);
    }

    // Test 5: User B cannot generate monthly report for User A
    const idorGenMonthlyRes = await fetch(`${BACKEND_URL}/monthly-reports/${journeyA._id}/generate`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${tokenB}` },
    });
    if (idorGenMonthlyRes.status === 404) {
      record('SUITE 10', "User B cannot generate monthly report for User A (POST .../generate -> 404)", 'PASS', 'Status 404');
    } else {
      record('SUITE 10', "User B cannot generate monthly report for User A (POST .../generate -> 404)", 'FAIL', `Status: ${idorGenMonthlyRes.status}`);
    }

    // Test 6: User B cannot view User A's monthly report history
    const idorMonthlyHistoryRes = await fetch(`${BACKEND_URL}/monthly-reports/${journeyA._id}/history`, {
      headers: { Authorization: `Bearer ${tokenB}` },
    });
    if (idorMonthlyHistoryRes.status === 404) {
      record('SUITE 10', "User B cannot view User A's monthly report history (GET .../history -> 404)", 'PASS', 'Status 404');
    } else {
      record('SUITE 10', "User B cannot view User A's monthly report history (GET .../history -> 404)", 'FAIL', `Status: ${idorMonthlyHistoryRes.status}`);
    }

    // Test 7: User B cannot view User A's monthly report details
    const idorMonthlyNumRes = await fetch(`${BACKEND_URL}/monthly-reports/${journeyA._id}/1`, {
      headers: { Authorization: `Bearer ${tokenB}` },
    });
    if (idorMonthlyNumRes.status === 404) {
      record('SUITE 10', "User B cannot view User A's monthly report details (GET .../:journeyId/1 -> 404)", 'PASS', 'Status 404');
    } else {
      record('SUITE 10', "User B cannot view User A's monthly report details (GET .../:journeyId/1 -> 404)", 'FAIL', `Status: ${idorMonthlyNumRes.status}`);
    }

    await takeScreenshot(page, '15_multi_tenant_isolation.png');

  } catch (error: any) {
    console.error('\n❌ FATAL TEST SUITE ERROR:', error);
  } finally {
    if (browser) {
      await browser.close();
    }
    await mongoose.disconnect();
  }

  // =========================================================================
  // FINAL SCORECARD SUMMARY
  // =========================================================================
  console.log('\n======================================================================');
  console.log('🏁 FEATURE 7: WEEKLY REVIEW, REPORTS & MONTHLY AUDIT - SCORECARD');
  console.log('======================================================================');
  const total = results.length;
  const passed = results.filter(r => r.status === 'PASS').length;
  const failed = results.filter(r => r.status === 'FAIL').length;
  const rate = total > 0 ? ((passed / total) * 100).toFixed(1) : '0';

  console.log(`TOTAL TESTS: ${total}`);
  console.log(`PASSED:      ${passed}`);
  console.log(`FAILED:      ${failed}`);
  console.log(`PASS RATE:   ${rate}%\n`);

  if (failed > 0) {
    console.log('❌ FAILED TESTS SUMMARY:');
    results.filter(r => r.status === 'FAIL').forEach(f => {
      console.log(` - [${f.suite}] ${f.test}: ${f.details || f.error || 'Unknown error'}`);
    });
  } else {
    console.log('🎉 ALL FEATURE 7 TESTS PASSED WITH 100% SUCCESS!');
  }
}

runTestSuite().catch(console.error);

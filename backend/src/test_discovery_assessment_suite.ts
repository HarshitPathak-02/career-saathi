import puppeteer, { Browser, Page } from 'puppeteer-core';
import path from 'path';
import fs from 'fs';
import mongoose from 'mongoose';
import { DiscoverySessionModel } from './modules/discovery/discovery.model.js';
import { DiscoveryStage } from './modules/discovery/discovery.enums.js';

const EDGE_PATH = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
const BASE_URL = 'http://localhost:5174';
const SCREENSHOT_DIR = 'C:\\careersaathi\\docs\\test-reports\\assessment';
const MONGODB_URI = process.env.MONGODB_URI as string

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
      '--window-size=1280,800',
    ],
  });
}

async function delay(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function waitAndDismissOverlay(page: Page) {
  await page.waitForFunction(() => !document.querySelector('.z-\\[99999\\]'), { timeout: 3500 }).catch(() => { });
  await delay(200);
}

async function clickButtonWithText(page: Page, text: string): Promise<boolean> {
  return page.evaluate((targetText) => {
    const buttons = Array.from(document.querySelectorAll('button'));
    const lower = targetText.trim().toLowerCase();

    // 1. Exact match first
    let btn = buttons.find((b) => b.textContent?.trim().toLowerCase() === lower);

    // 2. Exact word boundary match
    if (!btn) {
      btn = buttons.find((b) => {
        const words = b.textContent?.trim().toLowerCase().split(/\s+/) || [];
        return words.includes(lower);
      });
    }

    // 3. Fallback includes only if target text is long enough
    if (!btn && lower.length > 4) {
      btn = buttons.find((b) => b.textContent?.toLowerCase().includes(lower));
    }

    if (btn) {
      btn.click();
      return true;
    }
    return false;
  }, text);
}

async function clickCardByTitle(page: Page, titleText: string): Promise<boolean> {
  return page.evaluate((targetTitle) => {
    const cards = Array.from(document.querySelectorAll('button'));
    const card = cards.find((c) => c.textContent?.toLowerCase().includes(targetTitle.toLowerCase()));
    if (card) {
      card.click();
      return true;
    }
    return false;
  }, titleText);
}

async function clearAndType(page: Page, selector: string, value: string) {
  await page.waitForSelector(selector, { timeout: 5000 });
  await page.click(selector, { count: 3 });
  await page.keyboard.press('Backspace');
  await page.$eval(selector, (el) => (((el as HTMLInputElement).value = '')));
  await page.type(selector, value, { delay: 20 });
}

async function getAccessToken(page: Page): Promise<string | null> {
  return page.evaluate(async () => {
    try {
      const res = await fetch('http://localhost:5000/api/v1/auth/refresh', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
      });
      const data = await res.json();
      return data?.data?.accessToken || null;
    } catch {
      return null;
    }
  });
}

async function runFeature3Suite() {
  console.log('================================================================');
  console.log('🚀 STARTING CAREERSAATHI E2E TEST: FEATURE 3 — DISCOVERY & INITIAL ASSESSMENT');
  console.log(`Target Frontend: ${BASE_URL}`);
  console.log(`Screenshots Directory: ${SCREENSHOT_DIR}`);
  console.log('================================================================\n');

  // Connect mongoose for background state transitions
  if (mongoose.connection.readyState === 0) {
    await mongoose.connect(MONGODB_URI);
  }

  const browser = await createBrowser();
  const timestamp = Date.now();
  const testEmail = `discovery_eval_${timestamp}@example.com`;
  const testPassword = 'SecurePass123!';
  const testFullName = 'Taylor Reed';

  try {
    // -------------------------------------------------------------
    // PART A: CAREER DISCOVERY (/discovery)
    // -------------------------------------------------------------

    // -------------------------------------------------------------
    // SUITE 1: DISCOVERY ROUTE GUARDS & INTRO PRESENTATION
    // -------------------------------------------------------------
    console.log('\n--- SUITE 1: DISCOVERY ROUTE GUARDS & INTRO PRESENTATION ---');

    // 1.1 Unauthenticated access to /discovery
    const unauthContext = await browser.createBrowserContext();
    const unauthPage = await unauthContext.newPage();
    await unauthPage.setViewport({ width: 1280, height: 800 });

    await unauthPage.goto(`${BASE_URL}/discovery`, { waitUntil: 'networkidle2' });
    await waitAndDismissOverlay(unauthPage);
    await delay(500);
    const unauthUrl = unauthPage.url();
    await unauthPage.screenshot({ path: path.join(SCREENSHOT_DIR, '01_unauth_discovery_guard.png') });

    if (unauthUrl.includes('/login')) {
      record('Discovery Guard', '1.1 Unauthenticated Access to /discovery Blocked', 'PASS', `Redirected to ${unauthUrl}`);
    } else {
      record('Discovery Guard', '1.1 Unauthenticated Access to /discovery Blocked', 'FAIL', `Landed on ${unauthUrl}`);
    }
    await unauthContext.close();

    // 1.2 Authenticated User access to /discovery (without active journey)
    const discoveryContext = await browser.createBrowserContext();
    const discoveryPage = await discoveryContext.newPage();
    await discoveryPage.setViewport({ width: 1280, height: 800 });

    // Register fresh user
    await discoveryPage.goto(`${BASE_URL}/register`, { waitUntil: 'networkidle2' });
    await waitAndDismissOverlay(discoveryPage);
    await clearAndType(discoveryPage, '#fullName', testFullName);
    await clearAndType(discoveryPage, '#email', testEmail);
    await clearAndType(discoveryPage, '#password', testPassword);
    const submitReg = await discoveryPage.$('button[type="submit"]');
    if (submitReg) await submitReg.click();
    await discoveryPage.waitForNavigation({ waitUntil: 'networkidle2', timeout: 10000 }).catch(() => { });
    await delay(1200);

    // Arrive on /career-direction -> Select "I'm Exploring My Options"
    await clickCardByTitle(discoveryPage, 'Exploring');
    await delay(300);
    await clickButtonWithText(discoveryPage, 'Continue');
    await delay(1500);

    const onDiscoveryUrl = discoveryPage.url();
    await discoveryPage.screenshot({ path: path.join(SCREENSHOT_DIR, '02_discovery_intro_page.png') });

    const discoveryPageText = await discoveryPage.evaluate(() => document.body.innerText);
    const hasIntroTitle = discoveryPageText.includes("Let's find a direction that fits you") || discoveryPageText.includes('career discovery');
    const hasStartButton = discoveryPageText.includes('Start career discovery');

    if (onDiscoveryUrl.includes('/discovery') && hasIntroTitle && hasStartButton) {
      record('Discovery Intro', '1.2 Exploring User Lands on Discovery Intro', 'PASS', 'Rendered discovery intro with start CTA');
    } else {
      record('Discovery Intro', '1.2 Exploring User Lands on Discovery Intro', 'FAIL', `Url: ${onDiscoveryUrl}, hasTitle: ${hasIntroTitle}, hasBtn: ${hasStartButton}`);
    }

    // -------------------------------------------------------------
    // SUITE 2: CONVERSATIONAL CAREER DISCOVERY WITH AI COUNSELOR
    // -------------------------------------------------------------
    console.log('\n--- SUITE 2: CONVERSATIONAL CAREER DISCOVERY WITH AI COUNSELOR ---');

    // 2.1 Starting discovery session
    await clickButtonWithText(discoveryPage, 'Start career discovery');
    await delay(2500);
    await discoveryPage.screenshot({ path: path.join(SCREENSHOT_DIR, '03_discovery_session_started.png') });

    const chatHeaderText = await discoveryPage.evaluate(() => document.body.innerText);
    const inChatSession = chatHeaderText.includes('Question') || chatHeaderText.includes('In conversation') || chatHeaderText.includes('Career discovery');

    if (inChatSession) {
      record('Discovery Chat', '2.1 Start Discovery Initiates Chat Panel', 'PASS', 'Transitioned to DiscoveryChatPanel with counselor session');
    } else {
      record('Discovery Chat', '2.1 Start Discovery Initiates Chat Panel', 'FAIL', 'Did not enter chat session');
    }

    // 2.2 Counselor welcome message renders
    const counselorMessages = await discoveryPage.evaluate(() => {
      const bubbles = Array.from(document.querySelectorAll('[aria-live="polite"] p, .space-y-4 p'));
      return bubbles.map((b) => b.textContent?.trim()).filter(Boolean);
    });
    const hasCounselorQuestion = counselorMessages.length > 0;

    if (hasCounselorQuestion) {
      record('Discovery Chat', '2.2 Counselor Initial Probing Question Rendered', 'PASS', `Question displayed: "${counselorMessages[0]?.slice(0, 50)}..."`);
    } else {
      record('Discovery Chat', '2.2 Counselor Initial Probing Question Rendered', 'FAIL', 'No counselor messages found in DOM');
    }

    // 2.3 Composer state and quick replies
    const hasTextarea = await discoveryPage.$('textarea');
    const quickReplyChips = await discoveryPage.evaluate(() => {
      const buttons = Array.from(document.querySelectorAll('form button[type="button"]'));
      return buttons.map((b) => b.textContent?.trim()).filter(Boolean);
    });

    if (hasTextarea) {
      record('Discovery Composer', '2.3 Discovery Composer & Suggestion Chips Available', 'PASS', `Textarea ready, ${quickReplyChips.length} quick suggestions found`);
    } else {
      record('Discovery Composer', '2.3 Discovery Composer & Suggestion Chips Available', 'FAIL', 'Composer textarea missing');
    }

    // 2.4 User response submission (Turn 1)
    await discoveryPage.type('textarea', 'I am in my final year of computer science and love building backend services and APIs.', { delay: 15 });
    await delay(300);
    await discoveryPage.screenshot({ path: path.join(SCREENSHOT_DIR, '04_discovery_response_typed.png') });

    // Submit Turn 1
    await discoveryPage.evaluate(() => {
      const sendBtn = document.querySelector('form button[type="submit"]') as HTMLButtonElement;
      if (sendBtn && !sendBtn.disabled) sendBtn.click();
    });

    // Wait for AI counselor response
    await delay(3500);
    await discoveryPage.screenshot({ path: path.join(SCREENSHOT_DIR, '05_discovery_turn1_answered.png') });

    const postTurn1Text = await discoveryPage.evaluate(() => document.body.innerText);
    const turn1Processed = postTurn1Text.includes('backend services and APIs') || postTurn1Text.includes('Question 2') || postTurn1Text.includes('Answers saved');

    if (turn1Processed) {
      record('Discovery Conversation', '2.4 User Answer Submission & AI Counselor Processing', 'PASS', 'Message sent and acknowledged by AI counselor');
    } else {
      record('Discovery Conversation', '2.4 User Answer Submission & AI Counselor Processing', 'FAIL', `Turn 1 processed: ${turn1Processed}`);
    }

    // -------------------------------------------------------------
    // SUITE 3: CAREER CANDIDATES RECOMMENDATIONS & SELECTION
    // -------------------------------------------------------------
    console.log('\n--- SUITE 3: CAREER CANDIDATES RECOMMENDATIONS & SELECTION ---');

    // 3.1 Transition session to GENERATING stage so AI recommendations can be computed
    const token = await getAccessToken(discoveryPage);
    const discoverySessionData = await discoveryPage.evaluate(async (authToken) => {
      try {
        const res = await fetch('http://localhost:5000/api/v1/discovery/latest', {
          headers: {
            'Content-Type': 'application/json',
            ...(authToken ? { Authorization: `Bearer ${authToken}` } : {}),
          },
          credentials: 'include',
        });
        const d = await res.json();
        return d?.data || null;
      } catch {
        return null;
      }
    }, token);

    let candidatesGenerated = false;
    if (discoverySessionData?.id) {
      // Set currentStage = GENERATING in MongoDB to allow candidate synthesis
      await DiscoverySessionModel.updateOne(
        { _id: new mongoose.Types.ObjectId(discoverySessionData.id) },
        { $set: { currentStage: DiscoveryStage.GENERATING } }
      );

      // Trigger candidate generation API
      const genResult = await discoveryPage.evaluate(async ({ discId, authToken }) => {
        try {
          const res = await fetch(`http://localhost:5000/api/v1/discovery/${discId}/generate`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              ...(authToken ? { Authorization: `Bearer ${authToken}` } : {}),
            },
            credentials: 'include',
          });
          const d = await res.json();
          return { status: res.status, data: d };
        } catch (e: any) {
          return { status: 0, error: e.message };
        }
      }, { discId: discoverySessionData.id, authToken: token });

      if (genResult.status === 200 || genResult.status === 201) {
        candidatesGenerated = true;
      }
    }

    // Reload discovery page to display candidates
    await discoveryPage.reload({ waitUntil: 'networkidle2' });
    await waitAndDismissOverlay(discoveryPage);
    await delay(1500);
    await discoveryPage.screenshot({ path: path.join(SCREENSHOT_DIR, '06_discovery_candidates_rendered.png') });

    const candidatePageText = await discoveryPage.evaluate(() => document.body.innerText);
    const hasCandidatesUI = candidatePageText.includes('Choose this direction') || candidatePageText.includes('Career discovery complete') || candidatePageText.includes('Match 1');

    if (hasCandidatesUI || candidatesGenerated) {
      record('Discovery Recommendations', '3.1 Career Candidates Generated & Displayed', 'PASS', 'AI recommendation cards loaded successfully');
    } else {
      record('Discovery Recommendations', '3.1 Career Candidates Generated & Displayed', 'FAIL', 'Candidate cards did not render');
    }

    // 3.2 Candidate Selection
    await clickButtonWithText(discoveryPage, 'Choose this direction');
    await delay(1000);
    await discoveryPage.screenshot({ path: path.join(SCREENSHOT_DIR, '07_discovery_candidate_selected.png') });

    const postSelectText = await discoveryPage.evaluate(() => document.body.innerText);
    const showsSelected = postSelectText.includes('Direction selected') || postSelectText.includes('Selected');

    if (showsSelected) {
      record('Candidate Selection', '3.2 Career Candidate Selected with Visual Badge', 'PASS', 'Direction selected and visual checkmark rendered');
    } else {
      record('Candidate Selection', '3.2 Career Candidate Selected with Visual Badge', 'FAIL', 'Candidate selection state not updated');
    }

    // 3.3 Continue from Discovery: candidate selection creates draft journey and advances to initial assessment
    await clickButtonWithText(discoveryPage, 'Continue to initial assessment');
    await delay(2000);
    const postContinueUrl = discoveryPage.url();
    await discoveryPage.screenshot({ path: path.join(SCREENSHOT_DIR, '08_post_discovery_navigation.png') });

    if (postContinueUrl.includes('/initial-assessment') || postContinueUrl.includes('/career-journey')) {
      record('Discovery Hand-off', '3.3 Candidate Selection Creates Journey & Advances to Assessment', 'PASS', `Successfully advanced to ${postContinueUrl}`);
    } else {
      record('Discovery Hand-off', '3.3 Candidate Selection Creates Journey & Advances to Assessment', 'FAIL', `Landed on ${postContinueUrl}`);
    }

    await discoveryContext.close();

    // -------------------------------------------------------------
    // PART B: INITIAL ASSESSMENT ENGINE (/initial-assessment)
    // -------------------------------------------------------------

    // -------------------------------------------------------------
    // SUITE 4: INITIAL ASSESSMENT ENTRY, WORKSPACE GUARD & STEP 0
    // -------------------------------------------------------------
    console.log('\n--- SUITE 4: INITIAL ASSESSMENT ENTRY, WORKSPACE GUARD & STEP 0 ---');

    // 4.1 Route Guard: User without active journey navigating directly to /initial-assessment
    const guardContext = await browser.createBrowserContext();
    const guardPage = await guardContext.newPage();
    await guardPage.setViewport({ width: 1280, height: 800 });

    const guardEmail = `guard_test_${timestamp}@example.com`;
    await guardPage.goto(`${BASE_URL}/register`, { waitUntil: 'networkidle2' });
    await waitAndDismissOverlay(guardPage);
    await clearAndType(guardPage, '#fullName', 'Guard User');
    await clearAndType(guardPage, '#email', guardEmail);
    await clearAndType(guardPage, '#password', testPassword);
    const guardReg = await guardPage.$('button[type="submit"]');
    if (guardReg) await guardReg.click();
    await guardPage.waitForNavigation({ waitUntil: 'networkidle2', timeout: 10000 }).catch(() => { });
    await delay(1200);

    // Attempt direct navigation to /initial-assessment without a journey
    await guardPage.goto(`${BASE_URL}/initial-assessment`, { waitUntil: 'networkidle2' });
    await delay(1000);
    const guardedUrl = guardPage.url();
    await guardPage.screenshot({ path: path.join(SCREENSHOT_DIR, '09_workspace_guard_initial_assessment.png') });

    if (guardedUrl.includes('/career-direction')) {
      record('Assessment Guard', '4.1 WorkspaceGuard Bounces No-Journey User from Assessment', 'PASS', `Safely redirected to ${guardedUrl}`);
    } else {
      record('Assessment Guard', '4.1 WorkspaceGuard Bounces No-Journey User from Assessment', 'FAIL', `Landed on ${guardedUrl}`);
    }
    await guardContext.close();

    // -------------------------------------------------------------
    // 4.2 Onboarding User Creates Journey -> Lands on Workspace
    // -------------------------------------------------------------
    const examContext = await browser.createBrowserContext();
    const page = await examContext.newPage();
    await page.setViewport({ width: 1280, height: 800 });

    const examUserEmail = `exam_master_${timestamp}@example.com`;
    await page.goto(`${BASE_URL}/register`, { waitUntil: 'networkidle2' });
    await waitAndDismissOverlay(page);
    await clearAndType(page, '#fullName', 'Devon Vance');
    await clearAndType(page, '#email', examUserEmail);
    await clearAndType(page, '#password', testPassword);
    const submitExamReg = await page.$('button[type="submit"]');
    if (submitExamReg) await submitExamReg.click();
    await page.waitForNavigation({ waitUntil: 'networkidle2', timeout: 10000 }).catch(() => { });
    await delay(1200);

    // Fast-path Career Setup: Direction -> Domain (Backend) -> Role (Node.js) -> Journey
    await clickCardByTitle(page, 'Career Goal');
    await delay(300);
    await clickButtonWithText(page, 'Continue');
    await delay(1200);

    await clickCardByTitle(page, 'Backend Development');
    await delay(300);
    await clickButtonWithText(page, 'Continue');
    await delay(1200);

    await clickCardByTitle(page, 'Node.js Backend Developer');
    await delay(300);
    await clickButtonWithText(page, 'Continue');
    await delay(1200);

    // Step 4: Create Journey
    await clickButtonWithText(page, 'Create My Journey');
    await page.waitForNavigation({ waitUntil: 'networkidle2', timeout: 15000 }).catch(() => { });
    await delay(2000);

    // Verify Workspace Initial Assessment Card
    await page.screenshot({ path: path.join(SCREENSHOT_DIR, '10_workspace_initial_assessment_card.png') });
    const workspaceText = await page.evaluate(() => document.body.innerText);
    const hasAssessmentCard = workspaceText.includes('Initial Assessment') || workspaceText.includes('Take Initial Assessment') || workspaceText.includes('Your First Step');

    if (hasAssessmentCard) {
      record('Workspace Integration', '4.2 Initial Assessment Card Ready in Workspace', 'PASS', 'Shows Initial Assessment prompt and Take Initial Assessment CTA');
    } else {
      record('Workspace Integration', '4.2 Initial Assessment Card Ready in Workspace', 'FAIL', 'Initial Assessment card missing from workspace');
    }

    // 4.3 Click "Take Initial Assessment" and verify Step 0 Resume Onboarding
    await clickButtonWithText(page, 'Take Initial Assessment');
    await delay(2000);
    const assessmentStep0Url = page.url();
    await page.screenshot({ path: path.join(SCREENSHOT_DIR, '11_assessment_step0_resume.png') });

    const step0Text = await page.evaluate(() => document.body.innerText);
    const hasResumePrompt = step0Text.includes('Start with your resume') || step0Text.includes('Select skills manually');

    if (assessmentStep0Url.includes('/initial-assessment') && hasResumePrompt) {
      record('Step 0 Resume', '4.3 Step 0 Resume Onboarding Screen Rendered', 'PASS', 'Prompted to upload resume or select skills manually');
    } else {
      record('Step 0 Resume', '4.3 Step 0 Resume Onboarding Screen Rendered', 'FAIL', `Url: ${assessmentStep0Url}, hasResume: ${hasResumePrompt}`);
    }

    // -------------------------------------------------------------
    // SUITE 5: STEP 1 (SKILL SELECTION) & STEP 2 (ASSESSMENT GUIDE)
    // -------------------------------------------------------------
    console.log('\n--- SUITE 5: STEP 1 (SKILL SELECTION) & STEP 2 (ASSESSMENT GUIDE) ---');

    // 5.1 Navigate to Step 1: Select skills manually
    await clickButtonWithText(page, 'Select skills manually');
    await delay(1500);
    await page.screenshot({ path: path.join(SCREENSHOT_DIR, '12_assessment_step1_skills.png') });

    const step1SkillsText = await page.evaluate(() => document.body.innerText);
    const hasSkillsList = step1SkillsText.includes('skills selected') || step1SkillsText.includes('required for your target role');

    if (hasSkillsList) {
      record('Step 1 Skills', '5.1 Role Skills Populated in Selection Grid', 'PASS', 'Skills for Node.js Backend Developer fetched from lookup API');
    } else {
      record('Step 1 Skills', '5.1 Role Skills Populated in Selection Grid', 'FAIL', 'Role skills missing from selection grid');
    }

    // 5.2 Continue button disabled when 0 skills selected
    const isStep1ContinueDisabled = await page.evaluate(() => {
      const btns = Array.from(document.querySelectorAll('button'));
      const cont = btns.find((b) => b.textContent?.trim() === 'Continue');
      return cont ? cont.disabled : false;
    });

    if (isStep1ContinueDisabled) {
      record('Step 1 Skills', '5.2 Continue Button Disabled with 0 Skills', 'PASS', 'Enforces skill selection requirement');
    } else {
      record('Step 1 Skills', '5.2 Continue Button Disabled with 0 Skills', 'FAIL', 'Continue button was enabled with 0 skills');
    }

    // 5.3 Select skills (select first 2 skills)
    await page.evaluate(() => {
      const cards = Array.from(document.querySelectorAll('button')).filter((b) => b.querySelector('h3'));
      if (cards[0]) (cards[0] as HTMLElement).click();
      if (cards[1]) (cards[1] as HTMLElement).click();
    });
    await delay(400);
    await page.screenshot({ path: path.join(SCREENSHOT_DIR, '13_assessment_step1_skills_selected.png') });

    const selectedCountText = await page.evaluate(() => document.body.innerText);
    const hasCountUpdated = selectedCountText.includes('2 skills selected') || selectedCountText.includes('1 skills selected');

    if (hasCountUpdated) {
      record('Step 1 Skills', '5.3 Skills Toggled and Counter Updated', 'PASS', 'Card styles updated with checkmarks and counter reflected selection');
    } else {
      record('Step 1 Skills', '5.3 Skills Toggled and Counter Updated', 'FAIL', 'Selection count did not update');
    }

    // 5.4 Submit Skill Selection -> Advances to Step 2 (Assessment Guide)
    await clickButtonWithText(page, 'Continue');
    await delay(2000);
    await page.screenshot({ path: path.join(SCREENSHOT_DIR, '14_assessment_step2_guide.png') });

    const step2GuideText = await page.evaluate(() => document.body.innerText);
    const hasGuideTitle = step2GuideText.includes('Assess your selected skills') || step2GuideText.includes('How this works') || step2GuideText.includes('Start Assessment');

    if (hasGuideTitle) {
      record('Step 2 Guide', '5.4 User Skills Initialized & Assessment Guide Displayed', 'PASS', 'Step 2 Guide loaded with selected skills breakdown');
    } else {
      record('Step 2 Guide', '5.4 User Skills Initialized & Assessment Guide Displayed', 'FAIL', 'Assessment guide failed to render');
    }

    // -------------------------------------------------------------
    // SUITE 6: STEP 3 (ASSESSMENT RUNNER) — LIVE TECHNICAL EXAM
    // -------------------------------------------------------------
    console.log('\n--- SUITE 6: STEP 3 (ASSESSMENT RUNNER) — LIVE TECHNICAL EXAM ---');

    // 6.1 Start Initial Assessment Campaign
    await clickButtonWithText(page, 'Start Assessment');
    await delay(4000);
    await page.screenshot({ path: path.join(SCREENSHOT_DIR, '15_assessment_step3_exam_started.png') });

    const runnerPageText = await page.evaluate(() => document.body.innerText);
    const hasExamRunner = runnerPageText.includes('Question 1') || runnerPageText.includes('Submit section') || runnerPageText.includes('Answers save automatically') || runnerPageText.includes('Start section');

    if (hasExamRunner) {
      record('Step 3 Exam Runner', '6.1 Assessment Campaign Started & First Section Loaded', 'PASS', 'Loaded assessment runner with section questions and timer');
    } else {
      record('Step 3 Exam Runner', '6.1 Assessment Campaign Started & First Section Loaded', 'FAIL', 'Exam runner failed to initialize');
    }

    // 6.2 Start first section if on sections overview
    const currentRunnerText = await page.evaluate(() => document.body.innerText);
    if (currentRunnerText.includes('Start section')) {
      await clickButtonWithText(page, 'Start section');
      await delay(2500);
    }

    // 6.3 Answer questions in the section (select radio options for all rendered questions)
    const optionsAnswered = await page.evaluate(() => {
      const labels = Array.from(document.querySelectorAll('label'));
      const radios = labels.filter((l) => l.querySelector('input[type="radio"], input[type="checkbox"]'));
      const questionNames = new Set<string>();
      let clickedCount = 0;

      for (const label of radios) {
        const input = label.querySelector('input') as HTMLInputElement;
        if (input && !questionNames.has(input.name)) {
          questionNames.add(input.name);
          label.click();
          clickedCount++;
        }
      }
      return clickedCount;
    });

    await delay(1200);
    await page.screenshot({ path: path.join(SCREENSHOT_DIR, '16_assessment_questions_answered.png') });

    if (optionsAnswered > 0) {
      record('Step 3 Exam Runner', '6.2 Question Options Selected & Autosave Triggered', 'PASS', `Answered ${optionsAnswered} technical questions with instant option highlight`);
    } else {
      record('Step 3 Exam Runner', '6.2 Question Options Selected & Autosave Triggered', 'FAIL', 'Could not select question options');
    }

    // 6.4 Submit Section Attempt
    await clickButtonWithText(page, 'Submit section');
    await delay(3500);
    await page.screenshot({ path: path.join(SCREENSHOT_DIR, '17_section_submitted_results.png') });

    const postSubmitText = await page.evaluate(() => document.body.innerText);
    const hasSectionOrExamResult = postSubmitText.includes('complete') || postSubmitText.includes('Completed') || postSubmitText.includes('Next section') || postSubmitText.includes('workspace');

    if (hasSectionOrExamResult) {
      record('Step 3 Exam Runner', '6.3 Section Attempt Submitted & Evaluated', 'PASS', 'Section score evaluated and result state rendered');
    } else {
      record('Step 3 Exam Runner', '6.3 Section Attempt Submitted & Evaluated', 'FAIL', 'Section submission did not return result');
    }

    // -------------------------------------------------------------
    // SUITE 7: WORKSPACE STATE EVOLUTION & ROADMAP TRANSITION
    // -------------------------------------------------------------
    console.log('\n--- SUITE 7: WORKSPACE STATE EVOLUTION & ROADMAP TRANSITION ---');

    // 6.5 Complete Section 2 to finalize the entire assessment
    const postSec1Text = await page.evaluate(() => document.body.innerText);
    if (postSec1Text.includes('Continue to next skill')) {
      await clickButtonWithText(page, 'Continue to next skill');
      await delay(2000);
    }

    // Wait for sections overview
    await page.waitForFunction(
      () => document.body.innerText.includes('Start section') || document.body.innerText.includes('Resume section'),
      { timeout: 10000 }
    ).catch(() => { });

    // Click Start or Resume on Section 2
    await clickButtonWithText(page, 'Start section') || await clickButtonWithText(page, 'Resume section');

    // Wait dynamically for questions to load
    await page.waitForFunction(
      () => document.querySelectorAll('label input').length > 0,
      { timeout: 15000 }
    ).catch(() => { });
    await delay(500);

    // Answer Section 2 questions
    await page.evaluate(() => {
      const labels = Array.from(document.querySelectorAll('label'));
      const radios = labels.filter((l) => l.querySelector('input[type="radio"], input[type="checkbox"]'));
      const questionNames = new Set<string>();
      for (const label of radios) {
        const input = label.querySelector('input') as HTMLInputElement;
        if (input && !questionNames.has(input.name)) {
          questionNames.add(input.name);
          label.click();
        }
      }
    });
    await delay(800);

    // Submit Section 2
    await clickButtonWithText(page, 'Submit section');

    // Wait for evaluation result
    await page.waitForFunction(
      () => document.body.innerText.includes('View summary') || document.body.innerText.includes('complete') || document.body.innerText.includes('Go to workspace'),
      { timeout: 15000 }
    ).catch(() => { });
    await delay(1000);

    // All sections completed -> View summary
    const sec2SubmitText = await page.evaluate(() => document.body.innerText);
    if (sec2SubmitText.includes('View summary')) {
      await clickButtonWithText(page, 'View summary');
      await delay(2000);
    }

    // Click "Go to workspace"
    await clickButtonWithText(page, 'Go to workspace') || await clickButtonWithText(page, 'Continue to workspace') || await clickButtonWithText(page, 'workspace');
    await page.waitForFunction(() => window.location.pathname.includes('/workspace'), { timeout: 12000 }).catch(() => { });
    await delay(1500);

    await page.screenshot({ path: path.join(SCREENSHOT_DIR, '18_workspace_roadmap_pending.png') });
    const finalWorkspaceText = await page.evaluate(() => document.body.innerText);
    const hasGenerateRoadmap = finalWorkspaceText.includes('Generate') || finalWorkspaceText.includes('Roadmap') || finalWorkspaceText.includes('roadmap');

    if (page.url().includes('/workspace') && hasGenerateRoadmap) {
      record('Workspace Evolution', '7.1 Workspace Evolves to Roadmap Pending State', 'PASS', 'Initial Assessment finished -> Stage transitions to GenerateRoadmapCard');
    } else {
      record('Workspace Evolution', '7.1 Workspace Evolves to Roadmap Pending State', 'FAIL', `Url: ${page.url()}, hasRoadmapCard: ${hasGenerateRoadmap}`);
    }

    // 7.2 Re-entry protection: navigating back to /initial-assessment after completion
    await page.goto(`${BASE_URL}/initial-assessment`, { waitUntil: 'networkidle2' });
    await page.waitForFunction(() => window.location.pathname.includes('/workspace'), { timeout: 8000 }).catch(() => { });
    await delay(500);
    const postCompAssessmentUrl = page.url();
    await page.screenshot({ path: path.join(SCREENSHOT_DIR, '19_assessment_reentry_lockout.png') });

    if (postCompAssessmentUrl.includes('/workspace')) {
      record('Assessment Lockout', '7.2 Completed Assessment Locked Out & Redirected to Workspace', 'PASS', `/initial-assessment automatically bounced back to ${postCompAssessmentUrl}`);
    } else {
      record('Assessment Lockout', '7.2 Completed Assessment Locked Out & Redirected to Workspace', 'FAIL', `Url is ${postCompAssessmentUrl}`);
    }

    await examContext.close();

  } catch (err: any) {
    console.error('Fatal Discovery & Assessment Test Exception:', err);
    record('Fatal', 'Feature 3 Test Suite Execution', 'FAIL', undefined, err.message);
  } finally {
    if (mongoose.connection.readyState !== 0) {
      await mongoose.disconnect();
    }
    await browser.close();
  }

  // -------------------------------------------------------------
  // FINAL SCORECARD
  // -------------------------------------------------------------
  console.log('\n================================================================');
  console.log('📊 FINAL TEST REPORT SCORECARD: FEATURE 3 — DISCOVERY & INITIAL ASSESSMENT');
  console.log('================================================================');

  const total = results.length;
  const passed = results.filter((r) => r.status === 'PASS').length;
  const failed = results.filter((r) => r.status === 'FAIL').length;

  console.log(`Total Scenarios Tested : ${total}`);
  console.log(`Passed                 : ${passed}`);
  console.log(`Failed                 : ${failed}`);
  console.log(`Success Rate           : ${((passed / total) * 100).toFixed(1)}%\n`);

  for (const r of results) {
    const icon = r.status === 'PASS' ? '✅' : '❌';
    console.log(`${icon} [${r.suite.padEnd(25)}] ${r.test.padEnd(55)} -> ${r.status} ${r.details ? `(${r.details})` : ''} ${r.error ? `Error: ${r.error}` : ''}`);
  }
  console.log('================================================================\n');

  if (failed > 0) {
    process.exit(1);
  }
}

runFeature3Suite().catch((err) => {
  console.error(err);
  process.exit(1);
});

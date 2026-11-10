import puppeteer, { Browser, Page } from 'puppeteer-core';
import path from 'path';
import fs from 'fs';

const EDGE_PATH = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
const BASE_URL = 'http://localhost:5174';
const SCREENSHOT_DIR = 'C:\\careersaathi\\docs\\test-reports\\career-setup';

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
  await page.waitForFunction(() => !document.querySelector('.z-\\[99999\\]'), { timeout: 3500 }).catch(() => {});
  await delay(200);
}

async function clickButtonWithText(page: Page, text: string): Promise<boolean> {
  return page.evaluate((targetText) => {
    const buttons = Array.from(document.querySelectorAll('button'));
    const lower = targetText.trim().toLowerCase();
    
    // 1. Exact match first
    let btn = buttons.find(b => b.textContent?.trim().toLowerCase() === lower);
    
    // 2. Exact word boundary match
    if (!btn) {
      btn = buttons.find(b => {
        const words = b.textContent?.trim().toLowerCase().split(/\s+/) || [];
        return words.includes(lower);
      });
    }

    // 3. Fallback includes only if target text is long enough
    if (!btn && lower.length > 5) {
      btn = buttons.find(b => b.textContent?.toLowerCase().includes(lower));
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
    const cards = Array.from(document.querySelectorAll('button[aria-pressed]'));
    const card = cards.find(c => c.textContent?.toLowerCase().includes(targetTitle.toLowerCase()));
    if (card) {
      (card as HTMLElement).click();
      return true;
    }
    return false;
  }, titleText);
}

async function clearAndType(page: Page, selector: string, value: string) {
  await page.waitForSelector(selector, { timeout: 5000 });
  await page.click(selector, { count: 3 });
  await page.keyboard.press('Backspace');
  await page.$eval(selector, el => ((el as HTMLInputElement).value = ''));
  await page.type(selector, value, { delay: 25 });
}

async function runCareerSetupSuite() {
  console.log('================================================================');
  console.log('🚀 STARTING CAREERSAATHI E2E TEST: CAREER SETUP & MULTI-JOURNEY FLOW');
  console.log(`Target Frontend: ${BASE_URL}`);
  console.log(`Screenshots Directory: ${SCREENSHOT_DIR}`);
  console.log('================================================================\n');

  const browser = await createBrowser();
  const timestamp = Date.now();
  const testEmail = `journey_test_${timestamp}@example.com`;
  const testPassword = 'SecurePass123!';
  const testFullName = 'Jordan Rivera';

  try {
    // -------------------------------------------------------------
    // SUITE 1: ROUTE GUARDS & ACCESS CONTROL
    // -------------------------------------------------------------
    console.log('\n--- SUITE 1: ROUTE GUARDS & ACCESS CONTROL ---');

    // 1.1 Unauthenticated context attempting direct navigation to setup routes
    const unauthContext = await browser.createBrowserContext();
    const unauthPage = await unauthContext.newPage();
    await unauthPage.setViewport({ width: 1280, height: 800 });

    const setupRoutes = ['/career-direction', '/career-domain', '/career-role', '/career-journey'];
    let allUnauthRedirected = true;

    for (const route of setupRoutes) {
      await unauthPage.goto(`${BASE_URL}${route}`, { waitUntil: 'networkidle2' });
      await waitAndDismissOverlay(unauthPage);
      await delay(400);
      const url = unauthPage.url();
      if (!url.includes('/login')) {
        allUnauthRedirected = false;
        break;
      }
    }
    await unauthPage.screenshot({ path: path.join(SCREENSHOT_DIR, '01_unauth_route_guard.png') });

    if (allUnauthRedirected) {
      record('Route Guard', '1.1 Unauthenticated Access to Setup Routes Blocked', 'PASS', 'Redirected to /login for all 4 setup routes');
    } else {
      record('Route Guard', '1.1 Unauthenticated Access to Setup Routes Blocked', 'FAIL', 'Allowed unauthenticated access');
    }
    await unauthContext.close();

    // 1.2 User with ACTIVE journey locked out of onboarding (OnboardingGuard)
    const activeUserContext = await browser.createBrowserContext();
    const activePage = await activeUserContext.newPage();
    await activePage.setViewport({ width: 1280, height: 800 });

    // Login as test2@gmail.com (already has active journey)
    await activePage.goto(`${BASE_URL}/login`, { waitUntil: 'networkidle2' });
    await waitAndDismissOverlay(activePage);
    await clearAndType(activePage, '#email', 'test2@gmail.com');
    await clearAndType(activePage, '#password', 'Password123!');
    const submitLogin = await activePage.$('button[type="submit"]');
    if (submitLogin) await submitLogin.click();
    await activePage.waitForNavigation({ waitUntil: 'networkidle2', timeout: 10000 }).catch(() => {});
    await delay(1200);

    // Attempt to visit /career-direction
    await activePage.goto(`${BASE_URL}/career-direction`, { waitUntil: 'networkidle2' });
    await activePage.waitForFunction(() => window.location.pathname.includes('/workspace'), { timeout: 8000 }).catch(() => {});
    await delay(500);
    const activeAttemptUrl = activePage.url();
    await activePage.screenshot({ path: path.join(SCREENSHOT_DIR, '02_active_user_onboarding_lockout.png') });

    if (activeAttemptUrl.includes('/workspace')) {
      record('Route Guard', '1.2 Active Journey User Locked Out of Onboarding', 'PASS', `/career-direction bounced to ${activeAttemptUrl}`);
    } else {
      record('Route Guard', '1.2 Active Journey User Locked Out of Onboarding', 'FAIL', `Active user stayed on: ${activeAttemptUrl}`);
    }
    await activeUserContext.close();

    // -------------------------------------------------------------
    // SUITE 2: FRESH USER ONBOARDING INITIALIZATION & STEP HOPPING GUARDS
    // -------------------------------------------------------------
    console.log('\n--- SUITE 2: FRESH USER ONBOARDING INITIALIZATION & STEP HOPPING GUARDS ---');

    const flowContext = await browser.createBrowserContext();
    const page = await flowContext.newPage();
    await page.setViewport({ width: 1280, height: 800 });

    // 2.1 Register brand new user
    await page.goto(`${BASE_URL}/register`, { waitUntil: 'networkidle2' });
    await waitAndDismissOverlay(page);
    await clearAndType(page, '#fullName', testFullName);
    await clearAndType(page, '#email', testEmail);
    await clearAndType(page, '#password', testPassword);
    const submitReg = await page.$('button[type="submit"]');
    if (submitReg) await submitReg.click();

    await page.waitForNavigation({ waitUntil: 'networkidle2', timeout: 10000 }).catch(() => {});
    await delay(1500);
    const initialOnboardingUrl = page.url();
    await page.screenshot({ path: path.join(SCREENSHOT_DIR, '03_fresh_user_career_direction.png') });

    if (initialOnboardingUrl.includes('/career-direction')) {
      record('Onboarding Entry', '2.1 New User Automatic Redirection to Step 1', 'PASS', `Landed on ${initialOnboardingUrl}`);
    } else {
      record('Onboarding Entry', '2.1 New User Automatic Redirection to Step 1', 'FAIL', `Landed on ${initialOnboardingUrl}`);
    }

    // 2.2 Step Hopping Guard: direct jump to /career-role before choosing a domain
    await page.goto(`${BASE_URL}/career-role`, { waitUntil: 'networkidle2' });
    await delay(1000);
    const jumpedRoleUrl = page.url();
    await page.screenshot({ path: path.join(SCREENSHOT_DIR, '04_step_hop_role_guard.png') });

    if (jumpedRoleUrl.includes('/career-domain')) {
      record('Step Guard', '2.2 Premature Role Step Jump Bounced to Domain', 'PASS', `/career-role safely bounced back to ${jumpedRoleUrl}`);
    } else {
      record('Step Guard', '2.2 Premature Role Step Jump Bounced to Domain', 'FAIL', `Url is: ${jumpedRoleUrl}`);
    }

    // 2.3 Step Hopping Guard: direct jump to /career-journey before choosing domain & role
    await page.goto(`${BASE_URL}/career-journey`, { waitUntil: 'networkidle2' });
    await delay(1000);
    const jumpedJourneyUrl = page.url();
    await page.screenshot({ path: path.join(SCREENSHOT_DIR, '05_step_hop_journey_guard.png') });

    if (jumpedJourneyUrl.includes('/career-domain') || jumpedJourneyUrl.includes('/career-role')) {
      record('Step Guard', '2.3 Premature Journey Step Jump Bounced Back', 'PASS', `/career-journey safely bounced back to ${jumpedJourneyUrl}`);
    } else {
      record('Step Guard', '2.3 Premature Journey Step Jump Bounced Back', 'FAIL', `Url is: ${jumpedJourneyUrl}`);
    }

    // -------------------------------------------------------------
    // SUITE 3: STEP 1 — CAREER DIRECTION CHOICE (/career-direction)
    // -------------------------------------------------------------
    console.log('\n--- SUITE 3: STEP 1 — CAREER DIRECTION CHOICE ---');

    await page.goto(`${BASE_URL}/career-direction`, { waitUntil: 'networkidle2' });
    await waitAndDismissOverlay(page);
    await delay(800);
    await page.screenshot({ path: path.join(SCREENSHOT_DIR, '06_step1_direction_page.png') });

    const step1Text = await page.evaluate(() => document.body.innerText);
    const hasDirectionCards = step1Text.includes('I Have a Career Goal') && step1Text.includes('Exploring My Options');
    if (hasDirectionCards) {
      record('Step 1', '3.1 Career Direction Options Display', 'PASS', 'Goal and Exploring cards rendered with Step 1 of 4');
    } else {
      record('Step 1', '3.1 Career Direction Options Display', 'FAIL', 'Direction options missing');
    }

    // 3.2 Continue button initially disabled
    const isStep1ContinueDisabled = await page.evaluate(() => {
      const buttons = Array.from(document.querySelectorAll('button'));
      const nextBtn = buttons.find(b => b.textContent?.trim().includes('Continue'));
      return nextBtn ? nextBtn.disabled : false;
    });

    if (isStep1ContinueDisabled) {
      record('Step 1', '3.2 Continue Button Initially Disabled', 'PASS', 'Cannot proceed without selecting a direction');
    } else {
      record('Step 1', '3.2 Continue Button Initially Disabled', 'FAIL', 'Continue button was enabled without selection');
    }

    // 3.3 Test "I'm Exploring My Options" routing to /discovery
    await clickCardByTitle(page, 'Exploring');
    await delay(300);
    await clickButtonWithText(page, 'Continue');
    await delay(1200);
    const discoveryUrl = page.url();
    await page.screenshot({ path: path.join(SCREENSHOT_DIR, '07_step1_discovery_navigation.png') });

    if (discoveryUrl.includes('/discovery')) {
      record('Step 1', '3.3 Exploring Option Routes to Discovery', 'PASS', `Navigated to ${discoveryUrl}`);
    } else {
      record('Step 1', '3.3 Exploring Option Routes to Discovery', 'FAIL', `Navigated to ${discoveryUrl}`);
    }

    // 3.4 Select "I Have a Career Goal" and proceed to Step 2
    await page.goto(`${BASE_URL}/career-direction`, { waitUntil: 'networkidle2' });
    await waitAndDismissOverlay(page);
    await delay(500);

    await clickCardByTitle(page, 'Career Goal');
    await delay(300);
    await page.screenshot({ path: path.join(SCREENSHOT_DIR, '08_step1_goal_selected.png') });

    await clickButtonWithText(page, 'Continue');
    await delay(1200);
    const step2Url = page.url();
    await page.screenshot({ path: path.join(SCREENSHOT_DIR, '09_step2_domain_page.png') });

    if (step2Url.includes('/career-domain')) {
      record('Step 1', '3.4 Goal Option Navigates to Career Domain', 'PASS', `Successfully advanced to ${step2Url}`);
    } else {
      record('Step 1', '3.4 Goal Option Navigates to Career Domain', 'FAIL', `URL is ${step2Url}`);
    }

    // -------------------------------------------------------------
    // SUITE 4: STEP 2 — CAREER DOMAIN SELECTION (/career-domain)
    // -------------------------------------------------------------
    console.log('\n--- SUITE 4: STEP 2 — CAREER DOMAIN SELECTION ---');

    const domainPageText = await page.evaluate(() => document.body.innerText);
    const hasDomains = domainPageText.includes('Backend Development') && domainPageText.includes('Frontend Development');
    if (hasDomains) {
      record('Step 2', '4.1 Career Domains API Fetch & Render', 'PASS', 'Backend & Frontend domain cards loaded from API');
    } else {
      record('Step 2', '4.1 Career Domains API Fetch & Render', 'FAIL', 'Domain cards not rendered');
    }

    // 4.2 Continue button initially disabled
    const isDomainContinueDisabled = await page.evaluate(() => {
      const buttons = Array.from(document.querySelectorAll('button'));
      const nextBtn = buttons.find(b => b.textContent?.trim().includes('Continue'));
      return nextBtn ? nextBtn.disabled : false;
    });

    if (isDomainContinueDisabled) {
      record('Step 2', '4.2 Continue Button Initially Disabled on Step 2', 'PASS', 'Requires domain selection');
    } else {
      record('Step 2', '4.2 Continue Button Initially Disabled on Step 2', 'FAIL', 'Continue button was enabled without selection');
    }

    // 4.3 Test Back Button returns to Step 1
    await clickButtonWithText(page, 'Back');
    await delay(600);
    const backToStep1Url = page.url();
    if (backToStep1Url.includes('/career-direction')) {
      record('Step 2', '4.3 Back Button Navigation to Step 1', 'PASS', 'Returned cleanly to /career-direction');
    } else {
      record('Step 2', '4.3 Back Button Navigation to Step 1', 'FAIL', `URL is ${backToStep1Url}`);
    }

    // Re-advance to Step 2
    await clickButtonWithText(page, 'Continue');
    await delay(800);

    // 4.4 Select "Backend Development" domain card
    await clickCardByTitle(page, 'Backend Development');
    await delay(400);
    await page.screenshot({ path: path.join(SCREENSHOT_DIR, '10_step2_backend_selected.png') });

    const isDomainSelected = await page.evaluate(() => {
      const cards = Array.from(document.querySelectorAll('button[aria-pressed]'));
      const backendCard = cards.find(c => c.textContent?.includes('Backend Development'));
      return backendCard ? backendCard.getAttribute('aria-pressed') === 'true' : false;
    });

    if (isDomainSelected) {
      record('Step 2', '4.4 Domain Card Selection State', 'PASS', 'Backend Development card selected (aria-pressed=true)');
    } else {
      record('Step 2', '4.4 Domain Card Selection State', 'FAIL', 'Domain card selection state failed');
    }

    // 4.5 Advance to Step 3 (/career-role)
    await clickButtonWithText(page, 'Continue');
    await delay(1200);
    const step3Url = page.url();
    await page.screenshot({ path: path.join(SCREENSHOT_DIR, '11_step3_role_page.png') });

    if (step3Url.includes('/career-role')) {
      record('Step 2', '4.5 Progression to Career Role Step', 'PASS', `Advanced to ${step3Url}`);
    } else {
      record('Step 2', '4.5 Progression to Career Role Step', 'FAIL', `URL is ${step3Url}`);
    }

    // -------------------------------------------------------------
    // SUITE 5: STEP 3 — CAREER ROLE SELECTION (/career-role)
    // -------------------------------------------------------------
    console.log('\n--- SUITE 5: STEP 3 — CAREER ROLE SELECTION ---');

    const rolePageText = await page.evaluate(() => document.body.innerText);
    const hasNodeRole = rolePageText.includes('Node.js Backend Developer');
    if (hasNodeRole) {
      record('Step 3', '5.1 Role Dynamic Fetch for Domain', 'PASS', 'Loaded Node.js Backend Developer for Backend domain');
    } else {
      record('Step 3', '5.1 Role Dynamic Fetch for Domain', 'FAIL', 'Node.js Backend Developer not found');
    }

    // 5.2 Test Domain Switching & Dynamic Role Reloading
    await clickButtonWithText(page, 'Back');
    await delay(800);
    // Select Frontend Development instead
    await clickCardByTitle(page, 'Frontend Development');
    await delay(300);
    await clickButtonWithText(page, 'Continue');
    await delay(1200);

    const frontendRoleText = await page.evaluate(() => document.body.innerText);
    const hasReactRole = frontendRoleText.includes('React Frontend Developer');
    await page.screenshot({ path: path.join(SCREENSHOT_DIR, '12_step3_frontend_role_reload.png') });

    if (hasReactRole) {
      record('Step 3', '5.2 Dynamic Role Reload on Domain Switch', 'PASS', 'Successfully reloaded React Frontend Developer for Frontend domain');
    } else {
      record('Step 3', '5.2 Dynamic Role Reload on Domain Switch', 'FAIL', 'Dynamic role reload failed');
    }

    // Switch back to Backend Development for final journey creation
    await clickButtonWithText(page, 'Back');
    await delay(800);
    await clickCardByTitle(page, 'Backend Development');
    await delay(300);
    await clickButtonWithText(page, 'Continue');
    await delay(1200);

    // 5.3 Select Node.js Backend Developer role
    await clickCardByTitle(page, 'Node.js Backend Developer');
    await delay(400);
    await page.screenshot({ path: path.join(SCREENSHOT_DIR, '13_step3_role_selected.png') });

    const isRoleSelected = await page.evaluate(() => {
      const cards = Array.from(document.querySelectorAll('button[aria-pressed]'));
      const roleCard = cards.find(c => c.textContent?.includes('Node.js Backend Developer'));
      return roleCard ? roleCard.getAttribute('aria-pressed') === 'true' : false;
    });

    if (isRoleSelected) {
      record('Step 3', '5.3 Role Card Selection State', 'PASS', 'Node.js Backend Developer card selected');
    } else {
      record('Step 3', '5.3 Role Card Selection State', 'FAIL', 'Role selection failed');
    }

    // 5.4 Advance to Step 4 (/career-journey)
    await clickButtonWithText(page, 'Continue');
    await delay(1200);
    const step4Url = page.url();
    await page.screenshot({ path: path.join(SCREENSHOT_DIR, '14_step4_journey_form.png') });

    if (step4Url.includes('/career-journey')) {
      record('Step 3', '5.4 Progression to Step 4 Journey Config', 'PASS', `Advanced to ${step4Url}`);
    } else {
      record('Step 3', '5.4 Progression to Step 4 Journey Config', 'FAIL', `URL is ${step4Url}`);
    }

    // -------------------------------------------------------------
    // SUITE 6: STEP 4 — CAREER JOURNEY PREFERENCES & CREATION
    // -------------------------------------------------------------
    console.log('\n--- SUITE 6: STEP 4 — CAREER JOURNEY PREFERENCES & CREATION ---');

    // 6.1 Check Form Elements Render
    const hasCompanyInput = await page.$('#targetCompany');
    const hasDurationSelect = await page.$('#targetDurationMonths');
    const hasStudyHoursSelect = await page.$('#dailyStudyHours');
    const hasLanguageSelect = await page.$('#preferredLanguage');

    if (hasCompanyInput && hasDurationSelect && hasStudyHoursSelect && hasLanguageSelect) {
      record('Step 4', '6.1 Journey Preferences Form Fields Render', 'PASS', 'All inputs and dropdown selects rendered properly');
    } else {
      record('Step 4', '6.1 Journey Preferences Form Fields Render', 'FAIL', 'Missing form fields');
    }

    // 6.2 Check Default Values (6 Months, 2 Hours, English)
    const durationVal = await page.$eval('#targetDurationMonths', el => (el as HTMLSelectElement).value);
    const studyHoursVal = await page.$eval('#dailyStudyHours', el => (el as HTMLSelectElement).value);
    const languageVal = await page.$eval('#preferredLanguage', el => (el as HTMLSelectElement).value);

    if (durationVal === '6' && studyHoursVal === '2' && languageVal === 'english') {
      record('Step 4', '6.2 Default Preference Values Verification', 'PASS', `Defaults verified: ${durationVal}m duration, ${studyHoursVal}h/day, ${languageVal}`);
    } else {
      record('Step 4', '6.2 Default Preference Values Verification', 'FAIL', `Got: duration=${durationVal}, hours=${studyHoursVal}, lang=${languageVal}`);
    }

    // 6.3 Customize preferences
    await clearAndType(page, '#targetCompany', 'Google Cloud Platform');
    await page.select('#targetDurationMonths', '9');
    await page.select('#dailyStudyHours', '3');
    await page.select('#preferredLanguage', 'english');
    await delay(300);
    await page.screenshot({ path: path.join(SCREENSHOT_DIR, '15_step4_preferences_filled.png') });

    // 6.4 Submit Form ("Create My Journey")
    const createBtnClicked = await clickButtonWithText(page, 'Create My Journey');
    if (!createBtnClicked) {
      // Fallback submit
      const submitBtn = await page.$('button[type="submit"]');
      if (submitBtn) await submitBtn.click();
    }

    await page.waitForNavigation({ waitUntil: 'networkidle2', timeout: 15000 }).catch(() => {});
    await delay(2000);
    const postCreationUrl = page.url();
    await page.screenshot({ path: path.join(SCREENSHOT_DIR, '16_workspace_after_journey_creation.png') });

    if (postCreationUrl.includes('/workspace')) {
      record('Step 4', '6.3 Journey Creation & Navigation to Workspace', 'PASS', `Successfully created journey and landed on ${postCreationUrl}`);
    } else {
      record('Step 4', '6.3 Journey Creation & Navigation to Workspace', 'FAIL', `Failed to reach /workspace, URL is ${postCreationUrl}`);
    }

    // 6.5 Verify Workspace Initial State and Selected Role Display
    const workspaceBody = await page.evaluate(() => document.body.innerText);
    const showsSelectedRole = workspaceBody.includes('Node.js Backend Developer') || workspaceBody.includes('Backend');
    const showsInitialAssessmentPrompt = workspaceBody.includes('Initial Assessment') || workspaceBody.includes('baseline') || workspaceBody.includes('Start Assessment');

    if (showsSelectedRole && showsInitialAssessmentPrompt) {
      record('Step 4', '6.4 Workspace Role & Initial Assessment Card', 'PASS', 'Target role displayed and initial assessment card ready');
    } else {
      record('Step 4', '6.4 Workspace Role & Initial Assessment Card', 'FAIL', `showsRole: ${showsSelectedRole}, showsAssessment: ${showsInitialAssessmentPrompt}`);
    }

    // -------------------------------------------------------------
    // SUITE 7: POST-ONBOARDING LOCKOUT & MULTI-JOURNEY PREVENTIONS
    // -------------------------------------------------------------
    console.log('\n--- SUITE 7: POST-ONBOARDING LOCKOUT & MULTI-JOURNEY PREVENTIONS ---');

    // 7.1 Try to revisit setup routes while authenticated with newly created journey
    let postOnboardingBlocked = true;
    for (const route of ['/career-direction', '/career-domain', '/career-role', '/career-journey']) {
      await page.goto(`${BASE_URL}${route}`, { waitUntil: 'networkidle2' });
      await page.waitForFunction(() => window.location.pathname.includes('/workspace'), { timeout: 6000 }).catch(() => {});
      await delay(400);
      if (!page.url().includes('/workspace')) {
        postOnboardingBlocked = false;
        break;
      }
    }
    await page.screenshot({ path: path.join(SCREENSHOT_DIR, '17_post_onboarding_lockout.png') });

    if (postOnboardingBlocked) {
      record('Multi-Journey Lockout', '7.1 OnboardingGuard Locks Out Active Journey User', 'PASS', 'All setup routes bounced back to /workspace');
    } else {
      record('Multi-Journey Lockout', '7.1 OnboardingGuard Locks Out Active Journey User', 'FAIL', 'User allowed to re-enter setup pages');
    }

    // 7.2 Duplicate API Creation Prevention (POST /api/v1/career-journeys while active)
    const conflictResult = await page.evaluate(async () => {
      try {
        const refRes = await fetch('http://localhost:5000/api/v1/auth/refresh', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'include',
        });
        const refData = await refRes.json();
        const token = refData?.data?.accessToken;

        const res = await fetch('http://localhost:5000/api/v1/career-journeys', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
          },
          credentials: 'include',
          body: JSON.stringify({
            domainId: '6a5a17cb06b3c2d9cf740c2c',
            roleId: '6a5a1a2106b3c2d9cf740ca4',
            targetDurationMonths: 6,
            dailyStudyHours: 2,
            preferredLanguage: 'english',
          }),
        });
        const data = await res.json();
        return { status: res.status, message: data.message };
      } catch (err: any) {
        return { status: 0, message: err.message };
      }
    });

    if (conflictResult.status === 409 && conflictResult.message?.includes('already exists')) {
      record('Multi-Journey Lockout', '7.2 Backend 409 Conflict for Duplicate Journey', 'PASS', `HTTP 409 returned: "${conflictResult.message}"`);
    } else {
      record('Multi-Journey Lockout', '7.2 Backend 409 Conflict for Duplicate Journey', 'FAIL', `Expected 409, got ${conflictResult.status}: ${conflictResult.message}`);
    }

    // 7.3 Workspace persistence across page reload
    await page.reload({ waitUntil: 'networkidle2' });
    await waitAndDismissOverlay(page);
    await delay(1500);
    await page.screenshot({ path: path.join(SCREENSHOT_DIR, '18_workspace_retained_after_reload.png') });

    const postReloadUrl = page.url();
    const postReloadBody = await page.evaluate(() => document.body.innerText);
    const retainsWorkspace = postReloadUrl.includes('/workspace') && postReloadBody.includes('Node.js Backend Developer');

    if (retainsWorkspace) {
      record('Persistence', '7.3 Workspace Retained Cleanly on Reload', 'PASS', 'User session and journey workspace fully preserved');
    } else {
      record('Persistence', '7.3 Workspace Retained Cleanly on Reload', 'FAIL', `Reload url: ${postReloadUrl}`);
    }

    await flowContext.close();

  } catch (err: any) {
    console.error('Fatal Career Setup Test Exception:', err);
    record('Fatal', 'Career Setup Suite Execution', 'FAIL', undefined, err.message);
  } finally {
    await browser.close();
  }

  // -------------------------------------------------------------
  // TEST REPORT SUMMARY
  // -------------------------------------------------------------
  console.log('\n================================================================');
  console.log('📊 FINAL TEST REPORT SCORECARD: CAREER SETUP & MULTI-JOURNEY FLOW');
  console.log('================================================================');
  
  const total = results.length;
  const passed = results.filter(r => r.status === 'PASS').length;
  const failed = results.filter(r => r.status === 'FAIL').length;

  console.log(`Total Scenarios Tested : ${total}`);
  console.log(`Passed                 : ${passed}`);
  console.log(`Failed                 : ${failed}`);
  console.log(`Success Rate           : ${((passed / total) * 100).toFixed(1)}%\n`);

  for (const r of results) {
    const icon = r.status === 'PASS' ? '✅' : '❌';
    console.log(`${icon} [${r.suite.padEnd(20)}] ${r.test.padEnd(50)} -> ${r.status} ${r.details ? `(${r.details})` : ''} ${r.error ? `Error: ${r.error}` : ''}`);
  }
  console.log('================================================================\n');

  if (failed > 0) {
    process.exit(1);
  }
}

runCareerSetupSuite().catch((err) => {
  console.error(err);
  process.exit(1);
});

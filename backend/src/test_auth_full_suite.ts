import puppeteer, { Browser, Page } from 'puppeteer-core';
import path from 'path';
import fs from 'fs';

const EDGE_PATH = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
const BASE_URL = 'http://localhost:5174';
const SCREENSHOT_DIR = 'C:\\careersaathi\\docs\\test-reports\\auth';

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

async function clearAndType(page: Page, selector: string, value: string) {
  await page.waitForSelector(selector, { timeout: 5000 });
  await page.click(selector, { count: 3 });
  await page.keyboard.press('Backspace');
  await page.$eval(selector, el => ((el as HTMLInputElement).value = ''));
  await page.type(selector, value, { delay: 25 });
}

async function runAuthTestSuite() {
  console.log('================================================================');
  console.log('🚀 STARTING CAREERSAATHI E2E TEST: AUTHENTICATION, IDENTITY & SECURITY');
  console.log(`Target Frontend: ${BASE_URL}`);
  console.log(`Screenshots Directory: ${SCREENSHOT_DIR}`);
  console.log('================================================================\n');

  const browser = await createBrowser();

  const timestamp = Date.now();
  const testEmail = `e2e_user_${timestamp}@example.com`;
  const testPassword = 'SecurePass123!';
  const testFullName = 'Alex Morgan';

  try {
    // -------------------------------------------------------------
    // SUITE 1: REGISTRATION FLOW & EDGE CASES
    // -------------------------------------------------------------
    console.log('\n--- SUITE 1: REGISTRATION FLOW & EDGE CASES ---');
    
    // Dedicated clean context for registration
    const regContext = await browser.createBrowserContext();
    const regPage = await regContext.newPage();
    await regPage.setViewport({ width: 1280, height: 800 });

    // 1.1 Load /register
    await regPage.goto(`${BASE_URL}/register`, { waitUntil: 'networkidle2' });
    await waitAndDismissOverlay(regPage);
    await regPage.screenshot({ path: path.join(SCREENSHOT_DIR, '01_register_page.png') });
    
    const pageTitle = await regPage.title();
    const bodySnippet = await regPage.evaluate(() => document.body.innerText);
    const hasRegHeading = bodySnippet.includes('Start building your career journey') || bodySnippet.includes('Create your account');
    
    if (pageTitle.includes('CareerSaathi') && hasRegHeading) {
      record('Registration', '1.1 Initial Page Load & Heading', 'PASS', `Title: "${pageTitle}", Heading verified`);
    } else {
      record('Registration', '1.1 Initial Page Load & Heading', 'FAIL', `Title: "${pageTitle}", Heading found: ${hasRegHeading}`);
    }

    // 1.2 Empty submit validation
    const submitRegBtn = await regPage.$('button[type="submit"]');
    if (submitRegBtn) await submitRegBtn.click();
    await delay(500);
    const emptyErrors = await regPage.$$eval('p.text-red-500, p.text-red-600', els => els.map(e => e.textContent?.trim()));
    await regPage.screenshot({ path: path.join(SCREENSHOT_DIR, '02_register_empty_validation.png') });
    if (emptyErrors.length >= 2) {
      record('Registration', '1.2 Empty Form Submission Validation', 'PASS', `Detected errors: ${JSON.stringify(emptyErrors)}`);
    } else {
      record('Registration', '1.2 Empty Form Submission Validation', 'FAIL', `Expected >= 2 error messages, got: ${JSON.stringify(emptyErrors)}`);
    }

    // 1.3 Short full name (< 3 chars), invalid email, short password
    await clearAndType(regPage, '#fullName', 'Al');
    await clearAndType(regPage, '#email', 'invalidemail');
    await clearAndType(regPage, '#password', 'pass1');
    if (submitRegBtn) await submitRegBtn.click();
    await delay(500);
    const invalidErrors = await regPage.$$eval('p.text-red-500, p.text-red-600', els => els.map(e => e.textContent?.trim()));
    await regPage.screenshot({ path: path.join(SCREENSHOT_DIR, '03_register_invalid_inputs.png') });
    
    const hasNameError = invalidErrors.some(e => e?.toLowerCase().includes('3 characters') || e?.toLowerCase().includes('name'));
    const hasEmailError = invalidErrors.some(e => e?.toLowerCase().includes('invalid email'));
    const hasPassError = invalidErrors.some(e => e?.toLowerCase().includes('8 characters'));

    if (hasNameError && hasEmailError && hasPassError) {
      record('Registration', '1.3-1.5 Invalid Format & Length Validations', 'PASS', 'FullName, Email & Password validation errors verified');
    } else {
      record('Registration', '1.3-1.5 Invalid Format & Length Validations', 'FAIL', `Errors found: ${JSON.stringify(invalidErrors)}`);
    }

    // 1.6 Valid New Registration
    await clearAndType(regPage, '#fullName', testFullName);
    await clearAndType(regPage, '#email', testEmail);
    await clearAndType(regPage, '#password', testPassword);

    const submitBtn = await regPage.$('button[type="submit"]');
    if (submitBtn) await submitBtn.click();

    // Wait for redirect to /career-direction or /app
    await regPage.waitForNavigation({ waitUntil: 'networkidle2', timeout: 10000 }).catch(() => {});
    await delay(1200);
    const postRegUrl = regPage.url();
    await regPage.screenshot({ path: path.join(SCREENSHOT_DIR, '04_register_success_redirect.png') });
    
    if (postRegUrl.includes('/career-direction') || postRegUrl.includes('/app')) {
      record('Registration', '1.6 Valid User Registration & Onboarding Redirect', 'PASS', `Redirected to ${postRegUrl}`);
    } else {
      record('Registration', '1.6 Valid User Registration & Onboarding Redirect', 'FAIL', `URL is ${postRegUrl}`);
    }

    // 1.7 Duplicate Registration Conflict Edge Case (using new incognito context)
    const dupContext = await browser.createBrowserContext();
    const dupPage = await dupContext.newPage();
    await dupPage.setViewport({ width: 1280, height: 800 });

    await dupPage.goto(`${BASE_URL}/register`, { waitUntil: 'networkidle2' });
    await waitAndDismissOverlay(dupPage);
    await clearAndType(dupPage, '#fullName', 'Duplicate User');
    await clearAndType(dupPage, '#email', testEmail); // same email
    await clearAndType(dupPage, '#password', testPassword);
    const dupSubmit = await dupPage.$('button[type="submit"]');
    if (dupSubmit) await dupSubmit.click();

    await delay(1500);
    await dupPage.screenshot({ path: path.join(SCREENSHOT_DIR, '05_register_duplicate_conflict.png') });
    
    const pageText = await dupPage.evaluate(() => document.body.innerText);
    const hasConflictToast = pageText.toLowerCase().includes('email already exists') || pageText.toLowerCase().includes('already exists') || pageText.toLowerCase().includes('conflict');
    
    if (hasConflictToast) {
      record('Registration', '1.7 Duplicate Registration Conflict (409)', 'PASS', 'User-friendly 409 error displayed, no crash');
    } else {
      record('Registration', '1.7 Duplicate Registration Conflict (409)', 'FAIL', 'Conflict message not detected in UI text');
    }
    await dupContext.close();
    await regContext.close();

    // -------------------------------------------------------------
    // SUITE 2: LOGIN FLOW & CREDENTIAL VALIDATION
    // -------------------------------------------------------------
    console.log('\n--- SUITE 2: LOGIN FLOW & CREDENTIAL VALIDATION ---');
    
    // Dedicated clean context for login testing
    const loginContext = await browser.createBrowserContext();
    const loginPage = await loginContext.newPage();
    await loginPage.setViewport({ width: 1280, height: 800 });

    // 2.1 Load /login
    await loginPage.goto(`${BASE_URL}/login`, { waitUntil: 'networkidle2' });
    await waitAndDismissOverlay(loginPage);
    await loginPage.screenshot({ path: path.join(SCREENSHOT_DIR, '06_login_page.png') });
    
    const loginPageText = await loginPage.evaluate(() => document.body.innerText);
    const hasLoginHeading = loginPageText.includes('Continue your career journey') || loginPageText.includes('Welcome back');
    if (hasLoginHeading) {
      record('Login', '2.1 Initial Login Page Load & Heading', 'PASS', 'Login header and form rendered properly');
    } else {
      record('Login', '2.1 Initial Login Page Load & Heading', 'FAIL', 'Login heading not found');
    }

    // 2.2 Empty login submission
    const loginSubmitBtn = await loginPage.$('button[type="submit"]');
    if (loginSubmitBtn) await loginSubmitBtn.click();
    await delay(500);
    const loginEmptyErrors = await loginPage.$$eval('p.text-red-500, p.text-red-600', els => els.map(e => e.textContent?.trim()));
    await loginPage.screenshot({ path: path.join(SCREENSHOT_DIR, '07_login_empty_validation.png') });
    if (loginEmptyErrors.length >= 1) {
      record('Login', '2.2 Empty Form Submission Validation', 'PASS', `Errors: ${JSON.stringify(loginEmptyErrors)}`);
    } else {
      record('Login', '2.2 Empty Form Submission Validation', 'FAIL', `Expected errors, got: ${JSON.stringify(loginEmptyErrors)}`);
    }

    // 2.3 Invalid credentials (wrong password)
    await clearAndType(loginPage, '#email', testEmail);
    await clearAndType(loginPage, '#password', 'WrongPassword999!');
    const submitWrong = await loginPage.$('button[type="submit"]');
    if (submitWrong) await submitWrong.click();
    await delay(1500);
    await loginPage.screenshot({ path: path.join(SCREENSHOT_DIR, '08_login_invalid_credentials.png') });
    const loginErrText = await loginPage.evaluate(() => document.body.innerText);
    const hasAuthError = loginErrText.toLowerCase().includes('invalid') || loginErrText.toLowerCase().includes('password') || loginErrText.toLowerCase().includes('credentials');
    if (hasAuthError) {
      record('Login', '2.3 Wrong Password Feedback (401)', 'PASS', 'Displays error toast for invalid password');
    } else {
      record('Login', '2.3 Wrong Password Feedback (401)', 'FAIL', 'Did not find error feedback');
    }

    // 2.4 Login with newly registered user
    await clearAndType(loginPage, '#password', testPassword);
    const submitValidNew = await loginPage.$('button[type="submit"]');
    if (submitValidNew) await submitValidNew.click();

    await loginPage.waitForNavigation({ waitUntil: 'networkidle2', timeout: 10000 }).catch(() => {});
    await delay(1200);
    const postLoginUrl = loginPage.url();
    await loginPage.screenshot({ path: path.join(SCREENSHOT_DIR, '09_login_new_user_success.png') });
    if (postLoginUrl.includes('/career-direction') || postLoginUrl.includes('/app')) {
      record('Login', '2.4 Valid Login (New User -> Career Direction)', 'PASS', `Successfully redirected to ${postLoginUrl}`);
    } else {
      record('Login', '2.4 Valid Login (New User -> Career Direction)', 'FAIL', `URL is ${postLoginUrl}`);
    }
    await loginContext.close();

    // 2.5 Login with workspace user (test2@gmail.com) in main persistent context
    const mainContext = await browser.createBrowserContext();
    const mainPage = await mainContext.newPage();
    await mainPage.setViewport({ width: 1280, height: 800 });

    await mainPage.goto(`${BASE_URL}/login`, { waitUntil: 'networkidle2' });
    await waitAndDismissOverlay(mainPage);
    await clearAndType(mainPage, '#email', 'test2@gmail.com');
    await clearAndType(mainPage, '#password', 'Password123!');
    const submitWorkspaceUser = await mainPage.$('button[type="submit"]');
    if (submitWorkspaceUser) await submitWorkspaceUser.click();

    await mainPage.waitForNavigation({ waitUntil: 'networkidle2', timeout: 10000 }).catch(() => {});
    await delay(1500);
    const workspaceUserUrl = mainPage.url();
    await mainPage.screenshot({ path: path.join(SCREENSHOT_DIR, '10_login_workspace_user_success.png') });
    if (workspaceUserUrl.includes('/workspace')) {
      record('Login', '2.5 Valid Login (Workspace User -> /workspace)', 'PASS', `Redirected to ${workspaceUserUrl}`);
    } else {
      record('Login', '2.5 Valid Login (Workspace User -> /workspace)', 'FAIL', `URL is ${workspaceUserUrl}`);
    }

    // -------------------------------------------------------------
    // SUITE 3: ROUTE GUARD & SECURITY AUDIT
    // -------------------------------------------------------------
    console.log('\n--- SUITE 3: ROUTE GUARD & SECURITY AUDIT ---');

    // 3.1 Unauthenticated route guard in isolated incognito context
    const unauthContext = await browser.createBrowserContext();
    const unauthPage = await unauthContext.newPage();
    await unauthPage.setViewport({ width: 1280, height: 800 });

    await unauthPage.goto(`${BASE_URL}/workspace`, { waitUntil: 'networkidle2' });
    await waitAndDismissOverlay(unauthPage);
    await delay(800);
    const unauthUrl = unauthPage.url();
    await unauthPage.screenshot({ path: path.join(SCREENSHOT_DIR, '11_guard_workspace_unauth_redirect.png') });
    if (unauthUrl.includes('/login')) {
      record('Route Guard', '3.1 Unauthenticated Protected Route Redirect', 'PASS', `/workspace redirected to ${unauthUrl}`);
    } else {
      record('Route Guard', '3.1 Unauthenticated Protected Route Redirect', 'FAIL', `Expected redirect to /login, got: ${unauthUrl}`);
    }
    await unauthContext.close();

    // 3.2 Authenticated visiting /login bounce (mainPage is logged in as test2@gmail.com)
    await mainPage.goto(`${BASE_URL}/login`, { waitUntil: 'networkidle2' });
    // Wait for PublicLayout + AuthInitializer to bounce user back to workspace
    await mainPage.waitForFunction(() => !window.location.pathname.includes('/login'), { timeout: 8000 }).catch(() => {});
    await delay(500);
    const bouncedUrl = mainPage.url();
    await mainPage.screenshot({ path: path.join(SCREENSHOT_DIR, '12_guard_public_route_bounce.png') });
    if (!bouncedUrl.includes('/login')) {
      record('Route Guard', '3.2 Authenticated Public Route Bounce', 'PASS', `/login bounced authenticated user to ${bouncedUrl}`);
    } else {
      record('Route Guard', '3.2 Authenticated Public Route Bounce', 'FAIL', `User was allowed to stay on ${bouncedUrl}`);
    }

    // -------------------------------------------------------------
    // SUITE 4: PROFILE MANAGEMENT & DATA PERSISTENCE
    // -------------------------------------------------------------
    console.log('\n--- SUITE 4: PROFILE MANAGEMENT & DATA PERSISTENCE ---');

    // 4.1 Navigate to /profile with workspace user
    await mainPage.goto(`${BASE_URL}/profile`, { waitUntil: 'networkidle2' });
    await waitAndDismissOverlay(mainPage);
    await delay(1500);
    await mainPage.screenshot({ path: path.join(SCREENSHOT_DIR, '13_profile_page_initial.png') });

    const profileText = await mainPage.evaluate(() => document.body.innerText);
    const hasProfileHeader = profileText.includes('Personal Information') && profileText.includes('Account Information');
    if (hasProfileHeader) {
      record('Profile', '4.1 Profile Page Render', 'PASS', 'Personal and Account Information cards rendered');
    } else {
      record('Profile', '4.1 Profile Page Render', 'FAIL', 'Profile elements missing');
    }

    // 4.2 Verify "Save Changes" is initially disabled (form not dirty)
    const isSaveDisabledInitial = await mainPage.$eval('button[type="submit"]', el => (el as HTMLButtonElement).disabled);
    if (isSaveDisabledInitial) {
      record('Profile', '4.2 Save Button Initially Disabled', 'PASS', 'Clean form has disabled Save Changes button');
    } else {
      record('Profile', '4.2 Save Button Initially Disabled', 'FAIL', 'Save Changes button was not disabled on clean form');
    }

    // 4.3 Form modification & Cancel reset test
    const phoneInputSelector = 'input[name="phoneNumber"]';
    await clearAndType(mainPage, phoneInputSelector, '+919999888877');
    await delay(300);

    const isSaveEnabledAfterEdit = await mainPage.$eval('button[type="submit"]', el => !(el as HTMLButtonElement).disabled);
    if (isSaveEnabledAfterEdit) {
      record('Profile', '4.3 Save Button Enables When Dirty', 'PASS', 'Dirty form enabled Save button');
    } else {
      record('Profile', '4.3 Save Button Enables When Dirty', 'FAIL', 'Save button remained disabled after editing');
    }

    // Click Cancel
    await mainPage.evaluate(() => {
      const buttons = Array.from(document.querySelectorAll('button'));
      const cancel = buttons.find(b => b.textContent?.trim() === 'Cancel');
      if (cancel) cancel.click();
    });
    await delay(400);
    await mainPage.screenshot({ path: path.join(SCREENSHOT_DIR, '14_profile_cancel_reset.png') });
    const isSaveDisabledAfterCancel = await mainPage.$eval('button[type="submit"]', el => (el as HTMLButtonElement).disabled);
    if (isSaveDisabledAfterCancel) {
      record('Profile', '4.4 Cancel Button Resets Form State', 'PASS', 'Cancel successfully reverted form and disabled Save button');
    } else {
      record('Profile', '4.4 Cancel Button Resets Form State', 'FAIL', 'Save button remained enabled after Cancel');
    }

    // 4.5 Save updated profile
    const testPhone = `+9198765${Math.floor(10000 + Math.random() * 90000)}`;
    await clearAndType(mainPage, phoneInputSelector, testPhone);

    const saveBtn = await mainPage.$('button[type="submit"]');
    if (saveBtn) await saveBtn.click();
    await delay(1500);
    await mainPage.screenshot({ path: path.join(SCREENSHOT_DIR, '15_profile_save_success.png') });

    const postSaveText = await mainPage.evaluate(() => document.body.innerText);
    const hasSaveToast = postSaveText.includes('Profile updated successfully') || postSaveText.includes('success');
    if (hasSaveToast) {
      record('Profile', '4.5 Profile Update Submission (PATCH /me)', 'PASS', `Success notification confirmed for phone: ${testPhone}`);
    } else {
      record('Profile', '4.5 Profile Update Submission (PATCH /me)', 'FAIL', 'No success notification detected');
    }

    // 4.6 Persistence check after page reload
    await mainPage.reload({ waitUntil: 'networkidle2' });
    await waitAndDismissOverlay(mainPage);
    await delay(1500);
    await mainPage.screenshot({ path: path.join(SCREENSHOT_DIR, '16_profile_persisted_after_reload.png') });
    
    const persistedPhoneVal = await mainPage.$eval(phoneInputSelector, el => (el as HTMLInputElement).value);
    const persistedPageText = await mainPage.evaluate(() => document.body.innerText);
    const isPersistedInCard = persistedPageText.includes(testPhone);

    if (persistedPhoneVal === testPhone && isPersistedInCard) {
      record('Profile', '4.6 Database Persistence After Reload', 'PASS', `Phone number ${testPhone} persisted in DB, input, and account card`);
    } else {
      record('Profile', '4.6 Database Persistence After Reload', 'FAIL', `Input value: "${persistedPhoneVal}", Found in card: ${isPersistedInCard}`);
    }

    // -------------------------------------------------------------
    // SUITE 5: LOGOUT FLOW & SESSION REVOCATION
    // -------------------------------------------------------------
    console.log('\n--- SUITE 5: LOGOUT FLOW & SESSION REVOCATION ---');

    await mainPage.goto(`${BASE_URL}/workspace`, { waitUntil: 'networkidle2' });
    await waitAndDismissOverlay(mainPage);
    await delay(1200);

    // Look for Settings button in sidebar
    const clickedSettings = await mainPage.evaluate(() => {
      const aside = document.querySelector('aside');
      if (!aside) return false;
      const buttons = Array.from(aside.querySelectorAll('button'));
      const settings = buttons.find(b => b.textContent?.trim().includes('Settings'));
      if (settings) {
        settings.click();
        return true;
      }
      return false;
    });

    if (clickedSettings) {
      await delay(500);
      await mainPage.screenshot({ path: path.join(SCREENSHOT_DIR, '17_settings_popover.png') });
      record('Logout', '5.1 Settings Popover Trigger', 'PASS', 'Settings popover opened');
    } else {
      record('Logout', '5.1 Settings Popover Trigger', 'FAIL', 'Settings button not found in sidebar');
    }

    // Click Logout option inside popover to open Modal
    const clickedPopoverLogout = await mainPage.evaluate(() => {
      const popover = document.querySelector('[data-settings-menu] .z-50');
      if (!popover) return false;
      const logoutBtn = popover.querySelector('button');
      if (logoutBtn) {
        logoutBtn.click();
        return true;
      }
      return false;
    });

    if (clickedPopoverLogout) {
      await delay(500);
      await mainPage.screenshot({ path: path.join(SCREENSHOT_DIR, '18_logout_modal.png') });
      record('Logout', '5.2 Logout Confirmation Modal Display', 'PASS', 'Modal dialog appeared');
    } else {
      record('Logout', '5.2 Logout Confirmation Modal Display', 'FAIL', 'Popover logout button not found');
    }

    // Test Cancel in Logout Modal
    const clickedModalCancel = await mainPage.evaluate(() => {
      const modal = document.querySelector('div.fixed.z-50');
      if (!modal) return false;
      const buttons = Array.from(modal.querySelectorAll('button'));
      const cancel = buttons.find(b => b.textContent?.trim() === 'Cancel');
      if (cancel) {
        cancel.click();
        return true;
      }
      return false;
    });

    if (clickedModalCancel) {
      await delay(400);
      const isModalStillOpen = await mainPage.$('div.fixed.z-50 h2');
      if (!isModalStillOpen) {
        record('Logout', '5.3 Modal Cancel Dismissal', 'PASS', 'Dismissed logout modal cleanly, session stays active');
      } else {
        record('Logout', '5.3 Modal Cancel Dismissal', 'FAIL', 'Modal remained visible after Cancel');
      }
    }

    // Reopen Settings Popover and click Logout
    await mainPage.evaluate(() => {
      const aside = document.querySelector('aside');
      if (!aside) return;
      const buttons = Array.from(aside.querySelectorAll('button'));
      const settings = buttons.find(b => b.textContent?.trim().includes('Settings'));
      if (settings) settings.click();
    });
    await delay(400);

    await mainPage.evaluate(() => {
      const popover = document.querySelector('[data-settings-menu] .z-50');
      if (!popover) return;
      const logoutBtn = popover.querySelector('button');
      if (logoutBtn) logoutBtn.click();
    });
    await delay(500);

    // Click confirm "Logout" inside modal
    await mainPage.evaluate(() => {
      const modal = document.querySelector('div.fixed.z-50');
      if (!modal) return;
      const buttons = Array.from(modal.querySelectorAll('button'));
      const logout = buttons.find(b => b.textContent?.trim() === 'Logout');
      if (logout) logout.click();
    });

    await mainPage.waitForNavigation({ waitUntil: 'networkidle2', timeout: 10000 }).catch(() => {});
    await delay(1500);
    const postLogoutUrl = mainPage.url();
    await mainPage.screenshot({ path: path.join(SCREENSHOT_DIR, '19_logout_redirect_login.png') });

    if (postLogoutUrl.includes('/login')) {
      record('Logout', '5.4 Confirmed Logout Session Cleared & Redirected', 'PASS', `Redirected to ${postLogoutUrl}`);
    } else {
      record('Logout', '5.4 Confirmed Logout Session Cleared & Redirected', 'FAIL', `URL is ${postLogoutUrl}`);
    }

    // 5.5 Attempt post-logout backward navigation to /workspace
    await mainPage.goto(`${BASE_URL}/workspace`, { waitUntil: 'networkidle2' });
    await delay(1000);
    const postLogoutWorkspaceAttempt = mainPage.url();
    if (postLogoutWorkspaceAttempt.includes('/login')) {
      record('Logout', '5.5 Post-Logout Protected Route Blocking', 'PASS', `Direct access to /workspace redirected to ${postLogoutWorkspaceAttempt}`);
    } else {
      record('Logout', '5.5 Post-Logout Protected Route Blocking', 'FAIL', `Expected /login, got: ${postLogoutWorkspaceAttempt}`);
    }

    await mainContext.close();

  } catch (err: any) {
    console.error('Fatal Test Exception:', err);
    record('Fatal', 'Test Suite Execution', 'FAIL', undefined, err.message);
  } finally {
    await browser.close();
  }

  // -------------------------------------------------------------
  // TEST REPORT SUMMARY
  // -------------------------------------------------------------
  console.log('\n================================================================');
  console.log('📊 FINAL TEST REPORT SCORECARD: AUTHENTICATION, IDENTITY & SECURITY');
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
    console.log(`${icon} [${r.suite.padEnd(14)}] ${r.test.padEnd(46)} -> ${r.status} ${r.details ? `(${r.details})` : ''} ${r.error ? `Error: ${r.error}` : ''}`);
  }
  console.log('================================================================\n');

  if (failed > 0) {
    process.exit(1);
  }
}

runAuthTestSuite().catch((err) => {
  console.error(err);
  process.exit(1);
});

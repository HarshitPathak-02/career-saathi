# CareerSaathi QA Bug & Edge-Case Tracker

This document maintains a living, feature-by-feature record of all functional bugs, edge-case traps, security lapses, and UX shortcomings identified during end-to-end headless browser testing across the CareerSaathi platform.

---

## 📌 Summary Scorecard Across Features

| # | Feature Track | Total Tested | Passed | Identified Issues | Status |
|---|---------------|:------------:|:------:|:-----------------:|:------:|
| 1 | **Authentication, Identity & Security** | 23 | 23 | 4 | **Verified & Ready** |
| 2 | **Career Setup & Multi-Journey Flow** | 25 | 25 | 2 | **Verified & Ready** |
| 3 | **Career Discovery & AI Assessment Engine** | 21 | 21 | 3 | **Verified & Ready** |
| 4 | **Interactive Practice & Coding Workspace** | 26 | 26 | 3 | **Verified & Ready** |
| 5 | **AI Mock Interviews & Real-Time Rubrics** | 40 | 40 | 4 | **Verified & Ready** |
| 6 | **Daily Missions, Tasks & Skill Progress** | 43 | 43 | 2 | **Verified & Ready** |
| 7 | **Weekly Review, Reports & Monthly Audit** | 37 | 37 | 4 | **Verified & Ready** |
| 8 | **Admin Panel & Master Data Management** | 50 | 50 | 3 | **Verified & Ready** |

---

## 🔍 Feature 1: Authentication, Identity & Security

### Overview
- **Scope**: User Registration, Login & Token Issuance, Route Guards (`ProtectedLayout`, `PublicLayout`, `WorkspaceGuard`), Profile Updates (`/profile`), Settings Popover & Logout Modal.
- **Target Surfaces**:
  - Frontend: `http://localhost:5174/register`, `/login`, `/profile`, `/workspace`
  - Backend: `/api/v1/auth/*`, `/api/v1/users/*`
- **Automation Test Suite**: [`backend/src/test_auth_full_suite.ts`](file:///C:/careersaathi/backend/src/test_auth_full_suite.ts)
- **Visual Artifacts**: 19 screenshots in [`docs/test-reports/auth/`](file:///C:/careersaathi/docs/test-reports/auth/)

---

### 🐛 Identified Bugs & Edge-Case Traps

#### Bug 1.1: Missing Backend `PATCH /api/v1/auth/me` Endpoint
- **Severity**: **Critical (P0)**
- **Type**: Functional / API Disconnect
- **Description**: Frontend `UpdateProfileForm` triggers `useUpdateProfileMutation` which sends a `PATCH` request to `/api/v1/auth/me` with `{ fullName, email, phoneNumber }`. However, in the backend `auth.routes.ts`, there was no `PATCH /me` route defined, nor was there an `updateProfile` method on `AuthController` or `AuthService`. As a result, attempting to update personal details returned an HTTP 404 (Route not found).
- **Impact**: Any user attempting to change their name, email, or contact information experienced a complete failure of the profile update feature.
- **Root Cause**: Backend API route for profile mutation was left unimplemented during initial module scaffold.
- **Resolution**:
  - Implemented `updateProfileSchema` in [`backend/src/modules/auth/auth.validation.ts`](file:///C:/careersaathi/backend/src/modules/auth/auth.validation.ts) with Joi validation.
  - Implemented `updateProfile` in [`backend/src/modules/auth/auth.service.ts`](file:///C:/careersaathi/backend/src/modules/auth/auth.service.ts) including email uniqueness collision check (`409 Conflict`).
  - Added `updateProfile` controller in [`backend/src/modules/auth/auth.controller.ts`](file:///C:/careersaathi/backend/src/modules/auth/auth.controller.ts).
  - Added `router.patch('/me', authenticate, validateRequest(...), authController.updateProfile)` in [`backend/src/modules/auth/auth.routes.ts`](file:///C:/careersaathi/backend/src/modules/auth/auth.routes.ts).
- **Status**: **RESOLVED & VERIFIED** (Test 4.5 & 4.6 passed).

---

#### Bug 1.2: Missing `phoneNumber` in MongoDB Model & Mapper
- **Severity**: **High (P1)**
- **Type**: Data Persistence / Schema Mismatch
- **Description**: The frontend profile form and DTO (`UpdateProfileDto`) include `phoneNumber`, and the UI displays "Phone Number" in the `AccountInformationCard`. However, `UserModel` in Mongoose, `IUser`, `UpdateUserInput`, and `toUserResponse` did not contain the `phoneNumber` field. Even if an update was requested, Mongoose silently dropped the field.
- **Impact**: Phone number inputs were never saved in the database; upon page refresh, the phone number field would reset to blank / "Not provided".
- **Root Cause**: Schema drift between frontend TypeScript interfaces and backend Mongoose schema definition.
- **Resolution**:
  - Added `phoneNumber: { type: String, default: null, trim: true }` to [`backend/src/modules/users/user.model.ts`](file:///C:/careersaathi/backend/src/modules/users/user.model.ts).
  - Added `phoneNumber?: string | null` to `IUser`, `UpdateUserInput`, and `UserResponse` in [`backend/src/modules/users/user.types.ts`](file:///C:/careersaathi/backend/src/modules/users/user.types.ts).
  - Added `phoneNumber: user.phoneNumber ?? undefined` to `toUserResponse` mapper in [`backend/src/modules/users/user.mapper.ts`](file:///C:/careersaathi/backend/src/modules/users/user.mapper.ts).
- **Status**: **RESOLVED & VERIFIED** (Reload persistence verified in automated test 4.6).

---

#### Bug 1.3: Missing Toast Feedback on Profile Update
- **Severity**: **Medium (P2)**
- **Type**: UX / User Feedback
- **Description**: When clicking "Save Changes" on [`ProfilePage.tsx`](file:///C:/careersaathi/frontend/src/features/profile/pages/ProfilePage.tsx), the form passed the raw mutation trigger `onSubmit={updateProfile}` without wrapping it in an event handler that triggers toast feedback. The user was left with no visual feedback confirming whether the update succeeded or failed.
- **Impact**: Poor UX clarity; users would click repeatedly or question if the application accepted their changes.
- **Root Cause**: Missing toast notification trigger wrapper in `ProfilePage.tsx`.
- **Resolution**:
  - Created `handleUpdateProfile` in `ProfilePage.tsx` using `unwrap()`, `showSuccess("Profile updated successfully.")`, and `showError(getApiErrorMessage(error))`.
- **Status**: **RESOLVED & VERIFIED** (Verified via toast detection in test 4.5).

---

#### Bug 1.4: Intrusive Blocking Brand Intro Overlay (`BrandIntro`)
- **Severity**: **High (P1)**
- **Type**: UX Interaction Trap / Event Interception
- **Description**: In [`App.tsx`](file:///C:/careersaathi/frontend/src/App.tsx), `<BrandIntro />` rendered a full-screen black overlay with `z-[99999]` that persisted for 2.5 seconds on **every** component mount, page refresh, and navigation. Because it had `useState(true)` without session persistence and lacked `pointer-events-none`, any user clicks or typing during the first 2.5 seconds were completely intercepted and lost.
- **Impact**: Users refreshing the page or navigating rapidly encountered missed clicks, unresponsive inputs, and an annoying black splash screen on every single action.
- **Root Cause**: In [`frontend/src/shared/brand-intro/useBrandIntro.ts`](file:///C:/careersaathi/frontend/src/shared/brand-intro/useBrandIntro.ts), `show` initialized to `true` unconditionally on every render without checking `sessionStorage`.
- **Resolution**:
  - Updated `useBrandIntro.ts` to check `sessionStorage.getItem("brand_intro_seen")`. If present, it initializes to `false`. When shown on first visit, it sets the flag and fades out after 1.5 seconds.
  - Subsequent navigations and reloads immediately render the active view without any blocking screen.
- **Status**: **RESOLVED & VERIFIED** (Verified across all test suites).

---

## 🔍 Feature 2: Career Setup & Multi-Journey Flow

### Overview
- **Scope**: Step 1 Career Direction Choice (`/career-direction`), Step 2 Career Domain Selection (`/career-domain`), Step 3 Career Role Selection (`/career-role`), Step 4 Journey Preferences Form (`/career-journey`), Step-Hopping Route Guards, `OnboardingGuard` Lockout, Multi-Journey Conflict Prevention, Redux Setup State Hygiene, and Workspace Hand-off.
- **Target Surfaces**:
  - Frontend: `http://localhost:5174/career-direction`, `/career-domain`, `/career-role`, `/career-journey`, `/workspace`
  - Backend: `/api/v1/lookup/*`, `/api/v1/career-journeys/*`
- **Automation Test Suite**: [`backend/src/test_career_setup_suite.ts`](file:///C:/careersaathi/backend/src/test_career_setup_suite.ts)
- **Visual Artifacts**: 18 high-resolution screenshots in [`docs/test-reports/career-setup/`](file:///C:/careersaathi/docs/test-reports/career-setup/)
- **Test Scorecard**: 25 / 25 Scenarios Passed (100.0% Pass Rate)

---

### 🐛 Identified Bugs & Edge-Case Traps

#### Bug 2.1: Disconnected `activeCareerJourneyId` Synchronization on `UserModel`
- **Severity**: **High (P1)**
- **Type**: Data Model Consistency / State Disconnect
- **Description**: The `UserModel` schema specifies `activeCareerJourneyId: { type: Schema.Types.ObjectId, ref: CAREER_JOURNEY_MODEL, default: null }`. When `careerJourneyService.createCareerJourney` created a new journey record with `status: ACTIVE`, it saved the journey in the `career_journeys` collection but never updated the `activeCareerJourneyId` property on the `users` document. Similarly, when deleting a journey, the user record retained a stale reference.
- **Impact**: Any direct queries or third-party background services inspecting the `users` collection found `activeCareerJourneyId: null` even though the user had completed onboarding, causing severe data inconsistency between the User and CareerJourney collections.
- **Root Cause**: Missing synchronization call to `userRepository.updateById` in `careerJourneyService`.
- **Resolution**:
  - Added `await userRepository.updateById(userId, { activeCareerJourneyId: careerJourney._id });` in `createCareerJourney` within [`backend/src/modules/career-journey/career-journey.service.ts`](file:///C:/careersaathi/backend/src/modules/career-journey/career-journey.service.ts).
  - Added `await userRepository.updateById(userId, { activeCareerJourneyId: null });` when an active journey is deleted.
- **Status**: **RESOLVED & VERIFIED** (Verified in automated tests 6.3 & 7.1).

---

#### Bug 2.2: Stale Redux Setup State Residuals Post-Creation
- **Severity**: **Medium (P2)**
- **Type**: Client State Hygiene / Edge-Case Trap
- **Description**: In [`CareerJourneyPage.tsx`](file:///C:/careersaathi/frontend/src/features/career-setup/pages/CareerJourneyPage.tsx), upon successful submission of the preferences form (`createCareerJourney().unwrap()`), the application invoked `navigate("/workspace", { replace: true })` without dispatching `resetCareerSetup()`. As a result, `selectedDomainId`, `selectedRoleId`, `targetCompany`, and custom timeline values lingered in the Redux store in browser memory.
- **Impact**: If a user logged out and a different user logged in during the same tab session, or if the multi-journey capability was invoked, previous onboarding selections polluted the new session state.
- **Root Cause**: Missing invocation of the existing `resetCareerSetup` reducer in the post-creation callback.
- **Resolution**:
  - Imported `resetCareerSetup` from `careerSetupSlice.ts` in `CareerJourneyPage.tsx`.
  - Dispatched `dispatch(resetCareerSetup());` immediately prior to `/workspace` navigation.
- **Status**: **RESOLVED & VERIFIED** (Verified across live flow).

---

## 🔍 Feature 3: Career Discovery & AI Assessment Engine

### Overview
- **Scope**: Conversational Career Discovery (`/discovery`), Groq AI Counselor Q&A, AI Recommendations Synthesis, Candidate Selection & Draft Journey Provisioning, Route Guards (`WorkspaceGuard` lockout), Step 0 Resume Onboarding (`/initial-assessment`), Step 1 Role Skills Selection, Step 2 Assessment Guide, Step 3 Technical Exam Runner (section attempts, option selection, autosave, submission), and Workspace Evolution to `roadmap_pending` (`GenerateRoadmapCard`).
- **Target Surfaces**:
  - Frontend: `http://localhost:5174/discovery`, `/initial-assessment`, `/workspace`
  - Backend: `/api/v1/discovery/*`, `/api/v1/assessments/*`, `/api/v1/assessment-sections/*`, `/api/v1/assessment-attempts/*`, `/api/v1/user-skills/*`
- **Automation Test Suite**: [`backend/src/test_discovery_assessment_suite.ts`](file:///C:/careersaathi/backend/src/test_discovery_assessment_suite.ts)
- **Visual Artifacts**: 19 high-resolution screenshots in [`docs/test-reports/assessment/`](file:///C:/careersaathi/docs/test-reports/assessment/)
- **Test Scorecard**: 21 / 21 Scenarios Passed (100.0% Pass Rate)

---

### 🐛 Identified Bugs & Edge-Case Traps

#### Bug 3.1: Circular Dependency in `assessment.routes.ts` Causing Runtime TDZ ReferenceError
- **Severity**: **Critical (P0)**
- **Type**: Module Resolution / Circular Dependency
- **Description**: In [`backend/src/modules/assessment/assessment.routes.ts`](file:///C:/careersaathi/backend/src/modules/assessment/assessment.routes.ts), validation schemas (`startInitialAssessmentSchema`, `startWeeklyAssessmentSchema`, etc.) were imported from `./index.js` while `./index.js` re-exported `assessmentRouter` from `./assessment.routes.js`. In Node.js ESM environments, this circular dependency threw a fatal `ReferenceError: Cannot access 'startInitialAssessmentSchema' before initialization` during module evaluation.
- **Impact**: Any direct import or module resolution that triggered assessment routes before index re-exports resolved failed with a server crash.
- **Root Cause**: Index circular import instead of importing directly from the validator module.
- **Resolution**:
  - Replaced `from "./index.js"` with `from "./assessment.validator.js"` in [`backend/src/modules/assessment/assessment.routes.ts`](file:///C:/careersaathi/backend/src/modules/assessment/assessment.routes.ts).
- **Status**: **RESOLVED & VERIFIED** (Verified across module compilation and test suite execution).

---

#### Bug 3.2: Disconnected `activeCareerJourneyId` on Candidate Selection
- **Severity**: **High (P1)**
- **Type**: Data Model Consistency / State Disconnect
- **Description**: In [`backend/src/modules/discovery/discovery.service.ts`](file:///C:/careersaathi/backend/src/modules/discovery/discovery.service.ts), `selectDiscoveryCandidate` auto-creates a draft `CareerJourney` if the user didn't have one previously. However, it never called `userRepository.updateById(userId, { activeCareerJourneyId: careerJourney._id }, mongoSession)`.
- **Impact**: The user document maintained `activeCareerJourneyId: null`, leading to broken synchronization between the `users` and `career_journeys` collections.
- **Root Cause**: Missing invocation of `userRepository.updateById` in the candidate selection database transaction.
- **Resolution**:
  - Added `await userRepository.updateById(userId, { activeCareerJourneyId: careerJourney._id }, mongoSession);` in [`backend/src/modules/discovery/discovery.service.ts`](file:///C:/careersaathi/backend/src/modules/discovery/discovery.service.ts).
- **Status**: **RESOLVED & VERIFIED** (Verified in automated tests 3.2 & 3.3).

---

#### Bug 3.3: Inappropriate Navigation Hand-off in `CareerDiscoveryPage.tsx`
- **Severity**: **Medium (P2)**
- **Type**: UX Flow / Navigation Guard
- **Description**: In [`CareerDiscoveryPage.tsx`](file:///C:/careersaathi/frontend/src/features/discovery/pages/CareerDiscoveryPage.tsx), `handleContinue` unconditionally executed `navigate("/initial-assessment")`. When navigating without an active career journey (or if candidate selection hadn't completed), `WorkspaceGuard` rejected the user and redirected them back to `/career-direction` in a confusing loop.
- **Impact**: Users exploring options without a journey could be trapped in a redirect bounce back to onboarding Step 1.
- **Root Cause**: Missing check for `careerJourneyId` existence before triggering navigation.
- **Resolution**:
  - Updated `handleContinue` to check `if (careerJourneyId) navigate("/initial-assessment"); else navigate("/career-journey");` in [`CareerDiscoveryPage.tsx`](file:///C:/careersaathi/frontend/src/features/discovery/pages/CareerDiscoveryPage.tsx).
- **Status**: **RESOLVED & VERIFIED** (Verified in live test flow).

---

## 🔍 Feature 4: Interactive Practice & Coding Workspace

### Overview
- **Scope**: Route Guards (`WorkspaceGuard`, auth redirection), Practice Hub Exploration (`/practice`) with Coding Lab & Technical Interview modes, Difficulty Filtering, Real-time Search, Coding Workspace (`/practice/coding/:slug`) split-pane layout, Problem Presentation, Monaco Editor integration, Theme Toggle, In-Browser Test Runner (`codeRunner.ts`), Console Logs capture, AI Mentor Review with Groq AI (`POST /challenges/:slug/evaluate`), Journey Evidence Opt-In Toggle, Technical Interview Drills (`/practice/interview/:sessionId`), Conversational Scenario Questions, Dynamic AI Follow-up Turns, Interview Completion Diagnostic Card (`InterviewDiagnosticCard`), Activity Synchronization & Solved Badges, Seamless Navigation Return to Workspace, Non-Existent Slug / Session Edge Cases, and Cross-Journey Security Guards (HTTP 403).
- **Target Surfaces**:
  - Frontend: `http://localhost:5174/practice`, `/practice/coding/:slug`, `/practice/interview/:sessionId`, `/workspace`
  - Backend: `/api/v1/practice/hub`, `/api/v1/practice/challenges/*`, `/api/v1/practice/attempts/*`, `/api/v1/practice/interviews/*`
- **Automation Test Suite**: [`backend/src/test_practice_workspace_suite.ts`](file:///C:/careersaathi/backend/src/test_practice_workspace_suite.ts)
- **Visual Artifacts**: 19 high-resolution screenshots in [`docs/test-reports/practice/`](file:///C:/careersaathi/docs/test-reports/practice/):
  - `01_unauth_practice_guard.png`: Unauthenticated attempt blocked and bounced to `/login`.
  - `02_practice_hub_coding_mode.png`: Practice Hub in Coding Lab mode with stats badges.
  - `03_practice_hub_difficulty_filter.png`: Real-time difficulty filtering ("EASY").
  - `04_practice_hub_search.png`: Real-time search query ("retry").
  - `05_coding_workspace_initial.png`: Split-pane coding layout with markdown problem description & Monaco editor.
  - `06_coding_workspace_theme_toggle.png`: Light/dark editor theme toggle.
  - `07_test_runner_passed.png`: Test cases runner showing "All Tests Passed (3/3)" and execution time.
  - `08_test_runner_failed_diagnostics.png`: Detailed test failure diagnostics and output mismatch.
  - `09_test_runner_console_logs.png`: In-browser console logs captured and displayed.
  - `10_ai_mentor_evaluation_feedback.png`: Groq AI Staff Engineer code review card with scores, strengths, and feedback.
  - `12_practice_hub_interview_mode.png`: Mode switcher to Technical Interview Drills and skills selector grid.
  - `13_interview_workspace_scenario_q1.png`: Live interview drill session Question 1 of 3.
  - `14_interview_dynamic_followup_turn.png`: Probing dynamic follow-up question generated from candidate answer.
  - `15_interview_scenario_q2.png`: Advancement to Scenario Question 2 of 3.
  - `16_interview_diagnostic_report.png`: Staff Engineer rubric evaluation report card with scores and rubric breakdown.
  - `18_practice_hub_synced_activity.png`: Practice Hub with Solved badge and populated recent submissions history table.
  - `19_practice_hub_back_to_workspace.png`: Clean navigation loop returning user to `/workspace`.
  - `20_edge_case_challenge_not_found.png`: Graceful "Challenge Not Found" card with recovery actions.
  - `21_edge_case_interview_not_found.png`: Graceful "Interview Session Not Found" card with return action.
- **Test Scorecard**: 26 / 26 Scenarios Passed (**100.0% Pass Rate**)

---

### 🐛 Identified Bugs & Edge-Case Traps

#### Bug 4.1: Missing Top Navigation / Return Link on `PracticeHubPage`
- **Severity**: **Medium (P2)**
- **Type**: UX Navigation Trap / User Disorientation
- **Description**: In [`PracticeHubPage.tsx`](file:///C:/careersaathi/frontend/src/features/practice/pages/PracticeHubPage.tsx), the page rendered only the mode switcher (`Coding Lab & Challenges` vs `Technical Interview Drills`) and challenge grids. Unlike the main dashboard, the practice workspace routes (`/practice`, `/practice/coding/:slug`, `/practice/interview/:sessionId`) do not mount `WorkspaceSidebar`. While the coding and interview pages had breadcrumb links back to `/practice`, the Practice Hub itself provided no way for the user to return to `/workspace` (other than browser back navigation or error recovery cards).
- **Impact**: Candidates entering the practice ground from the workspace were effectively stranded on the practice route without an obvious return route to their roadmap dashboard.
- **Root Cause**: Missing top header navigation bar with a link back to `/workspace`.
- **Resolution**:
  - Imported `ArrowLeft` from `lucide-react` in [`PracticeHubPage.tsx`](file:///C:/careersaathi/frontend/src/features/practice/pages/PracticeHubPage.tsx).
  - Added a clean top navigation bar with `<Link to="/workspace"><ArrowLeft size={14} /><span>Back to Workspace</span></Link>` above the mode switcher.
- **Status**: **RESOLVED & VERIFIED** (Automated navigation test 23 verifies return to `/workspace`).

---

#### Bug 4.2: Monaco Editor Dynamic Mount Timing & Automation Exposure
- **Severity**: **Low (P3)**
- **Type**: Observability / Test Automation
- **Description**: Monaco Editor is initialized asynchronously by `@monaco-editor/react`, downloading its web worker scripts in the background. Because the editor instance was not exposed, external headless test scripts and accessibility readers could encounter race conditions when verifying starter code or programmatically setting editor buffers before full mount.
- **Impact**: Intermittent flaky test assertions during rapid page transitions; difficult observability into editor buffer state.
- **Root Cause**: `handleEditorDidMount` did not expose the editor instance reference on `window`.
- **Resolution**:
  - Added `(window as any).__monacoEditor = editor;` in `handleEditorDidMount` inside [`CodingEditorPane.tsx`](file:///C:/careersaathi/frontend/src/features/practice/components/CodingEditorPane.tsx).
  - Added `await page.waitForFunction(() => Boolean((window as any).__monacoEditor))` in the automated test suite.
- **Status**: **RESOLVED & VERIFIED** (100% deterministic starter code loading verified).

---

#### Bug 4.3: Mongoose Strict Mode Validation Drift on CareerJourney & InterviewEvaluation Schemas
- **Severity**: **Medium (P2)**
- **Type**: Backend Defensive / Schema Strictness
- **Description**:
  1. `CareerJourneyModel` schema specifies `strict: "throw"` with an enum constraint for `status: ['draft', 'active', 'completed', 'archived', 'readiness', 'ready']`. Any non-lowercase status (e.g. `ACTIVE`) or unrecognized properties (e.g. `assessmentCompleted`) immediately threw a `StrictModeError`.
  2. `InterviewEvaluationSchema` in [`interview-session.model.ts`](file:///C:/careersaathi/backend/src/modules/practice/interview-session.model.ts) strictly permits `conceptualDepthScore`, `communicationScore`, `overallScore`, `observedStrengths`, `observedGaps`, `antiPatterns`, and `mentorFeedback`. Mismatched property names (e.g. `observedStruggles` or `targetedGrowthAreas`) triggered Mongoose strict mode validation rejections.
- **Impact**: Inconsistent field names in journey or interview evaluation payloads caused unexpected runtime Mongoose exceptions.
- **Root Cause**: Schema drift between domain terminology and strict Mongoose schema definitions.
- **Resolution**:
  - Verified and aligned schema definitions, ensuring all journey status values follow lowercase enum constants and interview evaluation fields strictly adhere to `observedGaps` and `antiPatterns`.
- **Status**: **RESOLVED & VERIFIED** (Verified across DB persistence and automated tests).

---

## 🔍 Feature 5: AI Mock Interviews & Real-Time Rubrics

### Overview
- **Scope**:
  - Route guards & access control for `/readiness`
  - Defensive stage gating (`ACTIVE` vs `READINESS` vs `READY`)
  - Official Mock Interview Battery Initialization (3 Curated Slots: Technical & System Architecture, Production Debugging & Problem Solving, Comprehensive Role Screen)
  - Defensive API validation & sequence enforcement (Slot 1 -> Slot 2 -> Slot 3)
  - Live AI Mock Interview Turn-Based Execution (Staff Bar-Raiser Scenario Questions, Dynamic Follow-Ups, Voice Dictation UI)
  - Multi-Dimensional Real-Time Rubric Scoring & Job Readiness Portfolio Recording
  - Battery Progression, Score Badges, and Dynamic Slot Unlocking
  - Concurrency Handling & In-Progress Session Resume Capability
  - Manual / External Mock Interview Recording (`AddMockInterviewModal.tsx`) & Field Range Validations
  - Battery Completion (3 of 3 Slots) & Ready-to-Evaluate State Transitions
  - Full Readiness Evaluation Engine & Scoring Certification (Job Ready State)
  - Adaptive Remediation Flow (Not Ready State & Adaptive Roadmap Synthesis)
  - Multi-Tenant Data Isolation & Cross-Journey Security Boundaries
- **Target Surfaces**:
  - Frontend: `http://localhost:5174/readiness`, `/practice/interview/:sessionId`, `/workspace`, `/roadmap`
  - Backend: `/api/v1/mock-interviews/*`, `/api/v1/readiness/*`, `/api/v1/roadmaps/*`
- **Automation Test Suite**: [`backend/src/test_mock_interview_suite.ts`](file:///C:/careersaathi/backend/src/test_mock_interview_suite.ts)
- **Visual Artifacts**: 15 high-resolution screenshots in [`docs/test-reports/mock-interview/`](file:///C:/careersaathi/docs/test-reports/mock-interview/):
  - `01_unauth_readiness_guard.png`: Unauthenticated attempt to access `/readiness` cleanly bounced to `/login`.
  - `02_active_stage_guard.png`: Candidate in `ACTIVE` learning stage navigating to `/readiness` receives informative locked state with actionable return buttons.
  - `03_battery_initial_readiness.png`: Official Mock Interview Battery initialized in `READINESS` stage showing 0/3 progress, Slot 1 `NOT_STARTED`, Slots 2 & 3 `LOCKED`, and insufficient data threshold card.
  - `04_official_mock_slot1_started.png`: Slot 1 launched in Interview Workspace with "Official Readiness Battery", "Official Mock Interview #1", "Scenario Question", and breadcrumb back to Job Readiness.
  - `05_official_mock_followup_turn.png`: Candidate technical explanation submitted; real-time Groq AI Staff Bar-Raiser responds with dynamic probing follow-up question.
  - `06_slot1_diagnostic_report_card.png`: Completed interview diagnostic displaying overall rubric score (84%), conceptual depth (86%), communication (82%), mentor feedback, strengths, and official readiness portfolio confirmation badge.
  - `07_battery_slot2_unlocked.png`: Return to Job Readiness hub; battery progress reflects 1/3 (33%), Slot 1 shows completed score badge, Slot 2 dynamically unlocked to `NOT_STARTED`.
  - `08_slot2_resume_in_progress.png`: Mid-session navigation back to `/readiness` gracefully displays "Session Active" pulsing indicator and amber "Resume Interview" action.
  - `09_add_mock_modal_open.png`: Add Mock Interview modal opened for external manual recording (Pramp, Interviewing.io, etc.).
  - `10_external_mock_recorded.png`: External mock interview submitted and populated in Mock Interview History alongside official AI mocks.
  - `11_ready_to_evaluate_state.png`: All 3 battery slots completed (100% progress); `ReadyToEvaluateState` renders prominent "Evaluate My Readiness" CTA.
  - `12_officially_job_ready_state.png`: Certified Job Ready state rendered with overall readiness score (83.32%), category breakdown grid (Technical Skills, Technical Interview, Problem Solving, Communication), and "Learning phase complete" certificate.
  - `13_not_ready_adaptive_state.png`: Low-scoring candidate evaluation renders `NotReadyState` with "Improvement needed", identified weak areas list, and "Generate Adaptive Roadmap" action.
  - `14_adaptive_roadmap_modal.png`: `AdaptiveRoadmapConfirmationModal` opens with weak areas summary and clear explanation of next steps.
  - `15_adaptive_roadmap_redirect.png`: Adaptive roadmap generated; journey status transitions back to `ACTIVE`, and candidate is seamlessly redirected to `/roadmap`.
- **Test Scorecard**: 40 / 40 Scenarios Passed (**100.0% Pass Rate**)

---

### 🐛 Identified Bugs & Edge-Case Traps

#### Bug 5.1: External Mock Interview Number Collision with Official Battery Slots
- **Severity**: **Critical (P0)**
- **Type**: Backend Data Corruption / Unique Index Violation
- **Description**: In `mock-interview.service.ts`, `createMockInterview` assigned `interviewNumber = latestInterview ? latestInterview.interviewNumber + 1 : 1`. Because the MongoDB collection enforces a unique compound index on `{ careerJourneyId: 1, interviewNumber: 1 }`:
  1. If a candidate had completed official mock interviews #1 and #2 and subsequently entered an external mock interview (e.g. from Pramp), the external mock was assigned `interviewNumber: 3`.
  2. In `getReadinessBattery`, slot 3 looked for `completedMocks.find(m => m.interviewNumber === 3)`. As a result, the external Pramp mock hijacked Slot 3 ("Comprehensive Role Screen"), falsely marking the official battery slot as completed!
  3. When the candidate subsequently attempted to take official mock interview #3, `startOfficialMockInterview` rejected them with `HTTP 409 Conflict: Mock Interview 3 is already completed.`
  4. In addition, attempting to save official mock interview #3 crashed with `MongoServerError: E11000 duplicate key error { careerJourneyId, interviewNumber: 3 }`.
- **Impact**: Any user entering an external mock interview corrupted their official milestone battery, preventing completion of official interviews and blocking job readiness certification.
- **Root Cause**: External mock interviews and official battery slots shared the same unsegmented integer sequence starting at 1.
- **Resolution**:
  - In [`backend/src/modules/mock-interview/mock-interview.service.ts`](file:///C:/careersaathi/backend/src/modules/mock-interview/mock-interview.service.ts), reserved numbers 1, 2, and 3 strictly for the 3 official milestone AI mock interviews.
  - Updated `createMockInterview` to calculate `interviewNumber = Math.max(4, maxNumber + 1)`, ensuring external mock interviews are numbered 4 and above and never collide with official slots.
  - Updated `getReadinessBattery` slot matching to explicitly check `m.interviewNumber === def.interviewNumber && m.platform === "CareerSaathi AI"`.
- **Status**: **RESOLVED & VERIFIED** (Battery completion & external mock coexistence verified in automated suites 8 & 9).

---

#### Bug 5.2: Trapped Error State on `/readiness` for Candidates in Active Learning Stage
- **Severity**: **High (P1)**
- **Type**: UX Dead-End / Trapping Trap
- **Description**: In `readiness.service.ts`, attempting to fetch readiness state for a journey whose status is `ACTIVE` correctly returns `HTTP 409 Conflict: Readiness is not currently available for this career journey`. However, in [`ReadinessPage.tsx`](file:///C:/careersaathi/frontend/src/features/readiness/pages/ReadinessPage.tsx), the error state simply rendered:
  `Unable to load interview readiness: We couldn't evaluate your interview readiness right now.` with a single `Try Again` button.
  Clicking `Try Again` repeatedly called `refetchReadiness()` which failed again with 409, trapping the candidate with no way back to their workspace or roadmap.
- **Impact**: Candidates entering the readiness URL during their learning phase were completely stranded on an error screen with no navigation recourse.
- **Root Cause**: Error boundary did not distinguish stage conflicts (409) and provided no return or alternative navigation links.
- **Resolution**:
  - Enhanced error boundary in [`frontend/src/features/readiness/pages/ReadinessPage.tsx`](file:///C:/careersaathi/frontend/src/features/readiness/pages/ReadinessPage.tsx).
  - Detected 409 conflict stage and rendered a friendly "Readiness Stage Locked: Complete your active learning roadmap first" banner.
  - Added "Return to Workspace" (`navigate('/workspace')`) and "View Learning Roadmap" (`navigate('/roadmap')`) buttons, completely eliminating the user trap.
- **Status**: **RESOLVED & VERIFIED** (Automated test 2 & 3 in Suite 2 verify non-trapping return to `/workspace`).

---

#### Bug 5.3: Missing `InsufficientDataState` in `ReadinessPage` Hub View
- **Severity**: **Medium (P2)**
- **Type**: UI Incompleteness / Information Gap
- **Description**: In [`ReadinessPage.tsx`](file:///C:/careersaathi/frontend/src/features/readiness/pages/ReadinessPage.tsx), when `readiness.status === "insufficient_data"`, the page rendered only `<ReadinessInterviewBatteryCard />`. The existing `<InsufficientDataState />` component—which displays the comprehensive evaluation breakdown (Technical Skills, Technical Interview, Problem Solving, Communication) and explicitly explains how many more mock interviews are needed—was completely omitted from the rendered JSX.
- **Impact**: Candidates had no clear visibility into what criteria CareerSaathi evaluates for job readiness until they reached the evaluation state.
- **Root Cause**: `InsufficientDataState` was defined in the file but omitted from the conditional render block for `insufficient_data`.
- **Resolution**:
  - Updated lines 526-540 in [`frontend/src/features/readiness/pages/ReadinessPage.tsx`](file:///C:/careersaathi/frontend/src/features/readiness/pages/ReadinessPage.tsx) to render both `<ReadinessInterviewBatteryCard />` and `<InsufficientDataState />` in a responsive stacked container.
- **Status**: **RESOLVED & VERIFIED** (Automated test in Suite 3 verified rendering of criteria and threshold message).

---

#### Bug 5.4: Redundant Duplicate Nested "Your next step" Cards in `NotReadyState`
- **Severity**: **Low (P3)**
- **Type**: UX Redundancy / Visual Polish
- **Description**: In [`ReadinessPage.tsx`](file:///C:/careersaathi/frontend/src/features/readiness/pages/ReadinessPage.tsx) inside `NotReadyState`, an outer card displayed `<h3>Your next step</h3><p>CareerSaathi can create an adaptive roadmap...</p>`, and directly inside it was another nested box also labeled `<p>Your next step</p><p>We'll create a focused follow-up roadmap...</p>`.
- **Impact**: Cluttered visual presentation and redundant repetitive copy on the remediation screen.
- **Root Cause**: Duplicate draft container left during UI iteration.
- **Resolution**:
  - Consolidated the card into a single styled card titled `Your next step: Focused Remediation` with concise copy and the "Generate Adaptive Roadmap" button.
- **Status**: **RESOLVED & VERIFIED** (Visual proof captured in `13_not_ready_adaptive_state.png`).

---

## 🔍 Feature 6: Daily Missions, Tasks & Skill Progress

### Overview
- **Scope**:
  - Mission Lifecycle Resolution (`INITIAL_MISSION_REQUIRED`, `MISSION_PENDING`, `ACTIVE_MISSION`, `COMPLETED`).
  - Initial Mission Creation & AI Study Task Generation (6 Daily Tasks + Day 7 Weekly Review).
  - Daily Task State Transitions (`PENDING` -> `COMPLETED`, `SKIPPED`, `PENDING` reset).
  - Business Rule Guardrails: Future Daily Task Locking (Day > currentDay -> HTTP 409 Conflict), Day 7 Weekly Review Lock (HTTP 409 Conflict).
  - Real-Time Cross-Surface Progress Synchronization (`MissionDetailsPage` <-> `ActiveMissionCard` on `/workspace` <-> `RoadmapItem` status transition to `IN_PROGRESS`).
  - Multi-Tenant Isolation & BOLA/IDOR Security Enforcement across all mission & daily task endpoints.
- **Target Surfaces**:
  - Frontend: `http://localhost:5174/missions`, `http://localhost:5174/missions/:id`, `http://localhost:5174/workspace`
  - Backend: `/api/v1/missions/*`, `/api/v1/daily-tasks/*`
- **Automation Test Suite**: [`backend/src/test_missions_tasks_suite.ts`](file:///C:/careersaathi/backend/src/test_missions_tasks_suite.ts)
- **Visual Artifacts**: 15 high-resolution screenshots in [`docs/test-reports/missions/`](file:///C:/careersaathi/docs/test-reports/missions/)
- **Test Scorecard**: 43 / 43 Scenarios Passed (100.0% Pass Rate)

---

### 🐛 Identified Bugs & Edge-Case Traps

#### Bug 6.1: Missing Multi-Tenant Object Level Authorization (IDOR) on Daily Tasks Module
- **Severity**: **Critical (P0)**
- **Type**: Broken Object Level Authorization (OWASP API1:2023) / Security Vulnerability
- **Description**: In [`backend/src/modules/daily-task/daily-task.controller.ts`](file:///C:/careersaathi/backend/src/modules/daily-task/daily-task.controller.ts), task operations (`getTask`, `getTasksByMission`, `markCompleted`, `markPending`, `markSkipped`) only validated that a user was authenticated via bearer token. None of the controller endpoints verified whether the requesting user actually owned the career journey to which the task and mission belonged. An authenticated user (e.g., User B) could fetch, complete, or skip any other candidate's (e.g., User A's) daily tasks simply by sending User A's `taskId` or `missionId`.
- **Impact**: Any authenticated candidate could view proprietary curriculum tasks or maliciously mark tasks complete/skipped for other candidates on the platform, corrupting study records and progress metrics.
- **Root Cause**: Missing ownership resolution connecting `DailyTask` -> `Mission` -> `CareerJourney` -> `userId`.
- **Resolution**:
  - Implemented `ensureTaskOwnership` and `ensureMissionOwnership` helper guards in `daily-task.controller.ts`.
  - Prior to executing task retrieval or status mutations, queries `missionRepository.findById` and `careerJourneyRepository.findByIdAndUserId(mission.careerJourneyId, req.user.id)`.
  - If the ownership check fails or the resource does not belong to the requesting user, returns HTTP 404 Not Found (denying resource existence to unauthorized actors).
- **Status**: **RESOLVED & VERIFIED** (Automated Suite 11 tests 1-4 verify HTTP 404 rejection on cross-user read/write attempts).

---

#### Bug 6.2: Missing Multi-Tenant Object Level Authorization (IDOR) on Missions Module
- **Severity**: **Critical (P0)**
- **Type**: Broken Object Level Authorization (OWASP API1:2023) / Security Vulnerability
- **Description**: In [`backend/src/modules/mission/mission.controller.ts`](file:///C:/careersaathi/backend/src/modules/mission/mission.controller.ts), endpoints including `getMission`, `getCurrentMission`, `getLatestMission`, `getMissionHistory`, `createInitialMission`, and `generateNextMission` accepted `id` or `careerJourneyId` from route parameters without verifying that `req.user.id` was the owner of the `careerJourneyId`. As a result, User B could trigger mission generation, view complete mission history, or inspect mission details belonging to User A.
- **Impact**: Complete bypass of tenant boundaries allowing cross-user data leakage and unauthorized state transitions on learning journeys.
- **Root Cause**: `mission.controller.ts` directly called service methods without checking `careerJourneyRepository.findByIdAndUserId(careerJourneyId, user.userId)`.
- **Resolution**:
  - Implemented strict multi-tenant ownership guards in all mission controller handler methods (`getMission`, `getCurrentMission`, `getLatestMission`, `getMissionHistory`, `createInitialMission`, `generateNextMission`).
  - Added journey validation: `const careerJourney = await careerJourneyRepository.findByIdAndUserId(new Types.ObjectId(careerJourneyId), new Types.ObjectId(user.userId)); if (!careerJourney) throw new AppError(HTTP_STATUS.NOT_FOUND, "Career journey not found.");`.
- **Status**: **RESOLVED & VERIFIED** (Automated Suite 11 tests 5-7 verify HTTP 404 rejection on cross-user mission mutations and history inspections).

---

## 🔍 Feature 7: Weekly Review, Reports & Monthly Audit

### Overview
- **Scope**:
  - Route Guards, Gating & Redirections (`/weekly-review`, `/weekly-reports`, `/monthly-reports`).
  - Empty States & Premature Access Guardrails (Day 1 Early Access Locked 409 Conflict with friendly lock banner).
  - Day 7 Weekly Review Unlock & 3-Step Preparation Wizard (Step 1 Topics & Skills, Step 2 Assessment Scores, Step 3 Student Reflection & Mentor Check-In).
  - Atomic Weekly Review Submission, Report AI Generation & Mission Completion (`POST /weekly-reviews/submit`).
  - Weekly Reports Hub (`/weekly-reports`) & Detailed Report Analytics (`/weekly-reports/:reportId`).
  - Monthly Report Lifecycle, 28-Day Cycle Detection (`/monthly-reports/:careerJourneyId/due-status`), and Automated AI Generation (`POST .../generate`).
  - Monthly Reports Hub (`/monthly-reports`) & Trajectory Analytics (`/monthly-reports/1`).
  - Defensive Edge Cases, Malformed IDs, 404 Boundaries & Resubmission Conflict Idempotency.
  - Multi-Tenant Isolation & BOLA/IDOR Security Enforcement across all weekly review, weekly report, and monthly report endpoints.
- **Target Surfaces**:
  - Frontend: `http://localhost:5174/weekly-review`, `http://localhost:5174/weekly-reports`, `http://localhost:5174/weekly-reports/:id`, `http://localhost:5174/monthly-reports`, `http://localhost:5174/monthly-reports/:number`
  - Backend: `/api/v1/weekly-reviews/*`, `/api/v1/weekly-reports/*`, `/api/v1/monthly-reports/*`
- **Automation Test Suite**: [`backend/src/test_weekly_review_reports_suite.ts`](file:///C:/careersaathi/backend/src/test_weekly_review_reports_suite.ts)
- **Visual Artifacts**: 15 high-resolution screenshots in [`docs/test-reports/weekly-reports/`](file:///C:/careersaathi/docs/test-reports/weekly-reports/)
- **Test Scorecard**: 37 / 37 Scenarios Passed (100.0% Pass Rate)

---

### 🐛 Identified Bugs & Edge-Case Traps

#### Bug 7.1: Missing Multi-Tenant Object Level Authorization (IDOR/BOLA) on Weekly Report Endpoints
- **Severity**: **Critical (P0)**
- **Type**: Broken Object Level Authorization (OWASP API1:2023) / Security Vulnerability
- **Description**: In [`backend/src/modules/weekly-report/weekly-report.controller.ts`](file:///C:/careersaathi/backend/src/modules/weekly-report/weekly-report.controller.ts), endpoints `getLatestWeeklyReport`, `getWeeklyReports`, and `getWeeklyReport` only extracted parameters (`careerJourneyId` or `reportId`) without validating whether the authenticated user was the owner of the underlying `careerJourney`. An authenticated attacker (User B) could inspect any other student's (User A) weekly progress summaries, AI feedback, assessment scores, and mentor evaluations by guessing or obtaining their `careerJourneyId` or `reportId`.
- **Impact**: Severe breach of student privacy and educational progress confidentiality.
- **Root Cause**: Missing ownership query against `careerJourneyRepository.findByIdAndUserId`.
- **Resolution**:
  - Added strict ownership validation in all three endpoints in `weekly-report.controller.ts`:
    ```ts
    const careerJourney = await careerJourneyRepository.findByIdAndUserId(
        new Types.ObjectId(careerJourneyId),
        new Types.ObjectId(user.userId)
    );
    if (!careerJourney) {
        throw new AppError(HTTP_STATUS.NOT_FOUND, "Career journey not found.");
    }
    ```
  - For `getWeeklyReport`, verified that the report's `careerJourneyId` matches a journey owned by `user.userId`, returning HTTP 404 if ownership fails.
- **Status**: **RESOLVED & VERIFIED** (Automated Suite 10 tests 1-3 verify HTTP 404 rejection on cross-user unauthorized access).

---

#### Bug 7.2: Premature Exception Throw in `WeeklyReflectionRepository.findOne` & `findById` Preventing Initial Review Submission
- **Severity**: **Critical (P0)**
- **Type**: Backend Logic Flaw / Lifecycle Blocker
- **Description**: In [`backend/src/modules/weekly-reflection/weekly-reflection.repository.ts`](file:///C:/careersaathi/backend/src/modules/weekly-reflection/weekly-reflection.repository.ts), `findOne` and `findById` directly threw `throw new AppError(HTTP_STATUS.NOT_FOUND, "Weekly Reflection not found")` whenever a query returned `null`. However, `weeklyReviewWorkflow.submitWeeklyReview` relied on `weeklyReflectionService.getReflection({ missionId })` returning `null` to detect that a reflection document did not exist yet and needed to be created. As a consequence, any student attempting to submit their Day 7 weekly review for the first time was greeted with an HTTP 404 error ("Weekly Reflection not found") and the entire review lifecycle failed to execute.
- **Impact**: 100% blocker for completing weekly reviews, generating weekly AI reports, or completing missions.
- **Root Cause**: The repository layer improperly encapsulated HTTP error throwing instead of returning `WeeklyReflectionDocument | null`, breaking caller null-checks.
- **Resolution**:
  - Refactored `WeeklyReflectionRepository.findOne` and `WeeklyReflectionRepository.findById` to return `WeeklyReflectionDocument | null`.
  - Allowed `weeklyReflectionService` and `weeklyReviewWorkflow` to execute the creation path when `reflection === null`.
- **Status**: **RESOLVED & VERIFIED** (Automated Suite 4 tests pass atomically, creating reports and completing missions).

---

#### Bug 7.3: Missing Resubmission & Idempotency Conflict Guard in `weeklyReviewWorkflow.submitWeeklyReview`
- **Severity**: **High (P1)**
- **Type**: State Machine / HTTP Semantics
- **Description**: When a student submitted a weekly review, the mission status transitioned from `ACTIVE` to `COMPLETED`. If the student or a script resubmitted `POST /weekly-reviews/submit`, `missionService.getActiveMission` returned `null` (since no active mission existed), which threw an ambiguous `HTTP 404 Not Found: "Active mission not found."` instead of the expected `HTTP 409 Conflict: "Weekly review has already been completed."`.
- **Impact**: Confusing UX and incorrect HTTP status codes for clients attempting duplicate or repeated review submissions.
- **Root Cause**: `weeklyReviewWorkflow` checked for Day 7 task completion only after assuming an active mission existed, failing to check if the latest mission was already completed.
- **Resolution**:
  - Added a fallback query in `weeklyReviewWorkflow.submitWeeklyReview`: if no active mission exists, queries for `MissionModel.findOne({ careerJourneyId, status: MissionStatus.COMPLETED })`. If found, throws `HTTP 409 Conflict: "Weekly review has already been completed."`.
- **Status**: **RESOLVED & VERIFIED** (Automated Suite 9 test 3 passes with HTTP 409 Conflict).

---

#### Bug 7.4: Trapping Error States in `WeeklyReviewPage`, `WeeklyReportsPage`, `WeeklyReportDetailsPage`, and `MonthlyReportDetailsPage`
- **Severity**: **Medium (P2)**
- **Type**: UX Dead End / Recovery Friction
- **Description**: When an unready student accessed `/weekly-review` before Day 7, or when an error occurred while loading weekly/monthly reports, the pages displayed error or lock banners with no interactive buttons or exit paths, trapping users on dead-end screens.
- **Impact**: Frustrated users were forced to manually edit browser URLs or press the browser back button.
- **Root Cause**: Missing fallback navigation CTAs in error/locked conditional renders.
- **Resolution**:
  - Added "Return to Workspace" and "View Daily Missions" navigation buttons to `WeeklyReviewPage.tsx` lock/error states.
  - Added "Go to Workspace" button to empty states and "Return to Workspace" / "Back to Weekly Reports" buttons to error states in `WeeklyReportsPage.tsx`, `WeeklyReportDetailsPage.tsx`, `MonthlyReportsPage.tsx`, and `MonthlyReportDetailsPage.tsx`.
- **Status**: **RESOLVED & VERIFIED** (Automated Suite 2, 5, 8, and 9 verify recovery CTAs).

---

## 🔍 Feature 8: Admin Panel & Master Data Management

### Overview
- **Scope**:
  - Admin Route Guards, Session Isolation & Redirection (`/dashboard`, `/users`, `/curriculum`, `/questions`, `/ai-telemetry`, `/broadcasts` -> `/login`).
  - Strict RBAC & Admin Authentication (Admin vs Learner role gating, 401 Unauthorized, 403 Forbidden).
  - Control Tower Dashboard & AI Analytics Observability (Real-time platform vitals, 7-day token burn charts, domain track distribution).
  - Candidate Directory, Search Filtering & Student 360° Dossier (Candidate inspection, account suspension lockout enforcement, quota reset).
  - Master Data Curriculum Builder (Domains, Roles, Skills, Topics CRUD, and Role-Skill Track Builder with core/secondary weighting).
  - Interactive Coding Challenges & AI Interview Rubrics Repository (Catalog management, challenge publishing, persona prompt and criteria tuning).
  - AI Telemetry & Observability Audit (LLM latency, total tokens, upstream provider monitoring, raw prompt and completion inspection).
  - System Broadcasts & Candidate Notifications (Cohort announcement dispatch, audience targeting, and persistent audit log).
  - Defensive Boundaries & Malformed Route Handling (CastError 400 Bad Request, duplicate key 409 Conflict, non-existent 404, wildcard router redirect).
  - Admin Impersonation Security Guardrails (Learner support token generation, admin-on-admin privilege escalation protection).
- **Target Surfaces**:
  - Admin Frontend: `http://localhost:5175/login`, `/dashboard`, `/users`, `/users/:id`, `/curriculum`, `/questions`, `/ai-telemetry`, `/broadcasts`
  - Backend: `/api/v1/admin/*`
- **Automation Test Suite**: [`backend/src/test_admin_suite.ts`](file:///C:/careersaathi/backend/src/test_admin_suite.ts)
- **Visual Artifacts**: 11 high-resolution screenshots in [`docs/test-reports/admin/`](file:///C:/careersaathi/docs/test-reports/admin/)
- **Test Scorecard**: 50 / 50 Scenarios Passed (100.0% Pass Rate)

---

### 🐛 Identified Bugs & Edge-Case Traps

#### Bug 8.1: Missing Mongoose `CastError` and Duplicate Key `E11000` Handlers in Error Middleware
- **Severity**: **High (P1)**
- **Type**: Backend Error Handling / HTTP Semantics
- **Description**: In [`backend/src/core/middleware/error.middleware.ts`](file:///C:/careersaathi/backend/src/core/middleware/error.middleware.ts), errors that were not explicit instances of `AppError` or `MulterError` were captured by the catch-all logger and returned as `500 Internal Server Error`. Consequently, passing a malformed ObjectId (e.g., `invalid-id` to `/users/:id/dossier` or `/domains/:id`) resulted in an unhandled 500 error instead of a standard `400 Bad Request`. Furthermore, attempting to insert a duplicate domain or role (triggering MongoDB's `E11000 duplicate key` error) yielded an internal server error instead of a semantic `409 Conflict`.
- **Impact**: Server log pollution, masked root causes, and confusing error codes returned to administrative clients.
- **Root Cause**: Missing dedicated middleware branches for Mongoose `CastError` and MongoError code `11000`.
- **Resolution**:
  - Added explicit handling in `error.middleware.ts`:
    ```ts
    if (error.name === 'CastError') {
      return res.status(HTTP_STATUS.BAD_REQUEST).json({
        success: false,
        message: 'Invalid resource identifier format.',
      });
    }

    if ((error as any).code === 11000) {
      return res.status(HTTP_STATUS.CONFLICT).json({
        success: false,
        message: 'A resource with this unique identifier or name already exists.',
      });
    }
    ```
- **Status**: **RESOLVED & VERIFIED** (Automated Suite 9 tests 1 and 2 verify clean 400 Bad Request and 404 Not Found responses).

---

#### Bug 8.2: Enum Mismatch on `SkillCategory` and `SkillDifficulty` in `AdminCurriculumController`
- **Severity**: **Critical (P0)**
- **Type**: Master Data Validation Failure
- **Description**: In [`backend/src/modules/admin/curriculum/admin-curriculum.controller.ts`](file:///C:/careersaathi/backend/src/modules/admin/curriculum/admin-curriculum.controller.ts), the `createSkill` and `addSkillToRole` handler methods used default values of `"TECHNICAL"` for `category` and uppercase `"INTERMEDIATE"` for `difficulty`. However, in [`backend/src/master-data/skill-catalog/skill-catalog.schema.ts`](file:///C:/careersaathi/backend/src/master-data/skill-catalog/skill-catalog.schema.ts), `SkillCategory` has strict enum values (`PROGRAMMING`, `BACKEND`, `DATABASE`, etc., without `"TECHNICAL"`), and `SkillDifficulty` strictly uses lowercase values (`beginner`, `intermediate`, `advanced`). This caused Mongoose validation to fail with an unhandled exception when administrators created new skills or added skills through the Track Builder.
- **Impact**: Complete failure of the Admin Skill Catalog Creation and Role Track Builder features.
- **Root Cause**: Hardcoded uppercase and nonexistent category defaults in the controller.
- **Resolution**:
  - Imported `SkillCategory` and `SkillDifficulty` enums in `admin-curriculum.controller.ts`.
  - Added defensive normalization:
    ```ts
    const validCategory = (category && Object.values(SkillCategory).includes(category as SkillCategory))
      ? (category as SkillCategory)
      : SkillCategory.BACKEND;
    const validDifficulty = difficulty
      ? (Object.values(SkillDifficulty).includes(difficulty.toLowerCase() as SkillDifficulty)
          ? (difficulty.toLowerCase() as SkillDifficulty)
          : SkillDifficulty.INTERMEDIATE)
      : SkillDifficulty.INTERMEDIATE;
    ```
- **Status**: **RESOLVED & VERIFIED** (Automated Suite 5 tests 5, 6, and 7 pass with 201 Created and persisted curriculum items).

---

#### Bug 8.3: Missing Privilege Elevation Guard on Admin User Impersonation
- **Severity**: **Critical (P0)**
- **Type**: Broken Access Control / Privilege Escalation Vulnerability
- **Description**: In [`backend/src/modules/admin/users/admin-users.controller.ts`](file:///C:/careersaathi/backend/src/modules/admin/users/admin-users.controller.ts), the `impersonate` endpoint allowed any administrator to generate a valid impersonation bearer token for any `userId` passed in route parameters. The endpoint did not verify whether the target user was another `ADMIN`. In a multi-admin enterprise environment, an administrator with lower operational rights could generate an impersonation token for a super-admin or peer, bypassing audit logs and elevating authority.
- **Impact**: Security vulnerability allowing lateral movement and shadow administration.
- **Root Cause**: Missing role check on target user prior to issuing the impersonation token.
- **Resolution**:
  - Added strict check in `adminUsersController.impersonate`:
    ```ts
    if (user.role === UserRole.ADMIN) {
      throw new AppError(
        HTTP_STATUS.FORBIDDEN,
        "Cannot impersonate an administrator."
      );
    }
    ```
- **Status**: **RESOLVED & VERIFIED** (Automated Suite 10 test 2 verifies HTTP 403 Forbidden rejection when attempting admin-on-admin impersonation).

---

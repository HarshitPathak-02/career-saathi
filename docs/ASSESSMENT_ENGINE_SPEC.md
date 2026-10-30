# Assessment Engine Technical Specification

Status: In progress

Scope: Initial, weekly, and resume assessment replacement

Implementation: Initial assessment MVP implemented; weekly engine, admin review, and hardening pending

## 1. Purpose

Replace the current score-entry assessment flow with a platform-owned, question-based assessment engine.

The engine must:

- Generate and serve MCQ-style questions.
- Store every question, answer, attempt, and timing result.
- Score assessments on the server.
- Produce per-skill and per-topic results.
- Support a separate assessment section for every skill selected during onboarding.
- Preserve the current career journey, roadmap, mission, weekly report, and readiness models.

The engine does not include coding questions yet. A coding IDE will be added later.

## 2. Locked Product Decisions

1. Keep the current five career domains and five roles. No UPSC or government-exam track.
2. The initial assessment is fully question-based.
3. There are no manually entered marks.
4. Every selected skill gets its own assessment section inside the initial assessment campaign.
5. Supported question types:
   - single-choice
   - multi-select
   - numeric
   - matching
6. Coding questions are out of scope for this phase.
7. AI generates questions by default.
8. AI-generated questions are validated automatically before serving.
9. Admin review happens later through a new admin panel.
10. A profile resume update is read-only evidence. It must not change the current journey.
11. Resume-based assessment is not created for an active journey. `RESUME` remains a legacy assessment type unless a future explicit flow is introduced.
12. The existing five domains remain the only career catalog.

## 3. Goals

- Make assessment results auditable at the question level.
- Remove trust in user-entered scores.
- Produce reliable weak-topic signals.
- Compare claimed skills, resume evidence, and measured assessment performance without letting resume updates mutate a journey.
- Keep onboarding usable with a bounded assessment length.
- Allow AI-generated content to be reviewed and improved over time.
- Preserve historical assessment data and API compatibility where practical.

## 4. Non-Goals

- Coding questions or IDE integration.
- UPSC, exam-prep, or other career domains.
- Adaptive question selection in V1.
- Proctoring or browser lockdown.
- Negative marking.
- Partial credit for multi-select or matching in V1.
- Automatic journey mutation from a resume update.
- Replacing readiness weights or the mock-interview flow.
- Deleting legacy manual assessment records.

## 5. Current State

The current assessment module stores aggregate assessment metadata and manually entered skill scores.

Relevant current files:

- `backend/src/modules/assessment/assessment.model.ts`
- `backend/src/modules/assessment/assessment-workflow.service.ts`
- `backend/src/modules/skill-progress/skill-progress.model.ts`
- `backend/src/modules/user-skill/user-skill.model.ts`
- `backend/src/modules/resume/resume.model.ts`
- `backend/src/modules/weekly-report/weekly-report.model.ts`
- `frontend/src/features/initial-assessment/`
- `frontend/src/features/resume/components/ResumeSkillsCard.tsx`

Current gaps:

- No question bank.
- No topics under skills.
- No per-question answers.
- No per-question timing.
- No attempts.
- No server-side grading.
- Manual marks are recorded as `AssessmentMethod.PLATFORM`.
- Resume confirmation is additive for active journeys today, which conflicts with the new read-only rule.
- Profile resume can currently trigger a resume skill assessment panel.

## 6. Target Architecture

New backend modules:

| Module | Responsibility |
| --- | --- |
| `skill-topic` | Master-data topic taxonomy under `SkillCatalog` |
| `question-bank` | Questions, options, answer keys, status, versioning, generation, usage metrics |
| `assessment-engine` | Campaigns, sections, attempts, answers, grading, timing |
| `admin-question` | Admin review, approval, rejection, bulk actions, generation jobs |
| `skill-evidence` | Claimed, resume, assessment, and legacy evidence for skill intelligence |

Existing modules to adapt:

| Module | Change |
| --- | --- |
| `assessment` | Becomes a compatibility facade and campaign owner |
| `skill-progress` | Receives computed results instead of submitted marks |
| `user-skill` | Updated from graded assessment evidence |
| `resume` | Profile updates become read-only evidence |
| `weekly-report` | Receives measured weak topics |
| `roadmap` | Can target measured weak topics later |
| `readiness` | Can consume validated skill evidence |

Recommended boundary:

- `assessment` owns the user-facing campaign and assessment history.
- `assessment-engine` owns the runtime and grading.
- `question-bank` owns content.
- `admin-question` owns review operations.
- `skill-evidence` owns cross-source evidence, not scoring authority.

## 7. Domain Model

### 7.1 Enums

```text
QuestionType
  SINGLE_CHOICE
  MULTI_SELECT
  NUMERIC
  MATCHING

QuestionDifficulty
  EASY
  MEDIUM
  HARD

QuestionStatus
  AI_GENERATED
  AI_VALIDATED
  ADMIN_APPROVED
  REJECTED
  RETIRED

QuestionSource
  AI
  MANUAL
  IMPORTED

AssessmentStatus
  PENDING
  IN_PROGRESS
  COMPLETED
  CANCELLED

AssessmentSectionStatus
  PENDING
  IN_PROGRESS
  COMPLETED
  CANCELLED

AssessmentAttemptStatus
  IN_PROGRESS
  SUBMITTED
  EXPIRED
  ABANDONED

AssessmentMethod
  INTERNAL
  MANUAL

SkillEvidenceSource
  CLAIMED
  RESUME
  ASSESSMENT
  LEGACY_MANUAL
  MOCK_INTERVIEW
```

`MANUAL` remains for historical records only. New assessment records use `INTERNAL`.

### 7.2 SkillTopic

Master-data topic taxonomy.

| Field | Type | Notes |
| --- | --- | --- |
| `skillCatalogId` | ObjectId | Required reference to `SkillCatalog` |
| `name` | string | Required |
| `slug` | string | Required, unique per skill |
| `description` | string | Optional |
| `displayOrder` | number | Required, minimum 1 |
| `isActive` | boolean | Default true |

Indexes:

- unique `{ skillCatalogId: 1, slug: 1 }`
- `{ skillCatalogId: 1, displayOrder: 1 }`

Examples:

- Skill: Node.js
- Topics: Event Loop, Async Patterns, Streams, Error Handling

Topic taxonomy must be curated or admin-approved. AI may propose topics, but unapproved topic sprawl must be avoided.

### 7.3 Question

| Field | Type | Notes |
| --- | --- | --- |
| `skillCatalogId` | ObjectId | Required |
| `topicId` | ObjectId | Required |
| `type` | enum | Required |
| `difficulty` | enum | Required |
| `stem` | string | Required |
| `options` | array | Choice types only |
| `correctOptionKeys` | string[] | Choice types only |
| `numericAnswer` | object | Numeric only |
| `matching` | object | Matching only |
| `explanation` | string | Required for review and post-submit feedback |
| `estimatedTimeSeconds` | number | Required |
| `status` | enum | Default `AI_GENERATED` |
| `source` | enum | Default `AI` |
| `version` | number | Starts at 1 |
| `contentHash` | string | Normalized stem hash for duplicate detection |
| `generatedBy` | object | Provider/model/prompt version |
| `reviewedBy` | ObjectId | Admin user |
| `reviewedAt` | Date | Nullable |
| `reviewNotes` | string | Nullable |
| `usageCount` | number | Default 0 |
| `lastServedAt` | Date | Nullable |
| `isDeleted` | boolean | Soft delete |

Type-specific shapes:

- `SINGLE_CHOICE`
  - `options[]` with stable keys
  - exactly one `correctOptionKey`
- `MULTI_SELECT`
  - `options[]` with stable keys
  - at least two correct option keys
- `NUMERIC`
  - `numericAnswer.value`
  - `numericAnswer.tolerance`
  - `numericAnswer.unit`
- `MATCHING`
  - `matching.leftItems[]`
  - `matching.rightItems[]`
  - `matching.correctPairs[]`
  - right side may contain distractors

Indexes:

- `{ skillCatalogId: 1, topicId: 1, difficulty: 1, status: 1 }`
- `{ contentHash: 1 }`
- `{ status: 1, createdAt: 1 }`

### 7.4 Assessment

The campaign container. Existing model is preserved with additive changes.

New or changed fields:

| Field | Type | Notes |
| --- | --- | --- |
| `deliveryMode` | enum | `INTERNAL` for new assessments |
| `status` | enum | Adds `IN_PROGRESS` |
| `skillCatalogIds` | ObjectId[] | Existing field retained |
| `sectionCount` | number | Derived and stored |
| `completedSectionCount` | number | Updated on section completion |
| `startedAt` | Date | Nullable |
| `completedAt` | Date | Existing |

The existing unique index on `{ careerJourneyId, type, weekNumber }` remains.

### 7.5 AssessmentSection

One section per skill.

| Field | Type | Notes |
| --- | --- | --- |
| `assessmentId` | ObjectId | Required |
| `careerJourneyId` | ObjectId | Required for query convenience |
| `skillCatalogId` | ObjectId | Required |
| `displayOrder` | number | Required |
| `status` | enum | Default `PENDING` |
| `questionCount` | number | Default 5 |
| `timeLimitSeconds` | number | Default 600 |
| `score` | number | Nullable until completed |
| `maxScore` | number | Default question count |
| `startedAt` | Date | Nullable |
| `completedAt` | Date | Nullable |

Indexes:

- unique `{ assessmentId: 1, skillCatalogId: 1 }`
- `{ assessmentId: 1, displayOrder: 1 }`
- `{ careerJourneyId: 1, status: 1 }`

### 7.6 AssessmentAttempt

One whole attempt for one skill section.

| Field | Type | Notes |
| --- | --- | --- |
| `assessmentId` | ObjectId | Required |
| `sectionId` | ObjectId | Required |
| `userId` | ObjectId | Required |
| `careerJourneyId` | ObjectId | Required |
| `skillCatalogId` | ObjectId | Required |
| `attemptNumber` | number | Starts at 1 |
| `status` | enum | Default `IN_PROGRESS` |
| `startedAt` | Date | Server time |
| `expiresAt` | Date | Default 2 hours after start |
| `submittedAt` | Date | Nullable |
| `durationSeconds` | number | Nullable |
| `score` | number | Nullable |
| `maxScore` | number | Nullable |
| `correctCount` | number | Nullable |
| `questionCount` | number | Nullable |
| `hasRetiredQuestion` | boolean | Default false |

Indexes:

- unique `{ sectionId: 1, attemptNumber: 1 }`
- partial unique `{ sectionId: 1 }` where `status = IN_PROGRESS`
- `{ userId: 1, assessmentId: 1 }`

### 7.7 AssessmentQuestion

Immutable question snapshot for an attempt.

| Field | Type | Notes |
| --- | --- | --- |
| `attemptId` | ObjectId | Required |
| `questionId` | ObjectId | Source question |
| `questionVersion` | number | Source version |
| `skillCatalogId` | ObjectId | Required |
| `topicId` | ObjectId | Required |
| `topicNameSnapshot` | string | Required |
| `type` | enum | Required |
| `difficulty` | enum | Required |
| `stemSnapshot` | string | Required |
| `optionsSnapshot` | array | Choice types |
| `answerKeySnapshot` | object | Server-only |
| `explanationSnapshot` | string | Server-only until submit |
| `order` | number | Required |
| `points` | number | Default 1 |
| `reviewStatusAtServe` | enum | Audit |
| `createdAt` | Date | Immutable |

Indexes:

- unique `{ attemptId: 1, order: 1 }`
- `{ attemptId: 1, questionId: 1 }`

### 7.8 AssessmentAnswer

One answer per question inside an attempt.

| Field | Type | Notes |
| --- | --- | --- |
| `attemptId` | ObjectId | Required |
| `assessmentQuestionId` | ObjectId | Required |
| `selectedOptionKeys` | string[] | Choice types |
| `numericValue` | number | Numeric |
| `matchingPairs` | array | Matching |
| `isCorrect` | boolean | Nullable until submit |
| `pointsAwarded` | number | Nullable until submit |
| `timeSpentSeconds` | number | Client-reported, server-capped |
| `answeredAt` | Date | Last save time |

Indexes:

- unique `{ attemptId: 1, assessmentQuestionId: 1 }`

### 7.9 SkillProgress

Existing model retained. New fields:

- `assessmentSectionId`
- `assessmentAttemptId`
- `assessmentMethod: INTERNAL` for new records

`obtainedMarks`, `totalMarks`, and `percentage` are computed from graded answers. No client-provided marks are accepted.

Indexes:

- unique `{ assessmentAttemptId: 1, userSkillId: 1 }` for new records, where `assessmentAttemptId` exists
- existing `{ userSkillId: 1, createdAt: -1 }`

### 7.10 SkillTopicProgress

Aggregated topic mastery.

| Field | Type | Notes |
| --- | --- | --- |
| `careerJourneyId` | ObjectId | Required |
| `skillCatalogId` | ObjectId | Required |
| `topicId` | ObjectId | Required |
| `masteryScore` | number | 0–100 |
| `accuracy` | number | 0–100 |
| `questionsAnswered` | number | Cumulative |
| `correctCount` | number | Cumulative |
| `confidence` | number | 0–1 |
| `lastAttemptId` | ObjectId | Latest contributing attempt |
| `lastAssessedAt` | Date | Required |

Indexes:

- unique `{ careerJourneyId: 1, skillCatalogId: 1, topicId: 1 }`
- `{ careerJourneyId: 1, masteryScore: 1 }`

### 7.11 SkillEvidence

Read model for cross-source skill intelligence.

| Field | Type | Notes |
| --- | --- | --- |
| `userId` | ObjectId | Required |
| `careerJourneyId` | ObjectId | Optional |
| `skillCatalogId` | ObjectId | Required |
| `topicId` | ObjectId | Optional |
| `source` | enum | Claimed, resume, assessment, legacy, mock interview |
| `sourceId` | ObjectId | Assessment attempt, resume, user skill, etc. |
| `score` | number | Optional |
| `confidence` | number | 0–1 |
| `evidenceText` | string | Optional, never raw resume text |
| `scoringEligible` | boolean | Assessment only for current scoring |
| `observedAt` | Date | Required |

Rules:

- Resume evidence is `scoringEligible: false`.
- Claimed skill selection is `scoringEligible: false`.
- Assessment evidence is `scoringEligible: true`.
- Legacy manual evidence may be displayed but is not used for new scoring.
- A resume update can add or replace resume evidence but must not create `UserSkill`, `SkillProgress`, or assessment records.

## 8. Question Types and Scoring

### 8.1 Single-choice

- Exact match with the correct option key.
- No partial credit.

### 8.2 Multi-select

- Exact set match with the full correct set.
- No partial credit in V1.
- Option-level selections are stored for analytics even when the answer is marked incorrect.

### 8.3 Numeric

- Correct when `abs(answer - correctValue) <= tolerance`.
- Unit must match exactly when a unit is defined.
- Tolerance must be finite and non-negative.
- Ambiguous units are rejected during generation.

### 8.4 Matching

- Exact pair-set match.
- Right-side distractors are allowed.
- No partial credit in V1.
- Matching must be usable by keyboard and accessible without drag-and-drop.

### 8.5 Assessment score

- Equal points per question by default.
- `score = correctCount / questionCount * 100`.
- Difficulty does not change the section score.

### 8.6 Topic mastery

- Difficulty-weighted:
  - easy = 1.0
  - medium = 1.5
  - hard = 2.0
- `mastery = weightedCorrect / weightedTotal * 100`.
- Confidence is based on sample size and consistency.
- A topic is not marked weak until it has at least three answered questions.

### 8.7 Attempt aggregation

- `UserSkill.currentScore` uses the latest submitted attempt for that skill section.
- `SkillTopicProgress` aggregates across attempts with recency weighting.
- Historical attempts remain immutable.
- Retakes do not overwrite historical `SkillProgress` records.

### 8.8 Timing

- Overall attempt duration is server-authoritative from `startedAt` to `submittedAt`.
- Per-question time is stored for analytics.
- Client time is capped by server-observed duration.
- V1 uses a soft per-section limit. Submitting after expiry returns `410` and requires a new attempt.
- No negative marking.

## 9. Question Lifecycle

```text
AI_GENERATED
  -> AI_VALIDATED
  -> ADMIN_APPROVED
  -> RETIRED

AI_GENERATED
  -> AI_VALIDATED
  -> REJECTED
```

Serving policy:

- `AI_VALIDATED` may be served for initial and weekly assessments.
- `ADMIN_APPROVED` is preferred and required for any future high-stakes assessment mode.
- `REJECTED` and `RETIRED` are never served.
- If a served question is later rejected or retired, the attempt snapshot remains.
- The attempt is flagged `hasRetiredQuestion`.
- Historical scores are not silently recomputed.
- Future assessments stop using the question.
- Admin reports can show affected attempts.

## 10. AI Question Generation

### 10.1 Generation unit

Generate per skill and topic, not for an entire campaign in one call.

Recommended blueprint per section:

- 5 questions
- 2 easy
- 2 medium
- 1 hard
- at least two topics covered

### 10.2 Generation job

Add `QuestionGenerationJob`:

| Field | Type | Notes |
| --- | --- | --- |
| `skillCatalogId` | ObjectId | Required |
| `assessmentSectionId` | ObjectId | Optional |
| `requestedCount` | number | Required |
| `status` | enum | `PENDING`, `RUNNING`, `COMPLETED`, `FAILED` |
| `attempts` | number | Bounded retries |
| `provider` | string | AI provider |
| `model` | string | AI model |
| `promptVersion` | number | Required |
| `error` | string | Safe error |
| `startedAt` | Date | Nullable |
| `completedAt` | Date | Nullable |

### 10.3 Generation flow

1. Determine missing question coverage for the skill and topics.
2. Create a generation job.
3. Call the shared AI provider with structured JSON output.
4. Validate every generated question.
5. Deduplicate against `contentHash` and existing questions.
6. Persist valid questions as `AI_GENERATED`.
7. Run automatic validation and promote to `AI_VALIDATED`.
8. Add to the admin review queue.
9. Retry bounded failures.
10. If insufficient questions exist, block the section and show a preparation/retry state.

AI calls must never run inside a database transaction.

### 10.4 Automatic validation

Reject a generated question when:

- Required fields are missing.
- Option keys are duplicated.
- Correct option keys do not exist.
- Multi-select has fewer than two correct options.
- Matching pairs reference unknown items.
- Numeric value is not finite or tolerance is negative.
- Unit is missing or ambiguous.
- Stem contains the answer key or explanation leakage.
- Topic does not belong to the skill.
- The normalized stem duplicates an existing question.
- The question type is not allowed.
- The explanation contradicts the answer key.

### 10.5 Prompt rules

- Include only skill, topic, difficulty, question type, audience level, and avoid-list.
- Do not send resume text, user PII, or journey personal data.
- Require structured JSON.
- Require answer key and explanation.
- Require estimated solve time.
- Use a prompt version and persist it with generated content.

## 11. Assessment Lifecycle

### 11.1 Initial assessment campaign

1. User selects skills during onboarding.
2. Enforce a maximum of 10 selected skills.
3. Create one `Assessment` of type `INITIAL`.
4. Create one `AssessmentSection` per selected skill.
5. Prepare questions for the first section.
6. Start the first attempt.
7. Serve questions one section at a time.
8. Submit each section independently.
9. Show section result and topic breakdown.
10. Continue to the next section.
11. Mark the campaign completed when all sections are completed.
12. Activate the career journey only after the campaign is completed.

`UserSkill` may be updated after each section submission, but the journey remains `DRAFT` until all sections are complete.

### 11.2 Attempt rules

- One active attempt per section.
- Reloading resumes the active attempt.
- Expired attempts are marked `EXPIRED`.
- A retake creates the next attempt number.
- The V1 retake unit is one skill section.
- Campaign-level retake is out of scope. Create a new campaign only if the product later requires it.

### 11.3 Weekly assessment

- A weekly assessment is also a campaign with one section per skill.
- Sections are derived from mission roadmap skills and revision skills.
- The same attempt and grading engine is used.
- Weekly results update `SkillTopicProgress` and weekly report inputs.
- No manual score submission is allowed.

### 11.4 Resume assessment

- No `RESUME` assessment is created for an active journey.
- Resume updates in profile are read-only evidence.
- `RESUME` remains a legacy type for historical data and possible future explicit verification.
- The current profile assessment panel is removed from the profile flow.

## 12. Resume Isolation

Rules:

- While the journey is `DRAFT`, resume analysis and confirmation may prefill and select skills.
- When the journey is `ACTIVE`, `READINESS`, or `READY`, profile resume upload/analyze/confirm must only update resume data.
- Profile resume updates must not:
  - create or remove `UserSkill`
  - change `currentScore`, `currentLevel`, or `lastAssessmentAt`
  - create an assessment
  - change roadmap items or missions
  - change readiness
  - add resume skills to the current journey
- New resume skills appear as read-only evidence with confidence and evidence text.
- The profile UI must show: “Reference only. Your current journey, scores, and roadmap are unchanged.”
- To use a new resume for a different skill set, the user must explicitly start a new journey or a future re-plan flow.

Backend guards:

- Resume confirmation applies skills only when the journey is `DRAFT`.
- Resume assessment start is rejected for non-`DRAFT` journeys and is deprecated for new use.
- No profile resume endpoint may call `userSkillService`, assessment creation, roadmap, mission, or readiness services.

## 13. API Design

### 13.1 User assessment endpoints

| Method | Path | Description |
| --- | --- | --- |
| POST | `/assessments/initial/start` | Create initial campaign and sections |
| GET | `/assessments/career-journey/:careerJourneyId` | List assessment campaigns |
| GET | `/assessments/:assessmentId` | Campaign summary and section statuses |
| GET | `/assessments/:assessmentId/sections` | List sections |
| POST | `/assessment-sections/:sectionId/attempts` | Start or resume a section attempt |
| GET | `/assessment-attempts/:attemptId` | Attempt state and questions without answer keys |
| PATCH | `/assessment-attempts/:attemptId/answers` | Autosave answers |
| POST | `/assessment-attempts/:attemptId/submit` | Submit and grade the attempt |
| GET | `/assessment-attempts/:attemptId/result` | Result after submission |
| POST | `/assessments/weekly/start` | Create weekly campaign and sections |

Deprecated endpoints:

- `POST /assessments/initial/submit`
- `POST /assessments/weekly/submit`
- `POST /assessments/resume/start`
- `POST /assessments/resume/submit`

Deprecated endpoints may remain temporarily for legacy data but must not accept new manual scores.

### 13.2 Start initial assessment

Request:

```json
{
  "careerJourneyId": "..."
}
```

Response includes:

- assessment id
- type
- status
- sections with skill id, skill name, order, status, question count, and time limit
- first section id

No scores are accepted. If a draft campaign already exists, the existing campaign is returned so onboarding can resume after a reload.

### 13.3 Start or resume an attempt

Request: empty body.

Response:

- attempt id
- section id
- attempt number
- status
- expiresAt
- resumed flag
- questions without answer keys or explanations

Question payload includes:

- assessment question id
- type
- stem
- options
- estimated time
- points

### 13.4 Autosave answers

Request:

```json
{
  "answers": [
    {
      "assessmentQuestionId": "...",
      "selectedOptionKeys": ["..."],
      "numericValue": null,
      "matchingPairs": [],
      "timeSpentSeconds": 42
    }
  ]
}
```

Rules:

- Attempt must belong to the authenticated user.
- Attempt must be `IN_PROGRESS`.
- Unknown questions are rejected.
- Answer shape is validated by question type.

### 13.5 Submit attempt

Request may include final answers. If omitted, the last autosaved answers are graded.

Response:

- attempt score
- max score
- percentage
- correct count
- question count
- duration
- per-skill result
- per-topic breakdown
- per-question correctness and explanation
- weak topics

The answer key is never returned before submit.

### 13.6 Admin endpoints

| Method | Path | Description |
| --- | --- | --- |
| GET | `/admin/skill-topics` | List topics |
| POST | `/admin/skill-topics` | Create topic |
| PATCH | `/admin/skill-topics/:topicId` | Update topic |
| GET | `/admin/questions` | List and filter questions |
| GET | `/admin/questions/:questionId` | Question detail |
| PATCH | `/admin/questions/:questionId` | Edit question and create a new version |
| POST | `/admin/questions/:questionId/approve` | Approve question |
| POST | `/admin/questions/:questionId/reject` | Reject question |
| POST | `/admin/questions/:questionId/retire` | Retire question |
| POST | `/admin/questions/generate` | Queue generation |
| GET | `/admin/question-generation-jobs/:jobId` | Generation job status |
| POST | `/admin/question-generation-jobs/:jobId/retry` | Retry failed job |
| GET | `/admin/questions/stats` | Usage and quality statistics |

All admin routes require `UserRole.ADMIN`.

## 14. Frontend

### 14.1 Onboarding

Replace score entry with:

- skill selection with a 10-skill cap
- assessment overview showing sections
- section runner with progress
- question renderers for all four types
- timer
- autosave indicator
- submit and result screen per section
- final campaign summary

Remove or retire:

- `AssessmentScoreStep`
- `SkillScoreField`
- manual score inputs
- resume skill assessment panel in profile

### 14.2 Profile resume

- Read-only resume evidence card
- resume file metadata
- analyzed skills with evidence and confidence
- confirmation state
- clear “does not affect current journey” notice
- no assess or apply actions

### 14.3 Assessment history

Show:

- campaign type
- section/skill
- attempt number
- score
- date
- time taken
- weak topics
- link to attempt result

### 14.4 Admin panel

- review queue with filters
- question preview
- answer key and explanation
- edit, approve, reject, retire
- bulk approve
- regenerate
- generation job status
- usage and correctness metrics

### 14.5 Accessibility

- Numeric input has an associated unit.
- Matching has a keyboard-accessible alternative to drag-and-drop.
- Multi-select has checkbox semantics.
- Timer is not the only indication of progress.
- Error messages are programmatically associated with inputs.
- Focus states are visible.

## 15. Security and Integrity

- Never send correct answers or explanations before submission.
- Grade only on the server.
- Validate attempt ownership on every read and write.
- Validate answer shape against the question type.
- Use server time for attempt start, expiry, and duration.
- Shuffle question order and option order per attempt.
- Snapshot question content per attempt.
- Avoid serving the same question repeatedly to the same user.
- Rate-limit assessment starts, attempt creation, autosave, submit, and AI generation.
- Admin routes require an admin role middleware.
- Do not include resume text or PII in question-generation prompts.
- Do not log answers, answer keys, or resume text.
- Validate all AI output with Zod before persistence.
- Treat AI output as untrusted content.
- Do not allow admin edits to mutate historical snapshots.

## 16. Migration and Compatibility

- Existing `Assessment` documents remain valid.
- Existing `SkillProgress` documents remain valid.
- Existing manual scores are legacy; do not delete or rewrite them.
- New `SkillProgress` records use `assessmentMethod: INTERNAL`.
- The existing assessment uniqueness rule remains because sections are nested under one campaign.
- Add `IN_PROGRESS` to assessment statuses.
- Add `deliveryMode` and section counters to `Assessment`.
- Keep `RESUME` in the enum for legacy records.
- Remove profile resume assessment behavior and update API documentation.
- Update `docs/API.md` and `docs/ARCHITECTURE.md` when implementation starts.
- If in-progress manual assessments exist at migration time, either allow them to complete read-only or mark them legacy. The recommended assumption is that no live manual assessments exist.

## 17. Phased Delivery Plan

### Phase 0: Confirm assumptions

Deliverables:

- Confirm 10-skill cap.
- Confirm 5 questions per skill.
- Confirm per-section retake.
- Confirm `AI_VALIDATED` questions may be served before admin review.
- Confirm soft timer and attempt expiry.

Exit criteria:

- No unresolved product decision blocks schema work.

### Phase 1: Foundation

Deliverables:

- New enums and constants.
- `SkillTopic` model, repository, validation, and seed.
- `Question` model with type-specific validation.
- `AssessmentSection`, `AssessmentAttempt`, `AssessmentQuestion`, and `AssessmentAnswer` models.
- Indexes and mappers.
- `SkillTopicProgress` and `SkillEvidence` models.
- Additive changes to `Assessment` and `SkillProgress`.

Exit criteria:

- Backend typecheck and build pass.
- Schema and indexes are reviewed.
- Topic taxonomy exists for at least one pilot role.

### Phase 2: Question bank and AI generation

Deliverables:

- Question generation prompt and structured output schema.
- Automatic validation.
- Duplicate detection.
- Question generation job.
- Persistence and status lifecycle.
- Admin question review endpoints.
- Basic admin review UI.

Exit criteria:

- A skill can generate a validated section-sized bank.
- Malformed AI output is rejected.
- Admin can approve, reject, and retire questions.
- No answer key is exposed to normal users.

### Phase 3: Initial assessment runtime

Deliverables:

- Initial campaign creation with one section per selected skill.
- Section attempt start, resume, autosave, expiry, and submit.
- Server-side grading for all four question types.
- `SkillProgress` creation from graded results.
- `UserSkill` updates from the latest submitted section attempt.
- Journey activation only after all sections complete.
- Frontend section runner and result screens.
- Remove manual score entry from initial assessment.

Exit criteria:

- A user can complete a multi-skill initial assessment.
- Each skill has a separate section and score.
- Answers and timing are stored per question.
- No manual score payload is accepted.
- Journey activates only after all sections are complete.

### Phase 4: Skill intelligence

Deliverables:

- Topic mastery aggregation.
- Weak-topic detection.
- Claimed, resume, and assessment evidence comparison.
- Assessment detail and history views.
- Resume evidence remains read-only.
- Readiness consumes validated skill evidence without adding a new weight.

Exit criteria:

- The platform can report a gap such as “Node.js claimed, resume evidence present, async patterns weak.”
- Resume updates do not change scores or readiness.

### Phase 5: Weekly and resume cleanup

Deliverables:

- Weekly assessment campaigns and sections.
- Weekly report receives measured topic gaps.
- Profile resume becomes read-only evidence.
- `RESUME` assessment flow removed from active journeys.
- Deprecated manual endpoints removed or guarded.
- API and architecture documentation updated.

Exit criteria:

- No active flow accepts manually entered marks.
- Profile resume upload produces zero journey mutations.
- Weekly assessments use the same engine.

### Phase 6: Hardening and scale

Deliverables:

- Question exposure controls.
- Item statistics and discrimination metrics.
- Bulk admin operations.
- Rate limits and abuse protection.
- Retry and failure recovery for generation jobs.
- Performance indexes and query review.
- Load and failure-path verification.

Exit criteria:

- Generation failures are recoverable.
- Expired attempts and duplicate submissions are handled.
- Admin can manage question quality at scale.

### Phase 7: Coding assessments

Out of scope for this specification. Revisit after the MCQ engine is stable and the coding IDE is available.

## 18. Acceptance Criteria

The assessment engine is complete when:

- The initial assessment has one section per selected skill.
- Each section has its own questions, timer, attempt, submission, and score.
- All four question types are supported.
- Questions are AI-generated, automatically validated, and reviewable by an admin.
- Every answer is stored per question with correctness and time.
- Scores are computed server-side only.
- No manual score entry exists in any active flow.
- `UserSkill` and `SkillProgress` are updated from graded assessments.
- Topic mastery and weak areas are available.
- Profile resume updates are read-only and do not mutate the current journey.
- Weekly assessments use the same engine.
- Legacy assessments remain readable.
- Answer keys are never exposed before submission.
- Backend lint, typecheck, build, and format checks pass.
- Frontend lint, typecheck, and build pass.

## 19. Risks

| Risk | Impact | Mitigation |
| --- | --- | --- |
| AI answer keys are wrong | Invalid scores | Automatic validation, admin review, retirement, item metrics |
| AI question volume is expensive | Cost and latency | Reuse bank, generate only missing coverage, bounded batches |
| Onboarding becomes too long | Drop-off | 10-skill cap, section-level pause/resume, 5 questions per skill |
| Topic taxonomy sprawls | Unreliable weak areas | Admin-approved topics, stable slugs, no free-text topics |
| Multi-type UI is complex | Bugs and accessibility issues | Build shared question renderer contracts, test each type |
| Retakes inflate scores | Misleading skill confidence | Separate practice from graded attempts, keep history, recency weighting |
| Resume updates mutate journey | Broken trust | Hard guard: profile resume is read-only |
| Admin review is delayed | Unreviewed questions remain live | Auto-validation, review queue priority, usage flags |
| Legacy data conflicts | Migration bugs | Additive schema, keep `MANUAL` legacy, no destructive migration |

## 20. Assumptions to Confirm

1. Initial skill selection is capped at 10.
2. Each skill section contains 5 questions.
3. The retake unit is one skill section; full-campaign retake is out of scope.
4. `AI_VALIDATED` questions may be served before admin approval.
5. Initial sections use a 10-minute soft limit; attempts expire after 2 hours.
6. Multi-select and matching use exact-match scoring with no partial credit.
7. A profile resume update never changes the current journey.
8. `RESUME` assessments are legacy-only for now.

## 21. Documentation Updates Required During Implementation

- `docs/API.md`: new assessment endpoints, deprecated manual endpoints, resume isolation.
- `docs/ARCHITECTURE.md`: assessment engine modules, question bank, AI generation, admin review.
- `backend/AGENTS.md`: no change expected beyond existing rules.
- `frontend/AGENTS.md`: no change expected beyond existing rules.
- `.env.example`: only if a new generation or feature-flag variable is introduced.

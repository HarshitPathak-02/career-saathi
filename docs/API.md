# API Reference

Base URL: `/api/v1`

All responses are JSON. Successful responses use:

```json
{
  "success": true,
  "message": "Human readable message.",
  "data": {}
}
```

Errors return the matching HTTP status with `{ "success": false, "message": "..." }`.

## Authentication

Send the access token on protected routes:

```
Authorization: Bearer <accessToken>
```

The refresh token is an httpOnly cookie named `refreshToken` and is managed by the browser. It is rotated on every refresh.

| Method | Path | Auth | Description |
| --- | --- | --- | --- |
| POST | `/auth/register` | No | Create an account; sets refresh cookie |
| POST | `/auth/login` | No | Sign in; sets refresh cookie |
| POST | `/auth/refresh` | Cookie | Rotate the refresh token and return a new access token |
| GET | `/auth/me` | Yes | Return the current user |
| POST | `/auth/logout` | Cookie | Revoke the presented refresh token and clear the cookie |
| POST | `/auth/logout-all` | Yes | Revoke every refresh token for the user |

## Health

| Method | Path | Auth | Description |
| --- | --- | --- | --- |
| GET | `/health` | No | Liveness probe; returns uptime and timestamp |
| GET | `/health/ready` | No | Readiness probe; `503` when MongoDB is disconnected |

## Career Journeys

| Method | Path | Auth | Description |
| --- | --- | --- | --- |
| POST | `/career-journeys` | Yes | Create a journey from onboarding data |
| GET | `/career-journeys/active` | Yes | Return the active journey |
| GET | `/career-journeys/:careerJourneyId` | Yes | Return a journey |
| PATCH | `/career-journeys/:careerJourneyId` | Yes | Update a draft or active journey |
| DELETE | `/career-journeys/:careerJourneyId` | Yes | Soft-delete a journey |

## Lookup (Master Data)

| Method | Path | Auth | Description |
| --- | --- | --- | --- |
| GET | `/lookup/career-domains` | Yes | List career domains |
| GET | `/lookup/career-domains/:domainId/roles` | Yes | List roles in a domain |
| GET | `/lookup/career-roles/:roleId/skills` | Yes | List skills for a role |

## User Skills

| Method | Path | Auth | Description |
| --- | --- | --- | --- |
| GET | `/user-skills/career-journeys/:careerJourneyId` | Yes | List the user's skills for a journey |
| GET | `/user-skills/career-journeys/:careerJourneyId/available-skills` | Yes | List skills available to select |
| POST | `/user-skills/career-journeys/:careerJourneyId` | Yes | Select skills for a journey |
| PATCH | `/user-skills/career-journeys/:careerJourneyId` | Yes | Update selected skills or proficiency |

## Career Discovery

| Method | Path | Auth | Description |
| --- | --- | --- | --- |
| POST | `/discovery` | Yes | Start a discovery session |
| GET | `/discovery/latest` | Yes | Return the current user's most recent discovery session |
| GET | `/discovery/:discoveryId` | Yes | Return a discovery session |
| POST | `/discovery/:discoveryId/answers` | Yes | Add an answer and receive the next assistant message |
| POST | `/discovery/:discoveryId/generate` | Yes | Generate career candidates and complete discovery |
| GET | `/discovery/:discoveryId/messages` | Yes | List the discovery conversation |
| GET | `/discovery/:discoveryId/candidates` | Yes | List proposed career candidates |
| POST | `/discovery/:discoveryId/candidates` | Yes | Add a career candidate |
| PATCH | `/discovery/:discoveryId/candidates/:candidateId/select` | Yes | Choose a career direction and link it to the journey |

`POST /discovery` accepts an optional `careerJourneyId`:

```json
{
  "careerJourneyId": "..."
}
```

`POST /discovery/:discoveryId/answers` accepts:

```json
{
  "questionKey": "answer_1",
  "answer": "I am studying computer science.",
  "answerType": "free_text"
}
```

Discovery always uses Groq, regardless of `AI_PROVIDER`; every other AI feature uses the app-wide configured provider. Discovery is an adaptive counseling conversation, not a fixed questionnaire: the assistant asks one question at a time, follows up on vague answers, covers background, interests, strengths, work style, values, constraints, and goals, and decides when it has enough signal. It must collect at least 6 answers before recommending careers and is forced to finish at 12. Assistant turns are requested as structured JSON with `message`, `isReadyForRecommendations`, and `coveredTopics`. Once ready, the session moves to `generating`; adding another answer returns `409` with `"Career discovery is already ready for recommendations."` If the provider fails, returns invalid output, or returns an empty message, the API stores a deterministic counseling question instead. Answering a completed session returns `409` with `"Career discovery is already completed."`

`POST /discovery/:discoveryId/generate` is available once the session reaches `generating`, which happens after 6–12 answers or when the counselor decides it has enough context. It asks Groq to choose one to three roles from the active career-role catalog, validates the returned slugs and rationales, persists the candidates, and marks the session `completed`. If AI generation fails, the API falls back to catalog candidates. Calling it on an already completed session returns the existing session.

Candidate responses include `careerDomainName` and `careerRoleName` alongside the domain and role ids. `GET /discovery/latest` returns the most recent session for the authenticated user, or `data: null` when none exists. Starting discovery, adding answers, and generating candidates are rate-limited to 30 requests per 15 minutes per user.

`PATCH /discovery/:discoveryId/candidates/:candidateId/select` marks one candidate `selected`, marks the other candidates in that session `rejected`, updates the linked career journey's domain and role, and returns `candidate` plus `careerJourneyId`. If the user started discovery before creating a journey, selection creates a `DRAFT` journey with default preferences (`targetCompany: ""`, `targetDurationMonths: 6`, `dailyStudyHours: 2`, `preferredLanguage: "english"`) in the same transaction. Selection is idempotent. It returns `409` with `"Career direction is locked after the initial assessment starts."` once an initial assessment exists or the journey is no longer `DRAFT`. The seeded master-data catalog includes backend, frontend, data, design, and digital-marketing domains so discovery can recommend multiple role directions.

## Assessments

| Method | Path | Auth | Description |
| --- | --- | --- | --- |
| POST | `/assessments/initial/start` | Yes | Create the initial assessment campaign and its skill sections |
| GET | `/assessments/:assessmentId/sections` | Yes | List campaign sections with status and scores |
| POST | `/assessment-sections/:sectionId/attempts` | Yes | Start or resume a section attempt |
| GET | `/assessment-attempts/:attemptId` | Yes | Return attempt state, questions, and saved answers |
| PATCH | `/assessment-attempts/:attemptId/answers` | Yes | Autosave answers for an attempt |
| POST | `/assessment-attempts/:attemptId/submit` | Yes | Submit an attempt and receive the computed result |
| POST | `/assessments/weekly/start` | Yes | Start a legacy weekly assessment |
| POST | `/assessments/weekly/submit` | Yes | Submit legacy weekly scores (deprecated; use the engine for new flows) |
| GET | `/assessments/career-journey/:careerJourneyId` | Yes | List assessments for a journey |
| GET | `/assessments/:assessmentId` | Yes | Return an assessment |
| GET | `/assessments/:assessmentId/details` | Yes | Return an assessment with scores |
| GET | `/assessments/:assessmentId/weekly-plan` | Yes | Return the weekly plan for an assessment |
| POST | `/assessments/initial/submit` | Yes | Retired manual endpoint; returns `410` |
| POST | `/assessments/resume/start` | Yes | Retired manual endpoint; returns `410` |
| POST | `/assessments/resume/submit` | Yes | Retired manual endpoint; returns `410` |

`POST /assessments/initial/start` accepts only `{ "careerJourneyId": "..." }` and requires a `DRAFT` journey. It creates one section per skill selected by the user. If a draft campaign already exists, the existing campaign is returned so onboarding can resume after a reload. The request never accepts marks or scores, and the response returns `assessmentId`, `sectionCount`, `firstSectionId`, and the section summaries.

Starting an attempt returns the section questions without answer keys or explanations and includes any answers already autosaved for that attempt, plus the attempt `startedAt` and `expiresAt` timestamps used by the section timer. An in-progress attempt is resumed until it expires; after expiry, a new attempt number is created. A completed section can be retaken, which creates the next attempt.

Autosave and submit accept answers in this shape:

```json
{
  "answers": [
    {
      "assessmentQuestionId": "...",
      "selectedOptionKeys": ["A"],
      "numericValue": null,
      "matchingPairs": [{ "leftKey": "L1", "rightKey": "R1" }]
    }
  ]
}
```

Single-choice and multi-select use `selectedOptionKeys`, numeric questions use `numericValue`, and matching questions use `matchingPairs`. Multi-select and matching are graded by exact match with no partial credit. The server computes all scores; submit returns per-question correctness and explanations plus topic mastery and weak-topic signals. The initial journey activates only after every section is complete.

The engine serves `AI_VALIDATED` and `ADMIN_APPROVED` questions. Answer keys and explanations are never returned before submission.

## Roadmaps

| Method | Path | Auth | Description |
| --- | --- | --- | --- |
| POST | `/roadmaps/generate` | Yes | Generate a roadmap for a journey |
| GET | `/roadmaps/career-journey/:careerJourneyId` | Yes | Return the latest roadmap |
| GET | `/roadmaps/:roadmapId/items` | Yes | List roadmap items |
| POST | `/roadmaps/:careerJourneyId/adaptive` | Yes | Generate an adaptive roadmap update |

## Missions

| Method | Path | Auth | Description |
| --- | --- | --- | --- |
| POST | `/missions/:careerJourneyId` | Yes | Create the first mission |
| POST | `/missions/:careerJourneyId/next` | Yes | Create the next mission |
| GET | `/missions/career-journey/:careerJourneyId/current` | Yes | Return the active mission |
| GET | `/missions/career-journey/:careerJourneyId/latest` | Yes | Return the latest mission |
| GET | `/missions/career-journey/:careerJourneyId/history` | Yes | List all missions |
| GET | `/missions/:missionId` | Yes | Return a mission |

## Daily Tasks

| Method | Path | Auth | Description |
| --- | --- | --- | --- |
| GET | `/daily-tasks/mission/:missionId` | Yes | List tasks for a mission |
| GET | `/daily-tasks/:taskId` | Yes | Return a task |
| PATCH | `/daily-tasks/:taskId/complete` | Yes | Mark a task complete |
| PATCH | `/daily-tasks/:taskId/pending` | Yes | Move a task back to pending |
| PATCH | `/daily-tasks/:taskId/skip` | Yes | Skip a task |

## Weekly Reviews and Reports

| Method | Path | Auth | Description |
| --- | --- | --- | --- |
| GET | `/weekly-reviews/current` | Yes | Return the current unfinished review |
| POST | `/weekly-reviews/submit` | Yes | Submit the weekly reflection |
| GET | `/weekly-reports/:careerJourneyId/latest` | Yes | Return the latest weekly report |
| GET | `/weekly-reports/:careerJourneyId` | Yes | List weekly reports |
| GET | `/weekly-reports/report/:reportId` | Yes | Return a weekly report |

## Monthly Reports

| Method | Path | Auth | Description |
| --- | --- | --- | --- |
| GET | `/monthly-reports/:careerJourneyId/due-status` | Yes | Check whether a monthly report is due |
| POST | `/monthly-reports/:careerJourneyId/generate` | Yes | Generate a monthly report |
| GET | `/monthly-reports/:careerJourneyId/latest` | Yes | Return the latest monthly report |
| GET | `/monthly-reports/:careerJourneyId/history` | Yes | List monthly reports |
| GET | `/monthly-reports/:careerJourneyId/:reportNumber` | Yes | Return a report by number |

## Mock Interviews

| Method | Path | Auth | Description |
| --- | --- | --- | --- |
| POST | `/mock-interviews` | Yes | Record a mock interview result |
| GET | `/mock-interviews/career-journeys/:careerJourneyId` | Yes | List mock interviews for a journey |

## Readiness

| Method | Path | Auth | Description |
| --- | --- | --- | --- |
| GET | `/readiness/:careerJourneyId` | Yes | Return the current readiness report |
| POST | `/readiness/:careerJourneyId/evaluate` | Yes | Evaluate readiness and update journey state |

## Resume

| Method | Path | Auth | Description |
| --- | --- | --- | --- |
| POST | `/resume` | Yes | Upload a PDF/DOCX resume (`multipart/form-data`) and extract its text |
| GET | `/resume` | Yes | List the user's resumes |
| GET | `/resume/:resumeId` | Yes | Return a resume and its latest analysis |
| GET | `/resume/career-journey/:careerJourneyId` | Yes | Return the resume for a journey |
| POST | `/resume/:resumeId/analyze` | Yes | Extract skills from the stored resume text |
| POST | `/resume/:resumeId/skills/confirm` | Yes | Confirm analyzed skills and select matching user skills |
| DELETE | `/resume/:resumeId` | Yes | Soft-delete a resume |

Upload accepts `application/pdf` and DOCX only, up to 5 MB. Invalid file types return `400`; oversized files return `413`. Text extraction rejects scanned or unreadable resumes with `422`. File storage identifiers and the extracted resume text are never returned.

`POST /resume/:resumeId/skills/confirm` accepts the final set of accepted skills:

```json
{
  "skillCatalogIds": ["..."]
}
```

Confirmation requires an analyzed resume. Selected ids must be matched skills from that resume; an empty array records a confirmation with no accepted skills. Existing scores, levels, and assessment dates are never changed.

While the journey is `DRAFT`, confirmation initializes the journey's `UserSkill` records and makes the confirmed resume skills the exact selected set, so onboarding can skip manual selection. For an active journey, confirmation only records resume evidence and does not create or remove `UserSkill` records, change scores or assessment dates, create assessments, or alter the roadmap. The profile card is reference-only and displays the current journey unchanged.

`RESUME` assessments are legacy-only. `POST /assessments/resume/start` and `POST /assessments/resume/submit` are retired and return `410`. New skill verification happens through the section-based assessment engine.

`POST /resume/:resumeId/analyze` moves the resume through `ANALYZING` to `ANALYZED` or `ANALYSIS_FAILED`. An analysis stuck in `ANALYZING` for more than ten minutes is treated as interrupted and can be retried. The response contains normalized skill matches and evidence:

```json
{
  "success": true,
  "message": "Resume analyzed successfully.",
  "data": {
    "id": "...",
    "status": "ANALYZED",
    "analysis": {
      "provider": "GEMINI",
      "model": "gemini-2.5-flash",
      "analyzedAt": "2026-10-29T00:00:00.000Z",
      "textLength": 4200,
      "skills": [
        {
          "skillCatalogId": "...",
          "name": "JavaScript",
          "slug": "javascript",
          "evidence": "Built REST APIs with JavaScript and Node.js",
          "confidence": 0.94,
          "matched": true
        }
      ]
    },
    "analysisError": null,
    "confirmation": {
      "skillCatalogIds": ["..."],
      "newSkillCatalogIds": ["..."],
      "confirmedAt": "2026-10-29T00:05:00.000Z"
    }
  }
}
```

## Workspace

| Method | Path | Auth | Description |
| --- | --- | --- | --- |
| GET | `/workspace` | Yes | Aggregated dashboard: journey, roadmap, mission, tasks, progress, streak |

The workspace payload drives the UI state: target details, overview counters, available actions, active mission, today's task, and lifecycle information.

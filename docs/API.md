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

## Assessments

| Method | Path | Auth | Description |
| --- | --- | --- | --- |
| POST | `/assessments/initial/start` | Yes | Start the initial assessment |
| POST | `/assessments/initial/submit` | Yes | Submit initial assessment scores |
| POST | `/assessments/weekly/start` | Yes | Start a weekly assessment |
| POST | `/assessments/weekly/submit` | Yes | Submit a weekly assessment |
| GET | `/assessments/career-journey/:careerJourneyId` | Yes | List assessments for a journey |
| GET | `/assessments/:assessmentId` | Yes | Return an assessment |
| GET | `/assessments/:assessmentId/details` | Yes | Return an assessment with scores |
| GET | `/assessments/:assessmentId/weekly-plan` | Yes | Return the weekly plan for an assessment |

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
| POST | `/resume` | Yes | Upload a resume (`multipart/form-data`) |
| GET | `/resume` | Yes | List the user's resumes |
| GET | `/resume/:resumeId` | Yes | Return a resume |
| GET | `/resume/career-journey/:careerJourneyId` | Yes | Return resumes for a journey |
| DELETE | `/resume/:resumeId` | Yes | Soft-delete a resume |

## Workspace

| Method | Path | Auth | Description |
| --- | --- | --- | --- |
| GET | `/workspace` | Yes | Aggregated dashboard: journey, roadmap, mission, tasks, progress, streak |

The workspace payload drives the UI state: target details, overview counters, available actions, active mission, today's task, and lifecycle information.

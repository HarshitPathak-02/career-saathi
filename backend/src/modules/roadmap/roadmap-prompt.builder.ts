import { RoadmapGenerationInput } from "./roadmap.types.js";

class RoadmapPromptBuilder {
    build(
        input: RoadmapGenerationInput
    ): string {

        return `
You are an expert software engineering career mentor and technical architect.

Your responsibility is to create a personalized career roadmap that helps a student become job-ready for their target role.

The roadmap will later be converted into weekly missions by another AI system.

Therefore, generate only the roadmap.

------------------------------------------------------------
IMPORTANT RULES
------------------------------------------------------------

1. Return ONLY valid JSON.
2. Do NOT use markdown.
3. Do NOT wrap the response inside triple backticks.
4. Do NOT explain anything outside the JSON.
5. Do NOT generate weeks.
6. Do NOT generate phases.
7. Do NOT generate sections.
8. Do NOT group roadmap items.
9. Return one flat ordered roadmap.
10. Each roadmap item must represent EXACTLY ONE actionable milestone.
11. Each TOPIC must represent ONLY ONE technology, framework, concept or tool.
12. Never combine multiple technologies into one roadmap item.
13. Roadmap items must progress from beginner to advanced.
14. Orders must start from 1.
15. Orders must be sequential.
16. Do not skip order numbers.
17. Every roadmap item must use one of the allowed roadmap item types.
18. Never generate fields that are not part of the JSON schema.
19. Do NOT generate estimatedWeeks. The backend calculates it automatically.
20. Every TOPIC must be selected ONLY from the Available Skill Catalog.
21. Every TOPIC must return the exact skillId and title from the selected catalog entry.
22. Never invent, rename or modify a technical skill.
23. PROJECT, REVISION, ASSESSMENT, MOCK_INTERVIEW, RESUME, PORTFOLIO and JOB_APPLICATION must NOT contain skillId.
24. Non-technical roadmap items may be inserted anywhere if they improve the learning sequence.
25. Preserve a logical beginner-to-advanced progression even when inserting projects, revisions or assessments.
26. The Available Skill Catalog is the only source of truth for all technical skills.
27. A PROJECT may only use technical skills that have already appeared as TOPIC items earlier in the roadmap.
28. Never reference a technical skill that has not yet been introduced.

------------------------------------------------------------
Student Profile
------------------------------------------------------------

Target Role:
${input.target.role}

Target Domain:
${input.target.domain}

Target Duration:
${input.target.durationMonths} months

Daily Study Hours:
${input.target.dailyStudyHours}

Current Skills:
${JSON.stringify(input.currentSkills, null, 2)}

Required Skills:
${JSON.stringify(input.requiredSkills, null, 2)}


------------------------------------------------------------
Available Skill Catalog
------------------------------------------------------------

${JSON.stringify(input.availableSkills, null, 2)}

Every TOPIC must be selected ONLY from this catalog.

Each catalog entry includes

- skillId
- title
- category
- difficulty
- description

When selecting TOPIC roadmap items

• Prefer logical prerequisite ordering.

• Use difficulty to determine learning progression.

• Use category and description to understand the purpose of each skill.

• Copy the selected skillId exactly.

• Copy the selected title exactly.

• Never invent a new technical skill.

• Never rename a technical skill.

• Never modify the title of a selected skill.

The Available Skill Catalog contains ONLY technical skills.

Non-technical roadmap items such as PROJECT, REVISION, ASSESSMENT, MOCK_INTERVIEW, RESUME, PORTFOLIO and JOB_APPLICATION are NOT part of this catalog.

Generate these non-technical roadmap items wherever they best fit the learning progression while keeping the roadmap logically ordered from beginner to advanced.

------------------------------------------------------------
Personalization Rules
------------------------------------------------------------

Use the student's existing skills to personalize the roadmap.

If the student already has experience in a technology,

- do not teach it again from scratch,
- instead introduce advanced concepts,
- best practices,
- production patterns,
- optimization techniques,
- or practical projects.

Prioritize missing skills from the required skills list.

When choosing TOPIC roadmap items:

- Choose from the Available Skill Catalog only.
- Prefer missing skills before already mastered skills.
- If a student already knows a skill, choose more advanced topics from the catalog instead of repeating beginner concepts.

The roadmap should bridge the gap between the student's current skills and the target role.

Avoid adding unnecessary beginner topics that the student already knows.

The Available Skill Catalog contains ONLY technical skills.

Non-technical roadmap items such as PROJECT, REVISION, ASSESSMENT, MOCK_INTERVIEW, RESUME, PORTFOLIO and JOB_APPLICATION are NOT part of the catalog.

Generate these items wherever they best fit the learning progression.

The final roadmap must remain logically ordered from beginner to advanced.


------------------------------------------------------------
Roadmap Item Types
------------------------------------------------------------

TOPIC

Represents exactly ONE technical skill.

Every TOPIC MUST be selected from the Available Skill Catalog.

A TOPIC is NOT allowed to invent a new technical skill.

For every TOPIC

- Select exactly one catalog entry.
- Copy the skillId exactly.
- Copy the title exactly.
- Do not rename the title.
- Do not expand the title.
- Do not shorten the title.
- Do not change capitalization.
- Never generate technical skills outside the Available Skill Catalog.
- The Available Skill Catalog contains ONLY technical skills.
- PROJECT, REVISION, ASSESSMENT, MOCK_INTERVIEW, RESUME, PORTFOLIO and JOB_APPLICATION are NOT part of the catalog.
- Generate these non-technical roadmap items wherever they best fit the learning progression.
- Do NOT assign skillId to any non-technical roadmap item.

GOOD

Catalog

Catalog

{
    "skillId":"687...",
    "title":"JavaScript",
    "category":"Programming Language",
    "difficulty":"BEGINNER",
    "description":"Modern JavaScript programming language."
}

Return

Return

{
    "order": 1,
    "type": "TOPIC",
    "skillId": "687...",
    "title": "JavaScript",
    "description": "Learn modern JavaScript fundamentals.",
    "estimatedHours": 12,
    "aiReason": "Foundation for backend development.",
    "metadata": {}
}

BAD

JavaScript Fundamentals

BAD

Advanced JavaScript

BAD

Modern JavaScript

BAD

Node + Express

------------------------------------------------------------

PROJECT

Represents ONE practical implementation milestone.

A project should combine previously learned topics.

Examples

- Build Todo REST API
- Build Authentication API
- Build Blog Backend
- Build URL Shortener
- Build Ecommerce Backend

Do not combine multiple unrelated projects into one roadmap item.

------------------------------------------------------------

REVISION

Represents revision of previously learned concepts.

------------------------------------------------------------

ASSESSMENT

Represents a technical assessment or coding evaluation.

------------------------------------------------------------

MOCK_INTERVIEW

Represents interview preparation.

------------------------------------------------------------

RESUME

Represents improving the resume.

------------------------------------------------------------

PORTFOLIO

Represents improving the portfolio.

------------------------------------------------------------

JOB_APPLICATION

Represents applying for jobs.

------------------------------------------------------------
Roadmap Design Principles
------------------------------------------------------------

The roadmap should

- Begin with prerequisite knowledge.

- Progress gradually from fundamentals to advanced concepts.

- Introduce projects after sufficient learning.

- Insert revision after major learning milestones.

- Insert assessments periodically.

- Include resume improvement after meaningful project work.

- Include portfolio improvement after multiple completed projects.

- Include mock interviews near the end.

- Include job applications at the final stage.

- Projects should be inserted immediately after enough prerequisite skills have been learned.

- Assessments, revisions and projects should appear naturally throughout the roadmap instead of only near the end.

- Focus on quality instead of quantity.

- Generate only meaningful milestones.

------------------------------------------------------------
Estimated Hours Guidelines
------------------------------------------------------------

Estimate the learning effort realistically.

TOPIC

Simple topic:
4–8 hours

Examples

- Git Basics
- HTTP Methods
- JSON

Intermediate topic:
8–16 hours

Examples

- JavaScript
- Express.js
- MongoDB
- JWT
- Docker

Advanced topic:
16–30 hours

Examples

- Authentication Architecture
- System Design Basics
- Distributed Caching
- Message Queues

------------------------------------------------------------

PROJECT

Small project:
20–40 hours

Examples

- Todo REST API
- URL Shortener
- Notes API

Medium project:
40–70 hours

Examples

- Ecommerce Backend
- Blog Platform
- Authentication Service

Large project:
70–120 hours

Examples

- Learning Management System
- Job Portal Backend
- Multi-tenant SaaS Backend

------------------------------------------------------------

REVISION

2–6 hours

------------------------------------------------------------

ASSESSMENT

2–6 hours

------------------------------------------------------------

RESUME

2–4 hours

------------------------------------------------------------

PORTFOLIO

4–8 hours

------------------------------------------------------------

MOCK_INTERVIEW

2–4 hours

------------------------------------------------------------

JOB_APPLICATION

1–2 hours

------------------------------------------------------------

Use these ranges as guidance.

Estimate hours based on the complexity of the roadmap item.

Avoid unrealistic estimates.



------------------------------------------------------------
Conciseness Rules
------------------------------------------------------------

The roadmap is a high-level learning blueprint.

It is NOT detailed study material.

Every roadmap item should be concise.

Title

- Prefer 2 to 6 words.

Description

- Exactly one short sentence.

AI Reason

- Exactly one short sentence.

Avoid unnecessary explanations.

If the response becomes large, shorten descriptions and AI reasons instead of reducing roadmap quality.

------------------------------------------------------------
JSON Schema
------------------------------------------------------------

Return EXACTLY this structure.

{
  "version": 1,
  "title": "Backend Developer Roadmap",
  "roadmapItems": [
    {
      "order": 1,
      "type": "TOPIC",
      "skillId":"687abc123",
      "title": "JavaScript",
      "description": "Learn modern JavaScript fundamentals.",
      "estimatedHours": 12,
      "aiReason": "Foundation for backend development.",
      "metadata": {}
    },
    {
      "order":5,
      "type":"PROJECT",
      "title":"Build Todo REST API",
      "description":"...",
      "estimatedHours":28,
      "aiReason":"...",
      "metadata":{}
    }
  ]
}

------------------------------------------------------------
Validation Rules
------------------------------------------------------------

Every roadmap item MUST contain

- order
- type
- title
- description
- estimatedHours
- aiReason
- metadata

Never generate any additional fields.

TOPIC items MUST contain
- skillId


PROJECT
REVISION
ASSESSMENT
MOCK_INTERVIEW
RESUME
PORTFOLIO
JOB_APPLICATION

MUST NOT contain

- skillId

Return ONLY the JSON object.
`;
    }
}

export const roadmapPromptBuilder =
    new RoadmapPromptBuilder();
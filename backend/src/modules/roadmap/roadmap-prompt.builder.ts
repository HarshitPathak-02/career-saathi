import {
  RoadmapGenerationInput,
} from "./roadmap.types.js";

class RoadmapPromptBuilder {

  build(
    input: RoadmapGenerationInput
  ): string {

    const currentSkills = input.currentSkills.map(skill => ({
      skillId: skill.skillId,
      skillName: skill.skillName,
      currentLevel: skill.currentLevel,
    }));

    const requiredSkills = input.requiredSkills.map(skill => ({
      skillId: skill.skillId,
      skillName: skill.skillName,
    }));

    const availableSkills = input.availableSkills.map(skill => ({
      skillId: skill.skillId,
      title: skill.title,
      category: skill.category,
      difficulty: skill.difficulty,
    }));

    return `
You are an expert software engineering career mentor.

Generate a personalized technical learning roadmap for the student's target role.

The roadmap is responsible ONLY for:
- learning technical skills
- building practical projects
- improving the technical portfolio

Other CareerSaathi workflows handle missions, revision, assessments, interviews, resume work, readiness evaluation, and job applications.

Return ONLY valid JSON. No markdown or explanations.

==================================================
STUDENT
==================================================

Target:
${JSON.stringify({
      role: input.target.role,
      domain: input.target.domain,
      durationMonths: input.target.durationMonths,
      dailyStudyHours: input.target.dailyStudyHours,
    })}

Current Skills:
${JSON.stringify(currentSkills)}

Required Skills:
${JSON.stringify(requiredSkills)}

Available Skill Catalog:
${JSON.stringify(availableSkills)}

==================================================
SKILL CATALOG RULE
==================================================

The Available Skill Catalog contains HIGH-LEVEL technical skills.

It is NOT a detailed curriculum.

For example, the catalog may contain:

{
  "skillId": "nodejs-id",
  "title": "Node.js"
}

The roadmap may decompose that skill into multiple learning topics such as:

- Node.js Runtime Fundamentals
- Node.js Asynchronous Programming
- Node.js Event Loop and Concurrency
- Node.js Streams and Buffers

All such topics MUST use:

"skillId": "nodejs-id"

Therefore:

- skillId MUST come from the Available Skill Catalog.
- Never invent a skillId.
- A single catalog skill may produce multiple TOPIC items.
- TOPIC titles may be more specific than the catalog title.
- Do not create new catalog skills.
- Do not require every learning concept to exist in the catalog.

==================================================
ADAPTIVE ROADMAP
==================================================

Use Current Skills, Required Skills, assessment level, target role, duration, and daily study hours to determine the roadmap.

For every required skill:

1. Determine the student's current level.
2. Determine the required level for the target role.
3. Identify the competency gap.
4. Decompose the gap into meaningful technical TOPICs.
5. Order topics according to prerequisites.
6. Stop when the required competency has been reasonably covered.

Strong existing knowledge should reduce unnecessary fundamentals.

Weak knowledge should receive sufficient foundational, intermediate, and advanced coverage.

Do NOT compress an entire technology into one broad TOPIC.

Do NOT create artificial topics merely to increase item count.

The number of roadmap items should emerge from the student's actual skill gaps.

==================================================
ALLOWED TYPES
==================================================

Only these types are allowed:

TOPIC
PROJECT
PORTFOLIO

Return one flat ordered roadmap.

Orders must start at 1 and be sequential.

==================================================
TOPIC
==================================================

TOPIC represents ONE meaningful technical learning unit.

Every TOPIC MUST contain:

- skillId
- title
- description
- estimatedHours
- aiReason
- metadata

skillId MUST exactly match a skillId from the Available Skill Catalog.

The title represents the specific competency being learned within that high-level skill.

Example:

Catalog skill:
Node.js

Possible topics:

- Node.js Runtime Fundamentals
- Node.js Modules and Package Management
- Node.js Asynchronous Programming
- Node.js Event Loop and Concurrency
- Node.js Error Handling

All use the same Node.js skillId.

Do not combine unrelated concepts into one TOPIC.

==================================================
PROJECT
==================================================

PROJECT represents ONE coherent practical implementation milestone.

A project may use:

- Current Skills
- skills introduced by earlier TOPICs

A project must appear only after sufficient prerequisites have been introduced.

Projects should be relevant to the target role and strengthen practical ability.

PROJECT MUST NOT contain skillId.

==================================================
PORTFOLIO
==================================================

PORTFOLIO represents professional presentation of completed technical work.

It may include:

- README/documentation
- architecture documentation
- technical decisions
- API documentation
- deployment documentation
- professional project presentation

Generate PORTFOLIO only after meaningful project work exists.

PORTFOLIO MUST NOT contain skillId.

==================================================
ESTIMATED HOURS
==================================================

Use realistic estimates.

TOPIC:
- simple: 4-8 hours
- intermediate: 8-16 hours
- advanced: 16-30 hours

PROJECT:
- small: 20-40 hours
- medium: 40-70 hours
- large: 70-120 hours

PORTFOLIO:
- normally 4-8 hours

Keep the total effort reasonably compatible with the student's duration and daily study hours.

==================================================
OUTPUT
==================================================

Return exactly:

{
  "version": 1,
  "title": "Roadmap title",
  "roadmapItems": [
    {
      "order": 1,
      "type": "TOPIC",
      "skillId": "exact-catalog-skill-id",
      "title": "Specific Learning Topic",
      "description": "One concise sentence.",
      "estimatedHours": 10,
      "aiReason": "One concise sentence.",
      "metadata": {}
    },
    {
      "order": 2,
      "type": "PROJECT",
      "title": "Project Title",
      "description": "One concise sentence.",
      "estimatedHours": 30,
      "aiReason": "One concise sentence.",
      "metadata": {}
    },
    {
      "order": 3,
      "type": "PORTFOLIO",
      "title": "Portfolio Documentation",
      "description": "One concise sentence.",
      "estimatedHours": 5,
      "aiReason": "One concise sentence.",
      "metadata": {}
    }
  ]
}

==================================================
FINAL VALIDATION
==================================================

Every item MUST contain:

- order
- type
- title
- description
- estimatedHours
- aiReason
- metadata

TOPIC additionally MUST contain skillId.

PROJECT and PORTFOLIO MUST NOT contain skillId.

Allowed types:
TOPIC, PROJECT, PORTFOLIO.

Every TOPIC skillId MUST exist in the Available Skill Catalog.

PROJECTs must depend only on Current Skills or skills introduced by earlier TOPICs.

PORTFOLIO must follow meaningful project work.

Orders must be sequential starting from 1.

estimatedHours must be positive.

metadata MUST always be {}.

description and aiReason must each be exactly one concise sentence.

Return ONLY the final JSON object.
`;
  }
}

export const roadmapPromptBuilder =
  new RoadmapPromptBuilder();
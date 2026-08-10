import {
  RoadmapGenerationInput,
} from "./roadmap.types.js";

class RoadmapPromptBuilder {

  build(
    input: RoadmapGenerationInput
  ): string {

    const currentSkills =
      input.currentSkills.map(
        skill => ({
          skillId:
            skill.skillId,

          skillName:
            skill.skillName,

          currentLevel:
            skill.currentLevel,
        })
      );

    const requiredSkills =
      input.requiredSkills.map(
        skill => ({
          skillId:
            skill.skillId,

          skillName:
            skill.skillName,
        })
      );

    const availableSkills =
      input.availableSkills.map(
        skill => ({
          skillId:
            skill.skillId,

          title:
            skill.title,

          category:
            skill.category,

          difficulty:
            skill.difficulty,
        })
      );

    return `
You are an expert software engineering career mentor.

Generate a personalized technical learning roadmap for the student's target role.

The roadmap is responsible ONLY for:

- learning technical skills
- building practical projects
- improving the technical portfolio

Other CareerSaathi workflows handle missions, revision, assessments, interviews, resume work, readiness evaluation, and job applications.

Return ONLY valid JSON.
Do not use markdown.
Do not provide explanations outside the JSON.

==================================================
STUDENT
==================================================

Target:

${JSON.stringify({
      role:
        input.target.role,

      domain:
        input.target.domain,

      durationMonths:
        input.target.durationMonths,

      dailyStudyHours:
        input.target.dailyStudyHours,
    })}

Current Skills:

${JSON.stringify(currentSkills)}

Required Skills:

${JSON.stringify(requiredSkills)}

Available Skill Catalog:

${JSON.stringify(availableSkills)}

==================================================
SKILL CATALOG
==================================================

The Available Skill Catalog contains HIGH-LEVEL technical skills.

It is NOT a detailed curriculum.

The catalog is the source of truth for skill identity.

For example, the catalog may contain:

{
    "skillId": "nodejs-id",
    "title": "Node.js"
}

The roadmap may decompose this high-level skill into multiple meaningful TOPICs, such as:

- Node.js Runtime Fundamentals
- Node.js Asynchronous Programming
- Node.js Event Loop and Concurrency
- Node.js Error Handling
- Node.js Streams

All of these TOPICs must use:

"skillId": "nodejs-id"

Rules:

- Every TOPIC skillId MUST come from the Available Skill Catalog.
- Never invent a skillId.
- Never create a new catalog skill.
- A single catalog skill MAY produce multiple TOPICs.
- TOPIC titles MAY be more specific than the catalog title.
- The catalog does not need to contain every individual learning concept.

==================================================
PERSONALIZATION
==================================================

Use:

- Current Skills
- Required Skills
- Current skill levels
- Target role
- Target domain
- Target duration
- Daily study hours

to determine the roadmap.

For each relevant required skill:

1. Determine the student's current level.
2. Determine the level needed for the target role.
3. Identify the important competency gaps.
4. Decompose those gaps into meaningful TOPICs.
5. Order topics according to prerequisites.
6. Stop when the required competency has been reasonably covered.

If the student already has strong knowledge of a skill:

- avoid unnecessary fundamentals
- focus on missing or advanced competencies

If the student has weak knowledge:

- include the necessary foundational concepts
- progress through intermediate concepts
- include advanced concepts when required

Do not unnecessarily reteach skills the student already knows.

Do not compress a substantial skill gap into one overly broad TOPIC.

Do not create artificial TOPICs merely to increase the number of roadmap items.

The number of roadmap items should naturally result from the student's actual skill gaps.

==================================================
ROADMAP STRUCTURE
==================================================

Allowed types are ONLY:

- TOPIC
- PROJECT
- PORTFOLIO

Return one flat ordered roadmap.

Do NOT generate:

- weeks
- phases
- sections
- daily missions
- weekly missions
- revision
- assessments
- mock interviews
- resume tasks
- job applications
- readiness evaluations

Orders must start at 1 and be sequential.

==================================================
TOPIC
==================================================

A TOPIC represents ONE meaningful technical learning competency.

Every TOPIC MUST contain:

- skillId
- title
- description
- estimatedHours
- aiReason
- metadata

The skillId MUST exactly match a skillId from the Available Skill Catalog.

The title represents the specific competency being learned within that catalog skill.

For example, if the catalog contains:

Node.js

the roadmap may contain:

- Node.js Runtime Fundamentals
- Node.js Asynchronous Programming
- Node.js Event Loop and Concurrency
- Node.js Error Handling
- Node.js Streams

All of these must use the same Node.js skillId.

Do not combine unrelated technical concepts into one TOPIC.

==================================================
PROJECT
==================================================

A PROJECT represents ONE coherent practical implementation milestone.

A PROJECT may use:

- skills already present in Current Skills
- skills introduced by earlier TOPICs

A PROJECT must appear only after its important prerequisites are available.

Projects must:

- be relevant to the target role
- apply previously learned skills
- provide meaningful practical experience
- represent one coherent technical outcome

PROJECT MUST NOT contain skillId.

==================================================
PORTFOLIO
==================================================

A PORTFOLIO represents professional presentation of completed technical work.

It may include:

- README/documentation
- architecture documentation
- technical decisions
- API documentation
- deployment documentation
- project presentation

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

Use the student's current level, topic complexity, target role, target duration, and daily study hours when estimating effort.

Keep the overall roadmap reasonably compatible with the student's available study time.

==================================================
OUTPUT
==================================================

Return exactly this structure:

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
FINAL RULES
==================================================

Every roadmap item MUST contain:

- order
- type
- title
- description
- estimatedHours
- aiReason
- metadata

TOPIC additionally MUST contain skillId.

PROJECT and PORTFOLIO MUST NOT contain skillId.

Every TOPIC skillId MUST exist in the Available Skill Catalog.

PROJECTs may depend only on Current Skills or skills introduced by earlier TOPICs.

PORTFOLIO must follow meaningful project work.

Orders must start at 1 and remain sequential.

estimatedHours must be positive.

metadata MUST always be {}.

description must be exactly one concise sentence.

aiReason must be exactly one concise sentence.

Return ONLY the final JSON object.
`;
  }
}

export const roadmapPromptBuilder =
  new RoadmapPromptBuilder();
import {
    AdaptiveRoadmapGenerationInput,
} from "./roadmap.types.js";


class RoadmapAdaptivePromptBuilder {

    build(
        input:
            AdaptiveRoadmapGenerationInput
    ): string {

        return `
You are generating a SHORT corrective roadmap for a user who completed their previous roadmap but failed the interview-readiness evaluation.

Return ONLY valid JSON.
No markdown.
No explanation outside JSON.

------------------------------------------------------------
OBJECTIVE
------------------------------------------------------------

Generate a focused adaptive roadmap that fixes ONLY the weaknesses shown by the readiness evaluation.

This is NOT a new full career roadmap.

The user has already completed a roadmap.

Do not repeat strong areas or recreate previous learning.

Previous mock interview results and readiness scores are EVIDENCE ONLY.

Use them to identify what the user needs to improve.

Do NOT generate mock interviews, assessments, revision tasks,
readiness evaluations, or other lifecycle activities.

Those are handled separately by the application.

------------------------------------------------------------
STRICT SIZE LIMIT
------------------------------------------------------------

Generate 3 to 8 roadmap items.

Prefer the smallest roadmap that can realistically correct the identified weaknesses.

Descriptions:
- exactly one short sentence
- maximum 20 words

aiReason:
- exactly one short sentence
- maximum 20 words

Titles:
- maximum 8 words

metadata:
- always {}

------------------------------------------------------------
ALLOWED TYPES
------------------------------------------------------------

Only use:

TOPIC
PROJECT
PORTFOLIO

Never generate any other type.

Specifically, NEVER generate:

MOCK_INTERVIEW
ASSESSMENT
REVISION
RESUME
JOB_APPLICATION

------------------------------------------------------------
TOPIC RULES
------------------------------------------------------------

TOPIC may only reference skills from CURRENT SKILLS.

For TOPIC:

- skillId is required.
- Copy skillId exactly.
- Copy skillName exactly as title.
- Never rename the skill.
- Never invent a skill.
- Only include skills that genuinely require improvement.

Non-TOPIC items MUST NOT contain skillId.

------------------------------------------------------------
ADAPTATION RULES
------------------------------------------------------------

Use weakAreas as the primary decision signal.

Use Current Skills, Recent Mock Interviews, and Readiness scores
as supporting evidence.

If technical_skills is weak:
- generate focused TOPIC items for weak technical skills.
- only use skills from CURRENT SKILLS.
- do not reteach strong skills.

If technical_interview is weak:
- generate learning or practical work that improves the technical
  knowledge responsible for poor interview performance.
- use TOPIC, PROJECT, or PORTFOLIO as appropriate.
- do NOT generate a mock interview.

If problem_solving is weak:
- generate TOPIC or PROJECT work that strengthens practical
  problem-solving ability.
- do NOT generate an assessment item.

If communication is weak:
- improve communication through PROJECT or PORTFOLIO work where
  the user must explain technical decisions, architecture,
  implementation, or project outcomes clearly.
- do NOT generate a mock interview.

Do not reteach strong skills.

Do not add unrelated technologies.

Do not add generic beginner material.

Do not generate revision items.

Do not generate assessment items.

Do not generate mock interview items.

Do not generate readiness evaluation items.

The application handles revision, assessments, mock interviews,
and readiness evaluation separately.

------------------------------------------------------------
INPUT
------------------------------------------------------------

Target:
${JSON.stringify(input.target)}

Previous Roadmap:
${JSON.stringify(input.previousRoadmap)}

Current Skills:
${JSON.stringify(input.currentSkills)}

Previous Mock Interview Evidence:
${JSON.stringify(input.recentMockInterviews)}

Readiness:
${JSON.stringify(input.readiness)}

------------------------------------------------------------
OUTPUT
------------------------------------------------------------

Return exactly:

{
    "title": "string",
    "roadmapItems": [
        {
            "order": 1,
            "type": "TOPIC",
            "skillId": "existing-skill-id",
            "title": "Exact Current Skill Name",
            "description": "Short corrective learning action.",
            "estimatedHours": 8,
            "aiReason": "Short evidence-based reason.",
            "metadata": {}
        },
        {
            "order": 2,
            "type": "PROJECT",
            "title": "Focused Practical Improvement",
            "description": "Apply weak technical areas through focused practical work.",
            "estimatedHours": 6,
            "aiReason": "Practical implementation reinforces identified weak areas.",
            "metadata": {}
        }
    ]
}

Orders must start at 1 and be sequential.

Every type must be one of:

TOPIC
PROJECT
PORTFOLIO

Do not copy the example blindly.

Generate items according to the actual weaknesses in the supplied input.

Return ONLY JSON.
`;
    }
}


export const roadmapAdaptivePromptBuilder =
    new RoadmapAdaptivePromptBuilder();
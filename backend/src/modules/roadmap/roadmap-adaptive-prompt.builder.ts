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

------------------------------------------------------------
STRICT SIZE LIMIT
------------------------------------------------------------

Generate 5 to 8 roadmap items maximum.

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
REVISION
ASSESSMENT
MOCK_INTERVIEW
RESUME
PORTFOLIO
JOB_APPLICATION

Never generate any other type.

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
- Only include weak skills that genuinely need improvement.

Non-TOPIC items MUST NOT contain skillId.

------------------------------------------------------------
ADAPTATION RULES
------------------------------------------------------------

Use weakAreas as the primary decision signal.

If technical_skills is weak:
- revise only weak-scoring technical skills.

If technical_interview is weak:
- add targeted technical interview preparation.

If problem_solving is weak:
- add assessment/revision focused on interview problem solving.

If communication is weak:
- add mock interview practice emphasizing explanation and structured answers.

Do not reteach strong skills.

Do not add unrelated technologies.

Do not add generic beginner material.

Do not add another readiness evaluation item.
The application handles readiness evaluation separately.

The roadmap should normally end with MOCK_INTERVIEW preparation.

------------------------------------------------------------
INPUT
------------------------------------------------------------

Target:
${JSON.stringify(input.target)}

Previous Roadmap:
${JSON.stringify(input.previousRoadmap)}

Current Skills:
${JSON.stringify(input.currentSkills)}

Recent Mock Interviews:
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
            "description": "Short corrective action.",
            "estimatedHours": 8,
            "aiReason": "Short evidence-based reason.",
            "metadata": {}
        },
        {
            "order": 2,
            "type": "MOCK_INTERVIEW",
            "title": "Targeted Mock Interview",
            "description": "Practice identified interview weaknesses.",
            "estimatedHours": 3,
            "aiReason": "Validates improvement before reevaluation.",
            "metadata": {}
        }
    ]
}

Orders must start at 1 and be sequential.

Return ONLY JSON.
`;
    }
}


export const roadmapAdaptivePromptBuilder =
    new RoadmapAdaptivePromptBuilder();
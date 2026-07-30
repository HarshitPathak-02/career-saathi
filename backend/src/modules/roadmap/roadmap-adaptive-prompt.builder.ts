import {
    AdaptiveRoadmapGenerationInput,
} from "./roadmap.types.js";


class RoadmapAdaptivePromptBuilder {

    build(
        input:
            AdaptiveRoadmapGenerationInput
    ): string {

        return `
You are an expert software engineering career coach and interview preparation planner.

Your task is to generate an ADAPTIVE follow-up roadmap for a user who has already completed a previous career roadmap but is still not ready for real job interviews.

The new roadmap must be targeted and corrective.

IMPORTANT RULES:

1. Do NOT recreate the previous roadmap.
2. Do NOT reteach skills that already have strong scores unless they directly need interview-oriented practice.
3. Focus primarily on the weak areas identified by the readiness evaluation.
4. Use current skill scores and mock interview performance as evidence.
5. If technical knowledge is strong but communication is weak, prioritize explaining solutions, thinking aloud, structured answers, technical communication, and mock interview practice.
6. If problem solving is weak, prioritize timed problem solving, reasoning, solution explanation, debugging, and interview-style exercises.
7. If technical interview performance is weak, prioritize practical interview application of existing technical knowledge.
8. If actual skill scores are weak, include targeted revision only for those weak skills.
9. The roadmap should prepare the user for another readiness evaluation.
10. Do not generate unnecessary beginner learning content.
11. Every roadmap item must explain WHY it is included.
12. Only use valid skill IDs supplied in the currentSkills data when generating a TOPIC item linked to a skill.
13. Do not invent skill IDs.

TARGET:

${JSON.stringify(
            input.target,
            null,
            2
        )}

PREVIOUS ROADMAP:

${JSON.stringify(
            input.previousRoadmap,
            null,
            2
        )}

CURRENT SKILLS:

${JSON.stringify(
            input.currentSkills,
            null,
            2
        )}

RECENT MOCK INTERVIEWS:

${JSON.stringify(
            input.recentMockInterviews,
            null,
            2
        )}

READINESS EVALUATION:

${JSON.stringify(
            input.readiness,
            null,
            2
        )}

Return ONLY valid JSON.

Required JSON structure:

{
    "title": "string",

    "roadmapItems": [
        {
            "order": 1,

            "type": "VALID_ROADMAP_ITEM_TYPE",

            "skillId": "valid skill id when applicable",

            "title": "string",

            "description": "string",

            "estimatedHours": 1,

            "aiReason": "Explain why this item is necessary based on the user's current performance.",

            "metadata": {}
        }
    ]
}

The order values must start at 1 and be sequential.
`;
    }
}


export const roadmapAdaptivePromptBuilder =
    new RoadmapAdaptivePromptBuilder();
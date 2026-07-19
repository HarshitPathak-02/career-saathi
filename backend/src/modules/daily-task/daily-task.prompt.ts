import { RoadmapItemDocument } from "../roadmap/roadmap.schema.js";

interface BuildDailyTaskPromptInput {
    roadmapItems: RoadmapItemDocument[];
    studyHoursPerDay: number;
}

export function buildDailyTaskPrompt(
    input: BuildDailyTaskPromptInput
): string {

    const roadmapItems = input.roadmapItems
        .map(item => ({
            title: item.title,
            description: item.description,
            estimatedHours: item.estimatedHours,
            type: item.type,
        }));

    return `
Generate a 6-day study plan.

The student can study for approximately ${input.studyHoursPerDay} hour(s) per day.

The study plan must completely cover the following roadmap items.

Roadmap Items:

${JSON.stringify(roadmapItems, null, 2)}

Rules:

1. Generate EXACTLY 6 study days.
2. Day numbers must be 1 through 6.
3. Every day must have:
   - dayNumber
   - title
   - description
   - topics (array)
   - estimatedMinutes
4. Topics must be practical and sequential.
5. Distribute the workload evenly.
6. Total work should reasonably complete the supplied roadmap items.
7. estimatedMinutes must be a positive integer.
8. Do NOT generate Day 7.
9. Do NOT include markdown.
10. Return ONLY valid JSON.

Expected JSON format:

[
  {
    "dayNumber": 1,
    "title": "Introduction to Closures",
    "description": "Understand lexical scope and closures.",
    "topics": [
      "Lexical Scope",
      "Execution Context",
      "Closures"
    ],
    "estimatedMinutes": 120
  }
]
`;
}
import {
    MissionRevisionPlan,
} from "../mission/mission.types.js";

import {
    RoadmapItemDocument,
} from "../roadmap/roadmap-item.schema.js";

interface BuildDailyTaskPromptInput {

    roadmapItems:
    RoadmapItemDocument[];

    revisionPlans:
    MissionRevisionPlan[];

    studyHoursPerDay:
    number;

}

export function buildDailyTaskPrompt(
    input: BuildDailyTaskPromptInput
): string {

    const revisionPlans =
        input.revisionPlans.map(
            revision => ({

                skillCatalogId:
                    revision.skillCatalogId.toString(),

                skillName:
                    revision.skillName,

                currentPercentage:
                    revision.percentage,

                revisionTopics:
                    revision.revisionTopics,

            })
        );

    const roadmapItems =
        input.roadmapItems.map(
            item => ({

                id:
                    item._id.toString(),

                title:
                    item.title,

                description:
                    item.description,

                estimatedHours:
                    item.estimatedHours,

                type:
                    item.type,

            })
        );

    return `
Generate a 6-day adaptive study plan.

The student can study for approximately ${input.studyHoursPerDay} hour(s) per day.

The plan may contain:

1. New roadmap learning.
2. Revision work based on weaknesses from the previous week's assessment.
3. A combination of revision and new roadmap learning on the same day.

NEW ROADMAP ITEMS:

${JSON.stringify(roadmapItems, null, 2)}

REVISION REQUIREMENTS FROM THE PREVIOUS WEEK:

${JSON.stringify(revisionPlans, null, 2)}

Rules:

1. Generate EXACTLY 6 study days.

2. Day numbers must be exactly 1 through 6.

3. Every day must contain:
   - dayNumber
   - roadmapItemIds
   - revisionSkillIds
   - title
   - description
   - topics
   - estimatedMinutes

4. roadmapItemIds must always be an array.

5. revisionSkillIds must always be an array.

6. For NEW roadmap learning, roadmapItemIds must contain the IDs of the roadmap items studied on that day.

7. Use ONLY roadmap item IDs supplied in NEW ROADMAP ITEMS.

8. Never invent, modify, or reuse an ID that was not supplied.

9. A roadmap item may appear on multiple days if its workload requires multiple study sessions.

10. A day may contain multiple roadmap item IDs.

11. Every supplied NEW roadmap item must appear in roadmapItemIds on at least one of the 6 days.

12. If REVISION REQUIREMENTS are provided, they MUST be included in the 6-day plan.

13. Give greater revision attention to skills with lower currentPercentage values.

14. Revision topics must come from the supplied revision requirements.

15. A revision-only day MUST use:

   "roadmapItemIds": []

   because revision work does not represent a new roadmap item.

16. A day containing both revision and new roadmap learning should contain only the IDs of the NEW roadmap items in roadmapItemIds.

17. Do NOT attach the ID of an already-completed roadmap item to revision work.

18. Revision should reinforce weak areas while still allowing reasonable progress through new roadmap items.

19. For revision work, revisionSkillIds must contain the skillCatalogId of each revision skill studied on that day.

20. Use ONLY skillCatalogId values supplied in REVISION REQUIREMENTS for revisionSkillIds.

21. Never invent, modify, or reuse a revision skill ID that was not supplied in REVISION REQUIREMENTS.

22. Every supplied revision requirement must have its skillCatalogId included in revisionSkillIds on at least one of the 6 days.

23. A revision skill may appear in revisionSkillIds on multiple days if additional revision is appropriate.

24. If a day contains no revision work, revisionSkillIds MUST be [].

25. If a day contains only revision work, roadmapItemIds MUST be [] and revisionSkillIds MUST contain the relevant revision skill IDs.

26. A day may contain both new roadmap learning and revision work. In that case:
   - roadmapItemIds must contain only the relevant NEW roadmap item IDs.
   - revisionSkillIds must contain only the relevant revision skill IDs.

27. When a skill ID is included in revisionSkillIds, the revision topics studied for that skill must come from that skill's supplied revisionTopics.

28. Topics must be practical and sequential.

29. Distribute the workload reasonably across all 6 days.

30. The estimatedMinutes for each day should reasonably fit within approximately ${input.studyHoursPerDay} hour(s) of study time.

31. estimatedMinutes must be a positive integer.

32. Do NOT generate Day 7.

33. Do NOT include markdown.

34. Keep the response concise.

35. Each day should contain approximately 3 to 5 topics.

36. Each topic should be a short phrase, not a sentence.

37. Keep each description concise, preferably one sentence.

38. Avoid unnecessary explanations in titles, descriptions, and topics.

39. Return ONLY valid JSON.

OUTPUT SIZE RULES:

- Keep the entire response compact.
- Each day must contain exactly 3 topics.
- Each topic must be a short phrase, preferably under 8 words.
- title must be concise, preferably under 10 words.
- description must be exactly one short sentence.
- Do not explain concepts inside topics.
- Do not repeat information from the description in topics.

PLANNING RULE:

- Perform the planning internally, but output only the final compact JSON.
- Do not include reasoning, explanations, alternatives, or commentary.

Example of a NEW roadmap learning day:

[
  {
    "dayNumber": 1,
    "roadmapItemIds": [
      "ROADMAP_ITEM_ID"
    ],
    "revisionSkillIds": [],
    "title": "Learn Express Middleware",
    "description": "Understand middleware execution and build custom middleware.",
    "topics": [
      "Middleware execution",
      "Custom middleware",
      "Error middleware"
    ],
    "estimatedMinutes": 120
  }
]

Example of a REVISION-ONLY day:

[
  {
    "dayNumber": 2,
    "roadmapItemIds": [],
    "revisionSkillIds": [
      "SKILL_CATALOG_ID"
    ],
    "title": "Git Revision",
    "description": "Reinforce weak Git concepts identified in the previous assessment.",
    "topics": [
      "Git Basic Commands",
      "Git Branching Strategies"
    ],
    "estimatedMinutes": 90
  }
]

Example of a MIXED revision and new-learning day:

[
  {
    "dayNumber": 3,
    "roadmapItemIds": [
      "ROADMAP_ITEM_ID"
    ],
    "revisionSkillIds": [
      "SKILL_CATALOG_ID"
    ],
    "title": "Postman Revision and Express API Practice",
    "description": "Reinforce weak Postman concepts while progressing through Express API development.",
    "topics": [
      "Postman Collections and Environments",
      "Express Routing",
      "Testing Express APIs"
    ],
    "estimatedMinutes": 180
  }
]

Return the final result as ONE JSON array containing exactly 6 objects.
`;
}
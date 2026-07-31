import {
  MissionRevisionPlan,
} from "../mission/mission.types.js";

import {
  RoadmapItemDocument,
} from "../roadmap/roadmap-item.model.js";


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

  /*
  |--------------------------------------------------------------------------
  | Roadmap Items
  |--------------------------------------------------------------------------
  */

  const roadmapItems =
    input.roadmapItems.map(
      item => ({

        roadmapItemId:
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


  /*
  |--------------------------------------------------------------------------
  | Revision Plans
  |--------------------------------------------------------------------------
  */

  const revisionPlans =
    input.revisionPlans.map(
      revision => ({

        skillCatalogId:
          revision
            .skillCatalogId
            .toString(),

        skillName:
          revision.skillName,

        currentPercentage:
          revision.percentage,

        revisionTopics:
          revision.revisionTopics,

      })
    );


  /*
  |--------------------------------------------------------------------------
  | Explicit Allowed IDs
  |--------------------------------------------------------------------------
  */

  const allowedRoadmapItemIds =
    roadmapItems.map(
      item =>
        item.roadmapItemId
    );


  const allowedRevisionSkillIds =
    revisionPlans.map(
      revision =>
        revision.skillCatalogId
    );


  /*
  |--------------------------------------------------------------------------
  | Prompt
  |--------------------------------------------------------------------------
  */

  return `
You are generating the 6 study days of a CareerSaathi weekly mission.

Create a practical and sequential study plan using ONLY the roadmap items and revision requirements supplied below.

The student can study approximately ${input.studyHoursPerDay} hour(s) per day.

Return EXACTLY 6 study-day objects.

Do NOT generate Day 7.
Day 7 is created separately by the backend as the weekly review day.


----------------------------------------------------------------------
NEW ROADMAP ITEMS
----------------------------------------------------------------------

${JSON.stringify(
    roadmapItems,
    null,
    2
  )}


----------------------------------------------------------------------
REVISION REQUIREMENTS
----------------------------------------------------------------------

${JSON.stringify(
    revisionPlans,
    null,
    2
  )}


----------------------------------------------------------------------
ALLOWED ROADMAP ITEM IDS
----------------------------------------------------------------------

${JSON.stringify(
    allowedRoadmapItemIds,
    null,
    2
  )}


----------------------------------------------------------------------
ALLOWED REVISION SKILL IDS
----------------------------------------------------------------------

${JSON.stringify(
    allowedRevisionSkillIds,
    null,
    2
  )}


----------------------------------------------------------------------
CRITICAL DATABASE ID RULES
----------------------------------------------------------------------

The values in ALLOWED ROADMAP ITEM IDS and ALLOWED REVISION SKILL IDS are database identifiers.

They are NOT examples.

They are the ONLY IDs that may appear in the output.

For roadmapItemIds:

1. Use ONLY exact string values from ALLOWED ROADMAP ITEM IDS.

2. Copy each ID EXACTLY as supplied.

3. Never invent a roadmap item ID.

4. Never modify a roadmap item ID.

5. Never shorten a roadmap item ID.

6. Never use a roadmap item's order number as its ID.

7. Never use a roadmap item's title as its ID.

8. Never output placeholder values such as:
   - "ROADMAP_ITEM_ID"
   - "ITEM_ID"
   - "roadmapItemId"

9. If a day contains no new roadmap learning, use:

   "roadmapItemIds": []

For revisionSkillIds:

10. Use ONLY exact string values from ALLOWED REVISION SKILL IDS.

11. Copy each skill ID EXACTLY as supplied.

12. Never invent, modify, or shorten a revision skill ID.

13. Never use a skill name as its ID.

14. Never output placeholder values such as:
    - "SKILL_CATALOG_ID"
    - "SKILL_ID"
    - "revisionSkillId"

15. If a day contains no revision work, use:

    "revisionSkillIds": []


----------------------------------------------------------------------
ROADMAP LEARNING RULES
----------------------------------------------------------------------

1. Every supplied NEW roadmap item must appear in roadmapItemIds on at least one of the 6 days.

2. A roadmap item may appear on multiple days when its workload requires multiple study sessions.

3. A day may contain multiple roadmap item IDs.

4. roadmapItemIds must always be an array of strings.

5. For new roadmap learning, include the exact roadmapItemId of every roadmap item studied on that day.

6. Do not attach unrelated roadmap item IDs to a day.

7. Do not attach completed or unavailable roadmap items.

8. Use only the roadmap items supplied in NEW ROADMAP ITEMS.

9. Distribute roadmap learning sequentially and practically across the available study days.

10. Consider each roadmap item's estimatedHours when distributing its work.


----------------------------------------------------------------------
REVISION RULES
----------------------------------------------------------------------

1. If REVISION REQUIREMENTS are provided, every supplied revision requirement must be represented in the 6-day plan.

2. For revision work, revisionSkillIds must contain the exact skillCatalogId of the revision skill studied on that day.

3. Every supplied revision skill must appear in revisionSkillIds on at least one day.

4. A revision skill may appear on multiple days when additional revision is appropriate.

5. Give greater revision attention to skills with lower currentPercentage values.

6. Revision topics must come from the supplied revisionTopics for that skill.

7. Do not invent revision topics unrelated to the supplied revision requirement.

8. Revision work does NOT represent new roadmap progress.

Therefore, a revision-only day must use:

"roadmapItemIds": []

and must contain the relevant IDs in revisionSkillIds.


----------------------------------------------------------------------
MIXED DAY RULES
----------------------------------------------------------------------

A study day may contain both:

- new roadmap learning
- revision work

For a mixed day:

1. roadmapItemIds must contain ONLY exact IDs of the NEW roadmap items studied that day.

2. revisionSkillIds must contain ONLY exact skillCatalogIds of revision skills studied that day.

3. Never put a revision skill ID inside roadmapItemIds.

4. Never put a roadmap item ID inside revisionSkillIds.


----------------------------------------------------------------------
DAY REQUIREMENTS
----------------------------------------------------------------------

Generate EXACTLY 6 objects.

The dayNumber values must be exactly:

1
2
3
4
5
6

Every object must contain exactly these fields:

- dayNumber
- roadmapItemIds
- revisionSkillIds
- title
- description
- topics
- estimatedMinutes

Every day must contain meaningful study work.

Therefore, a day must contain at least one of:

- one or more roadmapItemIds
- one or more revisionSkillIds

Do not create a day where BOTH arrays are empty.

CRITICAL EMPTY-DAY RULE:

A review, practice, recap, reinforcement, preparation, or continuation day
is NOT exempt from the reference requirements.

If a day reviews, practices, reinforces, prepares for, or continues work
related to a supplied roadmap item, include that exact roadmapItemId in
roadmapItemIds.

If a day reviews a supplied revision skill, include that exact
skillCatalogId in revisionSkillIds.

NEVER create generic filler days such as "Review and Revision" with:

"roadmapItemIds": []
"revisionSkillIds": []

If only one roadmap item is supplied and no revision skills are supplied,
that same roadmap item may and SHOULD appear on multiple days when needed
to create a meaningful 6-day schedule.

Before responding, reject your own draft and regenerate it if any day has
both reference arrays empty.  


----------------------------------------------------------------------
CONTENT RULES
----------------------------------------------------------------------

1. Each day must contain exactly 3 topics.

2. Each topic must be a short phrase.

3. Prefer topics under 8 words.

4. Topics should be practical and sequential.

5. title must be concise.

6. Prefer titles under 10 words.

7. description must be exactly one short sentence.

8. Do not repeat the description inside the topics.

9. estimatedMinutes must be a positive integer.

10. estimatedMinutes should reasonably fit within approximately ${input.studyHoursPerDay} hour(s) of study time.

11. Distribute the workload reasonably across all 6 days.

12. Avoid unnecessary explanations.


----------------------------------------------------------------------
OUTPUT FORMAT
----------------------------------------------------------------------

Return ONLY one valid JSON array.

The array must contain EXACTLY 6 objects.

Do not return Markdown.

Do not return a code fence.

Do not return explanations.

Do not return reasoning.

Do not return commentary.

Do not return text before the JSON.

Do not return text after the JSON.

The required structure of every object is:

{
    "dayNumber": number,
    "roadmapItemIds": string[],
    "revisionSkillIds": string[],
    "title": string,
    "description": string,
    "topics": string[],
    "estimatedMinutes": number
}


----------------------------------------------------------------------
FINAL VALIDATION BEFORE RESPONDING
----------------------------------------------------------------------

Before returning the JSON, internally verify all of the following:

1. There are exactly 6 objects.

2. dayNumber values are exactly 1 through 6.

3. Every roadmapItemId is copied EXACTLY from ALLOWED ROADMAP ITEM IDS.

4. Every revisionSkillId is copied EXACTLY from ALLOWED REVISION SKILL IDS.

5. No placeholder IDs exist.

6. No roadmap order numbers are being used as IDs.

7. No invented IDs exist.

8. Every supplied NEW roadmap item appears on at least one day.

9. Every supplied revision requirement appears on at least one day.

10. Every day contains roadmap learning, revision work, or both.

11. Every day contains exactly 3 short topics.

12. Every estimatedMinutes value is a positive integer.

13. The response is valid JSON.

Perform this validation internally.

Return ONLY the final JSON array.
`;

}
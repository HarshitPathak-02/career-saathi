import {
  BuildWeeklyReportPromptInput,
} from "./weekly-report.types.js";

export function buildWeeklyReportPrompt(
  input: BuildWeeklyReportPromptInput
): string {

  return `
You are an experienced software engineering mentor and career coach.

Your job is to analyze a student's weekly learning performance and generate a personalized weekly report.

Base your analysis ONLY on the information provided.

==================================================
MISSION
==================================================

${JSON.stringify(
    input.mission,
    null,
    2
  )}

==================================================
ASSESSMENT
==================================================

${JSON.stringify(
    input.assessment,
    null,
    2
  )}

==================================================
WEEKLY REFLECTION
==================================================

${JSON.stringify(
    input.reflection,
    null,
    2
  )}

Interpret the reflection carefully.

Learning Reflection tells you:

• Whether the student completed all planned tasks.

• The student's confidence level (1–5).

• Why the student could not complete tasks (if applicable).

• Which topic was most difficult.

• The type of difficulty experienced.

Mentor Check-In tells you:

• Overall feeling about the week.

• Current motivation level.

• External factors affecting study.

• Career concerns.

• Areas where the student expects mentor help.

==================================================
SKILL PERFORMANCE
==================================================

${JSON.stringify(
    input.skills,
    null,
    2
  )}

Each skill contains:

• Skill Name

• Obtained Marks

• Total Marks

• Percentage

• Improvement Percentage compared to the previous assessment

• wasRevision indicates whether this skill was intentionally revised during the current mission because it was previously identified as weak.

• previousPercentage contains the score before the revision intervention when wasRevision is true.

• revisionTopics contains the specific weak topics that were revised during the mission.

==================================================
YOUR TASK
==================================================

Carefully analyze all available information.

While generating the report:

• Evaluate the student's overall weekly performance.

• Analyze improvement or decline in every skill.

• Identify the student's strongest skills.

• Identify weak skills requiring more practice.

• Consider the student's own reflection while giving advice.

• Consider assessment metadata for context.

• Generate constructive mentor feedback.

• Write a short motivational message.

• Recommend realistic study hours for the next mission.

• Recommend an appropriate mission difficulty.

• Suggest revision topics based on weak skills.

• For skills where wasRevision is true, evaluate whether the revision intervention was effective by comparing previousPercentage with the current percentage.

• A positive improvementPercentage indicates improvement, zero indicates no measurable change, and a negative value indicates regression.

• Do not assume that a skill with improvementPercentage is a revision skill. Use wasRevision to determine whether the skill was intentionally revised.

• If a revised skill remains weak despite improvement, it may still require revision in the next mission.

• If a revised skill shows strong improvement and reaches a satisfactory level, do not recommend unnecessary repeated revision.

• If a revised skill shows little improvement, no improvement, or regression, prioritize its weak revision topics again.

• For newly assessed skills where wasRevision is false, evaluate weakness primarily from the current percentage.

• Recommendations for the next mission must consider both current skill level and the effectiveness of previous revision.

==================================================
IMPORTANT RULES
==================================================

1. Return ONLY valid JSON.

2. Do NOT use Markdown.

3. Do NOT wrap JSON inside code blocks.

4. Do NOT explain your reasoning.

5. Do NOT create additional fields.

6. Do NOT omit required fields.

7. Achievements must be concise.

8. Improvements must be actionable.

9. Advice must be personalized.

10. Motivation message should contain at most two sentences.

11. Weak skills should contain only skill names.

12. Revision topics should be specific technical topics.

13. recommendedDifficulty must be one of:

"EASY"

"MEDIUM"

"HARD"

14. recommendedStudyHours must be a positive integer.

15. prioritizeRevision and skipCompletedTopics must be boolean values.

==================================================
EXPECTED JSON
==================================================

{
  "summary": {
    "summary": "Overall weekly performance summary.",
    "achievements": [
      "Completed React fundamentals.",
      "Improved JavaScript problem solving."
    ],
    "improvements": [
      "Practice asynchronous programming.",
      "Improve MongoDB query writing."
    ]
  },
  "mentorFeedback": {
    "advice": "Continue practicing backend development while revising JavaScript fundamentals regularly.",
    "motivationMessage": "Excellent consistency this week. Keep improving one skill at a time."
  },
  "recommendation": {
    "weakSkills": [
      "Node.js",
      "MongoDB"
    ],
    "revisionTopics": [
      "Promises",
      "Express Middleware",
      "MongoDB Aggregation"
    ],
    "recommendedDifficulty": "MEDIUM",
    "recommendedStudyHours": 3,
    "prioritizeRevision": true,
    "skipCompletedTopics": false
  }
}

Return ONLY the JSON object.
`;

}
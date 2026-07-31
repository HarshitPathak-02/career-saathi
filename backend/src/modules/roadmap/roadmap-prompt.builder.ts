import {
  RoadmapGenerationInput,
} from "./roadmap.types.js";


class RoadmapPromptBuilder {

  build(
    input:
      RoadmapGenerationInput
  ): string {

    /*
    |--------------------------------------------------------------------------
    | Compact AI Input
    |--------------------------------------------------------------------------
    |
    | Keep only information required for roadmap generation.
    | Hard structural validation is handled by AIValidator.
    |
    */

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

The roadmap is ONLY responsible for:

- learning technical skills
- building practical projects
- improving the technical portfolio

Other CareerSaathi workflows handle revision, assessments, mock interviews, resume work, readiness evaluation, and job applications.

Return ONLY valid JSON.
Do not use markdown or explanations.


------------------------------------------------------------
STUDENT
------------------------------------------------------------

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

${JSON.stringify(
      currentSkills
    )}


Required Skills:

${JSON.stringify(
      requiredSkills
    )}


Available Skill Catalog:

${JSON.stringify(
      availableSkills
    )}


------------------------------------------------------------
ROADMAP RULES
------------------------------------------------------------

Allowed item types:

TOPIC
PROJECT
PORTFOLIO

Never generate any other type.

Return one flat ordered roadmap.

Orders must:

- start at 1
- be sequential
- contain no duplicates

Generate only meaningful milestones required to bridge the student's current skills and target-role requirements.

Use target duration and daily study hours to keep the roadmap realistically scoped.

Do not generate weeks, phases, sections, missions, daily tasks, revision, assessments, mock interviews, resume tasks, readiness checks, or job applications.


------------------------------------------------------------
TOPIC RULES
------------------------------------------------------------

TOPIC represents exactly ONE technical skill.

Every TOPIC must:

- use a skill from Available Skill Catalog
- copy its skillId exactly
- copy its title exactly
- contain skillId

Never:

- invent a technical skill
- rename a catalog skill
- combine multiple skills into one TOPIC

Prioritize missing Required Skills.

Do not unnecessarily reteach Current Skills.

Current Skills may be treated as prerequisite knowledge.

Use catalog difficulty and category to create a logical learning order.


------------------------------------------------------------
PROJECT RULES
------------------------------------------------------------

PROJECT represents one practical implementation milestone.

A project may use only:

- Current Skills
- TOPIC skills appearing earlier in this roadmap

Never make a project depend on a new technical skill that has not been introduced.

Projects should:

- be relevant to the target role
- appear after sufficient prerequisite knowledge
- apply previously learned or existing skills
- represent one coherent practical outcome

PROJECT must not contain skillId.


------------------------------------------------------------
PORTFOLIO RULES
------------------------------------------------------------

PORTFOLIO represents professional presentation of completed technical work.

It may include:

- project documentation
- README improvement
- architecture documentation
- technical decision documentation
- professional project presentation

Generate PORTFOLIO only after meaningful project work exists.

PORTFOLIO must not contain skillId.


------------------------------------------------------------
ESTIMATED HOURS
------------------------------------------------------------

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


------------------------------------------------------------
OUTPUT
------------------------------------------------------------

Return exactly this structure:

{
    "version": 1,
    "title": "Roadmap title",
    "roadmapItems": [
        {
            "order": 1,
            "type": "TOPIC",
            "skillId": "exact-catalog-skill-id",
            "title": "Exact Catalog Title",
            "description": "One concise sentence.",
            "estimatedHours": 12,
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
        }
    ]
}


------------------------------------------------------------
FINAL REQUIREMENTS
------------------------------------------------------------

Every roadmap item must contain:

- order
- type
- title
- description
- estimatedHours
- aiReason
- metadata

Additionally, TOPIC must contain skillId.

PROJECT and PORTFOLIO must never contain skillId.

metadata must always be {}.

description must be one concise sentence.

aiReason must be one concise sentence.

estimatedHours must be positive.

Use only TOPIC, PROJECT, or PORTFOLIO.

Return ONLY the final JSON object.
`;

  }

}


export const roadmapPromptBuilder =
  new RoadmapPromptBuilder();
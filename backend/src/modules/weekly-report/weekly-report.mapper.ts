import {
    MissionDocument,
} from "../mission/mission.schema.js";

import {
    AssessmentDocument,
} from "../assessment/assessment.schema.js";

import {
    WeeklyReflectionDocument,
} from "../weekly-reflection/weekly-reflection.schema.js";

import {
    SkillProgressDocument,
} from "../skill-progress/skill-progress.schema.js";

import {
    BuildWeeklyReportPromptInput,
    PopulatedSkillProgressDocument,
} from "./weekly-report.types.js";

export class WeeklyReportMapper {

    static toPromptInput(
        mission: MissionDocument,
        assessment: AssessmentDocument,
        reflection: WeeklyReflectionDocument,
        skillProgress: PopulatedSkillProgressDocument[],
        roadmapItems: string[],
    ): BuildWeeklyReportPromptInput {

        return {

            mission: {

                missionNumber:
                    mission.missionNumber,

                roadmapItems,

            },

            assessment: {

                title:
                    assessment.title,

                type:
                    assessment.type,

                weekNumber:
                    assessment.weekNumber,

            },

            reflection: {

                learningReflection: {

                    completedAllTasks:
                        reflection.learningReflection.completedAllTasks,

                    reason:
                        reflection.learningReflection.reason,

                    difficultyType:
                        reflection.learningReflection.difficultyType,

                    confidenceRating:
                        reflection.learningReflection.confidenceRating,

                },

                mentorCheckIn: {

                    overallWeek:
                        reflection.mentorCheckIn.overallWeek,

                    motivationLevel:
                        reflection.mentorCheckIn.motivationLevel,

                    externalFactors:
                        reflection.mentorCheckIn.externalFactors,

                    careerConcern:
                        reflection.mentorCheckIn.careerConcern,

                    helpNeeded:
                        reflection.mentorCheckIn.helpNeeded,

                },

                additionalComments:
                    reflection.additionalComments,

            },

            skills:
                skillProgress.map(
                    (progress) => ({

                        skillName:
                            progress.userSkillId.skillCatalogId.name,

                        obtainedMarks:
                            progress.obtainedMarks,

                        totalMarks:
                            progress.totalMarks,

                        percentage:
                            progress.percentage,

                        improvementPercentage:
                            progress.improvementPercentage,

                    })
                ),

        };

    }

}
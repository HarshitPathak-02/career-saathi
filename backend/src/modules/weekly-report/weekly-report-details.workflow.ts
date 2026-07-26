import {
    Types,
} from "mongoose";

import {
    AppError,
} from "../../core/errors/app-error.js";

import {
    weeklyReportService,
} from "./weekly-report.service.js";

import {
    assessmentService,
} from "../assessment/assessment.service.js";

import {
    skillProgressService,
} from "../skill-progress/skill-progress.service.js";

import {
    weeklyReflectionService,
} from "../weekly-reflection/weekly-reflection.service.js";

import type {
    WeeklyReportDetailsDTO,
} from "./weekly-report-details.types.js";

class WeeklyReportDetailsWorkflow {

    async getWeeklyReportDetails(
        reportId: string,
    ): Promise<WeeklyReportDetailsDTO> {

        /*
        |--------------------------------------------------------------------------
        | Validate Report ID
        |--------------------------------------------------------------------------
        */

        if (
            !Types.ObjectId.isValid(
                reportId,
            )
        ) {

            throw new AppError(
                400,
                "Invalid weekly report id.",
            );

        }

        /*
        |--------------------------------------------------------------------------
        | Weekly Report
        |--------------------------------------------------------------------------
        */

        const report =
            await weeklyReportService
                .getWeeklyReportById(
                    new Types.ObjectId(
                        reportId,
                    ),
                );

        /*
        |--------------------------------------------------------------------------
        | Related Data
        |--------------------------------------------------------------------------
        */

        const [
            assessment,
            reflection,
            skillProgress,
        ] =
            await Promise.all([

                assessmentService
                    .getAssessmentById(
                        report.assessmentId
                            .toString(),
                    ),

                weeklyReflectionService
                    .getReflectionById(
                        report.reflectionId,
                    ),

                skillProgressService
                    .getAssessmentProgress(
                        report.assessmentId,
                    ),

            ]);

        /*
        |--------------------------------------------------------------------------
        | Relationship Validation
        |--------------------------------------------------------------------------
        */

        if (
            assessment.careerJourneyId
                .toString() !==
            report.careerJourneyId
                .toString()
        ) {

            throw new AppError(
                409,
                "Assessment does not belong to this weekly report.",
            );

        }

        if (
            reflection.assessmentId
                .toString() !==
            report.assessmentId
                .toString()
        ) {

            throw new AppError(
                409,
                "Reflection does not belong to this weekly report.",
            );

        }

        /*
        |--------------------------------------------------------------------------
        | Skill Results
        |--------------------------------------------------------------------------
        */

        const skills =
            skillProgress.map(
                progress => {

                    const userSkill =
                        progress.userSkillId;

                    const skillCatalog =
                        userSkill.skillCatalogId;

                    return {

                        userSkillId:
                            userSkill._id
                                .toString(),

                        skillCatalogId:
                            skillCatalog._id
                                .toString(),

                        skillName:
                            skillCatalog.name,

                        obtainedMarks:
                            progress.obtainedMarks,

                        totalMarks:
                            progress.totalMarks,

                        percentage:
                            progress.percentage,

                        improvementPercentage:
                            progress.improvementPercentage ??
                            null,

                    };

                },
            );

        /*
        |--------------------------------------------------------------------------
        | Response
        |--------------------------------------------------------------------------
        */

        return {

            id:
                report._id.toString(),

            careerJourneyId:
                report.careerJourneyId
                    .toString(),

            missionId:
                report.missionId
                    .toString(),

            generatedAt:
                report.generatedAt,

            status:
                report.status,

            summary: {

                summary:
                    report.summary.summary,

                achievements:
                    report.summary.achievements,

                improvements:
                    report.summary.improvements,

            },

            mentorFeedback: {

                advice:
                    report.mentorFeedback.advice,

                motivationMessage:
                    report.mentorFeedback
                        .motivationMessage,

            },

            recommendation: {

                weakSkills:
                    report.recommendation
                        .weakSkills,

                revisionTopics:
                    report.recommendation
                        .revisionTopics,

                recommendedDifficulty:
                    report.recommendation
                        .recommendedDifficulty,

                recommendedStudyHours:
                    report.recommendation
                        .recommendedStudyHours,

                prioritizeRevision:
                    report.recommendation
                        .prioritizeRevision,

                skipCompletedTopics:
                    report.recommendation
                        .skipCompletedTopics,

            },

            assessment: {

                id:
                    assessment._id
                        .toString(),

                title:
                    assessment.title,

                type:
                    assessment.type,

                weekNumber:
                    assessment.weekNumber,

                status:
                    assessment.status,

                completedAt:
                    assessment.completedAt ??
                    null,

            },

            reflection: {

                weekNumber:
                    reflection.weekNumber,

                learningReflection: {

                    completedAllTasks:
                        reflection
                            .learningReflection
                            .completedAllTasks,

                    reason:
                        reflection
                            .learningReflection
                            .reason ??
                        null,

                    difficultyType:
                        reflection
                            .learningReflection
                            .difficultyType ??
                        null,

                    confidenceRating:
                        reflection
                            .learningReflection
                            .confidenceRating,

                },

                mentorCheckIn: {

                    overallWeek:
                        reflection
                            .mentorCheckIn
                            .overallWeek,

                    motivationLevel:
                        reflection
                            .mentorCheckIn
                            .motivationLevel,

                    externalFactors:
                        reflection
                            .mentorCheckIn
                            .externalFactors ??
                        null,

                    careerConcern:
                        reflection
                            .mentorCheckIn
                            .careerConcern ??
                        null,

                    helpNeeded:
                        reflection
                            .mentorCheckIn
                            .helpNeeded ??
                        null,

                },

                additionalComments:
                    reflection
                        .additionalComments ??
                    null,

            },

            skills,

        };

    }

}

export const weeklyReportDetailsWorkflow =
    new WeeklyReportDetailsWorkflow();
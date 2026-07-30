import {
    WeeklyReportDocument,
} from "./weekly-report.model.js";

export class WeeklyReportResponseMapper {

    /*
    |--------------------------------------------------------------------------
    | Weekly Report
    |--------------------------------------------------------------------------
    */

    static toWeeklyReport(
        weeklyReport: WeeklyReportDocument
    ) {

        return {

            id:
                weeklyReport.id,

            careerJourneyId:
                weeklyReport.careerJourneyId,

            missionId:
                weeklyReport.missionId,

            assessmentId:
                weeklyReport.assessmentId,

            reflectionId:
                weeklyReport.reflectionId,

            summary:
                weeklyReport.summary,

            mentorFeedback:
                weeklyReport.mentorFeedback,

            recommendation:
                weeklyReport.recommendation,

            status:
                weeklyReport.status,

            promptVersion:
                weeklyReport.promptVersion,

            generatedAt:
                weeklyReport.generatedAt,

            createdAt:
                weeklyReport.createdAt,

            updatedAt:
                weeklyReport.updatedAt,

        };

    }

    /*
    |--------------------------------------------------------------------------
    | Weekly Reports
    |--------------------------------------------------------------------------
    */

    static toWeeklyReports(
        weeklyReports: WeeklyReportDocument[]
    ) {

        return weeklyReports.map(
            weeklyReport =>
                this.toWeeklyReport(
                    weeklyReport
                )
        );

    }

}

export const weeklyReportResponseMapper =
    WeeklyReportResponseMapper;
import {
    WeeklyReportDocument,
} from "./weekly-report.schema.js";

export class WeeklyReportResponseMapper {

    static toGenerateWeeklyReportResponse(
        weeklyReport: WeeklyReportDocument
    ) {

        return {

            success: true,

            message:
                "Weekly report generated successfully.",

            data:
                this.toWeeklyReport(
                    weeklyReport
                ),

        };

    }

    static toWeeklyReportResponse(
        weeklyReport: WeeklyReportDocument
    ) {

        return {

            success: true,

            data:
                this.toWeeklyReport(
                    weeklyReport
                ),

        };

    }

    static toWeeklyReportsResponse(
        weeklyReports: WeeklyReportDocument[]
    ) {

        return {

            success: true,

            data:
                weeklyReports.map(
                    (weeklyReport) =>
                        this.toWeeklyReport(
                            weeklyReport
                        )
                ),

        };

    }

    private static toWeeklyReport(
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

}

export const weeklyReportResponseMapper =
    WeeklyReportResponseMapper;
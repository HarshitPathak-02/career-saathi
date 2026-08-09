import {
    ClientSession,
    Types,
} from "mongoose";

import {
    AppError,
} from "../../core/errors/app-error.js";

import {
    HTTP_STATUS,
} from "../../core/constants/http-status.constants.js";

import {
    careerJourneyRepository,
} from "../career-journey/index.js";

import {
    monthlyReportRepository,
} from "./monthly-report.repository.js";

import {
    monthlyReportWorkflowService,
} from "./monthly-report-workflow.service.js";

import {
    MonthlyReportDueResult,
} from "./monthly-report.types.js";


class MonthlyReportService {

    /*
    |--------------------------------------------------------------------------
    | Get Monthly Report Due Status
    |--------------------------------------------------------------------------
    */

    async getDueStatus(
        userId:
            string,

        careerJourneyId:
            Types.ObjectId,

        session?:
            ClientSession
    ): Promise<MonthlyReportDueResult> {

        const userObjectId =
            new Types.ObjectId(
                userId
            );

        /*
         * Verify Career Journey Ownership
         */

        const careerJourney =
            await careerJourneyRepository
                .findByIdAndUserId(
                    careerJourneyId,
                    userObjectId,
                    session
                );


        if (!careerJourney) {

            throw new AppError(
                HTTP_STATUS.NOT_FOUND,
                "Career journey not found."
            );
        }


        /*
         * Determine Due Status
         */

        return monthlyReportWorkflowService
            .getMonthlyReportDueStatus(
                careerJourneyId
            );
    }


    /*
    |--------------------------------------------------------------------------
    | Get Latest Monthly Report
    |--------------------------------------------------------------------------
    */

    async getLatestMonthlyReport(
        userId:
            string,

        careerJourneyId:
            Types.ObjectId,

        session?:
            ClientSession
    ) {

        const userObjectId =
            new Types.ObjectId(
                userId
            );


        /*
         * Verify Career Journey Ownership
         */

        const careerJourney =
            await careerJourneyRepository
                .findByIdAndUserId(
                    careerJourneyId,
                    userObjectId,
                    session
                );


        if (!careerJourney) {

            throw new AppError(
                HTTP_STATUS.NOT_FOUND,
                "Career journey not found."
            );
        }


        /*
         * Latest Monthly Report
         */

        const monthlyReport =
            await monthlyReportRepository
                .findLatestByCareerJourney(
                    careerJourneyId,
                    session
                );


        if (!monthlyReport) {

            throw new AppError(
                HTTP_STATUS.NOT_FOUND,
                "Monthly report not found."
            );
        }


        return monthlyReport;
    }


    /*
    |--------------------------------------------------------------------------
    | Get Monthly Report History
    |--------------------------------------------------------------------------
    */

    async getMonthlyReportHistory(
        userId:
            string,

        careerJourneyId:
            Types.ObjectId,

        session?:
            ClientSession
    ) {

        const userObjectId =
            new Types.ObjectId(
                userId
            );


        /*
         * Verify Career Journey Ownership
         */

        const careerJourney =
            await careerJourneyRepository
                .findByIdAndUserId(
                    careerJourneyId,
                    userObjectId,
                    session
                );


        if (!careerJourney) {

            throw new AppError(
                HTTP_STATUS.NOT_FOUND,
                "Career journey not found."
            );
        }


        /*
         * Monthly Report History
         */

        return monthlyReportRepository
            .findByCareerJourney(
                careerJourneyId,
                session
            );
    }

    /*
|--------------------------------------------------------------------------
| Get Monthly Report By Report Number
|--------------------------------------------------------------------------
*/

    async getMonthlyReportByNumber(
        userId:
            string,

        careerJourneyId:
            Types.ObjectId,

        reportNumber:
            number,

        session?:
            ClientSession
    ) {

        const userObjectId =
            new Types.ObjectId(
                userId
            );


        /*
         * Validate Report Number
         */

        if (
            !Number.isInteger(
                reportNumber
            ) ||
            reportNumber < 1
        ) {

            throw new AppError(
                HTTP_STATUS.BAD_REQUEST,
                "Invalid monthly report number."
            );
        }


        /*
         * Verify Career Journey Ownership
         */

        const careerJourney =
            await careerJourneyRepository
                .findByIdAndUserId(
                    careerJourneyId,
                    userObjectId,
                    session
                );


        if (!careerJourney) {

            throw new AppError(
                HTTP_STATUS.NOT_FOUND,
                "Career journey not found."
            );
        }


        /*
         * Find Monthly Report
         */

        const monthlyReport =
            await monthlyReportRepository
                .findByCareerJourneyAndReportNumber(
                    careerJourneyId,
                    reportNumber,
                    session
                );


        if (!monthlyReport) {

            throw new AppError(
                HTTP_STATUS.NOT_FOUND,
                "Monthly report not found."
            );
        }


        return monthlyReport;
    }
}


export const monthlyReportService =
    new MonthlyReportService();
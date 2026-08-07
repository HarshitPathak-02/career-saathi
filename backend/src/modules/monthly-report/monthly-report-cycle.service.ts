import {
    ClientSession,
    Types,
} from "mongoose";

import {
    MONTHLY_REPORT_CYCLE_DAYS,
} from "./monthly-report.constants.js";

import {
    MonthlyReportDueResult,
    MonthlyReportPeriod,
} from "./monthly-report.types.js";

import {
    monthlyReportRepository,
} from "./monthly-report.repository.js";

import {
    missionRepository,
} from "../mission/mission.repository.js";

import {
    addDays,
    differenceInCalendarDays,
    endOfDay,
    startOfDay,
} from "../../shared/utils/date.util.js";
import { appClock } from "../../shared/time/app-clock.js";
import { AppError } from "../../core/errors/app-error.js";
import { HTTP_STATUS } from "../../core/constants/http-status.constants.js";


class MonthlyReportCycleService {

    /*
    |--------------------------------------------------------------------------
    | Get Reporting Anchor
    |--------------------------------------------------------------------------
    */

    async getReportingAnchor(
        careerJourneyId:
            Types.ObjectId,

        session?:
            ClientSession
    ): Promise<Date | null> {

        const firstMission =
            await missionRepository
                .findFirstMission(
                    careerJourneyId,
                    session
                );

        if (!firstMission) {
            return null;
        }

        return startOfDay(
            firstMission.startDate
        );
    }


    /*
    |--------------------------------------------------------------------------
    | Calculate Report Period
    |--------------------------------------------------------------------------
    */

    calculateReportPeriod(
        anchorDate:
            Date,

        reportNumber:
            number
    ): MonthlyReportPeriod {

        if (
            reportNumber < 1
        ) {
            throw new AppError(HTTP_STATUS.BAD_REQUEST, "Report number must be at least 1.");
        }

        /*
         * Report #1:
         *
         * start = anchor
         *
         * Report #2:
         *
         * start = anchor + 28 days
         */

        const offsetDays =
            (
                reportNumber - 1
            ) *
            MONTHLY_REPORT_CYCLE_DAYS;


        const periodStart =
            startOfDay(
                addDays(
                    anchorDate,
                    offsetDays
                )
            );


        /*
         * Inclusive 28-day period.
         *
         * Aug 1 + 27 days
         * = Aug 28
         */

        const periodEnd =
            endOfDay(
                addDays(
                    periodStart,
                    MONTHLY_REPORT_CYCLE_DAYS - 1
                )
            );


        return {

            reportNumber,

            periodStart,

            periodEnd,
        };
    }


    /*
    |--------------------------------------------------------------------------
    | Calculate Current Completed Cycle Count
    |--------------------------------------------------------------------------
    */

    calculateCompletedCycleCount(
        anchorDate:
            Date,
        currentDate:
            Date = appClock.now()
    ): number {

        const elapsedDays =
            differenceInCalendarDays(
                currentDate,
                anchorDate
            );

        if (
            elapsedDays < 0
        ) {
            return 0;
        }


        /*
         * Day 0 = first learning day.
         *
         * Therefore:
         *
         * elapsedDays 0  -> day 1
         * elapsedDays 27 -> day 28
         */

        const inclusiveDays =
            elapsedDays + 1;


        return Math.floor(
            inclusiveDays /
            MONTHLY_REPORT_CYCLE_DAYS
        );
    }

    /*
    |--------------------------------------------------------------------------
    | Check Monthly Report Due
    |--------------------------------------------------------------------------
    */

    async getDueReport(
        careerJourneyId:
            Types.ObjectId,

        currentDate:
            Date = appClock.now(),

        session?:
            ClientSession
    ): Promise<
        MonthlyReportDueResult
    > {

        /*
         * Reporting Anchor
         */

        const anchorDate =
            await this
                .getReportingAnchor(
                    careerJourneyId,
                    session
                );


        /*
         * No Mission Yet
         */

        if (!anchorDate) {

            return {
                due: false,

                reportNumber:
                    null,

                periodStart:
                    null,

                periodEnd:
                    null,
            };
        }


        /*
         * Number Of Reporting Cycles
         * That Have Reached Day 28
         */

        const completedCycleCount =
            this
                .calculateCompletedCycleCount(
                    anchorDate,
                    currentDate
                );


        if (
            completedCycleCount === 0
        ) {

            return {
                due: false,

                reportNumber:
                    null,

                periodStart:
                    null,

                periodEnd:
                    null,
            };
        }


        /*
         * Find Latest Generated Report
         */

        const latestReport =
            await monthlyReportRepository
                .findLatestByCareerJourney(
                    careerJourneyId,
                    session
                );


        const nextReportNumber =
            latestReport
                ? latestReport
                    .reportNumber + 1
                : 1;


        /*
         * User Has Generated Every
         * Report Currently Due
         */

        if (
            nextReportNumber >
            completedCycleCount
        ) {

            return {
                due: false,

                reportNumber:
                    null,

                periodStart:
                    null,

                periodEnd:
                    null,
            };
        }


        /*
         * Determine Oldest Missing
         * Reporting Period
         */

        const period =
            this
                .calculateReportPeriod(
                    anchorDate,
                    nextReportNumber
                );


        return {

            due: true,

            reportNumber:
                period.reportNumber,

            periodStart:
                period.periodStart,

            periodEnd:
                period.periodEnd,
        };
    }
}


export const monthlyReportCycleService =
    new MonthlyReportCycleService();
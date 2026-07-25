import {
    MissionStatus,
} from "../types/mission.types";

/*
|--------------------------------------------------------------------------
| Format Date
|--------------------------------------------------------------------------
*/

export const formatMissionDate = (
    date: string,
): string => {

    return new Date(date).toLocaleDateString(
        "en-IN",
        {
            day: "numeric",
            month: "short",
        },
    );

};

/*
|--------------------------------------------------------------------------
| Format Date Range
|--------------------------------------------------------------------------
*/

export const formatMissionDateRange = (
    startDate: string,
    endDate: string,
): string => {

    return `${formatMissionDate(startDate)} - ${formatMissionDate(endDate)}`;

};

/*
|--------------------------------------------------------------------------
| Mission Status Color
|--------------------------------------------------------------------------
*/

export const getMissionStatusClasses = (
    status: MissionStatus,
): string => {

    switch (status) {

        case MissionStatus.ACTIVE:
            return "bg-blue-100 text-blue-700";

        case MissionStatus.COMPLETED:
            return "bg-green-100 text-green-700";

        case MissionStatus.SKIPPED:
            return "bg-gray-200 text-gray-700";

        default:
            return "bg-gray-100 text-gray-700";

    }

};
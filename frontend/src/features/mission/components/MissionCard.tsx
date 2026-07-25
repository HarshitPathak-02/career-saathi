import {
    ChevronRight,
} from "lucide-react";

import
Progress from "../../../components/ui/Progress/Progress";

import type {
    MissionSummary,
} from "../types/mission.types";

import {
    formatMissionDateRange,
    getMissionStatusClasses,
} from "../utils/mission.utils";

interface MissionCardProps {

    mission: MissionSummary;

    onClick?: () => void;

}

export default function MissionCard({

    mission,

    onClick,

}: MissionCardProps) {

    return (

        <button
            onClick={onClick}
            className="
                w-full
                rounded-xl
                border
                bg-white
                p-5
                text-left
                transition-all
                hover:shadow-md
            "
        >

            <div className="flex items-center justify-between">

                <h3 className="text-lg font-semibold">

                    Mission #{mission.missionNumber}

                </h3>

                <span
                    className={`
                        rounded-full
                        px-3
                        py-1
                        text-xs
                        font-semibold
                        ${getMissionStatusClasses(
                        mission.status,
                    )}
                    `}
                >

                    {mission.status}

                </span>

            </div>

            <p className="mt-2 text-sm text-gray-500">

                {formatMissionDateRange(
                    mission.startDate,
                    mission.endDate,
                )}

            </p>

            <Progress
                value={mission.progressPercentage}
                className="mt-5"
            />

            <div className="mt-3 flex items-center justify-between">

                <span className="text-sm text-gray-600">

                    {mission.completedDays}
                    {" / "}
                    {mission.totalDays}
                    {" Days Completed"}

                </span>

                <div className="flex items-center gap-1 text-sm font-medium text-blue-600">

                    View

                    <ChevronRight
                        size={16}
                    />

                </div>

            </div>

        </button>

    );

}
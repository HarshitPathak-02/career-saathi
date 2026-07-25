import Progress from "../../../components/ui/Progress/Progress";

import type {
    MissionDetails,
} from "../types/mission.types";

import {
    formatMissionDateRange,
    getMissionStatusClasses,
} from "../utils/mission.utils";

interface MissionHeaderProps {

    mission: MissionDetails;

}

export default function MissionHeader({

    mission,

}: MissionHeaderProps) {

    return (

        <div className="rounded-xl border bg-white p-6">

            <div className="flex items-center justify-between">

                <h1 className="text-2xl font-bold">

                    Mission #{mission.missionNumber}

                </h1>

                <span
                    className={`
                        rounded-full
                        px-3
                        py-1
                        text-sm
                        font-semibold
                        ${getMissionStatusClasses(
                        mission.status,
                    )}
                    `}
                >

                    {mission.status}

                </span>

            </div>

            <p className="mt-2 text-slate-500">

                {formatMissionDateRange(
                    mission.startDate,
                    mission.endDate,
                )}

            </p>

            <Progress
                value={mission.progressPercentage}
                className="mt-6"
            />

            <p className="mt-3 text-sm text-slate-600">

                {mission.completedDays}
                {" / "}
                {mission.totalDays}
                {" Days Completed"}

            </p>

        </div>

    );

}
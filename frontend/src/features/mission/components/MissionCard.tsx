import {
    CalendarDays,
    ChevronRight,
    CircleCheckBig,
} from "lucide-react";

import Progress from "../../../components/ui/Progress/Progress";

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

const MissionCard = ({

    mission,

    onClick,

}: MissionCardProps) => {

    return (
        <button
            type="button"
            onClick={onClick}
            className="
                group
                w-full
                rounded-2xl
                border
                border-slate-200
                bg-white
                p-5
                text-left
                shadow-sm
                transition
                hover:border-blue-200
                hover:shadow-md
                sm:p-6
            "
        >

            <div
                className="
                    flex
                    flex-col
                    gap-4
                    sm:flex-row
                    sm:items-start
                    sm:justify-between
                "
            >

                <div>

                    <p
                        className="
                            text-xs
                            font-semibold
                            uppercase
                            tracking-[0.12em]
                            text-blue-600
                        "
                    >
                        Weekly Mission
                    </p>

                    <h3
                        className="
                            mt-1
                            text-xl
                            font-bold
                            text-slate-900
                        "
                    >
                        Mission {mission.missionNumber}
                    </h3>

                    <div
                        className="
                            mt-2
                            flex
                            items-center
                            gap-2
                            text-sm
                            text-slate-500
                        "
                    >
                        <CalendarDays size={16} />

                        {formatMissionDateRange(
                            mission.startDate,
                            mission.endDate,
                        )}
                    </div>

                </div>

                <span
                    className={`
                        w-fit
                        rounded-full
                        px-3
                        py-1.5
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

            <div className="mt-6">

                <div
                    className="
                        mb-2
                        flex
                        items-center
                        justify-between
                        gap-4
                    "
                >
                    <span
                        className="
                            text-sm
                            font-medium
                            text-slate-600
                        "
                    >
                        Mission progress
                    </span>

                    <span
                        className="
                            text-sm
                            font-semibold
                            text-slate-900
                        "
                    >
                        {mission.progressPercentage}%
                    </span>
                </div>

                <Progress
                    value={
                        mission.progressPercentage
                    }
                />

            </div>

            <div
                className="
                    mt-5
                    flex
                    flex-col
                    gap-4
                    border-t
                    border-slate-100
                    pt-4
                    sm:flex-row
                    sm:items-center
                    sm:justify-between
                "
            >

                <div
                    className="
                        flex
                        items-center
                        gap-2
                        text-sm
                        text-slate-600
                    "
                >
                    <CircleCheckBig
                        size={17}
                        className="text-slate-400"
                    />

                    <span>
                        <strong className="font-semibold text-slate-900">
                            {mission.completedDays}
                        </strong>

                        {" / "}

                        {mission.totalDays}

                        {" days completed"}
                    </span>
                </div>

                <div
                    className="
                        flex
                        items-center
                        gap-1
                        text-sm
                        font-semibold
                        text-blue-600
                        transition
                        group-hover:gap-2
                    "
                >
                    View Mission

                    <ChevronRight size={17} />
                </div>

            </div>

        </button>
    );
};

export default MissionCard;